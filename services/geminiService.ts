import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisResult, CompetitiveAnalysis, DetailedScorecardResult, GroundingChunk, IdeasResult, KeywordsResult, LocalRankingResult, RadiusAnalysisResult, ResponsesResult, SeoActionsResult, UserLocation, ScorecardMetric } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = <T>(jsonText: string, context: string): T => {
  let cleanedText = jsonText.trim();
  if (cleanedText.startsWith('```json')) {
    cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
  } else if (cleanedText.startsWith('```')) {
    cleanedText = cleanedText.substring(3, cleanedText.length - 3).trim();
  }

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error(`Failed to parse Gemini JSON response for ${context}:`, cleanedText);
    throw new Error(`A resposta da IA para ${context} não estava no formato JSON esperado.`);
  }
};

export async function fetchBusinessInfo(
  businessName: string,
  userLocation: UserLocation | null
): Promise<{ businessData: string; groundingChunks: GroundingChunk[] }> {
  const model = 'gemini-2.5-flash';
  
  const toolConfig = userLocation 
    ? {
        retrievalConfig: {
          latLng: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
        },
      }
    : undefined;

  const response = await ai.models.generateContent({
    model,
    contents: `Forneça um resumo detalhado do perfil da empresa "${businessName}" no Google Maps. Inclua o nome, endereço, categoria, horário de funcionamento, resumo das avaliações recentes (positivas e negativas), se há postagens recentes, se tem fotos 360, e um resumo geral das informações disponíveis.`,
    config: {
      tools: [{ googleMaps: {} }],
      ...(toolConfig && { toolConfig }),
    },
  });

  const businessData = response.text;
  const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) ?? [];

  if (!businessData) {
    throw new Error('Não foi possível encontrar informações para esta empresa.');
  }

  return { businessData, groundingChunks };
}

export async function getImprovementSuggestions(businessData: string): Promise<AnalysisResult> {
  const model = 'gemini-2.5-pro';
  
  const response = await ai.models.generateContent({
    model,
    contents: `Analise as seguintes informações do perfil de uma empresa no Google Meu Negócio e forneça 3 a 5 sugestões acionáveis para melhorá-lo. As informações são: ${businessData}`,
    config: {
      systemInstruction: `Você é um especialista em otimização do Google Meu Negócio. Seu objetivo é fornecer sugestões claras e práticas. Para cada sugestão, forneça um título, uma descrição e uma categoria. As categorias válidas são: 'Informações', 'Fotos', 'Avaliações', 'Postagens', 'SEO Local'. Formate sua resposta estritamente como o JSON definido no schema.`,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: 'Um título curto e impactante para a sugestão.',
                },
                description: {
                  type: Type.STRING,
                  description: 'Uma explicação detalhada da sugestão e por que é importante.',
                },
                category: {
                  type: Type.STRING,
                  description: "A categoria da sugestão. Deve ser uma das seguintes: 'Informações', 'Fotos', 'Avaliações', 'Postagens', 'SEO Local'.",
                },
              },
              required: ['title', 'description', 'category'],
            },
          },
        },
        required: ['suggestions'],
      },
    },
  });

  return parseJsonResponse<AnalysisResult>(response.text, "sugestões de melhoria");
}

export async function getCompetitorAnalysis(
  businessName: string,
  userLocation: UserLocation | null
): Promise<CompetitiveAnalysis> {
  const model = 'gemini-2.5-pro';

  const toolConfig = userLocation
    ? {
      retrievalConfig: {
        latLng: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
      },
    }
    : undefined;

  const response = await ai.models.generateContent({
    model,
    contents: `Analise a empresa "${businessName}" e 5 de seus concorrentes diretos em um raio de 2km. Para cada uma das 6 empresas (a principal e 5 concorrentes), forneça: o nome exato, a avaliação média, o número total de avaliações, e uma "pontuação de visibilidade" de 0 a 100. A pontuação deve estimar qual delas o Google "entrega mais" aos usuários, considerando a quantidade e qualidade das avaliações, popularidade e completude do perfil. Inclua uma breve justificativa para a pontuação de cada empresa. Ordene a lista da maior para a menor pontuação de visibilidade.`,
    config: {
      systemInstruction: `Você é um analista de SEO local. Sua tarefa é realizar uma análise competitiva usando o Google Maps. Sua resposta DEVE SER um objeto JSON VÁLIDO e NADA MAIS. O JSON deve ter uma chave 'analysis' que é um array de objetos. Cada objeto no array deve ter as seguintes chaves: 'name' (string), 'rating' (number), 'reviews' (integer), 'visibilityScore' (integer from 0-100), e 'justification' (string). Não inclua nenhum texto, explicação ou formatação de markdown como \`\`\`json antes ou depois do objeto JSON.`,
      tools: [{ googleMaps: {} }],
      ...(toolConfig && { toolConfig }),
    },
  });

  return parseJsonResponse<CompetitiveAnalysis>(response.text, "análise competitiva");
}

export async function getLocalRanking(businessData: string): Promise<LocalRankingResult> {
    const model = 'gemini-2.5-pro';
    const response = await ai.models.generateContent({
        model,
        contents: `Com base nos dados detalhados de uma empresa (${businessData}), analise seu provável ranqueamento local na cidade em comparação com concorrentes do mesmo segmento. Forneça uma tier de ranqueamento (ex: "Top 3", "Top 10", "Boa Visibilidade") e uma justificativa detalhada sobre os fatores que influenciam essa posição.`,
        config: {
            systemInstruction: `Você é um analista de SEO Local. Sua resposta DEVE SER um objeto JSON VÁLIDO e NADA MAIS. O JSON deve ter uma chave 'ranking' (string com o tier) e 'justification' (string com a análise).`,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    ranking: { type: Type.STRING, description: 'O tier de ranqueamento, ex: "Top 5".' },
                    justification: { type: Type.STRING, description: 'A análise detalhada do ranqueamento.' }
                },
                required: ['ranking', 'justification']
            }
        }
    });
    return parseJsonResponse<LocalRankingResult>(response.text, "ranqueamento local");
}

export async function getKeywordSuggestions(businessData: string): Promise<KeywordsResult> {
    const model = 'gemini-2.5-pro';
    const response = await ai.models.generateContent({
        model,
        contents: `Com base nos dados da empresa a seguir, gere uma lista de palavras-chave para SEO local. Dados: ${businessData}`,
        config: {
            systemInstruction: `Você é um especialista em SEO. Crie 3 listas de palavras-chave: 'principais' (termos gerais), 'caudaLonga' (termos específicos e com maior intenção de compra), e 'locais' (incluindo bairros ou pontos de referência próximos). Forneça 5-7 palavras-chave para cada lista. Formate a resposta como um objeto JSON com as chaves 'principais', 'caudaLonga', e 'locais', cada uma contendo um array de strings.`,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    principais: { type: Type.ARRAY, items: { type: Type.STRING } },
                    caudaLonga: { type: Type.ARRAY, items: { type: Type.STRING } },
                    locais: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['principais', 'caudaLonga', 'locais']
            }
        }
    });
    return parseJsonResponse<KeywordsResult>(response.text, "palavras-chave");
}

export async function getResponseTemplates(businessData: string): Promise<ResponsesResult> {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
        model,
        contents: `Crie modelos de resposta para avaliações do Google para a empresa com os seguintes dados: ${businessData}`,
        config: {
            systemInstruction: `Você é um especialista em atendimento ao cliente. Crie 2-3 modelos para avaliações positivas e 2-3 para negativas. Os modelos devem ser profissionais, agradecendo o feedback e, quando apropriado, mencionando sutilmente os serviços ou produtos. Formate a resposta como um objeto JSON com chaves 'positive' e 'negative', cada uma contendo um array de objetos com 'title' e 'text'.`,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    positive: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, text: { type: Type.STRING } }, required: ['title', 'text'] } },
                    negative: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, text: { type: Type.STRING } }, required: ['title', 'text'] } }
                },
                required: ['positive', 'negative']
            }
        }
    });
    return parseJsonResponse<ResponsesResult>(response.text, "modelos de resposta");
}

export async function getSeoActions(businessData: string): Promise<SeoActionsResult> {
    const model = 'gemini-2.5-pro';
    const response = await ai.models.generateContent({
        model,
        contents: `Com base nos dados da empresa (${businessData}), sugira 5 ações de SEO local para melhorar o posicionamento.`,
        config: {
            systemInstruction: `Você é um estrategista de SEO Local. Forneça 5 ações concretas e priorizadas (prioridade 'Alta', 'Média' ou 'Baixa'). As ações devem ir além do básico, focando em como superar concorrentes em geral. Inclua otimização da descrição, estratégia de Google Posts, consistência NAP e ideias para backlinks locais. Formate como um JSON com a chave 'actions', um array de objetos com 'title', 'description' e 'priority'.`,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    actions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                                priority: { type: Type.STRING }
                            },
                            required: ['title', 'description', 'priority']
                        }
                    }
                },
                required: ['actions']
            }
        }
    });
    return parseJsonResponse<SeoActionsResult>(response.text, "ações de SEO");
}

export async function getRadiusAnalysis(businessData: string, userLocation: UserLocation | null): Promise<RadiusAnalysisResult> {
    const model = 'gemini-2.5-pro';
    const toolConfig = userLocation ? { retrievalConfig: { latLng: { latitude: userLocation.latitude, longitude: userLocation.longitude } } } : undefined;

    const response = await ai.models.generateContent({
        model,
        contents: `Analise a provável área de alcance de busca para o segmento da empresa com os dados: ${businessData}. Identifique os 5 a 7 bairros mais relevantes em um raio de 10km que demonstram o maior interesse de busca pelo segmento desta empresa. Para cada bairro, forneça uma pontuação percentual de "interesse de busca" (0-100). Forneça também um resumo de análise explicando a distribuição de interesse.`,
        config: {
            systemInstruction: `Você é um analista de dados geoespaciais. Sua tarefa é usar o Google Maps para analisar o interesse de busca por bairro. Sua resposta DEVE SER um objeto JSON VÁLIDO e NADA MAIS. O JSON deve ter uma chave 'neighborhoods', que é um array de objetos, cada um com 'name' (string) e 'interestScore' (integer 0-100). Ele também deve ter uma chave 'analysisSummary' (string) com sua análise. Ordene os bairros do maior para o menor 'interestScore'.`,
            tools: [{ googleMaps: {} }],
            ...(toolConfig && { toolConfig }),
        }
    });
    return parseJsonResponse<RadiusAnalysisResult>(response.text, "análise de raio");
}

export async function getIdeaSuggestions(businessData: string): Promise<IdeasResult> {
    const model = 'gemini-2.5-pro';
    const response = await ai.models.generateContent({
        model,
        contents: `Gere ideias criativas de marketing para a empresa com base nestes dados: ${businessData}. Crie 3 ideias para Google Posts, 2 para promoções locais e 1 para eventos. Crucialmente, inclua uma seção separada explicando de forma convincente por que fotos 360 são essenciais para aumentar a autoridade e confiança no perfil.`,
        config: {
            systemInstruction: `Você é um consultor de marketing criativo. Sua resposta deve ser um JSON. Deve ter uma chave 'ideas', um array de objetos com 'title', 'description' e 'category' ('Postagens', 'Promoções', 'Eventos'). Deve também ter uma chave 'photo360', um objeto com 'title' e 'description' detalhando os benefícios das fotos 360.`,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    ideas: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                                category: { type: Type.STRING }
                            },
                            required: ['title', 'description', 'category']
                        }
                    },
                    photo360: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING }
                        },
                        required: ['title', 'description']
                    }
                },
                required: ['ideas', 'photo360']
            }
        }
    });
    return parseJsonResponse<IdeasResult>(response.text, "gerador de ideias");
}

const METRIC_DESCRIPTIONS: { [key: string]: string } = {
  "Nome do Negócio": "O nome deve refletir o nome real do seu negócio, conforme é conhecido pelos clientes e apresentado na sua loja ou site.",
  "Descrição da Empresa": "Descrever o seu negócio é uma oportunidade de contar a potenciais clientes a sua história e o que o torna único.",
  "Horário de Funcionamento": "É uma informação chave para que os clientes possam saber quando podem entrar em contato ou visitá-lo.",
  "Número de Telefone": "O número de telefone é uma das informações chave para o seu negócio.",
  "Website": "Ter um website transmite a impressão de um negócio bem sucedido, dá credibilidade e oferece aos clientes a oportunidade de entrar em contato com a empresa.",
  "Quantidade de Mídia Pelo Proprietário": "Fotos publicadas pelo proprietário revelam o compromisso que você tem com o seu negócio e demonstram como gostaria que este fosse apresentado.",
  "Data da Última Mídia pelo Proprietário": "Publicar periodicamente fotos ou vídeos demonstra que o seu perfil está ativo e envolvido com o Google.",
  "Vídeos": "Estudos mostram que os vídeos atraem e fidelizam clientes mais do que outras formas de marketing online.",
  "Fotografias 360º": "Fotos 360º de alta qualidade no perfil da sua empresa podem melhorar a experiência do usuário e fazer os clientes encontrarem você mais facilmente.",
  "Quantidade de Avaliações": "Analisa se possui uma quantidade mínima de avaliações.",
  "Média de Avaliações": "Analisa se a pontuação média de avaliação está boa ou se pode ser melhorada. Uma pontuação adequada nas avaliações transmite segurança e conforto para o cliente.",
  "Avaliações Sem Resposta": "Os seus clientes investiram tempo escrevendo uma avaliação. Responder mostra o quanto você se importa com as suas opiniões.",
  "Data da Última Postagem": "Criar e compartilhar novidades, falar sobre produtos, serviços ou detalhes de eventos demonstra que o seu negócio é ativo no Google e isso pode ajudar a melhorar a sua visibilidade online.",
  "Perguntas e Respostas": "Responda a perguntas diretas de clientes, e mesmo crie uma lista de Perguntas Frequentes."
};


export async function getDetailedScorecard(businessData: string): Promise<DetailedScorecardResult> {
    const model = 'gemini-2.5-pro';
    
    // Type for the AI's response, without the static description
    type AiScorecardMetric = Omit<ScorecardMetric, 'description'>;
    interface AiDetailedScorecardResult {
      metrics: AiScorecardMetric[];
    }

    const response = await ai.models.generateContent({
        model,
        contents: `Com base nos dados da empresa (${businessData}), avalie o perfil contra a lista de métricas de SEO Local a seguir. Para cada métrica, forneça um score de 0 a 100, um status ('Fraco', 'Razoável', 'Bom') e uma análise textual específica para a empresa.`,
        config: {
            systemInstruction: `Você é um especialista em SEO Local que cria um scorecard detalhado. Sua resposta DEVE ser um objeto JSON. O JSON deve ter uma chave 'metrics' que é um array de objetos. Cada objeto deve ter as chaves: 'name' (string, o nome da métrica), 'analysis' (string, a sua análise específica sobre a empresa), 'status' (string, um dos três: 'Fraco', 'Razoável', 'Bom'), e 'score' (integer, 0-100). Avalie TODAS as métricas listadas a seguir: "${Object.keys(METRIC_DESCRIPTIONS).join('", "')}".`,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    metrics: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                analysis: { type: Type.STRING },
                                status: { type: Type.STRING },
                                score: { type: Type.INTEGER }
                            },
                            required: ['name', 'analysis', 'status', 'score']
                        }
                    }
                },
                required: ['metrics']
            }
        }
    });

    const aiResult = parseJsonResponse<AiDetailedScorecardResult>(response.text, "scorecard detalhado");

    // Augment the result with static descriptions
    const augmentedMetrics = aiResult.metrics.map(metric => ({
        ...metric,
        description: METRIC_DESCRIPTIONS[metric.name] || "Descrição não disponível."
    }));

    return { metrics: augmentedMetrics };
}
import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisResult, CompetitiveAnalysis, DetailedScorecardResult, GroundingChunk, HeadToHeadAnalysis, IdeasResult, KeywordsResult, LocalRankingResult, OptimizationBenefits, RadiusAnalysisResult, ResponsesResult, SeoActionsResult, ScorecardMetric, CustomerProfile, SentimentAnalysis, KeywordVolumeResult } from '../types';
import { getPrompt, PROMPT_KEYS } from './promptManager';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fillPromptTemplate = (template: string, variables: Record<string, string | number>): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
    return variables[variableName]?.toString() || match;
  });
};

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
  city: string,
  state: string
): Promise<{ businessData: string; groundingChunks: GroundingChunk[] }> {
  const model = 'gemini-2.5-flash';
  const prompt = getPrompt(PROMPT_KEYS.FETCH_BUSINESS_INFO);
  const contents = fillPromptTemplate(prompt.contents, { businessName, city, state });

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      tools: [{ googleMaps: {} }],
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
  const prompt = getPrompt(PROMPT_KEYS.GET_IMPROVEMENT_SUGGESTIONS);
  const systemInstruction = prompt.systemInstruction;
  const contents = fillPromptTemplate(prompt.contents, { businessData });

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
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
  city: string,
  state: string
): Promise<CompetitiveAnalysis> {
  const model = 'gemini-2.5-pro';
  const prompt = getPrompt(PROMPT_KEYS.GET_COMPETITOR_ANALYSIS);
  const systemInstruction = prompt.systemInstruction;
  const contents = fillPromptTemplate(prompt.contents, { businessName, city, state });
  
  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
      tools: [{ googleMaps: {} }],
    },
  });

  return parseJsonResponse<CompetitiveAnalysis>(response.text, "análise competitiva");
}

export async function getLocalRanking(businessData: string): Promise<LocalRankingResult> {
    const model = 'gemini-2.5-pro';
    const prompt = getPrompt(PROMPT_KEYS.GET_LOCAL_RANKING);
    const systemInstruction = prompt.systemInstruction;
    const contents = fillPromptTemplate(prompt.contents, { businessData });
    
    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            systemInstruction,
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
    const prompt = getPrompt(PROMPT_KEYS.GET_KEYWORD_SUGGESTIONS);
    const systemInstruction = prompt.systemInstruction;
    const contents = fillPromptTemplate(prompt.contents, { businessData });

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            systemInstruction,
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
    const prompt = getPrompt(PROMPT_KEYS.GET_RESPONSE_TEMPLATES);
    const systemInstruction = prompt.systemInstruction;
    const contents = fillPromptTemplate(prompt.contents, { businessData });

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            systemInstruction,
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
    const prompt = getPrompt(PROMPT_KEYS.GET_SEO_ACTIONS);
    const systemInstruction = prompt.systemInstruction;
    const contents = fillPromptTemplate(prompt.contents, { businessData });

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            systemInstruction,
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

export async function getRadiusAnalysis(businessData: string): Promise<RadiusAnalysisResult> {
    const model = 'gemini-2.5-pro';
    const prompt = getPrompt(PROMPT_KEYS.GET_RADIUS_ANALYSIS);
    const systemInstruction = prompt.systemInstruction;
    const contents = fillPromptTemplate(prompt.contents, { businessData });
    
    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            systemInstruction,
            tools: [{ googleMaps: {} }],
        }
    });
    return parseJsonResponse<RadiusAnalysisResult>(response.text, "análise de raio");
}

export async function getIdeaSuggestions(businessData: string): Promise<IdeasResult> {
    const model = 'gemini-2.5-pro';
    const prompt = getPrompt(PROMPT_KEYS.GET_IDEA_SUGGESTIONS);
    const systemInstruction = prompt.systemInstruction;
    const contents = fillPromptTemplate(prompt.contents, { businessData });

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            systemInstruction,
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
    
    type AiScorecardMetric = Omit<ScorecardMetric, 'description'>;
    interface AiDetailedScorecardResult {
      metrics: AiScorecardMetric[];
    }
    
    const prompt = getPrompt(PROMPT_KEYS.GET_DETAILED_SCORECARD);
    const metricKeys = Object.keys(METRIC_DESCRIPTIONS).join('", "');
    const systemInstruction = fillPromptTemplate(prompt.systemInstruction, { metricKeys });
    const contents = fillPromptTemplate(prompt.contents, { businessData });

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            systemInstruction,
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

    const augmentedMetrics = aiResult.metrics.map(metric => ({
        ...metric,
        description: METRIC_DESCRIPTIONS[metric.name] || "Descrição não disponível."
    }));

    return { metrics: augmentedMetrics };
}

export async function getOptimizationBenefits(): Promise<OptimizationBenefits> {
    const model = 'gemini-2.5-flash';
    const prompt = getPrompt(PROMPT_KEYS.GET_OPTIMIZATION_BENEFITS);
    const systemInstruction = prompt.systemInstruction;
    const contents = prompt.contents;

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    benefits: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                                icon: { type: Type.STRING, description: 'Nome do ícone do Heroicons (outline), ex: chart-bar' }
                            },
                            required: ['title', 'description', 'icon']
                        }
                    }
                },
                required: ['benefits']
            }
        }
    });

    return parseJsonResponse<OptimizationBenefits>(response.text, "benefícios da otimização");
}


export async function getHeadToHeadAnalysis(businessData: string, competitorName: string): Promise<HeadToHeadAnalysis> {
    const model = 'gemini-2.5-pro';
    const prompt = getPrompt(PROMPT_KEYS.GET_HEAD_TO_HEAD_ANALYSIS);
    const systemInstruction = prompt.systemInstruction;
    const contents = fillPromptTemplate(prompt.contents, { businessData, competitorName });

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    competitorName: { type: Type.STRING },
                    comparison: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                metric: { type: Type.STRING },
                                yourBusiness: { type: Type.STRING, description: "Análise da empresa do usuário" },
                                competitor: { type: Type.STRING, description: "Análise do concorrente" }
                            },
                            required: ['metric', 'yourBusiness', 'competitor']
                        }
                    },
                    strategicRecommendations: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ['competitorName', 'comparison', 'strategicRecommendations']
            }
        }
    });

    return parseJsonResponse<HeadToHeadAnalysis>(response.text, "análise direta");
}

export async function getCustomerProfileAnalysis(businessData: string): Promise<CustomerProfile> {
    const model = 'gemini-2.5-pro';
    const prompt = getPrompt(PROMPT_KEYS.GET_CUSTOMER_PROFILE_ANALYSIS);
    const systemInstruction = prompt.systemInstruction;
    const contents = fillPromptTemplate(prompt.contents, { businessData });

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    genderDistribution: {
                        type: Type.OBJECT,
                        properties: {
                            male: { type: Type.INTEGER, description: "Porcentagem de clientes do sexo masculino" },
                            female: { type: Type.INTEGER, description: "Porcentagem de clientes do sexo feminino" },
                            other: { type: Type.INTEGER, description: "Porcentagem de clientes de outros gêneros" }
                        },
                        required: ['male', 'female', 'other']
                    },
                    ageRange: { type: Type.STRING, description: "Faixa etária principal, ex: '25-45 anos'" },
                    mainInterests: { type: Type.ARRAY, items: { type: Type.STRING } },
                    summary: { type: Type.STRING, description: "Resumo do perfil do cliente." }
                },
                required: ['genderDistribution', 'ageRange', 'mainInterests', 'summary']
            }
        }
    });
    return parseJsonResponse<CustomerProfile>(response.text, "perfil do cliente");
}

export async function getReviewSentimentAnalysis(businessData: string): Promise<SentimentAnalysis> {
    const model = 'gemini-2.5-pro';
    const prompt = getPrompt(PROMPT_KEYS.GET_REVIEW_SENTIMENT_ANALYSIS);
    const systemInstruction = prompt.systemInstruction;
    const contents = fillPromptTemplate(prompt.contents, { businessData });

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    positiveThemes: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                theme: { type: Type.STRING },
                                summary: { type: Type.STRING },
                                mentions: { type: Type.INTEGER }
                            },
                            required: ['theme', 'summary', 'mentions']
                        }
                    },
                    negativeThemes: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                theme: { type: Type.STRING },
                                summary: { type: Type.STRING },
                                mentions: { type: Type.INTEGER }
                            },
                            required: ['theme', 'summary', 'mentions']
                        }
                    }
                },
                required: ['positiveThemes', 'negativeThemes']
            }
        }
    });
    return parseJsonResponse<SentimentAnalysis>(response.text, "análise de sentimento");
}

export async function getKeywordVolume(keyword: string, city: string, state: string): Promise<KeywordVolumeResult> {
    const model = 'gemini-2.5-pro';
    const prompt = getPrompt(PROMPT_KEYS.GET_KEYWORD_VOLUME);
    const systemInstruction = prompt.systemInstruction;
    const contents = fillPromptTemplate(prompt.contents, { keyword, city, state });

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    keyword: { type: Type.STRING },
                    monthlyVolumes: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                month: { type: Type.STRING, description: "Mês e ano, ex: Jan/24" },
                                volume: { type: Type.INTEGER, description: "Volume de busca estimado" }
                            },
                            required: ['month', 'volume']
                        }
                    },
                    analysis: { type: Type.STRING, description: "Análise da tendência de busca." }
                },
                required: ['keyword', 'monthlyVolumes', 'analysis']
            }
        }
    });
    return parseJsonResponse<KeywordVolumeResult>(response.text, "volume de busca de palavra-chave");
}
// services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, CompetitiveAnalysis, DetailedScorecardResult, HeadToHeadAnalysis, IdeasResult, KeywordsResult, LocalRankingResult, OptimizationBenefits, RadiusAnalysisResult, ResponsesResult, SeoActionsResult, ScorecardMetric, CustomerProfile, SentimentAnalysis, KeywordVolumeResult, GrowthProjection } from '../types.ts';
import { getPrompt, PROMPT_KEYS } from './promptManager.ts';

function getAiClient(apiKey: string): GoogleGenAI {
  if (!apiKey) {
    throw new Error("A chave de API do Gemini não foi fornecida.");
  }
  return new GoogleGenAI({ apiKey });
}

const fillPromptTemplate = (template: string, variables: Record<string, string | number>): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
    return variables[variableName]?.toString() || match;
  });
};

const parseJsonResponse = <T>(jsonText: string | null, context: string): T => {
  if (!jsonText) {
      throw new Error(`A resposta da IA para ${context} estava vazia.`);
  }

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
    throw new Error(`A resposta da IA para ${context} não estava no formato JSON esperado. Resposta recebida: ${cleanedText}`);
  }
};

async function callGemini<T>(
    apiKey: string,
    model: 'gemini-2.5-pro' | 'gemini-2.5-flash',
    promptKey: string,
    variables: Record<string, string | number>,
    isJson: boolean,
    context: string,
    responseSchema?: any 
): Promise<T> {
    const ai = getAiClient(apiKey);
    const prompt = getPrompt(promptKey);
    const systemInstruction = prompt.systemInstruction;
    const contents = fillPromptTemplate(prompt.contents, variables);

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            ...(systemInstruction && { systemInstruction }),
            ...(isJson && { responseMimeType: 'application/json' }),
            ...(responseSchema && { responseSchema }),
        },
    });

    const responseText = response.text;

    if (isJson) {
        return parseJsonResponse<T>(responseText, context);
    }
    
    if (!responseText) {
        throw new Error(`A resposta da IA para ${context} estava vazia.`);
    }

    return responseText as unknown as T;
}

export async function fetchBusinessInfo(
  apiKey: string,
  businessName: string,
  city: string,
  state: string
): Promise<{ businessData: string }> {
    const businessData = await callGemini<string>(
        apiKey,
        'gemini-2.5-flash',
        PROMPT_KEYS.FETCH_BUSINESS_INFO,
        { businessName, city, state },
        false,
        'informações da empresa'
    );
    return { businessData };
}

export async function getImprovementSuggestions(apiKey: string, businessData: string): Promise<AnalysisResult> {
    return callGemini<AnalysisResult>(
        apiKey,
        'gemini-2.5-pro',
        PROMPT_KEYS.GET_IMPROVEMENT_SUGGESTIONS,
        { businessData },
        true,
        'sugestões de melhoria'
    );
}

export async function getCompetitorAnalysis(
  apiKey: string,
  businessName: string,
  city: string,
  state: string
): Promise<CompetitiveAnalysis> {
    return callGemini<CompetitiveAnalysis>(
        apiKey,
        'gemini-2.5-pro',
        PROMPT_KEYS.GET_COMPETITOR_ANALYSIS,
        { businessName, city, state },
        true,
        'análise competitiva'
    );
}

export async function getLocalRanking(apiKey: string, businessData: string): Promise<LocalRankingResult> {
    return callGemini<LocalRankingResult>(
        apiKey,
        'gemini-2.5-pro',
        PROMPT_KEYS.GET_LOCAL_RANKING,
        { businessData },
        true,
        'ranqueamento local'
    );
}

export async function getKeywordSuggestions(apiKey: string, businessData: string): Promise<KeywordsResult> {
    return callGemini<KeywordsResult>(
        apiKey,
        'gemini-2.5-pro',
        PROMPT_KEYS.GET_KEYWORD_SUGGESTIONS,
        { businessData },
        true,
        'palavras-chave'
    );
}

export async function getResponseTemplates(apiKey: string, businessData: string): Promise<ResponsesResult> {
    return callGemini<ResponsesResult>(
        apiKey,
        'gemini-2.5-flash',
        PROMPT_KEYS.GET_RESPONSE_TEMPLATES,
        { businessData },
        true,
        'modelos de resposta'
    );
}

export async function getSeoActions(apiKey: string, businessData: string): Promise<SeoActionsResult> {
    return callGemini<SeoActionsResult>(
        apiKey,
        'gemini-2.5-pro',
        PROMPT_KEYS.GET_SEO_ACTIONS,
        { businessData },
        true,
        'ações de SEO'
    );
}

export async function getRadiusAnalysis(apiKey: string, businessData: string): Promise<RadiusAnalysisResult> {
    return callGemini<RadiusAnalysisResult>(
        apiKey,
        'gemini-2.5-pro',
        PROMPT_KEYS.GET_RADIUS_ANALYSIS,
        { businessData },
        true,
        'análise de raio'
    );
}

export async function getIdeaSuggestions(apiKey: string, businessData: string): Promise<IdeasResult> {
    return callGemini<IdeasResult>(
        apiKey,
        'gemini-2.5-pro',
        PROMPT_KEYS.GET_IDEA_SUGGESTIONS,
        { businessData },
        true,
        'gerador de ideias'
    );
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


export async function getDetailedScorecard(apiKey: string, businessData: string): Promise<DetailedScorecardResult> {
    type AiScorecardMetric = Omit<ScorecardMetric, 'description'>;
    interface AiDetailedScorecardResult {
      metrics: AiScorecardMetric[];
    }
    
    const metricKeys = Object.keys(METRIC_DESCRIPTIONS).join('", "');

    const aiResult = await callGemini<AiDetailedScorecardResult>(
        apiKey,
        'gemini-2.5-pro',
        PROMPT_KEYS.GET_DETAILED_SCORECARD,
        { businessData, metricKeys },
        true,
        'scorecard detalhado'
    );

    const augmentedMetrics = aiResult.metrics.map(metric => ({
        ...metric,
        description: METRIC_DESCRIPTIONS[metric.name] || "Descrição não disponível."
    }));

    return { metrics: augmentedMetrics };
}

export async function getOptimizationBenefits(apiKey: string): Promise<OptimizationBenefits> {
    const schema = {
        type: Type.OBJECT,
        properties: {
            benefits: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        icon: { type: Type.STRING }
                    },
                    required: ["title", "description", "icon"]
                }
            }
        },
        required: ["benefits"]
    };
    return callGemini<OptimizationBenefits>(
        apiKey,
        'gemini-2.5-flash',
        PROMPT_KEYS.GET_OPTIMIZATION_BENEFITS,
        {},
        true,
        'benefícios da otimização',
        schema
    );
}


export async function getHeadToHeadAnalysis(apiKey: string, businessData: string, competitorName: string): Promise<HeadToHeadAnalysis> {
    const schema = {
        type: Type.OBJECT,
        properties: {
            competitorName: { type: Type.STRING },
            comparison: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        metric: { type: Type.STRING },
                        yourBusiness: { type: Type.STRING },
                        competitor: { type: Type.STRING }
                    },
                    required: ["metric", "yourBusiness", "competitor"]
                }
            },
            strategicRecommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        },
        required: ["competitorName", "comparison", "strategicRecommendations"]
    };
    return callGemini<HeadToHeadAnalysis>(
        apiKey,
        'gemini-2.5-pro',
        PROMPT_KEYS.GET_HEAD_TO_HEAD_ANALYSIS,
        { businessData, competitorName },
        true,
        'análise direta',
        schema
    );
}

export async function getCustomerProfileAnalysis(apiKey: string, businessData: string): Promise<CustomerProfile> {
    const schema = {
        type: Type.OBJECT,
        properties: {
            genderDistribution: {
                type: Type.OBJECT,
                properties: {
                    male: { type: Type.NUMBER },
                    female: { type: Type.NUMBER },
                    other: { type: Type.NUMBER }
                },
                required: ["male", "female", "other"]
            },
            ageRange: { type: Type.STRING },
            mainInterests: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            },
            summary: { type: Type.STRING }
        },
        required: ["genderDistribution", "ageRange", "mainInterests", "summary"]
    };
    return callGemini<CustomerProfile>(
        apiKey,
        'gemini-2.5-pro',
        PROMPT_KEYS.GET_CUSTOMER_PROFILE_ANALYSIS,
        { businessData },
        true,
        'perfil do cliente',
        schema
    );
}

export async function getReviewSentimentAnalysis(apiKey: string, businessData: string): Promise<SentimentAnalysis> {
    return callGemini<SentimentAnalysis>(
        apiKey,
        'gemini-2.5-pro',
        PROMPT_KEYS.GET_REVIEW_SENTIMENT_ANALYSIS,
        { businessData },
        true,
        'análise de sentimento'
    );
}

export async function getKeywordVolume(apiKey: string, keyword: string, city: string, state: string): Promise<KeywordVolumeResult> {
    return callGemini<KeywordVolumeResult>(
        apiKey,
        'gemini-2.5-pro',
        PROMPT_KEYS.GET_KEYWORD_VOLUME,
        { keyword, city, state },
        true,
        'volume de busca de palavra-chave'
    );
}

export async function getGrowthProjection(apiKey: string, businessData: string, visibilityScore: number): Promise<GrowthProjection> {
    return callGemini<GrowthProjection>(
        apiKey,
        'gemini-2.5-flash',
        PROMPT_KEYS.GET_GROWTH_PROJECTION,
        { businessData, visibilityScore },
        true,
        'projeção de crescimento'
    );
}
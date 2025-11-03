export const PROMPT_KEYS = {
  FETCH_BUSINESS_INFO: 'fetchBusinessInfo',
  GET_IMPROVEMENT_SUGGESTIONS: 'getImprovementSuggestions',
  GET_COMPETITOR_ANALYSIS: 'getCompetitorAnalysis',
  GET_LOCAL_RANKING: 'getLocalRanking',
  GET_KEYWORD_SUGGESTIONS: 'getKeywordSuggestions',
  GET_RESPONSE_TEMPLATES: 'getResponseTemplates',
  GET_SEO_ACTIONS: 'getSeoActions',
  GET_RADIUS_ANALYSIS: 'getRadiusAnalysis',
  GET_IDEA_SUGGESTIONS: 'getIdeaSuggestions',
  GET_DETAILED_SCORECARD: 'getDetailedScorecard',
  GET_OPTIMIZATION_BENEFITS: 'getOptimizationBenefits',
  GET_HEAD_TO_HEAD_ANALYSIS: 'getHeadToHeadAnalysis',
  GET_CUSTOMER_PROFILE_ANALYSIS: 'getCustomerProfileAnalysis',
  GET_REVIEW_SENTIMENT_ANALYSIS: 'getReviewSentimentAnalysis',
  GET_KEYWORD_VOLUME: 'getKeywordVolume',
};

type Prompt = {
  systemInstruction: string;
  contents: string;
};

type AllPrompts = { [key: string]: Prompt };

export const DEFAULT_PROMPTS: AllPrompts = {
  [PROMPT_KEYS.FETCH_BUSINESS_INFO]: {
    systemInstruction: '',
    contents: `Forneça um resumo detalhado do perfil da empresa "{{businessName}}" em {{city}}, {{state}}. Inclua o nome, endereço, categoria, horário de funcionamento, resumo das avaliações recentes (positivas e negativas), se há postagens recentes, se tem fotos 360, e um resumo geral das informações disponíveis.`,
  },
  [PROMPT_KEYS.GET_IMPROVEMENT_SUGGESTIONS]: {
    systemInstruction: `Você é um especialista em otimização do Google Meu Negócio. Seu objetivo é fornecer sugestões claras e práticas. Para cada sugestão, forneça um título, uma descrição e uma categoria. As categorias válidas são: 'Informações', 'Fotos', 'Avaliações', 'Postagens', 'SEO Local'. Formate sua resposta estritamente como o JSON definido no schema.`,
    contents: `Analise as seguintes informações do perfil de uma empresa no Google Meu Negócio e forneça 3 a 5 sugestões acionáveis para melhorá-lo. As informações são: {{businessData}}`,
  },
  [PROMPT_KEYS.GET_COMPETITOR_ANALYSIS]: {
    systemInstruction: `Você é um analista de SEO local. Sua tarefa é realizar uma análise competitiva usando o Google Maps. Sua resposta DEVE SER um objeto JSON VÁLIDO e NADA MAIS. O JSON deve ter uma chave 'analysis' que é um array de objetos. Cada objeto no array deve ter as seguintes chaves: 'name' (string), 'rating' (number), 'reviews' (integer), 'visibilityScore' (integer from 0-100), e 'justification' (string). Não inclua nenhum texto, explicação ou formatação de markdown como \`\`\`json antes ou depois do objeto JSON.`,
    contents: `Analise a empresa "{{businessName}}" em {{city}}, {{state}} e 5 de seus concorrentes diretos em um raio de 2km. Para cada uma das 6 empresas (a principal e 5 concorrentes), forneça: o nome exato, a avaliação média, o número total de avaliações, e uma "pontuação de visibilidade" de 0 a 100. A pontuação deve estimar qual delas o Google "entrega mais" aos usuários, considerando a quantidade e qualidade das avaliações, popularidade e completude do perfil. Inclua uma breve justificativa para a pontuação de cada empresa. Ordene a lista da maior para a menor pontuação de visibilidade.`,
  },
  [PROMPT_KEYS.GET_LOCAL_RANKING]: {
    systemInstruction: `Você é um analista de SEO Local. Sua resposta DEVE SER um objeto JSON VÁLIDO e NADA MAIS. O JSON deve ter uma chave 'ranking' (string com o tier) e 'justification' (string com a análise).`,
    contents: `Com base nos dados detalhados de uma empresa ({{businessData}}), analise seu provável ranqueamento local na cidade em comparação com concorrentes do mesmo segmento. Forneça uma tier de ranqueamento (ex: "Top 3", "Top 10", "Boa Visibilidade") e uma justificativa detalhada sobre os fatores que influenciam essa posição.`,
  },
  [PROMPT_KEYS.GET_KEYWORD_SUGGESTIONS]: {
    systemInstruction: `Você é um especialista em SEO. Crie 3 listas de palavras-chave: 'principais' (termos gerais), 'caudaLonga' (termos específicos e com maior intenção de compra), e 'locais' (incluindo bairros ou pontos de referência próximos). Forneça 5-7 palavras-chave para cada lista. Formate a resposta como um objeto JSON com as chaves 'principais', 'caudaLonga', e 'locais', cada uma contendo um array de strings.`,
    contents: `Com base nos dados da empresa a seguir, gere uma lista de palavras-chave para SEO local. Dados: {{businessData}}`,
  },
  [PROMPT_KEYS.GET_RESPONSE_TEMPLATES]: {
    systemInstruction: `Você é um especialista em atendimento ao cliente. Crie 2-3 modelos para avaliações positivas e 2-3 para negativas. Os modelos devem ser profissionais, agradecendo o feedback e, quando apropriado, mencionando sutilmente os serviços ou produtos. Formate a resposta como um objeto JSON com chaves 'positive' e 'negative', cada uma contendo um array de objetos com 'title' e 'text'.`,
    contents: `Crie modelos de resposta para avaliações do Google para a empresa com os seguintes dados: {{businessData}}`,
  },
  [PROMPT_KEYS.GET_SEO_ACTIONS]: {
    systemInstruction: `Você é um estrategista de SEO Local. Forneça 5 ações concretas e priorizadas (prioridade 'Alta', 'Média' ou 'Baixa'). As ações devem ir além do básico, focando em como superar concorrentes em geral. Inclua otimização da descrição, estratégia de Google Posts, consistência NAP e ideias para backlinks locais. Formate como um JSON com a chave 'actions', um array de objetos com 'title', 'description' e 'priority'.`,
    contents: `Com base nos dados da empresa ({{businessData}}), sugira 5 ações de SEO local para melhorar o posicionamento.`,
  },
  [PROMPT_KEYS.GET_RADIUS_ANALYSIS]: {
    systemInstruction: `Você é um analista de dados geoespaciais. Sua tarefa é usar o Google Maps para analisar o interesse de busca por bairro. Sua resposta DEVE SER um objeto JSON VÁLIDO e NADA MAIS. O JSON deve ter uma chave 'neighborhoods', que é um array de objetos, cada um com 'name' (string) e 'interestScore' (integer 0-100). Ele também deve ter uma chave 'analysisSummary' (string) com sua análise. Ordene os bairros do maior para o menor 'interestScore'.`,
    contents: `Analise a provável área de alcance de busca para o segmento da empresa com os dados: {{businessData}}. Identifique os 5 a 7 bairros mais relevantes em um raio de 10km que demonstram o maior interesse de busca pelo segmento desta empresa. Para cada bairro, forneça uma pontuação percentual de "interesse de busca" (0-100). Forneça também um resumo de análise explicando a distribuição de interesse.`,
  },
  [PROMPT_KEYS.GET_IDEA_SUGGESTIONS]: {
    systemInstruction: `Você é um consultor de marketing criativo. Sua resposta deve ser um JSON. Deve ter uma chave 'ideas', um array de objetos com 'title', 'description' e 'category' ('Postagens', 'Promoções', 'Eventos'). Deve também ter uma chave 'photo360', um objeto com 'title' e 'description' detalhando os benefícios das fotos 360.`,
    contents: `Gere ideias criativas de marketing para a empresa com base nestes dados: {{businessData}}. Crie 3 ideias para Google Posts, 2 para promoções locais e 1 para eventos. Crucialmente, inclua uma seção separada explicando de forma convincente por que fotos 360 são essenciais. Detalhe os benefícios que a foto 360 entrega para a empresa dentro do Google Maps, focando em como ela melhora a experiência do cliente (permitindo um tour virtual, mostrando o ambiente, etc.) e aumenta o reconhecimento e a confiança na marca (transparência, profissionalismo, destaque nos resultados de busca). Aprofunde os benefícios para o cliente, como a capacidade de 'visitar' o local antes, e para a empresa, como o aumento de confiança, transparência e maior destaque no algoritmo do Google.`,
  },
  [PROMPT_KEYS.GET_DETAILED_SCORECARD]: {
    systemInstruction: `Você é um especialista em SEO Local que cria um scorecard detalhado. Sua resposta DEVE ser um objeto JSON. O JSON deve ter uma chave 'metrics' que é um array de objetos. Cada objeto deve ter as chaves: 'name' (string, o nome da métrica), 'analysis' (string, a sua análise específica sobre a empresa), 'status' (string, um dos três: 'Fraco', 'Razoável', 'Bom'), e 'score' (integer, 0-100). Avalie TODAS as métricas listadas a seguir: "{{metricKeys}}".`,
    contents: `Com base nos dados da empresa ({{businessData}}), avalie o perfil contra a lista de métricas de SEO Local a seguir. Para cada métrica, forneça um score de 0 a 100, um status ('Fraco', 'Razoável', 'Bom') e uma análise textual específica para a empresa.`,
  },
  [PROMPT_KEYS.GET_OPTIMIZATION_BENEFITS]: {
    systemInstruction: `Você é um especialista em marketing digital. Sua tarefa é listar os benefícios de ter um Perfil de Empresa no Google otimizado. Forneça uma lista de benefícios, cada um com um título, uma descrição concisa e um nome de ícone de heroicons (formato 'outline', ex: 'magnifying-glass'). Sua resposta deve ser estritamente um JSON.`,
    contents: `Liste 5 a 7 benefícios chave de otimizar um Perfil de Empresa no Google.`,
  },
  [PROMPT_KEYS.GET_HEAD_TO_HEAD_ANALYSIS]: {
    systemInstruction: `Você é um analista de SEO competitivo. Sua tarefa é criar uma comparação direta e fornecer recomendações estratégicas. Formate sua resposta como um objeto JSON.`,
    contents: `Compare o perfil da empresa (dados: {{businessData}}) com o seu principal concorrente, "{{competitorName}}". Crie uma tabela de comparação com as métricas: 'Qualidade das Fotos', 'Frequência de Postagens', 'Engajamento nas Avaliações', e 'Completude das Informações'. Para cada métrica, descreva o status da empresa e do concorrente. Por fim, forneça 3 recomendações estratégicas e acionáveis que a empresa pode tomar para superar "{{competitorName}}".`
  },
  [PROMPT_KEYS.GET_CUSTOMER_PROFILE_ANALYSIS]: {
    systemInstruction: `Você é um analista de marketing especializado em demografia de clientes. Sua tarefa é estimar o perfil do cliente-alvo de um negócio com base nas informações públicas do seu Perfil de Empresa no Google. A sua resposta DEVE ser um objeto JSON VÁLIDO e NADA MAIS. Os números da distribuição de gênero devem somar 100.`,
    contents: `Com base nos dados da empresa ({{businessData}}), estime o perfil demográfico do cliente típico. Forneça uma distribuição de gênero (male, female, other em porcentagem), a faixa etária principal (ex: "25-45 anos"), uma lista de 3 a 5 interesses principais, e um resumo sobre o perfil do cliente.`,
  },
  [PROMPT_KEYS.GET_REVIEW_SENTIMENT_ANALYSIS]: {
    systemInstruction: `Você é um analista de dados especialista em análise de sentimento. Sua tarefa é analisar o sentimento de avaliações de clientes. Extraia os temas principais, tanto positivos quanto negativos. Forneça um resumo conciso para cada tema e uma porcentagem estimada de menções. Sua resposta DEVE SER um objeto JSON VÁLIDO e NADA MAIS.`,
    contents: `Analise as avaliações de clientes contidas nos dados da empresa a seguir: {{businessData}}. Identifique de 3 a 5 temas positivos recorrentes e de 3 a 5 temas negativos (ou pontos de melhoria) recorrentes. Para cada tema, forneça o tema em si (ex: "Atendimento Amigável"), um resumo do que os clientes estão dizendo, e uma porcentagem estimada de menções sobre esse tema nas avaliações. Formate a resposta como um JSON com as chaves 'positiveThemes' e 'negativeThemes'.`
  },
  [PROMPT_KEYS.GET_KEYWORD_VOLUME]: {
    systemInstruction: `Você é uma ferramenta de pesquisa de palavras-chave semelhante ao Planejador de Palavras-chave do Google. Sua tarefa é fornecer o volume de pesquisa mensal estimado para uma determinada palavra-chave em um local específico nos últimos 12 meses. Sua resposta DEVE ser um objeto JSON VÁLIDO e NADA MAIS. O JSON deve conter as chaves 'keyword' (a palavra-chave pesquisada), 'monthlyVolumes' (um array de 12 objetos, cada um com 'month' no formato "Mês/Ano" e 'volume' como um número inteiro) e 'analysis' (uma análise de string sobre a tendência, sazonalidade e insights).`,
    contents: `Forneça o volume de pesquisa mensal estimado para a palavra-chave "{{keyword}}" em {{city}}, {{state}} nos últimos 12 meses.`,
  }
};

const STORAGE_KEY = 'gemini_custom_prompts';

export const getAllPrompts = (): AllPrompts => {
  try {
    const storedPrompts = localStorage.getItem(STORAGE_KEY);
    if (storedPrompts) {
      const customPrompts = JSON.parse(storedPrompts);
      const mergedPrompts = { ...DEFAULT_PROMPTS };
      for (const key in mergedPrompts) {
        if (customPrompts[key]) {
            mergedPrompts[key] = customPrompts[key];
        }
      }
      return mergedPrompts;
    }
  } catch (error) {
    console.error("Failed to read custom prompts from localStorage", error);
  }
  return DEFAULT_PROMPTS;
};

export const getPrompt = (key: string): Prompt => {
  const allPrompts = getAllPrompts();
  return allPrompts[key] || DEFAULT_PROMPTS[key];
};

export const saveAllPrompts = (prompts: AllPrompts) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  } catch (error) {
    console.error("Failed to save custom prompts to localStorage", error);
  }
};

export const resetPrompts = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to reset custom prompts in localStorage", error);
  }
};
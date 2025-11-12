// New type for Notification System
export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Gemini Service related types
export interface Suggestion {
  title: string;
  description: string;
  category: 'Informações' | 'Fotos' | 'Avaliações' | 'Postagens' | 'SEO Local';
}

export interface AnalysisResult {
  suggestions: Suggestion[];
}

export interface Competitor {
  name: string;
  rating: number;
  reviews: number;
  visibilityScore: number;
  justification: string;
}

export interface CompetitiveAnalysis {
  analysis: Competitor[];
}

export interface LocalRankingResult {
  ranking: string;
  justification: string;
}

export interface PostSuggestion {
  title: string;
  content: string;
}

export interface KeywordsResult {
  principais: string[];
  caudaLonga: string[];
  locais: string[];
  hashtags: string[];
  posts: PostSuggestion[];
}

export interface ResponseTemplate {
    title: string;
    text: string;
}

export interface ResponsesResult {
    positive: ResponseTemplate[];
    negative: ResponseTemplate[];
}

export interface SeoAction {
    title: string;
    description: string;
    priority: 'Alta' | 'Média' | 'Baixa';
}

export interface SeoActionsResult {
    actions: SeoAction[];
}

export interface RadiusAnalysisResult {
    neighborhoods: { name: string; interestScore: number }[];
    analysisSummary: string;
}

export interface Idea {
    title: string;
    description: string;
    category: 'Postagens' | 'Promoções' | 'Eventos';
}

export interface IdeasResult {
    ideas: Idea[];
    photo360: {
        title: string;
        description: string;
    };
}

export interface ScorecardMetric {
    name: string;
    description: string;
    analysis: string;
    status: 'Fraco' | 'Razoável' | 'Bom';
    score: number;
}

export interface DetailedScorecardResult {
    metrics: ScorecardMetric[];
}

export interface BenefitItem {
    title: string;
    description: string;
    icon: string;
}

export interface OptimizationBenefits {
    benefits: BenefitItem[];
}

export interface HeadToHeadAnalysis {
    competitorName: string;
    comparison: {
        metric: string;
        yourBusiness: string;
        competitor: string;
    }[];
    strategicRecommendations: string[];
}

export interface CustomerProfile {
    genderDistribution: {
        male: number;
        female: number;
        other: number;
    };
    ageRange: string;
    mainInterests: string[];
    summary: string;
}

export interface SentimentTheme {
    theme: string;
    summary: string;
    mentions: number;
}

export interface SentimentAnalysis {
    positiveThemes: SentimentTheme[];
    negativeThemes: SentimentTheme[];
}

export interface KeywordVolumeResult {
    keyword: string;
    monthlyVolumes: { month: string; volume: number }[];
    analysis: string;
}

export interface GrowthProjection {
    analysis: string;
    projection: { month: string; projectedScore: number }[];
}

export interface GroundingChunk {
    maps?: {
        uri: string;
        title: string;
    };
    web?: {
        uri: string;
        title: string;
    };
}

export interface Suggestion {
  title: string;
  description: string;
  category: 'Informações' | 'Fotos' | 'Avaliações' | 'Postagens' | 'SEO Local';
}

export interface AnalysisResult {
  suggestions: Suggestion[];
}

export interface GroundingChunk {
  maps: {
    title: string;
    uri: string;
  };
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

export interface KeywordsResult {
  principais: string[];
  caudaLonga: string[];
  locais: string[];
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

export interface NeighborhoodInterest {
    name: string;
    interestScore: number;
}

export interface RadiusAnalysisResult {
    neighborhoods: NeighborhoodInterest[];
    analysisSummary: string;
}

export interface Idea {
    title: string;
    description: string;
    category: 'Postagens' | 'Promoções' | 'Eventos';
}

export interface Photo360Advice {
    title: string;
    description: string;
}

export interface IdeasResult {
    ideas: Idea[];
    photo360: Photo360Advice;
}

export interface LocalRankingResult {
    ranking: string;
    justification: string;
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

export interface ComparisonMetric {
    metric: string;
    yourBusiness: string;
    competitor: string;
}

export interface HeadToHeadAnalysis {
    competitorName: string;
    comparison: ComparisonMetric[];
    strategicRecommendations: string[];
}

export interface GenderDistribution {
    male: number;
    female: number;
    other: number;
}

export interface CustomerProfile {
    genderDistribution: GenderDistribution;
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

export interface MonthlyVolume {
    month: string;
    volume: number;
}

export interface KeywordVolumeResult {
    keyword: string;
    monthlyVolumes: MonthlyVolume[];
    analysis: string;
}
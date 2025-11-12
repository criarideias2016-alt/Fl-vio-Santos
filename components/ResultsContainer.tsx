import React, { useState, ReactNode, FC } from 'react';
import type { AnalysisResult, CompetitiveAnalysis, DetailedScorecardResult, GroundingChunk, IdeasResult, KeywordsResult, LocalRankingResult, RadiusAnalysisResult, ResponsesResult, SeoActionsResult, OptimizationBenefits, HeadToHeadAnalysis, CustomerProfile, SentimentAnalysis, GrowthProjection, ScorecardMetric } from '../types.ts';
import { ResultsDisplay } from './ResultsDisplay.tsx';
import { CompetitiveAnalysisDisplay } from './CompetitiveAnalysisDisplay.tsx';
import { KeywordDisplay, KeywordVolumeAnalyzer } from './KeywordDisplay.tsx';
import { ResponseTemplatesDisplay } from './ResponseTemplatesDisplay.tsx';
import { SeoActionsDisplay } from './SeoActionsDisplay.tsx';
import { RadiusAnalysisDisplay } from './RadiusAnalysisDisplay.tsx';
import { IdeaGeneratorDisplay } from './IdeaGeneratorDisplay.tsx';
import { LocalRankingDisplay } from './LocalRankingDisplay.tsx';
import { ScorecardDisplay } from './ScorecardDisplay.tsx';
import { OptimizationBenefitsDisplay } from './OptimizationBenefitsDisplay.tsx';
import { HeadToHeadAnalysisDisplay } from './HeadToHeadAnalysisDisplay.tsx';
import { CustomerProfileDisplay } from './CustomerProfileDisplay.tsx';
import { SentimentAnalysisDisplay } from './SentimentAnalysisDisplay.tsx';
import { GrowthProjectionDisplay } from './GrowthProjectionDisplay.tsx';
import { Photo360AnalysisDisplay } from './Photo360AnalysisDisplay.tsx';


interface ResultsContainerProps {
  analysisResult: AnalysisResult | null;
  competitiveAnalysis: CompetitiveAnalysis | null;
  localRanking: LocalRankingResult | null;
  detailedScorecard: DetailedScorecardResult | null;
  optimizationBenefits: OptimizationBenefits | null;
  headToHeadAnalysis: HeadToHeadAnalysis | null;
  customerProfile: CustomerProfile | null;
  sentimentAnalysis: SentimentAnalysis | null;
  growthProjection: GrowthProjection | null;
  photo360Metric: ScorecardMetric | null;
  keywords: KeywordsResult | null;
  responses: ResponsesResult | null;
  seoActions: SeoActionsResult | null;
  radiusAnalysis: RadiusAnalysisResult | null;
  ideas: IdeasResult | null;
  sourceLinks: GroundingChunk[];
  businessName: string;
  city: string;
  state: string;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
}

type SectionId = 'summary' | 'scorecard' | 'customer-profile' | 'sentiment' | 'benefits' | 'head-to-head' | 'suggestions' | 'keywords' | 'volume' | 'responses' | 'seo' | 'radius' | 'ideas' | 'photo-360';

const navItems: { id: SectionId, label: string, icon: ReactNode, color: string }[] = [
    { id: 'summary', label: 'Resumo', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>, color: 'text-[#4285F4]' },
    { id: 'scorecard', label: 'Scorecard SEO', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-[#34A853]' },
    { id: 'customer-profile', label: 'Perfil do Cliente', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>, color: 'text-[#EA4335]' },
    { id: 'sentiment', label: 'Sentimento', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>, color: 'text-[#FBCB0A]' },
    { id: 'benefits', label: 'Benefícios', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>, color: 'text-[#FBCB0A]' },
    { id: 'head-to-head', label: 'Análise Direta', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" /></svg>, color: 'text-[#EA4335]' },
    { id: 'suggestions', label: 'Sugestões', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-4.5 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-[#4285F4]' },
    { id: 'radius', label: 'Análise de Raio', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9M20.25 20.25h-4.5m4.5 0v-4.5m0-4.5L15 15" /></svg>, color: 'text-[#FBCB0A]' },
    { id: 'ideas', label: 'Ideias', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>, color: 'text-[#34A853]' },
    { id: 'photo-360', label: 'Foto 360', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>, color: 'text-[#EA4335]' },
    { id: 'keywords', label: 'Central de Conteúdo', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>, color: 'text-[#4285F4]' },
    { id: 'volume', label: 'Volume de Busca', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>, color: 'text-[#FBCB0A]' },
    { id: 'responses', label: 'Respostas', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.028z" /></svg>, color: 'text-[#34A853]' },
    { id: 'seo', label: 'Otimizador SEO', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>, color: 'text-[#EA4335]' },
  ];

export const ResultsContainer: FC<ResultsContainerProps> = ({
  analysisResult,
  competitiveAnalysis,
  localRanking,
  detailedScorecard,
  optimizationBenefits,
  headToHeadAnalysis,
  customerProfile,
  sentimentAnalysis,
  growthProjection,
  photo360Metric,
  keywords,
  responses,
  seoActions,
  radiusAnalysis,
  ideas,
  sourceLinks,
  businessName,
  city,
  state,
  onDownloadPdf,
  isGeneratingPdf,
}) => {
  const [activeSection, setActiveSection] = useState<SectionId>('summary');

  const contentClass = (id: SectionId) => {
    if (isGeneratingPdf) return 'block report-page-section mb-12';
    return activeSection === id ? 'block' : 'hidden';
  };

  const renderSection = (id: SectionId, component: ReactNode) => {
    if (!component) return null;
    return <div className={contentClass(id)}>{component}</div>;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
        <div className={isGeneratingPdf ? '' : 'md:grid md:grid-cols-12'}>
            <aside className={isGeneratingPdf ? 'hidden' : 'md:col-span-3 lg:col-span-2 p-4 border-r border-slate-200 dark:border-slate-700'}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">Relatório</h3>
                    <button 
                        onClick={onDownloadPdf}
                        disabled={isGeneratingPdf}
                        className="flex-shrink-0 flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-wait transition-all duration-300"
                        title="Baixar relatório completo em PDF"
                    >
                        {isGeneratingPdf ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        )}
                        <span className="hidden lg:inline text-sm">PDF</span>
                    </button>
                </div>
                <nav className="space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            title={item.label}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-md transition-colors duration-200 text-left ${
                            activeSection === item.id
                                ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <span className={item.color}>{item.icon}</span>
                            <span className="hidden lg:inline">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>
            <main id="report-content" className={isGeneratingPdf ? 'p-6 bg-white' : 'md:col-span-9 lg:col-span-10 p-6 lg:p-8'}>
                {renderSection('summary', (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2">
                                {competitiveAnalysis && <CompetitiveAnalysisDisplay result={competitiveAnalysis} mainBusinessName={businessName} />}
                            </div>
                            <div className="lg:col-span-1">
                                {localRanking && <LocalRankingDisplay result={localRanking} />}
                            </div>
                        </div>
                        {growthProjection && <GrowthProjectionDisplay result={growthProjection} />}
                    </div>
                ))}
                
                {renderSection('scorecard', detailedScorecard && <ScorecardDisplay result={detailedScorecard} />)}
                {renderSection('customer-profile', customerProfile && <CustomerProfileDisplay result={customerProfile} />)}
                {renderSection('sentiment', sentimentAnalysis && <SentimentAnalysisDisplay result={sentimentAnalysis} />)}
                {renderSection('benefits', optimizationBenefits && <OptimizationBenefitsDisplay result={optimizationBenefits} />)}
                {renderSection('head-to-head', headToHeadAnalysis && <HeadToHeadAnalysisDisplay result={headToHeadAnalysis} />)}
                {renderSection('suggestions', analysisResult && <ResultsDisplay result={analysisResult} sources={sourceLinks} />)}
                {renderSection('radius', radiusAnalysis && <RadiusAnalysisDisplay result={radiusAnalysis} />)}
                {renderSection('ideas', ideas && <IdeaGeneratorDisplay result={ideas} />)}
                {renderSection('photo-360', photo360Metric && <Photo360AnalysisDisplay result={photo360Metric} />)}
                {renderSection('keywords', keywords && <KeywordDisplay result={keywords} />)}
                {renderSection('volume', <KeywordVolumeAnalyzer city={city} state={state} />)}
                {renderSection('responses', responses && <ResponseTemplatesDisplay result={responses} />)}
                {renderSection('seo', seoActions && <SeoActionsDisplay result={seoActions} />)}
            </main>
        </div>
    </div>
  );
};
import React, { useState } from 'react';
import type { AnalysisResult, CompetitiveAnalysis, DetailedScorecardResult, GroundingChunk, IdeasResult, KeywordsResult, LocalRankingResult, RadiusAnalysisResult, ResponsesResult, SeoActionsResult } from '../types';
import { ResultsDisplay } from './ResultsDisplay';
import { CompetitiveAnalysisDisplay } from './CompetitiveAnalysisDisplay';
import { KeywordDisplay } from './KeywordDisplay';
import { ResponseTemplatesDisplay } from './ResponseTemplatesDisplay';
import { SeoActionsDisplay } from './SeoActionsDisplay';
import { RadiusAnalysisDisplay } from './RadiusAnalysisDisplay';
import { IdeaGeneratorDisplay } from './IdeaGeneratorDisplay';
import { LocalRankingDisplay } from './LocalRankingDisplay';
import { ScorecardDisplay } from './ScorecardDisplay';

interface ResultsContainerProps {
  analysisResult: AnalysisResult | null;
  competitiveAnalysis: CompetitiveAnalysis | null;
  localRanking: LocalRankingResult | null;
  detailedScorecard: DetailedScorecardResult | null;
  keywords: KeywordsResult | null;
  responses: ResponsesResult | null;
  seoActions: SeoActionsResult | null;
  radiusAnalysis: RadiusAnalysisResult | null;
  ideas: IdeasResult | null;
  sourceLinks: GroundingChunk[];
  businessName: string;
  onDownloadPdf: () => void;
}

type Tab = 'summary' | 'scorecard' | 'suggestions' | 'keywords' | 'responses' | 'seo' | 'radius' | 'ideas';

export const ResultsContainer: React.FC<ResultsContainerProps> = ({
  analysisResult,
  competitiveAnalysis,
  localRanking,
  detailedScorecard,
  keywords,
  responses,
  seoActions,
  radiusAnalysis,
  ideas,
  sourceLinks,
  businessName,
  onDownloadPdf,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  const tabs: { id: Tab, label: string, icon: React.ReactNode }[] = [
    { id: 'summary', label: 'Resumo', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg> },
    { id: 'scorecard', label: 'Scorecard SEO', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: 'suggestions', label: 'Sugestões', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-4.5 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: 'radius', label: 'Análise de Raio', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9M20.25 20.25h-4.5m4.5 0v-4.5m0-4.5L15 15" /></svg> },
    { id: 'ideas', label: 'Ideias', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg> },
    { id: 'keywords', label: 'Palavras-Chave', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg> },
    { id: 'responses', label: 'Respostas', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.028z" /></svg> },
    { id: 'seo', label: 'Otimizador SEO', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg> },
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border-b border-slate-700 gap-4">
        <div className="flex items-center flex-wrap gap-2">
            {tabs.map(tab => (
                 <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                   activeTab === tab.id
                     ? 'bg-cyan-600 text-white shadow-md'
                     : 'text-slate-300 hover:bg-slate-700'
                 }`}
               >
                 {tab.icon}
                 <span className="hidden sm:inline">{tab.label}</span>
               </button>
            ))}
        </div>
        <button 
            onClick={onDownloadPdf}
            className="flex-shrink-0 flex items-center gap-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105"
            title="Baixar relatório completo em PDF"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            <span className="hidden sm:inline">Baixar Relatório</span>
        </button>
      </div>

      <div id="report-content" className="p-6">
        {/* Report Header for PDF */}
        <div className="hidden print-block">
            <h1 className="text-3xl font-bold text-slate-100">Relatório de Otimização de Perfil</h1>
            <p className="text-xl text-cyan-400">{businessName}</p>
            <p className="text-sm text-slate-400 mb-8">Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className={activeTab === 'summary' ? 'block' : 'hidden'}>
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
               <div className="lg:col-span-3">
                {competitiveAnalysis && <CompetitiveAnalysisDisplay result={competitiveAnalysis} mainBusinessName={businessName} />}
               </div>
               <div className="lg:col-span-3">
                {localRanking && <LocalRankingDisplay result={localRanking} />}
              </div>
            </div>
          </div>
        </div>

        <div className={activeTab === 'scorecard' ? 'block' : 'hidden'}>
            {detailedScorecard && <ScorecardDisplay result={detailedScorecard} />}
        </div>
        
        <div className={activeTab === 'suggestions' ? 'block' : 'hidden'}>
            {analysisResult && <ResultsDisplay result={analysisResult} sources={sourceLinks} />}
        </div>

        <div className={activeTab === 'radius' ? 'block' : 'hidden'}>
          {radiusAnalysis && <RadiusAnalysisDisplay result={radiusAnalysis} />}
        </div>
        
        <div className={activeTab === 'ideas' ? 'block' : 'hidden'}>
          {ideas && <IdeaGeneratorDisplay result={ideas} />}
        </div>

        <div className={activeTab === 'keywords' ? 'block' : 'hidden'}>
          {keywords && <KeywordDisplay result={keywords} />}
        </div>
        
        <div className={activeTab === 'responses' ? 'block' : 'hidden'}>
          {responses && <ResponseTemplatesDisplay result={responses} />}
        </div>

        <div className={activeTab === 'seo' ? 'block' : 'hidden'}>
          {seoActions && <SeoActionsDisplay result={seoActions} />}
        </div>
      </div>
      <style>{`
        @media print {
            .no-print { display: none; }
            .print-block { display: block !important; }
        }
      `}</style>
    </div>
  );
};
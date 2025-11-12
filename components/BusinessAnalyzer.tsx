import React, { useState, useEffect, FC, ReactNode } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SearchForm } from './SearchForm.tsx';
import { LoadingIndicator } from './LoadingIndicator.tsx';
import { ResultsContainer } from './ResultsContainer.tsx';
import { ErrorMessage } from './ErrorMessage.tsx';
import { WelcomeScreen } from './WelcomeScreen.tsx';
import { DeveloperDashboard } from './DeveloperDashboard.tsx';
import * as geminiService from '../services/geminiService.ts';
import type { AnalysisResult, CompetitiveAnalysis, DetailedScorecardResult, GroundingChunk, IdeasResult, KeywordsResult, LocalRankingResult, RadiusAnalysisResult, ResponsesResult, SeoActionsResult, OptimizationBenefits, HeadToHeadAnalysis, CustomerProfile, SentimentAnalysis, GrowthProjection, ScorecardMetric } from '../types.ts';
import { useApiKeys } from '../../contexts/ApiKeyContext.tsx';


interface BusinessAnalyzerProps {
  initialAnalysis: { businessName: string; city: string; state: string; } | null;
  logoUrl: string | null;
}

type LoadingState = {
    isActive: boolean;
    stage: string;
};

export const BusinessAnalyzer: FC<BusinessAnalyzerProps> = ({ initialAnalysis, logoUrl }) => {
  const [businessName, setBusinessName] = useState<string>(initialAnalysis?.businessName || '');
  const [city, setCity] = useState<string>(initialAnalysis?.city || '');
  const [state, setState] = useState<string>(initialAnalysis?.state || '');
  
  const [loadingState, setLoadingState] = useState<LoadingState>({ isActive: false, stage: '' });
  const [error, setError] = useState<string | null>(null);

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState<CompetitiveAnalysis | null>(null);
  const [localRanking, setLocalRanking] = useState<LocalRankingResult | null>(null);
  const [detailedScorecard, setDetailedScorecard] = useState<DetailedScorecardResult | null>(null);
  const [optimizationBenefits, setOptimizationBenefits] = useState<OptimizationBenefits | null>(null);
  const [headToHeadAnalysis, setHeadToHeadAnalysis] = useState<HeadToHeadAnalysis | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<SentimentAnalysis | null>(null);
  const [growthProjection, setGrowthProjection] = useState<GrowthProjection | null>(null);
  const [keywords, setKeywords] = useState<KeywordsResult | null>(null);
  const [responses, setResponses] = useState<ResponsesResult | null>(null);
  const [seoActions, setSeoActions] = useState<SeoActionsResult | null>(null);
  const [radiusAnalysis, setRadiusAnalysis] = useState<RadiusAnalysisResult | null>(null);
  const [ideas, setIdeas] = useState<IdeasResult | null>(null);
  const [photo360Metric, setPhoto360Metric] = useState<ScorecardMetric | null>(null);

  const [sourceLinks, setSourceLinks] = useState<GroundingChunk[]>([]);
  
  const [isDevDashboardOpen, setIsDevDashboardOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { geminiApiKey } = useApiKeys();

  const resetState = () => {
    setLoadingState({ isActive: false, stage: '' });
    setError(null);
    setAnalysisResult(null);
    setCompetitiveAnalysis(null);
    setLocalRanking(null);
    setDetailedScorecard(null);
    setOptimizationBenefits(null);
    setHeadToHeadAnalysis(null);
    setCustomerProfile(null);
    setSentimentAnalysis(null);
    setGrowthProjection(null);
    setKeywords(null);
    setResponses(null);
    setSeoActions(null);
    setRadiusAnalysis(null);
    setIdeas(null);
    setPhoto360Metric(null);
    setSourceLinks([]);
  };

  const handleAnalyze = async () => {
    if (!geminiApiKey) {
      setError("Por favor, configure sua chave de API do Gemini nas configurações antes de iniciar uma análise.");
      return;
    }

    resetState();
    setLoadingState({ isActive: true, stage: 'Coletando informações da empresa...' });

    try {
        const { businessData } = await geminiService.fetchBusinessInfo(geminiApiKey, businessName, city, state);
        
        setLoadingState({ isActive: true, stage: 'Executando análises primárias...' });
        const [
            scorecardData,
            analysisData,
            competitorData,
            rankingData,
            keywordsData,
            responsesData,
            seoActionsData,
            radiusData,
            ideasData,
            customerProfileData,
            sentimentData,
            benefitsData,
        ] = await Promise.all([
            geminiService.getDetailedScorecard(geminiApiKey, businessData),
            geminiService.getImprovementSuggestions(geminiApiKey, businessData),
            geminiService.getCompetitorAnalysis(geminiApiKey, businessName, city, state),
            geminiService.getLocalRanking(geminiApiKey, businessData),
            geminiService.getKeywordSuggestions(geminiApiKey, businessData),
            geminiService.getResponseTemplates(geminiApiKey, businessData),
            geminiService.getSeoActions(geminiApiKey, businessData),
            geminiService.getRadiusAnalysis(geminiApiKey, businessData),
            geminiService.getIdeaSuggestions(geminiApiKey, businessData),
            geminiService.getCustomerProfileAnalysis(geminiApiKey, businessData),
            geminiService.getReviewSentimentAnalysis(geminiApiKey, businessData),
            geminiService.getOptimizationBenefits(geminiApiKey),
        ]);

        setDetailedScorecard(scorecardData);
        setAnalysisResult(analysisData);
        setCompetitiveAnalysis(competitorData);
        setLocalRanking(rankingData);
        setKeywords(keywordsData);
        setResponses(responsesData);
        setSeoActions(seoActionsData);
        setRadiusAnalysis(radiusData);
        setIdeas(ideasData);
        setCustomerProfile(customerProfileData);
        setSentimentAnalysis(sentimentData);
        setOptimizationBenefits(benefitsData);
        
        let metric360 = scorecardData.metrics.find(m => m.name === "Fotografias 360º");
        if (!metric360) {
            // Fallback inteligente para garantir que a seção 360 sempre seja exibida
            metric360 = {
                name: "Fotografias 360º",
                description: "Fotos 360º de alta qualidade no perfil da sua empresa podem melhorar a experiência do usuário e fazer os clientes encontrarem você mais facilmente.",
                analysis: "Nenhuma funcionalidade de tour virtual 360° foi detectada no perfil. Esta é uma grande oportunidade perdida para engajar clientes e se destacar da concorrência local.",
                status: 'Fraco',
                score: 10 // Pontuação baixa padrão para indicar ausência
            };
        }
        setPhoto360Metric(metric360);


        setLoadingState({ isActive: true, stage: 'Finalizando relatório...' });
        
        const mainBusiness = competitorData?.analysis.find(c => c.name.trim().toLowerCase().includes(businessName.trim().toLowerCase()));
        const topCompetitor = competitorData?.analysis.filter(c => c.name !== mainBusiness?.name)[0];

        // Execute dependent analyses in parallel but handle failures gracefully
        await Promise.allSettled([
            (async () => {
                if (mainBusiness) {
                    try {
                        const projection = await geminiService.getGrowthProjection(geminiApiKey, businessData, mainBusiness.visibilityScore);
                        setGrowthProjection(projection);
                    } catch (e) { console.error("Falha ao buscar projeção de crescimento:", e); }
                }
            })(),
            (async () => {
                if (topCompetitor) {
                    try {
                        const h2h = await geminiService.getHeadToHeadAnalysis(geminiApiKey, businessData, topCompetitor.name);
                        setHeadToHeadAnalysis(h2h);
                    } catch (e) { console.error("Falha ao buscar análise direta:", e); }
                }
            })()
        ]);

    } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
        setLoadingState({ isActive: false, stage: '' });
    }
  };

   const handleDownloadPdf = async () => {
        setIsGeneratingPdf(true);
        const root = document.documentElement;
        const wasDark = root.classList.contains('dark');

        // Force light theme for consistent PDF output
        if (wasDark) {
            root.classList.remove('dark');
        }
        
        // Allow DOM to re-render in light theme before capturing canvas
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const reportElement = document.getElementById('report-content');
            if (!reportElement) {
                throw new Error("Elemento do relatório não encontrado para gerar o PDF.");
            }

            const doc = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: 'a4',
                hotfixes: ['px_scaling'],
            });

            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = doc.internal.pageSize.getHeight();

            // Cover Page
            doc.setFillColor(248, 250, 252); // slate-50
            doc.rect(0, 0, pdfWidth, pdfHeight, 'F');
            if (logoUrl) {
                doc.addImage(logoUrl, 'PNG', pdfWidth / 2 - 50, 80, 100, 40, undefined, 'FAST');
            }
            doc.setFontSize(24);
            doc.setTextColor(15, 23, 42); // slate-900
            doc.text('Relatório de Análise de Perfil de Empresa', pdfWidth / 2, 180, { align: 'center' });
            doc.setFontSize(16);
            doc.text(businessName, pdfWidth / 2, 210, { align: 'center' });
            doc.setFontSize(12);
            doc.setTextColor(100, 116, 139); // slate-500
            doc.text(`${city}, ${state}`, pdfWidth / 2, 230, { align: 'center' });
            doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pdfWidth / 2, 250, { align: 'center' });

            // Content Pages
            const sections = reportElement.querySelectorAll('.report-page-section');
            for (let i = 0; i < sections.length; i++) {
                doc.addPage();
                const canvas = await html2canvas(sections[i] as HTMLElement, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });
                const imgData = canvas.toDataURL('image/png');
                const imgProps = doc.getImageProperties(imgData);
                const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
                doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight, undefined, 'FAST');
            }

            doc.save(`Relatorio_${businessName.replace(/\s/g, '_')}.pdf`);
        } catch(e) {
            console.error(e);
            setError(e instanceof Error ? e.message : "Ocorreu um erro desconhecido ao gerar o PDF.");
        } finally {
            // Restore theme if it was changed
            if (wasDark) {
                root.classList.add('dark');
            }
            setIsGeneratingPdf(false);
        }
    };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsDevDashboardOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderContent = () => {
    if (loadingState.isActive) {
      return <LoadingIndicator message={loadingState.stage} />;
    }
    if (error) {
      const isApiKeyError = error.includes("API key not valid");
      const errorMessageNode = (
        <div>
          {error}
          {isApiKeyError && (
             <p className="mt-2 text-sm">
              <strong>Possível solução:</strong> A chave de API do Gemini pode estar incorreta ou mal configurada. Verifique a chave nas configurações e tente novamente.
            </p>
          )}
        </div>
      );
      return (
        <div>
          <ErrorMessage message={errorMessageNode} />
          <button onClick={resetState} className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
            Tentar Novamente
          </button>
        </div>
      );
    }
    if (analysisResult) {
      return (
        <ResultsContainer
          analysisResult={analysisResult}
          competitiveAnalysis={competitiveAnalysis}
          localRanking={localRanking}
          detailedScorecard={detailedScorecard}
          optimizationBenefits={optimizationBenefits}
          headToHeadAnalysis={headToHeadAnalysis}
          customerProfile={customerProfile}
          sentimentAnalysis={sentimentAnalysis}
          growthProjection={growthProjection}
          photo360Metric={photo360Metric}
          keywords={keywords}
          responses={responses}
          seoActions={seoActions}
          radiusAnalysis={radiusAnalysis}
          ideas={ideas}
          sourceLinks={sourceLinks}
          businessName={businessName}
          city={city}
          state={state}
          onDownloadPdf={handleDownloadPdf}
          isGeneratingPdf={isGeneratingPdf}
        />
      );
    }
    return (
       <div className="space-y-8">
          <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
              <SearchForm
                  businessName={businessName}
                  setBusinessName={setBusinessName}
                  city={city}
                  setCity={setCity}
                  state={state}
                  setState={setState}
                  onAnalyze={handleAnalyze}
                  isLoading={loadingState.isActive}
              />
          </div>
          <WelcomeScreen />
        </div>
    );
  };
  
  return (
    <>
      {renderContent()}
      <DeveloperDashboard 
        isOpen={isDevDashboardOpen} 
        onClose={() => setIsDevDashboardOpen(false)}
      />
    </>
  );
};
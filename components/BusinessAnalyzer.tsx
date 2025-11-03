
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { AnalysisResult, GroundingChunk, CompetitiveAnalysis, KeywordsResult, ResponsesResult, SeoActionsResult, RadiusAnalysisResult, IdeasResult, LocalRankingResult, DetailedScorecardResult, OptimizationBenefits, HeadToHeadAnalysis, CustomerProfile, SentimentAnalysis } from '../types';
import { getImprovementSuggestions, fetchBusinessInfo, getCompetitorAnalysis, getKeywordSuggestions, getResponseTemplates, getSeoActions, getRadiusAnalysis, getIdeaSuggestions, getLocalRanking, getDetailedScorecard, getOptimizationBenefits, getHeadToHeadAnalysis, getCustomerProfileAnalysis, getReviewSentimentAnalysis } from '../services/geminiService';
import { SearchForm } from './SearchForm';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorMessage } from './ErrorMessage';
import { WelcomeScreen } from './WelcomeScreen';
import { ResultsContainer } from './ResultsContainer';
import { DeveloperDashboard } from './DeveloperDashboard';
import { SettingsModal } from './SettingsModal';
import { useAuth } from '../contexts/AuthContext';


declare const jspdf: any;
declare const html2canvas: any;

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}


export const BusinessAnalyzer: React.FC = () => {
  const { logout } = useAuth();
  const [businessName, setBusinessName] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState<CompetitiveAnalysis | null>(null);
  const [keywords, setKeywords] = useState<KeywordsResult | null>(null);
  const [responses, setResponses] = useState<ResponsesResult | null>(null);
  const [seoActions, setSeoActions] = useState<SeoActionsResult | null>(null);
  const [radiusAnalysis, setRadiusAnalysis] = useState<RadiusAnalysisResult | null>(null);
  const [ideas, setIdeas] = useState<IdeasResult | null>(null);
  const [localRanking, setLocalRanking] = useState<LocalRankingResult | null>(null);
  const [detailedScorecard, setDetailedScorecard] = useState<DetailedScorecardResult | null>(null);
  const [optimizationBenefits, setOptimizationBenefits] = useState<OptimizationBenefits | null>(null);
  const [headToHeadAnalysis, setHeadToHeadAnalysis] = useState<HeadToHeadAnalysis | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<SentimentAnalysis | null>(null);
  const [sourceLinks, setSourceLinks] = useState<GroundingChunk[]>([]);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isDevDashboardOpen, setIsDevDashboardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem('custom_logo_png_base64');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, []);

  const handleLogoUpdate = (newLogoUrl: string | null) => {
    setLogoUrl(newLogoUrl);
    if (newLogoUrl) {
      localStorage.setItem('custom_logo_png_base64', newLogoUrl);
    } else {
      localStorage.removeItem('custom_logo_png_base64');
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type === 'image/png') {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleLogoUpdate(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Por favor, selecione um arquivo no formato PNG.');
        }
    }
  };

  const handleRemoveLogo = () => {
      handleLogoUpdate(null);
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


  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) {
      return;
    }
    installPrompt.prompt();
    installPrompt.userChoice.then(() => {
      setInstallPrompt(null);
    });
  };

  const resetState = useCallback(() => {
    setError(null);
    setAnalysisResult(null);
    setCompetitiveAnalysis(null);
    setKeywords(null);
    setResponses(null);
    setSeoActions(null);
    setRadiusAnalysis(null);
    setIdeas(null);
    setLocalRanking(null);
    setDetailedScorecard(null);
    setOptimizationBenefits(null);
    setHeadToHeadAnalysis(null);
    setCustomerProfile(null);
    setSentimentAnalysis(null);
    setSourceLinks([]);
    setAnalysisCompleted(false);
    setIsLoading(false);
    setLoadingMessage('');
  }, []);

  const handleAnalyze = async () => {
    resetState();
    setIsLoading(true);
    setAnalysisCompleted(false);

    try {
      setLoadingMessage('Buscando informações da empresa...');
      const { businessData, groundingChunks } = await fetchBusinessInfo(businessName, city, state);
      setSourceLinks(groundingChunks);

      setLoadingMessage('Analisando concorrência...');
      const competitorPromise = getCompetitorAnalysis(businessName, city, state);
      
      setLoadingMessage('Avaliando ranqueamento local...');
      const rankingPromise = getLocalRanking(businessData);

      setLoadingMessage('Gerando scorecard detalhado...');
      const scorecardPromise = getDetailedScorecard(businessData);
      
      setLoadingMessage('Analisando perfil do cliente...');
      const customerProfilePromise = getCustomerProfileAnalysis(businessData);
      
      setLoadingMessage('Analisando sentimento das avaliações...');
      const sentimentAnalysisPromise = getReviewSentimentAnalysis(businessData);

      setLoadingMessage('Gerando sugestões de palavras-chave...');
      const keywordsPromise = getKeywordSuggestions(businessData);

      setLoadingMessage('Analisando raio de atuação...');
      const radiusPromise = getRadiusAnalysis(businessData);
      
      setLoadingMessage('Criando plano de ação SEO...');
      const seoActionsPromise = getSeoActions(businessData);
      
      setLoadingMessage('Gerando modelos de resposta...');
      const responsesPromise = getResponseTemplates(businessData);

      setLoadingMessage('Compilando sugestões de melhoria...');
      const suggestionsPromise = getImprovementSuggestions(businessData);
      
      setLoadingMessage('Gerando ideias criativas...');
      const ideasPromise = getIdeaSuggestions(businessData);
      
      setLoadingMessage('Listando benefícios da otimização...');
      const benefitsPromise = getOptimizationBenefits();
      
      const [
          competitors,
          ranking,
          scorecard,
          customer,
          sentiment,
          keywordsResult,
          radius,
          seo,
          responsesResult,
          suggestions,
          ideasResult,
          benefits
      ] = await Promise.all([
          competitorPromise,
          rankingPromise,
          scorecardPromise,
          customerProfilePromise,
          sentimentAnalysisPromise,
          keywordsPromise,
          radiusPromise,
          seoActionsPromise,
          responsesPromise,
          suggestionsPromise,
          ideasPromise,
          benefitsPromise
      ]);
      
      setCompetitiveAnalysis(competitors);
      setLocalRanking(ranking);
      setDetailedScorecard(scorecard);
      setCustomerProfile(customer);
      setSentimentAnalysis(sentiment);
      setKeywords(keywordsResult);
      setRadiusAnalysis(radius);
      setSeoActions(seo);
      setResponses(responsesResult);
      setAnalysisResult(suggestions);
      setIdeas(ideasResult);
      setOptimizationBenefits(benefits);

      if (competitors && competitors.analysis.length > 1) {
          const mainBusiness = competitors.analysis.find(c => c.name.trim().toLowerCase().includes(businessName.trim().toLowerCase()));
          const topCompetitor = competitors.analysis.find(c => c.name !== mainBusiness?.name);
          if (topCompetitor) {
              setLoadingMessage(`Analisando vs. ${topCompetitor.name}...`);
              const h2h = await getHeadToHeadAnalysis(businessData, topCompetitor.name);
              setHeadToHeadAnalysis(h2h);
          }
      }

      setAnalysisCompleted(true);
    } catch (err) {
      if (err instanceof Error) {
        const lowerCaseMessage = err.message.toLowerCase();
        if (
          lowerCaseMessage.includes('quota') ||
          lowerCaseMessage.includes('rate limit') ||
          lowerCaseMessage.includes('billing') ||
          lowerCaseMessage.includes('api key not valid') ||
          lowerCaseMessage.includes('api_key') ||
          lowerCaseMessage.includes('permission denied')
        ) {
          setError(
            <>
              <strong>Problema com a Chave de API.</strong>
              <span className="block mt-1">Verifique se sua chave é válida e se o faturamento está ativado em seu projeto do Google Cloud para evitar limites de uso. Se o erro persistir, tente gerar uma nova chave nas configurações. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-red-900">Saiba mais sobre faturamento.</a></span>
            </>
          );
        } else {
          setError(err.message);
        }
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  const generatePdf = async () => {
    setIsGeneratingPdf(true);
    
    // Give React time to re-render with all sections visible
    await new Promise(resolve => setTimeout(resolve, 200));

    const reportElement = document.getElementById('report-content');
    if (reportElement) {
        const { jsPDF } = jspdf;
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4',
            putOnlyUsedFonts: true,
            floatPrecision: 'smart'
        });
        
        const canvas = await html2canvas(reportElement, {
            scale: 2, // Higher resolution for better quality
            useCORS: true,
            logging: false,
            width: reportElement.scrollWidth,
            height: reportElement.scrollHeight,
            windowWidth: reportElement.scrollWidth,
            windowHeight: reportElement.scrollHeight,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);

        const margin = 40; // 40pt margin on all sides
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const contentWidth = pdfWidth - 2 * margin;
        const contentHeight = pdfHeight - 2 * margin;

        // Calculate the height of the image when scaled to fit the contentWidth
        const imgRenderHeight = (imgProps.height * contentWidth) / imgProps.width;

        let heightLeft = imgRenderHeight;
        let position = 0;
        let page = 1;
        const totalPages = Math.ceil(imgRenderHeight / contentHeight);

        const addHeaderAndFooter = () => {
          pdf.setFontSize(8);
          pdf.setTextColor(150);
          
          // Header
          const headerText = `Relatório de Análise - ${businessName || 'Empresa'}`;
          pdf.text(headerText, margin, margin / 2 + 5);

          // Footer
          const footerText = `Página ${page} de ${totalPages}`;
          const footerTextWidth = pdf.getTextWidth(footerText);
          pdf.text(footerText, pdfWidth - margin - footerTextWidth, pdfHeight - margin / 2 + 5);
        };
        
        // Add first page
        addHeaderAndFooter();
        pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, imgRenderHeight);
        heightLeft -= contentHeight;

        // Add subsequent pages if needed
        while (heightLeft > 0) {
            page++;
            position -= contentHeight;
            pdf.addPage();
            addHeaderAndFooter();
            pdf.addImage(imgData, 'PNG', margin, position + margin, contentWidth, imgRenderHeight);
            heightLeft -= contentHeight;
        }

        const fileName = `Relatorio_${businessName.replace(/\s/g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
        pdf.save(fileName);
    }
    
    setIsGeneratingPdf(false);
  };


  return (
    <>
      <div className="bg-slate-100 min-h-screen">
          <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-slate-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                      <input type="file" accept="image/png" ref={fileInputRef} onChange={handleLogoFileChange} className="hidden" />
                      {logoUrl ? (
                        <>
                          <img src={logoUrl} alt="Logomarca da Empresa" className="h-10 object-contain" />
                          <button onClick={() => setIsSettingsOpen(true)} className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors" title="Configurações">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" /></svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-600"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                          <h1 className="text-xl font-bold text-slate-800">Analisador de Perfil</h1>
                           <button onClick={() => setIsSettingsOpen(true)} className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors" title="Configurações">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" /></svg>
                          </button>
                        </>
                      )}
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={logout} className="font-semibold text-slate-600 hover:text-blue-600 transition-colors">Sair</button>
                    {installPrompt && (
                    <button onClick={handleInstallClick} className="hidden sm:flex items-center gap-2 bg-slate-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-900 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        Instalar App
                    </button>
                    )}
                  </div>
              </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200/80 mb-8">
                  <SearchForm
                      businessName={businessName}
                      setBusinessName={setBusinessName}
                      city={city}
                      setCity={setCity}
                      state={state}
                      setState={setState}
                      onAnalyze={handleAnalyze}
                      isLoading={isLoading}
                  />
              </div>

              {analysisCompleted ? (
                  <ResultsContainer
                      analysisResult={analysisResult}
                      competitiveAnalysis={competitiveAnalysis}
                      localRanking={localRanking}
                      detailedScorecard={detailedScorecard}
                      optimizationBenefits={optimizationBenefits}
                      headToHeadAnalysis={headToHeadAnalysis}
                      customerProfile={customerProfile}
                      sentimentAnalysis={sentimentAnalysis}
                      keywords={keywords}
                      responses={responses}
                      seoActions={seoActions}
                      radiusAnalysis={radiusAnalysis}
                      ideas={ideas}
                      sourceLinks={sourceLinks}
                      businessName={businessName}
                      city={city}
                      state={state}
                      onDownloadPdf={generatePdf}
                      isGeneratingPdf={isGeneratingPdf}
                  />
              ) : (
                <div className="space-y-6">
                  {isLoading && <LoadingIndicator message={loadingMessage} />}
                  {error && <ErrorMessage message={error} />}
                  {!isLoading && !error && <WelcomeScreen />}
                </div>
              )}
          </main>
      </div>
      <DeveloperDashboard 
        isOpen={isDevDashboardOpen} 
        onClose={() => setIsDevDashboardOpen(false)}
      />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        logoUrl={logoUrl}
        onLogoUpdate={handleLogoUpdate}
      />
    </>
  );
};

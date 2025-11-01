import React, { useState, useEffect, useCallback } from 'react';
import type { AnalysisResult, GroundingChunk, UserLocation, CompetitiveAnalysis, KeywordsResult, ResponsesResult, SeoActionsResult, RadiusAnalysisResult, IdeasResult, LocalRankingResult, DetailedScorecardResult } from './types';
import { getImprovementSuggestions, fetchBusinessInfo, getCompetitorAnalysis, getKeywordSuggestions, getResponseTemplates, getSeoActions, getRadiusAnalysis, getIdeaSuggestions, getLocalRanking, getDetailedScorecard } from './services/geminiService';
import { SearchForm } from './components/SearchForm';
import { LoadingIndicator } from './components/LoadingIndicator';
import { ErrorMessage } from './components/ErrorMessage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ResultsContainer } from './components/ResultsContainer';

declare const jspdf: any;
declare const html2canvas: any;

const App: React.FC = () => {
  const [businessName, setBusinessName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState<CompetitiveAnalysis | null>(null);
  const [keywords, setKeywords] = useState<KeywordsResult | null>(null);
  const [responses, setResponses] = useState<ResponsesResult | null>(null);
  const [seoActions, setSeoActions] = useState<SeoActionsResult | null>(null);
  const [radiusAnalysis, setRadiusAnalysis] = useState<RadiusAnalysisResult | null>(null);
  const [ideas, setIdeas] = useState<IdeasResult | null>(null);
  const [localRanking, setLocalRanking] = useState<LocalRankingResult | null>(null);
  const [detailedScorecard, setDetailedScorecard] = useState<DetailedScorecardResult | null>(null);
  const [sourceLinks, setSourceLinks] = useState<GroundingChunk[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (geoError) => {
        console.warn('Geolocation denied. App will work but searches might be less accurate.', geoError.message);
      }
    );
  }, []);

  const resetState = () => {
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
    setSourceLinks([]);
    setAnalysisCompleted(false);
  };

  const handleAnalyze = useCallback(async () => {
    if (!businessName.trim()) {
      setError('Por favor, insira o nome de uma empresa.');
      return;
    }

    setIsLoading(true);
    resetState();

    try {
      setLoadingMessage('Buscando informações da empresa...');
      const { businessData, groundingChunks } = await fetchBusinessInfo(businessName, userLocation);
      setSourceLinks(groundingChunks || []);
      
      setLoadingMessage('Criando scorecard SEO detalhado...');
      const scorecardData = await getDetailedScorecard(businessData);
      setDetailedScorecard(scorecardData);

      setLoadingMessage('Gerando sugestões de melhoria...');
      const suggestions = await getImprovementSuggestions(businessData);
      setAnalysisResult(suggestions);

      setLoadingMessage('Analisando a concorrência...');
      const competitorData = await getCompetitorAnalysis(businessName, userLocation);
      setCompetitiveAnalysis(competitorData);
      
      setLoadingMessage('Analisando ranqueamento local...');
      const rankingData = await getLocalRanking(businessData);
      setLocalRanking(rankingData);

      setLoadingMessage('Gerando palavras-chave...');
      const keywordData = await getKeywordSuggestions(businessData);
      setKeywords(keywordData);

      setLoadingMessage('Criando modelos de resposta...');
      const responseData = await getResponseTemplates(businessData);
      setResponses(responseData);

      setLoadingMessage('Otimizando estratégias de SEO...');
      const seoData = await getSeoActions(businessData);
      setSeoActions(seoData);

      setLoadingMessage('Analisando raio de busca...');
      const radiusData = await getRadiusAnalysis(businessData, userLocation);
      setRadiusAnalysis(radiusData);

      setLoadingMessage('Gerando ideias criativas...');
      const ideaData = await getIdeaSuggestions(businessData);
      setIdeas(ideaData);

      setAnalysisCompleted(true);

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
      setError(`Não foi possível concluir a análise. ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [businessName, userLocation]);

  const handleDownloadPdf = async () => {
    const reportElement = document.getElementById('report-content');
    if (!reportElement) return;

    setIsLoading(true);
    setLoadingMessage('Gerando PDF...');

    try {
        const canvas = await html2canvas(reportElement, { 
            scale: 2,
            backgroundColor: '#0f172a' // bg-slate-900
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgProps= pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }
        
        const safeFileName = businessName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        pdf.save(`relatorio_${safeFileName}.pdf`);

    } catch (error) {
        console.error("Error generating PDF:", error);
        setError("Não foi possível gerar o PDF.");
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
            Otimizador de Perfil de Empresa
          </h1>
          <p className="text-lg text-slate-400">
            Uma suíte completa para analisar, otimizar e dominar a presença da sua empresa no Google.
          </p>
        </header>

        <main>
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700">
            <SearchForm
              businessName={businessName}
              setBusinessName={setBusinessName}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              isLocationAvailable={!!userLocation}
            />
          </div>

          <div className="mt-8 space-y-12">
            {isLoading && <LoadingIndicator message={loadingMessage} />}
            {error && <ErrorMessage message={error} />}
            
            {!isLoading && !error && !analysisCompleted && <WelcomeScreen />}
            
            {analysisCompleted && (
              <ResultsContainer
                analysisResult={analysisResult}
                competitiveAnalysis={competitiveAnalysis}
                localRanking={localRanking}
                detailedScorecard={detailedScorecard}
                keywords={keywords}
                responses={responses}
                seoActions={seoActions}
                radiusAnalysis={radiusAnalysis}
                ideas={ideas}
                sourceLinks={sourceLinks}
                businessName={businessName}
                onDownloadPdf={handleDownloadPdf}
              />
            )}
          </div>
        </main>

        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Powered by Google Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
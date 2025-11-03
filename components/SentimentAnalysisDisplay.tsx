import React from 'react';
import type { SentimentAnalysis, SentimentTheme } from '../types';

interface SentimentAnalysisDisplayProps {
  result: SentimentAnalysis;
}

const ThemeCard: React.FC<{ theme: SentimentTheme; type: 'positive' | 'negative' }> = ({ theme, type }) => {
    const styles = {
        positive: {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M6.633 10.5l-1.87-1.87a.75.75 0 00-1.06 0l-1.06 1.06a.75.75 0 000 1.06l4.5 4.5a.75.75 0 001.06 0l6.364-6.364a.75.75 0 00-1.06-1.06L6.633 10.5z" /></svg>,
            textColor: 'text-green-700',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        negative: {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-8.024a4.5 4.5 0 01-1.22 6.22l-6.44 6.44a4.5 4.5 0 01-6.22-1.22l-1.12-1.98a4.5 4.5 0 011.22-6.22l6.44-6.44a4.5 4.5 0 016.22 1.22l1.12 1.98z" /></svg>,
            textColor: 'text-red-700',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
        }
    };
    const style = styles[type];

    return (
        <div className={`p-5 rounded-lg border ${style.bgColor} ${style.borderColor}`}>
            <div className="flex items-start gap-4">
                <div className={`${style.textColor} flex-shrink-0 mt-1`}>
                    {style.icon}
                </div>
                <div>
                    <h4 className={`font-bold text-lg ${style.textColor}`}>{theme.theme}</h4>
                    <p className="text-slate-600 mt-1">{theme.summary}</p>
                    <div className={`mt-3 text-sm font-semibold ${style.textColor}`}>
                        {theme.mentions}% de menções
                    </div>
                </div>
            </div>
        </div>
    );
};


export const SentimentAnalysisDisplay: React.FC<SentimentAnalysisDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-6">Análise de Sentimento das Avaliações</h2>
        <p className="text-slate-600 mb-6">
            A IA analisou as avaliações mais recentes para identificar os principais temas mencionados pelos seus clientes, revelando seus pontos fortes e oportunidades de melhoria.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
              Temas Positivos Recorrentes
            </h3>
            <div className="space-y-4">
              {result.positiveThemes.map((theme, index) => (
                <ThemeCard key={`pos-${index}`} theme={theme} type="positive" />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-red-700 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>
              Pontos de Melhoria (Oportunidades)
            </h3>
            <div className="space-y-4">
              {result.negativeThemes.map((theme, index) => (
                <ThemeCard key={`neg-${index}`} theme={theme} type="negative" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
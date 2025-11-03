import React from 'react';
import type { IdeasResult, Idea } from '../types';

interface IdeaGeneratorDisplayProps {
  result: IdeasResult;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  Postagens: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg>,
  Promoções: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>,
  Eventos: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M9.75 12.75h4.5" /></svg>,
};


const IdeaCard: React.FC<{ idea: Idea }> = ({ idea }) => {
    const icon = categoryIcons[idea.category] || null;
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
                <div className="text-blue-600">{icon}</div>
                <div>
                    <span className="text-sm font-medium text-gray-500">{idea.category}</span>
                    <h4 className="text-md font-bold text-gray-700">{idea.title}</h4>
                </div>
            </div>
            <p className="text-gray-600 text-sm">{idea.description}</p>
        </div>
    );
};

export const IdeaGeneratorDisplay: React.FC<IdeaGeneratorDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-6">Gerador de Ideias Criativas</h2>
        <p className="text-gray-600 mb-6">Inspire-se com estas sugestões para engajar sua comunidade local e atrair novos clientes.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Ideias de Marketing e Conteúdo</h3>
            {result.ideas.map((idea, index) => (
                <IdeaCard key={index} idea={idea} />
            ))}
          </div>

          <div className="p-6 bg-gradient-to-br from-blue-100 to-gray-50 rounded-lg border-2 border-blue-300 shadow-lg shadow-blue-500/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{result.photo360.title}</h3>
                </div>
                <p className="text-blue-900/90 whitespace-pre-line">{result.photo360.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
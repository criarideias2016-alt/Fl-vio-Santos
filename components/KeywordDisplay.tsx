import React from 'react';
import type { KeywordsResult } from '../types';

interface KeywordDisplayProps {
  result: KeywordsResult;
}

const KeywordCategory: React.FC<{ title: string; keywords: string[]; icon: React.ReactNode }> = ({ title, keywords, icon }) => {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Maybe add a toast notification here in a future version
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
                <div className="text-cyan-400">{icon}</div>
                <h3 className="text-lg font-bold text-slate-100">{title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleCopy(keyword)}
                        className="group relative bg-slate-700 text-slate-300 text-sm font-medium px-3 py-1 rounded-full hover:bg-cyan-500 hover:text-white transition-colors duration-200"
                        title="Clique para copiar"
                    >
                        {keyword}
                    </button>
                ))}
            </div>
        </div>
    );
};


export const KeywordDisplay: React.FC<KeywordDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Sugestões de Palavras-Chave</h2>
            <p className="text-slate-400 mb-6">Use estas palavras-chave em seu perfil, postagens e site para melhorar seu ranking.</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <KeywordCategory 
                    title="Principais" 
                    keywords={result.principais} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <KeywordCategory 
                    title="Cauda Longa" 
                    keywords={result.caudaLonga}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>}

                />
                <KeywordCategory 
                    title="Locais" 
                    keywords={result.locais}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>}
                />
            </div>
        </div>
    </div>
  );
};

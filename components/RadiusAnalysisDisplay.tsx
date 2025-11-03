import React from 'react';
import type { RadiusAnalysisResult } from '../types';

interface RadiusAnalysisDisplayProps {
  result: RadiusAnalysisResult;
}

const NeighborhoodBar: React.FC<{ name: string; score: number }> = ({ name, score }) => {
    return (
        <div className="flex items-center gap-4 text-sm">
            <div className="w-1/3 text-slate-700 truncate text-right pr-2 flex items-center justify-end gap-2" title={name}>
                <span>{name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400 flex-shrink-0"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.27.61-.474l.21-.202a.75.75 0 00-1.06-1.06l-.21.202-.016.015a15.247 15.247 0 01-.21.15c-.16.101-.315.188-.44.254l-.117.058a.75.75 0 10.523 1.352l.001-.001z" clipRule="evenodd" /><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13.25a.75.75 0 00-1.5 0v4.5c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75v-3z" /></svg>
            </div>
            <div className="w-2/3 bg-slate-200 rounded-md h-8">
                <div 
                    className="bg-[#4285F4] h-8 rounded-md transition-all duration-700 ease-out flex items-center justify-end px-2"
                    style={{ 
                        width: `${score}%`,
                        opacity: 0.2 + (score / 100) * 0.8 // Opacity from 20% to 100%
                    }}
                >
                    <span className={`font-bold text-xs ${score > 40 ? 'text-white' : 'text-blue-800'}`}>{score}%</span>
                </div>
            </div>
        </div>
    );
};

export const RadiusAnalysisDisplay: React.FC<RadiusAnalysisDisplayProps> = ({ result }) => {
    // Sort neighborhoods by score descending if they aren't already
    const sortedNeighborhoods = [...result.neighborhoods].sort((a, b) => b.interestScore - a.interestScore);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-6">Análise de Interesse por Bairro</h2>
                <p className="text-slate-600 mb-6">Gráfico dos bairros com maior volume de busca para o seu segmento de negócio, em um raio de até 10km.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    <div className="lg:col-span-3 p-6 bg-white rounded-lg border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#4285F4]"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.5-12.75a.75.75 0 01.75.75v14.25a.75.75 0 01-1.5 0V4.5a.75.75 0 01.75-.75z" /></svg>
                            Interesse de Busca por Bairro
                        </h3>
                        <div className="space-y-3">
                            {sortedNeighborhoods.map((item, index) => (
                                <NeighborhoodBar key={index} name={item.name} score={item.interestScore} />
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 p-6 bg-blue-50/60 rounded-lg border border-blue-200 h-full">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#4285F4]"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                            Análise da IA
                        </h3>
                        <p className="text-blue-900/90 whitespace-pre-line">{result.analysisSummary}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
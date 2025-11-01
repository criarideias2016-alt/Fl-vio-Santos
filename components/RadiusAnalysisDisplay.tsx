import React from 'react';
import type { RadiusAnalysisResult } from '../types';

interface RadiusAnalysisDisplayProps {
  result: RadiusAnalysisResult;
}

// Helper function to get a color from a gradient based on the score.
// This creates a gradient from a lighter blue to a darker, more saturated cyan.
const getColorForScore = (score: number): string => {
    const hue = 200; // A nice blue/cyan hue
    const saturation = 70 + (score / 100) * 30; // Saturation from 70% to 100%
    const lightness = 65 - (score / 100) * 25; // Lightness from 65% down to 40%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const NeighborhoodBar: React.FC<{ name: string; score: number }> = ({ name, score }) => {
    const barColor = getColorForScore(score);
    const labelColor = score > 40 ? 'text-white' : 'text-slate-800';

    return (
        <div className="flex items-center gap-4 text-sm">
            <div className="w-1/3 text-slate-300 truncate text-right pr-2" title={name}>
                {name}
            </div>
            <div className="w-2/3 bg-slate-700/50 rounded-md h-8">
                <div 
                    className="h-8 rounded-md transition-all duration-700 ease-out flex items-center justify-end px-2" 
                    style={{ 
                        width: `${score}%`,
                        backgroundColor: barColor
                    }}
                >
                    <span className={`font-bold text-xs ${labelColor}`}>{score}%</span>
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
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Análise de Interesse por Bairro</h2>
                <p className="text-slate-400 mb-6">Gráfico dos bairros com maior volume de busca para o seu segmento de negócio, em um raio de até 10km.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    <div className="lg:col-span-3 p-6 bg-slate-900/50 rounded-lg border border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.5-12.75a.75.75 0 01.75.75v14.25a.75.75 0 01-1.5 0V4.5a.75.75 0 01.75-.75z" /></svg>
                            Interesse de Busca por Bairro
                        </h3>
                        <div className="space-y-3">
                            {sortedNeighborhoods.map((item, index) => (
                                <NeighborhoodBar key={index} name={item.name} score={item.interestScore} />
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 p-6 bg-slate-800 rounded-lg border border-slate-700 h-full">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-400"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                            Análise da IA
                        </h3>
                        <p className="text-slate-400 whitespace-pre-line">{result.analysisSummary}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
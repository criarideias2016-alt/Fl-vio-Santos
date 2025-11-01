import React from 'react';
import type { LocalRankingResult } from '../types';

interface LocalRankingDisplayProps {
  result: LocalRankingResult;
}

export const LocalRankingDisplay: React.FC<LocalRankingDisplayProps> = ({ result }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 h-full">
      <h2 className="text-xl font-bold text-slate-100 mb-4">Ranqueamento Local</h2>
      <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-lg mb-4">
        <div className="text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 119 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 15v.75A6.75 6.75 0 0015.75 21v-1.5a2.25 2.25 0 00-4.5 0v1.5m-3.75-3.75H7.5a3.75 3.75 0 117.5 0h-1.5" /></svg>
        </div>
        <div>
            <p className="text-slate-400 text-sm">Status na Cidade (Raio de 10km)</p>
            <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                {result.ranking}
            </p>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-slate-300 mb-2">Análise da IA:</h3>
        <p className="text-slate-400 text-sm">{result.justification}</p>
      </div>
    </div>
  );
};

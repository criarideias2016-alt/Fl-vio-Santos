import React, { FC } from 'react';
import type { HeadToHeadAnalysis } from '../types.ts';

interface HeadToHeadAnalysisDisplayProps {
  result: HeadToHeadAnalysis;
}

export const HeadToHeadAnalysisDisplay: FC<HeadToHeadAnalysisDisplayProps> = ({ result }) => {
  if (!result || !Array.isArray(result.comparison) || !Array.isArray(result.strategicRecommendations)) {
    return (
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-3 mb-6">Análise Direta vs. Concorrente</h2>
        <p className="text-slate-500 dark:text-slate-400">Não foi possível carregar a análise direta. Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-3 mb-6">Análise Direta vs. Concorrente</h2>
        <p className="text-gray-600 dark:text-slate-400 mb-6">Um comparativo direto com seu concorrente mais forte, <span className="font-bold text-blue-600 dark:text-blue-400">{result.competitorName}</span>, e um plano de ação para superá-lo.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-4">Comparativo Lado a Lado</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600 dark:text-slate-400">
                <thead className="text-xs text-gray-700 dark:text-slate-300 uppercase bg-gray-100 dark:bg-slate-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 rounded-l-lg">
                      Métrica
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Sua Empresa
                    </th>
                    <th scope="col" className="px-6 py-3 rounded-r-lg">
                      {result.competitorName}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.comparison.map((item, index) => (
                    <tr key={index} className="bg-white dark:bg-slate-800/50 border-b dark:border-slate-700 border-gray-200 last:border-b-0">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-800 dark:text-slate-200 whitespace-nowrap">
                        {item.metric}
                      </th>
                      <td className="px-6 py-4">
                        {item.yourBusiness}
                      </td>
                      <td className="px-6 py-4">
                        {item.competitor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-2 p-6 bg-gradient-to-br from-blue-50 to-gray-50 dark:from-blue-900/30 dark:to-slate-800/30 rounded-lg border-2 border-blue-200 dark:border-blue-700/50 shadow-lg shadow-blue-500/10">
            <h3 className="text-xl font-bold text-gray-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9M20.25 20.25h-4.5m4.5 0v-4.5m0-4.5L15 15" /></svg>
              Recomendações Estratégicas
            </h3>
            <ul className="space-y-3 list-disc list-inside text-blue-800/90 dark:text-blue-200/90">
                {result.strategicRecommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
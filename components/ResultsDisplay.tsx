import React, { ReactNode, FC } from 'react';
import type { AnalysisResult, GroundingChunk, Suggestion } from '../types.ts';

const categoryStyles: { [key: string]: { icon: ReactNode; color: string } } = {
  Informações: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>,
    color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  },
  Fotos: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
    color: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
  },
  Avaliações: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.418a.563.563 0 01.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988h5.418a.563.563 0 00.475-.31L11.48 3.5z" /></svg>,
    color: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
  },
  Postagens: {
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg>,
    color: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
  },
  'SEO Local': {
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
    color: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
  }
};

const SuggestionCard: FC<{ suggestion: Suggestion }> = ({ suggestion }) => {
  const style = categoryStyles[suggestion.category] || categoryStyles['Informações'];
  return (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-lg p-5 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-full ${style.color}`}>
          {style.icon}
        </div>
        <div>
          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${style.color}`}>
            {suggestion.category}
          </span>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-2">{suggestion.title}</h3>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{suggestion.description}</p>
        </div>
      </div>
    </div>
  );
};


export const ResultsDisplay: FC<{ result: AnalysisResult; sources: GroundingChunk[] }> = ({ result, sources }) => {
  if (!result || !Array.isArray(result.suggestions)) {
    return (
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-3 mb-6">Sugestões de Melhoria</h2>
        <p className="text-slate-500 dark:text-slate-400">Não foi possível carregar as sugestões. Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-3 mb-6">Sugestões de Melhoria</h2>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.suggestions.map((s, index) => (
            <SuggestionCard key={index} suggestion={s} />
          ))}
        </div>
      </div>

      {sources && sources.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-3">Fontes de Dados</h3>
          <ul className="space-y-2">
            {sources.map((source, index) => (
              source.maps && (
                <li key={source.maps.uri || index}>
                  <a
                    href={source.maps.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M15.312 3.312a1.25 1.25 0 011.043 2.228l-8.5 8.5a1.25 1.25 0 01-2.228-1.043l1.25-6.25a1.25 1.25 0 012.21-1.033l1.835 2.141 3.39-3.39z" clipRule="evenodd" /><path d="M7.5 3.193l-4.063 4.063a1.25 1.25 0 00-1.033 2.21l6.25 1.25a1.25 1.25 0 001.043-2.228l-8.5-8.5a1.25 1.25 0 00-2.228 1.043l1.25 6.25a1.25 1.25 0 002.21 1.033l2.141-1.835-3.39 3.39a1.25 1.25 0 001.768 1.768l3.39-3.39 1.835 2.14a1.25 1.25 0 001.033 2.21l6.25 1.25a1.25 1.25 0 001.043-2.228l-8.5-8.5a1.25 1.25 0 00-2.228 1.043z" /></svg>
                    <span>{source.maps.title}</span>
                  </a>
                </li>
              )
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import type { KeywordsResult, KeywordVolumeResult } from '../types';
import { getKeywordVolume } from '../services/geminiService';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorMessage } from './ErrorMessage';

interface KeywordDisplayProps {
  result: KeywordsResult;
}

const KeywordCategory: React.FC<{ title: string; keywords: string[]; icon: React.ReactNode }> = ({ title, keywords, icon }) => {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Maybe add a toast notification here in a future version
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
                <div className="text-blue-600">{icon}</div>
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleCopy(keyword)}
                        className="group relative bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-200"
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
            <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-6">Sugestões de Palavras-Chave</h2>
            <p className="text-gray-600 mb-6">Use estas palavras-chave em seu perfil, postagens e site para melhorar seu ranking.</p>
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


// --- Novo Componente ---

const BarChart: React.FC<{ data: KeywordVolumeResult['monthlyVolumes'] }> = ({ data }) => {
    const maxVolume = Math.max(...data.map(d => d.volume), 0);
    if (maxVolume === 0) {
        return <p className="text-center text-slate-500 my-8">Não há dados de volume suficientes para exibir o gráfico.</p>;
    }

    return (
        <div className="w-full bg-slate-50 p-6 pr-8 rounded-lg border border-slate-200">
            <div className="flex justify-between items-end h-64 space-x-2">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                        <div className="absolute -top-7 hidden group-hover:block bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                            {item.volume.toLocaleString('pt-BR')}
                        </div>
                        <div
                            className="w-full bg-blue-400 hover:bg-blue-500 rounded-t-md transition-all duration-300"
                            style={{ height: `${(item.volume / maxVolume) * 100}%` }}
                            title={`${item.month}: ${item.volume.toLocaleString('pt-BR')}`}
                        ></div>
                        <span className="text-xs text-slate-600 mt-2 text-center absolute -bottom-6 w-20 transform -rotate-45">{item.month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const KeywordVolumeAnalyzer: React.FC<{ city: string; state: string }> = ({ city, state }) => {
    const [keyword, setKeyword] = useState('');
    const [result, setResult] = useState<KeywordVolumeResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!keyword.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await getKeywordVolume(keyword, city, state);
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-6">Analisador de Volume de Busca</h2>
                <p className="text-slate-600 mb-6">
                    Pesquise uma palavra-chave para ver o volume de busca estimado nos últimos 12 meses na sua região ({city}, {state}).
                    Essa análise ajuda a entender a sazonalidade e o interesse do consumidor.
                </p>

                <form onSubmit={handleSearch} className="flex items-center gap-4 mb-8">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Digite sua palavra-chave..."
                        className="flex-grow bg-white border border-slate-300 rounded-lg py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                        aria-label="Palavra-chave para analisar"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !keyword.trim()}
                        className="flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
                    >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Buscando...
                          </>
                        ) : 'Buscar'}
                    </button>
                </form>

                {isLoading && <LoadingIndicator message="Analisando volume de busca..." />}
                {error && <ErrorMessage message={error} />}

                {result ? (
                    <div className="space-y-8">
                         <h3 className="text-xl font-bold text-slate-700">Resultados para: "{result.keyword}"</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start mt-4">
                            <div className="lg:col-span-3 pt-8">
                                <BarChart data={result.monthlyVolumes} />
                            </div>
                            <div className="lg:col-span-2 p-6 bg-blue-50/60 rounded-lg border border-blue-200 h-full">
                                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#4285F4]"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                                    Análise da Tendência
                                </h3>
                                <p className="text-blue-900/90 whitespace-pre-line">{result.analysis}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    !isLoading && !error && (
                         <div className="text-center p-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-slate-400 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.5-12.75a.75.75 0 01.75.75v14.25a.75.75 0 01-1.5 0V4.5a.75.75 0 01.75-.75z" /></svg>
                            <h3 className="text-lg font-semibold text-slate-700">Pronto para analisar?</h3>
                            <p className="text-slate-500">Insira uma palavra-chave acima para começar.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};
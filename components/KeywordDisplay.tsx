import React, { useState, ReactNode, FC, FormEvent } from 'react';
import type { KeywordsResult, KeywordVolumeResult, PostSuggestion } from '../types.ts';
import { getKeywordVolume } from '../services/geminiService.ts';
import { LoadingIndicator } from './LoadingIndicator.tsx';
import { ErrorMessage } from './ErrorMessage.tsx';
import { useCopyToClipboard } from './hooks/useCopyToClipboard.ts';
import { useApiKeys } from '../../contexts/ApiKeyContext.tsx';

interface KeywordDisplayProps {
  result: KeywordsResult;
}

type KeywordTab = 'keywords' | 'hashtags' | 'posts';

const KeywordPill: FC<{ keyword: string }> = ({ keyword }) => {
    const [isCopied, copy] = useCopyToClipboard();
    return (
        <button 
            onClick={() => copy(keyword)}
            className="group relative bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-sm font-medium px-3 py-1.5 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200"
            title="Copiar"
        >
            {isCopied ? 'Copiado!' : keyword}
        </button>
    );
};

const PostSuggestionCard: FC<{ post: PostSuggestion }> = ({ post }) => {
    const [isCopied, copy] = useCopyToClipboard();
    const fullPostText = `${post.title}\n\n${post.content}`;

    return (
        <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg p-5 flex flex-col h-full">
            <h4 className="text-md font-bold text-gray-800 dark:text-slate-200">{post.title}</h4>
            <p className="text-gray-600 dark:text-slate-400 mt-2 text-sm flex-grow">{post.content}</p>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                <button
                    onClick={() => copy(fullPostText)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold py-2 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
                    {isCopied ? 'Copiado!' : 'Copiar Post'}
                </button>
            </div>
        </div>
    );
};


const CopyAllButton: FC<{ items: string[]; }> = ({ items }) => {
    const [isCopied, copy] = useCopyToClipboard();
    const textToCopy = items.join(' ');

    return (
        <button 
            onClick={() => copy(textToCopy)}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
        >
             {isCopied ? (
                 <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>
                    Copiado!
                 </>
             ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
                    Copiar Todos
                </>
             )}
        </button>
    );
};

export const KeywordDisplay: FC<KeywordDisplayProps> = ({ result }) => {
    const [activeTab, setActiveTab] = useState<KeywordTab>('keywords');

    if (!result || !result.principais || !result.hashtags || !result.posts) {
        return (
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-3 mb-6">Central de Conteúdo</h2>
                <p className="text-slate-500 dark:text-slate-400">Não foi possível carregar o conteúdo. Tente novamente mais tarde.</p>
            </div>
        );
    }

    const tabClasses = (tab: KeywordTab) => `px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
        activeTab === tab 
        ? 'bg-blue-600 text-white' 
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
    }`;

    return (
        <div className="space-y-8">
            <div>
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3 mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Central de Conteúdo</h2>
                    <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                        <button onClick={() => setActiveTab('keywords')} className={tabClasses('keywords')}>Palavras-Chave</button>
                        <button onClick={() => setActiveTab('hashtags')} className={tabClasses('hashtags')}>Hashtags</button>
                        <button onClick={() => setActiveTab('posts')} className={tabClasses('posts')}>Sugestões de Posts</button>
                    </div>
                </div>

                {activeTab === 'keywords' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <p className="text-slate-600 dark:text-slate-400">Use estas palavras-chave em seu perfil, postagens e site para melhorar seu ranking.</p>
                            <CopyAllButton items={[...result.principais, ...result.caudaLonga, ...result.locais]} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {['principais', 'caudaLonga', 'locais'].map(key => (
                                <div key={key} className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg p-5">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-4 capitalize">{key === 'caudaLonga' ? 'Cauda Longa' : key}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(result[key as keyof Omit<KeywordsResult, 'hashtags' | 'posts'>] as string[]).map((keyword: any, index: number) => <KeywordPill key={index} keyword={keyword} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {activeTab === 'hashtags' && (
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-slate-600 dark:text-slate-400">Copie estas hashtags para usar em suas postagens e aumentar o alcance.</p>
                            <CopyAllButton items={result.hashtags} />
                        </div>
                         <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg p-5">
                             <div className="flex flex-wrap gap-2">
                                 {result.hashtags.map((tag, index) => <KeywordPill key={index} keyword={tag} />)}
                             </div>
                         </div>
                     </div>
                )}

                {activeTab === 'posts' && (
                     <div className="space-y-4">
                        <p className="text-slate-600 dark:text-slate-400">Use estas {result.posts.length} ideias como inspiração ou copie e cole diretamente em suas redes sociais.</p>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                             {result.posts.map((post, index) => <PostSuggestionCard key={index} post={post} />)}
                         </div>
                     </div>
                )}

            </div>
        </div>
    );
};


const BarChart: FC<{ data: KeywordVolumeResult['monthlyVolumes'] }> = ({ data }) => {
    const maxVolume = Math.max(...data.map(d => d.volume), 0);
    if (maxVolume === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 my-8">Não há dados de volume suficientes para exibir o gráfico.</p>;
    }

    return (
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 p-6 pr-8 rounded-lg border border-slate-200 dark:border-slate-700">
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
                        <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 text-center absolute -bottom-6 w-20 transform -rotate-45">{item.month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const KeywordVolumeAnalyzer: FC<{ city: string; state: string }> = ({ city, state }) => {
    const [keyword, setKeyword] = useState('');
    const [result, setResult] = useState<KeywordVolumeResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { geminiApiKey } = useApiKeys();

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        if (!keyword.trim()) return;

        if (!geminiApiKey) {
            setError("A chave de API do Gemini não está configurada. Por favor, adicione-a nas configurações.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await getKeywordVolume(geminiApiKey, keyword, city, state);
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
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-3 mb-6">Analisador de Volume de Busca</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Pesquise uma palavra-chave para ver o volume de busca estimado nos últimos 12 meses na sua região ({city}, {state}).
                    Essa análise ajuda a entender a sazonalidade e o interesse do consumidor.
                </p>

                <form onSubmit={handleSearch} className="flex items-center gap-4 mb-8">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Digite sua palavra-chave..."
                        className="flex-grow bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                         <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Resultados para: "{result.keyword}"</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start mt-4">
                            <div className="lg:col-span-3 pt-8">
                                <BarChart data={result.monthlyVolumes} />
                            </div>
                            <div className="lg:col-span-2 p-6 bg-blue-50/60 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50 h-full">
                                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#4285F4]"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                                    Análise da Tendência
                                </h3>
                                <p className="text-blue-900/90 dark:text-blue-200/90 whitespace-pre-line">{result.analysis}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    !isLoading && !error && (
                         <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
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
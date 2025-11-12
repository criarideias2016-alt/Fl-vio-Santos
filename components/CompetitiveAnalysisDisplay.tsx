import React, { FC } from 'react';
import type { CompetitiveAnalysis, Competitor } from '../types.ts';

interface CompetitiveAnalysisDisplayProps {
  result: CompetitiveAnalysis;
  mainBusinessName: string;
}

const getScoreStyle = (score: number) => {
    if (score >= 70) {
        return {
            bgColor: 'bg-[#34A853]',
            textColor: 'text-[#34A853] dark:text-green-400',
            progressColor: 'stroke-[#34A853] dark:stroke-green-400',
            emoji: '😊',
            statusText: 'Bom'
        };
    }
    if (score >= 40) {
        return {
            bgColor: 'bg-[#FBCB0A]',
            textColor: 'text-[#FBCB0A] dark:text-yellow-400',
            progressColor: 'stroke-[#FBCB0A] dark:stroke-yellow-400',
            emoji: '😐',
            statusText: 'Razoável'
        };
    }
    return {
        bgColor: 'bg-[#EA4335]',
        textColor: 'text-[#EA4335] dark:text-red-400',
        progressColor: 'stroke-[#EA4335] dark:stroke-red-400',
        emoji: '😞',
        statusText: 'Fraco'
    };
};

const ProgressBar: FC<{ competitor: Competitor; index: number; }> = ({ competitor, index }) => {
    const style = getScoreStyle(competitor.visibilityScore);
    const barColorClass = style.bgColor;
    const labelColor = competitor.visibilityScore > 40 ? 'text-white' : 'text-slate-800 dark:text-slate-200';
    return (
        <div className="flex items-center gap-3 group" title={competitor.justification}>
            <div className="w-8 flex-shrink-0 text-sm font-medium text-slate-500 dark:text-slate-400 text-center">{index + 1}.</div>
             <div className="flex-1 text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2" title={competitor.name}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.27.61-.474l.21-.202a.75.75 0 00-1.06-1.06l-.21.202-.016.015a15.247 15.247 0 01-.21.15c-.16.101-.315.188-.44.254l-.117.058a.75.75 0 10.523 1.352l.001-.001z" clipRule="evenodd" /><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13.25a.75.75 0 00-1.5 0v4.5c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75v-3z" /></svg>
                {competitor.name}
            </div>
            <div className="w-1/3 bg-slate-200 dark:bg-slate-700 rounded-full h-5">
                <div
                    className={`${barColorClass} h-5 rounded-full text-right pr-2 transition-all duration-500 ease-out flex items-center justify-end`}
                    style={{ width: `${competitor.visibilityScore}%` }}
                >
                    <span className={`font-bold text-xs ${labelColor}`}>{competitor.visibilityScore}%</span>
                </div>
            </div>
        </div>
    );
};


const CircularProgress: FC<{ score: number }> = ({ score }) => {
    const sqSize = 120;
    const strokeWidth = 10;
    const radius = (sqSize - strokeWidth) / 2;
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - (dashArray * score) / 100;

    const style = getScoreStyle(score);

    return (
        <div className="relative flex items-center justify-center" style={{ width: sqSize, height: sqSize }}>
            <svg
                width={sqSize}
                height={sqSize}
                viewBox={viewBox}>
                <circle
                    className="fill-transparent stroke-slate-200 dark:stroke-slate-700"
                    cx={sqSize / 2}
                    cy={sqSize / 2}
                    r={radius}
                    strokeWidth={`${strokeWidth}px`} />
                <circle
                    className={`fill-transparent ${style.progressColor} transition-all duration-700 ease-in-out`}
                    cx={sqSize / 2}
                    cy={sqSize / 2}
                    r={radius}
                    strokeWidth={`${strokeWidth}px`}
                    transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
                    style={{
                        strokeDasharray: dashArray,
                        strokeDashoffset: dashOffset,
                        strokeLinecap: 'round'
                    }} />
            </svg>
            <div className={`absolute text-3xl font-extrabold ${style.textColor}`}>
                {score}<span className="text-xl">%</span>
            </div>
        </div>
    );
};


export const CompetitiveAnalysisDisplay: FC<CompetitiveAnalysisDisplayProps> = ({ result, mainBusinessName }) => {
  if (!result || !Array.isArray(result.analysis) || result.analysis.length === 0) {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-3 mb-6">Análise Competitiva</h2>
            <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-500 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" />
                </svg>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Nenhum concorrente encontrado</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">A IA não identificou concorrentes diretos para esta empresa na pesquisa. Isso pode ser uma oportunidade ou indicar um nicho muito específico.</p>
            </div>
      </div>
    );
  }

  const normalizedMainBusinessName = mainBusinessName.trim().toLowerCase();
  
  const mainBusiness = result.analysis.find(c => 
    c.name.trim().toLowerCase().includes(normalizedMainBusinessName)
  );

  const competitors = result.analysis.filter(c => c.name !== mainBusiness?.name);
  const mainBusinessStyle = mainBusiness ? getScoreStyle(mainBusiness.visibilityScore) : null;

  return (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-3 mb-6">Análise Competitiva</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mainBusiness && mainBusinessStyle && (
                    <div className="md:col-span-1 bg-blue-50/60 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800/50">
                        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 text-center">Sua Empresa</h3>
                        <div className="flex flex-col items-center gap-4">
                            <CircularProgress score={mainBusiness.visibilityScore} />
                            <div className={`flex items-center gap-2 font-bold text-lg ${mainBusinessStyle.textColor}`}>
                                <span>{mainBusinessStyle.emoji}</span>
                                <span>{mainBusinessStyle.statusText}</span>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-slate-800 dark:text-slate-200">{mainBusiness.name}</p>
                                <div className="flex items-center justify-center gap-4 text-sm mt-2 text-slate-600 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-yellow-500"><path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.305-.772 1.626 0l1.864 4.493a.8.8 0 00.642.437h4.723c.828 0 1.171 1.025.564 1.547l-3.82 2.774a.8.8 0 00-.306.783l1.455 4.642c.264.843-.694 1.545-1.442 1.054L10 15.547l-3.82 2.774c-.748.491-1.706-.21-1.442-1.054l1.455-4.642a.8.8 0 00-.306-.783L2.064 9.36c-.607-.522-.264-1.547.564-1.547h4.723a.8.8 0 00.642.437l1.864-4.493z" clipRule="evenodd" /></svg>
                                        {mainBusiness.rating.toFixed(1)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-500 dark:text-slate-400"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.028.658a.78.78 0 01-.582.658A5.485 5.485 0 012 16a.78.78 0 01-.51-1.674zM16 8a2 2 0 11-4 0 2 2 0 014 0zM10 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" /></svg>
                                        {mainBusiness.reviews}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-3 text-center">"{mainBusiness.justification}"</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className={`p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 ${mainBusiness ? 'md:col-span-2' : 'md:col-span-3'}`}>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">Concorrentes Locais</h3>
                    <div className="space-y-3">
                        {competitors.map((competitor, index) => (
                            <ProgressBar key={index} competitor={competitor} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
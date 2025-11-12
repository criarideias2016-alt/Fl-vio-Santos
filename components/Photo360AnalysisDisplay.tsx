import React, { FC, ReactNode } from 'react';
import type { ScorecardMetric } from '../types';

interface Photo360AnalysisDisplayProps {
  result: ScorecardMetric;
}

const ScoreGauge: FC<{ score: number }> = ({ score }) => {
    const sqSize = 160;
    const strokeWidth = 15;
    const radius = (sqSize - strokeWidth) / 2;
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - (dashArray * score) / 100;

    const getScoreStyle = (s: number) => {
        if (s >= 70) return 'stroke-[#34A853] dark:stroke-green-400 text-[#34A853] dark:text-green-400';
        if (s >= 40) return 'stroke-[#FBCB0A] dark:stroke-yellow-400 text-[#FBCB0A] dark:text-yellow-400';
        return 'stroke-[#EA4335] dark:stroke-red-400 text-[#EA4335] dark:text-red-400';
    };
    const styleClasses = getScoreStyle(score);
    const textClass = styleClasses.split(' ').slice(2).join(' ');

    return (
        <div className="relative flex items-center justify-center" style={{ width: sqSize, height: sqSize }}>
            <svg width={sqSize} height={sqSize} viewBox={viewBox}>
                <circle
                    className="fill-transparent stroke-slate-200 dark:stroke-slate-700"
                    cx={sqSize / 2} cy={sqSize / 2} r={radius} strokeWidth={`${strokeWidth}px`}
                />
                <circle
                    className={`fill-transparent transition-all duration-700 ease-in-out ${styleClasses.split(' ').slice(0,2).join(' ')}`}
                    cx={sqSize / 2} cy={sqSize / 2} r={radius} strokeWidth={`${strokeWidth}px`}
                    transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
                    style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset, strokeLinecap: 'round' }}
                />
            </svg>
            <div className={`absolute text-4xl font-extrabold ${textClass}`}>
                {score}<span className="text-2xl">%</span>
            </div>
        </div>
    );
};

const ProjectionLineChart: FC<{ data: { month: string; projectedScore: number }[] }> = ({ data }) => {
    if (!data || data.length < 2) return null;

    const width = 500;
    const height = 250;
    const padding = 40;

    const scores = data.map(d => d.projectedScore);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const scoreRange = Math.max(1, maxScore - minScore); 

    const getX = (index: number) => padding + (index / (data.length - 1)) * (width - 2 * padding);
    const getY = (score: number) => height - padding - ((score - minScore) / scoreRange) * (height - 2 * padding);

    const pathData = data.map((point, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)},${getY(point.projectedScore)}`).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto text-slate-800 dark:text-slate-200">
            <defs>
                <linearGradient id="projectionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={`${pathData} L ${getX(data.length - 1)},${height - padding} L ${getX(0)},${height - padding} Z`} fill="url(#projectionGradient)" />
            <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {data.map((point, i) => (
                <g key={i}>
                  <circle cx={getX(i)} cy={getY(point.projectedScore)} r="5" fill="#3b82f6" stroke="#fff" strokeWidth="2" className="dark:stroke-slate-800" />
                  <text x={getX(i)} y={getY(point.projectedScore) - 15} textAnchor="middle" className="text-xs fill-current text-slate-700 dark:text-slate-300 font-bold">{point.projectedScore}%</text>
                  <text x={getX(i)} y={height - padding + 20} textAnchor="middle" className="text-xs fill-current text-slate-500 dark:text-slate-400">{point.month}</text>
                </g>
            ))}
        </svg>
    );
};

const benefits = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>,
        title: "Aumenta a Confiança do Cliente",
        description: "Um tour virtual permite que os clientes explorem seu espaço antes de visitar, criando transparência e confiança imediata na sua marca."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
        title: "Melhora o Ranking no Google",
        description: "O Google favorece perfis com conteúdo rico. Fotos 360° aumentam o tempo de interação do usuário, sinalizando relevância e melhorando seu SEO local."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
        title: "Destaque-se da Concorrência",
        description: "Em um mercado competitivo, um tour virtual é um diferencial poderoso que captura a atenção e coloca sua empresa um passo à frente."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25V5.106c0-1.108.892-2.006 2.006-2.006h4.488c1.114 0 2.006.898 2.006 2.006v9.144M7.5 14.25h1.875a3 3 0 013 3v.507c0 .536.433.967.967.967h1.033c.534 0 .967-.431.967-.967v-.507a3 3 0 013-3h1.875" /></svg>,
        title: "Acelera a Decisão de Compra",
        description: "Clientes que visualizam o interior de um negócio têm o dobro da probabilidade de realizar uma compra ou reserva."
    }
];

export const Photo360AnalysisDisplay: FC<Photo360AnalysisDisplayProps> = ({ result }) => {
    if (!result) {
        return (
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-3 mb-6">Análise de Foto 360</h2>
              <p className="text-slate-500 dark:text-slate-400">Não foi possível carregar a análise de Foto 360.</p>
            </div>
        );
    }

    const currentScore = result.score;
    const targetScore = Math.max(95, currentScore + 35);
    const projectionData = Array.from({ length: 12 }, (_, i) => {
        const progress = (i + 1) / 12;
        const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const projectedScore = Math.round(currentScore + (targetScore - currentScore) * easedProgress);
        return {
            month: `Mês ${i + 1}`,
            projectedScore: Math.min(projectedScore, 100)
        };
    });
    

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-3 mb-6">Estratégia de Foto 360</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Cenário Atual</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Pontuação baseada na presença de um tour virtual.</p>
                    <ScoreGauge score={currentScore} />
                    <p className="mt-4 text-slate-600 dark:text-slate-400 italic max-w-xs">{result.analysis}</p>
                </div>

                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Projeção Exponencial (12 Meses)</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Impacto estimado ao implementar um tour virtual 360°.</p>
                    <div className="w-full flex-grow flex items-center">
                        <ProjectionLineChart data={projectionData} />
                    </div>
                </div>
            </div>
            
            <div className="mt-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">Benefícios Estratégicos do Tour Virtual 360°</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex-shrink-0 text-blue-600 dark:text-blue-400 mt-1">
                                {benefit.icon}
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-700 dark:text-slate-300">{benefit.title}</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
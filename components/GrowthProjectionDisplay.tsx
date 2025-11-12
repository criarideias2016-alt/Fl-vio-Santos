import React, { FC } from 'react';
import type { GrowthProjection } from '../types';

const LineChart: FC<{ data: GrowthProjection['projection'] }> = ({ data }) => {
    if (!data || data.length < 2) return null;

    const width = 500;
    const height = 250;
    const padding = 40;

    const scores = data.map(d => d.projectedScore);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const scoreRange = Math.max(1, maxScore - minScore); // Avoid division by zero

    const getX = (index: number) => padding + (index / (data.length - 1)) * (width - 2 * padding);
    const getY = (score: number) => height - padding - ((score - minScore) / scoreRange) * (height - 2 * padding);

    const pathData = data.map((point, i) => {
        const x = getX(i);
        const y = getY(point.projectedScore);
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

    const yAxisLabels = [minScore, minScore + scoreRange / 2, maxScore].map(Math.round);

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto text-slate-800 dark:text-slate-200">
            {/* Y Axis Grid Lines & Labels */}
            {yAxisLabels.map((label, i) => (
                <g key={i}>
                    <line
                        x1={padding} y1={getY(label)}
                        x2={width - padding} y2={getY(label)}
                        stroke="currentColor"
                        className="opacity-10 dark:opacity-20"
                    />
                    <text
                        x={padding - 10} y={getY(label) + 5}
                        textAnchor="end"
                        className="text-xs fill-current text-slate-500 dark:text-slate-400"
                    >
                        {label}%
                    </text>
                </g>
            ))}
            
            {/* X Axis Labels */}
            {data.map((point, i) => (
                <text
                    key={i}
                    x={getX(i)} y={height - padding + 20}
                    textAnchor="middle"
                    className="text-xs fill-current text-slate-500 dark:text-slate-400"
                >
                    {point.month}
                </text>
            ))}

            {/* Gradient for area */}
            <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Area under the line */}
            <path
                d={`${pathData} L ${getX(data.length - 1)},${height - padding} L ${getX(0)},${height - padding} Z`}
                fill="url(#areaGradient)"
            />

            {/* Line Path */}
            <path
                d={pathData}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Data Points */}
            {data.map((point, i) => (
                <circle
                    key={i}
                    cx={getX(i)}
                    cy={getY(point.projectedScore)}
                    r="5"
                    fill="#3b82f6"
                    stroke="#fff"
                    strokeWidth="2"
                    className="dark:stroke-slate-800"
                />
            ))}
        </svg>
    );
};

export const GrowthProjectionDisplay: FC<{ result: GrowthProjection }> = ({ result }) => {
    if (!result || !result.projection) {
        return null;
    }
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-3 mb-6">
                Projeção de Crescimento (6 Meses)
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                <div className="lg:col-span-3 bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <LineChart data={result.projection} />
                </div>
                 <div className="lg:col-span-2 p-6 bg-blue-50/60 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50 h-full">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#4285F4]"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
                        Análise da IA
                    </h3>
                    <p className="text-blue-900/90 dark:text-blue-200/90 whitespace-pre-line">{result.analysis}</p>
                </div>
            </div>
        </div>
    );
};
import React, { FC } from 'react';
import type { DetailedScorecardResult, ScorecardMetric } from '../types.ts';

interface ScorecardDisplayProps {
  result: DetailedScorecardResult;
}

const statusStyles = {
    Fraco: {
        color: 'bg-[#EA4335]',
        textColor: 'text-red-600 dark:text-red-400',
        borderColor: 'border-red-300 dark:border-red-700'
    },
    Razoável: {
        color: 'bg-[#FBCB0A]',
        textColor: 'text-yellow-600 dark:text-yellow-400',
        borderColor: 'border-yellow-300 dark:border-yellow-700'
    },
    Bom: {
        color: 'bg-[#34A853]',
        textColor: 'text-green-600 dark:text-green-400',
        borderColor: 'border-green-300 dark:border-green-700'
    }
};

const MetricCard: FC<{ metric: ScorecardMetric }> = ({ metric }) => {
    const style = statusStyles[metric.status] || statusStyles['Razoável'];
    return (
        <div className={`bg-white dark:bg-slate-800/50 border ${style.borderColor} rounded-lg p-5`}>
            <h3 className="font-bold text-gray-800 dark:text-slate-200">{metric.name}</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 mb-3">{metric.description}</p>
            
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4 mb-2">
                <div
                    className={`${style.color} h-4 rounded-full text-right transition-all duration-500 ease-out`}
                    style={{ width: `${metric.score}%` }}
                ></div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <span className={`font-bold text-sm ${style.textColor}`}>{metric.status}</span>
                <span className="font-bold text-sm text-gray-700 dark:text-slate-300">{metric.score}%</span>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 p-3 rounded-md border border-gray-200 dark:border-slate-700">
                <strong className="text-gray-700 dark:text-slate-300">Análise da IA:</strong> {metric.analysis}
            </div>
        </div>
    );
};


const MetricGroup: FC<{ title: string; metrics: ScorecardMetric[]; color: string }> = ({ title, metrics, color }) => {
    if (metrics.length === 0) return null;
    return (
        <div>
            <h3 className={`text-xl font-bold mb-4 border-l-4 pl-3 ${color}`}>
                {title} ({metrics.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.map((metric, index) => (
                    <MetricCard key={index} metric={metric} />
                ))}
            </div>
        </div>
    );
};


export const ScorecardDisplay: FC<ScorecardDisplayProps> = ({ result }) => {
    if (!result || !Array.isArray(result.metrics)) {
      return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-3 mb-6">Scorecard SEO Detalhado</h2>
          <p className="text-slate-500 dark:text-slate-400">Não foi possível carregar o scorecard. Tente novamente mais tarde.</p>
        </div>
      );
    }

    const sortedMetrics = [...result.metrics].sort((a, b) => {
        const priorityOrder = { 'Fraco': 1, 'Razoável': 2, 'Bom': 3 };
        return priorityOrder[a.status] - priorityOrder[b.status] || b.score - a.score;
    });

    const fracoMetrics = sortedMetrics.filter(m => m.status === 'Fraco');
    const razoavelMetrics = sortedMetrics.filter(m => m.status === 'Razoável');
    const bomMetrics = sortedMetrics.filter(m => m.status === 'Bom');

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-3 mb-6">Scorecard SEO Detalhado</h2>
                <p className="text-gray-600 dark:text-slate-400 mb-6">Uma análise profunda de mais de 15 métricas essenciais para o sucesso do seu perfil no Google.</p>
                <div className="space-y-10">
                    <MetricGroup title="Pontos Críticos (Ação Imediata)" metrics={fracoMetrics} color="border-[#EA4335]" />
                    <MetricGroup title="Áreas para Melhoria" metrics={razoavelMetrics} color="border-[#FBCB0A]" />
                    <MetricGroup title="Pontos Fortes" metrics={bomMetrics} color="border-[#34A853]" />
                </div>
            </div>
        </div>
    );
};
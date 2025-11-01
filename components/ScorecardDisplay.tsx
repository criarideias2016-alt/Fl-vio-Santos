import React from 'react';
import type { DetailedScorecardResult, ScorecardMetric } from '../types';

interface ScorecardDisplayProps {
  result: DetailedScorecardResult;
}

const statusStyles = {
    Fraco: {
        color: 'bg-red-500',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/30'
    },
    Razoável: {
        color: 'bg-yellow-500',
        textColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/30'
    },
    Bom: {
        color: 'bg-green-500',
        textColor: 'text-green-400',
        borderColor: 'border-green-500/30'
    }
};

const MetricCard: React.FC<{ metric: ScorecardMetric }> = ({ metric }) => {
    const style = statusStyles[metric.status] || statusStyles['Razoável'];
    return (
        <div className={`bg-slate-800 border ${style.borderColor} rounded-lg p-5`}>
            <h3 className="font-bold text-slate-100">{metric.name}</h3>
            <p className="text-xs text-slate-500 mt-1 mb-3">{metric.description}</p>
            
            <div className="w-full bg-slate-700 rounded-full h-4 mb-2">
                <div
                    className={`${style.color} h-4 rounded-full text-right transition-all duration-500 ease-out`}
                    style={{ width: `${metric.score}%` }}
                ></div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <span className={`font-bold text-sm ${style.textColor}`}>{metric.status}</span>
                <span className="font-bold text-sm text-slate-300">{metric.score}%</span>
            </div>
            
            <div className="text-sm text-slate-400 bg-slate-900/50 p-3 rounded-md border border-slate-700">
                <strong className="text-slate-300">Análise da IA:</strong> {metric.analysis}
            </div>
        </div>
    );
};


const MetricGroup: React.FC<{ title: string; metrics: ScorecardMetric[]; color: string }> = ({ title, metrics, color }) => {
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


export const ScorecardDisplay: React.FC<ScorecardDisplayProps> = ({ result }) => {
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
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Scorecard SEO Detalhado</h2>
                <p className="text-slate-400 mb-6">Uma análise profunda de mais de 15 métricas essenciais para o sucesso do seu perfil no Google.</p>
                <div className="space-y-10">
                    <MetricGroup title="Pontos Críticos (Ação Imediata)" metrics={fracoMetrics} color="border-red-500" />
                    <MetricGroup title="Áreas para Melhoria" metrics={razoavelMetrics} color="border-yellow-500" />
                    <MetricGroup title="Pontos Fortes" metrics={bomMetrics} color="border-green-500" />
                </div>
            </div>
        </div>
    );
};

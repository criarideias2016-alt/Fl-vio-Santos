import React from 'react';
import type { CustomerProfile } from '../types';

interface CustomerProfileDisplayProps {
  result: CustomerProfile;
}

const DonutChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const size = 200;
    const strokeWidth = 25;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercentage = 0;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {data.map((item, index) => {
                const dashOffset = circumference * (1 - accumulatedPercentage / 100);
                const dashArray = (circumference * item.value) / 100;
                accumulatedPercentage += item.value;
                return (
                    <circle
                        key={index}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        stroke={item.color}
                        fill="transparent"
                        strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                        strokeDashoffset={dashOffset}
                    />
                );
            })}
             <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="transform rotate-90"
                style={{ fontSize: '14px', fill: '#334155', fontWeight: 'bold' }}
              >
                Gênero
            </text>
        </svg>
    );
};


export const CustomerProfileDisplay: React.FC<CustomerProfileDisplayProps> = ({ result }) => {
    const { genderDistribution, ageRange, mainInterests, summary } = result;

    const chartData = [
        { label: 'Feminino', value: genderDistribution.female, color: '#4285F4' }, // Google Blue
        { label: 'Masculino', value: genderDistribution.male, color: '#34A853' }, // Google Green
        { label: 'Outro', value: genderDistribution.other, color: '#FBCB0A' },    // Google Yellow
    ].filter(item => item.value > 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-6">Análise de Perfil de Cliente (Estimativa)</h2>
        <p className="text-slate-600 mb-6">
            Com base nas informações públicas da empresa, a IA estimou o perfil do seu público-alvo. Use estes insights para direcionar suas estratégias de marketing e comunicação.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Distribuição por Gênero</h3>
                <DonutChart data={chartData} />
                <div className="flex justify-center flex-wrap gap-4 mt-4">
                    {chartData.map(item => (
                        <div key={item.label} className="flex items-center gap-2 text-sm">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span>{item.label}: <span className="font-bold">{item.value}%</span></span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-3 space-y-6">
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                     <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#EA4335]"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                        Análise do Perfil
                    </h3>
                    <p className="text-slate-600">{summary}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-slate-600 mb-2">Faixa Etária</h4>
                        <p className="text-3xl font-extrabold text-[#4285F4]">{ageRange}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-slate-600 mb-2">Principais Interesses</h4>
                        <div className="flex flex-wrap gap-2">
                            {mainInterests.map((interest, index) => (
                                <span key={index} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{interest}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
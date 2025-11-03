import React from 'react';
import type { OptimizationBenefits, BenefitItem } from '../types';

interface OptimizationBenefitsDisplayProps {
  result: OptimizationBenefits;
}

const iconPaths: { [key: string]: string } = {
    'magnifying-glass': "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
    'users': "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.952a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z",
    'check-badge': "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z",
    'chart-bar': "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
    'default': "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
};

interface HeroIconProps {
  icon: string;
  className?: string;
}

const HeroIcon: React.FC<HeroIconProps> = ({ icon, className = "w-6 h-6" }) => {
  const pathData = iconPaths[icon] || iconPaths['default'];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d={pathData} />
    </svg>
  );
};


const BenefitCard: React.FC<{ item: BenefitItem }> = ({ item }) => {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300/50 hover:shadow-md transition-all">
      <div className="flex-shrink-0 text-blue-600 mt-1">
        <HeroIcon icon={item.icon} className="w-8 h-8" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{item.title}</h3>
        <p className="text-gray-600 text-sm">{item.description}</p>
      </div>
    </div>
  );
};

export const OptimizationBenefitsDisplay: React.FC<OptimizationBenefitsDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-6">Benefícios da Otimização</h2>
        <p className="text-gray-600 mb-6">Um Perfil de Empresa bem gerenciado no Google é uma das ferramentas de marketing mais poderosas para negócios locais. Veja os benefícios:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.benefits.map((benefit, index) => (
            <BenefitCard key={index} item={benefit} />
          ))}
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import type { SeoActionsResult, SeoAction } from '../types';

interface SeoActionsDisplayProps {
  result: SeoActionsResult;
}

const priorityStyles = {
    Alta: {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797A8.33 8.33 0 0112 5.25c1.453 0 2.848.311 4.138.862a8.25 8.25 0 00-1.42 2.1z" /></svg>,
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        label: 'Alta Prioridade'
    },
    Média: {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>,
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
        label: 'Média Prioridade'
    },
    Baixa: {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        label: 'Baixa Prioridade'
    }
};

const ActionCard: React.FC<{ action: SeoAction }> = ({ action }) => {
    const style = priorityStyles[action.priority] || priorityStyles['Baixa'];
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-5 transition-all duration-300 hover:border-blue-300 hover:shadow-md">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${style.bgColor} ${style.color}`}>
            {style.icon}
          </div>
          <div>
            <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${style.bgColor} ${style.color}`}>
              {style.label}
            </span>
            <h3 className="text-lg font-bold text-gray-800 mt-2">{action.title}</h3>
            <p className="text-gray-600 mt-1">{action.description}</p>
          </div>
        </div>
      </div>
    );
};

export const SeoActionsDisplay: React.FC<SeoActionsDisplayProps> = ({ result }) => {
    const sortedActions = [...result.actions].sort((a, b) => {
        const priorityOrder = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-6">Plano de Ação para Otimização (SEO)</h2>
                <p className="text-gray-600 mb-6">Siga estas ações estratégicas para melhorar seu posicionamento e superar seus concorrentes locais.</p>
                <div className="space-y-4">
                    {sortedActions.map((action, index) => (
                        <ActionCard key={index} action={action} />
                    ))}
                </div>
            </div>
        </div>
    );
};
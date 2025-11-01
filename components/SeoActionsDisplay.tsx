import React from 'react';
import type { SeoActionsResult, SeoAction } from '../types';

interface SeoActionsDisplayProps {
  result: SeoActionsResult;
}

const priorityStyles = {
    Alta: {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797A8.33 8.33 0 0112 5.25c1.453 0 2.848.311 4.138.862a8.25 8.25 0 00-1.42 2.1z" /></svg>,
        color: 'text-red-400 border-red-500/30',
        label: 'Alta Prioridade'
    },
    Média: {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>,
        color: 'text-yellow-400 border-yellow-500/30',
        label: 'Média Prioridade'
    },
    Baixa: {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        color: 'text-blue-400 border-blue-500/30',
        label: 'Baixa Prioridade'
    }
};

const ActionCard: React.FC<{ action: SeoAction }> = ({ action }) => {
    const style = priorityStyles[action.priority] || priorityStyles['Baixa'];
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 transition-all duration-300 hover:border-cyan-500/50">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full bg-slate-900 ${style.color}`}>
            {style.icon}
          </div>
          <div>
            <span className={`text-sm font-medium px-2 py-0.5 rounded-full bg-slate-700 ${style.color}`}>
              {style.label}
            </span>
            <h3 className="text-lg font-bold text-slate-100 mt-2">{action.title}</h3>
            <p className="text-slate-400 mt-1">{action.description}</p>
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
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Plano de Ação para Otimização (SEO)</h2>
                <p className="text-slate-400 mb-6">Siga estas ações estratégicas para melhorar seu posicionamento e superar seus concorrentes locais.</p>
                <div className="space-y-4">
                    {sortedActions.map((action, index) => (
                        <ActionCard key={index} action={action} />
                    ))}
                </div>
            </div>
        </div>
    );
};

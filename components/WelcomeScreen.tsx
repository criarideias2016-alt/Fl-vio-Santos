import React, { FC, ReactNode } from 'react';

const Feature: FC<{ icon: ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4 p-4 bg-slate-100/80 dark:bg-slate-800/50 rounded-lg">
        <div className="flex-shrink-0 text-blue-600 dark:text-blue-400 mt-1">
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{description}</p>
        </div>
    </div>
);


export const WelcomeScreen: FC = () => (
    <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Bem-vindo ao Otimizador de Perfil de Empresa</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
            Digite o nome de uma empresa e sua localização para gerar uma análise completa com a tecnologia Gemini. Descubra pontos fortes, fracos e oportunidades para otimizar a presença online de qualquer negócio.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            <Feature 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                title="Diagnóstico Instantâneo"
                description="Receba um scorecard detalhado com mais de 15 métricas de SEO Local para entender rapidamente a saúde de um perfil."
            />
             <Feature 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>}
                title="Análise Competitiva"
                description="Identifique os principais concorrentes e receba uma análise comparativa para encontrar vantagens estratégicas."
            />
            <Feature 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
                title="Plano de Ação com IA"
                description="Receba sugestões de conteúdo, palavras-chave, modelos de resposta e um plano de ação de SEO priorizado."
            />
        </div>
    </div>
);
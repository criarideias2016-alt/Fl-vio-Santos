import React from 'react';

const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4 p-4 bg-slate-100/80 rounded-lg">
        <div className="flex-shrink-0 text-blue-600 mt-1">
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-slate-700">{title}</h3>
            <p className="text-slate-600 text-sm">{description}</p>
        </div>
    </div>
);


export const WelcomeScreen: React.FC = () => (
    <div className="text-center p-8 bg-white rounded-lg border border-slate-200/80">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Bem-vindo à Suíte de Otimização Local</h2>
        <p className="text-slate-500 mb-8 max-w-3xl mx-auto">
            Digite o nome de uma empresa para receber uma análise 360° e descobrir como dominar os resultados de busca na sua região.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            <Feature 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                title="Scorecard SEO Completo"
                description="Receba uma pontuação detalhada em mais de 15 métricas de SEO local e saiba exatamente onde melhorar."
            />
             <Feature 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>}
                title="Análise Competitiva"
                description="Compare sua performance com a de concorrentes diretos e descubra oportunidades para se destacar."
            />
            <Feature 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>}
                title="Palavras-Chave Locais"
                description="Obtenha listas de palavras-chave estratégicas para atrair clientes que estão buscando perto de você."
            />
            <Feature 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9M20.25 20.25h-4.5m4.5 0v-4.5m0-4.5L15 15" /></svg>}
                title="Análise de Raio de Atuação"
                description="Entenda o alcance geográfico da sua empresa e identifique os bairros com maior potencial de clientes."
            />
            <Feature 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>}
                title="Ideias Criativas e Posts"
                description="Receba sugestões de posts, promoções e a estratégia essencial de fotos 360 para gerar autoridade."
            />
            <Feature 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                title="Plano de Ação Priorizado"
                description="Um guia passo a passo com ações de SEO para você focar no que realmente traz resultado e subir no ranking."
            />
        </div>
    </div>
);
import React, { useState, useEffect } from 'react';
import { getAllPrompts, saveAllPrompts, resetPrompts, PROMPT_KEYS, DEFAULT_PROMPTS } from '../services/promptManager';

interface DeveloperDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const promptLabels: { [key: string]: string } = {
  [PROMPT_KEYS.FETCH_BUSINESS_INFO]: "1. Coleta de Informações da Empresa",
  [PROMPT_KEYS.GET_DETAILED_SCORECARD]: "2. Scorecard SEO Detalhado",
  [PROMPT_KEYS.GET_IMPROVEMENT_SUGGESTIONS]: "3. Sugestões de Melhoria",
  [PROMPT_KEYS.GET_COMPETITOR_ANALYSIS]: "4. Análise Competitiva",
  [PROMPT_KEYS.GET_LOCAL_RANKING]: "5. Ranqueamento Local",
  [PROMPT_KEYS.GET_KEYWORD_SUGGESTIONS]: "6. Sugestões de Palavras-Chave",
  [PROMPT_KEYS.GET_RESPONSE_TEMPLATES]: "7. Modelos de Resposta",
  [PROMPT_KEYS.GET_SEO_ACTIONS]: "8. Ações de SEO",
  [PROMPT_KEYS.GET_RADIUS_ANALYSIS]: "9. Análise de Raio",
  [PROMPT_KEYS.GET_IDEA_SUGGESTIONS]: "10. Gerador de Ideias",
  [PROMPT_KEYS.GET_OPTIMIZATION_BENEFITS]: "11. Benefícios da Otimização",
  [PROMPT_KEYS.GET_HEAD_TO_HEAD_ANALYSIS]: "12. Análise Direta (Head-to-Head)",
  [PROMPT_KEYS.GET_CUSTOMER_PROFILE_ANALYSIS]: "13. Perfil do Cliente",
  [PROMPT_KEYS.GET_REVIEW_SENTIMENT_ANALYSIS]: "14. Análise de Sentimento",
  [PROMPT_KEYS.GET_KEYWORD_VOLUME]: "15. Volume de Busca de Palavras-Chave",
};

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({ isOpen, onClose }) => {
  const [prompts, setPrompts] = useState(() => getAllPrompts());
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPrompts(getAllPrompts());
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }
  
  const handleInputChange = (key: string, field: 'systemInstruction' | 'contents', value: string) => {
    setPrompts(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const handleSavePrompts = () => {
    saveAllPrompts(prompts);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const handleResetPrompts = () => {
    const isConfirmed = window.confirm('Tem certeza de que deseja redefinir todos os prompts para os padrões? Suas personalizações serão perdidas.');
    if (isConfirmed) {
      resetPrompts();
      setPrompts(DEFAULT_PROMPTS);
      alert('Prompts redefinidos para os padrões. A página será recarregada para aplicar as alterações.');
      window.location.reload();
    }
  };

  const sortedPromptKeys = Object.keys(prompts).sort((a,b) => {
    const labelA = promptLabels[a] || a;
    const labelB = promptLabels[b] || b;
    const numA = parseInt(labelA.split('.')[0], 10);
    const numB = parseInt(labelB.split('.')[0], 10);
    return numA - numB;
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            <h2 className="text-xl font-bold text-white">Painel do Desenvolvedor (Prompts)</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <main className="overflow-y-auto p-6 space-y-6 flex-grow">
          
          {sortedPromptKeys.map(key => (
            <div key={key} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">{promptLabels[key] || key}</h3>
              <div className="space-y-4">
                {prompts[key].systemInstruction ? (
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Instrução do Sistema</label>
                        <textarea
                            value={prompts[key].systemInstruction}
                            onChange={e => handleInputChange(key, 'systemInstruction', e.target.value)}
                            className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                        />
                    </div>
                ) : null}
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Prompt (Conteúdo)</label>
                    <textarea
                        value={prompts[key].contents}
                        onChange={e => handleInputChange(key, 'contents', e.target.value)}
                        className="w-full h-48 bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                    />
                     <p className="text-xs text-slate-500 mt-1">Use <code className="bg-slate-900 px-1 rounded">{`{{variableName}}`}</code> para variáveis dinâmicas.</p>
                </div>
              </div>
            </div>
          ))}
        </main>
        
        <footer className="flex items-center justify-between p-4 border-t border-slate-700 flex-shrink-0 bg-slate-900/50">
          <button onClick={handleResetPrompts} className="text-sm text-red-400 hover:text-red-300 hover:underline">
            Redefinir Prompts
          </button>
          <div className="flex items-center gap-4">
            {showSuccess && <span className="text-sm text-green-400">Salvo com sucesso!</span>}
            <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                Fechar
            </button>
            <button onClick={handleSavePrompts} className="px-6 py-2 text-sm font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors">
                Salvar Prompts
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
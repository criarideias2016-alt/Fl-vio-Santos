import React, { useState, useEffect, useRef, FC, ChangeEvent } from 'react';
import { useNotification } from '../../contexts/NotificationContext.tsx';
import { useApiKeys } from '../../contexts/ApiKeyContext.tsx';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logoUrl: string | null;
  onLogoUpdate: (url: string | null) => void;
}

export const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onClose, logoUrl, onLogoUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stagedLogo, setStagedLogo] = useState<string | null>(logoUrl);
  const [isSaving, setIsSaving] = useState(false);
  const { addNotification } = useNotification();
  
  const { geminiApiKey, setGeminiApiKey } = useApiKeys();
  const [stagedGeminiKey, setStagedGeminiKey] = useState('');
  const [showGemini, setShowGemini] = useState(false);


  useEffect(() => {
    if (isOpen) {
        setStagedLogo(logoUrl);
        setStagedGeminiKey(geminiApiKey || '');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, logoUrl, geminiApiKey, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleLogoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type === 'image/png' && file.size < 2 * 1024 * 1024) { // 2MB limit
            const reader = new FileReader();
            reader.onloadend = () => {
                setStagedLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            addNotification('Por favor, selecione um arquivo PNG com menos de 2MB.', 'error');
        }
    }
  };

  const handleRemoveLogo = () => {
      setStagedLogo(null);
  };

  const handleSave = () => {
      setIsSaving(true);
      // Simulate API call
      setTimeout(() => {
        onLogoUpdate(stagedLogo);
        setGeminiApiKey(stagedGeminiKey.trim() || null);
        addNotification('Configurações salvas com sucesso!', 'success');
        setIsSaving(false);
        onClose();
      }, 800);
  };

  const EyeIcon: FC<{ open: boolean }> = ({ open }) => (
    open ? (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" /></svg>
    )
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-600 dark:text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
            </svg>
            <h2 id="settings-title" className="text-xl font-bold text-slate-800 dark:text-slate-200">Configurações</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" aria-label="Fechar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <main className="p-6 space-y-6">
             <div>
                <h3 className="text-md font-bold text-slate-700 dark:text-slate-300 mb-2">Logomarca do Relatório</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    Carregue a logomarca da sua empresa (formato PNG) para personalizar a capa dos relatórios em PDF.
                </p>
                <input type="file" accept="image/png" ref={fileInputRef} onChange={handleLogoFileChange} className="hidden" />
                 <div className="flex items-center gap-4">
                    <div className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700/50 w-24 h-20 flex items-center justify-center">
                        {stagedLogo ? (
                            <img src={stagedLogo} alt="Prévia da logomarca" className="max-h-full max-w-full object-contain" />
                        ) : (
                           <span className="text-xs text-slate-400">Sem logo</span>
                        )}
                    </div>
                    <div className="flex-grow">
                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                          {logoUrl ? 'Trocar Logomarca' : 'Carregar Logomarca'}
                        </button>
                        {stagedLogo && (
                            <button onClick={handleRemoveLogo} className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:underline mt-2 block">
                                Remover Logomarca
                            </button>
                        )}
                    </div>
                </div>
            </div>
             <div className="border-t border-slate-200 dark:border-slate-700"></div>
            <div>
                <h3 className="text-md font-bold text-slate-700 dark:text-slate-300 mb-2">Chave de API do Google Gemini</h3>
                <div className="space-y-4">
                    <div>
                        <div className="relative">
                            <input id="gemini-key" type={showGemini ? 'text' : 'password'} value={stagedGeminiKey} onChange={e => setStagedGeminiKey(e.target.value)} placeholder="Cole sua chave de API aqui" className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg py-2 pl-3 pr-10 text-slate-900 dark:text-slate-200" />
                            <button onClick={() => setShowGemini(!showGemini)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500" aria-label="Mostrar/ocultar chave Gemini">
                                <EyeIcon open={showGemini} />
                            </button>
                        </div>
                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                           Sua chave de API é necessária para que a IA funcione. Ela é salva com segurança apenas no seu navegador. 
                           <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold ml-1">
                               Obtenha sua chave gratuita no Google AI Studio.
                           </a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
        
        <footer className="flex items-center justify-end p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-2xl space-x-3">
            <button onClick={onClose} disabled={isSaving} className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50">
                Cancelar
            </button>
            <button onClick={handleSave} disabled={isSaving} className="w-28 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400">
                {isSaving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div> : 'Salvar'}
            </button>
        </footer>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logoUrl: string | null;
  onLogoUpdate: (url: string | null) => void;
}

const USER_API_KEY_STORAGE_KEY = 'gemini_user_api_key';

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, logoUrl, onLogoUpdate }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem(USER_API_KEY_STORAGE_KEY) || '';
      setApiKey(storedKey);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(USER_API_KEY_STORAGE_KEY, apiKey.trim());
    } else {
      localStorage.removeItem(USER_API_KEY_STORAGE_KEY);
    }
    setShowSuccess(true);
    setTimeout(() => {
        setShowSuccess(false);
        onClose();
    }, 1500);
  };

  const handleRemove = () => {
    localStorage.removeItem(USER_API_KEY_STORAGE_KEY);
    setApiKey('');
    onClose();
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type === 'image/png') {
            const reader = new FileReader();
            reader.onloadend = () => {
                onLogoUpdate(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Por favor, selecione um arquivo no formato PNG.');
        }
    }
  };

  const handleRemoveLogo = () => {
      onLogoUpdate(null);
  };


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
            </svg>
            <h2 id="settings-title" className="text-xl font-bold text-slate-800">Configurações</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition-colors" aria-label="Fechar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <main className="p-6 space-y-6">
            <div>
                <h3 className="text-md font-bold text-slate-700 mb-2">Chave de API do Gemini</h3>
                <div className="text-sm text-slate-500 mb-3 space-y-2">
                    <p>
                        Para evitar limites de uso, é altamente recomendável usar sua própria chave de API do Google AI Studio.
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1 font-semibold">Obtenha sua chave gratuita aqui.</a>
                    </p>
                    <p className="p-2 bg-amber-50 border-l-4 border-amber-400 text-amber-800">
                        <strong>Importante:</strong> Para usar a chave de API sem interrupções, você deve <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="font-semibold underline">ativar o faturamento</a> no seu projeto do Google Cloud. Isso não significa que você será cobrado imediatamente, pois há um nível de uso gratuito generoso.
                    </p>
                </div>
                <div className="relative">
                    <input
                        type={showKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        placeholder="Cole sua chave de API aqui..."
                        className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-4 pr-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={() => setShowKey(!showKey)} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-800" aria-label={showKey ? 'Ocultar chave' : 'Mostrar chave'}>
                        {showKey ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        )}
                    </button>
                </div>
            </div>
             <div>
                <h3 className="text-md font-bold text-slate-700 mb-2">Logomarca do Relatório</h3>
                <p className="text-sm text-slate-500 mb-3">
                    Carregue a logomarca da sua empresa (formato PNG) para personalizar a capa dos relatórios em PDF.
                </p>
                <input type="file" accept="image/png" ref={fileInputRef} onChange={handleLogoFileChange} className="hidden" />
                 <div className="flex items-center gap-4">
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                      {logoUrl ? 'Trocar Logomarca' : 'Carregar Logomarca'}
                    </button>
                    {logoUrl && (
                        <button onClick={handleRemoveLogo} className="text-sm text-red-600 hover:text-red-800 hover:underline">
                            Remover Logomarca
                        </button>
                    )}
                </div>
            </div>
        </main>
        
        <footer className="flex items-center justify-between p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
            <button onClick={handleRemove} className="text-sm text-red-600 hover:text-red-800 hover:underline">
                Remover Chave Salva
            </button>
            <div className="flex items-center gap-4">
                {showSuccess && <span className="text-sm text-green-600 font-semibold">Salvo!</span>}
                <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors">
                    Cancelar
                </button>
                <button onClick={handleSave} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    Salvar
                </button>
            </div>
        </footer>
      </div>
    </div>
  );
};

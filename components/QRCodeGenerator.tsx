import React, { useState, useEffect, FC } from 'react';
import QRCode from 'qrcode';
import { useCopyToClipboard } from './hooks/useCopyToClipboard';

type GeneratorMode = 'google' | 'whatsapp' | 'generic';

export const QRCodeGenerator: FC = () => {
    const [mode, setMode] = useState<GeneratorMode>('google');
    const [inputValue, setInputValue] = useState('');
    const [message, setMessage] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [isCopied, copy] = useCopyToClipboard();

    useEffect(() => {
        setInputValue('');
        setMessage('');
    }, [mode]);

    useEffect(() => {
        let finalUrl = '';
        if (mode === 'google' && inputValue) {
            finalUrl = `https://search.google.com/local/writereview?placeid=${inputValue.trim()}`;
            setGeneratedLink(finalUrl);
        } else if (mode === 'whatsapp' && inputValue) {
            const phoneNumber = inputValue.replace(/\D/g, ''); // Remove non-digits
            if (phoneNumber) {
                finalUrl = `https://wa.me/${phoneNumber}`;
                if (message) {
                    finalUrl += `?text=${encodeURIComponent(message.trim())}`;
                }
                setGeneratedLink(finalUrl);
            } else {
                 setGeneratedLink('');
            }
        } else if (mode === 'generic' && inputValue) {
            finalUrl = inputValue.trim();
            setGeneratedLink(finalUrl);
        } else {
            setGeneratedLink('');
        }

        if (finalUrl) {
            QRCode.toDataURL(finalUrl, { width: 300, margin: 2, errorCorrectionLevel: 'H' })
                .then(setQrCodeUrl)
                .catch(err => {
                    console.error("QR Code Generation Error:", err);
                    setQrCodeUrl('');
                });
        } else {
            setQrCodeUrl('');
        }
    }, [inputValue, message, mode]);

    const handleDownload = () => {
        if (!qrCodeUrl) return;
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `qrcode-${mode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const tabClasses = (tabMode: GeneratorMode) => `px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
        mode === tabMode 
        ? 'bg-blue-600 text-white' 
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
    }`;
    
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-3 mb-6">Gerador de QR Code e Links</h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Side: Inputs */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                        <button onClick={() => setMode('google')} className={tabClasses('google')}>Avaliação Google</button>
                        <button onClick={() => setMode('whatsapp')} className={tabClasses('whatsapp')}>Link do WhatsApp</button>
                        <button onClick={() => setMode('generic')} className={tabClasses('generic')}>URL Genérica</button>
                    </div>

                    {mode === 'google' && (
                        <div>
                            <label htmlFor="placeId" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Google Place ID</label>
                            <input 
                                id="placeId"
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: ChIJN1t_tDeuEmsRUsoyG83frY4"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                Ferramenta para encontrar o Place ID: <a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Place ID Finder</a>
                            </p>
                        </div>
                    )}

                    {mode === 'whatsapp' && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Número de Telefone</label>
                                <input 
                                    id="phoneNumber"
                                    type="tel"
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: 5511999999999"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                    Inclua o código do país + DDD, sem '+' ou espaços.
                                </p>
                            </div>
                            <div>
                                <label htmlFor="whatsappMessage" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Mensagem Padrão (opcional)</label>
                                <textarea
                                    id="whatsappMessage"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    rows={3}
                                    className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: Olá! Gostaria de mais informações."
                                />
                            </div>
                        </div>
                    )}

                    {mode === 'generic' && (
                        <div>
                            <label htmlFor="genericUrl" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">URL Completa</label>
                            <input 
                                id="genericUrl"
                                type="url"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://seusite.com.br"
                            />
                        </div>
                    )}
                    
                    {generatedLink && (
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Link Gerado</label>
                             <div className="flex items-center gap-2">
                                <input readOnly value={generatedLink} className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-sm rounded-lg p-2 truncate" />
                                <button onClick={() => copy(generatedLink)} title="Copiar link" className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold py-2 px-3 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/80 transition-colors">
                                    {isCopied ? 'Copiado!' : 'Copiar'}
                                </button>
                             </div>
                        </div>
                    )}
                </div>

                {/* Right Side: QR Code Display */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
                    {qrCodeUrl ? (
                        <>
                            <img src={qrCodeUrl} alt="Generated QR Code" className="w-48 h-48 rounded-lg border bg-white dark:border-slate-600" />
                            <button 
                                onClick={handleDownload}
                                className="mt-6 w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                                Baixar QR Code
                            </button>
                        </>
                    ) : (
                        <div className="text-center text-slate-500 dark:text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 14.625v4.5c0 .621.504 1.125 1.125 1.125h4.5c.621 0 1.125-.504 1.125-1.125v-4.5c0-.621-.504-1.125-1.125-1.125h-4.5a1.125 1.125 0 00-1.125 1.125zM16.5 16.5h.75v.75h-.75v-.75z" /></svg>
                            <p className="font-semibold">Seu QR Code aparecerá aqui.</p>
                            <p className="text-sm">Preencha os campos para começar.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
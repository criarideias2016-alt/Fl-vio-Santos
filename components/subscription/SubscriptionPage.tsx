
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const SubscriptionPage: React.FC = () => {
    const { user, subscription, subscribe, logout } = useAuth();
    const [isSubscribing, setIsSubscribing] = useState(false);

    const handleSubscribe = () => {
        setIsSubscribing(true);
        // Simulate API call to Asaas and wait for webhook
        setTimeout(() => {
            subscribe();
            setIsSubscribing(false);
        }, 2000);
    };

    const getTitle = () => {
        switch (subscription?.status) {
            case 'pending': return `Olá, ${user?.name}! Complete seu cadastro.`;
            case 'expired': return 'Sua assinatura expirou!';
            default: return 'Escolha seu plano';
        }
    };
    
    const getButtonText = () => {
        if (isSubscribing) return 'Processando...';
        return subscription?.status === 'expired' ? 'Renovar Assinatura' : 'Assinar Agora';
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
             <div className="absolute top-4 right-4">
                <button onClick={logout} className="font-semibold text-slate-600 hover:text-blue-600 transition-colors">Sair</button>
             </div>
            <div className="w-full max-w-lg text-center">
                 <div className="flex justify-center items-center gap-3 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-blue-600"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    <h1 className="text-2xl font-bold text-slate-800">Analisador de Perfil</h1>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{getTitle()}</h2>
                    <p className="text-slate-500 mb-8">
                        {subscription?.status === 'expired' 
                         ? 'Renove para continuar acessando as análises e otimizando seu perfil.'
                         : 'Tenha acesso ilimitado a todas as ferramentas de análise e otimização.'
                        }
                    </p>

                    <div className="border-2 border-blue-600 rounded-xl p-6 bg-blue-50/50">
                        <h3 className="font-bold text-blue-800 text-lg">Plano Pro</h3>
                        <p className="text-5xl font-extrabold text-slate-800 my-4">
                            R$49<span className="text-xl font-semibold text-slate-500">/mês</span>
                        </p>
                        <ul className="space-y-2 text-slate-600 text-left">
                           <li className="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>Análises ilimitadas</li>
                           <li className="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>Scorecard SEO completo</li>
                           <li className="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>Exportação de relatórios em PDF</li>
                           <li className="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>Análise de concorrência</li>
                        </ul>

                        <button 
                            onClick={handleSubscribe} 
                            disabled={isSubscribing}
                            className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-wait transition-colors"
                        >
                            {isSubscribing && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                           {getButtonText()}
                        </button>
                    </div>
                     <p className="text-xs text-slate-400 mt-4">Pagamento seguro processado via Asaas. Cancele quando quiser.</p>

                </div>
            </div>
        </div>
    );
};

import React, { useState, FC, useEffect } from 'react';
import { BusinessAnalyzer } from './BusinessAnalyzer.tsx';
import { SettingsModal } from './SettingsModal.tsx';
import { ThemeToggle } from './ui/ThemeToggle.tsx';
import { QRCodeGenerator } from './QRCodeGenerator.tsx';


// FIX: Defined the 'View' type to resolve type errors.
type View = 'dashboard' | 'analyzer' | 'tools';

const DashboardHeader: FC<{ 
    activeView: View; 
    onNavigate: (view: View) => void;
    onOpenSettings: () => void;
    logoUrl: string | null;
}> = ({ activeView, onNavigate, onOpenSettings, logoUrl }) => {

    const navLinkClasses = (view: View) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        activeView === view 
            ? 'bg-blue-600 text-white' 
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`;

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-700/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 h-8">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logomarca da sua agência" className="h-full max-w-xs object-contain" />
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-600"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                <h1 className="hidden sm:block text-xl font-bold text-slate-800 dark:text-slate-200">Analisador</h1>
                            </>
                        )}
                    </div>
                    <nav className="hidden md:flex items-center gap-2">
                        <button onClick={() => onNavigate('dashboard')} className={navLinkClasses('dashboard')}>Dashboard</button>
                        <button onClick={() => onNavigate('analyzer')} className={navLinkClasses('analyzer')}>Analisador</button>
                        <button onClick={() => onNavigate('tools')} className={navLinkClasses('tools')}>Ferramentas</button>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <button onClick={onOpenSettings} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Abrir configurações">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
                        </svg>
                    </button>
                </div>
            </div>
             <nav className="md:hidden p-2 border-t border-slate-200 dark:border-slate-700 flex justify-around">
                <button onClick={() => onNavigate('dashboard')} className={navLinkClasses('dashboard')}>Dashboard</button>
                <button onClick={() => onNavigate('analyzer')} className={navLinkClasses('analyzer')}>Analisador</button>
                {/* FIX: Corrected incomplete button element due to file corruption. */}
                <button onClick={() => onNavigate('tools')} className={navLinkClasses('tools')}>Ferramentas</button>
            </nav>
        </header>
    );
};

// FIX: Added and exported the main Dashboard component, which was missing.
export const Dashboard: FC = () => {
    const [activeView, setActiveView] = useState<View>('analyzer');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        try {
            const savedLogo = localStorage.getItem('company_logo');
            if (savedLogo) {
                setLogoUrl(savedLogo);
            }
        } catch (error) {
            console.error("Failed to read logo from localStorage", error);
        }
    }, []);

    const handleLogoUpdate = (url: string | null) => {
        setLogoUrl(url);
        try {
            if (url) {
                localStorage.setItem('company_logo', url);
            } else {
                localStorage.removeItem('company_logo');
            }
        } catch (error) {
            console.error("Failed to save logo to localStorage", error);
        }
    };

    const renderView = () => {
        switch (activeView) {
            case 'analyzer':
                return <BusinessAnalyzer initialAnalysis={null} logoUrl={logoUrl} />;
            case 'tools':
                return <div className="p-4 sm:p-6 lg:p-8"><QRCodeGenerator /></div>;
            case 'dashboard':
                return (
                    <div className="p-4 sm:p-6 lg:p-8">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Dashboard</h2>
                        <p className="text-slate-600 dark:text-slate-400">Bem-vindo ao seu painel. Selecione "Analisador" ou "Ferramentas" para começar.</p>
                    </div>
                );
            default:
                return <BusinessAnalyzer initialAnalysis={null} logoUrl={logoUrl} />;
        }
    };

    return (
        <div className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-200 min-h-screen">
            <DashboardHeader 
                activeView={activeView}
                onNavigate={setActiveView}
                onOpenSettings={() => setIsSettingsOpen(true)}
                logoUrl={logoUrl}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderView()}
            </main>
            
            <SettingsModal 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                logoUrl={logoUrl}
                onLogoUpdate={handleLogoUpdate}
            />
        </div>
    );
};

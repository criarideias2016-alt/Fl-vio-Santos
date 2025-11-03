
import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { SubscriptionPage } from './components/subscription/SubscriptionPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BusinessAnalyzer } from './components/BusinessAnalyzer';

const App: React.FC = () => {
  const { user, subscription, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'login' | 'signup'>('login');
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  if (!user) {
    if (currentView === 'login') {
      return <LoginPage onSwitchToSignUp={() => setCurrentView('signup')} />;
    }
    return <SignUpPage onSwitchToLogin={() => setCurrentView('login')} />;
  }

  if (user.role === 'admin' && isAdminDashboardOpen) {
      return <AdminDashboard onClose={() => setIsAdminDashboardOpen(false)} />;
  }

  if (subscription?.status !== 'active') {
    return <SubscriptionPage />;
  }
  
  // User is authenticated and subscribed
  return (
    <>
      {user.role === 'admin' && (
        <div className="bg-yellow-400 text-yellow-900 text-sm font-bold p-2 text-center sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
             <span>Você está no modo Administrador.</span>
             <div>
               <button onClick={() => setIsAdminDashboardOpen(true)} className="bg-yellow-600 text-white py-1 px-3 rounded-md hover:bg-yellow-700 transition-colors mr-4">
                  Acessar Dashboard
               </button>
               <button onClick={logout} className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-colors">
                  Sair
               </button>
             </div>
          </div>
        </div>
      )}
      <BusinessAnalyzer />
    </>
  );
};

export default App;

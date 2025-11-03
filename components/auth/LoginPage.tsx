
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
  onSwitchToSignUp: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    // In a real app, you'd validate the password here.
    // We'll just use the email for our mock login.
    login(email);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
            <div className="flex justify-center items-center gap-3 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-blue-600"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <h1 className="text-2xl font-bold text-slate-800">Analisador de Perfil</h1>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80">
                <h2 className="text-xl font-bold text-slate-800 mb-1">Bem-vindo de volta!</h2>
                <p className="text-slate-500 mb-6">Faça login para acessar sua análise.</p>
                
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="email">Email</label>
                        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="voce@email.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="password">Senha</label>
                        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Entrar
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-300" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-sm text-slate-500">Ou continue com</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="w-full flex items-center justify-center gap-2 border border-slate-300 py-2.5 px-4 rounded-lg hover:bg-slate-100 transition-colors">
                        {/* Google SVG */}
                        <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A8 8 0 0 1 24 36c-5.222 0-9.618-3.224-11.283-7.662l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.684 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                        Google
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 border border-slate-300 py-2.5 px-4 rounded-lg hover:bg-slate-100 transition-colors">
                         {/* Apple SVG */}
                        <svg className="w-5 h-5" role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.94,11.39c0,1.21-0.65,2.35-1.74,3.03c-1.09,0.68-2.31,0.86-3.48,0.48c-0.06-0.42-0.12-0.85-0.18-1.27 c-0.04-0.29-0.08-0.58-0.1-0.87c-0.01-0.15-0.01-0.3-0.01-0.45c0-0.17,0.01-0.34,0.02-0.51c0.2-2.33,2.02-4.14,4.35-4.32 c0.07-0.92-0.18-1.84-0.69-2.65c-0.9-1.4-2.42-2.25-4.04-2.25c-1.5,0-2.88,0.73-3.79,1.86c-0.88,1.08-1.33,2.4-1.33,3.79 c0,0.12,0.01,0.24,0.02,0.36c-2.12-0.01-4.04-1.22-5.12-2.95c-1.12,1.93-0.55,4.5,1.26,6.29c0.55,0.54,1.21,0.92,1.91,1.15 c0.04,0.38,0.06,0.76,0.06,1.14c0,2.1-0.81,4.06-2.23,5.55c-0.29,0.3-0.58,0.59-0.86,0.87c1.4,1.15,3.15,1.81,5,1.81 c1.6,0,3.1-0.5,4.3-1.39c1.43-1.04,2.39-2.58,2.7-4.29c0.01-0.08,0.02-0.17,0.02-0.25c0.03-0.79-0.1-1.56-0.41-2.27 C20.16,13.68,20.94,12.58,20.94,11.39z M12.8,4.45c0.9-0.9,2.04-1.45,3.27-1.45c0.39,0,0.77,0.06,1.13,0.18 c-0.93,0.65-1.63,1.63-1.99,2.73c-0.97,0.04-1.88,0.52-2.52,1.29C12.2,6.52,12.51,5.51,12.8,4.45z"></path>
                        </svg>
                        Apple
                    </button>
                </div>
            </div>

            <p className="text-center text-sm text-slate-600 mt-6">
                Não tem uma conta?{' '}
                <button onClick={onSwitchToSignUp} className="font-semibold text-blue-600 hover:underline">
                    Cadastre-se
                </button>
            </p>
        </div>
    </div>
  );
};

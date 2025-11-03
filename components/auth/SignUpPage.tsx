
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface SignUpPageProps {
  onSwitchToLogin: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    // In a real app, you'd validate email/password strength here.
    signup(email, name);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
            <div className="flex justify-center items-center gap-3 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-blue-600"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <h1 className="text-2xl font-bold text-slate-800">Analisador de Perfil</h1>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80">
                <h2 className="text-xl font-bold text-slate-800 mb-1">Crie sua conta</h2>
                <p className="text-slate-500 mb-6">Comece sua jornada de otimização local.</p>
                
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="name">Nome</label>
                        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Seu nome" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="email">Email</label>
                        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="voce@email.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="password">Senha</label>
                        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Criar Conta
                    </button>
                </form>

            </div>

            <p className="text-center text-sm text-slate-600 mt-6">
                Já tem uma conta?{' '}
                <button onClick={onSwitchToLogin} className="font-semibold text-blue-600 hover:underline">
                    Faça login
                </button>
            </p>
        </div>
    </div>
  );
};

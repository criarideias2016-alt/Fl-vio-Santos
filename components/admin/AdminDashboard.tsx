
import React, { useState } from 'react';
import type { AdminUser, AdminPayment } from '../../types';

interface AdminDashboardProps {
  onClose: () => void;
}

type Tab = 'users' | 'payments' | 'stats' | 'settings';

const mockUsers: AdminUser[] = [
    { id: 'user_1', name: 'Alice Silva', email: 'alice.silva@example.com', role: 'user', createdAt: '2024-07-20T10:00:00Z', subscription: { status: 'active', startDate: '2024-07-20T10:05:00Z', endDate: '2024-08-20T10:05:00Z', paymentId: 'pay_1' } },
    { id: 'user_2', name: 'Bruno Costa', email: 'bruno.costa@example.com', role: 'user', createdAt: '2024-07-18T14:30:00Z', subscription: { status: 'active', startDate: '2024-07-18T14:35:00Z', endDate: '2024-08-18T14:35:00Z', paymentId: 'pay_2' } },
    { id: 'user_3', name: 'Carla Dias', email: 'carla.dias@example.com', role: 'user', createdAt: '2024-06-15T09:00:00Z', subscription: { status: 'expired', startDate: '2024-06-15T09:05:00Z', endDate: '2024-07-15T09:05:00Z', paymentId: 'pay_3' } },
    { id: 'user_4', name: 'Daniel Alves', email: 'daniel.alves@example.com', role: 'user', createdAt: '2024-07-21T11:00:00Z', subscription: { status: 'pending', startDate: null, endDate: null, paymentId: null } },
];

const mockPayments: AdminPayment[] = [
    { id: 'pay_1', userId: 'user_1', userEmail: 'alice.silva@example.com', amount: 49.00, method: 'Pix', status: 'Pago', paidDate: '2024-07-20T10:05:00Z' },
    { id: 'pay_2', userId: 'user_2', userEmail: 'bruno.costa@example.com', amount: 49.00, method: 'Cartão de crédito', status: 'Pago', paidDate: '2024-07-18T14:35:00Z' },
    { id: 'pay_3_old', userId: 'user_3', userEmail: 'carla.dias@example.com', amount: 49.00, method: 'Boleto', status: 'Pago', paidDate: '2024-06-15T09:05:00Z' },
    { id: 'pay_4_pending', userId: 'user_4', userEmail: 'daniel.alves@example.com', amount: 49.00, method: 'Boleto', status: 'Pendente', paidDate: '' },
];


const StatusBadge: React.FC<{ status: 'active' | 'pending' | 'expired' | 'inactive' }> = ({ status }) => {
    const styles = {
        active: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        expired: 'bg-red-100 text-red-800',
        inactive: 'bg-slate-100 text-slate-800',
    };
    const text = {
        active: 'Ativo',
        pending: 'Pendente',
        expired: 'Expirado',
        inactive: 'Inativo'
    }
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>{text[status]}</span>;
};

const PaymentStatusBadge: React.FC<{ status: 'Pago' | 'Pendente' | 'Expirado' }> = ({ status }) => {
    const styles = {
        Pago: 'bg-green-100 text-green-800',
        Pendente: 'bg-yellow-100 text-yellow-800',
        Expirado: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>{status}</span>;
}


export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('stats');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersTab />;
      case 'payments':
        return <PaymentsTab />;
      case 'stats':
        return <StatsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };

  // FIX: Replaced JSX.Element with React.ReactNode to fix "Cannot find namespace 'JSX'" error.
  const tabs: {id: Tab, name: string, icon: React.ReactNode}[] = [
      { id: 'stats', name: 'Estatísticas', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg> },
      { id: 'users', name: 'Usuários', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.14.237-.28.348-.432m-11.964 4.67a6.375 6.375 0 01-3.48-.432m3.48.432a6.375 6.375 0 003.48-.432" /></svg> },
      { id: 'payments', name: 'Pagamentos', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" /></svg> },
      { id: 'settings', name: 'Configurações', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" /></svg> },
  ];

  return (
     <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex" role="dialog" aria-modal="true">
        <div className="w-64 bg-slate-900 p-4 border-r border-slate-700/50 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-500"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <h1 className="text-xl font-bold text-white">Admin</h1>
            </div>
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {tabs.map(tab => (
                        <li key={tab.id}>
                            <button onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-md transition-colors duration-200 text-left ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                                {tab.icon}
                                <span>{tab.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="flex-shrink-0">
                <button onClick={onClose} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-md text-slate-300 hover:bg-slate-700 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
                    <span>Voltar ao App</span>
                </button>
            </div>
        </div>
        <main className="flex-1 bg-slate-800 overflow-y-auto">
            <div className="p-8">
                {renderContent()}
            </div>
        </main>
    </div>
  );
};

const StatsTab = () => (
    <div>
        <h2 className="text-3xl font-bold text-white mb-8">Estatísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
                <h3 className="text-sm font-medium text-slate-400">Total Recebido (Mês)</h3>
                <p className="text-4xl font-bold text-white mt-2">R$ 98,00</p>
                <p className="text-sm text-green-400 mt-1">+100% vs Mês Anterior</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
                <h3 className="text-sm font-medium text-slate-400">Assinaturas Ativas</h3>
                <p className="text-4xl font-bold text-white mt-2">2</p>
                <p className="text-sm text-slate-400 mt-1">de 4 usuários totais</p>
            </div>
             <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
                <h3 className="text-sm font-medium text-slate-400">Novos Usuários (Mês)</h3>
                <p className="text-4xl font-bold text-white mt-2">3</p>
                 <p className="text-sm text-green-400 mt-1">+200% vs Mês Anterior</p>
            </div>
        </div>
    </div>
);

const UsersTab = () => (
  <div>
    <h2 className="text-3xl font-bold text-white mb-8">Gerenciar Usuários</h2>
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Data de Expiração</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Ações</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
                {mockUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-800/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            <div className="text-sm text-slate-400">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={user.subscription.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {user.subscription.endDate ? new Date(user.subscription.endDate).toLocaleDateString('pt-BR') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <a href="#" className="text-blue-400 hover:text-blue-300">Editar</a>
                             <a href="#" className="text-red-400 hover:text-red-300 ml-4">Desativar</a>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  </div>
);

const PaymentsTab = () => (
    <div>
        <h2 className="text-3xl font-bold text-white mb-8">Monitoramento Financeiro (Asaas)</h2>
        <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-700">
                 <thead className="bg-slate-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Usuário</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Valor</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Método</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Data</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {mockPayments.map(p => (
                         <tr key={p.id} className="hover:bg-slate-800/50">
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{p.userEmail}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">R$ {p.amount.toFixed(2).replace('.',',')}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{p.method}</td>
                             <td className="px-6 py-4 whitespace-nowrap"><PaymentStatusBadge status={p.status} /></td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{p.paidDate ? new Date(p.paidDate).toLocaleString('pt-BR') : 'N/A'}</td>
                         </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const SettingsTab = () => (
    <div>
        <h2 className="text-3xl font-bold text-white mb-8">Configurações do Sistema</h2>
        <div className="space-y-8 max-w-2xl">
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
                 <h3 className="text-lg font-bold text-white mb-4">Plano de Assinatura</h3>
                 <div className="space-y-4">
                     <div>
                        <label htmlFor="plan-price" className="block text-sm font-medium text-slate-300 mb-1">Valor do Plano (R$)</label>
                        <input type="number" id="plan-price" defaultValue="49" className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                     </div>
                      <div>
                        <label htmlFor="plan-duration" className="block text-sm font-medium text-slate-300 mb-1">Duração do Plano (dias)</label>
                        <input type="number" id="plan-duration" defaultValue="30" className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                     </div>
                 </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
                 <h3 className="text-lg font-bold text-white mb-4">Integração Asaas</h3>
                 <div className="space-y-4">
                     <div>
                        <label htmlFor="asaas-token" className="block text-sm font-medium text-slate-300 mb-1">Asaas API Token</label>
                        <input type="password" id="asaas-token" defaultValue="************" className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                     </div>
                      <div>
                        <label htmlFor="asaas-webhook" className="block text-sm font-medium text-slate-300 mb-1">URL do Webhook</label>
                        <input type="text" id="asaas-webhook" readOnly value="https://seusistema.com/api/webhooks/asaas" className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-sm text-gray-400 cursor-not-allowed" />
                     </div>
                 </div>
            </div>

             <div className="flex justify-end">
                <button className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors">Salvar Configurações</button>
             </div>
        </div>
    </div>
);

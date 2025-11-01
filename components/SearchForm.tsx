
import React from 'react';

interface SearchFormProps {
  businessName: string;
  setBusinessName: (name: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  isLocationAvailable: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  businessName,
  setBusinessName,
  onAnalyze,
  isLoading,
  isLocationAvailable
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-grow">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h2.64m-13.5 0L12 18.75m-2.64 2.25L5.25 12l6.75-6.75m6.75 6.75L12 5.25m.007 13.5H12m-6.75 0H12" />
        </svg>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Digite o nome da empresa..."
          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
          disabled={isLoading}
        />
        {isLocationAvailable && (
             <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" title="Geolocalização ativada para resultados mais precisos">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
            </div>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || !businessName.trim()}
        className="flex items-center justify-center bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analisando...
          </>
        ) : (
          'Analisar Perfil'
        )}
      </button>
    </form>
  );
};

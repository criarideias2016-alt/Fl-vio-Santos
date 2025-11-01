import React from 'react';

interface LoadingIndicatorProps {
  message: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => (
  <div className="text-center p-8 bg-slate-800/30 rounded-lg">
    <div className="flex justify-center items-center mb-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
    </div>
    <p className="text-lg text-slate-300 font-semibold">{message || 'Analisando...'}</p>
    <p className="text-slate-400">A mágica da IA está acontecendo. Isso pode levar um momento.</p>
  </div>
);

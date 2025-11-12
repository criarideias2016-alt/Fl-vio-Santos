import React, { FC } from 'react';

interface LoadingIndicatorProps {
  message: string;
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ message }) => (
  <div className="text-center p-8 bg-white/60 dark:bg-slate-800/60 rounded-lg">
    <div className="flex justify-center items-center mb-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    <p className="text-lg text-slate-700 dark:text-slate-300 font-semibold">{message || 'Analisando...'}</p>
    <p className="text-slate-600 dark:text-slate-400">A mágica da IA está acontecendo. Isso pode levar um momento.</p>
  </div>
);
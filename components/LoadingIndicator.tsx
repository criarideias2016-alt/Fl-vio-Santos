import React from 'react';

interface LoadingIndicatorProps {
  message: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => (
  <div className="text-center p-8 bg-white/60 rounded-lg">
    <div className="flex justify-center items-center mb-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    <p className="text-lg text-gray-700 font-semibold">{message || 'Analisando...'}</p>
    <p className="text-gray-600">A mágica da IA está acontecendo. Isso pode levar um momento.</p>
  </div>
);
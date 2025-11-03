import React from 'react';
import type { ResponsesResult, ResponseTemplate } from '../types';

interface ResponseTemplatesDisplayProps {
  result: ResponsesResult;
}

const TemplateCard: React.FC<{ template: ResponseTemplate }> = ({ template }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(template.text);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex justify-between items-start">
                <h4 className="text-md font-bold text-gray-700 mb-2">{template.title}</h4>
                <button onClick={handleCopy} title="Copiar texto" className="text-gray-500 hover:text-blue-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    </svg>
                </button>
            </div>
            <p className="text-gray-600 whitespace-pre-line">{template.text}</p>
        </div>
    );
};

export const ResponseTemplatesDisplay: React.FC<ResponseTemplatesDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-6">Modelos de Resposta para Avaliações</h2>
        <p className="text-gray-600 mb-6">Use estes modelos como ponto de partida para interagir com seus clientes e melhorar sua reputação online.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M6.633 10.5l-1.87-1.87a.75.75 0 00-1.06 0l-1.06 1.06a.75.75 0 000 1.06l4.5 4.5a.75.75 0 001.06 0l6.364-6.364a.75.75 0 00-1.06-1.06L6.633 10.5z" /></svg>
              Respostas para Avaliações Positivas
            </h3>
            <div className="space-y-4">
              {result.positive.map((template, index) => (
                <TemplateCard key={`pos-${index}`} template={template} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-8.024a4.5 4.5 0 01-1.22 6.22l-6.44 6.44a4.5 4.5 0 01-6.22-1.22l-1.12-1.98a4.5 4.5 0 011.22-6.22l6.44-6.44a4.5 4.5 0 016.22 1.22l1.12 1.98z" /></svg>
                Respostas para Avaliações Negativas
            </h3>
            <div className="space-y-4">
              {result.negative.map((template, index) => (
                <TemplateCard key={`neg-${index}`} template={template} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
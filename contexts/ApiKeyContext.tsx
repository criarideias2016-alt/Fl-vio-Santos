import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface ApiKeyContextType {
  geminiApiKey: string | null;
  openAIApiKey: string | null;
  setGeminiApiKey: (key: string | null) => void;
  setOpenAIApiKey: (key: string | null) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [geminiApiKey, setGeminiApiKeyState] = useState<string | null>(null);
  const [openAIApiKey, setOpenAIApiKeyState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setGeminiApiKeyState(localStorage.getItem('gemini_api_key'));
      setOpenAIApiKeyState(localStorage.getItem('openai_api_key'));
    } catch (e) {
      console.error("Failed to read API keys from localStorage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setGeminiApiKey = (key: string | null) => {
    setGeminiApiKeyState(key);
    try {
      if (key) {
        localStorage.setItem('gemini_api_key', key);
      } else {
        localStorage.removeItem('gemini_api_key');
      }
    } catch (e) {
      console.error("Failed to save Gemini API key to localStorage", e);
    }
  };

  const setOpenAIApiKey = (key: string | null) => {
    setOpenAIApiKeyState(key);
    try {
      if (key) {
        localStorage.setItem('openai_api_key', key);
      } else {
        localStorage.removeItem('openai_api_key');
      }
    } catch (e) {
      console.error("Failed to save OpenAI API key to localStorage", e);
    }
  };
  
  if (isLoading) {
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return (
    <ApiKeyContext.Provider value={{ geminiApiKey, openAIApiKey, setGeminiApiKey, setOpenAIApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKeys = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKeys must be used within an ApiKeyProvider');
  }
  return context;
};

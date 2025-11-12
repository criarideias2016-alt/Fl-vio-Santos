import { useState, useCallback, useEffect } from 'react';

export const useCopyToClipboard = (resetInterval: number = 2000): [boolean, (text: string) => void] => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
    });
  }, []);

  useEffect(() => {
    let timeout: number;
    if (isCopied) {
      timeout = window.setTimeout(() => setIsCopied(false), resetInterval);
    }
    return () => {
      window.clearTimeout(timeout);
    };
  }, [isCopied, resetInterval]);

  return [isCopied, handleCopy];
};

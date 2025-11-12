import React, { FC, useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard.tsx';
import { ToastContainer } from './components/ui/Toast.tsx';
import { SplashScreen } from './components/SplashScreen.tsx';

const SPLASH_VISIBLE_DURATION = 2500; // Tempo que a splash screen fica visível antes de começar a desaparecer
const FADE_OUT_DURATION = 500;       // Duração da animação de desaparecimento (deve corresponder ao CSS)

const App: FC = () => {
  // Estado para a lógica da tela de splash.
  const [isSplashVisible, setIsSplashVisible] = useState(() => !sessionStorage.getItem('splashShown'));
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (isSplashVisible) {
      // Timer para iniciar o fade out
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
        sessionStorage.setItem('splashShown', 'true');

        // Timer para remover o componente do DOM após o fade out
        const visibilityTimer = setTimeout(() => {
          setIsSplashVisible(false);
        }, FADE_OUT_DURATION);

        return () => clearTimeout(visibilityTimer);
      }, SPLASH_VISIBLE_DURATION);

      return () => clearTimeout(fadeTimer);
    }
  }, [isSplashVisible]);
  
  return (
    <>
      <ToastContainer />
      {isSplashVisible && <SplashScreen isFadingOut={isFadingOut} />}
      {!isSplashVisible && <Dashboard />}
    </>
  );
};

export default App;
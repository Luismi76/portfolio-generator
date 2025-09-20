import React from 'react';
import PortfolioGenerator from './components/PortfolioGenerator';

function App(): React.ReactElement {
  // Detectar el modo desde diferentes fuentes
  const getMode = (): 'editor' | 'templates' | 'customize' | 'preview' | 'portfolio' => {
    // 1. Variable de entorno (para build)
    if (process.env.REACT_APP_MODE === 'portfolio') {
      return 'portfolio';
    }
    
    // 2. URL parameter (?mode=editor, ?mode=porfolio, etc.)
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode');
    
    // Mapear "porfolio" a "portfolio" para compatibilidad
    if (urlMode === 'porfolio') {
      return 'portfolio';
    }
    
    if (urlMode === 'editor' || urlMode === 'portfolio' || urlMode === 'templates' || 
        urlMode === 'customize' || urlMode === 'preview') {
      return urlMode as 'editor' | 'templates' | 'customize' | 'preview' | 'portfolio';
    }
    
    // 3. LocalStorage setting
    const savedMode = localStorage.getItem('portfolioMode');
    if (savedMode === 'portfolio') {
      return 'portfolio';
    }
    
    // 4. Default: portfolio para producción, editor para desarrollo
    return process.env.NODE_ENV === 'production' ? 'portfolio' : 'editor';
  };

  const initialMode = getMode();

  return (
    <div className="App">
      <PortfolioGenerator initialMode={initialMode} />
    </div>
  );
}

export default App;
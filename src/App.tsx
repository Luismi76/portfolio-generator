import React from 'react';
import PortfolioGenerator from './components/PortfolioGenerator';
import Portfolio from './components/Portfolio';

function App(): React.ReactElement {
  // Detectar el modo desde diferentes fuentes
  const getMode = (): 'editor' | 'portfolio' => {
    // 1. Variable de entorno (para build)
    if (process.env.REACT_APP_MODE === 'portfolio') {
      return 'portfolio';
    }
    
    // 2. URL parameter (?mode=editor o ?mode=portfolio)
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode');
    if (urlMode === 'editor' || urlMode === 'portfolio') {
      return urlMode as 'editor' | 'portfolio';
    }
    
    // 3. LocalStorage setting
    const savedMode = localStorage.getItem('portfolioMode');
    if (savedMode === 'portfolio') {
      return 'portfolio';
    }
    
    // 4. Default: editor para desarrollo
    return 'editor';
  };

  const mode = getMode();

  return (
    <div className="App">
      {/* Renderizar componente según el modo */}
      {mode === 'editor' ? <PortfolioGenerator /> : <Portfolio />}
    </div>
  );
}

export default App;
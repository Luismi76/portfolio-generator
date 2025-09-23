// src/App.tsx - Con sistema de plantillas (corregido para TemplateSelector plug-and-play)
import React, { useState, useEffect } from 'react';

// Componentes principales
import ModernPortfolioEditor from './components/editor/ModernPortfolioEditor';
import PortfolioViewer from './components/PorfolioViewer';
import { TemplateSelector } from './components/TemplateSelector';
import { TemplateCustomizer } from './components/TemplateCustomizer';
import { useTemplates } from './components/use-templates';

// Tipos para el modo de la aplicación
type AppMode = 'editor' | 'portfolio' | 'templates' | 'customize';

interface AppState {
  mode: AppMode;
  isLoading: boolean;
  error: string | null;
}

// Componente de loading spinner
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`} />
  );
};

// Componente de toggle de modo (solo desarrollo)
const ModeToggle: React.FC<{
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}> = ({ currentMode, onModeChange }) => (
  <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-2 z-50 border">
    <div className="flex gap-1">
      <button
        onClick={() => onModeChange('editor')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentMode === 'editor' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Editor
      </button>
      <button
        onClick={() => onModeChange('templates')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentMode === 'templates' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Plantillas
      </button>
      <button
        onClick={() => onModeChange('portfolio')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentMode === 'portfolio' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Portfolio
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  // Hook de plantillas
  const templates = useTemplates();

  // Función para determinar el modo inicial
  function getInitialMode(): AppMode {
    // 1. Variable de entorno (para builds de producción)
    if (process.env.REACT_APP_MODE === 'portfolio') {
      return 'portfolio';
    }
    if (process.env.REACT_APP_MODE === 'editor') {
      return 'editor';
    }
    if (process.env.REACT_APP_MODE === 'templates') {
      return 'templates';
    }

    // 2. Parámetro URL (?mode=editor|portfolio|templates|customize)
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode') as AppMode;
    if (['editor', 'portfolio', 'templates', 'customize'].includes(urlMode)) {
      return urlMode;
    }

    // 3. LocalStorage
    try {
      const savedMode = localStorage.getItem('app-mode') as AppMode;
      if (['editor', 'portfolio', 'templates', 'customize'].includes(savedMode)) {
        return savedMode;
      }
    } catch (error) {
      console.warn('Error reading mode from localStorage:', error);
    }

    // 4. Default basado en environment
    return process.env.NODE_ENV === 'development' ? 'editor' : 'portfolio';
  }

  // Estado de la aplicación
  const [appState, setAppState] = useState<AppState>({
    mode: getInitialMode(),
    isLoading: true,
    error: null,
  });

  // Cambiar modo
  const switchMode = (newMode: AppMode) => {
    setAppState((prev) => ({ ...prev, mode: newMode }));

    // Guardar en localStorage
    try {
      localStorage.setItem('app-mode', newMode);
    } catch (error) {
      console.warn('Error saving mode to localStorage:', error);
    }

    // Actualizar URL sin recargar página
    const url = new URL(window.location.href);
    url.searchParams.set('mode', newMode);
    window.history.replaceState({}, '', url.toString());
  };

  // Shortcuts de teclado
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      // Solo en desarrollo
      if (process.env.NODE_ENV !== 'development') return;

      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'm': {
            event.preventDefault();
            // Ciclar entre modos: editor -> templates -> portfolio -> editor
            const modes: AppMode[] = ['editor', 'templates', 'portfolio'];
            const currentIndex = modes.indexOf(appState.mode);
            const nextMode = modes[(currentIndex + 1) % modes.length];
            switchMode(nextMode);
            break;
          }
          case 'e':
            event.preventDefault();
            switchMode('editor');
            break;
          case 't':
            event.preventDefault();
            switchMode('templates');
            break;
          case 'p':
            event.preventDefault();
            switchMode('portfolio');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [appState.mode]);

  // Efecto para manejar la carga inicial
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simular carga de configuración (solo en desarrollo)
        if (process.env.NODE_ENV === 'development') {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        setAppState((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        setAppState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
        }));
      }
    };

    initializeApp();
  }, []);

  // Handler para errores
  const handleError = (error: Error) => {
    console.error('App Error:', error);
    setAppState((prev) => ({
      ...prev,
      error: error.message,
    }));
  };

  // Limpiar error
  const clearError = () => {
    setAppState((prev) => ({ ...prev, error: null }));
  };

  // Mostrar pantalla de carga
  if (appState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h2 className="mt-6 text-2xl font-bold text-gray-800">Portfolio Generator</h2>
          <p className="mt-2 text-gray-600">Cargando tu editor de portfolios profesionales...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si existe
  if (appState.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-6 text-center border border-red-200">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Algo salió mal</h2>
          <p className="text-gray-600 mb-6">{appState.error}</p>
          <div className="space-y-3">
            <button
              onClick={clearError}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Intentar de nuevo
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Recargar página
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Función para renderizar el contenido según el modo
  const renderContent = () => {
    switch (appState.mode) {
      case 'editor':
        return <ModernPortfolioEditor />;

      case 'templates':
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b">
              <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-800">Gestión de Plantillas</h1>
                  <button
                    onClick={() => switchMode('editor')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Volver al Editor
                  </button>
                </div>
              </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 py-8">
              {/* Versión plug-and-play: solo onCustomizeClick */}
              <TemplateSelector onCustomizeClick={() => switchMode('customize')} />
            </div>
          </div>
        );

      case 'customize':
        return templates.selectedTemplate && templates.config ? (
          <TemplateCustomizer
            template={templates.selectedTemplate}
            config={templates.config}
            onConfigChange={(cfg) => templates.updateConfig(cfg)} // forwarder
            onSave={() => switchMode('templates')}
            onCancel={() => switchMode('templates')}
          />
        ) : (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">No hay plantilla seleccionada</h2>
              <p className="text-gray-600 mb-4">Selecciona una plantilla para personalizar</p>
              <button
                onClick={() => switchMode('templates')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Seleccionar Plantilla
              </button>
            </div>
          </div>
        );

      case 'portfolio':
        return <PortfolioViewer />;

      default:
        return <ModernPortfolioEditor />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toggle de modo (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <ModeToggle currentMode={appState.mode} onModeChange={switchMode} />
      )}

      {/* Contenido principal */}
      {renderContent()}

      {/* Indicador de shortcuts (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-gray-900 text-white px-4 py-3 rounded-lg text-sm z-40 shadow-lg">
          <div className="font-semibold">Portfolio Generator v2.0</div>
          <div className="flex items-center gap-2 mt-1">
            <span>Modo:</span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                appState.mode === 'editor'
                  ? 'bg-green-600 text-white'
                  : appState.mode === 'templates'
                  ? 'bg-purple-600 text-white'
                  : appState.mode === 'customize'
                  ? 'bg-orange-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {appState.mode === 'editor' && 'Editor'}
              {appState.mode === 'templates' && 'Plantillas'}
              {appState.mode === 'customize' && 'Personalizar'}
              {appState.mode === 'portfolio' && 'Portfolio'}
            </span>
          </div>
          <div className="text-xs mt-2 opacity-75 border-t border-gray-700 pt-2">
            <div>Ctrl+M: Cambiar | Ctrl+E: Editor</div>
            <div>Ctrl+T: Plantillas | Ctrl+P: Portfolio</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

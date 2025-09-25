// src/App.tsx - Con sistema de plantillas avanzado integrado
import React, { useState, useEffect } from 'react';

// Componentes principales
import ModernPortfolioEditor from './components/editor/ModernPortfolioEditor';
import PortfolioViewer from './components/PortfolioViewer';
import { AdvancedTemplateSelector } from './components/AdvancedTemplateSelector';
import { AdvancedTemplateCustomizer } from './components/AdvancedTemplateCustomizer';
import { useAdvancedTemplates } from './hooks/useAdvancedTemplates';

// Tipos para el modo de la aplicación
type AppMode = 'editor' | 'portfolio' | 'templates' | 'customize' | 'preview';

interface AppState {
  mode: AppMode;
  isLoading: boolean;
  error: string | null;
}

// Componente de loading spinner mejorado
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`} />
      <div className="mt-4 space-y-2">
        <div className="h-2 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-2 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

// Componente de toggle de modo mejorado (siempre visible)
const ModeToggle: React.FC<{
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  hasUnsavedChanges?: boolean;
}> = ({ currentMode, onModeChange, hasUnsavedChanges }) => (
  <div className="fixed top-4 right-4 bg-white shadow-xl rounded-xl p-3 z-50 border border-gray-200">
    <div className="flex gap-1">
      <button
        onClick={() => onModeChange('editor')}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          currentMode === 'editor' 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span>📝</span>
        Editor
      </button>
      
      <button
        onClick={() => onModeChange('templates')}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          currentMode === 'templates' 
            ? 'bg-purple-600 text-white shadow-md' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span>🎨</span>
        Plantillas
      </button>
      
      <button
        onClick={() => onModeChange('portfolio')}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          currentMode === 'portfolio' 
            ? 'bg-green-600 text-white shadow-md' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span>👁️</span>
        Portfolio
      </button>
    </div>
    
    {/* Indicador de cambios sin guardar */}
    {hasUnsavedChanges && (
      <div className="mt-2 text-center">
        <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
          Cambios sin guardar
        </span>
      </div>
    )}
  </div>
);

// Componente de vista previa rápida
const QuickPreview: React.FC<{
  onClose: () => void;
  previewContent: string;
}> = ({ onClose, previewContent }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Vista Previa</h3>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            ✕
          </button>
        </div>
      </div>
      
      {/* Contenido */}
      <div className="h-[70vh] overflow-auto">
        <iframe
          srcDoc={previewContent}
          className="w-full h-full border-none"
          title="Vista Previa del Portfolio"
        />
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Vista previa generada automáticamente
        </span>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  // Hook avanzado de plantillas
  const templates = useAdvancedTemplates();

  // Función para determinar el modo inicial
  function getInitialMode(): AppMode {
    // 1. Variable de entorno (para builds de producción)
    if (process.env.REACT_APP_MODE === 'portfolio') return 'portfolio';
    if (process.env.REACT_APP_MODE === 'editor') return 'editor';
    if (process.env.REACT_APP_MODE === 'templates') return 'templates';

    // 2. Parámetro URL (?mode=editor|portfolio|templates|customize|preview)
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode') as AppMode;
    if (['editor', 'portfolio', 'templates', 'customize', 'preview'].includes(urlMode)) {
      return urlMode;
    }

    // 3. LocalStorage
    try {
      const savedMode = localStorage.getItem('app-mode') as AppMode;
      if (['editor', 'portfolio', 'templates', 'customize', 'preview'].includes(savedMode)) {
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

  // Estado para vista previa rápida
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  // Cambiar modo
  const switchMode = (newMode: AppMode) => {
    // Si hay cambios sin guardar, preguntar al usuario
    if (templates.hasUnsavedChanges && newMode !== appState.mode) {
      const confirmed = window.confirm(
        '¿Estás seguro de cambiar de modo? Los cambios no guardados se perderán.'
      );
      if (!confirmed) return;
    }

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

  // Handler para vista previa rápida
  const handleQuickPreview = () => {
    const content = templates.previewTemplate();
    setPreviewContent(content);
    setShowPreview(true);
  };

  // Handler para guardar configuración
  const handleSaveTemplate = () => {
    // Aquí iría la lógica de guardado
    console.log('Guardando configuración de plantilla...');
    switchMode('templates');
  };

  // Shortcuts de teclado mejorados
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'm': {
            event.preventDefault();
            // Ciclar entre modos: editor -> templates -> customize -> portfolio -> editor
            const modes: AppMode[] = ['editor', 'templates', 'customize', 'portfolio'];
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
          case 'r':
            event.preventDefault();
            handleQuickPreview();
            break;
          case 's':
            event.preventDefault();
            if (appState.mode === 'customize' && templates.hasUnsavedChanges) {
              handleSaveTemplate();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [appState.mode, templates.hasUnsavedChanges]);

  // Efecto para manejar la carga inicial
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simular carga de configuración
        await new Promise((resolve) => setTimeout(resolve, 500));

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

  // Limpiar error
  const clearError = () => {
    setAppState((prev) => ({ ...prev, error: null }));
  };

  // Mostrar pantalla de carga mejorada
  if (appState.isLoading || !templates.isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              🚀
            </div>
          </div>
          
          <LoadingSpinner size="lg" />
          
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Portfolio Generator</h2>
            <p className="text-gray-600 text-lg">Cargando tu editor de portfolios profesionales...</p>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>✨ Sistema de plantillas avanzado</p>
            <p>🎨 Editor drag & drop</p>
            <p>📱 Diseños responsivos</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si existe
  if (appState.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center border border-red-200">
          <div className="text-red-500 text-7xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">¡Oops! Algo salió mal</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{appState.error}</p>
          <div className="space-y-4">
            <button
              onClick={clearError}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Intentar de nuevo
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
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
              <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Gestión de Plantillas</h1>
                    <p className="text-gray-600 mt-2">
                      Selecciona y personaliza la plantilla perfecta para tu portfolio
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {templates.selectedTemplate && (
                      <button
                        onClick={() => switchMode('customize')}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center gap-2 font-semibold"
                      >
                        🎨 Personalizar
                      </button>
                    )}
                    <button
                      onClick={handleQuickPreview}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 font-semibold"
                    >
                      👁️ Vista Previa
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 py-8">
              <AdvancedTemplateSelector
                templates={templates.templates}
                selectedTemplate={templates.selectedTemplate}
                onTemplateSelect={templates.selectTemplate}
                onCustomize={() => switchMode('customize')}
                onPreview={handleQuickPreview}
              />
            </div>
          </div>
        );

      case 'customize':
        return templates.selectedTemplate && templates.config ? (
          <AdvancedTemplateCustomizer
            template={templates.selectedTemplate}
            config={templates.config}
            onConfigChange={templates.updateConfig}
            onPreview={handleQuickPreview}
            onSave={handleSaveTemplate}
            onCancel={() => switchMode('templates')}
            onReset={templates.resetConfig}
          />
        ) : (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center bg-white rounded-2xl p-12 shadow-lg max-w-md">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">No hay plantilla seleccionada</h2>
              <p className="text-gray-600 mb-8">Selecciona una plantilla para personalizar</p>
              <button
                onClick={() => switchMode('templates')}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-semibold"
              >
                Seleccionar Plantilla
              </button>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold text-gray-800">Vista Previa</h1>
                  <button
                    onClick={() => switchMode('editor')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Volver al Editor
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <iframe
                  srcDoc={templates.previewTemplate()}
                  className="w-full h-[80vh] border-none"
                  title="Vista Previa del Portfolio"
                />
              </div>
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
      {/* Toggle de modo - Siempre visible */}
      <ModeToggle 
        currentMode={appState.mode} 
        onModeChange={switchMode}
        hasUnsavedChanges={templates.hasUnsavedChanges}
      />

      {/* Contenido principal */}
      {renderContent()}

      {/* Vista previa modal */}
      {showPreview && (
        <QuickPreview
          onClose={() => setShowPreview(false)}
          previewContent={previewContent}
        />
      )}

      {/* Indicador de estado avanzado (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm z-40 shadow-xl">
          <div className="font-semibold mb-2">Portfolio Generator v3.0</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span>Modo:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                appState.mode === 'editor' ? 'bg-green-600 text-white' :
                appState.mode === 'templates' ? 'bg-purple-600 text-white' :
                appState.mode === 'customize' ? 'bg-orange-600 text-white' :
                appState.mode === 'preview' ? 'bg-pink-600 text-white' :
                'bg-blue-600 text-white'
              }`}>
                {appState.mode}
              </span>
            </div>
            <div className="text-gray-400">
              Ctrl+M: Ciclar | Ctrl+R: Preview | Ctrl+S: Guardar
            </div>
            {templates.validationErrors.length > 0 && (
              <div className="text-red-400 text-xs">
                ⚠️ {templates.validationErrors.length} errores de validación
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
// src/App.tsx - Con sistema de plantillas avanzado integrado
import React, { useState, useEffect, useCallback } from "react";

// Componentes principales
import ModernPortfolioEditor from "./components/editor/ModernPortfolioEditor";
import PortfolioViewer from "./components/PortfolioViewer";
import AdvancedTemplateSelector from "./components/AdvancedTemplateSelector";
import { AdvancedTemplateCustomizer } from "./components/AdvancedTemplateCustomizer";
import { useAdvancedTemplates } from "./hooks/useAdvancedTemplates";
import TemplatePreviewModal from "./components/preview";
import { AdvancedTemplate } from './types/advanced-template-types';
import { AppMode } from "./types/portfolio-types";

interface AppState {
  mode: AppMode;
  isLoading: boolean;
  error: string | null;
}

// Componente de loading spinner mejorado
const LoadingSpinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}
      />
      <div className="mt-4 space-y-2">
        <div className="h-2 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-2 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

// Componente de header con navegación integrada
const AppHeader: React.FC<{
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  hasUnsavedChanges?: boolean;
  customizeActions?: {
    onSave?: () => void;
    onPreview?: () => void;
    onReset?: () => void;
  };
}> = ({ currentMode, onModeChange, hasUnsavedChanges, customizeActions }) => (
  <header className="bg-white shadow-sm border-b sticky top-0 z-40">
  <div className="max-w-7xl mx-auto px-4 py-3">
    <div className="flex items-center justify-between">

      {/* LOGO + TÍTULO */}
      <div className="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-10 h-10 object-contain"
        />
        <h1 className="text-xl font-bold text-gray-800">Portfolio Generator</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* BOTONES PRINCIPALES - SIEMPRE VISIBLES */}
        <button
          onClick={() => onModeChange("editor")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            currentMode === "editor"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>📝</span>
          <span className="hidden sm:inline">Editor</span>
        </button>

        <button
          onClick={() => onModeChange("templates")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            currentMode === "templates"
              ? "bg-purple-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>🎨</span>
          <span className="hidden sm:inline">Plantillas</span>
        </button>

        <button
          onClick={() => onModeChange("portfolio")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            currentMode === "portfolio"
              ? "bg-green-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>👁️</span>
          <span className="hidden sm:inline">Portfolio</span>
        </button>

        {/* SEPARADOR cuando hay botones de customize */}
        {currentMode === "customize" && customizeActions && (
          <div className="w-px h-8 bg-gray-300 mx-2"></div>
        )}

        {/* BOTONES DE CUSTOMIZE - SOLO CUANDO ESTÁS EN ESE MODO */}
        {currentMode === "customize" && customizeActions && (
          <>
            {customizeActions.onReset && (
              <button
                onClick={customizeActions.onReset}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
              >
                Resetear
              </button>
            )}
            {customizeActions.onPreview && (
              <button
                onClick={customizeActions.onPreview}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm flex items-center gap-2"
              >
                👁️ Vista Previa
              </button>
            )}
            {customizeActions.onSave && (
              <button
                onClick={customizeActions.onSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                ✓ Guardar
              </button>
            )}
          </>
        )}

        {hasUnsavedChanges && (
          <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full ml-2">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            <span className="hidden md:inline">Sin guardar</span>
          </span>
        )}
      </div>
    </div>
  </div>
</header>

);


const App: React.FC = () => {
  // Hook avanzado de plantillas
  const templates = useAdvancedTemplates();

  // Función para determinar el modo inicial
  function getInitialMode(): AppMode {
    // 1. Variable de entorno (para builds de producción)
    if (process.env.REACT_APP_MODE === "portfolio") return "portfolio";
    if (process.env.REACT_APP_MODE === "editor") return "editor";
    if (process.env.REACT_APP_MODE === "templates") return "templates";

    // 2. Parámetro URL (?mode=editor|portfolio|templates|customize|preview)
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get("mode") as AppMode;
    if (
      ["editor", "portfolio", "templates", "customize", "preview"].includes(
        urlMode
      )
    ) {
      return urlMode;
    }

    // 3. LocalStorage
    try {
      const savedMode = localStorage.getItem("app-mode") as AppMode;
      if (
        ["editor", "portfolio", "templates", "customize", "preview"].includes(
          savedMode
        )
      ) {
        return savedMode;
      }
    } catch (error) {
      console.warn("Error reading mode from localStorage:", error);
    }

    // 4. Default basado en environment
    return process.env.NODE_ENV === "development" ? "editor" : "portfolio";
  }

  // Estado de la aplicación
  const [appState, setAppState] = useState<AppState>({
    mode: getInitialMode(),
    isLoading: true,
    error: null,
  });

  // Estado para vista previa rápida
  const [showPreview, setShowPreview] = useState(false);
  // const [previewContent, setPreviewContent] = useState("");
  const [previewTemplate, setPreviewTemplate] =
    useState<AdvancedTemplate | null>(null);

  // Cambiar modo - envuelto en useCallback
  const switchMode = useCallback(
    (newMode: AppMode) => {
      if (templates.hasUnsavedChanges && newMode !== appState.mode) {
        const confirmed = window.confirm(
          "¿Estás seguro de cambiar de modo? Los cambios no guardados se perderán."
        );
        if (!confirmed) return;
      }

      setAppState((prev) => ({ ...prev, mode: newMode }));

      try {
        localStorage.setItem("app-mode", newMode);
      } catch (error) {
        console.warn("Error saving mode to localStorage:", error);
      }

      const url = new URL(window.location.href);
      url.searchParams.set("mode", newMode);
      window.history.replaceState({}, "", url.toString());
    },
    [templates.hasUnsavedChanges, appState.mode]
  );

  // Handler para vista previa rápida - envuelto en useCallback
  const handleQuickPreview = useCallback(
    (template?: AdvancedTemplate) => {
      const templateToPreview = template || templates.selectedTemplate;
      if (templateToPreview) {
        setPreviewTemplate(templateToPreview);
        setShowPreview(true);
      }
    },
    [templates.selectedTemplate]
  );

  // Handler para guardar configuración - envuelto en useCallback
  const handleSaveTemplate = useCallback(() => {
    console.log("Guardando configuración de plantilla...");

    try {
      const configToSave = {
        templateId: templates.selectedTemplate?.id,
        config: templates.config,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        "saved-portfolio-config",
        JSON.stringify(configToSave)
      );
      alert("✅ Configuración guardada correctamente");
    } catch (error) {
      console.error("Error guardando configuración:", error);
      alert("❌ Error al guardar la configuración");
    }
  }, [templates.selectedTemplate?.id, templates.config]);

  // Shortcuts de teclado mejorados
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case "m": {
            event.preventDefault();
            const modes: AppMode[] = [
              "editor",
              "templates",
              "customize",
              "portfolio",
            ];
            const currentIndex = modes.indexOf(appState.mode);
            const nextMode = modes[(currentIndex + 1) % modes.length];
            switchMode(nextMode);
            break;
          }
          case "e":
            event.preventDefault();
            switchMode("editor");
            break;
          case "t":
            event.preventDefault();
            switchMode("templates");
            break;
          case "p":
            event.preventDefault();
            switchMode("portfolio");
            break;
          case "r":
            event.preventDefault();
            handleQuickPreview();
            break;
          case "s":
            event.preventDefault();
            if (appState.mode === "customize" && templates.hasUnsavedChanges) {
              handleSaveTemplate();
            }
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    appState.mode,
    templates.hasUnsavedChanges,
    switchMode,
    handleQuickPreview,
    handleSaveTemplate,
  ]);

  // Efecto para manejar la carga inicial
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setAppState((prev) => ({ ...prev, isLoading: false }));
      } catch (error) {
        setAppState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Error desconocido",
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Portfolio Generator
            </h2>
            <p className="text-gray-600 text-lg">
              Cargando tu editor de portfolios profesionales...
            </p>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            ¡Oops! Algo salió mal
          </h2>
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
      case "editor":
        return <ModernPortfolioEditor />;

      case "templates":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <AdvancedTemplateSelector
                templates={templates.templates}
                selectedTemplate={templates.selectedTemplate ?? undefined}
                onTemplateSelect={templates.selectTemplate}
                onCustomize={() => switchMode("customize")}
                onPreview={handleQuickPreview}
              />
            </div>
          </div>
        );

      case "customize":
        return templates.selectedTemplate && templates.config ? (
          <AdvancedTemplateCustomizer
            template={templates.selectedTemplate}
            config={templates.config}
            onConfigChange={templates.updateConfig}
            onPreview={handleQuickPreview}
            onSave={handleSaveTemplate}
            onCancel={() => switchMode("templates")}
            onReset={templates.resetConfig}
          />
        ) : (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center bg-white rounded-2xl p-12 shadow-lg max-w-md">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No hay plantilla seleccionada
              </h2>
              <p className="text-gray-600 mb-8">
                Selecciona una plantilla para personalizar
              </p>
              <button
                onClick={() => switchMode("templates")}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-semibold"
              >
                Seleccionar Plantilla
              </button>
            </div>
          </div>
        );

      case "preview":
        return (
          <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold text-gray-800">
                    Vista Previa
                  </h1>
                  <button
                    onClick={() => switchMode("editor")}
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

      case "portfolio":
        return <PortfolioViewer />;

      default:
        return <ModernPortfolioEditor />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación integrada */}
      <AppHeader
        currentMode={appState.mode}
        onModeChange={switchMode}
        hasUnsavedChanges={templates.hasUnsavedChanges}
        customizeActions={
          appState.mode === "customize"
            ? {
                onSave: handleSaveTemplate,
                onPreview: handleQuickPreview,
                onReset: templates.resetConfig,
              }
            : undefined
        }
      />

      {/* Contenido principal */}
      {renderContent()}

      {/* Vista previa modal */}
      {showPreview && previewTemplate && (
        <TemplatePreviewModal
          isOpen={showPreview}
          onClose={() => {
            setShowPreview(false);
            setPreviewTemplate(null);
          }}
          template={previewTemplate}
        />
      )}
    </div>
  );
};

export default App;

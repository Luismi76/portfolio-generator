// PortfolioGenerator.tsx
import React, { useRef, useState, useCallback } from 'react';
import { Icons } from './portfolio-icons';
import { 
  usePortfolioData, 
  useDataExport, 
  useBeforeUnload,
  useClickOutside
} from './portfolio-hooks';
import { useTemplates } from './use-templates';
import { 
  SinglePageHTMLExporter,
  MultiPageWebsiteExporter 
} from './portfolio-export';
import PersonalInfoForm from './PersonalInfoForm';
import ProjectTableForm from './ProjectTableForm';
import SkillTableForm from './SkillTableForm';
import { TemplateSelector } from './TemplateSelector';

// Tipo para los modos de la aplicación
type AppMode = 'editor' | 'templates' | 'preview' | 'portfolio';

interface PortfolioGeneratorProps {
  initialMode?: AppMode;
  storageKey?: string;
  autoSave?: boolean;
}

// Menú de datos desplegable
const DataMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onExportJSON: () => void;
  onExportWebsite: () => void;
  onImportJSON: () => void;
  onClearData: () => void;
}> = ({ isOpen, onClose, onExportJSON, onExportWebsite, onImportJSON, onClearData }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-50"
    >
      <div className="py-1">
        <button
          onClick={() => { onExportJSON(); onClose(); }}
          className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
        >
          <Icons.FileDown size={16} />
          Exportar JSON
        </button>
        <button
          onClick={() => { onExportWebsite(); onClose(); }}
          className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
        >
          <Icons.Download size={16} />
          Exportar Sitio Web
        </button>
        <button
          onClick={() => { onImportJSON(); onClose(); }}
          className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
        >
          <Icons.Upload size={16} />
          Importar JSON
        </button>
        <hr className="my-1" />
        <button
          onClick={() => { onClearData(); onClose(); }}
          className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
        >
          <Icons.Trash2 size={16} />
          Limpiar Todo
        </button>
      </div>
    </div>
  );
};

// Barra de navegación
const AppHeader: React.FC<{
  saveStatus: string;
  onExportHTML: () => void;
  onExportWebsite: () => void;
  showDataMenu: boolean;
  onToggleDataMenu: () => void;
  onSwitchMode: (mode: AppMode) => void;
  currentMode: AppMode;
  dataMenuActions: {
    onExportJSON: () => void;
    onExportWebsite: () => void;
    onImportJSON: () => void;
    onClearData: () => void;
  };
  selectedTemplateName?: string;
}> = ({
  saveStatus,
  onExportHTML,
  onExportWebsite,
  showDataMenu,
  onToggleDataMenu,
  onSwitchMode,
  currentMode,
  dataMenuActions,
  selectedTemplateName
}) => (
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Generador de Portfolio
          </h1>
          <p className="text-gray-600">
            Crea tu portfolio profesional
            {selectedTemplateName && (
              <span className="text-blue-600 font-medium"> • Plantilla: {selectedTemplateName}</span>
            )}
          </p>
          {saveStatus && (
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <Icons.Check size={14} />
              {saveStatus}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-3">
            <button
              onClick={onExportHTML}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Icons.Download size={16} />
              HTML
            </button>
            <button
              onClick={onExportWebsite}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Icons.Download size={16} />
              Sitio Web
            </button>
          </div>

          <div className="relative">
            <button
              onClick={onToggleDataMenu}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Icons.Settings size={16} />
              Datos
              <Icons.ChevronDown
                size={16}
                className={`transition-transform ${showDataMenu ? "rotate-180" : ""}`}
              />
            </button>
            <DataMenu
              isOpen={showDataMenu}
              onClose={onToggleDataMenu}
              {...dataMenuActions}
            />
          </div>

          <div className="w-px h-8 bg-gray-300"></div>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onSwitchMode("editor")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                currentMode === 'editor'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icons.Settings size={14} />
              Editor
            </button>
            <button
              onClick={() => onSwitchMode("templates")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                currentMode === 'templates'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icons.Code size={14} />
              Plantillas
            </button>
            <button
              onClick={() => onSwitchMode("preview")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                currentMode === 'preview'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icons.Eye size={14} />
              Vista Previa
            </button>
            <button
              onClick={() => onSwitchMode("portfolio")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                currentMode === 'portfolio'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icons.Eye size={14} />
              Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Componente principal
export const PortfolioGenerator: React.FC<PortfolioGeneratorProps> = ({
  initialMode = 'editor',
  storageKey = 'portfolioData',
  autoSave = true
}) => {
  // Hooks
  const portfolioHook = usePortfolioData({ autoSave, storageKey });
  const { exportToJSON, importFromJSON } = useDataExport();
  const templates = useTemplates();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado local
  const [showDataMenu, setShowDataMenu] = useState(false);
  const [currentMode, setCurrentMode] = useState<AppMode>(initialMode);

  // Auto-guardar
  useBeforeUnload(portfolioHook.data);

  // Funciones
  const toggleDataMenu = useCallback(() => {
    setShowDataMenu(prev => !prev);
  }, []);

  const switchMode = useCallback((mode: AppMode) => {
    setCurrentMode(mode);
    
    // Si el modo es portfolio, navegar correctamente
    if (mode === 'portfolio') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', 'portfolio');
      window.location.href = url.toString();
      return;
    }
    
    // Para modo editor, también navegar
    if (mode === 'editor') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', 'editor');
      window.location.href = url.toString();
      return;
    }
  }, []);
  

  // Exportadores
  const handleExportHTML = useCallback(() => {
    const singleExporter = new SinglePageHTMLExporter(portfolioHook.data);
    singleExporter.export();
  }, [portfolioHook.data]);

  const handleExportWebsite = useCallback(() => {
    const multiExporter = new MultiPageWebsiteExporter(portfolioHook.data);
    multiExporter.export();
  }, [portfolioHook.data]);

  const handleExportJSON = useCallback(() => {
    exportToJSON(portfolioHook.data);
  }, [portfolioHook.data, exportToJSON]);

  const handleImportJSON = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await importFromJSON(file);
    if (result.success && result.data) {
      portfolioHook.importData(result.data);
    }
    
    event.target.value = '';
  }, [importFromJSON, portfolioHook]);

  const handleClearData = useCallback(() => {
    if (window.confirm("¿Estás seguro de que quieres borrar todos los datos?")) {
      portfolioHook.clearAllData();
    }
  }, [portfolioHook]);

  // Handlers para plantillas
  const handleCustomizeTemplate = useCallback(() => {
    console.log('Customize template:', templates.selectedTemplate?.name);
  }, [templates.selectedTemplate]);

  const handleAddTemplate = useCallback(() => {
    console.log('Add custom template');
  }, []);

  // Renderizado de contenido
  const renderContent = () => {
    switch (currentMode) {
      case 'templates':
        return (
          <TemplateSelector
            templates={templates.templates}
            selectedTemplate={templates.selectedTemplate}
            onSelectTemplate={templates.selectTemplate}
            onCustomize={handleCustomizeTemplate}
            onAddTemplate={handleAddTemplate}
          />
        );
      
      case 'preview':
        if (!templates.selectedTemplate) {
          return (
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-center">
                <Icons.Eye size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecciona una plantilla
                </h3>
                <p className="text-gray-600 mb-4">
                  Ve a la pestaña "Plantillas" para elegir el diseño de tu portfolio
                </p>
                <button
                  onClick={() => switchMode('templates')}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Icons.Code size={16} />
                  Ir a Plantillas
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div 
              className="p-8 text-white"
              style={{
                background: `linear-gradient(135deg, ${templates.selectedTemplate.colors.primary}, ${templates.selectedTemplate.colors.secondary})`
              }}
            >
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">
                  {portfolioHook.data.personalInfo.name || 'Tu Nombre'}
                </h1>
                <p className="text-xl opacity-90">
                  {portfolioHook.data.personalInfo.title || 'Tu Título Profesional'}
                </p>
              </div>
            </div>

            <div className="p-8">
              <div className="max-w-4xl mx-auto space-y-8">
                {portfolioHook.data.personalInfo.summary && (
                  <section>
                    <h2 
                      className="text-2xl font-bold mb-4"
                      style={{ color: templates.selectedTemplate.colors.primary }}
                    >
                      Sobre mí
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {portfolioHook.data.personalInfo.summary}
                    </p>
                  </section>
                )}

                {portfolioHook.data.projects.length > 0 && (
                  <section>
                    <h2 
                      className="text-2xl font-bold mb-6"
                      style={{ color: templates.selectedTemplate.colors.primary }}
                    >
                      Proyectos ({portfolioHook.data.projects.length})
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {portfolioHook.data.projects.slice(0, 4).map((project, index) => (
                        <div 
                          key={index}
                          className="rounded-lg p-6 shadow-sm border"
                          style={{ 
                            backgroundColor: templates.selectedTemplate?.colors.surface,
                            borderColor: templates.selectedTemplate?.colors.primary + '20'
                          }}
                        >
                          <h3 
                            className="text-lg font-semibold mb-2"
                            style={{ color: templates.selectedTemplate?.colors.primary }}
                          >
                            {project.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            {project.description}
                          </p>
                          {project.technologies && (
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.split(',').slice(0, 3).map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-2 py-1 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: templates.selectedTemplate?.colors.accent + '20',
                                    color: templates.selectedTemplate?.colors.accent
                                  }}
                                >
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            <div 
              className="px-8 py-4 text-center border-t"
              style={{ 
                borderColor: templates.selectedTemplate.colors.primary + '20',
                backgroundColor: templates.selectedTemplate.colors.surface + '50'
              }}
            >
              <p className="text-sm text-gray-600">
                Vista previa con plantilla "{templates.selectedTemplate.name}" • 
                <button
                  onClick={() => switchMode('portfolio')}
                  className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
                >
                  Ver portfolio completo
                </button>
              </p>
            </div>
          </div>
        );
      
      case 'editor':
      default:
        return (
          <>
            <PersonalInfoForm
              data={portfolioHook.data.personalInfo}
              onUpdate={portfolioHook.updatePersonalInfo}
            />

            <ProjectTableForm
              projects={portfolioHook.data.projects}
              onUpdate={portfolioHook.updateProject}
              onAdd={() => portfolioHook.addItem('projects')}
              onRemove={(index) => portfolioHook.removeItem('projects', index)}
            />

            <SkillTableForm
              skills={portfolioHook.data.skills}
              onUpdate={portfolioHook.updateSkill}
              onAdd={() => portfolioHook.addItem('skills')}
              onRemove={(index) => portfolioHook.removeItem('skills', index)}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        saveStatus={portfolioHook.saveStatus}
        onExportHTML={handleExportHTML}
        onExportWebsite={handleExportWebsite}
        showDataMenu={showDataMenu}
        onToggleDataMenu={toggleDataMenu}
        onSwitchMode={switchMode}
        currentMode={currentMode}
        selectedTemplateName={templates.selectedTemplate?.name}
        dataMenuActions={{
          onExportJSON: handleExportJSON,
          onExportWebsite: handleExportWebsite,
          onImportJSON: handleImportJSON,
          onClearData: handleClearData,
        }}
      />

      <div className="max-w-7xl mx-auto p-4">
        <div className="space-y-6">
          {renderContent()}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />
    </div>
  );
};

export default PortfolioGenerator;
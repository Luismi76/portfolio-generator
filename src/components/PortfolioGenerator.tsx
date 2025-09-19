// PortfolioGenerator.tsx - VERSIÓN COMPLETAMENTE CORREGIDA
import React, { useRef, useState, useCallback } from 'react';
import { Icons } from './portfolio-icons';
import { 
  usePortfolioData, 
  useBeforeUnload,
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
type AppMode = 'editor' | 'templates' | 'customize' | 'preview' | 'portfolio';

interface PortfolioGeneratorProps {
  initialMode?: AppMode;
  storageKey?: string;
  autoSave?: boolean;
}

// ✅ Hook para exportación de datos - DEFINIDO LOCALMENTE
const useDataExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToJSON = useCallback((data: any) => {
    try {
      setIsExporting(true);
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting JSON:', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const importFromJSON = useCallback(async (file: File): Promise<{ 
    success: boolean; 
    data?: any; 
    message: string 
  }> => {
    return new Promise((resolve) => {
      setIsExporting(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          resolve({ 
            success: true, 
            data: importedData, 
            message: 'Datos importados exitosamente' 
          });
        } catch (error) {
          resolve({ 
            success: false, 
            message: `Error al importar: ${error instanceof Error ? error.message : 'Archivo JSON inválido'}` 
          });
        } finally {
          setIsExporting(false);
        }
      };
      reader.onerror = () => {
        resolve({ 
          success: false, 
          message: 'Error al leer el archivo' 
        });
        setIsExporting(false);
      };
      reader.readAsText(file);
    });
  }, []);

  return { exportToJSON, importFromJSON, isExporting };
};

// Componente TechList mejorado
const TechList: React.FC<{ technologies: string; variant?: 'default' | 'outlined' }> = 
({ technologies, variant = 'default' }) => {
  if (!technologies) return null;
  
  const techs = technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
  
  const getTechIcon = (tech: string): string => {
    const techLower = tech.toLowerCase();
    if (techLower.includes('react')) return '⚛️';
    if (techLower.includes('vue')) return '💚';
    if (techLower.includes('angular')) return '🅰️';
    if (techLower.includes('javascript') || techLower.includes('js')) return '💛';
    if (techLower.includes('typescript') || techLower.includes('ts')) return '💙';
    if (techLower.includes('python')) return '🐍';
    if (techLower.includes('node')) return '💚';
    if (techLower.includes('css')) return '🎨';
    if (techLower.includes('html')) return '🌐';
    if (techLower.includes('docker')) return '🐳';
    if (techLower.includes('git')) return '📦';
    return '⚡';
  };
  
  return (
    <>
      {techs.map((tech, index) => (
        <span
          key={index}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all hover:scale-105 ${
            variant === 'outlined'
              ? 'bg-white border border-gray-300 text-gray-700 hover:border-blue-300'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          <span>{getTechIcon(tech)}</span>
          {tech}
        </span>
      ))}
    </>
  );
};

// ✅ Componente TemplateRenderer SIMPLIFICADO
const TemplateRenderer: React.FC<{
  template: any;
  config: any;
  portfolioData: any;
  children?: React.ReactNode;
}> = ({ template, config, portfolioData, children }) => {
  // Merge template colors con customizations
  const colors = {
    ...template.colors,
    ...config.customizations?.colors
  };
  
  const typography = {
    ...template.typography,
    ...config.customizations?.typography
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: colors?.background || '#ffffff',
        fontFamily: typography?.fontFamily?.primary || "'Inter', sans-serif"
      }}
    >
      {/* Header */}
      <header 
        className="py-16 text-white text-center"
        style={{
          background: colors?.gradient 
            ? `linear-gradient(${colors.gradient.direction || '135deg'}, ${colors.gradient.from}, ${colors.gradient.to})`
            : `linear-gradient(135deg, ${colors?.primary || '#3B82F6'}, ${colors?.secondary || '#1E40AF'})`
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            {portfolioData.personalInfo.fullName || 'Tu Nombre'}
          </h1>
          {portfolioData.personalInfo.tagline && (
            <p className="text-xl opacity-90 mb-6">
              {portfolioData.personalInfo.tagline}
            </p>
          )}
          <div className="flex justify-center gap-4 flex-wrap">
            {portfolioData.personalInfo.email && (
              <a 
                href={`mailto:${portfolioData.personalInfo.email}`}
                className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all"
              >
                📧 Email
              </a>
            )}
            {portfolioData.personalInfo.linkedin && (
              <a 
                href={portfolioData.personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all"
              >
                💼 LinkedIn
              </a>
            )}
            {portfolioData.personalInfo.github && (
              <a 
                href={portfolioData.personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all"
              >
                🐙 GitHub
              </a>
            )}
          </div>
        </div>
      </header>

      {/* About */}
      {portfolioData.personalInfo.summary && (
        <section className="py-12" style={{ backgroundColor: colors?.background || '#ffffff' }}>
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: colors?.text?.primary || '#1F2937' }}>
              Sobre mí
            </h2>
            <div className="text-lg leading-relaxed" style={{ color: colors?.text?.secondary || '#6B7280' }}>
              <p>{portfolioData.personalInfo.summary}</p>
            </div>
          </div>
        </section>
      )}

      {/* Skills */}
      {portfolioData.skills?.length > 0 && (
        <section className="py-12" style={{ backgroundColor: colors?.surface || '#F8FAFC' }}>
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: colors?.text?.primary || '#1F2937' }}>
              Habilidades
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {portfolioData.skills.map((skill: any, index: number) => (
                <div key={index} className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors?.background || '#ffffff' }}>
                  <h3 className="font-semibold mb-3" style={{ color: colors?.text?.primary || '#1F2937' }}>
                    {skill.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <TechList technologies={skill.technologies} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {portfolioData.projects?.length > 0 && (
        <section className="py-12" style={{ backgroundColor: colors?.background || '#ffffff' }}>
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: colors?.text?.primary || '#1F2937' }}>
              Proyectos
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {portfolioData.projects.map((project: any, index: number) => (
                <div key={index} className="rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: colors?.surface || '#F8FAFC' }}>
                  {project.image && (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: colors?.text?.primary || '#1F2937' }}>
                      {project.title}
                    </h3>
                    <p className="mb-4" style={{ color: colors?.text?.secondary || '#6B7280' }}>
                      {project.description}
                    </p>
                    {project.technologies && (
                      <div className="mb-4">
                        <TechList technologies={project.technologies} />
                      </div>
                    )}
                    <div className="flex gap-3 flex-wrap">
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded transition-all text-white"
                          style={{ backgroundColor: colors?.primary || '#3B82F6' }}
                        >
                          Ver Proyecto
                        </a>
                      )}
                      {project.repoUrl && (
                        <a 
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded border transition-all"
                          style={{ 
                            borderColor: colors?.primary || '#3B82F6', 
                            color: colors?.primary || '#3B82F6'
                          }}
                        >
                          Código
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {children}
    </div>
  );
};

// Componente Header
interface AppHeaderProps {
  saveStatus: string;
  onExportHTML: () => void;
  onExportWebsite: () => void;
  showDataMenu: boolean;
  onToggleDataMenu: () => void;
  onSwitchMode: (mode: AppMode) => void;
  currentMode: AppMode;
  selectedTemplateName?: string;
  dataMenuActions: {
    onExportJSON: () => void;
    onExportWebsite: () => void;
    onImportJSON: () => void;
    onClearData: () => void;
  };
}

const DataMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onExportJSON: () => void;
  onExportWebsite: () => void;
  onImportJSON: () => void;
  onClearData: () => void;
}> = ({ isOpen, onClose, onExportJSON, onExportWebsite, onImportJSON, onClearData }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
      <div className="p-2">
        <button
          onClick={onExportJSON}
          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
        >
          <Icons.FileDown size={16} />
          Exportar datos (JSON)
        </button>
        <button
          onClick={onExportWebsite}
          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
        >
          <Icons.Download size={16} />
          Exportar sitio web
        </button>
        <button
          onClick={onImportJSON}
          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
        >
          <Icons.Upload size={16} />
          Importar datos
        </button>
        <hr className="my-2" />
        <button
          onClick={onClearData}
          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
        >
          <Icons.Trash2 size={16} />
          Limpiar todos los datos
        </button>
      </div>
    </div>
  );
};

const AppHeader: React.FC<AppHeaderProps> = ({
  saveStatus,
  onExportHTML,
  onExportWebsite,
  showDataMenu,
  onToggleDataMenu,
  onSwitchMode,
  currentMode,
  selectedTemplateName,
  dataMenuActions,
}) => (
  <div className="bg-white shadow-sm border-b sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Icons.Code size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Portfolio Generator</h1>
            {selectedTemplateName && (
              <p className="text-xs text-gray-500">Plantilla: {selectedTemplateName}</p>
            )}
          </div>
        </div>

        {/* Centro - Estado de guardado */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            {saveStatus || 'Listo'}
          </div>
        </div>

        {/* Derecha - Acciones */}
        <div className="flex items-center gap-4">
          {/* Botones de exportación */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={onExportHTML}
              className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition-colors"
            >
              <Icons.FileDown size={14} />
              HTML
            </button>
            <button
              onClick={onExportWebsite}
              className="flex items-center gap-2 bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-purple-700 transition-colors"
            >
              <Icons.Download size={14} />
              Sitio Web
            </button>
          </div>

          {/* Menu de datos */}
          <div className="relative">
            <button
              onClick={onToggleDataMenu}
              className={`p-2 rounded-lg transition-colors ${
                showDataMenu ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
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

          {/* Navegación por modos */}
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
            {selectedTemplateName && (
              <>
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
                  <Icons.ExternalLink size={14} />
                  Portfolio
                </button>
              </>
            )}
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

  // Funciones auxiliares
  const toggleDataMenu = useCallback(() => {
    setShowDataMenu(prev => !prev);
  }, []);

  const switchMode = useCallback((mode: AppMode) => {
    setCurrentMode(mode);
    setShowDataMenu(false); // Cerrar menú al cambiar modo
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
    setShowDataMenu(false);
  }, [portfolioHook.data, exportToJSON]);

  const handleImportJSON = useCallback(() => {
    fileInputRef.current?.click();
    setShowDataMenu(false);
  }, []);

  const handleFileImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await importFromJSON(file);
    if (result.success && result.data) {
      portfolioHook.importData(result.data);
    } else {
      alert(result.message);
    }
    
    event.target.value = '';
  }, [importFromJSON, portfolioHook]);

  const handleClearData = useCallback(() => {
    if (window.confirm("¿Estás seguro de que quieres borrar todos los datos?")) {
      portfolioHook.clearAllData();
      setShowDataMenu(false);
    }
  }, [portfolioHook]);

  // Renderizado de contenido
  const renderContent = () => {
    switch (currentMode) {
      case 'templates':
        return (
          <TemplateSelector
            templates={templates.templates}
            selectedTemplate={templates.selectedTemplate}
            onSelectTemplate={templates.selectTemplate}
            onCustomize={() => console.log('Customize')}
            onAddTemplate={() => console.log('Add template')}
          />
        );
      
      case 'preview':
        if (!templates.selectedTemplate || !templates.config) {
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
            {/* Header informativo */}
            <div className="bg-blue-50 border-b border-blue-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-900">
                    Vista Previa - Plantilla: {templates.selectedTemplate.name}
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Esta es una vista previa de cómo se verá tu portfolio
                  </p>
                </div>
                <button
                  onClick={() => switchMode('portfolio')}
                  className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700"
                >
                  <Icons.ExternalLink size={14} />
                  Ver Completo
                </button>
              </div>
            </div>

            {/* Vista previa */}
            <div className="preview-container overflow-hidden bg-gray-100">
              <div style={{ 
                transform: 'scale(0.75)', 
                transformOrigin: 'top left', 
                width: '133.33%', 
                height: '400px',
                overflow: 'hidden'
              }}>
                <TemplateRenderer
                  template={templates.selectedTemplate}
                  config={templates.config}
                  portfolioData={portfolioHook.data}
                />
              </div>
            </div>
          </div>
        );

      case 'portfolio':
        if (!templates.selectedTemplate || !templates.config) {
          return (
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-center">
                <Icons.ExternalLink size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Portfolio no disponible
                </h3>
                <p className="text-gray-600 mb-4">
                  Selecciona una plantilla primero para ver tu portfolio completo
                </p>
                <button
                  onClick={() => switchMode('templates')}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Icons.Code size={16} />
                  Seleccionar Plantilla
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="bg-gray-50 -mx-4 -my-6 min-h-screen">
            <TemplateRenderer
              template={templates.selectedTemplate}
              config={templates.config}
              portfolioData={portfolioHook.data}
            />
            {/* Footer adicional */}
            <footer className="py-8 border-t border-gray-200" style={{ backgroundColor: templates.selectedTemplate.colors.surface }}>
              <div className="text-center text-gray-600 max-w-4xl mx-auto px-4">
                <p>
                  © {new Date().getFullYear()} {portfolioHook.data.personalInfo.fullName || 'Tu Nombre'}. 
                  Todos los derechos reservados.
                </p>
                <p className="text-sm mt-2">
                  Portfolio con plantilla "{templates.selectedTemplate?.name}" • 
                  <button
                    onClick={() => switchMode('templates')}
                    className="text-blue-600 hover:text-blue-700 ml-1 underline"
                  >
                    Cambiar plantilla
                  </button>
                </p>
              </div>
            </footer>
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
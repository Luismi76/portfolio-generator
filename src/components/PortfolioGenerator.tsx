// PortfolioGenerator.tsx - Integración actualizada con TemplateCustomizer
import React, { useRef, useState, useCallback } from 'react';
import { Icons } from './portfolio-icons';
import { 
  usePortfolioData, 
  useDataExport, 
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
import TemplateCustomizer from './TemplateCustomizer';

// Tipo para los modos de la aplicación
type AppMode = 'editor' | 'templates' | 'customize' | 'preview' | 'portfolio';

interface PortfolioGeneratorProps {
  initialMode?: AppMode;
  storageKey?: string;
  autoSave?: boolean;
}

// Resto de los componentes auxiliares (TechList, etc.) permanecen igual...
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

// Componente Header actualizado para incluir el modo customize
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
            {saveStatus}
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

          {/* Navegación por modos - ACTUALIZADA */}
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
            {/* NUEVO: Botón de personalización - solo visible si hay template seleccionada */}
            {selectedTemplateName && (
              <button
                onClick={() => onSwitchMode("customize")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  currentMode === 'customize'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icons.Settings size={14} />
                Personalizar
              </button>
            )}
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

// Componente principal ACTUALIZADO
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

  // Estado local - ACTUALIZADO para incluir 'customize'
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

  // Handlers para plantillas - ACTUALIZADOS
  const handleCustomizeTemplate = useCallback(() => {
    if (templates.selectedTemplate) {
      switchMode('customize');
    }
  }, [templates.selectedTemplate, switchMode]);

  const handleAddTemplate = useCallback(() => {
    console.log('Add custom template');
    // TODO: Implementar creación de plantilla custom
  }, []);

  // Handlers del customizador
  const handleCustomizerSave = useCallback(() => {
    console.log('Template customization saved');
    // Volver al modo templates después de guardar
    switchMode('templates');
  }, [switchMode]);

  const handleCustomizerCancel = useCallback(() => {
    // Resetear cambios si es necesario
    templates.resetConfig();
    // Volver al modo templates
    switchMode('templates');
  }, [templates, switchMode]);

  // Renderizado de contenido - ACTUALIZADO
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
      
      case 'customize':
        // NUEVO: Modo de personalización
        if (!templates.selectedTemplate || !templates.config) {
          return (
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-center">
                <Icons.AlertCircle size={48} className="mx-auto text-yellow-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay plantilla para personalizar
                </h3>
                <p className="text-gray-600 mb-4">
                  Selecciona una plantilla primero en la pestaña "Plantillas"
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
          <TemplateCustomizer
            template={templates.selectedTemplate}
            config={templates.config}
            onConfigChange={templates.updateConfig}
            onSave={handleCustomizerSave}
            onCancel={handleCustomizerCancel}
          />
        );
      
      case 'preview':
        // Vista previa rápida y compacta
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

        // Vista previa básica
        return (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div 
              className="p-8 text-white"
              style={{
                background: `linear-gradient(135deg, ${templates.selectedTemplate?.colors.primary || '#3B82F6'}, ${templates.selectedTemplate?.colors.secondary || '#1E40AF'})`
              }}
            >
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {portfolioHook.data.personalInfo.name || 'Tu Nombre'}
                </h1>
                <p className="text-xl md:text-2xl mb-6 opacity-90">
                  {portfolioHook.data.personalInfo.title || 'Tu Título Profesional'}
                </p>
                <p className="text-lg opacity-80 max-w-2xl mx-auto">
                  {portfolioHook.data.personalInfo.summary || 'Tu resumen profesional aparecerá aquí...'}
                </p>
              </div>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-gray-600 mb-4">
                  Vista previa usando la plantilla <strong>{templates.selectedTemplate.name}</strong>
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => switchMode('customize')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Icons.Settings size={16} />
                    Personalizar Plantilla
                  </button>
                  <button
                    onClick={() => switchMode('portfolio')}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    <Icons.Eye size={16} />
                    Ver Portfolio Completo
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'portfolio':
        // Portfolio completo con funcionalidad completa - reutilizando la lógica existente
        if (!templates.selectedTemplate) {
          return (
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-center">
                <Icons.Eye size={48} className="mx-auto text-gray-300 mb-4" />
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

        // Aquí iría el renderizado completo del portfolio con la plantilla aplicada
        // (manteniendo la lógica existente del PortfolioGenerator original)
        return (
          <div className="min-h-screen bg-gray-50 -mx-4 -my-6">
            <header 
              className="text-white"
              style={{
                background: `linear-gradient(135deg, ${templates.selectedTemplate?.colors.primary || '#3B82F6'}, ${templates.selectedTemplate?.colors.secondary || '#1E40AF'})`
              }}
            >
              <div className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    {portfolioHook.data.personalInfo.name || 'Tu Nombre'}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 opacity-90">
                    {portfolioHook.data.personalInfo.title || 'Tu Título Profesional'}
                  </p>
                  {portfolioHook.data.personalInfo.summary && (
                    <p className="text-lg opacity-80 max-w-3xl mx-auto mb-12">
                      {portfolioHook.data.personalInfo.summary}
                    </p>
                  )}
                  <div className="flex flex-wrap justify-center gap-4">
                    {portfolioHook.data.personalInfo.github && (
                      <a
                        href={portfolioHook.data.personalInfo.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2"
                      >
                        <Icons.Github size={20} />
                        GitHub
                      </a>
                    )}
                    {portfolioHook.data.personalInfo.linkedin && (
                      <a
                        href={portfolioHook.data.personalInfo.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2"
                      >
                        <Icons.ExternalLink size={20} />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </header>

            <main className="container mx-auto px-4 py-16">
              {/* Proyectos */}
              {portfolioHook.data.projects.some(p => p.title) && (
                <section className="mb-20">
                  <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
                    Proyectos Destacados
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolioHook.data.projects
                      .filter(project => project.title)
                      .map((project, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                          <div 
                            className="h-48 bg-gradient-to-br"
                            style={{
                              background: `linear-gradient(135deg, ${templates.selectedTemplate?.colors.primary}20, ${templates.selectedTemplate?.colors.secondary}20)`
                            }}
                          />
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-3 text-gray-800">
                              {project.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {project.description}
                            </p>
                            {project.technologies && (
                              <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                  <TechList technologies={project.technologies} variant="outlined" />
                                </div>
                              </div>
                            )}
                            <div className="flex gap-3">
                              {project.link && (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                  <Icons.ExternalLink size={16} />
                                  Demo
                                </a>
                              )}
                              {project.github && (
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-gray-600 hover:text-gray-700 transition-colors"
                                >
                                  <Icons.Github size={16} />
                                  Código
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </section>
              )}

              {/* Habilidades */}
              {portfolioHook.data.skills.some(s => s.category && s.items) && (
                <section className="mb-20">
                  <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
                    Habilidades
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolioHook.data.skills
                      .filter(skill => skill.category && skill.items)
                      .map((skill, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                          <h3 
                            className="text-xl font-bold mb-4"
                            style={{ color: templates.selectedTemplate?.colors.primary }}
                          >
                            {skill.category}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <TechList technologies={skill.items} />
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </section>
              )}
            </main>

            <footer 
              className="text-white py-8"
              style={{
                background: `linear-gradient(135deg, ${templates.selectedTemplate?.colors.secondary}, ${templates.selectedTemplate?.colors.primary})`
              }}
            >
              <div className="container mx-auto px-4 text-center">
                <p className="mb-2">
                  © {new Date().getFullYear()} {portfolioHook.data.personalInfo.name || 'Tu Nombre'}. 
                  Todos los derechos reservados.
                </p>
                <p className="text-sm opacity-75">
                  Portfolio con plantilla "{templates.selectedTemplate?.name}" • 
                  <button
                    onClick={() => switchMode('customize')}
                    className="text-white hover:text-gray-200 ml-1 underline"
                  >
                    Personalizar plantilla
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
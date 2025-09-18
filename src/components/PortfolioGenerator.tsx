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

// Componente TechList
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
              ? 'border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-300'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          <span className="text-base">{getTechIcon(tech)}</span>
          {tech}
        </span>
      ))}
    </>
  );
};

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
  
  // Estado para navegación de páginas de proyecto
  const [currentView, setCurrentView] = useState<'portfolio' | 'project'>('portfolio');
  const [currentProjectSlug, setCurrentProjectSlug] = useState<string>('');

  // Auto-guardar
  useBeforeUnload(portfolioHook.data);

  // Función para validar URLs de imágenes
  const isValidImageUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return false;
    
    // Verificar si es una URL base64 válida
    if (url.startsWith('data:image/')) {
      // Debe tener formato: data:image/tipo;base64,datos
      const parts = url.split(',');
      if (parts.length !== 2) return false; // Falta la coma o los datos
      if (parts[1].length < 20) return false; // Base64 muy corta
      return true;
    }
    
    // Verificar si es una URL HTTP válida
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Función para limpiar URLs de imágenes
  const cleanImageUrl = (url: string): string | null => {
    const trimmed = url.trim();
    if (!trimmed) return null;
    
    // Si es base64 incompleta o corrupta, rechazar
    if (trimmed.startsWith('data:image/')) {
      if (!isValidImageUrl(trimmed)) {
        console.warn('Imagen base64 corrupta o incompleta:', trimmed.substring(0, 50) + '...');
        return null;
      }
    }
    
    return trimmed;
  };

  // Función para generar slug
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Funciones
  const toggleDataMenu = useCallback(() => {
    setShowDataMenu(prev => !prev);
  }, []);

  const switchMode = useCallback((mode: AppMode) => {
    setCurrentMode(mode);
    // Resetear vista de proyecto cuando cambiamos de modo
    if (mode !== 'portfolio') {
      setCurrentView('portfolio');
      setCurrentProjectSlug('');
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

  // Funciones de navegación de proyectos
  const navigateToProject = useCallback((projectSlug: string) => {
    setCurrentProjectSlug(projectSlug);
    setCurrentView('project');
  }, []);

  const navigateToPortfolio = useCallback(() => {
    setCurrentView('portfolio');
    setCurrentProjectSlug('');
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

        return (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div 
              className="p-8 text-white"
              style={{
                background: `linear-gradient(135deg, ${templates.selectedTemplate?.colors.primary || '#3B82F6'}, ${templates.selectedTemplate?.colors.secondary || '#1E40AF'})`
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
                      style={{ color: templates.selectedTemplate?.colors.primary || '#3B82F6' }}
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
                      style={{ color: templates.selectedTemplate?.colors.primary || '#3B82F6' }}
                    >
                      Proyectos ({portfolioHook.data.projects.length})
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {portfolioHook.data.projects.slice(0, 4).map((project, index) => (
                        <div 
                          key={index}
                          className="rounded-lg p-6 shadow-sm border"
                          style={{ 
                            backgroundColor: templates.selectedTemplate?.colors.surface || '#FFFFFF',
                            borderColor: (templates.selectedTemplate?.colors.primary || '#3B82F6') + '20'
                          }}
                        >
                          <h3 
                            className="text-lg font-semibold mb-2"
                            style={{ color: templates.selectedTemplate?.colors.primary || '#3B82F6' }}
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
                                    backgroundColor: (templates.selectedTemplate?.colors.accent || '#10B981') + '20',
                                    color: templates.selectedTemplate?.colors.accent || '#10B981'
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
                    {portfolioHook.data.projects.length > 4 && (
                      <div className="text-center mt-4">
                        <button
                          onClick={() => switchMode('portfolio')}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Ver todos los proyectos ({portfolioHook.data.projects.length - 4} más)
                        </button>
                      </div>
                    )}
                  </section>
                )}
              </div>
            </div>

            <div 
              className="px-8 py-4 text-center border-t"
              style={{ 
                borderColor: (templates.selectedTemplate?.colors.primary || '#3B82F6') + '20',
                backgroundColor: (templates.selectedTemplate?.colors.surface || '#FFFFFF') + '50'
              }}
            >
              <p className="text-sm text-gray-600">
                Vista previa rápida con plantilla "{templates.selectedTemplate?.name || 'Default'}" • 
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

      case 'portfolio':
        // Si estamos viendo un proyecto específico, mostrar detalles
        if (currentView === 'project') {
          const project = portfolioHook.data.projects.find(p => 
            p.slug === currentProjectSlug || generateSlug(p.title) === currentProjectSlug
          );

          if (!project) {
            return (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center -mx-4 -my-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">Proyecto no encontrado</h1>
                  <p className="text-gray-600 mb-4">El proyecto "{currentProjectSlug}" no existe o fue eliminado.</p>
                  <button
                    onClick={navigateToPortfolio}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Volver al Portfolio
                  </button>
                </div>
              </div>
            );
          }

          // Página completa del proyecto
          return (
            <div className="min-h-screen bg-gray-50 -mx-4 -my-6">
              {/* Header con navegación */}
              <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                  <button
                    onClick={navigateToPortfolio}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    ← Volver al Portfolio
                  </button>
                </div>
              </header>

              <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Imagen principal */}
                {project.image && (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-64 md:h-80 object-cover rounded-lg mb-8 shadow-lg"
                    onError={(e) => {
                      console.error('Error loading main image:', project.image);
                      e.currentTarget.style.border = '3px solid red';
                    }}
                  />
                )}

                {/* Título */}
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                  {project.title}
                </h1>
                
                {/* Tecnologías */}
                {project.technologies && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Tecnologías utilizadas</h3>
                    <div className="flex flex-wrap gap-2">
                      <TechList technologies={project.technologies} />
                    </div>
                  </div>
                )}

                {/* Enlaces principales */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      🚀 Ver Proyecto Live
                    </a>
                  )}
                  {project.github && (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      📁 Ver Código
                    </a>
                  )}
                </div>

                {/* Descripción detallada */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Acerca del Proyecto</h2>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-gray-700 leading-relaxed">
                      {project.detailedDescription || project.description}
                    </p>
                  </div>
                </div>

                {/* Galería de imágenes */}
                {project.images && project.images.trim() && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Galería</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {project.images.split(',').map((img, index) => {
                        const cleanUrl = cleanImageUrl(img);
                        return (
                          cleanUrl && (
                            <img 
                              key={index} 
                              src={cleanUrl} 
                              alt={`${project.title} - Imagen ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                              onError={(e) => {
                                console.error(`Error cargando imagen ${index + 1}:`, cleanUrl.substring(0, 100) + '...');
                                // Ocultar imagen que falla
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )
                        );
                      })}
                    </div>
                    
                    {/* Mensaje si no hay imágenes válidas */}
                    {!project.images.split(',').some(img => cleanImageUrl(img)) && (
                      <div className="text-center py-8 text-gray-500">
                        <p>Las imágenes guardadas están corruptas o incompletas.</p>
                        <p className="text-sm mt-2">Ve al editor para subir nuevas imágenes.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Características */}
                {project.features && project.features.trim() && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Características Principales</h2>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {project.features.split(',').map((feature, index) => (
                          feature.trim() && (
                            <li key={index} className="flex items-center text-gray-700">
                              <span className="text-green-500 mr-2">✓</span>
                              {feature.trim()}
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Instrucciones */}
                {project.instructions && project.instructions.trim() && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Instrucciones de Uso</h2>
                    <div className="bg-gray-100 p-6 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                        {project.instructions}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Desafíos técnicos */}
                {project.challenges && project.challenges.trim() && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Desafíos Técnicos</h2>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <p className="text-gray-700 leading-relaxed">
                        {project.challenges}
                      </p>
                    </div>
                  </div>
                )}

                {/* Botón de volver */}
                <div className="text-center pt-8 border-t">
                  <button
                    onClick={navigateToPortfolio}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    ← Volver al Portfolio
                  </button>
                </div>
              </div>
            </div>
          );
        }

        // Portfolio completo con toda la funcionalidad
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

        return (
          <div className="min-h-screen bg-gray-50 -mx-4 -my-6">
            {/* Header del portfolio con plantilla aplicada */}
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
                    <p className="text-lg mb-10 max-w-3xl mx-auto leading-relaxed opacity-95">
                      {portfolioHook.data.personalInfo.summary}
                    </p>
                  )}
                  
                  {/* Contact Info */}
                  <div className="flex flex-wrap justify-center gap-6 text-sm">
                    {portfolioHook.data.personalInfo.email && (
                      <a href={`mailto:${portfolioHook.data.personalInfo.email}`} 
                         className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full hover:bg-opacity-20 transition-all">
                        ✉️ {portfolioHook.data.personalInfo.email}
                      </a>
                    )}
                    {portfolioHook.data.personalInfo.phone && (
                      <a href={`tel:${portfolioHook.data.personalInfo.phone}`} 
                         className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full hover:bg-opacity-20 transition-all">
                        📱 {portfolioHook.data.personalInfo.phone}
                      </a>
                    )}
                    {portfolioHook.data.personalInfo.location && (
                      <div className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full">
                        📍 {portfolioHook.data.personalInfo.location}
                      </div>
                    )}
                    {portfolioHook.data.personalInfo.website && (
                      <a href={portfolioHook.data.personalInfo.website} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full hover:bg-opacity-20 transition-all">
                        🌐 Website
                      </a>
                    )}
                    {portfolioHook.data.personalInfo.github && (
                      <a href={portfolioHook.data.personalInfo.github} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full hover:bg-opacity-20 transition-all">
                        📁 GitHub
                      </a>
                    )}
                    {portfolioHook.data.personalInfo.linkedin && (
                      <a href={portfolioHook.data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full hover:bg-opacity-20 transition-all">
                        💼 LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </header>

            <div className="container mx-auto px-4 py-16">
              {/* Projects Section */}
              {portfolioHook.data.projects.filter(p => p.title.trim()).length > 0 && (
                <section className="mb-20">
                  <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                    Proyectos Destacados
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolioHook.data.projects.filter(p => p.title.trim()).map((project, index) => {
                      // Función para ilustración por defecto
                      const getDefaultIllustration = (title: string, description: string) => {
                        const titleLower = title.toLowerCase();
                        if (titleLower.includes('ecommerce') || titleLower.includes('shop')) {
                          return { emoji: '🛒', gradient: 'from-purple-500 via-pink-500 to-red-500' };
                        }
                        if (titleLower.includes('task') || titleLower.includes('todo')) {
                          return { emoji: '✅', gradient: 'from-blue-500 via-cyan-500 to-teal-500' };
                        }
                        if (titleLower.includes('portfolio') || titleLower.includes('personal')) {
                          return { emoji: '👨‍💻', gradient: 'from-indigo-500 via-purple-500 to-pink-500' };
                        }
                        return { emoji: '🌐', gradient: 'from-cyan-500 via-blue-500 to-indigo-500' };
                      };
                      
                      const defaultIllustration = getDefaultIllustration(project.title, project.description);
                      const hasCustomImage = project.image && project.image.trim();
                      
                      return (
                        <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                          <div className="relative h-48 overflow-hidden">
                            {hasCustomImage && isValidImageUrl(project.image!) ? (
                              <>
                                <img 
                                  src={project.image} 
                                  alt={project.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    console.error('Error loading project image:', project.image);
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                              </>
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${defaultIllustration.gradient} flex items-center justify-center relative`}>
                                <div className="absolute inset-0 opacity-10">
                                  <div className="absolute top-4 left-4 text-2xl">✨</div>
                                  <div className="absolute top-8 right-6 text-xl">⚡</div>
                                  <div className="absolute bottom-6 left-8 text-xl">💎</div>
                                  <div className="absolute bottom-4 right-4 text-2xl">🚀</div>
                                </div>
                                <div className="relative z-10 text-6xl group-hover:scale-110 transition-transform duration-300">
                                  {defaultIllustration.emoji}
                                </div>
                              </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                              {hasCustomImage ? '📸 Proyecto' : '🎨 Demo'}
                            </div>
                          </div>
                          
                          <div className="p-8">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">
                              {project.title}
                            </h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                              {project.description}
                            </p>
                            
                            {project.technologies && (
                              <div className="flex flex-wrap gap-2 mb-6">
                                <TechList technologies={project.technologies} />
                              </div>
                            )}
                            
                            <div className="flex gap-4 flex-wrap">
                              {/* Botón Ver Detalles - SIEMPRE visible */}
                              {project.title.trim() && (
                                <button
                                  onClick={() => navigateToProject(project.slug || generateSlug(project.title))}
                                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  👁️ Ver Detalles
                                </button>
                              )}
                              
                              {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer"
                                   className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                  🚀 Ver Live
                                </a>
                              )}
                              
                              {project.github && (
                                <a href={project.github} target="_blank" rel="noopener noreferrer"
                                   className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                  📁 Código
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Skills Section */}
              {portfolioHook.data.skills.filter(s => s.category.trim()).length > 0 && (
                <section className="mb-20">
                  <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                    Habilidades Técnicas
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolioHook.data.skills.filter(s => s.category.trim()).map((skill, index) => (
                      <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">
                          {skill.category}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          <TechList technologies={skill.items} variant="outlined" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
              <div className="container mx-auto px-4 text-center">
                <p className="text-gray-300">
                  © {new Date().getFullYear()} {portfolioHook.data.personalInfo.name || 'Tu Nombre'}. Todos los derechos reservados.
                </p>
                <p className="text-gray-400 mt-2 text-sm">
                  Portfolio con plantilla "{templates.selectedTemplate?.name}" • 
                  <button
                    onClick={() => switchMode('templates')}
                    className="text-blue-400 hover:text-blue-300 ml-1"
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
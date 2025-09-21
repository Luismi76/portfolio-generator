// PortfolioGenerator.tsx - VERSIÓN CON NAVEGACIÓN A PERSONALIZAR CORREGIDA
import React, { useRef, useState, useCallback } from 'react';
import { Icons } from './portfolio-icons';
import { 
  usePortfolioData, 
  useBeforeUnload,
} from './portfolio-hooks';
import { useTemplates } from './use-templates';
import { 
  createTemplateAwareExporter
} from './portfolio-export';
import PersonalInfoForm from './PersonalInfoForm';
import ProjectTableForm from './ProjectTableForm';
import SkillTableForm from './SkillTableForm';
import { TemplateSelector } from './TemplateSelector';
import TemplateRenderer from './TemplateRenderer';

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


// ✅ Componente TemplateCustomizer COMPLETO
const TemplateCustomizer: React.FC<{
  template: any;
  config: any;
  onConfigChange: (config: any) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ template, config, onConfigChange, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'sections'>('colors');
  
  // Estados locales para la configuración
  const [colors, setColors] = useState({
    primary: template.colors.primary,
    secondary: template.colors.secondary,
    accent: template.colors.accent,
    background: template.colors.background,
    surface: template.colors.surface,
    ...config.customizations?.colors
  });

  const [typography, setTypography] = useState({
    fontFamily: {
      primary: template.typography.fontFamily.primary,
      heading: template.typography.fontFamily.heading,
      ...config.customizations?.typography?.fontFamily
    },
    fontSize: {
      ...template.typography.fontSize,
      ...config.customizations?.typography?.fontSize
    },
    fontWeight: {
      ...template.typography.fontWeight,
      ...config.customizations?.typography?.fontWeight
    }
  });

  const [layout, setLayout] = useState({
    maxWidth: template.layout.maxWidth,
    spacing: { ...template.layout.spacing },
    borderRadius: { ...template.layout.borderRadius },
    ...config.customizations?.layout
  });

  const [sections, setSections] = useState(
    config.customizations?.sections || template.sections || [
      { id: 'header', name: 'Encabezado', enabled: true, order: 1 },
      { id: 'about', name: 'Sobre mí', enabled: true, order: 2 },
      { id: 'skills', name: 'Habilidades', enabled: true, order: 3 },
      { id: 'projects', name: 'Proyectos', enabled: true, order: 4 },
      { id: 'experience', name: 'Experiencia', enabled: false, order: 5 },
      { id: 'education', name: 'Educación', enabled: false, order: 6 },
      { id: 'contact', name: 'Contacto', enabled: true, order: 7 }
    ]
  );

  const [customCSS, setCustomCSS] = useState(config.customizations?.customCSS || '');

  // Actualizar configuración solo cuando se guarda, no automáticamente
  const handleSave = () => {
    const updatedConfig = {
      ...config,
      customizations: {
        ...config.customizations,
        colors,
        typography,
        layout,
        sections,
        customCSS
      }
    };
    onConfigChange(updatedConfig);
    onSave();
  };

  const handleColorChange = (key: string, value: string) => {
    setColors((prev: any) => ({ ...prev, [key]: value } as any));
  };

  const handleTypographyChange = (category: string, key: string, value: string | number) => {
    setTypography((prev: any) => ({
      ...prev,
      [category]: { ...(prev as any)[category], [key]: value }
    } as any));
  };

  const handleLayoutChange = (category: string, key: string, value: string) => {
    if (category === '') {
      setLayout((prev: any) => ({ ...prev, [key]: value } as any));
    } else {
      setLayout((prev: any) => ({
        ...prev,
        [category]: { ...(prev as any)[category], [key]: value }
      } as any));
    }
  };

  const handleSectionToggle = (sectionId: string) => {
    setSections((prev: any[]) => 
      prev.map((section: any) => 
        section.id === sectionId 
          ? { ...section, enabled: !section.enabled }
          : section
      )
    );
  };

  const handleSectionReorder = (sectionId: string, newOrder: number) => {
    setSections((prev: any[]) => {
      const updated = prev.map((section: any) => 
        section.id === sectionId 
          ? { ...section, order: newOrder }
          : section
      );
      return updated.sort((a: any, b: any) => a.order - b.order);
    });
  };

  const fontOptions = [
    { value: "'Inter', sans-serif", label: 'Inter (Moderno)' },
    { value: "'Roboto', sans-serif", label: 'Roboto (Limpio)' },
    { value: "'Poppins', sans-serif", label: 'Poppins (Redondeado)' },
    { value: "'Source Sans Pro', sans-serif", label: 'Source Sans Pro' },
    { value: "'Montserrat', sans-serif", label: 'Montserrat (Elegante)' },
    { value: "'Open Sans', sans-serif", label: 'Open Sans' },
    { value: "'Lato', sans-serif", label: 'Lato' },
    { value: "'Playfair Display', serif", label: 'Playfair Display (Serif)' },
    { value: "'Merriweather', serif", label: 'Merriweather (Serif)' },
    { value: "'Fira Code', monospace", label: 'Fira Code (Monospace)' }
  ];

  const TabButton = ({ tab, label, active, onClick }: {
    tab: 'colors' | 'typography' | 'layout' | 'sections';
    label: string; 
    active: boolean;
    onClick: (tab: 'colors' | 'typography' | 'layout' | 'sections') => void;
  }) => (
    <button
      onClick={() => onClick(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Personalizar: {template.name}
          </h2>
          <p className="text-gray-600 mt-1">
            Ajusta colores, tipografía, diseño y secciones de tu plantilla
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-6 pb-0">
        <TabButton tab="colors" label="Colores" active={activeTab === 'colors'} onClick={setActiveTab} />
        <TabButton tab="typography" label="Tipografía" active={activeTab === 'typography'} onClick={setActiveTab} />
        <TabButton tab="layout" label="Diseño" active={activeTab === 'layout'} onClick={setActiveTab} />
        <TabButton tab="sections" label="Secciones" active={activeTab === 'sections'} onClick={setActiveTab} />
      </div>

      <div className="p-6">
        {activeTab === 'colors' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Panel de colores */}
            <div className="space-y-6">
              <h3 className="font-medium text-gray-900">Esquema de Colores</h3>
              
              {[
                { key: 'primary', label: 'Color Primario', desc: 'Botones, enlaces principales' },
                { key: 'secondary', label: 'Color Secundario', desc: 'Elementos complementarios' },
                { key: 'accent', label: 'Color de Acento', desc: 'Highlights y detalles' },
                { key: 'background', label: 'Fondo Principal', desc: 'Fondo de la página' },
                { key: 'surface', label: 'Fondo de Tarjetas', desc: 'Fondo de elementos' }
              ].map(({ key, label, desc }: { key: string; label: string; desc: string }) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={(colors as any)[key] || '#000000'}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={(colors as any)[key] || ''}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              ))}
            </div>

            {/* Vista previa de colores */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Vista Previa</h3>
              <div className="space-y-3 p-4 border rounded-lg" style={{ backgroundColor: colors.background }}>
                <div 
                  className="h-16 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: colors.primary }}
                >
                  Header Principal
                </div>
                <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.surface }}
                >
                  <div 
                    className="h-4 rounded mb-2"
                    style={{ backgroundColor: colors.secondary, width: '60%' }}
                  ></div>
                  <div className="flex gap-2">
                    {[colors.accent, colors.primary, colors.secondary].map((color: string, i: number) => (
                      <div 
                        key={i}
                        className="flex-1 h-3 rounded"
                        style={{ backgroundColor: color + (i === 0 ? '' : '80') }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-medium text-gray-900">Configuración Tipográfica</h3>
              
              {/* Fuente principal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuente Principal
                </label>
                <select
                  value={typography.fontFamily.primary}
                  onChange={(e) => handleTypographyChange('fontFamily', 'primary', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  {fontOptions.map(font => (
                    <option key={font.value} value={font.value}>{font.label}</option>
                  ))}
                </select>
              </div>

              {/* Fuente de títulos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuente de Títulos
                </label>
                <select
                  value={typography.fontFamily.heading}
                  onChange={(e) => handleTypographyChange('fontFamily', 'heading', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  {fontOptions.map(font => (
                    <option key={font.value} value={font.value}>{font.label}</option>
                  ))}
                </select>
              </div>

              {/* Tamaños de fuente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño Base (Texto normal)
                </label>
                <select
                  value={typography.fontSize.base}
                  onChange={(e) => handleTypographyChange('fontSize', 'base', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="0.875rem">Pequeño (14px)</option>
                  <option value="1rem">Normal (16px)</option>
                  <option value="1.125rem">Grande (18px)</option>
                  <option value="1.25rem">Extra Grande (20px)</option>
                </select>
              </div>
            </div>

            {/* Vista previa tipografía */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Vista Previa Tipográfica</h3>
              <div className="p-4 border rounded-lg space-y-4">
                <h1 style={{ 
                  fontFamily: typography.fontFamily.heading, 
                  fontSize: '2.25rem',
                  fontWeight: typography.fontWeight.bold 
                }}>
                  Título Principal
                </h1>
                <h2 style={{ 
                  fontFamily: typography.fontFamily.heading, 
                  fontSize: '1.5rem',
                  fontWeight: typography.fontWeight.semibold 
                }}>
                  Subtítulo de Sección
                </h2>
                <p style={{ 
                  fontFamily: typography.fontFamily.primary, 
                  fontSize: typography.fontSize.base 
                }}>
                  Este es un párrafo de ejemplo con la fuente principal seleccionada. 
                  Muestra cómo se verá el texto normal en tu portfolio.
                </p>
                <div style={{ 
                  fontFamily: typography.fontFamily.primary, 
                  fontSize: typography.fontSize.sm 
                }}>
                  <strong>Texto en negrita</strong> y <em>texto en cursiva</em>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-medium text-gray-900">Configuración de Diseño</h3>
              
              {/* Ancho máximo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ancho Máximo del Contenido
                </label>
                <select
                  value={layout.maxWidth}
                  onChange={(e) => handleLayoutChange('', 'maxWidth', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="900px">Estrecho (900px)</option>
                  <option value="1200px">Normal (1200px)</option>
                  <option value="1400px">Amplio (1400px)</option>
                  <option value="100%">Completo (100%)</option>
                </select>
              </div>

              {/* Espaciado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Espaciado Entre Secciones
                </label>
                <select
                  value={layout.spacing.lg}
                  onChange={(e) => handleLayoutChange('spacing', 'lg', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="1.5rem">Compacto</option>
                  <option value="2rem">Normal</option>
                  <option value="3rem">Amplio</option>
                  <option value="4rem">Extra Amplio</option>
                </select>
              </div>

              {/* Radio de bordes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Esquinas Redondeadas
                </label>
                <select
                  value={layout.borderRadius.lg}
                  onChange={(e) => handleLayoutChange('borderRadius', 'lg', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="0px">Sin Redondear</option>
                  <option value="0.5rem">Suave</option>
                  <option value="0.75rem">Normal</option>
                  <option value="1rem">Redondeado</option>
                  <option value="1.5rem">Muy Redondeado</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Vista Previa del Diseño</h3>
              <div 
                className="border p-4 mx-auto"
                style={{ maxWidth: layout.maxWidth === '100%' ? '300px' : '300px' }}
              >
                <div 
                  className="bg-gray-200 h-12 mb-4"
                  style={{ borderRadius: layout.borderRadius.lg }}
                ></div>
                <div 
                  className="space-y-2"
                  style={{ gap: layout.spacing.lg }}
                >
                  <div 
                    className="bg-gray-100 h-8"
                    style={{ borderRadius: layout.borderRadius.lg }}
                  ></div>
                  <div 
                    className="bg-gray-100 h-6"
                    style={{ borderRadius: layout.borderRadius.lg }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Gestión de Secciones</h3>
              <div className="text-sm text-gray-600">
                {sections.filter((s: any) => s.enabled).length} de {sections.length} secciones activas
              </div>
            </div>

            <div className="space-y-3">
              {sections.sort((a: any, b: any) => a.order - b.order).map((section: any) => (
                <div 
                  key={section.id}
                  className={`p-4 border rounded-lg ${section.enabled ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={section.enabled}
                        onChange={() => handleSectionToggle(section.id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span className={`font-medium ${section.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                        {section.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Orden:</label>
                      <select
                        value={section.order}
                        onChange={(e) => handleSectionReorder(section.id, parseInt(e.target.value))}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        {sections.map((_: any, i: number) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {!section.enabled && (
                    <p className="text-sm text-gray-500 mt-2">
                      Esta sección no se mostrará en tu portfolio
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Icons.Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <strong>Consejos:</strong>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>Desactiva secciones que no necesites para un diseño más limpio</li>
                    <li>Reordena las secciones según tus prioridades</li>
                    <li>La sección "Header" siempre debe estar primera</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CSS Personalizado (en todas las pestañas) */}
        <div className="mt-8 pt-6 border-t">
          <details className="group">
            <summary className="cursor-pointer flex items-center gap-2 font-medium text-gray-900 hover:text-blue-600">
              <Icons.Code size={16} />
              CSS Personalizado (Avanzado)
              <Icons.ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-600">
                Añade CSS personalizado para ajustes específicos de diseño
              </p>
              <textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                placeholder="/* Tu CSS personalizado aquí */
.mi-estilo-custom {
  color: #333;
  font-weight: bold;
}"
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
              />
            </div>
          </details>
        </div>
      </div>
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
    console.log('switchMode called:', { from: currentMode, to: mode });
    setCurrentMode(mode);
    setShowDataMenu(false); // Cerrar menú al cambiar modo
    
    // 🔥 ACTUALIZAR URL DEL NAVEGADOR
    const url = new URL(window.location.href);
    const urlMode = mode === 'portfolio' ? 'porfolio' : mode;
    url.searchParams.set('mode', urlMode);
    
    // Si navegamos a portfolio, recargar la página
    if (mode === 'portfolio') {
      window.location.href = url.toString();
    } else {
      window.history.pushState({}, '', url.toString());
    }
  }, [currentMode]);

// Función para exportar HTML simple con plantilla personalizada
const handleExportHTML = useCallback(() => {
  try {
    if (!templates.selectedTemplate) {
      alert('❌ No hay plantilla seleccionada. Por favor, selecciona una plantilla primero.');
      return;
    }

    // ✅ USAR el nuevo exportador con plantilla Y configuración personalizada
    const templateAwareExporter = createTemplateAwareExporter(
      portfolioHook.data, 
      templates.selectedTemplate, 
      'single',
      templates.config || undefined // ✅ Pasar la configuración personalizada
    );
    
    const result = templateAwareExporter.export();
    
    if (result.success) {
      console.log('✅ Portfolio exportado:', result.message);
    } else {
      console.error('❌ Error en exportación:', result.message);
      alert(`Error al exportar: ${result.message}`);
    }
  } catch (error) {
    console.error('❌ Error inesperado en exportación:', error);
    alert('Error inesperado al exportar el portfolio');
  }
}, [portfolioHook.data, templates.selectedTemplate, templates.config]);

// Función para exportar sitio web completo con plantilla personalizada
const handleExportWebsite = useCallback(() => {
  try {
    if (!templates.selectedTemplate) {
      alert('❌ No hay plantilla seleccionada. Por favor, selecciona una plantilla primero.');
      return;
    }

    // ✅ USAR el nuevo exportador con plantilla Y configuración personalizada
    const templateAwareExporter = createTemplateAwareExporter(
      portfolioHook.data, 
      templates.selectedTemplate, 
      'multi',
      templates.config || undefined // ✅ Pasar la configuración personalizada
    );
    
    const result = templateAwareExporter.export();
    
    if (result.success) {
      console.log('✅ Sitio web exportado:', result.message);
      alert(`🎉 ${result.message}\n\n📁 Archivos descargados listos para GitHub Pages!`);
    } else {
      console.error('❌ Error en exportación:', result.message);
      alert(`Error al exportar: ${result.message}`);
    }
  } catch (error) {
    console.error('❌ Error inesperado en exportación:', error);
    alert('Error inesperado al exportar el sitio web');
  }
}, [portfolioHook.data, templates.selectedTemplate, templates.config]);

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

  // 🔥 AQUÍ ESTÁ LA CORRECCIÓN - Añadir el caso 'customize'
  const renderContent = () => {
    console.log('renderContent called with currentMode:', currentMode);
    
    switch (currentMode) {
      case 'templates':
        return (
          <TemplateSelector
            templates={templates.templates}
            selectedTemplate={templates.selectedTemplate}
            onSelectTemplate={templates.selectTemplate}
            onCustomize={() => switchMode('customize')}
            onAddTemplate={() => console.log('Add template')}
          />
        );
      
      case 'customize':
        if (!templates.selectedTemplate || !templates.config) {
          return (
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-center">
                <Icons.Settings size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecciona una plantilla primero
                </h3>
                <p className="text-gray-600 mb-4">
                  Para personalizar un diseño, primero debes seleccionar una plantilla
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
            onSave={() => switchMode('preview')}
            onCancel={() => switchMode('templates')}
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
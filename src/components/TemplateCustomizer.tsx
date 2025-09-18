// TemplateCustomizer.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { 
  TemplateCustomizerProps, 
  TemplateConfig,
  TemplateColors,
  TemplateTypography,
  TemplateLayout,
  TemplateLayoutConfig,
  SectionPosition,
  SectionWidth,
  SectionDisplay,
  LAYOUT_PRESETS,
  SECTION_POSITION_OPTIONS,
  SECTION_WIDTH_OPTIONS,
  SECTION_DISPLAY_OPTIONS
} from '../types/template-types';
import { Icons } from './portfolio-icons';

// Tipos para las pestañas del customizador
type CustomizerTab = 'colors' | 'typography' | 'layout' | 'advanced-layout' | 'sections' | 'preview';

// Props para componentes internos
interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}

interface TabButtonProps {
  tab: CustomizerTab;
  activeTab: CustomizerTab;
  onTabChange: (tab: CustomizerTab) => void;
  icon: keyof typeof Icons;
  children: React.ReactNode;
}

// Componente para el selector de colores
const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Paleta de colores predefinidos
  const colorPalette = [
    '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#EF4444',
    '#F59E0B', '#10B981', '#06B6D4', '#84CC16', '#F97316',
    '#64748B', '#6B7280', '#374151', '#111827', '#000000',
    '#FFFFFF', '#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1'
  ];

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500 mb-2">{description}</p>
      )}
      
      <div className="flex items-center gap-3">
        {/* Color preview */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center overflow-hidden hover:border-gray-400 transition-colors"
          style={{ backgroundColor: value }}
        >
          {!value && <Icons.Settings size={16} className="text-gray-400" />}
        </button>
        
        {/* Input de texto */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Paleta de colores */}
      {isOpen && (
        <div className="absolute z-10 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="grid grid-cols-5 gap-2 mb-3">
            {colorPalette.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
                className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full text-xs text-gray-500 hover:text-gray-700"
          >
            Cerrar paleta
          </button>
        </div>
      )}
    </div>
  );
};

// Componente para botón de pestaña
const TabButton: React.FC<TabButtonProps> = ({ tab, activeTab, onTabChange, icon, children }) => {
  const IconComponent = Icons[icon];
  return (
    <button
      onClick={() => onTabChange(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <IconComponent size={16} />
      {children}
    </button>
  );
};

// Componente principal del customizador
const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  template,
  config,
  onConfigChange,
  onSave,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState<CustomizerTab>('colors');
  const [hasChanges, setHasChanges] = useState(false);

  // Obtener valores actuales combinando template base + customizaciones
  const currentValues = useMemo(() => {
    const customizations = config.customizations || {};
    
    return {
      colors: { ...template.colors, ...customizations.colors },
      typography: { ...template.typography, ...customizations.typography },
      layout: { ...template.layout, ...customizations.layout },
      sections: customizations.sections || template.sections,
      customCSS: customizations.customCSS || '',
      layoutConfig: customizations.layoutConfig || template.layout.layoutConfig || {
        type: 'single-column',
        mainContentArea: { columns: 1, gap: '2rem' }
      },
      sidebarContent: customizations.sidebarContent || {}
    };
  }, [template, config]);

  // Función para actualizar configuración
  const updateConfig = useCallback((updates: Partial<TemplateConfig['customizations']>) => {
    setHasChanges(true);
    onConfigChange({
      ...config,
      customizations: {
        ...config.customizations,
        ...updates
      }
    });
  }, [config, onConfigChange]);

  // Funciones para actualizar secciones específicas
  const updateColors = useCallback((colorUpdates: Partial<TemplateColors>) => {
    updateConfig({
      colors: {
        ...currentValues.colors,
        ...colorUpdates
      }
    });
  }, [currentValues.colors, updateConfig]);

  const updateTypography = useCallback((typoUpdates: Partial<TemplateTypography>) => {
    updateConfig({
      typography: {
        ...currentValues.typography,
        ...typoUpdates
      }
    });
  }, [currentValues.typography, updateConfig]);

  const updateLayout = useCallback((layoutUpdates: Partial<TemplateLayout>) => {
    updateConfig({
      layout: {
        ...currentValues.layout,
        ...layoutUpdates
      }
    });
  }, [currentValues.layout, updateConfig]);

  const updateLayoutConfig = useCallback((layoutConfigUpdates: Partial<TemplateLayoutConfig>) => {
    // Filtrar valores undefined y asegurar que type tenga un valor válido
    const cleanUpdates: Partial<TemplateLayoutConfig> = {};
    
    Object.entries(layoutConfigUpdates).forEach(([key, value]) => {
      if (value !== undefined) {
        (cleanUpdates as any)[key] = value;
      }
    });

    // Asegurar que type tenga un valor válido si se está actualizando
    if ('type' in layoutConfigUpdates && layoutConfigUpdates.type !== undefined) {
      cleanUpdates.type = layoutConfigUpdates.type;
    }

    updateConfig({
      layoutConfig: {
        ...currentValues.layoutConfig,
        ...cleanUpdates
      }
    });
  }, [currentValues.layoutConfig, updateConfig]);

  // Función para resetear a valores por defecto
  const resetToDefaults = useCallback(() => {
    onConfigChange({
      templateId: template.id,
      customizations: {}
    });
    setHasChanges(false);
  }, [template.id, onConfigChange]);

  // Función para guardar
  const handleSave = useCallback(() => {
    onSave();
    setHasChanges(false);
  }, [onSave]);

  // Generar CSS preview
  const generatePreviewCSS = useCallback(() => {
    const colors = currentValues.colors;
    const typography = currentValues.typography;
    const layout = currentValues.layout;

    return `
      :root {
        /* Colores */
        --color-primary: ${colors.primary};
        --color-secondary: ${colors.secondary};
        --color-accent: ${colors.accent};
        --color-background: ${colors.background};
        --color-surface: ${colors.surface};
        --color-text-primary: ${colors.text.primary};
        --color-text-secondary: ${colors.text.secondary};
        --color-text-accent: ${colors.text.accent};
        
        /* Tipografía */
        --font-primary: ${typography.fontFamily.primary};
        --font-heading: ${typography.fontFamily.heading};
        
        /* Layout */
        --max-width: ${layout.maxWidth};
        --spacing-sm: ${layout.spacing.sm};
        --spacing-md: ${layout.spacing.md};
        --spacing-lg: ${layout.spacing.lg};
        --border-radius: ${layout.borderRadius.md};
        
        /* Layout Avanzado */
        --sidebar-width: ${currentValues.layoutConfig?.sidebarWidth || '300px'};
        --content-columns: ${currentValues.layoutConfig?.mainContentArea?.columns || 1};
        --content-gap: ${currentValues.layoutConfig?.mainContentArea?.gap || '2rem'};
      }
    `;
  }, [currentValues]);

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Personalizar Plantilla: {template.name}
            </h2>
            <p className="text-gray-600 mt-1">
              {template.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              Resetear
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {hasChanges ? 'Guardar Cambios' : 'Guardado'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar con pestañas */}
        <div className="w-64 border-r border-gray-200 p-4">
          <nav className="space-y-2">
            <TabButton 
              tab="colors" 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              icon="Settings"
            >
              Colores
            </TabButton>
            <TabButton 
              tab="typography" 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              icon="Code"
            >
              Tipografía
            </TabButton>
            <TabButton 
              tab="layout" 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              icon="Settings"
            >
              Layout Básico
            </TabButton>
            <TabButton 
              tab="advanced-layout" 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              icon="Settings"
            >
              Layout Avanzado
            </TabButton>
            <TabButton 
              tab="sections" 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              icon="Settings"
            >
              Secciones
            </TabButton>
            <TabButton 
              tab="preview" 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              icon="Eye"
            >
              Vista Previa
            </TabButton>
          </nav>
        </div>

        {/* Área principal de contenido */}
        <div className="flex-1">
          {/* Panel de Colores */}
          {activeTab === 'colors' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Configuración de Colores
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ColorPicker
                    label="Color Primario"
                    value={currentValues.colors.primary}
                    onChange={(color) => updateColors({ primary: color })}
                    description="Color principal del tema"
                  />
                  
                  <ColorPicker
                    label="Color Secundario"
                    value={currentValues.colors.secondary}
                    onChange={(color) => updateColors({ secondary: color })}
                    description="Color de apoyo"
                  />
                  
                  <ColorPicker
                    label="Color de Acento"
                    value={currentValues.colors.accent}
                    onChange={(color) => updateColors({ accent: color })}
                    description="Color para elementos destacados"
                  />
                  
                  <ColorPicker
                    label="Fondo Principal"
                    value={currentValues.colors.background}
                    onChange={(color) => updateColors({ background: color })}
                    description="Color de fondo de la página"
                  />
                  
                  <ColorPicker
                    label="Superficie"
                    value={currentValues.colors.surface}
                    onChange={(color) => updateColors({ surface: color })}
                    description="Color de cards y paneles"
                  />
                </div>

                <div className="mt-8">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Colores de Texto
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ColorPicker
                      label="Texto Principal"
                      value={currentValues.colors.text.primary}
                      onChange={(color) => updateColors({ 
                        text: { ...currentValues.colors.text, primary: color }
                      })}
                    />
                    
                    <ColorPicker
                      label="Texto Secundario"
                      value={currentValues.colors.text.secondary}
                      onChange={(color) => updateColors({ 
                        text: { ...currentValues.colors.text, secondary: color }
                      })}
                    />
                    
                    <ColorPicker
                      label="Texto de Acento"
                      value={currentValues.colors.text.accent}
                      onChange={(color) => updateColors({ 
                        text: { ...currentValues.colors.text, accent: color }
                      })}
                    />
                  </div>
                </div>

                {/* Gradientes */}
                {currentValues.colors.gradient && (
                  <div className="mt-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Configuración de Gradiente
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ColorPicker
                        label="Gradiente Desde"
                        value={currentValues.colors.gradient.from}
                        onChange={(color) => updateColors({ 
                          gradient: { ...currentValues.colors.gradient!, from: color }
                        })}
                      />
                      
                      <ColorPicker
                        label="Gradiente Hasta"
                        value={currentValues.colors.gradient.to}
                        onChange={(color) => updateColors({ 
                          gradient: { ...currentValues.colors.gradient!, to: color }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Panel de Tipografía */}
          {activeTab === 'typography' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración Tipográfica
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuente Principal
                  </label>
                  <select
                    value={currentValues.typography.fontFamily.primary}
                    onChange={(e) => updateTypography({
                      fontFamily: {
                        ...currentValues.typography.fontFamily,
                        primary: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="'Inter', sans-serif">Inter (Sans-serif)</option>
                    <option value="'Roboto', sans-serif">Roboto (Sans-serif)</option>
                    <option value="'Open Sans', sans-serif">Open Sans (Sans-serif)</option>
                    <option value="'Lato', sans-serif">Lato (Sans-serif)</option>
                    <option value="'Montserrat', sans-serif">Montserrat (Sans-serif)</option>
                    <option value="'Georgia', serif">Georgia (Serif)</option>
                    <option value="'Times New Roman', serif">Times New Roman (Serif)</option>
                    <option value="'Merriweather', serif">Merriweather (Serif)</option>
                    <option value="'JetBrains Mono', monospace">JetBrains Mono (Monospace)</option>
                    <option value="'Fira Code', monospace">Fira Code (Monospace)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuente para Títulos
                  </label>
                  <select
                    value={currentValues.typography.fontFamily.heading}
                    onChange={(e) => updateTypography({
                      fontFamily: {
                        ...currentValues.typography.fontFamily,
                        heading: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="'Inter', sans-serif">Inter (Sans-serif)</option>
                    <option value="'Roboto', sans-serif">Roboto (Sans-serif)</option>
                    <option value="'Montserrat', sans-serif">Montserrat (Sans-serif)</option>
                    <option value="'Playfair Display', serif">Playfair Display (Serif)</option>
                    <option value="'Georgia', serif">Georgia (Serif)</option>
                    <option value="'Merriweather', serif">Merriweather (Serif)</option>
                  </select>
                </div>

                {/* Tamaños de fuente */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto Base
                    </label>
                    <input
                      type="text"
                      value={currentValues.typography.fontSize.base}
                      onChange={(e) => updateTypography({
                        fontSize: {
                          ...currentValues.typography.fontSize,
                          base: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="1rem"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título Grande
                    </label>
                    <input
                      type="text"
                      value={currentValues.typography.fontSize['4xl']}
                      onChange={(e) => updateTypography({
                        fontSize: {
                          ...currentValues.typography.fontSize,
                          '4xl': e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="2.5rem"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título Medio
                    </label>
                    <input
                      type="text"
                      value={currentValues.typography.fontSize['2xl']}
                      onChange={(e) => updateTypography({
                        fontSize: {
                          ...currentValues.typography.fontSize,
                          '2xl': e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="1.5rem"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto Pequeño
                    </label>
                    <input
                      type="text"
                      value={currentValues.typography.fontSize.sm}
                      onChange={(e) => updateTypography({
                        fontSize: {
                          ...currentValues.typography.fontSize,
                          sm: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="0.875rem"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Panel de Layout Básico */}
          {activeTab === 'layout' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración de Layout Básico
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ancho Máximo
                  </label>
                  <input
                    type="text"
                    value={currentValues.layout.maxWidth}
                    onChange={(e) => updateLayout({ maxWidth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="1200px"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ancho máximo del contenido (ej: 1200px, 100%, 80rem)
                  </p>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Espaciado</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(currentValues.layout.spacing).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {key}
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateLayout({
                            spacing: {
                              ...currentValues.layout.spacing,
                              [key]: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="1rem"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Border Radius</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(currentValues.layout.borderRadius).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {key}
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateLayout({
                            borderRadius: {
                              ...currentValues.layout.borderRadius,
                              [key]: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="0.5rem"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Panel de Layout Avanzado */}
          {activeTab === 'advanced-layout' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración de Layout Avanzado
              </h3>
              
              <div className="space-y-6">
                {/* Tipo de Layout */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de Layout
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(LAYOUT_PRESETS).map(([key, preset]) => (
                      <button
                        key={key}
                        onClick={() => updateLayoutConfig({
                          type: preset.type,
                          sidebarWidth: preset.sidebarWidth,
                          sidebarPosition: preset.sidebarPosition,
                          sidebarSticky: preset.sidebarSticky,
                          mainContentArea: preset.mainContentArea
                        })}

                        className={`p-4 border rounded-lg text-left hover:border-blue-300 transition-colors ${
                          currentValues.layoutConfig?.type === preset.type
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="font-medium text-sm text-gray-900 mb-1 capitalize">
                          {key.replace('-', ' ')}
                        </div>
                        <div className="text-xs text-gray-600">
                          {preset.type === 'single-column' && 'Una sola columna centrada'}
                          {preset.type === 'sidebar-left' && 'Sidebar a la izquierda'}
                          {preset.type === 'sidebar-right' && 'Sidebar a la derecha'}
                          {preset.type === 'two-column' && 'Dos columnas balanceadas'}
                          {preset.type === 'three-column' && 'Tres columnas'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Configuración de Sidebar */}
                {(currentValues.layoutConfig?.type === 'sidebar-left' || 
                  currentValues.layoutConfig?.type === 'sidebar-right') && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Configuración de Sidebar</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ancho del Sidebar
                        </label>
                        <input
                          type="text"
                          value={currentValues.layoutConfig?.sidebarWidth || '300px'}
                          onChange={(e) => updateLayoutConfig({
                            sidebarWidth: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="300px, 25%, etc."
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="sidebarSticky"
                          checked={currentValues.layoutConfig?.sidebarSticky || false}
                          onChange={(e) => updateLayoutConfig({
                            sidebarSticky: e.target.checked
                          })}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="sidebarSticky" className="ml-2 text-sm text-gray-700">
                          Sidebar fijo (sticky)
                        </label>
                      </div>
                    </div>

                    {/* Contenido del Sidebar */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Contenido del Sidebar
                      </label>
                      <div className="space-y-2">
                        {[
                          { key: 'showProfile', label: 'Mostrar perfil/avatar' },
                          { key: 'showNavigation', label: 'Mostrar navegación' },
                          { key: 'showSummary', label: 'Mostrar resumen' },
                          { key: 'showContact', label: 'Mostrar información de contacto' }
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              id={key}
                              checked={Boolean(currentValues.sidebarContent?.[key as keyof typeof currentValues.sidebarContent]) || false}
                              onChange={(e) => updateConfig({
                                sidebarContent: {
                                  ...currentValues.sidebarContent,
                                  [key]: e.target.checked
                                }
                              })}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={key} className="ml-2 text-sm text-gray-700">
                              {label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Configuración de Columnas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Columnas (Área Principal)
                  </label>
                  <select
                    value={currentValues.layoutConfig?.mainContentArea?.columns || 1}
                    onChange={(e) => updateLayoutConfig({
                      mainContentArea: {
                        ...currentValues.layoutConfig?.mainContentArea,
                        columns: parseInt(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1 columna</option>
                    <option value={2}>2 columnas</option>
                    <option value={3}>3 columnas</option>
                    <option value={4}>4 columnas</option>
                  </select>
                </div>

                {/* Gap entre elementos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Espaciado entre elementos
                  </label>
                  <input
                    type="text"
                    value={currentValues.layoutConfig?.mainContentArea?.gap || '2rem'}
                    onChange={(e) => updateLayoutConfig({
                      mainContentArea: {
                        ...currentValues.layoutConfig?.mainContentArea,
                        gap: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="2rem, 32px, etc."
                  />
                </div>

                {/* Preview del Layout */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Vista Previa del Layout</h4>
                  <div className="bg-gray-100 p-4 rounded">
                    <div 
                      className="flex gap-2 h-32 text-xs"
                      style={{
                        flexDirection: currentValues.layoutConfig?.type === 'sidebar-left' ? 'row' : 
                                     currentValues.layoutConfig?.type === 'sidebar-right' ? 'row-reverse' : 'column'
                      }}
                    >
                      {/* Sidebar */}
                      {(currentValues.layoutConfig?.type === 'sidebar-left' || 
                        currentValues.layoutConfig?.type === 'sidebar-right') && (
                        <div 
                          className="bg-blue-200 rounded flex items-center justify-center"
                          style={{ 
                            width: currentValues.layoutConfig?.sidebarWidth?.includes('%') 
                              ? currentValues.layoutConfig.sidebarWidth 
                              : '80px' 
                          }}
                        >
                          Sidebar
                        </div>
                      )}
                      
                      {/* Área principal */}
                      <div className="flex-1 bg-gray-200 rounded flex items-center justify-center">
                        Contenido Principal
                        {currentValues.layoutConfig?.mainContentArea?.columns && 
                         currentValues.layoutConfig.mainContentArea.columns > 1 && (
                          <span className="ml-1">
                            ({currentValues.layoutConfig.mainContentArea.columns} cols)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Panel de Secciones */}
          {activeTab === 'sections' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Gestión Avanzada de Secciones
              </h3>
              
              <div className="space-y-4">
                {currentValues.sections.map((section, index) => (
                  <div key={section.id} className="bg-gray-50 rounded-lg p-4">
                    {/* Información básica de la sección */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={section.enabled}
                          onChange={(e) => {
                            const newSections = [...currentValues.sections];
                            newSections[index] = { ...section, enabled: e.target.checked };
                            updateConfig({ sections: newSections });
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="font-medium text-gray-900">{section.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500">Orden:</label>
                        <input
                          type="number"
                          value={section.order}
                          onChange={(e) => {
                            const newSections = [...currentValues.sections];
                            newSections[index] = { ...section, order: parseInt(e.target.value) };
                            updateConfig({ sections: newSections });
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          min="1"
                        />
                      </div>
                    </div>

                    {/* Configuraciones avanzadas */}
                    {section.enabled && (
                      <div className="space-y-4 border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Posición */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Posición
                            </label>
                            <select
                              value={section.position || 'main'}
                              onChange={(e) => {
                                const newSections = [...currentValues.sections];
                                newSections[index] = { ...section, position: e.target.value as SectionPosition };
                                updateConfig({ sections: newSections });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              {SECTION_POSITION_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Ancho */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ancho
                            </label>
                            <select
                              value={section.width || 'full'}
                              onChange={(e) => {
                                const newSections = [...currentValues.sections];
                                newSections[index] = { ...section, width: e.target.value as SectionWidth };
                                updateConfig({ sections: newSections });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              {SECTION_WIDTH_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Estilo de visualización */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Estilo
                            </label>
                            <select
                              value={section.display || 'block'}
                              onChange={(e) => {
                                const newSections = [...currentValues.sections];
                                newSections[index] = { ...section, display: e.target.value as SectionDisplay };
                                updateConfig({ sections: newSections });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              {SECTION_DISPLAY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Opciones adicionales */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`sticky-${section.id}`}
                              checked={section.sticky || false}
                              onChange={(e) => {
                                const newSections = [...currentValues.sections];
                                newSections[index] = { ...section, sticky: e.target.checked };
                                updateConfig({ sections: newSections });
                              }}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`sticky-${section.id}`} className="ml-2 text-sm text-gray-700">
                              Sticky
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`sidebar-${section.id}`}
                              checked={section.showInSidebar || false}
                              onChange={(e) => {
                                const newSections = [...currentValues.sections];
                                newSections[index] = { ...section, showInSidebar: e.target.checked };
                                updateConfig({ sections: newSections });
                              }}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`sidebar-${section.id}`} className="ml-2 text-sm text-gray-700">
                              En sidebar
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`mobile-hidden-${section.id}`}
                              checked={section.mobileHidden || false}
                              onChange={(e) => {
                                const newSections = [...currentValues.sections];
                                newSections[index] = { ...section, mobileHidden: e.target.checked };
                                updateConfig({ sections: newSections });
                              }}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`mobile-hidden-${section.id}`} className="ml-2 text-sm text-gray-700">
                              Ocultar en móvil
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`collapsed-${section.id}`}
                              checked={section.collapsed || false}
                              onChange={(e) => {
                                const newSections = [...currentValues.sections];
                                newSections[index] = { ...section, collapsed: e.target.checked };
                                updateConfig({ sections: newSections });
                              }}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`collapsed-${section.id}`} className="ml-2 text-sm text-gray-700">
                              Colapsado
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Panel de Vista Previa */}
          {activeTab === 'preview' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Vista Previa de Configuración
              </h3>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-6">
                <pre className="text-sm whitespace-pre-wrap">
                  <code>{generatePreviewCSS()}</code>
                </pre>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Colores Actuales */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">
                    Paleta de Colores
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(currentValues.colors).map(([key, value]) => {
                      if (typeof value === 'string') {
                        return (
                          <div key={key} className="text-center">
                            <div 
                              className="w-16 h-16 rounded-lg border border-gray-300 mx-auto mb-2"
                              style={{ backgroundColor: value }}
                            />
                            <div className="text-xs font-medium text-gray-700 capitalize">
                              {key}
                            </div>
                            <div className="text-xs text-gray-500">
                              {value}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                {/* Layout Preview */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">
                    Estructura del Layout
                  </h4>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div 
                      className="flex gap-2 h-40 text-xs"
                      style={{
                        flexDirection: currentValues.layoutConfig?.type === 'sidebar-left' ? 'row' : 
                                     currentValues.layoutConfig?.type === 'sidebar-right' ? 'row-reverse' : 'column'
                      }}
                    >
                      {/* Sidebar */}
                      {(currentValues.layoutConfig?.type === 'sidebar-left' || 
                        currentValues.layoutConfig?.type === 'sidebar-right') && (
                        <div className="bg-blue-200 rounded p-2 flex flex-col gap-1" style={{ width: '100px' }}>
                          <div className="text-center font-medium">Sidebar</div>
                          {currentValues.sections
                            .filter(s => s.enabled && s.showInSidebar)
                            .sort((a, b) => a.order - b.order)
                            .map(section => (
                              <div key={section.id} className="bg-blue-300 rounded px-1 py-0.5 text-center">
                                {section.name}
                              </div>
                            ))
                          }
                        </div>
                      )}
                      
                      {/* Área principal */}
                      <div className="flex-1 bg-gray-200 rounded p-2 flex flex-col gap-1">
                        <div className="text-center font-medium">Contenido Principal</div>
                        {currentValues.sections
                          .filter(s => s.enabled && (s.position === 'main' || !s.position))
                          .sort((a, b) => a.order - b.order)
                          .map(section => (
                            <div key={section.id} className="bg-gray-300 rounded px-1 py-0.5 text-center">
                              {section.name}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estadísticas de secciones */}
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Estadísticas de Secciones
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {currentValues.sections.filter(s => s.enabled).length}
                    </div>
                    <div className="text-sm text-green-700">Activas</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentValues.sections.filter(s => s.enabled && s.showInSidebar).length}
                    </div>
                    <div className="text-sm text-blue-700">En Sidebar</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {currentValues.sections.filter(s => s.enabled && s.sticky).length}
                    </div>
                    <div className="text-sm text-purple-700">Sticky</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {currentValues.sections.filter(s => s.enabled && s.mobileHidden).length}
                    </div>
                    <div className="text-sm text-orange-700">Ocultas móvil</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      {hasChanges && (
        <div className="border-t border-gray-200 bg-yellow-50 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <Icons.AlertCircle size={16} />
              Tienes cambios sin guardar
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetToDefaults}
                className="text-sm text-yellow-700 hover:text-yellow-900 underline"
              >
                Descartar cambios
              </button>
              <button
                onClick={handleSave}
                className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
              >
                Guardar ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateCustomizer;
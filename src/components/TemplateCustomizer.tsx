// src/components/TemplateCustomizer.tsx - CON LAYOUT Y SECCIONES
import React, { useState } from 'react';
import { TemplateCustomizerProps, TemplateColors, TemplateTypography, TemplateLayout, TemplateSection } from '../types/template-types';
import { Icons } from './portfolio-icons';

const ColorPicker: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
        placeholder="#000000"
      />
    </div>
  </div>
);

const FontSelector: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => {
  const fonts = [
    { name: 'Inter', value: "'Inter', sans-serif" },
    { name: 'Poppins', value: "'Poppins', sans-serif" },
    { name: 'Roboto', value: "'Roboto', sans-serif" },
    { name: 'SF Pro', value: "'SF Pro Display', sans-serif" },
    { name: 'Helvetica', value: "'Helvetica Neue', sans-serif" },
    { name: 'Georgia', value: "'Georgia', serif" },
    { name: 'Times', value: "'Times New Roman', serif" },
    { name: 'Courier', value: "'Courier New', monospace" }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        {fonts.map((font) => (
          <option key={font.value} value={font.value}>
            {font.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const SliderControl: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}> = ({ label, value, onChange, min, max, step, unit }) => {
  // Extraer valor numérico del string CSS
  const numericValue = parseFloat(value) || 0;
  
  const handleChange = (newValue: number) => {
    onChange(`${newValue}${unit}`);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-sm text-gray-500">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={numericValue}
        onChange={(e) => handleChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );
};

const SectionToggle: React.FC<{
  section: TemplateSection;
  onToggle: (sectionId: string, enabled: boolean) => void;
  onOrderChange: (sectionId: string, order: number) => void;
}> = ({ section, onToggle, onOrderChange }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
    <div className="flex items-center gap-3">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={section.enabled}
          onChange={(e) => onToggle(section.id, e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>
      <div>
        <h4 className="font-medium text-gray-900">{section.name}</h4>
        <p className="text-sm text-gray-500">
          {section.enabled ? 'Visible en el portfolio' : 'Oculta en el portfolio'}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-500">Orden:</label>
      <input
        type="number"
        min="1"
        max="10"
        value={section.order}
        onChange={(e) => onOrderChange(section.id, parseInt(e.target.value))}
        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
        disabled={!section.enabled}
      />
    </div>
  </div>
);

export const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  template,
  config,
  onConfigChange,
  onSave,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'sections'>('colors');

  // Obtener valores actuales con fallbacks
  const currentColors: TemplateColors = {
    ...template.colors,
    ...config.customizations.colors
  };

  const currentTypography: TemplateTypography = {
    ...template.typography,
    ...config.customizations.typography
  };

  const currentLayout: TemplateLayout = {
    ...template.layout,
    ...config.customizations.layout
  };

  const currentSections: TemplateSection[] = 
    config.customizations.sections || template.sections;

  // Handlers para actualizar configuración
  const updateColors = (newColors: Partial<TemplateColors>) => {
    onConfigChange({
      ...config,
      customizations: {
        ...config.customizations,
        colors: {
          ...config.customizations.colors,
          ...newColors
        }
      }
    });
  };

  const updateTypography = (newTypography: Partial<TemplateTypography>) => {
    onConfigChange({
      ...config,
      customizations: {
        ...config.customizations,
        typography: {
          ...config.customizations.typography,
          ...newTypography
        }
      }
    });
  };

  const updateLayout = (newLayout: Partial<TemplateLayout>) => {
    onConfigChange({
      ...config,
      customizations: {
        ...config.customizations,
        layout: {
          ...config.customizations.layout,
          ...newLayout
        }
      }
    });
  };

  const updateSections = (newSections: TemplateSection[]) => {
    onConfigChange({
      ...config,
      customizations: {
        ...config.customizations,
        sections: newSections
      }
    });
  };

  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    const updatedSections = currentSections.map(section =>
      section.id === sectionId ? { ...section, enabled } : section
    );
    updateSections(updatedSections);
  };

  const handleSectionOrderChange = (sectionId: string, order: number) => {
    const updatedSections = currentSections.map(section =>
      section.id === sectionId ? { ...section, order } : section
    );
    updateSections(updatedSections);
  };

  const tabs = [
    { id: 'colors' as const, label: 'Colores', icon: Icons.Settings },
    { id: 'typography' as const, label: 'Tipografía', icon: Icons.User },
    { id: 'layout' as const, label: 'Layout', icon: Icons.Code },
    { id: 'sections' as const, label: 'Secciones', icon: Icons.Award }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Personalizar Plantilla: {template.name}
              </h1>
              <p className="text-gray-600">
                Ajusta colores, tipografía, layout y secciones según tus preferencias
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={onSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de configuración */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'colors' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Configuración de Colores</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorPicker
                    label="Color Primario"
                    value={currentColors.primary}
                    onChange={(value) => updateColors({ primary: value })}
                  />
                  <ColorPicker
                    label="Color Secundario"
                    value={currentColors.secondary}
                    onChange={(value) => updateColors({ secondary: value })}
                  />
                  <ColorPicker
                    label="Color de Acento"
                    value={currentColors.accent}
                    onChange={(value) => updateColors({ accent: value })}
                  />
                  <ColorPicker
                    label="Fondo"
                    value={currentColors.background}
                    onChange={(value) => updateColors({ background: value })}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Colores de Texto</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ColorPicker
                      label="Texto Principal"
                      value={currentColors.text.primary}
                      onChange={(value) => updateColors({ 
                        text: { ...currentColors.text, primary: value }
                      })}
                    />
                    <ColorPicker
                      label="Texto Secundario"
                      value={currentColors.text.secondary}
                      onChange={(value) => updateColors({ 
                        text: { ...currentColors.text, secondary: value }
                      })}
                    />
                  </div>
                </div>

                {currentColors.gradient && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Gradiente</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ColorPicker
                        label="Color Inicial"
                        value={currentColors.gradient.from}
                        onChange={(value) => updateColors({ 
                          gradient: { ...currentColors.gradient!, from: value }
                        })}
                      />
                      <ColorPicker
                        label="Color Final"
                        value={currentColors.gradient.to}
                        onChange={(value) => updateColors({ 
                          gradient: { ...currentColors.gradient!, to: value }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Configuración de Tipografía</h3>
                
                <div className="space-y-4">
                  <FontSelector
                    label="Fuente Principal"
                    value={currentTypography.fontFamily.primary}
                    onChange={(value) => updateTypography({
                      fontFamily: { ...currentTypography.fontFamily, primary: value }
                    })}
                  />
                  <FontSelector
                    label="Fuente de Títulos"
                    value={currentTypography.fontFamily.heading}
                    onChange={(value) => updateTypography({
                      fontFamily: { ...currentTypography.fontFamily, heading: value }
                    })}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Tamaños de Fuente</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(currentTypography.fontSize).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {key}
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateTypography({
                            fontSize: { ...currentTypography.fontSize, [key]: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Configuración de Layout</h3>
                
                <div className="space-y-6">
                  {/* Ancho máximo */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Ancho máximo del contenido
                    </label>
                    <select
                      value={currentLayout.maxWidth}
                      onChange={(e) => updateLayout({ maxWidth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="800px">Estrecho (800px)</option>
                      <option value="1000px">Medio (1000px)</option>
                      <option value="1200px">Amplio (1200px)</option>
                      <option value="1400px">Muy amplio (1400px)</option>
                      <option value="100%">Pantalla completa</option>
                    </select>
                  </div>

                  {/* Espaciado */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Espaciado</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <SliderControl
                        label="Espaciado Pequeño (xs)"
                        value={currentLayout.spacing.xs}
                        onChange={(value) => updateLayout({
                          spacing: { ...currentLayout.spacing, xs: value }
                        })}
                        min={0.25}
                        max={2}
                        step={0.25}
                        unit="rem"
                      />
                      <SliderControl
                        label="Espaciado Mediano (md)"
                        value={currentLayout.spacing.md}
                        onChange={(value) => updateLayout({
                          spacing: { ...currentLayout.spacing, md: value }
                        })}
                        min={1}
                        max={5}
                        step={0.5}
                        unit="rem"
                      />
                      <SliderControl
                        label="Espaciado Grande (xl)"
                        value={currentLayout.spacing.xl}
                        onChange={(value) => updateLayout({
                          spacing: { ...currentLayout.spacing, xl: value }
                        })}
                        min={2}
                        max={8}
                        step={0.5}
                        unit="rem"
                      />
                    </div>
                  </div>

                  {/* Bordes redondeados */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Bordes Redondeados</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <SliderControl
                        label="Pequeño"
                        value={currentLayout.borderRadius.sm}
                        onChange={(value) => updateLayout({
                          borderRadius: { ...currentLayout.borderRadius, sm: value }
                        })}
                        min={0}
                        max={1}
                        step={0.125}
                        unit="rem"
                      />
                      <SliderControl
                        label="Grande"
                        value={currentLayout.borderRadius.lg}
                        onChange={(value) => updateLayout({
                          borderRadius: { ...currentLayout.borderRadius, lg: value }
                        })}
                        min={0.5}
                        max={2}
                        step={0.125}
                        unit="rem"
                      />
                    </div>
                  </div>

                  {/* Sombras */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Intensidad de Sombras</h4>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Estilo de sombras
                      </label>
                      <select
                        value={currentLayout.shadows.md.includes('rgb(0 0 0 / 0.1)') ? 'subtle' : 
                               currentLayout.shadows.md.includes('rgb(0 0 0 / 0.2)') ? 'medium' : 'strong'}
                        onChange={(e) => {
                          const shadowStyles = {
                            subtle: {
                              sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                              md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                              lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                              xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                            },
                            medium: {
                              sm: '0 2px 4px 0 rgb(0 0 0 / 0.1)',
                              md: '0 6px 12px -2px rgb(0 0 0 / 0.2)',
                              lg: '0 15px 25px -5px rgb(0 0 0 / 0.2)',
                              xl: '0 25px 35px -8px rgb(0 0 0 / 0.2)'
                            },
                            strong: {
                              sm: '0 3px 6px 0 rgb(0 0 0 / 0.15)',
                              md: '0 8px 16px -4px rgb(0 0 0 / 0.3)',
                              lg: '0 20px 30px -8px rgb(0 0 0 / 0.3)',
                              xl: '0 30px 45px -12px rgb(0 0 0 / 0.3)'
                            }
                          };
                          updateLayout({ shadows: shadowStyles[e.target.value as keyof typeof shadowStyles] });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="subtle">Sutil</option>
                        <option value="medium">Medio</option>
                        <option value="strong">Fuerte</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sections' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Configuración de Secciones</h3>
                <p className="text-gray-600">
                  Activa o desactiva secciones y ajusta su orden de aparición
                </p>
                
                <div className="space-y-4">
                  {currentSections
                    .sort((a, b) => a.order - b.order)
                    .map((section) => (
                      <SectionToggle
                        key={section.id}
                        section={section}
                        onToggle={handleSectionToggle}
                        onOrderChange={handleSectionOrderChange}
                      />
                    ))}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Configuración Avanzada</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        const resetSections = template.sections.map(section => ({ ...section }));
                        updateSections(resetSections);
                      }}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200"
                    >
                      Restaurar secciones por defecto
                    </button>
                    <div className="text-sm text-gray-500">
                      Las secciones desactivadas no aparecerán en tu portfolio final
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Vista Previa</h3>
            
            <div className="border rounded-lg overflow-hidden">
              {/* Header preview */}
              <div 
                className="p-8 text-white"
                style={{
                  background: currentColors.gradient 
                    ? `linear-gradient(${currentColors.gradient.direction || '135deg'}, ${currentColors.gradient.from}, ${currentColors.gradient.to})`
                    : currentColors.primary,
                  marginBottom: currentLayout.spacing.md
                }}
              >
                <h1 
                  className="font-bold mb-2"
                  style={{ 
                    fontFamily: currentTypography.fontFamily.heading,
                    fontSize: currentTypography.fontSize['3xl']
                  }}
                >
                  Tu Nombre
                </h1>
                <p 
                  className="opacity-90"
                  style={{ 
                    fontFamily: currentTypography.fontFamily.primary,
                    fontSize: currentTypography.fontSize.lg
                  }}
                >
                  Tu Título Profesional
                </p>
              </div>

              {/* Sections preview */}
              <div 
                className="p-6 space-y-6"
                style={{ 
                  backgroundColor: currentColors.surface,
                  maxWidth: currentLayout.maxWidth,
                  margin: '0 auto'
                }}
              >
                {currentSections
                  .filter(section => section.enabled)
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <div 
                      key={section.id}
                      className="rounded-lg p-4"
                      style={{ 
                        marginBottom: currentLayout.spacing.md,
                        borderRadius: currentLayout.borderRadius.md,
                        boxShadow: currentLayout.shadows.sm
                      }}
                    >
                      <h2 
                        className="font-semibold mb-2"
                        style={{ 
                          color: currentColors.text.primary,
                          fontFamily: currentTypography.fontFamily.heading,
                          fontSize: currentTypography.fontSize.xl
                        }}
                      >
                        {section.name}
                      </h2>
                      <p 
                        style={{ 
                          color: currentColors.text.secondary,
                          fontFamily: currentTypography.fontFamily.primary,
                          fontSize: currentTypography.fontSize.base
                        }}
                      >
                        Contenido de la sección {section.name}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Reset button */}
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => onConfigChange({
                  templateId: template.id,
                  customizations: {}
                })}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Restaurar todos los valores por defecto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
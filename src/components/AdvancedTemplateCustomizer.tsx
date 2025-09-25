import React, { useState, useCallback, useMemo } from 'react';
import {
  AdvancedTemplate,
  AdvancedTemplateConfig,
  Section,
  LayoutArea,
  TemplateLayoutStructure,
  TemplateLayoutStructurePatch,
} from '../types/advanced-template-types';
import { AdvancedLayoutBuilder } from './AdvancedLayoutBuilder';
import { Icons } from './portfolio-icons';

interface Props {
  template: AdvancedTemplate;
  config: AdvancedTemplateConfig;
  onConfigChange: (config: AdvancedTemplateConfig) => void;
  onPreview: () => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
}

type CustomizerTab = 'layout' | 'colors' | 'typography' | 'sections' | 'advanced';

const AREA_KEYS: LayoutArea[] = ['header','sidebar-left','sidebar-right','main','footer','floating'];

// merge local sólo para previsualizar dentro del customizer
function mergeLayoutStructure(
  base: TemplateLayoutStructure,
  custom?: TemplateLayoutStructurePatch
): TemplateLayoutStructure {
  const baseAreas = (base.areas ?? {}) as Required<TemplateLayoutStructure>['areas'];
  const mergedAreas = AREA_KEYS.reduce((acc, key) => {
    acc[key] = { ...baseAreas[key], ...(custom?.areas?.[key] ?? {}) };
    return acc;
  }, {} as Required<TemplateLayoutStructure>['areas']);

  const baseResp = base.responsive ?? { mobile: 'stack', tablet: 'full' as const };
  const responsive = custom?.responsive
    ? {
        mobile: custom.responsive.mobile ?? baseResp.mobile,
        tablet: custom.responsive.tablet ?? baseResp.tablet,
      }
    : baseResp;

  return {
    ...base,
    type: custom?.type ?? base.type,
    areas: mergedAreas,
    responsive,
  };
}

// ColorPicker
const ColorPicker: React.FC<{
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}> = ({ label, value, onChange, presets }) => {
  const [showPresets, setShowPresets] = useState(false);
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded border border-gray-300 cursor-pointer" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500" placeholder="#000000" />
        {presets && (
          <button onClick={() => setShowPresets(!showPresets)} className="p-1 text-gray-400 hover:text-gray-600">
            <Icons.ChevronDown size={14} />
          </button>
        )}
      </div>
      {showPresets && presets && (
        <div className="grid grid-cols-6 gap-1 p-2 border rounded bg-gray-50">
          {presets.map((preset) => (
            <button key={preset} onClick={() => onChange(preset)} className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform" style={{ backgroundColor: preset }} title={preset} />
          ))}
        </div>
      )}
    </div>
  );
};

// TypographyControls
const TypographyControls: React.FC<{
  typography: any;
  onChange: (typography: any) => void;
}> = ({ typography, onChange }) => {
  const fontFamilies = [
    { name: 'Inter', value: "'Inter', sans-serif" },
    { name: 'Roboto', value: "'Roboto', sans-serif" },
    { name: 'Poppins', value: "'Poppins', sans-serif" },
    { name: 'Playfair Display', value: "'Playfair Display', serif" },
    { name: 'Merriweather', value: "'Merriweather', serif" },
    { name: 'Source Code Pro', value: "'Source Code Pro', monospace" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fuente Principal</label>
          <select
            value={typography.fontFamilies?.primary || ''}
            onChange={(e) => onChange({ ...typography, fontFamilies: { ...typography.fontFamilies, primary: e.target.value } })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            {fontFamilies.map((font) => <option key={font.value} value={font.value}>{font.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fuente de Títulos</label>
          <select
            value={typography.fontFamilies?.heading || ''}
            onChange={(e) => onChange({ ...typography, fontFamilies: { ...typography.fontFamilies, heading: e.target.value } })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            {fontFamilies.map((font) => <option key={font.value} value={font.value}>{font.name}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Tamaños de Fuente</h4>
        <div className="grid grid-cols-3 gap-3">
          {['sm', 'base', 'lg', 'xl', '2xl', '3xl'].map((size) => (
            <div key={size}>
              <label className="block text-xs text-gray-600 mb-1">{size}</label>
              <input
                type="text"
                value={typography.fontSizes?.[size] || ''}
                onChange={(e) => onChange({ ...typography, fontSizes: { ...typography.fontSizes, [size]: e.target.value } })}
                className="w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500"
                placeholder="1rem"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdvancedTemplateCustomizer: React.FC<Props> = ({
  template,
  config,
  onConfigChange,
  onPreview,
  onSave,
  onCancel,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<CustomizerTab>('layout');
  const [hasChanges, setHasChanges] = useState(false);

  const currentConfig = useMemo(() => ({
    ...config,
    customizations: {
      ...config.customizations,
      colors: { ...template.colors, ...config.customizations.colors },
      typography: { ...template.typography, ...config.customizations.typography },
      sections: config.customizations.sections || template.sections,
    }
  }), [config, template]);

  const updateConfig = useCallback((updates: Partial<AdvancedTemplateConfig['customizations']>) => {
    const newConfig: AdvancedTemplateConfig = {
      ...currentConfig,
      customizations: {
        ...currentConfig.customizations,
        ...updates,
      },
      lastModified: new Date().toISOString(),
    };
    onConfigChange(newConfig);
    setHasChanges(true);
  }, [currentConfig, onConfigChange]);

  const updateColors = useCallback((colorUpdates: any) => {
    updateConfig({ colors: { ...currentConfig.customizations.colors, ...colorUpdates } });
  }, [currentConfig.customizations.colors, updateConfig]);

  const updateSections = useCallback((sections: Section[]) => {
    updateConfig({ sections });
  }, [updateConfig]);

  // Estructura efectiva para el tab "layout"
  const effectiveLayoutStructure: TemplateLayoutStructure = useMemo(() => {
    return mergeLayoutStructure(template.layoutStructure, currentConfig.customizations.layoutStructure);
  }, [template.layoutStructure, currentConfig.customizations.layoutStructure]);

  const colorPresets = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#84CC16', '#6B7280'];

  const tabs: Array<{ id: CustomizerTab; label: string; icon: React.ComponentType<{ size?: number }> }> = [
    { id: 'layout', label: 'Layout', icon: Icons.Code },
    { id: 'colors', label: 'Colores', icon: Icons.Palette },
    { id: 'typography', label: 'Tipografía', icon: Icons.Type },
    { id: 'sections', label: 'Secciones', icon: Icons.Settings },
    { id: 'advanced', label: 'Avanzado', icon: Icons.Advanced },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'layout':
        return (
          <AdvancedLayoutBuilder
            template={{ ...template, layoutStructure: effectiveLayoutStructure }}
            sections={currentConfig.customizations.sections || []}
            onSectionsChange={updateSections}
            onLayoutChange={(structure) => updateConfig({ layoutStructure: structure as TemplateLayoutStructurePatch })}
          />
        );

      case 'colors':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">Colores Principales</h3>
                <ColorPicker label="Primario" value={currentConfig.customizations.colors?.primary || template.colors.primary} onChange={(c) => updateColors({ primary: c })} presets={colorPresets} />
                <ColorPicker label="Secundario" value={currentConfig.customizations.colors?.secondary || template.colors.secondary} onChange={(c) => updateColors({ secondary: c })} presets={colorPresets} />
                <ColorPicker label="Acento" value={currentConfig.customizations.colors?.accent || template.colors.accent} onChange={(c) => updateColors({ accent: c })} presets={colorPresets} />
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">Superficies</h3>
                <ColorPicker label="Fondo" value={currentConfig.customizations.colors?.background || template.colors.background} onChange={(c) => updateColors({ background: c })} />
                <ColorPicker label="Superficie" value={currentConfig.customizations.colors?.surface || template.colors.surface} onChange={(c) => updateColors({ surface: c })} />
                <ColorPicker label="Superficie Variante" value={currentConfig.customizations.colors?.surfaceVariant || template.colors.surfaceVariant} onChange={(c) => updateColors({ surfaceVariant: c })} />
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">Texto</h3>
                <ColorPicker label="Texto Principal" value={currentConfig.customizations.colors?.text?.primary || template.colors.text.primary}
                  onChange={(c) => updateColors({ text: { ...currentConfig.customizations.colors?.text, primary: c } })} />
                <ColorPicker label="Texto Secundario" value={currentConfig.customizations.colors?.text?.secondary || template.colors.text.secondary}
                  onChange={(c) => updateColors({ text: { ...currentConfig.customizations.colors?.text, secondary: c } })} />
                <ColorPicker label="Texto de Acento" value={currentConfig.customizations.colors?.text?.accent || template.colors.text.accent}
                  onChange={(c) => updateColors({ text: { ...currentConfig.customizations.colors?.text, accent: c } })} />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-800 mb-4">Gradientes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Gradiente Primario</h4>
                  <div className="flex gap-2">
                    <ColorPicker label="Desde" value={currentConfig.customizations.colors?.gradients?.primary?.from || ''}
                      onChange={(c) => updateColors({ gradients: { ...currentConfig.customizations.colors?.gradients, primary: { ...currentConfig.customizations.colors?.gradients?.primary, from: c } } })} />
                    <ColorPicker label="Hacia" value={currentConfig.customizations.colors?.gradients?.primary?.to || ''}
                      onChange={(c) => updateColors({ gradients: { ...currentConfig.customizations.colors?.gradients, primary: { ...currentConfig.customizations.colors?.gradients?.primary, to: c } } })} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'typography':
        return (
          <TypographyControls
            typography={currentConfig.customizations.typography || template.typography}
            onChange={(typography) => updateConfig({ typography })}
          />
        );

      case 'sections':
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Configuración de Secciones</h3>
            <div className="space-y-3">
              {(currentConfig.customizations.sections || template.sections).map((section) => (
                <div key={section.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{section.icon}</span>
                      <span className="font-medium">{section.name}</span>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={section.enabled}
                        onChange={(e) => {
                          const updated = (currentConfig.customizations.sections || template.sections).map(s =>
                            s.id === section.id ? { ...s, enabled: e.target.checked } : s
                          );
                          updateSections(updated);
                        }}
                      />
                      <span className="text-sm">Visible</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Variante</label>
                      <select
                        value={section.config.variant || 'default'}
                        onChange={(e) => {
                          const updated = (currentConfig.customizations.sections || template.sections).map(s =>
                            s.id === section.id ? { ...s, config: { ...s.config, variant: e.target.value as any } } : s
                          );
                          updateSections(updated);
                        }}
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option value="default">Por Defecto</option>
                        <option value="compact">Compacta</option>
                        <option value="expanded">Expandida</option>
                        <option value="minimal">Mínimal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Columnas</label>
                      <select
                        value={section.config.columns || 1}
                        onChange={(e) => {
                          const updated = (currentConfig.customizations.sections || template.sections).map(s =>
                            s.id === section.id ? { ...s, config: { ...s.config, columns: Number(e.target.value) as any } } : s
                          );
                          updateSections(updated);
                        }}
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Configuración Avanzada</h3>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Animaciones</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentConfig.customizations.animations?.enabled || false}
                      onChange={(e) => updateConfig({ animations: { ...currentConfig.customizations.animations, enabled: e.target.checked } })}
                    />
                    <span className="text-sm">Habilitar animaciones</span>
                  </label>

                  {currentConfig.customizations.animations?.enabled && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de animación</label>
                      <select
                        value={currentConfig.customizations.animations?.type || 'subtle'}
                        onChange={(e) => updateConfig({ animations: { ...currentConfig.customizations.animations, enabled: true, type: e.target.value as any } })}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="none">Sin animaciones</option>
                        <option value="subtle">Sutiles</option>
                        <option value="smooth">Suaves</option>
                        <option value="dynamic">Dinámicas</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Modo Oscuro</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentConfig.customizations.darkMode?.enabled || false}
                      onChange={(e) => updateConfig({ darkMode: { ...currentConfig.customizations.darkMode, enabled: e.target.checked, auto: currentConfig.customizations.darkMode?.auto || false } })}
                    />
                    <span className="text-sm">Soportar modo oscuro</span>
                  </label>

                  {currentConfig.customizations.darkMode?.enabled && (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={currentConfig.customizations.darkMode?.auto || false}
                        onChange={(e) => updateConfig({ darkMode: { ...currentConfig.customizations.darkMode, enabled: true, auto: e.target.checked } })}
                      />
                      <span className="text-sm">Detección automática</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">CSS Personalizado</h4>
                <textarea
                  value={currentConfig.customizations.customCSS || ''}
                  onChange={(e) => updateConfig({ customCSS: e.target.value })}
                  placeholder="/* Agrega tu CSS personalizado aquí */"
                  rows={8}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
                <Icons.ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Personalizar {template.name}</h1>
                <p className="text-sm text-gray-600">{hasChanges ? '• Cambios sin guardar' : 'Configuración actual'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={onReset} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Resetear</button>
              <button onClick={onPreview} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2">
                <Icons.Eye size={16} /> Vista Previa
              </button>
              <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Icons.Check size={16} /> Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border p-2 sticky top-24">
              <nav className="space-y-1">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === t.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <t.icon size={18} />
                    {t.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-lg border p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdvancedTemplateCustomizer;

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  AdvancedTemplate,
  AdvancedTemplateColors,
  AdvancedTemplateConfig,
  Section,
  LayoutArea,
  UseAdvancedTemplatesReturn,
  TemplateLayoutStructure,
  TemplateLayoutStructurePatch,
} from '../types/advanced-template-types';
import { ADVANCED_BUILT_IN_TEMPLATES } from '../templates/advanced';

const DEFAULT_COMPACT_SPACING = {
  xs: "0.17rem",
  sm: "0.34rem",
  md: "0.5rem",
  lg: "0.67rem",
  xl: "1rem",
  "2xl": "1.34rem",
};

// ---------- helpers ----------
function mergeAnimations(
  base: NonNullable<AdvancedTemplate['animations']> | undefined,
  custom?: Partial<NonNullable<AdvancedTemplate['animations']>>
): NonNullable<AdvancedTemplate['animations']> {
  const b = base ?? { enabled: false, type: 'none' as const };
  return {
    enabled: custom?.enabled ?? b.enabled ?? false,
    type: (custom?.type ?? b.type ?? 'none') as 'none' | 'subtle' | 'smooth' | 'dynamic',
  };
}

function mergeDarkMode(
  base: NonNullable<AdvancedTemplate['darkMode']> | undefined,
  custom?: Partial<NonNullable<AdvancedTemplate['darkMode']>>
): NonNullable<AdvancedTemplate['darkMode']> {
  const b = base ?? { enabled: false, auto: false };
  return {
    enabled: custom?.enabled ?? b.enabled ?? false,
    auto: custom?.auto ?? b.auto ?? false,
  };
}

function mergeLayoutStructures(
  base: TemplateLayoutStructure,
  patch?: TemplateLayoutStructurePatch
): TemplateLayoutStructure {
  if (!patch) return base;

  // Áreas: asumimos built-in completas
  const baseAreas = (base.areas ?? {}) as Required<TemplateLayoutStructure>['areas'];
  const mergedAreas: Required<TemplateLayoutStructure>['areas'] = { ...baseAreas };

  if (patch.areas) {
    const AREA_KEYS = ['header', 'sidebar-left', 'sidebar-right', 'main', 'footer', 'floating'] as const;
    for (const key of AREA_KEYS) {
      const areaPatch = patch.areas[key];
      if (areaPatch) mergedAreas[key] = { ...baseAreas[key], ...areaPatch };
    }
  }

  // responsive seguro
  const baseResp = base.responsive ?? { mobile: 'stack', tablet: 'full' as const };
  const responsive = patch.responsive
    ? {
        mobile: patch.responsive.mobile ?? baseResp.mobile,
        tablet: patch.responsive.tablet ?? baseResp.tablet,
      }
    : baseResp;

  return {
    type: patch.type ?? base.type,
    areas: mergedAreas,
    responsive,
  };
}

function safeSections(sections?: Section[], fallback: Section[] = []) {
  return (sections ?? fallback).slice().sort((a, b) => a.order - b.order);
}




// ---------- Hook principal ----------
export const useAdvancedTemplates = (
  storageKey = 'advanced-templates-config'
): UseAdvancedTemplatesReturn => {
  const [templates, setTemplates] = useState<AdvancedTemplate[]>(ADVANCED_BUILT_IN_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<AdvancedTemplate | null>(null);
  const [config, setConfig] = useState<AdvancedTemplateConfig | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const t = templates.find(tt => tt.id === parsed.templateId);
        if (t) {
          setSelectedTemplate(t);
          setConfig(parsed);
        }
      } else {
        if (templates.length > 0) selectTemplate(templates[0]);
      }
    } catch {
      if (templates.length > 0) selectTemplate(templates[0]);
    }
    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates]);

  const saveConfig = useCallback((newConfig: AdvancedTemplateConfig) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newConfig));
      setHasUnsavedChanges(false);
    } catch {/* noop */}
  }, [storageKey]);

const selectTemplate = useCallback((template: AdvancedTemplate) => {
  const newConfig: AdvancedTemplateConfig = {
    templateId: template.id,
    customizations: { 
      sections: template.sections,
      // ✅ APLICAR SPACING POR DEFECTO EN MODO COMPACTO
      layout: {
        spacing: DEFAULT_COMPACT_SPACING
      }
    },
    lastModified: new Date().toISOString(),
  };
  setSelectedTemplate(template);
  setConfig(newConfig);
  saveConfig(newConfig);
  setHasUnsavedChanges(false);
}, [saveConfig]);

  const updateConfig = useCallback((updates: Partial<AdvancedTemplateConfig>) => {
    console.log('💾 Hook updateConfig - updates:', updates);
  console.log('💾 Hook updateConfig - config actual:', config);
    if (!config) return;

  const newConfig: AdvancedTemplateConfig = {
    ...config,
    ...updates,
    customizations: {
      colors: {
        ...(config.customizations.colors || {}),
        ...(updates.customizations?.colors || {})
      },
      typography: {
        ...(config.customizations.typography || {}),
        ...(updates.customizations?.typography || {})
      },
      layout: {
        ...(config.customizations.layout || {}),
        ...(updates.customizations?.layout || {})
      },
      sections: updates.customizations?.sections || config.customizations.sections,
      layoutStructure: {
        ...(config.customizations.layoutStructure || {}),
        ...(updates.customizations?.layoutStructure || {})
      },
      animations: updates.customizations?.animations 
        ? {
            enabled: updates.customizations.animations.enabled ?? config.customizations.animations?.enabled ?? false,
            type: updates.customizations.animations.type ?? config.customizations.animations?.type ?? 'none'
          }
        : config.customizations.animations,
      darkMode: updates.customizations?.darkMode 
        ? {
            enabled: updates.customizations.darkMode.enabled ?? config.customizations.darkMode?.enabled ?? false,
            auto: updates.customizations.darkMode.auto ?? config.customizations.darkMode?.auto
          }
        : config.customizations.darkMode,
      headerConfig: {
        ...(config.customizations.headerConfig || {}),
        ...(updates.customizations?.headerConfig || {})
      },
      customCSS: updates.customizations?.customCSS ?? config.customizations.customCSS
    },
    lastModified: new Date().toISOString(),
  };

  setConfig(newConfig);
  setHasUnsavedChanges(true);
  saveConfig(newConfig);
}, [config, saveConfig]);

  const resetConfig = useCallback(() => {
    if (!selectedTemplate) return;
    selectTemplate(selectedTemplate);
  }, [selectedTemplate, selectTemplate]);

  // Secciones
  const updateSections = useCallback((sections: Section[]) => {
    updateConfig({ customizations: { sections } });
  }, [updateConfig]);

  const moveSectionToArea = useCallback((sectionId: string, targetArea: LayoutArea, targetIndex = -1) => {
    if (!config?.customizations.sections) return;
    const sections = [...config.customizations.sections];
    const idx = sections.findIndex(s => s.id === sectionId);
    if (idx === -1) return;

    const section = sections[idx];
    const inTarget = sections.filter(s => s.area === targetArea && s.id !== sectionId);
    const newOrder = targetIndex >= 0 && targetIndex < inTarget.length
      ? inTarget[targetIndex].order
      : (inTarget.length > 0 ? Math.max(...inTarget.map(s => s.order)) + 1 : 1);

    sections[idx] = { ...section, area: targetArea, order: newOrder };
    updateSections(sections);
  }, [config, updateSections]);

  const toggleSection = useCallback((sectionId: string, enabled: boolean) => {
    if (!config?.customizations.sections) return;
    const updated = config.customizations.sections.map(s => s.id === sectionId ? { ...s, enabled } : s);
    updateSections(updated);
  }, [config, updateSections]);

  const updateSectionConfig = useCallback((sectionId: string, sectionConfig: Partial<Section['config']>) => {
    if (!config?.customizations.sections) return;
    const updated = config.customizations.sections.map(s => s.id === sectionId ? { ...s, config: { ...s.config, ...sectionConfig } } : s);
    updateSections(updated);
  }, [config, updateSections]);

  // Layout
  const updateLayoutStructure = useCallback((structure: TemplateLayoutStructurePatch) => {
    updateConfig({
      customizations: {
        layoutStructure: {
          ...config?.customizations.layoutStructure,
          ...structure,
        }
      }
    });
  }, [config, updateConfig]);

  const toggleLayoutArea = useCallback((area: LayoutArea, enabled: boolean) => {
    if (!selectedTemplate) return;

    const current = config?.customizations.layoutStructure || {};
    updateLayoutStructure({
      areas: {
        ...(current.areas || {}),
        [area]: { ...(current.areas?.[area] || {}), enabled }
      }
    });
  }, [selectedTemplate, config, updateLayoutStructure]);

  // Template efectivo
  const effectiveTemplate: AdvancedTemplate | null = useMemo(() => {
    if (!selectedTemplate) return null;
    const c = config?.customizations ?? {};
    return {
      ...selectedTemplate,
      colors: { ...selectedTemplate.colors, ...(c.colors || {}) },
      typography: { ...selectedTemplate.typography, ...(c.typography || {}) },
      layout: { ...selectedTemplate.layout, ...(c.layout || {}) },
      sections: safeSections(c.sections, selectedTemplate.sections),
      layoutStructure: mergeLayoutStructures(selectedTemplate.layoutStructure, c.layoutStructure),
      animations: mergeAnimations(selectedTemplate.animations, c.animations),
      darkMode: mergeDarkMode(selectedTemplate.darkMode, c.darkMode),
      customCSS: c.customCSS ?? selectedTemplate.customCSS,
    };
  }, [selectedTemplate, config]);

  // Preview (placeholder)
  const previewTemplate = useCallback((): string => {
    if (!selectedTemplate || !config) return '';
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preview - ${selectedTemplate.name}</title>
          <style>
            :root {
              --primary: ${config.customizations.colors?.primary || selectedTemplate.colors.primary};
              --secondary: ${config.customizations.colors?.secondary || selectedTemplate.colors.secondary};
              --accent: ${config.customizations.colors?.accent || selectedTemplate.colors.accent};
              --background: ${config.customizations.colors?.background || selectedTemplate.colors.background};
              --surface: ${config.customizations.colors?.surface || selectedTemplate.colors.surface};
            }
            body {
              font-family: ${config.customizations.typography?.fontFamily?.primary || selectedTemplate.typography.fontFamily.primary};
              background: var(--background);
              color: ${config.customizations.colors?.text?.primary || selectedTemplate.colors.text.primary};
              margin: 0; padding: 0;
            }
            .container { max-width: ${config.customizations.layout?.maxWidth || selectedTemplate.layout.maxWidth}; margin: 0 auto; padding: 2rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Vista Previa de ${selectedTemplate.name}</h1>
            <p>Esta es una vista previa generada automáticamente.</p>
          </div>
        </body>
      </html>
    `;
  }, [selectedTemplate, config]);

  // Export / Import / Duplicado
  const exportConfig = useCallback((): string => {
    if (!config) return '';
    const exportData = {
      ...config,
      exportedAt: new Date().toISOString(),
      templateInfo: selectedTemplate ? { id: selectedTemplate.id, name: selectedTemplate.name, version: selectedTemplate.version } : null
    };
    return JSON.stringify(exportData, null, 2);
  }, [config, selectedTemplate]);

  const importConfig = useCallback((data: string): boolean => {
    try {
      const imported = JSON.parse(data);
      if (!imported.templateId || !imported.customizations) throw new Error('Formato de configuración inválido');
      const t = templates.find(tt => tt.id === imported.templateId);
      if (!t) throw new Error(`Plantilla "${imported.templateId}" no encontrada`);
      setSelectedTemplate(t);
      setConfig({ ...imported, lastModified: new Date().toISOString() });
      setHasUnsavedChanges(true);
      return true;
    } catch (e) {
      console.error('Error importing config:', e);
      return false;
    }
  }, [templates]);

  const duplicateTemplate = useCallback((templateId: string, newName?: string): AdvancedTemplate => {
    const t = templates.find(tt => tt.id === templateId);
    if (!t) throw new Error('Plantilla no encontrada');

    const duplicated: AdvancedTemplate = {
      ...t,
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      name: newName || `${t.name} (Copia)`,
      isBuiltIn: false,
      isPremium: false,
      version: '1.0.0',
      author: 'Usuario',
      customCSS: config?.customizations.customCSS || t.customCSS
    };

    if (config && config.templateId === templateId) {
      duplicated.colors = { ...t.colors, ...config.customizations.colors };
      duplicated.typography = { ...t.typography, ...config.customizations.typography };
      duplicated.layout = { ...t.layout, ...config.customizations.layout };
      duplicated.sections = config.customizations.sections || t.sections;
      duplicated.layoutStructure = mergeLayoutStructures(t.layoutStructure, config.customizations.layoutStructure);
      duplicated.animations = mergeAnimations(t.animations, config.customizations.animations);
      duplicated.darkMode = mergeDarkMode(t.darkMode, config.customizations.darkMode);
    }

    setTemplates(prev => [...prev, duplicated]);
    return duplicated;
  }, [templates, config]);

  // Validación
  const validationErrors = useMemo(() => {
    if (!config || !selectedTemplate) return [];
    const errors: string[] = [];

    const sections = config.customizations.sections || [];
    const enabled = sections.filter(s => s.enabled);
    if (enabled.length === 0) errors.push('Debe haber al menos una sección habilitada');

    const mains = enabled.filter(s => s.area === 'main');
    if (mains.length === 0) errors.push('Debe haber al menos una sección en el área principal');

    const colors = config.customizations.colors;
    if (colors) {
      (['primary', 'background'] as (keyof AdvancedTemplateColors)[]).forEach(key => {
        const v = colors[key];
        if (v && typeof v === 'string' && !v.match(/^#[0-9A-F]{6}$/i)) {
          errors.push(`Color ${key} tiene formato inválido`);
        }
      });
    }

    return errors;
  }, [config, selectedTemplate]);

  return {
    templates,
    selectedTemplate,
    effectiveTemplate,
    config,

    selectTemplate,
    updateConfig,
    resetConfig,

    updateSections,
    moveSectionToArea,
    toggleSection,
    updateSectionConfig,

    updateLayoutStructure,   // <- PATCH
    toggleLayoutArea,

    previewTemplate,
    exportConfig,
    importConfig,
    duplicateTemplate,

    isLoaded,
    hasUnsavedChanges,
    validationErrors,
  };
};
// --- utilidades de tema (inyectar CSS vars en :root) ---
export function applyTemplateToDOM(tpl: AdvancedTemplate | null) {
  if (!tpl) return;

  const root = document.documentElement;

  // Colores principales / superficies / texto
  root.style.setProperty('--primary', tpl.colors.primary);
  root.style.setProperty('--secondary', tpl.colors.secondary);
  root.style.setProperty('--accent', tpl.colors.accent);
  root.style.setProperty('--background', tpl.colors.background);
  root.style.setProperty('--surface', tpl.colors.surface);
  root.style.setProperty('--surface-variant', tpl.colors.surfaceVariant);

  root.style.setProperty('--text-primary', tpl.colors.text.primary);
  root.style.setProperty('--text-secondary', tpl.colors.text.secondary);
  root.style.setProperty('--text-accent', tpl.colors.text.accent);
  root.style.setProperty('--text-muted', tpl.colors.text.muted);
  root.style.setProperty('--text-inverse', tpl.colors.text.inverse);

  // Estados
  root.style.setProperty('--success', tpl.colors.success);
  root.style.setProperty('--warning', tpl.colors.warning);
  root.style.setProperty('--error', tpl.colors.error);
  root.style.setProperty('--info', tpl.colors.info);

  // Tipografía principal
  const ff = tpl.typography.fontFamily;
  root.style.setProperty('--font-primary', ff.primary);
  root.style.setProperty('--font-heading', ff.heading);
  if (ff.code) root.style.setProperty('--font-mono', ff.code);

  const fs = tpl.typography.fontSize;
  Object.entries(fs).forEach(([k, v]) => root.style.setProperty(`--font-${k}`, v));

  // Layout básicos
  root.style.setProperty('--container-max', tpl.layout.maxWidth);
  Object.entries(tpl.layout.spacing).forEach(([k, v]) => root.style.setProperty(`--space-${k}`, v));

  // (Opcional) modo oscuro flag
  root.classList.toggle('theme-dark', !!tpl.darkMode?.enabled);
}

// Export default del hook por si lo importas como default
export default useAdvancedTemplates;

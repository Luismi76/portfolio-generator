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
  AreaConfigMap,
} from '../types/advanced-template-types';

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

// ---------- datos por defecto ----------
const createDefaultSections = (): Section[] => [
  {
    id: 'hero',
    type: 'hero',
    name: 'Hero/Presentación',
    icon: '🎯',
    enabled: true,
    area: 'header',
    order: 1,
    config: { variant: 'default', showTitle: true, showDivider: false, spacing: 'normal', columns: 1 }
  },
  {
    id: 'about',
    type: 'about',
    name: 'Sobre Mí',
    icon: '👤',
    enabled: true,
    area: 'main',
    order: 1,
    config: { variant: 'default', showTitle: true, showDivider: true, spacing: 'normal', columns: 1 }
  },
  {
    id: 'projects',
    type: 'projects',
    name: 'Proyectos',
    icon: '💼',
    enabled: true,
    area: 'main',
    order: 2,
    config: { variant: 'default', showTitle: true, showDivider: true, spacing: 'normal', columns: 2, maxItems: 6 }
  },
  {
    id: 'skills',
    type: 'skills',
    name: 'Habilidades',
    icon: '⚡',
    enabled: true,
    area: 'sidebar-right',
    order: 1,
    config: { variant: 'compact', showTitle: true, showDivider: false, spacing: 'tight', columns: 1 }
  },
  {
    id: 'experience',
    type: 'experience',
    name: 'Experiencia',
    icon: '🏢',
    enabled: false,
    area: 'main',
    order: 3,
    config: { variant: 'default', showTitle: true, showDivider: true, spacing: 'normal', columns: 1 }
  },
  {
    id: 'contact',
    type: 'contact',
    name: 'Contacto',
    icon: '📧',
    enabled: true,
    area: 'footer',
    order: 1,
    config: { variant: 'minimal', showTitle: false, showDivider: false, spacing: 'tight', columns: 3 }
  },
];

const ADVANCED_BUILT_IN_TEMPLATES: AdvancedTemplate[] = [
  {
    id: 'modern-pro',
    name: 'Modern Pro',
    description: 'Diseño moderno y profesional con layout de tres columnas y animaciones suaves',
    category: 'modern',
    preview: '/templates/modern-pro.jpg',
    colors: {
      primary: '#2563EB',
      secondary: '#3B82F6',
      accent: '#6366F1',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      surfaceVariant: '#F1F5F9',
      text: {
        primary: '#1E293B',
        secondary: '#475569',
        accent: '#2563EB',
        muted: '#94A3B8',
        inverse: '#FFFFFF'
      },
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      gradients: {
        primary: { from: '#2563EB', to: '#3B82F6', direction: '135deg' },
        secondary: { from: '#6366F1', to: '#8B5CF6', direction: '135deg' }
      }
    },
    typography: {
      fontFamilies: {
        primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        monospace: "'JetBrains Mono', 'Fira Code', monospace"
      },
      fontSizes: {
        xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem',
        '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem', '6xl': '3.75rem'
      },
      fontWeights: { thin: 100, light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 },
      lineHeights: { tight: 1.25, snug: 1.375, normal: 1.5, relaxed: 1.625, loose: 2 },
      letterSpacing: { tighter: '-0.05em', tight: '-0.025em', normal: '0em', wide: '0.025em', wider: '0.05em' }
    },
    layout: {
      maxWidth: '1200px',
      spacing: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem', xl: '3rem', '2xl': '4rem' },
      borderRadius: { none: '0px', sm: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', full: '9999px' },
      shadows: {
        none: 'none',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
      },
      borders: { thin: '1px', normal: '2px', thick: '4px' },
      breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' }
    },
    layoutStructure: {
      type: 'three-column',
      areas: {
        header: { enabled: true, minHeight: '200px', backgroundColor: 'transparent' },
        'sidebar-left': { enabled: true, width: '250px', sticky: true },
        main: { enabled: true },
        'sidebar-right': { enabled: true, width: '200px', sticky: true },
        footer: { enabled: true, minHeight: '80px' },
        floating: { enabled: false }
      },
      responsive: { mobile: 'stack', tablet: 'partial' }
    },
    sections: createDefaultSections(),
    availableSections: ['hero', 'about', 'projects', 'skills', 'experience', 'education', 'contact', 'testimonials', 'blog'],
    version: '2.0.0',
    author: 'Portfolio Generator Team',
    tags: ['responsive', 'animations', 'modern', 'professional', 'three-column'],
    isBuiltIn: true,
    isPremium: true,
    animations: { enabled: true, type: 'smooth' },
    darkMode: { enabled: true, auto: true }
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Diseño minimalista y limpio con enfoque en el contenido',
    category: 'minimal',
    preview: '/templates/minimal-clean.jpg',
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#666666',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      surfaceVariant: '#F5F5F5',
      text: {
        primary: '#000000',
        secondary: '#666666',
        accent: '#333333',
        muted: '#999999',
        inverse: '#FFFFFF'
      },
      success: '#22C55E',
      warning: '#EAB308',
      error: '#EF4444',
      info: '#3B82F6',
      gradients: {}
    },
    typography: {
      fontFamilies: {
        primary: "'Helvetica Neue', Arial, sans-serif",
        heading: "'Helvetica Neue', Arial, sans-serif"
      },
      fontSizes: {
        xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem',
        '2xl': '1.5rem', '3xl': '2rem', '4xl': '3rem', '5xl': '4rem', '6xl': '5rem'
      },
      fontWeights: { thin: 100, light: 200, normal: 300, medium: 400, semibold: 500, bold: 600, extrabold: 700, black: 800 },
      lineHeights: { tight: 1.2, snug: 1.3, normal: 1.6, relaxed: 1.8, loose: 2 },
      letterSpacing: { tighter: '-0.03em', tight: '-0.015em', normal: '0em', wide: '0.015em', wider: '0.03em' }
    },
    layout: {
      maxWidth: '900px',
      spacing: { xs: '0.75rem', sm: '1.5rem', md: '3rem', lg: '4rem', xl: '6rem', '2xl': '8rem' },
      borderRadius: { none: '0px', sm: '0px', md: '0px', lg: '2px', xl: '4px', full: '9999px' },
      shadows: {
        none: 'none',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 2px 4px 0 rgb(0 0 0 / 0.06)',
        lg: '0 4px 8px 0 rgb(0 0 0 / 0.08)',
        xl: '0 8px 16px 0 rgb(0 0 0 / 0.1)',
        '2xl': '0 16px 32px 0 rgb(0 0 0 / 0.12)'
      },
      borders: { thin: '1px', normal: '1px', thick: '2px' },
      breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' }
    },
    layoutStructure: {
      type: 'single-column',
      areas: {
        header: { enabled: true, minHeight: '300px' },
        main: { enabled: true },
        footer: { enabled: true, minHeight: '100px' },
        'sidebar-left': { enabled: false },
        'sidebar-right': { enabled: false },
        floating: { enabled: false }
      },
      responsive: { mobile: 'stack', tablet: 'full' }
    },
    sections: createDefaultSections().map((section: Section) => ({
      ...section,
      area: section.area === 'sidebar-right' ? 'main' : section.area,
      order: section.area === 'sidebar-right' ? 4 : section.order
    })),
    availableSections: ['hero', 'about', 'projects', 'skills', 'experience', 'contact'],
    version: '1.5.0',
    author: 'Portfolio Generator Team',
    tags: ['minimal', 'clean', 'simple', 'single-column', 'typography'],
    isBuiltIn: true,
    isPremium: false,
    animations: { enabled: false, type: 'none' },
    darkMode: { enabled: false, auto: false }
  }
];

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
      customizations: { sections: template.sections },
      lastModified: new Date().toISOString(),
    };
    setSelectedTemplate(template);
    setConfig(newConfig);
    saveConfig(newConfig);
    setHasUnsavedChanges(false);
  }, [saveConfig]);

  const updateConfig = useCallback((updates: Partial<AdvancedTemplateConfig>) => {
    if (!config) return;

    const newConfig: AdvancedTemplateConfig = {
      ...config,
      ...updates,
      customizations: {
        ...config.customizations,
        ...updates.customizations,
      },
      lastModified: new Date().toISOString(),
    };

    setConfig(newConfig);
    setHasUnsavedChanges(true);
    const tid = setTimeout(() => saveConfig(newConfig), 2000);
    return () => clearTimeout(tid);
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
              font-family: ${config.customizations.typography?.fontFamilies?.primary || selectedTemplate.typography.fontFamilies.primary};
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
  const ff = tpl.typography.fontFamilies;
  root.style.setProperty('--font-primary', ff.primary);
  root.style.setProperty('--font-heading', ff.heading);
  if (ff.monospace) root.style.setProperty('--font-mono', ff.monospace);

  const fs = tpl.typography.fontSizes;
  Object.entries(fs).forEach(([k, v]) => root.style.setProperty(`--font-${k}`, v));

  // Layout básicos
  root.style.setProperty('--container-max', tpl.layout.maxWidth);
  Object.entries(tpl.layout.spacing).forEach(([k, v]) => root.style.setProperty(`--space-${k}`, v));

  // (Opcional) modo oscuro flag
  root.classList.toggle('theme-dark', !!tpl.darkMode?.enabled);
}

// Export default del hook por si lo importas como default
export default useAdvancedTemplates;

import { PortfolioData } from './portfolio-types';

// Áreas disponibles
export type LayoutArea =
  | 'header'
  | 'sidebar-left'
  | 'sidebar-right'
  | 'main'
  | 'footer'
  | 'floating';

// Tipos de secciones
export type SectionType =
  | 'hero'
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'education'
  | 'contact'
  | 'testimonials'
  | 'blog'
  | 'gallery'
  | 'custom';

// Config de una sección
export interface Section {
  id: string;
  type: SectionType;
  name: string;
  icon: string;
  enabled: boolean;
  area: LayoutArea;
  order: number;
  config: {
    variant?: 'default' | 'compact' | 'expanded' | 'minimal';
    showTitle?: boolean;
    showDivider?: boolean;
    backgroundColor?: string;
    textColor?: string;
    spacing?: 'tight' | 'normal' | 'loose';
    columns?: 1 | 2 | 3 | 4;
    maxItems?: number;
  };
  customCSS?: string;
}

// --- Layout: tipos base y patch ---

export interface AreaConfig {
  enabled: boolean;
  width?: string;
  minHeight?: string;
  maxWidth?: string;
  backgroundColor?: string;
  padding?: string;
  sticky?: boolean;
}

export type AreaConfigMap = Record<LayoutArea, AreaConfig>;

// Estructura de layout de la plantilla (el modelo completo)
export interface TemplateLayoutStructure {
  type?: 'single-column' | 'two-column' | 'three-column' | 'sidebar-left' | 'sidebar-right' | 'sidebar-both';
  areas?: AreaConfigMap;
  responsive?: {
    mobile: 'stack' | 'collapse' | 'hidden';
    tablet: 'partial' | 'full' | 'collapsed';
  };
}

// Patch de layout (lo que guarda el usuario, puede tener partes)
export type TemplateLayoutStructurePatch = {
  type?: TemplateLayoutStructure['type'];
  areas?: Partial<Record<LayoutArea, Partial<AreaConfig>>>;
  responsive?: Partial<TemplateLayoutStructure['responsive']>;
};

// Colores avanzados
export interface AdvancedTemplateColors {
  primary: string;
  secondary: string;
  accent: string;

  background: string;
  surface: string;
  surfaceVariant: string;

  text: {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    inverse: string;
  };

  success: string;
  warning: string;
  error: string;
  info: string;

  gradients: {
    primary?: { from: string; to: string; direction?: string };
    secondary?: { from: string; to: string; direction?: string };
    accent?: { from: string; to: string; direction?: string };
  };

  dark?: {
    background: string;
    surface: string;
    text: { primary: string; secondary: string };
  };
}

// Tipografía
export interface AdvancedTemplateTypography {
  fontFamilies: {
    primary: string;
    heading: string;
    monospace?: string;
    display?: string;
  };
  fontSizes: {
    xs: string; sm: string; base: string; lg: string; xl: string;
    '2xl': string; '3xl': string; '4xl': string; '5xl': string; '6xl': string;
  };
  fontWeights: {
    thin: number; light: number; normal: number; medium: number;
    semibold: number; bold: number; extrabold: number; black: number;
  };
  lineHeights: {
    tight: number; snug: number; normal: number; relaxed: number; loose: number;
  };
  letterSpacing: {
    tighter: string; tight: string; normal: string; wide: string; wider: string;
  };
}

// Layout / espaciado
export interface AdvancedTemplateLayout {
  maxWidth: string;
  spacing: {
    xs: string; sm: string; md: string; lg: string; xl: string; '2xl': string;
  };
  borderRadius: {
    none: string; sm: string; md: string; lg: string; xl: string; full: string;
  };
  shadows: {
    none: string; sm: string; md: string; lg: string; xl: string; '2xl': string;
  };
  borders: {
    thin: string; normal: string; thick: string;
  };
  breakpoints: {
    sm: string; md: string; lg: string; xl: string; '2xl': string;
  };
}

// Plantilla avanzada
export interface AdvancedTemplate {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal' | 'tech' | 'portfolio' | 'business';
  preview: string;

  colors: AdvancedTemplateColors;
  typography: AdvancedTemplateTypography;
  layout: AdvancedTemplateLayout;
  layoutStructure: TemplateLayoutStructure;

  sections: Section[];
  availableSections: SectionType[];

  version: string;
  author?: string;
  tags: string[];
  isBuiltIn: boolean;
  isPremium?: boolean;

  customCSS?: string;

  animations?: {
    enabled: boolean;
    type?: 'none' | 'subtle' | 'smooth' | 'dynamic';
  };
  darkMode?: {
    enabled: boolean;
    auto?: boolean;
  };
}

// Config seleccionada por el usuario
export interface AdvancedTemplateConfig {
  templateId: string;
  customizations: {
    colors?: Partial<AdvancedTemplateColors>;
    typography?: Partial<AdvancedTemplateTypography>;
    layout?: Partial<AdvancedTemplateLayout>;
    layoutStructure?: TemplateLayoutStructurePatch;
    sections?: Section[];
    customCSS?: string;
    animations?: {
      enabled: boolean;
      type?: 'none' | 'subtle' | 'smooth' | 'dynamic';
    };
    darkMode?: {
      enabled: boolean;
      auto?: boolean;
    };
  };
  lastModified: string;
}

// Selector
export interface AdvancedTemplateSelectorProps {
  templates: AdvancedTemplate[];
  selectedTemplate?: AdvancedTemplate;
  onTemplateSelect: (template: AdvancedTemplate) => void;
  onCustomize?: (template: AdvancedTemplate) => void;
  onPreview?: (template: AdvancedTemplate) => void;
  viewMode?: 'grid' | 'list';
  filterBy?: {
    category?: string;
    tags?: string[];
    isPremium?: boolean;
  };
}

// Customizer
export interface AdvancedTemplateCustomizerProps {
  template: AdvancedTemplate;
  config: AdvancedTemplateConfig;
  onConfigChange: (config: AdvancedTemplateConfig) => void;
  onPreview: () => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
}

// Drag & drop
export interface DragDropConfig {
  draggedItem: Section | null;
  dragOverArea: LayoutArea | null;
  dragOverIndex: number | null;
}

// Utilidades
export interface TemplateUtils {
  generateCSS(template: AdvancedTemplate, config: AdvancedTemplateConfig): string;
  generateHTML(template: AdvancedTemplate, config: AdvancedTemplateConfig, data: PortfolioData): string;
  validateTemplate(template: AdvancedTemplate): { valid: boolean; errors: string[] };
  validateConfig(config: AdvancedTemplateConfig): { valid: boolean; errors: string[] };
  migrateTemplate(oldTemplate: any): AdvancedTemplate;
  exportTemplate(template: AdvancedTemplate): string;
  importTemplate(data: string): AdvancedTemplate;
}

// Hook return
export interface UseAdvancedTemplatesReturn {
  templates: AdvancedTemplate[];
  selectedTemplate: AdvancedTemplate | null;
  effectiveTemplate: AdvancedTemplate | null;
  config: AdvancedTemplateConfig | null;

  selectTemplate: (template: AdvancedTemplate) => void;
  updateConfig: (config: Partial<AdvancedTemplateConfig>) => void;
  resetConfig: () => void;

  updateSections: (sections: Section[]) => void;
  moveSectionToArea: (sectionId: string, targetArea: LayoutArea, targetIndex?: number) => void;
  toggleSection: (sectionId: string, enabled: boolean) => void;
  updateSectionConfig: (sectionId: string, config: Partial<Section['config']>) => void;

  updateLayoutStructure: (structure: TemplateLayoutStructurePatch) => void; // <- PATCH
  toggleLayoutArea: (area: LayoutArea, enabled: boolean) => void;

  previewTemplate: () => string;
  exportConfig: () => string;
  importConfig: (data: string) => boolean;
  duplicateTemplate: (templateId: string, newName?: string) => AdvancedTemplate;

  isLoaded: boolean;
  hasUnsavedChanges: boolean;
  validationErrors: string[];
}

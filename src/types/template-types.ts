// src/types/template-types.ts - CORREGIDO
import { PortfolioData } from './portfolio-types';

// Configuración de colores de una plantilla
export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  gradient?: {
    from: string;
    to: string;
    direction?: string;
  };
}

// Configuración tipográfica
export interface TemplateTypography {
  fontFamily: {
    primary: string;
    heading: string;
    code?: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

// Layout y espaciado
export interface TemplateLayout {
  maxWidth: string;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Estructura de secciones
export interface TemplateSection {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  customCSS?: string;
  props?: Record<string, any>;
}

// Configuración completa de plantilla
export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal' | 'tech';
  preview: string;
  colors: TemplateColors;
  typography: TemplateTypography;
  layout: TemplateLayout;
  sections: TemplateSection[];
  customCSS?: string;
  version: string;
  author?: string;
  tags: string[];
  isBuiltIn: boolean;
  // REMOVIDO pageLayout que causaba el error
}

// Configuración seleccionada por el usuario
export interface TemplateConfig {
  templateId: string;
  customizations: {
    colors?: Partial<TemplateColors>;
    typography?: Partial<TemplateTypography>;
    layout?: Partial<TemplateLayout>;
    sections?: TemplateSection[];
    customCSS?: string;
  };
}

// Props para el selector de plantillas - CORREGIDO
export interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate?: Template | null; // CAMBIADO: acepta null
  onTemplateSelect: (template: Template) => void;
  onCustomize?: (template: Template) => void;
}

// Props para el customizador de plantillas
export interface TemplateCustomizerProps {
  template: Template;
  config: TemplateConfig;
  onConfigChange: (config: TemplateConfig) => void;
  onSave: () => void;
  onCancel: () => void;
}

// Hook para gestión de plantillas - CORREGIDO
export interface UseTemplatesOptions {
  defaultTemplateId?: string;
  storageKey?: string;
}

export interface UseTemplatesReturn {
  templates: Template[];
  selectedTemplate: Template | null; // CAMBIADO: puede ser null
  config: TemplateConfig | null;
  selectTemplate: (template: Template) => void;
  updateConfig: (config: Partial<TemplateConfig>) => void;
  resetConfig: () => void;
  addCustomTemplate: (template: Omit<Template, 'id' | 'isBuiltIn'>) => Template;
  removeCustomTemplate: (templateId: string) => void;
  exportTemplate: (templateId: string) => string;
  importTemplate: (templateData: string) => boolean;
}
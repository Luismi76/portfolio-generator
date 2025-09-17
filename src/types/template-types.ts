// template-types.ts
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
  preview: string; // URL de imagen preview
  colors: TemplateColors;
  typography: TemplateTypography;
  layout: TemplateLayout;
  sections: TemplateSection[];
  customCSS?: string;
  version: string;
  author?: string;
  tags: string[];
  isBuiltIn: boolean;
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

// Generador de HTML con plantilla
export interface TemplateRenderer {
  template: Template;
  config: TemplateConfig;
  generateHTML(data: PortfolioData): string;
  generateCSS(): string;
  previewHTML(): string;
}

// Props para el selector de plantillas
export interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate?: Template;
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

// Hook para gestión de plantillas
export interface UseTemplatesOptions {
  defaultTemplateId?: string;
  storageKey?: string;
}

export interface UseTemplatesReturn {
  templates: Template[];
  selectedTemplate: Template | null;
  config: TemplateConfig | null;
  selectTemplate: (template: Template) => void;
  updateConfig: (config: Partial<TemplateConfig>) => void;
  resetConfig: () => void;
  addCustomTemplate: (template: Omit<Template, 'id' | 'isBuiltIn'>) => void;
  removeCustomTemplate: (templateId: string) => void;
  exportTemplate: (templateId: string) => string;
  importTemplate: (templateData: string) => boolean;
}

// Utilidades para validación
export interface TemplateValidator {
  validateTemplate(template: Template): { valid: boolean; errors: string[] };
  validateConfig(config: TemplateConfig): { valid: boolean; errors: string[] };
}

// Constantes por defecto
export const DEFAULT_COLORS: TemplateColors = {
  primary: '#3B82F6',
  secondary: '#6366F1',
  accent: '#8B5CF6',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    accent: '#3B82F6'
  }
};

export const DEFAULT_TYPOGRAPHY: TemplateTypography = {
  fontFamily: {
    primary: "'Inter', sans-serif",
    heading: "'Inter', sans-serif"
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
};

export const DEFAULT_LAYOUT: TemplateLayout = {
  maxWidth: '1200px',
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  }
};
// template-types.ts
import { PortfolioData } from './portfolio-types';

// Nuevos tipos para posicionamiento y layout de secciones
export type SectionPosition = 'main' | 'sidebar-left' | 'sidebar-right' | 'header' | 'footer';
export type SectionWidth = 'full' | 'half' | 'third' | 'two-thirds' | 'quarter' | 'auto';
export type SectionDisplay = 'block' | 'card' | 'list' | 'grid' | 'compact';

// Configuración avanzada de layout
export interface TemplateLayoutConfig {
  type: 'single-column' | 'two-column' | 'three-column' | 'sidebar-left' | 'sidebar-right' | 'asymmetric';
  sidebarWidth?: string; // ej: '300px', '25%', '1fr'
  sidebarPosition?: 'left' | 'right';
  sidebarSticky?: boolean;
  sidebarCollapsible?: boolean;
  headerType?: 'hero' | 'banner' | 'compact' | 'sidebar';
  mainContentArea?: {
    maxWidth?: string;
    padding?: string;
    columns?: number;
    gap?: string;
  };
  breakpoints?: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

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

// Layout y espaciado - EXTENDIDO
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
  // NUEVO: Configuración avanzada de layout
  layoutConfig?: TemplateLayoutConfig;
}

// Estructura de secciones - EXTENDIDA
export interface TemplateSection {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  customCSS?: string;
  props?: Record<string, any>;
  // NUEVO: Configuraciones avanzadas de posicionamiento
  position?: SectionPosition;
  width?: SectionWidth;
  display?: SectionDisplay;
  sticky?: boolean;
  collapsed?: boolean;
  showInSidebar?: boolean;
  sidebarOrder?: number;
  mobileHidden?: boolean;
  customClass?: string;
  containerStyle?: 'contained' | 'full-width' | 'fluid';
  spacing?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}

// Configuración completa de plantilla - ACTUALIZADA
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
  pageLayout: string;
  isBuiltIn: boolean;
  // NUEVO: Indicadores de características avanzadas
  supportsSidebar?: boolean;
  supportsMultiColumn?: boolean;
  supportsCustomPositioning?: boolean;
}

// Configuración seleccionada por el usuario - ACTUALIZADA
export interface TemplateConfig {
  templateId: string;
  customizations: {
    colors?: Partial<TemplateColors>;
    typography?: Partial<TemplateTypography>;
    layout?: Partial<TemplateLayout>;
    sections?: TemplateSection[];
    customCSS?: string;
    // NUEVO: Configuraciones avanzadas
    layoutConfig?: TemplateLayoutConfig;
    sidebarSections?: string[]; // IDs de secciones en sidebar
    sidebarContent?: {
      showProfile?: boolean;
      showNavigation?: boolean;
      showSummary?: boolean;
      showContact?: boolean;
      customContent?: string;
    };
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

// NUEVO: Opciones predefinidas para layouts
export const LAYOUT_PRESETS: Record<string, TemplateLayoutConfig> = {
  'single-column': {
    type: 'single-column',
    mainContentArea: {
      maxWidth: '1200px',
      columns: 1,
      gap: '2rem'
    }
  },
  'sidebar-left': {
    type: 'sidebar-left',
    sidebarPosition: 'left',
    sidebarWidth: '300px',
    sidebarSticky: true,
    mainContentArea: {
      padding: '0 0 0 2rem',
      columns: 1
    }
  },
  'sidebar-right': {
    type: 'sidebar-right',
    sidebarPosition: 'right',
    sidebarWidth: '300px',
    sidebarSticky: true,
    mainContentArea: {
      padding: '0 2rem 0 0',
      columns: 1
    }
  },
  'two-column': {
    type: 'two-column',
    mainContentArea: {
      columns: 2,
      gap: '3rem'
    }
  },
  'three-column': {
    type: 'three-column',
    mainContentArea: {
      columns: 3,
      gap: '2rem'
    }
  }
};

// NUEVO: Opciones predefinidas para posicionamiento de secciones
export const SECTION_POSITION_OPTIONS: Array<{
  value: SectionPosition;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    value: 'main',
    label: 'Área Principal',
    description: 'Contenido principal del portfolio',
    icon: 'layout'
  },
  {
    value: 'sidebar-left',
    label: 'Sidebar Izquierdo',
    description: 'Panel lateral izquierdo',
    icon: 'sidebar'
  },
  {
    value: 'sidebar-right',
    label: 'Sidebar Derecho',
    description: 'Panel lateral derecho',
    icon: 'sidebar'
  },
  {
    value: 'header',
    label: 'Header',
    description: 'Parte superior de la página',
    icon: 'header'
  },
  {
    value: 'footer',
    label: 'Footer',
    description: 'Parte inferior de la página',
    icon: 'footer'
  }
];

// NUEVO: Opciones de ancho de sección
export const SECTION_WIDTH_OPTIONS: Array<{
  value: SectionWidth;
  label: string;
  description: string;
}> = [
  { value: 'full', label: 'Ancho completo', description: '100% del contenedor' },
  { value: 'half', label: 'Mitad', description: '50% del contenedor' },
  { value: 'third', label: 'Un tercio', description: '33% del contenedor' },
  { value: 'two-thirds', label: 'Dos tercios', description: '66% del contenedor' },
  { value: 'quarter', label: 'Un cuarto', description: '25% del contenedor' },
  { value: 'auto', label: 'Automático', description: 'Ajuste automático' }
];

// NUEVO: Opciones de visualización
export const SECTION_DISPLAY_OPTIONS: Array<{
  value: SectionDisplay;
  label: string;
  description: string;
}> = [
  { value: 'block', label: 'Bloque', description: 'Visualización en bloque estándar' },
  { value: 'card', label: 'Tarjeta', description: 'Con bordes y sombra' },
  { value: 'list', label: 'Lista', description: 'Formato de lista' },
  { value: 'grid', label: 'Grid', description: 'Diseño en cuadrícula' },
  { value: 'compact', label: 'Compacto', description: 'Espaciado reducido' }
];

// Constantes por defecto - ACTUALIZADAS
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
  },
  // NUEVO: Layout config por defecto
  layoutConfig: {
    type: 'single-column',
    mainContentArea: {
      maxWidth: '1200px',
      columns: 1,
      gap: '2rem'
    }
  }
};
// built-in-templates.ts
import { Template, TemplateSection } from '../types/template-types';

// Secciones comunes para todas las plantillas
const createDefaultSections = (): TemplateSection[] => [
  {
    id: 'header',
    name: 'Header/Portada',
    enabled: true,
    order: 1
  },
  {
    id: 'about',
    name: 'Sobre mí',
    enabled: true,
    order: 2
  },
  {
    id: 'projects',
    name: 'Proyectos',
    enabled: true,
    order: 3
  },
  {
    id: 'skills',
    name: 'Habilidades',
    enabled: true,
    order: 4
  },
  {
    id: 'experience',
    name: 'Experiencia',
    enabled: false,
    order: 5
  },
  {
    id: 'contact',
    name: 'Contacto',
    enabled: true,
    order: 6
  }
];

// Plantilla Modern - Diseño limpio con gradientes
export const MODERN_TEMPLATE: Template = {
  id: 'modern',
  name: 'Modern',
  description: 'Diseño limpio y contemporáneo con gradientes suaves y tipografía elegante',
  category: 'modern',
  preview: '/templates/modern-preview.jpg',
  colors: {
    primary: '#667EEA',
    secondary: '#764BA2',
    accent: '#F093FB',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: {
      primary: '#1A202C',
      secondary: '#718096',
      accent: '#667EEA'
    },
    gradient: {
      from: '#667EEA',
      to: '#764BA2',
      direction: '135deg'
    }
  },
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.5rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  layout: {
    maxWidth: '1200px',
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '2rem',
      lg: '3rem',
      xl: '4rem'
    },
    borderRadius: {
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.5rem'
    },
    shadows: {
      sm: '0 2px 4px 0 rgb(0 0 0 / 0.05)',
      md: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      lg: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
    }
  },
  sections: createDefaultSections(),
  version: '1.0.0',
  author: 'Portfolio Generator',
  tags: ['modern', 'gradient', 'clean', 'professional'],
  pageLayout: 'standard', // header -> projects -> skills
  isBuiltIn: true
};

// Plantilla Classic - Estilo tradicional y profesional
export const CLASSIC_TEMPLATE: Template = {
  id: 'classic',
  name: 'Classic',
  description: 'Diseño profesional y atemporal con colores neutros y estructura tradicional',
  category: 'classic',
  preview: '/templates/classic-preview.jpg',
  colors: {
    primary: '#2C3E50',
    secondary: '#34495E',
    accent: '#3498DB',
    background: '#FFFFFF',
    surface: '#F7F9FC',
    text: {
      primary: '#2C3E50',
      secondary: '#7F8C8D',
      accent: '#3498DB'
    }
  },
  typography: {
    fontFamily: {
      primary: "'Georgia', 'Times New Roman', serif",
      heading: "'Playfair Display', Georgia, serif"
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      '4xl': '2.5rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  layout: {
    maxWidth: '1100px',
    spacing: {
      xs: '0.75rem',
      sm: '1.25rem',
      md: '2rem',
      lg: '3rem',
      xl: '4rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    },
    shadows: {
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    }
  },
  sections: createDefaultSections(),
  version: '1.0.0',
  author: 'Portfolio Generator',
  tags: ['classic', 'professional', 'traditional', 'serif'],
  pageLayout: 'standard', // header -> projects -> skills
  isBuiltIn: true
};

// Plantilla Tech - Tema oscuro para desarrolladores
export const TECH_TEMPLATE: Template = {
  id: 'tech',
  name: 'Tech',
  description: 'Tema oscuro moderno diseñado especialmente para desarrolladores y profesionales tech',
  category: 'tech',
  preview: '/templates/tech-preview.jpg',
  colors: {
    primary: '#00D9FF',
    secondary: '#FF6B6B',
    accent: '#4ECDC4',
    background: '#0D1117',
    surface: '#161B22',
    text: {
      primary: '#F0F6FC',
      secondary: '#8B949E',
      accent: '#00D9FF'
    },
    gradient: {
      from: '#00D9FF',
      to: '#4ECDC4',
      direction: '45deg'
    }
  },
  typography: {
    fontFamily: {
      primary: "'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace",
      heading: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
      code: "'JetBrains Mono', 'Fira Code', monospace"
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '0.95rem',
      lg: '1.1rem',
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
  },
  layout: {
    maxWidth: '1300px',
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2.5rem',
      xl: '3.5rem'
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 2px 4px 0 rgb(0 0 0 / 0.3)',
      md: '0 8px 16px 0 rgb(0 0 0 / 0.3)',
      lg: '0 16px 24px 0 rgb(0 0 0 / 0.4)',
      xl: '0 24px 48px 0 rgb(0 0 0 / 0.5)'
    }
  },
  sections: createDefaultSections(),
  version: '1.0.0',
  author: 'Portfolio Generator',
  tags: ['tech', 'dark', 'developer', 'monospace', 'modern'],
  pageLayout: 'standard', // header -> projects -> skills
  isBuiltIn: true
};

// Plantilla Creative - Colores vibrantes y diseño artístico
export const CREATIVE_TEMPLATE: Template = {
  id: 'creative',
  name: 'Creative',
  description: 'Diseño vibrante y artístico con colores llamativos, perfecto para creativos y diseñadores',
  category: 'creative',
  preview: '/templates/creative-preview.jpg',
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#45B7D1',
    background: '#FFFBF0',
    surface: '#FFF8E1',
    text: {
      primary: '#2C3E50',
      secondary: '#34495E',
      accent: '#E74C3C'
    },
    gradient: {
      from: '#FF6B6B',
      to: '#4ECDC4',
      direction: '120deg'
    }
  },
  typography: {
    fontFamily: {
      primary: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
      heading: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      '4xl': '2.75rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 800
    }
  },
  layout: {
    maxWidth: '1200px',
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '2rem',
      lg: '3rem',
      xl: '4rem'
    },
    borderRadius: {
      sm: '0.75rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    shadows: {
      sm: '0 4px 8px 0 rgb(255 107 107 / 0.1)',
      md: '0 12px 24px 0 rgb(255 107 107 / 0.15)',
      lg: '0 20px 40px 0 rgb(255 107 107 / 0.2)',
      xl: '0 32px 64px 0 rgb(255 107 107 / 0.25)'
    }
  },
  sections: createDefaultSections(),
  version: '1.0.0',
  author: 'Portfolio Generator',
  tags: ['creative', 'colorful', 'artistic', 'vibrant', 'designer'],
  pageLayout: 'standard', // header -> projects -> skills
  isBuiltIn: true
};

// Plantilla Minimal - Diseño minimalista y limpio
export const MINIMAL_TEMPLATE: Template = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Diseño ultra-limpio y minimalista con mucho espacio en blanco y tipografía sutil',
  category: 'minimal',
  preview: '/templates/minimal-preview.jpg',
  colors: {
    primary: '#000000',
    secondary: '#333333',
    accent: '#666666',
    background: '#FFFFFF',
    surface: '#FAFAFA',
    text: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#333333'
    }
  },
  typography: {
    fontFamily: {
      primary: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      heading: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      '4xl': '3rem'
    },
    fontWeight: {
      normal: 300,
      medium: 400,
      semibold: 500,
      bold: 600
    }
  },
  layout: {
    maxWidth: '900px',
    spacing: {
      xs: '0.75rem',
      sm: '1.5rem',
      md: '3rem',
      lg: '4rem',
      xl: '6rem'
    },
    borderRadius: {
      sm: '0rem',
      md: '0rem',
      lg: '0.125rem',
      xl: '0.25rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 2px 4px 0 rgb(0 0 0 / 0.06)',
      lg: '0 4px 8px 0 rgb(0 0 0 / 0.08)',
      xl: '0 8px 16px 0 rgb(0 0 0 / 0.1)'
    }
  },
  sections: createDefaultSections(),
  version: '1.0.0',
  author: 'Portfolio Generator',
  tags: ['minimal', 'clean', 'simple', 'whitespace', 'subtle'],
  pageLayout: 'standard', // header -> projects -> skills
  isBuiltIn: true
};

// Array con todas las plantillas built-in
export const BUILT_IN_TEMPLATES: Template[] = [
  MODERN_TEMPLATE,
  CLASSIC_TEMPLATE,
  TECH_TEMPLATE,
  CREATIVE_TEMPLATE,
  MINIMAL_TEMPLATE
];

// Función helper para obtener una plantilla por ID
export const getTemplateById = (id: string): Template | undefined => {
  return BUILT_IN_TEMPLATES.find(template => template.id === id);
};

// Función para obtener plantillas por categoría
export const getTemplatesByCategory = (category: Template['category']): Template[] => {
  return BUILT_IN_TEMPLATES.filter(template => template.category === category);
};

// Función para obtener la plantilla por defecto
export const getDefaultTemplate = (): Template => {
  return MODERN_TEMPLATE;
};
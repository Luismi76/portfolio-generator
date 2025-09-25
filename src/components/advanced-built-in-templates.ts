// src/components/advanced-built-in-templates.ts
import { AdvancedTemplate, Section } from '../types/advanced-template-types';

// Helper para crear secciones por defecto
const createSection = (
  id: string,
  type: any,
  name: string,
  area: any,
  order: number,
  enabled = true
): Section => ({
  id,
  type,
  name,
  icon: '📄',
  enabled,
  area,
  order,
  config: {
    variant: 'default',
    showTitle: true,
    showDivider: false,
    spacing: 'normal',
    columns: 1,
  },
});

// 1. MODERN GRADIENT - Layout clásico con header y footer
export const MODERN_GRADIENT_TEMPLATE: AdvancedTemplate = {
  id: 'modern-gradient',
  name: 'Modern Gradient',
  description: 'Diseño contemporáneo con gradientes suaves y layout tradicional',
  category: 'modern',
  preview: '/templates/modern-gradient.jpg',
  
  colors: {
    primary: '#667EEA',
    secondary: '#764BA2',
    accent: '#F093FB',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceVariant: '#E2E8F0',
    text: {
      primary: '#1A202C',
      secondary: '#718096',
      accent: '#667EEA',
      muted: '#A0AEC0',
      inverse: '#FFFFFF'
    },
    success: '#48BB78',
    warning: '#ED8936',
    error: '#F56565',
    info: '#4299E1',
    gradients: {
      primary: { from: '#667EEA', to: '#764BA2', direction: '135deg' },
      secondary: { from: '#F093FB', to: '#F5576C', direction: '90deg' }
    }
  },

  typography: {
    fontFamilies: {
      primary: "'Inter', -apple-system, sans-serif",
      heading: "'Inter', -apple-system, sans-serif",
      monospace: "'JetBrains Mono', monospace"
    },
    fontSizes: {
      xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
      xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem',
      '5xl': '3rem', '6xl': '3.75rem'
    },
    fontWeights: {
      thin: 100, light: 300, normal: 400, medium: 500,
      semibold: 600, bold: 700, extrabold: 800, black: 900
    },
    lineHeights: {
      tight: 1.25, snug: 1.375, normal: 1.5, relaxed: 1.625, loose: 2
    },
    letterSpacing: {
      tighter: '-0.05em', tight: '-0.025em', normal: '0',
      wide: '0.025em', wider: '0.05em'
    }
  },

  layout: {
    maxWidth: '1200px',
    spacing: {
      xs: '0.5rem', sm: '1rem', md: '1.5rem',
      lg: '2rem', xl: '3rem', '2xl': '4rem'
    },
    borderRadius: {
      none: '0', sm: '0.375rem', md: '0.5rem',
      lg: '0.75rem', xl: '1rem', full: '9999px'
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
    },
    borders: {
      thin: '1px', normal: '2px', thick: '4px'
    },
    breakpoints: {
      sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px'
    }
  },

  layoutStructure: {
    type: 'single-column',
    areas: {
      header: { enabled: true, backgroundColor: 'transparent', sticky: true },
      'sidebar-left': { enabled: false },
      'sidebar-right': { enabled: false },
      main: { enabled: true, maxWidth: '1200px' },
      footer: { enabled: true, backgroundColor: '#1A202C', padding: '2rem' },
      floating: { enabled: false }
    },
    responsive: {
      mobile: 'stack',
      tablet: 'full'
    }
  },

sections: [
  createSection('header', 'hero', 'Header', 'header', 1),
  createSection('about', 'about', 'Sobre mí', 'main', 2),
  createSection('projects', 'projects', 'Proyectos', 'main', 3),
  createSection('skills', 'skills', 'Habilidades', 'main', 4),
  createSection('contact', 'contact', 'Contacto', 'footer', 5)
],

  availableSections: ['hero', 'about', 'projects', 'skills', 'experience', 'contact', 'testimonials'],

  version: '2.0.0',
  author: 'Portfolio Generator',
  tags: ['gradient', 'modern', 'clean'],
  isBuiltIn: true,
  isPremium: false,

  animations: {
    enabled: true,
    type: 'smooth'
  },
  darkMode: {
    enabled: false
  }
};

// 2. SIDEBAR LEFT - Con barra lateral izquierda fija
export const SIDEBAR_LEFT_TEMPLATE: AdvancedTemplate = {
  id: 'sidebar-left',
  name: 'Sidebar Left Pro',
  description: 'Layout profesional con sidebar izquierda fija y navegación persistente',
  category: 'business',
  preview: '/templates/sidebar-left.jpg',
  
  colors: {
    primary: '#2D3748',
    secondary: '#4A5568',
    accent: '#3182CE',
    background: '#FFFFFF',
    surface: '#F7FAFC',
    surfaceVariant: '#EDF2F7',
    text: {
      primary: '#1A202C',
      secondary: '#718096',
      accent: '#3182CE',
      muted: '#A0AEC0',
      inverse: '#FFFFFF'
    },
    success: '#38A169',
    warning: '#DD6B20',
    error: '#E53E3E',
    info: '#3182CE',
    gradients: {
      primary: { from: '#2D3748', to: '#4A5568', direction: '180deg' }
    },
    dark: {
      background: '#1A202C',
      surface: '#2D3748',
      text: { primary: '#F7FAFC', secondary: '#CBD5E0' }
    }
  },

  typography: {
    fontFamilies: {
      primary: "'Roboto', -apple-system, sans-serif",
      heading: "'Roboto Slab', Georgia, serif",
      monospace: "'Fira Code', monospace"
    },
    fontSizes: {
      xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
      xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem',
      '5xl': '3rem', '6xl': '3.75rem'
    },
    fontWeights: {
      thin: 100, light: 300, normal: 400, medium: 500,
      semibold: 600, bold: 700, extrabold: 800, black: 900
    },
    lineHeights: {
      tight: 1.25, snug: 1.375, normal: 1.5, relaxed: 1.625, loose: 2
    },
    letterSpacing: {
      tighter: '-0.05em', tight: '-0.025em', normal: '0',
      wide: '0.025em', wider: '0.05em'
    }
  },

  layout: {
    maxWidth: '1400px',
    spacing: {
      xs: '0.5rem', sm: '1rem', md: '1.5rem',
      lg: '2rem', xl: '3rem', '2xl': '4rem'
    },
    borderRadius: {
      none: '0', sm: '0.25rem', md: '0.5rem',
      lg: '0.75rem', xl: '1rem', full: '9999px'
    },
    shadows: {
      none: 'none',
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
    },
    borders: {
      thin: '1px', normal: '2px', thick: '4px'
    },
    breakpoints: {
      sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px'
    }
  },

  layoutStructure: {
    type: 'sidebar-left',
    areas: {
      header: { enabled: false },
      'sidebar-left': { 
        enabled: true, 
        width: '280px',
        backgroundColor: '#2D3748',
        sticky: true,
        padding: '2rem'
      },
      'sidebar-right': { enabled: false },
      main: { enabled: true },
      footer: { enabled: true, backgroundColor: '#F7FAFC' },
      floating: { enabled: false }
    },
    responsive: {
      mobile: 'collapse',
      tablet: 'partial'
    }
  },

sections: [
  createSection('header', 'hero', 'Header', 'header', 1),
  createSection('about', 'about', 'Sobre mí', 'main', 2),
  createSection('projects', 'projects', 'Proyectos', 'main', 3),
  createSection('skills', 'skills', 'Habilidades', 'main', 4),
  createSection('contact', 'contact', 'Contacto', 'footer', 5)
],

  availableSections: ['hero', 'about', 'projects', 'skills', 'experience', 'contact', 'education'],

  version: '2.0.0',
  author: 'Portfolio Generator',
  tags: ['sidebar', 'professional', 'business'],
  isBuiltIn: true,
  isPremium: true,

  animations: {
    enabled: true,
    type: 'subtle'
  },
  darkMode: {
    enabled: true,
    auto: true
  }
};

// 3. MINIMAL NO HEADER - Sin header, ultraminimalista
export const MINIMAL_TEMPLATE: AdvancedTemplate = {
  id: 'minimal-clean',
  name: 'Minimal Clean',
  description: 'Diseño minimalista sin header, máxima simplicidad y elegancia',
  category: 'minimal',
  preview: '/templates/minimal.jpg',
  
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
    success: '#2E7D32',
    warning: '#F57C00',
    error: '#C62828',
    info: '#1976D2',
    gradients: {}
  },

  typography: {
    fontFamilies: {
      primary: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      heading: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    },
    fontSizes: {
      xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
      xl: '1.25rem', '2xl': '1.5rem', '3xl': '2rem', '4xl': '3rem',
      '5xl': '4rem', '6xl': '5rem'
    },
    fontWeights: {
      thin: 100, light: 300, normal: 400, medium: 400,
      semibold: 500, bold: 600, extrabold: 700, black: 800
    },
    lineHeights: {
      tight: 1.2, snug: 1.3, normal: 1.5, relaxed: 1.7, loose: 2
    },
    letterSpacing: {
      tighter: '-0.02em', tight: '-0.01em', normal: '0',
      wide: '0.01em', wider: '0.02em'
    }
  },

  layout: {
    maxWidth: '900px',
    spacing: {
      xs: '0.75rem', sm: '1.5rem', md: '3rem',
      lg: '4rem', xl: '6rem', '2xl': '8rem'
    },
    borderRadius: {
      none: '0', sm: '0', md: '0',
      lg: '0.125rem', xl: '0.25rem', full: '9999px'
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 2px 4px 0 rgb(0 0 0 / 0.06)',
      lg: '0 4px 8px 0 rgb(0 0 0 / 0.08)',
      xl: '0 8px 16px 0 rgb(0 0 0 / 0.1)',
      '2xl': '0 16px 32px 0 rgb(0 0 0 / 0.12)'
    },
    borders: {
      thin: '1px', normal: '1px', thick: '2px'
    },
    breakpoints: {
      sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px'
    }
  },

  layoutStructure: {
    type: 'single-column',
    areas: {
      header: { enabled: false },
      'sidebar-left': { enabled: false },
      'sidebar-right': { enabled: false },
      main: { enabled: true, maxWidth: '900px', padding: '4rem 2rem' },
      footer: { enabled: false },
      floating: { enabled: false }
    },
    responsive: {
      mobile: 'stack',
      tablet: 'full'
    }
  },

 sections: [
  createSection('header', 'hero', 'Header', 'header', 1),
  createSection('about', 'about', 'Sobre mí', 'main', 2),
  createSection('projects', 'projects', 'Proyectos', 'main', 3),
  createSection('skills', 'skills', 'Habilidades', 'main', 4),
  createSection('contact', 'contact', 'Contacto', 'footer', 5)
],

  availableSections: ['hero', 'about', 'projects', 'contact'],

  version: '2.0.0',
  author: 'Portfolio Generator',
  tags: ['minimal', 'clean', 'simple', 'no-header'],
  isBuiltIn: true,
  isPremium: false,

  animations: {
    enabled: false,
    type: 'none'
  },
  darkMode: {
    enabled: false
  }
};

// 4. CREATIVE DUAL SIDEBAR - Con sidebars en ambos lados
export const CREATIVE_DUAL_TEMPLATE: AdvancedTemplate = {
  id: 'creative-dual',
  name: 'Creative Dual Sidebar',
  description: 'Diseño creativo con sidebars flotantes a ambos lados',
  category: 'creative',
  preview: '/templates/creative-dual.jpg',
  
  colors: {
    primary: '#FF6B9D',
    secondary: '#C44569',
    accent: '#FFC048',
    background: '#FFF5F7',
    surface: '#FFFFFF',
    surfaceVariant: '#FFE5EC',
    text: {
      primary: '#2D3436',
      secondary: '#636E72',
      accent: '#FF6B9D',
      muted: '#B2BEC3',
      inverse: '#FFFFFF'
    },
    success: '#6C5CE7',
    warning: '#FDCB6E',
    error: '#D63031',
    info: '#74B9FF',
    gradients: {
      primary: { from: '#FF6B9D', to: '#C44569', direction: '120deg' },
      accent: { from: '#FFC048', to: '#FF6B9D', direction: '45deg' }
    }
  },

  typography: {
    fontFamilies: {
      primary: "'Quicksand', -apple-system, sans-serif",
      heading: "'Playfair Display', Georgia, serif",
      display: "'Bebas Neue', Impact, sans-serif"
    },
    fontSizes: {
      xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
      xl: '1.25rem', '2xl': '1.5rem', '3xl': '2rem', '4xl': '2.5rem',
      '5xl': '3rem', '6xl': '4rem'
    },
    fontWeights: {
      thin: 100, light: 300, normal: 400, medium: 500,
      semibold: 600, bold: 700, extrabold: 800, black: 900
    },
    lineHeights: {
      tight: 1.2, snug: 1.4, normal: 1.6, relaxed: 1.8, loose: 2
    },
    letterSpacing: {
      tighter: '-0.05em', tight: '-0.025em', normal: '0',
      wide: '0.05em', wider: '0.1em'
    }
  },

  layout: {
    maxWidth: '1600px',
    spacing: {
      xs: '0.5rem', sm: '1rem', md: '2rem',
      lg: '3rem', xl: '4rem', '2xl': '6rem'
    },
    borderRadius: {
      none: '0', sm: '0.5rem', md: '1rem',
      lg: '1.5rem', xl: '2rem', full: '9999px'
    },
    shadows: {
      none: 'none',
      sm: '0 2px 4px 0 rgb(255 107 157 / 0.1)',
      md: '0 4px 8px 0 rgb(255 107 157 / 0.15)',
      lg: '0 8px 16px 0 rgb(255 107 157 / 0.2)',
      xl: '0 16px 32px 0 rgb(255 107 157 / 0.25)',
      '2xl': '0 32px 64px 0 rgb(255 107 157 / 0.3)'
    },
    borders: {
      thin: '2px', normal: '3px', thick: '5px'
    },
    breakpoints: {
      sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px'
    }
  },

  layoutStructure: {
    type: 'sidebar-both',
    areas: {
      header: { enabled: true, backgroundColor: 'transparent' },
      'sidebar-left': { 
        enabled: true,
        width: '200px',
        backgroundColor: '#FFFFFF',
        sticky: true
      },
      'sidebar-right': { 
        enabled: true,
        width: '200px',
        backgroundColor: '#FFE5EC',
        sticky: false
      },
      main: { enabled: true },
      footer: { enabled: true, backgroundColor: '#FF6B9D' },
      floating: { enabled: true }
    },
    responsive: {
      mobile: 'collapse',
      tablet: 'partial'
    }
  },

  sections: [
    createSection('nav', 'custom', 'Navegación', 'sidebar-left', 1),
    createSection('social', 'custom', 'Social', 'sidebar-right', 2),
    createSection('hero', 'hero', 'Hero', 'main', 3),
    createSection('gallery', 'gallery', 'Galería', 'main', 4),
    createSection('projects', 'projects', 'Proyectos', 'main', 5),
    createSection('testimonials', 'testimonials', 'Testimonios', 'sidebar-right', 6),
    createSection('contact', 'contact', 'Contacto', 'footer', 7)
  ],

  availableSections: ['hero', 'about', 'projects', 'gallery', 'testimonials', 'contact', 'blog'],

  version: '2.0.0',
  author: 'Portfolio Generator',
  tags: ['creative', 'colorful', 'unique', 'dual-sidebar'],
  isBuiltIn: true,
  isPremium: true,

  animations: {
    enabled: true,
    type: 'dynamic'
  },
  darkMode: {
    enabled: false
  }
};

// Array con todas las plantillas avanzadas
export const ADVANCED_BUILT_IN_TEMPLATES: AdvancedTemplate[] = [
  MODERN_GRADIENT_TEMPLATE,
  SIDEBAR_LEFT_TEMPLATE,
  MINIMAL_TEMPLATE,
  CREATIVE_DUAL_TEMPLATE
];

// Helper para obtener plantilla por ID
export const getAdvancedTemplateById = (id: string): AdvancedTemplate | undefined => {
  return ADVANCED_BUILT_IN_TEMPLATES.find(t => t.id === id);
};

// Helper para obtener plantilla por defecto
export const getDefaultAdvancedTemplate = (): AdvancedTemplate => {
  return MODERN_GRADIENT_TEMPLATE;
};
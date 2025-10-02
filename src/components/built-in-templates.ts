// src/components/built-in-templates.ts
import { Template, TemplateSection } from "../types/template-types";

/** Secciones base.
 *  Nota: desactivamos por defecto las que aún no están mapeadas en el TemplateRenderer
 *  (about, experience, contact) para evitar que el usuario active algo que no se renderiza.
 */
const createDefaultSections = (): TemplateSection[] => [
  {
    id: "header",
    name: "Header/Portada",
    enabled: true,
    order: 1,
    props: {},
  },
  {
    id: "about",
    name: "Sobre mí",
    enabled: false, // sin componente aún en el renderer
    order: 2,
    props: {},
  },
  {
    id: "projects",
    name: "Proyectos",
    enabled: true,
    order: 3,
    props: { gridCols: 3 }, // 👈 por defecto 3 columnas
  },
  {
    id: "skills",
    name: "Habilidades",
    enabled: true,
    order: 4,
    props: {},
  },
  {
    id: "experience",
    name: "Experiencia",
    enabled: false, // sin componente aún en el renderer
    order: 5,
    props: {},
  },
  {
    id: "contact",
    name: "Contacto",
    enabled: false, // sin componente aún en el renderer
    order: 6,
    props: {},
  },
  {
    id: "footer",
    name: "Footer",
    enabled: true,
    order: 7,
    props: {},
  },
];

export const MODERN_TEMPLATE: Template = {
  id: "modern",
  name: "Modern",
  description: "Diseño limpio y contemporáneo con gradientes suaves",
  category: "modern",
  preview: "/templates/modern-preview.jpg",
  colors: {
    primary: "#667EEA",
    secondary: "#764BA2",
    accent: "#F093FB",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    text: {
      primary: "#1A202C",
      secondary: "#718096",
      accent: "#667EEA",
    },
    gradient: {
      from: "#667EEA",
      to: "#764BA2",
      direction: "135deg",
    },
  },
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.5rem",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  layout: {
    maxWidth: "1200px",
    spacing: {
      xs: "0.5rem",
      sm: "1rem",
      md: "2rem",
      lg: "3rem",
      xl: "4rem",
    },
    borderRadius: {
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.5rem",
    },
    shadows: {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
    },
  },
  sections: createDefaultSections(),
  version: "1.0.0",
  author: "Portfolio Generator",
  tags: ["modern", "gradient", "clean"],
  isBuiltIn: true,
};

export const MINIMAL_TEMPLATE_BAK: Template = {
  id: "minimal",
  name: "Minimal",
  description: "Diseño minimalista y elegante con espacios blancos",
  category: "minimal",
  preview: "/templates/minimal-preview.jpg",
  colors: {
    primary: "#000000",
    secondary: "#333333",
    accent: "#6366F1",
    background: "#FFFFFF",
    surface: "#FAFAFA",
    text: {
      primary: "#000000",
      secondary: "#666666",
      accent: "#6366F1",
    },
    // sin gradiente por defecto
  },
  typography: {
    fontFamily: {
      primary: "'SF Pro Display', -apple-system, sans-serif",
      heading: "'SF Pro Display', -apple-system, sans-serif",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
      "4xl": "3rem",
    },
    fontWeight: {
      normal: 300,
      medium: 400,
      semibold: 500,
      bold: 600,
    },
  },
  layout: {
    maxWidth: "800px",
    spacing: {
      xs: "0.75rem",
      sm: "1.5rem",
      md: "3rem",
      lg: "4rem",
      xl: "6rem",
    },
    borderRadius: {
      sm: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
    },
    shadows: {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.03)",
      md: "0 2px 4px 0 rgb(0 0 0 / 0.05)",
      lg: "0 4px 8px 0 rgb(0 0 0 / 0.08)",
      xl: "0 8px 16px 0 rgb(0 0 0 / 0.1)",
    },
  },
  sections: createDefaultSections(),
  version: "1.0.0",
  author: "Portfolio Generator",
  tags: ["minimal", "clean", "simple"],
  isBuiltIn: true,
};

export const CREATIVE_TEMPLATE: Template = {
  id: "creative",
  name: "Creative",
  description: "Diseño vibrante y creativo para portfolios artísticos",
  category: "creative",
  preview: "/templates/creative-preview.jpg",
  colors: {
    primary: "#FF6B6B",
    secondary: "#4ECDC4",
    accent: "#FFE66D",
    background: "#FFFFFF",
    surface: "#F8F9FA",
    text: {
      primary: "#2D3436",
      secondary: "#636E72",
      accent: "#FF6B6B",
    },
    gradient: {
      from: "#FF6B6B",
      to: "#4ECDC4",
      direction: "45deg",
    },
  },
  typography: {
    fontFamily: {
      primary: "'Poppins', sans-serif",
      heading: "'Poppins', sans-serif",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.375rem",
      "2xl": "1.75rem",
      "3xl": "2.25rem",
      "4xl": "3rem",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  layout: {
    maxWidth: "1400px",
    spacing: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2.5rem",
      xl: "4rem",
    },
    borderRadius: {
      sm: "0.75rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
    },
    shadows: {
      sm: "0 2px 4px 0 rgb(255 107 107 / 0.1)",
      md: "0 4px 8px 0 rgb(255 107 107 / 0.15)",
      lg: "0 8px 16px 0 rgb(255 107 107 / 0.2)",
      xl: "0 16px 32px 0 rgb(255 107 107 / 0.25)",
    },
  },
  sections: createDefaultSections(),
  version: "1.0.0",
  author: "Portfolio Generator",
  tags: ["creative", "colorful", "artistic"],
  isBuiltIn: true,
};

export const BUILT_IN_TEMPLATES: Template[] = [
  MODERN_TEMPLATE,
  MINIMAL_TEMPLATE_BAK,
  CREATIVE_TEMPLATE,
];

export const getDefaultTemplate = (): Template => MODERN_TEMPLATE;

export const getTemplateById = (id?: string): Template | null => {
  if (!id) return null;
  return BUILT_IN_TEMPLATES.find((t) => t.id === id) || null;
};


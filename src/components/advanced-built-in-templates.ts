// src/components/advanced-built-in-templates.ts
import {
  AdvancedTemplate,
  Section,
  SectionType,
} from "../types/advanced-template-types";

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
  icon: "📄",
  enabled,
  area,
  order,
  config: {
    variant: "default",
    showTitle: true,
    showDivider: false,
    spacing: "normal",
    columns: 1,
  },
});

// SECCIONES para layouts CON header
const SECTIONS_WITH_HEADER: Section[] = [
  createSection("header", "hero", "Header", "header", 1),
  createSection("about", "about", "Sobre mí", "main", 2),
  createSection("projects", "projects", "Proyectos", "main", 3),
  createSection("skills", "skills", "Habilidades", "main", 4),
  createSection("experience", "experience", "Experiencia", "main", 5),
  createSection("contact", "contact", "Contacto", "footer", 6),
];

// SECCIONES para layouts SIN header
const SECTIONS_NO_HEADER: Section[] = [
  createSection("about", "about", "Sobre mí", "main", 1),
  createSection("projects", "projects", "Proyectos", "main", 2),
  createSection("skills", "skills", "Habilidades", "main", 3),
  createSection("experience", "experience", "Experiencia", "main", 4),
  createSection("contact", "contact", "Contacto", "footer", 5),
];

// SECCIONES para sidebar left
const SECTIONS_SIDEBAR_LEFT: Section[] = [
  createSection("about", "about", "Sobre mí", "sidebar-left", 1),
  createSection("contact", "contact", "Contacto", "sidebar-left", 2),
  createSection("projects", "projects", "Proyectos", "main", 3),
  createSection("skills", "skills", "Habilidades", "main", 4),
  createSection("experience", "experience", "Experiencia", "main", 5),
];

// SECCIONES DISPONIBLES
const AVAILABLE_SECTIONS: SectionType[] = [
  "hero",
  "about",
  "projects",
  "skills",
  "experience",
  "education",
  "testimonials",
  "contact",
];

// 1. MODERN GRADIENT
const MODERN_GRADIENT_TEMPLATE: AdvancedTemplate = {
  id: "modern-gradient",
  name: "Modern Gradient",
  description: "Diseño contemporáneo con gradientes suaves y layout tradicional",
  category: "modern",
  preview: "/templates/modern-gradient.jpg",
  
  colors: {
    primary: "#667EEA",
    secondary: "#764BA2",
    accent: "#F093FB",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    surfaceVariant: "#E2E8F0",
    text: {
      primary: "#1A202C",
      secondary: "#718096",
      accent: "#667EEA",
      muted: "#A0AEC0",
      inverse: "#FFFFFF",
    },
    success: "#48BB78",
    warning: "#ED8936",
    error: "#F56565",
    info: "#4299E1",
    gradients: {
      primary: { from: "#667EEA", to: "#764BA2", direction: "135deg" },
      secondary: { from: "#F093FB", to: "#F5576C", direction: "90deg" },
    },
  },

  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, sans-serif",
      heading: "'Inter', -apple-system, sans-serif",
      code: "'JetBrains Mono', code",
    },
    fontSize: {
      xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem",
      xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem",
      "5xl": "3rem", "6xl": "3.75rem",
    },
    fontWeight: {
      thin: 100, light: 300, normal: 400, medium: 500,
      semibold: 600, bold: 700, extrabold: 800, black: 900,
    },
    lineHeight: {
      tight: 1.25, snug: 1.375, normal: 1.5, relaxed: 1.625, loose: 2,
    },
    letterSpacing: {
      tighter: "-0.05em", tight: "-0.025em", normal: "0",
      wide: "0.025em", wider: "0.05em",
    },
  },

  layout: {
    maxWidth: "1200px",
    spacing: {
      xs: "0.5rem", sm: "1rem", md: "1.5rem",
      lg: "2rem", xl: "3rem", "2xl": "4rem",
    },
    borderRadius: {
      none: "0", sm: "0.375rem", md: "0.5rem",
      lg: "0.75rem", xl: "1rem", full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
      "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    },
    borders: { thin: "1px", normal: "2px", thick: "4px" },
    breakpoints: {
      sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px",
    },
  },

  layoutStructure: {
    type: "single-column",
    areas: {
      header: { enabled: true, backgroundColor: "transparent", sticky: true },
      "sidebar-left": { enabled: false },
      "sidebar-right": { enabled: false },
      main: { enabled: true, maxWidth: "1200px" },
      footer: { enabled: true, backgroundColor: "#1A202C", padding: "2rem" },
      floating: { enabled: false },
    },
    responsive: { mobile: "stack", tablet: "full" },
  },

  sections: SECTIONS_WITH_HEADER,
  availableSections: AVAILABLE_SECTIONS,
  version: "2.0.0",
  author: "Portfolio Generator",
  tags: ["gradient", "modern", "clean"],
  isBuiltIn: true,
  isPremium: false,
  animations: { enabled: true, type: "smooth" },
  darkMode: { enabled: false },
};

// 2. SIDEBAR LEFT
const SIDEBAR_LEFT_TEMPLATE: AdvancedTemplate = {
  id: "sidebar-left",
  name: "Sidebar Left Pro",
  description: "Layout profesional con sidebar izquierda fija y navegación persistente",
  category: "business",
  preview: "/templates/sidebar-left.jpg",
  
  colors: {
    primary: "#2D3748",
    secondary: "#4A5568",
    accent: "#3182CE",
    background: "#FFFFFF",
    surface: "#F7FAFC",
    surfaceVariant: "#EDF2F7",
    text: {
      primary: "#1A202C",
      secondary: "#718096",
      accent: "#3182CE",
      muted: "#A0AEC0",
      inverse: "#FFFFFF",
    },
    success: "#38A169",
    warning: "#DD6B20",
    error: "#E53E3E",
    info: "#3182CE",
    gradients: {
      primary: { from: "#2D3748", to: "#4A5568", direction: "180deg" },
    },
  },

  typography: {
    fontFamily: {
      primary: "'Roboto', -apple-system, sans-serif",
      heading: "'Roboto Slab', Georgia, serif",
      code: "'Fira Code', code",
    },
    fontSize: {
      xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem",
      xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem",
      "5xl": "3rem", "6xl": "3.75rem",
    },
    fontWeight: {
      thin: 100, light: 300, normal: 400, medium: 500,
      semibold: 600, bold: 700, extrabold: 800, black: 900,
    },
    lineHeight: {
      tight: 1.25, snug: 1.375, normal: 1.5, relaxed: 1.625, loose: 2,
    },
    letterSpacing: {
      tighter: "-0.05em", tight: "-0.025em", normal: "0",
      wide: "0.025em", wider: "0.05em",
    },
  },

  layout: {
    maxWidth: "1400px",
    spacing: {
      xs: "0.5rem", sm: "1rem", md: "1.5rem",
      lg: "2rem", xl: "3rem", "2xl": "4rem",
    },
    borderRadius: {
      none: "0", sm: "0.25rem", md: "0.5rem",
      lg: "0.75rem", xl: "1rem", full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
      "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    },
    borders: { thin: "1px", normal: "2px", thick: "4px" },
    breakpoints: {
      sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px",
    },
  },

  layoutStructure: {
    type: "sidebar-left",
    areas: {
      header: { enabled: false },
      "sidebar-left": {
        enabled: true,
        width: "280px",
        backgroundColor: "#2D3748",
        sticky: true,
        padding: "2rem",
      },
      "sidebar-right": { enabled: false },
      main: { enabled: true },
      footer: { enabled: true, backgroundColor: "#F7FAFC" },
      floating: { enabled: false },
    },
    responsive: { mobile: "collapse", tablet: "partial" },
  },

  sections: SECTIONS_SIDEBAR_LEFT,
  availableSections: AVAILABLE_SECTIONS,
  version: "2.0.0",
  author: "Portfolio Generator",
  tags: ["sidebar", "professional", "business"],
  isBuiltIn: true,
  isPremium: true,
  animations: { enabled: true, type: "subtle" },
  darkMode: { enabled: true, auto: true },
};

// 3. MINIMAL CLEAN
const MINIMAL_TEMPLATE: AdvancedTemplate = {
  id: "minimal-clean",
  name: "Minimal Clean",
  description: "Diseño minimalista sin header, máxima simplicidad y elegancia",
  category: "minimal",
  preview: "/templates/minimal.jpg",
  
  colors: {
    primary: "#000000",
    secondary: "#333333",
    accent: "#666666",
    background: "#FFFFFF",
    surface: "#FAFAFA",
    surfaceVariant: "#F5F5F5",
    text: {
      primary: "#000000",
      secondary: "#666666",
      accent: "#333333",
      muted: "#999999",
      inverse: "#FFFFFF",
    },
    success: "#2E7D32",
    warning: "#F57C00",
    error: "#C62828",
    info: "#1976D2",
    gradients: {},
  },

  typography: {
    fontFamily: {
      primary: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      heading: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
    fontSize: {
      xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem",
      xl: "1.25rem", "2xl": "1.5rem", "3xl": "2rem", "4xl": "3rem",
      "5xl": "4rem", "6xl": "5rem",
    },
    fontWeight: {
      thin: 100, light: 300, normal: 400, medium: 400,
      semibold: 500, bold: 600, extrabold: 700, black: 800,
    },
    lineHeight: {
      tight: 1.2, snug: 1.3, normal: 1.5, relaxed: 1.7, loose: 2,
    },
    letterSpacing: {
      tighter: "-0.02em", tight: "-0.01em", normal: "0",
      wide: "0.01em", wider: "0.02em",
    },
  },

  layout: {
    maxWidth: "900px",
    spacing: {
      xs: "0.75rem", sm: "1.5rem", md: "3rem",
      lg: "4rem", xl: "6rem", "2xl": "8rem",
    },
    borderRadius: {
      none: "0", sm: "0", md: "0",
      lg: "0.125rem", xl: "0.25rem", full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 2px 4px 0 rgb(0 0 0 / 0.06)",
      lg: "0 4px 8px 0 rgb(0 0 0 / 0.08)",
      xl: "0 8px 16px 0 rgb(0 0 0 / 0.1)",
      "2xl": "0 16px 32px 0 rgb(0 0 0 / 0.12)",
    },
    borders: { thin: "1px", normal: "1px", thick: "2px" },
    breakpoints: {
      sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px",
    },
  },

  layoutStructure: {
    type: "single-column",
    areas: {
      header: { enabled: false },
      "sidebar-left": { enabled: false },
      "sidebar-right": { enabled: false },
      main: { enabled: true, maxWidth: "900px", padding: "4rem 2rem" },
      footer: { enabled: false },
      floating: { enabled: false },
    },
    responsive: { mobile: "stack", tablet: "full" },
  },

  sections: SECTIONS_NO_HEADER,
  availableSections: AVAILABLE_SECTIONS,
  version: "2.0.0",
  author: "Portfolio Generator",
  tags: ["minimal", "clean", "simple", "no-header"],
  isBuiltIn: true,
  isPremium: false,
  animations: { enabled: false, type: "none" },
  darkMode: { enabled: false },
};

// 4. CREATIVE DUAL
const CREATIVE_DUAL_TEMPLATE: AdvancedTemplate = {
  id: "creative-dual",
  name: "Creative Dual Sidebar",
  description: "Diseño creativo con sidebars flotantes a ambos lados",
  category: "creative",
  preview: "/templates/creative-dual.jpg",
  
  colors: {
    primary: "#FF6B9D",
    secondary: "#C44569",
    accent: "#FFC048",
    background: "#FFF5F7",
    surface: "#FFFFFF",
    surfaceVariant: "#FFE5EC",
    text: {
      primary: "#2D3436",
      secondary: "#636E72",
      accent: "#FF6B9D",
      muted: "#B2BEC3",
      inverse: "#FFFFFF",
    },
    success: "#6C5CE7",
    warning: "#FDCB6E",
    error: "#D63031",
    info: "#74B9FF",
    gradients: {
      primary: { from: "#FF6B9D", to: "#C44569", direction: "120deg" },
      accent: { from: "#FFC048", to: "#FF6B9D", direction: "45deg" },
    },
  },

  typography: {
    fontFamily: {
      primary: "'Quicksand', -apple-system, sans-serif",
      heading: "'Playfair Display', Georgia, serif",
    },
    fontSize: {
      xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem",
      xl: "1.25rem", "2xl": "1.5rem", "3xl": "2rem", "4xl": "2.5rem",
      "5xl": "3rem", "6xl": "4rem",
    },
    fontWeight: {
      thin: 100, light: 300, normal: 400, medium: 500,
      semibold: 600, bold: 700, extrabold: 800, black: 900,
    },
    lineHeight: {
      tight: 1.2, snug: 1.4, normal: 1.6, relaxed: 1.8, loose: 2,
    },
    letterSpacing: {
      tighter: "-0.05em", tight: "-0.025em", normal: "0",
      wide: "0.05em", wider: "0.1em",
    },
  },

  layout: {
    maxWidth: "1600px",
    spacing: {
      xs: "0.5rem", sm: "1rem", md: "2rem",
      lg: "3rem", xl: "4rem", "2xl": "6rem",
    },
    borderRadius: {
      none: "0", sm: "0.5rem", md: "1rem",
      lg: "1.5rem", xl: "2rem", full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 2px 4px 0 rgb(255 107 157 / 0.1)",
      md: "0 4px 8px 0 rgb(255 107 157 / 0.15)",
      lg: "0 8px 16px 0 rgb(255 107 157 / 0.2)",
      xl: "0 16px 32px 0 rgb(255 107 157 / 0.25)",
      "2xl": "0 32px 64px 0 rgb(255 107 157 / 0.3)",
    },
    borders: { thin: "2px", normal: "3px", thick: "5px" },
    breakpoints: {
      sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px",
    },
  },

  layoutStructure: {
    type: "sidebar-both",
    areas: {
      header: { enabled: true, backgroundColor: "transparent" },
      "sidebar-left": {
        enabled: true,
        width: "200px",
        backgroundColor: "#FFFFFF",
        sticky: true,
      },
      "sidebar-right": {
        enabled: true,
        width: "200px",
        backgroundColor: "#FFE5EC",
        sticky: false,
      },
      main: { enabled: true },
      footer: { enabled: true, backgroundColor: "#FF6B9D" },
      floating: { enabled: true },
    },
    responsive: { mobile: "collapse", tablet: "partial" },
  },

  sections: SECTIONS_WITH_HEADER,
  availableSections: AVAILABLE_SECTIONS,
  version: "2.0.0",
  author: "Portfolio Generator",
  tags: ["creative", "colorful", "unique", "dual-sidebar"],
  isBuiltIn: true,
  isPremium: true,
  animations: { enabled: true, type: "dynamic" },
  darkMode: { enabled: false },
};

// 5. TECH DARK
const TECH_DARK_TEMPLATE: AdvancedTemplate = {
  id: "tech-dark",
  name: "Tech Dark",
  description: "Tema oscuro profesional ideal para desarrolladores y perfiles técnicos",
  category: "tech",
  preview: "/templates/tech-dark.jpg",
  
  colors: {
    primary: "#00D9FF",
    secondary: "#7B2FFF",
    accent: "#FF2E63",
    background: "#0A0E27",
    surface: "#151934",
    surfaceVariant: "#1E2440",
    text: {
      primary: "#E4E4E7",
      secondary: "#A1A1AA",
      accent: "#00D9FF",
      muted: "#71717A",
      inverse: "#0A0E27",
    },
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    gradients: {
      primary: { from: "#00D9FF", to: "#7B2FFF", direction: "135deg" },
      secondary: { from: "#FF2E63", to: "#7B2FFF", direction: "90deg" },
    },
  },

  typography: {
    fontFamily: {
      primary: "'JetBrains Mono', 'Fira Code', code",
      heading: "'Space Grotesk', system-ui, sans-serif",
      code: "'JetBrains Mono', code",
    },
    fontSize: {
      xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem",
      xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.5rem",
      "5xl": "3rem", "6xl": "4rem",
    },
    fontWeight: {
      thin: 100, light: 300, normal: 400, medium: 500,
      semibold: 600, bold: 700, extrabold: 800, black: 900,
    },
    lineHeight: {
      tight: 1.3, snug: 1.4, normal: 1.6, relaxed: 1.75, loose: 2,
    },
    letterSpacing: {
      tighter: "-0.05em", tight: "-0.025em", normal: "0",
      wide: "0.025em", wider: "0.05em",
    },
  },

  layout: {
    maxWidth: "1280px",
    spacing: {
      xs: "0.5rem", sm: "1rem", md: "1.5rem",
      lg: "2.5rem", xl: "3.5rem", "2xl": "5rem",
    },
    borderRadius: {
      none: "0", sm: "0.5rem", md: "0.75rem",
      lg: "1rem", xl: "1.5rem", full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 0 10px rgb(0 217 255 / 0.1)",
      md: "0 0 20px rgb(0 217 255 / 0.15)",
      lg: "0 0 30px rgb(0 217 255 / 0.2)",
      xl: "0 0 40px rgb(123 47 255 / 0.25)",
      "2xl": "0 0 60px rgb(123 47 255 / 0.3)",
    },
    borders: { thin: "1px", normal: "2px", thick: "3px" },
    breakpoints: {
      sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px",
    },
  },

  layoutStructure: {
    type: "single-column",
    areas: {
      header: { enabled: true, backgroundColor: "#0A0E27", sticky: true },
      "sidebar-left": { enabled: false },
      "sidebar-right": { enabled: false },
      main: { enabled: true, maxWidth: "1280px" },
      footer: { enabled: true, backgroundColor: "#151934", padding: "3rem" },
      floating: { enabled: true },
    },
    responsive: { mobile: "stack", tablet: "full" },
  },

  sections: SECTIONS_WITH_HEADER,
  availableSections: AVAILABLE_SECTIONS,
  version: "2.0.0",
  author: "Portfolio Generator",
  tags: ["dark", "tech", "developer", "modern"],
  isBuiltIn: true,
  isPremium: false,
  animations: { enabled: true, type: "smooth" },
  darkMode: { enabled: true, auto: false },
};
// SECCIONES para Elegant Serif (escritores/creativos)

// 6. ELEGANT SERIF
const ELEGANT_SERIF_TEMPLATE: AdvancedTemplate = {
  id: "elegant-serif",
  name: "Elegant Serif",
  description: "Diseño sofisticado con tipografía serif ideal para escritores y creativos",
  category: "classic",
  preview: "/templates/elegant-serif.jpg",
  
  colors: {
    primary: "#8B4513",
    secondary: "#D2691E",
    accent: "#CD853F",
    background: "#FFF8F0",
    surface: "#FFFFFF",
    surfaceVariant: "#F5E6D3",
    text: {
      primary: "#2C1810",
      secondary: "#6B4423",
      accent: "#8B4513",
      muted: "#A67C52",
      inverse: "#FFF8F0",
    },
    success: "#7C9473",
    warning: "#D4A574",
    error: "#A64D45",
    info: "#6B8CAE",
    gradients: {
      primary: { from: "#D2691E", to: "#8B4513", direction: "180deg" },
    },
  },

  typography: {
    fontFamily: {
      primary: "'Crimson Text', Georgia, serif",
      heading: "'Playfair Display', Georgia, serif",
      code: "'Courier Prime', code",
    },
    fontSize: {
      xs: "0.875rem", sm: "1rem", base: "1.125rem", lg: "1.25rem",
      xl: "1.5rem", "2xl": "1.875rem", "3xl": "2.25rem", "4xl": "3rem",
      "5xl": "3.75rem", "6xl": "4.5rem",
    },
    fontWeight: {
      thin: 200, light: 300, normal: 400, medium: 500,
      semibold: 600, bold: 700, extrabold: 800, black: 900,
    },
    lineHeight: {
      tight: 1.3, snug: 1.5, normal: 1.7, relaxed: 1.9, loose: 2.2,
    },
    letterSpacing: {
      tighter: "-0.03em", tight: "-0.015em", normal: "0",
      wide: "0.02em", wider: "0.04em",
    },
  },

  layout: {
    maxWidth: "800px",
    spacing: {
      xs: "0.75rem", sm: "1.25rem", md: "2rem",
      lg: "3rem", xl: "4.5rem", "2xl": "6rem",
    },
    borderRadius: {
      none: "0", sm: "0.125rem", md: "0.25rem",
      lg: "0.5rem", xl: "0.75rem", full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 2px 4px rgb(139 69 19 / 0.08)",
      md: "0 4px 8px rgb(139 69 19 / 0.12)",
      lg: "0 8px 16px rgb(139 69 19 / 0.16)",
      xl: "0 12px 24px rgb(139 69 19 / 0.2)",
      "2xl": "0 20px 40px rgb(139 69 19 / 0.24)",
    },
    borders: { thin: "1px", normal: "2px", thick: "3px" },
    breakpoints: {
      sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px",
    },
  },

  layoutStructure: {
    type: "single-column",
    areas: {
      header: { enabled: true, backgroundColor: "transparent" },
      "sidebar-left": { enabled: false },
      "sidebar-right": { enabled: false },
      main: { enabled: true, maxWidth: "800px", padding: "3rem 2rem" },
      footer: { enabled: true, backgroundColor: "#F5E6D3", padding: "2rem" },
      floating: { enabled: false },
    },
    responsive: { mobile: "stack", tablet: "full" },
  },

  sections: SECTIONS_WITH_HEADER,
  availableSections: AVAILABLE_SECTIONS,
  version: "2.0.0",
  author: "Portfolio Generator",
  tags: ["elegant", "serif", "writer", "creative"],
  isBuiltIn: true,
  isPremium: false,
  animations: { enabled: true, type: "subtle" },
  darkMode: { enabled: false },
};

// 7. VIBRANT CARDS
const VIBRANT_CARDS_TEMPLATE: AdvancedTemplate = {
  id: "vibrant-cards",
  name: "Vibrant Cards",
  description: "Diseño dinámico con tarjetas coloridas y layout de mosaico",
  category: "creative",
  preview: "/templates/vibrant-cards.jpg",
  
// Continuación de VIBRANT_CARDS_TEMPLATE

  colors: {
    primary: "#8E2DE2",
    secondary: "#4A00E0",
    accent: "#FF6B35",
    background: "#F0F4F8",
    surface: "#FFFFFF",
    surfaceVariant: "#E4E9F0",
    text: {
      primary: "#1A1A2E",
      secondary: "#4A5568",
      accent: "#8E2DE2",
      muted: "#718096",
      inverse: "#FFFFFF",
    },
    success: "#00C9A7",
    warning: "#FFD700",
    error: "#FF5A5F",
    info: "#00B8D4",
    gradients: {
      primary: { from: "#8E2DE2", to: "#4A00E0", direction: "135deg" },
      accent: { from: "#FF6B35", to: "#F7931E", direction: "90deg" },
    },
  },

  typography: {
    fontFamily: {
      primary: "'DM Sans', system-ui, sans-serif",
      heading: "'Outfit', system-ui, sans-serif",
      code: "'IBM Plex Mono', code",
    },
    fontSize: {
      xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem",
      xl: "1.25rem", "2xl": "1.5rem", "3xl": "2rem", "4xl": "2.5rem",
      "5xl": "3.5rem", "6xl": "4.5rem",
    },
    fontWeight: {
      thin: 100, light: 300, normal: 400, medium: 500,
      semibold: 600, bold: 700, extrabold: 800, black: 900,
    },
    lineHeight: {
      tight: 1.25, snug: 1.4, normal: 1.6, relaxed: 1.75, loose: 2,
    },
    letterSpacing: {
      tighter: "-0.04em", tight: "-0.02em", normal: "0",
      wide: "0.03em", wider: "0.06em",
    },
  },

  layout: {
    maxWidth: "1400px",
    spacing: {
      xs: "0.5rem", sm: "1rem", md: "1.5rem",
      lg: "2rem", xl: "3rem", "2xl": "4rem",
    },
    borderRadius: {
      none: "0", sm: "0.75rem", md: "1rem",
      lg: "1.5rem", xl: "2rem", full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 4px 6px rgb(142 45 226 / 0.1)",
      md: "0 8px 16px rgb(142 45 226 / 0.15)",
      lg: "0 16px 32px rgb(142 45 226 / 0.2)",
      xl: "0 24px 48px rgb(142 45 226 / 0.25)",
      "2xl": "0 32px 64px rgb(142 45 226 / 0.3)",
    },
    borders: { thin: "2px", normal: "3px", thick: "4px" },
    breakpoints: {
      sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px",
    },
  },

  layoutStructure: {
    type: "three-column",
    areas: {
      header: { enabled: true, backgroundColor: "transparent" },
      "sidebar-left": { enabled: false },
      "sidebar-right": { enabled: false },
      main: { enabled: true, maxWidth: "1400px" },
      footer: { enabled: true, backgroundColor: "#1A1A2E", padding: "3rem" },
      floating: { enabled: true },
    },
    responsive: { mobile: "stack", tablet: "full" },
  },

  sections: SECTIONS_WITH_HEADER,
  availableSections: AVAILABLE_SECTIONS,
  version: "2.0.0",
  author: "Portfolio Generator",
  tags: ["vibrant", "colorful", "cards", "creative"],
  isBuiltIn: true,
  isPremium: true,
  animations: { enabled: true, type: "dynamic" },
  darkMode: { enabled: false },
};

// 8. CORPORATE BLUE
const CORPORATE_BLUE_TEMPLATE: AdvancedTemplate = {
  id: "corporate-blue",
  name: "Corporate Blue",
  description: "Diseño profesional corporativo en tonos azules con sidebar derecha",
  category: "business",
  preview: "/templates/corporate-blue.jpg",
  
  colors: {
    primary: "#1E3A8A",
    secondary: "#3B82F6",
    accent: "#0EA5E9",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceVariant: "#E2E8F0",
    text: {
      primary: "#0F172A",
      secondary: "#475569",
      accent: "#1E3A8A",
      muted: "#94A3B8",
      inverse: "#FFFFFF",
    },
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    gradients: {
      primary: { from: "#1E3A8A", to: "#3B82F6", direction: "135deg" },
    },
  },

  typography: {
    fontFamily: {
      primary: "'IBM Plex Sans', system-ui, sans-serif",
      heading: "'IBM Plex Sans', system-ui, sans-serif",
      code: "'IBM Plex Mono', code",
    },
    fontSize: {
      xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem",
      xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem",
      "5xl": "3rem", "6xl": "3.75rem",
    },
    fontWeight: {
      thin: 100, light: 300, normal: 400, medium: 500,
      semibold: 600, bold: 700, extrabold: 800, black: 900,
    },
    lineHeight: {
      tight: 1.25, snug: 1.375, normal: 1.5, relaxed: 1.625, loose: 2,
    },
    letterSpacing: {
      tighter: "-0.05em", tight: "-0.025em", normal: "0",
      wide: "0.025em", wider: "0.05em",
    },
  },

  layout: {
    maxWidth: "1440px",
    spacing: {
      xs: "0.5rem", sm: "1rem", md: "1.5rem",
      lg: "2rem", xl: "3rem", "2xl": "4rem",
    },
    borderRadius: {
      none: "0", sm: "0.375rem", md: "0.5rem",
      lg: "0.75rem", xl: "1rem", full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 1px 3px rgb(0 0 0 / 0.1)",
      md: "0 4px 6px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px rgb(0 0 0 / 0.1)",
      "2xl": "0 25px 50px rgb(0 0 0 / 0.15)",
    },
    borders: { thin: "1px", normal: "2px", thick: "3px" },
    breakpoints: {
      sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px",
    },
  },

  layoutStructure: {
    type: "sidebar-right",
    areas: {
      header: { enabled: true, backgroundColor: "#1E3A8A", sticky: true },
      "sidebar-left": { enabled: false },
      "sidebar-right": {
        enabled: true,
        width: "320px",
        backgroundColor: "#F8FAFC",
        sticky: true,
        padding: "2rem",
      },
      main: { enabled: true },
      footer: { enabled: true, backgroundColor: "#0F172A", padding: "3rem" },
      floating: { enabled: false },
    },
    responsive: { mobile: "collapse", tablet: "partial" },
  },

  sections: SECTIONS_WITH_HEADER,
  availableSections: AVAILABLE_SECTIONS,
  version: "2.0.0",
  author: "Portfolio Generator",
  tags: ["corporate", "professional", "business", "blue"],
  isBuiltIn: true,
  isPremium: false,
  animations: { enabled: true, type: "subtle" },
  darkMode: { enabled: false },
};

// 9. WARM SUNSET
const WARM_SUNSET_TEMPLATE: AdvancedTemplate = {
  id: "warm-sunset",
  name: "Warm Sunset",
  description: "Paleta de colores cálidos con gradientes tipo atardecer",
  category: "creative",
  preview: "/templates/warm-sunset.jpg",
  
  colors: {
    primary: "#FF6B6B",
    secondary: "#FFE66D",
    accent: "#FF8E53",
    background: "#FFF5E6",
    surface: "#FFFFFF",
    surfaceVariant: "#FFE4CC",
    text: {
      primary: "#4A4A4A",
      secondary: "#7A7A7A",
      accent: "#FF6B6B",
      muted: "#A0A0A0",
      inverse: "#FFFFFF",
    },
    success: "#4ECDC4",
    warning: "#F7B731",
    error: "#EE5A6F",
    info: "#70A1FF",
    gradients: {
      primary: { from: "#FF6B6B", to: "#FFE66D", direction: "135deg" },
      accent: { from: "#FF8E53", to: "#FE6B8B", direction: "90deg" },
    },
  },

  typography: {
    fontFamily: {
      primary: "'Nunito', system-ui, sans-serif",
      heading: "'Poppins', system-ui, sans-serif",
      code: "'Roboto Mono', code",
    },
    fontSize: {
      xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem",
      xl: "1.25rem", "2xl": "1.5rem", "3xl": "2rem", "4xl": "2.75rem",
      "5xl": "3.5rem", "6xl": "4.5rem",
    },
    fontWeight: {
      thin: 200, light: 300, normal: 400, medium: 600,
      semibold: 700, bold: 800, extrabold: 900, black: 900,
    },
    lineHeight: {
      tight: 1.2, snug: 1.4, normal: 1.6, relaxed: 1.8, loose: 2,
    },
    letterSpacing: {
      tighter: "-0.04em", tight: "-0.02em", normal: "0",
      wide: "0.02em", wider: "0.04em",
    },
  },

  layout: {
    maxWidth: "1200px",
    spacing: {
      xs: "0.5rem", sm: "1rem", md: "1.75rem",
      lg: "2.5rem", xl: "3.5rem", "2xl": "5rem",
    },
    borderRadius: {
      none: "0", sm: "0.625rem", md: "1rem",
      lg: "1.5rem", xl: "2rem", full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 2px 8px rgb(255 107 107 / 0.15)",
      md: "0 4px 12px rgb(255 107 107 / 0.2)",
      lg: "0 8px 24px rgb(255 107 107 / 0.25)",
      xl: "0 16px 40px rgb(255 107 107 / 0.3)",
      "2xl": "0 24px 56px rgb(255 107 107 / 0.35)",
    },
    borders: { thin: "2px", normal: "3px", thick: "4px" },
    breakpoints: {
      sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px",
    },
  },

  layoutStructure: {
    type: "single-column",
    areas: {
      header: { enabled: true, backgroundColor: "transparent" },
      "sidebar-left": { enabled: false },
      "sidebar-right": { enabled: false },
      main: { enabled: true, maxWidth: "1200px" },
      footer: { enabled: true, backgroundColor: "#FF6B6B", padding: "3rem" },
      floating: { enabled: true },
    },
    responsive: { mobile: "stack", tablet: "full" },
  },

  sections: SECTIONS_WITH_HEADER,
  availableSections: AVAILABLE_SECTIONS,
  version: "2.0.0",
  author: "Portfolio Generator",
  tags: ["warm", "sunset", "creative", "colorful"],
  isBuiltIn: true,
  isPremium: false,
  animations: { enabled: true, type: "smooth" },
  darkMode: { enabled: false },
};

// 10. MONOCHROME GRID
const MONOCHROME_GRID_TEMPLATE: AdvancedTemplate = {
  id: "monochrome-grid",
  name: "Monochrome Grid",
  description: "Diseño minimalista en blanco y negro con layout de cuadrícula",
  category: "minimal",
  preview: "/templates/monochrome-grid.jpg",
  
  colors: {
    primary: "#000000",
    secondary: "#1A1A1A",
    accent: "#404040",
    background: "#FFFFFF",
    surface: "#F5F5F5",
    surfaceVariant: "#E5E5E5",
    text: {
      primary: "#000000",
      secondary: "#404040",
      accent: "#1A1A1A",
      muted: "#737373",
      inverse: "#FFFFFF",
    },
    success: "#000000",
    warning: "#404040",
    error: "#000000",
    info: "#1A1A1A",
    gradients: {},
  },

  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, sans-serif",
      heading: "'Syne', system-ui, sans-serif",
      code: "'Space Mono', code",
    },
    fontSize: {
      xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem",
      xl: "1.375rem", "2xl": "1.75rem", "3xl": "2.25rem", "4xl": "3rem",
      "5xl": "4rem", "6xl": "5rem",
    },
    fontWeight: {
      thin: 100, light: 300, normal: 400, medium: 500,
      semibold: 600, bold: 700, extrabold: 800, black: 900,
    },
    lineHeight: {
      tight: 1.1, snug: 1.3, normal: 1.5, relaxed: 1.7, loose: 2,
    },
    letterSpacing: {
      tighter: "-0.05em", tight: "-0.025em", normal: "0",
      wide: "0.025em", wider: "0.05em",
    },
  },

  layout: {
    maxWidth: "1600px",
    spacing: {
      xs: "0.5rem", sm: "1rem", md: "2rem",
      lg: "3rem", xl: "5rem", "2xl": "7rem",
    },
    borderRadius: {
      none: "0", sm: "0", md: "0",
      lg: "0", xl: "0", full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 0 0 1px rgba(0,0,0,0.05)",
      md: "0 0 0 1px rgba(0,0,0,0.1)",
      lg: "0 0 0 2px rgba(0,0,0,0.15)",
      xl: "0 0 0 3px rgba(0,0,0,0.2)",
      "2xl": "0 0 0 4px rgba(0,0,0,0.25)",
    },
    borders: { thin: "1px", normal: "2px", thick: "4px" },
    breakpoints: {
      sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px",
    },
  },

  layoutStructure: {
    type: "two-column",
    areas: {
      header: { enabled: true, backgroundColor: "#000000", sticky: false },
      "sidebar-left": { enabled: false },
      "sidebar-right": { enabled: false },
      main: { enabled: true, maxWidth: "1600px" },
      footer: { enabled: true, backgroundColor: "#000000", padding: "4rem" },
      floating: { enabled: false },
    },
    responsive: { mobile: "stack", tablet: "full" },
  },

  sections: SECTIONS_WITH_HEADER,
  availableSections: AVAILABLE_SECTIONS,
  version: "2.0.0",
  author: "Portfolio Generator",
  tags: ["monochrome", "minimal", "grid", "black-white"],
  isBuiltIn: true,
  isPremium: false,
  animations: { enabled: false, type: "none" },
  darkMode: { enabled: false },
};

// Array con todas las plantillas
export const ADVANCED_BUILT_IN_TEMPLATES: AdvancedTemplate[] = [
  MODERN_GRADIENT_TEMPLATE,
  SIDEBAR_LEFT_TEMPLATE,
  MINIMAL_TEMPLATE,
  CREATIVE_DUAL_TEMPLATE,
  TECH_DARK_TEMPLATE,
  ELEGANT_SERIF_TEMPLATE,
  VIBRANT_CARDS_TEMPLATE,
  CORPORATE_BLUE_TEMPLATE,
  WARM_SUNSET_TEMPLATE,
  MONOCHROME_GRID_TEMPLATE,
];

// Helpers
export const getAdvancedTemplateById = (id: string): AdvancedTemplate | undefined => {
  return ADVANCED_BUILT_IN_TEMPLATES.find((t) => t.id === id);
};

export const getDefaultAdvancedTemplate = (): AdvancedTemplate => {
  return MODERN_GRADIENT_TEMPLATE;
};
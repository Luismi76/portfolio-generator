// src/templates/advanced/modern/modern-gradient.ts
import { AdvancedTemplate } from "../../../types/advanced-template-types";
import { SECTIONS_WITH_HEADER, AVAILABLE_SECTIONS } from "../helpers/section-presets";

/**
 * MODERN GRADIENT TEMPLATE
 * Diseño contemporáneo con gradientes suaves y layout tradicional
 */
export const MODERN_GRADIENT_TEMPLATE: AdvancedTemplate = {
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
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
    },
    fontWeight: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em",
      wider: "0.05em",
    },
  },

  layout: {
    maxWidth: "1200px",
    spacing: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "3rem",
      "2xl": "4rem",
    },
    borderRadius: {
      none: "0",
      sm: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
      "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    },
    borders: {
      thin: "1px",
      normal: "2px",
      thick: "4px",
    },
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },

  layoutStructure: {
    type: "single-column",
    areas: {
      header: {
        enabled: true,
        backgroundColor: "transparent",
        sticky: true,
      },
      "sidebar-left": {
        enabled: false,
      },
      "sidebar-right": {
        enabled: false,
      },
      main: {
        enabled: true,
        maxWidth: "1200px",
      },
      footer: {
        enabled: true,
        backgroundColor: "#1A202C",
        padding: "2rem",
      },
      floating: {
        enabled: false,
      },
    },
    responsive: {
      mobile: "stack",
      tablet: "full",
    },
  },

  sections: SECTIONS_WITH_HEADER,
  availableSections: AVAILABLE_SECTIONS,
  version: "2.0.0",
  author: "Portfolio Generator",
  tags: ["gradient", "modern", "clean"],
  isBuiltIn: true,
  isPremium: false,
  animations: {
    enabled: true,
    type: "smooth",
  },
  darkMode: {
    enabled: false,
  },
};
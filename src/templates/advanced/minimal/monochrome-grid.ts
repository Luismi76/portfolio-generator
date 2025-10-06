// src/templates/advanced/minimal/monochrome-grid.ts
import { AdvancedTemplate } from "../../../types/advanced-template-types";
import { SECTIONS_WITH_HEADER, AVAILABLE_SECTIONS } from "../helpers/section-presets";

/**
 * MONOCHROME GRID TEMPLATE
 * Diseño minimalista en blanco y negro con layout de cuadrícula
 */
export const MONOCHROME_GRID_TEMPLATE: AdvancedTemplate = {
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
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.375rem",
      "2xl": "1.75rem",
      "3xl": "2.25rem",
      "4xl": "3rem",
      "5xl": "4rem",
      "6xl": "5rem",
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
      tight: 1.1,
      snug: 1.3,
      normal: 1.5,
      relaxed: 1.7,
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
    maxWidth: "1600px",
    spacing: {
      xs: "0.5rem",
      sm: "1rem",
      md: "2rem",
      lg: "3rem",
      xl: "5rem",
      "2xl": "7rem",
    },
    borderRadius: {
      none: "0",
      sm: "0",
      md: "0",
      lg: "0",
      xl: "0",
      full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 0 0 1px rgba(0,0,0,0.05)",
      md: "0 0 0 1px rgba(0,0,0,0.1)",
      lg: "0 0 0 2px rgba(0,0,0,0.15)",
      xl: "0 0 0 3px rgba(0,0,0,0.2)",
      "2xl": "0 0 0 4px rgba(0,0,0,0.25)",
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
    type: "two-column",
    areas: {
      header: {
        enabled: true,
        backgroundColor: "#000000",
        sticky: false,
      },
      "sidebar-left": {
        enabled: false,
      },
      "sidebar-right": {
        enabled: false,
      },
      main: {
        enabled: true,
        maxWidth: "1600px",
      },
      footer: {
        enabled: true,
        backgroundColor: "#000000",
        padding: "4rem",
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
  tags: ["monochrome", "minimal", "grid", "black-white"],
  isBuiltIn: true,
  isPremium: false,
  animations: {
    enabled: false,
    type: "none",
  },
  darkMode: {
    enabled: false,
  },
};
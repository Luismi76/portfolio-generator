// src/templates/advanced/minimal/minimal-clean.ts
import { AdvancedTemplate } from "../../../types/advanced-template-types";
import { SECTIONS_NO_HEADER, AVAILABLE_SECTIONS } from "../helpers/section-presets";

/**
 * MINIMAL CLEAN TEMPLATE
 * Diseño minimalista sin header, máxima simplicidad y elegancia
 */
export const MINIMAL_TEMPLATE: AdvancedTemplate = {
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
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
      "4xl": "3rem",
      "5xl": "4rem",
      "6xl": "5rem",
    },
    fontWeight: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 400,
      semibold: 500,
      bold: 600,
      extrabold: 700,
      black: 800,
    },
    lineHeight: {
      tight: 1.2,
      snug: 1.3,
      normal: 1.5,
      relaxed: 1.7,
      loose: 2,
    },
    letterSpacing: {
      tighter: "-0.02em",
      tight: "-0.01em",
      normal: "0",
      wide: "0.01em",
      wider: "0.02em",
    },
  },

  layout: {
    maxWidth: "900px",
    spacing: {
      xs: "0.75rem",
      sm: "1.5rem",
      md: "3rem",
      lg: "4rem",
      xl: "6rem",
      "2xl": "8rem",
    },
    borderRadius: {
      none: "0",
      sm: "0",
      md: "0",
      lg: "0.125rem",
      xl: "0.25rem",
      full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 2px 4px 0 rgb(0 0 0 / 0.06)",
      lg: "0 4px 8px 0 rgb(0 0 0 / 0.08)",
      xl: "0 8px 16px 0 rgb(0 0 0 / 0.1)",
      "2xl": "0 16px 32px 0 rgb(0 0 0 / 0.12)",
    },
    borders: {
      thin: "1px",
      normal: "1px",
      thick: "2px",
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
        enabled: false,
      },
      "sidebar-left": {
        enabled: false,
      },
      "sidebar-right": {
        enabled: false,
      },
      main: {
        enabled: true,
        maxWidth: "900px",
        padding: "4rem 2rem",
      },
      footer: {
        enabled: false,
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

  sections: SECTIONS_NO_HEADER,
  availableSections: AVAILABLE_SECTIONS,
  version: "2.0.0",
  author: "Portfolio Generator",
  tags: ["minimal", "clean", "simple", "no-header"],
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
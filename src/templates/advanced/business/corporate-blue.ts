// src/templates/advanced/business/corporate-blue.ts
import { AdvancedTemplate } from "../../../types/advanced-template-types";
import { SECTIONS_WITH_HEADER, AVAILABLE_SECTIONS } from "../helpers/section-presets";

/**
 * CORPORATE BLUE TEMPLATE
 * Diseño profesional corporativo en tonos azules con sidebar derecha
 */
export const CORPORATE_BLUE_TEMPLATE: AdvancedTemplate = {
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
    maxWidth: "1440px",
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
      sm: "0 1px 3px rgb(0 0 0 / 0.1)",
      md: "0 4px 6px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px rgb(0 0 0 / 0.1)",
      "2xl": "0 25px 50px rgb(0 0 0 / 0.15)",
    },
    borders: {
      thin: "1px",
      normal: "2px",
      thick: "3px",
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
    type: "sidebar-right",
    areas: {
      header: {
        enabled: true,
        backgroundColor: "#1E3A8A",
        sticky: true,
      },
      "sidebar-left": {
        enabled: false,
      },
      "sidebar-right": {
        enabled: true,
        width: "320px",
        backgroundColor: "#F8FAFC",
        sticky: true,
        padding: "2rem",
      },
      main: {
        enabled: true,
      },
      footer: {
        enabled: true,
        backgroundColor: "#0F172A",
        padding: "3rem",
      },
      floating: {
        enabled: false,
      },
    },
    responsive: {
      mobile: "collapse",
      tablet: "partial",
    },
  },

  sections: SECTIONS_WITH_HEADER,
  availableSections: AVAILABLE_SECTIONS,
  version: "2.0.0",
  author: "Portfolio Generator",
  tags: ["corporate", "professional", "business", "blue"],
  isBuiltIn: true,
  isPremium: false,
  animations: {
    enabled: true,
    type: "subtle",
  },
  darkMode: {
    enabled: false,
  },
};
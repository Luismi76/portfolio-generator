// src/templates/advanced/business/sidebar-left.ts
import { AdvancedTemplate } from "../../../types/advanced-template-types";
import { SECTIONS_SIDEBAR_LEFT, AVAILABLE_SECTIONS } from "../helpers/section-presets";

/**
 * SIDEBAR LEFT PRO TEMPLATE
 * Layout profesional con sidebar izquierda fija y navegación persistente
 */
export const SIDEBAR_LEFT_TEMPLATE: AdvancedTemplate = {
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
    maxWidth: "1400px",
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
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
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
    type: "sidebar-left",
    areas: {
      header: {
        enabled: false,
      },
      "sidebar-left": {
        enabled: true,
        width: "280px",
        backgroundColor: "#2D3748",
        sticky: true,
        padding: "2rem",
      },
      "sidebar-right": {
        enabled: false,
      },
      main: {
        enabled: true,
      },
      footer: {
        enabled: true,
        backgroundColor: "#F7FAFC",
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

  sections: SECTIONS_SIDEBAR_LEFT,
  availableSections: AVAILABLE_SECTIONS,
  version: "2.0.0",
  author: "Portfolio Generator",
  tags: ["sidebar", "professional", "business"],
  isBuiltIn: true,
  isPremium: true,
  animations: {
    enabled: true,
    type: "subtle",
  },
  darkMode: {
    enabled: true,
    auto: true,
  },
};
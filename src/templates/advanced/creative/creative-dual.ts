// src/templates/advanced/creative/creative-dual.ts
import { AdvancedTemplate } from "../../../types/advanced-template-types";
import { SECTIONS_WITH_HEADER, AVAILABLE_SECTIONS } from "../helpers/section-presets";

/**
 * CREATIVE DUAL TEMPLATE
 * Diseño creativo con sidebars flotantes a ambos lados
 */
export const CREATIVE_DUAL_TEMPLATE: AdvancedTemplate = {
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
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
      "4xl": "2.5rem",
      "5xl": "3rem",
      "6xl": "4rem",
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
      tight: 1.2,
      snug: 1.4,
      normal: 1.6,
      relaxed: 1.8,
      loose: 2,
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0",
      wide: "0.05em",
      wider: "0.1em",
    },
  },

  layout: {
    maxWidth: "1600px",
    spacing: {
      xs: "0.5rem",
      sm: "1rem",
      md: "2rem",
      lg: "3rem",
      xl: "4rem",
      "2xl": "6rem",
    },
    borderRadius: {
      none: "0",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 2px 4px 0 rgb(255 107 157 / 0.1)",
      md: "0 4px 8px 0 rgb(255 107 157 / 0.15)",
      lg: "0 8px 16px 0 rgb(255 107 157 / 0.2)",
      xl: "0 16px 32px 0 rgb(255 107 157 / 0.25)",
      "2xl": "0 32px 64px 0 rgb(255 107 157 / 0.3)",
    },
    borders: {
      thin: "2px",
      normal: "3px",
      thick: "5px",
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
    type: "sidebar-both",
    areas: {
      header: {
        enabled: true,
        backgroundColor: "transparent",
      },
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
      main: {
        enabled: true,
      },
      footer: {
        enabled: true,
        backgroundColor: "#FF6B9D",
      },
      floating: {
        enabled: true,
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
  tags: ["creative", "colorful", "unique", "dual-sidebar"],
  isBuiltIn: true,
  isPremium: true,
  animations: {
    enabled: true,
    type: "dynamic",
  },
  darkMode: {
    enabled: false,
  },
};
// src/templates/advanced/creative/vibrant-cards.ts
import { AdvancedTemplate } from "../../../types/advanced-template-types";
import { SECTIONS_WITH_HEADER, AVAILABLE_SECTIONS } from "../helpers/section-presets";

/**
 * VIBRANT CARDS TEMPLATE
 * Diseño dinámico con tarjetas coloridas y layout de mosaico
 */
export const VIBRANT_CARDS_TEMPLATE: AdvancedTemplate = {
  id: "vibrant-cards",
  name: "Vibrant Cards",
  description: "Diseño dinámico con tarjetas coloridas y layout de mosaico",
  category: "creative",
  preview: "/templates/vibrant-cards.jpg",
  
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
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
      "4xl": "2.5rem",
      "5xl": "3.5rem",
      "6xl": "4.5rem",
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
      snug: 1.4,
      normal: 1.6,
      relaxed: 1.75,
      loose: 2,
    },
    letterSpacing: {
      tighter: "-0.04em",
      tight: "-0.02em",
      normal: "0",
      wide: "0.03em",
      wider: "0.06em",
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
      sm: "0.75rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 4px 6px rgb(142 45 226 / 0.1)",
      md: "0 8px 16px rgb(142 45 226 / 0.15)",
      lg: "0 16px 32px rgb(142 45 226 / 0.2)",
      xl: "0 24px 48px rgb(142 45 226 / 0.25)",
      "2xl": "0 32px 64px rgb(142 45 226 / 0.3)",
    },
    borders: {
      thin: "2px",
      normal: "3px",
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
    type: "three-column",
    areas: {
      header: {
        enabled: true,
        backgroundColor: "transparent",
      },
      "sidebar-left": {
        enabled: false,
      },
      "sidebar-right": {
        enabled: false,
      },
      main: {
        enabled: true,
        maxWidth: "1400px",
      },
      footer: {
        enabled: true,
        backgroundColor: "#1A1A2E",
        padding: "3rem",
      },
      floating: {
        enabled: true,
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
  tags: ["vibrant", "colorful", "cards", "creative"],
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
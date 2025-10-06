// src/templates/advanced/creative/warm-sunset.ts
import { AdvancedTemplate } from "../../../types/advanced-template-types";
import { SECTIONS_WITH_HEADER, AVAILABLE_SECTIONS } from "../helpers/section-presets";

/**
 * WARM SUNSET TEMPLATE
 * Paleta de colores cálidos con gradientes tipo atardecer
 */
export const WARM_SUNSET_TEMPLATE: AdvancedTemplate = {
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
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
      "4xl": "2.75rem",
      "5xl": "3.5rem",
      "6xl": "4.5rem",
    },
    fontWeight: {
      thin: 200,
      light: 300,
      normal: 400,
      medium: 600,
      semibold: 700,
      bold: 800,
      extrabold: 900,
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
      tighter: "-0.04em",
      tight: "-0.02em",
      normal: "0",
      wide: "0.02em",
      wider: "0.04em",
    },
  },

  layout: {
    maxWidth: "1200px",
    spacing: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.75rem",
      lg: "2.5rem",
      xl: "3.5rem",
      "2xl": "5rem",
    },
    borderRadius: {
      none: "0",
      sm: "0.625rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 2px 8px rgb(255 107 107 / 0.15)",
      md: "0 4px 12px rgb(255 107 107 / 0.2)",
      lg: "0 8px 24px rgb(255 107 107 / 0.25)",
      xl: "0 16px 40px rgb(255 107 107 / 0.3)",
      "2xl": "0 24px 56px rgb(255 107 107 / 0.35)",
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
    type: "single-column",
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
        maxWidth: "1200px",
      },
      footer: {
        enabled: true,
        backgroundColor: "#FF6B6B",
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
  tags: ["warm", "sunset", "creative", "colorful"],
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
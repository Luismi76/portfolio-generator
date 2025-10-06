// src/templates/advanced/classic/elegant-serif.ts
import { AdvancedTemplate } from "../../../types/advanced-template-types";
import { SECTIONS_WITH_HEADER, AVAILABLE_SECTIONS } from "../helpers/section-presets";

/**
 * ELEGANT SERIF TEMPLATE
 * Diseño sofisticado con tipografía serif ideal para escritores y creativos
 */
export const ELEGANT_SERIF_TEMPLATE: AdvancedTemplate = {
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
      xs: "0.875rem",
      sm: "1rem",
      base: "1.125rem",
      lg: "1.25rem",
      xl: "1.5rem",
      "2xl": "1.875rem",
      "3xl": "2.25rem",
      "4xl": "3rem",
      "5xl": "3.75rem",
      "6xl": "4.5rem",
    },
    fontWeight: {
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      tight: 1.3,
      snug: 1.5,
      normal: 1.7,
      relaxed: 1.9,
      loose: 2.2,
    },
    letterSpacing: {
      tighter: "-0.03em",
      tight: "-0.015em",
      normal: "0",
      wide: "0.02em",
      wider: "0.04em",
    },
  },

  layout: {
    maxWidth: "800px",
    spacing: {
      xs: "0.75rem",
      sm: "1.25rem",
      md: "2rem",
      lg: "3rem",
      xl: "4.5rem",
      "2xl": "6rem",
    },
    borderRadius: {
      none: "0",
      sm: "0.125rem",
      md: "0.25rem",
      lg: "0.5rem",
      xl: "0.75rem",
      full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 2px 4px rgb(139 69 19 / 0.08)",
      md: "0 4px 8px rgb(139 69 19 / 0.12)",
      lg: "0 8px 16px rgb(139 69 19 / 0.16)",
      xl: "0 12px 24px rgb(139 69 19 / 0.2)",
      "2xl": "0 20px 40px rgb(139 69 19 / 0.24)",
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
        maxWidth: "800px",
        padding: "3rem 2rem",
      },
      footer: {
        enabled: true,
        backgroundColor: "#F5E6D3",
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
  tags: ["elegant", "serif", "writer", "creative"],
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
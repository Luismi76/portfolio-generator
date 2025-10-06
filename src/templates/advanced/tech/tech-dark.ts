// src/templates/advanced/tech/tech-dark.ts
import { AdvancedTemplate } from "../../../types/advanced-template-types";
import { SECTIONS_WITH_HEADER, AVAILABLE_SECTIONS } from "../helpers/section-presets";

/**
 * TECH DARK TEMPLATE
 * Tema oscuro profesional ideal para desarrolladores y perfiles técnicos
 */
export const TECH_DARK_TEMPLATE: AdvancedTemplate = {
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
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
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
      tight: 1.3,
      snug: 1.4,
      normal: 1.6,
      relaxed: 1.75,
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
    maxWidth: "1280px",
    spacing: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2.5rem",
      xl: "3.5rem",
      "2xl": "5rem",
    },
    borderRadius: {
      none: "0",
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.5rem",
      full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 0 10px rgb(0 217 255 / 0.1)",
      md: "0 0 20px rgb(0 217 255 / 0.15)",
      lg: "0 0 30px rgb(0 217 255 / 0.2)",
      xl: "0 0 40px rgb(123 47 255 / 0.25)",
      "2xl": "0 0 60px rgb(123 47 255 / 0.3)",
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
        backgroundColor: "#0A0E27",
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
        maxWidth: "1280px",
      },
      footer: {
        enabled: true,
        backgroundColor: "#151934",
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
  tags: ["dark", "tech", "developer", "modern"],
  isBuiltIn: true,
  isPremium: false,
  animations: {
    enabled: true,
    type: "smooth",
  },
  darkMode: {
    enabled: true,
    auto: false,
  },
};
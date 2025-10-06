// src/export/constants/defaults.ts

/**
 * Colores por defecto para templates
 */
export const DEFAULT_COLORS = {
  primary: "#2563eb",
  secondary: "#7c3aed",
  accent: "#10b981",
  background: "#ffffff",
  surface: "#ffffff",
  text: {
    primary: "#111827",
    secondary: "#374151",
    accent: "#2563eb",
  },
} as const;

/**
 * Tipografía por defecto
 */
export const DEFAULT_TYPOGRAPHY = {
  fontFamily: {
    primary:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    heading:
      "Poppins, Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    code: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
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
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

/**
 * Layout por defecto
 */
export const DEFAULT_LAYOUT = {
  maxWidth: "1200px",
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "40px",
  },
  borderRadius: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    xl: "24px",
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.06)",
    md: "0 4px 8px rgba(0,0,0,0.08)",
    lg: "0 10px 20px rgba(0,0,0,0.12)",
    xl: "0 20px 40px rgba(0,0,0,0.14)",
  },
} as const;
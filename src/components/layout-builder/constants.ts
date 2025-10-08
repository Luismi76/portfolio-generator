// layout-builder/constants.ts
import type { LayoutArea, AreaConfig } from "@/types/advanced-template-types";

/**
 * Configuración por defecto de las áreas del layout
 */
export const DEFAULT_AREAS: Record<LayoutArea, AreaConfig> = {
  header: { enabled: true },
  "sidebar-left": { enabled: false },
  "sidebar-right": { enabled: false },
  main: { enabled: true },
  footer: { enabled: true },
  floating: { enabled: false },
};

/**
 * Nombres legibles de las áreas
 */
export const AREA_NAMES: Record<LayoutArea, string> = {
  header: "Header",
  "sidebar-left": "Sidebar Izquierda",
  "sidebar-right": "Sidebar Derecha",
  main: "Contenido Principal",
  footer: "Footer",
  floating: "Elementos Flotantes",
};

/**
 * Iconos para cada área del layout
 */
export const AREA_ICONS: Record<LayoutArea, string> = {
  header: "📄",
  "sidebar-left": "⬅️",
  "sidebar-right": "➡️",
  main: "📃",
  footer: "📻",
  floating: "💫",
};

/**
 * Orden de las áreas en el layout visual
 */
export const LAYOUT_AREAS: LayoutArea[] = [
  "header",
  "sidebar-left",
  "main",
  "sidebar-right",
  "footer",
];

/**
 * Configuración del grid CSS para el layout
 */
export const GRID_LAYOUT_STYLE = {
  gridTemplateAreas: `
    "header header header"
    "sidebar-left main sidebar-right"
    "footer footer footer"
  `,
  gridTemplateColumns: "1fr 2fr 1fr",
  gridTemplateRows: "auto 1fr auto",
};
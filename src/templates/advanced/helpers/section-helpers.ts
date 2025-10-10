// src/templates/advanced/helpers/section-helpers.ts
import { Section } from "../../../types/advanced-template-types";

/**
 * Helper para crear secciones por defecto con configuración estándar
 * @param id - Identificador único de la sección
 * @param type - Tipo de sección (hero, about, projects, etc.)
 * @param name - Nombre visible de la sección
 * @param area - Área del layout donde se ubicará
 * @param order - Orden de renderizado
 * @param enabled - Si la sección está habilitada por defecto
 */
export const createSection = (
  id: string,
  type: any,
  name: string,
  area: any,
  order: number,
  enabled = true
): Section => ({
  id,
  type,
  name,
  icon: "📄",
  enabled,
  area,
  order,
  config: {
    variant: "default",
    showTitle: true,
    showDivider: false,
    spacing: "tight",
    columns: 1,
  },
});
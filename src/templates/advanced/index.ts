// src/templates/advanced/index.ts
import { AdvancedTemplate } from "@/types/advanced-template-types";

// Import templates by category
import { MODERN_GRADIENT_TEMPLATE } from "./modern/modern-gradient";
import { SIDEBAR_LEFT_TEMPLATE } from "./business/sidebar-left";
import { CORPORATE_BLUE_TEMPLATE } from "./business/corporate-blue";
import { MINIMAL_TEMPLATE } from "./minimal/minimal-clean";
import { MONOCHROME_GRID_TEMPLATE } from "./minimal/monochrome-grid";
import { CREATIVE_DUAL_TEMPLATE } from "./creative/creative-dual";
import { VIBRANT_CARDS_TEMPLATE } from "./creative/vibrant-cards";
import { WARM_SUNSET_TEMPLATE } from "./creative/warm-sunset";
import { TECH_DARK_TEMPLATE } from "./tech/tech-dark";
import { ELEGANT_SERIF_TEMPLATE } from "./classic/elegant-serif";

/**
 * Array con todas las plantillas avanzadas built-in
 * Organizadas por categoría para facilitar búsqueda y filtrado
 */
export const ADVANCED_BUILT_IN_TEMPLATES: AdvancedTemplate[] = [
  // Modern (1)
  MODERN_GRADIENT_TEMPLATE,
  
  // Business (2)
  SIDEBAR_LEFT_TEMPLATE,
  CORPORATE_BLUE_TEMPLATE,
  
  // Minimal (2)
  MINIMAL_TEMPLATE,
  MONOCHROME_GRID_TEMPLATE,
  
  // Creative (3)
  CREATIVE_DUAL_TEMPLATE,
  VIBRANT_CARDS_TEMPLATE,
  WARM_SUNSET_TEMPLATE,
  
  // Tech (1)
  TECH_DARK_TEMPLATE,
  
  // Classic (1)
  ELEGANT_SERIF_TEMPLATE,
];

/**
 * Helper para obtener un template por su ID
 * @param id - ID del template a buscar
 * @returns Template encontrado o undefined
 */
export const getAdvancedTemplateById = (
  id: string
): AdvancedTemplate | undefined => {
  return ADVANCED_BUILT_IN_TEMPLATES.find((t) => t.id === id);
};

/**
 * Helper para obtener el template por defecto
 * @returns Template Modern Gradient (por defecto)
 */
export const getDefaultAdvancedTemplate = (): AdvancedTemplate => {
  return MODERN_GRADIENT_TEMPLATE;
};

/**
 * Helper para filtrar templates por categoría
 * @param category - Categoría a filtrar
 * @returns Array de templates de esa categoría
 */
export const getTemplatesByCategory = (
  category: string
): AdvancedTemplate[] => {
  return ADVANCED_BUILT_IN_TEMPLATES.filter((t) => t.category === category);
};

/**
 * Helper para obtener todas las categorías disponibles
 * @returns Array de categorías únicas
 */
export const getTemplateCategories = (): string[] => {
  const categories = ADVANCED_BUILT_IN_TEMPLATES.map((t) => t.category);
  return Array.from( new Set(categories));
};

/**
 * Helper para filtrar templates premium
 * @returns Array de templates premium
 */
export const getPremiumTemplates = (): AdvancedTemplate[] => {
  return ADVANCED_BUILT_IN_TEMPLATES.filter((t) => t.isPremium);
};

/**
 * Helper para filtrar templates gratuitos
 * @returns Array de templates gratuitos
 */
export const getFreeTemplates = (): AdvancedTemplate[] => {
  return ADVANCED_BUILT_IN_TEMPLATES.filter((t) => !t.isPremium);
};

// Re-export helpers de secciones para fácil acceso
export {
  createSection,
} from "./helpers/section-helpers";

export {
  SECTIONS_WITH_HEADER,
  SECTIONS_NO_HEADER,
  SECTIONS_SIDEBAR_LEFT,
  AVAILABLE_SECTIONS,
} from "./helpers/section-presets";
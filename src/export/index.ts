// src/export/index.ts

/**
 * Punto de entrada principal del módulo de exportación
 * Re-exporta toda la API pública
 */

// Exportadores
export { TemplateAwareSinglePageExporter } from "./exporters/single-page-exporters";
export { TemplateAwareMultiPageExporter } from "./exporters/multi-page-exporters";

// Factory
export { createTemplateAwareExporter } from "./factory";

// Generadores (si se necesitan públicamente)
export { generateAdvancedTemplateCSS } from "./generators/css-generator";
export { generateSectionHTML } from "./generators/html-generator";
export { generateProjectsHTML } from "./generators/blocks/projects-block";
export { generateSkillsHTML } from "./generators/blocks/skills-block";
export { generateExperienceHTML } from "./generators/blocks/experience-block";
export { generateContactHTML } from "./generators/blocks/contact-block";

// Utils
export { downloadFile, getTechIcon, deepMerge } from "./utils/helpers";
export { getEnabledSections, isAboutSectionEnabled } from "./utils/section-utils";

// Constants
export {
  DEFAULT_COLORS,
  DEFAULT_TYPOGRAPHY,
  DEFAULT_LAYOUT,
} from "./constants/defaults";
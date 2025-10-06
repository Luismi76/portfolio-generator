// src/export/generators/blocks/experience-block.ts

/**
 * Genera el HTML para la sección de experiencia
 * @param experience - Array de experiencias laborales
 * @returns HTML de la experiencia
 */
export const generateExperienceHTML = (
  experience: Array<{
    company: string;
    position: string;
    period: string;
    description: string;
  }>
): string =>
  experience
    .filter((exp) => exp.company.trim() || exp.position.trim())
    .map(
      (exp) => `
      <div class="tpl-surface" style="padding: var(--sp-md); margin-bottom: var(--sp-md); border-left: 4px solid var(--color-primary);">
        <h3 class="tpl-heading" style="color: var(--color-primary); font-size: var(--fs-xl); margin: 0 0 var(--sp-xs) 0;">${exp.position}</h3>
        <div class="tpl-subtext" style="font-weight: var(--fw-medium); margin-bottom: var(--sp-xs);">${exp.company}</div>
        <div style="color: var(--color-accent); font-size: var(--fs-sm); font-weight: var(--fw-medium); margin-bottom: var(--sp-sm);">${exp.period}</div>
        <p class="tpl-subtext" style="margin: 0;">${exp.description}</p>
      </div>
    `
    )
    .join("");
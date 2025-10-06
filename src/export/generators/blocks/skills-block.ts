// src/export/generators/blocks/skills-block.ts
import { getTechIcon } from "../../utils/helpers";

/**
 * Genera el HTML para la sección de habilidades
 * @param skills - Array de categorías con sus items
 * @returns HTML de las habilidades
 */
export const generateSkillsHTML = (
  skills: Array<{ category: string; items: string }>
): string =>
  skills
    .filter((s) => s.category.trim())
    .map(
      (skill) => `
      <div class="tpl-surface" style="padding: var(--sp-md); display: flex; flex-direction: column; gap: var(--sp-sm);">
        <h3 class="tpl-heading" style="font-size: var(--fs-lg); margin: 0;">${skill.category}</h3>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${skill.items
            .split(",")
            .map((item) => {
              const name = item.trim();
              return `<span style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; background: var(--color-secondary); color: #fff; border-radius: var(--br-md); font-size: var(--fs-sm); font-weight: var(--fw-medium);">
                ${getTechIcon(name)} ${name}
              </span>`;
            })
            .join("")}
        </div>
      </div>
    `
    )
    .join("");
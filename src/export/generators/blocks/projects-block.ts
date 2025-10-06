// src/export/generators/blocks/projects-block.ts
import { Project } from "../../../types/portfolio-types";
import { generateSlug } from "../../../utils/export-utils";
import { getTechIcon } from "../../utils/helpers";

/**
 * Genera el HTML para la sección de proyectos
 * @param projects - Array de proyectos
 * @param isMultiPage - Si genera links a páginas individuales
 * @returns HTML de los proyectos
 */
export const generateProjectsHTML = (
  projects: Project[],
  isMultiPage: boolean = false
): string =>
  projects
    .filter((p) => p.title.trim())
    .map((project) => {
      const slug = generateSlug(project.title);
      return `
      <article class="tpl-card" style="overflow: hidden; display: flex; flex-direction: column; height: 100%;">
        <div style="position: relative; width: 100%; padding-top: 56.25%; background: var(--card-media-bg, rgba(0,0,0,.05));">
          ${project.image 
            ? `<img src="${project.image}" alt="${project.title}" loading="lazy" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">`
            : `<div style="position: absolute; inset: 0; display: grid; place-items: center; font-size: var(--fs-lg); opacity: 0.5;">${project.title?.slice(0, 1) ?? '•'}</div>`
          }
        </div>
        
        <div style="padding: var(--sp-md); display: flex; flex-direction: column; gap: var(--sp-sm); flex: 1; min-height: 0;">
          <h3 class="tpl-heading" style="margin: 0; font-size: var(--fs-lg);">${project.title}</h3>
          
          ${project.description ? `
            <p class="tpl-subtext" style="font-size: var(--fs-base); margin: 0;">${project.description}</p>
          ` : ''}
          
          ${project.technologies ? `
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${project.technologies.split(',').slice(0, 4).map(tech => 
                `<span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: var(--color-primary); color: #fff; border-radius: var(--br-sm); font-size: var(--fs-sm); font-weight: var(--fw-medium);">
                  ${getTechIcon(tech.trim())} ${tech.trim()}
                </span>`
              ).join('')}
            </div>
          ` : ''}
          
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto;">
            ${isMultiPage ? `
              <a href="projects-${slug}.html" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; font-weight: 600; line-height: 1.1;">
                Ver Detalles
              </a>
            ` : ''}
            ${project.link ? `
              <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="tpl-btn-outline" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; font-weight: 600; line-height: 1.1; text-decoration: none;">
                🌐 Ver Proyecto
              </a>
            ` : ''}
            ${project.github ? `
              <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="tpl-btn-outline" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; font-weight: 600; line-height: 1.1; text-decoration: none;">
                📂 Código
              </a>
            ` : ''}
          </div>
        </div>
      </article>
    `;
    })
    .join("");
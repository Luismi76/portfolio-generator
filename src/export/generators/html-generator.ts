// src/export/generators/html-generator.ts
import { PortfolioData } from "@/types/portfolio-types";
import { Template, TemplateConfig } from "@/types/template-types";
import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from "@/types/advanced-template-types";
import { isAboutSectionEnabled } from "../utils/section-utils";
import { generateProjectsHTML } from "./blocks/projects-block";
import { generateSkillsHTML } from "./blocks/skills-block";
import { generateExperienceHTML } from "./blocks/experience-block";
import { generateContactHTML } from "./blocks/contact-block";

/**
 * Genera el HTML de una sección específica del portfolio
 * @param sectionId - ID de la sección a generar
 * @param data - Datos del portfolio
 * @param isMultiPage - Si es modo multi-página
 * @param template - Template usado
 * @param config - Configuración del template
 * @returns HTML de la sección
 */
export const generateSectionHTML = (
  sectionId: string,
  data: PortfolioData,
  isMultiPage: boolean = false,
  template?: Template | AdvancedTemplate,
  config?: TemplateConfig | AdvancedTemplateConfig
): string => {
  switch (sectionId) {
    case "header": {
      const includeAboutInHeader =
        data.personalInfo.summary && !isAboutSectionEnabled(template!, config);

      const chips: string[] = [];
      if (data.personalInfo.email)
        chips.push(`<a href="mailto:${data.personalInfo.email}" class="tpl-chip">✉️ ${data.personalInfo.email}</a>`);
      if (data.personalInfo.phone)
        chips.push(`<a href="tel:${data.personalInfo.phone}" class="tpl-chip">📱 ${data.personalInfo.phone}</a>`);
      if (data.personalInfo.location)
        chips.push(`<span class="tpl-chip">📍 ${data.personalInfo.location}</span>`);
      if (data.personalInfo.website)
        chips.push(`<a href="${data.personalInfo.website}" target="_blank" class="tpl-chip">🌐 Website</a>`);
      if (data.personalInfo.github)
        chips.push(`<a href="${data.personalInfo.github}" target="_blank" class="tpl-chip">📂 GitHub</a>`);
      if (data.personalInfo.linkedin)
        chips.push(`<a href="${data.personalInfo.linkedin}" target="_blank" class="tpl-chip">💼 LinkedIn</a>`);

      return `
        <header class="tpl-header" style="position: relative; isolation: isolate; overflow: hidden; padding-top: clamp(2rem, 5vw, var(--sp-lg)); padding-bottom: clamp(2rem, 5vw, var(--sp-lg)); margin-bottom: var(--sp-md);">
          <div class="tpl-container" style="position: relative; z-index: 1;">
            <h1 class="tpl-heading" style="font-size: clamp(2rem, 5vw, var(--fs-3xl)); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; color: var(--text-on-primary, #fff); text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); margin: 0 0 var(--sp-sm) 0;">
              ${data.personalInfo.fullName || "Tu Nombre"}
            </h1>
            
            ${data.personalInfo.title ? `
              <p class="tpl-subtext" style="font-size: clamp(1rem, 2.5vw, var(--fs-lg)); opacity: 0.95; color: var(--text-on-primary, #fff); margin: 0 0 var(--sp-md) 0;">
                ${data.personalInfo.title}
              </p>
            ` : ''}

            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: var(--sp-sm); justify-content: center;">
              ${data.personalInfo.email ? `
                <a href="mailto:${data.personalInfo.email}" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px;">
                  ✉️ Contactar
                </a>
              ` : ''}
              <a href="#projects" class="tpl-btn-outline" style="display: inline-flex; align-items: center; gap: 8px; border-color: rgba(255,255,255,0.4); color: var(--text-on-primary, #fff); background: transparent;">
                ⭐ Ver proyectos
              </a>
            </div>

            ${includeAboutInHeader ? `
              <p class="tpl-subtext" style="max-width: 600px; margin: var(--sp-lg) auto 0; line-height: 1.6; color: var(--text-on-primary, #fff); opacity: 0.95;">
                ${data.personalInfo.summary}
              </p>
            ` : ''}

            ${chips.length > 0 ? `
              <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: var(--sp-md); justify-content: center;">
                ${chips.join('')}
              </div>
            ` : ''}
          </div>

          <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" style="position: absolute; left: 0; bottom: 0; width: 100%; height: 32px; opacity: 0.15; pointer-events: none; z-index: 0;">
            <path d="M0,64 C240,128 480,0 720,32 C960,64 1200,176 1440,96 L1440,160 L0,160 Z" fill="currentColor" />
          </svg>
        </header>
      `;
    }

    case "about": {
      if (!data.personalInfo.summary) return "";
      return `
        <section id="about" style="position: relative; z-index: 1; background: var(--color-surface, #fff); padding-top: var(--sp-lg); padding-bottom: var(--sp-lg);">
          <div class="tpl-container">
            <h2 class="tpl-heading" style="font-size: var(--fs-2xl); margin-bottom: var(--sp-md);">Sobre Mí</h2>
            <div class="tpl-surface" style="padding: var(--sp-md);">
              <p class="tpl-subtext" style="font-size: var(--fs-base); line-height: 1.6; margin: 0;">
                ${data.personalInfo.summary}
              </p>
            </div>
          </div>
        </section>
      `;
    }

    case "projects": {
      const projectsHTML = generateProjectsHTML(data.projects, isMultiPage);
      if (!projectsHTML) return "";
      return `
        <section id="projects" style="padding-top: var(--sp-lg); padding-bottom: var(--sp-lg);">
          <div class="tpl-container">
            <h2 class="tpl-heading" style="font-size: var(--fs-2xl); margin-bottom: var(--sp-md);">Mis Proyectos</h2>
            <div style="display: grid; gap: var(--sp-md); grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); align-items: stretch;">
              ${projectsHTML}
            </div>
          </div>
        </section>
      `;
    }

    case "skills": {
      const skillsHTML = generateSkillsHTML(data.skills);
      if (!skillsHTML) return "";
      return `
        <section style="padding-top: var(--sp-lg); padding-bottom: var(--sp-lg);">
          <div class="tpl-container">
            <h2 class="tpl-heading" style="font-size: var(--fs-2xl); margin-bottom: var(--sp-md);">Habilidades Técnicas</h2>
            <div style="display: grid; gap: var(--sp-md); grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); align-items: start;">
              ${skillsHTML}
            </div>
          </div>
        </section>
      `;
    }

    case "experience": {
      const experienceHTML = generateExperienceHTML(data.experience);
      if (!experienceHTML) return "";
      return `
        <section style="padding-top: var(--sp-lg); padding-bottom: var(--sp-lg);">
          <div class="tpl-container">
            <h2 class="tpl-heading" style="font-size: var(--fs-2xl); margin-bottom: var(--sp-md);">Experiencia</h2>
            ${experienceHTML}
          </div>
        </section>
      `;
    }

    case "contact": {
      const contactHTML = generateContactHTML(data.personalInfo);
      if (!contactHTML) return "";
      return `
        <section style="padding-top: var(--sp-lg); padding-bottom: var(--sp-lg);">
          <div class="tpl-container">
            <h2 class="tpl-heading" style="font-size: var(--fs-2xl); margin-bottom: var(--sp-md); text-align: center;">Contacto</h2>
            ${contactHTML}
          </div>
        </section>
      `;
    }

    default:
      return "";
  }
};
// src/export/generators/blocks/contact-block.ts

/**
 * Genera el HTML para la sección de contacto
 * @param personalInfo - Información personal del portfolio
 * @returns HTML de contacto
 */
export const generateContactHTML = (personalInfo: any): string => {
  const contacts: string[] = [];
  
  if (personalInfo.email) {
    contacts.push(`<a href="mailto:${personalInfo.email}" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: var(--br-md); text-decoration: none; font-weight: var(--fw-medium);">📧 ${personalInfo.email}</a>`);
  }
  
  if (personalInfo.phone) {
    contacts.push(`<a href="tel:${personalInfo.phone}" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: var(--br-md); text-decoration: none; font-weight: var(--fw-medium);">📱 ${personalInfo.phone}</a>`);
  }
  
  if (personalInfo.linkedin) {
    contacts.push(`<a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: var(--br-md); text-decoration: none; font-weight: var(--fw-medium);">💼 LinkedIn</a>`);
  }
  
  if (personalInfo.github) {
    contacts.push(`<a href="${personalInfo.github}" target="_blank" rel="noopener noreferrer" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: var(--br-md); text-decoration: none; font-weight: var(--fw-medium);">📂 GitHub</a>`);
  }
  
  if (personalInfo.website) {
    contacts.push(`<a href="${personalInfo.website}" target="_blank" rel="noopener noreferrer" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: var(--br-md); text-decoration: none; font-weight: var(--fw-medium);">🌐 Website</a>`);
  }
  
  if (contacts.length === 0) return "";
  
  return `
    <div class="tpl-surface" style="padding: var(--sp-lg); text-align: center;">
      <p class="tpl-subtext" style="font-size: var(--fs-lg); margin-bottom: var(--sp-md);">
        ¿Tienes un proyecto en mente? ¡Hablemos!
      </p>
      <div style="display: flex; justify-content: center; gap: var(--sp-md); flex-wrap: wrap;">
        ${contacts.join('')}
      </div>
    </div>
  `;
};
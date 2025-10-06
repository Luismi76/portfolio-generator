import type { Template, TemplateConfig } from '../types/template-types';
import type { AdvancedTemplate, AdvancedTemplateConfig } from '../types/advanced-template-types';

export function generateTemplateThemeCSS(
  template: Template | AdvancedTemplate,
  config?: TemplateConfig | AdvancedTemplateConfig
): string {
  const colors = {
    ...template.colors,
    ...(config?.customizations?.colors || {})
  };
  
/*   const typography = {
    ...template.typography,
    ...(config?.customizations?.typography || {})
  };
  
  const layout = {
    ...template.layout,
    ...(config?.customizations?.layout || {})
  }; */

  // Acceso seguro al gradiente (puede estar en diferentes ubicaciones)
  const gradient = (colors as any).gradient || 
                   (colors as any).gradients?.primary || 
                   (template.colors as any).gradient ||
                   (template.colors as any).gradients?.primary;

  const headerBg = gradient?.from && gradient?.to
    ? `linear-gradient(${gradient.direction || "135deg"}, ${gradient.from}, ${gradient.to})`
    : (colors as any).primary || "#4F46E5";

  return `
    .tpl-container { max-width: var(--max-w); margin: 0 auto; padding: var(--sp-md); }
    .tpl-surface { background: var(--color-surface); border-radius: var(--br-md); box-shadow: var(--shadow-sm); }
    .tpl-heading { font-family: var(--font-heading); color: var(--text-primary); }
    .tpl-subtext { color: var(--text-secondary); }
    .tpl-btn-primary { background: var(--color-primary); color: white; border-radius: var(--br-sm); padding: 0.5rem 0.75rem; border: none; cursor: pointer; text-decoration: none; display: inline-block; }
    .tpl-btn-outline { border: 1px solid rgba(0,0,0,.12); color: var(--text-primary); border-radius: var(--br-sm); padding: 0.5rem 0.75rem; background: transparent; cursor: pointer; text-decoration: none; display: inline-block; }
    .tpl-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 999px; font-size: var(--fs-sm); background: color-mix(in srgb, var(--color-accent) 12%, transparent); color: var(--color-accent); border: 1px solid color-mix(in srgb, var(--color-accent) 22%, transparent); }
    .tpl-card { background: var(--color-surface); border-radius: var(--br-lg); box-shadow: var(--shadow-md); overflow: hidden; }
    .tpl-header, .tpl-header-bg { background: ${headerBg}; color: var(--text-on-primary, #fff); }
    
    .variant-compact .tpl-surface, .variant-compact .tpl-card { padding: var(--sp-sm) !important; }
    .variant-expanded .tpl-surface, .variant-expanded .tpl-card { padding: var(--sp-xl) !important; }
    .variant-minimal .tpl-surface, .variant-minimal .tpl-card { padding: var(--sp-xs) !important; border: none !important; box-shadow: none !important; background: transparent !important; }
    .variant-card .tpl-surface, .variant-card .tpl-card { padding: var(--sp-lg) !important; border-radius: var(--br-xl) !important; box-shadow: var(--shadow-lg) !important; }
  `;
}
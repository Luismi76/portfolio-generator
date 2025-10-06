// src/components/template-renderer/builders/cssVariablesBuilder.ts
import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from "../../../types/advanced-template-types";

/**
 * Construye las CSS variables a partir del template y config avanzados
 * @param template - Template avanzado
 * @param config - Configuración personalizada
 * @returns Objeto con CSS variables como React.CSSProperties
 */
export function buildAdvancedCSSVars(
  template?: AdvancedTemplate | null,
  config?: AdvancedTemplateConfig | null
): React.CSSProperties {
  if (!template) return {};

  const cols = { 
    ...template.colors, 
    ...(config?.customizations?.colors || {}) 
  };

  // Acepta singular (canónico) y plural (legacy)
  const typRaw: any = {
    ...(template.typography as any),
    ...((config?.customizations as any)?.typography || {}),
  };
  
  const typo = {
    fontFamily: typRaw.fontFamily ?? typRaw.fontFamilies ?? {},
    fontSize: typRaw.fontSize ?? typRaw.fontSizes ?? {},
    fontWeight: typRaw.fontWeight ?? typRaw.fontWeights ?? {},
    lineHeight: typRaw.lineHeight ?? typRaw.lineHeights ?? {},
    letterSpacing: typRaw.letterSpacing ?? {},
  };

  // Acepta alias en layout si existieran
  const layRaw: any = {
    ...(template.layout as any),
    ...((config?.customizations as any)?.layout || {}),
  };
  
  const layout = {
    ...layRaw,
    spacing: layRaw.spacing ?? layRaw.spacings ?? {},
    borderRadius: layRaw.borderRadius ?? layRaw.radii ?? {},
  };

  const fs = typo.fontSize as any;
  const ff = typo.fontFamily as any;
  const ls = typo.letterSpacing || ({} as any);
  const lh = typo.lineHeight || ({} as any);
  const sp = layout.spacing || ({} as any);
  const br = layout.borderRadius || ({} as any);

  const style: React.CSSProperties = {
    // Colores base
    ["--color-primary" as any]: cols.primary,
    ["--color-secondary" as any]: cols.secondary,
    ["--color-accent" as any]: cols.accent,
    ["--color-bg" as any]: cols.background,
    ["--color-surface" as any]: cols.surface,
    ["--surface-variant" as any]: cols.surfaceVariant,
    ["--text-primary" as any]: cols.text?.primary,
    ["--text-secondary" as any]: cols.text?.secondary,
    ["--text-accent" as any]: cols.text?.accent,
    ["--text-muted" as any]: cols.text?.muted,
    ["--text-inverse" as any]: cols.text?.inverse,
    ["--text-on-primary" as any]: "#ffffff",

    // Tipografías
    ["--font-primary" as any]: ff.primary,
    ["--font-heading" as any]: ff.heading || ff.primary,
    ["--ff-mono" as any]:
      ff.monospace || "ui-monospace, SFMono-Regular, Menlo, monospace",

    ["--fs-xs" as any]: fs.xs,
    ["--fs-sm" as any]: fs.sm,
    ["--fs-base" as any]: fs.base,
    ["--fs-lg" as any]: fs.lg,
    ["--fs-xl" as any]: fs.xl,
    ["--fs-2xl" as any]: fs["2xl"],
    ["--fs-3xl" as any]: fs["3xl"],
    ["--fs-4xl" as any]: fs["4xl"],
    ["--fs-5xl" as any]: fs["5xl"],
    ["--fs-6xl" as any]: fs["6xl"],

    ["--ls-tighter" as any]: ls.tighter,
    ["--ls-tight" as any]: ls.tight,
    ["--ls-normal" as any]: ls.normal,
    ["--ls-wide" as any]: ls.wide,
    ["--ls-wider" as any]: ls.wider,

    ["--lh-tight" as any]: String(lh.tight),
    ["--lh-snug" as any]: String(lh.snug),
    ["--lh-normal" as any]: String(lh.normal),
    ["--lh-relaxed" as any]: String(lh.relaxed),
    ["--lh-loose" as any]: String(lh.loose),

    // Spacing + radios
    ["--sp-xs" as any]: sp.xs,
    ["--sp-sm" as any]: sp.sm,
    ["--sp-md" as any]: sp.md,
    ["--sp-lg" as any]: sp.lg,
    ["--sp-xl" as any]: sp.xl,
    ["--sp-2xl" as any]: sp["2xl"],

    ["--br-sm" as any]: br.sm,
    ["--br-md" as any]: br.md,
    ["--br-lg" as any]: br.lg,
    ["--br-xl" as any]: br.xl,
  };

  return style;
}
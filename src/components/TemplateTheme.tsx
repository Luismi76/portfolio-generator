import React, { useMemo } from "react";
import type { Template, TemplateConfig } from "../types/template-types";

// deep merge
const mergeDeep = <T extends object>(base: T, part?: Partial<T>): T => {
  if (!part) return base;
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...base };
  for (const k of Object.keys(part)) {
    const v: any = (part as any)[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = mergeDeep((base as any)[k] ?? {}, v);
    } else {
      out[k] = v;
    }
  }
  return out;
};

export const mergeTemplateWithConfig = (
  template: Template,
  config?: TemplateConfig
): Template => {
  if (!config?.customizations) return template;
  return {
    ...template,
    colors: mergeDeep(template.colors, config.customizations.colors),
    typography: mergeDeep(
      template.typography,
      config.customizations.typography
    ),
    layout: mergeDeep(template.layout, config.customizations.layout),
    sections: config.customizations.sections ?? template.sections,
  };
};

type Props = {
  template: Template;
  config?: TemplateConfig | null;
  children: React.ReactNode;
};

export const TemplateTheme: React.FC<Props> = ({
  template,
  config,
  children,
}) => {
  const merged = useMemo(
    () => mergeTemplateWithConfig(template, config || undefined),
    [template, config]
  );

  const vars: React.CSSProperties = {
    // Colors
    ["--color-primary" as any]: merged.colors.primary,
    ["--color-secondary" as any]: merged.colors.secondary,
    ["--color-accent" as any]: merged.colors.accent,
    ["--color-bg" as any]: merged.colors.background,
    ["--color-surface" as any]: merged.colors.surface,
    ["--text-primary" as any]: merged.colors.text.primary,
    ["--text-secondary" as any]: merged.colors.text.secondary,
    // Typography
    ["--font-primary" as any]: merged.typography.fontFamily.primary,
    ["--font-heading" as any]: merged.typography.fontFamily.heading,
    ["--fs-xs" as any]: merged.typography.fontSize.xs,
    ["--fs-sm" as any]: merged.typography.fontSize.sm,
    ["--fs-base" as any]: merged.typography.fontSize.base,
    ["--fs-lg" as any]: merged.typography.fontSize.lg,
    ["--fs-xl" as any]: merged.typography.fontSize.xl,
    ["--fs-2xl" as any]: merged.typography.fontSize["2xl"],
    ["--fs-3xl" as any]: merged.typography.fontSize["3xl"],
    ["--fs-4xl" as any]: merged.typography.fontSize["4xl"],
    ["--fw-normal" as any]: String(merged.typography.fontWeight.normal),
    ["--fw-medium" as any]: String(merged.typography.fontWeight.medium),
    ["--fw-semibold" as any]: String(merged.typography.fontWeight.semibold),
    ["--fw-bold" as any]: String(merged.typography.fontWeight.bold),
    // Layout
    ["--max-w" as any]: merged.layout.maxWidth,
    ["--sp-xs" as any]: merged.layout.spacing.xs,
    ["--sp-sm" as any]: merged.layout.spacing.sm,
    ["--sp-md" as any]: merged.layout.spacing.md,
    ["--sp-lg" as any]: merged.layout.spacing.lg,
    ["--sp-xl" as any]: merged.layout.spacing.xl,
    ["--br-sm" as any]: merged.layout.borderRadius.sm,
    ["--br-md" as any]: merged.layout.borderRadius.md,
    ["--br-lg" as any]: merged.layout.borderRadius.lg,
    ["--br-xl" as any]: merged.layout.borderRadius.xl,
    ["--shadow-sm" as any]: merged.layout.shadows.sm,
    ["--shadow-md" as any]: merged.layout.shadows.md,
    ["--shadow-lg" as any]: merged.layout.shadows.lg,
    ["--shadow-xl" as any]: merged.layout.shadows.xl,
  };

  // gradiente (opcional)
  const headerBackground = merged.colors.gradient
    ? `linear-gradient(${merged.colors.gradient.direction || "135deg"}, ${
        merged.colors.gradient.from
      }, ${merged.colors.gradient.to})`
    : `var(--color-primary)`;

  return (
    <div
      style={{
        ...vars,
        // fallback de base
        backgroundColor: "var(--color-bg)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-primary)",
      }}
      className="template-scope"
    >
      {/* Estilos de consumo (clases utilitarias basadas en variables) */}
      <style>{`
        .tpl-container { max-width: var(--max-w); margin: 0 auto; padding: var(--sp-md); }
        .tpl-surface { background: var(--color-surface); border-radius: var(--br-md); box-shadow: var(--shadow-sm); }
        .tpl-heading { font-family: var(--font-heading); color: var(--text-primary); }
        .tpl-subtext { color: var(--text-secondary); }
        .tpl-btn-primary { background: var(--color-primary); color: white; border-radius: var(--br-sm); padding: 0.5rem 0.75rem; }
        .tpl-btn-outline { border: 1px solid rgba(0,0,0,.12); color: var(--text-primary); border-radius: var(--br-sm); padding: 0.5rem 0.75rem; background: transparent; }
       .tpl-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: var(--fs-sm);
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
  color: var(--color-accent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 22%, transparent);
}
        .tpl-card { background: white; border-radius: var(--br-lg); box-shadow: var(--shadow-md); overflow: hidden; }
        .tpl-header { color: white; }
        .tpl-header-bg { background: ${headerBackground}; }
      `}</style>

      {children}
    </div>
  );
};

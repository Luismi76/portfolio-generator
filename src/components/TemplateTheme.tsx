import React, { useMemo } from "react";
import type { Template, TemplateConfig } from "../types/template-types";
import { generateTemplateThemeCSS } from '../utils/template-theme-css';

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

type TemplateThemeProps = {
  template: Template;
  config?: TemplateConfig | null;
  children: React.ReactNode;
};

export const TemplateTheme: React.FC<TemplateThemeProps> = ({
  template,
  config,
  children,
}) => {
  const merged = useMemo(
    () => mergeTemplateWithConfig(template, config || undefined),
    [template, config]
  );

  // ===== NORMALIZACIÓN CON VALORES POR DEFECTO =====
  const safe = {
    colors: {
      ...merged.colors,
      primary: merged.colors?.primary ?? "#4F46E5",
      secondary: merged.colors?.secondary ?? "#64748B",
      accent: merged.colors?.accent ?? "#22C55E",
      background: merged.colors?.background ?? "#FFFFFF",
      surface: merged.colors?.surface ?? "#FFFFFF",
      text: {
        primary: merged.colors?.text?.primary ?? "#1F2937",
        secondary: merged.colors?.text?.secondary ?? "#6B7280",
        accent:
          merged.colors?.text?.accent ??
          merged.colors?.accent ??
          merged.colors?.primary ??
          "#4F46E5",
      },
      gradient: merged.colors?.gradient,
    },
    typography: {
      ...merged.typography,
      fontFamily: {
        primary:
          merged.typography?.fontFamily?.primary ??
          "Inter, system-ui, sans-serif",
        heading:
          merged.typography?.fontFamily?.heading ??
          "Inter, system-ui, sans-serif",
        code:
          merged.typography?.fontFamily?.code ??
          "ui-monospace, SFMono-Regular, Menlo, monospace",
      },
      fontSize: {
        xs: merged.typography?.fontSize?.xs ?? "0.75rem",
        sm: merged.typography?.fontSize?.sm ?? "0.875rem",
        base: merged.typography?.fontSize?.base ?? "1rem",
        lg: merged.typography?.fontSize?.lg ?? "1.125rem",
        xl: merged.typography?.fontSize?.xl ?? "1.25rem",
        "2xl": merged.typography?.fontSize?.["2xl"] ?? "1.5rem",
        "3xl": merged.typography?.fontSize?.["3xl"] ?? "1.875rem",
        "4xl": merged.typography?.fontSize?.["4xl"] ?? "2.25rem",
      } as any,
      fontWeight: {
        normal: merged.typography?.fontWeight?.normal ?? 400,
        medium: merged.typography?.fontWeight?.medium ?? 500,
        semibold: merged.typography?.fontWeight?.semibold ?? 600,
        bold: merged.typography?.fontWeight?.bold ?? 700,
      },
    },
    layout: {
      ...merged.layout,
      maxWidth: merged.layout?.maxWidth ?? "1200px",
      spacing: {
        xs: merged.layout?.spacing?.xs ?? "4px",
        sm: merged.layout?.spacing?.sm ?? "8px",
        md: merged.layout?.spacing?.md ?? "12px",
        lg: merged.layout?.spacing?.lg ?? "16px",
        xl: merged.layout?.spacing?.xl ?? "24px",
      } as any,
      borderRadius: {
        sm: merged.layout?.borderRadius?.sm ?? "6px",
        md: merged.layout?.borderRadius?.md ?? "10px",
        lg: merged.layout?.borderRadius?.lg ?? "14px",
        xl: merged.layout?.borderRadius?.xl ?? "20px",
      } as any,
      shadows: {
        sm: merged.layout?.shadows?.sm ?? "0 1px 2px rgb(0 0 0 / 5%)",
        md:
          merged.layout?.shadows?.md ??
          "0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -2px rgb(0 0 0 / 10%)",
        lg:
          merged.layout?.shadows?.lg ??
          "0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%)",
        xl:
          merged.layout?.shadows?.xl ??
          "0 20px 25px -5px rgb(0 0 0 / 10%), 0 10px 10px -5px rgb(0 0 0 / 10%)",
      } as any,
    },
  };

  const vars: React.CSSProperties = {
    // Colors
    ["--color-primary" as any]: safe.colors.primary,
    ["--color-secondary" as any]: safe.colors.secondary,
    ["--color-accent" as any]: safe.colors.accent,
    ["--color-bg" as any]: safe.colors.background,
    ["--color-surface" as any]: safe.colors.surface,
    ["--text-primary" as any]: safe.colors.text.primary,
    ["--text-secondary" as any]: safe.colors.text.secondary,
    // Typography
    ["--font-primary" as any]: safe.typography.fontFamily.primary,
    ["--font-heading" as any]: safe.typography.fontFamily.heading,
    ["--fs-xs" as any]: safe.typography.fontSize.xs,
    ["--fs-sm" as any]: safe.typography.fontSize.sm,
    ["--fs-base" as any]: safe.typography.fontSize.base,
    ["--fs-lg" as any]: safe.typography.fontSize.lg,
    ["--fs-xl" as any]: safe.typography.fontSize.xl,
    ["--fs-2xl" as any]: safe.typography.fontSize["2xl"],
    ["--fs-3xl" as any]: safe.typography.fontSize["3xl"],
    ["--fs-4xl" as any]: safe.typography.fontSize["4xl"],
    ["--fw-normal" as any]: String(safe.typography.fontWeight.normal),
    ["--fw-medium" as any]: String(safe.typography.fontWeight.medium),
    ["--fw-semibold" as any]: String(safe.typography.fontWeight.semibold),
    ["--fw-bold" as any]: String(safe.typography.fontWeight.bold),
    // Layout
    ["--max-w" as any]: safe.layout.maxWidth,
    ["--sp-xs" as any]: safe.layout.spacing.xs,
    ["--sp-sm" as any]: safe.layout.spacing.sm,
    ["--sp-md" as any]: safe.layout.spacing.md,
    ["--sp-lg" as any]: safe.layout.spacing.lg,
    ["--sp-xl" as any]: safe.layout.spacing.xl,
    ["--br-sm" as any]: safe.layout.borderRadius.sm,
    ["--br-md" as any]: safe.layout.borderRadius.md,
    ["--br-lg" as any]: safe.layout.borderRadius.lg,
    ["--br-xl" as any]: safe.layout.borderRadius.xl,
    ["--shadow-sm" as any]: safe.layout.shadows.sm,
    ["--shadow-md" as any]: safe.layout.shadows.md,
    ["--shadow-lg" as any]: safe.layout.shadows.lg,
    ["--shadow-xl" as any]: safe.layout.shadows.xl,
  };

  // Generar CSS del tema usando la función compartida
  const themeCSS = useMemo(
    () => generateTemplateThemeCSS(merged, config || undefined),
    [merged, config]
  );

  return (
    <div
      style={{
        ...vars,
        backgroundColor: "var(--color-bg)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-primary)",
      }}
      className="template-scope"
    >
      <style>{themeCSS}</style>
      {children}
    </div>
  );
};
// src/export/generators/css-generator.ts
import { Template, TemplateConfig } from "../../types/template-types";
import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from "../../types/advanced-template-types";
import {
  DEFAULT_COLORS,
  DEFAULT_TYPOGRAPHY,
  DEFAULT_LAYOUT,
} from "../constants/defaults";
import { deepMerge } from "../utils/helpers";

/**
 * Genera el CSS completo para un template con todas sus customizaciones
 * @param template - Template base
 * @param config - Configuración y customizaciones
 * @returns CSS completo como string
 */
export const generateAdvancedTemplateCSS = (
  template: Template | AdvancedTemplate,
  config?: TemplateConfig | AdvancedTemplateConfig
): string => {
  const customizations = (config as any)?.customizations ?? {};

  // Merge de configuraciones con defaults
  const colors = deepMerge(
    deepMerge(DEFAULT_COLORS, (template as any)?.colors ?? {}),
    customizations.colors ?? {}
  );
  const typography = deepMerge(
    deepMerge(DEFAULT_TYPOGRAPHY, (template as any)?.typography ?? {}),
    customizations.typography ?? {}
  );
  const layout = deepMerge(
    deepMerge(DEFAULT_LAYOUT, (template as any)?.layout ?? {}),
    customizations.layout ?? {}
  );

  // Valores seguros con fallbacks
  const safeColors = {
    primary: colors?.primary ?? DEFAULT_COLORS.primary,
    secondary: colors?.secondary ?? DEFAULT_COLORS.secondary,
    accent: colors?.accent ?? DEFAULT_COLORS.accent,
    background: colors?.background ?? DEFAULT_COLORS.background,
    surface: colors?.surface ?? DEFAULT_COLORS.surface,
    text: {
      primary: colors?.text?.primary ?? DEFAULT_COLORS.text.primary,
      secondary: colors?.text?.secondary ?? DEFAULT_COLORS.text.secondary,
      accent: colors?.text?.accent ?? DEFAULT_COLORS.text.accent,
    },
    gradient: colors?.gradient,
  };

  const safeTypography = {
    fontFamily: {
      primary:
        typography?.fontFamily?.primary ??
        DEFAULT_TYPOGRAPHY.fontFamily.primary,
      heading:
        typography?.fontFamily?.heading ??
        DEFAULT_TYPOGRAPHY.fontFamily.heading,
      code: typography?.fontFamily?.code ?? DEFAULT_TYPOGRAPHY.fontFamily.code,
    },
    fontSize: {
      xs: typography?.fontSize?.xs ?? DEFAULT_TYPOGRAPHY.fontSize.xs,
      sm: typography?.fontSize?.sm ?? DEFAULT_TYPOGRAPHY.fontSize.sm,
      base: typography?.fontSize?.base ?? DEFAULT_TYPOGRAPHY.fontSize.base,
      lg: typography?.fontSize?.lg ?? DEFAULT_TYPOGRAPHY.fontSize.lg,
      xl: typography?.fontSize?.xl ?? DEFAULT_TYPOGRAPHY.fontSize.xl,
      "2xl":
        typography?.fontSize?.["2xl"] ?? DEFAULT_TYPOGRAPHY.fontSize["2xl"],
      "3xl":
        typography?.fontSize?.["3xl"] ?? DEFAULT_TYPOGRAPHY.fontSize["3xl"],
      "4xl":
        typography?.fontSize?.["4xl"] ?? DEFAULT_TYPOGRAPHY.fontSize["4xl"],
    },
    fontWeight: {
      normal:
        typography?.fontWeight?.normal ?? DEFAULT_TYPOGRAPHY.fontWeight.normal,
      medium:
        typography?.fontWeight?.medium ?? DEFAULT_TYPOGRAPHY.fontWeight.medium,
      semibold:
        typography?.fontWeight?.semibold ??
        DEFAULT_TYPOGRAPHY.fontWeight.semibold,
      bold: typography?.fontWeight?.bold ?? DEFAULT_TYPOGRAPHY.fontWeight.bold,
    },
  };

  const safeLayout = {
    maxWidth: layout?.maxWidth ?? DEFAULT_LAYOUT.maxWidth,
    spacing: {
      xs: layout?.spacing?.xs ?? DEFAULT_LAYOUT.spacing.xs,
      sm: layout?.spacing?.sm ?? DEFAULT_LAYOUT.spacing.sm,
      md: layout?.spacing?.md ?? DEFAULT_LAYOUT.spacing.md,
      lg: layout?.spacing?.lg ?? DEFAULT_LAYOUT.spacing.lg,
      xl: layout?.spacing?.xl ?? DEFAULT_LAYOUT.spacing.xl,
    },
    borderRadius: {
      sm: layout?.borderRadius?.sm ?? DEFAULT_LAYOUT.borderRadius.sm,
      md: layout?.borderRadius?.md ?? DEFAULT_LAYOUT.borderRadius.md,
      lg: layout?.borderRadius?.lg ?? DEFAULT_LAYOUT.borderRadius.lg,
      xl: layout?.borderRadius?.xl ?? DEFAULT_LAYOUT.borderRadius.xl,
    },
    shadows: {
      sm: layout?.shadows?.sm ?? DEFAULT_LAYOUT.shadows.sm,
      md: layout?.shadows?.md ?? DEFAULT_LAYOUT.shadows.md,
      lg: layout?.shadows?.lg ?? DEFAULT_LAYOUT.shadows.lg,
      xl: layout?.shadows?.xl ?? DEFAULT_LAYOUT.shadows.xl,
    },
  };

  // Gradiente
  const gradient = safeColors.gradient;
  const gradientCss =
    gradient?.from && gradient?.to
      ? `--gradient-primary: linear-gradient(${
          gradient?.direction ?? "135deg"
        }, ${gradient.from}, ${gradient.to});`
      : "";

  // Fondo del header (igual que en TemplateTheme.tsx)
  const headerBackground =
    gradient?.from && gradient?.to
      ? `linear-gradient(${gradient.direction || "135deg"}, ${gradient.from}, ${gradient.to})`
      : safeColors.primary;

  return `
    /* ===== VARIABLES CSS ===== */
    :root {
      --color-primary: ${safeColors.primary};
      --color-secondary: ${safeColors.secondary};
      --color-accent: ${safeColors.accent};
      --color-bg: ${safeColors.background};
      --color-surface: ${safeColors.surface};
      --text-primary: ${safeColors.text.primary};
      --text-secondary: ${safeColors.text.secondary};
      --text-accent: ${safeColors.text.accent};
      --text-on-primary: #ffffff;
      ${gradientCss}

      --font-primary: ${safeTypography.fontFamily.primary};
      --font-heading: ${safeTypography.fontFamily.heading};
      --font-code: ${safeTypography.fontFamily.code};

      --fs-xs: ${safeTypography.fontSize.xs};
      --fs-sm: ${safeTypography.fontSize.sm};
      --fs-base: ${safeTypography.fontSize.base};
      --fs-lg: ${safeTypography.fontSize.lg};
      --fs-xl: ${safeTypography.fontSize.xl};
      --fs-2xl: ${safeTypography.fontSize["2xl"]};
      --fs-3xl: ${safeTypography.fontSize["3xl"]};
      --fs-4xl: ${safeTypography.fontSize["4xl"]};

      --fw-normal: ${safeTypography.fontWeight.normal};
      --fw-medium: ${safeTypography.fontWeight.medium};
      --fw-semibold: ${safeTypography.fontWeight.semibold};
      --fw-bold: ${safeTypography.fontWeight.bold};

      --max-w: ${safeLayout.maxWidth};
      --sp-xs: ${safeLayout.spacing.xs};
      --sp-sm: ${safeLayout.spacing.sm};
      --sp-md: ${safeLayout.spacing.md};
      --sp-lg: ${safeLayout.spacing.lg};
      --sp-xl: ${safeLayout.spacing.xl};

      --br-sm: ${safeLayout.borderRadius.sm};
      --br-md: ${safeLayout.borderRadius.md};
      --br-lg: ${safeLayout.borderRadius.lg};
      --br-xl: ${safeLayout.borderRadius.xl};

      --shadow-sm: ${safeLayout.shadows.sm};
      --shadow-md: ${safeLayout.shadows.md};
      --shadow-lg: ${safeLayout.shadows.lg};
      --shadow-xl: ${safeLayout.shadows.xl};
    }

    /* ===== RESET Y BASE ===== */
    *, *::before, *::after { box-sizing: border-box; }
    html { -webkit-text-size-adjust: 100%; }
    body {
      margin: 0;
      font-family: var(--font-primary);
      font-size: var(--fs-base);
      font-weight: var(--fw-normal);
      line-height: 1.6;
      color: var(--text-primary);
      background-color: var(--color-bg);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    img { max-width: 100%; display: block; }

    /* ===== CLASES .tpl-* (copiadas de TemplateTheme.tsx) ===== */
    .tpl-container { 
      max-width: var(--max-w); 
      margin: 0 auto; 
      padding: var(--sp-md); 
    }
    
    .tpl-surface { 
      background: var(--color-surface); 
      border-radius: var(--br-md); 
      box-shadow: var(--shadow-sm); 
    }
    
    .tpl-heading { 
      font-family: var(--font-heading); 
      color: var(--text-primary); 
    }
    
    .tpl-subtext { 
      color: var(--text-secondary); 
    }
    
    .tpl-btn-primary { 
      background: var(--color-primary); 
      color: white; 
      border-radius: var(--br-sm); 
      padding: 0.5rem 0.75rem; 
      border: none;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }
    
    .tpl-btn-outline { 
      border: 1px solid rgba(0,0,0,.12); 
      color: var(--text-primary); 
      border-radius: var(--br-sm); 
      padding: 0.5rem 0.75rem; 
      background: transparent; 
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }

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
      text-decoration: none;
    }

    .tpl-card { 
      background: var(--color-surface); 
      border-radius: var(--br-lg); 
      box-shadow: var(--shadow-md); 
      overflow: hidden; 
    }

    .tpl-header,
    .tpl-header-bg {
      background: ${headerBackground};
      color: var(--text-on-primary, #fff);
    }

    /* ===== VARIANTES ===== */
    .variant-compact .tpl-surface,
    .variant-compact .tpl-card {
      padding: var(--sp-sm) !important;
    }

    .variant-expanded .tpl-surface,
    .variant-expanded .tpl-card {
      padding: var(--sp-xl) !important;
    }

    .variant-minimal .tpl-surface,
    .variant-minimal .tpl-card {
      padding: var(--sp-xs) !important;
      border: none !important;
      box-shadow: none !important;
      background: transparent !important;
    }

    .variant-card .tpl-surface,
    .variant-card .tpl-card {
      padding: var(--sp-lg) !important;
      border-radius: var(--br-xl) !important;
      box-shadow: var(--shadow-lg) !important;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
      .tpl-container { padding: var(--sp-sm); }
      .tpl-header { padding: var(--sp-lg) var(--sp-sm); }
    }

    ${(customizations as any).customCSS || (template as any).customCSS || ""}
  `;
};
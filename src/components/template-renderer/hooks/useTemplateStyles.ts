// src/components/template-renderer/hooks/useTemplateStyles.ts
import { useMemo } from "react";
import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from "../../../types/advanced-template-types";
import type { Template } from "../../../types/template-types";
import { buildAdvancedCSSVars } from "../builders/cssVariablesBuilder";
import { getDefaultAdvancedTemplate } from "../../../templates/advanced";

export function useTemplateStyles(
  template?: AdvancedTemplate,
  config?: AdvancedTemplateConfig
) {
  const cssVars = useMemo(
    () => buildAdvancedCSSVars(template, config),
    [template, config]
  );

  const themeTemplate = useMemo<Template>(() => {
    const base = getDefaultAdvancedTemplate();
    if (!template) return base;

    return {
      ...base,
      colors: {
        ...base.colors,
        primary: template.colors.primary ?? base.colors.primary,
        secondary: template.colors.secondary ?? base.colors.secondary,
        accent: template.colors.accent ?? base.colors.accent,
        background: template.colors.background ?? base.colors.background,
        surface: template.colors.surface ?? base.colors.surface,
        text: {
          ...base.colors.text,
          primary: template.colors.text?.primary ?? base.colors.text.primary,
          secondary: template.colors.text?.secondary ?? base.colors.text.secondary,
        },
      },
    };
  }, [template]);

  return { cssVars, themeTemplate };
}
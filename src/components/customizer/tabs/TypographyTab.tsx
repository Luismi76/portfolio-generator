// src/components/customizer/tabs/TypographyTab.tsx
import React from "react";
import {
  AdvancedTemplate,
  AdvancedTemplateConfig,
  AdvancedTemplateTypography,
} from "../../../types/advanced-template-types";
import TypographyControls from "../../TypographyControls";

interface TypographyTabProps {
  template: AdvancedTemplate;
  currentConfig: AdvancedTemplateConfig;
  updateConfig: (updates: Partial<AdvancedTemplateConfig["customizations"]>) => void;
}

// Valores por defecto para typography
const DEFAULT_TYPOGRAPHY: AdvancedTemplateTypography = {
  fontFamily: {
    primary: "Inter, system-ui, sans-serif",
    heading: "Inter, system-ui, sans-serif",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
  fontWeight: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
  },
};

/**
 * Tab de configuración de tipografía
 * Wrapper para el componente TypographyControls
 */
export const TypographyTab: React.FC<TypographyTabProps> = ({
  template,
  currentConfig,
  updateConfig,
}) => {
  // Hacer merge de la tipografía con valores por defecto para asegurar un objeto completo
  const typography: AdvancedTemplateTypography = {
    ...DEFAULT_TYPOGRAPHY,
    ...(template?.typography || {}),
    ...(currentConfig.customizations.typography || {}),
    fontFamily: {
      ...DEFAULT_TYPOGRAPHY.fontFamily,
      ...(template?.typography?.fontFamily || {}),
      ...(currentConfig.customizations.typography?.fontFamily || {}),
    },
    fontSize: {
      ...DEFAULT_TYPOGRAPHY.fontSize,
      ...(template?.typography?.fontSize || {}),
      ...(currentConfig.customizations.typography?.fontSize || {}),
    },
    fontWeight: {
      ...DEFAULT_TYPOGRAPHY.fontWeight,
      ...(template?.typography?.fontWeight || {}),
      ...(currentConfig.customizations.typography?.fontWeight || {}),
    },
    lineHeight: {
      ...DEFAULT_TYPOGRAPHY.lineHeight,
      ...(template?.typography?.lineHeight || {}),
      ...(currentConfig.customizations.typography?.lineHeight || {}),
    },
    letterSpacing: {
      ...DEFAULT_TYPOGRAPHY.letterSpacing,
      ...(template?.typography?.letterSpacing || {}),
      ...(currentConfig.customizations.typography?.letterSpacing || {}),
    },
  };

  return (
    <TypographyControls
      typography={typography}
      onChange={(typography) => updateConfig({ typography })}
    />
  );
};
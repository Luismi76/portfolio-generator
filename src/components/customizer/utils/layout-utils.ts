// src/components/customizer/utils/layout-utils.ts
import {
  TemplateLayoutStructure,
  TemplateLayoutStructurePatch,
  AREA_KEYS,
} from "../../../types/advanced-template-types";

/**
 * Hace merge seguro de la estructura de layout base con las customizaciones
 * @param base - Layout estructura base del template
 * @param custom - Customizaciones del layout (patch)
 * @returns Layout estructura merged
 */
export function mergeLayoutStructure(
  base: TemplateLayoutStructure,
  custom?: TemplateLayoutStructurePatch
): TemplateLayoutStructure {
  const baseAreas = (base?.areas ??
    {}) as Required<TemplateLayoutStructure>["areas"];
    
  const mergedAreas = AREA_KEYS.reduce((acc, key) => {
    acc[key] = { 
      ...(baseAreas?.[key] ?? {}), 
      ...(custom?.areas?.[key] ?? {}) 
    };
    return acc;
  }, {} as Required<TemplateLayoutStructure>["areas"]);

  const baseResp =
    base?.responsive ?? ({ mobile: "stack", tablet: "full" } as const);
    
  const responsive = custom?.responsive
    ? {
        mobile: custom.responsive.mobile ?? baseResp.mobile,
        tablet: custom.responsive.tablet ?? baseResp.tablet,
      }
    : baseResp;

  return {
    ...(base ?? {}),
    type: custom?.type ?? base?.type,
    areas: mergedAreas,
    responsive,
  };
}
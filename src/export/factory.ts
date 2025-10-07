// src/export/factory.ts
import { PortfolioData, IExporter } from "../types/portfolio-types";
import { Template, TemplateConfig } from "../types/template-types";
import { TemplateAwareSinglePageExporter } from "./exporters/single-page-exporter";
import { TemplateAwareMultiPageExporter } from "./exporters/multi-page-exporter";

type ExportMode = "single" | "multi";

/**
 * Factory para crear el exportador apropiado según el modo
 * @param data - Datos del portfolio
 * @param template - Template a usar
 * @param type - Tipo de exportación (single o multi page)
 * @param config - Configuración del template
 * @returns Instancia del exportador
 */
export function createTemplateAwareExporter(
  data: PortfolioData,
  template: Template,
  type: ExportMode,
  config?: TemplateConfig
): IExporter {
  return type === "single"
    ? new TemplateAwareSinglePageExporter(data, template, config)
    : new TemplateAwareMultiPageExporter(data, template, config);
}
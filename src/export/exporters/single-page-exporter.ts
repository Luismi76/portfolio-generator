// src/export/exporters/single-page-exporter.ts
import {
  PortfolioData,
  ExportResult,
  IExporter,
} from "../../types/portfolio-types";
import { Template, TemplateConfig } from "../../types/template-types";
import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from "../../types/advanced-template-types";
import {
  getFontsHeadFromTemplate,
  downloadBlob,
  getBashDeployScript,
  getPowerShellDeployScript,
  makeDeploymentReadme,
  buildZip,
} from "../../utils/export-utils";
import { generateAdvancedTemplateCSS } from "../generators/css-generator";
import { generateSectionHTML } from "../generators/html-generator";
import { getEnabledSections } from "../utils/section-utils";

/**
 * Exportador de portfolio single-page
 * Genera un único archivo HTML con todas las secciones
 */
export class TemplateAwareSinglePageExporter implements IExporter {
  constructor(
    private data: PortfolioData,
    private template: Template | AdvancedTemplate,
    private config?: TemplateConfig | AdvancedTemplateConfig
  ) {}

  private generate(): string {
    const css = generateAdvancedTemplateCSS(this.template, this.config);
    const sectionsHTML = getEnabledSections(this.template, this.config)
      .map((s) =>
        generateSectionHTML(s.id, this.data, false, this.template, this.config)
      )
      .filter((html) => html.trim())
      .join("\n");

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${this.data.personalInfo.fullName || "Portfolio"}</title>
  <meta name="description" content="Portfolio de ${this.data.personalInfo.fullName || ""} - ${this.data.personalInfo.title || ""}" />
  ${getFontsHeadFromTemplate(this.template, this.config)}
  <style>${css}</style>
</head>
<body>
  ${sectionsHTML}
  
  <footer class="tpl-header" style="margin-top: var(--sp-xl); padding: var(--sp-lg) 0;">
    <div class="tpl-container" style="text-align: center;">
      <p style="color: rgba(255, 255, 255, 0.95); font-weight: 500; font-size: var(--fs-base); margin: 0 0 4px 0;">
        ${this.data.personalInfo.fullName || "Tu Nombre"}
      </p>
      <p style="color: rgba(255, 255, 255, 0.7); font-size: var(--fs-sm); margin: 0;">
        © ${new Date().getFullYear()} • Todos los derechos reservados
      </p>
    </div>
  </footer>
</body>
</html>`;
  }

  public async export(): Promise<ExportResult> {
    try {
      const files: Record<string, string> = {
        "index.html": this.generate(),
        "deploy-gh-pages.sh": getBashDeployScript(),
        "deploy-gh-pages.ps1": getPowerShellDeployScript(),
        ".nojekyll": "",
        ".gitattributes": `* text=auto eol=lf\n*.ps1 text eol=crlf\n`,
        ".editorconfig": `root = true\n\n[*]\nend_of_line = lf\ninsert_final_newline = true\ncharset = utf-8\nindent_style = space\nindent_size = 2\n\n[*.ps1]\nend_of_line = crlf\n`,
      };

      files["README.md"] = makeDeploymentReadme(
        files,
        this.data.personalInfo.fullName
      );

      const root = `portfolio-${(this.data.personalInfo.fullName || "portfolio")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9._-]/g, "")}`;

      const zipBlob = await buildZip(files, root);
      downloadBlob(`${root}.zip`, zipBlob);

      return { success: true, message: "✅ ZIP generado (Single Page)." };
    } catch (error) {
      return {
        success: false,
        message: `❌ Error al exportar: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
      };
    }
  }
}
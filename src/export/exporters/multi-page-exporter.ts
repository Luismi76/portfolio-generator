// src/export/exporters/multi-page-exporter.ts
import {
  PortfolioData,
  Project,
  ExportResult,
  IExporter,
} from "@/types/portfolio-types";
import { Template, TemplateConfig } from "@/types/template-types";
import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from "@/types/advanced-template-types";
import {
  generateSlug,
  getFontsHeadFromTemplate,
  downloadBlob,
  getBashDeployScript,
  getPowerShellDeployScript,
  makeDeploymentReadme,
  buildZip,
} from "@/utils/export-utils";
import { generateAdvancedTemplateCSS } from "../generators/css-generator";
import { generateSectionHTML } from "../generators/html-generator";
import { getEnabledSections } from "../utils/section-utils";
import { getTechIcon } from "../utils/helpers";

/**
 * Exportador de portfolio multi-page
 * Genera un archivo index.html + páginas individuales para cada proyecto
 */
export class TemplateAwareMultiPageExporter implements IExporter {
  constructor(
    private data: PortfolioData,
    private template: Template | AdvancedTemplate,
    private config?: TemplateConfig | AdvancedTemplateConfig
  ) {}

  private generateProjectPage(project: Project): string {
    const css = generateAdvancedTemplateCSS(this.template, this.config);
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.title} - ${this.data.personalInfo.fullName || ""}</title>
  <meta name="description" content="${project.description || ""}" />
  ${getFontsHeadFromTemplate(this.template, this.config)}
  <style>${css}</style>
</head>
<body>
  <div class="tpl-container" style="padding-top: var(--sp-md);">
    <a href="index.html" class="tpl-btn-outline" style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: var(--sp-md); text-decoration: none;">
      ← Volver al Portfolio
    </a>
  </div>

  <header class="tpl-header">
    <div class="tpl-container">
      <h1 class="tpl-heading" style="font-size: var(--fs-3xl); margin: 0 0 var(--sp-sm) 0;">${project.title}</h1>
      <p class="tpl-subtext" style="font-size: var(--fs-lg); margin: 0;">${project.description || ""}</p>
    </div>
  </header>

  <div class="tpl-container">
    ${project.detailedDescription ? `
      <section class="tpl-surface" style="padding: var(--sp-lg); margin-bottom: var(--sp-lg);">
        <h3 class="tpl-heading" style="font-size: var(--fs-xl); margin: 0 0 var(--sp-md) 0;">Descripción Detallada</h3>
        <p class="tpl-subtext" style="font-size: var(--fs-base); margin: 0;">${project.detailedDescription}</p>
      </section>
    ` : ''}

    ${project.features ? `
      <section class="tpl-surface" style="padding: var(--sp-lg); margin-bottom: var(--sp-lg);">
        <h3 class="tpl-heading" style="font-size: var(--fs-xl); margin: 0 0 var(--sp-md) 0;">Características Principales</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${project.features
            .split(",")
            .map((f) => `<li style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.1);">✓ ${f.trim()}</li>`)
            .join("")}
        </ul>
      </section>
    ` : ''}

    ${project.technologies ? `
      <section class="tpl-surface" style="padding: var(--sp-lg); margin-bottom: var(--sp-lg);">
        <h3 class="tpl-heading" style="font-size: var(--fs-xl); margin: 0 0 var(--sp-md) 0;">Tecnologías Utilizadas</h3>
        <div style="display: flex; flex-wrap: wrap; gap: var(--sp-sm);">
          ${project.technologies
            .split(",")
            .map((tech) => `<span style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; background: var(--color-primary); color: #fff; border-radius: var(--br-sm); font-size: var(--fs-sm); font-weight: var(--fw-medium);">${getTechIcon(tech.trim())} ${tech.trim()}</span>`)
            .join("")}
        </div>
      </section>
    ` : ''}

    ${project.instructions ? `
      <section class="tpl-surface" style="padding: var(--sp-lg); margin-bottom: var(--sp-lg);">
        <h3 class="tpl-heading" style="font-size: var(--fs-xl); margin: 0 0 var(--sp-md) 0;">Instrucciones de Uso</h3>
        <pre style="white-space: pre-wrap; background: var(--color-surface); padding: var(--sp-md); border-radius: var(--br-md); overflow-x: auto; font-family: var(--font-code, monospace); margin: 0;">${project.instructions}</pre>
      </section>
    ` : ''}

    <section style="margin-bottom: var(--sp-xl);">
      <div style="display: flex; justify-content: center; gap: var(--sp-md); flex-wrap: wrap;">
        ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">🚀 Ver Proyecto Live</a>` : ""}
        ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">📂 Ver Código</a>` : ""}
        <a href="index.html" class="tpl-btn-outline" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">🏠 Volver al Portfolio</a>
      </div>
    </section>
  </div>

  <footer class="tpl-header" style="margin-top: var(--sp-xl); padding: var(--sp-lg) 0;">
    <div class="tpl-container" style="text-align: center;">
      <p style="color: rgba(255, 255, 255, 0.95); font-weight: 500; margin: 0;">
        © ${new Date().getFullYear()} ${this.data.personalInfo.fullName || ""}
      </p>
    </div>
  </footer>
</body>
</html>`;
  }

  private generateIndexPage(): string {
    const css = generateAdvancedTemplateCSS(this.template, this.config);
    const sectionsHTML = getEnabledSections(this.template, this.config)
      .map((s) =>
        generateSectionHTML(s.id, this.data, true, this.template, this.config)
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

  private generateFiles(): { [filename: string]: string } {
    const files: { [filename: string]: string } = {};
    files["index.html"] = this.generateIndexPage();

    this.data.projects
      .filter((p) => p.title.trim())
      .forEach((project) => {
        const slug = generateSlug(project.title);
        files[`projects-${slug}.html`] = this.generateProjectPage(project);
      });

    files["README.md"] = `# ${this.data.personalInfo.fullName || "Portfolio"} - Portfolio Web`;
    return files;
  }

  public async export(): Promise<ExportResult> {
    try {
      const baseFiles = this.generateFiles();

      const files: Record<string, string> = {
        ...baseFiles,
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

      return {
        success: true,
        message: "✅ ZIP generado con sitio y scripts de despliegue (Multi Page).",
      };
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
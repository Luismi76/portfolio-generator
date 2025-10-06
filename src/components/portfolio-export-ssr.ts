// src/components/portfolio-export-ssr.ts
// Exportador Multi-página usando Server-Side Rendering

import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { TemplateRenderer } from './TemplateRenderer';
import { ProjectDetailPage } from './ProjectDetailsPage';
import type { PortfolioData, ExportResult, IExporter } from '../types/portfolio-types';
import type { AdvancedTemplate, AdvancedTemplateConfig } from '../types/advanced-template-types';
import { generateTemplateThemeCSS } from '../utils/template-theme-css';

// Utilidades compartidas de export-utils
import {
  generateSlug,
  getFontsHeadFromTemplate,
  downloadBlob,
  getBashDeployScript,
  getPowerShellDeployScript,
  makeDeploymentReadme,
  buildZip
} from '../utils/export-utils';

// Reutilizar generador de CSS del módulo de exportación
import { generateAdvancedTemplateCSS } from '../export/generators/css-generator';

/**
 * Exportador Multi-Page usando Server-Side Rendering
 * Renderiza componentes React a HTML estático
 */
export class SSRMultiPageExporter implements IExporter {
  constructor(
    private data: PortfolioData,
    private template: AdvancedTemplate,
    private config?: AdvancedTemplateConfig
  ) {}

  /**
   * Envuelve el contenido HTML renderizado en un documento HTML completo
   */
  private wrapInHTMLDocument(
    htmlContent: string,
    title: string,
    description: string
  ): string {
    const themeCSS = generateTemplateThemeCSS(this.template, this.config);
    
    // Usar el generador de CSS compartido en lugar de duplicar código
    const cssVariables = generateAdvancedTemplateCSS(this.template, this.config);
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  ${getFontsHeadFromTemplate(this.template, this.config)}
  <style>
    ${cssVariables}
    ${themeCSS}
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
  }

  /**
   * Renderiza la página principal (index.html)
   */
  private renderIndexPage(): string {
    const htmlContent = ReactDOMServer.renderToStaticMarkup(
      React.createElement(TemplateRenderer, {
        data: this.data,
        template: this.template,
        config: this.config,
        isSSR: true,
      })
    );

    return this.wrapInHTMLDocument(
      htmlContent,
      this.data.personalInfo.fullName || "Portfolio",
      `Portfolio de ${this.data.personalInfo.fullName || ""} - ${this.data.personalInfo.title || ""}`
    );
  }

  /**
   * Renderiza una página individual de proyecto
   */
  private renderProjectPage(project: any): string {
    const htmlContent = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ProjectDetailPage, {
        project,
        data: this.data,
        template: this.template,
        config: this.config,
      })
    );

    return this.wrapInHTMLDocument(
      htmlContent,
      `${project.title} - ${this.data.personalInfo.fullName || ""}`,
      project.description || ""
    );
  }

  /**
   * Ejecuta la exportación completa
   */
  public async export(): Promise<ExportResult> {
    try {
      const files: Record<string, string> = {};

      // Generar página principal
      files["index.html"] = this.renderIndexPage();

      // Generar páginas de proyectos
      this.data.projects
        .filter((p) => p.title?.trim())
        .forEach((project) => {
          const slug = generateSlug(project.title);
          files[`proyecto-${slug}.html`] = this.renderProjectPage(project);
        });

      // Agregar archivos de deployment
      files["deploy-gh-pages.sh"] = getBashDeployScript();
      files["deploy-gh-pages.ps1"] = getPowerShellDeployScript();
      files[".nojekyll"] = "";
      files[".gitattributes"] = `* text=auto eol=lf\n*.ps1 text eol=crlf\n`;
      files[".editorconfig"] = `root = true\n\n[*]\nend_of_line = lf\ninsert_final_newline = true\ncharset = utf-8\nindent_style = space\nindent_size = 2\n\n[*.ps1]\nend_of_line = crlf\n`;

      // Generar README
      files["README.md"] = makeDeploymentReadme(files, this.data.personalInfo.fullName);

      // Crear nombre de carpeta raíz
      const root = `portfolio-${(this.data.personalInfo.fullName || "portfolio")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9._-]/g, "")}`;

      // Crear y descargar ZIP
      const zipBlob = await buildZip(files, root);
      downloadBlob(`${root}.zip`, zipBlob);

      return { 
        success: true, 
        message: `✅ Portfolio multi-página exportado con SSR (${Object.keys(files).length} archivos).` 
      };
    } catch (error) {
      console.error("Error en SSR export:", error);
      return {
        success: false,
        message: `❌ Error al exportar: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
      };
    }
  }
}

/**
 * Factory para crear el exportador SSR
 */
export function createSSRExporter(
  data: PortfolioData,
  template: AdvancedTemplate,
  config?: AdvancedTemplateConfig
): IExporter {
  return new SSRMultiPageExporter(data, template, config);
}
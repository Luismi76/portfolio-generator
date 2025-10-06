// src/components/portfolio-export-ssr.ts
// Exportador Multi-página usando Server-Side Rendering

import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { TemplateRenderer } from './TemplateRenderer';
import { ProjectDetailPage } from './ProjectDetailsPage';
import type { PortfolioData, ExportResult, IExporter } from '../types/portfolio-types';
import type { AdvancedTemplate, AdvancedTemplateConfig } from '../types/advanced-template-types';
import { generateTemplateThemeCSS } from '../utils/template-theme-css';
// Importar utilidades compartidas
import {
  generateSlug,
  getFontsHeadFromTemplate,
  downloadBlob,
  getBashDeployScript,
  getPowerShellDeployScript,
  makeDeploymentReadme,
  buildZip
} from '../utils/export-utils';

/* =========================
   SSR Multi-Page Exporter
   ========================= */

export class SSRMultiPageExporter implements IExporter {
  constructor(
    private data: PortfolioData,
    private template: AdvancedTemplate,
    private config?: AdvancedTemplateConfig
  ) {}

private wrapInHTMLDocument(htmlContent: string, title: string, description: string): string {
  const themeCSS = generateTemplateThemeCSS(this.template, this.config);
  
  // Generar variables CSS
  const cssVariables = this.generateCSSVariables();
  
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

private generateCSSVariables(): string {
  const colors = { ...this.template.colors, ...(this.config?.customizations?.colors || {}) };
  const typography = { ...this.template.typography, ...(this.config?.customizations?.typography || {}) };
  const layout = { ...this.template.layout, ...(this.config?.customizations?.layout || {}) };

  return `
    :root {
      --color-primary: ${(colors as any).primary || "#4F46E5"};
      --color-secondary: ${(colors as any).secondary || "#64748B"};
      --color-accent: ${(colors as any).accent || "#22C55E"};
      --color-bg: ${(colors as any).background || "#FFFFFF"};
      --color-surface: ${(colors as any).surface || "#FFFFFF"};
      --text-primary: ${(colors as any).text?.primary || "#1F2937"};
      --text-secondary: ${(colors as any).text?.secondary || "#6B7280"};
      --text-on-primary: #ffffff;
      
      --font-primary: ${(typography as any).fontFamily?.primary || "Inter, system-ui, sans-serif"};
      --font-heading: ${(typography as any).fontFamily?.heading || "Inter, system-ui, sans-serif"};
      
      --fs-xs: ${(typography as any).fontSize?.xs || "0.75rem"};
      --fs-sm: ${(typography as any).fontSize?.sm || "0.875rem"};
      --fs-base: ${(typography as any).fontSize?.base || "1rem"};
      --fs-lg: ${(typography as any).fontSize?.lg || "1.125rem"};
      --fs-xl: ${(typography as any).fontSize?.xl || "1.25rem"};
      --fs-2xl: ${(typography as any).fontSize?.["2xl"] || "1.5rem"};
      --fs-3xl: ${(typography as any).fontSize?.["3xl"] || "1.875rem"};
      --fs-4xl: ${(typography as any).fontSize?.["4xl"] || "2.25rem"};
      
      --max-w: ${(layout as any).maxWidth || "1200px"};
      --sp-xs: ${(layout as any).spacing?.xs || "4px"};
      --sp-sm: ${(layout as any).spacing?.sm || "8px"};
      --sp-md: ${(layout as any).spacing?.md || "12px"};
      --sp-lg: ${(layout as any).spacing?.lg || "16px"};
      --sp-xl: ${(layout as any).spacing?.xl || "24px"};
      
      --br-sm: ${(layout as any).borderRadius?.sm || "6px"};
      --br-md: ${(layout as any).borderRadius?.md || "10px"};
      --br-lg: ${(layout as any).borderRadius?.lg || "14px"};
      --br-xl: ${(layout as any).borderRadius?.xl || "20px"};
      
      --shadow-sm: ${(layout as any).shadows?.sm || "0 1px 2px rgb(0 0 0 / 5%)"};
      --shadow-md: ${(layout as any).shadows?.md || "0 4px 6px -1px rgb(0 0 0 / 10%)"};
      --shadow-lg: ${(layout as any).shadows?.lg || "0 10px 15px -3px rgb(0 0 0 / 10%)"};
      --shadow-xl: ${(layout as any).shadows?.xl || "0 20px 25px -5px rgb(0 0 0 / 10%)"};
    }
  `;
}

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

  public async export(): Promise<ExportResult> {
    try {
      const files: Record<string, string> = {};

      files["index.html"] = this.renderIndexPage();

      this.data.projects
        .filter((p) => p.title?.trim())
        .forEach((project) => {
          const slug = generateSlug(project.title);
          files[`proyecto-${slug}.html`] = this.renderProjectPage(project);
        });

      files["deploy-gh-pages.sh"] = getBashDeployScript();
      files["deploy-gh-pages.ps1"] = getPowerShellDeployScript();
      files[".nojekyll"] = "";
      files[".gitattributes"] = `* text=auto eol=lf\n*.ps1 text eol=crlf\n`;
      files[".editorconfig"] = `root = true\n\n[*]\nend_of_line = lf\ninsert_final_newline = true\ncharset = utf-8\nindent_style = space\nindent_size = 2\n\n[*.ps1]\nend_of_line = crlf\n`;

      files["README.md"] = makeDeploymentReadme(files, this.data.personalInfo.fullName);

      const root = `portfolio-${(this.data.personalInfo.fullName || "portfolio")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9._-]/g, "")}`;

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

/* =========================
   Factory
   ========================= */

export function createSSRExporter(
  data: PortfolioData,
  template: AdvancedTemplate,
  config?: AdvancedTemplateConfig
): IExporter {
  return new SSRMultiPageExporter(data, template, config);
}
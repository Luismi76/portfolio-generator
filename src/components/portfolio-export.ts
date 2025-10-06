// src/portfolio-export.ts - EXPORTADOR CON ESTILOS COMPLETOS DE TemplateTheme
import {
  PortfolioData,
  Project,
  ExportResult,
  IExporter,
} from "../types/portfolio-types";
import { Template, TemplateConfig } from "../types/template-types";
import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from "../types/advanced-template-types";
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
   Helpers
   ========================= */


export const downloadFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getTechIcon = (tech: string): string => {
  const t = tech.toLowerCase();
  if (t.includes("react")) return "⚛️";
  if (t.includes("vue")) return "💚";
  if (t.includes("angular")) return "🅰️";
  if (t.includes("javascript") || t.includes("js")) return "💛";
  if (t.includes("typescript") || t.includes("ts")) return "💙";
  if (t.includes("python")) return "🐍";
  if (t.includes("node")) return "💚";
  if (t.includes("css")) return "🎨";
  if (t.includes("html")) return "🌐";
  if (t.includes("docker")) return "🐳";
  if (t.includes("git")) return "📦";
  return "⚡";
};

const deepMerge = (target: any, source: any): any => {
  const t = target && typeof target === "object" ? target : {};
  const s = source && typeof source === "object" ? source : {};
  const result: any = { ...t };
  for (const key in s) {
    const sv = s[key];
    if (sv && typeof sv === "object" && !Array.isArray(sv)) {
      result[key] = deepMerge(t[key], sv);
    } else {
      result[key] = sv;
    }
  }
  return result;
};

type SectionLike = { id: string; enabled: boolean; order: number };

/* =========================
   Defaults
   ========================= */
const DEFAULT_COLORS = {
  primary: "#2563eb",
  secondary: "#7c3aed",
  accent: "#10b981",
  background: "#ffffff",
  surface: "#ffffff",
  text: {
    primary: "#111827",
    secondary: "#374151",
    accent: "#2563eb",
  },
} as const;

const DEFAULT_TYPOGRAPHY = {
  fontFamily: {
    primary:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    heading:
      "Poppins, Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    code: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
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
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

const DEFAULT_LAYOUT = {
  maxWidth: "1200px",
  spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "40px" },
  borderRadius: { sm: "6px", md: "10px", lg: "14px", xl: "24px" },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.06)",
    md: "0 4px 8px rgba(0,0,0,0.08)",
    lg: "0 10px 20px rgba(0,0,0,0.12)",
    xl: "0 20px 40px rgba(0,0,0,0.14)",
  },
} as const;

/* =========================
   GENERADOR DE CSS COMPLETO (con estilos .tpl-*)
   ========================= */

const generateAdvancedTemplateCSS = (
  template: Template | AdvancedTemplate,
  config?: TemplateConfig | AdvancedTemplateConfig
): string => {
  const customizations = (config as any)?.customizations ?? {};

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

  const gradient = safeColors.gradient;
  const gradientCss =
    gradient?.from && gradient?.to
      ? `--gradient-primary: linear-gradient(${
          gradient?.direction ?? "135deg"
        }, ${gradient.from}, ${gradient.to});`
      : "";

  // Fondo del header (igual que en TemplateTheme.tsx)
  const headerBackground = gradient?.from && gradient?.to
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

// Secciones habilitadas
const getEnabledSections = (
  template: Template | AdvancedTemplate,
  config?: TemplateConfig | AdvancedTemplateConfig
): SectionLike[] => {
  const customSections = (config as any)?.customizations?.sections;
  const base = customSections && Array.isArray(customSections)
    ? customSections
    : ((template as any).sections || []);
  return (base as SectionLike[])
    .filter((s) => s.enabled === true)
    .sort((a, b) => a.order - b.order);
};

const isAboutSectionEnabled = (
  template: Template | AdvancedTemplate,
  config?: TemplateConfig | AdvancedTemplateConfig
): boolean => {
  const sections: SectionLike[] =
    (config as any)?.customizations?.sections ||
    ((template as any).sections as SectionLike[]) ||
    [];
  const aboutSection = sections.find((section) => section.id === "about");
  return aboutSection?.enabled ?? false;
};

/* =========================
   Secciones (HTML) - USANDO CLASES .tpl-*
   ========================= */

const generateSectionHTML = (
  sectionId: string,
  data: PortfolioData,
  isMultiPage: boolean = false,
  template?: Template | AdvancedTemplate,
  config?: TemplateConfig | AdvancedTemplateConfig
): string => {
  switch (sectionId) {
    case "header": {
      const includeAboutInHeader =
        data.personalInfo.summary && !isAboutSectionEnabled(template!, config);

      const chips: string[] = [];
      if (data.personalInfo.email)
        chips.push(`<a href="mailto:${data.personalInfo.email}" class="tpl-chip">✉️ ${data.personalInfo.email}</a>`);
      if (data.personalInfo.phone)
        chips.push(`<a href="tel:${data.personalInfo.phone}" class="tpl-chip">📱 ${data.personalInfo.phone}</a>`);
      if (data.personalInfo.location)
        chips.push(`<span class="tpl-chip">📍 ${data.personalInfo.location}</span>`);
      if (data.personalInfo.website)
        chips.push(`<a href="${data.personalInfo.website}" target="_blank" class="tpl-chip">🌐 Website</a>`);
      if (data.personalInfo.github)
        chips.push(`<a href="${data.personalInfo.github}" target="_blank" class="tpl-chip">📁 GitHub</a>`);
      if (data.personalInfo.linkedin)
        chips.push(`<a href="${data.personalInfo.linkedin}" target="_blank" class="tpl-chip">💼 LinkedIn</a>`);

      return `
        <header class="tpl-header" style="position: relative; isolation: isolate; overflow: hidden; padding-top: clamp(2rem, 5vw, var(--sp-lg)); padding-bottom: clamp(2rem, 5vw, var(--sp-lg)); margin-bottom: var(--sp-md);">
          <div class="tpl-container" style="position: relative; z-index: 1;">
            <h1 class="tpl-heading" style="font-size: clamp(2rem, 5vw, var(--fs-3xl)); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; color: var(--text-on-primary, #fff); text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); margin: 0 0 var(--sp-sm) 0;">
              ${data.personalInfo.fullName || "Tu Nombre"}
            </h1>
            
            ${data.personalInfo.title ? `
              <p class="tpl-subtext" style="font-size: clamp(1rem, 2.5vw, var(--fs-lg)); opacity: 0.95; color: var(--text-on-primary, #fff); margin: 0 0 var(--sp-md) 0;">
                ${data.personalInfo.title}
              </p>
            ` : ''}

            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: var(--sp-sm); justify-content: center;">
              ${data.personalInfo.email ? `
                <a href="mailto:${data.personalInfo.email}" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px;">
                  ✉️ Contactar
                </a>
              ` : ''}
              <a href="#projects" class="tpl-btn-outline" style="display: inline-flex; align-items: center; gap: 8px; border-color: rgba(255,255,255,0.4); color: var(--text-on-primary, #fff); background: transparent;">
                ⭐ Ver proyectos
              </a>
            </div>

            ${includeAboutInHeader ? `
              <p class="tpl-subtext" style="max-width: 600px; margin: var(--sp-lg) auto 0; line-height: 1.6; color: var(--text-on-primary, #fff); opacity: 0.95;">
                ${data.personalInfo.summary}
              </p>
            ` : ''}

            ${chips.length > 0 ? `
              <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: var(--sp-md); justify-content: center;">
                ${chips.join('')}
              </div>
            ` : ''}
          </div>

          <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" style="position: absolute; left: 0; bottom: 0; width: 100%; height: 32px; opacity: 0.15; pointer-events: none; z-index: 0;">
            <path d="M0,64 C240,128 480,0 720,32 C960,64 1200,176 1440,96 L1440,160 L0,160 Z" fill="currentColor" />
          </svg>
        </header>
      `;
    }

    case "about": {
      if (!data.personalInfo.summary) return "";
      return `
        <section id="about" style="position: relative; z-index: 1; background: var(--color-surface, #fff); padding-top: var(--sp-lg); padding-bottom: var(--sp-lg);">
          <div class="tpl-container">
            <h2 class="tpl-heading" style="font-size: var(--fs-2xl); margin-bottom: var(--sp-md);">Sobre Mí</h2>
            <div class="tpl-surface" style="padding: var(--sp-md);">
              <p class="tpl-subtext" style="font-size: var(--fs-base); line-height: 1.6; margin: 0;">
                ${data.personalInfo.summary}
              </p>
            </div>
          </div>
        </section>
      `;
    }

    case "projects": {
      const projectsHTML = generateProjectsHTML(data.projects, isMultiPage);
      if (!projectsHTML) return "";
      return `
        <section id="projects" style="padding-top: var(--sp-lg); padding-bottom: var(--sp-lg);">
          <div class="tpl-container">
            <h2 class="tpl-heading" style="font-size: var(--fs-2xl); margin-bottom: var(--sp-md);">Mis Proyectos</h2>
            <div style="display: grid; gap: var(--sp-md); grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); align-items: stretch;">
              ${projectsHTML}
            </div>
          </div>
        </section>
      `;
    }

    case "skills": {
      const skillsHTML = generateSkillsHTML(data.skills);
      if (!skillsHTML) return "";
      return `
        <section style="padding-top: var(--sp-lg); padding-bottom: var(--sp-lg);">
          <div class="tpl-container">
            <h2 class="tpl-heading" style="font-size: var(--fs-2xl); margin-bottom: var(--sp-md);">Habilidades Técnicas</h2>
            <div style="display: grid; gap: var(--sp-md); grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); align-items: start;">
              ${skillsHTML}
            </div>
          </div>
        </section>
      `;
    }

    case "experience": {
      const experienceHTML = generateExperienceHTML(data.experience);
      if (!experienceHTML) return "";
      return `
        <section style="padding-top: var(--sp-lg); padding-bottom: var(--sp-lg);">
          <div class="tpl-container">
            <h2 class="tpl-heading" style="font-size: var(--fs-2xl); margin-bottom: var(--sp-md);">Experiencia</h2>
            ${experienceHTML}
          </div>
        </section>
      `;
    }

    case "contact": {
      const contactHTML = generateContactHTML(data.personalInfo);
      if (!contactHTML) return "";
      return `
        <section style="padding-top: var(--sp-lg); padding-bottom: var(--sp-lg);">
          <div class="tpl-container">
            <h2 class="tpl-heading" style="font-size: var(--fs-2xl); margin-bottom: var(--sp-md); text-align: center;">Contacto</h2>
            ${contactHTML}
          </div>
        </section>
      `;
    }

    default:
      return "";
  }
};

/* =========================
   Bloques HTML (usando clases .tpl-*)
   ========================= */

export const generateProjectsHTML = (
  projects: Project[],
  isMultiPage: boolean = false
): string =>
  projects
    .filter((p) => p.title.trim())
    .map((project) => {
      const slug = generateSlug(project.title);
      return `
      <article class="tpl-card" style="overflow: hidden; display: flex; flex-direction: column; height: 100%;">
        <div style="position: relative; width: 100%; padding-top: 56.25%; background: var(--card-media-bg, rgba(0,0,0,.05));">
          ${project.image 
            ? `<img src="${project.image}" alt="${project.title}" loading="lazy" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">`
            : `<div style="position: absolute; inset: 0; display: grid; place-items: center; font-size: var(--fs-lg); opacity: 0.5;">${project.title?.slice(0, 1) ?? '•'}</div>`
          }
        </div>
        
        <div style="padding: var(--sp-md); display: flex; flex-direction: column; gap: var(--sp-sm); flex: 1; min-height: 0;">
          <h3 class="tpl-heading" style="margin: 0; font-size: var(--fs-lg);">${project.title}</h3>
          
          ${project.description ? `
            <p class="tpl-subtext" style="font-size: var(--fs-base); margin: 0;">${project.description}</p>
          ` : ''}
          
          ${project.technologies ? `
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${project.technologies.split(',').slice(0, 4).map(tech => 
                `<span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: var(--color-primary); color: #fff; border-radius: var(--br-sm); font-size: var(--fs-sm); font-weight: var(--fw-medium);">
                  ${getTechIcon(tech.trim())} ${tech.trim()}
                </span>`
              ).join('')}
            </div>
          ` : ''}
          
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto;">
            ${isMultiPage ? `
              <a href="projects-${slug}.html" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; font-weight: 600; line-height: 1.1;">
                Ver Detalles
              </a>
            ` : ''}
            ${project.link ? `
              <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="tpl-btn-outline" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; font-weight: 600; line-height: 1.1; text-decoration: none;">
                🌐 Ver Proyecto
              </a>
            ` : ''}
            ${project.github ? `
              <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="tpl-btn-outline" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; font-weight: 600; line-height: 1.1; text-decoration: none;">
                📁 Código
              </a>
            ` : ''}
          </div>
        </div>
      </article>
    `;
    })
    .join("");

export const generateSkillsHTML = (
  skills: Array<{ category: string; items: string }>
): string =>
  skills
    .filter((s) => s.category.trim())
    .map(
      (skill) => `
      <div class="tpl-surface" style="padding: var(--sp-md); display: flex; flex-direction: column; gap: var(--sp-sm);">
        <h3 class="tpl-heading" style="font-size: var(--fs-lg); margin: 0;">${skill.category}</h3>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${skill.items
            .split(",")
            .map((item) => {
              const name = item.trim();
              return `<span style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; background: var(--color-secondary); color: #fff; border-radius: var(--br-md); font-size: var(--fs-sm); font-weight: var(--fw-medium);">
                ${getTechIcon(name)} ${name}
              </span>`;
            })
            .join("")}
        </div>
      </div>
    `
    )
    .join("");

const generateExperienceHTML = (
  experience: Array<{ company: string; position: string; period: string; description: string }>
): string =>
  experience
    .filter((exp) => exp.company.trim() || exp.position.trim())
    .map(
      (exp) => `
      <div class="tpl-surface" style="padding: var(--sp-md); margin-bottom: var(--sp-md); border-left: 4px solid var(--color-primary);">
        <h3 class="tpl-heading" style="color: var(--color-primary); font-size: var(--fs-xl); margin: 0 0 var(--sp-xs) 0;">${exp.position}</h3>
        <div class="tpl-subtext" style="font-weight: var(--fw-medium); margin-bottom: var(--sp-xs);">${exp.company}</div>
        <div style="color: var(--color-accent); font-size: var(--fs-sm); font-weight: var(--fw-medium); margin-bottom: var(--sp-sm);">${exp.period}</div>
        <p class="tpl-subtext" style="margin: 0;">${exp.description}</p>
      </div>
    `
    )
    .join("");

const generateContactHTML = (personalInfo: any): string => {
  const contacts: string[] = [];
  if (personalInfo.email) contacts.push(`<a href="mailto:${personalInfo.email}" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: var(--br-md); text-decoration: none; font-weight: var(--fw-medium);">📧 ${personalInfo.email}</a>`);
  if (personalInfo.phone) contacts.push(`<a href="tel:${personalInfo.phone}" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: var(--br-md); text-decoration: none; font-weight: var(--fw-medium);">📱 ${personalInfo.phone}</a>`);
  if (personalInfo.linkedin) contacts.push(`<a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: var(--br-md); text-decoration: none; font-weight: var(--fw-medium);">💼 LinkedIn</a>`);
  if (personalInfo.github) contacts.push(`<a href="${personalInfo.github}" target="_blank" rel="noopener noreferrer" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: var(--br-md); text-decoration: none; font-weight: var(--fw-medium);">📁 GitHub</a>`);
  if (personalInfo.website) contacts.push(`<a href="${personalInfo.website}" target="_blank" rel="noopener noreferrer" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: var(--br-md); text-decoration: none; font-weight: var(--fw-medium);">🌐 Website</a>`);
  
  if (contacts.length === 0) return "";
  
  return `
    <div class="tpl-surface" style="padding: var(--sp-lg); text-align: center;">
      <p class="tpl-subtext" style="font-size: var(--fs-lg); margin-bottom: var(--sp-md);">
        ¿Tienes un proyecto en mente? ¡Hablemos!
      </p>
      <div style="display: flex; justify-content: center; gap: var(--sp-md); flex-wrap: wrap;">
        ${contacts.join('')}
      </div>
    </div>
  `;
};

/* =========================
   Exportadores
   ========================= */

export class TemplateAwareSinglePageExporter implements IExporter {
  constructor(
    private data: PortfolioData,
    private template: Template | AdvancedTemplate,
    private config?: TemplateConfig | AdvancedTemplateConfig
  ) {}

  private generate(): string {
    const css = generateAdvancedTemplateCSS(this.template, this.config);
    const sectionsHTML = getEnabledSections(this.template, this.config)
      .map((s) => generateSectionHTML(s.id, this.data, false, this.template, this.config))
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
        this.data.personalInfo.fullName,
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
        ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="tpl-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">📁 Ver Código</a>` : ""}
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
      .map((s) => generateSectionHTML(s.id, this.data, true, this.template, this.config))
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
        this.data.personalInfo.fullName,
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

/* =========================
   Factory
   ========================= */

type ExportMode = "single" | "multi";

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
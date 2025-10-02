// src/portfolio-export.ts - EXPORTADORES CON SOPORTE COMPLETO DE PERSONALIZACIÓN
import { PortfolioData, Project } from '../types/portfolio-types';
import { Template, TemplateConfig } from '../types/template-types';
import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from '../types/advanced-template-types';

// =========================
// Helpers públicos sencillos
// =========================

// ✅ EXPORTAR helper para descargar archivos
export const downloadFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ✅ Slug desde título
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

// ✅ Icono de tecnología
export const getTechIcon = (tech: string): string => {
  const techLower = tech.toLowerCase();
  if (techLower.includes('react')) return '⚛️';
  if (techLower.includes('vue')) return '💚';
  if (techLower.includes('angular')) return '🅰️';
  if (techLower.includes('javascript') || techLower.includes('js')) return '💛';
  if (techLower.includes('typescript') || techLower.includes('ts')) return '💙';
  if (techLower.includes('python')) return '🐍';
  if (techLower.includes('node')) return '💚';
  if (techLower.includes('css')) return '🎨';
  if (techLower.includes('html')) return '🌐';
  if (techLower.includes('docker')) return '🐳';
  if (techLower.includes('git')) return '📦';
  return '⚡';
};

// =========================
// Utilidades internas
// =========================

// Deep merge sencillo (objetos planos / anidados)
const deepMerge = (target: any, source: any): any => {
  const t = (target && typeof target === 'object') ? target : {};
  const s = (source && typeof source === 'object') ? source : {};
  const result: any = { ...t };
  for (const key in s) {
    const sv = s[key];
    if (sv && typeof sv === 'object' && !Array.isArray(sv)) {
      result[key] = deepMerge(t[key], sv);
    } else {
      result[key] = sv;
    }
  }
  return result;
};

// Type guard para distinguir plantilla avanzada
function isAdvancedTemplate(t: Template | AdvancedTemplate): t is AdvancedTemplate {
  return (t as AdvancedTemplate)?.layout !== undefined;
}

// Tipo mínimo de sección que usamos en este archivo
type SectionLike = { id: string; enabled: boolean; order: number };

// =========================
// Defaults seguros
// =========================
const DEFAULT_COLORS = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  accent: '#10b981',
  background: '#ffffff',
  surface: '#ffffff',
  text: {
    primary: '#111827',
    secondary: '#374151',
    accent: '#2563eb',
  },
  // gradient es opcional; cuando no haya, no se imprime la var
  // gradient: { direction: '135deg', from: '#2563eb', to: '#7c3aed' }
} as const;

const DEFAULT_TYPOGRAPHY = {
  fontFamily: {
    primary: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    heading: 'Poppins, Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    code: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

const DEFAULT_LAYOUT = {
  maxWidth: '1100px',
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '40px' },
  borderRadius: { sm: '6px', md: '10px', lg: '14px', xl: '24px' },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 8px rgba(0,0,0,0.08)',
    lg: '0 10px 20px rgba(0,0,0,0.12)',
    xl: '0 20px 40px rgba(0,0,0,0.14)',
  },
} as const;

// =========================
// Generadores de CSS/HTML
// =========================

/**
 * Genera el CSS a partir de la plantilla + config. Acepta tanto Template simple como AdvancedTemplate,
 * siempre que expongan las mismas claves usadas (colors, typography, layout, customCSS).
 */
const generateAdvancedTemplateCSS = (
  template: Template | AdvancedTemplate,
  config?: TemplateConfig | AdvancedTemplateConfig
): string => {
  const customizations = (config as any)?.customizations ?? {};

  // Merge con defaults → plantilla → custom
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

  // ✅ VALIDACIÓN: Asegurar que colors tiene las propiedades mínimas necesarias
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

  // ✅ VALIDACIÓN: Asegurar que typography tiene las propiedades necesarias
  const safeTypography = {
    fontFamily: {
      primary: typography?.fontFamily?.primary ?? DEFAULT_TYPOGRAPHY.fontFamily.primary,
      heading: typography?.fontFamily?.heading ?? DEFAULT_TYPOGRAPHY.fontFamily.heading,
      code: typography?.fontFamily?.code ?? DEFAULT_TYPOGRAPHY.fontFamily.code,
    },
    fontSize: {
      xs: typography?.fontSize?.xs ?? DEFAULT_TYPOGRAPHY.fontSize.xs,
      sm: typography?.fontSize?.sm ?? DEFAULT_TYPOGRAPHY.fontSize.sm,
      base: typography?.fontSize?.base ?? DEFAULT_TYPOGRAPHY.fontSize.base,
      lg: typography?.fontSize?.lg ?? DEFAULT_TYPOGRAPHY.fontSize.lg,
      xl: typography?.fontSize?.xl ?? DEFAULT_TYPOGRAPHY.fontSize.xl,
      '2xl': typography?.fontSize?.['2xl'] ?? DEFAULT_TYPOGRAPHY.fontSize['2xl'],
      '3xl': typography?.fontSize?.['3xl'] ?? DEFAULT_TYPOGRAPHY.fontSize['3xl'],
      '4xl': typography?.fontSize?.['4xl'] ?? DEFAULT_TYPOGRAPHY.fontSize['4xl'],
    },
    fontWeight: {
      normal: typography?.fontWeight?.normal ?? DEFAULT_TYPOGRAPHY.fontWeight.normal,
      medium: typography?.fontWeight?.medium ?? DEFAULT_TYPOGRAPHY.fontWeight.medium,
      semibold: typography?.fontWeight?.semibold ?? DEFAULT_TYPOGRAPHY.fontWeight.semibold,
      bold: typography?.fontWeight?.bold ?? DEFAULT_TYPOGRAPHY.fontWeight.bold,
    },
  };

  // ✅ VALIDACIÓN: Asegurar que layout tiene las propiedades necesarias
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
  const gradientCss = (gradient?.from && gradient?.to)
    ? `--gradient-primary: linear-gradient(${gradient?.direction ?? '135deg'}, ${gradient.from}, ${gradient.to});`
    : '';

  // LOGS ÚTILES
  console.log('[EXPORT/CSS] colors.in:', (template as any)?.colors);
  console.log('[EXPORT/CSS] colors.safe.text.primary:', safeColors.text.primary);

  return `
    /* Variables CSS personalizadas - Plantilla: ${(template as any)?.name ?? 'Advanced Template'} */
    :root {
      --color-primary: ${safeColors.primary};
      --color-secondary: ${safeColors.secondary};
      --color-accent: ${safeColors.accent};
      --color-background: ${safeColors.background};
      --color-surface: ${safeColors.surface};
      --color-text-primary: ${safeColors.text.primary};
      --color-text-secondary: ${safeColors.text.secondary};
      --color-text-accent: ${safeColors.text.accent};
      ${gradientCss}

      --font-primary: ${safeTypography.fontFamily.primary};
      --font-heading: ${safeTypography.fontFamily.heading};
      --font-code: ${safeTypography.fontFamily.code};

      --text-xs: ${safeTypography.fontSize.xs};
      --text-sm: ${safeTypography.fontSize.sm};
      --text-base: ${safeTypography.fontSize.base};
      --text-lg: ${safeTypography.fontSize.lg};
      --text-xl: ${safeTypography.fontSize.xl};
      --text-2xl: ${safeTypography.fontSize['2xl']};
      --text-3xl: ${safeTypography.fontSize['3xl']};
      --text-4xl: ${safeTypography.fontSize['4xl']};

      --weight-normal: ${safeTypography.fontWeight.normal};
      --weight-medium: ${safeTypography.fontWeight.medium};
      --weight-semibold: ${safeTypography.fontWeight.semibold};
      --weight-bold: ${safeTypography.fontWeight.bold};

      --max-width: ${safeLayout.maxWidth};
      --spacing-xs: ${safeLayout.spacing.xs};
      --spacing-sm: ${safeLayout.spacing.sm};
      --spacing-md: ${safeLayout.spacing.md};
      --spacing-lg: ${safeLayout.spacing.lg};
      --spacing-xl: ${safeLayout.spacing.xl};

      --radius-sm: ${safeLayout.borderRadius.sm};
      --radius-md: ${safeLayout.borderRadius.md};
      --radius-lg: ${safeLayout.borderRadius.lg};
      --radius-xl: ${safeLayout.borderRadius.xl};

      --shadow-sm: ${safeLayout.shadows.sm};
      --shadow-md: ${safeLayout.shadows.md};
      --shadow-lg: ${safeLayout.shadows.lg};
      --shadow-xl: ${safeLayout.shadows.xl};
    }

    /* Reset y base */
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--font-primary);
      font-size: var(--text-base);
      font-weight: var(--weight-normal);
      line-height: 1.6;
      color: var(--color-text-primary);
      background-color: var(--color-background);
    }

    .container {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: var(--spacing-md);
    }

    /* Header */
    .header {
      text-align: center;
      padding: var(--spacing-xl) var(--spacing-md);
      ${gradient ? `background: var(--gradient-primary);` : `background: var(--color-primary);`}
      color: white;
      margin-bottom: var(--spacing-lg);
      border-radius: var(--radius-lg);
    }

    .header-content { max-width: 800px; margin: 0 auto; }

    .header h1 {
      font-family: var(--font-heading);
      font-size: var(--text-4xl);
      font-weight: var(--weight-bold);
      margin-bottom: var(--spacing-sm);
      line-height: 1.2;
    }

    .header .title { font-size: var(--text-xl); font-weight: var(--weight-medium); opacity: 0.9; margin-bottom: var(--spacing-md); }
    .header .tagline { font-size: var(--text-lg); font-weight: var(--weight-medium); opacity: 0.8; margin-bottom: var(--spacing-sm); }
    .header .summary { font-size: var(--text-lg); opacity: 0.95; max-width: 600px; margin: 0 auto var(--spacing-lg); line-height: 1.6; }

    .contact-info { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--spacing-md); margin-top: var(--spacing-lg); }
    .contact-link {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.1); color: white; padding: 8px 16px;
      border-radius: 25px; text-decoration: none; font-size: var(--text-sm);
      font-weight: var(--weight-medium); transition: all 0.2s ease; backdrop-filter: blur(10px);
    }
    .contact-link:hover { background: rgba(255,255,255,0.2); transform: translateY(-1px); }

    .section { margin-bottom: var(--spacing-xl); }
    .section h2 {
      font-family: var(--font-heading); font-size: var(--text-3xl); font-weight: var(--weight-bold);
      color: var(--color-primary); text-align: center; margin-bottom: var(--spacing-lg);
    }

    .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px,1fr)); gap: var(--spacing-md); margin-bottom: var(--spacing-lg); }
    .project-card { background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--spacing-md); box-shadow: var(--shadow-md); transition: all .3s ease; border: 1px solid rgba(0,0,0,.1); }
    .project-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    .project-card h3 { font-family: var(--font-heading); font-size: var(--text-xl); font-weight: var(--weight-semibold); color: var(--color-primary); margin-bottom: var(--spacing-sm); }
    .project-card p { color: var(--color-text-secondary); margin-bottom: var(--spacing-md); line-height: 1.6; }

    .tech-tags { display: flex; flex-wrap: wrap; gap: var(--spacing-xs); margin-bottom: var(--spacing-md); }
    .tech-tag { display: inline-flex; align-items: center; gap: 4px; background: var(--color-primary); color: white; padding: 4px 8px; border-radius: var(--radius-sm); font-size: var(--text-sm); font-weight: var(--weight-medium); }

    .project-links { display: flex; gap: var(--spacing-sm); flex-wrap: wrap; }
    .project-links a {
      display: inline-flex; align-items: center; padding: 8px 16px;
      background: var(--color-accent); color: white; text-decoration: none;
      border-radius: var(--radius-md); font-weight: var(--weight-medium); transition: all .2s ease;
    }
    .project-links a:hover { opacity: .8; transform: translateY(-1px); }

    .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-md); }
    .skill-category { background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--spacing-md); box-shadow: var(--shadow-sm); }
    .skill-category h3 { font-family: var(--font-heading); font-size: var(--text-xl); font-weight: var(--weight-semibold); color: var(--color-primary); margin-bottom: var(--spacing-md); text-align: center; }
    .skill-items { display: flex; flex-wrap: wrap; gap: var(--spacing-xs); }
    .skill-item { display: inline-flex; align-items: center; gap: 4px; background: var(--color-secondary); color: white; padding: 6px 12px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--weight-medium); }

    .about-section { background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--spacing-lg); margin-bottom: var(--spacing-xl); text-align: center; }
    .about-section h2 { margin-bottom: var(--spacing-md); }
    .about-section p { font-size: var(--text-lg); color: var(--color-text-secondary); max-width: 800px; margin: 0 auto; }

    .experience-section .experience-item { background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--spacing-md); margin-bottom: var(--spacing-md); border-left: 4px solid var(--color-primary); }
    .experience-item h3 { color: var(--color-primary); font-size: var(--text-xl); font-weight: var(--weight-semibold); margin-bottom: var(--spacing-xs); }
    .experience-item .company { color: var(--color-text-secondary); font-weight: var(--weight-medium); margin-bottom: var(--spacing-xs); }
    .experience-item .period { color: var(--color-accent); font-size: var(--text-sm); font-weight: var(--weight-medium); margin-bottom: var(--spacing-sm); }

    .contact-section { background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--spacing-lg); text-align: center; }
    .contact-links { display: flex; justify-content: center; gap: var(--spacing-md); flex-wrap: wrap; margin-top: var(--spacing-md); }
    .contact-links a { display: inline-flex; align-items: center; gap: 8px; background: var(--color-primary); color: white; padding: 12px 20px; border-radius: var(--radius-md); text-decoration: none; font-weight: var(--weight-medium); transition: all .2s ease; }
    .contact-links a:hover { background: var(--color-secondary); transform: translateY(-2px); }

    .footer { text-align: center; padding: var(--spacing-lg) 0; margin-top: var(--spacing-xl); border-top: 1px solid rgba(0,0,0,.1); color: var(--color-text-secondary); }

    @media (max-width: 768px) {
      .container { padding: var(--spacing-sm); }
      .header { padding: var(--spacing-lg) var(--spacing-sm); margin-bottom: var(--spacing-md); }
      .header h1 { font-size: var(--text-3xl); }
      .header .title { font-size: var(--text-lg); }
      .header .summary { font-size: var(--text-base); }
      .contact-info { gap: var(--spacing-sm); }
      .contact-link { padding: 6px 12px; font-size: 0.8rem; }
      .projects-grid { grid-template-columns: 1fr; }
      .project-links { flex-direction: column; }
      .contact-links { flex-direction: column; align-items: center; }
    }

    /* CSS personalizado del usuario y la plantilla */
    ${(customizations as any).customCSS || (template as any).customCSS || ''}
  `;
};

// Obtener secciones ordenadas y habilitadas (acepta simple o avanzada)
const getEnabledSections = (
  template: Template | AdvancedTemplate,
  config?: TemplateConfig | AdvancedTemplateConfig
): SectionLike[] => {
  let sections: SectionLike[];

  const customSections = (config as any)?.customizations?.sections;
  if (customSections && Array.isArray(customSections)) {
    sections = customSections as SectionLike[];
    console.log('🎯 Usando secciones personalizadas:', sections.map(s => `${s.id}:${s.enabled}`));
  } else {
    sections = ((template as any).sections || []) as SectionLike[];
    console.log('📋 Usando secciones de plantilla:', sections.map(s => `${s.id}:${s.enabled}`));
  }

  const enabledSections = sections.filter(section => section.enabled === true);
  console.log('✅ Secciones habilitadas finales:', enabledSections.map(s => s.id));
  return enabledSections.sort((a, b) => a.order - b.order);
};

const isAboutSectionEnabled = (
  template: Template | AdvancedTemplate,
  config?: TemplateConfig | AdvancedTemplateConfig
): boolean => {
  const sections: SectionLike[] =
    (config as any)?.customizations?.sections ||
    ((template as any).sections as SectionLike[]) ||
    [];
  const aboutSection = sections.find(section => section.id === 'about');
  const aboutEnabled = aboutSection?.enabled ?? false;
  console.log('🔍 About section enabled?', aboutEnabled);
  return aboutEnabled;
};

// =========================
/** Secciones (HTML) */
// =========================

const generateSectionHTML = (
  sectionId: string,
  data: PortfolioData,
  isMultiPage: boolean = false,
  template?: Template | AdvancedTemplate,
  config?: TemplateConfig | AdvancedTemplateConfig
): string => {
  switch (sectionId) {
    case 'header': {
      const includeAboutInHeader =
        data.personalInfo.summary && !isAboutSectionEnabled(template!, config);

      const contactLinks: string[] = [];
      if (data.personalInfo.email) {
        contactLinks.push(`<a href="mailto:${data.personalInfo.email}" class="contact-link">✉️ ${data.personalInfo.email}</a>`);
      }
      if (data.personalInfo.phone) {
        contactLinks.push(`<a href="tel:${data.personalInfo.phone}" class="contact-link">📱 ${data.personalInfo.phone}</a>`);
      }
      if (data.personalInfo.location) {
        contactLinks.push(`<div class="contact-link">📍 ${data.personalInfo.location}</div>`);
      }
      if (data.personalInfo.website) {
        contactLinks.push(`<a href="${data.personalInfo.website}" target="_blank" class="contact-link">🌐 Website</a>`);
      }
      if (data.personalInfo.github) {
        contactLinks.push(`<a href="${data.personalInfo.github}" target="_blank" class="contact-link">📁 GitHub</a>`);
      }
      if (data.personalInfo.linkedin) {
        contactLinks.push(`<a href="${data.personalInfo.linkedin}" target="_blank" class="contact-link">💼 LinkedIn</a>`);
      }

      return `
        <header class="header">
          <div class="header-content">
            <h1>${data.personalInfo.fullName || "Tu Nombre"}</h1>
            <p class="title">${data.personalInfo.title || "Tu Título"}</p>
            ${data.personalInfo.tagline ? `<p class="tagline">${data.personalInfo.tagline}</p>` : ''}
            ${includeAboutInHeader ? `<p class="summary">${data.personalInfo.summary}</p>` : ''}
            ${contactLinks.length > 0 ? `<div class="contact-info">${contactLinks.join('')}</div>` : ''}
          </div>
        </header>
      `;
    }

    case 'about': {
      if (!data.personalInfo.summary) {
        console.log('❌ About: No summary content');
        return '';
      }
      console.log('✅ About: Section has content and is being rendered');
      return `
        <section class="section about-section">
          <h2>Sobre Mí</h2>
          <p>${data.personalInfo.summary}</p>
        </section>
      `;
    }

    case 'projects': {
      const projectsHTML = generateProjectsHTML(data.projects, isMultiPage);
      if (!projectsHTML) return '';
      return `
        <section class="section">
          <h2>Mis Proyectos</h2>
          <div class="projects-grid">${projectsHTML}</div>
        </section>
      `;
    }

    case 'skills': {
      const skillsHTML = generateSkillsHTML(data.skills);
      if (!skillsHTML) return '';
      return `
        <section class="section">
          <h2>Habilidades Técnicas</h2>
          <div class="skills-grid">${skillsHTML}</div>
        </section>
      `;
    }

    case 'experience': {
      const experienceHTML = generateExperienceHTML(data.experience);
      if (!experienceHTML) return '';
      return `
        <section class="section experience-section">
          <h2>Experiencia</h2>
          ${experienceHTML}
        </section>
      `;
    }

    case 'contact': {
      const contactHTML = generateContactHTML(data.personalInfo);
      if (!contactHTML) return '';
      return `
        <section class="section contact-section">
          <h2>Contacto</h2>
          ${contactHTML}
        </section>
      `;
    }

    default:
      return '';
  }
};

// =========================
// Generadores de bloques
// =========================

export const generateProjectsHTML = (projects: Project[], isMultiPage: boolean = false): string => {
  return projects
    .filter((p) => p.title.trim())
    .map((project) => {
      const slug = generateSlug(project.title);
      return `
      <div class="project-card">
        ${
          project.image
            ? `<img src="${project.image}" style="width:100%;height:200px;object-fit:cover;border-radius:var(--radius-md);margin-bottom:var(--spacing-md);">`
            : `<div style="width:100%;height:200px;background:var(--gradient-primary, var(--color-primary));border-radius:var(--radius-md);margin-bottom:var(--spacing-md);display:flex;align-items:center;justify-content:center;color:white;font-size:3rem;">🌐</div>`
        }
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        ${
          project.technologies
            ? `
          <div class="tech-tags">
            ${project.technologies
              .split(',')
              .map(
                (tech) =>
                  `<span class="tech-tag">${getTechIcon(tech.trim())} ${tech.trim()}</span>`
              )
              .join('')}
          </div>
        `
            : ''
        }
        <div class="project-links">
          ${isMultiPage ? `<a href="projects-${slug}.html">Ver Detalles</a>` : ''}
          ${project.link ? `<a href="${project.link}" target="_blank">Ver Proyecto</a>` : ''}
          ${project.github ? `<a href="${project.github}" target="_blank">Código</a>` : ''}
        </div>
      </div>
    `;
    })
    .join('');
};

export const generateSkillsHTML = (skills: Array<{ category: string; items: string }>): string => {
  return skills
    .filter((s) => s.category.trim())
    .map(
      (skill) => `
      <div class="skill-category">
        <h3>${skill.category}</h3>
        <div class="skill-items">
          ${skill.items
            .split(',')
            .map((item) => {
              const skillName = item.trim();
              return `<span class="skill-item">${getTechIcon(skillName)} ${skillName}</span>`;
            })
            .join('')}
        </div>
      </div>
    `
    )
    .join('');
};

const generateExperienceHTML = (
  experience: Array<{ company: string; position: string; period: string; description: string }>
): string => {
  return experience
    .filter((exp) => exp.company.trim() || exp.position.trim())
    .map(
      (exp) => `
      <div class="experience-item">
        <h3>${exp.position}</h3>
        <div class="company">${exp.company}</div>
        <div class="period">${exp.period}</div>
        <p>${exp.description}</p>
      </div>
    `
    )
    .join('');
};

const generateContactHTML = (personalInfo: any): string => {
  const contacts: string[] = [];
  if (personalInfo.email) contacts.push(`<a href="mailto:${personalInfo.email}">📧 ${personalInfo.email}</a>`);
  if (personalInfo.phone) contacts.push(`<a href="tel:${personalInfo.phone}">📱 ${personalInfo.phone}</a>`);
  if (personalInfo.linkedin) contacts.push(`<a href="${personalInfo.linkedin}" target="_blank">💼 LinkedIn</a>`);
  if (personalInfo.github) contacts.push(`<a href="${personalInfo.github}" target="_blank">🔗 GitHub</a>`);
  if (personalInfo.website) contacts.push(`<a href="${personalInfo.website}" target="_blank">🌐 Website</a>`);
  if (contacts.length === 0) return '';
  return `
    <p>¿Tienes un proyecto en mente? ¡Hablemos!</p>
    <div class="contact-links">
      ${contacts.join('')}
    </div>
  `;
};

// =========================
// Exportadores (clases)
// =========================

export class TemplateAwareSinglePageExporter {
  constructor(
    private data: PortfolioData,
    private template: Template | AdvancedTemplate,
    private config?: TemplateConfig | AdvancedTemplateConfig
  ) {}

  private generate(): string {
    console.log('🚀 Generando Single Page con config:', this.config);
    const templateCSS = generateAdvancedTemplateCSS(this.template, this.config);
    const enabledSections = getEnabledSections(this.template, this.config);

    // Generar HTML de cada sección habilitada
    const sectionsHTML = enabledSections
      .map((section) => {
        const html = generateSectionHTML(section.id, this.data, false, this.template, this.config);
        console.log(`🔧 Sección ${section.id}: ${html.length > 0 ? 'Generada' : 'Vacía'}`);
        return html;
      })
      .filter((html) => html.trim())
      .join('\n');

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${this.data.personalInfo.fullName || 'Portfolio'}</title>
  <meta name="description" content="Portfolio de ${this.data.personalInfo.fullName || ''} - ${this.data.personalInfo.title || ''}" />
  <style>${templateCSS}</style>
</head>
<body>
  <div class="container">
    ${sectionsHTML}
  </div>
  <footer class="footer">
    <p>&copy; ${new Date().getFullYear()} ${this.data.personalInfo.fullName || 'Tu Nombre'}. Portfolio generado con plantilla "${(this.template as any).name || 'Plantilla'}".</p>
  </footer>
</body>
</html>`;
  }

  export(): { success: boolean; message: string } {
    try {
      const htmlContent = this.generate();
      downloadFile(`${this.data.personalInfo.fullName?.replace(/\s+/g, '_') || 'portfolio'}.html`, htmlContent);
      return {
        success: true,
        message: `Portfolio exportado exitosamente con plantilla "${(this.template as any).name || 'Plantilla'}"`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al exportar: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      };
    }
  }
}

export class TemplateAwareMultiPageExporter {
  constructor(
    private data: PortfolioData,
    private template: Template | AdvancedTemplate,
    private config?: TemplateConfig | AdvancedTemplateConfig
  ) {}

  private generateProjectPage(project: Project): string {
    const templateCSS = generateAdvancedTemplateCSS(this.template, this.config);
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.title} - ${this.data.personalInfo.fullName || ''}</title>
  <meta name="description" content="${project.description || ''}" />
  <style>${templateCSS}</style>
</head>
<body>
  <div class="container">
    <a href="index.html" style="color:var(--color-primary);text-decoration:none;margin-bottom:var(--spacing-md);display:inline-block;font-weight:var(--weight-medium);">← Volver al Portfolio</a>
    <div class="header">
      <h1>${project.title}</h1>
      <p>${project.description || ''}</p>
    </div>

    ${
      project.detailedDescription
        ? `
      <section class="section">
        <div class="project-card">
          <h3>Descripción Detallada</h3>
          <p>${project.detailedDescription}</p>
        </div>
      </section>`
        : ''
    }

    ${
      project.features
        ? `
      <section class="section">
        <div class="project-card">
          <h3>Características Principales</h3>
          <ul style="list-style:none;padding:0;">
            ${project.features
              .split(',')
              .map((feature) => `<li style="padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.1);">✓ ${feature.trim()}</li>`)
              .join('')}
          </ul>
        </div>
      </section>`
        : ''
    }

    ${
      project.technologies
        ? `
      <section class="section">
        <div class="project-card">
          <h3>Tecnologías Utilizadas</h3>
          <div class="tech-tags">
            ${project.technologies
              .split(',')
              .map((tech) => `<span class="tech-tag">${getTechIcon(tech.trim())} ${tech.trim()}</span>`)
              .join('')}
          </div>
        </div>
      </section>`
        : ''
    }

    ${
      project.instructions
        ? `
      <section class="section">
        <div class="project-card">
          <h3>Instrucciones de Uso</h3>
          <pre style="white-space: pre-wrap; background: var(--color-surface); padding: var(--spacing-md); border-radius: var(--radius-md); overflow-x: auto; font-family: var(--font-code, monospace);">${project.instructions}</pre>
        </div>
      </section>`
        : ''
    }

    <section class="section">
      <div class="project-links" style="justify-content: center;">
        ${project.link ? `<a href="${project.link}" target="_blank">🚀 Ver Proyecto Live</a>` : ''}
        ${project.github ? `<a href="${project.github}" target="_blank">📝 Ver Código</a>` : ''}
        <a href="index.html">🏠 Volver al Portfolio</a>
      </div>
    </section>
  </div>

  <footer class="footer">
    <p>&copy; ${new Date().getFullYear()} ${this.data.personalInfo.fullName || ''}. Portfolio con plantilla "${(this.template as any).name || 'Plantilla'}".</p>
  </footer>
</body>
</html>`;
  }

  private generateIndexPage(): string {
    console.log('🚀 Generando Multi Page con config:', this.config);

    const templateCSS = generateAdvancedTemplateCSS(this.template, this.config);
    const enabledSections = getEnabledSections(this.template, this.config);

    const sectionsHTML = enabledSections
      .map((section) => {
        const html = generateSectionHTML(section.id, this.data, true, this.template, this.config);
        console.log(`🔧 Sección ${section.id}: ${html.length > 0 ? 'Generada' : 'Vacía'}`);
        return html;
      })
      .filter((html) => html.trim())
      .join('\n');

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${this.data.personalInfo.fullName || 'Portfolio'}</title>
  <meta name="description" content="Portfolio de ${this.data.personalInfo.fullName || ''} - ${this.data.personalInfo.title || ''}" />
  <style>${templateCSS}</style>
</head>
<body>
  <div class="container">
    ${sectionsHTML}
  </div>

  <footer class="footer">
    <p>&copy; ${new Date().getFullYear()} ${this.data.personalInfo.fullName || 'Tu Nombre'}. Portfolio generado con plantilla "${(this.template as any).name || 'Plantilla'}".</p>
  </footer>
</body>
</html>`;
  }

  generateFiles(): { [filename: string]: string } {
    const files: { [filename: string]: string } = {};

    // Página principal
    files['index.html'] = this.generateIndexPage();

    // Páginas de proyectos
    this.data.projects
      .filter((p) => p.title.trim())
      .forEach((project) => {
        const slug = generateSlug(project.title);
        files[`projects-${slug}.html`] = this.generateProjectPage(project);
      });

    // README mejorado (con fallbacks para evitar undefined)
    const tplAny: any = this.template as any;
    const readmePrimary = tplAny?.colors?.primary ?? DEFAULT_COLORS.primary;
    const readmeSecondary = tplAny?.colors?.secondary ?? DEFAULT_COLORS.secondary;
    const readmeFont = tplAny?.typography?.fontFamily?.primary ?? DEFAULT_TYPOGRAPHY.fontFamily.primary;
    const readmeMaxWidth =
      (this.config as any)?.customizations?.layout?.maxWidth ?? tplAny?.layout?.maxWidth ?? DEFAULT_LAYOUT.maxWidth;

    files['README.md'] = `# ${this.data.personalInfo.fullName || 'Portfolio'} - Portfolio Web

Portfolio generado automáticamente con plantilla **${tplAny?.name || 'Plantilla'}**.

## 🚀 Despliegue en GitHub Pages

### Pasos rápidos:

1. **Crear repositorio**: Ve a GitHub y crea un nuevo repositorio público
2. **Subir archivos**: Arrastra todos los archivos descargados a tu repositorio
3. **Activar Pages**: 
   - Ve a Settings → Pages
   - Selecciona "Deploy from a branch"
   - Elige "main" branch y "/ (root)"
4. **¡Listo!** Tu portfolio estará en \`https://tu-usuario.github.io/nombre-repo\`

## 📁 Archivos incluidos

${Object.keys(files).map((file) => `- \`${file}\``).join('\n')}

## 🎨 Plantilla utilizada

**${tplAny?.name || 'Plantilla'}** - ${tplAny?.description || ''}

### Configuración personalizada:
- **Colores**: ${readmePrimary} (primario), ${readmeSecondary} (secundario)
- **Tipografía**: ${readmeFont}
- **Ancho máximo**: ${readmeMaxWidth}
- **Estilo**: ${tplAny?.category || ''}

## 📱 Características

- ✅ Diseño responsive
- ✅ Optimizado para móviles  
- ✅ Carga rápida
- ✅ SEO optimizado
- ✅ Páginas individuales para proyectos
- ✅ Secciones personalizables

---
*Generado con Portfolio Generator*`;

    return files;
  }

  export(): { success: boolean; message: string; files?: { [filename: string]: string } } {
    try {
      const files = this.generateFiles();

      // Archivo único con instrucciones + todos los contenidos (texto)
      const allFilesContent = Object.entries(files)
        .map(([filename, content]) => {
          return `
═══════════════════════════════════════════════════════════════
📁 ARCHIVO: ${filename}
═══════════════════════════════════════════════════════════════

${content}

`;
        })
        .join('\n');

      const instructions = `# 🎯 INSTRUCCIONES PARA GITHUB PAGES

¡Portfolio generado exitosamente con plantilla "${(this.template as any).name || 'Plantilla'}"!

## 📦 ARCHIVOS GENERADOS (${Object.keys(files).length} archivos):

${Object.keys(files)
  .map((file, index) => `${index + 1}. ✓ ${file}`)
  .join('\n')}

## 🚀 PASOS PARA PUBLICAR:

1) Crea un repositorio en GitHub.
2) Sube todos los archivos generados (o cópialos desde el bloque de archivos de más abajo).
3) En Settings → Pages: "Deploy from a branch" → main → / (root).
4) Abre la URL que te muestra GitHub Pages.

═══════════════════════════════════════════════════════════════
📁 CÓDIGOS DE ARCHIVOS A CONTINUACIÓN:
═══════════════════════════════════════════════════════════════

${allFilesContent}`;

      downloadFile(
        `🌟_PORTFOLIO_COMPLETO_${this.data.personalInfo.fullName?.replace(/\s+/g, '_') || 'PORTFOLIO'}.txt`,
        instructions
      );

      return {
        success: true,
        message: `✅ Sitio web completo exportado con plantilla "${(this.template as any).name || 'Plantilla'}". Se descargó 1 archivo con todo el contenido y las instrucciones.`,
        files,
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Error al exportar: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      };
    }
  }
}

// =========================
// Factory con sobrecargas
// =========================

type ExportMode = 'single' | 'multi';

// Sobrecargas: simple
export function createTemplateAwareExporter(
  data: PortfolioData,
  template: Template,
  type: ExportMode,
  config?: TemplateConfig
): TemplateAwareSinglePageExporter | TemplateAwareMultiPageExporter;

// Sobrecargas: avanzado
export function createTemplateAwareExporter(
  data: PortfolioData,
  template: AdvancedTemplate,
  type: ExportMode,
  config?: AdvancedTemplateConfig
): TemplateAwareSinglePageExporter | TemplateAwareMultiPageExporter;

// Implementación única
export function createTemplateAwareExporter(
  data: PortfolioData,
  template: Template | AdvancedTemplate,
  type: ExportMode,
  config?: TemplateConfig | AdvancedTemplateConfig
) {
  switch (type) {
    case 'single':
      return new TemplateAwareSinglePageExporter(data, template, config);
    case 'multi':
      return new TemplateAwareMultiPageExporter(data, template, config);
    default:
      throw new Error(`Tipo de exportador no válido: ${type}`);
  }
}

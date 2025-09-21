// portfolio-export.ts - EXPORTADORES CON SOPORTE COMPLETO DE PERSONALIZACIÓN
import { PortfolioData, Project } from '../types/portfolio-types';
import { Template, TemplateConfig, TemplateSection } from '../types/template-types';

// ✅ EXPORTAR función helper para descargar archivos
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

// ✅ EXPORTAR la función para generar slug desde título
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

// ✅ EXPORTAR la función para obtener icono de tecnología
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

// ✅ FUNCIÓN AVANZADA: Generar CSS con personalización completa
const generateAdvancedTemplateCSS = (template: Template, config?: TemplateConfig): string => {
  // Combinar configuración base con personalizaciones
  const customizations = config?.customizations || {};
  
  const colors = { ...template.colors, ...customizations.colors };
  const typography = { ...template.typography, ...customizations.typography };
  const layout = { ...template.layout, ...customizations.layout };
  
  return `
    /* Variables CSS personalizadas - Plantilla: ${template.name} */
    :root {
      --color-primary: ${colors.primary};
      --color-secondary: ${colors.secondary};
      --color-accent: ${colors.accent};
      --color-background: ${colors.background};
      --color-surface: ${colors.surface};
      --color-text-primary: ${colors.text.primary};
      --color-text-secondary: ${colors.text.secondary};
      --color-text-accent: ${colors.text.accent};
      ${colors.gradient ? `--gradient-primary: linear-gradient(${colors.gradient.direction || '135deg'}, ${colors.gradient.from}, ${colors.gradient.to});` : ''}
      
      --font-primary: ${typography.fontFamily.primary};
      --font-heading: ${typography.fontFamily.heading};
      ${typography.fontFamily.code ? `--font-code: ${typography.fontFamily.code};` : ''}
      
      --text-xs: ${typography.fontSize.xs};
      --text-sm: ${typography.fontSize.sm};
      --text-base: ${typography.fontSize.base};
      --text-lg: ${typography.fontSize.lg};
      --text-xl: ${typography.fontSize.xl};
      --text-2xl: ${typography.fontSize['2xl']};
      --text-3xl: ${typography.fontSize['3xl']};
      --text-4xl: ${typography.fontSize['4xl']};
      
      --weight-normal: ${typography.fontWeight.normal};
      --weight-medium: ${typography.fontWeight.medium};
      --weight-semibold: ${typography.fontWeight.semibold};
      --weight-bold: ${typography.fontWeight.bold};
      
      --max-width: ${layout.maxWidth};
      --spacing-xs: ${layout.spacing.xs};
      --spacing-sm: ${layout.spacing.sm};
      --spacing-md: ${layout.spacing.md};
      --spacing-lg: ${layout.spacing.lg};
      --spacing-xl: ${layout.spacing.xl};
      
      --radius-sm: ${layout.borderRadius.sm};
      --radius-md: ${layout.borderRadius.md};
      --radius-lg: ${layout.borderRadius.lg};
      --radius-xl: ${layout.borderRadius.xl};
      
      --shadow-sm: ${layout.shadows.sm};
      --shadow-md: ${layout.shadows.md};
      --shadow-lg: ${layout.shadows.lg};
      --shadow-xl: ${layout.shadows.xl};
    }

    /* Reset y base */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

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

    /* Header - Replicando exactamente el portfolio real */
    .header {
      text-align: center;
      padding: var(--spacing-xl) var(--spacing-md);
      ${colors.gradient ? `background: var(--gradient-primary);` : `background: var(--color-primary);`}
      color: white;
      margin-bottom: var(--spacing-lg);
      border-radius: var(--radius-lg);
    }

    .header-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .header h1 {
      font-family: var(--font-heading);
      font-size: var(--text-4xl);
      font-weight: var(--weight-bold);
      margin-bottom: var(--spacing-sm);
      line-height: 1.2;
    }

    .header .title {
      font-size: var(--text-xl);
      font-weight: var(--weight-medium);
      opacity: 0.9;
      margin-bottom: var(--spacing-md);
    }

    .header .tagline {
      font-size: var(--text-lg);
      font-weight: var(--weight-medium);
      opacity: 0.8;
      margin-bottom: var(--spacing-sm);
    }

    .header .summary {
      font-size: var(--text-lg);
      opacity: 0.95;
      max-width: 600px;
      margin: 0 auto var(--spacing-lg);
      line-height: 1.6;
    }

    /* Enlaces de contacto en el header */
    .contact-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--spacing-md);
      margin-top: var(--spacing-lg);
    }

    .contact-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      padding: 8px 16px;
      border-radius: 25px;
      text-decoration: none;
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
    }

    .contact-link:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    /* Secciones */
    .section {
      margin-bottom: var(--spacing-xl);
    }

    .section h2 {
      font-family: var(--font-heading);
      font-size: var(--text-3xl);
      font-weight: var(--weight-bold);
      color: var(--color-primary);
      text-align: center;
      margin-bottom: var(--spacing-lg);
    }

    /* Grid de proyectos */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .project-card {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      padding: var(--spacing-md);
      box-shadow: var(--shadow-md);
      transition: all 0.3s ease;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .project-card h3 {
      font-family: var(--font-heading);
      font-size: var(--text-xl);
      font-weight: var(--weight-semibold);
      color: var(--color-primary);
      margin-bottom: var(--spacing-sm);
    }

    .project-card p {
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-md);
      line-height: 1.6;
    }

    /* Tecnologías */
    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xs);
      margin-bottom: var(--spacing-md);
    }

    .tech-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: var(--color-primary);
      color: white;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
    }

    /* Enlaces de proyecto */
    .project-links {
      display: flex;
      gap: var(--spacing-sm);
      flex-wrap: wrap;
    }

    .project-links a {
      display: inline-flex;
      align-items: center;
      padding: 8px 16px;
      background: var(--color-accent);
      color: white;
      text-decoration: none;
      border-radius: var(--radius-md);
      font-weight: var(--weight-medium);
      transition: all 0.2s ease;
    }

    .project-links a:hover {
      opacity: 0.8;
      transform: translateY(-1px);
    }

    /* Grid de habilidades */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-md);
    }

    .skill-category {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      padding: var(--spacing-md);
      box-shadow: var(--shadow-sm);
    }

    .skill-category h3 {
      font-family: var(--font-heading);
      font-size: var(--text-xl);
      font-weight: var(--weight-semibold);
      color: var(--color-primary);
      margin-bottom: var(--spacing-md);
      text-align: center;
    }

    .skill-items {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xs);
    }

    .skill-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: var(--color-secondary);
      color: white;
      padding: 6px 12px;
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
    }

    /* Sección Sobre Mí */
    .about-section {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
      text-align: center;
    }

    .about-section h2 {
      margin-bottom: var(--spacing-md);
    }

    .about-section p {
      font-size: var(--text-lg);
      color: var(--color-text-secondary);
      max-width: 800px;
      margin: 0 auto;
    }

    /* Sección Experiencia */
    .experience-section .experience-item {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-md);
      border-left: 4px solid var(--color-primary);
    }

    .experience-item h3 {
      color: var(--color-primary);
      font-size: var(--text-xl);
      font-weight: var(--weight-semibold);
      margin-bottom: var(--spacing-xs);
    }

    .experience-item .company {
      color: var(--color-text-secondary);
      font-weight: var(--weight-medium);
      margin-bottom: var(--spacing-xs);
    }

    .experience-item .period {
      color: var(--color-accent);
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      margin-bottom: var(--spacing-sm);
    }

    /* Sección Contacto */
    .contact-section {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      text-align: center;
    }

    .contact-links {
      display: flex;
      justify-content: center;
      gap: var(--spacing-md);
      flex-wrap: wrap;
      margin-top: var(--spacing-md);
    }

    .contact-links a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--color-primary);
      color: white;
      padding: 12px 20px;
      border-radius: var(--radius-md);
      text-decoration: none;
      font-weight: var(--weight-medium);
      transition: all 0.2s ease;
    }

    .contact-links a:hover {
      background: var(--color-secondary);
      transform: translateY(-2px);
    }

    /* Footer */
    .footer {
      text-align: center;
      padding: var(--spacing-lg) 0;
      margin-top: var(--spacing-xl);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      color: var(--color-text-secondary);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .container {
        padding: var(--spacing-sm);
      }
      
      .header {
        padding: var(--spacing-lg) var(--spacing-sm);
        margin-bottom: var(--spacing-md);
      }
      
      .header h1 {
        font-size: var(--text-3xl);
      }

      .header .title {
        font-size: var(--text-lg);
      }

      .header .summary {
        font-size: var(--text-base);
      }

      .contact-info {
        gap: var(--spacing-sm);
      }

      .contact-link {
        padding: 6px 12px;
        font-size: 0.8rem;
      }
      
      .projects-grid {
        grid-template-columns: 1fr;
      }
      
      .project-links {
        flex-direction: column;
      }

      .contact-links {
        flex-direction: column;
        align-items: center;
      }
    }

    /* CSS personalizado del usuario y la plantilla */
    ${customizations.customCSS || template.customCSS || ''}
  `;
};

// ✅ FUNCIÓN: Obtener secciones ordenadas y habilitadas
const getEnabledSections = (template: Template, config?: TemplateConfig): TemplateSection[] => {
  const sections = config?.customizations?.sections || template.sections;
  return sections
    .filter(section => section.enabled)
    .sort((a, b) => a.order - b.order);
};

// ✅ FUNCIÓN: Verificar si "about" está habilitado como sección separada
const isAboutSectionEnabled = (template: Template, config?: TemplateConfig): boolean => {
  const enabledSections = getEnabledSections(template, config);
  return enabledSections.some(section => section.id === 'about');
};

// ✅ FUNCIÓN: Generar HTML para cada sección
const generateSectionHTML = (
  sectionId: string, 
  data: PortfolioData,
  isMultiPage: boolean = false,
  template?: Template,
  config?: TemplateConfig
): string => {
  switch (sectionId) {
    case 'header':
      // Solo incluir summary en header si NO hay sección "about" habilitada
      const includeAboutInHeader = !isAboutSectionEnabled(template!, config);
      
      // Generar enlaces de contacto como en el portfolio real
      const contactLinks = [];
      
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
            ${includeAboutInHeader && data.personalInfo.summary ? `<p class="summary">${data.personalInfo.summary}</p>` : ''}
            
            ${contactLinks.length > 0 ? `
              <div class="contact-info">
                ${contactLinks.join('')}
              </div>
            ` : ''}
          </div>
        </header>
      `;

    case 'about':
      // Solo mostrar si NO está ya incluido en el header
      if (!data.personalInfo.summary) return '';
      return `
        <section class="section about-section">
          <h2>Sobre Mí</h2>
          <p>${data.personalInfo.summary}</p>
        </section>
      `;

    case 'projects':
      const projectsHTML = generateProjectsHTML(data.projects, isMultiPage);
      if (!projectsHTML) return '';
      return `
        <section class="section">
          <h2>Mis Proyectos</h2>
          <div class="projects-grid">${projectsHTML}</div>
        </section>
      `;

    case 'skills':
      const skillsHTML = generateSkillsHTML(data.skills);
      if (!skillsHTML) return '';
      return `
        <section class="section">
          <h2>Habilidades Técnicas</h2>
          <div class="skills-grid">${skillsHTML}</div>
        </section>
      `;

    case 'experience':
      const experienceHTML = generateExperienceHTML(data.experience);
      if (!experienceHTML) return '';
      return `
        <section class="section experience-section">
          <h2>Experiencia</h2>
          ${experienceHTML}
        </section>
      `;

    case 'contact':
      const contactHTML = generateContactHTML(data.personalInfo);
      if (!contactHTML) return '';
      return `
        <section class="section contact-section">
          <h2>Contacto</h2>
          ${contactHTML}
        </section>
      `;

    default:
      return '';
  }
};

// Función para generar HTML de proyectos
export const generateProjectsHTML = (projects: Project[], isMultiPage: boolean = false): string => {
  return projects
    .filter((p) => p.title.trim())
    .map((project) => {
      const slug = generateSlug(project.title);
      return `
      <div class="project-card">
        ${project.image ? 
          `<img src="${project.image}" style="width:100%;height:200px;object-fit:cover;border-radius:var(--radius-md);margin-bottom:var(--spacing-md);">` :
          `<div style="width:100%;height:200px;background:var(--gradient-primary, var(--color-primary));border-radius:var(--radius-md);margin-bottom:var(--spacing-md);display:flex;align-items:center;justify-content:center;color:white;font-size:3rem;">🌐</div>`
        }
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        ${project.technologies ? `
          <div class="tech-tags">
            ${project.technologies.split(',').map(tech => 
              `<span class="tech-tag">${getTechIcon(tech.trim())} ${tech.trim()}</span>`
            ).join('')}
          </div>
        ` : ''}
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

// Función para generar HTML de habilidades
export const generateSkillsHTML = (skills: Array<{category: string, items: string}>): string => {
  return skills
    .filter((s) => s.category.trim())
    .map((skill) => `
      <div class="skill-category">
        <h3>${skill.category}</h3>
        <div class="skill-items">
          ${skill.items
            .split(',')
            .map((item) => {
              const skillName = item.trim();
              return `<span class="skill-item">
                ${getTechIcon(skillName)} ${skillName}
              </span>`;
            })
            .join('')}
        </div>
      </div>
    `)
    .join('');
};

// Función para generar HTML de experiencia
const generateExperienceHTML = (experience: Array<{company: string, position: string, period: string, description: string}>): string => {
  return experience
    .filter((exp) => exp.company.trim() || exp.position.trim())
    .map((exp) => `
      <div class="experience-item">
        <h3>${exp.position}</h3>
        <div class="company">${exp.company}</div>
        <div class="period">${exp.period}</div>
        <p>${exp.description}</p>
      </div>
    `)
    .join('');
};

// Función para generar HTML de contacto
const generateContactHTML = (personalInfo: any): string => {
  const contacts = [];
  
  if (personalInfo.email) {
    contacts.push(`<a href="mailto:${personalInfo.email}">📧 ${personalInfo.email}</a>`);
  }
  if (personalInfo.phone) {
    contacts.push(`<a href="tel:${personalInfo.phone}">📱 ${personalInfo.phone}</a>`);
  }
  if (personalInfo.linkedin) {
    contacts.push(`<a href="${personalInfo.linkedin}" target="_blank">💼 LinkedIn</a>`);
  }
  if (personalInfo.github) {
    contacts.push(`<a href="${personalInfo.github}" target="_blank">🔗 GitHub</a>`);
  }
  if (personalInfo.website) {
    contacts.push(`<a href="${personalInfo.website}" target="_blank">🌐 Website</a>`);
  }

  if (contacts.length === 0) return '';

  return `
    <p>¿Tienes un proyecto en mente? ¡Hablemos!</p>
    <div class="contact-links">
      ${contacts.join('')}
    </div>
  `;
};

// ✅ EXPORTADOR MEJORADO: HTML simple con plantilla personalizada
export class TemplateAwareSinglePageExporter {
  constructor(
    private data: PortfolioData, 
    private template: Template,
    private config?: TemplateConfig
  ) {}

  generate(): string {
    const templateCSS = generateAdvancedTemplateCSS(this.template, this.config);
    const enabledSections = getEnabledSections(this.template, this.config);
    
    // Generar HTML de cada sección habilitada en el orden configurado
    const sectionsHTML = enabledSections
      .map(section => generateSectionHTML(section.id, this.data, false, this.template, this.config))
      .filter(html => html.trim())
      .join('\n');

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.data.personalInfo.fullName || "Portfolio"}</title>
    <meta name="description" content="Portfolio de ${this.data.personalInfo.fullName} - ${this.data.personalInfo.title}">
    <style>${templateCSS}</style>
</head>
<body>
    <div class="container">
        ${sectionsHTML}
    </div>

    <footer class="footer">
        <p>&copy; ${new Date().getFullYear()} ${this.data.personalInfo.fullName || 'Tu Nombre'}. Portfolio generado con plantilla "${this.template.name}".</p>
    </footer>
</body>
</html>`;
  }

  export(): { success: boolean; message: string } {
    try {
      const htmlContent = this.generate();
      downloadFile(`${this.data.personalInfo.fullName || "portfolio"}.html`, htmlContent);
      return {
        success: true,
        message: `Portfolio exportado exitosamente con plantilla "${this.template.name}"`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al exportar: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
}

// ✅ EXPORTADOR MEJORADO: Sitio web completo con plantilla personalizada
export class TemplateAwareMultiPageExporter {
  constructor(
    private data: PortfolioData, 
    private template: Template,
    private config?: TemplateConfig
  ) {}

  private generateProjectPage(project: Project): string {
    const templateCSS = generateAdvancedTemplateCSS(this.template, this.config);
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title} - ${this.data.personalInfo.fullName}</title>
    <meta name="description" content="${project.description}">
    <style>${templateCSS}</style>
</head>
<body>
    <div class="container">
        <a href="index.html" style="color:var(--color-primary);text-decoration:none;margin-bottom:var(--spacing-md);display:inline-block;font-weight:var(--weight-medium);">← Volver al Portfolio</a>
        
        <div class="header">
            <h1>${project.title}</h1>
            <p>${project.description}</p>
        </div>

        ${project.detailedDescription ? `
            <section class="section">
                <div class="project-card">
                    <h3>Descripción Detallada</h3>
                    <p>${project.detailedDescription}</p>
                </div>
            </section>
        ` : ''}

        ${project.features ? `
            <section class="section">
                <div class="project-card">
                    <h3>Características Principales</h3>
                    <ul style="list-style:none;padding:0;">
                        ${project.features.split(',').map(feature => 
                          `<li style="padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.1);">✓ ${feature.trim()}</li>`
                        ).join('')}
                    </ul>
                </div>
            </section>
        ` : ''}

        ${project.technologies ? `
            <section class="section">
                <div class="project-card">
                    <h3>Tecnologías Utilizadas</h3>
                    <div class="tech-tags">
                        ${project.technologies.split(',').map(tech => 
                          `<span class="tech-tag">${getTechIcon(tech.trim())} ${tech.trim()}</span>`
                        ).join('')}
                    </div>
                </div>
            </section>
        ` : ''}

        ${project.instructions ? `
            <section class="section">
                <div class="project-card">
                    <h3>Instrucciones de Uso</h3>
                    <pre style="white-space: pre-wrap; background: var(--color-surface); padding: var(--spacing-md); border-radius: var(--radius-md); overflow-x: auto; font-family: var(--font-code, monospace);">${project.instructions}</pre>
                </div>
            </section>
        ` : ''}

        <section class="section">
            <div class="project-links" style="justify-content: center;">
                ${project.link ? `<a href="${project.link}" target="_blank">🚀 Ver Proyecto Live</a>` : ''}
                ${project.github ? `<a href="${project.github}" target="_blank">📝 Ver Código</a>` : ''}
                <a href="index.html">🏠 Volver al Portfolio</a>
            </div>
        </section>
    </div>

    <footer class="footer">
        <p>&copy; ${new Date().getFullYear()} ${this.data.personalInfo.fullName}. Portfolio con plantilla "${this.template.name}".</p>
    </footer>
</body>
</html>`;
  }

  private generateIndexPage(): string {
    const templateCSS = generateAdvancedTemplateCSS(this.template, this.config);
    const enabledSections = getEnabledSections(this.template, this.config);
    
    // Generar HTML de cada sección habilitada en el orden configurado
    const sectionsHTML = enabledSections
      .map(section => generateSectionHTML(section.id, this.data, true, this.template, this.config))
      .filter(html => html.trim())
      .join('\n');

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.data.personalInfo.fullName || "Portfolio"}</title>
    <meta name="description" content="Portfolio de ${this.data.personalInfo.fullName} - ${this.data.personalInfo.title}">
    <style>${templateCSS}</style>
</head>
<body>
    <div class="container">
        ${sectionsHTML}
    </div>

    <footer class="footer">
        <p>&copy; ${new Date().getFullYear()} ${this.data.personalInfo.fullName || 'Tu Nombre'}. Portfolio generado con plantilla "${this.template.name}".</p>
    </footer>
</body>
</html>`;
  }

  generateFiles(): { [filename: string]: string } {
    const files: { [filename: string]: string } = {};

    // Página principal
    files['index.html'] = this.generateIndexPage();

    // Páginas de proyectos
    this.data.projects.filter(p => p.title.trim()).forEach(project => {
      const slug = generateSlug(project.title);
      files[`projects-${slug}.html`] = this.generateProjectPage(project);
    });

    // README mejorado
    files['README.md'] = `# ${this.data.personalInfo.fullName || 'Portfolio'} - Portfolio Web

Portfolio generado automáticamente con plantilla **${this.template.name}**.

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

${Object.keys(files).map(file => `- \`${file}\``).join('\n')}

## 🎨 Plantilla utilizada

**${this.template.name}** - ${this.template.description}

### Configuración personalizada:
- **Colores**: ${this.template.colors.primary} (primario), ${this.template.colors.secondary} (secundario)
- **Tipografía**: ${this.template.typography.fontFamily.primary}
- **Ancho máximo**: ${this.config?.customizations?.layout?.maxWidth || this.template.layout.maxWidth}
- **Estilo**: ${this.template.category}

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
      
      // Instrucciones mejoradas
      const instructions = `# 🎯 Instrucciones para GitHub Pages

¡Portfolio generado con plantilla "${this.template.name}"!

## 📦 Archivos generados:
${Object.keys(files).map(file => `✓ ${file}`).join('\n')}

## 🚀 Pasos para publicar:

1. **Crear repositorio en GitHub** (debe ser público)
2. **Subir archivos**: Arrastra todos los archivos a tu repo
3. **Configurar Pages**: 
   - Settings → Pages → Deploy from branch → main → / (root)
4. **Acceder**: https://tu-usuario.github.io/nombre-repo

## 🎨 Personalización aplicada

Tu portfolio usa la plantilla "${this.template.name}" con:
- Colores: ${this.template.colors.primary} (primario)
- Tipografía: ${this.template.typography.fontFamily.primary}
- Ancho máximo: ${this.config?.customizations?.layout?.maxWidth || this.template.layout.maxWidth}
- Estilo: ${this.template.category}

## 📞 Soporte

Si tienes problemas, revisa la documentación de GitHub Pages.

¡Tu portfolio se verá increíble! 🌟`;
      
      // Descargar instrucciones primero
      downloadFile('📖_INSTRUCCIONES_GITHUB_PAGES.txt', instructions);
      
      // Descargar cada archivo con delay
      Object.entries(files).forEach(([filename, content], index) => {
        setTimeout(() => {
          downloadFile(filename.replace('/', '-'), content);
        }, index * 500);
      });

      return {
        success: true,
        message: `Sitio web completo exportado con plantilla "${this.template.name}" y personalización aplicada`,
        files
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al exportar: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
}

// ✅ FACTORY FUNCTION ACTUALIZADA para incluir configuración
export const createTemplateAwareExporter = (
  data: PortfolioData, 
  template: Template, 
  type: 'single' | 'multi',
  config?: TemplateConfig
) => {
  switch (type) {
    case 'single':
      return new TemplateAwareSinglePageExporter(data, template, config);
    case 'multi':
      return new TemplateAwareMultiPageExporter(data, template, config);
    default:
      throw new Error(`Tipo de exportador no válido: ${type}`);
  }
};
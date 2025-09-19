// portfolio-export.ts - VERSIÓN CORREGIDA
import { PortfolioData, Project, FileExport, ExportResult, TECH_ICONS_CONFIG } from '../types/portfolio-types';

// Utilidad para generar slug único
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Utilidad para descargar archivos
export const downloadFile = (filename: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/html; charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Obtener icono de tecnología
export const getTechIcon = (tech: string): string => {
  const techLower = tech.toLowerCase().trim();
  const config = TECH_ICONS_CONFIG[techLower] || TECH_ICONS_CONFIG.default;
  return config.emoji;
};

// Obtener URL de icono de tecnología para HTML
export const getTechIconUrl = (tech: string): string => {
  const techIcons: Record<string, string> = {
    python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    "sql server": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg",
    "power bi": "https://raw.githubusercontent.com/microsoft/PowerBI-Icons/main/SVG/Power-BI.svg",
    "api rest": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
    javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    react: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    nodejs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    typescript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  };

  const normalizedTech = tech.toLowerCase().trim();
  return techIcons[normalizedTech] || "";
};

// Generar CSS base para portfolios
export const generateBaseCSS = (): string => {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      background: #f8fafc; 
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .header { 
      text-align: center; 
      padding: 80px 20px; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      border-radius: 20px; 
      margin-bottom: 40px; 
    }
    .header h1 { font-size: 3.5em; margin-bottom: 15px; font-weight: bold; }
    .header .title { font-size: 1.8em; opacity: 0.9; margin-bottom: 25px; }
    .projects-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
      gap: 30px; 
      margin-bottom: 60px; 
    }
    .card { 
      background: white; 
      border-radius: 15px; 
      overflow: hidden; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
      transition: all 0.3s ease; 
    }
    .card:hover { 
      transform: translateY(-5px); 
      box-shadow: 0 20px 40px rgba(0,0,0,0.15); 
    }
    .project-placeholder {
      width: 100%; 
      height: 200px; 
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4em;
      color: white;
    }
    .card-content { padding: 25px; }
    .card h3 { color: #667eea; margin-bottom: 15px; font-size: 1.5em; }
    .tech-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 20px 0; }
    .tech-tag { 
      display: inline-flex; 
      align-items: center; 
      gap: 6px; 
      background: #e0e7ff; 
      color: #667eea; 
      padding: 6px 12px; 
      border-radius: 20px; 
      font-size: 0.85em; 
    }
    .btn { 
      display: inline-flex; 
      align-items: center; 
      gap: 8px; 
      padding: 10px 20px; 
      border-radius: 8px; 
      text-decoration: none; 
      font-weight: 500; 
      transition: all 0.3s ease; 
    }
    .btn-primary { background: #667eea; color: white; }
    .btn-primary:hover { background: #5a67d8; }
    .section-header { 
      text-align: center; 
      margin: 60px 0 40px; 
      font-size: 2.5em; 
      color: #667eea; 
    }
    .footer { 
      background: #2d3748; 
      color: white; 
      text-align: center; 
      padding: 40px 20px; 
      margin-top: 80px; 
    }
    .project-image { width: 100%; height: 200px; object-fit: cover; }
    .project-content { padding: 25px; }
    .project-links { display: flex; gap: 10px; margin-top: 15px; }
    .project-links a { background: #667eea; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 0.9em; }
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
    .skill-category { background: white; border-radius: 15px; padding: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
    .skill-items { display: flex; flex-wrap: wrap; gap: 10px; }
    .skill-item { display: flex; align-items: center; gap: 6px; background: #667eea; color: white; padding: 8px 16px; border-radius: 25px; font-size: 0.9em; }
    .tech-icon { width: 16px; height: 16px; }
    .section { margin: 60px 0; }
    .section h2 { font-size: 2.5em; text-align: center; margin-bottom: 40px; color: #667eea; }
  `;
};

// Generar HTML para proyectos
export const generateProjectsHTML = (projects: Project[]): string => {
  return projects
    .filter((p) => p.title.trim())
    .map((project) => `
      <div class="project-card">
        ${project.image
          ? `<img src="${project.image}" alt="${project.title}" class="project-image">`
          : ""
        }
        <div class="project-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          ${project.technologies
            ? `
            <div class="tech-tags">
              ${project.technologies
                .split(",")
                .map((tech) => {
                  const techName = tech.trim();
                  const iconUrl = getTechIconUrl(techName);
                  return `<span class="tech-tag">
                    ${iconUrl
                      ? `<img src="${iconUrl}" alt="${techName}" class="tech-icon">`
                      : ""
                    }
                    ${techName}
                  </span>`;
                })
                .join("")}
            </div>`
            : ""
          }
          <div class="project-links">
            ${project.liveUrl || project.link
              ? `<a href="${project.liveUrl || project.link}" target="_blank">Ver Proyecto</a>`
              : ""
            }
            ${project.repoUrl || project.github
              ? `<a href="${project.repoUrl || project.github}" target="_blank">Código</a>`
              : ""
            }
          </div>
        </div>
      </div>
    `)
    .join("");
};

// ✅ CORREGIDO: Generar HTML para habilidades usando 'technologies'
export const generateSkillsHTML = (skills: Array<{category: string, technologies: string, level?: string}>): string => {
  return skills
    .filter((s) => s.category.trim())
    .map((skill) => `
      <div class="skill-category">
        <h3>${skill.category}</h3>
        ${skill.level ? `<div style="color: #667eea; font-size: 0.9em; margin-bottom: 10px;">Nivel: ${skill.level}</div>` : ''}
        <div class="skill-items">
          ${skill.technologies
            .split(",")
            .map((item) => {
              const skillName = item.trim();
              const iconUrl = getTechIconUrl(skillName);
              return `<span class="skill-item">
                ${iconUrl
                  ? `<img src="${iconUrl}" alt="${skillName}" class="tech-icon">`
                  : ""
                }
                ${skillName}
              </span>`;
            })
            .join("")}
        </div>
      </div>
    `)
    .join("");
};

// Exportador de HTML simple (página única)
export class SinglePageHTMLExporter {
  constructor(private data: PortfolioData) {}

  generate(): string {
    const projectsHTML = generateProjectsHTML(this.data.projects);
    const skillsHTML = generateSkillsHTML(this.data.skills);

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.data.personalInfo.fullName || this.data.personalInfo.fullName || "Portfolio"}</title>
    <style>${generateBaseCSS()}</style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>${this.data.personalInfo.fullName || this.data.personalInfo.fullName || "Tu Nombre"}</h1>
            <div class="title">${this.data.personalInfo.title || "Tu Título"}</div>
            ${this.data.personalInfo.tagline
              ? `<div style="font-size: 1.2em; opacity: 0.8; margin-bottom: 10px;">${this.data.personalInfo.tagline}</div>`
              : ""
            }
            ${this.data.personalInfo.summary
              ? `<p>${this.data.personalInfo.summary}</p>`
              : ""
            }
        </header>
        
        ${projectsHTML
          ? `<section class="section"><h2>Proyectos</h2><div class="projects-grid">${projectsHTML}</div></section>`
          : ""
        }
        
        ${skillsHTML
          ? `<section class="section"><h2>Habilidades</h2><div class="skills-grid">${skillsHTML}</div></section>`
          : ""
        }
        
        <footer class="footer">
            <p>&copy; ${new Date().getFullYear()} ${this.data.personalInfo.fullName || this.data.personalInfo.fullName || "Tu Nombre"}. Todos los derechos reservados.</p>
            <p style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">Portfolio generado con Portfolio Generator</p>
        </footer>
    </div>
</body>
</html>`;
  }

  export(): ExportResult {
    try {
      const htmlContent = this.generate();
      const filename = `${this.data.personalInfo.fullName || this.data.personalInfo.fullName || "portfolio"}.html`;
      downloadFile(filename, htmlContent);
      return {
        success: true,
        message: "Portfolio exportado exitosamente"
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al exportar: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
}

// Exportador de sitio web completo (múltiples páginas)
export class MultiPageWebsiteExporter {
  constructor(private data: PortfolioData) {}

  private generateProjectPage(project: Project): string {
    const mainCSS = generateBaseCSS();
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title} - ${this.data.personalInfo.fullName || this.data.personalInfo.fullName}</title>
    <style>${mainCSS}</style>
</head>
<body>
    <div class="container">
        <a href="index.html" style="color:#667eea;text-decoration:none;margin-bottom:20px;display:inline-block;">← Volver al Portfolio</a>
        
        <div class="header">
            <h1>${project.title}</h1>
            <p>${project.description}</p>
        </div>

        ${project.image ? `
            <div class="card" style="margin-bottom:30px;">
                <img src="${project.image}" alt="${project.title}" style="width:100%;height:300px;object-fit:cover;">
            </div>
        ` : ''}

        ${project.detailedDescription ? `
            <div class="card" style="margin-bottom:30px;">
                <div class="card-content">
                    <h3>Descripción Detallada</h3>
                    <p>${project.detailedDescription}</p>
                </div>
            </div>
        ` : ''}

        ${project.technologies ? `
            <div class="card" style="margin-bottom:30px;">
                <div class="card-content">
                    <h3>Tecnologías Utilizadas</h3>
                    <div class="tech-tags">
                        ${project.technologies.split(',').map(tech => 
                          `<span class="tech-tag">${getTechIcon(tech.trim())} ${tech.trim()}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        ` : ''}

        ${project.features ? `
            <div class="card" style="margin-bottom:30px;">
                <div class="card-content">
                    <h3>Características</h3>
                    <ul style="margin-left: 20px;">
                        ${project.features.split(',').map(feature => 
                          `<li style="margin-bottom: 8px;">${feature.trim()}</li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        ` : ''}

        ${project.instructions ? `
            <div class="card" style="margin-bottom:30px;">
                <div class="card-content">
                    <h3>Instrucciones de Uso</h3>
                    <pre style="white-space: pre-wrap; background: #f8f9fa; padding: 15px; border-radius: 8px; overflow-x: auto; font-family: 'Courier New', monospace;">${project.instructions}</pre>
                </div>
            </div>
        ` : ''}

        ${project.challenges ? `
            <div class="card" style="margin-bottom:30px;">
                <div class="card-content">
                    <h3>Desafíos Técnicos</h3>
                    <p>${project.challenges}</p>
                </div>
            </div>
        ` : ''}

        <div class="card" style="margin-bottom:30px;">
            <div class="card-content">
                <h3>Enlaces del Proyecto</h3>
                <div style="display: flex; gap: 15px; margin-top: 15px; flex-wrap: wrap;">
                    ${project.liveUrl || project.link ? `<a href="${project.liveUrl || project.link}" target="_blank" class="btn btn-primary">Ver Proyecto</a>` : ''}
                    ${project.repoUrl || project.github ? `<a href="${project.repoUrl || project.github}" target="_blank" class="btn btn-primary">Ver Código</a>` : ''}
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  private generateIndexPage(): string {
    const mainCSS = generateBaseCSS();
    const skillsHTML = generateSkillsHTML(this.data.skills);
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.data.personalInfo.fullName || this.data.personalInfo.fullName || 'Portfolio'}</title>
    <style>${mainCSS}</style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>${this.data.personalInfo.fullName || this.data.personalInfo.fullName || 'Tu Nombre'}</h1>
            <div class="title">${this.data.personalInfo.title || 'Tu Título'}</div>
            ${this.data.personalInfo.tagline ? `<div style="font-size: 1.2em; opacity: 0.8; margin-bottom: 10px;">${this.data.personalInfo.tagline}</div>` : ''}
            ${this.data.personalInfo.summary ? `<p>${this.data.personalInfo.summary}</p>` : ''}
        </header>

        ${this.data.projects.filter(p => p.title.trim()).length > 0 ? `
        <section>
            <h2 class="section-header">Proyectos</h2>
            <div class="projects-grid">
                ${this.data.projects.filter(p => p.title.trim()).map(project => {
                  const slug = generateSlug(project.title);
                  return `
                    <div class="card">
                        ${project.image ? 
                          `<img src="${project.image}" style="width:100%;height:200px;object-fit:cover;">` :
                          `<div class="project-placeholder">🌐</div>`
                        }
                        <div class="card-content">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            ${project.technologies ? `
                                <div class="tech-tags">
                                    ${project.technologies.split(',').map(tech => 
                                      `<span class="tech-tag">${getTechIcon(tech.trim())} ${tech.trim()}</span>`
                                    ).join('')}
                                </div>
                            ` : ''}
                            <a href="projects-${slug}.html" class="btn btn-primary">Ver Detalles</a>
                        </div>
                    </div>
                  `;
                }).join('')}
            </div>
        </section>
        ` : ''}

        ${skillsHTML ? `
        <section>
            <h2 class="section-header">Habilidades</h2>
            <div class="skills-grid">
                ${skillsHTML}
            </div>
        </section>
        ` : ''}
    </div>

    <footer class="footer">
        <p>&copy; ${new Date().getFullYear()} ${this.data.personalInfo.fullName || this.data.personalInfo.fullName}. Todos los derechos reservados.</p>
        <p style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">Portfolio generado con Portfolio Generator</p>
    </footer>
</body>
</html>`;
  }

  generateFiles(): FileExport {
    const files: FileExport = {};

    // Página principal
    files['index.html'] = this.generateIndexPage();

    // Páginas de proyectos
    this.data.projects.filter(p => p.title.trim()).forEach(project => {
      const slug = generateSlug(project.title);
      files[`projects-${slug}.html`] = this.generateProjectPage(project);
    });

    // README
    files['README.md'] = `# ${this.data.personalInfo.fullName || this.data.personalInfo.fullName} - Portfolio

Portfolio generado con Portfolio Generator.

## Subir a GitHub Pages

1. Crear repositorio en GitHub
2. Subir estos archivos
3. Settings → Pages → Deploy from branch → main
4. ¡Listo!

## Estructura de archivos

- \`index.html\` - Página principal
- \`projects-*.html\` - Páginas individuales de proyectos
- \`README.md\` - Este archivo

## Proyectos incluidos

${this.data.projects.filter(p => p.title.trim()).map(project => 
  `- [${project.title}](projects-${generateSlug(project.title)}.html)`
).join('\n')}

## Contacto

${this.data.personalInfo.email ? `- Email: ${this.data.personalInfo.email}` : ''}
${this.data.personalInfo.linkedin ? `- LinkedIn: ${this.data.personalInfo.linkedin}` : ''}
${this.data.personalInfo.github ? `- GitHub: ${this.data.personalInfo.github}` : ''}
`;

    return files;
  }

  export(): ExportResult {
    try {
      const files = this.generateFiles();
      
      // Generar instrucciones
      const instructions = `# Instrucciones para subir a GitHub Pages

Se han generado los siguientes archivos:
${Object.keys(files).map(file => `- ${file}`).join('\n')}

## Pasos para GitHub Pages:

1. Crear un nuevo repositorio en GitHub
2. Subir todos los archivos a la raíz del repositorio
3. Ir a Settings → Pages
4. Seleccionar "Deploy from a branch" → main → / (root)
5. ¡Tu portfolio estará en https://tu-usuario.github.io/nombre-repo!

## Archivos incluidos:

- index.html: Página principal con todos tus proyectos
- projects-*.html: Páginas individuales para cada proyecto
- README.md: Documentación del portfolio

¡Descarga de archivos iniciada!`;
      
      // Descargar instrucciones primero
      downloadFile('INSTRUCCIONES.txt', instructions);
      
      // Descargar cada archivo con delay
      Object.entries(files).forEach(([filename, content], index) => {
        setTimeout(() => {
          downloadFile(filename.replace('/', '-'), content);
        }, index * 500);
      });

      return {
        success: true,
        message: "Sitio web completo exportado exitosamente",
        files
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al exportar sitio web: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
}

// Factory function para crear exportadores
export const createExporter = (data: PortfolioData, type: 'single' | 'multi') => {
  switch (type) {
    case 'single':
      return new SinglePageHTMLExporter(data);
    case 'multi':
      return new MultiPageWebsiteExporter(data);
    default:
      throw new Error(`Tipo de exportador no válido: ${type}`);
  }
};
import React, { useState } from 'react';
import { Icons } from '../portfolio-icons';
import { usePortfolioData, useDataExport } from '../portfolio-hooks';
import { downloadFile } from '../portfolio-export';
import { PersonalInfoForm } from '../PersonalInfoForm';
import ProjectTableForm from '../ProjectTableForm';
import SkillTableForm from '../SkillTableForm';

const ModernPortfolioEditor: React.FC = () => {
  const { data, updatePersonalInfo, updateProject, updateSkill, addItem, removeItem } = usePortfolioData();
  const { exportToJSON, importFromJSON } = useDataExport();
  const [activeSection, setActiveSection] = useState<'personal' | 'projects' | 'skills'>('personal');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Helper para filtrar proyectos con título válido
  const hasTitle = (p: { title?: string }) => !!p.title && p.title.trim().length > 0;

  const handleExportJSON = () => {
    exportToJSON(data);
  };

  const handleImportJSON = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const result = await importFromJSON(file);
        if (result.success && result.data) {
          window.location.reload();
        } else {
          alert('Error al importar: ' + result.message);
        }
      }
    };
    input.click();
  };

  const handleExportHTML = () => {
    try {
      // HTML básico sin template complejo (con CSS corregido)
      const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.fullName || 'Portfolio'}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .project { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0; }
        .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 20px; font-size: 14px; }
        .project a { display: inline-block; margin-top: 12px; }
    </style>
</head>
<body>
    <header class="header">
        <h1>${data.personalInfo.fullName || 'Tu Nombre'}</h1>
        <p>${data.personalInfo.title || 'Tu Título'}</p>
        ${data.personalInfo.summary ? `<p>${data.personalInfo.summary}</p>` : ''}
    </header>
    
    <section>
        <h2>Proyectos</h2>
        <div class="projects">
            ${data.projects.filter(hasTitle).map(project => `
                <div class="project">
                    <h3>${project.title}</h3>
                    <p>${project.description || ''}</p>
                    ${project.technologies ? `<div class="skills">${project.technologies.split(',').map(tech => `<span class="skill">${tech.trim()}</span>`).join('')}</div>` : ''}
                    ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer">Ver Proyecto</a>` : ''}
                </div>
            `).join('')}
        </div>
    </section>
    
    <section>
        <h2>Habilidades</h2>
        ${data.skills.filter(s => !!s.category && s.category.trim().length > 0).map(skill => `
            <div>
                <h3>${skill.category}</h3>
                <div class="skills">${skill.items.split(',').map(item => `<span class="skill">${item.trim()}</span>`).join('')}</div>
            </div>
        `).join('')}
    </section>
</body>
</html>`;
      
      downloadFile(`${data.personalInfo.fullName || 'portfolio'}.html`, html);
      alert('¡Portfolio HTML exportado exitosamente!');
    } catch (error) {
      alert('Error al exportar HTML: ' + (error as Error).message);
    }
  };

  const handleExportWebsite = () => {
    try {
      const tailwindCSS = `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .min-h-screen { min-height: 100vh; }
        .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
        .from-slate-50 { --tw-gradient-from: #f8fafc; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(248, 250, 252, 0)); }
        .to-gray-100 { --tw-gradient-to: #f3f4f6; }
        .container { max-width: 1200px; margin: 0 auto; padding: 1rem; }
        .text-center { text-align: center; }
        .text-4xl { font-size: 2.25rem; font-weight: 700; }
        .text-2xl { font-size: 1.5rem; font-weight: 700; }
        .text-xl { font-size: 1.25rem; }
        .text-lg { font-size: 1.125rem; font-weight: 600; }
        .text-gray-900 { color: #111827; }
        .text-gray-600 { color: #4b5563; }
        .text-gray-700 { color: #374151; }
        .text-blue-600 { color: #2563eb; }
        .text-white { color: #ffffff; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .gap-6 { gap: 1.5rem; }
        .bg-white { background-color: #ffffff; }
        .bg-blue-600 { background-color: #2563eb; }
        .bg-blue-100 { background-color: #dbeafe; }
        .text-blue-800 { color: #1e40af; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded-full { border-radius: 9999px; }
        .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .p-6 { padding: 1.5rem; }
        .px-3 { padding: 0 0.75rem; }
        .px-4 { padding: 0 1rem; }
        .py-1 { padding: 0.25rem 0; }
        .py-2 { padding: 0.5rem 0; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-4 { margin-top: 1rem; }
        .flex { display: flex; }
        .flex-wrap { flex-wrap: wrap; }
        .items-center { align-items: center; }
        .gap-2 { gap: 0.5rem; }
        .gap-4 { gap: 1rem; }
        .space-x-4 > :not([hidden]) ~ :not([hidden]) { margin-left: 1rem; }
        .inline-flex { display: inline-flex; }
        .font-medium { font-weight: 500; }
        .border { border: 1px solid #d1d5db; }
        .no-underline { text-decoration: none; }
        .transition-colors { transition: background-color 0.15s, color 0.15s; }
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
        .hover\\:bg-gray-50:hover { background-color: #f9fafb; }
        .hover\\:bg-blue-200:hover { background-color: #bfdbfe; }
        .back-link { color: #2563eb; text-decoration: none; margin-bottom: 20px; display: inline-block; }
        .back-link:hover { text-decoration: underline; }
        @media (min-width: 768px) { .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (min-width: 1024px) { .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      `;

      // Normaliza y quita diacríticos para slugs estables (soporta tildes/ñ)
      const createSlug = (title: string) => {
        return title
          .normalize('NFD')
          .replace(/\[\u0300-\ͯ]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      };

      const projectsWithTitle = data.projects.filter(hasTitle);

      // Página principal (index.html)
      const indexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.fullName || 'Portfolio'}</title>
    <style>${tailwindCSS}</style>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
    <div class="container">
        <header class="text-center mb-8">
            <h1 class="text-4xl text-gray-900 mb-4">${data.personalInfo.fullName || 'Tu Nombre'}</h1>
            <p class="text-xl text-gray-600 mb-6">${data.personalInfo.title || 'Tu Título'}</p>
            ${data.personalInfo.summary ? `<p class="text-lg text-gray-600">${data.personalInfo.summary}</p>` : ''}
        </header>

        ${projectsWithTitle.length > 0 ? `
        <section class="mb-8">
            <h2 class="text-2xl text-gray-900 mb-6 text-center">Proyectos</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${projectsWithTitle.map(project => `
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h3 class="text-lg text-gray-900 mb-4">${project.title}</h3>
                        <p class="text-gray-600 mb-4">${project.description || ''}</p>
                        
                        ${project.technologies ? `
                        <div class="mb-4">
                            <div class="flex flex-wrap gap-2">
                                ${project.technologies.split(',').map(tech => `
                                    <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-800">
                                        <span>⚡</span>${tech.trim()}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}

                        <div class="flex gap-4 mt-4">
                            <a href="proyecto-${createSlug(project.title!)}.html" class="bg-blue-600 text-white px-4 py-2 rounded-lg no-underline hover:bg-blue-700">
                                Ver Detalles
                            </a>
                            ${project.link ? `
                                <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="border px-4 py-2 rounded-lg text-gray-700 no-underline hover:bg-gray-50">
                                    Ver Proyecto
                                </a>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        ${data.skills.filter(s => !!s.category && s.category.trim().length > 0).length > 0 ? `
        <section class="mb-8">
            <h2 class="text-2xl text-gray-900 mb-6 text-center">Habilidades</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${data.skills.filter(s => !!s.category && s.category.trim().length > 0).map(skill => `
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h3 class="text-lg text-gray-900 mb-4">${skill.category}</h3>
                        <div class="flex flex-wrap gap-2">
                            ${skill.items.split(',').filter(item => item.trim()).map(item => `
                                <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-800">
                                    <span>⭐</span>${item.trim()}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
    </div>
</body>
</html>`;

      // Descargar index.html
      downloadFile('index.html', indexHtml);

      // Crear páginas de detalle para cada proyecto
      projectsWithTitle.forEach((project, index) => {
        const slug = createSlug(project.title!);
        const projectHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title} - ${data.personalInfo.fullName || 'Portfolio'}</title>
    <style>${tailwindCSS}</style>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
    <div class="container">
        <a href="index.html" class="back-link">← Volver al Portfolio</a>
        
        <header class="text-center mb-8">
            <h1 class="text-4xl text-gray-900 mb-4">${project.title}</h1>
            <p class="text-xl text-gray-600">${project.description || ''}</p>
        </header>

        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            ${project.detailedDescription ? `
                <div class="mb-6">
                    <h2 class="text-2xl text-gray-900 mb-4">Descripción Detallada</h2>
                    <p class="text-gray-600">${project.detailedDescription}</p>
                </div>
            ` : ''}

            ${project.technologies ? `
                <div class="mb-6">
                    <h3 class="text-lg text-gray-900 mb-4">Tecnologías Utilizadas</h3>
                    <div class="flex flex-wrap gap-2">
                        ${project.technologies.split(',').map(tech => `
                            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-800">
                                <span>⚡</span>${tech.trim()}
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${project.features ? `
                <div class="mb-6">
                    <h3 class="text-lg text-gray-900 mb-4">Características Principales</h3>
                    <ul class="text-gray-600">
                        ${project.features.split(',').map(feature => `<li>• ${feature.trim()}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            ${project.challenges ? `
                <div class="mb-6">
                    <h3 class="text-lg text-gray-900 mb-4">Desafíos y Soluciones</h3>
                    <p class="text-gray-600">${project.challenges}</p>
                </div>
            ` : ''}

            ${project.instructions ? `
                <div class="mb-6">
                    <h3 class="text-lg text-gray-900 mb-4">Instrucciones de Uso</h3>
                    <pre class="bg-gray-100 p-4 rounded-lg text-gray-700 overflow-x-auto">${project.instructions}</pre>
                </div>
            ` : ''}

            <div class="flex gap-4 mt-6">
                ${project.link ? `
                    <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="bg-blue-600 text-white px-4 py-2 rounded-lg no-underline hover:bg-blue-700">
                        🚀 Ver Proyecto Live
                    </a>
                ` : ''}
                ${project.github ? `
                    <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="border px-4 py-2 rounded-lg text-gray-700 no-underline hover:bg-gray-50">
                        📁 Ver Código
                    </a>
                ` : ''}
            </div>
        </div>
    </div>
</body>
</html>`;
        
        // Pequeño escalonado para que el navegador no bloquee múltiples descargas
        setTimeout(() => {
          downloadFile(`proyecto-${slug}.html`, projectHtml);
        }, (index + 1) * 700);
      });

      // README con instrucciones
      const readme = `# ${data.personalInfo.fullName || 'Portfolio'} - Portfolio Completo

Este portfolio incluye:
- **index.html** - Página principal con todos los proyectos
- **proyecto-*.html** - Páginas de detalle para cada proyecto

## 🚀 Desplegar en GitHub Pages

1. Crea un nuevo repositorio público en GitHub
2. Sube **TODOS** los archivos HTML a la raíz del repositorio
3. Ve a Settings → Pages → Deploy from branch → main
4. Tu portfolio estará en: https://tu-usuario.github.io/nombre-repo

## 🌐 Otras opciones de despliegue

- **Netlify**: Arrastra todos los archivos HTML a netlify.com/drop
- **Vercel**: Conecta tu repositorio a vercel.com
- **Hosting tradicional**: Sube todos los archivos a tu servidor web

## 📁 Archivos incluidos

${projectsWithTitle.map(project => 
  `- proyecto-${createSlug(project.title!)}.html - ${project.title}`
).join('\n')}

¡Portfolio generado con Portfolio Generator!`;

      setTimeout(() => {
        downloadFile('README.md', readme);
      }, (projectsWithTitle.length + 1) * 700);

      alert(`¡Sitio web completo exportado! Se han generado ${1 + projectsWithTitle.length} páginas HTML con todas las vistas de detalle.`);
    } catch (error) {
      alert('Error al exportar sitio web: ' + (error as Error).message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editor de Portfolio</h1>
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Icons.Download size={16} />
            Exportar
            <Icons.ChevronDown size={16} />
          </button>
          
          {showExportMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
              <button
                onClick={() => { handleExportJSON(); setShowExportMenu(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <Icons.FileDown size={16} />
                Exportar JSON
              </button>
              <button
                onClick={() => { handleExportHTML(); setShowExportMenu(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <Icons.Download size={16} />
                Exportar HTML
              </button>
              <button
                onClick={() => { handleExportWebsite(); setShowExportMenu(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <Icons.ExternalLink size={16} />
                Sitio Web + GitHub Pages
              </button>
              <hr className="my-1" />
              <button
                onClick={() => { handleImportJSON(); setShowExportMenu(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <Icons.Upload size={16} />
                Importar JSON
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'personal' as const, label: 'Personal', icon: Icons.User },
          { id: 'projects' as const, label: 'Proyectos', icon: Icons.Code },
          { id: 'skills' as const, label: 'Habilidades', icon: Icons.Award },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeSection === section.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <section.icon size={16} />
            {section.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeSection === 'personal' && (
          <PersonalInfoForm data={data.personalInfo} onUpdate={updatePersonalInfo} />
        )}

        {activeSection === 'projects' && (
          <ProjectTableForm
            projects={data.projects}
            onUpdate={updateProject}
            onAdd={() => addItem('projects')}
            onRemove={(index) => removeItem('projects', index)}
          />
        )}

        {activeSection === 'skills' && (
          <SkillTableForm
            skills={data.skills}
            onUpdate={updateSkill}
            onAdd={() => addItem('skills')}
            onRemove={(index) => removeItem('skills', index)}
          />
        )}
      </div>
    </div>
  );
};

export default ModernPortfolioEditor;

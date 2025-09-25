// src/components/PortfolioViewer.tsx
import React, { useEffect, useState } from 'react';
import type { Project, PortfolioData } from '../types/portfolio-types';
import { DEFAULT_PORTFOLIO_DATA } from '../types/portfolio-types';
import { TemplateRenderer } from './TemplateRenderer';
import { DebugSectionsPanel } from './DebugSectionsPanel';

// ⬇️ importa el hook de plantillas avanzadas
import { useAdvancedTemplates } from '../hooks/useAdvancedTemplates';
import type { AdvancedTemplate } from '../types/advanced-template-types';

/**
 * Inyecta estilos/variables del template en el documento.
 * Incluso si TemplateRenderer no acepta un prop "template",
 * esto garantiza que colores/typografía se apliquen.
 */
const TemplateThemeStyles: React.FC<{ template?: AdvancedTemplate | null }> = ({ template }) => {
  if (!template) return null;
  const { colors, typography, layout, customCSS } = template;

  const css = `
    :root{
      --primary:${colors.primary};
      --secondary:${colors.secondary};
      --accent:${colors.accent};
      --bg:${colors.background};
      --surface:${colors.surface};
      --text-primary:${colors.text?.primary ?? '#111827'};
      --text-secondary:${colors.text?.secondary ?? '#6B7280'};
    }
    body{
      background:var(--bg);
      color:var(--text-primary);
      font-family:${typography?.fontFamilies?.primary ?? 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, sans-serif'};
    }
    .surface{ background:var(--surface); }
    h1,h2,h3,h4{ font-family:${typography?.fontFamilies?.heading ?? typography?.fontFamilies?.primary ?? 'inherit'}; }
    /* opcional: anchura máxima del layout */
    .container, main{ max-width:${layout?.maxWidth ?? '1200px'}; margin:0 auto; }
    ${customCSS ?? ''}
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

const PortfolioViewer: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);

  // ⬇️ obtenemos la plantilla efectiva
  const { effectiveTemplate, isLoaded } = useAdvancedTemplates();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolioData');
      if (saved) setData(JSON.parse(saved));
    } catch (e) {
      console.error('Error loading data:', e);
    }
  }, []);

  // Vista detalle de proyecto
  if (selectedProject) {
    return (
      <>
        <TemplateThemeStyles template={effectiveTemplate} />
        <div style={{ padding: 16 }}>
          <button onClick={() => setSelectedProject(null)}>← Volver al Portfolio</button>
        </div>
        <main style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
          {selectedProject.image && (
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }}
            />
          )}
          <h1 style={{ margin: 0 }}>{selectedProject.title}</h1>
          <p style={{ opacity: 0.85 }}>{selectedProject.description}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {selectedProject.link && (
              <a href={selectedProject.link} target="_blank" rel="noopener noreferrer">
                Ver Live
              </a>
            )}
            {selectedProject.github && (
              <a href={selectedProject.github} target="_blank" rel="noopener noreferrer">
                Código
              </a>
            )}
          </div>
        </main>
        {process.env.NODE_ENV === 'development' && <DebugSectionsPanel />}
      </>
    );
  }

  // Vista normal
  return (
    <>
      {/* aplica el tema siempre que el hook esté listo */}
      {isLoaded && <TemplateThemeStyles template={effectiveTemplate} />}

      {/*
        Si tu TemplateRenderer acepta un prop "template",
        se lo pasamos para que use secciones/estructura/estilos efectivos.
        El spread con "as any" evita error de TS si el componente no tipa ese prop.
      */}
      <TemplateRenderer
        data={data}
        onOpenProject={setSelectedProject}
        {...(effectiveTemplate ? ({ template: effectiveTemplate } as any) : {})}
      />

      {process.env.NODE_ENV === 'development' && <DebugSectionsPanel />}
    </>
  );
};

export default PortfolioViewer;

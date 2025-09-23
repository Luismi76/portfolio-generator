// src/components/PortfolioViewer.tsx
import React, { useEffect, useState } from 'react';
import type { Project, PortfolioData } from '../types/portfolio-types';
import { DEFAULT_PORTFOLIO_DATA } from '../types/portfolio-types';
import { TemplateRenderer } from './TemplateRenderer';
import { DebugSectionsPanel } from './DebugSectionsPanel';

const PortfolioViewer: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolioData');
      if (saved) setData(JSON.parse(saved));
    } catch (e) {
      console.error('Error loading data:', e);
    }
  }, []);

  // Vista de detalle (SIEMPRE retorna JSX)
  if (selectedProject) {
    return (
      <>
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

  // Vista normal (SIEMPRE retorna JSX)
  return (
    <>
      <TemplateRenderer data={data} onOpenProject={setSelectedProject} />
      {process.env.NODE_ENV === 'development' && <DebugSectionsPanel />}
    </>
  );
};

export default PortfolioViewer;

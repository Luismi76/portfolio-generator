// TemplateRenderer.tsx
import React from 'react';
import { Template, TemplateConfig } from '../types/template-types';
import { PortfolioData } from '../types/portfolio-types';

interface TemplateRendererProps {
  template: Template;
  config: TemplateConfig;
  portfolioData: PortfolioData;
  mode?: 'preview' | 'export' | 'full';
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  template,
  config,
  portfolioData,
  mode = 'preview'
}) => {
  // Merge template colors with customizations
  const colors = {
    ...template.colors,
    ...config.customizations.colors
  };
  
  const typography = {
    ...template.typography,
    ...config.customizations.typography
  };
  
  const layout = {
    ...template.layout,
    ...config.customizations.layout
  };

  // Generate CSS variables
  const cssVariables = {
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-background': colors.background,
    '--color-surface': colors.surface,
    '--color-text-primary': colors.text.primary,
    '--color-text-secondary': colors.text.secondary,
    '--color-text-accent': colors.text.accent,
    '--font-primary': typography.fontFamily.primary,
    '--font-heading': typography.fontFamily.heading,
    '--max-width': layout.maxWidth,
    ...(colors.gradient && {
      '--gradient-primary': `linear-gradient(${colors.gradient.direction || '135deg'}, ${colors.gradient.from}, ${colors.gradient.to})`
    })
  } as React.CSSProperties;

  const renderHeader = () => (
    <header 
      className="py-16 text-white text-center"
      style={{
        background: colors.gradient 
          ? `linear-gradient(${colors.gradient.direction || '135deg'}, ${colors.gradient.from}, ${colors.gradient.to})`
          : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
      }}
    >
      <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: '0 1rem' }}>
        <h1 
          className="text-4xl font-bold mb-4"
          style={{ fontFamily: typography.fontFamily.heading }}
        >
          {portfolioData.personalInfo.fullName}
        </h1>
        {portfolioData.personalInfo.tagline && (
          <p className="text-xl opacity-90 mb-6">
            {portfolioData.personalInfo.tagline}
          </p>
        )}
        <div className="flex justify-center gap-4">
          {portfolioData.personalInfo.email && (
            <a 
              href={`mailto:${portfolioData.personalInfo.email}`}
              className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all"
            >
              📧 Email
            </a>
          )}
          {portfolioData.personalInfo.linkedin && (
            <a 
              href={portfolioData.personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all"
            >
              💼 LinkedIn
            </a>
          )}
          {portfolioData.personalInfo.github && (
            <a 
              href={portfolioData.personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all"
            >
              🐙 GitHub
            </a>
          )}
        </div>
      </div>
    </header>
  );

  const renderAbout = () => (
    <section className="py-12" style={{ backgroundColor: colors.background }}>
      <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: '0 1rem' }}>
        <h2 
          className="text-3xl font-bold text-center mb-8"
          style={{ color: colors.text.primary, fontFamily: typography.fontFamily.heading }}
        >
          Sobre mí
        </h2>
        {portfolioData.personalInfo.summary && (
          <div 
            className="max-w-3xl mx-auto text-lg leading-relaxed"
            style={{ color: colors.text.secondary }}
          >
            <p>{portfolioData.personalInfo.summary}</p>
          </div>
        )}
      </div>
    </section>
  );

  const renderSkills = () => (
    <section className="py-12" style={{ backgroundColor: colors.surface }}>
      <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: '0 1rem' }}>
        <h2 
          className="text-3xl font-bold text-center mb-8"
          style={{ color: colors.text.primary, fontFamily: typography.fontFamily.heading }}
        >
          Habilidades
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioData.skills.map((skill, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg shadow-md"
              style={{ backgroundColor: colors.background }}
            >
              <h3 
                className="font-semibold mb-2"
                style={{ color: colors.text.primary }}
              >
                {skill.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skill.technologies.split(',').map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className="px-2 py-1 rounded text-sm"
                    style={{ 
                      backgroundColor: colors.primary + '20', 
                      color: colors.primary 
                    }}
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
              {skill.level && (
                <div className="mt-3">
                  <div className="text-sm mb-1" style={{ color: colors.text.secondary }}>
                    Nivel: {skill.level}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        backgroundColor: colors.primary,
                        width: skill.level === 'Avanzado' ? '90%' : 
                               skill.level === 'Intermedio' ? '70%' : '50%'
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderProjects = () => (
    <section className="py-12" style={{ backgroundColor: colors.background }}>
      <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: '0 1rem' }}>
        <h2 
          className="text-3xl font-bold text-center mb-8"
          style={{ color: colors.text.primary, fontFamily: typography.fontFamily.heading }}
        >
          Proyectos
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {portfolioData.projects.map((project, index) => (
            <div 
              key={index}
              className="rounded-lg shadow-lg overflow-hidden"
              style={{ backgroundColor: colors.surface }}
            >
              {project.image && (
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {project.title}
                </h3>
                <p 
                  className="mb-4"
                  style={{ color: colors.text.secondary }}
                >
                  {project.description}
                </p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.split(',').map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-2 py-1 rounded text-sm"
                        style={{ 
                          backgroundColor: colors.accent + '20', 
                          color: colors.accent 
                        }}
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded transition-all"
                      style={{ 
                        backgroundColor: colors.primary, 
                        color: 'white' 
                      }}
                    >
                      Ver Proyecto
                    </a>
                  )}
                  {project.repoUrl && (
                    <a 
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded border transition-all"
                      style={{ 
                        borderColor: colors.primary, 
                        color: colors.primary 
                      }}
                    >
                      Código
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div 
      className="min-h-screen"
      style={{ 
        ...cssVariables,
        fontFamily: typography.fontFamily.primary,
        backgroundColor: colors.background
      }}
    >
      {/* Apply custom CSS if provided */}
      {(config.customizations.customCSS || template.customCSS) && (
        <style>
          {config.customizations.customCSS || template.customCSS}
        </style>
      )}
      
      {renderHeader()}
      {renderAbout()}
      {renderSkills()}
      {renderProjects()}
      
      <footer 
        className="py-8 text-center"
        style={{ backgroundColor: colors.surface, color: colors.text.secondary }}
      >
        <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: '0 1rem' }}>
          <p>&copy; 2025 {portfolioData.personalInfo.fullName}. Todos los derechos reservados.</p>
          <p className="mt-2 text-sm">
            Portfolio generado con plantilla "{template.name}"
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TemplateRenderer;
// TemplateRenderer.tsx - COMPLETO Y FUNCIONAL
import React, { useState, useEffect } from 'react';
import { Template, TemplateConfig } from '../types/template-types';
import { PortfolioData } from '../types/portfolio-types';

interface TemplateRendererProps {
  template: Template;
  config: TemplateConfig;
  portfolioData: PortfolioData;
  mode?: 'preview' | 'export' | 'full';
}

// Componente TechList con iconos completos
const TechList: React.FC<{ 
  technologies: string; 
  variant?: 'default' | 'outlined'; 
  template?: Template;
  colors?: any;
}> = ({ technologies, variant = 'default', template, colors }) => {
  if (!technologies) return null;
  
  const techs = technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
  
  const getTechIcon = (tech: string): string => {
    const techLower = tech.toLowerCase();
    
    // Frontend Frameworks
    if (techLower.includes('react')) return '⚛️';
    if (techLower.includes('vue')) return '💚';
    if (techLower.includes('angular')) return '🅰️';
    if (techLower.includes('svelte')) return '🧡';
    if (techLower.includes('next')) return '▲';
    if (techLower.includes('nuxt')) return '💚';
    
    // Languages
    if (techLower.includes('javascript') || techLower.includes('js')) return '💛';
    if (techLower.includes('typescript') || techLower.includes('ts')) return '💙';
    if (techLower.includes('python')) return '🐍';
    if (techLower.includes('java')) return '☕';
    if (techLower.includes('php')) return '🐘';
    if (techLower.includes('c#') || techLower.includes('csharp')) return '💜';
    if (techLower.includes('go') || techLower.includes('golang')) return '🐹';
    if (techLower.includes('rust')) return '🦀';
    if (techLower.includes('swift')) return '🍎';
    if (techLower.includes('kotlin')) return '🟣';
    
    // Styling
    if (techLower.includes('css')) return '🎨';
    if (techLower.includes('sass') || techLower.includes('scss')) return '💗';
    if (techLower.includes('tailwind')) return '🌊';
    if (techLower.includes('bootstrap')) return '🅱️';
    if (techLower.includes('material')) return '🎯';
    
    // Backend
    if (techLower.includes('node')) return '💚';
    if (techLower.includes('express')) return '🚀';
    if (techLower.includes('django')) return '🎸';
    if (techLower.includes('flask')) return '🌶️';
    if (techLower.includes('laravel')) return '🔴';
    if (techLower.includes('spring')) return '🍃';
    if (techLower.includes('nestjs')) return '🐱';
    
    // Databases
    if (techLower.includes('mongodb') || techLower.includes('mongo')) return '🍃';
    if (techLower.includes('postgresql') || techLower.includes('postgres')) return '🐘';
    if (techLower.includes('mysql')) return '🐬';
    if (techLower.includes('redis')) return '🔴';
    if (techLower.includes('sqlite')) return '💾';
    if (techLower.includes('firebase')) return '🔥';
    if (techLower.includes('supabase')) return '⚡';
    
    // DevOps & Tools
    if (techLower.includes('docker')) return '🐳';
    if (techLower.includes('kubernetes') || techLower.includes('k8s')) return '⚙️';
    if (techLower.includes('aws')) return '☁️';
    if (techLower.includes('azure')) return '☁️';
    if (techLower.includes('gcp') || techLower.includes('google cloud')) return '☁️';
    if (techLower.includes('git')) return '📦';
    if (techLower.includes('github')) return '🐙';
    if (techLower.includes('gitlab')) return '🦊';
    if (techLower.includes('jenkins')) return '👨‍💼';
    if (techLower.includes('linux')) return '🐧';
    if (techLower.includes('nginx')) return '🌐';
    if (techLower.includes('apache')) return '🪶';
    
    // Testing
    if (techLower.includes('jest')) return '🃏';
    if (techLower.includes('cypress')) return '🌲';
    if (techLower.includes('selenium')) return '🔍';
    if (techLower.includes('playwright')) return '🎭';
    
    // Mobile
    if (techLower.includes('react native')) return '📱';
    if (techLower.includes('flutter')) return '💙';
    if (techLower.includes('ionic')) return '⚡';
    
    // Others
    if (techLower.includes('graphql')) return '🔺';
    if (techLower.includes('rest') || techLower.includes('api')) return '🔌';
    if (techLower.includes('websocket')) return '🔄';
    if (techLower.includes('ci/cd')) return '🔄';
    if (techLower.includes('stripe')) return '💳';
    if (techLower.includes('paypal')) return '💰';
    
    return '⚡';
  };

  const getStyle = () => {
    if (variant === 'outlined') {
      return {
        backgroundColor: 'white',
        border: `1px solid ${colors?.primary || '#3B82F6'}40`,
        color: colors?.primary || '#3B82F6'
      };
    } else {
      return {
        backgroundColor: `${colors?.primary || '#3B82F6'}20`,
        color: colors?.primary || '#3B82F6'
      };
    }
  };
  
  return (
    <>
      {techs.map((tech, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all hover:scale-105"
          style={getStyle()}
        >
          <span className="text-base">{getTechIcon(tech)}</span>
          {tech}
        </span>
      ))}
    </>
  );
};

const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  template,
  config,
  portfolioData,
  mode = 'preview'
}) => {
  // Estados para navegación de proyectos
  const [currentView, setCurrentView] = useState<'portfolio' | 'project'>('portfolio');
  const [currentProjectSlug, setCurrentProjectSlug] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Merge template colors with customizations
  const colors = {
    ...template.colors,
    ...config.customizations?.colors
  };
  
  const typography = {
    ...template.typography,
    fontFamily: {
      ...template.typography.fontFamily,
      ...config.customizations?.typography?.fontFamily
    },
    fontSize: {
      ...template.typography.fontSize,
      ...config.customizations?.typography?.fontSize
    },
    fontWeight: {
      ...template.typography.fontWeight,
      ...config.customizations?.typography?.fontWeight
    }
  };
  
  const layout = {
    ...template.layout,
    ...config.customizations?.layout
  };

  // Función para generar slug
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Navegación a proyecto individual
  const navigateToProject = (projectSlug: string) => {
    setCurrentProjectSlug(projectSlug);
    setCurrentView('project');
    if (mode === 'full') {
      window.history.pushState({}, '', `?project=${projectSlug}`);
    }
  };

  const navigateToPortfolio = () => {
    setCurrentView('portfolio');
    setCurrentProjectSlug('');
    if (mode === 'full') {
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  // Manejar navegación del browser
  useEffect(() => {
    if (mode !== 'full') return;

    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const projectParam = urlParams.get('project');
      
      if (projectParam) {
        setCurrentView('project');
        setCurrentProjectSlug(projectParam);
      } else {
        setCurrentView('portfolio');
        setCurrentProjectSlug('');
      }
    };

    // Inicializar vista basada en URL actual
    const urlParams = new URLSearchParams(window.location.search);
    const projectParam = urlParams.get('project');
    if (projectParam) {
      setCurrentView('project');
      setCurrentProjectSlug(projectParam);
    }

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [mode]);

  // Función para obtener ilustración por defecto para proyectos
  const getDefaultIllustration = (title: string, description: string) => {
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();
    
    if (titleLower.includes('ecommerce') || titleLower.includes('shop') || titleLower.includes('store') || 
        descLower.includes('comercio') || descLower.includes('tienda') || descLower.includes('venta')) {
      return { gradient: 'from-purple-500 via-pink-500 to-red-500', emoji: '🛒' };
    }
    
    if (titleLower.includes('task') || titleLower.includes('todo') || titleLower.includes('management') ||
        descLower.includes('tareas') || descLower.includes('productividad') || descLower.includes('gestión')) {
      return { gradient: 'from-blue-500 via-cyan-500 to-teal-500', emoji: '✅' };
    }
    
    if (titleLower.includes('social') || titleLower.includes('chat') || titleLower.includes('message') ||
        descLower.includes('social') || descLower.includes('chat') || descLower.includes('comunicación')) {
      return { gradient: 'from-green-500 via-emerald-500 to-teal-500', emoji: '💬' };
    }
    
    if (titleLower.includes('portfolio') || titleLower.includes('personal') || titleLower.includes('cv') ||
        descLower.includes('portfolio') || descLower.includes('personal') || descLower.includes('currículum')) {
      return { gradient: 'from-indigo-500 via-purple-500 to-pink-500', emoji: '👨‍💻' };
    }
    
    if (titleLower.includes('blog') || titleLower.includes('cms') || titleLower.includes('content') ||
        descLower.includes('blog') || descLower.includes('contenido') || descLower.includes('artículos')) {
      return { gradient: 'from-orange-500 via-red-500 to-pink-500', emoji: '📝' };
    }
    
    if (titleLower.includes('dashboard') || titleLower.includes('analytics') || titleLower.includes('admin') ||
        descLower.includes('dashboard') || descLower.includes('analíticas') || descLower.includes('administración')) {
      return { gradient: 'from-gray-600 via-gray-700 to-gray-900', emoji: '📊' };
    }
    
    if (titleLower.includes('game') || titleLower.includes('juego') || titleLower.includes('entertainment') ||
        descLower.includes('juego') || descLower.includes('entretenimiento') || descLower.includes('diversión')) {
      return { gradient: 'from-yellow-500 via-orange-500 to-red-500', emoji: '🎮' };
    }
    
    if (titleLower.includes('finance') || titleLower.includes('bank') || titleLower.includes('money') ||
        descLower.includes('financ') || descLower.includes('banco') || descLower.includes('dinero')) {
      return { gradient: 'from-green-600 via-emerald-600 to-teal-700', emoji: '💰' };
    }
    
    if (titleLower.includes('api') || titleLower.includes('backend') || titleLower.includes('server')) {
      return { gradient: 'from-slate-600 via-slate-700 to-slate-800', emoji: '🔌' };
    }
    
    if (titleLower.includes('mobile') || titleLower.includes('app')) {
      return { gradient: 'from-blue-600 via-indigo-600 to-purple-600', emoji: '📱' };
    }
    
    return { gradient: 'from-cyan-500 via-blue-500 to-indigo-500', emoji: '🌐' };
  };

  // Si estamos viendo un proyecto individual
  if (currentView === 'project') {
    const project = portfolioData.projects.find(p => 
      p.slug === currentProjectSlug || generateSlug(p.title) === currentProjectSlug
    );
    
    if (!project) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center" 
          style={{ backgroundColor: colors.background }}
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
              Proyecto no encontrado
            </h1>
            <p className="mb-4" style={{ color: colors.text.secondary }}>
              El proyecto "{currentProjectSlug}" no existe o fue eliminado.
            </p>
            <button
              onClick={navigateToPortfolio}
              className="px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: colors.primary }}
            >
              Volver al Portfolio
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        {/* Header del proyecto individual */}
        <header className="sticky top-0 z-10 border-b" style={{ backgroundColor: colors.surface }}>
          <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: '1rem' }}>
            <button
              onClick={navigateToPortfolio}
              className="flex items-center gap-2 transition-colors"
              style={{ color: colors.primary }}
            >
              ← Volver al Portfolio
            </button>
          </div>
        </header>

        {/* Contenido del proyecto */}
        <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: '2rem 1rem' }}>
          <h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.text.primary, fontFamily: typography.fontFamily.heading }}
          >
            {project.title}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {project.detailedDescription || project.description}
          </p>
        </div>
      </div>
    );
  }

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

  // Obtener configuración de secciones
  const sections = config?.customizations?.sections || [
    { id: 'header', name: 'Encabezado', enabled: true, order: 1 },
    { id: 'about', name: 'Sobre mí', enabled: true, order: 2 },
    { id: 'projects', name: 'Proyectos', enabled: true, order: 3 },
    { id: 'skills', name: 'Habilidades', enabled: true, order: 4 }
  ];

  // Filtrar y ordenar secciones habilitadas
  const enabledSections = sections
    .filter(section => section.enabled)
    .sort((a, b) => a.order - b.order);

  // Funciones de renderizado para cada sección
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'header':
        return (
          <header 
            key="header"
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
              <div className="flex justify-center gap-4 flex-wrap">
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

      case 'about':
        return portfolioData.personalInfo.summary ? (
          <section key="about" className="py-12" style={{ backgroundColor: colors.background }}>
            <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: '0 1rem' }}>
              <h2 
                className="text-3xl font-bold text-center mb-8"
                style={{ color: colors.text.primary, fontFamily: typography.fontFamily.heading }}
              >
                Sobre mí
              </h2>
              <div 
                className="max-w-3xl mx-auto text-lg leading-relaxed"
                style={{ color: colors.text.secondary }}
              >
                <p>{portfolioData.personalInfo.summary}</p>
              </div>
            </div>
          </section>
        ) : null;

      case 'skills':
        return portfolioData.skills?.filter(s => s.category?.trim()).length > 0 ? (
          <section key="skills" className="py-12" style={{ backgroundColor: colors.surface }}>
            <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: '0 1rem' }}>
              <h2 
                className="text-3xl font-bold text-center mb-8"
                style={{ color: colors.text.primary, fontFamily: typography.fontFamily.heading }}
              >
                Habilidades Técnicas
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioData.skills.filter(s => s.category?.trim()).map((skill, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-lg shadow-md"
                    style={{ 
                      backgroundColor: colors.background,
                      borderRadius: layout.borderRadius.lg
                    }}
                  >
                    <h3 
                      className="font-semibold mb-4"
                      style={{ color: colors.text.primary }}
                    >
                      {skill.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <TechList 
                        technologies={(skill as any).technologies || (skill as any).items || ''}
                        variant="outlined"
                        template={template}
                        colors={colors}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      case 'projects':
        return portfolioData.projects?.filter(p => p.title?.trim()).length > 0 ? (
          <section key="projects" className="py-12" style={{ backgroundColor: colors.background }}>
            <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: '0 1rem' }}>
              <h2 
                className="text-3xl font-bold text-center mb-8"
                style={{ color: colors.text.primary, fontFamily: typography.fontFamily.heading }}
              >
                Proyectos Destacados
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolioData.projects.filter(p => p.title?.trim()).map((project, index) => {
                  const defaultIllustration = getDefaultIllustration(project.title, project.description);
                  const hasCustomImage = project.image && project.image.trim();
                  
                  return (
                    <div 
                      key={index}
                      className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                      style={{ 
                        backgroundColor: colors.surface,
                        borderRadius: layout.borderRadius.lg
                      }}
                    >
                      {/* Imagen del proyecto o ilustración por defecto */}
                      <div className="relative h-48 overflow-hidden">
                        {hasCustomImage ? (
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${defaultIllustration.gradient} flex items-center justify-center relative`}>
                            <div className="absolute inset-0 opacity-10">
                              <div className="absolute top-4 left-4 text-2xl">✨</div>
                              <div className="absolute top-8 right-6 text-xl">⚡</div>
                              <div className="absolute bottom-6 left-8 text-xl">💎</div>
                              <div className="absolute bottom-4 right-4 text-2xl">🚀</div>
                            </div>
                            <div className="relative z-10 text-6xl group-hover:scale-110 transition-transform duration-300">
                              {defaultIllustration.emoji}
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                          {hasCustomImage ? '📸 Proyecto' : '🎨 Demo'}
                        </div>
                      </div>
                      
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
                            <TechList 
                              technologies={project.technologies}
                              template={template}
                              colors={colors}
                            />
                          </div>
                        )}
                        <div className="flex gap-3 flex-wrap">
                          <button
                            onClick={() => navigateToProject(project.slug || generateSlug(project.title))}
                            className="px-4 py-2 rounded transition-all text-white"
                            style={{ 
                              backgroundColor: colors.primary,
                              borderRadius: layout.borderRadius.md
                            }}
                          >
                            👁️ Ver Detalles
                          </button>
                          
                          {project.liveUrl && (
                            <a 
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded transition-all text-white"
                              style={{ 
                                backgroundColor: colors.accent,
                                borderRadius: layout.borderRadius.md
                              }}
                            >
                              🚀 Ver Live
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
                                color: colors.primary,
                                borderRadius: layout.borderRadius.md
                              }}
                            >
                              📁 Código
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null;

      default:
        return null;
    }
  };

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
      {(config.customizations?.customCSS || template.customCSS) && (
        <style>
          {config.customizations?.customCSS || template.customCSS}
        </style>
      )}
      
      {/* Renderizar secciones según configuración */}
      {enabledSections.map(section => renderSection(section.id))}
      
      <footer 
        className="py-8 text-center"
        style={{ backgroundColor: colors.surface, color: colors.text.secondary }}
      >
        <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: '0 1rem' }}>
          <p>&copy; 2025 {portfolioData.personalInfo.fullName}. Todos los derechos reservados.</p>
          <p className="mt-2 text-sm">
            Portfolio con plantilla "{template.name}" • Creado con Portfolio Generator
          </p>
        </div>
      </footer>
      
      {/* Modal para imagen ampliada */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full relative">
            <img
              src={selectedImage}
              alt="Imagen ampliada"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateRenderer;
// src/components/portfolio/PortfolioViewer.tsx
import React from 'react';
import { usePortfolioData } from '../portfolio-hooks';
import { useTemplates } from '../use-templates';

const PortfolioViewer: React.FC = () => {
  const { data } = usePortfolioData();
  const { selectedTemplate, config } = useTemplates();
console.log("Conjunto datos usuario:", data);
  // Función para obtener valor con prioridad: customizations > template > fallback
  const getValue = (templatePath: string, customPath: string, fallback: any) => {
    try {
      // 1. Primero intentar obtener de customizaciones
      if (config?.customizations) {
        const customValue = customPath.split('.').reduce((current: any, key) => {
          return current && typeof current === 'object' && key in current ? current[key] : undefined;
        }, config.customizations as any);
        
        if (customValue !== undefined) {
          return customValue;
        }
      }
      
      // 2. Si no hay customización, obtener del template base
      if (selectedTemplate) {
        const templateValue = templatePath.split('.').reduce((current: any, key) => {
          return current && typeof current === 'object' && key in current ? current[key] : undefined;
        }, selectedTemplate as any);
        
        if (templateValue !== undefined) {
          return templateValue;
        }
      }
      
      // 3. Fallback
      return fallback;
    } catch {
      return fallback;
    }
  };

  // Valores efectivos combinando customizaciones y template base
  const colors = {
    primary: getValue('colors.primary', 'colors.primary', '#3B82F6'),
    secondary: getValue('colors.secondary', 'colors.secondary', '#1E40AF'),
    accent: getValue('colors.accent', 'colors.accent', '#60A5FA'),
    background: getValue('colors.background', 'colors.background', '#FFFFFF'),
    surface: getValue('colors.surface', 'colors.surface', '#F8FAFC'),
    textPrimary: getValue('colors.text.primary', 'colors.text.primary', '#1F2937'),
    textSecondary: getValue('colors.text.secondary', 'colors.text.secondary', '#6B7280')
  };

  const layout = {
    maxWidth: getValue('layout.maxWidth', 'layout.maxWidth', '1200px'),
    spacingXs: getValue('layout.spacing.xs', 'layout.spacing.xs', '0.5rem'),
    spacingSm: getValue('layout.spacing.sm', 'layout.spacing.sm', '1rem'),
    spacingMd: getValue('layout.spacing.md', 'layout.spacing.md', '1.5rem'),
    spacingLg: getValue('layout.spacing.lg', 'layout.spacing.lg', '2rem'),
    spacingXl: getValue('layout.spacing.xl', 'layout.spacing.xl', '3rem'),
    radiusMd: getValue('layout.borderRadius.md', 'layout.borderRadius.md', '0.5rem'),
    radiusLg: getValue('layout.borderRadius.lg', 'layout.borderRadius.lg', '0.75rem'),
    shadowSm: getValue('layout.shadows.sm', 'layout.shadows.sm', '0 1px 2px 0 rgb(0 0 0 / 0.05)'),
    shadowMd: getValue('layout.shadows.md', 'layout.shadows.md', '0 4px 6px -1px rgb(0 0 0 / 0.1)')
  };

  const typography = {
    fontFamily: getValue('typography.fontFamily.primary', 'typography.fontFamily.primary', 'Inter, system-ui, sans-serif'),
    fontHeading: getValue('typography.fontFamily.heading', 'typography.fontFamily.heading', 'Inter, system-ui, sans-serif'),
    fontSizeSm: getValue('typography.fontSize.sm', 'typography.fontSize.sm', '0.875rem'),
    fontSizeLg: getValue('typography.fontSize.lg', 'typography.fontSize.lg', '1.125rem'),
    fontSizeXl: getValue('typography.fontSize.xl', 'typography.fontSize.xl', '1.25rem'),
    fontSize2xl: getValue('typography.fontSize.2xl', 'typography.fontSize.2xl', '1.5rem'),
    fontSize3xl: getValue('typography.fontSize.3xl', 'typography.fontSize.3xl', '1.875rem'),
    fontSize4xl: getValue('typography.fontSize.4xl', 'typography.fontSize.4xl', '2.25rem')
  };

  // Verificar secciones habilitadas y obtener el orden correcto
  const getSectionsInOrder = () => {
    let sections;
    
    // 1. Primero revisar customizaciones de secciones
    if (config?.customizations?.sections) {
      sections = config.customizations.sections;
    }
    // 2. Luego revisar secciones del template base
    else if (selectedTemplate?.sections) {
      sections = selectedTemplate.sections;
    }
    // 3. Fallback para secciones básicas
    else {
      sections = [
        { id: 'header', name: 'Header', enabled: true, order: 1 },
        { id: 'projects', name: 'Proyectos', enabled: true, order: 3 },
        { id: 'skills', name: 'Habilidades', enabled: true, order: 4 },
        { id: 'contact', name: 'Contacto', enabled: true, order: 6 }
      ];
    }
    
    return sections
      .filter(section => section.enabled)
      .sort((a, b) => a.order - b.order);
  };

  const orderedSections = getSectionsInOrder();

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        backgroundColor: colors.background,
        fontFamily: typography.fontFamily
      }}
    >
      {/* Header */}
      {isSectionEnabled('header') && (
        <header 
          className="text-white"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            paddingTop: layout.spacingXl,
            paddingBottom: layout.spacingXl
          }}
        >
          <div style={{ 
            maxWidth: layout.maxWidth, 
            margin: '0 auto', 
            padding: layout.maxWidth === '100%' ? `0 ${layout.spacingLg}` : `0 ${layout.spacingMd}`
          }}>
            <div className="text-center">
              <h1 
                className="font-bold"
                style={{ 
                  fontFamily: typography.fontHeading,
                  fontSize: typography.fontSize4xl,
                  marginBottom: layout.spacingMd
                }}
              >
                {data.personalInfo.fullName || 'Tu Nombre'}
              </h1>
              <h2 
                className="opacity-90"
                style={{ 
                  fontSize: typography.fontSize2xl,
                  marginBottom: layout.spacingLg
                }}
              >
                {data.personalInfo.title || 'Tu Título Profesional'}
              </h2>
              {data.personalInfo.summary && (
                <p 
                  className="opacity-80 mx-auto"
                  style={{ 
                    fontSize: typography.fontSizeLg,
                    maxWidth: '600px'
                  }}
                >
                  {data.personalInfo.summary}
                </p>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Proyectos */}
      {isSectionEnabled('projects') && data.projects.some(p => p.title?.trim()) && (
        <section 
          style={{ 
            backgroundColor: colors.background,
            paddingTop: layout.spacingXl,
            paddingBottom: layout.spacingXl
          }}
        >
          <div style={{ 
            maxWidth: layout.maxWidth, 
            margin: '0 auto', 
            padding: layout.maxWidth === '100%' ? `0 ${layout.spacingLg}` : `0 ${layout.spacingMd}`
          }}>
            <h2 
              className="text-center font-bold"
              style={{ 
                color: colors.textPrimary,
                fontFamily: typography.fontHeading,
                fontSize: typography.fontSize3xl,
                marginBottom: layout.spacingLg
              }}
            >
              Mis Proyectos
            </h2>
            <div 
              style={{ 
                display: 'grid',
                gridTemplateColumns: layout.maxWidth === '100%' 
                  ? 'repeat(auto-fit, minmax(400px, 1fr))'
                  : 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: layout.spacingLg
              }}
            >
              {data.projects.filter(p => p.title?.trim()).map((project, index) => (
                <div 
                  key={index} 
                  className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  style={{ 
                    backgroundColor: colors.surface,
                    borderRadius: layout.radiusLg,
                    boxShadow: layout.shadowMd
                  }}
                >
                  {project.image && (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full object-cover"
                      style={{ height: '200px' }}
                    />
                  )}
                  <div style={{ padding: layout.spacingLg }}>
                    <h3 
                      className="font-bold"
                      style={{ 
                        color: colors.textPrimary,
                        fontFamily: typography.fontHeading,
                        fontSize: typography.fontSizeXl,
                        marginBottom: layout.spacingSm
                      }}
                    >
                      {project.title}
                    </h3>
                    <p 
                      style={{ 
                        color: colors.textSecondary,
                        marginBottom: layout.spacingMd
                      }}
                    >
                      {project.description}
                    </p>
                    {project.technologies && (
                      <div 
                        style={{ 
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: layout.spacingXs,
                          marginBottom: layout.spacingMd
                        }}
                      >
                        {project.technologies.split(',').map((tech, idx) => (
                          <span 
                            key={idx}
                            style={{
                              backgroundColor: `${colors.accent}20`,
                              color: colors.textPrimary,
                              padding: `${layout.spacingXs} ${layout.spacingSm}`,
                              borderRadius: layout.radiusMd,
                              border: `1px solid ${colors.accent}40`,
                              fontSize: typography.fontSizeSm
                            }}
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <div 
                      style={{ 
                        display: 'flex',
                        gap: layout.spacingSm 
                      }}
                    >
                      {project.link && (
                        <a 
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-medium hover:opacity-90"
                          style={{ 
                            backgroundColor: colors.primary,
                            padding: `${layout.spacingSm} ${layout.spacingMd}`,
                            borderRadius: layout.radiusMd,
                            textDecoration: 'none'
                          }}
                        >
                          Ver Proyecto
                        </a>
                      )}
                      {project.github && (
                        <a 
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-medium hover:opacity-90"
                          style={{ 
                            backgroundColor: colors.textSecondary,
                            padding: `${layout.spacingSm} ${layout.spacingMd}`,
                            borderRadius: layout.radiusMd,
                            textDecoration: 'none'
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
      )}

      {/* Habilidades */}
      {isSectionEnabled('skills') && data.skills.some(s => s.category?.trim() && s.items?.trim()) && (
        <section 
          style={{ 
            backgroundColor: colors.surface,
            paddingTop: layout.spacingXl,
            paddingBottom: layout.spacingXl
          }}
        >
          <div style={{ 
            maxWidth: layout.maxWidth, 
            margin: '0 auto', 
            padding: layout.maxWidth === '100%' ? `0 ${layout.spacingLg}` : `0 ${layout.spacingMd}`
          }}>
            <h2 
              className="text-center font-bold"
              style={{ 
                color: colors.textPrimary,
                fontFamily: typography.fontHeading,
                fontSize: typography.fontSize3xl,
                marginBottom: layout.spacingLg
              }}
            >
              Habilidades
            </h2>
            <div 
              style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: layout.spacingLg
              }}
            >
              {data.skills.filter(s => s.category?.trim() && s.items?.trim()).map((skill, index) => (
                <div 
                  key={index} 
                  style={{ 
                    backgroundColor: colors.background,
                    padding: layout.spacingLg,
                    borderRadius: layout.radiusLg,
                    boxShadow: layout.shadowSm
                  }}
                >
                  <h3 
                    className="font-bold"
                    style={{ 
                      color: colors.textPrimary,
                      fontFamily: typography.fontHeading,
                      fontSize: typography.fontSizeXl,
                      marginBottom: layout.spacingMd
                    }}
                  >
                    {skill.category}
                  </h3>
                  <div 
                    style={{ 
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: layout.spacingXs 
                    }}
                  >
                    {skill.items.split(',').map((item, idx) => (
                      <span 
                        key={idx}
                        style={{
                          backgroundColor: colors.surface,
                          color: colors.textPrimary,
                          padding: `${layout.spacingXs} ${layout.spacingSm}`,
                          borderRadius: layout.radiusLg,
                          border: `1px solid ${colors.primary}30`,
                          fontSize: typography.fontSizeSm
                        }}
                      >
                        {item.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experiencia */}
      {isSectionEnabled('experience') && data.experience.some(e => e.company?.trim()) && (
        <section 
          style={{ 
            backgroundColor: colors.background,
            paddingTop: layout.spacingXl,
            paddingBottom: layout.spacingXl
          }}
        >
          <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: `0 ${layout.spacingMd}` }}>
            <h2 
              className="text-center font-bold"
              style={{ 
                color: colors.textPrimary,
                fontFamily: typography.fontHeading,
                fontSize: typography.fontSize3xl,
                marginBottom: layout.spacingLg
              }}
            >
              Experiencia
            </h2>
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: layout.spacingLg 
              }}
            >
              {data.experience.filter(e => e.company?.trim()).map((exp, index) => (
                <div 
                  key={index} 
                  style={{ 
                    backgroundColor: colors.surface,
                    padding: layout.spacingLg,
                    borderRadius: layout.radiusLg,
                    boxShadow: layout.shadowMd
                  }}
                >
                  <h3 
                    className="font-bold"
                    style={{ 
                      color: colors.textPrimary,
                      fontFamily: typography.fontHeading,
                      fontSize: typography.fontSizeXl,
                      marginBottom: layout.spacingSm
                    }}
                  >
                    {exp.position}
                  </h3>
                  <h4 
                    style={{ 
                      color: colors.primary,
                      fontSize: typography.fontSizeLg,
                      marginBottom: layout.spacingSm
                    }}
                  >
                    {exp.company}
                  </h4>
                  <p 
                    style={{ 
                      color: colors.textSecondary,
                      marginBottom: layout.spacingMd
                    }}
                  >
                    {exp.period}
                  </p>
                  <p style={{ color: colors.textPrimary }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contacto */}
      {isSectionEnabled('contact') && (
        <footer 
          className="text-white"
          style={{ 
            backgroundColor: colors.textPrimary,
            paddingTop: layout.spacingXl,
            paddingBottom: layout.spacingLg
          }}
        >
          <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: `0 ${layout.spacingMd}` }}>
            <div className="text-center">
              <h3 
                className="font-bold"
                style={{ 
                  fontFamily: typography.fontHeading,
                  fontSize: typography.fontSize2xl,
                  marginBottom: layout.spacingLg
                }}
              >
                Contacto
              </h3>
              <div 
                style={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: layout.spacingLg 
                }}
              >
                {data.personalInfo.email && (
                  <a 
                    href={`mailto:${data.personalInfo.email}`}
                    className="hover:opacity-80"
                    style={{ 
                      color: colors.accent,
                      textDecoration: 'none'
                    }}
                  >
                    Email
                  </a>
                )}
                {data.personalInfo.github && (
                  <a 
                    href={data.personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80"
                    style={{ 
                      color: colors.accent,
                      textDecoration: 'none'
                    }}
                  >
                    GitHub
                  </a>
                )}
                {data.personalInfo.linkedin && (
                  <a 
                    href={data.personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80"
                    style={{ 
                      color: colors.accent,
                      textDecoration: 'none'
                    }}
                  >
                    LinkedIn
                  </a>
                )}
              </div>
              
              <div 
                style={{ 
                  marginTop: layout.spacingLg,
                  paddingTop: layout.spacingMd,
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <p 
                  className="opacity-75" 
                  style={{ fontSize: typography.fontSizeSm }}
                >
                  {data.personalInfo.fullName || 'Portfolio Generator'}. Portfolio generado con Portfolio Generator v2.0
                </p>
                
                <p 
                  className="mt-2 opacity-60"
                  style={{ 
                    fontSize: typography.fontSizeSm,
                    marginTop: layout.spacingSm
                  }}
                >
                  Plantilla: {selectedTemplate?.name || 'Default'} • Ancho: {layout.maxWidth}
                  {config?.customizations && Object.keys(config.customizations).length > 0 && ' • Personalizada'}
                </p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PortfolioViewer;
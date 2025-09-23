// src/components/portfolio/PortfolioViewer.tsx
import React from "react";
import { usePortfolioData } from "../portfolio-hooks";
import { useTemplates } from "../use-templates";
import { TechList } from "../TechIcons";
// Al inicio del archivo Portfolio.tsx, añadir:
//import { TECH_ICONS_CONFIG } from '../../types/portfolio-types';

const PortfolioViewer: React.FC = () => {
  const { data } = usePortfolioData();
  const { selectedTemplate, config } = useTemplates();

  // Función para obtener valor con prioridad: customizations > template > fallback
  const getValue = (
    templatePath: string,
    customPath: string,
    fallback: any
  ) => {
    try {
      // 1. Primero intentar obtener de customizaciones
      if (config?.customizations) {
        const customValue = customPath
          .split(".")
          .reduce((current: any, key) => {
            return current && typeof current === "object" && key in current
              ? current[key]
              : undefined;
          }, config.customizations as any);

        if (customValue !== undefined) {
          return customValue;
        }
      }

      // 2. Si no hay customización, obtener del template base
      if (selectedTemplate) {
        const templateValue = templatePath
          .split(".")
          .reduce((current: any, key) => {
            return current && typeof current === "object" && key in current
              ? current[key]
              : undefined;
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
    primary: getValue("colors.primary", "colors.primary", "#3B82F6"),
    secondary: getValue("colors.secondary", "colors.secondary", "#1E40AF"),
    accent: getValue("colors.accent", "colors.accent", "#60A5FA"),
    background: getValue("colors.background", "colors.background", "#FFFFFF"),
    surface: getValue("colors.surface", "colors.surface", "#F8FAFC"),
    textPrimary: getValue(
      "colors.text.primary",
      "colors.text.primary",
      "#1F2937"
    ),
    textSecondary: getValue(
      "colors.text.secondary",
      "colors.text.secondary",
      "#6B7280"
    ),
  };

  const layout = {
    maxWidth: getValue("layout.maxWidth", "layout.maxWidth", "1200px"),
    spacingXs: getValue("layout.spacing.xs", "layout.spacing.xs", "0.5rem"),
    spacingSm: getValue("layout.spacing.sm", "layout.spacing.sm", "1rem"),
    spacingMd: getValue("layout.spacing.md", "layout.spacing.md", "1.5rem"),
    spacingLg: getValue("layout.spacing.lg", "layout.spacing.lg", "2rem"),
    spacingXl: getValue("layout.spacing.xl", "layout.spacing.xl", "3rem"),
    radiusMd: getValue(
      "layout.borderRadius.md",
      "layout.borderRadius.md",
      "0.5rem"
    ),
    radiusLg: getValue(
      "layout.borderRadius.lg",
      "layout.borderRadius.lg",
      "0.75rem"
    ),
    shadowSm: getValue(
      "layout.shadows.sm",
      "layout.shadows.sm",
      "0 1px 2px 0 rgb(0 0 0 / 0.05)"
    ),
    shadowMd: getValue(
      "layout.shadows.md",
      "layout.shadows.md",
      "0 4px 6px -1px rgb(0 0 0 / 0.1)"
    ),
  };

  const typography = {
    fontFamily: getValue(
      "typography.fontFamily.primary",
      "typography.fontFamily.primary",
      "Inter, system-ui, sans-serif"
    ),
    fontHeading: getValue(
      "typography.fontFamily.heading",
      "typography.fontFamily.heading",
      "Inter, system-ui, sans-serif"
    ),
    fontSizeSm: getValue(
      "typography.fontSize.sm",
      "typography.fontSize.sm",
      "0.875rem"
    ),
    fontSizeLg: getValue(
      "typography.fontSize.lg",
      "typography.fontSize.lg",
      "1.125rem"
    ),
    fontSizeXl: getValue(
      "typography.fontSize.xl",
      "typography.fontSize.xl",
      "1.25rem"
    ),
    fontSize2xl: getValue(
      "typography.fontSize.2xl",
      "typography.fontSize.2xl",
      "1.5rem"
    ),
    fontSize3xl: getValue(
      "typography.fontSize.3xl",
      "typography.fontSize.3xl",
      "1.875rem"
    ),
    fontSize4xl: getValue(
      "typography.fontSize.4xl",
      "typography.fontSize.4xl",
      "2.25rem"
    ),
  };

  // Obtener secciones en orden correcto
  const getSectionsInOrder = () => {
    let sections;

    if (config?.customizations?.sections) {
      sections = config.customizations.sections;
    } else if (selectedTemplate?.sections) {
      sections = selectedTemplate.sections;
    } else {
      sections = [
        { id: "header", name: "Header", enabled: true, order: 1 },
        { id: "projects", name: "Proyectos", enabled: true, order: 2 },
        { id: "skills", name: "Habilidades", enabled: true, order: 4 },
        { id: "contact", name: "Contacto", enabled: true, order: 6 },
      ];
    }

    return sections
      .filter((section) => section.enabled)
      .sort((a, b) => a.order - b.order);
  };

  const orderedSections = getSectionsInOrder();

  // Debug: Mostrar orden en el footer
  const debugInfo = `Orden actual: ${orderedSections
    .map((s) => `${s.name}(${s.order})`)
    .join(" → ")}`;

  // Función para renderizar cada sección
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "header":
        return (
          <header
            key="header"
            className="text-white"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              paddingTop: layout.spacingXl,
              paddingBottom: layout.spacingXl,
            }}
          >
            <div
              style={{
                maxWidth: layout.maxWidth,
                margin: "0 auto",
                padding:
                  layout.maxWidth === "100%"
                    ? `0 ${layout.spacingLg}`
                    : `0 ${layout.spacingMd}`,
              }}
            >
              <div className="text-center">
                <h1
                  className="font-bold"
                  style={{
                    fontFamily: typography.fontHeading,
                    fontSize: typography.fontSize4xl,
                    marginBottom: layout.spacingMd,
                  }}
                >
                  {data.personalInfo.fullName || "Tu Nombre"}
                </h1>
                <h2
                  className="opacity-90"
                  style={{
                    fontSize: typography.fontSize2xl,
                    marginBottom: layout.spacingLg,
                  }}
                >
                  {data.personalInfo.title || "Tu Título Profesional"}
                </h2>
                {/* No mostrar summary en header si la sección 'about' está habilitada */}
                {data.personalInfo.summary &&
                  !orderedSections.some((s) => s.id === "about") && (
                    <p
                      className="opacity-80 mx-auto"
                      style={{
                        fontSize: typography.fontSizeLg,
                        maxWidth: "600px",
                      }}
                    >
                      {data.personalInfo.summary}
                    </p>
                  )}
              </div>
            </div>
          </header>
        );

      case "about":
        if (!data.personalInfo.summary) return null;
        return (
          <section
            key="about"
            style={{
              backgroundColor: colors.surface,
              paddingTop: layout.spacingXl,
              paddingBottom: layout.spacingXl,
            }}
          >
            <div
              style={{
                maxWidth: layout.maxWidth,
                margin: "0 auto",
                padding:
                  layout.maxWidth === "100%"
                    ? `0 ${layout.spacingLg}`
                    : `0 ${layout.spacingMd}`,
              }}
            >
              <h2
                className="text-center font-bold"
                style={{
                  color: colors.textPrimary,
                  fontFamily: typography.fontHeading,
                  fontSize: typography.fontSize3xl,
                  marginBottom: layout.spacingLg,
                }}
              >
                Sobre mí
              </h2>
              <div
                className="mx-auto"
                style={{
                  backgroundColor: colors.background,
                  maxWidth: "800px",
                  padding: layout.spacingLg,
                  borderRadius: layout.radiusLg,
                  boxShadow: layout.shadowMd,
                }}
              >
                <p
                  className="text-center"
                  style={{
                    color: colors.textPrimary,
                    fontSize: typography.fontSizeLg,
                    lineHeight: "1.7",
                  }}
                >
                  {data.personalInfo.summary}
                </p>
              </div>
            </div>
          </section>
        );

      case "projects":
        if (!data.projects.some((p) => p.title?.trim())) return null;
        return (
          <section
            key="projects"
            style={{
              backgroundColor: colors.background,
              paddingTop: layout.spacingXl,
              paddingBottom: layout.spacingXl,
            }}
          >
            <div
              style={{
                maxWidth: layout.maxWidth,
                margin: "0 auto",
                padding:
                  layout.maxWidth === "100%"
                    ? `0 ${layout.spacingLg}`
                    : `0 ${layout.spacingMd}`,
              }}
            >
              <h2
                className="text-center font-bold"
                style={{
                  color: colors.textPrimary,
                  fontFamily: typography.fontHeading,
                  fontSize: typography.fontSize3xl,
                  marginBottom: layout.spacingLg,
                }}
              >
                Mis Proyectos
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    layout.maxWidth === "100%"
                      ? "repeat(auto-fit, minmax(400px, 1fr))"
                      : "repeat(auto-fit, minmax(350px, 1fr))",
                  gap: layout.spacingLg,
                }}
              >
                {data.projects
                  .filter((p) => p.title?.trim())
                  .map((project, index) => (
                    <div
                      key={index}
                      className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
                      style={{
                        backgroundColor: colors.surface,
                        borderRadius: layout.radiusLg,
                        boxShadow: layout.shadowMd,
                      }}
                    >
                      {project.image && (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full object-cover"
                          style={{ height: "200px" }}
                        />
                      )}
                      <div style={{ padding: layout.spacingLg }}>
                        <h3
                          className="font-bold"
                          style={{
                            color: colors.textPrimary,
                            fontFamily: typography.fontHeading,
                            fontSize: typography.fontSizeXl,
                            marginBottom: layout.spacingSm,
                          }}
                        >
                          {project.title}
                        </h3>
                        <p
                          style={{
                            color: colors.textSecondary,
                            marginBottom: layout.spacingMd,
                          }}
                        >
                          {project.description}
                        </p>
                        {project.technologies && (
                          <div
                            style={{
                              marginTop: layout.spacingSm,
                              marginBottom: layout.spacingSm,
                            }}
                          >
                            <TechList
                              technologies={project.technologies}
                              variant="minimal"
                              className=""
                            />
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            gap: layout.spacingSm,
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
                                textDecoration: "none",
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
                                textDecoration: "none",
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

      case "skills":
        if (!data.skills.some((s) => s.category?.trim() && s.items?.trim()))
          return null;
        return (
          <section
            key="skills"
            style={{
              backgroundColor: colors.surface,
              paddingTop: layout.spacingXl,
              paddingBottom: layout.spacingXl,
            }}
          >
            <div
              style={{
                maxWidth: layout.maxWidth,
                margin: "0 auto",
                padding:
                  layout.maxWidth === "100%"
                    ? `0 ${layout.spacingLg}`
                    : `0 ${layout.spacingMd}`,
              }}
            >
              <h2
                className="text-center font-bold"
                style={{
                  color: colors.textPrimary,
                  fontFamily: typography.fontHeading,
                  fontSize: typography.fontSize3xl,
                  marginBottom: layout.spacingLg,
                }}
              >
                Habilidades
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: layout.spacingLg,
                }}
              >
                {data.skills
                  .filter((s) => s.category?.trim() && s.items?.trim())
                  .map((skill, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: colors.background,
                        padding: layout.spacingLg,
                        borderRadius: layout.radiusLg,
                        boxShadow: layout.shadowSm,
                      }}
                    >
                      <h3
                        className="font-bold"
                        style={{
                          color: colors.textPrimary,
                          fontFamily: typography.fontHeading,
                          fontSize: typography.fontSizeXl,
                          marginBottom: layout.spacingMd,
                        }}
                      >
                        {skill.category}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: layout.spacingXs,
                        }}
                      >
                        <TechList
                          technologies={skill.items}
                          variant="outlined"
                          className=""
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        );

      case "experience":
        if (!data.experience.some((e) => e.company?.trim())) return null;
        return (
          <section
            key="experience"
            style={{
              backgroundColor: colors.background,
              paddingTop: layout.spacingXl,
              paddingBottom: layout.spacingXl,
            }}
          >
            <div
              style={{
                maxWidth: layout.maxWidth,
                margin: "0 auto",
                padding:
                  layout.maxWidth === "100%"
                    ? `0 ${layout.spacingLg}`
                    : `0 ${layout.spacingMd}`,
              }}
            >
              <h2
                className="text-center font-bold"
                style={{
                  color: colors.textPrimary,
                  fontFamily: typography.fontHeading,
                  fontSize: typography.fontSize3xl,
                  marginBottom: layout.spacingLg,
                }}
              >
                Experiencia
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: layout.spacingLg,
                }}
              >
                {data.experience
                  .filter((e) => e.company?.trim())
                  .map((exp, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: colors.surface,
                        padding: layout.spacingLg,
                        borderRadius: layout.radiusLg,
                        boxShadow: layout.shadowMd,
                      }}
                    >
                      <h3
                        className="font-bold"
                        style={{
                          color: colors.textPrimary,
                          fontFamily: typography.fontHeading,
                          fontSize: typography.fontSizeXl,
                          marginBottom: layout.spacingSm,
                        }}
                      >
                        {exp.position}
                      </h3>
                      <h4
                        style={{
                          color: colors.primary,
                          fontSize: typography.fontSizeLg,
                          marginBottom: layout.spacingSm,
                        }}
                      >
                        {exp.company}
                      </h4>
                      <p
                        style={{
                          color: colors.textSecondary,
                          marginBottom: layout.spacingMd,
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
        );

      case "contact":
        return (
          <footer
            key="contact"
            className="text-white"
            style={{
              backgroundColor: colors.textPrimary,
              paddingTop: layout.spacingXl,
              paddingBottom: layout.spacingLg,
            }}
          >
            <div
              style={{
                maxWidth: layout.maxWidth,
                margin: "0 auto",
                padding:
                  layout.maxWidth === "100%"
                    ? `0 ${layout.spacingLg}`
                    : `0 ${layout.spacingMd}`,
              }}
            >
              <div className="text-center">
                <h3
                  className="font-bold"
                  style={{
                    fontFamily: typography.fontHeading,
                    fontSize: typography.fontSize2xl,
                    marginBottom: layout.spacingLg,
                  }}
                >
                  Contacto
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: layout.spacingLg,
                  }}
                >
                  {data.personalInfo.email && (
                    <a
                      href={`mailto:${data.personalInfo.email}`}
                      className="hover:opacity-80"
                      style={{
                        color: colors.accent,
                        textDecoration: "none",
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
                        textDecoration: "none",
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
                        textDecoration: "none",
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
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <p
                    className="opacity-75"
                    style={{ fontSize: typography.fontSizeSm }}
                  >
                    {data.personalInfo.fullName || "Portfolio Generator"}.
                    Portfolio generado con Portfolio Generator v2.0
                  </p>

                  <p
                    className="mt-2 opacity-60"
                    style={{
                      fontSize: typography.fontSizeSm,
                      marginTop: layout.spacingSm,
                    }}
                  >
                    Plantilla: {selectedTemplate?.name || "Default"} • Ancho:{" "}
                    {layout.maxWidth}
                    {config?.customizations &&
                      Object.keys(config.customizations).length > 0 &&
                      " • Personalizada"}
                    <br />
                    {debugInfo}
                  </p>
                </div>
              </div>
            </div>
          </footer>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        fontFamily: typography.fontFamily,
      }}
    >
      {/* Renderizar secciones dinámicamente en el orden correcto */}
      {orderedSections
        .map((section) => renderSection(section.id))
        .filter(Boolean)}
    </div>
  );
};

export default PortfolioViewer;

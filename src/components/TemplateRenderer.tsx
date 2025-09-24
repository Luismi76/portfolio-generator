// src/components/TemplateRenderer.tsx
import React, { useMemo } from "react";
import type { PortfolioData, Project } from "../types/portfolio-types";
import type { TemplateSection } from "../types/template-types";
import { useTemplates } from "./use-templates";
import { TemplateTheme } from "./TemplateTheme";
import { TechList } from "./TechIcons";
import { getDefaultTemplate } from "./built-in-templates";
import { Icons } from "./portfolio-icons";
import ProjectDetailsModal from "./portfolio/ProjectDetailsModal";

type Props = {
  data: PortfolioData;
  onOpenProject?: (p: Project) => void;
};

const Skeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-48 w-full bg-gray-200" />
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="h-6 w-64 bg-gray-200 rounded" />
      <div className="h-4 w-80 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow border p-4 space-y-2"
          >
            <div className="h-32 bg-gray-100 rounded" />
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-56 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const TemplateRenderer: React.FC<Props> = ({ data, onOpenProject }) => {
  const { selectedTemplate, config } = useTemplates();
  const safeTemplate = selectedTemplate ?? getDefaultTemplate();
  const [selected, setSelected] = React.useState<Project | null>(null);


  // Nota: 'mergedForVars' se usa indirectamente por <TemplateTheme>, no lo borres

  // Fuente de secciones: prioridad a config.customizations.sections si existe
  // Fuente de secciones con memo: prioriza config.customizations.sections si existe
  const sectionsSource: TemplateSection[] = useMemo(() => {
    const fromConfig = config?.customizations?.sections;
    return (
      (fromConfig && fromConfig.length ? fromConfig : safeTemplate.sections) ??
      []
    );
  }, [safeTemplate, config?.customizations?.sections]);
  
  const normalizeSectionId = (raw?: string): string => {
  const v = (raw || "").toLowerCase().trim();
  if (v === "footer") return "contact";
  if (v === "sobre-mi" || v === "aboutme" || v === "about-me" || v === "profile") return "about";
  return v;
};

const isEnabled = (raw: unknown): boolean => {
  if (raw === false || raw === 0 || raw === null) return false;
  if (typeof raw === "string") {
    const s = raw.trim().toLowerCase();
    if (s === "false" || s === "0" || s === "no" || s === "off" || s === "disabled") return false;
  }
  // por defecto ON si no se especifica
  return true;
};


  // Normalizar ids equivalentes y DEDUPLICAR (contact/footer) SIN perder 'props'
  const sections: TemplateSection[] = useMemo(() => {
  const map = new Map<string, TemplateSection>();

  for (const s of sectionsSource) {
    if (!s) continue;
    if (!isEnabled((s as any).enabled)) continue;

    const normId = normalizeSectionId(s.id);
    const candidate: TemplateSection = {
      ...s,
      id: normId,
      props: s.props ?? {},
      order: typeof s.order === "number" ? s.order : 0,
    };

    const current = map.get(normId);
    if (!current) {
      map.set(normId, candidate);
    } else {
      map.set(normId, candidate.order < current.order ? candidate : current);
    }
  }

  return Array.from(map.values()).sort((a, b) => a.order - b.order);
}, [sectionsSource]);

  const noUsableSections = sections.length === 0;

  // ===== Renderers de secciones =====

  const renderHeader = () => {
  const handleProjectsClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    const el = document.getElementById("projects");
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const name = data.personalInfo.fullName || "Tu Portfolio";
  const subtitle = data.personalInfo.title?.trim() || "";

  return (
    <header
      className="tpl-header tpl-header-bg"
      aria-label="Encabezado del portafolio"
      style={{
        position: "relative",
        isolation: "isolate",     // <- evita que el fondo/ola “sangre” a lo siguiente
        overflow: "hidden",
        paddingTop: "16px",
        paddingBottom: "28px",   // altura reservada para la ola
        marginBottom: "var(--sp-md)", // separación visual con la siguiente sección
      }}
    >
      <div
        className="tpl-container"
        style={{ position: "relative", zIndex: 1, display: "grid", gap: "10px" }}
      >
        {/* Títulos */}
        <div style={{ display: "grid", gap: "6px" }}>
          <h1
            className="tpl-heading"
            style={{
              fontSize: "var(--fs-3xl)",
              fontWeight: "var(--fw-bold)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--text-on-primary, #fff)",
              textShadow: "0 1px 1px rgb(0 0 0 / 0.15)",
              margin: 0,
            }}
          >
            {name}
          </h1>

          {subtitle && (
            <p
              className="tpl-subtext"
              style={{
                fontSize: "var(--fs-lg)",
                opacity: 0.95,
                color: "var(--text-on-primary, #fff)",
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: "6px" }}>
          {data.personalInfo.email && (
            <a
              href={`mailto:${data.personalInfo.email}`}
              className="tpl-btn-primary"
              aria-label="Enviar email"
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icons.Mail size={16} aria-hidden />
                <span>Contactar</span>
              </span>
            </a>
          )}

          <a
            href="#projects"
            onClick={handleProjectsClick}
            className="tpl-btn-outline"
            aria-label="Ir a proyectos"
            style={{ borderColor: "var(--color-accent)" }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Icons.Code size={16} aria-hidden />
              <span>Ver proyectos</span>
            </span>
          </a>
        </div>

        {/* Redes */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "6px" }}>
          {data.personalInfo.github && (
            <a
              href={data.personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="tpl-chip"
              aria-label="GitHub"
              title="GitHub"
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icons.Github size={14} aria-hidden />
                <span>GitHub</span>
              </span>
            </a>
          )}
          {data.personalInfo.linkedin && (
            <a
              href={data.personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="tpl-chip"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icons.Linkedin size={14} aria-hidden />
                <span>LinkedIn</span>
              </span>
            </a>
          )}
          {data.personalInfo.website && (
            <a
              href={data.personalInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="tpl-chip"
              aria-label="Sitio web"
              title="Sitio web"
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icons.Globe size={14} aria-hidden />
                <span>Web</span>
              </span>
            </a>
          )}
        </div>
      </div>

      {/* OLA (queda detrás gracias al z-index) */}
      <svg
        role="presentation"
        aria-hidden="true"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 32,
          opacity: 0.15,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <path
          d="M0,64 C240,128 480,0 720,32 C960,64 1200,176 1440,96 L1440,160 L0,160 Z"
          fill="currentColor"
        />
      </svg>
    </header>
  );
};


  const renderAbout = () => {
  const { summary } = data.personalInfo;
  if (!summary) return null;

  return (
    <section
      id="about"
      style={{
        position: "relative",
        zIndex: 1,                       // <- asegura que esté por ENCIMA del header
        background: "var(--surface, #fff)", // <- fuerza fondo de la sección
        paddingTop: "var(--sp-lg)",
        paddingBottom: "var(--sp-lg)",
      }}
    >
      <div className="tpl-container">
        <h2 className="tpl-heading" style={{ fontSize: "var(--fs-2xl)", marginBottom: "var(--sp-md)" }}>
          Sobre mí
        </h2>
      </div>
      <div className="tpl-container">
        <div className="tpl-surface" style={{ padding: "var(--sp-md)" }}>
          <p className="tpl-subtext" style={{ fontSize: "var(--fs-base)" }}>{summary}</p>
        </div>
      </div>
    </section>
  );
};


  const renderProjects = () => {
    if (!data.projects.some((p) => p.title?.trim())) return null;

    const projectsSection = sections.find((s) => s.id === "projects");
    const gridCols: number = Math.max(
      2,
      Math.min(4, Number(projectsSection?.props?.gridCols ?? 3))
    );

    return (
      <section
        id="projects"
        style={{ paddingTop: "var(--sp-lg)", paddingBottom: "var(--sp-lg)" }}
        aria-labelledby="projects-title"
      >
        <div className="tpl-container">
          <h2
            id="projects-title"
            className="tpl-heading"
            style={{ fontSize: "var(--fs-2xl)", marginBottom: "var(--sp-md)" }}
          >
            Proyectos
          </h2>

          <div
            className="projects-grid"
            style={{
              display: "grid",
              gap: "var(--sp-md)",
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              alignItems: "stretch", // estira las tarjetas
            }}
          >
            {data.projects
              .filter((p) => p.title?.trim())
              .map((p, idx) => (
                <article
                  key={idx}
                  className="tpl-card"
                  style={{
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%", // asegura tarjeta a toda la altura disponible
                  }}
                >
                  {/* Media 16:9 */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "56.25%",
                      background: "var(--card-media-bg, rgba(0,0,0,.05))",
                      flex: "0 0 auto",
                    }}
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "grid",
                          placeItems: "center",
                          fontSize: "var(--fs-lg)",
                          opacity: 0.5,
                        }}
                        aria-hidden="true"
                      >
                        {p.title?.slice(0, 1) ?? "•"}
                      </div>
                    )}
                  </div>

                  {/* Contenido (ocupa el resto, botones al fondo) */}
                  <div
                    style={{
                      padding: "var(--sp-md)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--sp-sm)",
                      flex: 1, // ocupa todo el alto restante
                      minHeight: 0,
                    }}
                  >
                    {/* Título debajo */}
                    <h3
                      className="tpl-heading"
                      style={{ margin: 0, fontSize: "var(--fs-lg)" }}
                    >
                      {p.title}
                    </h3>

                    {/* Descripción */}
                    {p.description && (
                      <p
                        className="tpl-subtext"
                        style={{
                          fontSize: "var(--fs-base)",
                          margin: 0,
                        }}
                      >
                        {p.description}
                      </p>
                    )}

                    {/* Tech list */}
                    {p.technologies && (
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <TechList
                          technologies={p.technologies
                            .split(",")
                            .slice(0, 4)
                            .join(",")}
                          variant="minimal"
                        />
                      </div>
                    )}

                    {/* Botonera pegada abajo */}
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        marginTop: "auto", // <-- clave: empuja a la parte baja
                      }}
                    >
                      {onOpenProject && (
                        <button
                          className="tpl-btn-primary"
                          onClick={() => setSelected(p)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 12px",
                            borderRadius: 8,
                            fontWeight: 600,
                            lineHeight: 1.1,
                          }}
                        >
                          <Icons.Code size={16} aria-hidden />
                          <span>Ver detalles</span>
                        </button>
                      )}

                      {p.link && (
                        <a
                          className="tpl-btn-outline"
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 12px",
                            borderRadius: 8,
                            fontWeight: 600,
                            lineHeight: 1.1,
                            textDecoration: "none",
                          }}
                        >
                          <Icons.Globe size={16} aria-hidden />
                          <span>Live</span>
                        </a>
                      )}

                      {p.github && (
                        <a
                          className="tpl-btn-outline"
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 12px",
                            borderRadius: 8,
                            fontWeight: 600,
                            lineHeight: 1.1,
                            textDecoration: "none",
                          }}
                        >
                          <Icons.Github size={16} aria-hidden />
                          <span>Código</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>
    );
  };

  const renderSkills = () => {
    if (!data.skills.some((s) => s.category.trim())) return null;

    return (
      <section
        style={{ paddingTop: "var(--sp-lg)", paddingBottom: "var(--sp-lg)" }}
      >
        <div className="tpl-container">
          <h2
            className="tpl-heading"
            style={{ fontSize: "var(--fs-2xl)", marginBottom: "var(--sp-md)" }}
          >
            Habilidades
          </h2>

          <div
            style={{
              display: "grid",
              gap: "var(--sp-md)",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              alignItems: "start",
            }}
          >
            {data.skills
              .filter((s) => s.category.trim())
              .map((s, i) => (
                <div
                  key={i}
                  className="tpl-surface"
                  style={{
                    padding: "var(--sp-md)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--sp-sm)",
                  }}
                >
                  <h3
                    className="tpl-heading"
                    style={{ fontSize: "var(--fs-lg)", margin: 0 }}
                  >
                    {s.category}
                  </h3>

                  {/* Usa tu TechList para que salgan los iconos de cada tecnología */}
                  <TechList
                    technologies={s.items}
                    variant="minimal" // outlined | minimal | default
                  />
                </div>
              ))}
          </div>
        </div>
      </section>
    );
  };

  const renderExperience = () => (
    <section
      style={{ paddingTop: "var(--sp-lg)", paddingBottom: "var(--sp-lg)" }}
    >
      <div className="tpl-container">
        <h2
          className="tpl-heading"
          style={{ fontSize: "var(--fs-2xl)", marginBottom: "var(--sp-md)" }}
        >
          Experiencia
        </h2>
        <div className="tpl-surface" style={{ padding: "var(--sp-md)" }}>
          <p className="tpl-subtext" style={{ fontSize: "var(--fs-base)" }}>
            Añade tu experiencia profesional desde el editor.
          </p>
        </div>
      </div>
    </section>
  );

  // Pie de página — para 'contact' y 'footer' (ya deduplicados a 'contact')
  const renderFooterLike = () => (
    <footer
      style={{
        paddingTop: "var(--sp-lg)",
        paddingBottom: "var(--sp-lg)",
        background: "var(--color-primary)",
        color: "white",
      }}
    >
      <div className="tpl-container">
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {data.personalInfo.email && (
            <a
              href={`mailto:${data.personalInfo.email}`}
              className="tpl-btn-outline"
              style={{ color: "white", borderColor: "rgba(255,255,255,.4)" }}
            >
              Email
            </a>
          )}
          {data.personalInfo.github && (
            <a
              href={data.personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="tpl-btn-outline"
              style={{ color: "white", borderColor: "rgba(255,255,255,.4)" }}
            >
              GitHub
            </a>
          )}
          {data.personalInfo.linkedin && (
            <a
              href={data.personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="tpl-btn-outline"
              style={{ color: "white", borderColor: "rgba(255,255,255,.4)" }}
            >
              LinkedIn
            </a>
          )}
          {data.personalInfo.website && (
            <a
              href={data.personalInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="tpl-btn-outline"
              style={{ color: "white", borderColor: "rgba(255,255,255,.4)" }}
            >
              Web
            </a>
          )}
        </div>
        <p
          style={{
            marginTop: "var(--sp-sm)",
            opacity: 0.9,
            fontSize: "var(--fs-sm)",
          }}
        >
          © {new Date().getFullYear()}{" "}
          {data.personalInfo.fullName || "Portfolio"}
        </p>
      </div>
    </footer>
  );

  const renderUnknown = (name: string) => (
    <section
      style={{ paddingTop: "var(--sp-lg)", paddingBottom: "var(--sp-lg)" }}
    >
      <div className="tpl-container">
        <h2
          className="tpl-heading"
          style={{ fontSize: "var(--fs-xl)", marginBottom: "var(--sp-sm)" }}
        >
          {name}
        </h2>
        <div className="tpl-surface" style={{ padding: "var(--sp-md)" }}>
          <p className="tpl-subtext" style={{ fontSize: "var(--fs-base)" }}>
            Esta sección no tiene un renderer específico aún. Puedes añadirlo
            más tarde.
          </p>
        </div>
      </div>
    </section>
  );

  const renderById = (id: string, name: string) => {
    switch (id) {
      case "header":
        return renderHeader();
      case "about":
        return renderAbout();
      case "projects":
        return renderProjects();
      case "skills":
        return renderSkills();
      case "experience":
        return renderExperience();
      case "contact": // 'footer' ya se normaliza a 'contact'
        return renderFooterLike();
      default:
        return renderUnknown(name);
    }
  };

  return (
    <TemplateTheme template={safeTemplate} config={config ?? undefined}>
      {noUsableSections ? (
        <Skeleton />
      ) : (
        sections.map((s) => (
          <React.Fragment key={s.id}>{renderById(s.id, s.name)}</React.Fragment>
        ))
      )}
      <ProjectDetailsModal project={selected} onClose={() => setSelected(null)} />

    </TemplateTheme>
  );
};

// src/components/TemplateRenderer.tsx
import React, { useMemo } from "react";
import type { PortfolioData, Project } from "../types/portfolio-types";
import type { TemplateSection } from "../types/template-types";
import { useTemplates } from "./use-templates";
import { TemplateTheme, mergeTemplateWithConfig } from "./TemplateTheme";
import { TechList } from "./TechIcons";
import { getDefaultTemplate } from "./built-in-templates";
import { Icons } from "./portfolio-icons";

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
          <div key={i} className="bg-white rounded-lg shadow border p-4 space-y-2">
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

  // Merge para variables (colores/tipografías/layout) — útil para TemplateTheme
  const mergedForVars = useMemo(
    () => mergeTemplateWithConfig(safeTemplate, config || undefined),
    [safeTemplate, config]
  );
  // Nota: 'mergedForVars' se usa indirectamente por <TemplateTheme>, no lo borres

  // Fuente de secciones: prioridad a config.customizations.sections si existe
  const sectionsSource: TemplateSection[] =
    (config?.customizations?.sections?.length
      ? config.customizations.sections
      : safeTemplate.sections) ?? [];

  // Normalizar ids equivalentes y DEDUPLICAR (contact/footer) SIN perder 'props'
  const sections: TemplateSection[] = useMemo(() => {
    const map = new Map<string, TemplateSection>();

    for (const s of sectionsSource) {
      if (!s || !s.enabled) continue;

      // Normalizamos: 'footer' y 'contact' son la misma sección lógica
      const normId = s.id === "footer" ? "contact" : s.id;

      // Aseguramos que exista props para cumplir el tipo
      const candidate: TemplateSection = {
        ...s,
        id: normId,
        props: s.props ?? {},
      };

      if (!map.has(normId)) {
        map.set(normId, candidate);
      } else {
        // si ya existe, nos quedamos con el de menor order
        const current = map.get(normId)!;
        map.set(normId, candidate.order < current.order ? candidate : current);
      }
    }

    // Devolvemos array ordenado por 'order'
    return Array.from(map.values()).sort((a, b) => a.order - b.order);
  }, [sectionsSource]);

  const noUsableSections = sections.length === 0;

  // ===== Renderers de secciones =====

  const renderHeader = () => (
    <header
      className="tpl-header tpl-header-bg"
      style={{
        paddingTop: "calc(var(--sp-lg) + 0.5rem)",
        paddingBottom: "calc(var(--sp-lg) + 0.5rem)",
      }}
    >
      <div className="tpl-container" style={{ display: "grid", gap: "var(--sp-md)" }}>
        {/* Fila superior: nombre + rol */}
        <div style={{ display: "grid", gap: "var(--sp-sm)" }}>
          <h1
            className="tpl-heading"
            style={{
              fontSize: "var(--fs-4xl)",
              fontWeight: "var(--fw-bold)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--text-on-primary, #fff)",
            }}
          >
            {data.personalInfo.fullName || "Tu Portfolio"}
          </h1>

          <p
            className="tpl-subtext"
            style={{
              fontSize: "var(--fs-xl)",
              opacity: 0.95,
              color: "var(--text-on-primary, #fff)",
            }}
          >
            {data.personalInfo.title || "Desarrollador/a"}
          </p>
        </div>

        {/* Fila de CTAs */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginTop: "var(--sp-sm)",
          }}
        >
          {data.personalInfo.email && (
            <a
              href={`mailto:${data.personalInfo.email}`}
              className="tpl-btn-primary"
              aria-label="Enviar email"
              style={{ textDecoration: "none" }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icons.Mail size={16} />
                Contactar
              </span>
            </a>
          )}
          <a
            href="#projects"
            className="tpl-btn-outline"
            aria-label="Ir a proyectos"
            style={{
              borderColor: "var(--color-accent)",
              textDecoration: "none",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Icons.Code size={16} />
              Ver proyectos
            </span>
          </a>
        </div>

        {/* Fila de redes / links */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: "var(--sp-sm)" }}>
          {data.personalInfo.github && (
            <a
              href={data.personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="tpl-chip"
              aria-label="GitHub"
              title="GitHub"
              style={{ textDecoration: "none" }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icons.Github size={14} />
                GitHub
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
              style={{ textDecoration: "none" }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icons.Linkedin size={14} />
                LinkedIn
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
              style={{ textDecoration: "none" }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icons.Globe size={14} />
                Web
              </span>
            </a>
          )}
        </div>
      </div>
    </header>
  );

  const renderAbout = () => {
    const { summary } = data.personalInfo;
    if (!summary) return null;
    return (
      <section style={{ paddingTop: "var(--sp-lg)", paddingBottom: "var(--sp-lg)" }}>
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
    if (!data.projects.some((p) => p.title.trim())) return null;

    // Lee gridCols (2..4) desde props de la sección 'projects'
    const projectsSection = sections.find((s) => s.id === "projects");
    const gridCols: number = Math.max(
      2,
      Math.min(4, Number(projectsSection?.props?.gridCols ?? 3))
    );

    return (
      <section id="projects" style={{ paddingTop: "var(--sp-lg)", paddingBottom: "var(--sp-lg)" }}>
        <div className="tpl-container">
          <h2 className="tpl-heading" style={{ fontSize: "var(--fs-2xl)", marginBottom: "var(--sp-md)" }}>
            Proyectos
          </h2>

          <div
            className="projects-grid"
            style={{
              display: "grid",
              gap: "var(--sp-md)",
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            }}
          >
            {data.projects
              .filter((p) => p.title.trim())
              .map((p, idx) => (
                <article key={idx} className="tpl-card">
                  {p.image && (
                    <div style={{ height: 180, overflow: "hidden" }}>
                      <img
                        src={p.image}
                        alt={p.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div style={{ padding: "var(--sp-md)" }}>
                    <h3 className="tpl-heading" style={{ fontSize: "var(--fs-lg)", marginBottom: "0.5rem" }}>
                      {p.title}
                    </h3>
                    <p className="tpl-subtext" style={{ fontSize: "var(--fs-base)", marginBottom: "var(--sp-sm)" }}>
                      {p.description}
                    </p>

                    {p.technologies && (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "var(--sp-sm)" }}>
                        <TechList
                          technologies={p.technologies.split(",").slice(0, 4).join(",")}
                          variant="minimal"
                        />
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 8, marginTop: "var(--sp-sm)" }}>
                      {onOpenProject && (
                        <button className="tpl-btn-primary" onClick={() => onOpenProject(p)}>
                          Ver detalles
                        </button>
                      )}
                      {p.link && (
                        <a className="tpl-btn-outline" href={p.link} target="_blank" rel="noopener noreferrer">
                          Live
                        </a>
                      )}
                      {p.github && (
                        <a className="tpl-btn-outline" href={p.github} target="_blank" rel="noopener noreferrer">
                          Código
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
      <section style={{ paddingTop: "var(--sp-lg)", paddingBottom: "var(--sp-lg)" }}>
        <div className="tpl-container">
          <h2 className="tpl-heading" style={{ fontSize: "var(--fs-2xl)", marginBottom: "var(--sp-md)" }}>
            Habilidades
          </h2>
          <div
            style={{
              display: "grid",
              gap: "var(--sp-md)",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {data.skills
              .filter((s) => s.category.trim())
              .map((s, i) => (
                <div key={i} className="tpl-surface" style={{ padding: "var(--sp-md)" }}>
                  <h3 className="tpl-heading" style={{ fontSize: "var(--fs-lg)", marginBottom: "var(--sp-sm)" }}>
                    {s.category}
                  </h3>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {s.items
                      .split(",")
                      .filter((t) => t.trim())
                      .map((t, j) => (
                        <span key={j} className="tpl-chip">
                          {t.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    );
  };

  const renderExperience = () => (
    <section style={{ paddingTop: "var(--sp-lg)", paddingBottom: "var(--sp-lg)" }}>
      <div className="tpl-container">
        <h2 className="tpl-heading" style={{ fontSize: "var(--fs-2xl)", marginBottom: "var(--sp-md)" }}>
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
        <p style={{ marginTop: "var(--sp-sm)", opacity: 0.9, fontSize: "var(--fs-sm)" }}>
          © {new Date().getFullYear()} {data.personalInfo.fullName || "Portfolio"}
        </p>
      </div>
    </footer>
  );

  const renderUnknown = (name: string) => (
    <section style={{ paddingTop: "var(--sp-lg)", paddingBottom: "var(--sp-lg)" }}>
      <div className="tpl-container">
        <h2 className="tpl-heading" style={{ fontSize: "var(--fs-xl)", marginBottom: "var(--sp-sm)" }}>
          {name}
        </h2>
        <div className="tpl-surface" style={{ padding: "var(--sp-md)" }}>
          <p className="tpl-subtext" style={{ fontSize: "var(--fs-base)" }}>
            Esta sección no tiene un renderer específico aún. Puedes añadirlo más tarde.
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
    </TemplateTheme>
  );
};

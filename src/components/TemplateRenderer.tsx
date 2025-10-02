// src/components/TemplateRenderer.tsx
import React, { useMemo, useState } from "react";
import type { PortfolioData, Project } from "../types/portfolio-types";
import type { TemplateSection, Template } from "../types/template-types";
import { TemplateTheme } from "./TemplateTheme";
import { TechList } from "./TechIcons";
import { getDefaultTemplate } from "./built-in-templates";
import { Icons } from "./portfolio-icons";
import ProjectDetailsModal from "./portfolio/ProjectDetailsModal";

import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
  Section as AdvSection,
  LayoutArea,
  TemplateLayoutStructure,
} from "../types/advanced-template-types";

type TemplateRendererProps = {
  data: PortfolioData;
  onOpenProject?: (p: Project) => void;
  template?: AdvancedTemplate;
  config?: AdvancedTemplateConfig;
};

/* ---------------- helpers ---------------- */

const normalizeSectionId = (raw?: string): string => {
  const v = (raw || "").toLowerCase().trim();
  if (v === "footer") return "contact";
  if (
    v === "sobre-mi" ||
    v === "aboutme" ||
    v === "about-me" ||
    v === "profile"
  )
    return "about";
  if (v === "hero") return "header";
  return v;
};

const isEnabled = (raw: unknown): boolean => {
  if (raw === false || raw === 0 || raw === null) return false;
  if (typeof raw === "string") {
    const s = raw.trim().toLowerCase();
    if (["false", "0", "no", "off", "disabled"].includes(s)) return false;
  }
  return true;
};

const orderAsc = <T extends { order?: number }>(a: T, b: T) =>
  (a.order ?? 0) - (b.order ?? 0);

/** Crea un mapa de secciones por área a partir del sistema avanzado */
function groupSectionsByArea(sections: AdvSection[] | undefined) {
  const by: Record<LayoutArea, AdvSection[]> = {
    header: [],
    "sidebar-left": [],
    main: [],
    "sidebar-right": [],
    footer: [],
    floating: [],
  };
  if (!sections) return by;

  for (const s of sections) {
    if (!isEnabled((s as any).enabled)) continue;
    const area = (s.area ?? "main") as LayoutArea;
    by[area].push(s);
  }

  (Object.keys(by) as LayoutArea[]).forEach((k) => by[k].sort(orderAsc));
  return by;
}

/** Convierte secciones a TemplateSection (legacy) para búsquedas simples (props, orden…) */
function toTemplateSections(
  sections: AdvSection[] | undefined
): TemplateSection[] {
  if (!sections) return [];
  return sections
    .filter((s) => isEnabled(s.enabled))
    .map((s) => ({
      id: normalizeSectionId(s.id ?? s.type),
      name: s.name ?? String(s.id ?? s.type ?? "section"),
      order: s.order ?? 0,
      enabled: true,
      props: (s as any).props ?? {},
    }))
    .sort(orderAsc);
}

/** Bridge: AdvancedTemplate (+config) → CSS variables que usa el renderer */
function buildAdvancedCSSVars(
  t?: AdvancedTemplate | null,
  c?: AdvancedTemplateConfig | null
): React.CSSProperties {
  if (!t) return {};

  const cols = { ...t.colors, ...(c?.customizations?.colors || {}) };
  const typo = { ...t.typography, ...(c?.customizations?.typography || {}) };
  const layout = { ...t.layout, ...(c?.customizations?.layout || {}) };

  const fs = typo.fontSizes || ({} as any);
  const ff = typo.fontFamilies || ({} as any);
  const ls = typo.letterSpacing || ({} as any);
  const lh = typo.lineHeights || ({} as any);
  const sp = layout.spacing || ({} as any);
  const br = layout.borderRadius || ({} as any);

  const style: React.CSSProperties = {
    // Colores base (nombres alineados con TemplateTheme)
    ["--color-primary" as any]: cols.primary,
    ["--color-secondary" as any]: cols.secondary,
    ["--color-accent" as any]: cols.accent,
    ["--color-bg" as any]: cols.background,
    ["--color-surface" as any]: cols.surface,
    ["--surface-variant" as any]: cols.surfaceVariant,
    ["--text-primary" as any]: cols.text?.primary,
    ["--text-secondary" as any]: cols.text?.secondary,
    ["--text-accent" as any]: cols.text?.accent,
    ["--text-muted" as any]: cols.text?.muted,
    ["--text-inverse" as any]: cols.text?.inverse,
    ["--text-on-primary" as any]: "#ffffff",

    // Tipografías (alineadas)
    ["--font-primary" as any]: ff.primary,
    ["--font-heading" as any]: ff.heading || ff.primary,
    ["--ff-mono" as any]:
      ff.monospace || "ui-monospace, SFMono-Regular, Menlo, monospace",

    ["--fs-xs" as any]: fs.xs,
    ["--fs-sm" as any]: fs.sm,
    ["--fs-base" as any]: fs.base,
    ["--fs-lg" as any]: fs.lg,
    ["--fs-xl" as any]: fs.xl,
    ["--fs-2xl" as any]: fs["2xl"],
    ["--fs-3xl" as any]: fs["3xl"],
    ["--fs-4xl" as any]: fs["4xl"],
    ["--fs-5xl" as any]: fs["5xl"],
    ["--fs-6xl" as any]: fs["6xl"],

    ["--ls-tighter" as any]: ls.tighter,
    ["--ls-tight" as any]: ls.tight,
    ["--ls-normal" as any]: ls.normal,
    ["--ls-wide" as any]: ls.wide,
    ["--ls-wider" as any]: ls.wider,

    ["--lh-tight" as any]: String(lh.tight),
    ["--lh-snug" as any]: String(lh.snug),
    ["--lh-normal" as any]: String(lh.normal),
    ["--lh-relaxed" as any]: String(lh.relaxed),
    ["--lh-loose" as any]: String(lh.loose),

    // Spacing + radios (alineados)
    ["--sp-xs" as any]: sp.xs,
    ["--sp-sm" as any]: sp.sm,
    ["--sp-md" as any]: sp.md,
    ["--sp-lg" as any]: sp.lg,
    ["--sp-xl" as any]: sp.xl,
    ["--sp-2xl" as any]: sp["2xl"],

    ["--br-sm" as any]: br.sm,
    ["--br-md" as any]: br.md,
    ["--br-lg" as any]: br.lg,
    ["--br-xl" as any]: br.xl,
  };

  return style;
}

/* ---------------- component ---------------- */

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  data,
  onOpenProject,
  template: effectiveTemplate,
  config,
}) => {
  // Template base que copia los colores activos (para que TemplateTheme calcule el header)
  const themeTemplate: Template = useMemo(() => {
    const base = getDefaultTemplate();
    if (!effectiveTemplate) return base;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: effectiveTemplate.colors.primary ?? base.colors.primary,
        secondary: effectiveTemplate.colors.secondary ?? base.colors.secondary,
        accent: effectiveTemplate.colors.accent ?? base.colors.accent,
        background:
          effectiveTemplate.colors.background ?? base.colors.background,
        surface: effectiveTemplate.colors.surface ?? base.colors.surface,
        text: {
          ...base.colors.text,
          primary:
            effectiveTemplate.colors.text?.primary ?? base.colors.text.primary,
          secondary:
            effectiveTemplate.colors.text?.secondary ??
            base.colors.text.secondary,
        },
      },
    };
  }, [effectiveTemplate]);

  const [selected, setSelected] = useState<Project | null>(null);

  // Secciones avanzadas (con área)
  const advancedSections = useMemo<AdvSection[] | undefined>(() => {
    const fromConfig = config?.customizations?.sections;
    return (
      (fromConfig && fromConfig.length
        ? fromConfig
        : effectiveTemplate?.sections) ?? []
    );
  }, [config?.customizations?.sections, effectiveTemplate?.sections]);

  // Grupos por área para el layout
  const byArea = useMemo(
    () => groupSectionsByArea(advancedSections),
    [advancedSections]
  );

  // Lista "plana" (legacy) para consultas/props simples
  const flatSections: TemplateSection[] = useMemo(
    () => toTemplateSections(advancedSections),
    [advancedSections]
  );

  // CSS variables que aplican colores + tipografía del avanzado
  const cssVars = useMemo(
    () => buildAdvancedCSSVars(effectiveTemplate, config),
    [effectiveTemplate, config]
  );

  // Estructura de layout (anchos de columnas)
  const structure: TemplateLayoutStructure | undefined =
    effectiveTemplate?.layoutStructure;
  const leftEnabled =
    structure?.areas?.["sidebar-left"]?.enabled !== false &&
    byArea["sidebar-left"].length > 0;
  const rightEnabled =
    structure?.areas?.["sidebar-right"]?.enabled !== false &&
    byArea["sidebar-right"].length > 0;

  const leftW = structure?.areas?.["sidebar-left"]?.width || "260px";
  const rightW = structure?.areas?.["sidebar-right"]?.width || "280px";

  const gridTemplateColumns =
    leftEnabled && rightEnabled
      ? `${leftW} minmax(0,1fr) ${rightW}`
      : leftEnabled
      ? `${leftW} minmax(0,1fr)`
      : rightEnabled
      ? `minmax(0,1fr) ${rightW}`
      : `minmax(0,1fr)`;

  /* ===== Renderers de secciones ===== */

const renderHeader = () => {
  // Si no hay secciones en header, no pintamos cabecera
  if (byArea.header.length === 0) return null;

  const headerConfig = config?.customizations.headerConfig;
  const showAvatar = headerConfig?.showAvatar && headerConfig?.avatarUrl;
  const avatarPosition = headerConfig?.avatarPosition || "center";
  const avatarSize = (headerConfig?.avatarSize || "md") as "sm" | "md" | "lg";

  const avatarSizes: Record<"sm" | "md" | "lg", string> = {
    sm: "80px",
    md: "120px",
    lg: "160px",
  };

  // Scroll suave a proyectos
  const handleProjectsClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    const el = document.getElementById("projects");
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // SIMPLIFICADO: Obtener background del header
  const getHeaderBackground = (): string => {
    // Intentar obtener gradiente configurado
    const gradients = 
      config?.customizations?.colors?.gradients ?? 
      effectiveTemplate?.colors?.gradients;
    
    // Usar gradiente primary como fallback (es el más común para headers)
    const gradient = gradients?.primary;
    
    if (gradient?.from && gradient?.to) {
      const direction = gradient.direction || "135deg";
      return `linear-gradient(${direction}, ${gradient.from}, ${gradient.to})`;
    }
    
    // Fallback a color primario
    return config?.customizations?.colors?.primary ?? 
           effectiveTemplate?.colors?.primary ?? 
           "var(--color-primary)";
  };

  const headerBg = getHeaderBackground();
  const name = data.personalInfo.fullName || "Tu Portfolio";
  const subtitle = data.personalInfo.title?.trim() || "";

  // Helper para validar URLs
  const isValidUrl = (url?: string): boolean => {
    if (!url) return false;
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  // Redes sociales con validación
  const socialLinks = [
    { 
      url: data.personalInfo.github, 
      Icon: Icons.Github, 
      label: "GitHub",
      isValid: isValidUrl(data.personalInfo.github)
    },
    { 
      url: data.personalInfo.linkedin, 
      Icon: Icons.Linkedin, 
      label: "LinkedIn",
      isValid: isValidUrl(data.personalInfo.linkedin)
    },
    { 
      url: data.personalInfo.website, 
      Icon: Icons.Globe, 
      label: "Sitio web",
      isValid: isValidUrl(data.personalInfo.website)
    },
  ].filter(link => link.isValid);

  return (
    <header
      className="tpl-header tpl-header-bg"
      aria-label="Encabezado del portafolio"
      style={{
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        paddingTop: "clamp(2rem, 5vw, var(--sp-lg))",
        paddingBottom: "clamp(2rem, 5vw, var(--sp-lg))",
        marginBottom: "var(--sp-md)",
        background: headerBg,
        color: "var(--text-on-primary, #fff)",
      }}
    >
      <div
        className="tpl-container"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: avatarPosition === "center" ? "column" : "row",
          alignItems: avatarPosition === "center" ? "center" : "flex-start",
          gap: "var(--sp-md)",
          ...(avatarPosition === "right" && { flexDirection: "row-reverse" }),
        }}
      >
        {/* Avatar */}
        {showAvatar && (
          <img
            src={headerConfig.avatarUrl}
            alt={`Foto de perfil de ${name}`}
            style={{
              width: avatarSizes[avatarSize],
              height: avatarSizes[avatarSize],
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid rgba(255,255,255,0.3)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              flexShrink: 0,
            }}
          />
        )}

        {/* Contenido de texto */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-sm)",
            alignItems:
              avatarPosition === "center"
                ? "center"
                : avatarPosition === "right"
                ? "flex-end"
                : "flex-start",
            flex: 1,
          }}
        >
          {/* Nombre */}
          <h1
            className="tpl-heading"
            style={{
              fontSize: "clamp(2rem, 5vw, var(--fs-3xl))",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "var(--ls-tight, -0.02em)",
              color: "var(--text-on-primary, #fff)",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              margin: 0,
            }}
          >
            {name}
          </h1>

          {/* Subtítulo */}
          {subtitle && (
            <p
              className="tpl-subtext"
              style={{
                fontSize: "clamp(1rem, 2.5vw, var(--fs-lg))",
                opacity: 0.95,
                color: "var(--text-on-primary, #fff)",
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Botones de acción */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: "var(--sp-sm)",
              justifyContent:
                avatarPosition === "center" 
                  ? "center" 
                  : avatarPosition === "right"
                  ? "flex-end"
                  : "flex-start",
            }}
          >
            {data.personalInfo.email && (
              <a
                href={`mailto:${data.personalInfo.email}`}
                className="tpl-btn-primary"
                aria-label={`Enviar email a ${name}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Icons.Mail size={16} aria-hidden="true" />
                <span>Contactar</span>
              </a>
            )}

            <a
              href="#projects"
              onClick={handleProjectsClick}
              className="tpl-btn-outline"
              aria-label="Ver mis proyectos"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderColor: "rgba(255,255,255,0.4)",
                color: "var(--text-on-primary, #fff)",
                backgroundColor: "transparent",
              }}
            >
              <Icons.Code size={16} aria-hidden="true" />
              <span>Ver proyectos</span>
            </a>
          </div>

          {/* Enlaces sociales */}
          {socialLinks.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: "var(--sp-xs)",
                justifyContent:
                  avatarPosition === "center"
                    ? "center"
                    : avatarPosition === "right"
                    ? "flex-end"
                    : "flex-start",
              }}
              role="list"
              aria-label="Enlaces a redes sociales"
            >
              {socialLinks.map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tpl-chip"
                  aria-label={`Visitar mi ${label}`}
                  title={label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "transform 0.2s, opacity 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  <Icon size={14} aria-hidden="true" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SVG decorativo de onda */}
      <svg
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
          zIndex: 1,
          background: "var(--color-surface, #fff)",
          paddingTop: "var(--sp-lg)",
          paddingBottom: "var(--sp-lg)",
        }}
      >
        <div className="tpl-container">
          <h2 className="tpl-heading" style={{ fontSize: "var(--fs-2xl)" }}>
            Sobre mí
          </h2>
        </div>
        <div className="tpl-container">
          <div className="tpl-surface" style={{ padding: 0 }}>
            <p className="tpl-subtext" style={{ fontSize: "var(--fs-base)" }}>
              {summary}
            </p>
          </div>
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (!data.projects.some((p) => p.title?.trim())) return null;

    // gridCols desde avanzado (columns) o props legacy
    const advProj = advancedSections?.find(
      (s) => normalizeSectionId(s.id) === "projects"
    );
    const gridColsFromAdv = Number(advProj?.config?.columns ?? 0);
    const gridColsFromLegacy = Number(
      flatSections.find((s) => s.id === "projects")?.props?.gridCols ?? 0
    );
    const gridCols = Math.max(
      2,
      Math.min(4, gridColsFromAdv || gridColsFromLegacy || 3)
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
              alignItems: "stretch",
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
                    height: "100%",
                  }}
                >
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

                  <div
                    style={{
                      padding: "var(--sp-md)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--sp-sm)",
                      flex: 1,
                      minHeight: 0,
                    }}
                  >
                    <h3
                      className="tpl-heading"
                      style={{ margin: 0, fontSize: "var(--fs-lg)" }}
                    >
                      {p.title}
                    </h3>

                    {p.description && (
                      <p
                        className="tpl-subtext"
                        style={{ fontSize: "var(--fs-base)", margin: 0 }}
                      >
                        {p.description}
                      </p>
                    )}

                    {p.technologies && (
                      <div
                        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
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

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        marginTop: "auto",
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

    // Obtener columnas configuradas (igual que en projects)
    const advSkills = advancedSections?.find(
      (s) => normalizeSectionId(s.id) === "skills"
    );
    const gridColsFromAdv = Number(advSkills?.config?.columns ?? 0);
    const gridColsFromLegacy = Number(
      flatSections.find((s) => s.id === "skills")?.props?.gridCols ?? 0
    );
    const gridCols = Math.max(
      1,
      Math.min(4, gridColsFromAdv || gridColsFromLegacy || 2)
    );

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
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
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
                  <TechList technologies={s.items} variant="minimal" />
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
  // REEMPLAZAR LA FUNCIÓN renderFooterLike() EN TemplateRenderer.tsx
  // Busca la función renderFooterLike (línea ~770 aproximadamente) y reemplázala con esto:

  const renderFooterLike = () => {
    const { personalInfo } = data;

    // Obtener colores de la plantilla actual
    const primary =
      config?.customizations?.colors?.primary ??
      effectiveTemplate?.colors?.primary ??
      "var(--color-primary)";

    const secondary =
      config?.customizations?.colors?.secondary ??
      effectiveTemplate?.colors?.secondary ??
      "var(--color-secondary)";

    // Crear gradiente con los colores de la plantilla
    const footerBackground = `linear-gradient(135deg, ${primary}, ${secondary})`;

    return (
      <footer
        style={{
          background: footerBackground,
          color: "var(--text-on-primary, #fff)",
        }}
      >
        <div className="tpl-container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--sp-md)",
            }}
          >
            {/* Redes sociales */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {personalInfo.github && (
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  aria-label="GitHub"
                >
                  <Icons.Github size={20} />
                </a>
              )}
              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  aria-label="LinkedIn"
                >
                  <Icons.Linkedin size={20} />
                </a>
              )}
              {personalInfo.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  aria-label="Email"
                >
                  <Icons.Mail size={20} />
                </a>
              )}
            </div>

            {/* Copyright */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.95)",
                  fontWeight: 500,
                  fontSize: "var(--fs-base)",
                  margin: 0,
                }}
              >
                {personalInfo.fullName || "Tu Nombre"}
              </p>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "var(--fs-sm)",
                  marginTop: 4,
                  marginBottom: 0,
                }}
              >
                © {new Date().getFullYear()} • Todos los derechos reservados
              </p>
            </div>

            {/* Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "var(--fs-xs)",
              }}
            >
              <span>Hecho con</span>
              <span
                style={{
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Icons.Heart size={12} />
              </span>
              <span>usando React y TypeScript</span>
            </div>
          </div>
        </div>
      </footer>
    );
  };

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
      case "contact":
        return renderFooterLike();
      default:
        return renderUnknown(name);
    }
  };

  return (
    <TemplateTheme template={themeTemplate}>
      {/* Variables avanzadas que sobre-escriben dentro del scope */}
      <div style={cssVars as React.CSSProperties}>
        {/* HEADER */}
        {renderHeader()}

        {/* GRID de contenido (sidebars + main) */}
        <div
          className="tpl-container"
          style={{
            display: "grid",
            gap: "var(--sp-md)",
            gridTemplateColumns,
            alignItems: "start",
          }}
        >
          {/* LEFT SIDEBAR */}
          {leftEnabled && (
            <aside style={{ display: "grid", gap: "var(--sp-md)" }}>
              {byArea["sidebar-left"]
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((s) => {
                  const variant = s.config?.variant || "default";
                  const variantClass =
                    variant !== "default" ? `variant-${variant}` : "";
                  return (
                    <div key={s.id} className={variantClass}>
                      {renderById(normalizeSectionId(s.id ?? s.type), s.name)}
                    </div>
                  );
                })}
            </aside>
          )}

          {/* MAIN */}
          <main style={{ display: "grid", gap: "var(--sp-lg)" }}>
            {byArea.main
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((s) => {
                const id = normalizeSectionId(s.id ?? s.type);
                const variant = s.config?.variant || "default";
                const variantClass =
                  variant !== "default" ? `variant-${variant}` : "";

                return (
                  <div key={s.id} className={variantClass}>
                    {renderById(id, s.name)}
                  </div>
                );
              })}
          </main>

          {/* RIGHT SIDEBAR */}
          {rightEnabled && (
            <aside style={{ display: "grid", gap: "var(--sp-md)" }}>
              {byArea["sidebar-right"]
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((s) => {
                  const variant = s.config?.variant || "default";
                  const variantClass =
                    variant !== "default" ? `variant-${variant}` : "";
                  return (
                    <div key={s.id} className={variantClass}>
                      {renderById(normalizeSectionId(s.id ?? s.type), s.name)}
                    </div>
                  );
                })}
            </aside>
          )}
        </div>

        {/* FOOTER */}
        {byArea.footer.length > 0 && (
          <footer
            style={{
              background: "var(--color-primary)",
              color: "white",
            }}
          >
            {byArea.footer
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((s) => {
                const variant = s.config?.variant || "default";
                const variantClass =
                  variant !== "default" ? `variant-${variant}` : "";
                return (
                  <div key={s.id} className={variantClass}>
                    {renderById(normalizeSectionId(s.id ?? s.type), s.name)}
                  </div>
                );
              })}
          </footer>
        )}

        {/* Modal de detalles del proyecto */}
        <ProjectDetailsModal
          project={selected}
          onClose={() => setSelected(null)}
        />
      </div>
    </TemplateTheme>
  );
};

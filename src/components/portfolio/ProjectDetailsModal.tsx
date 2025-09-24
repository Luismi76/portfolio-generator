import React, { useEffect } from "react";
import type { Project } from "../../types/portfolio-types";
import { TechList } from "../TechIcons";
import {
  X,
  ExternalLink,
  Github,
  Globe,
  CalendarDays,
  UserRound,
  Users,
  Layers,
  Tag,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";

type Props = {
  project: Project | null;
  onClose: () => void;
  asPage?: boolean; // si quieres renderizar como página en vez de modal
};

/** Convierte distintos formatos a string[] */
function toStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/,|\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export default function ProjectDetailsModal({
  project,
  onClose,
  asPage = false,
}: Props) {
  // ✅ Memoiza 'p' para que NO cambie en cada render (arregla el warning del linter)
  const p = React.useMemo<Project>(() => project ?? ({} as Project), [project]);
  const open = !!project;

  // Derivados memoizados a partir de 'p'
  const gallery = React.useMemo(
    () =>
      toStringArray(
        (p as any).screenshots || (p as any).gallery || (p as any).images
      ).filter(
        (s) => /^https?:\/\//.test(s) || /\.(png|jpe?g|webp|avif|svg)$/i.test(s)
      ),
    [p]
  );
  const features = React.useMemo(
    () => toStringArray((p as any).features || (p as any).highlights),
    [p]
  );
  const responsibilities = React.useMemo(
    () => toStringArray((p as any).responsibilities || (p as any).roleTasks),
    [p]
  );
  const challenges = React.useMemo(
    () => toStringArray((p as any).challenges || (p as any).learnings),
    [p]
  );
  const tags = React.useMemo(() => toStringArray((p as any).tags), [p]);

  // Cerrar con ESC en modo modal
  useEffect(() => {
    if (!open || asPage) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, asPage, onClose]);
  // Bloquear scroll del body si es modal
  useEffect(() => {
    if (!open || asPage) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, asPage]);

  if (!open) return null;

  const Content = (
    <div
      className="tpl-surface"
      style={{
        width: "min(980px, 96vw)",
        borderRadius: 12,
        boxShadow: "var(--shadow-lg, 0 10px 30px rgba(0,0,0,.25))",
        overflow: "hidden",
        background: "var(--surface, #fff)",
        color: "var(--text, #111)",
      }}
      role="dialog"
      aria-modal={!asPage}
      aria-labelledby="proj-title"
    >
      {/* Header (solo título; sin 'subtitle' para respetar tu tipo Project) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          borderBottom: "1px solid var(--border, rgba(0,0,0,.08))",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            id="proj-title"
            className="tpl-heading"
            style={{ margin: 0, fontSize: "var(--fs-xl)" }}
          >
            {p.title || "Proyecto"}
          </h2>
        </div>

        {/* Acciones rápidas */}
        <div style={{ display: "flex", gap: 8 }}>
          {p.link && (
            <a
              className="tpl-btn-outline"
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Globe size={16} />
              Live
            </a>
          )}
          {p.github && (
            <a
              className="tpl-btn-outline"
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Github size={16} />
              Código
            </a>
          )}
          {!asPage && (
            <button
              onClick={onClose}
              className="tpl-btn-outline"
              aria-label="Cerrar"
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <X size={16} />
              Cerrar
            </button>
          )}
        </div>
      </div>

      {/* Cover */}
      {p.image && (
        <div
          style={{
            width: "100%",
            position: "relative",
            background: "var(--card-media-bg, rgba(0,0,0,.05))",
          }}
        >
          <img
            src={p.image}
            alt={p.title || "Imagen del proyecto"}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
              maxHeight: 360,
            }}
            loading="lazy"
          />
        </div>
      )}

      {/* Body */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 280px",
          gap: 24,
          padding: 20,
        }}
      >
        {/* Columna principal */}
        <div style={{ minWidth: 0 }}>
          {p.description && (
            <section style={{ marginBottom: 18 }}>
              <h3
                className="tpl-heading"
                style={{ fontSize: "var(--fs-lg)", margin: 0 }}
              >
                Descripción
              </h3>
              <p className="tpl-subtext" style={{ marginTop: 8 }}>
                {p.description}
              </p>
            </section>
          )}

          {features.length > 0 && (
            <section style={{ marginBottom: 18 }}>
              <h3
                className="tpl-heading"
                style={{ fontSize: "var(--fs-lg)", margin: 0 }}
              >
                Funcionalidades
              </h3>
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                {features.map((f, i) => (
                  <li
                    key={i}
                    className="tpl-subtext"
                    style={{ marginBottom: 6 }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <ChevronRight size={14} />
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {challenges.length > 0 && (
            <section style={{ marginBottom: 18 }}>
              <h3
                className="tpl-heading"
                style={{ fontSize: "var(--fs-lg)", margin: 0 }}
              >
                Retos & aprendizajes
              </h3>
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                {challenges.map((c, i) => (
                  <li
                    key={i}
                    className="tpl-subtext"
                    style={{ marginBottom: 6 }}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {gallery.length > 0 && (
            <section>
              <h3
                className="tpl-heading"
                style={{
                  fontSize: "var(--fs-lg)",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <ImageIcon size={16} /> Galería
              </h3>
              <div
                style={{
                  marginTop: 10,
                  display: "grid",
                  gap: 10,
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                }}
              >
                {gallery.map((src, i) => (
                  <a
                    key={i}
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tpl-surface"
                    style={{
                      borderRadius: 8,
                      overflow: "hidden",
                      display: "block",
                      textDecoration: "none",
                    }}
                  >
                    <img
                      src={src}
                      alt={`${p.title || "Proyecto"} - captura ${i + 1}`}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ display: "grid", gap: 12, alignContent: "start" }}>
          {/* Info rápida */}
          <div
            className="tpl-surface"
            style={{ padding: 14, borderRadius: 10 }}
          >
            <h4
              className="tpl-heading"
              style={{ margin: 0, fontSize: "var(--fs-base)" }}
            >
              Información
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "10px 0 0 0",
                display: "grid",
                gap: 8,
              }}
            >
              {(p as any).date && (
                <li
                  className="tpl-subtext"
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <CalendarDays size={16} /> {(p as any).date}
                </li>
              )}
              {(p as any).role && (
                <li
                  className="tpl-subtext"
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <UserRound size={16} /> {(p as any).role}
                </li>
              )}
              {(p as any).team && (
                <li
                  className="tpl-subtext"
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <Users size={16} /> Equipo: {(p as any).team}
                </li>
              )}
              {(p as any).scope && (
                <li
                  className="tpl-subtext"
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <Layers size={16} /> {(p as any).scope}
                </li>
              )}
            </ul>

            {/* Tags */}
            {tags.length > 0 && (
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                {tags.map((t, i) => (
                  <span
                    key={i}
                    className="tpl-chip"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Tag size={12} />
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tecnologías */}
          {p.technologies && (
            <div
              className="tpl-surface"
              style={{ padding: 14, borderRadius: 10 }}
            >
              <h4
                className="tpl-heading"
                style={{ margin: 0, fontSize: "var(--fs-base)" }}
              >
                Tecnologías
              </h4>
              <div style={{ marginTop: 10 }}>
                <TechList technologies={p.technologies} variant="minimal" />
              </div>
            </div>
          )}

          {/* Responsabilidades */}
          {responsibilities.length > 0 && (
            <div
              className="tpl-surface"
              style={{ padding: 14, borderRadius: 10 }}
            >
              <h4
                className="tpl-heading"
                style={{ margin: 0, fontSize: "var(--fs-base)" }}
              >
                Responsabilidades
              </h4>
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                {responsibilities.map((r, i) => (
                  <li
                    key={i}
                    className="tpl-subtext"
                    style={{ marginBottom: 6 }}
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links secundarios */}
          {(p.link || p.github) && (
            <div
              className="tpl-surface"
              style={{ padding: 14, borderRadius: 10, display: "grid", gap: 8 }}
            >
              {p.link && (
                <a
                  className="tpl-btn-outline"
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <ExternalLink size={16} />
                  Abrir demo
                </a>
              )}
              {p.github && (
                <a
                  className="tpl-btn-outline"
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Github size={16} />
                  Ver repositorio
                </a>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );

  if (asPage) {
    // como página embebida
    return (
      <div className="tpl-container" style={{ padding: "var(--sp-md)" }}>
        {Content}
      </div>
    );
  }

  // como modal
  // como modal
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflowY: "auto", // <- el overlay scrollea
        overscrollBehavior: "contain",
        padding: "24px 12px",
        zIndex: 60,
      }}
      aria-label="Overlay de proyecto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        {Content} {/* Content ya tiene width max y se centra */}
      </div>
    </div>
  );
}

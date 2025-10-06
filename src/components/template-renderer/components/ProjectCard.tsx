// src/components/template-renderer/components/ProjectCard.tsx
import React from "react";
import type { Project } from "../../../types/portfolio-types";
import { TechList } from "../../TechIcons";
import { Icons } from "../../portfolio-icons";
import { generateSlug } from "../../../utils/export-utils";

interface ProjectCardProps {
  project: Project;
  isSSR?: boolean;
  onOpenProject?: (project: Project) => void;
}

/**
 * Card de proyecto individual
 * Muestra imagen, título, descripción, tecnologías y botones de acción
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSSR = false,
  onOpenProject,
}) => {
  return (
    <article
      className="tpl-card"
      style={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Imagen del proyecto */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // Ratio 16:9
          background: "var(--card-media-bg, rgba(0,0,0,.05))",
          flex: "0 0 auto",
        }}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
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
            {project.title?.slice(0, 1) ?? "•"}
          </div>
        )}
      </div>

      {/* Contenido */}
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
          {project.title}
        </h3>

        {project.description && (
          <p
            className="tpl-subtext"
            style={{ fontSize: "var(--fs-base)", margin: 0 }}
          >
            {project.description}
          </p>
        )}

        {project.technologies && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <TechList
              technologies={project.technologies.split(",").slice(0, 4).join(",")}
              variant="minimal"
            />
          </div>
        )}

        {/* Botones de acción */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginTop: "auto",
          }}
        >
          {/* Botón de detalles */}
          {isSSR ? (
            <a
              href={`proyecto-${generateSlug(project.title)}.html`}
              className="tpl-btn-primary"
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
              <Icons.Code size={16} aria-hidden />
              <span>Ver detalles</span>
            </a>
          ) : (
            onOpenProject && (
              <button
                className="tpl-btn-primary"
                onClick={() => onOpenProject(project)}
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
            )
          )}

          {/* Botón Live */}
          {project.link && (
            <a
              className="tpl-btn-outline"
              href={project.link}
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

          {/* Botón GitHub */}
          {project.github && (
            <a
              className="tpl-btn-outline"
              href={project.github}
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
  );
};
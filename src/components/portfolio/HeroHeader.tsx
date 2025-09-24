// src/components/portfolio/HeroHeader.tsx
import React from "react";

import { Mail, Code2, Github, Linkedin, Globe } from "lucide-react";

type HeroHeaderProps = {
  name: string;
  subtitle?: string;
  email?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
  onProjectsClick?: () => void; // si prefieres controlar el scroll fuera
};

export default function HeroHeader({
  name,
  subtitle,
  email,
  socials,
  onProjectsClick,
}: HeroHeaderProps) {
  const handleProjects = (e: React.MouseEvent) => {
    if (onProjectsClick) {
      e.preventDefault();
      onProjectsClick();
      return;
    }
    // por defecto: scroll suave a #projects
    const el = document.getElementById("projects");
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-6 sm:px-8 py-16 sm:py-24">
        {/* Nombre */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-sm">
          {name}
        </h1>

        {/* Subtítulo */}
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg sm:text-xl opacity-90">
            {subtitle}
          </p>
        )}

        {/* Acciones */}
        <div className="mt-8 flex flex-wrap gap-4">
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md font-semibold shadow hover:shadow-md transition"
            >
              <Mail className="h-5 w-5" aria-hidden />
              <span>Contactar</span>
            </a>
          )}

          <a
            href="#projects"
            onClick={handleProjects}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md border font-semibold hover:bg-black/5 transition"
          >
            <Code2 className="h-5 w-5" aria-hidden />
            <span>Ver proyectos</span>
          </a>
        </div>

        {/* Redes */}
        {socials && (
          <div className="mt-6 flex flex-wrap gap-3">
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm hover:shadow transition"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" aria-hidden />
                <span>GitHub</span>
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm hover:shadow transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" aria-hidden />
                <span>LinkedIn</span>
              </a>
            )}
            {socials.website && (
              <a
                href={socials.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm hover:shadow transition"
                aria-label="Sitio web"
              >
                <Globe className="h-4 w-4" aria-hidden />
                <span>Web</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Separador inferior (no depende de color de fondo) */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-20"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,64 C240,128 480,0 720,32 C960,64 1200,176 1440,96 L1440,160 L0,160 Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}

// src/templates/advanced/helpers/section-presets.ts
import { Section, SectionType } from "../../../types/advanced-template-types";
import { createSection } from "./section-helpers";

/**
 * SECCIONES para layouts CON header
 * Incluye hero/header en la parte superior
 */
export const SECTIONS_WITH_HEADER: Section[] = [
  createSection("header", "hero", "Header", "header", 1),
  createSection("about", "about", "Sobre mí", "main", 2),
  createSection("projects", "projects", "Proyectos", "main", 3),
  createSection("skills", "skills", "Habilidades", "main", 4),
  createSection("experience", "experience", "Experiencia", "main", 5),
  createSection("contact", "contact", "Contacto", "footer", 6),
];

/**
 * SECCIONES para layouts SIN header
 * Comienza directamente con el contenido principal
 */
export const SECTIONS_NO_HEADER: Section[] = [
  createSection("about", "about", "Sobre mí", "main", 1),
  createSection("projects", "projects", "Proyectos", "main", 2),
  createSection("skills", "skills", "Habilidades", "main", 3),
  createSection("experience", "experience", "Experiencia", "main", 4),
  createSection("contact", "contact", "Contacto", "footer", 5),
];

/**
 * SECCIONES para sidebar izquierda
 * Información personal en sidebar, contenido principal en main
 */
export const SECTIONS_SIDEBAR_LEFT: Section[] = [
  createSection("about", "about", "Sobre mí", "sidebar-left", 1),
  createSection("contact", "contact", "Contacto", "sidebar-left", 2),
  createSection("projects", "projects", "Proyectos", "main", 3),
  createSection("skills", "skills", "Habilidades", "main", 4),
  createSection("experience", "experience", "Experiencia", "main", 5),
];

/**
 * Tipos de secciones disponibles para todos los templates
 */
export const AVAILABLE_SECTIONS: SectionType[] = [
  "hero",
  "about",
  "projects",
  "skills",
  "experience",
  "education",
  "testimonials",
  "contact",
];
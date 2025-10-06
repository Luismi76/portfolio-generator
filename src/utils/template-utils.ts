// src/utils/template-utils.ts
import type { Section as AdvSection, LayoutArea } from "../types/advanced-template-types";
import type { TemplateSection } from "../types/template-types";

/**
 * Normaliza el ID de una sección a un valor canónico
 * @param raw - ID sin procesar
 * @returns ID normalizado
 */
export const normalizeSectionId = (raw?: string): string => {
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

/**
 * Verifica si un valor representa "habilitado"
 * @param raw - Valor a verificar
 * @returns true si está habilitado
 */
export const isEnabled = (raw: unknown): boolean => {
  if (raw === false || raw === 0 || raw === null) return false;
  if (typeof raw === "string") {
    const s = raw.trim().toLowerCase();
    if (["false", "0", "no", "off", "disabled"].includes(s)) return false;
  }
  return true;
};

/**
 * Función de comparación para ordenar por propiedad order
 * @param a - Primer elemento
 * @param b - Segundo elemento
 * @returns Diferencia de order
 */
export const orderAsc = <T extends { order?: number }>(a: T, b: T) =>
  (a.order ?? 0) - (b.order ?? 0);

/**
 * Agrupa secciones avanzadas por área de layout
 * @param sections - Array de secciones avanzadas
 * @returns Objeto con secciones agrupadas por área
 */
export function groupSectionsByArea(sections: AdvSection[] | undefined) {
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

/**
 * Convierte secciones avanzadas a formato legacy TemplateSection
 * @param sections - Secciones en formato avanzado
 * @returns Array de secciones en formato legacy
 */
export function toTemplateSections(
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

/**
 * Valida si una URL es válida
 * @param url - URL a validar
 * @returns true si la URL es válida
 */
export const isValidUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};
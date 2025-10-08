// layout-builder/helpers.ts
import type { Section, LayoutArea } from "@/types/advanced-template-types";
import type { SectionWithPlacement, SectionPlacement } from "./types";

/**
 * Convierte un array de Section a SectionWithPlacement
 * agregando información sobre su estado de colocación
 */
export function addPlacement(sections: Section[]): SectionWithPlacement[] {
  return sections.map((s) => {
    const fullSection: Section = {
      id: s.id,
      name: s.name,
      type: s.type || "hero",
      icon: s.icon || "📄",
      area: s.area || "main",
      order: s.order || 0,
      enabled: s.enabled !== undefined ? s.enabled : true,
      config: s.config || { variant: "default", columns: 1 },
    };

    const placement: SectionPlacement =
      fullSection.enabled && fullSection.area !== "floating"
        ? "placed"
        : "unplaced";

    return {
      ...fullSection,
      placement,
    };
  });
}

/**
 * Convierte un array de SectionWithPlacement de vuelta a Section
 * removiendo la información de placement
 */
export function removePlacement(sections: SectionWithPlacement[]): Section[] {
  return sections.map(({ placement, ...rest }) => rest as Section);
}

/**
 * Mueve una sección a un área específica y posición
 * @param sections - Array de secciones
 * @param draggedId - ID de la sección a mover
 * @param targetArea - Área destino
 * @param insertIndex - Índice donde insertar (null = al final)
 */
export function moveSection(
  sections: SectionWithPlacement[],
  draggedId: string,
  targetArea: LayoutArea,
  insertIndex: number | null
): SectionWithPlacement[] {
  // Encontrar la sección arrastrada
  const dragged = sections.find((s) => s.id === draggedId);
  if (!dragged) return sections;

  // Remover la sección arrastrada del array
  const withoutDragged = sections.filter((s) => s.id !== draggedId);
  
  // Obtener secciones del área objetivo ordenadas
  const targetList = withoutDragged
    .filter((s) => s.area === targetArea)
    .sort((a, b) => a.order - b.order);

  // Calcular índice de inserción
  const index =
    insertIndex == null
      ? targetList.length
      : Math.max(0, Math.min(insertIndex, targetList.length));

  // Actualizar la sección arrastrada
  const draggedUpdated: SectionWithPlacement = {
    ...dragged,
    area: targetArea,
    enabled: true,
    placement: "placed",
    order: index + 1,
  };

  // Obtener otras secciones (no del área objetivo)
  const others = withoutDragged.filter((s) => s.area !== targetArea);
  
  // Crear nueva lista del área objetivo
  const newTarget = [...targetList];
  newTarget.splice(index, 0, draggedUpdated);

  // Reasignar orders a todos los elementos del área target
  const reorderedTarget = newTarget.map((s, i) => ({ ...s, order: i + 1 }));

  return [...others, ...reorderedTarget];
}

/**
 * Agrupa secciones por área
 */
export function groupSectionsByArea(
  sections: SectionWithPlacement[]
): Record<LayoutArea, SectionWithPlacement[]> {
  return sections.reduce((acc, section) => {
    if (!acc[section.area]) acc[section.area] = [];
    acc[section.area].push(section);
    return acc;
  }, {} as Record<LayoutArea, SectionWithPlacement[]>);
}

/**
 * Calcula el índice ajustado cuando se mueve dentro de la misma área
 */
export function calculateAdjustedIndex(
  sections: SectionWithPlacement[],
  draggedId: string,
  targetArea: LayoutArea,
  dragOverIndex: number | null
): number | null {
  if (dragOverIndex === null) return null;

  const areaSections = sections
    .filter((s) => s.area === targetArea)
    .sort((a, b) => a.order - b.order);

  const currentIndex = areaSections.findIndex((s) => s.id === draggedId);

  // Si movemos hacia abajo en la misma área, restar 1 al índice
  if (currentIndex !== -1 && currentIndex < dragOverIndex) {
    return dragOverIndex - 1;
  }

  return dragOverIndex;
}
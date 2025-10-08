// layout-builder/index.ts
/**
 * Punto de entrada principal del módulo Layout Builder
 * Exporta todos los componentes, tipos y utilidades necesarias
 */

// Componente principal
export { AdvancedLayoutBuilder } from './AdvancedLayoutBuilder';

// Componentes auxiliares
export { AvailableSectionCard } from './AvailableSectionCard';
export { AreaSectionRow } from './AreaSectionRow';
export { DropArea } from './DropArea';

// Tipos
export type {
  SectionPlacement,
  SectionWithPlacement,
  DragConfig,
  AvailableSectionCardProps,
  AreaSectionRowProps,
  DropAreaProps,
  AdvancedLayoutBuilderProps,
} from './types';

// Helpers
export {
  addPlacement,
  removePlacement,
  moveSection,
  groupSectionsByArea,
  calculateAdjustedIndex,
} from './helpers';

// Constantes
export {
  DEFAULT_AREAS,
  AREA_NAMES,
  AREA_ICONS,
  LAYOUT_AREAS,
  GRID_LAYOUT_STYLE,
} from './constants';
// src/components/TemplateRenderer.tsx - VERSIÓN REFACTORIZADA FINAL
import React from "react";
import type { PortfolioData, Project } from "../types/portfolio-types";
import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from "../types/advanced-template-types";
import { TemplateTheme } from "./TemplateTheme";
import ProjectDetailsModal from "./portfolio/ProjectDetailsModal";
import {
  useTemplateLayout,
  useTemplateStyles,
  useSectionGroups,
  useProjectModal,
} from "./template-renderer/hooks";
import { SectionRenderer } from "./template-renderer/components";

type TemplateRendererProps = {
  data: PortfolioData;
  onOpenProject?: (p: Project) => void;
  template?: AdvancedTemplate;
  config?: AdvancedTemplateConfig;
  isSSR?: boolean;
};

/**
 * Componente principal que renderiza el portfolio completo
 * Orquesta el layout, estilos y renderizado de todas las secciones
 * 
 * @version 2.0 - Refactorizado para mejor mantenibilidad
 */
export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  data,
  onOpenProject,
  template: effectiveTemplate,
  config,
  isSSR = false,
}) => {
  // Gestión del modal de proyectos
  const { selected, openProject, closeProject } = useProjectModal();

  // Agrupación de secciones por área
  const { byArea, flatSections, advancedSections } = useSectionGroups(
    config,
    effectiveTemplate
  );

  // Estilos y tema
  const { cssVars, themeTemplate } = useTemplateStyles(
    effectiveTemplate,
    config
  );

  // Configuración del layout
  const { gridTemplateColumns, leftEnabled, rightEnabled } = useTemplateLayout(
    effectiveTemplate,
    byArea
  );

  return (
    <TemplateTheme template={themeTemplate}>
      <div style={cssVars as React.CSSProperties}>
        {/* Header */}
        <SectionRenderer
          area="header"
          sections={byArea.header}
          data={data}
          config={config}
          template={effectiveTemplate}
          isSSR={isSSR}
          onOpenProject={onOpenProject || openProject}
          flatSections={flatSections}
          advancedSections={advancedSections}
        />

        {/* Layout principal con sidebars opcionales */}
        <div
          className="tpl-container"
          style={{
            display: "grid",
            gap: "var(--sp-md)",
            gridTemplateColumns,
            alignItems: "start",
          }}
        >
          {/* Sidebar izquierdo */}
          {leftEnabled && (
            <aside style={{ display: "grid", gap: "var(--sp-md)" }}>
              <SectionRenderer
                area="sidebar-left"
                sections={byArea["sidebar-left"]}
                data={data}
                config={config}
                template={effectiveTemplate}
                isSSR={isSSR}
                onOpenProject={onOpenProject || openProject}
                flatSections={flatSections}
                advancedSections={advancedSections}
              />
            </aside>
          )}

          {/* Contenido principal */}
          <main style={{ display: "grid", gap: "var(--sp-lg)" }}>
            <SectionRenderer
              area="main"
              sections={byArea.main}
              data={data}
              config={config}
              template={effectiveTemplate}
              isSSR={isSSR}
              onOpenProject={onOpenProject || openProject}
              flatSections={flatSections}
              advancedSections={advancedSections}
            />
          </main>

          {/* Sidebar derecho */}
          {rightEnabled && (
            <aside style={{ display: "grid", gap: "var(--sp-md)" }}>
              <SectionRenderer
                area="sidebar-right"
                sections={byArea["sidebar-right"]}
                data={data}
                config={config}
                template={effectiveTemplate}
                isSSR={isSSR}
                onOpenProject={onOpenProject || openProject}
                flatSections={flatSections}
                advancedSections={advancedSections}
              />
            </aside>
          )}
        </div>

        {/* Footer */}
        {byArea.footer.length > 0 && (
          <footer
            style={{
              background: "var(--color-primary)",
              color: "white",
            }}
          >
            <SectionRenderer
              area="footer"
              sections={byArea.footer}
              data={data}
              config={config}
              template={effectiveTemplate}
              isSSR={isSSR}
              onOpenProject={onOpenProject || openProject}
              flatSections={flatSections}
              advancedSections={advancedSections}
            />
          </footer>
        )}

        {/* Modal de detalles de proyecto (solo en modo no-SSR) */}
        {!isSSR && (
          <ProjectDetailsModal
            project={selected}
            onClose={closeProject}
          />
        )}
      </div>
    </TemplateTheme>
  );
};
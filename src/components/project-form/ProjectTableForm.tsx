// src/components/project-form/ProjectTableForm.tsx
import React, { useState } from "react";
import { Project, ProjectTableFormProps } from "../../types/portfolio-types";
import { Section } from "../Section";
import { Icons } from "../portfolio-icons";
import { ProjectTable } from "./ProjectTable";
import { ProjectModal } from "./ProjectModal";

/**
 * Componente principal para gestionar proyectos
 * Orquesta la tabla y el modal de edición
 */
export const ProjectTableForm: React.FC<ProjectTableFormProps> = ({
  projects,
  onUpdate,
  onAdd,
  onRemove,
}) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    project?: Project;
    index?: number;
  }>({ isOpen: false });

  const handleCreateNew = () => {
    onAdd();
    const newIndex = projects.length;
    setModalState({
      isOpen: true,
      index: newIndex,
      project: projects[newIndex],
    });
  };

  const handleEdit = (index: number) => {
    setModalState({
      isOpen: true,
      project: projects[index],
      index,
    });
  };

  const handleSave = (index: number | undefined, projectData: Project) => {
    if (index !== undefined) {
      Object.keys(projectData).forEach((key) => {
        onUpdate(
          index,
          key as keyof Project,
          projectData[key as keyof Project] as string
        );
      });
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false });
  };

  return (
    <>
      <Section
        title="Proyectos"
        description="Gestiona tus proyectos con el sistema de URLs manuales"
        icon={Icons.Code}
        showAddButton={true}
        onAdd={handleCreateNew}
        addButtonText="Nuevo Proyecto"
      >
        <ProjectTable
          projects={projects}
          onEdit={handleEdit}
          onRemove={onRemove}
          onCreateNew={handleCreateNew}
        />

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Icons.Info
              size={16}
              className="text-blue-600 mt-0.5 flex-shrink-0"
            />
            <div className="text-sm text-blue-800">
              <strong>Sistema simplificado:</strong>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>Solo URLs manuales - funciona siempre</li>
                <li>Enlaces directos a servicios de imágenes recomendados</li>
                <li>Sin problemas de CORS ni APIs bloqueadas</li>
                <li>Compatible con cualquier servicio de hosting</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <ProjectModal
        project={modalState.project}
        index={modalState.index}
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSave={handleSave}
      />
    </>
  );
};

export default ProjectTableForm;
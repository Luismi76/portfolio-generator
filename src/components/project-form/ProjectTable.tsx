// src/components/project-form/ProjectTable.tsx
import React from "react";
import { Project } from "../../types/portfolio-types";
import { Icons } from "../portfolio-icons";
import { getValidImageCount } from "./utils/imageHelpers";

interface ProjectTableProps {
  projects: Project[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  onCreateNew: () => void;
}

/**
 * Tabla que muestra la lista de proyectos con acciones
 */
export const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onEdit,
  onRemove,
  onCreateNew,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">
              Proyecto
            </th>
            <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">
              Tecnologías
            </th>
            <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">
              Estado
            </th>
            <th className="border border-gray-200 p-3 text-center font-medium text-gray-700">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="border border-gray-200 p-8 text-center text-gray-500"
              >
                <Icons.Code size={32} className="mx-auto mb-2 text-gray-300" />
                <p>No hay proyectos aún</p>
                <button
                  onClick={onCreateNew}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Crear tu primer proyecto
                </button>
              </td>
            </tr>
          ) : (
            projects.map((project, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-200 p-3">
                  <div>
                    <div className="font-medium text-gray-900">
                      {project.title || "Sin título"}
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {project.description || "Sin descripción"}
                    </div>
                  </div>
                </td>

                <td className="border border-gray-200 p-3">
                  <div className="flex flex-wrap gap-1">
                    {project.technologies ? (
                      project.technologies
                        .split(",")
                        .slice(0, 3)
                        .map((tech: string, techIndex: number) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                          >
                            {tech.trim()}
                          </span>
                        ))
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Sin tecnologías
                      </span>
                    )}
                    {project.technologies &&
                      project.technologies.split(",").length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{project.technologies.split(",").length - 3}
                        </span>
                      )}
                  </div>
                </td>

                <td className="border border-gray-200 p-3">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const validImageCount = getValidImageCount(
                        project.images || ""
                      );
                      const hasMainImage =
                        project.image &&
                        (project.image.startsWith("http") ||
                          project.image.startsWith("https"));

                      return (
                        <>
                          {(validImageCount > 0 || hasMainImage) && (
                            <div className="flex items-center gap-1">
                              <Icons.Image
                                size={16}
                                className="text-green-600"
                              />
                              <span className="text-xs text-gray-600">
                                {hasMainImage
                                  ? validImageCount + 1
                                  : validImageCount}{" "}
                                img
                                {(hasMainImage
                                  ? validImageCount + 1
                                  : validImageCount) !== 1
                                  ? "s"
                                  : ""}
                              </span>
                            </div>
                          )}
                          {project.link && (
                            <div title="Tiene enlace del proyecto">
                              <Icons.Link size={16} className="text-blue-600" />
                            </div>
                          )}
                          {project.github && (
                            <div title="Tiene repositorio GitHub">
                              <Icons.Github
                                size={16}
                                className="text-gray-700"
                              />
                            </div>
                          )}
                          {validImageCount === 0 &&
                            !hasMainImage &&
                            !project.link &&
                            !project.github && (
                              <span className="text-gray-400 text-sm">
                                Incompleto
                              </span>
                            )}
                        </>
                      );
                    })()}
                  </div>
                </td>

                <td className="border border-gray-200 p-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(index)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Editar proyecto"
                    >
                      <Icons.Settings size={16} />
                    </button>
                    {projects.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm("¿Eliminar este proyecto?")) {
                            onRemove(index);
                          }
                        }}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Eliminar proyecto"
                      >
                        <Icons.Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
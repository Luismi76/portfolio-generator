// src/components/project-form/ProjectModal.tsx
import React, { useState, useEffect } from "react";
import { Project } from "@/types/portfolio-types";
import { Icons } from "../portfolio-icons";
import { generateSlug } from "@/utils/export-utils";
import { MainImageUploader } from "./uploaders/MainImageUploader";
import { MultiImageUploader } from "./uploaders/MultiImageUploader";

interface ProjectModalProps {
  project?: Project;
  index?: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (index: number | undefined, projectData: Project) => void;
}

const emptyProject: Project = {
  title: "",
  description: "",
  detailedDescription: "",
  technologies: "",
  link: "",
  github: "",
  image: "",
  images: "",
  videos: "",
  instructions: "",
  features: "",
  challenges: "",
  slug: "",
  mainImageIndex: 0,
};

/**
 * Modal para crear/editar proyectos
 */
export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  index,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Project>(emptyProject);

  useEffect(() => {
    if (isOpen) {
      setFormData(project || emptyProject);
    }
  }, [project, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("El título y la descripción son obligatorios");
      return;
    }

    const updatedProject = {
      ...formData,
      slug: generateSlug(formData.title),
    };

    onSave(index, updatedProject);
    onClose();
  };

  const updateField = (field: keyof Project, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">
              {index !== undefined ? "Editar Proyecto" : "Nuevo Proyecto"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <Icons.X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Título y Tecnologías */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del proyecto *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tecnologías
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => updateField("technologies", e.target.value)}
                  placeholder="React, TypeScript, Node.js"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Descripción breve */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción breve *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Descripción detallada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción detallada
              </label>
              <textarea
                value={formData.detailedDescription || ""}
                onChange={(e) =>
                  updateField("detailedDescription", e.target.value)
                }
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Imagen principal */}
            <MainImageUploader
              imageUrl={formData.image}
              onChange={(url) => updateField("image", url)}
            />

            {/* Galería de imágenes */}
            <MultiImageUploader
              imagesString={formData.images || ""}
              mainImageIndex={Number(formData.mainImageIndex) || 0}
              onImagesChange={(images) => updateField("images", images)}
              onMainImageChange={(index, url) => {
                updateField("mainImageIndex", index);
                updateField("image", url);
              }}
            />

            {/* Características */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Características principales
              </label>
              <input
                type="text"
                value={formData.features || ""}
                onChange={(e) => updateField("features", e.target.value)}
                placeholder="Responsivo, API REST, Dashboard"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Enlaces */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enlace del proyecto
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => updateField("link", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repositorio GitHub
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => updateField("github", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Campos avanzados */}
            <details className="border border-gray-200 rounded-lg">
              <summary className="p-3 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
                Campos avanzados (instrucciones, desafíos, etc.)
              </summary>
              <div className="p-3 border-t space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instrucciones de uso
                  </label>
                  <textarea
                    value={formData.instructions || ""}
                    onChange={(e) =>
                      updateField("instructions", e.target.value)
                    }
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desafíos técnicos
                  </label>
                  <textarea
                    value={formData.challenges || ""}
                    onChange={(e) => updateField("challenges", e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </details>
          </div>

          {/* Footer con botones */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {index !== undefined ? "Actualizar" : "Crear"} Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
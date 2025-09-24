// ProjectTableForm.tsx - Versión corregida con solo URLs manuales
import React, { useState, useEffect } from "react";
import { Project } from "../types/portfolio-types";
import { Icons } from "./portfolio-icons";
import { Section } from "./Section";
import { generateSlug } from "./portfolio-export";

interface ProjectTableFormProps {
  projects: Project[];
  onUpdate: (index: number, field: keyof Project, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

interface ProjectModalProps {
  project?: Project;
  index?: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (index: number | undefined, projectData: Project) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  index,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Project>({
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
  });

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setFormData(project);
      } else {
        setFormData({
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
        });
      }
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

  const updateField = (field: keyof Project, value: string) => {
    setFormData((prev: Project) => ({ ...prev, [field]: value }));
  };

  // Componente para imagen principal
  const MainImageUploader = () => {
    const [error, setError] = useState<string>('');

    const validateImageUrl = (url: string): boolean => {
      if (!url.trim()) return true;
      
      try {
        new URL(url);
        return url.startsWith('http://') || url.startsWith('https://');
      } catch {
        return false;
      }
    };

    const handleUrlChange = (url: string) => {
      setError('');
      
      if (url && !validateImageUrl(url)) {
        setError('URL inválida. Debe empezar con http:// o https://');
      }
      
      updateField('image', url);
    };

    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Imagen principal
        </label>
        
        <input
          type="url"
          placeholder="https://ejemplo.com/imagen.png"
          value={formData.image || ""}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded flex items-center gap-2">
            <Icons.AlertCircle size={16} />
            {error}
            <button onClick={() => setError('')} className="ml-auto">
              <Icons.X size={14} />
            </button>
          </div>
        )}

        {formData.image && (
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
            <img
              src={formData.image}
              alt="Preview"
              className="w-16 h-12 object-cover rounded"
              onError={() => {
                setError('No se pudo cargar la imagen desde esta URL');
              }}
              onLoad={() => setError('')}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-green-600 mb-1">Imagen cargada</div>
              <button
                type="button"
                onClick={() => updateField("image", "")}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
          <strong>Subir a:</strong> <a href="https://minio.lmsc.es" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Tu MinIO</a>, <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Imgur</a>, o <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ImgBB</a>
        </div>
      </div>
    );
  };

  // Componente para múltiples imágenes
  const MultiImageUploader = () => {
    const [error, setError] = useState<string>('');
    const [urlInput, setUrlInput] = useState<string>('');

    const getImagesArray = (): string[] => {
      if (!formData.images || formData.images.trim() === '') return [];
      
      return formData.images
        .split(',')
        .map(img => img.trim())
        .filter(img => img.length > 0 && (img.startsWith('http') || img.startsWith('https')));
    };

    const validateImageUrl = (url: string): boolean => {
      if (!url.trim()) return false;
      
      try {
        new URL(url);
        return url.startsWith('http://') || url.startsWith('https://');
      } catch {
        return false;
      }
    };

    const addImageByUrl = () => {
      if (!urlInput.trim()) {
        setError('Introduce una URL válida');
        return;
      }
      
      if (!validateImageUrl(urlInput)) {
        setError('URL inválida. Debe empezar con http:// o https://');
        return;
      }
      
      const currentImages = getImagesArray();
      if (currentImages.includes(urlInput.trim())) {
        setError('Esta imagen ya está agregada');
        return;
      }
      
      const newImages = [...currentImages, urlInput.trim()];
      updateField('images', newImages.join(','));
      setUrlInput('');
      setError('');

      // Si es la primera imagen, establecerla como principal
      if (currentImages.length === 0) {
        updateField('mainImageIndex', '0');
        updateField('image', urlInput.trim());
      }
    };

    const removeImage = (imageIndex: number) => {
      const currentImages = getImagesArray();
      const newImages = currentImages.filter((_, i) => i !== imageIndex);
      updateField('images', newImages.join(','));

      // Ajustar índice principal
      const currentMainIndex = Number(formData.mainImageIndex) || 0;
      
      if (newImages.length === 0) {
        updateField('mainImageIndex', '0');
        updateField('image', '');
      } else if (imageIndex === currentMainIndex) {
        updateField('mainImageIndex', '0');
        updateField('image', newImages[0]);
      } else if (imageIndex < currentMainIndex) {
        const newMainIndex = currentMainIndex - 1;
        updateField('mainImageIndex', newMainIndex.toString());
      }
    };

    const setMainImage = (imageIndex: number) => {
      const images = getImagesArray();
      if (imageIndex < 0 || imageIndex >= images.length) return;

      updateField('mainImageIndex', imageIndex.toString());
      updateField('image', images[imageIndex]);
    };

    const images = getImagesArray();
    const mainIndex = images.length > 0 ? Math.min(Number(formData.mainImageIndex) || 0, images.length - 1) : 0;

    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Galería de imágenes adicionales
        </label>

        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://ejemplo.com/imagen.png"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addImageByUrl();
              }
            }}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addImageByUrl}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Icons.Plus size={16} />
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded flex items-center gap-2">
            <Icons.AlertCircle size={16} />
            {error}
            <button onClick={() => setError('')} className="ml-auto">
              <Icons.X size={14} />
            </button>
          </div>
        )}

        {images.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                Galería ({images.length} imágenes)
              </h4>
              <div className="text-xs text-gray-500">
                Click para marcar como principal
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((img, imgIndex) => (
                <div
                  key={imgIndex}
                  className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer ${
                    imgIndex === mainIndex
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setMainImage(imgIndex)}
                >
                  <img
                    src={img}
                    alt={`Imagen ${imgIndex + 1}`}
                    className="w-full h-20 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />

                  {imgIndex === mainIndex && (
                    <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                      Principal
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(imgIndex);
                    }}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Icons.X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <strong>Subir a:</strong> <a href="https://minio.lmsc.es" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Tu MinIO</a>, <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Imgur</a>, o <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ImgBB</a> y copia la URL
        </div>
      </div>
    );
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción detallada
              </label>
              <textarea
                value={formData.detailedDescription || ""}
                onChange={(e) => updateField("detailedDescription", e.target.value)}
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <MainImageUploader />

            <MultiImageUploader />

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
                    onChange={(e) => updateField("instructions", e.target.value)}
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

  const getValidImageCount = (imagesString: string): number => {
    if (!imagesString || imagesString.trim() === '') return 0;
    
    return imagesString
      .split(',')
      .map(img => img.trim())
      .filter(img => 
        img.length > 0 && 
        (img.startsWith('http') || img.startsWith('https'))
      ).length;
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
                      onClick={handleCreateNew}
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
                          const validImageCount = getValidImageCount(project.images || '');
                          const hasMainImage = project.image && 
                            (project.image.startsWith('http') || project.image.startsWith('https'));

                          return (
                            <>
                              {(validImageCount > 0 || hasMainImage) && (
                                <div className="flex items-center gap-1">
                                  <Icons.Image size={16} className="text-green-600" />
                                  <span className="text-xs text-gray-600">
                                    {hasMainImage ? validImageCount + 1 : validImageCount} img
                                    {(hasMainImage ? validImageCount + 1 : validImageCount) !== 1 ? 's' : ''}
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
                                  <Icons.Github size={16} className="text-gray-700" />
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
                          onClick={() => handleEdit(index)}
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

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Icons.Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
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

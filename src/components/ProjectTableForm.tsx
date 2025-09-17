// ProjectTableForm.tsx
import React, { useState, useEffect } from "react";
import { Project } from "../types/portfolio-types";
import { Icons } from "./portfolio-icons";
import { Section } from "./Section";
import { useImageUpload } from "./portfolio-hooks";
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

// Modal para crear/editar proyectos
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

  // Actualizar formData cuando cambie el project prop
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

  // Componente interno para gestionar múltiples imágenes
  const MultiImageUploader = () => {
    // Función para reparar URLs base64 malformadas
    const repairDataUrl = (url: string): string | null => {
      if (!url || url.trim().length === 0) return null;

      const trimmedUrl = url.trim();

      // Si ya es una URL data válida, devolverla
      if (
        trimmedUrl.startsWith("data:image/") &&
        trimmedUrl.includes("base64,")
      ) {
        return trimmedUrl;
      }

      // Si es solo base64 sin prefijo, intentar repararlo
      if (!trimmedUrl.startsWith("data:") && !trimmedUrl.startsWith("http")) {
        // Verificar si parece base64
        const base64Regex = /^[A-Za-z0-9+/]+=*$/;
        if (
          base64Regex.test(trimmedUrl.substring(0, 100)) &&
          trimmedUrl.length > 100
        ) {
          // Detectar tipo de imagen por los primeros caracteres
          let mimeType = "image/jpeg"; // Por defecto JPEG

          if (trimmedUrl.startsWith("iVBOR")) {
            mimeType = "image/png";
          } else if (trimmedUrl.startsWith("R0lGOD")) {
            mimeType = "image/gif";
          } else if (trimmedUrl.startsWith("/9j/")) {
            mimeType = "image/jpeg";
          }

          return `data:${mimeType};base64,${trimmedUrl}`;
        }
      }

      return null;
    };

    // Función mejorada para validar URLs data
    const isValidDataUrl = (url: string): boolean => {
      if (!url.startsWith("data:")) return false;

      // Verificar formato básico: data:[mediatype][;base64],data
      const parts = url.split(",");
      if (parts.length !== 2) return false;

      const header = parts[0];
      const data = parts[1];

      // Verificar que tiene el header correcto
      if (!header.includes("base64") || !header.includes("image/"))
        return false;

      // Verificar que tiene datos base64 válidos (al menos 100 caracteres para una imagen mínima)
      if (data.length < 100) return false;

      // Verificar caracteres base64 válidos
      const base64Regex = /^[A-Za-z0-9+/]+=*$/;
      return base64Regex.test(data);
    };

    // Función mejorada para validar URLs HTTP
    const isValidHttpUrl = (url: string): boolean => {
      try {
        const urlObj = new URL(url);
        return urlObj.protocol === "http:" || urlObj.protocol === "https:";
      } catch {
        return false;
      }
    };

    // Obtener array de imágenes - VERSION MEJORADA CON REPARACIÓN
    const getImagesArray = (): string[] => {
      // Si no hay campo images o está vacío, devolver array vacío
      if (
        !formData.images ||
        formData.images.trim() === "" ||
        formData.images === "undefined" ||
        formData.images === "null"
      ) {
        return [];
      }

      // Procesar el string
      const processed = formData.images
        .split(",")
        .map((img: string) => img.trim())
        .map((img: string) => {
          // Intentar reparar URLs malformadas
          if (
            !img.startsWith("data:") &&
            !img.startsWith("http") &&
            img.length > 50
          ) {
            const repaired = repairDataUrl(img);
            if (repaired) {
              console.log("URL reparada:", img.substring(0, 30) + "...");
              return repaired;
            }
          }
          return img;
        })
        .filter((img: string) => {
          // Filtrar strings vacíos o inválidos
          if (
            img.length === 0 ||
            img === "" ||
            img === "undefined" ||
            img === "null"
          ) {
            return false;
          }

          // Validar URLs data
          if (img.startsWith("data:")) {
            const isValid = isValidDataUrl(img);
            if (!isValid) {
              console.warn(
                "URL data inválida después de reparación:",
                img.substring(0, 50) + "..."
              );
            }
            return isValid;
          }

          // Validar URLs HTTP
          if (img.startsWith("http")) {
            const isValid = isValidHttpUrl(img);
            if (!isValid) {
              console.warn("URL HTTP inválida:", img);
            }
            return isValid;
          }

          // Rechazar cualquier otro tipo de URL
          console.warn("Tipo de URL no soportado:", img.substring(0, 50));
          return false;
        });

      console.log(
        "Imágenes procesadas:",
        processed.length,
        processed.map((img) =>
          img.startsWith("data:") ? `DATA_URL (${img.length} chars)` : img
        )
      );

      return processed;
    };

    // Agregar nueva imagen con validación y reparación mejorada
    const addImage = (imageUrl: string) => {
      if (!imageUrl || imageUrl.trim() === "") {
        console.warn("URL de imagen vacía");
        return;
      }

      const trimmedUrl = imageUrl.trim();
      let finalUrl = trimmedUrl;

      // Intentar reparar la URL si es necesario
      if (!trimmedUrl.startsWith("data:") && !trimmedUrl.startsWith("http")) {
        const repaired = repairDataUrl(trimmedUrl);
        if (repaired) {
          finalUrl = repaired;
          console.log("URL reparada automáticamente");
        } else {
          console.error(
            "No se pudo reparar la URL:",
            trimmedUrl.substring(0, 50)
          );
          alert(
            "La URL de la imagen no es válida y no se pudo reparar automáticamente."
          );
          return;
        }
      }

      // Validar la URL final
      let isValid = false;
      if (finalUrl.startsWith("data:")) {
        isValid = isValidDataUrl(finalUrl);
      } else if (finalUrl.startsWith("http")) {
        isValid = isValidHttpUrl(finalUrl);
      }

      if (!isValid) {
        console.error(
          "URL de imagen inválida después de validación:",
          finalUrl.substring(0, 100)
        );
        alert("La URL de la imagen no es válida. Verifica el formato.");
        return;
      }

      const currentImages = getImagesArray();

      // Verificar duplicados
      if (currentImages.includes(finalUrl)) {
        alert("Esta imagen ya está agregada.");
        return;
      }

      const newImages = [...currentImages, finalUrl];
      updateField("images", newImages.join(","));

      // Si es la primera imagen, establecerla como principal
      if (currentImages.length === 0) {
        updateField("mainImageIndex", "0");
        updateField("image", finalUrl);
      }

      console.log("Imagen agregada exitosamente");
    };

    // Eliminar imagen (sin cambios significativos)
    const removeImage = (imgIndex: number) => {
      const currentImages = getImagesArray();
      if (imgIndex < 0 || imgIndex >= currentImages.length) return;

      const newImages = currentImages.filter((_, i) => i !== imgIndex);
      updateField("images", newImages.join(","));

      // Ajustar índice principal
      const currentMainIndex = Number(formData.mainImageIndex) || 0;

      if (newImages.length === 0) {
        // No quedan imágenes
        updateField("mainImageIndex", "0");
        updateField("image", "");
      } else if (imgIndex === currentMainIndex) {
        // Eliminamos la imagen principal, usar la primera
        updateField("mainImageIndex", "0");
        updateField("image", newImages[0]);
      } else if (imgIndex < currentMainIndex) {
        // Eliminamos una imagen antes de la principal
        const newMainIndex = currentMainIndex - 1;
        updateField("mainImageIndex", newMainIndex.toString());
      }
    };

    // Establecer imagen principal (sin cambios)
    const setMainImage = (imgIndex: number) => {
      const images = getImagesArray();
      if (imgIndex < 0 || imgIndex >= images.length) return;

      updateField("mainImageIndex", imgIndex.toString());
      updateField("image", images[imgIndex]);
    };

    // Upload de archivo con validación mejorada
    const { uploadImage, error, clearError } = useImageUpload(
      (base64) => {
        // Validar el base64 antes de agregarlo
        if (isValidDataUrl(base64)) {
          addImage(base64);
        } else {
          console.error("Base64 generado inválido");
          alert("Error al procesar la imagen. Intenta con otro archivo.");
        }
      },
      { maxSize: 5 * 1024 * 1024 }
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Validar tipo de archivo
        if (!file.type.startsWith("image/")) {
          alert("Por favor selecciona un archivo de imagen válido.");
          e.target.value = "";
          return;
        }

        // Validar tamaño (5MB máximo)
        if (file.size > 5 * 1024 * 1024) {
          alert("La imagen es muy grande. Máximo 5MB.");
          e.target.value = "";
          return;
        }

        uploadImage(file);
        e.target.value = "";
      }
    };

    const handleUrlAdd = (url: string) => {
      if (url.trim()) {
        addImage(url.trim());
      }
    };

    const images = getImagesArray();
    const mainIndex =
      images.length > 0
        ? Math.min(Number(formData.mainImageIndex) || 0, images.length - 1)
        : 0;

    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Imágenes del proyecto
        </label>

        {/* Controles para agregar imágenes */}
        <div className="space-y-3">
          {/* Agregar por URL */}
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://ejemplo.com/imagen.png"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const target = e.target as HTMLInputElement;
                  if (target.value.trim()) {
                    handleUrlAdd(target.value.trim());
                    target.value = "";
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                const input = (
                  e.target as HTMLElement
                ).parentElement?.querySelector("input") as HTMLInputElement;
                if (input && input.value.trim()) {
                  handleUrlAdd(input.value.trim());
                  input.value = "";
                }
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Icons.Plus size={16} />
            </button>
          </div>

          {/* Upload de archivo */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="multi-image-upload"
            />
            <label htmlFor="multi-image-upload" className="cursor-pointer">
              <Icons.Image size={24} className="mx-auto text-gray-400 mb-2" />
              <div className="text-sm text-gray-600">
                Subir imagen desde archivo (máx. 5MB)
              </div>
            </label>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm flex items-center gap-2">
            <Icons.AlertCircle size={16} />
            {error}
            <button onClick={clearError} className="ml-auto">
              <Icons.X size={14} />
            </button>
          </div>
        )}

        {/* DEBUG - Información mejorada del estado */}
        <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
          <strong>DEBUG:</strong>
          <div>Raw images: "{formData.images || "VACÍO"}"</div>
          <div>Valid images: {getImagesArray().length}</div>
          <div>Main index: {formData.mainImageIndex || 0}</div>
          <div>
            Main image URL:{" "}
            {formData.image
              ? formData.image.startsWith("data:")
                ? "DATA_URL"
                : formData.image
              : "NONE"}
          </div>
        </div>

        {/* Galería de imágenes - Solo mostrar si hay imágenes válidas */}
        {images.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                Galería ({images.length} imágenes)
              </h4>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Icons.Info size={12} />
                Click en una imagen para marcarla como principal
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((img, imgIndex) => (
                <div
                  key={imgIndex}
                  className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer ${
                    imgIndex === mainIndex
                      ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setMainImage(imgIndex)}
                >
                  <img
                    src={img}
                    alt={`Imagen ${imgIndex + 1}`}
                    className="w-full h-24 object-cover"
                    onError={(e) => {
                      console.error(
                        "Error cargando imagen:",
                        img.substring(0, 100)
                      );
                      // Marcar la imagen como inválida visualmente
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";

                      // Mostrar mensaje de error en lugar de la imagen
                      const container = target.parentElement;
                      if (
                        container &&
                        !container.querySelector(".error-message")
                      ) {
                        const errorDiv = document.createElement("div");
                        errorDiv.className =
                          "error-message flex items-center justify-center h-24 text-red-500 text-xs";
                        errorDiv.textContent = "Error al cargar imagen";
                        container.appendChild(errorDiv);
                      }
                    }}
                    onLoad={() => {
                      console.log("Imagen cargada correctamente:", imgIndex);
                    }}
                  />

                  {/* Badge de imagen principal */}
                  {imgIndex === mainIndex && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium shadow-sm">
                      Principal
                    </div>
                  )}

                  {/* Botón eliminar */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(imgIndex);
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
                    title="Eliminar imagen"
                  >
                    <Icons.X size={14} />
                  </button>

                  {/* Overlay de información */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-white text-xs font-medium">
                        {imgIndex === mainIndex
                          ? "Imagen Principal"
                          : "Click para hacer principal"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header del modal */}
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
            {/* Información básica */}
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

            {/* Múltiples imágenes */}
            <MultiImageUploader />

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

            {/* Campos avanzados en acordeón */}
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

          {/* Footer del modal */}
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

// Componente principal de tabla
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
        description="Gestiona tus proyectos de forma compacta"
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
                    <Icons.Code
                      size={32}
                      className="mx-auto mb-2 text-gray-300"
                    />
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
                          const images = project.images
                            ? project.images
                                .split(",")
                                .filter((img: string) => img.trim())
                            : [];
                          const imageCount = images.length;

                          return (
                            <>
                              {imageCount > 0 && (
                                <div className="flex items-center gap-1">
                                  <Icons.Image
                                    size={16}
                                    className="text-green-600"
                                  />
                                  <span className="text-xs text-gray-600">
                                    {imageCount} img
                                    {imageCount !== 1 ? "s" : ""}
                                  </span>
                                </div>
                              )}
                              {project.link && (
                                <Icons.Link
                                  size={16}
                                  className="text-blue-600"
                                />
                              )}
                              {project.github && (
                                <Icons.Github
                                  size={16}
                                  className="text-gray-700"
                                />
                              )}
                              {imageCount === 0 &&
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

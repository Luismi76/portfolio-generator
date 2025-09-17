// ProjectForm.tsx
import React from 'react';
import { Project } from '../types/portfolio-types';
import { Icons } from './portfolio-icons';
import { Section } from './Section';
import { useImageUpload } from './portfolio-hooks';
import { generateSlug } from './portfolio-export';

interface ProjectFormProps {
  projects: Project[];
  onUpdate: (index: number, field: keyof Project, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

interface ImageUploaderProps {
  project: Project;
  index: number;
  onUpdate: (index: number, field: keyof Project, value: string) => void;
}

// Componente para subir imágenes con preview
const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  project, 
  index, 
  onUpdate 
}) => {
  const { uploadImage, isUploading, error, clearError } = useImageUpload(
    (base64) => onUpdate(index, 'image', base64),
    { maxSize: 5 * 1024 * 1024 }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
      e.target.value = '';
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Imagen principal del proyecto
      </label>

      {/* Input URL */}
      <input
        type="url"
        placeholder="https://ejemplo.com/imagen.png"
        value={project.image && !project.image.startsWith("data:") ? project.image : ""}
        onChange={(e) => onUpdate(index, "image", e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
      />

      {/* Separador */}
      <div className="flex items-center my-3">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-3 text-sm text-gray-500">o</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Zona de subida */}
      <div className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors ${isUploading ? 'opacity-50' : ''}`}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={`image-upload-${index}`}
          disabled={isUploading}
        />
        <label
          htmlFor={`image-upload-${index}`}
          className="cursor-pointer block"
        >
          <Icons.Image size={32} className="mx-auto text-gray-400 mb-2" />
          <div className="text-sm text-gray-600 font-medium">
            {isUploading ? 'Cargando imagen...' : 'Haz clic para seleccionar una imagen'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            PNG, JPG, GIF hasta 5MB
          </div>
        </label>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
          <Icons.AlertCircle size={16} />
          {error}
          <button 
            onClick={clearError} 
            className="ml-auto hover:text-red-800"
            title="Cerrar error"
          >
            <Icons.X size={16} />
          </button>
        </div>
      )}

      {/* Preview de imagen */}
      {project.image && project.image.trim() && !error && (
        <div className="mt-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={project.image}
              alt="Preview"
              className="w-24 h-16 object-cover rounded border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Icons.Check size={14} className="text-green-600 flex-shrink-0" />
                <span className="text-xs text-green-600 font-medium">
                  Imagen cargada exitosamente
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {project.image.startsWith("data:")
                  ? "Archivo local (Base64)"
                  : "URL externa"}
              </div>
              <button
                onClick={() => onUpdate(index, "image", "")}
                className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <Icons.Trash2 size={12} />
                Eliminar imagen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface EditableProjectItemProps {
  project: Project;
  index: number;
  onUpdate: (index: number, field: keyof Project, value: string) => void;
  onRemove?: (index: number) => void;
  showRemoveButton: boolean;
}

// Componente individual para cada proyecto
const EditableProjectItem: React.FC<EditableProjectItemProps> = ({
  project,
  index,
  onUpdate,
  onRemove,
  showRemoveButton
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-medium text-gray-700">
          Proyecto {index + 1}
          {project.title && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              - {project.title}
            </span>
          )}
        </h4>
        {showRemoveButton && onRemove && (
          <button
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700 transition-colors p-1"
            title="Eliminar proyecto"
          >
            <Icons.Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Título y Tecnologías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del proyecto *
          </label>
          <input
            type="text"
            placeholder="Mi Proyecto Awesome"
            value={project.title}
            onChange={(e) => onUpdate(index, "title", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tecnologías utilizadas
          </label>
          <input
            type="text"
            placeholder="React, TypeScript, Node.js, MongoDB"
            value={project.technologies}
            onChange={(e) => onUpdate(index, "technologies", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Descripción básica */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción breve *
        </label>
        <textarea
          placeholder="Descripción concisa que aparecerá en la tarjeta del proyecto en el portfolio"
          value={project.description}
          onChange={(e) => onUpdate(index, "description", e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={200}
        />
        <div className="text-xs text-gray-500 mt-1">
          {project.description.length}/200 caracteres
        </div>
      </div>

      {/* Descripción detallada */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción detallada
        </label>
        <textarea
          placeholder="Descripción completa que aparecerá en la página individual del proyecto. Explica el contexto, objetivos, y resultados."
          value={project.detailedDescription || ""}
          onChange={(e) => onUpdate(index, "detailedDescription", e.target.value)}
          rows={6}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Imagen del proyecto */}
      <ImageUploader project={project} index={index} onUpdate={onUpdate} />

      {/* Características y funcionalidades */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Características principales
        </label>
        <input
          type="text"
          placeholder="Responsivo, API REST, Autenticación, Dashboard, Pagos"
          value={project.features || ""}
          onChange={(e) => onUpdate(index, "features", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="text-xs text-gray-500 mt-1">
          Separar con comas. Estas aparecerán como lista en la página del proyecto.
        </div>
      </div>

      {/* Instrucciones de uso */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instrucciones de uso/instalación
        </label>
        <textarea
          placeholder="Pasos para instalar, configurar o usar el proyecto (opcional)"
          value={project.instructions || ""}
          onChange={(e) => onUpdate(index, "instructions", e.target.value)}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Desafíos técnicos */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Desafíos técnicos y aprendizajes
        </label>
        <textarea
          placeholder="¿Qué problemas resolviste? ¿Qué aprendiste? (opcional)"
          value={project.challenges || ""}
          onChange={(e) => onUpdate(index, "challenges", e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Enlaces del proyecto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enlace del proyecto
          </label>
          <input
            type="url"
            placeholder="https://mi-proyecto.com"
            value={project.link}
            onChange={(e) => onUpdate(index, "link", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Repositorio GitHub
          </label>
          <input
            type="url"
            placeholder="https://github.com/usuario/proyecto"
            value={project.github}
            onChange={(e) => onUpdate(index, "github", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Preview del slug */}
      {project.title && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Icons.Link size={14} className="text-blue-600" />
            <span className="text-blue-800">
              <strong>URL del proyecto:</strong> /project/{project.slug || generateSlug(project.title)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente principal del formulario de proyectos
export const ProjectForm: React.FC<ProjectFormProps> = ({
  projects,
  onUpdate,
  onAdd,
  onRemove,
}) => {
  return (
    <Section
      title="Proyectos"
      description="Añade tus proyectos más destacados con detalles completos"
      icon={Icons.Code}
      showAddButton={true}
      onAdd={onAdd}
      addButtonText="Nuevo Proyecto"
    >
      <div className="space-y-6">
        {projects.map((project, index) => (
          <EditableProjectItem
            key={index}
            project={project}
            index={index}
            onUpdate={onUpdate}
            onRemove={projects.length > 1 ? onRemove : undefined}
            showRemoveButton={projects.length > 1}
          />
        ))}

        {/* Mensaje si no hay proyectos */}
        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Icons.Code size={48} className="mx-auto text-gray-300 mb-4" />
            <p>No hay proyectos aún.</p>
            <p className="text-sm">Haz clic en "Nuevo Proyecto" para empezar.</p>
          </div>
        )}

        {/* Ayuda contextual */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Icons.Info size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <strong>Consejos para proyectos efectivos:</strong>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>Incluye el nombre y descripción breve (obligatorios)</li>
                <li>Agrega una imagen representativa del proyecto</li>
                <li>Menciona las tecnologías clave utilizadas</li>
                <li>Explica el problema que resuelve y cómo lo abordaste</li>
                <li>Incluye enlaces al proyecto en vivo y código fuente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ProjectForm;
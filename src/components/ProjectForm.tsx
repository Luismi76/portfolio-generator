// ProjectForm.tsx - Versión corregida con solo URLs manuales
import React, { useState } from 'react';
import { Project } from '../types/portfolio-types';
import { Icons } from './portfolio-icons';
import { Section } from './Section';
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

// Componente para imagen principal - solo URLs manuales
const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  project, 
  index, 
  onUpdate 
}) => {
  const [error, setError] = useState<string>('');

  const validateImageUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Permitir vacío
    
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
    
    onUpdate(index, "image", url);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Imagen principal del proyecto
      </label>

      <input
        type="url"
        placeholder="https://ejemplo.com/imagen.png"
        value={project.image || ""}
        onChange={(e) => handleUrlChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
          <Icons.AlertCircle size={16} />
          {error}
          <button 
            onClick={() => setError('')} 
            className="ml-auto hover:text-red-800"
          >
            <Icons.X size={16} />
          </button>
        </div>
      )}

      {project.image && project.image.trim() && !error && (
        <div className="mt-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={project.image}
              alt="Preview"
              className="w-24 h-16 object-cover rounded border"
              onError={() => {
                setError('No se pudo cargar la imagen desde esta URL');
              }}
              onLoad={() => setError('')}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Icons.Check size={14} className="text-green-600 flex-shrink-0" />
                <span className="text-xs text-green-600 font-medium">
                  Imagen cargada correctamente
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                URL externa válida
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

      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>¿Dónde subir imágenes?</strong>
          <div className="mt-2 space-y-1 text-xs">
            <div>• <strong>Tu MinIO:</strong> <a href="https://minio.lmsc.es" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">minio.lmsc.es</a> (sube y copia la URL)</div>
            <div>• <strong>Imgur:</strong> <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">imgur.com</a> (arrastra imagen y copia enlace)</div>
            <div>• <strong>ImgBB:</strong> <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">imgbb.com</a> (gratis sin registro)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para múltiples imágenes
const MultiImageUploader: React.FC<{
  project: Project;
  index: number;
  onUpdate: (index: number, field: keyof Project, value: string) => void;
}> = ({ project, index, onUpdate }) => {
  const [error, setError] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');

  const getImagesArray = (): string[] => {
    if (!project.images || project.images.trim() === '') return [];
    
    return project.images
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
    onUpdate(index, 'images', newImages.join(','));
    setUrlInput('');
    setError('');
  };

  const removeImage = (imageIndex: number) => {
    const currentImages = getImagesArray();
    const newImages = currentImages.filter((_, i) => i !== imageIndex);
    onUpdate(index, 'images', newImages.join(','));
  };

  const images = getImagesArray();

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
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
        >
          <Icons.Plus size={16} />
          Agregar
        </button>
      </div>

      {error && (
        <div className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-2 rounded">
          <Icons.AlertCircle size={16} />
          {error}
          <button onClick={() => setError('')} className="ml-auto">
            <Icons.X size={14} />
          </button>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Galería ({images.length} imágenes)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((img, imgIndex) => (
              <div key={imgIndex} className="relative group">
                <img
                  src={img}
                  alt={`Imagen ${imgIndex + 1}`}
                  className="w-full h-24 object-cover rounded border shadow-sm"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(imgIndex)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Eliminar imagen"
                >
                  <Icons.X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-start gap-2">
          <Icons.Info size={16} className="text-blue-500 mt-0.5" />
          <div>
            <p><strong>Sube tus imágenes a:</strong></p>
            <div className="mt-1 space-y-1 text-xs">
              <div>• <a href="https://minio.lmsc.es" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Tu MinIO</a> - Sube y copia la URL</div>
              <div>• <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Imgur</a> - Arrastra imagen y copia enlace</div>
              <div>• <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ImgBB</a> - Gratis sin registro</div>
            </div>
          </div>
        </div>
      </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del proyecto *
          </label>
          <input
            type="text"
            placeholder="Mi Proyecto Awesome"
            value={project.title || ""}
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
            value={project.technologies || ""}
            onChange={(e) => onUpdate(index, "technologies", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción breve *
        </label>
        <textarea
          placeholder="Descripción concisa que aparecerá en la tarjeta del proyecto en el portfolio"
          value={project.description || ""}
          onChange={(e) => onUpdate(index, "description", e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={200}
        />
        <div className="text-xs text-gray-500 mt-1">
          {(project.description || "").length}/200 caracteres
        </div>
      </div>

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

      <ImageUploader project={project} index={index} onUpdate={onUpdate} />

      <MultiImageUploader project={project} index={index} onUpdate={onUpdate} />

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enlace del proyecto
          </label>
          <input
            type="url"
            placeholder="https://mi-proyecto.com"
            value={project.link || ""}
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
            value={project.github || ""}
            onChange={(e) => onUpdate(index, "github", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

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

        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Icons.Code size={48} className="mx-auto text-gray-300 mb-4" />
            <p>No hay proyectos aún.</p>
            <p className="text-sm">Haz clic en "Nuevo Proyecto" para empezar.</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Icons.Info size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <strong>Sistema de imágenes mejorado:</strong>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>Solo URLs manuales - no hay problemas de subida</li>
                <li>Enlaces directos a servicios recomendados</li>
                <li>Validación automática de URLs</li>
                <li>Preview inmediato de las imágenes</li>
                <li>Compatible con cualquier servicio de imágenes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ProjectForm;
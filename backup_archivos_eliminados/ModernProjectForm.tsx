// ModernProjectForm.tsx
import React from 'react';
import { Project } from '../../types/portfolio-types';
import { Icons } from '../portfolio-icons';
import { Section } from '../Section';

interface ModernProjectFormProps {
  projects: Project[];
  onUpdate: (index: number, field: keyof Project, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const ModernProjectForm: React.FC<ModernProjectFormProps> = ({
  projects,
  onUpdate,
  onAdd,
  onRemove
}) => {
  return (
    <Section 
      title="Proyectos" 
      onAdd={onAdd}
      showAddButton={true}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
            <Icons.Code className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Portfolio de Proyectos
            </h3>
            <p className="text-sm text-gray-600">
              Muestra tus mejores trabajos y desarrollos
            </p>
          </div>
        </div>

        {/* Lista de proyectos */}
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Header del proyecto */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <span className="text-gray-600 text-lg">📁</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Proyecto {index + 1}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {project.title || 'Sin título'}
                    </p>
                  </div>
                </div>
                
                {projects.length > 1 && (
                  <button
                    onClick={() => onRemove(index)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar proyecto"
                  >
                    <Icons.Trash2 size={18} />
                  </button>
                )}
              </div>

              {/* Campos del proyecto */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Título */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Título del proyecto *
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del proyecto"
                    value={project.title}
                    onChange={(e) => onUpdate(index, "title", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Tecnologías */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tecnologías utilizadas
                  </label>
                  <input
                    type="text"
                    placeholder="React, TypeScript, Node.js..."
                    value={project.technologies}
                    onChange={(e) => onUpdate(index, "technologies", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500">
                    Separa las tecnologías con comas
                  </p>
                </div>

                {/* Link del proyecto */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Enlace del proyecto
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://miproyecto.com"
                      value={project.link}
                      onChange={(e) => onUpdate(index, "link", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <Icons.ExternalLink 
                      size={18} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                    />
                  </div>
                </div>

                {/* GitHub */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Repositorio GitHub
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://github.com/usuario/repo"
                      value={project.github}
                      onChange={(e) => onUpdate(index, "github", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <Icons.Github 
                      size={18} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                    />
                  </div>
                </div>
              </div>

              {/* Descripción corta */}
              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descripción breve *
                </label>
                <textarea
                  placeholder="Descripción corta que aparecerá en la vista de lista..."
                  value={project.description}
                  onChange={(e) => onUpdate(index, "description", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                  maxLength={150}
                />
                <div className="text-xs text-gray-500">
                  {project.description.length}/150 caracteres
                </div>
              </div>

              {/* Descripción detallada */}
              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descripción detallada
                </label>
                <textarea
                  placeholder="Descripción completa del proyecto, objetivos, proceso de desarrollo, resultados..."
                  value={project.detailedDescription || ''}
                  onChange={(e) => onUpdate(index, "detailedDescription", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500">
                  {(project.detailedDescription || '').length}/1000 caracteres
                </div>
              </div>

              {/* Imagen principal */}
              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Imagen principal
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={project.image || ''}
                    onChange={(e) => onUpdate(index, "image", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <Icons.Image 
                    size={18} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                </div>
                {project.image && (
                  <div className="mt-2">
                    <img 
                      src={project.image} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Características */}
              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Características principales
                </label>
                <textarea
                  placeholder="Funcionalidad 1, Funcionalidad 2, Funcionalidad 3..."
                  value={project.features || ''}
                  onChange={(e) => onUpdate(index, "features", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                />
                <p className="text-xs text-gray-500">
                  Separa las características con comas
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Ayuda contextual */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-green-100 rounded-lg">
              <Icons.Info size={16} className="text-green-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-green-900">
                Consejos para mostrar tus proyectos
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• El <strong>título y descripción breve</strong> son obligatorios</li>
                <li>• Incluye enlaces funcionando para demo y código</li>
                <li>• Las imágenes mejoran mucho la presentación</li>
                <li>• Menciona tecnologías específicas que usaste</li>
                <li>• Destaca los resultados y aprendizajes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ModernProjectForm;
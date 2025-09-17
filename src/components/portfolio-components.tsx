// portfolio-components.tsx
import React, { useRef } from 'react';
import {
  PersonalInfoFormProps,
  ProjectFormProps,
  SkillFormProps,
  PreviewProps,
  SectionProps,
  EditableItemProps,
  PersonalInfo,
  Project
} from '../types/portfolio-types';
import { Icons } from './portfolio-icons';
import { useImageUpload, useClickOutside } from './portfolio-hooks';
import { generateSlug } from './portfolio-export';

// Componente base para secciones con título y botón de agregar
export const Section: React.FC<SectionProps> = ({ 
  title, 
  children, 
  onAdd, 
  showAddButton = false 
}) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {showAddButton && onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm"
        >
          <Icons.Plus size={16} />
          Añadir
        </button>
      )}
    </div>
    {children}
  </div>
);

// Componente base para elementos editables con opción de eliminar
export const EditableItem: React.FC<EditableItemProps> = ({
  index,
  onRemove,
  showRemoveButton = false,
  title,
  children
}) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-medium text-gray-700">{title}</h4>
      {showRemoveButton && onRemove && (
        <button
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700"
        >
          <Icons.Trash2 size={16} />
        </button>
      )}
    </div>
    {children}
  </div>
);

// Formulario de información personal
export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ 
  data, 
  onUpdate 
}) => (
  <Section title="Información Personal">
    <div className="flex items-center gap-2 mb-4">
      <Icons.User className="text-blue-600" size={20} />
      <span className="text-sm text-gray-600">Datos básicos de contacto</span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="Nombre completo"
        value={data.name}
        onChange={(e) => onUpdate("name", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="text"
        placeholder="Título profesional"
        value={data.title}
        onChange={(e) => onUpdate("title", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="email"
        placeholder="Email"
        value={data.email}
        onChange={(e) => onUpdate("email", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="tel"
        placeholder="Teléfono"
        value={data.phone}
        onChange={(e) => onUpdate("phone", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <input
        type="text"
        placeholder="Ubicación"
        value={data.location}
        onChange={(e) => onUpdate("location", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="url"
        placeholder="Sitio web"
        value={data.website}
        onChange={(e) => onUpdate("website", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="url"
        placeholder="GitHub"
        value={data.github}
        onChange={(e) => onUpdate("github", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <textarea
      placeholder="Resumen profesional"
      value={data.summary}
      onChange={(e) => onUpdate("summary", e.target.value)}
      rows={4}
      className="w-full mt-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </Section>
);

// Componente para subir imagen con preview
const ImageUploader: React.FC<{
  project: Project;
  index: number;
  onUpdate: (index: number, field: keyof Project, value: string) => void;
}> = ({ project, index, onUpdate }) => {
  const { uploadImage, isUploading, error, clearError } = useImageUpload(
    (base64) => onUpdate(index, 'image', base64),
    { maxSize: 5 * 1024 * 1024 }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
      e.target.value = ''; // Limpiar input
    }
  };

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Imagen principal del proyecto
      </label>

      {/* Input URL */}
      <input
        type="url"
        placeholder="https://ejemplo.com/imagen.png"
        value={project.image && !project.image.startsWith("data:") ? project.image : ""}
        onChange={(e) => onUpdate(index, "image", e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mb-2"
      />

      {/* Separador */}
      <div className="flex items-center my-3">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-3 text-sm text-gray-500">o</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Zona de subida de archivos */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
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
          className={`cursor-pointer block ${isUploading ? 'opacity-50' : ''}`}
        >
          <Icons.Image size={32} className="mx-auto text-gray-400 mb-2" />
          <div className="text-sm text-gray-600 font-medium">
            {isUploading ? 'Cargando...' : 'Haz clic para seleccionar una imagen'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            PNG, JPG, GIF hasta 5MB
          </div>
        </label>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm flex items-center gap-2">
          <Icons.AlertCircle size={16} />
          {error}
          <button onClick={clearError} className="ml-auto">
            <Icons.X size={16} />
          </button>
        </div>
      )}

      {/* Preview de la imagen */}
      {project.image && project.image.trim() && !error && (
        <div className="mt-3">
          <div className="flex items-start gap-3">
            <img
              src={project.image}
              alt="Preview"
              className="w-24 h-16 object-cover rounded border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Icons.Check size={14} className="text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  Imagen cargada
                </span>
                <button
                  onClick={() => onUpdate(index, "image", "")}
                  className="text-xs text-red-600 hover:text-red-800 ml-auto"
                >
                  Eliminar
                </button>
              </div>
              <div className="text-xs text-gray-500">
                {project.image.startsWith("data:")
                  ? "Archivo local (convertido a Base64)"
                  : "URL externa"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Formulario de proyectos
export const ProjectForm: React.FC<ProjectFormProps> = ({
  projects,
  onUpdate,
  onAdd,
  onRemove,
}) => (
  <Section 
    title="Proyectos" 
    onAdd={onAdd} 
    showAddButton={true}
  >
    <div className="flex items-center gap-2 mb-4">
      <Icons.Code className="text-blue-600" size={20} />
      <span className="text-sm text-gray-600">Proyectos y trabajos destacados</span>
    </div>

    <div className="space-y-6">
      {projects.map((project, index) => (
        <EditableItem
          key={index}
          index={index}
          title={`Proyecto ${index + 1}`}
          onRemove={projects.length > 1 ? onRemove : undefined}
          showRemoveButton={projects.length > 1}
        >
          {/* Título y Tecnologías */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Nombre del proyecto"
              value={project.title}
              onChange={(e) => onUpdate(index, "title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Tecnologías (separadas por comas)"
              value={project.technologies}
              onChange={(e) => onUpdate(index, "technologies", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Descripción básica */}
          <textarea
            placeholder="Descripción del proyecto (breve para el portfolio)"
            value={project.description}
            onChange={(e) => onUpdate(index, "description", e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mb-3"
          />

          {/* Descripción detallada */}
          <textarea
            placeholder="Descripción detallada (para la página del proyecto)"
            value={project.detailedDescription || ""}
            onChange={(e) => onUpdate(index, "detailedDescription", e.target.value)}
            rows={6}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mb-3"
          />

          {/* Componente de imagen */}
          <ImageUploader project={project} index={index} onUpdate={onUpdate} />

          {/* Características */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Características principales (separadas por comas)
            </label>
            <input
              type="text"
              placeholder="Responsivo, API REST, Autenticación, Dashboard"
              value={project.features || ""}
              onChange={(e) => onUpdate(index, "features", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Instrucciones */}
          <textarea
            placeholder="Instrucciones de uso o instalación (opcional)"
            value={project.instructions || ""}
            onChange={(e) => onUpdate(index, "instructions", e.target.value)}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mb-3"
          />

          {/* Desafíos técnicos */}
          <textarea
            placeholder="Desafíos técnicos o aprendizajes (opcional)"
            value={project.challenges || ""}
            onChange={(e) => onUpdate(index, "challenges", e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mb-3"
          />

          {/* Enlaces */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="url"
              placeholder="Link del proyecto (opcional)"
              value={project.link}
              onChange={(e) => onUpdate(index, "link", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="url"
              placeholder="Repositorio GitHub (opcional)"
              value={project.github}
              onChange={(e) => onUpdate(index, "github", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mostrar slug generado */}
          {project.title && (
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
              <Icons.Link size={12} />
              URL del proyecto: /project/{project.slug || generateSlug(project.title)}
            </div>
          )}
        </EditableItem>
      ))}
    </div>
  </Section>
);

// Formulario de habilidades
export const SkillForm: React.FC<SkillFormProps> = ({
  skills,
  onUpdate,
  onAdd,
  onRemove,
}) => (
  <Section 
    title="Habilidades" 
    onAdd={onAdd} 
    showAddButton={true}
  >
    <div className="flex items-center gap-2 mb-4">
      <Icons.Award className="text-blue-600" size={20} />
      <span className="text-sm text-gray-600">Tecnologías y competencias</span>
    </div>

    <div className="space-y-4">
      {skills.map((skill, index) => (
        <EditableItem
          key={index}
          index={index}
          title={`Categoría ${index + 1}`}
          onRemove={skills.length > 1 ? onRemove : undefined}
          showRemoveButton={skills.length > 1}
        >
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nombre de la categoría (ej: Frontend, Backend, Herramientas)"
              value={skill.category}
              onChange={(e) => onUpdate(index, "category", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Habilidades (separadas por comas)"
              value={skill.items}
              onChange={(e) => onUpdate(index, "items", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </EditableItem>
      ))}
    </div>
  </Section>
);

// Panel de vista previa
export const PreviewPanel: React.FC<{ 
  personalInfo: PersonalInfo; 
  onShowFullPreview: () => void;
}> = ({ personalInfo, onShowFullPreview }) => (
  <div className="lg:sticky lg:top-6">
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icons.Eye className="text-blue-600" size={20} />
        <h2 className="text-lg font-semibold text-gray-800">Vista Previa</h2>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
            {personalInfo.name
              ? personalInfo.name.charAt(0).toUpperCase()
              : "P"}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {personalInfo.name || "Tu Nombre"}
          </h3>
          <p className="text-gray-600 mb-4">
            {personalInfo.title || "Tu Título Profesional"}
          </p>
          {personalInfo.summary && (
            <p className="text-sm text-gray-500 mb-4 line-clamp-3">
              {personalInfo.summary}
            </p>
          )}
          <button
            onClick={onShowFullPreview}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icons.ExternalLink size={14} />
            Ver Portfolio Completo
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Menú desplegable de datos
export const DataMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onExportJSON: () => void;
  onExportWebsite: () => void;
  onImportJSON: () => void;
  onClearData: () => void;
}> = ({ isOpen, onClose, onExportJSON, onExportWebsite, onImportJSON, onClearData }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-50"
    >
      <div className="py-1">
        <button
          onClick={() => {
            onExportJSON();
            onClose();
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
        >
          <Icons.FileDown size={16} />
          Exportar JSON
        </button>
        
        <button
          onClick={() => {
            onExportWebsite();
            onClose();
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
        >
          <Icons.Download size={16} />
          Exportar Sitio Web
        </button>
        
        <button
          onClick={() => {
            onImportJSON();
            onClose();
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
        >
          <Icons.Upload size={16} />
          Importar JSON
        </button>
        
        <hr className="my-1" />
        
        <button
          onClick={() => {
            onClearData();
            onClose();
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
        >
          <Icons.Trash2 size={16} />
          Limpiar Todo
        </button>
      </div>
    </div>
  );
};

// Barra de navegación principal
export const AppHeader: React.FC<{
  saveStatus: string;
  onShowPreview: () => void;
  onExportHTML: () => void;
  onExportWebsite: () => void;
  showDataMenu: boolean;
  onToggleDataMenu: () => void;
  onSwitchMode: (mode: 'editor' | 'portfolio') => void;
  currentMode: 'editor' | 'portfolio';
  dataMenuActions: {
    onExportJSON: () => void;
    onExportWebsite: () => void;
    onImportJSON: () => void;
    onClearData: () => void;
  };
}> = ({
  saveStatus,
  onShowPreview,
  onExportHTML,
  onExportWebsite,
  showDataMenu,
  onToggleDataMenu,
  onSwitchMode,
  currentMode,
  dataMenuActions
}) => (
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Generador de Portfolio
          </h1>
          <p className="text-gray-600">Crea tu portfolio profesional</p>
          {saveStatus && (
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <Icons.Check size={14} />
              {saveStatus}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onShowPreview}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icons.Eye size={16} />
            Vista Previa
          </button>

          {/* Botones de exportación */}
          <div className="flex gap-3">
            <button
              onClick={onExportHTML}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Icons.Download size={16} />
              HTML
            </button>
            
            <button
              onClick={onExportWebsite}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Icons.Download size={16} />
              Sitio Web
            </button>
          </div>

          <div className="relative">
            <button
              onClick={onToggleDataMenu}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Icons.Settings size={16} />
              Datos
              <Icons.ChevronDown
                size={16}
                className={`transition-transform ${showDataMenu ? "rotate-180" : ""}`}
              />
            </button>

            <DataMenu
              isOpen={showDataMenu}
              onClose={() => onToggleDataMenu()}
              {...dataMenuActions}
            />
          </div>

          <div className="w-px h-8 bg-gray-300"></div>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onSwitchMode("editor")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currentMode === 'editor'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => onSwitchMode("portfolio")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currentMode === 'portfolio'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
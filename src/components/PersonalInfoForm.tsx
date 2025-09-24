// PersonalInfoForm.tsx
import React from 'react';
import { PersonalInfo, PersonalInfoKey } from '../types/portfolio-types';
import { Icons } from './portfolio-icons';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onUpdate: (field: PersonalInfoKey, value: string) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ 
  data, 
  onUpdate 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Icons.User className="text-blue-600" size={20} />
        <h2 className="text-lg font-semibold text-gray-800">
          Información Personal
        </h2>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        Completa tu información básica de contacto y presentación
      </p>

      {/* Campos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo *
          </label>
          <input
            type="text"
            placeholder="Tu nombre completo"
            value={data.fullName}
            onChange={(e) => onUpdate("fullName", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título profesional *
          </label>
          <input
            type="text"
            placeholder="Ej: Desarrollador Frontend, Diseñador UX"
            value={data.title}
            onChange={(e) => onUpdate("title", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={data.email}
            onChange={(e) => onUpdate("email", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            placeholder="+34 123 456 789"
            value={data.phone}
            onChange={(e) => onUpdate("phone", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {/* Campos adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <input
            type="text"
            placeholder="Madrid, España"
            value={data.location}
            onChange={(e) => onUpdate("location", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sitio web
          </label>
          <input
            type="url"
            placeholder="https://miweb.com"
            value={data.website}
            onChange={(e) => onUpdate("website", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub
          </label>
          <input
            type="url"
            placeholder="https://github.com/usuario"
            value={data.github}
            onChange={(e) => onUpdate("github", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {/* Campo LinkedIn */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          LinkedIn
        </label>
        <input
          type="url"
          placeholder="https://linkedin.com/in/usuario"
          value={data.linkedin}
          onChange={(e) => onUpdate("linkedin", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>

      {/* Resumen profesional */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Resumen profesional
        </label>
        <textarea
          placeholder="Describe brevemente tu experiencia, habilidades principales y qué te hace único como profesional..."
          value={data.summary}
          onChange={(e) => onUpdate("summary", e.target.value)}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
          maxLength={500}
        />
        <div className="text-xs text-gray-500 mt-1">
          {data.summary.length}/500 caracteres
        </div>
      </div>

      {/* Ayuda contextual */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Icons.Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <strong>Consejo:</strong> El nombre y título son obligatorios para generar tu portfolio. 
            El resumen aparecerá en la página principal para presentarte a los visitantes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;

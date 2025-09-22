// ModernPersonalInfoForm.tsx - ACTUALIZADO para usar fullName
import React from 'react';
import { PersonalInfo, PersonalInfoKey } from '../../types/portfolio-types';
import { Icons } from '../portfolio-icons';
import { Section } from '../Section';

interface ModernPersonalInfoFormProps {
  data: PersonalInfo;
  onUpdate: (field: PersonalInfoKey, value: string) => void;
}

const ModernPersonalInfoForm: React.FC<ModernPersonalInfoFormProps> = ({ 
  data, 
  onUpdate 
}) => {
  return (
    <Section title="Información Personal" showAddButton={false}>
      <div className="space-y-6">
        {/* Header con icono */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Icons.User className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Datos de Contacto
            </h3>
            <p className="text-sm text-gray-600">
              Información básica para tu portfolio profesional
            </p>
          </div>
        </div>

        {/* Campos principales en grid moderno */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nombre completo - CAMBIADO A fullName */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nombre completo *
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Tu nombre completo"
                value={data.fullName}
                onChange={(e) => onUpdate("fullName", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                required
              />
              <Icons.User 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
            </div>
          </div>

          {/* Título profesional */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Título profesional *
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej: Desarrollador Frontend, Diseñador UX"
                value={data.title}
                onChange={(e) => onUpdate("title", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                required
              />
              <Icons.Briefcase 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
            </div>
          </div>

          {/* Tagline - NUEVO CAMPO */}
          <div className="space-y-2 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Tagline o eslogan
            </label>
            <input
              type="text"
              placeholder="Una frase que te defina profesionalmente"
              value={data.tagline || ''}
              onChange={(e) => onUpdate("tagline", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="tu@email.com"
                value={data.email}
                onChange={(e) => onUpdate("email", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                ✉️
              </span>
            </div>
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+34 123 456 789"
                value={data.phone}
                onChange={(e) => onUpdate("phone", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                📱
              </span>
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Ubicación
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Madrid, España"
                value={data.location}
                onChange={(e) => onUpdate("location", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                📍
              </span>
            </div>
          </div>

          {/* Sitio web */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Sitio web
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://miweb.com"
                value={data.website}
                onChange={(e) => onUpdate("website", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🌐
              </span>
            </div>
          </div>
        </div>

        {/* Enlaces sociales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GitHub */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              GitHub
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://github.com/usuario"
                value={data.github}
                onChange={(e) => onUpdate("github", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
              <Icons.Github 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              LinkedIn
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://linkedin.com/in/usuario"
                value={data.linkedin}
                onChange={(e) => onUpdate("linkedin", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                💼
              </span>
            </div>
          </div>
        </div>

        {/* Resumen profesional */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Resumen profesional
          </label>
          <div className="relative">
            <textarea
              placeholder="Describe brevemente tu experiencia, habilidades principales y qué te hace único como profesional..."
              value={data.summary}
              onChange={(e) => onUpdate("summary", e.target.value)}
              rows={4}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm resize-vertical"
              maxLength={500}
            />
            <span className="absolute left-3 top-4 text-gray-400">
              📝
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">
              {data.summary.length}/500 caracteres
            </span>
            {data.summary.length > 450 && (
              <span className="text-amber-600">
                Casi llegando al límite
              </span>
            )}
          </div>
        </div>

        {/* Ayuda contextual moderna */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-blue-100 rounded-lg">
              <Icons.Info size={16} className="text-blue-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-blue-900">
                Consejos para completar tu perfil
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• El <strong>nombre y título</strong> son obligatorios</li>
                <li>• El resumen aparecerá en la página principal</li>
                <li>• Incluye enlaces sociales para mayor credibilidad</li>
                <li>• El email será usado para el contacto directo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ModernPersonalInfoForm;
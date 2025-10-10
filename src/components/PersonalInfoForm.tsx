// PersonalInfoForm.tsx - Versión simplificada solo con URL
import React from "react";
import { PersonalInfoFormProps } from "../types/portfolio-types";
import { Icons } from "./portfolio-icons";

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  data,
  onUpdate,
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

      {/* ✅ SECCIÓN DE AVATAR - SOLO URL */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <label className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-xl">📸</span>
          Avatar / Foto de perfil
        </label>

        <div className="flex flex-col md:flex-row items-start gap-4">
          {/* Preview del avatar */}
          <div className="flex-shrink-0">
            {data.avatarUrl ? (
              <div className="relative group">
                <img
                  src={data.avatarUrl}
                  alt="Avatar preview"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2"%3E%3Ccircle cx="12" cy="8" r="4"/%3E%3Cpath d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/%3E%3C/svg%3E';
                  }}
                />
                <button
                  onClick={() => onUpdate("avatarUrl", "")}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                  title="Eliminar avatar"
                >
                  <Icons.X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
                <Icons.User size={40} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Campo URL */}
          <div className="flex-1 w-full">
            <input
              type="url"
              placeholder="https://ejemplo.com/mi-foto.jpg"
              value={data.avatarUrl || ""}
              onChange={(e) => onUpdate("avatarUrl", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <p className="text-xs text-gray-600 mt-2">
              💡 <strong>Tip:</strong> Sube tu imagen a{" "}
              <a
                href="https://imgbb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                ImgBB
              </a>
              {" "}o{" "}
              <a
                href="https://imgur.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Imgur
              </a>
              {" "}y pega la URL aquí
            </p>
          </div>
        </div>
      </div>

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
          <Icons.Info
            size={16}
            className="text-blue-600 mt-0.5 flex-shrink-0"
          />
          <div className="text-sm text-blue-800">
            <strong>💡 Consejo:</strong> El avatar se mostrará en todas las plantillas. 
            Para configurar cómo se muestra (posición, tamaño), ve a{" "}
            <strong>Plantillas → Personalizar → Avatar</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
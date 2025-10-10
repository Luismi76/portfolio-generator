// src/components/customizer/tabs/AvatarTab.tsx
import React from "react";
import { AdvancedTemplateConfig } from "../../../types/advanced-template-types";

interface AvatarTabProps {
  currentConfig: AdvancedTemplateConfig;
  updateConfig: (updates: Partial<AdvancedTemplateConfig["customizations"]>) => void;
  avatarUrl?: string;  // ✅ Avatar desde personalInfo (solo lectura)
}

/**
 * Tab de configuración del avatar/foto de perfil
 * SOLO configura cómo se muestra, NO edita la imagen
 */
export const AvatarTab: React.FC<AvatarTabProps> = ({
  currentConfig,
  updateConfig,
  avatarUrl,
}) => {
  // Obtener configuración actual del header
  const headerConfig = currentConfig.customizations.headerConfig || {};
  // ✅ DEBUG - Agregar esto temporalmente
  console.log('🔍 AvatarTab - currentConfig:', currentConfig);
  console.log('🔍 AvatarTab - headerConfig:', headerConfig);
  console.log('🔍 AvatarTab - avatarPosition:', headerConfig.avatarPosition);
  console.log('🔍 AvatarTab - avatarSize:', headerConfig.avatarSize);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Configuración del Avatar
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Personaliza cómo se muestra tu foto de perfil en el portfolio
        </p>
      </div>

      {/* ✅ Alerta informativa */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex items-start gap-3">
          <span className="text-blue-500 text-xl">ℹ️</span>
          <div className="text-sm text-blue-800">
            <strong>Importante:</strong> Para cambiar tu foto, ve a{" "}
            <span className="font-semibold">Editor → Información Personal</span> y 
            sube tu imagen ahí. Aquí solo configuras cómo se muestra.
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-white">
        {/* ✅ Vista previa con el avatar real */}
        {avatarUrl && (
          <div className="mb-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Vista previa
            </label>
            <div
              className={`flex ${
                headerConfig.avatarPosition === "left"
                  ? "justify-start"
                  : headerConfig.avatarPosition === "right"
                  ? "justify-end"
                  : "justify-center"
              }`}
            >
              {headerConfig.showAvatar !== false ? (
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className={`
                    ${
                      headerConfig.avatarSize === "sm"
                        ? "w-20 h-20"
                        : headerConfig.avatarSize === "lg"
                        ? "w-40 h-40"
                        : "w-32 h-32"
                    }
                    rounded-full object-cover border-4 border-white shadow-lg
                  `}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">👁️‍🗨️</div>
                  <p className="text-sm">Avatar oculto</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ✅ Si no hay avatar, mostrar mensaje */}
        {!avatarUrl && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-sm text-yellow-800 font-medium mb-1">
              No has subido un avatar todavía
            </p>
            <p className="text-xs text-yellow-700">
              Ve a <strong>Editor → Información Personal</strong> para agregar tu foto
            </p>
          </div>
        )}

        <h4 className="font-medium mb-3">Opciones de visualización</h4>
        
        <div className="space-y-4">
          {/* ✅ Mostrar/Ocultar Avatar */}
          <label className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="checkbox"
              checked={headerConfig.showAvatar !== false}
              onChange={(e) =>
                updateConfig({
                  headerConfig: {
                    ...headerConfig,
                    showAvatar: e.target.checked,
                  },
                })
              }
              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">
                Mostrar avatar/foto
              </span>
              <p className="text-xs text-gray-500 mt-0.5">
                Activa para que tu foto aparezca en el portfolio
              </p>
            </div>
          </label>

          {/* ✅ Opciones solo si está activado */}
          {headerConfig.showAvatar !== false && (
            <>
              {/* Posición del avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posición del avatar
                </label>
                <select
                  value={headerConfig.avatarPosition || "center"}
                  onChange={(e) =>
                    updateConfig({
                      headerConfig: {
                        ...headerConfig,
                        avatarPosition: e.target.value as "left" | "center" | "right",
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="left">⬅️ Izquierda</option>
                  <option value="center">⬆️ Centro</option>
                  <option value="right">➡️ Derecha</option>
                </select>
              </div>

              {/* Tamaño del avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño del avatar
                </label>
                <select
                  value={headerConfig.avatarSize || "md"}
                  onChange={(e) =>
                    updateConfig({
                      headerConfig: {
                        ...headerConfig,
                        avatarSize: e.target.value as "sm" | "md" | "lg",
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="sm">Pequeño (80px)</option>
                  <option value="md">Mediano (120px)</option>
                  <option value="lg">Grande (160px)</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ✅ Resumen de configuración */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          <span>📋</span>
          Resumen de configuración
        </h4>
        <div className="space-y-1 text-sm text-gray-700">
          <p>
            <strong>Estado:</strong>{" "}
            {headerConfig.showAvatar !== false ? (
              <span className="text-green-600">✓ Visible</span>
            ) : (
              <span className="text-gray-500">✗ Oculto</span>
            )}
          </p>
          {headerConfig.showAvatar !== false && (
            <>
              <p>
                <strong>Posición:</strong>{" "}
                {headerConfig.avatarPosition === "left"
                  ? "Izquierda"
                  : headerConfig.avatarPosition === "right"
                  ? "Derecha"
                  : "Centro"}
              </p>
              <p>
                <strong>Tamaño:</strong>{" "}
                {headerConfig.avatarSize === "sm"
                  ? "Pequeño"
                  : headerConfig.avatarSize === "lg"
                  ? "Grande"
                  : "Mediano"}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
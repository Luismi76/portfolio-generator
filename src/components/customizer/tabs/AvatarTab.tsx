// src/components/customizer/tabs/AvatarTab.tsx
import React from "react";
import { AdvancedTemplateConfig } from "../../../types/advanced-template-types";

interface AvatarTabProps {
  currentConfig: AdvancedTemplateConfig;
  updateConfig: (updates: Partial<AdvancedTemplateConfig["customizations"]>) => void;
}

/**
 * Tab de configuración del avatar/foto de perfil
 */
export const AvatarTab: React.FC<AvatarTabProps> = ({
  currentConfig,
  updateConfig,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Configuración del Avatar
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Personaliza tu foto de perfil
        </p>
      </div>

      <div className="border rounded-lg p-4">
        <h4 className="font-medium mb-3">Avatar/Foto de Perfil</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={
                currentConfig.customizations.headerConfig?.showAvatar || false
              }
              onChange={(e) =>
                updateConfig({
                  headerConfig: {
                    ...(currentConfig.customizations.headerConfig ?? {}),
                    showAvatar: e.target.checked,
                  },
                })
              }
            />
            <span className="text-sm">Mostrar avatar/foto</span>
          </label>

          {currentConfig.customizations.headerConfig?.showAvatar && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la imagen
                </label>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/mi-foto.jpg"
                  value={
                    currentConfig.customizations.headerConfig?.avatarUrl || ""
                  }
                  onChange={(e) =>
                    updateConfig({
                      headerConfig: {
                        ...(currentConfig.customizations.headerConfig ?? {}),
                        avatarUrl: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Sube tu imagen a Imgur o ImgBB y pega la URL aquí
                </p>
              </div>

              {currentConfig.customizations.headerConfig?.avatarUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vista previa
                  </label>
                  <div className="flex justify-center">
                    <img
                      src={currentConfig.customizations.headerConfig.avatarUrl}
                      alt="Avatar preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posición del avatar
                </label>
                <select
                  value={
                    currentConfig.customizations.headerConfig?.avatarPosition ||
                    "center"
                  }
                  onChange={(e) =>
                    updateConfig({
                      headerConfig: {
                        ...(currentConfig.customizations.headerConfig ?? {}),
                        avatarPosition: e.target.value as
                          | "left"
                          | "center"
                          | "right",
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="left">Izquierda</option>
                  <option value="center">Centro</option>
                  <option value="right">Derecha</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño del avatar
                </label>
                <select
                  value={
                    currentConfig.customizations.headerConfig?.avatarSize ||
                    "md"
                  }
                  onChange={(e) =>
                    updateConfig({
                      headerConfig: {
                        ...(currentConfig.customizations.headerConfig ?? {}),
                        avatarSize: e.target.value as "sm" | "md" | "lg",
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
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
    </div>
  );
};

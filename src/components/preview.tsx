import React from "react";
import { X } from "lucide-react";
import {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from "../types/advanced-template-types";

const DEFAULT_COLORS = {
  primary: "#2563eb",
  secondary: "#7c3aed",
  accent: "#10b981",
  background: "#ffffff",
  surface: "#ffffff",
  text: { primary: "#111827", secondary: "#374151", accent: "#2563eb" },
};

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: AdvancedTemplate | null;
  config?: AdvancedTemplateConfig | Partial<AdvancedTemplateConfig>;
  onSelectTemplate?: (template: AdvancedTemplate) => void;
}

function resolvePreviewColors(
  template?: AdvancedTemplate,
  config?: AdvancedTemplateConfig | Partial<AdvancedTemplateConfig>
) {
  const tcols = (template as any)?.colors ?? {};
  const ccols = (config as any)?.customizations?.colors ?? {};

  const text = {
    primary:
      ccols?.text?.primary ??
      tcols?.text?.primary ??
      DEFAULT_COLORS.text.primary,
    secondary:
      ccols?.text?.secondary ??
      tcols?.text?.secondary ??
      DEFAULT_COLORS.text.secondary,
    accent:
      ccols?.text?.accent ?? tcols?.text?.accent ?? DEFAULT_COLORS.text.accent,
  };

  const gradient =
    ccols?.gradient ??
    ccols?.gradients?.primary ??
    tcols?.gradient ??
    tcols?.gradients?.primary ??
    null;

  return {
    primary: ccols?.primary ?? tcols?.primary ?? DEFAULT_COLORS.primary,
    secondary: ccols?.secondary ?? tcols?.secondary ?? DEFAULT_COLORS.secondary,
    accent: ccols?.accent ?? tcols?.accent ?? DEFAULT_COLORS.accent,
    background:
      ccols?.background ?? tcols?.background ?? DEFAULT_COLORS.background,
    surface: ccols?.surface ?? tcols?.surface ?? DEFAULT_COLORS.surface,
    text,
    gradient,
    // opcional: surfaceVariant si está en la plantilla
    surfaceVariant: (tcols as any)?.surfaceVariant,
  } as any;
}

export default function TemplatePreviewModal({
  isOpen,
  onClose,
  template,
  config,
  onSelectTemplate,
}: TemplatePreviewModalProps) {
  if (!isOpen || !template) return null;

  const colors = resolvePreviewColors(template, config);

  const bannerBg =
    colors.gradient?.from && colors.gradient?.to
      ? `linear-gradient(${colors.gradient.direction ?? "135deg"}, ${
          colors.gradient.from
        }, ${colors.gradient.to})`
      : `linear-gradient(135deg, ${colors.background}, ${colors.surface})`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Vista Previa de {template.name}
            </h2>
            <p className="text-gray-600 text-sm mt-1">{template.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Contenido del Preview */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Preview Grande de la Plantilla */}
          <div className="bg-gray-100 rounded-xl p-8 mb-6">
            <div
              className="w-full aspect-video rounded-lg shadow-2xl overflow-hidden"
              style={{ background: bannerBg }}
            >
              {/* Mockup con estructura */}
              <div className="h-full flex flex-col gap-2 bg-white/5 p-4">
                {/* Header si está habilitado */}
                {template.layoutStructure?.areas?.header?.enabled !== false && (
                  <div
                    className="h-16 rounded-lg flex items-center justify-between px-6 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      color: "#fff",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20" />
                      <div className="space-y-1">
                        <div className="h-3 w-32 bg-white/80 rounded" />
                        <div className="h-2 w-20 bg-white/60 rounded" />
                      </div>
                    </div>
                    <div className="flex gap-6">
                      {["Inicio", "Proyectos", "Contacto"].map((item, i) => (
                        <div key={i} className="h-3 w-16 bg-white/70 rounded" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Layout Principal */}
                <div className="flex-1 flex gap-2">
                  {/* Sidebar Izquierda */}
                  {template.layoutStructure?.areas?.["sidebar-left"]
                    ?.enabled && (
                    <div
                      className="w-48 rounded-lg p-4 space-y-3 shadow-md"
                      style={{ backgroundColor: colors.surface }}
                    >
                      <div className="h-2 bg-gray-300 rounded w-3/4" />
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-8 bg-white rounded flex items-center px-3"
                          >
                            <div className="h-1.5 bg-gray-400 rounded w-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contenido Principal */}
                  <div className="flex-1 bg-white rounded-lg p-6 shadow-md space-y-4">
                    {/* Hero Section */}
                    <div className="space-y-3">
                      <div
                        className="h-6 rounded w-3/4"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <div
                        className="h-3 rounded w-1/2 opacity-70"
                        style={{ backgroundColor: colors.accent }}
                      />
                    </div>

                    {/* Grid de Cards */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="h-24 rounded-lg p-3 space-y-2 border-2"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: `${colors.primary}20`,
                          }}
                        >
                          <div
                            className="h-2 rounded w-3/4"
                            style={{ backgroundColor: colors.primary }}
                          />
                          <div className="h-1.5 bg-gray-300 rounded w-1/2" />
                          <div className="h-1 bg-gray-200 rounded w-full" />
                        </div>
                      ))}
                    </div>

                    {/* Stats o Features */}
                    <div className="flex gap-3 mt-6">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex-1 h-16 rounded-lg p-3 flex flex-col justify-center items-center"
                          style={{ backgroundColor: colors.surface }}
                        >
                          <div
                            className="h-4 w-4 rounded-full mb-1"
                            style={{ backgroundColor: colors.accent }}
                          />
                          <div className="h-1.5 bg-gray-300 rounded w-12" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar Derecha */}
                  {template.layoutStructure?.areas?.["sidebar-right"]
                    ?.enabled && (
                    <div
                      className="w-48 rounded-lg p-4 space-y-3 shadow-md"
                      style={{
                        backgroundColor:
                          (template as any)?.colors?.surfaceVariant ||
                          colors.surface,
                      }}
                    >
                      <div className="h-2 bg-gray-300 rounded w-2/3" />
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="bg-white rounded p-3 space-y-1"
                          >
                            <div className="h-1.5 bg-gray-400 rounded w-full" />
                            <div className="h-1 bg-gray-300 rounded w-3/4" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer si está habilitado */}
                {template.layoutStructure?.areas?.footer?.enabled !== false && (
                  <div
                    className="h-12 rounded-lg flex items-center justify-between px-6 shadow-lg"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <div className="h-2 w-40 bg-white/70 rounded" />
                    <div className="flex gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-6 w-6 rounded bg-white/30" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información Detallada */}
          <div className="grid grid-cols-2 gap-6">
            {/* Paleta de Colores */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                🎨 Paleta de Colores
              </h3>
              <div className="space-y-2">
                {Object.entries(colors).map(([key, value]) => {
                  if (typeof value === "string") {
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                          style={{ backgroundColor: value }}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {value}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Información de la Plantilla */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                ℹ️ Información
              </h3>
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Categoría
                  </div>
                  <div className="text-sm font-medium text-gray-800 capitalize">
                    {template.category}
                  </div>
                </div>

                {template.version && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Versión
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {template.version}
                    </div>
                  </div>
                )}

                {template.isPremium && (
                  <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                    <span className="text-xl">⭐</span>
                    <span className="text-sm font-medium text-yellow-800">
                      Plantilla Premium
                    </span>
                  </div>
                )}

                {template.tags && template.tags.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              if (template && onSelectTemplate) {
                onSelectTemplate(template);
              }
              onClose();
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            ✓ Usar Esta Plantilla
          </button>
        </div>
      </div>
    </div>
  );
}

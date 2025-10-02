// src/components/editor/ModernPortfolioEditor.tsx
import React, { useState } from "react";
import { Icons } from "../portfolio-icons";
import { usePortfolioData, useDataExport } from "../portfolio-hooks";
import { downloadFile, createTemplateAwareExporter } from "../portfolio-export";
import { PersonalInfoForm } from "../PersonalInfoForm";
import ProjectTableForm from "../ProjectTableForm";
import SkillTableForm from "../SkillTableForm";
import { useAdvancedTemplates } from "../../hooks/useAdvancedTemplates";
import { ADVANCED_BUILT_IN_TEMPLATES } from "../advanced-built-in-templates";
import type {
  AdvancedTemplate,
  AdvancedTemplateConfig,
} from "../../types/advanced-template-types";

const ModernPortfolioEditor: React.FC = () => {
  const {
    data,
    updatePersonalInfo,
    updateProject,
    updateSkill,
    addItem,
    removeItem,
    importData,
  } = usePortfolioData();

  const { exportToJSON, importFromJSON } = useDataExport();

  const [activeSection, setActiveSection] = useState<
    "personal" | "projects" | "skills" | "templates"
  >("personal");
  const [showExportMenu, setShowExportMenu] = useState(false);

  // ✅ Sólo plantillas avanzadas
  const { selectedTemplate, config } = useAdvancedTemplates();
  const activeTemplate: AdvancedTemplate =
    (selectedTemplate as AdvancedTemplate) ??
    (ADVANCED_BUILT_IN_TEMPLATES[0] as AdvancedTemplate);
  const advancedConfig: AdvancedTemplateConfig | undefined =
    config as AdvancedTemplateConfig | undefined;

  const handleExportJSON = () => {
    exportToJSON(data);
  };

  const handleImportJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const result = await importFromJSON(file);
      if (result.success && result.data) {
        importData(result.data);
        alert("Datos importados correctamente");
        window.location.reload();
      } else {
        alert("Error al importar: " + result.message);
      }
    };
    input.click();
  };

  // ✅ Exportar HTML (modo single) con avanzado
  const handleExportHTML = () => {
    console.log("🔍 DEBUG - Estado actual:");
    console.log("- selectedTemplate:", selectedTemplate?.name);
    console.log("- activeTemplate:", activeTemplate?.name);
    console.log("- config:", advancedConfig);
    console.log(
      "- config?.customizations?.sections:",
      advancedConfig?.customizations?.sections
    );

    if (advancedConfig?.customizations?.sections) {
      console.log("📋 Secciones personalizadas:");
      advancedConfig.customizations.sections.forEach((section) => {
        console.log(
          `  ${section.id}: ${section.enabled ? "HABILITADA" : "DESHABILITADA"}`
        );
      });
    } else {
      console.log("⚠️ No hay secciones personalizadas, usando plantilla base");
      if (activeTemplate?.sections) {
        console.log("📋 Secciones de plantilla base:");
        activeTemplate.sections.forEach((section: any) => {
          console.log(
            `  ${section.id}: ${
              section.enabled ? "HABILITADA" : "DESHABILITADA"
            }`
          );
        });
      }
    }

    try {
      const exporter = createTemplateAwareExporter(
        data,                // ← mantiene la firma original
        activeTemplate,      // AdvancedTemplate
        "single",
        advancedConfig       // AdvancedTemplateConfig | undefined
      );
      const res = exporter.export();

      console.log("✅ Resultado de exportación:", res);
      alert(res.message);
    } catch (e: any) {
      console.error("❌ Error en exportación:", e);
      alert("Error al exportar HTML: " + (e?.message || e));
    }
  };

  // ✅ Exportar sitio (multi) con avanzado
  const handleExportWebsite = () => {
    console.log("🔍 DEBUG - Estado actual:");
    console.log("- selectedTemplate:", selectedTemplate?.name);
    console.log("- activeTemplate:", activeTemplate?.name);
    console.log("- config:", advancedConfig);
    console.log(
      "- config?.customizations?.sections:",
      advancedConfig?.customizations?.sections
    );

    if (advancedConfig?.customizations?.sections) {
      console.log("📋 Secciones personalizadas:");
      advancedConfig.customizations.sections.forEach((section) => {
        console.log(
          `  ${section.id}: ${section.enabled ? "HABILITADA" : "DESHABILITADA"}`
        );
      });
    } else {
      console.log("⚠️ No hay secciones personalizadas, usando plantilla base");
      if (activeTemplate?.sections) {
        console.log("📋 Secciones de plantilla base:");
        activeTemplate.sections.forEach((section: any) => {
          console.log(
            `  ${section.id}: ${
              section.enabled ? "HABILITADA" : "DESHABILITADA"
            }`
          );
        });
      }
    }

    try {
      const exporter = createTemplateAwareExporter(
        data,                // ← mantiene la firma original
        activeTemplate,      // AdvancedTemplate
        "multi",
        advancedConfig       // AdvancedTemplateConfig | undefined
      );

      const res = exporter.export();
      console.log("✅ Resultado de exportación:", res);

      if (!res.success) {
        alert(res.message);
        return;
      }

      if ("files" in res && (res as any).files) {
        const files = (res as any).files as Record<string, string>;
        const entries = Object.entries(files);

        if (entries.length === 0) {
          alert(`${res.message}\nNo se recibieron archivos para descargar.`);
          return;
        }

        entries.forEach(([filename, content], idx) => {
          setTimeout(() => downloadFile(filename, content), idx * 600);
        });

        alert(`${res.message}\nSe han generado ${entries.length} archivos.`);
      } else {
        alert(
          `${res.message}\nEl exportador actual no expone 'files'. Usa "Exportar HTML" (single) o actualiza el exportador para devolver { files } en modo "multi".`
        );
      }
    } catch (e: any) {
      console.error("❌ Error en exportación:", e);
      alert("Error al exportar sitio: " + (e?.message || e));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editor de Portfolio</h1>
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Icons.Download size={16} />
            Exportar
            <Icons.ChevronDown size={16} />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
              <button
                onClick={() => {
                  handleExportJSON();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <Icons.FileDown size={16} />
                Exportar JSON
              </button>
              <button
                onClick={() => {
                  handleExportHTML();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <Icons.Download size={16} />
                Exportar HTML
              </button>
              <button
                onClick={() => {
                  handleExportWebsite();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <Icons.ExternalLink size={16} />
                Sitio Web + GitHub Pages
              </button>
              <hr className="my-1" />
              <button
                onClick={() => {
                  handleImportJSON();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <Icons.Upload size={16} />
                Importar JSON
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: "personal" as const, label: "Personal", icon: Icons.User },
          { id: "projects" as const, label: "Proyectos", icon: Icons.Code },
          { id: "skills" as const, label: "Habilidades", icon: Icons.Award },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeSection === section.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <section.icon size={16} />
            {section.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeSection === "personal" && (
          <PersonalInfoForm
            data={data.personalInfo}
            onUpdate={updatePersonalInfo}
          />
        )}

        {activeSection === "projects" && (
          <ProjectTableForm
            projects={data.projects}
            onUpdate={updateProject}
            onAdd={() => addItem("projects")}
            onRemove={(index) => removeItem("projects", index)}
          />
        )}

        {activeSection === "skills" && (
          <SkillTableForm
            skills={data.skills}
            onUpdate={updateSkill}
            onAdd={() => addItem("skills")}
            onRemove={(index) => removeItem("skills", index)}
          />
        )}
      </div>
    </div>
  );
};

export default ModernPortfolioEditor;

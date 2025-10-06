// src/components/editor/ModernPortfolioEditor.tsx
import React, { useState } from "react";
import { Icons } from "../portfolio-icons";
import { usePortfolioData, useDataExport } from "../portfolio-hooks";
import { createSSRExporter } from "../portfolio-export-ssr";
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
const handleExportHTML = async() => {
  try {
    const exporter = createSSRExporter(data, activeTemplate, advancedConfig);
    const res = await exporter.export();
    
    if (res.success) {
      alert('✅ Portfolio exportado correctamente');
    } else {
      alert('❌ Error: ' + res.message);
    }
  } catch (e: any) {
    console.error("❌ Error en exportación:", e);
    alert("Error al exportar: " + (e?.message || e));
  }
};

  // ✅ Exportar sitio (multi) con avanzado
// Exportar sitio web con SSR
const handleExportWebsite = async () => {
  try {
    const exporter = createSSRExporter(data, activeTemplate, advancedConfig);
    const res = await exporter.export();
    
    if (res.success) {
      alert('✅ Sitio web exportado correctamente!');
    } else {
      alert('❌ Error: ' + res.message);
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

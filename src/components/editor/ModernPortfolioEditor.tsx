import React, { useState } from "react";
import { Icons } from "../portfolio-icons";
import { usePortfolioData, useDataExport } from "../portfolio-hooks";
import { downloadFile, createTemplateAwareExporter } from "../portfolio-export";
import { PersonalInfoForm } from "../PersonalInfoForm";
import ProjectTableForm from "../ProjectTableForm";
import SkillTableForm from "../SkillTableForm";
import { useTemplates } from "../use-templates";
import { getDefaultTemplate } from "../built-in-templates";

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
  
  // ✅ Obtener templates con mejor debugging
  const { selectedTemplate, config, selectTemplate, updateConfig } = useTemplates();
  const activeTemplate = selectedTemplate ?? getDefaultTemplate();

  // Helper para filtrar proyectos con título válido
  const hasTitle = (p: { title?: string }) =>
    !!p.title && p.title.trim().length > 0;

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

  // ✅ FUNCIÓN CORREGIDA con debugging completo
  const handleExportHTML = () => {
    console.log('🔍 DEBUG - Estado actual:');
    console.log('- selectedTemplate:', selectedTemplate?.name);
    console.log('- activeTemplate:', activeTemplate?.name);
    console.log('- config:', config);
    console.log('- config?.customizations?.sections:', config?.customizations?.sections);
    
    if (config?.customizations?.sections) {
      console.log('📋 Secciones personalizadas:');
      config.customizations.sections.forEach(section => {
        console.log(`  ${section.id}: ${section.enabled ? 'HABILITADA' : 'DESHABILITADA'}`);
      });
    } else {
      console.log('⚠️ No hay secciones personalizadas, usando plantilla base');
      if (activeTemplate?.sections) {
        console.log('📋 Secciones de plantilla base:');
        activeTemplate.sections.forEach(section => {
          console.log(`  ${section.id}: ${section.enabled ? 'HABILITADA' : 'DESHABILITADA'}`);
        });
      }
    }

    try {
      const exporter = createTemplateAwareExporter(
        data,
        activeTemplate,
        "single",
        config || undefined
      );
      const res = exporter.export();
      
      console.log('✅ Resultado de exportación:', res);
      alert(res.message);
    } catch (e: any) {
      console.error('❌ Error en exportación:', e);
      alert("Error al exportar HTML: " + (e?.message || e));
    }
  };

  // ✅ FUNCIÓN CORREGIDA con debugging completo
  const handleExportWebsite = () => {
    console.log('🔍 DEBUG - Estado actual:');
    console.log('- selectedTemplate:', selectedTemplate?.name);
    console.log('- activeTemplate:', activeTemplate?.name);
    console.log('- config:', config);
    console.log('- config?.customizations?.sections:', config?.customizations?.sections);
    
    if (config?.customizations?.sections) {
      console.log('📋 Secciones personalizadas:');
      config.customizations.sections.forEach(section => {
        console.log(`  ${section.id}: ${section.enabled ? 'HABILITADA' : 'DESHABILITADA'}`);
      });
    } else {
      console.log('⚠️ No hay secciones personalizadas, usando plantilla base');
      if (activeTemplate?.sections) {
        console.log('📋 Secciones de plantilla base:');
        activeTemplate.sections.forEach(section => {
          console.log(`  ${section.id}: ${section.enabled ? 'HABILITADA' : 'DESHABILITADA'}`);
        });
      }
    }

    try {
      const exporter = createTemplateAwareExporter(
        data,
        activeTemplate,
        "multi",
        config || undefined
      );

      const res = exporter.export();
      console.log('✅ Resultado de exportación:', res);

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
      console.error('❌ Error en exportación:', e);
      alert("Error al exportar sitio: " + (e?.message || e));
    }
  };

  // ✅ FUNCIÓN PARA TESTING - Simular desmarcar "about"
  const handleTestDisableAbout = () => {
    if (!activeTemplate) return;
    
    console.log('🧪 TEST: Desmarcando sección "about"');
    
    // Crear copia de las secciones de la plantilla
    const updatedSections = activeTemplate.sections.map(section => ({
      ...section,
      enabled: section.id === 'about' ? false : section.enabled
    }));
    
    // Actualizar configuración
    updateConfig({
      customizations: {
        ...config?.customizations,
        sections: updatedSections
      }
    });
    
    console.log('✅ Sección "about" desmarcada. Nueva config:', {
      sections: updatedSections
    });
  };

  // ✅ FUNCIÓN PARA TESTING - Restablecer secciones
  const handleTestRestoreSections = () => {
    if (!activeTemplate) return;
    
    console.log('🔄 TEST: Restaurando secciones por defecto');
    
    updateConfig({
      customizations: {
        ...config?.customizations,
        sections: undefined // Esto hará que use las secciones de la plantilla base
      }
    });
    
    console.log('✅ Secciones restauradas');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Editor de Portfolio
        </h1>
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

      {/* ✅ PANEL DE DEBUGGING TEMPORAL */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-yellow-800 mb-2">🧪 Panel de Testing</h3>
        <div className="flex gap-2 mb-3">
          <button
            onClick={handleTestDisableAbout}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Desmarcar "About"
          </button>
          <button
            onClick={handleTestRestoreSections}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            Restaurar Secciones
          </button>
          <button
            onClick={() => console.log('Estado actual:', { selectedTemplate, config })}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Ver Estado
          </button>
        </div>
        <div className="text-sm text-yellow-700">
          <strong>Plantilla:</strong> {activeTemplate?.name}<br />
          <strong>Config:</strong> {config ? 'Presente' : 'Nulo'}<br />
          <strong>Secciones personalizadas:</strong> {config?.customizations?.sections ? 'Sí' : 'No'}
        </div>
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: "personal" as const, label: "Personal", icon: Icons.User },
          { id: "projects" as const, label: "Proyectos", icon: Icons.Code },
          { id: "skills" as const, label: "Habilidades", icon: Icons.Award },
          { id: "templates" as const, label: "Plantillas", icon: Icons.Settings },
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

        {activeSection === "templates" && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Configuración de Plantillas</h2>
            
            {/* Selector básico de plantillas */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plantilla Actual: <strong>{activeTemplate?.name}</strong>
              </label>
              <p className="text-sm text-gray-600 mb-4">
                {activeTemplate?.description}
              </p>
            </div>

            {/* Control de secciones */}
            <div>
              <h3 className="text-lg font-medium mb-3">Secciones del Portfolio</h3>
              <div className="space-y-2">
                {activeTemplate?.sections.map((section) => {
                  const isCustomized = !!config?.customizations?.sections;
                  const currentSection = isCustomized 
                    ? config.customizations.sections?.find(s => s.id === section.id) 
                    : section;
                  
                  return (
                    <label key={section.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={currentSection?.enabled ?? section.enabled}
                        onChange={(e) => {
                          const updatedSections = (config?.customizations?.sections || activeTemplate.sections).map(s => 
                            s.id === section.id 
                              ? { ...s, enabled: e.target.checked }
                              : s
                          );
                          
                          updateConfig({
                            customizations: {
                              ...config?.customizations,
                              sections: updatedSections
                            }
                          });
                        }}
                        className="mr-3"
                      />
                      <span className="text-sm">
                        {section.name} 
                        <span className="text-gray-500">({section.id})</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernPortfolioEditor;
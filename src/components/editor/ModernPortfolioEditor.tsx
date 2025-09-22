// ModernPortfolioEditor.tsx - QUE SÍ FUNCIONA
import React, { useState } from 'react';
import { Icons } from '../portfolio-icons';
import { usePortfolioData } from '../portfolio-hooks';
import { PersonalInfoForm } from '../PersonalInfoForm';
import ProjectTableForm from '../ProjectTableForm';
import SkillTableForm from '../SkillTableForm';

const ModernPortfolioEditor: React.FC = () => {
  // ✅ Usar el hook correcto
  const {
    data,
    updatePersonalInfo,
    updateProject,
    updateSkill,
    addItem,
    removeItem,
    saveStatus
  } = usePortfolioData();

  const [activeTab, setActiveTab] = useState("personal");

  // Función para calcular progreso usando fullName
  const calculateProgress = () => {
    let completed = 0;
    const total = 4;

    // Información personal
    if (
      data?.personalInfo?.fullName?.trim() &&
      data?.personalInfo?.title?.trim() &&
      data?.personalInfo?.email?.trim()
    ) {
      completed++;
    }

    // Proyectos
    if (data?.projects?.some(p => p.title?.trim() && p.description?.trim())) {
      completed++;
    }

    // Habilidades  
    if (data?.skills?.some(s => s.category?.trim() && s.items?.trim())) {
      completed++;
    }

    // Experiencia
    if (data?.experience?.some(e => e.company?.trim() && e.position?.trim())) {
      completed++;
    }

    return Math.round((completed / total) * 100);
  };

  // ✅ Configuración de tabs que SÍ FUNCIONAN
  const tabs = [
    {
      id: "personal",
      label: "👤 Información Personal",
      content: (
        <PersonalInfoForm
          data={data.personalInfo}
          onUpdate={updatePersonalInfo}
        />
      ),
    },
    {
      id: "projects",
      label: "🚀 Proyectos",
      content: (
        <ProjectTableForm
          projects={data.projects}
          onUpdate={updateProject}
          onAdd={() => addItem('projects')}
          onRemove={(index) => removeItem('projects', index)}
        />
      ),
    },
    {
      id: "skills",
      label: "🎯 Habilidades",
      content: (
        <SkillTableForm
          skills={data.skills}
          onUpdate={updateSkill}
          onAdd={() => addItem('skills')}
          onRemove={(index) => removeItem('skills', index)}
        />
      ),
    },
    {
      id: "experience",
      label: "💼 Experiencia",
      content: (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Experiencia Laboral</h3>
          <p className="text-gray-600">
            Esta sección estará disponible pronto. Por ahora puedes usar el JSON para añadir experiencia.
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Usa el menú "Datos" → "Importar JSON" para añadir experiencia manualmente.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header con progreso */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Editor de Portfolio
              </h1>
              <p className="text-gray-600 text-sm">
                Crea tu portfolio profesional paso a paso
              </p>
            </div>

            {/* Barra de progreso */}
            <div className="flex items-center gap-4">
              {saveStatus && (
                <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {saveStatus}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Progreso:</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido del tab activo */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {tabs.find(tab => tab.id === activeTab)?.content}
        </div>
      </div>

      {/* Footer con información de ayuda */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Icons.Info size={16} />
              <span>Tus cambios se guardan automáticamente</span>
            </div>
            <div className="flex items-center gap-2">
              <span>•</span>
              <span>Completa todas las secciones para un portfolio exitoso</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernPortfolioEditor;
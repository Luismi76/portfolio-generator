// SimpleModernEditor.tsx - SOLUCIÓN COMPLETA
import React from 'react';
import { usePortfolioData } from '../portfolio-hooks';
import { Icons } from '../portfolio-icons';

const SimpleModernEditor: React.FC = () => {
  // ✅ CORREGIDO - Extraer datos del hook correctamente
  const { data, saveStatus } = usePortfolioData();

  // ✅ CORREGIDO - Función para calcular progreso usando fullName
  const calculateProgress = () => {
    let completed = 0;
    const total = 4;

    // Información personal - usar fullName en lugar de name
    if (
      data?.personalInfo?.fullName?.trim() && 
      data?.personalInfo?.email?.trim() && 
      data?.personalInfo?.summary?.trim()
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

  const progress = calculateProgress();

  // Datos para las estadísticas
  const stats = [
    {
      label: 'Proyectos',
      value: data?.projects?.filter(p => p.title?.trim()).length || 0,
      icon: Icons.Code,
      color: 'bg-blue-500'
    },
    {
      label: 'Habilidades',
      value: data?.skills?.filter(s => s.category?.trim()).length || 0,
      icon: Icons.Award,
      color: 'bg-green-500'
    },
    {
      label: 'Experiencias',
      value: data?.experience?.filter(e => e.company?.trim()).length || 0,
      icon: Icons.Briefcase,
      color: 'bg-purple-500'
    },
    {
      label: 'Logros',
      value: data?.achievements?.filter(a => a.title?.trim()).length || 0,
      icon: Icons.Trophy,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard del Portfolio
              </h1>
              <p className="text-gray-600 mt-1">
                Resumen de tu progreso y contenido
              </p>
            </div>
            
            {saveStatus && (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                {saveStatus}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Barra de progreso principal */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Progreso del Portfolio
            </h2>
            <span className="text-2xl font-bold text-blue-600">
              {progress}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <div className="text-sm font-medium text-blue-900">Personal</div>
              <div className="text-xs text-blue-600">
                {data?.personalInfo?.fullName?.trim() ? '✅' : '⏳'} Información
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <div className="text-sm font-medium text-green-900">Proyectos</div>
              <div className="text-xs text-green-600">
                {data?.projects?.some(p => p.title?.trim()) ? '✅' : '⏳'} Contenido
              </div>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <div className="text-sm font-medium text-purple-900">Habilidades</div>
              <div className="text-xs text-purple-600">
                {data?.skills?.some(s => s.category?.trim()) ? '✅' : '⏳'} Listadas
              </div>
            </div>
            <div className="p-3 rounded-lg bg-orange-50">
              <div className="text-sm font-medium text-orange-900">Experiencia</div>
              <div className="text-xs text-orange-600">
                {data?.experience?.some(e => e.company?.trim()) ? '✅' : '⏳'} Añadida
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas en tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vista previa de contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información personal */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Icons.User size={20} className="text-blue-600" />
              Información Personal
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Nombre:</span>
                <p className="font-medium">
                  {data?.personalInfo?.fullName || 'Sin especificar'}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Título:</span>
                <p className="font-medium">
                  {data?.personalInfo?.title || 'Sin especificar'}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email:</span>
                <p className="font-medium">
                  {data?.personalInfo?.email || 'Sin especificar'}
                </p>
              </div>
            </div>
          </div>

          {/* Proyectos recientes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Icons.Code size={20} className="text-green-600" />
              Proyectos Recientes
            </h3>
            <div className="space-y-3">
              {data?.projects?.slice(0, 3).map((project, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-3">
                  <p className="font-medium">
                    {project.title || `Proyecto ${index + 1}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {project.technologies || 'Sin tecnologías especificadas'}
                  </p>
                </div>
              ))}
              {(!data?.projects || data.projects.length === 0) && (
                <p className="text-gray-500 italic">No hay proyectos añadidos</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleModernEditor;
import React, { useState, useEffect } from 'react';
import { PortfolioData, Project, DEFAULT_PORTFOLIO_DATA } from '../../types/portfolio-types';
import { TechList } from '../TechIcons';
import { getDefaultTemplate } from '../built-in-templates';

const PortfolioViewer: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [template] = useState(getDefaultTemplate());

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('portfolioData');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  const headerStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
    color: 'white'
  };

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <header className="sticky top-0 z-10 bg-white shadow-md border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <button
              onClick={() => setSelectedProject(null)}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              ← Volver al Portfolio
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {selectedProject.image && (
            <div className="mb-8">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              {selectedProject.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {selectedProject.description}
            </p>
          </div>

          {(selectedProject.link || selectedProject.github) && (
            <div className="flex flex-wrap gap-4 mb-8">
              {selectedProject.link && (
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 no-underline font-medium"
                >
                  Ver Proyecto Live
                </a>
              )}
              {selectedProject.github && (
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 text-gray-700 no-underline font-medium"
                >
                  Ver Código
                </a>
              )}
            </div>
          )}

          {selectedProject.technologies && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Tecnologías Utilizadas</h2>
              <TechList technologies={selectedProject.technologies} variant="minimal" />
            </div>
          )}

          {selectedProject.detailedDescription && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Descripción Detallada</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  {selectedProject.detailedDescription}
                </p>
              </div>
            </div>
          )}

          {selectedProject.features && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Características Principales</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <ul className="space-y-3">
                  {selectedProject.features.split(',').map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                      <span className="text-gray-700">{feature.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {selectedProject.instructions && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Instrucciones de Uso</h2>
              <div className="bg-gray-100 p-6 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono overflow-x-auto">
                  {selectedProject.instructions}
                </pre>
              </div>
            </div>
          )}

          {selectedProject.challenges && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Desafíos Técnicos</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  {selectedProject.challenges}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header style={headerStyle} className="relative">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {data.personalInfo.fullName || 'Tu Portfolio'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {data.personalInfo.title || 'Desarrollador Professional'}
            </p>
            {data.personalInfo.summary && (
              <p className="text-lg md:text-xl opacity-80 max-w-3xl mx-auto leading-relaxed">
                {data.personalInfo.summary}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          {data.projects.filter(p => p.title.trim()).length > 0 && (
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Proyectos Destacados
                </h2>
                <div
                  className="w-24 h-1 mx-auto rounded-full"
                  style={{ backgroundColor: template.colors.accent }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.projects.filter(p => p.title.trim()).map((project, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {project.image && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      {project.technologies && (
                        <div className="mb-6">
                          <TechList
                            technologies={project.technologies.split(',').slice(0, 4).join(',')}
                            variant="minimal"
                          />
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedProject(project)}
                        className="w-full text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors font-medium"
                        style={{ backgroundColor: template.colors.primary }}
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills.filter(s => s.category.trim()).length > 0 && (
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Habilidades y Competencias
                </h2>
                <div
                  className="w-24 h-1 mx-auto rounded-full"
                  style={{ backgroundColor: template.colors.accent }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.skills.filter(s => s.category.trim()).map((skill, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {skill.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skill.items
                        .split(',')
                        .filter(item => item.trim())
                        .map((item, itemIndex) => (
                          <span
                            key={itemIndex}
                            className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                            style={{
                              backgroundColor: template.colors.accent + '20',
                              color: template.colors.accent
                            }}
                          >
                            {item.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <footer style={headerStyle} className="relative">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 container mx-auto px-4 py-12 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">¿Hablamos?</h3>
            <p className="text-lg opacity-90 mb-6">
              Estoy disponible para nuevos proyectos y colaboraciones
            </p>
          </div>

          <div className="flex justify-center items-center gap-8 flex-wrap mb-8">
            {data.personalInfo.email && (
              <a
                href={`mailto:${data.personalInfo.email}`}
                className="text-white hover:opacity-80 transition-opacity no-underline font-medium flex items-center gap-2"
              >
                Email
              </a>
            )}
            {data.personalInfo.github && (
              <a
                href={data.personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition-opacity no-underline font-medium flex items-center gap-2"
              >
                GitHub
              </a>
            )}
            {data.personalInfo.linkedin && (
              <a
                href={data.personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition-opacity no-underline font-medium flex items-center gap-2"
              >
                LinkedIn
              </a>
            )}
            {data.personalInfo.website && (
              <a
                href={data.personalInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition-opacity no-underline font-medium flex items-center gap-2"
              >
                Website
              </a>
            )}
          </div>

          <div className="border-t border-white border-opacity-20 pt-6">
            <p className="text-sm opacity-75">
              © {new Date().getFullYear()} {data.personalInfo.fullName || 'Portfolio'}. Hecho con Portfolio Generator.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioViewer;


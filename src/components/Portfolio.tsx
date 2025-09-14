import React, { useEffect, useState } from "react";
import { TechList } from "./TechIcons";

// Types (mismos que el generador)
interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  summary: string;
}

interface Project {
  title: string;
  description: string;
  technologies: string;
  link: string;
  github: string;
}

interface Skill {
  category: string;
  items: string;
}

interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  period: string;
  description: string;
}

interface Achievement {
  title: string;
  description: string;
  date: string;
}

interface PortfolioData {
  personalInfo: PersonalInfo;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  achievements: Achievement[];
}

const Portfolio: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Función para cambiar modo
  const switchMode = (mode: "editor" | "portfolio") => {
    localStorage.setItem("portfolioMode", mode);
    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode);
    window.location.href = url.toString();
  };

  useEffect(() => {
    // Función para cargar datos
    const loadPortfolioData = () => {
      const savedData = localStorage.getItem("portfolioData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setPortfolioData(parsedData);
          console.log("Datos cargados exitosamente:", parsedData);
        } catch (error) {
          console.error("Error parsing saved data:", error);
          setPortfolioData(getDefaultData());
        }
      } else {
        console.log("No hay datos guardados, usando datos por defecto");
        setPortfolioData(getDefaultData());
      }
      setLoading(false);
    };

    // Función para datos por defecto
    const getDefaultData = (): PortfolioData => ({
      personalInfo: {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        github: "",
        linkedin: "",
        summary: "",
      },
      projects: [
        {
          title: "",
          description: "",
          technologies: "",
          link: "",
          github: "",
        },
      ],
      skills: [
        {
          category: "",
          items: "",
        },
      ],
      experience: [
        {
          company: "",
          position: "",
          period: "",
          description: "",
        },
      ],
      education: [
        {
          institution: "",
          degree: "",
          period: "",
          description: "",
        },
      ],
      achievements: [
        {
          title: "",
          description: "",
          date: "",
        },
      ],
    });

    loadPortfolioData();

    // Escuchar cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portfolioData") {
        console.log("Datos actualizados en localStorage");
        loadPortfolioData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando portfolio...</p>
        </div>
      </div>
    );
  }

  // Función para verificar si hay datos configurados
  const hasConfiguredData = (data: PortfolioData): boolean => {
    return !!(
      data.personalInfo.name.trim() ||
      data.personalInfo.title.trim() ||
      data.projects.some((p) => p.title.trim()) ||
      data.skills.some((s) => s.category.trim())
    );
  };

  if (!portfolioData || !hasConfiguredData(portfolioData)) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Barra superior */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Mi Portfolio</h1>
              <p className="text-gray-600">Vista del portfolio público</p>
            </div>

            {/* Toggle de modo */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => switchMode("editor")}
                className="px-3 py-1 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-gray-800"
              >
                Editor
              </button>
              <button
                onClick={() => switchMode("portfolio")}
                className="px-3 py-1 rounded-md text-sm font-medium transition-colors bg-blue-600 text-white"
              >
                Portfolio
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
              📝
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Portfolio en construcción
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Tu portfolio está casi listo! Para verlo completo, primero
              configura tu información personal y proyectos en el modo editor.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => switchMode("editor")}
                className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Ir al Editor
              </button>
              <p className="text-sm text-gray-500">
                Completa tu información y vuelve aquí para ver el resultado
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    personalInfo,
    projects,
    skills,
  } = portfolioData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra superior */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Mi Portfolio</h1>
            <p className="text-gray-600">Vista del portfolio público</p>
          </div>

          {/* Toggle de modo */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => switchMode("editor")}
              className="px-3 py-1 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-gray-800"
            >
              Editor
            </button>
            <button
              onClick={() => switchMode("portfolio")}
              className="px-3 py-1 rounded-md text-sm font-medium transition-colors bg-blue-600 text-white"
            >
              Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Header del portfolio */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {personalInfo.name || "Tu Nombre"}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {personalInfo.title || "Tu Título Profesional"}
            </p>
            {personalInfo.summary && (
              <p className="text-lg mb-10 max-w-3xl mx-auto leading-relaxed opacity-95">
                {personalInfo.summary}
              </p>
            )}

            {/* Contact Info */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {personalInfo.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full hover:bg-opacity-20 transition-all"
                >
                  ✉️ {personalInfo.email}
                </a>
              )}
              {personalInfo.phone && (
                <a
                  href={`tel:${personalInfo.phone}`}
                  className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full hover:bg-opacity-20 transition-all"
                >
                  📱 {personalInfo.phone}
                </a>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full">
                  📍 {personalInfo.location}
                </div>
              )}
              {personalInfo.website && (
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full hover:bg-opacity-20 transition-all"
                >
                  🌐 Website
                </a>
              )}
              {personalInfo.github && (
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full hover:bg-opacity-20 transition-all"
                >
                  📁 GitHub
                </a>
              )}
              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full hover:bg-opacity-20 transition-all"
                >
                  💼 LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Projects Section */}
        {projects.filter((p) => p.title.trim()).length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Proyectos Destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects
                .filter((p) => p.title.trim())
                .map((project, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-4 text-gray-800">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {project.description}
                      </p>

                      {project.technologies && (
                        <TechList
                          technologies={project.technologies}
                          variant="default"
                          className="mb-6"
                        />
                      )}

                      <div className="flex gap-4">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            🚀 Ver Proyecto
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            📁 Código
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills.filter((s) => s.category.trim()).length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Habilidades Técnicas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills
                .filter((s) => s.category.trim())
                .map((skill, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300"
                  >
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">
                      {skill.category}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {skill.items && (
                        <TechList
                          technologies={skill.items}
                          variant="outlined"
                          className=""
                        />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} {personalInfo.name || "Tu Nombre"}.
            Todos los derechos reservados.
          </p>
          <p className="text-gray-400 mt-2 text-sm">
            Portfolio creado con React y TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;

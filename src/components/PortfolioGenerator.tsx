import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Download,
  Eye,
  User,
  Code,
  Award,
  ExternalLink,
  FileDown,
  Upload,
  ChevronDown,
  Settings,
} from "lucide-react";

// Types
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
  detailedDescription?: string; // Nueva: descripción extendida
  technologies: string;
  link: string;
  github: string;
  image?: string;
  images?: string; // Cambiado a string separado por comas
  videos?: string; // Cambiado a string separado por comas
  instructions?: string; // Nueva: instrucciones de uso
  features?: string; // Cambiado a string separado por comas
  challenges?: string; // Nueva: desafíos técnicos
  slug?: string; // Nueva: identificador único para la URL
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

type SectionKey =
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "achievements";
type PersonalInfoKey = keyof PersonalInfo;

const PortfolioGenerator: React.FC = () => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [showDataMenu, setShowDataMenu] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dataMenuRef = useRef<HTMLDivElement>(null);

  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
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
        detailedDescription: "",
        technologies: "",
        link: "",
        github: "",
        image: "",
        images: "",
        videos: "",
        instructions: "",
        features: "",
        challenges: "",
        slug: "",
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

  // Cargar datos al inicio
  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem("portfolioData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setPortfolioData(parsedData);
          setSaveStatus("Datos cargados ✅");
          setTimeout(() => setSaveStatus(""), 2000);
        } catch (error) {
          console.error("Error cargando datos:", error);
        }
      }
      setDataLoaded(true);
    };

    loadData();
  }, []);

  // Guardar datos automáticamente
  useEffect(() => {
    if (!dataLoaded) return;

    const saveData = () => {
      localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
      setSaveStatus("Guardado ✅");
      setTimeout(() => setSaveStatus(""), 1000);
    };

    saveData();
  }, [portfolioData, dataLoaded]);

  // Cerrar el menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dataMenuRef.current &&
        !dataMenuRef.current.contains(event.target as Node)
      ) {
        setShowDataMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Guardar antes de cerrar la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [portfolioData]);

  // Función para cambiar modo
  const switchMode = (mode: "editor" | "portfolio") => {
    localStorage.setItem("portfolioMode", mode);
    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode);
    window.location.href = url.toString();
  };

  // Generar slug automáticamente
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const updatePersonalInfo = (field: PersonalInfoKey, value: string): void => {
    setPortfolioData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateProjectSection = (
    index: number,
    field: keyof Project,
    value: string
  ): void => {
    setPortfolioData((prev) => ({
      ...prev,
      projects: prev.projects.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          // Auto-generar slug cuando cambia el título
          if (field === 'title') {
            updatedItem.slug = generateSlug(value);
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const updateSkillSection = (
    index: number,
    field: keyof Skill,
    value: string
  ): void => {
    setPortfolioData((prev) => ({
      ...prev,
      skills: prev.skills.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Función específica para manejar archivos de imagen
  const handleImageFileUpload = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen debe ser menor a 5MB");
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPortfolioData((prev) => ({
        ...prev,
        projects: prev.projects.map((item, i) =>
          i === index ? { ...item, image: base64 } : item
        ),
      }));
      setSaveStatus("Imagen cargada ✅");
      setTimeout(() => setSaveStatus(""), 2000);
    };
    reader.onerror = () => {
      setSaveStatus("Error al cargar imagen ❌");
      setTimeout(() => setSaveStatus(""), 2000);
    };
    reader.readAsDataURL(file);

    // Limpiar el input
    event.target.value = "";
  };

  const addItem = (section: SectionKey): void => {
    const newItems = {
      projects: {
        title: "",
        description: "",
        detailedDescription: "",
        technologies: "",
        link: "",
        github: "",
        image: "",
        images: "",
        videos: "",
        instructions: "",
        features: "",
        challenges: "",
        slug: "",
      },
      skills: { category: "", items: "" },
      experience: { company: "", position: "", period: "", description: "" },
      education: { institution: "", degree: "", period: "", description: "" },
      achievements: { title: "", description: "", date: "" },
    };

    setPortfolioData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItems[section]],
    }));
  };

  const removeItem = (section: SectionKey, index: number): void => {
    setPortfolioData((prev) => {
      const newData = { ...prev };
      switch (section) {
        case "projects":
          newData.projects = newData.projects.filter((_, i) => i !== index);
          break;
        case "skills":
          newData.skills = newData.skills.filter((_, i) => i !== index);
          break;
        case "experience":
          newData.experience = newData.experience.filter((_, i) => i !== index);
          break;
        case "education":
          newData.education = newData.education.filter((_, i) => i !== index);
          break;
        case "achievements":
          newData.achievements = newData.achievements.filter(
            (_, i) => i !== index
          );
          break;
      }
      return newData;
    });
  };

  const exportData = (): void => {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-data-${
      portfolioData.personalInfo.name || "backup"
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSaveStatus("Datos exportados ✅");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        setPortfolioData(importedData);
        setSaveStatus("Datos importados ✅");
        setTimeout(() => setSaveStatus(""), 2000);
      } catch (error) {
        setSaveStatus("Error al importar ❌");
        setTimeout(() => setSaveStatus(""), 2000);
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearAllData = (): void => {
    if (
      window.confirm("¿Estás seguro de que quieres borrar todos los datos?")
    ) {
      const emptyData: PortfolioData = {
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
            detailedDescription: "",
            technologies: "",
            link: "",
            github: "",
            image: "",
            images: "",
            videos: "",
            instructions: "",
            features: "",
            challenges: "",
            slug: "",
          },
        ],
        skills: [{ category: "", items: "" }],
        experience: [
          { company: "", position: "", period: "", description: "" },
        ],
        education: [
          { institution: "", degree: "", period: "", description: "" },
        ],
        achievements: [{ title: "", description: "", date: "" }],
      };
      setPortfolioData(emptyData);
      localStorage.removeItem("portfolioData");
      setSaveStatus("Datos borrados ✅");
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  const exportHTML = (): void => {
    const htmlContent = generateHTML();
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${portfolioData.personalInfo.name || "portfolio"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateHTML = (): string => {
    const projectsHTML = portfolioData.projects
      .filter((p) => p.title.trim())
      .map(
        (project) => `
        <div class="project-card">
          ${
            project.image
              ? `<img src="${project.image}" alt="${project.title}" class="project-image">`
              : ""
          }
          <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            ${
              project.technologies
                ? `
            <div class="tech-tags">
              ${project.technologies
                .split(",")
                .map((tech) => {
                  const techName = tech.trim();
                  const iconUrl = getTechIconUrl(techName);
                  return `<span class="tech-tag">
                  ${
                    iconUrl
                      ? `<img src="${iconUrl}" alt="${techName}" class="tech-icon">`
                      : ""
                  }
                  ${techName}
                </span>`;
                })
                .join("")}
            </div>`
                : ""
            }
            <div class="project-links">
              ${
                project.link
                  ? `<a href="${project.link}" target="_blank">Ver Proyecto</a>`
                  : ""
              }
              ${
                project.github
                  ? `<a href="${project.github}" target="_blank">Código</a>`
                  : ""
              }
            </div>
          </div>
        </div>
      `
      )
      .join("");

    const skillsHTML = portfolioData.skills
      .filter((s) => s.category.trim())
      .map(
        (skill) => `
        <div class="skill-category">
          <h3>${skill.category}</h3>
          <div class="skill-items">
            ${skill.items
              .split(",")
              .map((item) => {
                const skillName = item.trim();
                const iconUrl = getTechIconUrl(skillName);
                return `<span class="skill-item">
                ${
                  iconUrl
                    ? `<img src="${iconUrl}" alt="${skillName}" class="tech-icon">`
                    : ""
                }
                ${skillName}
              </span>`;
              })
              .join("")}
          </div>
        </div>
      `
      )
      .join("");

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolioData.personalInfo.name || "Portfolio"}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 80px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 20px; margin-bottom: 40px; }
        .header h1 { font-size: 3.5em; margin-bottom: 15px; }
        .header .title { font-size: 1.8em; opacity: 0.9; margin-bottom: 25px; }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; }
        .project-card { background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .project-image { width: 100%; height: 200px; object-fit: cover; }
        .project-content { padding: 25px; }
        .project-card h3 { color: #667eea; margin-bottom: 15px; }
        .tech-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; }
        .tech-tag { display: flex; align-items: center; gap: 6px; background: #e0e7ff; color: #667eea; padding: 5px 12px; border-radius: 20px; font-size: 0.9em; }
        .tech-icon { width: 16px; height: 16px; }
        .project-links { display: flex; gap: 10px; margin-top: 15px; }
        .project-links a { background: #667eea; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 0.9em; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .skill-category { background: white; border-radius: 15px; padding: 25px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .skill-items { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill-item { display: flex; align-items: center; gap: 6px; background: #667eea; color: white; padding: 8px 16px; border-radius: 25px; font-size: 0.9em; }
        .section { margin: 60px 0; }
        .section h2 { font-size: 2.5em; text-align: center; margin-bottom: 40px; color: #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>${portfolioData.personalInfo.name || "Tu Nombre"}</h1>
            <div class="title">${
              portfolioData.personalInfo.title || "Tu Título"
            }</div>
            ${
              portfolioData.personalInfo.summary
                ? `<p>${portfolioData.personalInfo.summary}</p>`
                : ""
            }
        </header>
        ${
          projectsHTML
            ? `<section class="section"><h2>Proyectos</h2><div class="projects-grid">${projectsHTML}</div></section>`
            : ""
        }
        ${
          skillsHTML
            ? `<section class="section"><h2>Habilidades</h2><div class="skills-grid">${skillsHTML}</div></section>`
            : ""
        }
    </div>
</body>
</html>`;
  };

  // Función helper para obtener URL del icono
  const getTechIconUrl = (tech: string): string => {
    const techIcons: Record<string, string> = {
      python:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      "sql server":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg",
      "power bi":
        "https://raw.githubusercontent.com/microsoft/PowerBI-Icons/main/SVG/Power-BI.svg",
      "api rest":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
      javascript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      react:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      nodejs:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      typescript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    };

    const normalizedTech = tech.toLowerCase().trim();
    return techIcons[normalizedTech] || "";
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Vista Previa</h1>
            <div className="flex gap-3">
              <button
                onClick={exportHTML}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Download size={16} />
                HTML
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Volver
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4">
          <iframe
            srcDoc={generateHTML()}
            className="w-full h-screen bg-white rounded-lg shadow-lg"
            title="Portfolio Preview"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Generador de Portfolio
              </h1>
              <p className="text-gray-600">Crea tu portfolio profesional</p>
              {saveStatus && (
                <p className="text-sm text-green-600 mt-1">{saveStatus}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye size={16} />
                Vista Previa
              </button>

              <button
                onClick={exportHTML}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={16} />
                HTML
              </button>

              <div className="relative" ref={dataMenuRef}>
                <button
                  onClick={() => setShowDataMenu(!showDataMenu)}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Settings size={16} />
                  Datos
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showDataMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showDataMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          exportData();
                          setShowDataMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        <FileDown size={16} />
                        Exportar JSON
                      </button>
                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowDataMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        <Upload size={16} />
                        Importar JSON
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          clearAllData();
                          setShowDataMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Limpiar Todo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-8 bg-gray-300"></div>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => switchMode("editor")}
                  className="px-3 py-1 rounded-md text-sm font-medium transition-colors bg-blue-600 text-white"
                >
                  Editor
                </button>
                <button
                  onClick={() => switchMode("portfolio")}
                  className="px-3 py-1 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-gray-800"
                >
                  Portfolio
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Información Personal */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">
                Información Personal
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre completo"
                value={portfolioData.personalInfo.name}
                onChange={(e) => updatePersonalInfo("name", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Título profesional"
                value={portfolioData.personalInfo.title}
                onChange={(e) => updatePersonalInfo("title", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                value={portfolioData.personalInfo.email}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={portfolioData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <textarea
              placeholder="Resumen profesional"
              value={portfolioData.personalInfo.summary}
              onChange={(e) => updatePersonalInfo("summary", e.target.value)}
              rows={4}
              className="w-full mt-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Proyectos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Code className="text-blue-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">
                  Proyectos
                </h2>
              </div>
              <button
                onClick={() => addItem("projects")}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm"
              >
                <Plus size={16} />
                Añadir
              </button>
            </div>

            <div className="space-y-6">
              {portfolioData.projects.map((project, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-700">
                      Proyecto {index + 1}
                    </h4>
                    {portfolioData.projects.length > 1 && (
                      <button
                        onClick={() => removeItem("projects", index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Título y Tecnologías */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Nombre del proyecto"
                      value={project.title}
                      onChange={(e) =>
                        updateProjectSection(index, "title", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Tecnologías (separadas por comas)"
                      value={project.technologies}
                      onChange={(e) =>
                        updateProjectSection(
                          index,
                          "technologies",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Descripción básica */}
                  <textarea
                    placeholder="Descripción del proyecto (breve para el portfolio)"
                    value={project.description}
                    onChange={(e) =>
                      updateProjectSection(index, "description", e.target.value)
                    }
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mb-3"
                  />

                  {/* Descripción detallada */}
                  <textarea
                    placeholder="Descripción detallada (para la página del proyecto)"
                    value={project.detailedDescription || ""}
                    onChange={(e) =>
                      updateProjectSection(
                        index,
                        "detailedDescription",
                        e.target.value
                      )
                    }
                    rows={6}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mb-3"
                  />

                  {/* Campo de imagen principal */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagen principal del proyecto
                    </label>

                    {/* Input URL */}
                    <input
                      type="url"
                      placeholder="https://ejemplo.com/imagen.png"
                      value={
                        project.image && !project.image.startsWith("data:")
                          ? project.image
                          : ""
                      }
                      onChange={(e) =>
                        updateProjectSection(index, "image", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mb-2"
                    />

                    {/* Separador */}
                    <div className="flex items-center my-3">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="px-3 text-sm text-gray-500">o</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Zona de subida de archivos */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(index, e)}
                        className="hidden"
                        id={`image-upload-${index}`}
                      />
                      <label
                        htmlFor={`image-upload-${index}`}
                        className="cursor-pointer block"
                      >
                        <div className="text-gray-600 mb-2 text-2xl">📁</div>
                        <div className="text-sm text-gray-600 font-medium">
                          Haz clic para seleccionar una imagen
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          PNG, JPG, GIF hasta 5MB
                        </div>
                      </label>
                    </div>

                    {/* Preview de la imagen */}
                    {project.image && project.image.trim() && (
                      <div className="mt-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={project.image}
                            alt="Preview"
                            className="w-24 h-16 object-cover rounded border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-green-600 font-medium">
                                ✅ Imagen cargada
                              </span>
                              <button
                                onClick={() =>
                                  updateProjectSection(index, "image", "")
                                }
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                Eliminar
                              </button>
                            </div>
                            <div className="text-xs text-gray-500">
                              {project.image.startsWith("data:")
                                ? "Archivo local (convertido a Base64)"
                                : "URL externa"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Galería de imágenes adicionales */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Galería de imágenes (URLs separadas por comas)
                    </label>
                    <input
                      type="text"
                      placeholder="https://img1.com, https://img2.com, https://img3.com"
                      value={project.images || ""}
                      onChange={(e) =>
                        updateProjectSection(index, "images", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Videos */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Videos demostrativos (URLs separadas por comas)
                    </label>
                    <input
                      type="text"
                      placeholder="https://youtube.com/watch?v=abc, https://vimeo.com/123"
                      value={project.videos || ""}
                      onChange={(e) =>
                        updateProjectSection(index, "videos", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Características */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Características principales (separadas por comas)
                    </label>
                    <input
                      type="text"
                      placeholder="Responsivo, API REST, Autenticación, Dashboard"
                      value={project.features || ""}
                      onChange={(e) =>
                        updateProjectSection(index, "features", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Instrucciones */}
                  <textarea
                    placeholder="Instrucciones de uso o instalación (opcional)"
                    value={project.instructions || ""}
                    onChange={(e) =>
                      updateProjectSection(
                        index,
                        "instructions",
                        e.target.value
                      )
                    }
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mb-3"
                  />

                  {/* Desafíos técnicos */}
                  <textarea
                    placeholder="Desafíos técnicos o aprendizajes (opcional)"
                    value={project.challenges || ""}
                    onChange={(e) =>
                      updateProjectSection(index, "challenges", e.target.value)
                    }
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mb-3"
                  />

                  {/* Enlaces */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="url"
                      placeholder="Link del proyecto (opcional)"
                      value={project.link}
                      onChange={(e) =>
                        updateProjectSection(index, "link", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      placeholder="Repositorio GitHub (opcional)"
                      value={project.github}
                      onChange={(e) =>
                        updateProjectSection(index, "github", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Mostrar slug generado */}
                  {project.title && (
                    <div className="mt-2 text-xs text-gray-500">
                      URL del proyecto: /project/{project.slug || generateSlug(project.title)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Habilidades */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="text-blue-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">
                  Habilidades
                </h2>
              </div>
              <button
                onClick={() => addItem("skills")}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm"
              >
                <Plus size={16} />
                Añadir
              </button>
            </div>

            <div className="space-y-4">
              {portfolioData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-700">
                      Categoría {index + 1}
                    </h4>
                    {portfolioData.skills.length > 1 && (
                      <button
                        onClick={() => removeItem("skills", index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nombre de la categoría"
                      value={skill.category}
                      onChange={(e) =>
                        updateSkillSection(index, "category", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Habilidades (separadas por comas)"
                      value={skill.items}
                      onChange={(e) =>
                        updateSkillSection(index, "items", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vista Previa */}
        <div className="lg:sticky lg:top-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">
                Vista Previa
              </h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {portfolioData.personalInfo.name
                    ? portfolioData.personalInfo.name.charAt(0).toUpperCase()
                    : "P"}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {portfolioData.personalInfo.name || "Tu Nombre"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {portfolioData.personalInfo.title || "Tu Título Profesional"}
                </p>
                <button
                  onClick={() => setShowPreview(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <ExternalLink size={14} />
                  Ver Portfolio Completo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioGenerator;
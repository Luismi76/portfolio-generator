import React, { useEffect, useState } from 'react';
import { Settings, Lock, Edit } from 'lucide-react';

// Types actualizados
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
  detailedDescription?: string;
  technologies: string;
  link: string;
  github: string;
  image?: string;
  images?: string; // String separado por comas
  videos?: string; // String separado por comas
  instructions?: string;
  features?: string; // String separado por comas
  challenges?: string;
  slug?: string;
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

// Componente TechList con iconos automáticos
interface TechListProps {
  technologies: string;
  variant?: 'default' | 'outlined';
  className?: string;
}

const TechList: React.FC<TechListProps> = ({ technologies, variant = 'default', className = '' }) => {
  if (!technologies) return null;
  
  const techs = technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
  
  // Función para obtener el icono según la tecnología
  const getTechIcon = (tech: string): string => {
    const techLower = tech.toLowerCase();
    
    // Frontend Frameworks
    if (techLower.includes('react')) return '⚛️';
    if (techLower.includes('vue')) return '💚';
    if (techLower.includes('angular')) return '🅰️';
    if (techLower.includes('svelte')) return '🧡';
    if (techLower.includes('next')) return '▲';
    if (techLower.includes('nuxt')) return '💚';
    
    // Languages
    if (techLower.includes('javascript') || techLower.includes('js')) return '💛';
    if (techLower.includes('typescript') || techLower.includes('ts')) return '💙';
    if (techLower.includes('python')) return '🐍';
    if (techLower.includes('java')) return '☕';
    if (techLower.includes('php')) return '🐘';
    if (techLower.includes('c#') || techLower.includes('csharp')) return '💜';
    if (techLower.includes('go') || techLower.includes('golang')) return '🐹';
    if (techLower.includes('rust')) return '🦀';
    if (techLower.includes('swift')) return '🍎';
    if (techLower.includes('kotlin')) return '🟣';
    
    // Styling
    if (techLower.includes('css')) return '🎨';
    if (techLower.includes('sass') || techLower.includes('scss')) return '💗';
    if (techLower.includes('tailwind')) return '🌊';
    if (techLower.includes('bootstrap')) return '🅱️';
    if (techLower.includes('material')) return '🎯';
    
    // Backend
    if (techLower.includes('node')) return '💚';
    if (techLower.includes('express')) return '🚀';
    if (techLower.includes('django')) return '🎸';
    if (techLower.includes('flask')) return '🌶️';
    if (techLower.includes('laravel')) return '🔴';
    if (techLower.includes('spring')) return '🍃';
    if (techLower.includes('nestjs')) return '🐱';
    
    // Databases
    if (techLower.includes('mongodb') || techLower.includes('mongo')) return '🍃';
    if (techLower.includes('postgresql') || techLower.includes('postgres')) return '🐘';
    if (techLower.includes('mysql')) return '🐬';
    if (techLower.includes('redis')) return '🔴';
    if (techLower.includes('sqlite')) return '💾';
    if (techLower.includes('firebase')) return '🔥';
    if (techLower.includes('supabase')) return '⚡';
    
    // DevOps & Tools
    if (techLower.includes('docker')) return '🐳';
    if (techLower.includes('kubernetes') || techLower.includes('k8s')) return '⚙️';
    if (techLower.includes('aws')) return '☁️';
    if (techLower.includes('azure')) return '☁️';
    if (techLower.includes('gcp') || techLower.includes('google cloud')) return '☁️';
    if (techLower.includes('git')) return '📦';
    if (techLower.includes('github')) return '🐙';
    if (techLower.includes('gitlab')) return '🦊';
    if (techLower.includes('jenkins')) return '👨‍💼';
    if (techLower.includes('linux')) return '🐧';
    if (techLower.includes('nginx')) return '🌐';
    if (techLower.includes('apache')) return '🪶';
    
    // Testing
    if (techLower.includes('jest')) return '🃏';
    if (techLower.includes('cypress')) return '🌲';
    if (techLower.includes('selenium')) return '🔍';
    if (techLower.includes('playwright')) return '🎭';
    
    // Mobile
    if (techLower.includes('react native')) return '📱';
    if (techLower.includes('flutter')) return '💙';
    if (techLower.includes('ionic')) return '⚡';
    
    // Others
    if (techLower.includes('graphql')) return '🔺';
    if (techLower.includes('rest') || techLower.includes('api')) return '🔌';
    if (techLower.includes('websocket')) return '🔄';
    if (techLower.includes('ci/cd')) return '🔄';
    if (techLower.includes('stripe')) return '💳';
    if (techLower.includes('paypal')) return '💰';
    
    // Default icon
    return '⚡';
  };
  
  return (
    <>
      {techs.map((tech, index) => (
        <span
          key={index}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all hover:scale-105 ${
            variant === 'outlined'
              ? 'border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-300'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          } ${className}`}
        >
          <span className="text-base">{getTechIcon(tech)}</span>
          {tech}
        </span>
      ))}
    </>
  );
};

// Componente para embebido de videos
const VideoEmbed: React.FC<{ url: string }> = ({ url }) => {
  const getEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Vimeo
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const getVideoTitle = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'Video demostrativo de YouTube';
    }
    if (url.includes('vimeo.com')) {
      return 'Video demostrativo de Vimeo';
    }
    return 'Video demostrativo del proyecto';
  };

  return (
    <div className="aspect-video">
      <iframe
        src={getEmbedUrl(url)}
        title={getVideoTitle(url)}
        className="w-full h-full rounded-lg"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

// Componente ProjectDetail
const ProjectDetail: React.FC<{
  projectSlug: string;
  onBack: () => void;
  portfolioData: PortfolioData;
}> = ({ projectSlug, onBack, portfolioData }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Generar slug localmente para comparar
  const generateSlugLocal = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };
  
  // Buscar proyecto por slug guardado O por slug generado del título
  const project = portfolioData.projects.find(p => 
    p.slug === projectSlug || generateSlugLocal(p.title) === projectSlug
  );
  
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Proyecto no encontrado</h1>
          <p className="text-gray-600 mb-4">El proyecto "{projectSlug}" no existe o fue eliminado.</p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver al Portfolio
          </button>
        </div>
      </div>
    );
  }

  // Modal para imagen ampliada
  const ImageModal: React.FC = () => {
    if (!selectedImage) return null;
    
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedImage(null)}
      >
        <div className="max-w-4xl max-h-full relative">
          <img
            src={selectedImage}
            alt="Imagen ampliada"
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Volver al Portfolio
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Imagen principal */}
        {project.image && (
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-64 md:h-80 object-cover rounded-lg mb-8 shadow-lg"
          />
        )}

        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          {project.title}
        </h1>
        
        {/* Tecnologías */}
        {project.technologies && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Tecnologías utilizadas</h3>
            <div className="flex flex-wrap gap-2">
              <TechList technologies={project.technologies} />
            </div>
          </div>
        )}

        {/* Enlaces principales */}
        <div className="flex flex-wrap gap-4 mb-8">
          {project.link && (
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              🚀 Ver Proyecto Live
            </a>
          )}
          {project.github && (
            <a 
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              📁 Ver Código
            </a>
          )}
        </div>

        {/* Descripción detallada */}
        <div className="prose max-w-none mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Acerca del Proyecto</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-700 leading-relaxed">
              {project.detailedDescription || project.description}
            </p>
          </div>
        </div>

        {/* Videos */}
        {project.videos && project.videos.trim() && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Videos Demostrativos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.videos.split(',').map((videoUrl, index) => (
                videoUrl.trim() && (
                  <VideoEmbed key={index} url={videoUrl.trim()} />
                )
              ))}
            </div>
          </div>
        )}

        {/* Galería de imágenes */}
        {project.images && project.images.trim() && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Galería</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.images.split(',').map((img, index) => (
                img.trim() && (
                  <img 
                    key={index} 
                    src={img.trim()} 
                    alt={`${project.title} - Imagen ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity shadow-md"
                    onClick={() => setSelectedImage(img.trim())}
                  />
                )
              ))}
            </div>
          </div>
        )}

        {/* Características */}
        {project.features && project.features.trim() && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Características Principales</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.features.split(',').map((feature, index) => (
                  feature.trim() && (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature.trim()}
                    </li>
                  )
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Instrucciones */}
        {project.instructions && project.instructions.trim() && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Instrucciones de Uso</h2>
            <div className="bg-gray-100 p-6 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {project.instructions}
              </pre>
            </div>
          </div>
        )}

        {/* Desafíos técnicos */}
        {project.challenges && project.challenges.trim() && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Desafíos Técnicos</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                {project.challenges}
              </p>
            </div>
          </div>
        )}

        {/* Botón de volver */}
        <div className="text-center pt-8 border-t">
          <button
            onClick={onBack}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Volver al Portfolio
          </button>
        </div>
      </div>

      {/* Modal de imagen */}
      <ImageModal />
    </div>
  );
};

// Componente principal Portfolio
const Portfolio: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para navegación de páginas de proyecto
  const [currentView, setCurrentView] = useState<'portfolio' | 'project'>('portfolio');
  const [currentProjectSlug, setCurrentProjectSlug] = useState<string>('');
  
  // Estados para el sistema de autenticación admin
  const [showAdminBar, setShowAdminBar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');

  // Generar slug automáticamente
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Función para cambiar modo
  const switchMode = (mode: 'editor' | 'portfolio') => {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    window.location.href = url.toString();
  };

  // Navegación a página de proyecto
  const navigateToProject = (projectSlug: string) => {
    setCurrentProjectSlug(projectSlug);
    setCurrentView('project');
    // Actualizar URL sin recargar
    window.history.pushState({}, '', `?project=${projectSlug}`);
  };

  const navigateToPortfolio = () => {
    setCurrentView('portfolio');
    setCurrentProjectSlug('');
    window.history.pushState({}, '', window.location.pathname);
  };

  // Funciones de autenticación admin
  const toggleAdminBar = () => {
    if (isAuthenticated) {
      setShowAdminBar(!showAdminBar);
    } else {
      setShowPasswordPrompt(true);
    }
  };

  const handleAuth = () => {
    if (password === 'admin') {
      setIsAuthenticated(true);
      setShowAdminBar(true);
      setShowPasswordPrompt(false);
      setPassword('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setShowAdminBar(false);
  };

  useEffect(() => {
    // Función para cargar datos
    const loadPortfolioData = () => {
      // Intentar cargar desde localStorage
      try {
        const savedData = localStorage?.getItem('portfolioData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setPortfolioData(parsedData);
          console.log('Datos cargados desde localStorage:', parsedData);
        } else {
          console.log('No hay datos guardados, usando datos vacíos');
          setPortfolioData(getDefaultData());
        }
      } catch (error) {
        console.log('LocalStorage no disponible, usando datos vacíos');
        setPortfolioData(getDefaultData());
      }
      setLoading(false);
    };

    // Función para datos por defecto (vacíos)
    const getDefaultData = (): PortfolioData => ({
      personalInfo: {
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        github: '',
        linkedin: '',
        summary: ''
      },
      projects: [{
        title: '',
        description: '',
        detailedDescription: '',
        technologies: '',
        link: '',
        github: '',
        image: '',
        images: '',
        videos: '',
        instructions: '',
        features: '',
        challenges: '',
        slug: ''
      }],
      skills: [{
        category: '',
        items: ''
      }],
      experience: [{
        company: '',
        position: '',
        period: '',
        description: ''
      }],
      education: [{
        institution: '',
        degree: '',
        period: '',
        description: ''
      }],
      achievements: [{
        title: '',
        description: '',
        date: ''
      }]
    });

    loadPortfolioData();

    // Listener para Alt + A
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        if (isAuthenticated) {
          setShowAdminBar(prev => !prev);
        } else {
          setShowPasswordPrompt(true);
        }
      }
    };

    // Manejar navegación del browser (botón atrás)
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const projectParam = urlParams.get('project');
      
      if (projectParam) {
        setCurrentView('project');
        setCurrentProjectSlug(projectParam);
      } else {
        setCurrentView('portfolio');
        setCurrentProjectSlug('');
      }
    };

    // Inicializar vista basada en URL actual
    const urlParams = new URLSearchParams(window.location.search);
    const projectParam = urlParams.get('project');
    if (projectParam) {
      setCurrentView('project');
      setCurrentProjectSlug(projectParam);
    }

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated]);

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

  // Renderizar página de proyecto individual
  if (currentView === 'project' && portfolioData) {
    return (
      <ProjectDetail 
        projectSlug={currentProjectSlug} 
        onBack={navigateToPortfolio}
        portfolioData={portfolioData} 
      />
    );
  }

  // Función para verificar si hay datos configurados
  const hasConfiguredData = (data: PortfolioData): boolean => {
    return !!(
      data.personalInfo.name.trim() || 
      data.personalInfo.title.trim() || 
      data.projects.some(p => p.title.trim()) ||
      data.skills.some(s => s.category.trim())
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
                onClick={() => switchMode('editor')}
                className="px-3 py-1 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-gray-800"
              >
                Editor
              </button>
              <button
                onClick={() => switchMode('portfolio')}
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Portfolio en construcción</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Tu portfolio está casi listo! Para verlo completo, primero configura tu información personal y proyectos en el modo editor.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => switchMode('editor')}
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

  const { personalInfo, projects, skills } = portfolioData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Botón flotante para acceso admin */}
      <button
        onClick={toggleAdminBar}
        className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors opacity-20 hover:opacity-100"
        title="Acceso de administrador (Alt + A)"
      >
        <Settings size={16} />
      </button>

      {/* Barra de administrador */}
      {showAdminBar && isAuthenticated && (
        <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 z-40 shadow-lg">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Lock size={16} />
              <span className="text-sm">Modo Administrador</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => switchMode('editor')}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                <Edit size={14} />
                Editar Portfolio
              </button>
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de contraseña */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Acceso de Administrador</h3>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              className="w-full p-3 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAuth}
                className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                Acceder
              </button>
              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setPassword('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Tip: También puedes usar Alt + A (contraseña: admin)
            </p>
          </div>
        </div>
      )}

      {/* Header del portfolio */}
      <header className={`bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white ${showAdminBar && isAuthenticated ? 'pt-16' : ''}`}>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {personalInfo.name || 'Tu Nombre'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {personalInfo.title || 'Tu Título Profesional'}
            </p>
            {personalInfo.summary && (
              <p className="text-lg mb-10 max-w-3xl mx-auto leading-relaxed opacity-95">
                {personalInfo.summary}
              </p>
            )}
            
            {/* Contact Info */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} 
                   className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full hover:bg-opacity-20 transition-all">
                  ✉️ {personalInfo.email}
                </a>
              )}
              {personalInfo.phone && (
                <a href={`tel:${personalInfo.phone}`} 
                   className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full hover:bg-opacity-20 transition-all">
                  📱 {personalInfo.phone}
                </a>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full">
                  📍 {personalInfo.location}
                </div>
              )}
              {personalInfo.website && (
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full hover:bg-opacity-20 transition-all">
                  🌐 Website
                </a>
              )}
              {personalInfo.github && (
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full hover:bg-opacity-20 transition-all">
                  📁 GitHub
                </a>
              )}
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full hover:bg-opacity-20 transition-all">
                  💼 LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Projects Section */}
        {projects.filter(p => p.title.trim()).length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Proyectos Destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.filter(p => p.title.trim()).map((project, index) => {
                // Función para generar ilustración por defecto si no hay imagen
                const getDefaultIllustration = (title: string, description: string) => {
                  const titleLower = title.toLowerCase();
                  const descLower = description.toLowerCase();
                  
                  // E-commerce / Shop
                  if (titleLower.includes('ecommerce') || titleLower.includes('shop') || titleLower.includes('store') || 
                      descLower.includes('comercio') || descLower.includes('tienda') || descLower.includes('venta')) {
                    return {
                      gradient: 'from-purple-500 via-pink-500 to-red-500',
                      emoji: '🛒'
                    };
                  }
                  
                  // Task Management / Productivity
                  if (titleLower.includes('task') || titleLower.includes('todo') || titleLower.includes('management') ||
                      descLower.includes('tareas') || descLower.includes('productividad') || descLower.includes('gestión')) {
                    return {
                      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
                      emoji: '✅'
                    };
                  }
                  
                  // Social / Chat / Communication
                  if (titleLower.includes('social') || titleLower.includes('chat') || titleLower.includes('message') ||
                      descLower.includes('social') || descLower.includes('chat') || descLower.includes('comunicación')) {
                    return {
                      gradient: 'from-green-500 via-emerald-500 to-teal-500',
                      emoji: '💬'
                    };
                  }
                  
                  // Portfolio / Personal
                  if (titleLower.includes('portfolio') || titleLower.includes('personal') || titleLower.includes('cv') ||
                      descLower.includes('portfolio') || descLower.includes('personal') || descLower.includes('currículum')) {
                    return {
                      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
                      emoji: '👨‍💻'
                    };
                  }
                  
                  // Blog / CMS / Content
                  if (titleLower.includes('blog') || titleLower.includes('cms') || titleLower.includes('content') ||
                      descLower.includes('blog') || descLower.includes('contenido') || descLower.includes('artículos')) {
                    return {
                      gradient: 'from-orange-500 via-red-500 to-pink-500',
                      emoji: '📝'
                    };
                  }
                  
                  // Dashboard / Analytics
                  if (titleLower.includes('dashboard') || titleLower.includes('analytics') || titleLower.includes('admin') ||
                      descLower.includes('dashboard') || descLower.includes('analíticas') || descLower.includes('administración')) {
                    return {
                      gradient: 'from-gray-600 via-gray-700 to-gray-900',
                      emoji: '📊'
                    };
                  }
                  
                  // Game / Entertainment
                  if (titleLower.includes('game') || titleLower.includes('juego') || titleLower.includes('entertainment') ||
                      descLower.includes('juego') || descLower.includes('entretenimiento') || descLower.includes('diversión')) {
                    return {
                      gradient: 'from-yellow-500 via-orange-500 to-red-500',
                      emoji: '🎮'
                    };
                  }
                  
                  // Finance / Banking
                  if (titleLower.includes('finance') || titleLower.includes('bank') || titleLower.includes('money') ||
                      descLower.includes('financ') || descLower.includes('banco') || descLower.includes('dinero')) {
                    return {
                      gradient: 'from-green-600 via-emerald-600 to-teal-700',
                      emoji: '💰'
                    };
                  }
                  
                  // API / Backend
                  if (titleLower.includes('api') || titleLower.includes('backend') || titleLower.includes('server')) {
                    return {
                      gradient: 'from-slate-600 via-slate-700 to-slate-800',
                      emoji: '🔌'
                    };
                  }
                  
                  // Mobile App
                  if (titleLower.includes('mobile') || titleLower.includes('app')) {
                    return {
                      gradient: 'from-blue-600 via-indigo-600 to-purple-600',
                      emoji: '📱'
                    };
                  }
                  
                  // Default - Generic Web App
                  return {
                    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
                    emoji: '🌐'
                  };
                };
                
                const defaultIllustration = getDefaultIllustration(project.title, project.description);
                const hasCustomImage = project.image && project.image.trim();
                
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    {/* Imagen del proyecto o ilustración por defecto */}
                    <div className="relative h-48 overflow-hidden">
                      {hasCustomImage ? (
                        <>
                          {/* Imagen personalizada */}
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              // Si la imagen falla al cargar, ocultar
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          {/* Overlay oscuro sutil sobre la imagen */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                        </>
                      ) : (
                        <>
                          {/* Ilustración por defecto */}
                          <div className={`w-full h-full bg-gradient-to-br ${defaultIllustration.gradient} flex items-center justify-center relative`}>
                            {/* Patrón de fondo sutil */}
                            <div className="absolute inset-0 opacity-10">
                              <div className="absolute top-4 left-4 text-2xl">✨</div>
                              <div className="absolute top-8 right-6 text-xl">⚡</div>
                              <div className="absolute bottom-6 left-8 text-xl">💎</div>
                              <div className="absolute bottom-4 right-4 text-2xl">🚀</div>
                            </div>
                            
                            {/* Icono principal */}
                            <div className="relative z-10 text-6xl group-hover:scale-110 transition-transform duration-300">
                              {defaultIllustration.emoji}
                            </div>
                            
                            {/* Overlay con efecto hover */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                          </div>
                        </>
                      )}
                      
                      {/* Badge del proyecto */}
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                        {hasCustomImage ? '📸 Proyecto' : '🎨 Demo'}
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-4 text-gray-800">{project.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
                      
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          <TechList 
                            technologies={project.technologies}
                            variant="default"
                          />
                        </div>
                      )}
                      
                      <div className="flex gap-4">
                        {/* Botón para ver detalles del proyecto - SIEMPRE visible si hay título */}
                        {project.title.trim() && (
                          <button
                            onClick={() => navigateToProject(project.slug || generateSlug(project.title))}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            👁️ Ver Detalles
                          </button>
                        )}
                        
                        {/* Enlace externo si existe */}
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer"
                             className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            🚀 Ver Live
                          </a>
                        )}
                        
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer"
                             className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            📁 Código
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills.filter(s => s.category.trim()).length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Habilidades Técnicas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.filter(s => s.category.trim()).map((skill, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">{skill.category}</h3>
                  <div className="flex flex-wrap gap-3">
                    <TechList 
                      technologies={skill.items}
                      variant="outlined"
                    />
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
            © {new Date().getFullYear()} {personalInfo.name || 'Tu Nombre'}. Todos los derechos reservados.
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
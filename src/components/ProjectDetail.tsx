import React, { useState } from 'react';

// Interfaces necesarias (asegúrate de que estén importadas)
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

interface PortfolioData {
  personalInfo: any; // Simplificado para este ejemplo
  projects: Project[];
  skills: any[];
  experience: any[];
  education: any[];
  achievements: any[];
}

// Componente TechList (debe estar importado o definido)
const TechList: React.FC<{ technologies: string }> = ({ technologies }) => {
  if (!technologies) return null;
  
  const techs = technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
  
  return (
    <>
      {techs.map((tech, index) => (
        <span
          key={index}
          className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-2 mb-2 inline-block"
        >
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

// Componente principal corregido
const ProjectDetail: React.FC<{
  projectSlug: string;
  onBack: () => void;
  portfolioData: PortfolioData;
}> = ({ projectSlug, onBack, portfolioData }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const project = portfolioData.projects.find(p => p.slug === projectSlug);
  
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Proyecto no encontrado</h1>
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

export default ProjectDetail;
import React from 'react';

const TECH_ICONS: Record<string, string> = {
  'react': '⚛️', 'vue': '💚', 'angular': '🅰️', 'javascript': '💛', 'typescript': '💙',
  'python': '🐍', 'java': '☕', 'php': '��', 'nodejs': '💚', 'express': '🚂',
  'html': '🟧', 'css': '🎨', 'sass': '🎀', 'tailwind': '🌊', 'bootstrap': '🅱️',
  'mysql': '🐬', 'mongodb': '🍃', 'postgresql': '🐘', 'redis': '🔴', 'sqlite': '🗃️',
  'git': '📦', 'docker': '🐳', 'aws': '☁️', 'default': '⚡'
};

export const getSimpleTechIcon = (tech: string): string => {
  const techLower = tech.toLowerCase().trim();
  return TECH_ICONS[techLower] || TECH_ICONS.default;
};

export const renderTechBadge = (tech: string): string => {
  return `<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
    <span>${getSimpleTechIcon(tech)}</span>
    ${tech.trim()}
  </span>`;
};

export const renderTechList = (technologies: string): string => {
  if (!technologies) return '';
  return technologies.split(',').filter(tech => tech.trim()).map(tech => renderTechBadge(tech)).join(' ');
};

export const getSkillIcon = (skill: string): string => {
  const skillIcons: Record<string, string> = {
    'comunicación': '💬', 'liderazgo': '��', 'trabajo en equipo': '👥', 'programación': '💻',
    'creatividad': '🎨', 'organización': '📋', 'default': '⭐'
  };
  return skillIcons[skill.toLowerCase().trim()] || skillIcons.default;
};

export const renderSkillBadge = (skill: string): string => {
  return `<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
    <span>${getSkillIcon(skill)}</span>
    ${skill.trim()}
  </span>`;
};

export const renderSkillList = (skills: string): string => {
  if (!skills) return '';
  return skills.split(',').filter(skill => skill.trim()).map(skill => renderSkillBadge(skill)).join(' ');
};

interface TechListProps {
  technologies: string;
  variant?: 'default' | 'outlined' | 'minimal';
  className?: string;
}

export const TechList: React.FC<TechListProps> = ({ technologies, variant = 'default', className = '' }) => {
  if (!technologies) return null;
  const techs = technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {techs.map((tech, index) => (
        <span key={index} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${variant === 'outlined' || variant === 'minimal' ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}>
          <span>{getSimpleTechIcon(tech)}</span>
          {tech}
        </span>
      ))}
    </div>
  );
};


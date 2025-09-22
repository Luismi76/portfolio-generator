// Versión simplificada para portfolioViewer
// Usa la configuración existente de TECH_ICONS_CONFIG

import { TECH_ICONS_CONFIG } from '../types/portfolio-types';

// Funciones originales para tecnologías (mantener como estaban)
export const getSimpleTechIcon = (tech: string): string => {
  const normalized = tech.toLowerCase().trim();
  const iconConfig = TECH_ICONS_CONFIG[normalized];
  
  return iconConfig ? iconConfig.emoji : TECH_ICONS_CONFIG.default.emoji;
};

export const renderTechBadge = (tech: string): string => {
  const icon = getSimpleTechIcon(tech);
  const cleanTech = tech.trim();
  
  return `<span class="tech-badge">${icon} ${cleanTech}</span>`;
};

export const renderTechList = (technologies: string): string => {
  if (!technologies) return '';
  
  return technologies
    .split(',')
    .filter(tech => tech.trim())
    .map(tech => renderTechBadge(tech))
    .join('');
};

// NUEVAS funciones solo para habilidades
export const getSkillIcon = (skill: string): string => {
  const normalized = skill.toLowerCase().trim();
  const iconConfig = TECH_ICONS_CONFIG[normalized];
  
  return iconConfig ? iconConfig.emoji : TECH_ICONS_CONFIG.default.emoji;
};

export const renderSkillBadge = (skill: string): string => {
  const icon = getSkillIcon(skill);
  const cleanSkill = skill.trim();
  
  return `<span class="skill-badge">${icon} ${cleanSkill}</span>`;
};

export const renderSkillList = (skills: string): string => {
  if (!skills) return '';
  
  return skills
    .split(',')
    .filter(skill => skill.trim())
    .map(skill => renderSkillBadge(skill))
    .join('');
};

// Componente React para habilidades
export const SkillsList = ({ skills }: { skills: string }) => {
  if (!skills) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {skills.split(',')
        .filter(skill => skill.trim())
        .map((skill, index) => (
          <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            <span>{getSkillIcon(skill)}</span>
            <span>{skill.trim()}</span>
          </span>
        ))}
    </div>
  );
};
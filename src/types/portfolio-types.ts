// portfolio-types.ts - VERSION CORREGIDA
import React from 'react';

// ✅ CORREGIDO - Información personal con campos correctos
export interface PersonalInfo {
  fullName: string;      // ✅ Cambiado de 'name' a 'fullName'
  title: string;
  tagline?: string;      // ✅ Añadido campo faltante
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  summary: string;
}

// ✅ CORREGIDO - Proyectos con todos los campos utilizados
export interface Project {
  title: string;
  description: string;
  detailedDescription?: string;
  technologies: string;
  link: string;
  github: string;
  liveUrl?: string;      // ✅ Añadido campo faltante
  repoUrl?: string;      // ✅ Añadido campo faltante
  image?: string;
  images?: string;
  mainImageIndex?: number;
  videos?: string;
  instructions?: string;
  features?: string;
  challenges?: string;
  slug?: string;
}

// ✅ CORREGIDO - Habilidades con campo 'technologies'
export interface Skill {
  category: string;
  technologies: string;  // ✅ Cambiado de 'items' a 'technologies'
  level?: string;        // ✅ Añadido campo utilizado en componentes
}

// Tipos para experiencia laboral
export interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
}

// Tipos para educación
export interface Education {
  institution: string;
  degree: string;
  period: string;
  description: string;
}

// Tipos para logros y reconocimientos
export interface Achievement {
  title: string;
  description: string;
  date: string;
}

// Interfaz principal que agrupa todos los datos del portfolio
export interface PortfolioData {
  personalInfo: PersonalInfo;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  achievements: Achievement[];
}

// Tipos auxiliares para el manejo de secciones
export type SectionKey = 
  | "projects" 
  | "skills" 
  | "experience" 
  | "education" 
  | "achievements";

export type PersonalInfoKey = keyof PersonalInfo;

// Props para componentes de iconos
export interface IconProps {
  size?: number;
  className?: string;
}

// Props para componentes de sección - VERSIÓN ACTUALIZADA
export interface SectionProps {
  title: string;
  description?: string;  // ✅ AÑADIR este campo opcional
  icon?: React.ComponentType<{ size?: number; className?: string }>; // ✅ AÑADIR icon
  children: React.ReactNode;
  onAdd?: () => void;
  showAddButton?: boolean;
  addButtonText?: string; // ✅ AÑADIR este campo opcional
  className?: string; // ✅ AÑADIR este campo opcional
}

// ✅ CORREGIDO - Props para EditableItem component
export interface EditableItemProps {
  index: number;
  onRemove?: (index: number) => void;
  showRemoveButton?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}

// Tipos para el manejo de archivos
export interface FileExport {
  [filename: string]: string;
}

// Props para el hook de datos del portfolio
export interface UsePortfolioDataOptions {
  autoSave?: boolean;
  storageKey?: string;
}

// ✅ AÑADIDO - Estado del hook de datos
export interface PortfolioDataState {
  data: PortfolioData;
  isLoaded: boolean;
  saveStatus: string;
}

// ✅ AÑADIDO - Acciones para el hook de datos
export interface PortfolioDataActions {
  updatePersonalInfo: (field: PersonalInfoKey, value: string) => void;
  updateProject: (index: number, field: keyof Project, value: string) => void;
  updateSkill: (index: number, field: keyof Skill, value: string) => void;
  updateExperience: (index: number, field: keyof Experience, value: string) => void;
  updateEducation: (index: number, field: keyof Education, value: string) => void;
  updateAchievement: (index: number, field: keyof Achievement, value: string) => void;
  addItem: (section: SectionKey) => void;
  removeItem: (section: SectionKey, index: number) => void;
  importData: (data: PortfolioData) => void;
  clearAllData: () => void;
}

// Props para componentes de exportación
export interface ExportOptions {
  includeImages?: boolean;
  includeInstructions?: boolean;
  format?: 'single' | 'multi-page';
}

// Resultado de operaciones de exportación
export interface ExportResult {
  success: boolean;
  message: string;
  files?: FileExport;
}

// Props para formularios de sección
export interface PersonalInfoFormProps {
  data: PersonalInfo;
  onUpdate: (field: PersonalInfoKey, value: string) => void;
}

// ✅ CORREGIDO - Props para ProjectForm sin onImageUpload
export interface ProjectFormProps {
  projects: Project[];
  onUpdate: (index: number, field: keyof Project, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

// ✅ CORREGIDO - Props para SkillForm 
export interface SkillFormProps {
  skills: Skill[];
  onUpdate: (index: number, field: keyof Skill, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

// ✅ CORREGIDO - Props para ProjectTableForm
export interface ProjectTableFormProps {
  projects: Project[];
  onUpdate: (index: number, field: keyof Project, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

// ✅ CORREGIDO - Props para SkillTableForm
export interface SkillTableFormProps {
  skills: Skill[];
  onUpdate: (index: number, field: keyof Skill, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

// Tipos para el manejo de modo de aplicación
export type AppMode = 'editor' | 'templates' | 'customize' | 'preview' | 'portfolio';

// ✅ AÑADIDO - Estado del componente principal
export interface PortfolioGeneratorState {
  showPreview: boolean;
  showDataMenu: boolean;
  currentMode: AppMode;
}

// Props para el componente principal
export interface PortfolioGeneratorProps {
  initialMode?: AppMode;
  storageKey?: string;
  autoSave?: boolean;
}

// Configuración de tecnologías para iconos
export interface TechIconConfig {
  [key: string]: {
    emoji: string;
    url?: string;
    color?: string;
  };
}

// ✅ CORREGIDO - Constantes por defecto con campos correctos
export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  personalInfo: {
    fullName: "",        // ✅ Cambiado de 'name'
    title: "",
    tagline: "",         // ✅ Añadido
    email: "",
    phone: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    summary: "",
  },
  projects: [{
    title: "",
    description: "",
    detailedDescription: "",
    technologies: "",
    link: "",
    github: "",
    liveUrl: "",         // ✅ Añadido
    repoUrl: "",         // ✅ Añadido
    image: "",
    images: "",
    videos: "",
    instructions: "",
    features: "",
    challenges: "",
    slug: "",
    mainImageIndex: 0
  }],
  skills: [{
    category: "",
    technologies: "",    // ✅ Cambiado de 'items'
    level: ""            // ✅ Añadido
  }],
  experience: [{
    company: "",
    position: "",
    period: "",
    description: "",
  }],
  education: [{
    institution: "",
    degree: "",
    period: "",
    description: "",
  }],
  achievements: [{
    title: "",
    description: "",
    date: "",
  }],
};

// Configuración de tecnologías
export const TECH_ICONS_CONFIG: TechIconConfig = {
  react: { emoji: '⚛️', color: '#61DAFB' },
  vue: { emoji: '💚', color: '#4FC08D' },
  javascript: { emoji: '💛', color: '#F7DF1E' },
  typescript: { emoji: '💙', color: '#3178C6' },
  python: { emoji: '🐍', color: '#3776AB' },
  css: { emoji: '🎨', color: '#1572B6' },
  node: { emoji: '💚', color: '#339933' },
  html: { emoji: '🟧', color: '#E34F26' },
  git: { emoji: '📝', color: '#F05032' },
  docker: { emoji: '🐳', color: '#2496ED' },
  aws: { emoji: '☁️', color: '#FF9900' },
  default: { emoji: '⚡', color: '#6366F1' },
};
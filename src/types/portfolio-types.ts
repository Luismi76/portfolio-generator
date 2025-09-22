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
  items: string;  // ✅ Cambiado de 'items' a 'technologies'
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
    items: "",    // ✅ Cambiado de 'items'
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
// Configuración COMPLETA de tecnologías - reemplaza la existente en portfolio-types.ts
export const TECH_ICONS_CONFIG: TechIconConfig = {
  // Frontend
  'react': { emoji: '⚛️', color: '#61DAFB' },
  'vue': { emoji: '💚', color: '#4FC08D' },
  'angular': { emoji: '🅰️', color: '#DD0031' },
  'html': { emoji: '🟧', color: '#E34F26' },
  'html5': { emoji: '🟧', color: '#E34F26' },
  'css': { emoji: '🎨', color: '#1572B6' },
  'css3': { emoji: '🎨', color: '#1572B6' },
  'javascript': { emoji: '💛', color: '#F7DF1E' },
  'js': { emoji: '💛', color: '#F7DF1E' },
  'typescript': { emoji: '💙', color: '#3178C6' },
  'ts': { emoji: '💙', color: '#3178C6' },
  'tailwind': { emoji: '🌊', color: '#06B6D4' },
  'tailwindcss': { emoji: '🌊', color: '#06B6D4' },
  'bootstrap': { emoji: '🅱️', color: '#7952B3' },
  'sass': { emoji: '💗', color: '#CC6699' },
  'scss': { emoji: '💗', color: '#CC6699' },
  'nextjs': { emoji: '⚫', color: '#000000' },
  'next': { emoji: '⚫', color: '#000000' },
  'nuxt': { emoji: '💚', color: '#00DC82' },
  'vite': { emoji: '⚡', color: '#646CFF' },
  'webpack': { emoji: '📦', color: '#8DD6F9' },
  
  // Backend
  'nodejs': { emoji: '💚', color: '#339933' },
  'node': { emoji: '💚', color: '#339933' },
  'express': { emoji: '🚂', color: '#000000' },
  'expressjs': { emoji: '🚂', color: '#000000' },
  'python': { emoji: '🐍', color: '#3776AB' },
  'java': { emoji: '☕', color: '#ED8B00' },
  'php': { emoji: '🐘', color: '#777BB4' },
  'csharp': { emoji: '#️⃣', color: '#239120' },
  'c#': { emoji: '#️⃣', color: '#239120' },
  'go': { emoji: '🐹', color: '#00ADD8' },
  'golang': { emoji: '🐹', color: '#00ADD8' },
  'rust': { emoji: '🦀', color: '#000000' },
  'ruby': { emoji: '💎', color: '#CC342D' },
  'kotlin': { emoji: '🟣', color: '#7F52FF' },
  'swift': { emoji: '🐦', color: '#FA7343' },
  
  // Frameworks
  'laravel': { emoji: '🔴', color: '#FF2D20' },
  'django': { emoji: '💚', color: '#092E20' },
  'flask': { emoji: '🌶️', color: '#000000' },
  'fastapi': { emoji: '⚡', color: '#009688' },
  'spring': { emoji: '🌱', color: '#6DB33F' },
  'springboot': { emoji: '🌱', color: '#6DB33F' },
  'dotnet': { emoji: '🔵', color: '#512BD4' },
  '.net': { emoji: '🔵', color: '#512BD4' },
  'rails': { emoji: '🚂', color: '#CC0000' },
  
  // Databases
  'mongodb': { emoji: '🍃', color: '#47A248' },
  'mongo': { emoji: '🍃', color: '#47A248' },
  'mysql': { emoji: '🐬', color: '#4479A1' },
  'postgresql': { emoji: '🐘', color: '#336791' },
  'postgres': { emoji: '🐘', color: '#336791' },
  'redis': { emoji: '🔴', color: '#DC382D' },
  'sqlite': { emoji: '💾', color: '#003B57' },
  'sqlserver': { emoji: '🗄️', color: '#CC2927' },
  'sql server': { emoji: '🗄️', color: '#CC2927' },
  'oracle': { emoji: '🔶', color: '#F80000' },
  'firebase': { emoji: '🔥', color: '#FFCA28' },
  'supabase': { emoji: '🟢', color: '#3ECF8E' },
  
  // Cloud & DevOps
  'aws': { emoji: '☁️', color: '#FF9900' },
  'azure': { emoji: '💙', color: '#0078D4' },
  'gcp': { emoji: '☁️', color: '#4285F4' },
  'google cloud': { emoji: '☁️', color: '#4285F4' },
  'heroku': { emoji: '💜', color: '#430098' },
  'vercel': { emoji: '▲', color: '#000000' },
  'netlify': { emoji: '💚', color: '#00C7B7' },
  'docker': { emoji: '🐳', color: '#2496ED' },
  'kubernetes': { emoji: '☸️', color: '#326CE5' },
  'k8s': { emoji: '☸️', color: '#326CE5' },
  'nginx': { emoji: '🟢', color: '#009639' },
  'apache': { emoji: '🪶', color: '#D22128' },
  
  // Version Control
  'git': { emoji: '📝', color: '#F05032' },
  'github': { emoji: '🐙', color: '#181717' },
  'gitlab': { emoji: '🦊', color: '#FCA326' },
  
  // Testing
  'jest': { emoji: '🃏', color: '#C21325' },
  'cypress': { emoji: '🌲', color: '#17202C' },
  'selenium': { emoji: '🕷️', color: '#43B02A' },
  
  // API & Communication
  'rest': { emoji: '🔗', color: '#FF6C37' },
  'rest api': { emoji: '🔗', color: '#FF6C37' },
  'api': { emoji: '🔗', color: '#FF6C37' },
  'graphql': { emoji: '💗', color: '#E10098' },
  'websocket': { emoji: '🔌', color: '#000000' },
  'websockets': { emoji: '🔌', color: '#000000' },
  
  // Mobile Development
  'android': { emoji: '🤖', color: '#3DDC84' },
  'ios': { emoji: '🍎', color: '#000000' },
  'flutter': { emoji: '💙', color: '#02569B' },
  'react native': { emoji: '⚛️', color: '#61DAFB' },
  'ionic': { emoji: '⚡', color: '#3880FF' },
  
  // Machine Learning & Data Science
  'tensorflow': { emoji: '🧠', color: '#FF6F00' },
  'pytorch': { emoji: '🔥', color: '#EE4C2C' },
  'pandas': { emoji: '🐼', color: '#150458' },
  'numpy': { emoji: '🔢', color: '#013243' },
  'sklearn': { emoji: '🧠', color: '#F7931E' },
  'scikit-learn': { emoji: '🧠', color: '#F7931E' },
  'jupyter': { emoji: '📓', color: '#F37626' },
  
  // Design & UI Tools
  'figma': { emoji: '🎨', color: '#F24E1E' },
  'photoshop': { emoji: '🖼️', color: '#31A8FF' },
  
  // Business Intelligence
  'powerbi': { emoji: '📊', color: '#F2C811' },
  'power bi': { emoji: '📊', color: '#F2C811' },
  'tableau': { emoji: '📈', color: '#E97627' },
  'excel': { emoji: '📗', color: '#217346' },
  
  // UI/Component Libraries
  'shadcn/ui': { emoji: '🎨', color: '#000000' },
  'shadcn': { emoji: '🎨', color: '#000000' },
  'lucide-react': { emoji: '✨', color: '#F56565' },
  'lucide': { emoji: '✨', color: '#F56565' },
  'livekit': { emoji: '📹', color: '#0055FF' },
  'recharts': { emoji: '📊', color: '#8884D8' },
  'proxmox': { emoji: '☁️', color: '#E57000' },
  
  // Hardware & IoT
  'esp32-c3': { emoji: '🔧', color: '#FF6600' },
  'esp32': { emoji: '🔧', color: '#FF6600' },
  'bl': { emoji: '📡', color: '#0066CC' },
  'bluetooth': { emoji: '📡', color: '#0066CC' },
  'tof vl53l1x': { emoji: '📏', color: '#666666' },
  'vl53l1x': { emoji: '📏', color: '#666666' },
  'tof': { emoji: '📏', color: '#666666' },
  'ws2812': { emoji: '🌈', color: '#FF0080' },
  'lipo': { emoji: '🔋', color: '#00AA00' },
  'tp4056': { emoji: '⚡', color: '#FF4400' },
  'impresión 3d': { emoji: '🖨️', color: '#FF6600' },
  '3d printing': { emoji: '🖨️', color: '#FF6600' },
  'arduino': { emoji: '🔧', color: '#00979D' },
  'esp-idf': { emoji: '⚙️', color: '#E7352C' },
  'idf': { emoji: '⚙️', color: '#E7352C' },
  
  // Default fallback
  'default': { emoji: '⚡', color: '#6366F1' },
};
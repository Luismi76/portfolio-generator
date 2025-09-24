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

// Busca TECH_ICONS_CONFIG en src/types/portfolio-types.ts y REEMPLÁZALO completamente con:

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
  'tailwind css': { emoji: '🌊', color: '#06B6D4' },
  'bootstrap': { emoji: '🅱️', color: '#7952B3' },
  'sass': { emoji: '💗', color: '#CC6699' },
  'nextjs': { emoji: '▲', color: '#000000' },
  'next': { emoji: '▲', color: '#000000' },
  
  // Backend  
  'nodejs': { emoji: '💚', color: '#339933' },
  'node': { emoji: '💚', color: '#339933' },
  'node.js': { emoji: '💚', color: '#339933' },
  'express': { emoji: '🚂', color: '#000000' },
  'expressjs': { emoji: '🚂', color: '#000000' },
  'express.js': { emoji: '🚂', color: '#000000' },
  'python': { emoji: '🐍', color: '#3776AB' },
  'java': { emoji: '☕', color: '#ED8B00' },
  'php': { emoji: '🐘', color: '#777BB4' },
  'csharp': { emoji: '#️⃣', color: '#239120' },
  'c#': { emoji: '#️⃣', color: '#239120' },
  'go': { emoji: '🐹', color: '#00ADD8' },
  'rust': { emoji: '🦀', color: '#000000' },
  
  // TUS TECNOLOGÍAS ESPECÍFICAS - AGREGADAS
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
  'arduino': { emoji: '🔧', color: '#00979D' },
  'esp-idf': { emoji: '⚙️', color: '#E7352C' },
  'idf': { emoji: '⚙️', color: '#E7352C' },
  
  // UI Libraries
  'shadcn/ui': { emoji: '🎨', color: '#000000' },
  'shadcn': { emoji: '🎨', color: '#000000' },
  'lucide-react': { emoji: '✨', color: '#F56565' },
  'lucide': { emoji: '✨', color: '#F56565' },
  'livekit': { emoji: '📹', color: '#0055FF' },
  'recharts': { emoji: '📊', color: '#8884D8' },
  
  // Databases
  'mongodb': { emoji: '🍃', color: '#47A248' },
  'postgresql': { emoji: '🐘', color: '#336791' },
  'postgres': { emoji: '🐘', color: '#336791' },
  'mysql': { emoji: '🐬', color: '#4479A1' },
  'redis': { emoji: '🔴', color: '#DC382D' },
  'firebase': { emoji: '🔥', color: '#FFCA28' },
  
  // Cloud & DevOps
  'aws': { emoji: '☁️', color: '#FF9900' },
  'docker': { emoji: '🐳', color: '#2496ED' },
  'proxmox': { emoji: '☁️', color: '#E57000' },
  'git': { emoji: '📝', color: '#F05032' },
  'github': { emoji: '🐙', color: '#181717' },
  
  // API & Communication
  'rest': { emoji: '🔗', color: '#FF6C37' },
  'rest api': { emoji: '🔗', color: '#FF6C37' },
  'api': { emoji: '🔗', color: '#FF6C37' },
  'websocket': { emoji: '🔌', color: '#000000' },
  'websockets': { emoji: '🔌', color: '#000000' },
  
  // Default
  'default': { emoji: '⚡', color: '#6366F1' },
};

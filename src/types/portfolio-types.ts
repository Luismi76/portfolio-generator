// portfolio-types.ts
// Tipos base para la información personal
export interface PersonalInfo {
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

// Tipos para proyectos con campos extendidos
export interface Project {
  title: string;
  description: string;
  detailedDescription?: string;
  technologies: string;
  link: string;
  github: string;
  image?: string; // Imagen principal
  images?: string; // URLs separadas por comas - TODAS las imágenes
  mainImageIndex?: number; // Índice de la imagen principal en el array
  videos?: string; // URLs separadas por comas
  instructions?: string;
  features?: string; // Características separadas por comas
  challenges?: string;
  slug?: string; // Identificador único para URLs
}

// Tipos para habilidades organizadas por categorías
export interface Skill {
  category: string;
  items: string; // Habilidades separadas por comas
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

// Props para componentes de sección
export interface SectionProps {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
  showAddButton?: boolean;
}

// Props para elementos de lista editables
export interface EditableItemProps {
  index: number;
  onRemove?: (index: number) => void;
  showRemoveButton?: boolean;
  title: string;
  children: React.ReactNode;
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

// Estado del hook de datos
export interface PortfolioDataState {
  data: PortfolioData;
  isLoaded: boolean;
  saveStatus: string;
}

// Acciones para el hook de datos
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

// Props para el componente de vista previa
export interface PreviewProps {
  data: PortfolioData;
  onClose: () => void;
  onExport: (type: 'html' | 'website') => void;
}

// Props para formularios de sección
export interface PersonalInfoFormProps {
  data: PersonalInfo;
  onUpdate: (field: PersonalInfoKey, value: string) => void;
}

export interface ProjectFormProps {
  projects: Project[];
  onUpdate: (index: number, field: keyof Project, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onImageUpload: (index: number, file: File) => void;
}

export interface SkillFormProps {
  skills: Skill[];
  onUpdate: (index: number, field: keyof Skill, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

// Configuración de tecnologías para iconos
export interface TechIconConfig {
  [key: string]: {
    emoji: string;
    url?: string;
    color?: string;
  };
}

// Tipos para el manejo de modo de aplicación
export type AppMode = 'editor' | 'portfolio';

// Props para el componente principal
export interface PortfolioGeneratorProps {
  initialMode?: AppMode;
  storageKey?: string;
  autoSave?: boolean;
}

// Estado del componente principal
export interface PortfolioGeneratorState {
  showPreview: boolean;
  showDataMenu: boolean;
  currentMode: AppMode;
}

// Constantes por defecto
export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
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
  projects: [{
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
    mainImageIndex: 0
  }],
  skills: [{
    category: "",
    items: "",
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
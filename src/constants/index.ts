// src/constants/index.ts
import { PortfolioData, TechIconConfig } from '../types/portfolio-types';

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'Portfolio Generator',
  VERSION: '2.0.0',
  STORAGE_KEY: 'portfolio-generator-data',
  STORAGE_CONFIG_KEY: 'portfolio-generator-config',
  AUTO_SAVE_INTERVAL: 2000, // ms
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  SUPPORTED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
} as const;

// Datos por defecto del portfolio
export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  personalInfo: {
    fullName: "",
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

// Configuración de iconos de tecnologías
export const TECH_ICONS: TechIconConfig = {
  // Frontend
  react: { emoji: '⚛️', color: '#61DAFB' },
  vue: { emoji: '💚', color: '#4FC08D' },
  angular: { emoji: '🅰️', color: '#DD0031' },
  
  // Languages
  javascript: { emoji: '💛', color: '#F7DF1E' },
  typescript: { emoji: '💙', color: '#3178C6' },
  python: { emoji: '🐍', color: '#3776AB' },
  
  // Styling
  css: { emoji: '🎨', color: '#1572B6' },
  tailwind: { emoji: '🌊', color: '#06B6D4' },
  
  // Backend
  nodejs: { emoji: '💚', color: '#339933' },
  
  // Tools
  git: { emoji: '📝', color: '#F05032' },
  docker: { emoji: '🐳', color: '#2496ED' },
  
  // Default fallback
  default: { emoji: '⚡', color: '#6366F1' },
};

// Mensajes de validación
export const VALIDATION_MESSAGES = {
  required: 'Este campo es obligatorio',
  email: 'Por favor, introduce un email válido',
  url: 'Por favor, introduce una URL válida',
  maxLength: (max: number) => `Máximo ${max} caracteres`,
  minLength: (min: number) => `Mínimo ${min} caracteres`,
  fileSize: `El archivo es demasiado grande (máximo ${APP_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB)`,
  fileType: 'Tipo de archivo no soportado',
} as const;
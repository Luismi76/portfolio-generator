// hooks/usePortfolioData.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  PortfolioData,
  PortfolioDataActions,
  UsePortfolioDataOptions,
  PersonalInfoKey,
  Project,
  Skill,
  Experience,
  Education,
  Achievement,
  SectionKey,
} from '../types/portfolio-types';
import { useAutoSave } from './useAppState';
import { DEFAULT_PORTFOLIO_DATA } from '../types/portfolio-types';
/**
 * Estado del hook usePortfolioData
 */
export interface UsePortfolioDataState {
  data: PortfolioData;
  isLoaded: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

/**
 * Retorno completo del hook usePortfolioData
 */
export interface UsePortfolioDataReturn extends UsePortfolioDataState, PortfolioDataActions {}

/**
 * Hook principal para manejo de datos del portfolio
 * Incluye persistencia en localStorage y auto-guardado
 * 
 * @param options - Opciones de configuración
 * @returns Estado y acciones para manipular datos del portfolio
 * 
 * @example
 * const {
 *   data,
 *   isLoaded,
 *   updatePersonalInfo,
 *   addItem,
 *   removeItem
 * } = usePortfolioData({ storageKey: 'myPortfolio', autoSave: true });
 */
export const usePortfolioData = (
  options: UsePortfolioDataOptions = {}
): UsePortfolioDataReturn => {
  const {
    storageKey = 'portfolioData',
    autoSave = true,
    autoSaveDelay = 1000,
  } = options;

  // Estado principal
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Cargar datos desde localStorage al montar
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setPortfolioData(parsed);
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      setSaveStatus('error');
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Auto-guardado
  useAutoSave(storageKey, portfolioData, {
    delay: autoSaveDelay,
    enabled: autoSave && isLoaded,
    onSave: () => setSaveStatus('saved'),
    onError: () => setSaveStatus('error'),
  });

  // Función para actualizar información personal
  const updatePersonalInfo = useCallback((field: PersonalInfoKey, value: string) => {
    setSaveStatus('saving');
    setPortfolioData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  }, []);

  // Función para actualizar proyectos
  const updateProject = useCallback((index: number, field: keyof Project, value: string | number) => {
    setSaveStatus('saving');
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  // Función para actualizar habilidades
  const updateSkill = useCallback((index: number, field: keyof Skill, value: string) => {
    setSaveStatus('saving');
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  // Función para actualizar experiencia
  const updateExperience = useCallback((index: number, field: keyof Experience, value: string) => {
    setSaveStatus('saving');
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  // Función para actualizar educación
  const updateEducation = useCallback((index: number, field: keyof Education, value: string) => {
    setSaveStatus('saving');
    setPortfolioData(prev => ({
      ...prev,
      education: prev.education.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  // Función para actualizar logros
  const updateAchievement = useCallback((index: number, field: keyof Achievement, value: string) => {
    setSaveStatus('saving');
    setPortfolioData(prev => ({
      ...prev,
      achievements: prev.achievements.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  // Función para agregar elementos a secciones
  const addItem = useCallback((section: SectionKey) => {
    setSaveStatus('saving');
    
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
        mainImageIndex: 0
      },
      skills: { category: "", items: "" },
      experience: { company: "", position: "", period: "", description: "" },
      education: { institution: "", degree: "", period: "", description: "" },
      achievements: { title: "", description: "", date: "" },
    };

    setPortfolioData(prev => ({
      ...prev,
      [section]: [...prev[section], newItems[section]],
    }));
  }, []);

  // Función para remover elementos de secciones
  const removeItem = useCallback((section: SectionKey, index: number) => {
    setSaveStatus('saving');
    
    setPortfolioData(prev => {
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
          newData.achievements = newData.achievements.filter((_, i) => i !== index);
          break;
      }
      return newData;
    });
  }, []);

  // Función para importar datos
  const importData = useCallback((data: PortfolioData) => {
    setSaveStatus('saving');
    setPortfolioData(data);
  }, []);

  // Función para limpiar todos los datos
  const clearAllData = useCallback(() => {
    setSaveStatus('saving');
    setPortfolioData(DEFAULT_PORTFOLIO_DATA);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return {
    // Estado
    data: portfolioData,
    isLoaded,
    saveStatus,
    // Acciones
    updatePersonalInfo,
    updateProject,
    updateSkill,
    updateExperience,
    updateEducation,
    updateAchievement,
    addItem,
    removeItem,
    importData,
    clearAllData,
  };
};
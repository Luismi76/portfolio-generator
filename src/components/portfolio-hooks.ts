// portfolio-hooks.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  PortfolioData,
  PortfolioDataState,
  PortfolioDataActions,
  UsePortfolioDataOptions,
  PersonalInfoKey,
  Project,
  Skill,
  Experience,
  Education,
  Achievement,
  SectionKey,
  DEFAULT_PORTFOLIO_DATA,
  AppMode,
  PortfolioGeneratorState
} from '../types/portfolio-types';

// Hook para manejo de localStorage con tipos
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  } = {}
) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serialize(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, serialize, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};

// Hook para manejo de estado con auto-guardado
export const useAutoSave = <T>(
  key: string,
  data: T,
  options: {
    delay?: number;
    enabled?: boolean;
  } = {}
) => {
  const { delay = 1000, enabled = true } = options;
  const [saveStatus, setSaveStatus] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled) return;

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Programar guardado
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        setSaveStatus('Guardado ✅');
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (error) {
        setSaveStatus('Error al guardar ❌');
        setTimeout(() => setSaveStatus(''), 2000);
        console.error('Error saving to localStorage:', error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, key]);

  return saveStatus;
};

// Hook principal para manejo de datos del portfolio
export const usePortfolioData = (
  options: UsePortfolioDataOptions = {}
): PortfolioDataState & PortfolioDataActions => {
  const { autoSave = true, storageKey = 'portfolioData' } = options;
  
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const saveStatus = useAutoSave(storageKey, portfolioData, { enabled: autoSave && isLoaded });

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = () => {
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setPortfolioData(parsedData);
        }
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [storageKey]);

  // Función para actualizar información personal
  const updatePersonalInfo = useCallback((field: PersonalInfoKey, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  }, []);

  // Función para actualizar proyectos
  const updateProject = useCallback((index: number, field: keyof Project, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          // Auto-generar slug cuando cambia el título
          if (field === 'title') {
            updatedItem.slug = value
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  }, []);

  // Función para actualizar habilidades
  const updateSkill = useCallback((index: number, field: keyof Skill, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  // Función para actualizar experiencia
  const updateExperience = useCallback((index: number, field: keyof Experience, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  // Función para actualizar educación
  const updateEducation = useCallback((index: number, field: keyof Education, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      education: prev.education.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  // Función para actualizar logros
  const updateAchievement = useCallback((index: number, field: keyof Achievement, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      achievements: prev.achievements.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  // Función para agregar elementos a secciones
  const addItem = useCallback((section: SectionKey) => {
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
    setPortfolioData(data);
  }, []);

  // Función para limpiar todos los datos
  const clearAllData = useCallback(() => {
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

// Hook para manejo de archivos de imagen
export const useImageUpload = (
  onUpload: (base64: string) => void,
  options: {
    maxSize?: number;
  } = {}
) => {
  const { maxSize = 5 * 1024 * 1024 } = options;
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const uploadImage = useCallback((file: File) => {
    setError('');
    setIsUploading(true);

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen');
      setIsUploading(false);
      return;
    }

    // Validar tamaño
    if (file.size > maxSize) {
      setError(`La imagen debe ser menor a ${maxSize / 1024 / 1024}MB`);
      setIsUploading(false);
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onUpload(base64);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setError('Error al cargar la imagen');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  }, [onUpload, maxSize]);

  return {
    uploadImage,
    isUploading,
    error,
    clearError: () => setError(''),
  };
};

// Hook para manejo de exportación de datos
export const useDataExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToJSON = useCallback((data: PortfolioData, filename?: string) => {
    setIsExporting(true);
    
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `portfolio-data-${data.personalInfo.name || 'backup'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return { success: true, message: 'Datos exportados exitosamente' };
    } catch (error) {
      return { 
        success: false, 
        message: `Error al exportar: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      };
    } finally {
      setIsExporting(false);
    }
  }, []);

  const importFromJSON = useCallback((file: File): Promise<{ success: boolean; data?: PortfolioData; message: string }> => {
    return new Promise((resolve) => {
      setIsExporting(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          resolve({ 
            success: true, 
            data: importedData, 
            message: 'Datos importados exitosamente' 
          });
        } catch (error) {
          resolve({ 
            success: false, 
            message: `Error al importar: ${error instanceof Error ? error.message : 'Archivo JSON inválido'}` 
          });
        } finally {
          setIsExporting(false);
        }
      };
      reader.onerror = () => {
        resolve({ 
          success: false, 
          message: 'Error al leer el archivo' 
        });
        setIsExporting(false);
      };
      reader.readAsText(file);
    });
  }, []);

  return {
    exportToJSON,
    importFromJSON,
    isExporting,
  };
};

// Hook para manejo del estado de la aplicación
export const useAppState = (initialMode: AppMode = 'editor') => {
  const [state, setState] = useState<PortfolioGeneratorState>({
    showPreview: false,
    showDataMenu: false,
    currentMode: initialMode,
  });

  const actions = {
    setShowPreview: (show: boolean) => 
      setState(prev => ({ ...prev, showPreview: show })),
      
    setShowDataMenu: (show: boolean) => 
      setState(prev => ({ ...prev, showDataMenu: show })),
      
    setCurrentMode: (mode: AppMode) => 
      setState(prev => ({ ...prev, currentMode: mode })),
      
    togglePreview: () => 
      setState(prev => ({ ...prev, showPreview: !prev.showPreview })),
      
    toggleDataMenu: () => 
      setState(prev => ({ ...prev, showDataMenu: !prev.showDataMenu })),
  };

  return [state, actions] as const;
};

// Hook para manejar clicks fuera de un elemento
export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  enabled = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback, enabled]);
};

// Hook para manejar el evento beforeunload
export const useBeforeUnload = (data: any, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = () => {
      localStorage.setItem('portfolioData', JSON.stringify(data));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [data, enabled]);
};

// Hook para cambio de modo con persistencia
export const useModeSwitcher = () => {
  const [currentMode, setCurrentMode] = useLocalStorage<AppMode>('portfolioMode', 'editor');

  const switchMode = useCallback((mode: AppMode) => {
    setCurrentMode(mode);
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    window.location.href = url.toString();
  }, [setCurrentMode]);

  return {
    currentMode,
    switchMode,
    isEditorMode: currentMode === 'editor',
    isPortfolioMode: currentMode === 'portfolio',
  };
};
// Hook para manejo de plantillas
export const useTemplates = () => {
  const [templates] = useState([
    {
      id: 'creative',
      name: 'Creative',
      colors: {
        primary: '#8B5CF6',
        secondary: '#A855F7',
        accent: '#10B981',
        surface: '#FFFFFF'
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      colors: {
        primary: '#2563EB',
        secondary: '#1D4ED8',
        accent: '#059669',
        surface: '#F8FAFC'
      }
    },
    {
      id: 'minimal',
      name: 'Minimal',
      colors: {
        primary: '#374151',
        secondary: '#4B5563',
        accent: '#F59E0B',
        surface: '#FFFFFF'
      }
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useLocalStorage('selectedTemplate', null);

  const selectTemplate = useCallback((template: any) => {
    setSelectedTemplate(template);
  }, [setSelectedTemplate]);

  return {
    templates,
    selectedTemplate,
    selectTemplate
  };
};
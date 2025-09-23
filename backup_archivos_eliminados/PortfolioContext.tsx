// src/contexts/PortfolioContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { PortfolioData, Project, Skill, Experience, Education, Achievement } from '../types/portfolio-types';
import { DEFAULT_PORTFOLIO_DATA, APP_CONFIG } from '../constants';
import { storage, debounce } from '../utils';

// Estado de la aplicación
interface PortfolioState {
  data: PortfolioData;
  ui: {
    isLoading: boolean;
    saveStatus: 'idle' | 'saving' | 'saved' | 'error';
    currentSection: string;
    errors: Record<string, string>;
  };
  settings: {
    autoSave: boolean;
  };
}

// Acciones del reducer
type PortfolioAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAVE_STATUS'; payload: PortfolioState['ui']['saveStatus'] }
  | { type: 'SET_CURRENT_SECTION'; payload: string }
  | { type: 'SET_ERROR'; payload: { field: string; message: string } }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'LOAD_DATA'; payload: PortfolioData }
  | { type: 'UPDATE_PERSONAL_INFO'; payload: { field: keyof PortfolioData['personalInfo']; value: string } }
  | { type: 'UPDATE_PROJECT'; payload: { index: number; field: keyof Project; value: string } }
  | { type: 'ADD_PROJECT' }
  | { type: 'REMOVE_PROJECT'; payload: number }
  | { type: 'UPDATE_SKILL'; payload: { index: number; field: keyof Skill; value: string } }
  | { type: 'ADD_SKILL' }
  | { type: 'REMOVE_SKILL'; payload: number }
  | { type: 'UPDATE_EXPERIENCE'; payload: { index: number; field: keyof Experience; value: string } }
  | { type: 'ADD_EXPERIENCE' }
  | { type: 'REMOVE_EXPERIENCE'; payload: number }
  | { type: 'UPDATE_EDUCATION'; payload: { index: number; field: keyof Education; value: string } }
  | { type: 'ADD_EDUCATION' }
  | { type: 'REMOVE_EDUCATION'; payload: number }
  | { type: 'UPDATE_ACHIEVEMENT'; payload: { index: number; field: keyof Achievement; value: string } }
  | { type: 'ADD_ACHIEVEMENT' }
  | { type: 'REMOVE_ACHIEVEMENT'; payload: number }
  | { type: 'RESET_DATA' }
  | { type: 'TOGGLE_AUTO_SAVE' };

// Estado inicial
const initialState: PortfolioState = {
  data: DEFAULT_PORTFOLIO_DATA,
  ui: {
    isLoading: false,
    saveStatus: 'idle',
    currentSection: 'personalInfo',
    errors: {},
  },
  settings: {
    autoSave: true,
  },
};

// Reducer
function portfolioReducer(state: PortfolioState, action: PortfolioAction): PortfolioState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, ui: { ...state.ui, isLoading: action.payload } };

    case 'SET_SAVE_STATUS':
      return { ...state, ui: { ...state.ui, saveStatus: action.payload } };

    case 'SET_CURRENT_SECTION':
      return { ...state, ui: { ...state.ui, currentSection: action.payload } };

    case 'SET_ERROR':
      return {
        ...state,
        ui: { ...state.ui, errors: { ...state.ui.errors, [action.payload.field]: action.payload.message } }
      };

    case 'CLEAR_ERROR':
      const { [action.payload]: _, ...remainingErrors } = state.ui.errors;
      return { ...state, ui: { ...state.ui, errors: remainingErrors } };

    case 'LOAD_DATA':
      return { ...state, data: action.payload, ui: { ...state.ui, saveStatus: 'saved' } };

    case 'UPDATE_PERSONAL_INFO':
      return {
        ...state,
        data: {
          ...state.data,
          personalInfo: { ...state.data.personalInfo, [action.payload.field]: action.payload.value }
        },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'UPDATE_PROJECT':
      const updatedProjects = [...state.data.projects];
      updatedProjects[action.payload.index] = {
        ...updatedProjects[action.payload.index],
        [action.payload.field]: action.payload.value
      };
      return {
        ...state,
        data: { ...state.data, projects: updatedProjects },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'ADD_PROJECT':
      return {
        ...state,
        data: {
          ...state.data,
          projects: [...state.data.projects, {
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
          }]
        },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'REMOVE_PROJECT':
      return {
        ...state,
        data: { ...state.data, projects: state.data.projects.filter((_, index) => index !== action.payload) },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'UPDATE_SKILL':
      const updatedSkills = [...state.data.skills];
      updatedSkills[action.payload.index] = {
        ...updatedSkills[action.payload.index],
        [action.payload.field]: action.payload.value
      };
      return {
        ...state,
        data: { ...state.data, skills: updatedSkills },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'ADD_SKILL':
      return {
        ...state,
        data: { ...state.data, skills: [...state.data.skills, { category: "", items: "" }] },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'REMOVE_SKILL':
      return {
        ...state,
        data: { ...state.data, skills: state.data.skills.filter((_, index) => index !== action.payload) },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'UPDATE_EXPERIENCE':
      const updatedExperience = [...state.data.experience];
      updatedExperience[action.payload.index] = {
        ...updatedExperience[action.payload.index],
        [action.payload.field]: action.payload.value
      };
      return {
        ...state,
        data: { ...state.data, experience: updatedExperience },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'ADD_EXPERIENCE':
      return {
        ...state,
        data: { ...state.data, experience: [...state.data.experience, { company: "", position: "", period: "", description: "" }] },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'REMOVE_EXPERIENCE':
      return {
        ...state,
        data: { ...state.data, experience: state.data.experience.filter((_, index) => index !== action.payload) },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'UPDATE_EDUCATION':
      const updatedEducation = [...state.data.education];
      updatedEducation[action.payload.index] = {
        ...updatedEducation[action.payload.index],
        [action.payload.field]: action.payload.value
      };
      return {
        ...state,
        data: { ...state.data, education: updatedEducation },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'ADD_EDUCATION':
      return {
        ...state,
        data: { ...state.data, education: [...state.data.education, { institution: "", degree: "", period: "", description: "" }] },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'REMOVE_EDUCATION':
      return {
        ...state,
        data: { ...state.data, education: state.data.education.filter((_, index) => index !== action.payload) },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'UPDATE_ACHIEVEMENT':
      const updatedAchievements = [...state.data.achievements];
      updatedAchievements[action.payload.index] = {
        ...updatedAchievements[action.payload.index],
        [action.payload.field]: action.payload.value
      };
      return {
        ...state,
        data: { ...state.data, achievements: updatedAchievements },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        data: { ...state.data, achievements: [...state.data.achievements, { title: "", description: "", date: "" }] },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'REMOVE_ACHIEVEMENT':
      return {
        ...state,
        data: { ...state.data, achievements: state.data.achievements.filter((_, index) => index !== action.payload) },
        ui: { ...state.ui, saveStatus: 'saving' }
      };

    case 'RESET_DATA':
      return {
        ...state,
        data: DEFAULT_PORTFOLIO_DATA,
        ui: { ...state.ui, saveStatus: 'saving', errors: {} }
      };

    case 'TOGGLE_AUTO_SAVE':
      return { ...state, settings: { ...state.settings, autoSave: !state.settings.autoSave } };

    default:
      return state;
  }
}

// Context
interface PortfolioContextType {
  state: PortfolioState;
  actions: {
    // UI Actions
    setLoading: (loading: boolean) => void;
    setSaveStatus: (status: PortfolioState['ui']['saveStatus']) => void;
    setCurrentSection: (section: string) => void;
    setError: (field: string, message: string) => void;
    clearError: (field: string) => void;
    
    // Data Actions
    loadData: (data: PortfolioData) => void;
    updatePersonalInfo: (field: keyof PortfolioData['personalInfo'], value: string) => void;
    updateProject: (index: number, field: keyof Project, value: string) => void;
    addProject: () => void;
    removeProject: (index: number) => void;
    updateSkill: (index: number, field: keyof Skill, value: string) => void;
    addSkill: () => void;
    removeSkill: (index: number) => void;
    updateExperience: (index: number, field: keyof Experience, value: string) => void;
    addExperience: () => void;
    removeExperience: (index: number) => void;
    updateEducation: (index: number, field: keyof Education, value: string) => void;
    addEducation: () => void;
    removeEducation: (index: number) => void;
    updateAchievement: (index: number, field: keyof Achievement, value: string) => void;
    addAchievement: () => void;
    removeAchievement: (index: number) => void;
    resetData: () => void;
    
    // Storage Actions
    exportData: () => void;
    importData: (data: PortfolioData) => void;
  };
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Provider Component
interface PortfolioProviderProps {
  children: ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);

  // Debounced save function
  const debouncedSave = debounce(() => {
    if (state.settings.autoSave) {
      storage.set(APP_CONFIG.STORAGE_KEY, state.data);
      dispatch({ type: 'SET_SAVE_STATUS', payload: 'saved' });
    }
  }, APP_CONFIG.AUTO_SAVE_INTERVAL);

  // Auto-save effect
  useEffect(() => {
    if (state.ui.saveStatus === 'saving' && state.settings.autoSave) {
      debouncedSave();
    }
  }, [state.ui.saveStatus, state.settings.autoSave, debouncedSave]);

  // Load data on mount
  useEffect(() => {
    const savedData = storage.get(APP_CONFIG.STORAGE_KEY, DEFAULT_PORTFOLIO_DATA);
    dispatch({ type: 'LOAD_DATA', payload: savedData });
  }, []);

  // Action creators
  const actions: PortfolioContextType['actions'] = {
    // UI Actions
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setSaveStatus: (status) => dispatch({ type: 'SET_SAVE_STATUS', payload: status }),
    setCurrentSection: (section) => dispatch({ type: 'SET_CURRENT_SECTION', payload: section }),
    setError: (field, message) => dispatch({ type: 'SET_ERROR', payload: { field, message } }),
    clearError: (field) => dispatch({ type: 'CLEAR_ERROR', payload: field }),

    // Data Actions
    loadData: (data) => dispatch({ type: 'LOAD_DATA', payload: data }),
    updatePersonalInfo: (field, value) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { field, value } }),
    updateProject: (index, field, value) => dispatch({ type: 'UPDATE_PROJECT', payload: { index, field, value } }),
    addProject: () => dispatch({ type: 'ADD_PROJECT' }),
    removeProject: (index) => dispatch({ type: 'REMOVE_PROJECT', payload: index }),
    updateSkill: (index, field, value) => dispatch({ type: 'UPDATE_SKILL', payload: { index, field, value } }),
    addSkill: () => dispatch({ type: 'ADD_SKILL' }),
    removeSkill: (index) => dispatch({ type: 'REMOVE_SKILL', payload: index }),
    updateExperience: (index, field, value) => dispatch({ type: 'UPDATE_EXPERIENCE', payload: { index, field, value } }),
    addExperience: () => dispatch({ type: 'ADD_EXPERIENCE' }),
    removeExperience: (index) => dispatch({ type: 'REMOVE_EXPERIENCE', payload: index }),
    updateEducation: (index, field, value) => dispatch({ type: 'UPDATE_EDUCATION', payload: { index, field, value } }),
    addEducation: () => dispatch({ type: 'ADD_EDUCATION' }),
    removeEducation: (index) => dispatch({ type: 'REMOVE_EDUCATION', payload: index }),
    updateAchievement: (index, field, value) => dispatch({ type: 'UPDATE_ACHIEVEMENT', payload: { index, field, value } }),
    addAchievement: () => dispatch({ type: 'ADD_ACHIEVEMENT' }),
    removeAchievement: (index) => dispatch({ type: 'REMOVE_ACHIEVEMENT', payload: index }),
    resetData: () => dispatch({ type: 'RESET_DATA' }),

    // Storage Actions
    exportData: () => {
      const filename = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
      const content = JSON.stringify(state.data, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    importData: (data) => {
      try {
        dispatch({ type: 'LOAD_DATA', payload: data });
        dispatch({ type: 'SET_SAVE_STATUS', payload: 'saved' });
      } catch (error) {
        console.error('Error importing data:', error);
        dispatch({ type: 'SET_ERROR', payload: { field: 'import', message: 'Error al importar los datos' } });
      }
    },
  };

  return (
    <PortfolioContext.Provider value={{ state, actions }}>
      {children}
    </PortfolioContext.Provider>
  );
};

// Custom hook to use the context
export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
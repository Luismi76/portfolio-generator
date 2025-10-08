// hooks/useAppState.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import type { AppMode, PortfolioGeneratorState } from '../types/portfolio-types';
import { useLocalStorage } from './useLocalStorage';

/**
 * Acciones disponibles para el estado de la aplicación
 */
export interface AppStateActions {
  setShowPreview: (show: boolean) => void;
  setShowDataMenu: (show: boolean) => void;
  setCurrentMode: (mode: AppMode) => void;
  togglePreview: () => void;
  toggleDataMenu: () => void;
}

/**
 * Hook para manejo del estado de la aplicación (preview, menu, modo)
 * 
 * @param initialMode - Modo inicial de la aplicación
 * @returns Tupla con [estado, acciones]
 * 
 * @example
 * const [state, actions] = useAppState('editor');
 * 
 * // Usar estado
 * if (state.showPreview) { ... }
 * 
 * // Usar acciones
 * actions.togglePreview();
 * actions.setCurrentMode('templates');
 */
export const useAppState = (initialMode: AppMode = 'editor') => {
  const [state, setState] = useState<PortfolioGeneratorState>({
    showPreview: false,
    showDataMenu: false,
    currentMode: initialMode,
  });

  const actions: AppStateActions = {
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

/**
 * Hook para manejar clicks fuera de un elemento
 * 
 * @param ref - Referencia al elemento
 * @param callback - Función a ejecutar cuando se hace click fuera
 * @param enabled - Si el hook está activo
 * 
 * @example
 * const menuRef = useRef<HTMLDivElement>(null);
 * useClickOutside(menuRef, () => setMenuOpen(false));
 */
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

/**
 * Hook para manejar el evento beforeunload (guardar antes de cerrar)
 * 
 * @param data - Datos a guardar
 * @param enabled - Si el hook está activo
 * 
 * @example
 * useBeforeUnload(portfolioData, true);
 */
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

/**
 * Retorno del hook useModeSwitcher
 */
export interface UseModeSwitcherReturn {
  currentMode: AppMode;
  switchMode: (mode: AppMode) => void;
  isEditorMode: boolean;
  isTemplatesMode: boolean;
  isPreviewMode: boolean;
  isPortfolioMode: boolean;
}

/**
 * Hook para cambio de modo con persistencia en localStorage y URL
 * 
 * @returns Objeto con modo actual, función de cambio y helpers booleanos
 * 
 * @example
 * const { currentMode, switchMode, isEditorMode } = useModeSwitcher();
 * 
 * if (isEditorMode) {
 *   return <EditorView />;
 * }
 * 
 * <button onClick={() => switchMode('templates')}>
 *   Ver Plantillas
 * </button>
 */
export const useModeSwitcher = (): UseModeSwitcherReturn => {
  const [currentMode, setCurrentMode] = useLocalStorage<AppMode>('portfolioMode', 'editor');

  const switchMode = useCallback((mode: AppMode) => {
    setCurrentMode(mode);
    
    // Actualizar URL query params
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    window.history.pushState({}, '', url.toString());
  }, [setCurrentMode]);

  return {
    currentMode,
    switchMode,
    isEditorMode: currentMode === 'editor',
    isTemplatesMode: currentMode === 'templates',
    isPreviewMode: currentMode === 'preview',
    isPortfolioMode: currentMode === 'portfolio',
  };
};

/**
 * Opciones para el hook useAutoSave
 */
export interface UseAutoSaveOptions {
  delay?: number;
  enabled?: boolean;
  onSave?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook para auto-guardado con debounce
 * 
 * @param key - Clave de localStorage
 * @param data - Datos a guardar
 * @param options - Opciones de configuración
 * 
 * @example
 * useAutoSave('portfolioData', data, {
 *   delay: 2000,
 *   enabled: true,
 *   onSave: () => console.log('Guardado automático')
 * });
 */
export const useAutoSave = <T>(
  key: string,
  data: T,
  options: UseAutoSaveOptions = {}
) => {
  const {
    delay = 1000,
    enabled = true,
    onSave,
    onError
  } = options;

  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled) return;

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Configurar nuevo timeout
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        onSave?.();
      } catch (error) {
        onError?.(error as Error);
      }
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, key, onSave, onError]);
};
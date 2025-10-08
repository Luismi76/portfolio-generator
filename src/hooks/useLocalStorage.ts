// hooks/useLocalStorage.ts
import { useState, useCallback } from 'react';

/**
 * Opciones para el hook useLocalStorage
 */
export interface UseLocalStorageOptions<T> {
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

/**
 * Hook para manejo de localStorage con tipado completo
 * 
 * @param key - Clave del localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @param options - Opciones de serialización/deserialización
 * @returns Tupla con [valor, setter, remover]
 * 
 * @example
 * const [data, setData, clearData] = useLocalStorage('myKey', { count: 0 });
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  // Estado inicial: leer de localStorage o usar valor inicial
  const [storedValue, setStoredValue] = useState<T>(() => {
    // SSR compatibility
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

  // Setter que actualiza tanto el estado como localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Permitir funciones de actualización al estilo useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Actualizar estado
      setStoredValue(valueToStore);
      
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serialize(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, serialize, storedValue]);

  // Función para remover el valor
  const removeValue = useCallback(() => {
    try {
      // Resetear al valor inicial
      setStoredValue(initialValue);
      
      // Remover de localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};
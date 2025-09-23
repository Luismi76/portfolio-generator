// src/utils/index.ts
import { VALIDATION_MESSAGES } from '../constants';

// Validadores simples
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },
};

// Funciones de validación que retornan mensajes de error
export const validate = {
  email: (email: string): string | null => {
    if (!email.trim()) return VALIDATION_MESSAGES.required;
    if (!validators.email(email)) return VALIDATION_MESSAGES.email;
    return null;
  },

  url: (url: string, required = false): string | null => {
    if (!url.trim()) return required ? VALIDATION_MESSAGES.required : null;
    if (url.trim() && !validators.url(url)) return VALIDATION_MESSAGES.url;
    return null;
  },

  required: (value: string): string | null => {
    return validators.required(value) ? null : VALIDATION_MESSAGES.required;
  },
};

// Utilidades de formato
export const formatters = {
  slug: (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/\-+/g, '-')
      .replace(/^\-|\-$/g, '');
  },

  truncate: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  },
};

// Utilidades de almacenamiento
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
      return false;
    }
  },
};

// Utilidades de archivos
export const fileUtils = {
  downloadFile: (filename: string, content: string, mimeType = 'text/plain'): void => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  downloadJSON: (filename: string, data: object): void => {
    const content = JSON.stringify(data, null, 2);
    fileUtils.downloadFile(filename, content, 'application/json');
  },

  readAsDataURL: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsDataURL(file);
    });
  },
};

// Utilidad para debounce
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
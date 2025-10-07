// src/components/project-form/utils/imageValidation.ts

/**
 * Valida si una URL de imagen es válida
 * @param url - URL a validar
 * @returns true si la URL es válida, false en caso contrario
 */
export const validateImageUrl = (url: string): boolean => {
  if (!url.trim()) return true; // URL vacía es válida (opcional)
  
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

/**
 * Valida si una URL de imagen es válida y no vacía
 * @param url - URL a validar
 * @returns true si la URL es válida y no vacía
 */
export const validateRequiredImageUrl = (url: string): boolean => {
  if (!url.trim()) return false;
  
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};
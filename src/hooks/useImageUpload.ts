// hooks/useImageUpload.ts
import { useState, useCallback } from 'react';

/**
 * Opciones para el hook useImageUpload
 */
export interface UseImageUploadOptions {
  maxSize?: number;
  acceptedFormats?: string[];
}

/**
 * Resultado del hook useImageUpload
 */
export interface UseImageUploadReturn {
  uploadImage: (file: File) => void;
  isUploading: boolean;
  error: string;
  clearError: () => void;
}

/**
 * Hook para manejo de subida de imágenes con validación
 * Convierte la imagen a base64 y ejecuta callback onUpload
 * 
 * @param onUpload - Callback que recibe la imagen en base64
 * @param options - Opciones de validación
 * @returns Objeto con funciones y estado de carga
 * 
 * @example
 * const { uploadImage, isUploading, error } = useImageUpload(
 *   (base64) => setImageData(base64),
 *   { maxSize: 5 * 1024 * 1024 }
 * );
 */
export const useImageUpload = (
  onUpload: (base64: string) => void,
  options: UseImageUploadOptions = {}
): UseImageUploadReturn => {
  const { 
    maxSize = 5 * 1024 * 1024, // 5MB por defecto
    acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  } = options;

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

    // Validar formato específico si se proporcionó
    if (acceptedFormats.length > 0 && !acceptedFormats.includes(file.type)) {
      setError(`Formato no soportado. Usa: ${acceptedFormats.join(', ')}`);
      setIsUploading(false);
      return;
    }

    // Validar tamaño
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
      setError(`La imagen debe ser menor a ${maxSizeMB}MB`);
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
  }, [onUpload, maxSize, acceptedFormats]);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    uploadImage,
    isUploading,
    error,
    clearError,
  };
};
// src/components/project-form/utils/imageHelpers.ts

/**
 * Convierte un string de imágenes separadas por comas en un array
 * Filtra URLs inválidas
 */
export const getImagesArray = (imagesString: string): string[] => {
  if (!imagesString || imagesString.trim() === '') return [];
  
  return imagesString
    .split(',')
    .map(img => img.trim())
    .filter(img => img.length > 0 && (img.startsWith('http') || img.startsWith('https')));
};

/**
 * Cuenta el número de imágenes válidas en un string
 */
export const getValidImageCount = (imagesString: string): number => {
  if (!imagesString || imagesString.trim() === '') return 0;
  
  return imagesString
    .split(',')
    .map(img => img.trim())
    .filter(img => 
      img.length > 0 && 
      (img.startsWith('http') || img.startsWith('https'))
    ).length;
};

/**
 * Imagen placeholder para cuando falla la carga
 */
export const ERROR_PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg==';
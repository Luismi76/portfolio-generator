// hooks/useDataExport.ts
import { useState, useCallback } from 'react';
import type { PortfolioData } from '../types/portfolio-types';

/**
 * Resultado de una operación de exportación
 */
export interface ExportResult {
  success: boolean;
  message: string;
}

/**
 * Resultado de una operación de importación
 */
export interface ImportResult extends ExportResult {
  data?: PortfolioData;
}

/**
 * Retorno del hook useDataExport
 */
export interface UseDataExportReturn {
  exportToJSON: (data: PortfolioData, filename?: string) => ExportResult;
  importFromJSON: (file: File) => Promise<ImportResult>;
  isExporting: boolean;
}

/**
 * Hook para manejo de exportación e importación de datos JSON
 * 
 * @returns Objeto con funciones de export/import y estado
 * 
 * @example
 * const { exportToJSON, importFromJSON, isExporting } = useDataExport();
 * 
 * // Exportar
 * const result = exportToJSON(portfolioData, 'my-portfolio.json');
 * 
 * // Importar
 * const importResult = await importFromJSON(file);
 * if (importResult.success) {
 *   setData(importResult.data);
 * }
 */
export const useDataExport = (): UseDataExportReturn => {
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Exporta datos a un archivo JSON descargable
   */
  const exportToJSON = useCallback((
    data: PortfolioData, 
    filename?: string
  ): ExportResult => {
    setIsExporting(true);
    
    try {
      // Serializar datos con formato legible
      const dataStr = JSON.stringify(data, null, 2);
      
      // Crear blob y URL
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Crear elemento de descarga temporal
      const a = document.createElement('a');
      a.href = url;
      // Usar fullName para el nombre del archivo
      const userName = data.personalInfo.fullName || 'portfolio';
      a.download = filename || `portfolio-data-${userName}.json`;
      
      // Triggear descarga
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return { 
        success: true, 
        message: 'Datos exportados exitosamente' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Error al exportar: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      };
    } finally {
      setIsExporting(false);
    }
  }, []);

  /**
   * Importa datos desde un archivo JSON
   */
  const importFromJSON = useCallback((file: File): Promise<ImportResult> => {
    return new Promise((resolve) => {
      setIsExporting(true);
      
      // Validar que sea un archivo JSON
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        resolve({
          success: false,
          message: 'Por favor selecciona un archivo JSON válido'
        });
        setIsExporting(false);
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          
          // Validación básica de estructura
          if (!importedData.personalInfo || !importedData.projects) {
            throw new Error('Archivo JSON con estructura inválida');
          }
          
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
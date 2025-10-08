// hooks/index.ts
export { useLocalStorage } from './useLocalStorage';
export { usePortfolioData } from './usePortfolioData';
export { useImageUpload } from './useImageUpload';
export { useDataExport } from './useDataExport';
export { 
    useAppState,
    useClickOutside,
    useBeforeUnload,
    useModeSwitcher,
    useAutoSave
} from './useAppState';
export { useAdvancedTemplates } from './useAdvancedTemplates';

// Exportar tipos
export type { UseLocalStorageOptions } from './useLocalStorage';
export type { UsePortfolioDataState, UsePortfolioDataReturn } from './usePortfolioData';
export type { UseImageUploadOptions, UseImageUploadReturn } from './useImageUpload';
export type { ExportResult, ImportResult, UseDataExportReturn } from './useDataExport';
export type { AppStateActions, UseModeSwitcherReturn, UseAutoSaveOptions } from './useAppState';

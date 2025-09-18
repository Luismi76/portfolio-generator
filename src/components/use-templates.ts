// use-templates.ts
import { useState, useEffect, useCallback } from 'react';
import type { 
  Template, 
  TemplateConfig, 
  UseTemplatesOptions, 
  UseTemplatesReturn 
} from '../types/template-types';
import { BUILT_IN_TEMPLATES, getDefaultTemplate, getTemplateById } from './built-in-templates';

// Interfaz del hook extendida
interface ExtendedUseTemplatesReturn extends UseTemplatesReturn {
  validateCurrentConfig: () => { valid: boolean; errors: string[] };
  getCurrentCSS: () => string;
  duplicateTemplate: (templateId: string, newName?: string) => Template | null;
  isLoaded: boolean;
}

export const useTemplates = (options: UseTemplatesOptions = {}): ExtendedUseTemplatesReturn => {
  const { 
    defaultTemplateId = 'modern', 
    storageKey = 'portfolioTemplates' 
  } = options;

  // Estado principal
  const [templates, setTemplates] = useState<Template[]>(BUILT_IN_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [config, setConfig] = useState<TemplateConfig | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar configuración desde localStorage al inicializar
  useEffect(() => {
    const loadSavedData = () => {
      try {
        // Cargar plantillas custom guardadas
        const savedTemplatesData = localStorage.getItem(`${storageKey}_custom`);
        if (savedTemplatesData) {
          const customTemplates: Template[] = JSON.parse(savedTemplatesData);
          // Validar que son plantillas válidas antes de agregarlas
          const validCustomTemplates = customTemplates.filter(template => 
            template.id && template.name && template.colors && template.typography
          );
          setTemplates([...BUILT_IN_TEMPLATES, ...validCustomTemplates]);
        }

        // Cargar plantilla seleccionada
        const savedConfigData = localStorage.getItem(`${storageKey}_config`);
        if (savedConfigData) {
          const savedConfig: TemplateConfig = JSON.parse(savedConfigData);
          const template = getTemplateById(savedConfig.templateId) || 
                          templates.find(t => t.id === savedConfig.templateId);
          
          if (template) {
            setSelectedTemplate(template);
            setConfig(savedConfig);
          } else {
            // Template no encontrada, usar default
            initializeDefaultTemplate();
          }
        } else {
          initializeDefaultTemplate();
        }
      } catch (error) {
        console.error('Error loading template data:', error);
        initializeDefaultTemplate();
      } finally {
        setIsLoaded(true);
      }
    };

    const initializeDefaultTemplate = () => {
      const defaultTemplate = getTemplateById(defaultTemplateId) || getDefaultTemplate();
      setSelectedTemplate(defaultTemplate);
      setConfig({
        templateId: defaultTemplate.id,
        customizations: {}
      });
    };

    loadSavedData();
  }, [defaultTemplateId, storageKey, templates]);

  // Guardar configuración cuando cambie
  useEffect(() => {
    if (isLoaded && config) {
      try {
        localStorage.setItem(`${storageKey}_config`, JSON.stringify(config));
      } catch (error) {
        console.error('Error saving template config:', error);
      }
    }
  }, [config, storageKey, isLoaded]);

  // Guardar plantillas custom cuando cambien
  useEffect(() => {
    if (isLoaded) {
      try {
        const customTemplates = templates.filter(t => !t.isBuiltIn);
        if (customTemplates.length > 0) {
          localStorage.setItem(`${storageKey}_custom`, JSON.stringify(customTemplates));
        }
      } catch (error) {
        console.error('Error saving custom templates:', error);
      }
    }
  }, [templates, storageKey, isLoaded]);

const selectTemplate = useCallback((template: Template) => {
  setSelectedTemplate(template);
  setConfig({
    templateId: template.id,
    customizations: {}
  });
  
  // AGREGAR ESTA LÍNEA para compatibilidad con Portfolio.tsx:
  localStorage.setItem('selectedTemplate', JSON.stringify({
    id: template.id,
    name: template.name,
    colors: {
      primary: template.colors.primary,
      secondary: template.colors.secondary,
      accent: template.colors.accent,
      surface: template.colors.surface
    }
  }));
}, []);

  // Actualizar configuración de personalización
  const updateConfig = useCallback((newConfig: Partial<TemplateConfig>) => {
    setConfig(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        ...newConfig,
        customizations: {
          ...prev.customizations,
          ...newConfig.customizations
        }
      };
    });
  }, []);

  // Resetear configuración a valores por defecto
  const resetConfig = useCallback(() => {
    if (!selectedTemplate) return;
    
    setConfig({
      templateId: selectedTemplate.id,
      customizations: {}
    });
  }, [selectedTemplate]);

  // Agregar plantilla custom
  const addCustomTemplate = useCallback((templateData: Omit<Template, 'id' | 'isBuiltIn'>) => {
    // Generar ID único
    const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newTemplate: Template = {
      ...templateData,
      id,
      isBuiltIn: false,
      version: templateData.version || '1.0.0'
    };

    // Validar estructura básica
    if (!newTemplate.name || !newTemplate.colors || !newTemplate.typography || !newTemplate.layout) {
      throw new Error('Plantilla inválida: faltan campos requeridos');
    }

    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  }, []);

  // Eliminar plantilla custom
  const removeCustomTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    
    // Solo permitir eliminar plantillas custom
    if (!template || template.isBuiltIn) {
      throw new Error('No se puede eliminar una plantilla built-in');
    }

    setTemplates(prev => prev.filter(t => t.id !== templateId));

    // Si era la plantilla seleccionada, cambiar a default
    if (selectedTemplate?.id === templateId) {
      const defaultTemplate = getDefaultTemplate();
      selectTemplate(defaultTemplate);
    }
  }, [templates, selectedTemplate, selectTemplate]);

  // Exportar plantilla como JSON
  const exportTemplate = useCallback((templateId: string): string => {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Plantilla no encontrada');
    }

    // Crear copia sin datos internos
    const exportData = {
      ...template,
      id: undefined, // Se generará nuevo ID al importar
      isBuiltIn: false, // Siempre será custom al importar
      exportedAt: new Date().toISOString(),
      exportedBy: 'Portfolio Generator'
    };

    return JSON.stringify(exportData, null, 2);
  }, [templates]);

  // Importar plantilla desde JSON
  const importTemplate = useCallback((templateData: string): boolean => {
    try {
      const parsedTemplate = JSON.parse(templateData);
      
      // Validar estructura básica
      if (!parsedTemplate.name || !parsedTemplate.colors || !parsedTemplate.typography) {
        throw new Error('Estructura de plantilla inválida');
      }

      // Limpiar campos que se regenerarán
      const { id, isBuiltIn, exportedAt, exportedBy, ...cleanTemplate } = parsedTemplate;

      // Agregar plantilla
      addCustomTemplate(cleanTemplate);
      return true;
    } catch (error) {
      console.error('Error importing template:', error);
      return false;
    }
  }, [addCustomTemplate]);

  // Validar configuración actual
  const validateCurrentConfig = useCallback((): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!selectedTemplate) {
      errors.push('No hay plantilla seleccionada');
    }

    if (!config) {
      errors.push('No hay configuración');
    } else {
      // Validar que la plantilla existe
      const templateExists = templates.some(t => t.id === config.templateId);
      if (!templateExists) {
        errors.push(`Plantilla "${config.templateId}" no encontrada`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }, [selectedTemplate, config, templates]);

  // Obtener CSS compilado de la configuración actual
  const getCurrentCSS = useCallback((): string => {
    if (!selectedTemplate || !config) return '';

    const template = selectedTemplate;
    const customizations = config.customizations;

    // Combinar colores (template base + customizaciones)
    const colors = { ...template.colors, ...customizations.colors };
    const typography = { ...template.typography, ...customizations.typography };
    const layout = { ...template.layout, ...customizations.layout };

    // Generar CSS variables
    const cssVariables = `
      :root {
        /* Colores */
        --color-primary: ${colors.primary};
        --color-secondary: ${colors.secondary};
        --color-accent: ${colors.accent};
        --color-background: ${colors.background};
        --color-surface: ${colors.surface};
        --color-text-primary: ${colors.text.primary};
        --color-text-secondary: ${colors.text.secondary};
        --color-text-accent: ${colors.text.accent};
        
        /* Gradientes */
        ${colors.gradient ? `
        --gradient-primary: linear-gradient(${colors.gradient.direction || '135deg'}, ${colors.gradient.from}, ${colors.gradient.to});
        ` : ''}
        
        /* Tipografía */
        --font-primary: ${typography.fontFamily.primary};
        --font-heading: ${typography.fontFamily.heading};
        ${typography.fontFamily.code ? `--font-code: ${typography.fontFamily.code};` : ''}
        
        /* Tamaños de fuente */
        --text-xs: ${typography.fontSize.xs};
        --text-sm: ${typography.fontSize.sm};
        --text-base: ${typography.fontSize.base};
        --text-lg: ${typography.fontSize.lg};
        --text-xl: ${typography.fontSize.xl};
        --text-2xl: ${typography.fontSize['2xl']};
        --text-3xl: ${typography.fontSize['3xl']};
        --text-4xl: ${typography.fontSize['4xl']};
        
        /* Layout */
        --max-width: ${layout.maxWidth};
        --spacing-xs: ${layout.spacing.xs};
        --spacing-sm: ${layout.spacing.sm};
        --spacing-md: ${layout.spacing.md};
        --spacing-lg: ${layout.spacing.lg};
        --spacing-xl: ${layout.spacing.xl};
        
        /* Bordes y sombras */
        --radius-sm: ${layout.borderRadius.sm};
        --radius-md: ${layout.borderRadius.md};
        --radius-lg: ${layout.borderRadius.lg};
        --radius-xl: ${layout.borderRadius.xl};
        --shadow-sm: ${layout.shadows.sm};
        --shadow-md: ${layout.shadows.md};
        --shadow-lg: ${layout.shadows.lg};
        --shadow-xl: ${layout.shadows.xl};
      }
    `;

    return cssVariables + (customizations.customCSS || template.customCSS || '');
  }, [selectedTemplate, config]);

  // Duplicar plantilla (crear copia custom)
  const duplicateTemplate = useCallback((templateId: string, newName?: string): Template | null => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;

    const duplicatedTemplate = {
      ...template,
      name: newName || `${template.name} (Copia)`,
      version: '1.0.0',
      author: 'Usuario'
    };

    return addCustomTemplate(duplicatedTemplate);
  }, [templates, addCustomTemplate]);

  return {
    templates,
    selectedTemplate,
    config,
    selectTemplate,
    updateConfig,
    resetConfig,
    addCustomTemplate,
    removeCustomTemplate,
    exportTemplate,
    importTemplate,
    validateCurrentConfig,
    getCurrentCSS,
    duplicateTemplate,
    isLoaded
  };
};
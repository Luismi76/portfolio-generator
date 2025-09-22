// src/components/use-templates.ts
import { useState, useEffect, useCallback } from 'react';
import type { 
  Template, 
  TemplateConfig, 
  UseTemplatesOptions, 
  UseTemplatesReturn 
} from '../types/template-types';
import { BUILT_IN_TEMPLATES, getDefaultTemplate, getTemplateById } from './built-in-templates';

export const useTemplates = (options: UseTemplatesOptions = {}): UseTemplatesReturn => {
  const { 
    defaultTemplateId = 'modern', 
    storageKey = 'portfolioTemplates' 
  } = options;

  // Estado principal
  const [templates, setTemplates] = useState<Template[]>(BUILT_IN_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [config, setConfig] = useState<TemplateConfig | null>(null);

  // Inicializar con plantilla por defecto
  const initializeDefaultTemplate = useCallback(() => {
    const defaultTemplate = getTemplateById(defaultTemplateId) || getDefaultTemplate();
    setSelectedTemplate(defaultTemplate);
    setConfig({
      templateId: defaultTemplate.id,
      customizations: {}
    });
  }, [defaultTemplateId]);

  // Cargar configuración desde localStorage al inicializar
  useEffect(() => {
    const loadSavedData = () => {
      try {
        // Cargar plantillas custom guardadas
        const savedTemplatesData = localStorage.getItem(`${storageKey}_custom`);
        if (savedTemplatesData) {
          const customTemplates: Template[] = JSON.parse(savedTemplatesData);
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
            initializeDefaultTemplate();
          }
        } else {
          initializeDefaultTemplate();
        }
      } catch (error) {
        console.error('Error loading template data:', error);
        initializeDefaultTemplate();
      }
    };

    loadSavedData();
  }, [storageKey, templates, initializeDefaultTemplate]);

  // Guardar configuración en localStorage
  const saveConfigToStorage = useCallback((newConfig: TemplateConfig) => {
    try {
      localStorage.setItem(`${storageKey}_config`, JSON.stringify(newConfig));
    } catch (error) {
      console.error('Error saving template config:', error);
    }
  }, [storageKey]);

  // Guardar plantillas custom en localStorage
  const saveCustomTemplatesToStorage = useCallback((customTemplates: Template[]) => {
    try {
      const customOnly = customTemplates.filter(t => !t.isBuiltIn);
      localStorage.setItem(`${storageKey}_custom`, JSON.stringify(customOnly));
    } catch (error) {
      console.error('Error saving custom templates:', error);
    }
  }, [storageKey]);

  // Seleccionar plantilla
  const selectTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template);
    const newConfig: TemplateConfig = {
      templateId: template.id,
      customizations: {}
    };
    setConfig(newConfig);
    saveConfigToStorage(newConfig);
  }, [saveConfigToStorage]);

  // Actualizar configuración
  const updateConfig = useCallback((partialConfig: Partial<TemplateConfig>) => {
    if (!config) return;

    const newConfig: TemplateConfig = {
      ...config,
      ...partialConfig,
      customizations: {
        ...config.customizations,
        ...partialConfig.customizations
      }
    };
    
    setConfig(newConfig);
    saveConfigToStorage(newConfig);
  }, [config, saveConfigToStorage]);

  // Resetear configuración a valores por defecto
  const resetConfig = useCallback(() => {
    if (!selectedTemplate) return;

    const resetConfig: TemplateConfig = {
      templateId: selectedTemplate.id,
      customizations: {}
    };
    
    setConfig(resetConfig);
    saveConfigToStorage(resetConfig);
  }, [selectedTemplate, saveConfigToStorage]);

  // Agregar plantilla custom
  const addCustomTemplate = useCallback((templateData: Omit<Template, 'id' | 'isBuiltIn'>) => {
    const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newTemplate: Template = {
      ...templateData,
      id,
      isBuiltIn: false,
      version: templateData.version || '1.0.0'
    };

    if (!newTemplate.name || !newTemplate.colors || !newTemplate.typography || !newTemplate.layout) {
      throw new Error('Plantilla inválida: faltan campos requeridos');
    }

    const newTemplates = [...templates, newTemplate];
    setTemplates(newTemplates);
    saveCustomTemplatesToStorage(newTemplates);
    return newTemplate;
  }, [templates, saveCustomTemplatesToStorage]);

  // Eliminar plantilla custom
  const removeCustomTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    
    if (!template || template.isBuiltIn) {
      throw new Error('No se puede eliminar una plantilla built-in');
    }

    const newTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(newTemplates);
    saveCustomTemplatesToStorage(newTemplates);

    // Si era la plantilla seleccionada, cambiar a default
    if (selectedTemplate?.id === templateId) {
      const defaultTemplate = getDefaultTemplate();
      selectTemplate(defaultTemplate);
    }
  }, [templates, selectedTemplate, selectTemplate, saveCustomTemplatesToStorage]);

  // Exportar plantilla como JSON
  const exportTemplate = useCallback((templateId: string): string => {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Plantilla no encontrada');
    }

    const exportData = {
      ...template,
      id: undefined,
      isBuiltIn: false,
      exportedAt: new Date().toISOString(),
      exportedBy: 'Portfolio Generator'
    };

    return JSON.stringify(exportData, null, 2);
  }, [templates]);

  // Importar plantilla desde JSON
  const importTemplate = useCallback((templateData: string): boolean => {
    try {
      const parsedTemplate = JSON.parse(templateData);
      
      if (!parsedTemplate.name || !parsedTemplate.colors || !parsedTemplate.typography) {
        throw new Error('Estructura de plantilla inválida');
      }

      addCustomTemplate(parsedTemplate);
      return true;
    } catch (error) {
      console.error('Error importing template:', error);
      return false;
    }
  }, [addCustomTemplate]);

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
    importTemplate
  };
};
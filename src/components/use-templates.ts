// src/components/use-templates.ts
import { useState, useEffect, useCallback } from 'react';
import type { 
  Template, 
  TemplateConfig, 
  UseTemplatesOptions, 
  UseTemplatesReturn 
} from '../types/template-types';
import { BUILT_IN_TEMPLATES, getDefaultTemplate, getTemplateById } from './built-in-templates';

// deep merge de customizations (por keys conocidas)
function mergeCustomizations(a: TemplateConfig['customizations'], b?: TemplateConfig['customizations']) {
  if (!b) return a;
  return {
    ...a,
    colors: { ...(a.colors || {}), ...(b.colors || {}) },
    typography: { ...(a.typography || {}), ...(b.typography || {}) },
    layout: { ...(a.layout || {}), ...(b.layout || {}) },
    sections: b.sections ?? a.sections,      // lista completa si viene
    customCSS: b.customCSS ?? a.customCSS,
  };
}

export const useTemplates = (options: UseTemplatesOptions = {}): UseTemplatesReturn => {
  const { 
    defaultTemplateId = 'modern', 
    storageKey = 'portfolioTemplates' 
  } = options;

  // Estado principal
  const [templates, setTemplates] = useState<Template[]>(BUILT_IN_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [config, setConfig] = useState<TemplateConfig | null>(null);

  // Inicializar con plantilla por defecto (built-in)
  const initializeDefaultTemplate = useCallback(() => {
    const def = getTemplateById(defaultTemplateId) || getDefaultTemplate();
    setSelectedTemplate(def);
    setConfig({ templateId: def.id, customizations: {} });
  }, [defaultTemplateId]);

  // Carga inicial (sin depender de `templates` para evitar loops)
  useEffect(() => {
    try {
      // 1) cargar custom templates (si hay)
      const savedTemplatesData = localStorage.getItem(`${storageKey}_custom`);
      const customTemplates: Template[] = savedTemplatesData ? JSON.parse(savedTemplatesData) : [];
      const validCustomTemplates = customTemplates.filter(t =>
        t && t.name && t.colors && t.typography && t.layout
      );
      const mergedTemplates = [...BUILT_IN_TEMPLATES, ...validCustomTemplates];
      setTemplates(mergedTemplates);

      // 2) cargar config
      const savedConfigData = localStorage.getItem(`${storageKey}_config`);
      if (savedConfigData) {
        const savedConfig: TemplateConfig = JSON.parse(savedConfigData);
        const tpl =
          // primero intenta en built-ins (por si hay helpers especiales)
          getTemplateById(savedConfig.templateId) ||
          mergedTemplates.find(t => t.id === savedConfig.templateId);

        if (tpl) {
          setSelectedTemplate(tpl);
          setConfig(savedConfig);
        } else {
          // config apunta a una plantilla que ya no existe
          initializeDefaultTemplate();
        }
      } else {
        initializeDefaultTemplate();
      }
    } catch (error) {
      console.error('Error loading template data:', error);
      initializeDefaultTemplate();
    }
    // solo una vez al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cuando cambian las plantillas (p. ej. import), re-resolver selectedTemplate según config
  useEffect(() => {
    if (!config) return;
    const tpl = 
      getTemplateById(config.templateId) ||
      templates.find(t => t.id === config.templateId);
    if (tpl && tpl !== selectedTemplate) {
      setSelectedTemplate(tpl);
    }
  }, [templates, config, selectedTemplate]);

  // Guardar configuración en localStorage
  const saveConfigToStorage = useCallback((newConfig: TemplateConfig) => {
    try {
      localStorage.setItem(`${storageKey}_config`, JSON.stringify(newConfig));
    } catch (error) {
      console.error('Error saving template config:', error);
    }
  }, [storageKey]);

  // Guardar plantillas custom en localStorage
  const saveCustomTemplatesToStorage = useCallback((allTemplates: Template[]) => {
    try {
      const customOnly = allTemplates.filter(t => !t.isBuiltIn);
      localStorage.setItem(`${storageKey}_custom`, JSON.stringify(customOnly));
    } catch (error) {
      console.error('Error saving custom templates:', error);
    }
  }, [storageKey]);

  // Seleccionar plantilla (resetea customizations)
  const selectTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template);
    const newConfig: TemplateConfig = {
      templateId: template.id,
      customizations: {}
    };
    setConfig(newConfig);
    saveConfigToStorage(newConfig);
  }, [saveConfigToStorage]);

  // Actualizar configuración con merge profundo de customizations
  const updateConfig = useCallback((partialConfig: Partial<TemplateConfig>) => {
    if (!config) return;
    const merged: TemplateConfig = {
      ...config,
      ...partialConfig,
      customizations: mergeCustomizations(config.customizations, partialConfig.customizations)
    };
    setConfig(merged);
    saveConfigToStorage(merged);
  }, [config, saveConfigToStorage]);

  // Resetear configuración a valores por defecto de la plantilla seleccionada
  const resetConfig = useCallback(() => {
    if (!selectedTemplate) return;
    const reset: TemplateConfig = {
      templateId: selectedTemplate.id,
      customizations: {}
    };
    setConfig(reset);
    saveConfigToStorage(reset);
  }, [selectedTemplate, saveConfigToStorage]);

  // Agregar plantilla custom
  const addCustomTemplate = useCallback((templateData: Omit<Template, 'id' | 'isBuiltIn'>) => {
    const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

    const newTemplate: Template = {
      ...templateData,
      id,
      isBuiltIn: false,
      // asegura versión
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

    // Si era la plantilla seleccionada, volver a la default (respeta defaultTemplateId)
    if (selectedTemplate?.id === templateId) {
      const def = getTemplateById(defaultTemplateId) || getDefaultTemplate();
      selectTemplate(def);
    }
  }, [templates, selectedTemplate, defaultTemplateId, selectTemplate, saveCustomTemplatesToStorage]);

  // Exportar plantilla como JSON (sin id ni flag built-in)
  const exportTemplate = useCallback((templateId: string): string => {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Plantilla no encontrada');
    }
    const { id, isBuiltIn, ...rest } = template;
    const exportData = {
      ...rest,
      exportedAt: new Date().toISOString(),
      exportedBy: 'Portfolio Generator'
    };
    return JSON.stringify(exportData, null, 2);
  }, [templates]);

  // Importar plantilla desde JSON
  const importTemplate = useCallback((templateData: string): boolean => {
    try {
      const parsed = JSON.parse(templateData);
      if (!parsed.name || !parsed.colors || !parsed.typography || !parsed.layout) {
        throw new Error('Estructura de plantilla inválida');
      }
      addCustomTemplate(parsed);
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

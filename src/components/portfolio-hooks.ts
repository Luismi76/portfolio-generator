// src/portfolio-hooks.ts
import { useState, useEffect, useRef, useCallback } from "react";
import {
  PortfolioData,
  PortfolioDataState,
  PortfolioDataActions,
  UsePortfolioDataOptions,
  PersonalInfoKey,
  Project,
  Skill,
  Experience,
  Education,
  Achievement,
  SectionKey,
  DEFAULT_PORTFOLIO_DATA,
  AppMode,
  PortfolioGeneratorState,
} from "../types/portfolio-types";

// ==========================
// Claves de almacenamiento
// ==========================
const STORAGE_KEYS = {
  portfolio: "portfolioData",
  templateConfig: "portfolioTemplates_config",
  customTemplates: "portfolioTemplates_custom",
} as const;

// ==========================
// Hook localStorage tipado
// ==========================
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  } = {}
) => {
  const { serialize = JSON.stringify, deserialize = JSON.parse } = options;

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
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

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, serialize(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serialize, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};

// ==========================
// Auto guardado
// ==========================
export const useAutoSave = <T>(
  key: string,
  data: T,
  options: {
    delay?: number;
    enabled?: boolean;
  } = {}
) => {
  const { delay = 1000, enabled = true } = options;
  const [saveStatus, setSaveStatus] = useState<string>("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!enabled) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        setSaveStatus("Guardado ✅");
        setTimeout(() => setSaveStatus(""), 2000);
      } catch (error) {
        setSaveStatus("Error al guardar ❌");
        setTimeout(() => setSaveStatus(""), 2000);
        console.error("Error saving to localStorage:", error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [data, delay, enabled, key]);

  return saveStatus;
};

// ==========================
// Normalizador de datos
// ==========================
// Helpers de normalización (pueden ir encima de normalizePortfolio)
const s = (v: any): string => (typeof v === "string" ? v : "");
const n = (v: any, def = 0): number => (typeof v === "number" ? v : def);
const arr = <T = any>(v: any): T[] => (Array.isArray(v) ? v : []);

// Reemplaza completamente tu normalizePortfolio por esta versión
const normalizePortfolio = (raw: any): PortfolioData => {
  const pi = raw?.personalInfo ?? {};

  // Aseguramos TODOS los campos requeridos por tu tipo PersonalInfo
  const personalInfo: PortfolioData["personalInfo"] = {
    fullName: s(pi.fullName) || s(pi.name),
    title: s(pi.title),
    summary: s(pi.summary),
    email: s(pi.email),
    phone: s(pi.phone), // ← requerido en tu tipo
    location: s(pi.location), // ← requerido en tu tipo
    github: s(pi.github),
    linkedin: s(pi.linkedin),
    website: s(pi.website),
    // Si tu tipo PersonalInfo también tiene photoUrl, descomenta:
    // photoUrl:  s(pi.photoUrl),
  };

  const projects: PortfolioData["projects"] = arr(raw?.projects).map(
    (p: any) => ({
      title: s(p.title),
      description: s(p.description),
      detailedDescription: s(p.detailedDescription),
      technologies: s(p.technologies),
      link: s(p.link),
      github: s(p.github),
      image: s(p.image),
      images: s(p.images),
      videos: s(p.videos),
      instructions: s(p.instructions),
      features: s(p.features),
      challenges: s(p.challenges),
      slug: s(
        p.slug ||
          s(p.title)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
      ),
      mainImageIndex: n(p.mainImageIndex, 0),
    })
  );

  const skills: PortfolioData["skills"] = arr(raw?.skills).map((it: any) => ({
    category: s(it.category),
    items: s(it.items),
  }));

  const experience: PortfolioData["experience"] = arr(raw?.experience).map(
    (e: any) => ({
      company: s(e.company),
      position: s(e.position),
      period: s(e.period),
      description: s(e.description),
    })
  );

  const education: PortfolioData["education"] = arr(raw?.education).map(
    (e: any) => ({
      institution: s(e.institution),
      degree: s(e.degree),
      period: s(e.period),
      description: s(e.description),
    })
  );

  const achievements: PortfolioData["achievements"] = arr(
    raw?.achievements
  ).map((a: any) => ({
    title: s(a.title),
    description: s(a.description),
    date: s(a.date),
  }));

  // Devolvemos un objeto que CUMPLE PortfolioData (sin "as PortfolioData")
  return {
    personalInfo,
    projects,
    skills,
    experience,
    education,
    achievements,
  };
};

// ==========================
// Hook principal de datos
// ==========================
export const usePortfolioData = (
  options: UsePortfolioDataOptions = {}
): PortfolioDataState & PortfolioDataActions => {
  const { autoSave = true, storageKey = STORAGE_KEYS.portfolio } = options;

  const [portfolioData, setPortfolioData] = useState<PortfolioData>(
    DEFAULT_PORTFOLIO_DATA
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const saveStatus = useAutoSave(storageKey, portfolioData, {
    enabled: autoSave && isLoaded,
  });

  // Cargar inicial
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPortfolioData(normalizePortfolio(parsed));
      } else {
        // si no hay nada guardado, persistimos el default una vez
        localStorage.setItem(
          storageKey,
          JSON.stringify(DEFAULT_PORTFOLIO_DATA)
        );
      }
    } catch (e) {
      console.error("Error loading portfolio data:", e);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Actualizadores
  const updatePersonalInfo = useCallback(
    (field: PersonalInfoKey, value: string) => {
      setPortfolioData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, [field]: value },
      }));
    },
    []
  );

  const updateProject = useCallback(
    (index: number, field: keyof Project, value: string) => {
      setPortfolioData((prev) => ({
        ...prev,
        projects: prev.projects.map((item, i) => {
          if (i === index) {
            const updatedItem: Project = { ...item, [field]: value } as Project;
            if (field === "title") {
              updatedItem.slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            }
            return updatedItem;
          }
          return item;
        }),
      }));
    },
    []
  );

  const updateSkill = useCallback(
    (index: number, field: keyof Skill, value: string) => {
      setPortfolioData((prev) => ({
        ...prev,
        skills: prev.skills.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const updateExperience = useCallback(
    (index: number, field: keyof Experience, value: string) => {
      setPortfolioData((prev) => ({
        ...prev,
        experience: prev.experience.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const updateEducation = useCallback(
    (index: number, field: keyof Education, value: string) => {
      setPortfolioData((prev) => ({
        ...prev,
        education: prev.education.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const updateAchievement = useCallback(
    (index: number, field: keyof Achievement, value: string) => {
      setPortfolioData((prev) => ({
        ...prev,
        achievements: prev.achievements.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const addItem = useCallback((section: SectionKey) => {
    const newItems = {
      projects: {
        title: "",
        description: "",
        detailedDescription: "",
        technologies: "",
        link: "",
        github: "",
        image: "",
        images: "",
        videos: "",
        instructions: "",
        features: "",
        challenges: "",
        slug: "",
        mainImageIndex: 0,
      },
      skills: { category: "", items: "" },
      experience: { company: "", position: "", period: "", description: "" },
      education: { institution: "", degree: "", period: "", description: "" },
      achievements: { title: "", description: "", date: "" },
    };

    setPortfolioData((prev) => ({
      ...prev,
      [section]: [...(prev as any)[section], (newItems as any)[section]],
    }));
  }, []);

  const removeItem = useCallback((section: SectionKey, index: number) => {
    setPortfolioData((prev) => {
      const next = { ...prev };
      switch (section) {
        case "projects":
          next.projects = next.projects.filter((_, i) => i !== index);
          break;
        case "skills":
          next.skills = next.skills.filter((_, i) => i !== index);
          break;
        case "experience":
          next.experience = next.experience.filter((_, i) => i !== index);
          break;
        case "education":
          next.education = next.education.filter((_, i) => i !== index);
          break;
        case "achievements":
          next.achievements = next.achievements.filter((_, i) => i !== index);
          break;
      }
      return next;
    });
  }, []);

  // IMPORTAR datos (desde objeto ya parseado/normalizado)
  const importData = useCallback((data: PortfolioData) => {
    const normalized = normalizePortfolio(data);
    setPortfolioData(normalized);
    try {
      localStorage.setItem(STORAGE_KEYS.portfolio, JSON.stringify(normalized));
    } catch (e) {
      console.warn(
        "No se pudo guardar los datos importados en localStorage:",
        e
      );
    }
  }, []);

  const clearAllData = useCallback(() => {
    setPortfolioData(DEFAULT_PORTFOLIO_DATA);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return {
    data: portfolioData,
    isLoaded,
    saveStatus,
    updatePersonalInfo,
    updateProject,
    updateSkill,
    updateExperience,
    updateEducation,
    updateAchievement,
    addItem,
    removeItem,
    importData,
    clearAllData,
  };
};

// ==========================
// Hook de subida de imágenes
// ==========================
export const useImageUpload = (
  onUpload: (base64: string) => void,
  options: { maxSize?: number } = {}
) => {
  const { maxSize = 5 * 1024 * 1024 } = options;
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const uploadImage = useCallback(
    (file: File) => {
      setError("");
      setIsUploading(true);

      if (!file.type.startsWith("image/")) {
        setError("Por favor selecciona un archivo de imagen");
        setIsUploading(false);
        return;
      }
      if (file.size > maxSize) {
        setError(`La imagen debe ser menor a ${maxSize / 1024 / 1024}MB`);
        setIsUploading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onUpload(base64);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError("Error al cargar la imagen");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    },
    [onUpload, maxSize]
  );

  return {
    uploadImage,
    isUploading,
    error,
    clearError: () => setError(""),
  };
};

// ==========================
// Export / Import JSON
// ==========================
type ImportResult =
  | { success: true; data: PortfolioData; message: string }
  | { success: false; message: string };

export const useDataExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToJSON = useCallback((data: PortfolioData, filename?: string) => {
    setIsExporting(true);
    try {
      // Empaquetamos también meta por si quieres incluir config de plantilla en el futuro
      const payload = {
        portfolio: data,
        exportedAt: new Date().toISOString(),
        by: "Portfolio Generator",
      };
      const dataStr = JSON.stringify(payload, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        filename || `portfolio-${data.personalInfo.fullName || "backup"}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true, message: "Datos exportados exitosamente" };
    } catch (error) {
      return {
        success: false,
        message: `Error al exportar: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
      };
    } finally {
      setIsExporting(false);
    }
  }, []);

  const importFromJSON = useCallback((file: File): Promise<ImportResult> => {
    return new Promise((resolve) => {
      setIsExporting(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const raw = JSON.parse(e.target?.result as string);

          // Soporta dos formatos: { portfolio: {...} } o PortfolioData plano
          const candidate = raw?.portfolio ?? raw;
          const normalized = normalizePortfolio(candidate);

          // Persistimos en la misma clave que lee el visor
          localStorage.setItem(
            STORAGE_KEYS.portfolio,
            JSON.stringify(normalized)
          );

          resolve({
            success: true,
            data: normalized,
            message: "Datos importados y guardados",
          });
        } catch (error) {
          resolve({
            success: false,
            message: `Error al importar: ${
              error instanceof Error ? error.message : "Archivo JSON inválido"
            }`,
          });
        } finally {
          setIsExporting(false);
        }
      };
      reader.onerror = () => {
        resolve({ success: false, message: "Error al leer el archivo" });
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

// ==========================
// Estado general de la app
// ==========================
export const useAppState = (initialMode: AppMode = "editor") => {
  const [state, setState] = useState<PortfolioGeneratorState>({
    showPreview: false,
    showDataMenu: false,
    currentMode: initialMode,
  });

  const actions = {
    setShowPreview: (show: boolean) =>
      setState((prev) => ({ ...prev, showPreview: show })),

    setShowDataMenu: (show: boolean) =>
      setState((prev) => ({ ...prev, showDataMenu: show })),

    setCurrentMode: (mode: AppMode) =>
      setState((prev) => ({ ...prev, currentMode: mode })),

    togglePreview: () =>
      setState((prev) => ({ ...prev, showPreview: !prev.showPreview })),

    toggleDataMenu: () =>
      setState((prev) => ({ ...prev, showDataMenu: !prev.showDataMenu })),
  };

  return [state, actions] as const;
};

// ==========================
// Click outside
// ==========================
export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  enabled = true
) => {
  useEffect(() => {
    if (!enabled) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback, enabled]);
};

// ==========================
// beforeunload
// ==========================
export const useBeforeUnload = (data: any, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;
    const handleBeforeUnload = () => {
      localStorage.setItem(STORAGE_KEYS.portfolio, JSON.stringify(data));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [data, enabled]);
};

// ==========================
// Modo de la app con URL
// ==========================
export const useModeSwitcher = () => {
  const [currentMode, setCurrentMode] = useLocalStorage<AppMode>(
    "portfolioMode",
    "editor"
  );

  const switchMode = useCallback(
    (mode: AppMode) => {
      setCurrentMode(mode);
      const url = new URL(window.location.href);
      url.searchParams.set("mode", mode);
      window.location.href = url.toString();
    },
    [setCurrentMode]
  );

  return {
    currentMode,
    switchMode,
    isEditorMode: currentMode === "editor",
    isPortfolioMode: currentMode === "portfolio",
  };
};

/**
 * ⚠️ IMPORTANTE:
 * He eliminado un hook `useTemplates` que tenías al final de este archivo,
 * porque colisiona con tu hook real `use-templates.ts`. Mantén el hook de
 * plantillas SOLO en `src/components/use-templates.ts` y NO lo declares aquí.
 */


# 🏗️ Arquitectura del Proyecto

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Flujo de Datos](#flujo-de-datos)
4. [Componentes Principales](#componentes-principales)
5. [Sistema de Hooks](#sistema-de-hooks)
6. [Sistema de Tipos](#sistema-de-tipos)
7. [Patrones y Convenciones](#patrones-y-convenciones)

---

## 🎯 Visión General

Portfolio Generator sigue una arquitectura modular basada en **componentes React**, **custom hooks** para lógica reutilizable, y **TypeScript** para type safety.

### Principios de Diseño

1. **Separación de Responsabilidades** - Cada módulo tiene un propósito claro
2. **Composición sobre Herencia** - Componentes pequeños y reutilizables
3. **Type Safety** - TypeScript estricto en todo el proyecto
4. **Inmutabilidad** - Estado inmutable con React hooks
5. **Performance** - Memoización y lazy loading donde es necesario

---

## 📁 Estructura de Carpetas

```
src/
├── components/          # Componentes React organizados por dominio
│   ├── customizer/     # Customización de plantillas
│   ├── editor/         # Editor principal
│   ├── forms/          # Formularios (futuro)
│   ├── layout-builder/ # Constructor de layouts
│   ├── project-form/   # Gestión de proyectos
│   ├── template-renderer/ # Renderizado avanzado
│   └── shared/         # Componentes compartidos (futuro)
│
├── hooks/              # Custom hooks para lógica reutilizable
│   ├── usePortfolioData.ts    # CRUD de datos
│   ├── useImageUpload.ts      # Manejo de imágenes
│   ├── useDataExport.ts       # Import/Export
│   ├── useAppState.ts         # Estado global
│   ├── useLocalStorage.ts     # Persistencia
│   └── useAdvancedTemplates.ts # Sistema de plantillas
│
├── types/              # Definiciones TypeScript centralizadas
│   ├── portfolio-types.ts     # Tipos base del portfolio
│   ├── template-types.ts      # Sistema de plantillas
│   └── advanced-template-types.ts # Plantillas avanzadas
│
├── templates/          # Configuraciones de plantillas
│   └── advanced/
│       ├── business/   # Plantillas corporativas
│       ├── classic/    # Diseños clásicos
│       ├── creative/   # Estilos creativos
│       ├── minimal/    # Diseños minimalistas
│       ├── modern/     # Plantillas modernas
│       ├── tech/       # Enfoque tecnológico
│       └── helpers/    # Utilidades de plantillas
│
├── export/             # Sistema de exportación modular
│   ├── exporters/      # Lógica de exportación
│   ├── generators/     # Generadores de HTML/CSS
│   ├── constants/      # Constantes de export
│   └── utils/          # Utilidades de export
│
└── utils/              # Utilidades globales del proyecto
    ├── export-utils.ts
    ├── template-utils.ts
    └── template-theme-css.ts
```

---

## 🔄 Flujo de Datos

### Arquitectura de Estado

```
┌─────────────────────────────────────────────┐
│          usePortfolioData (Hook)            │
│  ┌───────────────────────────────────────┐  │
│  │   localStorage ←→ React State         │  │
│  │   ↓                    ↓               │  │
│  │   Auto-save      updateProject()      │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                     ↓
         ┌───────────────────────┐
         │   App Component       │
         │   (Estado Global)     │
         └───────────────────────┘
            ↓              ↓
    ┌───────────┐   ┌──────────────┐
    │  Editor   │   │  Templates   │
    └───────────┘   └──────────────┘
         ↓                  ↓
    Components      TemplateRenderer
```

### Flujo de Usuario Típico

1. **Usuario edita datos** → `PersonalInfoForm`
2. **Cambios se propagan** → `usePortfolioData.updatePersonalInfo()`
3. **Estado se actualiza** → React re-renderiza
4. **Auto-guardado** → `localStorage` (debounced)
5. **Vista previa** → `TemplateRenderer` con datos actualizados

---

## 🧩 Componentes Principales

### 1. App.tsx - Componente Raíz

**Responsabilidad:** Gestión de navegación y estado global

```typescript
App
├── ModernPortfolioEditor    // Modo editor
├── PortfolioViewer          // Modo vista
└── TemplateCustomizer       // Customización
```

### 2. ModernPortfolioEditor

**Responsabilidad:** Editor principal con tabs

```typescript
ModernPortfolioEditor
├── PersonalInfoForm
├── ProjectTableForm
│   ├── ProjectModal
│   ├── ProjectTable
│   └── ImageUploaders
├── SkillTableForm
└── ExperienceForm
```

### 3. AdvancedLayoutBuilder

**Responsabilidad:** Constructor visual de layouts con drag & drop

**Características:**
- Drag & drop de secciones
- Áreas configurables (header, sidebar, main, footer)
- Reordenamiento en tiempo real
- Toggle de visibilidad

### 4. AdvancedTemplateCustomizer

**Responsabilidad:** Customización completa de plantillas

**Tabs:**
- ColorsTab - Paleta de colores
- TypographyTab - Fuentes y tamaños
- LayoutTab - Espaciado y estructura
- SectionsTab - Gestión de secciones
- AdvancedTab - CSS custom

### 5. TemplateRenderer

**Responsabilidad:** Renderizado de plantillas con datos

**Características:**
- Sistema de secciones modular
- Aplicación de estilos dinámicos
- Responsive design
- Optimización de imágenes

---

## 🪝 Sistema de Hooks

### usePortfolioData

**Propósito:** Hook principal para CRUD de datos

```typescript
interface UsePortfolioDataReturn {
  // Estado
  data: PortfolioData;
  isLoaded: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  
  // Acciones
  updatePersonalInfo: (field, value) => void;
  updateProject: (index, field, value) => void;
  addItem: (section) => void;
  removeItem: (section, index) => void;
  clearAllData: () => void;
}
```

**Características:**
- ✅ Auto-guardado con debounce
- ✅ Persistencia en localStorage
- ✅ Estado de guardado visual
- ✅ Validación de datos

### useImageUpload

**Propósito:** Manejo de subida y validación de imágenes

```typescript
interface UseImageUploadReturn {
  uploadImage: (file: File) => void;
  isUploading: boolean;
  error: string;
  clearError: () => void;
}
```

**Características:**
- ✅ Validación de tamaño (5MB max)
- ✅ Validación de formato
- ✅ Conversión a base64
- ✅ Manejo de errores

### useDataExport

**Propósito:** Exportación e importación de datos

```typescript
interface UseDataExportReturn {
  exportToJSON: (data, filename?) => ExportResult;
  importFromJSON: (file) => Promise<ImportResult>;
  isExporting: boolean;
}
```

### useAdvancedTemplates

**Propósito:** Gestión del sistema de plantillas

```typescript
interface UseAdvancedTemplatesReturn {
  templates: Template[];
  selectedTemplate: Template | null;
  config: TemplateConfig;
  selectTemplate: (template) => void;
  updateConfig: (config) => void;
  resetConfig: () => void;
}
```

---

## 📐 Sistema de Tipos

### Jerarquía de Tipos

```
PortfolioData (Root)
├── PersonalInfo
│   ├── fullName: string
│   ├── title: string
│   ├── email: string
│   └── ...
├── Project[]
│   ├── title: string
│   ├── description: string
│   ├── technologies: string
│   └── ...
├── Skill[]
├── Experience[]
├── Education[]
└── Achievement[]
```

### Template System Types

```
Template
├── id: string
├── name: string
├── colors: TemplateColors
│   ├── primary
│   ├── secondary
│   └── accent
├── typography: TemplateTypography
│   ├── fontFamily
│   └── fontSize
├── layout: TemplateLayout
│   ├── maxWidth
│   ├── spacing
│   └── borderRadius
└── sections: TemplateSection[]
```

---

## 🎨 Patrones y Convenciones

### 1. Barrel Exports

**Convención:** Cada carpeta tiene un `index.ts` que exporta su API pública

```typescript
// hooks/index.ts
export { usePortfolioData } from './usePortfolioData';
export { useImageUpload } from './useImageUpload';
export type { UsePortfolioDataReturn } from './usePortfolioData';
```

**Beneficio:** Imports limpios

```typescript
// ✅ Con barrel exports
import { usePortfolioData, useImageUpload } from "@/hooks";

// ❌ Sin barrel exports
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useImageUpload } from "@/hooks/useImageUpload";
```

### 2. Path Aliases

**Convención:** Usar `@/` para imports absolutos

```typescript
// tsconfig.json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["src/*"]
  }
}
```

### 3. Component Composition

**Patrón:** Componentes pequeños y componibles

```typescript
// ❌ Componente monolítico
<ProjectForm>
  {/* 500 líneas de código */}
</ProjectForm>

// ✅ Componentes modulares
<ProjectForm>
  <ProjectBasicInfo />
  <ProjectMedia />
  <ProjectAdvanced />
</ProjectForm>
```

### 4. Custom Hooks para Lógica Reutilizable

**Patrón:** Extraer lógica compleja a hooks

```typescript
// ❌ Lógica en componente
const Component = () => {
  const [data, setData] = useState();
  useEffect(() => {
    // 50 líneas de lógica
  }, []);
  // ...
};

// ✅ Lógica en hook
const Component = () => {
  const { data, actions } = useCustomLogic();
  // ...
};
```

### 5. Type Safety

**Convención:** TypeScript estricto, no usar `any`

```typescript
// ❌ Evitar
const handleUpdate = (field: any, value: any) => {};

// ✅ Correcto
const handleUpdate = (field: keyof Project, value: string | number) => {};
```

---

## 🚀 Performance

### Optimizaciones Implementadas

1. **React.memo** - Componentes que no cambian frecuentemente
2. **useCallback** - Callbacks estables para child components
3. **useMemo** - Cálculos costosos memoizados
4. **Lazy Loading** - Componentes cargados bajo demanda
5. **Debouncing** - Auto-guardado con delay

### Code Splitting

```typescript
// Lazy loading de templates
const TemplateRenderer = lazy(() => import('./TemplateRenderer'));

// Suspense boundary
<Suspense fallback={<Loading />}>
  <TemplateRenderer />
</Suspense>
```

---

## 🔒 Seguridad

### Validaciones

- **Input Validation** - Validación en formularios
- **File Validation** - Tamaño y tipo de archivos
- **XSS Protection** - Sanitización de inputs
- **Type Safety** - TypeScript previene errores

---

## 📊 Métricas del Proyecto

### Complejidad

- **Total Líneas:** ~8,000+
- **Componentes:** 40+
- **Custom Hooks:** 6
- **Plantillas:** 5+
- **Tipos definidos:** 30+

### Refactorizaciones

- **ProjectTableForm:** 704 → 8 archivos
- **AdvancedLayoutBuilder:** 666 → 7 archivos
- **portfolio-hooks:** 605 → 6 archivos

**Mejora:** -70% en tamaño de archivos principales

---

## 🔮 Roadmap

### Futuras Mejoras

- [ ] Tests unitarios con Jest
- [ ] Tests E2E con Cypress
- [ ] Storybook para componentes
- [ ] PWA support
- [ ] Internacionalización (i18n)
- [ ] Temas dark/light mode
- [ ] Más plantillas
- [ ] Editor de CSS avanzado

---

**Documentación actualizada:** Ahora
**Versión:** 1.0.0
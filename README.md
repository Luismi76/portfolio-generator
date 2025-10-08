# 🎨 Portfolio Generator

Generador de portafolios profesionales con múltiples plantillas, exportación a HTML estático y sistema de diseño avanzado.

## ✨ Características

- 🎨 **Sistema de Plantillas Avanzado** - 5+ plantillas profesionales prediseñadas
- 🎯 **Constructor de Layouts Visual** - Drag & drop para organizar secciones
- 📝 **Editor Completo** - Gestión de proyectos, habilidades, experiencia y más
- 🎨 **Customización Total** - Colores, tipografía, espaciado y layouts
- 📤 **Exportación HTML** - Genera sitios estáticos listos para desplegar
- 💾 **Auto-guardado** - Tus datos se guardan automáticamente
- 📱 **Responsive** - Diseños adaptados a todos los dispositivos

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 14+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone [tu-repo-url]
cd portfolio-generator

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm start
```

El proyecto se abrirá en `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── customizer/     # Customizador de plantillas
│   ├── editor/         # Editor del portfolio
│   ├── layout-builder/ # Constructor visual de layouts
│   ├── project-form/   # Formularios de proyectos
│   └── template-renderer/ # Renderizado de plantillas
│
├── hooks/              # Custom hooks
│   ├── usePortfolioData.ts    # Gestión de datos
│   ├── useImageUpload.ts      # Subida de imágenes
│   ├── useDataExport.ts       # Export/Import
│   └── useAppState.ts         # Estado global
│
├── types/              # Definiciones TypeScript
│   ├── portfolio-types.ts     # Tipos principales
│   ├── template-types.ts      # Tipos de plantillas
│   └── advanced-template-types.ts # Plantillas avanzadas
│
├── templates/          # Configuraciones de plantillas
│   └── advanced/
│       ├── modern/     # Plantillas modernas
│       ├── classic/    # Plantillas clásicas
│       ├── creative/   # Plantillas creativas
│       └── minimal/    # Plantillas minimalistas
│
├── export/             # Sistema de exportación
│   ├── exporters/      # Exportadores HTML
│   ├── generators/     # Generadores de código
│   └── utils/          # Utilidades de export
│
└── utils/              # Utilidades globales
```

---

## 🛠️ Scripts Disponibles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start

# Compilar para producción
npm run build

# Ejecutar tests
npm test

# Verificar TypeScript
npx tsc --noEmit
```

---

## 💡 Guía de Uso

### 1. Crear un Portfolio

1. **Información Personal** - Agrega tu nombre, email, links sociales
2. **Proyectos** - Añade tus proyectos con imágenes y descripciones
3. **Habilidades** - Organiza tus skills por categorías
4. **Experiencia** - Lista tu experiencia laboral
5. **Educación** - Agrega tu formación académica

### 2. Personalizar Diseño

1. **Seleccionar Plantilla** - Elige entre 5+ diseños profesionales
2. **Customizar Colores** - Ajusta la paleta de colores
3. **Modificar Tipografía** - Cambia fuentes y tamaños
4. **Ajustar Layout** - Organiza las secciones con drag & drop

### 3. Exportar

1. **Vista Previa** - Revisa cómo se ve tu portfolio
2. **Exportar HTML** - Genera archivos estáticos
3. **Desplegar** - Sube a GitHub Pages, Netlify, Vercel, etc.

---

## 📦 Tecnologías

### Core

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first

### Build & Tools

- **Create React App** - Setup inicial
- **Craco** - Configuración de Webpack
- **React Scripts** - Scripts de build

### Estado & Datos

- **React Hooks** - Gestión de estado
- **localStorage** - Persistencia local
- **Context API** - Estado global

---

## 🎨 Convenciones de Código

### Imports

Usamos **path aliases** para imports limpios:

```typescript
// ✅ CORRECTO
import { usePortfolioData } from "@/hooks";
import { AdvancedTemplateCustomizer } from "@/components/customizer";
import { PortfolioData } from "@/types/portfolio-types";

// ❌ EVITAR
import { usePortfolioData } from "../../hooks/usePortfolioData";
```

### Estructura de Componentes

```typescript
// ComponentName.tsx
import React from 'react';
import type { ComponentProps } from './types';

export const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();
  
  // Handlers
  const handleClick = () => {};
  
  // Render
  return <div>...</div>;
};
```

### Nombres de Archivos

- **Componentes**: `PascalCase.tsx` (ej: `ProjectTable.tsx`)
- **Hooks**: `camelCase.ts` (ej: `usePortfolioData.ts`)
- **Utils**: `kebab-case.ts` (ej: `export-utils.ts`)
- **Types**: `kebab-case.ts` (ej: `portfolio-types.ts`)

---

## 🧩 Módulos Principales

### 1. usePortfolioData

Hook principal para gestión de datos del portfolio.

```typescript
import { usePortfolioData } from "@/hooks";

const {
  data,              // Datos completos
  isLoaded,          // Estado de carga
  updateProject,     // Actualizar proyecto
  addItem,           // Agregar item
  removeItem,        // Remover item
} = usePortfolioData();
```

### 2. Layout Builder

Constructor visual de layouts con drag & drop.

```typescript
import { AdvancedLayoutBuilder } from "@/components/layout-builder";

<AdvancedLayoutBuilder
  sections={sections}
  onSectionsChange={handleChange}
  layoutStructure={layout}
/>
```

### 3. Template System

Sistema de plantillas con customización completa.

```typescript
import { useAdvancedTemplates } from "@/hooks";

const {
  templates,         // Plantillas disponibles
  selectedTemplate,  // Plantilla actual
  selectTemplate,    // Seleccionar plantilla
  updateConfig,      // Actualizar configuración
} = useAdvancedTemplates();
```

---

## 🚀 Deployment

### GitHub Pages

```bash
# 1. Agregar homepage en package.json
"homepage": "https://tu-usuario.github.io/portfolio-generator"

# 2. Instalar gh-pages
npm install --save-dev gh-pages

# 3. Agregar scripts
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# 4. Desplegar
npm run deploy
```

### Netlify

1. Conecta tu repositorio en Netlify
2. Build command: `npm run build`
3. Publish directory: `build`

### Vercel

1. Instala Vercel CLI: `npm i -g vercel`
2. Ejecuta: `vercel`
3. Sigue las instrucciones

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-feature`
3. Commit: `git commit -m 'Agregar nueva feature'`
4. Push: `git push origin feature/nueva-feature`
5. Abre un Pull Request

---

## 📝 Changelog

### v1.0.0 (2024)
- ✨ Sistema de plantillas avanzadas
- 🎨 Constructor visual de layouts
- 📤 Exportación a HTML estático
- 💾 Auto-guardado de datos
- 🎯 Path aliases y barrel exports
- 🔧 Arquitectura modular refactorizada

---

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE)

---

## 🙏 Agradecimientos

- **React Team** - Por la increíble biblioteca
- **Tailwind CSS** - Por el sistema de diseño
- **Lucide Icons** - Por los iconos

---

## 📧 Contacto

- **Proyecto**: [GitHub Repository]
- **Issues**: [GitHub Issues]
- **Documentación**: [Docs]

---

**Hecho con ❤️ usando React + TypeScript + Tailwind CSS**
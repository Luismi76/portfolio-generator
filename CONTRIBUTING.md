# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Portfolio Generator! Esta guía te ayudará a empezar.

---

## 📋 Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [Cómo Contribuir](#cómo-contribuir)
3. [Setup de Desarrollo](#setup-de-desarrollo)
4. [Convenciones de Código](#convenciones-de-código)
5. [Pull Requests](#pull-requests)
6. [Reportar Bugs](#reportar-bugs)

---

## 📜 Código de Conducta

Este proyecto sigue un código de conducta. Al participar, te comprometes a:

- ✅ Ser respetuoso y profesional
- ✅ Aceptar críticas constructivas
- ✅ Enfocarte en lo mejor para la comunidad
- ❌ No usar lenguaje ofensivo o inapropiado
- ❌ No acosar o discriminar

---

## 🚀 Cómo Contribuir

### Tipos de Contribuciones

1. **🐛 Reportar Bugs** - Encontrar y reportar problemas
2. **✨ Nuevas Features** - Proponer o implementar funcionalidades
3. **📚 Documentación** - Mejorar o traducir docs
4. **🎨 Diseño** - Proponer nuevas plantillas o mejoras UI
5. **🧪 Tests** - Agregar o mejorar cobertura de tests

---

## 💻 Setup de Desarrollo

### 1. Fork y Clone

```bash
# Fork el repo en GitHub, luego:
git clone https://github.com/tu-usuario/portfolio-generator.git
cd portfolio-generator
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Crear Rama

```bash
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-bug
```

### 4. Desarrollar

```bash
# Iniciar servidor de desarrollo
npm start

# En otra terminal, verificar TypeScript
npx tsc --noEmit --watch
```

### 5. Commit y Push

```bash
git add .
git commit -m "feat: descripción clara del cambio"
git push origin feature/nombre-descriptivo
```

### 6. Abrir Pull Request

Ve a GitHub y abre un PR desde tu rama hacia `main`

---

## 📝 Convenciones de Código

### Estructura de Archivos

```
# Componentes
PascalCase.tsx         ✅ ProjectTable.tsx
camelCase.tsx          ❌ projectTable.tsx

# Hooks
camelCase.ts           ✅ usePortfolioData.ts
PascalCase.ts          ❌ UsePortfolioData.ts

# Utilidades
kebab-case.ts          ✅ export-utils.ts
camelCase.ts           ❌ exportUtils.ts

# Tipos
kebab-case.ts          ✅ portfolio-types.ts
```

### Imports

**Orden de imports:**

```typescript
// 1. Librerías externas
import React, { useState } from 'react';
import { useQuery } from 'react-query';

// 2. Path aliases (@/)
import { usePortfolioData } from '@/hooks';
import { PortfolioData } from '@/types/portfolio-types';

// 3. Relativos (si es necesario)
import { LocalComponent } from './LocalComponent';

// 4. Estilos
import './styles.css';
```

**Usar path aliases:**

```typescript
// ✅ CORRECTO
import { usePortfolioData } from "@/hooks";
import { ProjectTable } from "@/components/project-form";

// ❌ EVITAR
import { usePortfolioData } from "../../hooks/usePortfolioData";
```

### Componentes React

**Template recomendado:**

```typescript
// ComponentName.tsx
import React from 'react';
import type { ComponentNameProps } from './types';

/**
 * Descripción del componente
 * 
 * @example
 * <ComponentName prop1="value" />
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  prop2,
  onAction,
}) => {
  // 1. Hooks
  const [state, setState] = useState();
  const data = useCustomHook();

  // 2. Handlers
  const handleClick = useCallback(() => {
    // lógica
  }, []);

  // 3. Effects
  useEffect(() => {
    // side effects
  }, [dependencies]);

  // 4. Render helpers
  const renderItem = (item) => <div>{item}</div>;

  // 5. Render
  return (
    <div className="component-container">
      {/* JSX */}
    </div>
  );
};
```

### Custom Hooks

**Template recomendado:**

```typescript
// useCustomHook.ts
import { useState, useCallback } from 'react';

export interface UseCustomHookOptions {
  option1?: string;
  option2?: number;
}

export interface UseCustomHookReturn {
  data: any;
  isLoading: boolean;
  error: string | null;
  actions: {
    doSomething: () => void;
  };
}

/**
 * Hook para [descripción]
 * 
 * @param options - Opciones de configuración
 * @returns Estado y acciones
 * 
 * @example
 * const { data, actions } = useCustomHook({ option1: 'value' });
 */
export const useCustomHook = (
  options: UseCustomHookOptions = {}
): UseCustomHookReturn => {
  // Implementación
  
  return {
    data,
    isLoading,
    error,
    actions: {
      doSomething,
    },
  };
};
```

### TypeScript

**Reglas:**

- ✅ **Siempre** tipar parámetros y retornos
- ✅ Usar interfaces para objetos
- ✅ Usar type para uniones/intersecciones
- ❌ **Nunca** usar `any`
- ❌ Evitar `as` (type assertions) si es posible

```typescript
// ✅ CORRECTO
interface User {
  id: string;
  name: string;
}

const getUser = (id: string): User => {
  // ...
};

// ❌ EVITAR
const getUser = (id: any): any => {
  // ...
};
```

### Nombres de Variables

```typescript
// Booleanos - usar prefijos is, has, should
const isLoading = true;
const hasError = false;
const shouldUpdate = true;

// Arrays - plural
const projects = [];
const users = [];

// Handlers - usar handle prefix
const handleClick = () => {};
const handleSubmit = () => {};

// Callbacks - usar on prefix (props)
<Component onSave={handleSave} />
```

### Comentarios

```typescript
// ✅ Comentarios útiles
// TODO: Implementar validación
// FIXME: Bug en el cálculo de fecha
// NOTE: Este componente se renderiza 2 veces debido a...

/**
 * Documentación JSDoc para funciones públicas
 * 
 * @param data - Descripción del parámetro
 * @returns Descripción del retorno
 */
export const publicFunction = (data: Data): Result => {};

// ❌ Comentarios obvios
const name = "John"; // asignar nombre
```

---

## 🎨 Estilos

### Tailwind CSS

**Preferir Tailwind sobre CSS custom:**

```typescript
// ✅ CORRECTO
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">

// ❌ EVITAR
<div className="custom-container">
<style>.custom-container { display: flex; ... }</style>
```

**Orden de clases Tailwind:**

1. Layout (flex, grid, block)
2. Positioning (absolute, relative)
3. Sizing (w-, h-, max-)
4. Spacing (p-, m-, gap-)
5. Typography (text-, font-)
6. Visual (bg-, border-, shadow-)
7. Interactive (hover:, focus:)

```typescript
className="
  flex flex-col               // Layout
  relative                    // Position
  w-full max-w-lg            // Size
  p-6 gap-4                  // Spacing
  text-lg font-semibold      // Typography
  bg-white border rounded-lg // Visual
  hover:shadow-md            // Interactive
"
```

---

## 🧪 Testing

### Escribir Tests

```typescript
// ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle click event', () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Coverage Mínimo

- **Componentes críticos:** 80%+
- **Hooks:** 90%+
- **Utilidades:** 100%

---

## 📤 Pull Requests

### Checklist Antes de Enviar

- [ ] ✅ Código compila sin errores (`npm run build`)
- [ ] ✅ TypeScript sin warnings (`npx tsc --noEmit`)
- [ ] ✅ Tests pasan (si existen)
- [ ] ✅ Código formateado correctamente
- [ ] ✅ Documentación actualizada si es necesario
- [ ] ✅ Commits tienen mensajes descriptivos

### Estructura del PR

**Título:**
```
feat: agregar sistema de temas dark/light
fix: corregir bug en exportación de imágenes
docs: actualizar guía de instalación
```

**Descripción:**

```markdown
## Descripción
Breve descripción de los cambios

## Motivación
¿Por qué es necesario este cambio?

## Cambios
- Cambio 1
- Cambio 2

## Screenshots (si aplica)
[Imágenes]

## Testing
Cómo se probó este cambio

## Checklist
- [x] Tests pasan
- [x] Documentación actualizada
- [x] TypeScript sin errores
```

### Proceso de Review

1. **Automático** - CI checks (build, types, tests)
2. **Code Review** - Un maintainer revisa el código
3. **Cambios** - Realizar cambios solicitados
4. **Merge** - Una vez aprobado, se mergea

---

## 🐛 Reportar Bugs

### Template de Issue

```markdown
## Descripción del Bug
Descripción clara del problema

## Para Reproducir
Pasos para reproducir:
1. Ir a '...'
2. Click en '...'
3. Ver error

## Comportamiento Esperado
Qué debería pasar

## Comportamiento Actual
Qué está pasando

## Screenshots
Si aplica

## Entorno
- OS: [Windows 10, macOS 13, etc.]
- Browser: [Chrome 120, Firefox 121, etc.]
- Versión: [1.0.0]

## Información Adicional
Cualquier otro contexto
```

---

## ✨ Proponer Features

### Template de Feature Request

```markdown
## Feature Request
Descripción breve de la feature

## Problema que Resuelve
¿Qué problema resuelve esta feature?

## Solución Propuesta
Cómo funcionaría

## Alternativas Consideradas
Otras soluciones consideradas

## Complejidad Estimada
- [ ] Baja (< 1 día)
- [ ] Media (1-3 días)
- [ ] Alta (> 3 días)

## ¿Estarías Dispuesto a Implementarla?
- [ ] Sí, puedo implementarla
- [ ] No, solo la propongo
```

---

## 🎨 Agregar Nuevas Plantillas

### Estructura de Template

```typescript
// templates/advanced/nueva-categoria/mi-plantilla.ts
import type { Template } from '@/types/template-types';
import { createDefaultSections } from '../helpers/section-presets';

export const MI_PLANTILLA: Template = {
  id: 'mi-plantilla',
  name: 'Mi Plantilla',
  description: 'Descripción de la plantilla',
  category: 'modern', // modern | classic | creative | minimal | tech
  preview: '/templates/mi-plantilla-preview.jpg',
  
  colors: {
    primary: '#3B82F6',
    secondary: '#6366F1',
    accent: '#8B5CF6',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      accent: '#3B82F6'
    }
  },
  
  typography: {
    fontFamily: {
      primary: "'Inter', sans-serif",
      heading: "'Inter', sans-serif"
    },
    fontSize: { /* ... */ },
    fontWeight: { /* ... */ }
  },
  
  layout: {
    maxWidth: '1200px',
    spacing: { /* ... */ },
    borderRadius: { /* ... */ },
    shadows: { /* ... */ }
  },
  
  sections: createDefaultSections(),
  version: '1.0.0',
  author: 'Tu Nombre',
  tags: ['tag1', 'tag2'],
  isBuiltIn: false
};
```

### Exportar en index.ts

```typescript
// templates/advanced/index.ts
import { MI_PLANTILLA } from './nueva-categoria/mi-plantilla';

export const ALL_TEMPLATES = [
  // ... otras plantillas
  MI_PLANTILLA,
];
```

---

## 📚 Documentación

### Agregar o Actualizar Docs

- **README.md** - Información general
- **ARCHITECTURE.md** - Decisiones técnicas
- **CONTRIBUTING.md** - Este archivo
- **Comentarios JSDoc** - En código fuente

### Estilo de Documentación

- ✅ Clara y concisa
- ✅ Ejemplos de código
- ✅ Screenshots cuando sea útil
- ✅ Mantener actualizada

---

## 🏆 Reconocimiento

Los contribuidores serán listados en:
- README.md (sección Contributors)
- CHANGELOG.md (por versión)

---

## ❓ Preguntas

Si tienes preguntas:

1. **Revisa la documentación** - README, ARCHITECTURE
2. **Busca en Issues** - Puede estar respondida
3. **Abre un Issue** - Usa el template de pregunta
4. **Discord/Slack** - Si hay comunidad

---

## 📞 Contacto

- **GitHub Issues**: Para bugs y features
- **GitHub Discussions**: Para preguntas generales
- **Email**: [tu-email] para temas privados

---

¡Gracias por contribuir! 🎉

Cada contribución, grande o pequeña, es valiosa para el proyecto.

---

**Última actualización:** Ahora
**Mantenedores:** [Lista de mantenedores]
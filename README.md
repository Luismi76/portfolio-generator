# 🚀 Portfolio Generator & Display

Un generador de portfolios profesionales con React y TypeScript que te permite crear y desplegar tu portfolio personal fácilmente.

## 🎯 Dos modos de uso:

### 🔧 **Modo Editor** (Desarrollo)
Para configurar y personalizar tu portfolio

### 👤 **Modo Portfolio** (Producción) 
Tu portfolio final listo para mostrar al mundo

---

## 🚀 Quick Start

### 1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/portfolio-generator.git
cd portfolio-generator
npm install
```

### 2. **Configurar tus datos**
```bash
# Iniciar en modo editor
npm start
```
- Ve a http://localhost:3000
- Completa toda tu información personal, proyectos, habilidades, etc.
- Los datos se guardan automáticamente

### 3. **Ver tu portfolio**
```bash
# Cambiar a modo portfolio
npm run preview:portfolio
```
- Tu portfolio estará en http://localhost:3000
- ¡Así es como lo verán tus visitantes!

### 4. **Desplegar tu portfolio**
```bash
# Generar build para producción
npm run build:portfolio
```
- Se crea la carpeta `build/` 
- Sube esta carpeta a tu hosting (Netlify, Vercel, GitHub Pages, etc.)

---

## 📋 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Modo editor (desarrollo) |
| `npm run preview:portfolio` | Preview del portfolio |
| `npm run build:portfolio` | Build final del portfolio |
| `npm run build:editor` | Build con editor incluido |
| `npm run deploy:portfolio` | Build + instrucciones |

---

## 🔄 Flujo de trabajo

### **Primera vez:**
1. **Clonar** → `git clone ...`
2. **Instalar** → `npm install` 
3. **Editar** → `npm start`
4. **Configurar** todos tus datos
5. **Previsualizar** → `npm run preview:portfolio`
6. **Desplegar** → `npm run build:portfolio`

### **Actualizaciones:**
1. **Editar** → `npm start`
2. **Cambiar** datos que necesites
3. **Previsualizar** → `npm run preview:portfolio`
4. **Redesplegar** → `npm run build:portfolio`

---

## 💾 Gestión de datos

### **Guardado automático:**
- Tus datos se guardan automáticamente en el navegador
- No se pierden al cerrar/reabrir

### **Respaldo y transferencia:**
- **Exportar**: Descargar archivo JSON con todos tus datos
- **Importar**: Cargar datos desde un archivo JSON
- **Limpiar**: Empezar desde cero

### **Compartir configuración:**
- Exporta tus datos como JSON
- Otra persona puede importarlos en su copia del proyecto

---

## 🌐 Opciones de despliegue

### **Netlify (Recomendado - Gratis)**
1. `npm run build:portfolio`
2. Arrastra la carpeta `build/` a [netlify.com/drop](https://app.netlify.com/drop)
3. ¡Listo! Tu portfolio está online

### **Vercel (Gratis)**
1. `npm run build:portfolio` 
2. Instala Vercel CLI: `npm i -g vercel`
3. `vercel --prod ./build`

### **GitHub Pages (Gratis)**
1. `npm run build:portfolio`
2. Sube `build/` a la rama `gh-pages` de tu repo
3. Activa GitHub Pages en configuración del repo

### **Hosting tradicional**
1. `npm run build:portfolio`
2. Sube el contenido de `build/` a tu servidor web

---

## 🎨 Personalización avanzada

### **Colores y estilos:**
Edita los archivos en `src/components/` para personalizar:
- Colores del tema
- Tipografías
- Animaciones
- Layout

### **Secciones adicionales:**
Puedes agregar nuevas secciones editando:
- `PortfolioGenerator.tsx` (editor)
- `Portfolio.tsx` (display)

### **SEO y metadatos:**
Edita `public/index.html` para:
- Título de la página
- Meta description
- Favicon
- Open Graph tags

---

## 🔧 Desarrollo

### **Estructura del proyecto:**
```
src/
├── components/
│   ├── PortfolioGenerator.tsx  # Editor (modo desarrollo)
│   └── Portfolio.tsx           # Display (modo producción)  
├── App.tsx                     # Maneja los modos
└── index.tsx                   # Entry point
```

### **Variables de entorno:**
- `REACT_APP_MODE=portfolio` → Fuerza modo portfolio
- `REACT_APP_MODE=editor` → Fuerza modo editor

---

## ❓ FAQ

### **¿Cómo cambio entre modos?**
En desarrollo verás un toggle en la esquina superior derecha.

### **¿Se pierden mis datos?**
No, se guardan automáticamente en tu navegador. También puedes exportar como respaldo.

### **¿Puedo usar mi propio dominio?**
¡Por supuesto! Despliega en cualquier hosting y conecta tu dominio.

### **¿Cómo actualizo mi portfolio?**
1. `npm start` → edita → `npm run build:portfolio` → redespliega

### **¿Puedo compartir mi configuración?**
Sí, exporta tus datos como JSON y compártelos.

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - puedes usar este proyecto libremente para tu portfolio personal.

---

## 🎉 ¡Muestra tu portfolio!

¿Creaste tu portfolio con este generador? ¡Compártelo! 

Abre un issue con el link y lo agregaremos a la galería de ejemplos.

---

**¡Happy coding! 🚀**
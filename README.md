# Generador de Portafolios

Herramienta **open source** que permite crear una web personal a partir de un archivo de datos.
Diseñada inicialmente como recurso didáctico para el **Certificado de Profesionalidad de Operación de Sistemas Informáticos**, pero disponible para cualquiera que quiera generar su propio portfolio online de manera sencilla.

---

## 🚀 Características

* Editor visual para rellenar tu información (nombre, contacto, proyectos, habilidades…).
* Genera automáticamente una **web lista para publicar**.
* Exportación/Importación de datos en **JSON**.
* Compatible con **GitHub Pages, Netlify y Vercel** para desplegar gratis.

---

## 📥 Instalación y uso rápido

### 1. Descargar

* Opción 1: Clonar el repositorio
  
  ```bash
  git clone https://github.com/Luismi76/portfolio-generator.git
  cd portfolio-generator
  ```

* Opción 2: Descargar el ZIP desde GitHub y extraerlo en tu ordenador.

### 2. Instalar dependencias

Necesitas tener instalado **Node.js** (versión 18 o superior).

```bash
npm install
```

### 3. Abrir el editor

Ejecuta:

```bash
npm start
```

Esto abrirá el **Editor de Portafolios** en tu navegador.

### 4. Importar un perfil de ejemplo

* Haz clic en **Importar JSON** en el editor.
* Selecciona el archivo `demo-profile.json` incluido en el repositorio.
* Verás un portfolio ficticio cargado (ejemplo de uso).
* Personaliza los datos con tu propia información.

### 5. Generar tu web

Cuando tengas todo configurado:

```bash
npm run build:portfolio
```

Se generará la carpeta `/dist` con tu portfolio listo para publicar.

### 6. Publicar online

Opciones recomendadas:

* **GitHub Pages**: activa Pages en tu repositorio y sube la carpeta `/dist`.
* **Netlify** o **Vercel**: conecta tu cuenta con el repositorio y despliega en pocos clics.

---

## 📂 Archivos importantes

* `demo-profile.json` → Perfil ficticio de ejemplo que puedes importar.
* `/src` → Código fuente del proyecto.
* `/dist` → Carpeta que se genera al construir el portfolio (es lo que se publica).

---

## 📸 Capturas

![Porfolio](assets\2025-09-22-18-25-57-image.png)

![Editor](assets\2025-09-22-18-26-47-image.png)

---

## 📜 Licencia

Este proyecto está publicado bajo licencia **MIT**, lo que significa que puedes usarlo, modificarlo y compartirlo libremente.

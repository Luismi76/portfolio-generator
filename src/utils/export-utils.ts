import type { AdvancedTemplate, AdvancedTemplateConfig } from '../types/advanced-template-types';
import type { Template, TemplateConfig } from '../types/template-types';
// ===== SLUG =====
export const generateSlug = (title: string): string =>
  title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim();

// ===== FUENTES GOOGLE =====
const firstFont = (ff: string | undefined) =>
  (ff || "").split(",")[0].replace(/['"]/g, "").trim();

export const googleFamilyParam = (name: string) =>
  name ? `family=${encodeURIComponent(name).replace(/%20/g, "+")}:wght@400;500;600;700` : "";

export const getFontsHeadFromTemplate = (
  template: Template | AdvancedTemplate,  // ← Acepta ambos
  config?: TemplateConfig | AdvancedTemplateConfig
) => {
  const t = (config as any)?.customizations?.typography || (template as any)?.typography || {};
  const primary = firstFont(t?.fontFamily?.primary) || "Inter";
  const heading = firstFont(t?.fontFamily?.heading) || primary;

  const fams = Array.from(new Set([primary, heading].filter(Boolean)));
  const query = fams.map(googleFamilyParam).filter(Boolean).join("&");

  return `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?${query}&display=swap" rel="stylesheet">
`;
};

// ===== DESCARGAS =====
export const downloadBlob = (filename: string, blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// ===== NORMALIZACIÓN =====
export const normalizeEOL = (name: string, content: string) => {
  if (name.toLowerCase().endsWith(".ps1")) return content.replace(/\r?\n/g, "\r\n");
  return content.replace(/\r\n/g, "\n");
};

// ===== SCRIPTS DE DESPLIEGUE =====
export const getBashDeployScript = () => `#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="\${REPO_NAME:-$(basename "$PWD" | tr '[:upper:] ' '[:lower:]-' | sed 's/[^a-z0-9._-]//g')}"
VISIBILITY="\${VISIBILITY:-public}"
OWNER="\${OWNER:-}"
CNAME="\${CNAME:-}"

need() { command -v "$1" >/dev/null 2>&1 || { echo "❌ Falta '$1'. Instálalo y reintenta."; exit 1; }; }
need git
need gh

if ! gh auth status >/dev/null 2>&1; then
  echo "🔐 Iniciando sesión en GitHub…"
  gh auth login -w -p https
fi

: > .nojekyll
[ -n "$CNAME" ] && echo "$CNAME" > CNAME

[ -d .git ] || git init
git add -A
git commit -m "Initial commit" >/dev/null 2>&1 || echo "ℹ️ Nada que commitear"
git branch -M main || true

OWNER_FLAG=()
[ -n "$OWNER" ] && OWNER_FLAG=(--owner "$OWNER")

echo "📦 Creando repo '$REPO_NAME' ($VISIBILITY) y subiendo…"
if ! gh repo create "$REPO_NAME" "\${OWNER_FLAG[@]}" --"$VISIBILITY" --source=. --remote=origin --push -y; then
  echo "ℹ️ Repositorio puede existir. Configurando 'origin' y push…"
  [ -z "$OWNER" ] && OWNER="$(gh api user -q .login)"
  git remote remove origin >/dev/null 2>&1 || true
  git remote add origin "https://github.com/$OWNER/$REPO_NAME.git"
  git push -u origin main
fi

ORIGIN_URL="$(git config --get remote.origin.url)"
REPO_SLUG="$(basename -s .git "$ORIGIN_URL")"
OWNER_LOGIN="$(printf "%s" "$ORIGIN_URL" | sed -E 's#.*github.com[:/]+([^/]+)/.*#\\1#')"

echo "🌐 Activando GitHub Pages…"
gh api -X POST "repos/$OWNER_LOGIN/$REPO_SLUG/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 || \
gh api -X PUT  "repos/$OWNER_LOGIN/$REPO_SLUG/pages" -f "source[branch]=main" -f "source[path]=/"

PAGES_URL="https://$OWNER_LOGIN.github.io/$REPO_SLUG/"
echo "✅ Publicado: $PAGES_URL"
if command -v xdg-open >/dev/null 2>&1; then xdg-open "$PAGES_URL" >/dev/null 2>&1 || true
elif command -v open >/dev/null 2>&1; then open "$PAGES_URL" >/dev/null 2>&1 || true; fi
`;

export const getPowerShellDeployScript = () => `# Script de deployment automatico a GitHub Pages con manejo de errores robusto
# Uso: .\\deploy-gh-pages.ps1 [-RepoName "mi-portfolio"] [-Visibility "public"] [-Owner "usuario"] [-CNAME "midominio.com"]

Param(
  [string]$RepoName = (Split-Path -Leaf (Get-Location)).ToLower().Replace(' ','-'),
  [ValidateSet('public','private')][string]$Visibility = 'public',
  [string]$Owner = '',
  [string]$CNAME = ''
)

# Funciones de utilidad
function Write-Info { Write-Host "i $args" -ForegroundColor Blue }
function Write-Success { Write-Host "v $args" -ForegroundColor Green }
function Write-Warn { Write-Host "! $args" -ForegroundColor Yellow }
function Write-Err { Write-Host "x $args" -ForegroundColor Red }

function Test-Command {
  param([string]$Command)
  
  if (-not (Get-Command $Command -ErrorAction SilentlyContinue)) {
    Write-Err "Falta '$Command'. Instalalo y reintenta."
    switch ($Command) {
      'git' { Write-Host "  Descarga: https://git-scm.com/download/win" }
      'gh'  { Write-Host "  Descarga: https://cli.github.com/" }
    }
    exit 1
  }
}

# Configurar manejo de errores - permitir errores controlados
$ErrorActionPreference = 'Continue'
$env:GIT_REDIRECT_STDERR = '2>&1'

# Verificar dependencias
Test-Command 'git'
Test-Command 'gh'

# Mostrar configuracion
Write-Info "Configuracion:"
Write-Host "  Repositorio: $RepoName"
Write-Host "  Visibilidad: $Visibility"
Write-Host "  Owner: $(if($Owner){$Owner}else{'auto-detectar'})"
Write-Host "  Dominio: $(if($CNAME){$CNAME}else{'ninguno'})"
Write-Host ""

# Verificar autenticacion GitHub
Write-Info "Verificando autenticacion en GitHub..."
try { 
  gh auth status *> $null 
  Write-Success "Autenticado en GitHub"
} catch {
  Write-Warn "No estas autenticado. Iniciando login..."
  gh auth login -w -p https
  Write-Success "Autenticado correctamente"
}

# Preparar archivos
Write-Info "Preparando archivos para deployment..."
Set-Content -Path .nojekyll -Value '' -Encoding ascii
if ($CNAME) { 
  Set-Content -Path CNAME -Value $CNAME -Encoding ascii 
  Write-Success "Archivo CNAME creado"
}

# Inicializar git si no existe
if (-not (Test-Path .git)) { 
  Write-Info "Inicializando repositorio Git..."
  git init | Out-Null 
  Write-Success "Repositorio Git inicializado"
}

# Commit inicial
Write-Info "Creando commit inicial..."
git add -A | Out-Null

try {
  git commit -m "Initial commit" 2>$null | Out-Null
  Write-Success "Cambios commiteados"
} catch {
  Write-Warn "No hay cambios para commitear"
}

# Asegurar rama main
git branch -M main 2>$null | Out-Null

# Auto-detectar owner
if (-not $Owner) { 
  $Owner = gh api user -q .login 
  Write-Info "Owner auto-detectado: $Owner"
}

$RepoFull = "$Owner/$RepoName"

# Verificar si el repositorio existe
Write-Info "Verificando repositorio '$RepoFull'..."

$repoExists = $false
try {
  gh repo view $RepoFull *> $null
  $repoExists = $true
} catch {
  $repoExists = $false
}

if ($repoExists) {
  Write-Warn "El repositorio '$RepoFull' ya existe"
  Write-Host ""
  Write-Host "Opciones:"
  Write-Host "  1) Actualizar repositorio existente (push forzado)"
  Write-Host "  2) Cancelar operacion"
  
  $choice = Read-Host "Selecciona una opcion [1-2]"
  
  switch ($choice) {
    '1' {
      Write-Info "Actualizando repositorio existente..."
      
      # Configurar remote
      try {
        git remote get-url origin *> $null
        git remote set-url origin "https://github.com/$RepoFull.git" | Out-Null
      } catch {
        git remote add origin "https://github.com/$RepoFull.git" | Out-Null
      }
      
      # Push forzado
      Write-Warn "Haciendo push forzado (sobreescribira el repositorio)..."
      $null = & git push -u origin main --force 2>&1
      
      if ($LASTEXITCODE -eq 0) {
        Write-Success "Repositorio actualizado"
      } else {
        Write-Err "Error al actualizar el repositorio"
        exit 1
      }
    }
    '2' {
      Write-Info "Operacion cancelada"
      exit 0
    }
    default {
      Write-Err "Opcion invalida"
      exit 1
    }
  }
} else {
  Write-Info "Creando nuevo repositorio '$RepoFull'..."
  
  $createResult = & gh repo create $RepoFull "--$Visibility" --source . --remote origin 2>&1
  
  if ($LASTEXITCODE -eq 0) {
    Write-Success "Repositorio creado"
    
    # Push inicial
    Write-Info "Subiendo codigo..."
    $null = & git push -u origin main 2>&1
    
    if ($LASTEXITCODE -eq 0) {
      Write-Success "Codigo subido"
    } else {
      Write-Err "Error al subir el codigo"
      exit 1
    }
  } else {
    Write-Err "Error al crear el repositorio: $createResult"
    exit 1
  }
}

# Activar GitHub Pages
Write-Info "Configurando GitHub Pages..."

# Intentar crear Pages - silenciar todos los errores completamente
try {
  gh api -X POST "repos/$RepoFull/pages" -f "source[branch]=main" -f "source[path]=/" 2>$null | Out-Null
  Write-Success "GitHub Pages activado"
} catch {
  # Si falla, intentar actualizar
  try {
    gh api -X PUT "repos/$RepoFull/pages" -f "source[branch]=main" -f "source[path]=/" 2>$null | Out-Null
    Write-Success "GitHub Pages actualizado"
  } catch {
    Write-Success "GitHub Pages ya estaba activo"
  }
}

# Configurar dominio custom
if ($CNAME) {
  Write-Info "Configurando dominio custom: $CNAME"
  
  try {
    gh api -X PUT "repos/$RepoFull/pages" -f "cname=$CNAME" 2>$null | Out-Null
    Write-Success "Dominio custom configurado"
  } catch {
    Write-Warn "No se pudo configurar el dominio automaticamente"
  }
}

# URL del portfolio
$pagesUrl = if ($CNAME) { "https://$CNAME/" } else { "https://$Owner.github.io/$RepoName/" }

Write-Host ""
Write-Success "Deployment completado!"
Write-Host ""
Write-Host "  Repositorio: https://github.com/$RepoFull"
Write-Host "  Portfolio:   $pagesUrl"
Write-Host ""
Write-Info "Nota: GitHub Pages puede tardar 1-2 minutos en estar disponible"

# Abrir en navegador
if (Get-Command Start-Process -ErrorAction SilentlyContinue) { 
  Start-Process $pagesUrl | Out-Null 
}`;

// ===== README =====
export const makeDeploymentReadme = (
  files: Record<string, string>,
  fullName: string | undefined
) => {
  const fileList = Object.keys(files).sort().map((f) => `- \`${f}\``).join("\n");
  const who = fullName || "Portfolio";

  return `# ${who} — Sitio estático para GitHub Pages

Este ZIP contiene tu portfolio completo con páginas individuales para cada proyecto.

## 🚀 Despliegue rápido

### macOS / Linux
\`\`\`bash
chmod +x ./deploy-gh-pages.sh
./deploy-gh-pages.sh
\`\`\`

### Windows (PowerShell)
\`\`\`powershell
powershell -ExecutionPolicy Bypass -File .\\deploy-gh-pages.ps1
\`\`\`

> Requisitos: tener instalados **git** y **GitHub CLI (\`gh\`)**. Durante el despliegue, si no has iniciado sesión, se abrirá el navegador para autenticarte.

## 📁 Archivos incluidos
${fileList}

## ℹ️ Notas
- GitHub Pages publicará desde la rama \`main\` y la carpeta raíz.
- Si deseas dominio propio, edita/crea el archivo \`CNAME\` y vuelve a ejecutar el script.
- La primera publicación puede tardar 1–2 minutos.
- Cada proyecto tiene su propia página HTML para mejor SEO.
`;
};

// ===== ZIP =====
export const buildZip = async (files: Record<string, string>, rootDirName: string) => {
  const { downloadZip } = await import("client-zip");
  const enc = new TextEncoder();

  const entries = Object.entries(files).map(([name, content]) => ({
    name: `${rootDirName}/${name}`,
    lastModified: new Date(),
    input: enc.encode(normalizeEOL(name, content)),
  }));

  return await downloadZip(entries).blob();
};
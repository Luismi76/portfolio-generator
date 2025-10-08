# migrate-layout-builder.ps1
# Script para migrar AdvancedLayoutBuilder a estructura modular

Write-Host "🚀 Iniciando migración de AdvancedLayoutBuilder..." -ForegroundColor Cyan
Write-Host ""

# 1. Crear estructura de carpetas
Write-Host "📁 Paso 1: Creando estructura de carpetas..." -ForegroundColor Yellow
$targetPath = "src/components/layout-builder"

if (Test-Path $targetPath) {
    Write-Host "⚠️  La carpeta $targetPath ya existe." -ForegroundColor Yellow
    $response = Read-Host "¿Desea sobrescribir? (s/n)"
    if ($response -ne "s") {
        Write-Host "❌ Migración cancelada." -ForegroundColor Red
        exit
    }
}

New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
Write-Host "✅ Carpeta creada: $targetPath" -ForegroundColor Green

# 2. Crear archivos vacíos
Write-Host ""
Write-Host "📝 Paso 2: Creando archivos..." -ForegroundColor Yellow

$files = @(
    "types.ts",
    "constants.ts",
    "helpers.ts",
    "AvailableSectionCard.tsx",
    "AreaSectionRow.tsx",
    "DropArea.tsx",
    "AdvancedLayoutBuilder.tsx",
    "index.ts"
)

foreach ($file in $files) {
    $filePath = Join-Path $targetPath $file
    New-Item -ItemType File -Path $filePath -Force | Out-Null
    Write-Host "  ✅ Creado: $file" -ForegroundColor Green
}

# 3. Instrucciones para copiar contenido
Write-Host ""
Write-Host "📋 Paso 3: Siguiente - Copiar contenido de los artifacts" -ForegroundColor Yellow
Write-Host ""
Write-Host "Copia el contenido de cada artifact en el orden siguiente:" -ForegroundColor White
Write-Host ""
Write-Host "  1. types.ts                    <- Artifact: layout_builder_types" -ForegroundColor Cyan
Write-Host "  2. constants.ts                <- Artifact: layout_builder_constants" -ForegroundColor Cyan
Write-Host "  3. helpers.ts                  <- Artifact: layout_builder_helpers" -ForegroundColor Cyan
Write-Host "  4. AvailableSectionCard.tsx    <- Artifact: available_section_card" -ForegroundColor Cyan
Write-Host "  5. AreaSectionRow.tsx          <- Artifact: area_section_row" -ForegroundColor Cyan
Write-Host "  6. DropArea.tsx                <- Artifact: drop_area_component" -ForegroundColor Cyan
Write-Host "  7. AdvancedLayoutBuilder.tsx   <- Artifact: advanced_layout_builder_main" -ForegroundColor Cyan
Write-Host "  8. index.ts                    <- Artifact: layout_builder_index" -ForegroundColor Cyan
Write-Host ""

# 4. Buscar referencias al archivo antiguo
Write-Host "🔍 Paso 4: Buscando referencias al archivo antiguo..." -ForegroundColor Yellow
Write-Host ""

$oldImport = "from './components/AdvancedLayoutBuilder"
$oldImport2 = 'from "./components/AdvancedLayoutBuilder'
$oldImport3 = "from '@/components/AdvancedLayoutBuilder"
$oldImport4 = 'from "@/components/AdvancedLayoutBuilder'

$references = Get-ChildItem -Path "src" -Recurse -Include *.tsx,*.ts | 
    Select-String -Pattern "AdvancedLayoutBuilder" | 
    Where-Object { $_.Path -notmatch "layout-builder" -and $_.Path -notmatch "AdvancedLayoutBuilder.tsx" }

if ($references.Count -gt 0) {
    Write-Host "📍 Archivos que necesitan actualización de imports:" -ForegroundColor Yellow
    Write-Host ""
    $references | ForEach-Object {
        $relativePath = $_.Path -replace [regex]::Escape($PWD), ""
        Write-Host "  📄 $relativePath" -ForegroundColor White
        Write-Host "     Línea $($_.LineNumber): $($_.Line.Trim())" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host "✅ No se encontraron referencias al archivo antiguo" -ForegroundColor Green
}

# 5. Instrucciones finales
Write-Host ""
Write-Host "📚 Pasos siguientes:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. ✅ Estructura de carpetas creada" -ForegroundColor Green
Write-Host "  2. ⏳ Copiar contenido de artifacts a los archivos" -ForegroundColor Yellow
Write-Host "  3. ⏳ Actualizar imports en archivos que usan AdvancedLayoutBuilder:" -ForegroundColor Yellow
Write-Host ""
Write-Host "     ANTES: import { AdvancedLayoutBuilder } from './components/AdvancedLayoutBuilder'" -ForegroundColor Red
Write-Host "     DESPUÉS: import { AdvancedLayoutBuilder } from './components/layout-builder'" -ForegroundColor Green
Write-Host ""
Write-Host "  4. ⏳ Compilar y verificar:" -ForegroundColor Yellow
Write-Host "     npm run build" -ForegroundColor Cyan
Write-Host ""
Write-Host "  5. ⏳ Testing manual del drag & drop" -ForegroundColor Yellow
Write-Host ""
Write-Host "  6. ⏳ Si todo funciona, eliminar archivo antiguo:" -ForegroundColor Yellow
Write-Host "     Remove-Item 'src/components/AdvancedLayoutBuilder.tsx'" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Estructura creada exitosamente!" -ForegroundColor Green
Write-Host ""

# Crear archivo de checklist
$checklistPath = "CHECKLIST_LAYOUT_BUILDER.md"
$checklistContent = @"
# ✅ Checklist de Migración - AdvancedLayoutBuilder

## Progreso

- [ ] 1. Estructura de carpetas creada
- [ ] 2. Contenido copiado de artifacts
- [ ] 3. Imports actualizados en archivos dependientes
- [ ] 4. Compilación exitosa (npm run build)
- [ ] 5. TypeScript sin errores (npx tsc --noEmit)
- [ ] 6. Testing manual completado
- [ ] 7. Archivo antiguo eliminado

## Testing Manual

### Funcionalidad de Drag & Drop
- [ ] Arrastrar sección desde "Disponibles" a un área
- [ ] Reordenar secciones dentro de la misma área
- [ ] Mover sección entre diferentes áreas
- [ ] Toggle visibilidad de sección (ojo/ojo tachado)
- [ ] Remover sección (volver a disponibles)
- [ ] Activar/desactivar área completa

### Indicadores Visuales
- [ ] Línea azul de indicación de drop position
- [ ] Highlight del área activa durante drag
- [ ] Cambio de cursor (grab/grabbing)
- [ ] Estado "dragging" con opacidad reducida

## Archivos a Actualizar

$($references | ForEach-Object { "- [ ] $($_.Path)" } | Out-String)

## Notas

- Fecha inicio: $(Get-Date -Format "yyyy-MM-dd HH:mm")
- Archivo original: 666 líneas
- Archivos resultantes: 7 archivos modulares
- Reducción: ~70% en archivo principal

"@

Set-Content -Path $checklistPath -Value $checklistContent -Encoding UTF8
Write-Host "📝 Checklist creado: $checklistPath" -ForegroundColor Cyan
Write-Host ""
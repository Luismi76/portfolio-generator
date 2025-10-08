# create-barrel-exports.ps1
# Crear barrel exports SOLO donde los archivos existen

Write-Host "📦 Creando Barrel Exports Seguros" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en la raíz del proyecto
if (-not (Test-Path "src/components")) {
    Write-Host "❌ Error: Ejecuta desde la raíz del proyecto" -ForegroundColor Red
    exit
}

$created = 0

# ============================================================================
# 1. HOOKS
# ============================================================================
Write-Host "📁 hooks/index.ts..." -ForegroundColor Yellow

if (Test-Path "src/hooks/useLocalStorage.ts") {
    $hooksIndex = @"
// hooks/index.ts
export { useLocalStorage } from './useLocalStorage';
export { usePortfolioData } from './usePortfolioData';
export { useImageUpload } from './useImageUpload';
export { useDataExport } from './useDataExport';
export { 
    useAppState,
    useClickOutside,
    useBeforeUnload,
    useModeSwitcher,
    useAutoSave
} from './useAppState';
export { useAdvancedTemplates } from './useAdvancedTemplates';

// Exportar tipos
export type { UseLocalStorageOptions } from './useLocalStorage';
export type { UsePortfolioDataState, UsePortfolioDataReturn } from './usePortfolioData';
export type { UseImageUploadOptions, UseImageUploadReturn } from './useImageUpload';
export type { ExportResult, ImportResult, UseDataExportReturn } from './useDataExport';
export type { AppStateActions, UseModeSwitcherReturn, UseAutoSaveOptions } from './useAppState';
"@
    
    Set-Content -Path "src/hooks/index.ts" -Value $hooksIndex -Encoding UTF8
    Write-Host "  ✅ hooks/index.ts creado" -ForegroundColor Green
    $created++
}

# ============================================================================
# 2. CUSTOMIZER/CONTROLS
# ============================================================================
Write-Host "📁 customizer/controls/index.ts..." -ForegroundColor Yellow

if (Test-Path "src/components/customizer/controls/ColorPicker.tsx") {
    $controlsIndex = @"
// customizer/controls/index.ts
export { ColorPicker } from './ColorPicker';
export { SpacingControls } from './SpacingControls';
"@
    
    Set-Content -Path "src/components/customizer/controls/index.ts" -Value $controlsIndex -Encoding UTF8
    Write-Host "  ✅ customizer/controls/index.ts creado" -ForegroundColor Green
    $created++
}

# ============================================================================
# 3. CUSTOMIZER/TABS
# ============================================================================
Write-Host "📁 customizer/tabs/index.ts..." -ForegroundColor Yellow

if (Test-Path "src/components/customizer/tabs/AdvancedTab.tsx") {
    $tabsIndex = @"
// customizer/tabs/index.ts
export { AdvancedTab } from './AdvancedTab';
export { AvatarTab } from './AvatarTab';
export { ColorsTab } from './ColorsTab';
export { LayoutTab } from './LayoutTab';
export { SectionsTab } from './SectionsTab';
export { TypographyTab } from './TypographyTab';
"@
    
    Set-Content -Path "src/components/customizer/tabs/index.ts" -Value $tabsIndex -Encoding UTF8
    Write-Host "  ✅ customizer/tabs/index.ts creado" -ForegroundColor Green
    $created++
}

# ============================================================================
# 4. CUSTOMIZER/UTILS
# ============================================================================
Write-Host "📁 customizer/utils/index.ts..." -ForegroundColor Yellow

if (Test-Path "src/components/customizer/utils/layout-utils.ts") {
    $utilsIndex = @"
// customizer/utils/index.ts
export * from './layout-utils';
"@
    
    Set-Content -Path "src/components/customizer/utils/index.ts" -Value $utilsIndex -Encoding UTF8
    Write-Host "  ✅ customizer/utils/index.ts creado" -ForegroundColor Green
    $created++
}

# ============================================================================
# 5. CUSTOMIZER ROOT
# ============================================================================
Write-Host "📁 customizer/index.ts..." -ForegroundColor Yellow

if (Test-Path "src/components/customizer/AdvancedTemplateCustomizer.tsx") {
    $customizerIndex = @"
// customizer/index.ts
export { AdvancedTemplateCustomizer } from './AdvancedTemplateCustomizer';
export * from './controls';
export * from './tabs';
export * from './utils';
"@
    
    Set-Content -Path "src/components/customizer/index.ts" -Value $customizerIndex -Encoding UTF8
    Write-Host "  ✅ customizer/index.ts creado" -ForegroundColor Green
    $created++
}

# ============================================================================
# 6. PROJECT-FORM/UPLOADERS
# ============================================================================
Write-Host "📁 project-form/uploaders/index.ts..." -ForegroundColor Yellow

if (Test-Path "src/components/project-form/uploaders/ImagePreview.tsx") {
    $uploadersIndex = @"
// project-form/uploaders/index.ts
export { ImagePreview } from './ImagePreview';
export { MainImageUploader } from './MainImageUploader';
export { MultiImageUploader } from './MultiImageUploader';
"@
    
    Set-Content -Path "src/components/project-form/uploaders/index.ts" -Value $uploadersIndex -Encoding UTF8
    Write-Host "  ✅ project-form/uploaders/index.ts creado" -ForegroundColor Green
    $created++
}

# ============================================================================
# 7. PROJECT-FORM/UTILS
# ============================================================================
Write-Host "📁 project-form/utils/index.ts..." -ForegroundColor Yellow

if (Test-Path "src/components/project-form/utils/imageHelpers.ts") {
    $projectUtilsIndex = @"
// project-form/utils/index.ts
export * from './imageHelpers';
export * from './imageValidation';
"@
    
    Set-Content -Path "src/components/project-form/utils/index.ts" -Value $projectUtilsIndex -Encoding UTF8
    Write-Host "  ✅ project-form/utils/index.ts creado" -ForegroundColor Green
    $created++
}

# ============================================================================
# 8. PROJECT-FORM ROOT
# ============================================================================
Write-Host "📁 project-form/index.ts..." -ForegroundColor Yellow

if (Test-Path "src/components/project-form/ProjectTableForm.tsx") {
    $projectFormIndex = @"
// project-form/index.ts
export { ProjectTableForm } from './ProjectTableForm';
export { ProjectModal } from './ProjectModal';
export { ProjectTable } from './ProjectTable';
export * from './uploaders';
export * from './utils';
"@
    
    Set-Content -Path "src/components/project-form/index.ts" -Value $projectFormIndex -Encoding UTF8
    Write-Host "  ✅ project-form/index.ts creado" -ForegroundColor Green
    $created++
}

# ============================================================================
# RESUMEN
# ============================================================================
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Barrel Exports Creados: $created archivos" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($created -gt 0) {
    Write-Host "💡 Ahora puedes usar imports más limpios:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   // ✅ NUEVO" -ForegroundColor Green
    Write-Host "   import { usePortfolioData, useImageUpload } from '@/hooks';" -ForegroundColor White
    Write-Host "   import { AdvancedTemplateCustomizer } from '@/components/customizer';" -ForegroundColor White
    Write-Host "   import { ProjectTableForm } from '@/components/project-form';" -ForegroundColor White
    Write-Host ""
    Write-Host "   // ❌ ANTIGUO (aún funciona)" -ForegroundColor Yellow
    Write-Host "   import { usePortfolioData } from '../hooks/usePortfolioData';" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "🔧 Siguiente paso:" -ForegroundColor Yellow
Write-Host "   npm run build" -ForegroundColor Cyan
Write-Host ""
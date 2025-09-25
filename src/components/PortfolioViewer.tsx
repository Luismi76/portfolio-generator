// src/components/PortfolioViewer.tsx
import React, { useEffect, useMemo, useState } from 'react';
import type { Project, PortfolioData } from '../types/portfolio-types';
import { DEFAULT_PORTFOLIO_DATA } from '../types/portfolio-types';
import { TemplateRenderer } from './TemplateRenderer';
import { DebugSectionsPanel } from './DebugSectionsPanel';

// ⬇️ hook avanzado
import { useAdvancedTemplates } from '../hooks/useAdvancedTemplates';
import type { AdvancedTemplate, AdvancedTemplateConfig } from '../types/advanced-template-types';

/** ====== helpers ====== */

// Construye las variables CSS que el renderer/tema sí consume
function buildAdvancedCSSVars(
  t?: AdvancedTemplate | null,
  c?: AdvancedTemplateConfig | null
): React.CSSProperties {
  if (!t) return {};
  const cols = { ...t.colors, ...(c?.customizations?.colors || {}) };
  const typo = { ...t.typography, ...(c?.customizations?.typography || {}) };
  const layout = { ...t.layout, ...(c?.customizations?.layout || {}) };

  const fs = typo.fontSizes || ({} as any);
  const ff = typo.fontFamilies || ({} as any);
  const ls = typo.letterSpacing || ({} as any);
  const lh = typo.lineHeights || ({} as any);
  const sp = layout.spacing || ({} as any);
  const br = layout.borderRadius || ({} as any);

  // Las MISMAS variables que usa TemplateTheme/TemplateRenderer
  return {
    // Colores
    ['--color-primary' as any]: cols.primary,
    ['--color-secondary' as any]: cols.secondary,
    ['--color-accent' as any]: cols.accent,
    ['--color-bg' as any]: cols.background,
    ['--color-surface' as any]: cols.surface,
    ['--surface-variant' as any]: cols.surfaceVariant,
    ['--text-primary' as any]: cols.text?.primary,
    ['--text-secondary' as any]: cols.text?.secondary,
    ['--text-accent' as any]: cols.text?.accent,
    ['--text-muted' as any]: cols.text?.muted,
    ['--text-inverse' as any]: cols.text?.inverse,
    ['--text-on-primary' as any]: '#ffffff',

    // Tipografías
    ['--font-primary' as any]: ff.primary,
    ['--font-heading' as any]: ff.heading || ff.primary,
    // puedes mantener esta adicional si la usas en algún sitio
    ['--ff-mono' as any]: ff.monospace || "ui-monospace, SFMono-Regular, Menlo, monospace",

    ['--fs-xs' as any]: fs.xs,
    ['--fs-sm' as any]: fs.sm,
    ['--fs-base' as any]: fs.base,
    ['--fs-lg' as any]: fs.lg,
    ['--fs-xl' as any]: fs.xl,
    ['--fs-2xl' as any]: fs['2xl'],
    ['--fs-3xl' as any]: fs['3xl'],
    ['--fs-4xl' as any]: fs['4xl'],
    ['--fs-5xl' as any]: fs['5xl'],
    ['--fs-6xl' as any]: fs['6xl'],

    ['--ls-tighter' as any]: ls.tighter,
    ['--ls-tight' as any]: ls.tight,
    ['--ls-normal' as any]: ls.normal,
    ['--ls-wide' as any]: ls.wide,
    ['--ls-wider' as any]: ls.wider,

    ['--lh-tight' as any]: String(lh.tight),
    ['--lh-snug' as any]: String(lh.snug),
    ['--lh-normal' as any]: String(lh.normal),
    ['--lh-relaxed' as any]: String(lh.relaxed),
    ['--lh-loose' as any]: String(lh.loose),

    // Spacing + radios
    ['--sp-xs' as any]: sp.xs,
    ['--sp-sm' as any]: sp.sm,
    ['--sp-md' as any]: sp.md,
    ['--sp-lg' as any]: sp.lg,
    ['--sp-xl' as any]: sp.xl,
    ['--sp-2xl' as any]: sp['2xl'],

    ['--br-sm' as any]: br.sm,
    ['--br-md' as any]: br.md,
    ['--br-lg' as any]: br.lg,
    ['--br-xl' as any]: br.xl,
  };
}

/**
 * Inyecta estilos globales (opcional).
 * Usa las mismas variables que arriba y setea body/font-family de forma global.
 */
const TemplateThemeStyles: React.FC<{ template?: AdvancedTemplate | null; config?: AdvancedTemplateConfig | null }> = ({ template, config }) => {
  if (!template) return null;

  const styleVars = buildAdvancedCSSVars(template, config);
  // Serializa el objeto a CSS custom properties
  const vars = Object.entries(styleVars)
    .map(([k, v]) => `${k}: ${String(v)};`)
    .join('\n');

  const css = `
    :root {
      ${vars}
    }
    body {
      background: var(--color-bg);
      color: var(--text-primary);
      font-family: var(--font-primary, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, sans-serif);
      line-height: var(--lh-normal, 1.5);
    }
    h1,h2,h3,h4{
      font-family: var(--font-heading, var(--font-primary));
      letter-spacing: var(--ls-tight, -0.02em);
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

/** ====== componente ====== */

const PortfolioViewer: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);

  const { effectiveTemplate, config, isLoaded } = useAdvancedTemplates();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolioData');
      if (saved) setData(JSON.parse(saved));
    } catch (e) {
      console.error('Error loading data:', e);
    }
  }, []);

  // Variables CSS para envolver el renderer (máxima fiabilidad)
  const cssVars = useMemo(
    () => buildAdvancedCSSVars(effectiveTemplate, config),
    [effectiveTemplate, config]
  );

  // Vista de detalle (usa también las variables)
  if (selectedProject) {
    return (
      <>
        {isLoaded && <TemplateThemeStyles template={effectiveTemplate!} config={config} />}
        <div style={{ padding: 16 }}>
          <button onClick={() => setSelectedProject(null)}>← Volver al Portfolio</button>
        </div>
        <main style={{ maxWidth: 960, margin: '0 auto', padding: 16, ...cssVars }}>
          {selectedProject.image && (
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }}
            />
          )}
          <h1 style={{ margin: 0 }}>{selectedProject.title}</h1>
          <p style={{ opacity: 0.85 }}>{selectedProject.description}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {selectedProject.link && (
              <a href={selectedProject.link} target="_blank" rel="noopener noreferrer">
                Ver Live
              </a>
            )}
            {selectedProject.github && (
              <a href={selectedProject.github} target="_blank" rel="noopener noreferrer">
                Código
              </a>
            )}
          </div>
        </main>
        {process.env.NODE_ENV === 'development' && <DebugSectionsPanel />}
      </>
    );
  }

  // Vista normal
  return (
    <>
      {isLoaded && <TemplateThemeStyles template={effectiveTemplate!} config={config} />}

      {/* Envolvemos el renderer con las variables avanzadas */}
      <div style={cssVars}>
        <TemplateRenderer
          data={data}
          onOpenProject={setSelectedProject}
          // Si tu TemplateRenderer no tipa "template", este spread no hace daño
          {...(effectiveTemplate ? ({ template: effectiveTemplate } as any) : {})}
        />
      </div>

      {process.env.NODE_ENV === 'development' && <DebugSectionsPanel />}
    </>
  );
};

export default PortfolioViewer;

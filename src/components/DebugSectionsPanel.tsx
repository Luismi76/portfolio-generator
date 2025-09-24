// src/components/DebugSectionsPanel.tsx
import React, { useMemo, useState } from 'react';
import { useTemplates } from './use-templates';
import type { TemplateSection } from '../types/template-types';

type SectionRow = Pick<TemplateSection, 'id' | 'name' | 'enabled' | 'order'> & {
  source: 'template' | 'custom';
};

const normalizeId = (id: string) => (id === 'footer' ? 'contact' : id);

const useResolvedSections = () => {
  const { selectedTemplate, config } = useTemplates();

  // fuente cruda
  const templateSections = selectedTemplate?.sections ?? [];
  const customSections = config?.customizations?.sections ?? [];

  // de dónde salen (custom > template)
  const source = customSections.length ? 'custom' : 'template';
  const raw = (source === 'custom' ? customSections : templateSections) as TemplateSection[];

  // normalización + deduplicación (footer/contact) + solo enabled
  const { list, dedupCount } = useMemo(() => {
    const map = new Map<string, SectionRow>();
    let dups = 0;

    for (const s of raw) {
      if (!s.enabled) continue;
      const normId = normalizeId(s.id);
      const row: SectionRow = { id: normId, name: s.name, enabled: true, order: s.order, source: source as any };

      if (!map.has(normId)) {
        map.set(normId, row);
      } else {
        // preferir menor order al deduplicar
        const cur = map.get(normId)!;
        if (row.order < cur.order) map.set(normId, row);
        dups++;
      }
    }
    const list = Array.from(map.values()).sort((a, b) => a.order - b.order);
    return { list, dedupCount: dups };
  }, [raw, source]);

  return {
    source,                   // 'custom' o 'template'
    templateSections,
    customSections,
    resolved: list,
    dedupCount,
  } as {
    source: 'custom' | 'template';
    templateSections: TemplateSection[];
    customSections: TemplateSection[];
    resolved: SectionRow[];
    dedupCount: number;
  };
};

export const DebugSectionsPanel: React.FC = () => {
  const { source, templateSections, customSections, resolved, dedupCount } = useResolvedSections();
  const [open, setOpen] = useState(true);
  const [onlyEnabled, setOnlyEnabled] = useState(true);
  const [query, setQuery] = useState('');

  const filterText = query.trim().toLowerCase();
  const activeCount = resolved.length;
  const rawEnabledCount = (source === 'custom' ? customSections : templateSections).filter(s => s.enabled).length;

  const filtered = useMemo(() => {
    return resolved.filter(s => {
      if (onlyEnabled && !s.enabled) return false; // por si en el futuro mostramos todas
      if (!filterText) return true;
      return (
        s.id.toLowerCase().includes(filterText) ||
        s.name.toLowerCase().includes(filterText)
      );
    });
  }, [resolved, onlyEnabled, filterText]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: open ? 360 : 48,
        background: 'rgba(17, 24, 39, 0.95)',
        color: 'white',
        borderRadius: 12,
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        zIndex: 1000,
        transition: 'width 120ms ease',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={() => setOpen(v => !v)}
          title={open ? 'Cerrar panel' : 'Abrir panel'}
          style={{
            background: '#2563eb',
            border: 0,
            width: 28,
            height: 28,
            borderRadius: 8,
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {open ? '×' : '≡'}
        </button>
        {open && (
          <>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Secciones (debug)</div>
            <div style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.8 }}>
              fuente: <strong>{source}</strong>
            </div>
          </>
        )}
      </div>

      {/* Body */}
      {open && (
        <div style={{ padding: 10 }}>
          {/* top stats */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: 12, opacity: 0.9 }}>
            <div>activas (raw): <b>{rawEnabledCount}</b></div>
            <div>resueltas: <b>{activeCount}</b></div>
            <div>dedup: <b>{dedupCount}</b></div>
          </div>

          {/* filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input
              placeholder="Buscar id o nombre…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                padding: '6px 8px',
                borderRadius: 8,
                outline: 'none',
                fontSize: 12,
              }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <input
                type="checkbox"
                checked={onlyEnabled}
                onChange={(e) => setOnlyEnabled(e.target.checked)}
              />
              solo activas
            </label>
          </div>

          {/* list */}
          <div style={{ maxHeight: 260, overflow: 'auto' }}>
            {filtered.map((s) => (
              <div
                key={`${s.id}_${s.order}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: 8,
                  alignItems: 'center',
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  marginBottom: 6,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>{s.id}</div>
                </div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>order: <b>{s.order}</b></div>
                <div
                  title={s.source === 'custom' ? 'Definida en customizations' : 'De la plantilla base'}
                  style={{
                    fontSize: 11,
                    background: s.source === 'custom' ? '#f59e0b' : '#10b981',
                    color: 'black',
                    padding: '2px 6px',
                    borderRadius: 999,
                    fontWeight: 700,
                    justifySelf: 'end',
                  }}
                >
                  {s.source}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{ fontSize: 12, opacity: 0.8, padding: 10 }}>
                No hay secciones para el filtro actual.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


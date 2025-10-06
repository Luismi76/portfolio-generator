import React from 'react';
import { AdvancedTemplateTypography } from '../types/advanced-template-types';

// ===== Tipos locales =====
interface FontFamily {
  name: string;
  value: string;
  category: string;
}

interface FontSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: 'primary' | 'heading';
  fontFamily: FontFamily[];
}

interface TypographyControlsProps {
  typography: AdvancedTemplateTypography;
  onChange: (typography: AdvancedTemplateTypography) => void;
}

// ===== Constantes =====
const FONT_FAMILIES: FontFamily[] = [
  { name: "Inter", value: "'Inter', sans-serif", category: "Sans-serif" },
  { name: "Roboto", value: "'Roboto', sans-serif", category: "Sans-serif" },
  { name: "Poppins", value: "'Poppins', sans-serif", category: "Sans-serif" },
  { name: "Playfair Display", value: "'Playfair Display', serif", category: "Serif" },
  { name: "Merriweather", value: "'Merriweather', serif", category: "Serif" },
  { name: "Source Code Pro", value: "'Source Code Pro', monospace", category: "Monospace" },
];

// ===== FontSelector Component =====
const FontSelector: React.FC<FontSelectorProps> = ({ 
  label, 
  value, 
  onChange, 
  type, 
  fontFamily 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedFont = fontFamily.find(f => f.value === value);
  const previewText = type === 'heading' ? 'Título de ejemplo' : 'El veloz murciélago hindú';

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border rounded-lg text-left bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {selectedFont?.name || 'Seleccionar fuente'}
            </div>
            <div 
              className="text-xs text-gray-500 mt-1 truncate"
              style={{ fontFamily: value }}
            >
              {previewText}
            </div>
          </div>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {fontFamily.map((font) => (
              <button
                key={font.value}
                type="button"
                onClick={() => {
                  onChange(font.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b last:border-b-0 ${
                  value === font.value ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {font.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {font.category}
                  </span>
                </div>
                <div 
                  className="text-lg text-gray-700"
                  style={{ fontFamily: font.value }}
                >
                  {previewText}
                </div>
                <div 
                  className="text-sm text-gray-600 mt-1"
                  style={{ fontFamily: font.value }}
                >
                  AaBbCc 0123456789
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ===== PreviewSection Component =====
const PreviewSection: React.FC<{ typography: AdvancedTemplateTypography }> = ({ typography }) => (
  <div className="border-t pt-4">
    <h4 className="text-sm font-medium text-gray-700 mb-3">Vista Previa Completa</h4>
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <div style={{ fontFamily: typography.fontFamily.heading }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Este es un título principal
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Este es un subtítulo
        </h2>
      </div>
      <div style={{ fontFamily: typography.fontFamily.primary }}>
        <p className="text-base text-gray-700 mb-2">
          Este es un párrafo de ejemplo con texto regular. El diseño de la tipografía es fundamental para la legibilidad y la jerarquía visual de tu proyecto.
        </p>
        <p className="text-sm text-gray-600">
          Texto más pequeño para detalles y notas al pie.
        </p>
      </div>
    </div>
  </div>
);

// ===== FontSizesSection Component =====
const FontSizesSection: React.FC<{
  typography: AdvancedTemplateTypography;
  onChange: (typography: AdvancedTemplateTypography) => void;
}> = ({ typography, onChange }) => {
  const fontSizeKeys: (keyof AdvancedTemplateTypography['fontSize'])[] = [
    'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">Tamaños de Fuente</h4>
      <div className="grid grid-cols-3 gap-3">
        {fontSizeKeys.map((size) => (
          <div key={size}>
            <label className="block text-xs text-gray-600 mb-1">{size}</label>
            <input
              type="text"
              value={typography.fontSize[size] || ""}
              onChange={(e) =>
                onChange({
                  ...typography,
                  fontSize: {
                    ...typography.fontSize,
                    [size]: e.target.value,
                  },
                })
              }
              className="w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500"
              placeholder="1rem"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== fontWeightSection Component =====
const FontWeightSection: React.FC<{
  typography: AdvancedTemplateTypography;
  onChange: (typography: AdvancedTemplateTypography) => void;
}> = ({ typography, onChange }) => {
  const fontWeightKeys: (keyof AdvancedTemplateTypography['fontWeight'])[] = [
    'thin', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">Pesos de Fuente</h4>
      <div className="grid grid-cols-4 gap-3">
        {fontWeightKeys.map((weight) => (
          <div key={weight}>
            <label className="block text-xs text-gray-600 mb-1 capitalize">{weight}</label>
            <input
              type="number"
              min="100"
              max="900"
              step="100"
              value={typography.fontWeight[weight] || ""}
              onChange={(e) =>
                onChange({
                  ...typography,
                  fontWeight: {
                    ...typography.fontWeight,
                    [weight]: parseInt(e.target.value) || 400,
                  },
                })
              }
              className="w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500"
              placeholder="400"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== TypographyControls Component Principal =====
const TypographyControls: React.FC<TypographyControlsProps> = ({ 
  typography, 
  onChange 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FontSelector
          label="Fuente Principal"
          value={typography.fontFamily.primary}
          onChange={(value) =>
            onChange({
              ...typography,
              fontFamily: {
                ...typography.fontFamily,
                primary: value,
              },
            })
          }
          type="primary"
          fontFamily={FONT_FAMILIES}
        />
        <FontSelector
          label="Fuente de Títulos"
          value={typography.fontFamily.heading}
          onChange={(value) =>
            onChange({
              ...typography,
              fontFamily: {
                ...typography.fontFamily,
                heading: value,
              },
            })
          }
          type="heading"
          fontFamily={FONT_FAMILIES}
        />
      </div>

      <PreviewSection typography={typography} />
      
      <FontSizesSection typography={typography} onChange={onChange} />
      
      <FontWeightSection typography={typography} onChange={onChange} />
    </div>
  );
};

export default TypographyControls;
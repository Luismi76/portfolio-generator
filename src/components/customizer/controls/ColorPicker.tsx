// src/components/customizer/controls/ColorPicker.tsx
import React, { useState } from "react";
import { Icons } from "../../portfolio-icons";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}

/**
 * Componente selector de color con presets
 * Permite seleccionar color mediante picker, input text, o presets
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  presets,
}) => {
  const [showPresets, setShowPresets] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-700">
        {label}
      </label>
      
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
        />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="#000000"
        />
        
        {presets && (
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label="Toggle presets"
          >
            <Icons.ChevronDown size={14} />
          </button>
        )}
      </div>

      {showPresets && presets && (
        <div className="grid grid-cols-6 gap-1 p-2 border rounded bg-gray-50">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: preset }}
              title={preset}
              aria-label={`Use color ${preset}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
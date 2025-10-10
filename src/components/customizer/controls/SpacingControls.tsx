// src/components/customizer/controls/SpacingControls.tsx
import React, { useState } from "react";

interface SpacingControlsProps {
  spacing: any;
  onChange: (spacing: any) => void;
}

/**
 * Control de espaciado con presets y slider
 * Ajusta todos los tamaños de espaciado proporcionalmente
 */
export const SpacingControls: React.FC<SpacingControlsProps> = ({
  spacing,
  onChange,
}) => {
  const getInitialLevel = () => {
    const mdValue = spacing?.md || "0.5rem"; // Cambiado de "1.5rem" a "0.5rem"
    const parsed = parseFloat(mdValue);
    if (mdValue.includes("rem")) {
      return parsed;
    } else if (mdValue.includes("px")) {
      return parsed / 16;
    }
    return 0.5; // Cambiado de 1.5 a 0.5 (modo compacto)
  };

  const [spacingLevel, setSpacingLevel] = useState(getInitialLevel);

  const spacingRatios = {
    xs: 0.33,
    sm: 0.67,
    md: 1,
    lg: 1.33,
    xl: 2,
    "2xl": 2.67,
  };

  const handleSpacingChange = (newLevel: number) => {
    setSpacingLevel(newLevel);

    const newSpacing = {
      xs: `${(newLevel * spacingRatios.xs).toFixed(2)}rem`,
      sm: `${(newLevel * spacingRatios.sm).toFixed(2)}rem`,
      md: `${(newLevel * spacingRatios.md).toFixed(2)}rem`,
      lg: `${(newLevel * spacingRatios.lg).toFixed(2)}rem`,
      xl: `${(newLevel * spacingRatios.xl).toFixed(2)}rem`,
      "2xl": `${(newLevel * spacingRatios["2xl"]).toFixed(2)}rem`,
    };

    onChange(newSpacing);
  };

  const presets = [
    { label: "Muy Compacto", value: 0.25 },
    { label: "Compacto", value: 0.5 },
    { label: "Normal", value: 1 },
    { label: "Espaciado", value: 1.5 },
    { label: "Muy Espaciado", value: 2 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Espaciado General</h4>
        <span className="text-xs text-gray-500">
          {spacingLevel.toFixed(2)}rem
        </span>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          aria-label="Nivel de espaciado general"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          min={0.25}
          max={4}
          step={0.25}
          value={spacingLevel}
          onChange={(e) => handleSpacingChange(parseFloat(e.target.value))}
        />

        <div className="flex justify-between text-xs text-gray-500">
          <span>Compacto</span>
          <span>Normal</span>
          <span>Espaciado</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handleSpacingChange(preset.value)}
            className={`px-3 py-1 rounded-lg text-xs transition-colors ${
              Math.abs(spacingLevel - preset.value) < 0.1
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <details className="mt-4">
        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
          Ver valores específicos
        </summary>
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
          {Object.entries(spacingRatios).map(([key, ratio]) => (
            <div key={key} className="bg-gray-50 rounded p-2">
              <span className="text-gray-600">{key}:</span>
              <span className="ml-1 font-mono text-gray-800">
                {(spacingLevel * ratio).toFixed(2)}rem
              </span>
            </div>
          ))}
        </div>
      </details>

      <p className="text-[11px] text-gray-500 mt-2">
        Ajusta el espaciado general de la plantilla. Todos los tamaños se
        escalan proporcionalmente.
      </p>
    </div>
  );
};
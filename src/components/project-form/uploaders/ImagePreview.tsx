// src/components/project-form/uploaders/ImagePreview.tsx
import React from "react";
import { ERROR_PLACEHOLDER_IMAGE } from "../utils/imageHelpers";

interface ImagePreviewProps {
  src: string;
  alt: string;
  onRemove: () => void;
  className?: string;
}

/**
 * Componente de preview de imagen con opción de eliminar
 */
export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt,
  onRemove,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-3 p-2 bg-gray-50 rounded ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-16 h-12 object-cover rounded"
        onError={(e) => {
          (e.target as HTMLImageElement).src = ERROR_PLACEHOLDER_IMAGE;
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-green-600 mb-1">Imagen cargada</div>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-red-600 hover:text-red-800"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
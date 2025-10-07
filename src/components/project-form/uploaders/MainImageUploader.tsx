// src/components/project-form/uploaders/MainImageUploader.tsx
import React, { useState } from "react";
import { Icons } from "../../portfolio-icons";
import { validateImageUrl } from "../utils/imageValidation";
import { ImagePreview } from "./ImagePreview";

interface MainImageUploaderProps {
  imageUrl: string | undefined;
  onChange: (url: string) => void;
}

/**
 * Componente para subir/gestionar la imagen principal del proyecto
 */
export const MainImageUploader: React.FC<MainImageUploaderProps> = ({
  imageUrl,
  onChange,
}) => {
  const [error, setError] = useState<string>("");

  const handleUrlChange = (url: string) => {
    setError("");

    if (url && !validateImageUrl(url)) {
      setError("URL inválida. Debe empezar con http:// o https://");
    }

    onChange(url);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Imagen principal
      </label>

      <input
        type="url"
        placeholder="https://ejemplo.com/imagen.png"
        value={imageUrl || ""}
        onChange={(e) => handleUrlChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded flex items-center gap-2">
          <Icons.AlertCircle size={16} />
          {error}
          <button onClick={() => setError("")} className="ml-auto">
            <Icons.X size={14} />
          </button>
        </div>
      )}

      {imageUrl && (
        <ImagePreview
          src={imageUrl}
          alt="Preview"
          onRemove={() => onChange("")}
        />
      )}

      <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
        <strong>Subir a:</strong>{" "}
        <a
          href="https://minio.lmsc.es"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Tu MinIO
        </a>
        ,{" "}
        <a
          href="https://imgur.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Imgur
        </a>
        , o{" "}
        <a
          href="https://imgbb.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          ImgBB
        </a>
      </div>
    </div>
  );
};
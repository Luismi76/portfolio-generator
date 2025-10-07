// src/components/project-form/uploaders/MultiImageUploader.tsx
import React, { useState } from "react";
import { Icons } from "../../portfolio-icons";
import { validateRequiredImageUrl } from "../utils/imageValidation";
import { getImagesArray, ERROR_PLACEHOLDER_IMAGE } from "../utils/imageHelpers";

interface MultiImageUploaderProps {
  imagesString: string;
  mainImageIndex: number;
  onImagesChange: (images: string) => void;
  onMainImageChange: (index: number, url: string) => void;
}

/**
 * Componente para gestionar múltiples imágenes con selección de imagen principal
 */
export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  imagesString,
  mainImageIndex,
  onImagesChange,
  onMainImageChange,
}) => {
  const [error, setError] = useState<string>("");
  const [urlInput, setUrlInput] = useState<string>("");

  const images = getImagesArray(imagesString);
  const safeMainIndex =
    images.length > 0 ? Math.min(mainImageIndex, images.length - 1) : 0;

  const addImageByUrl = () => {
    if (!urlInput.trim()) {
      setError("Introduce una URL válida");
      return;
    }

    if (!validateRequiredImageUrl(urlInput)) {
      setError("URL inválida. Debe empezar con http:// o https://");
      return;
    }

    if (images.includes(urlInput.trim())) {
      setError("Esta imagen ya está agregada");
      return;
    }

    const newImages = [...images, urlInput.trim()];
    onImagesChange(newImages.join(","));
    setUrlInput("");
    setError("");

    // Si es la primera imagen, establecerla como principal
    if (images.length === 0) {
      onMainImageChange(0, urlInput.trim());
    }
  };

  const removeImage = (imageIndex: number) => {
    const newImages = images.filter((_, i) => i !== imageIndex);
    onImagesChange(newImages.join(","));

    // Ajustar índice principal
    if (newImages.length === 0) {
      onMainImageChange(0, "");
    } else if (imageIndex === safeMainIndex) {
      onMainImageChange(0, newImages[0]);
    } else if (imageIndex < safeMainIndex) {
      onMainImageChange(safeMainIndex - 1, images[safeMainIndex]);
    }
  };

  const setMainImage = (imageIndex: number) => {
    if (imageIndex < 0 || imageIndex >= images.length) return;
    onMainImageChange(imageIndex, images[imageIndex]);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Galería de imágenes adicionales
      </label>

      <div className="flex gap-2">
        <input
          type="url"
          placeholder="https://ejemplo.com/imagen.png"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addImageByUrl();
            }
          }}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={addImageByUrl}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Icons.Plus size={16} />
        </button>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded flex items-center gap-2">
          <Icons.AlertCircle size={16} />
          {error}
          <button onClick={() => setError("")} className="ml-auto">
            <Icons.X size={14} />
          </button>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Galería ({images.length} imágenes)
            </h4>
            <div className="text-xs text-gray-500">
              Click para marcar como principal
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((img, imgIndex) => (
              <div
                key={imgIndex}
                className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer ${
                  imgIndex === safeMainIndex
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setMainImage(imgIndex)}
              >
                <img
                  src={img}
                  alt={`Imagen ${imgIndex + 1}`}
                  className="w-full h-20 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      ERROR_PLACEHOLDER_IMAGE;
                  }}
                />

                {imgIndex === safeMainIndex && (
                  <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                    Principal
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(imgIndex);
                  }}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Icons.X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
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
        </a>{" "}
        y copia la URL
      </div>
    </div>
  );
};
// External Image Upload Services
import React, { useState, useRef } from 'react';

// Imgur API Service
class ImgurUploader {
  private clientId: string;
  
  constructor() {
    // Client ID público de Imgur (puedes usar este o crear uno propio)
    this.clientId = '546c25a59c58ad7';
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${this.clientId}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Error uploading to Imgur');
    }

    const data = await response.json();
    return data.data.link;
  }
}

// ImgBB API Service (alternativa)
class ImgBBUploader {
  private apiKey: string;
  
  constructor() {
    // API key pública de ImgBB (limitada pero funcional)
    this.apiKey = '2d1f348b0e8b40b5b1c8dc4d4c2e9a8f';
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${this.apiKey}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Error uploading to ImgBB');
    }

    const data = await response.json();
    return data.data.url;
  }
}

// Cloudinary Upload (otra alternativa)
class CloudinaryUploader {
  private cloudName: string;
  private uploadPreset: string;
  
  constructor() {
    this.cloudName = 'demo'; // Preset público de demostración
    this.uploadPreset = 'ml_default';
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Error uploading to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  }
}

// Sistema de múltiples servicios con fallback
class MultiServiceUploader {
  private services: Array<{ name: string; uploader: any }>;
  
  constructor() {
    this.services = [
      { name: 'Imgur', uploader: new ImgurUploader() },
      { name: 'ImgBB', uploader: new ImgBBUploader() },
      { name: 'Cloudinary', uploader: new CloudinaryUploader() }
    ];
  }

  async uploadImage(file: File): Promise<{ url: string; service: string }> {
    let lastError: Error | null = null;

    for (const service of this.services) {
      try {
        console.log(`Trying ${service.name}...`);
        const url = await service.uploader.uploadImage(file);
        console.log(`✓ Success with ${service.name}`);
        return { url, service: service.name };
      } catch (error) {
        console.log(`✗ ${service.name} failed:`, error);
        lastError = error as Error;
        continue;
      }
    }

    throw new Error(`All upload services failed. Last error: ${lastError?.message}`);
  }
}

// React Hook para manejo de uploads
export const useExternalImageUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastService, setLastService] = useState<string>('');
  
  const uploader = new MultiServiceUploader();

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    setProgress(0);

    // Simular progreso durante la subida
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 15, 85));
    }, 200);

    try {
      const result = await uploader.uploadImage(file);
      setLastService(result.service);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setProgress(0);
        setUploading(false);
      }, 1000);
      
      return result.url;
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      setUploading(false);
      throw error;
    }
  };

  return {
    uploadImage,
    uploading,
    progress,
    lastService
  };
};

// Componente de subida de imágenes mejorado
interface ExternalImageUploaderProps {
  onImageUploaded: (urls: string[]) => void;
  onError: (error: string) => void;
  currentImages?: string[];
  maxImages?: number;
  maxSizeMB?: number;
}

export const ExternalImageUploader: React.FC<ExternalImageUploaderProps> = ({
  onImageUploaded,
  onError,
  currentImages = [],
  maxImages = 5,
  maxSizeMB = 10
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading, progress, lastService } = useExternalImageUploader();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validar límites
    if (currentImages.length + files.length > maxImages) {
      onError(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      // Validar tipo
      if (!file.type.startsWith('image/')) {
        onError(`"${file.name}" no es una imagen válida`);
        continue;
      }

      // Validar tamaño
      if (file.size > maxSizeMB * 1024 * 1024) {
        onError(`"${file.name}" es muy grande. Máximo ${maxSizeMB}MB`);
        continue;
      }

      try {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      } catch (error) {
        onError(`Error subiendo "${file.name}": ${error}`);
      }
    }

    if (uploadedUrls.length > 0) {
      const allImages = [...currentImages, ...uploadedUrls];
      onImageUploaded(allImages);
    }

    // Limpiar input
    event.target.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = currentImages.filter((_, index) => index !== indexToRemove);
    onImageUploaded(updatedImages);
  };



  return (
    <div className="space-y-4">
      {/* Botones de acción */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || currentImages.length >= maxImages}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Subiendo...
            </>
          ) : (
            <>
              📤 Subir Imágenes
            </>
          )}
        </button>

        {currentImages.length > 0 && (
          <button
            type="button"
            onClick={() => onImageUploaded([])}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            🗑️ Limpiar Todo
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Barra de progreso */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subiendo imagen...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {lastService && (
            <p className="text-xs text-gray-500">Usando servicio: {lastService}</p>
          )}
        </div>
      )}

      {/* Vista previa de imágenes */}
      {currentImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Imágenes ({currentImages.length}/{maxImages})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Eliminar imagen"
                >
                  ×
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="truncate">{imageUrl.split('/').pop()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información */}
      <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-blue-500">ℹ️</span>
          <div>
            <p><strong>Límites:</strong> Máximo {maxImages} imágenes, {maxSizeMB}MB por imagen</p>
            <p><strong>Formatos:</strong> JPG, PNG, GIF, WebP</p>
            <p><strong>Servicios:</strong> Imgur, ImgBB, Cloudinary (con fallback automático)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalImageUploader;
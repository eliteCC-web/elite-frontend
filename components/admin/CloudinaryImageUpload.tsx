/* eslint-disable */
'use client';

import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import CloudinaryService from '@/services/cloudinary.service';

interface CloudinaryImageUploadProps {
  initialImage?: string;
  onImageUploaded: (imageUrl: string) => void;
  onImageRemoved: () => void;
}

export default function CloudinaryImageUpload({
  initialImage,
  onImageUploaded,
  onImageRemoved,
}: CloudinaryImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    // Validar tipo de archivo y tamaño
    if (!file.type.startsWith('image/')) {
      setError('El archivo seleccionado no es una imagen.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('El tamaño máximo permitido es 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      // Cargar a Cloudinary
      const result = await CloudinaryService.uploadImage(file);
      
      // Actualizar estado y notificar al componente padre
      setImageUrl(result.secure_url);
      onImageUploaded(result.secure_url);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError('Error al subir la imagen. Inténtelo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    onImageRemoved();
  };

  return (
    <div>
      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {isUploading ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
          <p className="mt-4 text-sm text-gray-600">Subiendo imagen...</p>
        </div>
      ) : imageUrl ? (
        <div className="relative max-w-md">
          <div className="relative rounded-lg overflow-hidden h-48 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Imagen cargada"
              className="h-full w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-gray-700" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <label className="cursor-pointer block">
            <div className="flex flex-col items-center justify-center py-6">
              <ImageIcon size={36} className="text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700 mt-2">
                Haz clic para subir una imagen
              </span>
              <span className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF hasta 5MB
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}
    </div>
  );
}
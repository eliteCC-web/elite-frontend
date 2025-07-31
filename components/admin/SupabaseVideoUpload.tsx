'use client';

import React, { useState } from 'react';
import { Upload, X, Video, Play } from 'lucide-react';
import SupabaseService from '@/services/supabase.service';

interface SupabaseVideoUploadProps {
  initialVideos?: string[];
  onVideoUploaded: (videoUrl: string) => void;
  onVideoRemoved: (videoUrl: string) => void;
  maxVideos?: number;
}

export default function SupabaseVideoUpload({
  initialVideos = [],
  onVideoUploaded,
  onVideoRemoved,
  maxVideos = 2
}: SupabaseVideoUploadProps) {
  
  const [uploadedVideos, setUploadedVideos] = useState<string[]>(initialVideos);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    
    // Validar tipo de archivo
    if (!file.type.startsWith('video/')) {
      setError('El archivo seleccionado no es un video.');
      return;
    }

    // Validar tamaño (50MB máximo)
    if (file.size > 50 * 1024 * 1024) {
      setError('El tamaño máximo permitido es 50MB.');
      return;
    }

    // Validar número máximo de videos
    if (uploadedVideos.length >= maxVideos) {
      setError(`Máximo ${maxVideos} videos permitidos.`);
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      // Subir a Supabase
      const result = await SupabaseService.uploadVideo(file);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Actualizar estado y notificar al componente padre
      const newVideos = [...uploadedVideos, result.url];
      setUploadedVideos(newVideos);
      onVideoUploaded(result.url);
    } catch (err: any) {
      console.error('Error uploading video:', err);
      setError(err.message || 'Error al subir el video. Inténtelo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveVideo = (videoUrl: string) => {
    const newVideos = uploadedVideos.filter(video => video !== videoUrl);
    setUploadedVideos(newVideos);
    onVideoRemoved(videoUrl);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Videos subidos */}
      {uploadedVideos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uploadedVideos.map((videoUrl, index) => (
            <div key={index} className="relative group">
              <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video">
                <video
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveVideo(videoUrl)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={16} className="text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Área de subida */}
      {isUploading ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-sm text-gray-600">Subiendo video...</p>
        </div>
      ) : uploadedVideos.length < maxVideos ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <label className="cursor-pointer block">
            <div className="flex flex-col items-center justify-center py-6">
              <Video size={36} className="text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700 mt-2">
                Haz clic para subir un video
              </span>
              <span className="text-xs text-gray-500 mt-1">
                MP4, MOV, AVI hasta 50MB (Máximo {maxVideos} videos)
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
          <div className="flex flex-col items-center justify-center py-6">
            <Video size={36} className="text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-500">
              Máximo {maxVideos} videos alcanzado
            </span>
            <span className="text-xs text-gray-400 mt-1">
              Elimina un video para agregar otro
            </span>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="text-xs text-gray-500">
        <p>• Formatos soportados: MP4, MOV, AVI, WebM</p>
        <p>• Tamaño máximo: 50MB por video</p>
        <p>• Máximo {maxVideos} videos por tienda</p>
      </div>
    </div>
  );
} 
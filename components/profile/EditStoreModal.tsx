/* eslint-disable */
'use client';

import React, { useState } from 'react';
import { X, Save, Store, Phone, MapPin, Tag, Building, Image as ImageIcon, Video } from 'lucide-react';
import { Store as StoreType } from '@/services/profile.service';
import ProfileService from '@/services/profile.service';
import CloudinaryService from '@/services/cloudinary.service';
import SupabaseService from '@/services/supabase.service';

interface EditStoreModalProps {
  store: StoreType;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedStore: StoreType) => void;
}

export default function EditStoreModal({ store, isOpen, onClose, onUpdate }: EditStoreModalProps) {
  // Validación de seguridad
  if (!store) {
    console.warn('EditStoreModal: store prop is undefined');
    return null;
  }

  const [formData, setFormData] = useState({
    name: store.name || '',
    phone: store.phone || '',
    description: store.description || '',
    images: (store as any).images || [],
    videos: (store as any).videos || []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedStore = await ProfileService.updateMyStore(formData);
      onUpdate(updatedStore);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el local');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageUrl = await CloudinaryService.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
    } catch (err) {
      setError('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (formData.videos.length >= 2) {
      setError('Máximo 2 videos permitidos');
      return;
    }

    setUploadingImage(true);
    try {
      const videoUrl = await SupabaseService.uploadVideo(file);
      if (videoUrl.error) {
        throw new Error(videoUrl.error);
      }
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, videoUrl.url]
      }));
    } catch (err: any) {
      setError(err.message || 'Error al subir el video');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_: any, i: number) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 max-h-[75vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Editar Local</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Local
              </label>
              <div className="relative">
                <Store size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>


          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Describe tu local..."
            />
          </div>

          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imágenes del Local
            </label>
            
            {/* Upload Button */}
            <div className="mb-3">
              <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors cursor-pointer">
                <div className="text-center">
                  <ImageIcon size={20} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-sm text-gray-600">
                    {uploadingImage ? 'Subiendo...' : 'Haz clic para subir imagen'}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>

            {/* Images Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formData.images.map((image: string, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Videos Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Videos del Local (máximo 2)
            </label>
            
            {/* Upload Button */}
            <div className="mb-3">
              <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors cursor-pointer">
                <div className="text-center">
                  <Video size={20} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-sm text-gray-600">
                    {uploadingImage ? 'Subiendo...' : 'Haz clic para subir video'}
                  </p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  disabled={uploadingImage || formData.videos.length >= 2}
                />
              </label>
            </div>

            {/* Videos Grid */}
            {formData.videos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.videos.map((video: string, index: number) => (
                  <div key={index} className="relative group">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video">
                      <video
                        src={video}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      />
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
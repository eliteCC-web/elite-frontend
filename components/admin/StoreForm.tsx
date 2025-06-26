/* eslint-disable */

'use client';

import React, { useState } from 'react';
import { Store, CreateStoreDto } from '@/services/store.service';
import { X, Upload, Check, AlertCircle, Loader2 } from 'lucide-react';
import CloudinaryService from '@/services/cloudinary.service';

// Mejoramos la definición de las props para manejar ambos casos
interface StoreFormProps {
  initialData?: Store;
  // Usamos un tipo genérico para que coincida con el tipo de datos que la función espera
  onSubmit: (data: Omit<CreateStoreDto, 'id'> & Partial<{id: number}>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function StoreForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: StoreFormProps) {
  const [formData, setFormData] = useState<CreateStoreDto>({
    storeNumber: initialData?.storeNumber || '',
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    description: initialData?.description || '',
    images: initialData?.images || [],
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.images?.[0] || null
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    
    // Limpiar error al editar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    
    // Validar tipo de archivo
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
      setImageError('El archivo debe ser una imagen (JPEG, PNG o GIF)');
      return;
    }
    
    // Validar tamaño del archivo (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('La imagen no debe superar los 5MB');
      return;
    }

    try {
      setIsUploadingImage(true);
      setImageError(null);
      
      // Crear una vista previa local
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Subir a Cloudinary
      const result = await CloudinaryService.uploadImage(file);
      
      // Actualizar el formulario con la URL de Cloudinary
      setFormData((prev: any) => ({ ...prev, images: [...prev.images, result.secure_url] }));
      console.log('Imagen subida a Cloudinary:', result.secure_url);
      
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      setImageError('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImagePreview(null);
    setFormData((prev: any) => ({ 
      ...prev, 
      images: (prev.images || []).filter((_: string, i: number) => i !== index) 
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.storeNumber.trim()) {
      newErrors.storeNumber = 'El número de local es requerido';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'El teléfono debe tener entre 7 y 15 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label 
            htmlFor="storeNumber" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Número de Local
          </label>
          <input
            id="storeNumber"
            name="storeNumber"
            type="text"
            value={formData.storeNumber}
            onChange={handleChange}
            className={`block w-full px-4 py-2.5 border ${
              errors.storeNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
            placeholder="Ej: A-101"
          />
          {errors.storeNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.storeNumber}</p>
          )}
        </div>

        <div>
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`block w-full px-4 py-2.5 border ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
            placeholder="Nombre del local"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label 
            htmlFor="phone" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={`block w-full px-4 py-2.5 border ${
              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
            placeholder="Teléfono del local"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label 
            htmlFor="description" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description || ''}
            onChange={handleChange}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            placeholder="Descripción del local"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen del Local
          </label>
          
          <div className="space-y-4">
            {/* Vista previa de imagen */}
            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(0)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition-colors"
                >
                  <X size={16} className="text-gray-600" />
                </button>
              </div>
            )}

            {/* Input de archivo */}
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <Upload size={16} className="mr-2" />
                {isUploadingImage ? 'Subiendo...' : 'Seleccionar Imagen'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isUploadingImage}
                />
              </label>
              
              {isUploadingImage && (
                <div className="flex items-center text-sm text-gray-600">
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Subiendo imagen...
                </div>
              )}
            </div>

            {/* Mensaje de error de imagen */}
            {imageError && (
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle size={16} className="mr-2" />
                {imageError}
              </div>
            )}
            
            {/* Mostrar URL de Cloudinary (opcional, solo para depuración) */}
            {formData.images && formData.images.length > 0 && (
              <p className="mt-2 text-xs text-gray-500 truncate">
                URL de Cloudinary: {formData.images[0]}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Check size={16} className="mr-2" />
              Guardar Local
            </>
          )}
        </button>
      </div>
    </form>
  );
}
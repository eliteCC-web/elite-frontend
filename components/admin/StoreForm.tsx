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
    imageUrl: initialData?.imageUrl || '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
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
      setFormData((prev: any) => ({ ...prev, imageUrl: result.secure_url }));
      console.log('Imagen subida a Cloudinary:', result.secure_url);
      
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      setImageError('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev: any) => ({ ...prev, imageUrl: '' }));
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
            placeholder="Ej: 3001234567"
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
            placeholder="Describe brevemente el local"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen
          </label>
          
          {/* Mostrar error de imagen si existe */}
          {imageError && (
            <div className="mb-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              <AlertCircle size={16} />
              <span>{imageError}</span>
            </div>
          )}
          
          {isUploadingImage ? (
            // Estado de carga
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <Loader2 size={40} className="text-red-500 animate-spin mb-3" />
                <p className="text-gray-600">Subiendo imagen a Cloudinary...</p>
              </div>
            </div>
          ) : imagePreview ? (
            // Vista previa de la imagen
            <div className="relative max-w-md">
              <div className="relative rounded-lg overflow-hidden h-48 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition-colors"
              >
                <X size={16} className="text-gray-700" />
              </button>
            </div>
          ) : (
            // Zona para subir imagen
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <label className="cursor-pointer block">
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload size={36} className="text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Haz clic para seleccionar una imagen
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF hasta 5MB
                  </span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageChange}
                  disabled={isUploadingImage}
                />
              </label>
            </div>
          )}
          
          {/* Mostrar URL de Cloudinary (opcional, solo para depuración) */}
          {formData.imageUrl && (
            <p className="mt-2 text-xs text-gray-500 truncate">
              URL de Cloudinary: {formData.imageUrl}
            </p>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          disabled={isSubmitting || isUploadingImage}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center gap-1"
          disabled={isSubmitting || isUploadingImage}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-white"></span>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Check size={16} />
              <span>{initialData ? 'Actualizar' : 'Crear'} Local</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
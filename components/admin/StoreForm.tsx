/* eslint-disable */

'use client';

import React, { useState } from 'react';
import { Store, CreateStoreDto } from '../../services/store.service';
import SupabaseService from '../../services/supabase.service';
import { Building, Clock, Camera, X, Upload, Check, AlertCircle, Loader2 } from 'lucide-react';

interface StoreSchedule {
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

interface StoreFormData {
  name: string;
  description: string;
  address: string;
  phone: string;
  isService: boolean;
  schedule: StoreSchedule[];
  images: File[];
}

interface StoreFormProps {
  initialData?: Store;
  onSubmit: (data: Omit<CreateStoreDto, 'id'> & Partial<{id: number}>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Lunes' },
  { value: 'tuesday', label: 'Martes' },
  { value: 'wednesday', label: 'Miércoles' },
  { value: 'thursday', label: 'Jueves' },
  { value: 'friday', label: 'Viernes' },
  { value: 'saturday', label: 'Sábado' },
  { value: 'sunday', label: 'Domingo' }
];

export default function StoreForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: StoreFormProps) {
  const [formData, setFormData] = useState<StoreFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    address: initialData?.storeNumber || '', // El storeNumber es la address
    phone: initialData?.phone || '',
    isService: initialData?.isService || false,
    schedule: initialData?.schedule || DAYS_OF_WEEK.map(day => ({
      day: day.value,
      openTime: '09:00',
      closeTime: '18:00',
      isOpen: true
    })),
    images: []
  });

  console.log('StoreForm initial state:', formData);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number} | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleScheduleChange = (dayIndex: number, field: keyof StoreSchedule, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((schedule, index) => 
        index === dayIndex ? { ...schedule, [field]: value } : schedule
      )
    }));
  };

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (selectedFiles.length + files.length > 10) {
      setErrors(prev => ({ ...prev, images: 'Máximo 10 imágenes permitidas' }));
      return;
    }

    const newFiles = Array.from(files);
    setSelectedFiles(prev => [...prev, ...newFiles]);

    // Crear URLs de vista previa
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeSelectedImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]); // Liberar memoria
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImagesToSupabase = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        throw new Error('Solo se permiten archivos de imagen');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Cada imagen debe ser menor a 5MB');
      }

      setUploadProgress({ current: i + 1, total: files.length });

      const result = await SupabaseService.uploadImage(file, 'store-images');
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      uploadedUrls.push(result.url);
    }

    return uploadedUrls;
  };

  const validateForm = (): boolean => {
    console.log('Validating form...');
    const newErrors: Record<string, string> = {};

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (selectedFiles.length === 0) {
      newErrors.images = 'Al menos una imagen es requerida';
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Form is valid:', isValid);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('StoreForm handleSubmit called - button clicked!');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed, starting image upload...');
    setUploadingImages(selectedFiles.length > 0);

    try {
      let storeImagesUrls: string[] = [];

      // Subir imágenes solo si hay archivos seleccionados
      if (selectedFiles.length > 0) {
        console.log('Uploading images to Supabase...');
        storeImagesUrls = await uploadImagesToSupabase(selectedFiles);
        console.log('Images uploaded successfully:', storeImagesUrls);
      }

      // Preparar datos para enviar al backend
      const dataToSend: CreateStoreDto = {
        storeNumber: formData.address, // La address es el storeNumber
        name: formData.name,
        phone: formData.phone,
        description: formData.description,
        images: storeImagesUrls,
        schedule: formData.schedule,
        isService: formData.isService
      };

      console.log('Calling onSubmit with data:', dataToSend);
      await onSubmit(dataToSend);
      console.log('onSubmit completed successfully');
    } catch (error) {
      console.error('Error in StoreForm handleSubmit:', error);
      setErrors(prev => ({ ...prev, images: 'Error al subir las imágenes. Inténtalo de nuevo.' }));
    } finally {
      setUploadingImages(false);
      setUploadProgress(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de registro */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Registro
        </label>
        <div className="flex items-center">
          <input
            id="isService"
            name="isService"
            type="checkbox"
            checked={formData.isService}
            onChange={(e) => setFormData(prev => ({ ...prev, isService: e.target.checked }))}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label 
            htmlFor="isService" 
            className="ml-2 block text-sm text-gray-700"
          >
            Es un servicio (banco, corresponsal, etc.)
          </label>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Marca esta opción si es un servicio en lugar de una tienda comercial
        </p>
      </div>

      {/* Información del Local */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <Building size={20} />
          Información del Local
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Local
            </label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className={`block w-full px-3 py-2.5 border ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
              placeholder="Nombre de tu local"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción del Local
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`block w-full px-3 py-2.5 border ${
                errors.description ? 'border-red-500' : 'border-gray-200'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
              placeholder="Describe tu local, productos o servicios..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección del Local
              </label>
              <input
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                className={`block w-full px-3 py-2.5 border ${
                  errors.address ? 'border-red-500' : 'border-gray-200'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                placeholder="Dirección del local"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono del Local
              </label>
              <input
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className={`block w-full px-3 py-2.5 border ${
                  errors.phone ? 'border-red-500' : 'border-gray-200'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                placeholder="3001234567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Horarios de Atención */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Clock size={16} />
              Horarios de Atención
            </label>
            <div className="space-y-3">
              {formData.schedule.map((schedule, index) => (
                <div key={schedule.day} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <input
                      type="checkbox"
                      checked={schedule.isOpen}
                      onChange={(e) => handleScheduleChange(index, 'isOpen', e.target.checked)}
                      className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm font-medium">
                      {DAYS_OF_WEEK.find(day => day.value === schedule.day)?.label}
                    </span>
                  </div>
                  
                  {schedule.isOpen ? (
                    <>
                      <input
                        type="time"
                        value={schedule.openTime}
                        onChange={(e) => handleScheduleChange(index, 'openTime', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <span className="text-gray-500">a</span>
                      <input
                        type="time"
                        value={schedule.closeTime}
                        onChange={(e) => handleScheduleChange(index, 'closeTime', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </>
                  ) : (
                    <span className="text-gray-500 text-sm">Cerrado</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selección de imágenes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotos del Local (máximo 10)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelection}
                disabled={selectedFiles.length >= 10}
                className="hidden"
                id="store-images"
              />
              <label
                htmlFor="store-images"
                className={`cursor-pointer flex flex-col items-center ${
                  selectedFiles.length >= 10 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:text-red-600'
                }`}
              >
                <Upload size={24} className="mb-2" />
                <span className="text-sm">
                  {selectedFiles.length >= 10 
                    ? 'Máximo de imágenes alcanzado'
                    : 'Haz clic para seleccionar imágenes'
                  }
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {selectedFiles.length}/10 imágenes
                </span>
              </label>
            </div>

            {/* Vista previa de imágenes seleccionadas */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Imágenes seleccionadas ({selectedFiles.length}):
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={previewUrls[index]}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar imagen"
                      >
                        <X size={12} />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensaje de error de imagen */}
            {errors.images && (
              <div className="flex items-center text-sm text-red-600 mt-2">
                <AlertCircle size={16} className="mr-2" />
                {errors.images}
              </div>
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
          disabled={isSubmitting || uploadingImages}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || uploadingImages ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              {uploadingImages ? 
                `Subiendo imágenes... ${uploadProgress ? `${uploadProgress.current}/${uploadProgress.total}` : ''}` :
                'Guardando...'
              }
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
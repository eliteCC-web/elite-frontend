/* eslint-disable */
// components/admin/EventForm.tsx
'use client';

import React, { useState } from 'react';
import { Event, CreateEventDto } from '@/services/event.service';
import { X, Upload, Check, AlertCircle, Loader2, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import CloudinaryService from '@/services/cloudinary.service';

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: Omit<CreateEventDto, 'id'> & Partial<{id: number}>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function EventForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: EventFormProps) {
  const [formData, setFormData] = useState<CreateEventDto>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    longDescription: initialData?.longDescription || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : '',
    location: initialData?.location || '',
    price: initialData?.price || 0,
    capacity: initialData?.capacity || 0,
    imageUrl: initialData?.imageUrl || '',
    images: initialData?.images || [],
    categories: initialData?.categories || [],
    organizer: initialData?.organizer || '',
    contactEmail: initialData?.contactEmail || '',
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    slug: initialData?.slug || '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');

  const predefinedCategories = [
    'Familiar', 'Infantil', 'Gastronomía', 'Cultural', 'Moda', 
    'Música', 'Arte', 'Deportes', 'Tecnología', 'Educativo'
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    let finalValue: any = value;
    
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      finalValue = value === '' ? 0 : Number(value);
    }
    
    setFormData((prev: any) => ({ ...prev, [name]: finalValue }));
    
    // Generar slug automáticamente si es el campo name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData((prev: any) => ({ ...prev, slug }));
    }
    
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
    
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
      setImageError('El archivo debe ser una imagen (JPEG, PNG o GIF)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setImageError('La imagen no debe superar los 5MB');
      return;
    }

    try {
      setIsUploadingImage(true);
      setImageError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      const result = await CloudinaryService.uploadImage(file);
      setFormData((prev: any) => ({ ...prev, imageUrl: result.secure_url }));
      
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

  const addCategory = (category: string) => {
    if (formData.categories) {
        if (category && !formData.categories.includes(category)) {
            setFormData((prev: any) => ({
              ...prev,
              categories: [...prev.categories, category]
            }));
          }
          setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setFormData((prev: any) => ({
      ...prev,
      categories: prev.categories.filter((cat: string) => cat !== categoryToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de fin es requerida';
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }
    
    if (!formData.organizer.trim()) {
      newErrors.organizer = 'El organizador es requerido';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'El slug es requerido';
    }
    
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'El email de contacto no es válido';
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
      {/* Información básica */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Información Básica
        </h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Evento *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 border ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
              placeholder="Nombre del evento"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL) *
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 border ${
                errors.slug ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
              placeholder="evento-ejemplo"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
            )}
          </div>

          <div>
            <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-1">
              Organizador *
            </label>
            <input
              id="organizer"
              name="organizer"
              type="text"
              value={formData.organizer}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 border ${
                errors.organizer ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
              placeholder="Nombre del organizador"
            />
            {errors.organizer && (
              <p className="mt-1 text-sm text-red-600">{errors.organizer}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción Corta *
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 border ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent resize-none`}
              placeholder="Descripción breve del evento"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción Detallada
            </label>
            <textarea
              id="longDescription"
              name="longDescription"
              rows={6}
              value={formData.longDescription || ''}
              onChange={handleChange}
              className="block w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Descripción detallada del evento"
            />
          </div>
        </div>
      </div>

      {/* Fecha, hora y ubicación */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <MapPin size={20} />
          Fecha, Hora y Ubicación
        </h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha y Hora de Inicio *
            </label>
            <input
              id="startDate"
              name="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 border ${
                errors.startDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha y Hora de Fin *
            </label>
            <input
              id="endDate"
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 border ${
                errors.endDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación *
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 border ${
                errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
              placeholder="Ej: Plaza Central, Auditorio Principal"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>
        </div>
      </div>

      {/* Precio y capacidad */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign size={20} />
          Precio y Capacidad
        </h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Precio (COP)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1000"
              value={formData.price}
              onChange={handleChange}
              className="block w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
            <p className="mt-1 text-xs text-gray-500">Deja en 0 si el evento es gratuito</p>
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad Máxima
            </label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              min="0"
              value={formData.capacity}
              onChange={handleChange}
              className="block w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
            <p className="mt-1 text-xs text-gray-500">Deja en 0 para capacidad ilimitada</p>
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <Users size={20} />
          Información de Contacto
        </h3>
        
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email de Contacto
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail || ''}
            onChange={handleChange}
            className={`block w-full px-4 py-2.5 border ${
              errors.contactEmail ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
            placeholder="contacto@evento.com"
          />
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
          )}
        </div>
      </div>

      {/* Categorías */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Categorías
        </h3>
        
        {/* Categorías predefinidas */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar categorías
          </label>
          <div className="flex flex-wrap gap-2">
            {predefinedCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => addCategory(category)}
                disabled={formData.categories?.includes(category)}
                className={`px-3 py-1 text-sm rounded-full border ${
                  formData.categories?.includes(category)
                    ? 'bg-blue-100 text-blue-700 border-blue-300 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } transition-colors`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Categoría personalizada */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agregar categoría personalizada
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nueva categoría"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCategory(newCategory);
                }
              }}
            />
            <button
              type="button"
              onClick={() => addCategory(newCategory)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Categorías seleccionadas */}
        {formData.categories? formData.categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categorías seleccionadas
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.categories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  <span>{category}</span>
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ):<></>}
      </div>

      {/* Imagen */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Imagen Principal
        </h3>
        
        {imageError && (
          <div className="mb-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            <AlertCircle size={16} />
            <span>{imageError}</span>
          </div>
        )}
        
        {isUploadingImage ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <Loader2 size={40} className="text-blue-500 animate-spin mb-3" />
              <p className="text-gray-600">Subiendo imagen...</p>
            </div>
          </div>
        ) : imagePreview ? (
          <div className="relative max-w-md">
            <div className="relative rounded-lg overflow-hidden h-48 w-full">
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
      </div>

      {/* Estado del evento */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Estado del Evento
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Evento activo
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="isFeatured"
              name="isFeatured"
              type="checkbox"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
              Evento destacado
            </label>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting || isUploadingImage}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-1"
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
              <span>{initialData ? 'Actualizar' : 'Crear'} Evento</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
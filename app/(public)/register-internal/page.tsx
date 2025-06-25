/* eslint-disable */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { User, Lock, AlertCircle, Mail, Phone, UserIcon, Building, Camera, X, Upload, Briefcase, Clock } from 'lucide-react';
import AuthService from '@/services/auth.service';
import SupabaseService from '@/services/supabase.service';
import assets from '@/public/assets';

interface StoreSchedule {
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

interface RegisterInternalData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  roleType: 'COLABORADOR' | 'CLIENTE_INTERNO';
  // Datos del local (solo para CLIENTE_INTERNO)
  storeName?: string;
  storeDescription?: string;
  storeAddress?: string;
  storePhone?: string;
  storeSchedule?: StoreSchedule[];
  storeImages?: File[]; // Cambiado a File[] para subir solo al enviar
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

export default function RegisterInternalPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterInternalData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    roleType: 'COLABORADOR',
    storeName: '',
    storeDescription: '',
    storeAddress: '',
    storePhone: '',
    storeSchedule: DAYS_OF_WEEK.map(day => ({
      day: day.value,
      openTime: '09:00',
      closeTime: '18:00',
      isOpen: true
    })),
    storeImages: []
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number} | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleScheduleChange = (dayIndex: number, field: keyof StoreSchedule, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      storeSchedule: prev.storeSchedule?.map((schedule, index) => 
        index === dayIndex ? { ...schedule, [field]: value } : schedule
      )
    }));
  };

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (selectedFiles.length + files.length > 10) {
      setError('Máximo 10 imágenes permitidas');
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
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos';
    }

    if (formData.roleType === 'CLIENTE_INTERNO') {
      if (!formData.storeName?.trim()) {
        newErrors.storeName = 'El nombre del local es requerido';
      }
      if (!formData.storeDescription?.trim()) {
        newErrors.storeDescription = 'La descripción del local es requerida';
      }
      if (!formData.storeAddress?.trim()) {
        newErrors.storeAddress = 'La dirección del local es requerida';
      }
      if (!formData.storePhone?.trim()) {
        newErrors.storePhone = 'El teléfono del local es requerido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setUploadingImages(selectedFiles.length > 0);

    try {
      let storeImagesUrls: string[] = [];

      // Subir imágenes solo si hay archivos seleccionados
      if (selectedFiles.length > 0) {
        storeImagesUrls = await uploadImagesToSupabase(selectedFiles);
      }

      // Preparar datos para enviar al backend
      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        roleType: formData.roleType,
        // Datos del local (solo para CLIENTE_INTERNO)
        store: formData.roleType === 'CLIENTE_INTERNO' && formData.storeName && formData.storeDescription && formData.storeAddress && formData.storePhone ? {
          name: formData.storeName,
          description: formData.storeDescription,
          address: formData.storeAddress,
          phone: formData.storePhone,
          schedule: formData.storeSchedule || [],
          images: storeImagesUrls
        } : undefined
      };

      const response = await AuthService.registerInternal(dataToSend);
      setSuccess('Solicitud de registro enviada exitosamente. Revisa tu correo electrónico para verificar tu cuenta. Serás notificado cuando un administrador apruebe tu solicitud.');
      
      setTimeout(() => {
        router.push('/login');
      }, 5000);
    } catch (err: any) {
      console.error('Register internal error:', err);
      setError(
        err.response?.data?.message || 
        'Ocurrió un error al enviar tu solicitud. Por favor, inténtelo de nuevo.'
      );
    } finally {
      setLoading(false);
      setUploadingImages(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* Logo y título */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Image
                  src={assets.logo_png}
                  alt="Centro Comercial Elite"
                  width={80}
                  height={80}
                  className="mx-auto"
                />
              </div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Registro Interno
              </h1>
              <p className="text-gray-500 mt-2">
                Solicitud de registro para colaboradores y clientes internos
              </p>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Nota:</strong> Tu solicitud será revisada por un administrador. 
                  Recibirás una notificación cuando sea aprobada.
                </p>
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Mensaje de éxito */}
            {success && (
              <div className="mb-6 bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle size={18} />
                <span>{success}</span>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Tipo de registro */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Registro
                  </label>
                  <select
                    name="roleType"
                    value={formData.roleType}
                    onChange={handleChange}
                    className="block w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  >
                    <option value="COLABORADOR">Colaborador</option>
                    <option value="CLIENTE_INTERNO">Cliente Interno (Local)</option>
                  </select>
                </div>

                {/* Información Personal */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <User size={20} />
                    Información Personal
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <UserIcon size={18} />
                        </div>
                        <input
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-2.5 border ${
                            errors.firstName ? 'border-red-500' : 'border-gray-200'
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent`}
                          placeholder="Tu nombre"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <UserIcon size={18} />
                        </div>
                        <input
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-2.5 border ${
                            errors.lastName ? 'border-red-500' : 'border-gray-200'
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent`}
                          placeholder="Tu apellido"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo electrónico
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Mail size={18} />
                        </div>
                        <input
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-2.5 border ${
                            errors.email ? 'border-red-500' : 'border-gray-200'
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent`}
                          placeholder="tu@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Phone size={18} />
                        </div>
                        <input
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-2.5 border ${
                            errors.phone ? 'border-red-500' : 'border-gray-200'
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent`}
                          placeholder="3001234567"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Lock size={18} />
                        </div>
                        <input
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-2.5 border ${
                            errors.password ? 'border-red-500' : 'border-gray-200'
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar contraseña
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Lock size={18} />
                        </div>
                        <input
                          name="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`block w-full pl-10 pr-3 py-2.5 border ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información del Local (solo para CLIENTE_INTERNO) */}
                {formData.roleType === 'CLIENTE_INTERNO' && (
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
                          name="storeName"
                          type="text"
                          required
                          value={formData.storeName}
                          onChange={handleChange}
                          className={`block w-full px-3 py-2.5 border ${
                            errors.storeName ? 'border-red-500' : 'border-gray-200'
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent`}
                          placeholder="Nombre de tu local"
                        />
                        {errors.storeName && (
                          <p className="mt-1 text-sm text-red-600">{errors.storeName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descripción del Local
                        </label>
                        <textarea
                          name="storeDescription"
                          required
                          value={formData.storeDescription}
                          onChange={handleChange}
                          rows={3}
                          className={`block w-full px-3 py-2.5 border ${
                            errors.storeDescription ? 'border-red-500' : 'border-gray-200'
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent`}
                          placeholder="Describe tu local, productos o servicios..."
                        />
                        {errors.storeDescription && (
                          <p className="mt-1 text-sm text-red-600">{errors.storeDescription}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección del Local
                          </label>
                          <input
                            name="storeAddress"
                            type="text"
                            required
                            value={formData.storeAddress}
                            onChange={handleChange}
                            className={`block w-full px-3 py-2.5 border ${
                              errors.storeAddress ? 'border-red-500' : 'border-gray-200'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent`}
                            placeholder="Dirección del local"
                          />
                          {errors.storeAddress && (
                            <p className="mt-1 text-sm text-red-600">{errors.storeAddress}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono del Local
                          </label>
                          <input
                            name="storePhone"
                            type="tel"
                            required
                            value={formData.storePhone}
                            onChange={handleChange}
                            className={`block w-full px-3 py-2.5 border ${
                              errors.storePhone ? 'border-red-500' : 'border-gray-200'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent`}
                            placeholder="3001234567"
                          />
                          {errors.storePhone && (
                            <p className="mt-1 text-sm text-red-600">{errors.storePhone}</p>
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
                          {formData.storeSchedule?.map((schedule, index) => (
                            <div key={schedule.day} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                              <div className="flex items-center gap-2 min-w-[120px]">
                                <input
                                  type="checkbox"
                                  checked={schedule.isOpen}
                                  onChange={(e) => handleScheduleChange(index, 'isOpen', e.target.checked)}
                                  className="rounded border-gray-300 text-secondary-500 focus:ring-secondary-500"
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
                                : 'hover:text-secondary-600'
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
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors
                      ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      uploadingImages ? 
                        `Subiendo imágenes... ${uploadProgress ? `${uploadProgress.current}/${uploadProgress.total}` : ''}` :
                        'Enviando solicitud...'
                    ) : (
                      'Enviar solicitud de registro'
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Pie del formulario */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    ¿Ya tienes cuenta?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link 
                  href="/login"
                  className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
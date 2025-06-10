
// components/admin/UserForm.tsx - CORREGIDO
'use client';

import React, { useState, useEffect } from 'react';
import { User, CreateUserDto, UpdateUserDto } from '@/services/user.service';
import RoleService, { Role } from '@/services/role.service';
import { Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: any) => Promise<void>; // Cambiado a 'any' para mayor flexibilidad
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function UserForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: UserFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    password: '',
    phone: initialData?.phone || '',
    roleIds: initialData?.roles?.map(role => role.id) || [],
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const rolesData = await RoleService.getAllRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar error al editar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRoleChange = (roleId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      roleIds: checked
        ? [...prev.roleIds, roleId]
        : prev.roleIds.filter((id: number) => id !== roleId)
    }));
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
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!initialData && !formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'El teléfono debe tener entre 7 y 15 dígitos';
    }

    if (!formData.roleIds || formData.roleIds.length === 0) {
      newErrors.roleIds = 'Debe seleccionar al menos un rol';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Preparar datos según si es creación o edición
    const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        roleIds: formData.roleIds,
        ...(formData.password ? { password: formData.password } : {}), // Solo agrega password si existe
      };      
    
    await onSubmit(submitData);
  };

  const getRoleColor = (roleName: string) => {
    const colors = {
      'ADMIN': 'border-red-200 bg-red-50',
      'COLABORADOR': 'border-blue-200 bg-blue-50',
      'CLIENTE_INTERNO': 'border-green-200 bg-green-50',
      'CLIENTE_EXTERNO': 'border-yellow-200 bg-yellow-50',
      'USER': 'border-gray-200 bg-gray-50'
    };
    return colors[roleName as keyof typeof colors] || 'border-gray-200 bg-gray-50';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información personal */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Información Personal
        </h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 border ${
                errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
              placeholder="Nombre del usuario"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 border ${
                errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
              placeholder="Apellido del usuario"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 border ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
              placeholder="usuario@ejemplo.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={`block w-full px-4 py-2.5 border ${
                errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
              placeholder="3001234567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contraseña */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {initialData ? 'Cambiar Contraseña (Opcional)' : 'Contraseña *'}
        </h3>
        
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            className={`block w-full px-4 py-2.5 pr-10 border ${
              errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent`}
            placeholder={initialData ? 'Dejar vacío para mantener la actual' : 'Mínimo 6 caracteres'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Roles */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Roles y Permisos *
        </h3>
        
        {loadingRoles ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Cargando roles...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {roles.map((role) => (
              <label
                key={role.id}
                className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.roleIds?.includes(role.id)
                    ? getRoleColor(role.name)
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.roleIds?.includes(role.id) || false}
                  onChange={(e) => handleRoleChange(role.id, e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{role.name}</span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      {role.name === 'ADMIN' ? 'Administrador' :
                       role.name === 'COLABORADOR' ? 'Colaborador' :
                       role.name === 'CLIENTE_INTERNO' ? 'Cliente Interno' :
                       role.name === 'CLIENTE_EXTERNO' ? 'Cliente Externo' :
                       'Usuario'}
                    </span>
                  </div>
                  {role.description && (
                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                  )}
                  
                  {/* Permisos del rol */}
                  {role.permissions && role.permissions.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Permisos incluidos:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <span key={permission.id} className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                            {permission.name}
                          </span>
                        ))}
                        {role.permissions.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{role.permissions.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}
        
        {errors.roleIds && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={16} />
            {errors.roleIds}
          </p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-1"
          disabled={isSubmitting || loadingRoles}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-white"></span>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Check size={16} />
              <span>{initialData ? 'Actualizar' : 'Crear'} Usuario</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
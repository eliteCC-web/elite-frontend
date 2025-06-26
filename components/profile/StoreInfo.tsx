/* eslint-disable */
// components/profile/StoreInfo.tsx
'use client';

import React from 'react';
import { Store } from '@/services/profile.service';
import { MapPin, Phone, DollarSign, Tag, Building, Calendar, CheckCircle, XCircle, Edit } from 'lucide-react';

interface StoreInfoProps {
  store: Store;
  onEdit?: () => void;
}

export default function StoreInfo({ store, onEdit }: StoreInfoProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Información básica del local */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Imagen del local */}
        <div className="space-y-4">
          {store.images && store.images.length > 0 ? (
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img 
                src={store.images[0]} 
                alt={store.name}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                store.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {store.isActive ? 'Activo' : 'Inactivo'}
              </div>
              {store.images.length > 1 && (
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                  +{store.images.length - 1} más
                </div>
              )}
            </div>
          ) : (
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building size={48} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Detalles del local */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{store.name}</h3>
              <p className="text-gray-600">{store.description || 'Sin descripción disponible'}</p>
            </div>
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <Edit size={16} />
                Editar
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Building size={16} />
              <span className="font-medium">Local #{store.storeNumber}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={16} />
              <span>{store.phone}</span>
            </div>
            
            {store.category && (
              <div className="flex items-center gap-2 text-gray-600">
                <Tag size={16} />
                <span>{store.category}</span>
              </div>
            )}
            
            {store.floor && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <span>Piso {store.floor}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-600">
              {store.isActive ? (
                <CheckCircle size={16} className="text-green-500" />
              ) : (
                <XCircle size={16} className="text-red-500" />
              )}
              <span className={store.isActive ? 'text-green-600' : 'text-red-600'}>
                {store.isActive ? 'Local Activo' : 'Local Inactivo'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Información financiera */}
      {store.monthlyRent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
            <DollarSign size={16} />
            Información de Renta
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-green-600">Renta Mensual</p>
              <p className="text-xl font-bold text-green-800">
                {formatCurrency(store.monthlyRent)}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-600">Próximo Pago</p>
              <p className="text-green-800 font-medium">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-600">Estado de Pago</p>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                <CheckCircle size={14} />
                Al día
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Acciones rápidas 
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-800 mb-3">Acciones Rápidas</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex flex-col items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Building size={20} className="text-blue-600" />
            <span className="text-sm text-blue-800">Editar Local</span>
          </button>
          
          <button className="flex flex-col items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <DollarSign size={20} className="text-green-600" />
            <span className="text-sm text-green-800">Ver Pagos</span>
          </button>
          
          <button className="flex flex-col items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Calendar size={20} className="text-purple-600" />
            <span className="text-sm text-purple-800">Reportes</span>
          </button>
          
          <button className="flex flex-col items-center gap-2 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <Phone size={20} className="text-orange-600" />
            <span className="text-sm text-orange-800">Contacto</span>
          </button>
        </div>
      </div>*/}
    </div>
  );
}

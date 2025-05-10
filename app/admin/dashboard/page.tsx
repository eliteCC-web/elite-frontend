/* eslint-disable */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Store, Users, ShoppingBag, CalendarDays, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();

  // En una aplicación real, estos valores vendrían de una API
  const stats = [
    {
      id: 1,
      name: 'Locales',
      value: '32',
      icon: <Store size={24} />,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      link: '/admin/stores',
    },
    {
      id: 2,
      name: 'Usuarios',
      value: '120',
      icon: <Users size={24} />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      link: '/admin/users',
    },
    {
      id: 3,
      name: 'Categorías',
      value: '8',
      icon: <ShoppingBag size={24} />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      link: '#',
    },
    {
      id: 4,
      name: 'Eventos',
      value: '15',
      icon: <CalendarDays size={24} />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      link: '/admin/events',
    },
  ];

  // Lista de actividades recientes (simuladas)
  const recentActivity = [
    {
      id: 1,
      action: 'Se creó el local',
      entity: 'Nike Store',
      user: 'Admin',
      time: 'Hace 1 hora',
    },
    {
      id: 2,
      action: 'Se actualizó el local',
      entity: 'Starbucks',
      user: 'Admin',
      time: 'Hace 3 horas',
    },
    {
      id: 3,
      action: 'Se eliminó el local',
      entity: 'Old Shop',
      user: 'Admin',
      time: 'Hace 1 día',
    },
    {
      id: 4,
      action: 'Se creó el evento',
      entity: 'Fiesta de Verano',
      user: 'Admin',
      time: 'Hace 2 días',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al panel de administración</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.iconBg} ${stat.iconColor}`}>
                {stat.icon}
              </div>
            </div>
            <Link
              href={stat.link}
              className="mt-4 flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              Ver detalles
              <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>

      {/* Contenido principal en dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad reciente */}
        <div className="lg:col-span-2">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Actividad reciente</h2>
              <button className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                Ver todo
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="mr-4 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium">
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">{activity.user}</span>{' '}
                      {activity.action}{' '}
                      <span className="font-medium">{activity.entity}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones rápidas</h2>
            <div className="space-y-3">
              <Link
                href="/admin/stores/new"
                className="block w-full py-2.5 px-4 bg-red-50 text-red-700 hover:bg-red-100 rounded-md transition-colors flex items-center gap-2"
              >
                <Store size={18} />
                <span>Crear nuevo local</span>
              </Link>
              <Link
                href="/admin/events/new"
                className="block w-full py-2.5 px-4 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-md transition-colors flex items-center gap-2"
              >
                <CalendarDays size={18} />
                <span>Crear nuevo evento</span>
              </Link>
              <Link
                href="/admin/users/new"
                className="block w-full py-2.5 px-4 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors flex items-center gap-2"
              >
                <Users size={18} />
                <span>Crear nuevo usuario</span>
              </Link>
            </div>
          </div>
          
          {/* Apartado para ayuda */}
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Ayuda y soporte</h2>
            <p className="text-sm text-gray-600 mb-4">
              ¿Necesitas ayuda con la administración del centro comercial?
            </p>
            <button className="block w-full py-2.5 px-4 bg-gray-800 text-white hover:bg-gray-900 rounded-md transition-colors">
              Ver documentación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
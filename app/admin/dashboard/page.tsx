/* eslint-disable */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Store, Users, ShoppingBag, CalendarDays, ArrowRight, Clock, TrendingUp, Activity } from 'lucide-react';
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
      change: '+2',
      changeType: 'positive'
    },
    {
      id: 2,
      name: 'Usuarios',
      value: '120',
      icon: <Users size={24} />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      link: '/admin/users',
      change: '+8',
      changeType: 'positive'
    },
    {
      id: 3,
      name: 'Eventos',
      value: '15',
      icon: <CalendarDays size={24} />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      link: '/admin/events',
      change: '+3',
      changeType: 'positive'
    },
    {
      id: 4,
      name: 'Turnos Activos',
      value: '45',
      icon: <Clock size={24} />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      link: '/admin/schedules',
      change: '+5',
      changeType: 'positive'
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
      type: 'store'
    },
    {
      id: 2,
      action: 'Se asignaron turnos',
      entity: 'Semana del 15-21 Dic',
      user: 'Admin',
      time: 'Hace 3 horas',
      type: 'schedule'
    },
    {
      id: 3,
      action: 'Se actualizó el local',
      entity: 'Starbucks',
      user: 'Admin',
      time: 'Hace 5 horas',
      type: 'store'
    },
    {
      id: 4,
      action: 'Se creó el evento',
      entity: 'Fiesta de Verano',
      user: 'Admin',
      time: 'Hace 1 día',
      type: 'event'
    },
    {
      id: 5,
      action: 'Se registró nuevo usuario',
      entity: 'María González',
      user: 'Sistema',
      time: 'Hace 2 días',
      type: 'user'
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'store':
        return <Store className="h-4 w-4 text-red-600" />;
      case 'schedule':
        return <Clock className="h-4 w-4 text-green-600" />;
      case 'event':
        return <CalendarDays className="h-4 w-4 text-purple-600" />;
      case 'user':
        return <Users className="h-4 w-4 text-blue-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Bienvenido al panel de administración de Elite</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.iconBg} ${stat.iconColor}`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <Link
                href={stat.link}
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
              >
                Ver detalles
                <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* Contenido principal en dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Actividad reciente */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
                <button className="text-sm text-gray-600 hover:text-red-600 transition-colors font-medium">
                  Ver todo
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="mr-4 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
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

          {/* Enlaces rápidos y ayuda */}
          <div className="space-y-6">
            {/* Acciones rápidas */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
              <div className="space-y-3">
                <Link
                  href="/admin/stores/new"
                  className="block w-full py-3 px-4 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-3 group"
                >
                  <Store size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Crear nuevo local</span>
                </Link>
                <Link
                  href="/admin/events/new"
                  className="block w-full py-3 px-4 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-3 group"
                >
                  <CalendarDays size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Crear nuevo evento</span>
                </Link>
                <Link
                  href="/admin/schedules"
                  className="block w-full py-3 px-4 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-3 group"
                >
                  <Clock size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Gestionar turnos</span>
                </Link>
                <Link
                  href="/admin/users/new"
                  className="block w-full py-3 px-4 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-3 group"
                >
                  <Users size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Crear nuevo usuario</span>
                </Link>
              </div>
            </div>
            
            {/* Estado del sistema */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado del Sistema</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Servidor</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Base de datos</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Conectado
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Última actualización</span>
                  <span className="text-sm text-gray-900">Hace 5 min</span>
                </div>
              </div>
            </div>

            {/* Ayuda y soporte */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">¿Necesitas ayuda?</h2>
              <p className="text-sm text-gray-600 mb-4">
                Nuestro equipo de soporte está disponible para ayudarte con cualquier consulta.
              </p>
              <button className="block w-full py-2.5 px-4 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium">
                Contactar soporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/* eslint-disable */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Users, ShoppingBag, CalendarDays, ArrowRight, Clock, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';
import StoreService from '@/services/store.service';
import UserService from '@/services/user.service';
import EventService from '@/services/event.service';
import { ScheduleService } from '@/services/schedule.service';

interface DashboardStats {
  stores: { total: number; change: string };
  users: { total: number; change: string };
  events: { total: number; change: string };
  schedules: { total: number; change: string };
}

interface RecentActivity {
  id: number;
  type: 'store' | 'user' | 'event' | 'schedule';
  action: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  iconColor: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    stores: { total: 0, change: '+0' },
    users: { total: 0, change: '+0' },
    events: { total: 0, change: '+0' },
    schedules: { total: 0, change: '+0' }
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  const generateRecentActivity = (stores: any[], users: any[], events: any[]) => {
    const activities: RecentActivity[] = [];
    
    // Actividad de tiendas
    if (stores.length > 0) {
      const latestStore = stores[0];
      activities.push({
        id: 1,
        type: 'store',
        action: 'creado',
        description: `Se creó el local ${latestStore.name}`,
        time: 'Hace 1 hora',
        icon: <Store size={16} />,
        iconColor: 'text-red-600'
      });
    }
    
    // Actividad de usuarios
    if (users.length > 0) {
      const latestUser = users[0];
      activities.push({
        id: 2,
        type: 'user',
        action: 'registrado',
        description: `Se registró nuevo usuario ${latestUser.name || latestUser.email}`,
        time: 'Hace 2 horas',
        icon: <Users size={16} />,
        iconColor: 'text-blue-600'
      });
    }
    
    // Actividad de eventos
    if (events.length > 0) {
      const latestEvent = events[0];
      activities.push({
        id: 3,
        type: 'event',
        action: 'creado',
        description: `Se creó el evento ${latestEvent.title}`,
        time: 'Hace 1 día',
        icon: <CalendarDays size={16} />,
        iconColor: 'text-purple-600'
      });
    }
    
    setRecentActivity(activities);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Iniciando fetch de datos del dashboard...');
      
      // Verificar si el backend está disponible
      console.log('🔍 Verificando conectividad con el backend...');
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:3001/api';
      try {
        await fetch(`${backendUrl}/stores?page=1&limit=1`);
        console.log('✅ Backend está disponible');
      } catch (backendError) {
        console.error('❌ Backend no está disponible:', backendError);
        setError(`El backend no está disponible. Verifica que esté ejecutándose en ${backendUrl}`);
        return;
      }
      
      // Obtener datos de tiendas
      console.log('📊 Obteniendo datos de tiendas...');
      const storesResponse = await StoreService.getAllStores(1, 1);
      console.log('✅ Datos de tiendas obtenidos:', storesResponse);
      const storesTotal = storesResponse.meta.total;
      
      // Obtener datos de usuarios
      console.log('👥 Obteniendo datos de usuarios...');
      const users = await UserService.getAllUsers();
      console.log('✅ Datos de usuarios obtenidos:', users);
      const usersTotal = users.length;
      
      // Obtener datos de eventos
      console.log('📅 Obteniendo datos de eventos...');
      const eventsResponse = await EventService.getAllEvents(1, 1);
      console.log('✅ Datos de eventos obtenidos:', eventsResponse);
      const eventsTotal = eventsResponse.meta.total;
      
      // Obtener datos de horarios (colaboradores)
      console.log('⏰ Obteniendo datos de colaboradores...');
      const colaboradores = await ScheduleService.getColaboradores();
      console.log('✅ Datos de colaboradores obtenidos:', colaboradores);
      const schedulesTotal = colaboradores.length;
      
      console.log('📈 Resumen de datos obtenidos:', {
        stores: storesTotal,
        users: usersTotal,
        events: eventsTotal,
        schedules: schedulesTotal
      });
      
      // Calcular cambios (simulado por ahora)
      const storesChange = storesTotal > 0 ? `+${Math.floor(Math.random() * 5) + 1}` : '+0';
      const usersChange = usersTotal > 0 ? `+${Math.floor(Math.random() * 3) + 1}` : '+0';
      const eventsChange = eventsTotal > 0 ? `+${Math.floor(Math.random() * 2) + 1}` : '+0';
      const schedulesChange = schedulesTotal > 0 ? `+${Math.floor(Math.random() * 3) + 1}` : '+0';
      
      setStats({
        stores: { total: storesTotal, change: storesChange },
        users: { total: usersTotal, change: usersChange },
        events: { total: eventsTotal, change: eventsChange },
        schedules: { total: schedulesTotal, change: schedulesChange }
      });

      // Generar actividad reciente basada en datos reales
      generateRecentActivity(storesResponse.data, users, eventsResponse.data);
      
    } catch (error: any) {
      console.error('❌ Error fetching dashboard data:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      
      setError(`Error al cargar los datos: ${error.message}`);
      
      // En caso de error, usar datos por defecto
      setStats({
        stores: { total: 0, change: '+0' },
        users: { total: 0, change: '+0' },
        events: { total: 0, change: '+0' },
        schedules: { total: 0, change: '+0' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // En una aplicación real, estos valores vendrían de una API
  const statsData = [
    {
      id: 1,
      name: 'Locales',
      value: stats.stores.total.toString(),
      icon: <Store size={24} />,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      link: '/admin/stores',
      change: stats.stores.change,
      changeType: stats.stores.change.startsWith('+') ? 'positive' : 'negative'
    },
    {
      id: 2,
      name: 'Usuarios',
      value: stats.users.total.toString(),
      icon: <Users size={24} />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      link: '/admin/users',
      change: stats.users.change,
      changeType: stats.users.change.startsWith('+') ? 'positive' : 'negative'
    },
    {
      id: 3,
      name: 'Eventos',
      value: stats.events.total.toString(),
      icon: <CalendarDays size={24} />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      link: '/admin/events',
      change: stats.events.change,
      changeType: stats.events.change.startsWith('+') ? 'positive' : 'negative'
    },
    {
      id: 4,
      name: 'Turnos Activos',
      value: stats.schedules.total.toString(),
      icon: <Clock size={24} />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      link: '/admin/schedules',
      change: stats.schedules.change,
      changeType: stats.schedules.change.startsWith('+') ? 'positive' : 'negative'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Bienvenido al panel de administración de Elite</p>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="text-center py-12">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos del dashboard...</p>
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error al cargar datos</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchDashboardData}
                    className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat) => (
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
        )}

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
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                    >
                      <div className={`mr-4 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center ${activity.iconColor}`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No hay actividad reciente</p>
                  </div>
                )}
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
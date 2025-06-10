// app/perfil/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Calendar, Clock, MapPin, Store as StoreIcon, Camera, Edit } from 'lucide-react';
import ProfileService, { UserProfile, ThreeWeeksSchedule } from '@/services/profile.service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ScheduleCalendar from '@/components/profile/ScheduleCalendar';
import StoreInfo from '@/components/profile/StoreInfo';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function ProfilePage() {
  const { user, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [schedule, setSchedule] = useState<ThreeWeeksSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchProfile();
      
      // Solo cargar horarios si es colaborador
      if (hasRole('COLABORADOR')) {
        fetchSchedule();
      }
    }
  }, [user, isAuthenticated, hasRole]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const profileData = await ProfileService.getUserProfile(user.id);
      setProfile(profileData);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedule = async () => {
    if (!user) return;
    
    try {
      const scheduleData = await ProfileService.getThreeWeeksSchedule(user.id);
      setSchedule(scheduleData);
    } catch (err: any) {
      console.error('Error fetching schedule:', err);
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    const colors = {
      'ADMIN': 'bg-red-100 text-red-800',
      'COLABORADOR': 'bg-blue-100 text-blue-800',
      'CLIENTE_INTERNO': 'bg-green-100 text-green-800',
      'CLIENTE_EXTERNO': 'bg-yellow-100 text-yellow-800',
      'USER': 'bg-gray-100 text-gray-800'
    };
    return colors[roleName as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleDisplayName = (roleName: string) => {
    const names = {
      'ADMIN': 'Administrador',
      'COLABORADOR': 'Colaborador',
      'CLIENTE_INTERNO': 'Cliente Interno',
      'CLIENTE_EXTERNO': 'Cliente Externo',
      'USER': 'Usuario'
    };
    return names[roleName as keyof typeof names] || roleName;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Cargando perfil..." />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar perfil</h2>
            <p className="text-gray-600">{error || 'No se pudo cargar la información del perfil'}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header del perfil */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              
              {/* Foto de perfil */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt="Perfil" 
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                  <Camera size={16} className="text-gray-600" />
                </button>
              </div>

              {/* Información básica */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">
                      {profile.firstName} {profile.lastName}
                    </h1>
                    <p className="text-gray-600 mb-2">Miembro desde {new Date(profile.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
                  </div>
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <Edit size={16} />
                    Editar Perfil
                  </button>
                </div>

                {/* Roles */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.roles.map((role) => (
                    <span
                      key={role.id}
                      className={`text-sm px-3 py-1 rounded-full font-medium ${getRoleBadgeColor(role.name)}`}
                    >
                      {getRoleDisplayName(role.name)}
                    </span>
                  ))}
                </div>

                {/* Información de contacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <span>{profile.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido específico por rol */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Información Personal - Todos los roles */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={20} />
                  Información Personal
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                    <p className="text-gray-800">{profile.firstName} {profile.lastName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Correo Electrónico</label>
                    <p className="text-gray-800">{profile.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Teléfono</label>
                    <p className="text-gray-800">{profile.phone}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rol en el Sistema</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.roles.map((role) => (
                        <span
                          key={role.id}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleBadgeColor(role.name)}`}
                        >
                          {getRoleDisplayName(role.name)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido específico por rol */}
            <div className="lg:col-span-2">
              
              {/* COLABORADOR - Horarios */}
              {hasRole('COLABORADOR') && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    Mis Turnos de Trabajo
                  </h2>
                  {schedule ? (
                    <ScheduleCalendar schedule={schedule} />
                  ) : (
                    <div className="text-center py-8">
                      <Calendar size={48} className="text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No hay horarios asignados</p>
                    </div>
                  )}
                </div>
              )}

              {/* CLIENTE_INTERNO - Información del Local */}
              {hasRole('CLIENTE_INTERNO') && profile.ownedStore && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <StoreIcon size={20} />
                    Mi Local
                  </h2>
                  <StoreInfo store={profile.ownedStore} />
                </div>
              )}

              {/* Información adicional para todos */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Actividad Reciente
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar size={16} className="text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Última conexión</p>
                      <p className="text-xs text-gray-500">Hace 2 horas</p>
                    </div>
                  </div>
                  
                  {hasRole('COLABORADOR') && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock size={16} className="text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Último turno completado</p>
                        <p className="text-xs text-gray-500">Ayer, 08:00 - 17:00</p>
                      </div>
                    </div>
                  )}
                  
                  {hasRole('CLIENTE_INTERNO') && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <StoreIcon size={16} className="text-purple-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Estado del local</p>
                        <p className="text-xs text-gray-500">Activo y operativo</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
/* eslint-disable */
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Check, X, Eye, Clock, User, Search, Filter, History } from 'lucide-react';
import AdminLayout from '@/components/admin/admin-layout';

interface PendingRegistration {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  createdAt: string;
  roleType: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  storeInfo?: any;
}

interface RegistrationHistory extends PendingRegistration {
  updatedAt: string;
  status: 'ACTIVE' | 'REJECTED';
}

export default function PendingRegistrationsPage() {
  const { user, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([]);
  const [registrationHistory, setRegistrationHistory] = useState<RegistrationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!hasRole('ADMIN')) {
      router.push('/unauthorized');
      return;
    }

    fetchPendingRegistrations();
    fetchRegistrationHistory();
  }, [isAuthenticated, hasRole]);

  const fetchPendingRegistrations = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/pending-registrations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar registros pendientes');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar registros pendientes');
      }
      
      setPendingRegistrations(result.data);
    } catch (err: any) {
      console.error('Error fetching pending registrations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrationHistory = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/registration-history`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar historial');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar historial');
      }
      
      setRegistrationHistory(result.data);
    } catch (err: any) {
      console.error('Error fetching registration history:', err);
    }
  };

  const handleApprove = async (registrationId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/approve-registration/${registrationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al aprobar el registro');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al aprobar el registro');
      }

      setError(null);
      setPendingRegistrations(prev => prev.filter(reg => reg.id !== registrationId));
      fetchRegistrationHistory();

    } catch (err: any) {
      console.error('Error approving registration:', err);
      setError(err.message);
    }
  };

  const handleReject = async (registrationId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/reject-registration/${registrationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'Rechazado por administrador' })
      });

      if (!response.ok) {
        throw new Error('Error al rechazar el registro');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al rechazar el registro');
      }

      setError(null);
      setPendingRegistrations(prev => prev.filter(reg => reg.id !== registrationId));
      fetchRegistrationHistory();

    } catch (err: any) {
      console.error('Error rejecting registration:', err);
      setError(err.message);
    }
  };

  const getRoleBadge = (roleType: string) => {
    const badges = {
      'COLABORADOR': 'bg-blue-100 text-blue-800',
      'CLIENTE_INTERNO': 'bg-purple-100 text-purple-800'
    };
    return badges[roleType as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getRoleText = (roleType: string) => {
    const texts = {
      'COLABORADOR': 'Colaborador',
      'CLIENTE_INTERNO': 'Cliente Interno'
    };
    return texts[roleType as keyof typeof texts] || roleType;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'PENDING': 'bg-yellow-100 text-yellow-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      'ACTIVE': 'Aprobado',
      'REJECTED': 'Rechazado',
      'PENDING': 'Pendiente'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const filteredPendingRegistrations = pendingRegistrations.filter(
    (registration) =>
      registration.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = registrationHistory.filter(
    (registration) =>
      (registration.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       registration.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       registration.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === '' || registration.status === statusFilter)
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Cargando registros...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Registros</h1>
            <p className="text-gray-600">Gestión de solicitudes de registro</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1 mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Clock size={18} />
              <span>Pendientes ({pendingRegistrations.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <History size={18} />
              <span>Historial ({registrationHistory.length})</span>
            </button>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
            {activeTab === 'history' && (
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white px-4 py-2 pr-8 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="">Todos los estados</option>
                  <option value="ACTIVE">Aprobados</option>
                  <option value="REJECTED">Rechazados</option>
                </select>
                <Filter className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Contenido */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {activeTab === 'pending' ? (
            // Tab de Pendientes
            pendingRegistrations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto">
                  <Clock size={28} className="text-green-500" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-800">No hay registros pendientes</h3>
                <p className="mt-1 text-gray-600">Todas las solicitudes han sido procesadas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPendingRegistrations.map((registration) => (
                      <tr key={registration.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {registration.firstName} {registration.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {registration.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{registration.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(registration.roleType)}`}>
                            {getRoleText(registration.roleType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${registration.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {registration.emailVerified ? 'Email Verificado' : 'Email Pendiente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(registration.createdAt).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(registration.id)}
                              className="text-green-600 hover:text-green-700 transition-colors"
                              title="Aprobar"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(registration.id)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                              title="Rechazar"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            // Tab de Historial
            registrationHistory.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto">
                  <History size={28} className="text-gray-500" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-800">No hay historial disponible</h3>
                <p className="mt-1 text-gray-600">Aún no se han procesado solicitudes</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha de Solicitud
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha de Procesamiento
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHistory.map((registration) => (
                      <tr key={registration.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {registration.firstName} {registration.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {registration.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{registration.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(registration.roleType)}`}>
                            {getRoleText(registration.roleType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(registration.status)}`}>
                            {getStatusText(registration.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(registration.createdAt).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(registration.updatedAt).toLocaleDateString('es-ES')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

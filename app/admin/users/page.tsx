/* eslint-disable */
// app/admin/users/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, Search, Shield, Mail, Phone, Calendar } from 'lucide-react';
import UserService from '@/services/user.service';
import { User } from '@/services/user.service';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import RoleGuard from '@/components/RoleGuard';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getAllUsers();
      setUsers(response);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Error al cargar los usuarios. Inténtelo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      await UserService.deleteUser(userToDelete.id);
      fetchUsers();
      closeDeleteDialog();
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError('Error al eliminar el usuario. Inténtelo de nuevo más tarde.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (roleName: string) => {
    const colors = {
      'ADMIN': 'bg-red-100 text-red-800',
      'COLABORADOR': 'bg-blue-100 text-blue-800',
      'CLIENTE_INTERNO': 'bg-green-100 text-green-800',
      'CLIENTE_EXTERNO': 'bg-yellow-100 text-yellow-800',
      'USER': 'bg-gray-100 text-gray-800'
    };
    return colors[roleName as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <RoleGuard roles={['ADMIN']}>
      <div>
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
            <p className="text-gray-600">Gestión de usuarios del sistema</p>
          </div>
          <Link
            href="/admin/users/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus size={18} />
            <span>Nuevo Usuario</span>
          </Link>
        </div>

        {/* Búsqueda */}
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
                placeholder="Buscar usuarios..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Lista de usuarios */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-3 text-gray-600">Cargando usuarios...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto">
                <Shield size={28} className="text-gray-500" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-800">No hay usuarios disponibles</h3>
              <p className="mt-1 text-gray-600">Crea tu primer usuario para comenzar</p>
              <div className="mt-4">
                <Link
                  href="/admin/users/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  <Plus size={18} />
                  <span>Crear Usuario</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Header del usuario */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-lg">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                      
                      {/* Acciones */}
                      <div className="flex gap-1">
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => openDeleteDialog(user)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Información de contacto */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{user.phone}</span>
                      </div>
                      {user.createdAt && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          <span>{new Date(user.createdAt).toLocaleDateString('es-ES')}</span>
                        </div>
                      )}
                    </div>

                    {/* Roles */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Roles:</label>
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <span
                              key={role.id}
                              className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor(role.name)}`}
                            >
                              {role.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 italic">Sin roles asignados</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Diálogo de confirmación de eliminación */}
        <ConfirmDialog
          isOpen={deleteDialogOpen}
          title="Eliminar Usuario"
          message={`¿Estás seguro de que deseas eliminar al usuario "${userToDelete?.firstName} ${userToDelete?.lastName}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDelete}
          onCancel={closeDeleteDialog}
          onClose={closeDeleteDialog}
          loading={isDeleting}
          variant="danger"
        />
      </div>
    </RoleGuard>
  );
}
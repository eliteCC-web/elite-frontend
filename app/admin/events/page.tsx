/* eslint-disable */
// app/admin/events/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Plus, Search, Filter, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, MapPin, Clock } from 'lucide-react';
import EventService, { Event } from '@/services/event.service';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const filters = {
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { category: categoryFilter }),
      };
      
      const response = await EventService.getAllEvents(page, limit, filters);
      setEvents(response.data);
      setPagination({
        page: response.meta.page,
        limit: response.meta.limit,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      });
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError('Error al cargar los eventos. Inténtelo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(pagination.page, pagination.limit);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchEvents(newPage, pagination.limit);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents(1, pagination.limit);
  };

  const openDeleteDialog = (event: Event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;

    try {
      setIsDeleting(true);
      await EventService.deleteEvent(eventToDelete.id);
      fetchEvents(pagination.page, pagination.limit);
      closeDeleteDialog();
    } catch (err: any) {
      console.error('Error deleting event:', err);
      setError('Error al eliminar el evento. Inténtelo de nuevo más tarde.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Eventos</h1>
            <p className="text-gray-600">Gestión de eventos y actividades</p>
          </div>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            <span>Nuevo Evento</span>
          </Link>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar eventos..."
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-white px-4 py-2 pr-8 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Todas las categorías</option>
                <option value="Familiar">Familiar</option>
                <option value="Infantil">Infantil</option>
                <option value="Gastronomía">Gastronomía</option>
                <option value="Cultural">Cultural</option>
                <option value="Moda">Moda</option>
                <option value="Música">Música</option>
                <option value="Arte">Arte</option>
              </select>
              <Filter className="absolute right-2 top-2.5 h-4 w-4 text-neutral-400" />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 transition-colors"
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

        {/* Lista de eventos */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-3 text-neutral-600">Cargando eventos...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center">
              <div className="bg-neutral-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto">
                <CalendarIcon size={28} className="text-neutral-500" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-neutral-900">No hay eventos disponibles</h3>
              <p className="mt-1 text-neutral-600">Crea tu primer evento para comenzar</p>
              <div className="mt-4">
                <Link
                  href="/admin/events/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                >
                  <Plus size={18} />
                  <span>Crear Evento</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Vista de cards para eventos */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Imagen del evento */}
                      <div className="relative h-48 bg-gray-200">
                        {event.imageUrl ? (
                          <img
                            src={event.imageUrl}
                            alt={event.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                            <CalendarIcon size={48} className="text-blue-500" />
                          </div>
                        )}
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                          {event.isFeatured && (
                            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Destacado
                            </span>
                          )}
                          {!event.isActive && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Inactivo
                            </span>
                          )}
                        </div>

                        {/* Acciones */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            className="bg-white p-1.5 rounded-full shadow hover:bg-gray-50 transition-colors"
                          >
                            <Edit size={16} className="text-blue-600" />
                          </Link>
                          <button
                            onClick={() => openDeleteDialog(event)}
                            className="bg-white p-1.5 rounded-full shadow hover:bg-gray-50 transition-colors"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                            {event.name}
                          </h3>
                          <span className="text-sm font-bold text-green-600">
                            {formatPrice(event.price)}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {event.description}
                        </p>

                        {/* Información del evento */}
                        <div className="space-y-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{formatDate(event.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>{event.registeredCount}/{event.capacity || '∞'} inscritos</span>
                          </div>
                        </div>

                        {/* Organizador */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Organiza: <span className="font-medium">{event.organizer}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        pagination.page === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        pagination.page === pagination.totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Siguiente
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando{' '}
                        <span className="font-medium">
                          {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}
                        </span>{' '}
                        a{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{' '}
                        de <span className="font-medium">{pagination.total}</span> resultados
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                            pagination.page === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        {[...Array(pagination.totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pagination.page === i + 1
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                            pagination.page === pagination.totalPages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Diálogo de confirmación de eliminación */}
        <ConfirmDialog
          isOpen={deleteDialogOpen}
          title="Eliminar Evento"
          message={`¿Estás seguro de que deseas eliminar el evento "${eventToDelete?.name}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDelete}
          onCancel={closeDeleteDialog}
          onClose={closeDeleteDialog}
          loading={isDeleting}
          variant="danger"
        />
      </div>
    </div>
  );
}
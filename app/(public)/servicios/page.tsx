/* eslint-disable */

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight, Search, Plus, Edit, Trash2, StoreIcon, Phone, Building, MapPin, Clock, Star, Heart, Share2, ArrowRight } from "lucide-react"
import StoreService from "@/services/store.service"
import type { Store } from "@/services/store.service"
import ConfirmDialog from "@/components/admin/ConfirmDialog"
import { getPublicUrl } from "@/lib/utils"
import StoreCard from "@/components/StoreCard"

export default function ServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<Store | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [sortOrder, setSortOrder] = useState("")

  const fetchServices = async (page = 1, limit = 12) => {
    try {
      setLoading(true)
      const response = await StoreService.getServices(page, limit)
      setServices(response.data)
      setPagination({
        page: response.meta.page,
        limit: response.meta.limit,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      })
    } catch (err: any) {
      console.error("Error fetching services:", err)
      setError("Error al cargar los servicios. Inténtelo de nuevo más tarde.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices(pagination.page, pagination.limit)
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchServices(newPage, pagination.limit)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchTerm)
    fetchServices(1, pagination.limit)
  }

  const openDeleteDialog = (service: Store) => {
    setServiceToDelete(service)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setServiceToDelete(null)
  }

  const handleDelete = async () => {
    if (!serviceToDelete) return

    try {
      setIsDeleting(true)
      await StoreService.deleteStore(serviceToDelete.id)
      fetchServices(pagination.page, pagination.limit)
      closeDeleteDialog()
    } catch (err: any) {
      console.error("Error deleting service:", err)
      setError("Error al eliminar el servicio. Inténtelo de nuevo más tarde.")
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.storeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortOrder) {
      case "asc":
        return a.name.localeCompare(b.name)
      case "desc":
        return b.name.localeCompare(a.name)
      case "numero":
        return a.storeNumber.localeCompare(b.storeNumber)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="container-modern py-20">
          <div className="text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-neutral-600">Cargando servicios...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="hero relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={getPublicUrl('elitecc-web//MARCAS%20(2).png')}
            alt="Servicios Centro Comercial Elite"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
        </div>
        <div className="hero-content text-center">
          <h1 className="text-display text-4xl md:text-6xl font-bold text-white mb-6">
            Nuestros Servicios
          </h1>
          <p className="text-xl text-neutral-200 max-w-3xl mx-auto">
            Descubre todos los servicios disponibles para ti: bancos, corresponsales y más
          </p>
        </div>
      </section>

      {/* Filtros y Búsqueda */}
      <section className="bg-white border-b border-neutral-100">
        <div className="container-modern py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="relative w-full lg:w-1/3">
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
            </div>
            
          </div>
        </div>
      </section>

      {/* Mensaje de error */}
      {error && (
        <div className="container-modern py-4">
          <div className="bg-error/10 text-error p-4 rounded-xl border border-error/20">
            {error}
          </div>
        </div>
      )}

      {/* Servicios Destacados */}
      <section className="section">
        <div className="container-modern">
          <div className="text-center mb-16">
            <h2 className="text-display text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Servicios Destacados
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Los servicios más importantes y mejor valorados por nuestros visitantes
            </p>
          </div>

          <div className="grid-cards">
            {sortedServices
              .slice(0, 3)
              .map(service => (
                <StoreCard
                  key={service.id}
                  store={service}
                  isFeatured={true}
                />
              ))}
          </div>
        </div>
      </section>

      {/* Todos los Servicios */}
      <section className="section bg-white">
        <div className="container-modern">
          <div className="text-center mb-16">
            <h2 className="text-display text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Todos los Servicios
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Explora todos los servicios disponibles en nuestro centro comercial
            </p>
          </div>

          {sortedServices.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                <StoreIcon size={48} className="text-neutral-400" />
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
                No se encontraron servicios
              </h3>
              <p className="text-neutral-600">
                No hay servicios disponibles en este momento.
              </p>
            </div>
          ) : (
            <>
              <div className="grid-cards">
                {sortedServices.map(service => (
                  <StoreCard
                    key={service.id}
                    store={service}
                    isFeatured={false}
                  />
                ))}
              </div>

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="btn btn-sm btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  
                  <span className="text-sm text-neutral-600">
                    Página {pagination.page} de {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="btn btn-sm btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Eliminar Servicio"
        message={`¿Estás seguro de que quieres eliminar el servicio "${serviceToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={isDeleting}
      />
    </main>
  )
} 
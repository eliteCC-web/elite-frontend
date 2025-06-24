/* eslint-disable */

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight, Filter, Search, Plus, Edit, Trash2, StoreIcon, Phone, Building, MapPin, Clock, Star, Heart, Share2, ArrowRight } from "lucide-react"
import StoreService from "@/services/store.service"
import type { Store } from "@/services/store.service"
import ConfirmDialog from "@/components/admin/ConfirmDialog"

export default function StoresPage() {
  const router = useRouter()
  const [stores, setStores] = useState<Store[]>([])
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
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("")
  const [sortOrder, setSortOrder] = useState("")

  const fetchStores = async (page = 1, limit = 12) => {
    try {
      setLoading(true)
      const response = await StoreService.getAllStores(page, limit)
      setStores(response.data)
      setPagination({
        page: response.meta.page,
        limit: response.meta.limit,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      })
    } catch (err: any) {
      console.error("Error fetching stores:", err)
      setError("Error al cargar las tiendas. Inténtelo de nuevo más tarde.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores(pagination.page, pagination.limit)
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchStores(newPage, pagination.limit)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // En un caso real, enviaríamos el término de búsqueda a la API
    console.log("Searching for:", searchTerm)
    // Por ahora solo recargamos la primera página
    fetchStores(1, pagination.limit)
  }

  const openDeleteDialog = (store: Store) => {
    setStoreToDelete(store)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setStoreToDelete(null)
  }

  const handleDelete = async () => {
    if (!storeToDelete) return

    try {
      setIsDeleting(true)
      await StoreService.deleteStore(storeToDelete.id)
      // Recargar la lista de tiendas después de eliminar
      fetchStores(pagination.page, pagination.limit)
      closeDeleteDialog()
    } catch (err: any) {
      console.error("Error deleting store:", err)
      setError("Error al eliminar el local. Inténtelo de nuevo más tarde.")
    } finally {
      setIsDeleting(false)
    }
  }

  const categories = ["Todas", "Moda", "Tecnología", "Hogar", "Alimentos", "Servicios", "Entretenimiento", "Salud", "Belleza"]

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.storeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "" || categoryFilter === "Todas" || 
                           getStoreCategories(store.id).includes(categoryFilter)
    return matchesSearch && matchesCategory
  })

  const sortedStores = [...filteredStores].sort((a, b) => {
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

  // Función para obtener una imagen de placeholder para las tiendas
  const getStoreImage = (storeId: string | number) => {
    const idString = storeId.toString();
    const imageNumber = (parseInt(idString.substring(0, 8), 16) % 5) + 1;
    return `/placeholder.svg?height=300&width=400`;
  };

  // Categorías de ejemplo para las tiendas
  const getStoreCategories = (storeId: string | number) => {
    const categories = ["Moda", "Tecnología", "Hogar", "Alimentos", "Servicios", "Entretenimiento", "Salud", "Belleza"];
    const idString = storeId.toString();
    const hash = parseInt(idString.substring(0, 8), 16);
    return [categories[hash % categories.length], categories[(hash + 2) % categories.length]];
  };

  // Generar datos de ejemplo para las tiendas
  const getStoreDetails = (store: Store) => {
    const idString = store.id.toString();
    const hash = parseInt(idString.substring(0, 8), 16);
    return {
      rating: 4 + (hash % 2) * 0.5,
      reviews: 50 + (hash % 100),
      isOpen: hash % 3 !== 0,
      phone: `+57 300 ${100 + (hash % 900)} ${1000 + (hash % 9000)}`,
      location: `Nivel ${(hash % 3) + 1}, Local ${store.storeNumber}`,
      hours: "9:00 AM - 9:00 PM",
      description: store.description || "Tienda especializada en productos de calidad para satisfacer todas tus necesidades."
    };
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="container-modern py-20">
          <div className="text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-neutral-600">Cargando tiendas...</p>
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
            src="/placeholder.svg?height=800&width=1600"
            alt="Tiendas Centro Comercial Elite"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
        </div>
        <div className="hero-content text-center">
          <h1 className="text-display text-4xl md:text-6xl font-bold text-white mb-6">
            Nuestras Tiendas
          </h1>
          <p className="text-xl text-neutral-200 max-w-3xl mx-auto">
            Descubre todas las tiendas y locales comerciales disponibles para ti
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
                placeholder="Buscar tiendas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative w-full lg:w-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="input pr-10"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              </div>
              <div className="relative w-full lg:w-auto">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="input pr-10"
                >
                  <option value="">Ordenar por</option>
                  <option value="asc">A-Z</option>
                  <option value="desc">Z-A</option>
                  <option value="numero">Número de local</option>
                </select>
                <ArrowRight className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 rotate-90" size={18} />
              </div>
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

      {/* Tiendas Destacadas */}
      <section className="section">
        <div className="container-modern">
          <div className="text-center mb-16">
            <h2 className="text-display text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Tiendas Destacadas
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Las tiendas más populares y mejor valoradas por nuestros visitantes
            </p>
          </div>

          <div className="grid-cards">
            {sortedStores
              .filter(store => getStoreDetails(store).rating >= 4.5)
              .slice(0, 6)
              .map(store => {
                const details = getStoreDetails(store)
                return (
                  <div key={store.id} className="store-card group">
                    <div className="relative overflow-hidden">
                      <Image
                        src={getStoreImage(store.id)}
                        alt={store.name}
                        width={400}
                        height={300}
                        className="store-image group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-accent-yellow text-neutral-900 px-3 py-1 rounded-2xl text-sm font-semibold">
                        <Star size={14} className="inline mr-1" />
                        Destacada
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="card-body">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-neutral-900">
                          {store.name}
                        </h3>
                        <span className="text-sm font-medium text-secondary-600">
                          Local {store.storeNumber}
                        </span>
                      </div>
                      
                      <p className="text-neutral-600 mb-4 leading-relaxed line-clamp-2">
                        {details.description}
                      </p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <MapPin size={16} />
                          <span>{details.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <Clock size={16} />
                          <span>{details.hours}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <Phone size={16} />
                          <span>{details.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Star size={16} className="text-accent-yellow fill-current" />
                            <span className="font-medium text-neutral-900">{details.rating}</span>
                            <span className="text-neutral-500">({details.reviews})</span>
                          </div>
                          <span className={`px-2 py-1 rounded-2xl text-xs font-medium ${
                            details.isOpen 
                              ? 'bg-success-50 text-success-600' 
                              : 'bg-error-50 text-error-600'
                          }`}>
                            {details.isOpen ? 'Abierto' : 'Cerrado'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {getStoreCategories(store.id).map((categoria, index) => (
                          <span key={index} className="badge-neutral text-xs">
                            {categoria}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
                            <Heart size={16} />
                          </button>
                          <button className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
                            <Share2 size={16} />
                          </button>
                        </div>
                        <Link
                          href={`/tiendas/${store.id}`}
                          className="btn-card"
                        >
                          Ver Detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </section>

      {/* Todas las Tiendas */}
      <section className="section bg-white">
        <div className="container-modern">
          <div className="text-center mb-16">
            <h2 className="text-display text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Todas las Tiendas
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Explora nuestra completa colección de tiendas y servicios
            </p>
          </div>

          <div className="grid-cards">
            {sortedStores.map(store => {
              const details = getStoreDetails(store)
              return (
                <div key={store.id} className="store-card group">
                  <div className="relative overflow-hidden">
                    <Image
                      src={getStoreImage(store.id)}
                      alt={store.name}
                      width={400}
                      height={300}
                      className="store-image group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="card-body">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-neutral-900">
                        {store.name}
                      </h3>
                      <span className="text-sm font-medium text-secondary-600">
                        Local {store.storeNumber}
                      </span>
                    </div>
                    
                    <p className="text-neutral-600 mb-4 leading-relaxed line-clamp-2">
                      {details.description}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <MapPin size={16} />
                        <span>{details.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Clock size={16} />
                        <span>{details.hours}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Phone size={16} />
                        <span>{details.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-accent-yellow fill-current" />
                          <span className="font-medium text-neutral-900">{details.rating}</span>
                          <span className="text-neutral-500">({details.reviews})</span>
                        </div>
                        <span className={`px-2 py-1 rounded-2xl text-xs font-medium ${
                          details.isOpen 
                            ? 'bg-success-50 text-success-600' 
                            : 'bg-error-50 text-error-600'
                        }`}>
                          {details.isOpen ? 'Abierto' : 'Cerrado'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {getStoreCategories(store.id).map((categoria, index) => (
                        <span key={index} className="badge-neutral text-xs">
                          {categoria}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium text-secondary-600">
                        Local {store.storeNumber}
                      </span>
                      <Link
                        href={`/tiendas/${store.id}`}
                        className="btn-card"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`btn-sm ${
                    page === pagination.page 
                      ? 'btn-primary' 
                      : 'btn-outline'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-white">
        <div className="container-modern text-center">
          <h2 className="text-display text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            ¿Eres comerciante?
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad de comerciantes y forma parte del centro comercial más moderno de la ciudad
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto" className="btn-primary btn-lg">
              <Building size={24} />
              Solicitar Local
            </Link>
            <Link href="/nosotros" className="btn-danger btn-lg">
              Conocer Más
            </Link>
          </div>
        </div>
      </section>

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Eliminar Local"
        message={`¿Estás seguro de que deseas eliminar el local "${storeToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
        isLoading={isDeleting}
        type="danger"
      />
    </main>
  )
}

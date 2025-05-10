/* eslint-disable */

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight, Filter, Search, Plus, Edit, Trash2, StoreIcon, Phone, Building } from "lucide-react"
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
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("")
  const [sortOrder, setSortOrder] = useState("")

  const fetchStores = async (page = 1, limit = 10) => {
    try {
      setLoading(true)
      const response = await StoreService.getAllStores(page, limit)
      console.log(response.data + "STORES !!!")
      setStores(response.data)
      setPagination({
        page: response.meta.page,
        limit: response.meta.limit,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      })
    } catch (err: any) {
      console.error("Error fetching stores:", err)
      setError("Error al cargar los locales. Inténtelo de nuevo más tarde.")
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

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.storeNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Función para obtener una imagen de placeholder para las tiendas
  const getStoreImage = (storeId: string) => {
    // En un caso real, cada tienda tendría su propia imagen
    // Aquí usamos un placeholder basado en el ID para tener variedad
    const imageNumber = (Number.parseInt(storeId.substring(0, 8), 16) % 5) + 1
    return `/placeholder.svg?height=300&width=400`
  }

  // Categorías de ejemplo para las tiendas
  const getStoreCategories = (storeId: string) => {
    const categories = ["Moda", "Tecnología", "Hogar", "Alimentos", "Servicios", "Entretenimiento"]
    // Asignar categorías aleatorias basadas en el ID
    const hash = Number.parseInt(storeId.substring(0, 8), 16)
    return [categories[hash % categories.length], categories[(hash + 2) % categories.length]]
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black/100">
          <div className="relative w-full h-full">
            <Image
              src="/placeholder.svg?height=800&width=1600"
              alt="Tiendas Centro Comercial"
              fill
              className="object-cover brightness-50 opacity-40"
              priority
            />
          </div>
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Nuestras Tiendas</h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Descubre todas las tiendas y locales comerciales disponibles para ti
          </p>
        </div>
      </section>

      {/* Filtros y Búsqueda */}
      <section className="py-8 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Buscar tiendas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <select
                  className="appearance-none bg-white px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  <option value="moda">Moda</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="hogar">Hogar</option>
                  <option value="alimentos">Alimentos</option>
                  <option value="servicios">Servicios</option>
                </select>
                <Filter className="absolute right-3 top-3.5 text-gray-400" size={18} />
              </div>
              <div className="relative w-full md:w-auto">
                <select
                  className="appearance-none bg-white px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="">Ordenar por nombre</option>
                  <option value="asc">A-Z</option>
                  <option value="desc">Z-A</option>
                  <option value="numero">Número de local</option>
                </select>
                <ChevronRight className="absolute right-3 top-3.5 text-gray-400 rotate-90" size={18} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mensaje de error */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
        </div>
      )}

      {/* Tiendas Destacadas */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Tiendas Destacadas</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-3 text-gray-600">Cargando tiendas...</p>
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg shadow-sm">
              <div className="bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto">
                <StoreIcon size={28} className="text-gray-500" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-800">No hay tiendas disponibles</h3>
              <p className="mt-1 text-gray-600">Crea tu primer local para comenzar</p>
              <div className="mt-4">
                <Link
                  href="/admin/stores/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  <Plus size={18} />
                  <span>Crear Local</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStores.slice(0, 3).map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative h-56">
                    <Image
                      src={getStoreImage(store.id+'') || "/placeholder.svg"}
                      alt={store.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {store.storeNumber}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center gap-2 text-white">
                        <Building size={16} />
                        <span className="text-sm">Local {store.storeNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{store.name}</h3>
                      <div className="flex space-x-2">
                        <Link href={`/admin/stores/${store.id}/edit`} className="text-blue-600 hover:text-blue-800">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => openDeleteDialog(store)} className="text-red-600 hover:text-red-800">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                      <Phone size={16} />
                      <span className="text-sm">{store.phone}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getStoreCategories(store.id+'').map((categoria, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {categoria}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/admin/stores/${store.id}`}
                      className="inline-flex items-center text-red-600 font-medium hover:text-red-700"
                    >
                      Ver detalles <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Todas las Tiendas */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Todas las Tiendas</h2>
          {!loading && filteredStores.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="relative h-48">
                    <Image
                      src={getStoreImage(store.id+'') || "/placeholder.svg"}
                      alt={store.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {store.storeNumber}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{store.name}</h3>
                      <div className="flex space-x-2">
                        <Link href={`/admin/stores/${store.id}/edit`} className="text-blue-600 hover:text-blue-800">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => openDeleteDialog(store)} className="text-red-600 hover:text-red-800">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                      <Phone size={16} />
                      <span className="text-sm">{store.phone}</span>
                    </div>
                    <Link
                      href={`/admin/stores/${store.id}`}
                      className="inline-flex items-center text-red-600 font-medium hover:text-red-700"
                    >
                      Ver detalles <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          {!loading && filteredStores.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    pagination.page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronRight className="h-5 w-5 rotate-180" aria-hidden="true" />
                </button>
                {/* Botones de página */}
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      pagination.page === i + 1
                        ? "z-10 bg-red-50 border-red-500 text-red-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
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
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Siguiente</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>

      {/* Suscripción a Novedades */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Quieres recibir novedades de nuestras tiendas?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Suscríbete a nuestro boletín y recibe información sobre nuevas tiendas, promociones y eventos especiales
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="px-4 py-3 rounded-full text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-full font-medium transition-colors">
              Suscribirme
            </button>
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

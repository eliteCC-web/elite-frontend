/* eslint-disable */

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Phone, MapPin, Clock, Star, Heart, Share2, ArrowRight, Building, Calendar, Users, Tag } from "lucide-react"
import StoreService from "@/services/store.service"
import type { Store } from "@/services/store.service"
import { getPublicUrl } from "@/lib/utils"

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const router = useRouter()
  const [service, setService] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)

  const fetchService = async () => {
    try {
      setLoading(true)
      const data = await StoreService.getStoreById(parseInt(id))
      setService(data)
    } catch (err: any) {
      console.error("Error fetching service:", err)
      setError("Error al cargar el servicio. Inténtelo de nuevo más tarde.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchService()
  }, [id])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service?.name,
          text: service?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('Enlace copiado al portapapeles')
    }
  }

  const formatSchedule = (schedule: any) => {
    if (!schedule || !Array.isArray(schedule)) return "Horario no disponible"
    
    const days = {
      monday: "Lunes",
      tuesday: "Martes", 
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
      sunday: "Domingo"
    }

    return schedule.map((day: any) => {
      if (!day.isOpen) return `${days[day.day as keyof typeof days]}: Cerrado`
      return `${days[day.day as keyof typeof days]}: ${day.openTime} - ${day.closeTime}`
    }).join('\n')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="container-modern py-20">
          <div className="text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-neutral-600">Cargando servicio...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !service) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="container-modern py-20">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <Building size={48} className="text-neutral-400" />
            </div>
            <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
              Servicio no encontrado
            </h3>
            <p className="text-neutral-600 mb-6">
              {error || "El servicio que buscas no existe o ha sido eliminado."}
            </p>
            <Link href="/servicios" className="btn btn-primary">
              Volver a Servicios
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header con navegación */}
      <section className="bg-white border-b border-neutral-100">
        <div className="container-modern py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/servicios" 
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Volver a Servicios</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Section con imagen principal */}
      <section className="relative h-[60vh] overflow-hidden">
        {service.images && service.images.length > 0 ? (
          <Image
            src={service.images[selectedImage]}
            alt={service.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
            <Building size={64} className="text-neutral-400" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Información del servicio sobre la imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container-modern">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm mb-4">
                  <Tag size={16} />
                  <span>{service.category || "Servicio"}</span>
                </div>
                
                <h1 className="text-display text-4xl md:text-6xl font-bold text-white mb-4">
                  {service.name}
                </h1>
                
                <p className="text-xl text-neutral-200 max-w-3xl">
                  {service.description}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="btn btn-white btn-sm"
                >
                  <Share2 size={16} />
                  Compartir
                </button>
                
                <button className="btn btn-white btn-sm">
                  <Heart size={16} />
                  Favorito
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galería de imágenes */}
      {service.images && service.images.length > 1 && (
        <section className="bg-white border-b border-neutral-100">
          <div className="container-modern py-6">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {service.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? "border-primary-500 shadow-lg" 
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${service.name} - Imagen ${index + 1}`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Información detallada */}
      <section className="section">
        <div className="container-modern">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Información principal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100">
                <h2 className="text-display text-3xl font-bold text-neutral-900 mb-6">
                  Acerca de este Servicio
                </h2>
                
                <div className="prose prose-neutral max-w-none">
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    {service.description || "No hay descripción disponible para este servicio."}
                  </p>
                </div>
                
                {/* Información adicional */}
                <div className="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-neutral-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">Número de Local</h4>
                      <p className="text-neutral-600">{service.storeNumber}</p>
                    </div>
                  </div>
                  
                  {service.floor && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin size={20} className="text-secondary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-1">Piso</h4>
                        <p className="text-neutral-600">{service.floor}</p>
                      </div>
                    </div>
                  )}
                  
                  {service.category && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Tag size={20} className="text-neutral-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-1">Categoría</h4>
                        <p className="text-neutral-600">{service.category}</p>
                      </div>
                    </div>
                  )}
                  
                  {service.monthlyRent && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold">$</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-1">Renta Mensual</h4>
                        <p className="text-neutral-600">${service.monthlyRent?.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sidebar con información de contacto y horarios */}
            <div className="space-y-6">
              {/* Información de contacto */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  Información de Contacto
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Phone size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Teléfono</p>
                      <a 
                        href={`tel:${service.phone}`}
                        className="text-neutral-900 font-medium hover:text-primary-600 transition-colors"
                      >
                        {service.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
                      <MapPin size={20} className="text-secondary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Ubicación</p>
                      <p className="text-neutral-900 font-medium">
                        Centro Comercial Elite
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <button className="btn btn-primary w-full">
                    <Phone size={16} />
                    Llamar Ahora
                  </button>
                </div>
              </div>
              
              {/* Horarios */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  Horarios de Atención
                </h3>
                
                {service.schedule && Array.isArray(service.schedule) ? (
                  <div className="space-y-3">
                    {service.schedule.map((day: any, index: number) => {
                      const days = {
                        monday: "Lunes",
                        tuesday: "Martes", 
                        wednesday: "Miércoles",
                        thursday: "Jueves",
                        friday: "Viernes",
                        saturday: "Sábado",
                        sunday: "Domingo"
                      }
                      
                      return (
                        <div key={index} className="flex justify-between items-center py-2">
                          <span className="text-neutral-700">
                            {days[day.day as keyof typeof days]}
                          </span>
                          <span className="text-neutral-900 font-medium">
                            {day.isOpen ? `${day.openTime} - ${day.closeTime}` : "Cerrado"}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock size={48} className="text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600">
                      Horarios no disponibles
                    </p>
                  </div>
                )}
              </div>
              
              {/* Acciones */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  Acciones
                </h3>
                
                <div className="space-y-3">
                  <button className="btn btn-outline w-full">
                    <Heart size={16} />
                    Agregar a Favoritos
                  </button>
                  
                  <button 
                    onClick={handleShare}
                    className="btn btn-outline w-full"
                  >
                    <Share2 size={16} />
                    Compartir
                  </button>
                  
                  <Link 
                    href="/servicios" 
                    className="btn btn-secondary w-full"
                  >
                    <ArrowRight size={16} />
                    Ver Más Servicios
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 
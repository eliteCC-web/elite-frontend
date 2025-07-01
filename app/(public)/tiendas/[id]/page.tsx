/* eslint-disable */
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Phone, MapPin, Clock, Star, Heart, Share2, Calendar } from "lucide-react"
import StoreService from "@/services/store.service"
import type { Store } from "@/services/store.service"

export default function StoreDetailPage() {
  const params = useParams()
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true)
        const storeId = parseInt(params.id as string)
        const storeData = await StoreService.getStoreById(storeId)
        setStore(storeData)
      } catch (err: any) {
        console.error("Error fetching store:", err)
        setError("Error al cargar los detalles de la tienda.")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchStore()
    }
  }, [params.id])

  const getStoreImage = (store: Store) => {
    console.log('Store images (details):', store.images);
    console.log('Store name (details):', store.name);
    
    // Verificar si store.images existe y tiene contenido
    if (store.images) {
      // Si es un array
      if (Array.isArray(store.images) && store.images.length > 0) {
        const firstImage = store.images[0];
        console.log('First image from array (details):', firstImage);
        
        // Validar que firstImage sea un string válido
        if (typeof firstImage === 'string' && firstImage) {
          const cleanUrl = firstImage.replace(/^"|"$/g, '');
          console.log('Clean URL from array (details):', cleanUrl);
          if (cleanUrl && cleanUrl.startsWith('http')) {
            return cleanUrl;
          }
        }
      }
      // Si es un string (caso donde llegó como string en lugar de array)
      else if (typeof store.images === 'string' && store.images) {
        console.log('Images as string (details):', store.images);
        try {
          const parsedImages = JSON.parse(store.images);
          if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            const firstParsedImage = parsedImages[0];
            if (typeof firstParsedImage === 'string' && firstParsedImage) {
              const cleanUrl = firstParsedImage.replace(/^"|"$/g, '');
              console.log('Clean URL from parsed string (details):', cleanUrl);
              if (cleanUrl && cleanUrl.startsWith('http')) {
                return cleanUrl;
              }
            }
          }
        } catch (e) {
          console.log('Error parsing images string (details):', e);
        }
      }
    }
    
    // Si no hay imágenes válidas, usar placeholder
    const placeholderUrl = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=center&auto=format&q=80`;
    console.log('Using placeholder (details):', placeholderUrl);
    return placeholderUrl;
  }

  const getStoreDetails = (store: Store) => {
    const idString = store.id.toString();
    const hash = parseInt(idString.substring(0, 8), 16);
    
    const phone = store.phone || `+57 300 ${100 + (hash % 900)} ${1000 + (hash % 9000)}`;
    const location = store.storeNumber || (store.floor ? `Nivel ${store.floor}, Local ${store.storeNumber}` : `Local ${store.storeNumber}`);
    
    let hours = "Horario no disponible";
    
    if (store.schedule && Array.isArray(store.schedule)) {
      // Obtener el día actual
      const today = new Date().getDay(); // 0 = domingo, 1 = lunes, etc.
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const todayName = dayNames[today];
      
      const todaySchedule = store.schedule.find((day: any) => day.day === todayName);
      
      if (todaySchedule) {
        if (todaySchedule.isOpen) {
          hours = `${todaySchedule.openTime} - ${todaySchedule.closeTime}`;
        } else {
          hours = "Cerrado hoy";
        }
      } else {
        const openDays = store.schedule.filter((day: any) => day.isOpen);
        if (openDays.length > 0) {
          hours = `${openDays[0].openTime} - ${openDays[0].closeTime}`;
        }
      }
    }
    
    return {
      phone: phone,
      location: location,
      hours: hours,
      description: store.description || "Tienda especializada en productos de calidad para satisfacer todas tus necesidades."
    };
  }

  const getDayName = (day: string) => {
    const days: { [key: string]: string } = {
      monday: 'Lunes',
      tuesday: 'Martes', 
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo'
    }
    return days[day] || day
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="container-modern py-20">
          <div className="text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-neutral-600">Cargando detalles de la tienda...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !store) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="container-modern py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Tienda no encontrada</h1>
            <p className="text-neutral-600 mb-8">{error || "La tienda que buscas no existe."}</p>
            <Link href="/tiendas" className="btn-primary">
              <ArrowLeft size={16} className="mr-2" />
              Volver a Tiendas
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const details = getStoreDetails(store)

  return (
    <main className="min-h-screen bg-neutral-50 pt-10 lg:pt-0">
      {/* Header */}
      <section className="bg-white border-b border-neutral-100">
        <div className="container-modern py-6">
          <Link href="/tiendas" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 transition-colors mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Volver a Tiendas
          </Link>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">
                {store.name}
              </h1>
              <p className="text-lg text-neutral-600">
                Local {store.storeNumber}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
                <Heart size={20} />
              </button>
              <button className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="section">
        <div className="container-modern">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Galería de Imágenes */}
              <div className="space-y-4">
                {/* Imagen Principal */}
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src={getStoreImage(store)}
                    alt={store.name}
                    width={800}
                    height={600}
                    className="w-full h-96 object-cover"
                  />
                  {store.images && store.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {store.images.length} fotos
                    </div>
                  )}
                </div>
                
                {/* Galería de Imágenes Adicionales */}
                {store.images && store.images.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {store.images.slice(1).map((image, index) => {
                      // Validar que image sea un string válido
                      if (typeof image !== 'string' || !image) {
                        return null;
                      }
                      
                      const cleanUrl = image.replace(/^"|"$/g, '');
                      
                      // Validar que la URL sea válida
                      if (!cleanUrl || !cleanUrl.startsWith('http')) {
                        return null;
                      }
                      
                      return (
                        <div key={index} className="relative overflow-hidden rounded-xl">
                          <Image
                            src={cleanUrl}
                            alt={`${store.name} - Imagen ${index + 2}`}
                            width={300}
                            height={200}
                            className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      );
                    }).filter(Boolean)}
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div className="bg-white rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  Sobre {store.name}
                </h2>
                <p className="text-neutral-600 leading-relaxed">
                  {details.description}
                </p>
              </div>

              {/* Horarios */}
              {store.schedule && Array.isArray(store.schedule) && (
                <div className="bg-white rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
                    <Calendar size={24} className="mr-3" />
                    Horarios de Atención
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {store.schedule.map((day: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-neutral-50">
                        <span className="font-medium text-neutral-900">
                          {getDayName(day.day)}
                        </span>
                        <span className={`text-sm font-medium ${
                          day.isOpen ? 'text-success-600' : 'text-error-600'
                        }`}>
                          {day.isOpen ? `${day.openTime} - ${day.closeTime}` : 'Cerrado'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Información de Contacto */}
              <div className="bg-white rounded-2xl p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  Información de Contacto
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500">Teléfono</p>
                      <p className="font-medium text-neutral-900">{details.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500">Ubicación</p>
                      <p className="font-medium text-neutral-900">{details.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500">Horario Hoy</p>
                      <p className="font-medium text-neutral-900">{details.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="bg-white rounded-2xl p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  Acciones
                </h3>
                <div className="space-y-3">
                  <button className="w-full btn-primary">
                    <Phone size={16} className="mr-2" />
                    Llamar
                  </button>
                  <button className="w-full btn-outline">
                    <MapPin size={16} className="mr-2" />
                    Ver en Mapa
                  </button>
                  <button className="w-full btn-outline">
                    <Share2 size={16} className="mr-2" />
                    Compartir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 
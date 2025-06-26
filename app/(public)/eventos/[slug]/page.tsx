/* eslint-disable */
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Phone, MapPin, Clock, Star, Heart, Share2, Calendar, Users, Mail, X } from "lucide-react"
import EventService from "@/services/event.service"
import type { Event } from "@/services/event.service"
import { useAuth } from "@/hooks/useAuth"

export default function EventDetailPage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [registrationLoading, setRegistrationLoading] = useState(false)
  const [registrationError, setRegistrationError] = useState<string | null>(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  })
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const slug = params.slug as string
        const eventData = await EventService.getEventBySlug(slug)
        setEvent(eventData)
      } catch (err: any) {
        console.error("Error fetching event:", err)
        setError("Error al cargar los detalles del evento.")
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchEvent()
    }
  }, [params.slug])

  const getEventImages = (event: Event) => {
    const images: string[] = [];
    
    // Agregar imagen principal si existe
    if (event.imageUrl) {
      images.push(event.imageUrl);
    }
    
    // Agregar imágenes adicionales si existen
    if (event.images && event.images.length > 0) {
      images.push(...event.images);
    }
    
    // Si no hay imágenes, usar placeholder
    if (images.length === 0) {
      images.push(`https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center&auto=format&q=80`);
    }
    
    return images;
  }

  const getEventImage = (event: Event) => {
    const images = getEventImages(event);
    return images[selectedImageIndex] || images[0];
  }

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const isUpcoming = () => {
    if (!event) return false;
    const now = new Date();
    const eventDate = new Date(event.startDate);
    return eventDate > now;
  }

  const isUnlimited = () => {
    return event && (event.capacity === 0 || event.capacity === null);
  }

  const getCuposPercentage = (registered: number, capacity: number): number => {
    if (capacity === 0) return 0; // Cupos ilimitados
    return Math.round((registered / capacity) * 100);
  }

  const canRegister = () => {
    if (!event) return false;
    if (!isUpcoming()) return false;
    if (isUnlimited()) return true;
    return event.registeredCount < event.capacity;
  }

  const handleRegister = () => {
    if (!event) return;
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    setShowRegistrationModal(true);
    setRegistrationError(null);
    setRegistrationSuccess(false);
    setFormData({ name: '', phone: '', email: '' });
  }

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;

    setRegistrationLoading(true);
    setRegistrationError(null);

    try {
      await EventService.registerForEvent(event.id, {
        eventId: event.id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email
      });

      setRegistrationSuccess(true);
      setShowRegistrationModal(false);
      
      // Recargar los datos del evento para actualizar el conteo
      const updatedEvent = await EventService.getEventBySlug(event.slug);
      setEvent(updatedEvent);
    } catch (err: any) {
      console.error('Error registering for event:', err);
      setRegistrationError(err.response?.data?.message || 'Error al registrar para el evento');
    } finally {
      setRegistrationLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="container-modern py-20">
          <div className="text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-neutral-600">Cargando detalles del evento...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="container-modern py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Evento no encontrado</h1>
            <p className="text-neutral-600 mb-8">{error || "El evento que buscas no existe."}</p>
            <Link href="/eventos" className="btn-primary">
              <ArrowLeft size={16} className="mr-2" />
              Volver a Eventos
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-50 pt-10 lg:pt-0">
      {/* Header */}
      <section className="bg-white border-b border-neutral-100">
        <div className="container-modern py-6">
          <Link href="/eventos" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 transition-colors mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Volver a Eventos
          </Link>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">
                {event.name}
              </h1>
              <p className="text-lg text-neutral-600">
                Organizado por {event.organizer}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
                <Heart size={20} />
              </button>
              <button className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
                <Share2 size={20} />
              </button>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isUpcoming() 
                  ? 'bg-success-50 text-success-600' 
                  : 'bg-neutral-50 text-neutral-600'
              }`}>
                {isUpcoming() ? 'Próximo' : 'Pasado'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-12">
        <div className="container-modern">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Columna Principal */}
            <div className="lg:col-span-2">
              {/* Galería de Imágenes */}
              <div className="mb-8">
                {/* Imagen Principal */}
                <div className="relative overflow-hidden rounded-3xl mb-4">
                  <Image
                    src={getEventImage(event)}
                    alt={event.name}
                    width={800}
                    height={500}
                    className="w-full h-96 object-cover"
                  />
                  {event.isFeatured && (
                    <div className="absolute top-4 left-4 bg-accent-yellow text-neutral-900 px-3 py-1 rounded-2xl text-sm font-semibold">
                      <Star size={14} className="inline mr-1" />
                      Destacado
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-secondary-500 text-white px-3 py-1 rounded-2xl text-sm font-semibold">
                    {formatPrice(event.price)}
                  </div>
                </div>

                {/* Miniaturas de Imágenes */}
                {getEventImages(event).length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {getEventImages(event).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 relative overflow-hidden rounded-xl transition-all ${
                          selectedImageIndex === index 
                            ? 'ring-2 ring-primary-500' 
                            : 'ring-1 ring-neutral-200 hover:ring-primary-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${event.name} - Imagen ${index + 1}`}
                          width={120}
                          height={80}
                          className="w-24 h-16 object-cover"
                        />
                        {selectedImageIndex === index && (
                          <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div className="bg-white rounded-3xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Descripción</h2>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  {event.description}
                </p>
                {event.longDescription && (
                  <p className="text-neutral-600 leading-relaxed">
                    {event.longDescription}
                  </p>
                )}
              </div>

              {/* Información Detallada */}
              <div className="bg-white rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Información del Evento</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-primary-500" />
                    <div>
                      <p className="text-sm text-neutral-500">Fecha</p>
                      <p className="font-medium text-neutral-900">{formatDate(event.startDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-primary-500" />
                    <div>
                      <p className="text-sm text-neutral-500">Horario</p>
                      <p className="font-medium text-neutral-900">
                        {formatTime(event.startDate)} - {formatTime(event.endDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-primary-500" />
                    <div>
                      <p className="text-sm text-neutral-500">Ubicación</p>
                      <p className="font-medium text-neutral-900">{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-primary-500" />
                    <div>
                      <p className="text-sm text-neutral-500">Capacidad</p>
                      <p className="font-medium text-neutral-900">
                        {isUnlimited() 
                          ? 'Ilimitado' 
                          : `${event.registeredCount} / ${event.capacity} inscritos`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Barra de progreso de cupos */}
                {!isUnlimited() && (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-neutral-600 mb-2">
                      <span>Cupos disponibles</span>
                      <span>{getCuposPercentage(event.registeredCount, event.capacity)}% ocupado</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all ${
                          getCuposPercentage(event.registeredCount, event.capacity) > 80 
                            ? 'bg-error' 
                            : getCuposPercentage(event.registeredCount, event.capacity) > 50 
                              ? 'bg-warning' 
                              : 'bg-success'
                        }`}
                        style={{ width: `${getCuposPercentage(event.registeredCount, event.capacity)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Card de Registro */}
              <div className="bg-white rounded-3xl p-6 mb-6 sticky top-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Registrarse</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Precio:</span>
                    <span className="font-bold text-success-600">{formatPrice(event.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Cupos disponibles:</span>
                    <span className="font-medium">
                      {isUnlimited() 
                        ? 'Ilimitado' 
                        : event.capacity - event.registeredCount
                      }
                    </span>
                  </div>
                </div>

                {event.price > 0 && (
                  <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-neutral-900 mb-2">Información de Pago</h4>
                    <p className="text-sm text-neutral-600 mb-3">
                      Para eventos con costo, contacta directamente con el organizador.
                    </p>
                    {event.contactEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={16} className="text-primary-500" />
                        <span>{event.contactEmail}</span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleRegister}
                  disabled={!canRegister()}
                  className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all ${
                    !canRegister()
                      ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                      : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
                >
                  {canRegister() ? 'Registrarse' : 'Evento Pasado'}
                </button>
              </div>

              {/* Información de Contacto */}
              <div className="bg-white rounded-3xl p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Organizador</h3>
                <p className="text-neutral-600 mb-4">{event.organizer}</p>
                
                {event.contactEmail && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="text-primary-500" />
                    <span className="text-neutral-600">{event.contactEmail}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Registro */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-neutral-900">
                Registrarse para: {event?.name}
              </h3>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {registrationError && (
              <div className="bg-error/10 text-error p-4 rounded-xl border border-error/20 mb-6">
                {registrationError}
              </div>
            )}

            <form onSubmit={handleSubmitRegistration} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-neutral-900 mb-2">Información del Evento</h4>
                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex justify-between">
                    <span>Fecha:</span>
                    <span>{event && formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hora:</span>
                    <span>{event && `${formatTime(event.startDate)} - ${formatTime(event.endDate)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lugar:</span>
                    <span>{event?.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio:</span>
                    <span className="font-bold text-success-600">{event && formatPrice(event.price)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(false)}
                  className="flex-1 py-3 px-6 border border-neutral-200 text-neutral-700 rounded-2xl font-semibold hover:bg-neutral-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={registrationLoading}
                  className="flex-1 py-3 px-6 bg-primary-500 text-white rounded-2xl font-semibold hover:bg-primary-600 transition-colors disabled:bg-neutral-200 disabled:text-neutral-500"
                >
                  {registrationLoading ? 'Registrando...' : 'Confirmar Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Éxito */}
      {registrationSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-success-500 rounded-full"></div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              ¡Registro Exitoso!
            </h3>
            <p className="text-neutral-600 mb-6">
              Te hemos enviado un email de confirmación con los detalles del evento y tu código de registro único.
            </p>
            <button
              onClick={() => setRegistrationSuccess(false)}
              className="w-full py-3 px-6 bg-primary-500 text-white rounded-2xl font-semibold hover:bg-primary-600 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </main>
  )
} 
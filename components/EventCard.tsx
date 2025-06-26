import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock, Users, Star, Heart, Share2 } from "lucide-react"
import type { Event } from "@/services/event.service"

interface EventCardProps {
  event: Event
  isFeatured?: boolean
}

export default function EventCard({ event, isFeatured = false }: EventCardProps) {
  // Función para obtener una imagen de placeholder para los eventos
  const getEventImage = (event: Event) => {
    if (event.imageUrl) {
      return event.imageUrl;
    }
    // Si no hay imagen, usar placeholder
    return `https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop&crop=center&auto=format&q=80`;
  };

  // Formatear precio
  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Formatear hora
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Determinar si el evento está próximo
  const isUpcoming = () => {
    const now = new Date();
    const eventDate = new Date(event.startDate);
    return eventDate > now;
  };

  return (
    <div className="event-card group">
      <div className="relative overflow-hidden">
        <Image
          src={getEventImage(event)}
          alt={event.name}
          width={400}
          height={300}
          className="event-image group-hover:scale-105"
        />
        {isFeatured && (
          <div className="absolute top-4 left-4 bg-accent-yellow text-neutral-900 px-3 py-1 rounded-2xl text-sm font-semibold">
            <Star size={14} className="inline mr-1" />
            Destacado
          </div>
        )}
        <div className="absolute top-4 right-4 bg-secondary-500 text-white px-3 py-1 rounded-2xl text-sm font-semibold">
          {formatPrice(event.price)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="card-body">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-neutral-900 line-clamp-2 min-h-[3rem] flex-1">
            {event.name}
          </h3>
        </div>
        
        <p className="text-neutral-600 mb-4 leading-relaxed line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Calendar size={16} />
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Clock size={16} />
            <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Users size={16} className="text-neutral-400" />
              <span className="text-neutral-500">{event.registeredCount}</span>
              {event.capacity > 0 && (
                <span className="text-neutral-400">/ {event.capacity}</span>
              )}
              <span className="text-neutral-500">inscritos</span>
            </div>
            <span className={`px-2 py-1 rounded-2xl text-xs font-medium ${
              isUpcoming() 
                ? 'bg-success-50 text-success-600' 
                : 'bg-neutral-50 text-neutral-600'
            }`}>
              {isUpcoming() ? 'Próximo' : 'Pasado'}
            </span>
          </div>
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
            href={`/eventos/${event.slug}`}
            className="btn-outline btn-sm"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
} 
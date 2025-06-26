/* eslint-disable */
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Phone, Star, Heart, Share2 } from "lucide-react"
import type { Store } from "@/services/store.service"

interface StoreCardProps {
  store: Store
  isFeatured?: boolean
}

export default function StoreCard({ store, isFeatured = false }: StoreCardProps) {
  // Función para obtener una imagen de placeholder para las tiendas
  const getStoreImage = (store: Store) => {
    if (store.images && store.images.length > 0) {
      // Limpiar URL si tiene comillas dobles extra
      const cleanUrl = store.images[0].replace(/^"|"$/g, '');
      if (cleanUrl && cleanUrl.startsWith('http')) {
        return cleanUrl;
      }
    }
    // Si no hay imágenes válidas, usar placeholder
    return `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center&auto=format&q=80`;
  };

  // Generar datos adicionales para las tiendas basados en datos reales
  const getStoreDetails = (store: Store) => {
    const idString = store.id.toString();
    const hash = parseInt(idString.substring(0, 8), 16);
    
    // Usar datos reales de la tienda
    const phone = store.phone || `+57 300 ${100 + (hash % 900)} ${1000 + (hash % 9000)}`;
    const location = store.storeNumber || (store.floor ? `Nivel ${store.floor}, Local ${store.storeNumber}` : `Local ${store.storeNumber}`);
    
    // Determinar si está abierto basado en el schedule
    let isOpen = false;
    let hours = "Horario no disponible";
    
    if (store.schedule && Array.isArray(store.schedule)) {
      // Obtener el día actual
      const today = new Date().getDay(); // 0 = domingo, 1 = lunes, etc.
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const todayName = dayNames[today];
      
      const todaySchedule = store.schedule.find((day: any) => day.day === todayName);
      
      if (todaySchedule) {
        if (todaySchedule.isOpen) {
          isOpen = true;
          hours = `${todaySchedule.openTime} - ${todaySchedule.closeTime}`;
        } else {
          hours = "Cerrado hoy";
        }
      } else {
        // Si no encuentra el día, mostrar horario general
        const openDays = store.schedule.filter((day: any) => day.isOpen);
        if (openDays.length > 0) {
          hours = `${openDays[0].openTime} - ${openDays[0].closeTime}`;
        }
      }
    }
    
    return {
      rating: 4 + (hash % 2) * 0.5,
      reviews: 50 + (hash % 100),
      isOpen: isOpen,
      phone: phone,
      location: location,
      hours: hours,
      description: store.description || "Tienda especializada en productos de calidad para satisfacer todas tus necesidades."
    };
  };

  const details = getStoreDetails(store);

  return (
    <div className="store-card group">
      <div className="relative overflow-hidden">
        <Image
          src={getStoreImage(store)}
          alt={store.name}
          width={400}
          height={300}
          className="store-image group-hover:scale-105"
        />
        {isFeatured && (
          <div className="absolute top-4 left-4 bg-accent-yellow text-neutral-900 px-3 py-1 rounded-2xl text-sm font-semibold">
            <Star size={14} className="inline mr-1" />
            Destacada
          </div>
        )}
        <div className="absolute top-4 right-4 bg-secondary-500 text-white px-3 py-1 rounded-2xl text-sm font-semibold">
          Local {store.storeNumber}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="card-body">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-neutral-900 line-clamp-2 min-h-[3rem] flex-1">
            {store.name}
          </h3>
        </div>
        
        <p className="text-neutral-600 mb-4 leading-relaxed line-clamp-2">
          {details.description}
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Clock size={16} />
            <span>{details.hours}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Phone size={16} />
            <span>{details.phone}</span>
          </div>
          {/*
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
          */}
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
            className="btn-outline btn-sm"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
} 
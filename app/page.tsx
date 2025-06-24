'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Clock, Users, ShoppingBag, Star, ChevronRight } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import assets from '@/public/assets';
import { getPublicUrl } from '@/lib/utils';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

// Tipos para los datos
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  isFree: boolean;
  price?: number;
  attendees: number;
}

interface Store {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  isOpen: boolean;
  location: string;
}

// Datos de ejemplo para eventos
const featuredEvents: Event[] = [
  {
    id: 1,
    title: "Noche de Jazz",
    description: "Disfruta de una velada inolvidable con los mejores músicos de jazz de la ciudad.",
    date: "2024-02-15",
    time: "20:00",
    location: "Plaza Central",
    image: assets.hero_eventos,
    category: "Música",
    isFree: true,
    attendees: 150
  },
  {
    id: 2,
    title: "Feria Gastronómica",
    description: "Descubre los sabores más exquisitos de la región en nuestra feria gastronómica anual.",
    date: "2024-02-20",
    time: "18:00",
    location: "Zona Gastronómica",
    image: assets.arte_1,
    category: "Gastronomía",
    isFree: false,
    price: 25000,
    attendees: 300
  },
  {
    id: 3,
    title: "Exposición de Arte",
    description: "Admira las obras de artistas locales en esta exposición única y gratuita.",
    date: "2024-02-25",
    time: "19:00",
    location: "Galería Elite",
    image: assets.plazoleta_2,
    category: "Arte",
    isFree: true,
    attendees: 80
  }
];

// Datos de ejemplo para tiendas
const featuredStores: Store[] = [
  {
    id: 1,
    name: "Gourmet Elite",
    description: "Los mejores productos gourmet y delicatessen de la ciudad.",
    category: "Gastronomía",
    rating: 4.8,
    reviews: 156,
    image: assets.plazoleta_1,
    isOpen: true,
    location: "Nivel 1, Local 15"
  },
  {
    id: 2,
    name: "TechZone",
    description: "La tecnología más avanzada al mejor precio del mercado.",
    category: "Tecnología",
    rating: 4.6,
    reviews: 89,
    image: assets.moda_1,
    isOpen: true,
    location: "Nivel 2, Local 8"
  },
  {
    id: 3,
    name: "Fashion Forward",
    description: "Las últimas tendencias en moda y accesorios de lujo.",
    category: "Moda",
    rating: 4.9,
    reviews: 234,
    image: assets.moda_2,
    isOpen: true,
    location: "Nivel 1, Local 22"
  }
];

// Componente EventCard simple
function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white rounded-3xl shadow-soft border border-neutral-200 overflow-hidden group hover:shadow-medium transition-all duration-300">
      <div className="relative overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {event.category}
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-neutral-900 px-3 py-1 rounded-full text-sm font-semibold">
          {event.isFree ? 'Gratis' : `$${event.price?.toLocaleString()}`}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-neutral-900 mb-3">{event.title}</h3>
        <p className="text-neutral-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Calendar size={16} />
            <span>{new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Clock size={16} />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
        </div>
        
        <Link href="/eventos" className="btn-outline btn-sm w-full rounded-2xl">
          Registrarse
        </Link>
      </div>
    </div>
  );
}

// Componente StoreCard simple
function StoreCard({ store }: { store: Store }) {
  return (
    <div className="bg-white rounded-3xl shadow-soft border border-neutral-200 overflow-hidden group hover:shadow-medium transition-all duration-300">
      <div className="relative overflow-hidden">
        <Image
          src={store.image}
          alt={store.name}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {store.category}
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-neutral-900 px-3 py-1 rounded-full text-sm font-semibold">
          {store.isOpen ? 'Abierto' : 'Cerrado'}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-neutral-900 mb-3">{store.name}</h3>
        <p className="text-neutral-600 mb-4 line-clamp-2">{store.description}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-neutral-900">{store.rating}</span>
          </div>
          <span className="text-sm text-neutral-500">({store.reviews} reseñas)</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
          <MapPin size={16} />
          <span>{store.location}</span>
        </div>
        
        <Link href="/tiendas" className="btn-outline btn-sm w-full rounded-2xl">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - fuera del hero para evitar superposición */}
      <Navbar />

      {/* Hero Section - Pantalla completa */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo con overlay oscuro */}
        <div className="absolute inset-0 z-0">
          <Image
            src={assets.hero_img}
            alt="Elite Centro Comercial"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Contenido central */}
        <div className="relative z-10 text-center px-4">
          <div className="max-w-4xl mx-auto">
            {/* Logo de Elite */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <Image
                  src={getPublicUrl('elitecc-web/upscalemedia-transformed.png')}
                  alt="Logo Elite"
                  width={120}
                  height={120}
                  className="drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
              Elite
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light mb-8 tracking-wide">
              Centro Comercial
            </p>
            
            {/* Texto con efecto generativo */}
            <div className="mb-12">
              <TextGenerateEffect 
                words="Descubre una experiencia de compra única donde la elegancia se encuentra con la innovación"
                className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                textColor="text-white/80"
                duration={0.8}
              />
            </div>
            
            {/*
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/tiendas" 
                className="btn-primary btn-lg rounded-2xl group"
              >
                Explorar Tiendas
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link 
                href="/eventos" 
                className="btn-outline btn-lg rounded-2xl group border-white/30 text-white hover:bg-white hover:text-neutral-900"
              >
                Ver Eventos
                <Calendar size={20} className="group-hover:scale-110 transition-transform duration-200" />
              </Link>
            </div>*/}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Resto de secciones en blanco */}
      <div className="bg-white">
        {/* Eventos Destacados */}
        <section className="py-20">
          <div className="container-modern">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                Eventos Destacados
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Descubre los eventos más emocionantes que tenemos preparados para ti
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            <div className="text-center">
              <Link 
                href="/eventos" 
                className="btn-primary btn-lg rounded-2xl group"
              >
                Ver Todos los Eventos
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </section>

        {/* Tiendas Destacadas */}
        <section className="py-20 bg-neutral-50">
          <div className="container-modern">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                Tiendas Destacadas
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Explora nuestras tiendas más populares y descubre productos únicos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>

            <div className="text-center">
              <Link 
                href="/tiendas" 
                className="btn-primary btn-lg rounded-2xl group"
              >
                Ver Todas las Tiendas
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </section>

        {/* Por Qué Elegir Elite */}
        <section className="py-20">
          <div className="container-modern">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                ¿Por qué elegir Elite?
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Descubre lo que hace único a nuestro centro comercial
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <ShoppingBag size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  Variedad de Tiendas
                </h3>
                <p className="text-neutral-600">
                  Más de 100 tiendas con las mejores marcas nacionales e internacionales
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Calendar size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  Eventos Constantes
                </h3>
                <p className="text-neutral-600">
                  Actividades y eventos especiales para toda la familia
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MapPin size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  Ubicación Privilegiada
                </h3>
                <p className="text-neutral-600">
                  Fácil acceso y estacionamiento gratuito para tu comodidad
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  Atención Personalizada
                </h3>
                <p className="text-neutral-600">
                  Nuestro equipo está siempre disponible para ayudarte
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

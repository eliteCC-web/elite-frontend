'use client';

import { useState } from 'react';
import Image from "next/image";
import { Calendar, MapPin, Clock, Users, Filter, Search, Heart, Share2, Phone, Mail } from 'lucide-react';
import assets from "@/public/assets";
import { useAuth } from "@/hooks/useAuth";

// Tipos
interface Evento {
  id: number;
  nombre: string;
  descripcion: string;
  fechaCorta: string;
  fecha: string;
  hora: string;
  lugar: string;
  imagen: string;
  costo: string;
  precio: number;
  slug: string;
  destacado: boolean;
  categorias: string[];
  cupos: number;
  cuposDisponibles: number;
  requierePago: boolean;
  contacto: {
    telefono: string;
    email: string;
  };
}

// Datos de muestra para los eventos
const eventosData: Evento[] = [
  {
    id: 1,
    nombre: "Festival de Gastronomía Elite",
    descripcion: "Una celebración de sabores con los mejores chefs de la región. Degusta platillos únicos y participa en talleres culinarios.",
    fechaCorta: "15 Dic",
    fecha: "15 de Diciembre, 2024",
    hora: "6:00 PM - 11:00 PM",
    lugar: "Zona de Restaurantes",
    imagen: "/placeholder.svg",
    costo: "$45.000",
    precio: 45000,
    slug: "festival-gastronomia",
    destacado: true,
    categorias: ["Gastronomía", "Cultural"],
    cupos: 150,
    cuposDisponibles: 87,
    requierePago: true,
    contacto: {
      telefono: "+57 300 123 4567",
      email: "eventos@ccelite.com"
    }
  },
  {
    id: 2,
    nombre: "Concierto en Vivo - Noche de Jazz",
    descripcion: "Disfruta de una noche mágica con los mejores músicos de jazz de la ciudad. Una experiencia musical inolvidable.",
    fechaCorta: "22 Dic",
    fecha: "22 de Diciembre, 2024",
    hora: "8:00 PM - 11:00 PM",
    lugar: "Terraza Norte",
    imagen: "/placeholder.svg",
    costo: "$35.000",
    precio: 35000,
    slug: "concierto-jazz",
    destacado: true,
    categorias: ["Música", "Cultural"],
    cupos: 200,
    cuposDisponibles: 45,
    requierePago: true,
    contacto: {
      telefono: "+57 300 123 4567",
      email: "eventos@ccelite.com"
    }
  },
  {
    id: 3,
    nombre: "Feria de Emprendedores",
    descripcion: "Apoya a emprendedores locales y descubre productos únicos. Una oportunidad para conectar con la comunidad.",
    fechaCorta: "28 Dic",
    fecha: "28 de Diciembre, 2024",
    hora: "10:00 AM - 6:00 PM",
    lugar: "Plaza Central",
    imagen: "/placeholder.svg",
    costo: "Gratis",
    precio: 0,
    slug: "feria-emprendedores",
    destacado: false,
    categorias: ["Comercial", "Comunitario"],
    cupos: 500,
    cuposDisponibles: 320,
    requierePago: false,
    contacto: {
      telefono: "+57 300 123 4567",
      email: "eventos@ccelite.com"
    }
  },
  {
    id: 4,
    nombre: "Desfile de Moda Primavera-Verano",
    descripcion: "Conoce las últimas tendencias de la temporada. Las mejores marcas presentarán sus colecciones.",
    fechaCorta: "5 Ene",
    fecha: "5 de Enero, 2025",
    hora: "7:00 PM - 9:00 PM",
    lugar: "Pasarela Central",
    imagen: "/placeholder.svg",
    costo: "$25.000",
    precio: 25000,
    slug: "desfile-moda",
    destacado: false,
    categorias: ["Moda", "Tendencias"],
    cupos: 120,
    cuposDisponibles: 78,
    requierePago: true,
    contacto: {
      telefono: "+57 300 123 4567",
      email: "eventos@ccelite.com"
    }
  },
  {
    id: 5,
    nombre: "Exposición de Arte Contemporáneo",
    descripcion: "Admira las obras de artistas locales en nuestra galería temporal. Pinturas, esculturas y fotografías.",
    fechaCorta: "12 Ene",
    fecha: "12 de Enero, 2025",
    hora: "11:00 AM - 8:00 PM",
    lugar: "Galería Elite",
    imagen: "/placeholder.svg",
    costo: "$15.000",
    precio: 15000,
    slug: "exposicion-arte",
    destacado: true,
    categorias: ["Arte", "Cultural"],
    cupos: 300,
    cuposDisponibles: 156,
    requierePago: true,
    contacto: {
      telefono: "+57 300 123 4567",
      email: "eventos@ccelite.com"
    }
  },
  {
    id: 6,
    nombre: "Taller de Manualidades para Niños",
    descripcion: "Aprende a crear hermosas manualidades con materiales reciclados. Un taller para toda la familia.",
    fechaCorta: "19 Ene",
    fecha: "19 de Enero, 2025",
    hora: "3:00 PM - 6:00 PM",
    lugar: "Sala de Eventos",
    imagen: "/placeholder.svg",
    costo: "$20.000",
    precio: 20000,
    slug: "taller-manualidades",
    destacado: false,
    categorias: ["Familiar", "Educativo"],
    cupos: 80,
    cuposDisponibles: 23,
    requierePago: true,
    contacto: {
      telefono: "+57 300 123 4567",
      email: "eventos@ccelite.com"
    }
  }
];

export default function EventosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const { isAuthenticated } = useAuth();

  const categories = ["Todas", "Gastronomía", "Cultural", "Música", "Moda", "Arte", "Familiar", "Educativo", "Comercial", "Comunitario"];

  const filteredEvents = eventosData.filter(evento => {
    const matchesSearch = evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || selectedCategory === "Todas" || 
                           evento.categorias.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case "fecha":
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      case "precio-asc":
        return a.precio - b.precio;
      case "precio-desc":
        return b.precio - a.precio;
      case "cupos":
        return a.cuposDisponibles - b.cuposDisponibles;
      default:
        return 0;
    }
  });

  const handleRegister = (evento: Evento) => {
    if (!isAuthenticated) {
      // Redirigir al login
      window.location.href = '/login';
      return;
    }
    setSelectedEvent(evento);
    setShowRegistrationModal(true);
  };

  const getCuposPercentage = (disponibles: number, total: number): number => {
    return Math.round((disponibles / total) * 100);
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="hero relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={assets.hero_eventos}
            alt="Eventos Centro Comercial Elite"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
        </div>
        <div className="hero-content text-center">
          <h1 className="text-display text-4xl md:text-6xl font-bold text-white mb-6">
            Eventos y Actividades
          </h1>
          <p className="text-xl text-neutral-200 max-w-3xl mx-auto">
            Descubre todas las actividades y eventos que tenemos preparados para ti
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
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative w-full lg:w-auto">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input pr-10"
                >
                  <option value="">Ordenar por</option>
                  <option value="fecha">Fecha</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                  <option value="cupos">Cupos disponibles</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos Destacados */}
      <section className="section">
        <div className="container-modern">
          <div className="text-center mb-16">
            <h2 className="text-display text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Eventos Destacados
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              No te pierdas nuestras actividades más populares y especiales
            </p>
          </div>

          <div className="grid-cards">
            {sortedEvents
              .filter(evento => evento.destacado)
              .map(evento => (
                <div key={evento.id} className="event-card group">
                  <div className="relative overflow-hidden">
                    <Image
                      src={evento.imagen || "/placeholder.svg"}
                      alt={evento.nombre}
                      width={400}
                      height={250}
                      className="event-image group-hover:scale-105"
                    />
                    <div className="event-badge">
                      {evento.fechaCorta}
                    </div>
                    {evento.destacado && (
                      <div className="absolute top-4 right-4 bg-accent-yellow text-neutral-900 px-3 py-1 rounded-2xl text-sm font-semibold">
                        Destacado
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="card-body">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-neutral-900">
                        {evento.nombre}
                      </h3>
                      <span className={`text-lg font-bold ${evento.precio === 0 ? 'text-success-600' : 'text-secondary-600'}`}>
                        {evento.costo}
                      </span>
                    </div>
                    
                    <p className="text-neutral-600 mb-4 leading-relaxed line-clamp-2">
                      {evento.descripcion}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Calendar size={16} />
                        <span>{evento.fecha}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Clock size={16} />
                        <span>{evento.hora}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <MapPin size={16} />
                        <span>{evento.lugar}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Users size={16} />
                        <span>{evento.cuposDisponibles} de {evento.cupos} cupos disponibles</span>
                      </div>
                    </div>

                    {/* Barra de progreso de cupos */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-neutral-600 mb-1">
                        <span>Cupos disponibles</span>
                        <span>{getCuposPercentage(evento.cuposDisponibles, evento.cupos)}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            getCuposPercentage(evento.cuposDisponibles, evento.cupos) > 50 
                              ? 'bg-success' 
                              : getCuposPercentage(evento.cuposDisponibles, evento.cupos) > 20 
                                ? 'bg-warning' 
                                : 'bg-error'
                          }`}
                          style={{ width: `${getCuposPercentage(evento.cuposDisponibles, evento.cupos)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {evento.categorias.map((categoria, index) => (
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
                      <button
                        onClick={() => handleRegister(evento)}
                        className="btn-secondary"
                        disabled={evento.cuposDisponibles === 0}
                      >
                        {evento.cuposDisponibles === 0 ? 'Agotado' : 'Registrarse'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Todos los Eventos */}
      <section className="section bg-white">
        <div className="container-modern">
          <div className="text-center mb-16">
            <h2 className="text-display text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Todos los Eventos
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Explora nuestra completa agenda de actividades
            </p>
          </div>

          <div className="grid-cards">
            {sortedEvents.map(evento => (
              <div key={evento.id} className="event-card group">
                <div className="relative overflow-hidden">
                  <Image
                    src={evento.imagen || "/placeholder.svg"}
                    alt={evento.nombre}
                    width={400}
                    height={250}
                    className="event-image group-hover:scale-105"
                  />
                  <div className="event-badge">
                    {evento.fechaCorta}
                  </div>
                  {evento.destacado && (
                    <div className="absolute top-4 right-4 bg-accent-yellow text-neutral-900 px-3 py-1 rounded-2xl text-sm font-semibold">
                      Destacado
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="card-body">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-neutral-900">
                      {evento.nombre}
                    </h3>
                    <span className={`text-lg font-bold ${evento.precio === 0 ? 'text-success-600' : 'text-secondary-600'}`}>
                      {evento.costo}
                    </span>
                  </div>
                  
                  <p className="text-neutral-600 mb-4 leading-relaxed line-clamp-2">
                    {evento.descripcion}
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Calendar size={16} />
                      <span>{evento.fecha}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Clock size={16} />
                      <span>{evento.hora}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <MapPin size={16} />
                      <span>{evento.lugar}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Users size={16} />
                      <span>{evento.cuposDisponibles} de {evento.cupos} cupos disponibles</span>
                    </div>
                  </div>

                  {/* Barra de progreso de cupos */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-neutral-600 mb-1">
                      <span>Cupos disponibles</span>
                      <span>{getCuposPercentage(evento.cuposDisponibles, evento.cupos)}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          getCuposPercentage(evento.cuposDisponibles, evento.cupos) > 50 
                            ? 'bg-success' 
                            : getCuposPercentage(evento.cuposDisponibles, evento.cupos) > 20 
                              ? 'bg-warning' 
                              : 'bg-error'
                        }`}
                        style={{ width: `${getCuposPercentage(evento.cuposDisponibles, evento.cupos)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {evento.categorias.map((categoria, index) => (
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
                    <button
                      onClick={() => handleRegister(evento)}
                      className="btn-secondary"
                      disabled={evento.cuposDisponibles === 0}
                    >
                      {evento.cuposDisponibles === 0 ? 'Agotado' : 'Registrarse'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Registro */}
      {showRegistrationModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowRegistrationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                Registrarse para: {selectedEvent.nombre}
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Fecha:</span>
                  <span className="font-medium">{selectedEvent.fecha}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Hora:</span>
                  <span className="font-medium">{selectedEvent.hora}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Lugar:</span>
                  <span className="font-medium">{selectedEvent.lugar}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Costo:</span>
                  <span className="font-bold text-secondary-600">{selectedEvent.costo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Cupos disponibles:</span>
                  <span className="font-medium">{selectedEvent.cuposDisponibles}</span>
                </div>
              </div>

              {selectedEvent.requierePago ? (
                <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-neutral-900 mb-2">Información de Pago</h4>
                  <p className="text-sm text-neutral-600 mb-4">
                    Este evento requiere pago. Por favor contacta a nuestro equipo para completar tu registro.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} className="text-secondary-600" />
                      <span>{selectedEvent.contacto.telefono}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={16} className="text-secondary-600" />
                      <span>{selectedEvent.contacto.email}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-success/10 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-success mb-2">¡Evento Gratuito!</h4>
                  <p className="text-sm text-neutral-600">
                    Este evento es completamente gratuito. Tu registro será confirmado por email.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  className="btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Aquí iría la lógica de registro
                    alert('Registro exitoso! Te contactaremos pronto.');
                    setShowRegistrationModal(false);
                  }}
                  className="btn-primary flex-1"
                >
                  Confirmar Registro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

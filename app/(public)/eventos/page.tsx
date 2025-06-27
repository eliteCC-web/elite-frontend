/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Calendar, MapPin, Clock, Users, Filter, Search, Heart, Share2, Phone, Mail, Star } from 'lucide-react';
import assets from "@/public/assets";
import { useAuth } from "@/hooks/useAuth";
import EventService, { type Event } from "@/services/event.service";
import EventCard from '@/components/EventCard';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await EventService.getAllEvents(1, 50);
        setEvents(response.data);
      } catch (err: any) {
        console.error('Error fetching events:', err);
        setError('Error al cargar los eventos');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case "fecha":
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      case "precio-asc":
        return a.price - b.price;
      case "precio-desc":
        return b.price - a.price;
      case "cupos":
        return a.registeredCount - b.registeredCount;
      default:
        return 0;
    }
  });

  const handleRegister = (evento: Event) => {
    if (!isAuthenticated) {
      // Redirigir al login
      window.location.href = '/login';
      return;
    }
    // Aquí iría la lógica de registro
    console.log('Registrando para evento:', evento.name);
  };

  const getCuposPercentage = (disponibles: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((disponibles / total) * 100);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main>
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

        

        {/* Eventos Destacados */}
        <section className="py-20">
          <div className="container-modern">
            {/* Filtros y Búsqueda */}{/* Filtros y Búsqueda */}
            <div className="mb-12">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Buscar eventos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-80"
                    />
                  </div>
                </div>
                
              </div>
            </div>
            

            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                Eventos Destacados
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Descubre los eventos más emocionantes que tenemos preparados para ti
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="spinner w-8 h-8 mx-auto mb-4"></div>
                <p className="text-neutral-600">Cargando eventos destacados...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-error/10 text-error p-4 rounded-xl border border-error/20 max-w-md mx-auto">
                  {error}
                </div>
              </div>
            ) : sortedEvents.filter(evento => evento.isFeatured).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600">No hay eventos destacados disponibles en este momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {sortedEvents
                  .filter(evento => evento.isFeatured)
                  .map((evento) => (
                    <EventCard key={evento.id} event={evento} />
                  ))}
              </div>
            )}
          </div>
        </section>

        {/* Todos los Eventos */}
        <section className="py-20 bg-neutral-50">
          <div className="container-modern">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                Todos los Eventos
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Explora nuestra completa agenda de eventos y actividades
              </p>
            </div>

            {/* Lista de Eventos */}
            {loading ? (
              <div className="text-center py-12">
                <div className="spinner w-8 h-8 mx-auto mb-4"></div>
                <p className="text-neutral-600">Cargando eventos...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-error/10 text-error p-4 rounded-xl border border-error/20 max-w-md mx-auto">
                  {error}
                </div>
              </div>
            ) : sortedEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600">No se encontraron eventos que coincidan con tu búsqueda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedEvents.map((evento) => (
                  <EventCard key={evento.id} event={evento} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}


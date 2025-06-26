/* eslint-disable */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Clock, Users, ShoppingBag, Star, ChevronRight } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import assets from '@/public/assets';
import { getPublicUrl } from '@/lib/utils';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import type React from "react"
import { useEffect, useState } from "react"
import StoreService, { type Store } from "@/services/store.service"
import StoreCard from '@/components/StoreCard';
import EventService, { type Event as EventType } from "@/services/event.service"
import { default as EventCardComponent } from '@/components/EventCard';
import { FeaturesCarousel } from '@/components/FeaturesCarousel';

export default function HomePage() {
  const [featuredStores, setFeaturedStores] = useState<Store[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [storesResponse, eventsResponse] = await Promise.all([
          StoreService.getAllStores(1, 3),
          EventService.getAllEvents(1, 6)
        ]);
        setFeaturedStores(storesResponse.data);
        const featuredEvents = eventsResponse.data.filter(event => event.isFeatured).slice(0, 3);
        setFeaturedEvents(featuredEvents);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - fuera del hero para evitar superposición */}
      <Navbar />

      {/* Hero Section - Pantalla completa */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo con overlay oscuro */}
        <div className="absolute inset-0 z-0">
          <Image
            src={getPublicUrl('elitecc-web//hero%20HD.jpg')}
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
                  src={getPublicUrl('elitecc-web//isotipo.png')}
                  alt="Logo Elite"
                  width={120}
                  height={120}
                  className="drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
              elite
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
            ) : featuredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600">No hay eventos disponibles en este momento.</p>
              </div>
            ) : (
              <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredEvents.map((event) => (
                    <EventCardComponent key={event.id} event={event} isFeatured={event.isFeatured} />
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
              </>
            )}
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

            {loading ? (
              <div className="text-center py-12">
                <div className="spinner w-8 h-8 mx-auto mb-4"></div>
                <p className="text-neutral-600">Cargando tiendas destacadas...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-error/10 text-error p-4 rounded-xl border border-error/20 max-w-md mx-auto">
                  {error}
                </div>
              </div>
            ) : featuredStores.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600">No hay tiendas disponibles en este momento.</p>
              </div>
            ) : (
              <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {featuredStores.slice(0, 3).map((store) => (
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
              </>
            )}
          </div>
        </section>

        {/* Características del Centro Comercial 
        <FeaturesCarousel />*/}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

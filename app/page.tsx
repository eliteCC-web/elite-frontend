/* eslint-disable */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ShoppingBag, Star, ChevronRight, ArrowRight, Sparkles, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { getPublicUrl } from '@/lib/utils';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { useEffect, useState } from 'react';
import StoreService, { type Store } from '@/services/store.service';
import StoreCard from '@/components/StoreCard';
import EventService, { type Event as EventType } from '@/services/event.service';
import { default as EventCardComponent } from '@/components/EventCard';
import { FeaturesCarousel } from '@/components/FeaturesCarousel';
import { VideoSection } from '@/components/VideoSection';
import { MapSection } from '@/components/MapSection';
import { RadioPlayer } from '@/components/RadioPlayer';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
};

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
        const featured = eventsResponse.data.filter(event => event.isFeatured).slice(0, 3);
        setFeaturedEvents(featured);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroStats = [
    { value: "8", label: "Pisos de Experiencias" },
    { value: "200+", label: "Locales Únicos" },
    { value: "24/7", label: "Seguridad Garantizada" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <RadioPlayer />

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION - Full screen with gradient overlay & glass stats
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={getPublicUrl('elitecc-web//hero%20HD.jpg')}
            alt="Elite Centro Comercial"
            fill
            unoptimized
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-8 flex justify-center">
              <Image
                src={getPublicUrl('elitecc-web//isotipo.png')}
                alt="Logo Elite"
                width={100}
                height={100}
                unoptimized
                className="drop-shadow-2xl"
                priority
              />
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-4 tracking-tighter">
              elite
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/80 font-light tracking-[0.3em] uppercase mb-8">
              Centro Comercial
            </p>

            <div className="mb-12">
              <TextGenerateEffect
                words="Descubre una experiencia de compra única donde la elegancia se encuentra con la innovación"
                className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                textColor="text-white/70"
                duration={0.8}
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tiendas"
                className="group inline-flex items-center gap-3 bg-white text-primary-500 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <ShoppingBag size={20} />
                Explorar Tiendas
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/eventos"
                className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <Calendar size={20} />
                Ver Eventos
              </Link>
            </div>
          </motion.div>
        </div>

      </section>

      {/* Stats Bridge Section */}
      <div className="relative z-20 -mt-12 mb-0">
        <div className="container-modern">
          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto">
            {heroStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.1 }}
                className="bg-primary-500 rounded-2xl p-4 md:p-6 text-center shadow-strong"
              >
                <div className="text-2xl md:text-4xl font-black mb-1" style={{ color: '#ffffff' }}>{stat.value}</div>
                <div className="text-[10px] md:text-sm font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white">

        {/* ═══════════════════════════════════════════
            FEATURES - Bento Grid
           ═══════════════════════════════════════════ */}
        <FeaturesCarousel />

        {/* ═══════════════════════════════════════════
            VIDEO SECTION
           ═══════════════════════════════════════════ */}
        <VideoSection
          videoSrc={getPublicUrl('elitecc-web//videos/present_paneles_solares%20(1).mp4')}
          posterSrc={getPublicUrl('elitecc-web//hero%20HD.jpg')}
          title="Vive la Experiencia Elite"
          description="Sumérgete en la atmósfera única de nuestro centro comercial a través de este recorrido virtual"
          stats={[
            { value: "8", label: "Pisos de Experiencias" },
            { value: "200+", label: "Locales Únicos" },
            { value: "24/7", label: "Seguridad Garantizada" }
          ]}
        />

        {/* ═══════════════════════════════════════════
            FEATURED EVENTS
           ═══════════════════════════════════════════ */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />

          <div className="container-modern relative">
            <motion.div {...fadeInUp} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-secondary-50 text-secondary-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles size={16} />
                No te lo pierdas
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                Eventos{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-500 to-secondary-400">
                  Destacados
                </span>
              </h2>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                Descubre los eventos más emocionantes que tenemos preparados para ti
              </p>
            </motion.div>

            {loading ? (
              <div className="text-center py-12">
                <div className="spinner w-8 h-8 mx-auto mb-4"></div>
                <p className="text-neutral-600">Cargando eventos destacados...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-md mx-auto">
                  {error}
                </div>
              </div>
            ) : featuredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600">No hay eventos disponibles en este momento.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {featuredEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <EventCardComponent event={event} isFeatured={event.isFeatured} />
                    </motion.div>
                  ))}
                </div>

                <motion.div {...fadeInUp} className="text-center">
                  <Link
                    href="/eventos"
                    className="group inline-flex items-center gap-3 bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    Ver Todos los Eventos
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FEATURED STORES
           ═══════════════════════════════════════════ */}
        <section className="py-24 bg-neutral-50">
          <div className="container-modern">
            <motion.div {...fadeInUp} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <ShoppingBag size={16} />
                Descubre
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                Tiendas{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-400">
                  Destacadas
                </span>
              </h2>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
                Explora nuestras tiendas más populares y descubre productos únicos
              </p>
            </motion.div>

            {loading ? (
              <div className="text-center py-12">
                <div className="spinner w-8 h-8 mx-auto mb-4"></div>
                <p className="text-neutral-600">Cargando tiendas destacadas...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-md mx-auto">
                  {error}
                </div>
              </div>
            ) : featuredStores.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600">No hay tiendas disponibles en este momento.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {featuredStores.slice(0, 3).map((store, i) => (
                    <motion.div
                      key={store.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <StoreCard store={store} />
                    </motion.div>
                  ))}
                </div>

                <motion.div {...fadeInUp} className="text-center">
                  <Link
                    href="/tiendas"
                    className="group inline-flex items-center gap-3 bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    Ver Todas las Tiendas
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            RADIO SECTION
           ═══════════════════════════════════════════ */}
        <section className="py-16 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 relative overflow-hidden">
          <div className="container-modern relative">
            <motion.div
              {...fadeInUp}
              className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
            >
              <div className="text-white flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-sm font-medium uppercase tracking-widest text-white/70">En Vivo</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-3 justify-center md:justify-start">
                  <Radio size={28} />
                  Elite Radio
                </h2>
                <p className="text-white/60 max-w-md">
                  Escucha la mejor música mientras disfrutas de tu experiencia en el centro comercial
                </p>
              </div>
              <div className="w-full md:flex-1 md:max-w-2xl bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 shadow-lg">
                <iframe
                  src="https://cloud8.vsgtech.co/cp/widgets/player/single/?p=8072"
                  height="110"
                  width="100%"
                  scrolling="no"
                  allow="autoplay"
                  style={{ border: 'none' }}
                  title="Elite Radio Player"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            MAP SECTION
           ═══════════════════════════════════════════ */}
        <MapSection />

        {/* ═══════════════════════════════════════════
            FOOTER
           ═══════════════════════════════════════════ */}
        <Footer />
      </div>
    </div>
  );
}

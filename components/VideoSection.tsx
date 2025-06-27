"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { getPublicUrl } from '@/lib/utils';

interface VideoSectionProps {
  videoSrc: string;
  posterSrc?: string;
  title: string;
  description: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export function VideoSection({ 
  videoSrc = getPublicUrl('elitecc-web//videos/present_paneles_solares%20(1).mp4'), 
  posterSrc = getPublicUrl('elitecc-web//hero%20HD.jpg'), 
  title, 
  description, 
  stats = [
    { value: "8", label: "Pisos de Experiencias" },
    { value: "200+", label: "Locales Únicos" },
    { value: "24/7", label: "Seguridad Garantizada" }
  ]
}: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container-modern">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            {title}
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Contenedor del video con bordes redondeados y sombra */}
          <div className="relative overflow-hidden rounded-3xl shadow-strong bg-neutral-900">
            {/* Video principal */}
            <div 
              className="relative aspect-video w-full cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => isPlaying && setShowControls(false)}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster={posterSrc}
                preload="metadata"
                onClick={togglePlay}
              >
                <source src={videoSrc} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
              
              {/* Overlay decorativo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
              
              {/* Controles personalizados */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <button
                  onClick={togglePlay}
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-200 group"
                >
                  {isPlaying ? (
                    <Pause size={24} className="text-white" />
                  ) : (
                    <Play size={24} className="text-white ml-1" />
                  )}
                </button>
              </div>

              {/* Barra de progreso y controles */}
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Barra de progreso */}
                <div className="mb-3">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleTimeUpdate}
                    className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) 100%)`
                    }}
                  />
                </div>

                {/* Controles inferiores */}
                <div className="flex items-center justify-between text-white text-sm">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="hover:text-blue-400 transition-colors">
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button onClick={toggleMute} className="hover:text-blue-400 transition-colors">
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>
                  <button onClick={toggleFullscreen} className="hover:text-blue-400 transition-colors">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Información adicional debajo del video */}
            <div className="p-8 bg-gradient-to-b from-neutral-900 to-neutral-800 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">{stat.value}</div>
                    <div className="text-sm text-neutral-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-secondary-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-lg text-neutral-600 mb-6">
            ¿Listo para experimentar Elite en persona?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tiendas" 
              className="btn-primary btn-lg rounded-2xl group"
            >
              Explorar Tiendas
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link 
              href="/eventos" 
              className="btn-outline btn-lg rounded-2xl group"
            >
              Ver Eventos
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 
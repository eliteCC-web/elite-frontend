"use client";

import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export function FeaturesCarousel() {
  const features = [
    {
      title: "Somos Pet Friendly",
      image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop",
      description: "Trae a tu mascota y disfruta juntos"
    },
    {
      title: "Zona Coworking",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
      description: "Espacios de trabajo modernos y cómodos"
    },
    {
      title: "8 Pisos de Experiencias",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      description: "Descubre cada nivel de diversión"
    },
    {
      title: "Estacionamiento Gratuito",
      image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop",
      description: "Comodidad para todos nuestros visitantes"
    },
    {
      title: "WiFi de Alta Velocidad",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
      description: "Conectividad en todo el centro"
    },
    {
      title: "Seguridad 24/7",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      description: "Tu seguridad es nuestra prioridad"
    },
    {
      title: "Accesibilidad Total",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      description: "Diseñado para todos"
    },
    {
      title: "Eventos Especiales",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
      description: "Actividades únicas cada semana"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container-modern">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            ¿Por qué elegir Elite?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre todas las comodidades y servicios que hacen de Elite el lugar perfecto para ti
          </p>
        </div>
        
        <div className="h-[400px] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={features}
            direction="right"
            speed="slow"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
} 
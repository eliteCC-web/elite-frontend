"use client";

import React from "react";
// import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { Carousel } from "./ui/carousel";
import { getPublicUrl } from "@/lib/utils";

export function FeaturesCarousel() {
  const features = [
    {
      title: "Pet Friendly",
      image: getPublicUrl('elitecc-web//mascotad.png'),
      description: "Trae a tu mascota y disfruta juntos"
    },
    {
      title: "Zona Coworking",
      image: getPublicUrl('elitecc-web//internet.png'),
      description: "WiFi Gratuito y espacios de trabajo modernos y cómodos"
    },
    {
      title: "Restaurantes",
      image: getPublicUrl('elitecc-web//bannr.png'),
      description: "Gastronomía de primera calidad"
    },
    {
      title: "Parking Robotizado",
      image: getPublicUrl('elitecc-web//PARKING%20(1).png'),
      description: "Parqueadero automatizado y seguro"
    },
    {
      title: "Marcas Propias",
      image: getPublicUrl('elitecc-web//marcas.png'),
      description: "Exclusividad y calidad garantizada"
    }
  ];

  // Convertir los features al formato que espera el nuevo carousel
  const slides = features.map(feature => ({
    title: feature.title,
    button: "Conocer más",
    src: feature.image
  }));

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container-modern">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            ¿Por qué elegir elite?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre todas las comodidades y servicios que hacen de Elite el lugar perfecto para ti
          </p>
        </div>
        
        {/* Carousel anterior comentado */}
        {/* <div className="h-[500px] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={features}
            direction="right"
            speed="slow"
            className="w-full"
          />
        </div> */}
        
        {/* Nuevo carousel con cards y flechas */}
        <div className="relative overflow-hidden w-full h-full py-20">
          <Carousel slides={slides} />
        </div>
      </div>
    </section>
  );
} 
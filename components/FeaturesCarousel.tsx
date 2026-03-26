"use client";

import React from "react";
import { motion } from "framer-motion";
import { getPublicUrl } from "@/lib/utils";

export function FeaturesCarousel() {
  const features = [
    {
      title: "Pet Friendly",
      image: getPublicUrl('elitecc-web//mascotad.png'),
      description: "Trae a tu mascota y disfruta juntos de una experiencia única"
    },
    {
      title: "Zona Coworking",
      image: getPublicUrl('elitecc-web//internet.png'),
      description: "WiFi gratuito y espacios de trabajo"
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

  return (
    <section className="py-24 bg-neutral-50">
      <div className="container-modern">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="text-center mb-16"
        >
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            ¿Por qué elegir{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
              Elite
            </span>
            ?
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Descubre todas las comodidades y servicios que hacen de Elite el lugar perfecto para ti
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[160px] sm:auto-rows-[180px] md:auto-rows-[220px]">
          {/* Large card - Pet Friendly */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer"
          >
            <img
              src={features[0].image}
              alt={features[0].title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{features[0].title}</h3>
              <p className="text-white/70 text-sm md:text-base">{features[0].description}</p>
            </div>
          </motion.div>

          {/* Small cards */}
          {features.slice(1).map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
            >
              <img
                src={feature.image}
                alt={feature.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-0.5">{feature.title}</h3>
                <p className="text-white/60 text-xs md:text-sm line-clamp-2 hidden sm:block">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

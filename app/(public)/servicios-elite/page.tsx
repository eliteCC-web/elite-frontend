"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, PawPrint, Wifi, Utensils, Car, ShoppingBag } from "lucide-react";
import { getPublicUrl } from "@/lib/utils";

export default function ServiciosElitePage() {
  const servicios = [
    {
      id: "pet-friendly",
      title: "Pet Friendly",
      icon: <PawPrint className="h-8 w-8 text-primary-600" />,
      image: getPublicUrl('elitecc-web//mascotad.png'),
      description: "En Elite Centro Comercial entendemos que las mascotas son parte de la familia. Por eso hemos creado espacios especialmente diseñados para que puedas disfrutar junto a tu compañero peludo.",
      features: [
        "Áreas designadas para mascotas",
        "Estaciones de hidratación",
        "Zonas de descanso para mascotas",
        "Política de mascotas amigable"
      ],
      details: "Nuestro centro comercial es completamente pet-friendly, permitiendo el ingreso de mascotas en todas las áreas comunes. Contamos con espacios específicos donde tu mascota puede descansar, hidratarse y socializar con otros animales. Las mascotas deben estar con correa y bajo supervisión de sus dueños en todo momento."
    },
    {
      id: "coworking",
      title: "Zona Coworking",
      icon: <Wifi className="h-8 w-8 text-primary-600" />,
      image: getPublicUrl('elitecc-web//internet.png'),
      description: "Espacios de trabajo modernos y cómodos con WiFi gratuito de alta velocidad para que puedas trabajar desde donde quieras.",
      features: [
        "WiFi gratuito de alta velocidad",
        "Espacios de trabajo ergonómicos",
        "Salas de reuniones disponibles",
        "Café y snacks cercanos"
      ],
      details: "Nuestra zona coworking está diseñada para maximizar tu productividad. Con conexión WiFi gratuita de alta velocidad, escritorios ergonómicos y espacios tranquilos para concentrarte. También contamos con salas de reuniones que puedes reservar para tus presentaciones o reuniones de trabajo."
    },
    {
      id: "restaurantes",
      title: "Restaurantes",
      icon: <Utensils className="h-8 w-8 text-primary-600" />,
      image: getPublicUrl('elitecc-web//bannr.png'),
      description: "Gastronomía de primera calidad con una amplia variedad de opciones culinarias para todos los gustos y presupuestos.",
      features: [
        "Restaurantes de alta cocina",
        "Cafeterías y bistrós",
        "Comida rápida y casual",
        "Opción de delivery"
      ],
      details: "Nuestro centro comercial cuenta con una amplia variedad de opciones gastronómicas. Desde restaurantes de alta cocina hasta cafeterías casuales, pasando por comida rápida y opciones saludables. Todos nuestros establecimientos cumplen con los más altos estándares de calidad y servicio."
    },
    {
      id: "parking",
      title: "Parking Robotizado",
      icon: <Car className="h-8 w-8 text-primary-600" />,
      image: getPublicUrl('elitecc-web//PARKING%20(1).png'),
      description: "Sistema de parqueadero automatizado y seguro que maximiza el espacio y garantiza la protección de tu vehículo.",
      features: [
        "Sistema automatizado de estacionamiento",
        "Seguridad 24/7",
        "Máximo aprovechamiento del espacio",
        "Acceso rápido y eficiente"
      ],
      details: "Nuestro parking robotizado es una solución innovadora que maximiza el espacio disponible y garantiza la seguridad de tu vehículo. El sistema automatizado permite un acceso rápido y eficiente, eliminando la necesidad de buscar espacio de estacionamiento. Contamos con vigilancia 24/7 y sistemas de seguridad avanzados."
    },
    {
      id: "marcas",
      title: "Marcas Propias",
      icon: <ShoppingBag className="h-8 w-8 text-primary-600" />,
      image: getPublicUrl('elitecc-web//marcas.png'),
      description: "Exclusividad y calidad garantizada con nuestras marcas propias que ofrecen productos únicos y de alta calidad.",
      features: [
        "Productos exclusivos",
        "Calidad garantizada",
        "Precios competitivos",
        "Diseños únicos"
      ],
      details: "Nuestras marcas propias representan la exclusividad y calidad que caracteriza a Elite Centro Comercial. Cada producto ha sido cuidadosamente seleccionado y diseñado para ofrecer la mejor experiencia a nuestros clientes. Desde ropa y accesorios hasta productos para el hogar, nuestras marcas propias garantizan calidad y diseño únicos."
    }
  ];

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-white border-b border-neutral-100">
        <div className="container-modern py-6">
          <Link href="/" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 transition-colors mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Volver al Inicio
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              Servicios Elite
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Descubre todas las comodidades y servicios que hacen de Elite el lugar perfecto para ti
            </p>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16">
        <div className="container-modern">
          <div className="space-y-24">
            {servicios.map((servicio, index) => (
              <div key={servicio.id} className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                {/* Imagen */}
                <div className="flex-1">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <Image
                      src={servicio.image}
                      alt={servicio.title}
                      width={600}
                      height={400}
                      className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary-100 rounded-xl">
                      {servicio.icon}
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900">
                      {servicio.title}
                    </h2>
                  </div>

                  <p className="text-lg text-neutral-600 leading-relaxed">
                    {servicio.description}
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-neutral-900">
                      ¿Qué incluye?
                    </h3>
                    <ul className="space-y-2">
                      {servicio.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary-500 rounded-full" />
                          <span className="text-neutral-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-3">
                      Más información
                    </h4>
                    <p className="text-neutral-600 leading-relaxed">
                      {servicio.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </main>
  );
} 
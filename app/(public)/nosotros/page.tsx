import React from 'react';
import Image from 'next/image';
import { Star, Users, ShoppingBag, Clock, Award, Heart, Shield, TrendingUp } from 'lucide-react';

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-white text-neutral-900 py-20">
        <div className="container-modern">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Sobre Elite
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-600 leading-relaxed">
              Uno de los mejores centros comerciales por su atención excepcional, 
              gran variedad de opciones y calidad de servicio
            </p>
          </div>
        </div>
        <div className="border-b border-neutral-200 mt-12"></div>
      </section>

      {/* Características Destacadas */}
      <section className="py-16 bg-white">
        <div className="container-modern">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white border-2 border-primary-500 shadow-soft">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Gran Variedad</h3>
              <p className="text-neutral-600">Amplia selección de tiendas y servicios para todos los gustos</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white border-2 border-secondary-500 shadow-soft">
              <div className="w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Horarios Extendidos</h3>
              <p className="text-neutral-600">Disponibilidad amplia para tu comodidad</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white border-2 border-accent-yellow shadow-soft">
              <div className="w-16 h-16 bg-accent-yellow rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-neutral-900" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Personal Colaborador</h3>
              <p className="text-neutral-600">Equipo comprometido con tu satisfacción</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white border-2 border-neutral-600 shadow-soft">
              <div className="w-16 h-16 bg-neutral-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Historia y Reputación</h3>
              <p className="text-neutral-600">Años de experiencia y confianza ganada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Información General */}
      <section className="py-16 bg-neutral-50">
        <div className="container-modern">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-8">
              ¿Por qué elegir Elite?
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">Atención Excepcional</h3>
                    <p className="text-neutral-600">Nos destacamos por brindar un servicio personalizado y cercano a cada visitante.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">Innovación Constante</h3>
                    <p className="text-neutral-600">Siempre buscamos nuevas formas de mejorar tu experiencia de compra.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-yellow rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield size={24} className="text-neutral-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">Clientes de Calidad</h3>
                    <p className="text-neutral-600">Atendemos tanto clientes internos como externos con los más altos estándares.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-soft">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star size={48} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">Nuestra Misión</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Ser el centro comercial preferido por nuestra comunidad, 
                    ofreciendo una experiencia única que combine variedad, 
                    calidad y servicio excepcional en un ambiente acogedor 
                    y moderno.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Administración */}
      <section className="py-16 bg-white">
        <div className="container-modern">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
                Nuestra Administración
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Conoce al equipo que hace posible la excelencia en Elite
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="relative overflow-hidden rounded-3xl shadow-strong">
                  <Image
                    src="https://pmulriauzstmyeslfvpn.supabase.co/storage/v1/object/public/elitecc-web//gerencia.jpg"
                    alt="Ángela Agudelo - Administradora"
                    width={400}
                    height={600}
                    className="w-full h-[600px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-2">
                    Ángela Agudelo
                  </h3>
                  <p className="text-lg text-secondary-600 font-semibold mb-4">
                    Administradora General
                  </p>
                </div>

                <div className="space-y-4 text-neutral-700 leading-relaxed">
                  <p>
                    Ángela Agudelo es una profesional destacada en el ámbito de la administración, 
                    conocida por su dedicación y compromiso en diversas funciones dentro de centros 
                    comerciales y proyectos de gran envergadura.
                  </p>
                  
                  <p>
                    Con una sólida formación y experiencia, Ángela ha sido parte integral de equipos 
                    que buscan la excelencia en el servicio al cliente y la optimización de recursos. 
                    Su capacidad para liderar y coordinar actividades ha sido reconocida en múltiples ocasiones.
                  </p>

                  <p>
                    Además de su labor profesional, Ángela es apreciada por su cercanía y amabilidad, 
                    lo que la convierte en una figura querida entre sus colegas y clientes. Su enfoque 
                    en el trabajo en equipo y su disposición para ayudar a los demás son características 
                    que la definen.
                  </p>

                  <p>
                    En resumen, Ángela Agudelo es una administradora ejemplar, cuya pasión por su trabajo 
                    y su dedicación a la comunidad la convierten en un referente en su campo.
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                    <Award size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Experiencia Comprobada</p>
                    <p className="text-sm text-neutral-600">Más de 10 años en gestión comercial</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 
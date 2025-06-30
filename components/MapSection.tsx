"use client";

import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function MapSection() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="container-modern">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Visítanos
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Encuentra Elite Centro Comercial en el corazón de Cali
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Información de contacto */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-soft">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                Información de Contacto
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-1">Dirección</h4>
                    <p className="text-neutral-600 leading-relaxed">
                      Calle 14 con Carrera 7<br />
                      Santiago de Cali, Valle del Cauca<br />
                      Colombia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-1">Teléfono</h4>
                    <p className="text-neutral-600">322 5283206</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-1">Email</h4>
                    <p className="text-neutral-600">elitecc.soporte@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-1">Horarios</h4>
                    <p className="text-neutral-600">
                      Lunes - Sábado<br />
                      09:00 - 21:00<br />
                      Domingo<br />
                      10:00 - 20:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de navegación */}
            <div className="text-center">
              <a 
                href="https://maps.app.goo.gl/GyCbMBSnxi3MG5GH8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary btn-lg rounded-2xl group inline-flex items-center gap-2"
              >
                <MapPin size={20} />
                Abrir en Google Maps
              </a>
            </div>
          </div>

          {/* Mapa embebido */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-strong">
            <div className="aspect-square w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1991.2920977143347!2d-76.53063126151838!3d3.450799399130917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a666f7a4acd7%3A0x245ce04ad23ac3bd!2sCentro%20Comercial%20Elite!5e0!3m2!1ses!2sco!4v1750983813900!5m2!1ses!2sco"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Centro Comercial Elite - Calle 14 con Carrera 7, Cali"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
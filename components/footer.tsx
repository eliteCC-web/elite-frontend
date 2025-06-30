/* eslint-disable */
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, Phone, MapPin, Clock, ArrowRight, Heart } from 'lucide-react';
import assets from "@/public/assets";
import { getPublicUrl } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="bg-white text-neutral-900 border-t border-neutral-200">
      {/* Main Footer */}
      <div className="container-modern py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Logo and About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src={getPublicUrl('elitecc-web//isotipo.png')}
                alt="Elite"
                width={40}
                height={40}
                className="drop-shadow-lg"
              />
              <div>
                <span className="text-display text-2xl font-bold text-neutral-900">elite</span>
                <span className="block text-sm text-neutral-500">Centro Comercial</span>
              </div>
            </div>
            <p className="text-neutral-600 mb-8 leading-relaxed max-w-md">
              Tu destino favorito para compras, gastronomía y entretenimiento. 
              Ofrecemos una experiencia única con las mejores marcas y servicios.
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://www.facebook.com/CentroComercialElite" icon={<Facebook size={20} />} />
              <SocialLink href="https://www.instagram.com/elitecentrocomercial/" icon={<Instagram size={20} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-neutral-900">Enlaces Rápidos</h3>
            <ul className="space-y-4">
              <FooterLink href="/tiendas">Tiendas</FooterLink>
              <FooterLink href="/eventos">Eventos</FooterLink>
              <FooterLink href="/nosotros">Nosotros</FooterLink>
              {/*<FooterLink href="/chatbot">Eli Chat</FooterLink>
              */}
              {/*<FooterLink href="/mapa">Mapa del CC</FooterLink>
              */}
              {/*<FooterLink href="/contacto">Contacto</FooterLink>
              */}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-neutral-900">Información</h3>
            <div className="space-y-6">
              {/* Contact */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-secondary-500 shrink-0 mt-1" size={18} />
                  <span className="text-neutral-600 text-sm">Calle 14 con Carrera 7, Cali</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-secondary-500" size={18} />
                  <span className="text-neutral-600 text-sm">322 5283206</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-secondary-500" size={18} />
                  <span className="text-neutral-600 text-sm">elitecc.soporte@gmail.com</span>
                </div>
              </div>

              {/* Hours */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="text-neutral-500" size={18} />
                  <span className="text-neutral-900 font-medium text-sm">Horarios</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Lunes - Sábado</span>
                    <span className="text-neutral-700">09:00 - 21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Domingo</span>
                    <span className="text-neutral-700">10:00 - 20:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
{/*
      <div className="border-t border-neutral-200">
        <div className="container-modern py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                ¿No quieres perderte nada?
              </h3>
              <p className="text-neutral-600 text-sm">
                Suscríbete a nuestro boletín y recibe las últimas novedades
              </p>
            </div>
            <div className="flex w-full lg:w-auto gap-3">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="input bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-500 flex-1 lg:w-80"
              />
              <button className="btn-primary btn-sm whitespace-nowrap">
                Suscribirse
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>*/}

      {/* Bottom */}
      <div className="border-t border-neutral-200">
        <div className="container-modern py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="text-center lg:text-left">
              <p className="text-neutral-500 text-sm">
                © {new Date().getFullYear()} Centro Comercial Elite. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacidad" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terminos" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                Términos y Condiciones
              </Link>
              <div className="flex items-center gap-2 text-neutral-500">
                <span>Hecho con</span>
                <Heart size={14} className="text-secondary-500 fill-current" />
                <span>en Cali</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-neutral-100 hover:bg-neutral-200 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 text-neutral-600 hover:text-neutral-900"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-neutral-500 hover:text-neutral-900 transition-colors duration-200 flex items-center gap-2 group"
      >
        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        {children}
      </Link>
    </li>
  );
} 
/* eslint-disable */
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, Phone, MapPin, Clock, ArrowRight, Heart } from 'lucide-react';
import { getPublicUrl } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      {/* Main Footer */}
      <div className="container-modern py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Logo and About */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Image
                  src={getPublicUrl('elitecc-web//isotipo.png')}
                  alt="Elite"
                  width={28}
                  height={28}
                  unoptimized
                  className="drop-shadow-lg"
                />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">elite</span>
                <span className="block text-sm text-neutral-400">Centro Comercial</span>
              </div>
            </div>
            <p className="text-neutral-400 mb-8 leading-relaxed max-w-md">
              Tu destino favorito para compras, gastronomía y entretenimiento.
              Ofrecemos una experiencia única con las mejores marcas y servicios.
            </p>
            <div className="flex gap-3">
              <SocialLink href="https://www.facebook.com/CentroComercialElite" icon={<Facebook size={18} />} />
              <SocialLink href="https://www.instagram.com/elitecentrocomercial/" icon={<Instagram size={18} />} />
              <SocialLink href="https://www.tiktok.com/@elitecali?_t=ZS-8xgMvJe8Nlq&_r=1" icon={<TikTokIcon />} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <FooterLink href="/tiendas">Tiendas</FooterLink>
              <FooterLink href="/servicios">Servicios</FooterLink>
              <FooterLink href="/eventos">Eventos</FooterLink>
              <FooterLink href="/nosotros">Nosotros</FooterLink>
              <FooterLink href="/servicios-elite">Servicios Elite</FooterLink>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="lg:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-6">Información</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={16} className="text-secondary-400" />
                </div>
                <span className="text-neutral-300 text-sm">Calle 14 con Carrera 7, Cali</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-secondary-400" />
                </div>
                <span className="text-neutral-300 text-sm">322 5283206</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-secondary-400" />
                </div>
                <span className="text-neutral-300 text-sm">elitecc.soporte@gmail.com</span>
              </div>

              {/* Hours */}
              <div className="mt-6 bg-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-neutral-500" />
                  <span className="text-neutral-300 font-medium text-sm">Horarios</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Lunes - Sábado</span>
                    <span className="text-neutral-300 font-medium">09:00 - 21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Domingo</span>
                    <span className="text-neutral-300 font-medium">10:00 - 20:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="container-modern py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <p className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} Centro Comercial Elite. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacidad" className="text-neutral-500 hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link href="/terminos" className="text-neutral-500 hover:text-white transition-colors">
                Términos
              </Link>
              <div className="flex items-center gap-2 text-neutral-500">
                <span>Hecho con</span>
                <Heart size={12} className="text-secondary-500 fill-current" />
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
      className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 text-neutral-400 hover:text-white"
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
        className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group"
      >
        <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
        {children}
      </Link>
    </li>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

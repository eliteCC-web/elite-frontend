/* eslint-disable */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag, Calendar, Users, MessageCircle, ChevronDown, Home } from 'lucide-react';
import { cn } from "@/lib/utils";
import assets from "@/public/assets";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleHomeClick = () => {
    setIsMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={assets.logo_png}
              alt="Centro Comercial Elite"
              width={50}
              height={50}
            />
            <span className="font-bold text-xl text-gray-800 hidden sm:inline-block">
              Centro Comercial Elite
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/tiendas">
              <ShoppingBag size={18} />
              Tiendas
            </NavLink>
            <NavLink href="/eventos">
              <Calendar size={18} />
              Eventos
            </NavLink>
            <NavLink href="/nosotros">
              <Users size={18} />
              Quiénes Somos
            </NavLink>
            <NavLink href="/chatbot">
              <MessageCircle size={18} />
              Chatea con Eli
            </NavLink>
          </nav>

          {/* Login/Register Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              href="/register" 
              className="text-gray-700 hover:text-red-600 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Registrarse
            </Link>
            <Link 
              href="/login" 
              className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-6 py-2 rounded-full font-medium transition-all"
            >
              Iniciar Sesión
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 hover:text-gray-900"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          "fixed inset-0 bg-white z-40 pt-20 px-4 md:hidden transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Botón X para volver al inicio */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button 
            onClick={handleHomeClick}
            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center gap-1"
            aria-label="Volver al inicio"
          >
            <Home size={18} />
            <span className="text-sm">Inicio</span>
          </button>
          <button 
            onClick={toggleMenu}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          <MobileNavLink href="/tiendas" onClick={toggleMenu}>
            <ShoppingBag size={20} />
            Tiendas
          </MobileNavLink>
          <MobileNavLink href="/eventos" onClick={toggleMenu}>
            <Calendar size={20} />
            Eventos
          </MobileNavLink>
          <MobileNavLink href="/nosotros" onClick={toggleMenu}>
            <Users size={20} />
            Quiénes Somos
          </MobileNavLink>
          <MobileNavLink href="/chatbot" onClick={toggleMenu}>
            <MessageCircle size={20} />
            Chatbot
          </MobileNavLink>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
            <Link 
              href="/register" 
              className="w-full flex justify-center py-2.5 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 transition-colors"
              onClick={toggleMenu}
            >
              Crear cuenta
            </Link>
            <Link 
              href="/login" 
              className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-medium transition-all w-full flex justify-center"
              onClick={toggleMenu}
            >
              Iniciar Sesión
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-red-600 font-medium rounded-md transition-colors",
        className
      )}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 py-4 text-gray-800 hover:text-red-600 text-lg font-medium border-b border-gray-100"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
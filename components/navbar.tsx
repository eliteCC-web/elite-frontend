// components/navbar.tsx - ACTUALIZACIÓN sin paneles para la mayoría de roles
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Calendar, User, LogOut, Shield, Users, MessageCircle, ChevronDown, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import assets from '@/public/assets';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, hasRole, logout } = useAuth();

  // Detectar scroll para cambiar el navbar
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          const shouldBeScrolled = lastScrollY > 50; // Threshold más bajo para mejor respuesta
          setIsScrolled(shouldBeScrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Ejecutar inmediatamente para verificar el estado inicial
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out",
      isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg" 
        : "bg-transparent"
    )}>
      <div className="container-modern">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo - siempre visible */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className={cn(
                "w-12 h-12 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110",
                isScrolled 
                  ? "bg-white rounded-2xl" 
                  : "bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30"
              )}>
                <Image
                  src={assets.logo_png}
                  alt="Elite"
                  width={32}
                  height={32}
                  className="drop-shadow-lg"
                />
              </div>
            </div>
            <div className={cn(
              "hidden sm:block transition-all duration-500 ease-in-out",
              isScrolled ? "opacity-100 transform translate-x-0" : "opacity-0 transform -translate-x-4"
            )}>
              <span className="text-display text-xl text-neutral-900 font-bold">
                Elite
              </span>
              <span className="block text-xs text-neutral-500 font-medium">
                Centro Comercial
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - siempre visible pero con opacidad */}
          <nav className={cn(
            "hidden lg:flex items-center gap-8 transition-all duration-500 ease-in-out",
            isScrolled ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2 pointer-events-none"
          )}>
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
              Nosotros
            </NavLink>
            <NavLink href="/chatbot">
              <MessageCircle size={18} />
              Eli Chat
            </NavLink>
          </nav>

          {/* Desktop Auth Section - siempre visible pero con opacidad */}
          <div className={cn(
            "hidden lg:flex items-center gap-4 transition-all duration-500 ease-in-out",
            isScrolled ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2 pointer-events-none"
          )}>
            {isAuthenticated && user ? (
              <>
                {/* Notificaciones 
                <button className="relative p-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-2xl transition-all duration-200 group">
                  <Bell size={20} className="group-hover:scale-110 transition-transform duration-200" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary-500 rounded-full animate-pulse"></span>
                </button>*/}

                {/* Panel de administración */}
                {hasRole('ADMIN') && (
                  <Link 
                    href="/admin/dashboard"
                    className="btn-primary btn-sm rounded-2xl"
                  >
                    <Shield size={16} />
                    Admin
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-neutral-100 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-semibold shadow-lg group-hover:shadow-xl transition-all duration-200">
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-neutral-700">
                      {user?.firstName || 'Usuario'}
                    </span>
                    <ChevronDown size={16} className="text-neutral-500 group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-strong border border-neutral-100 py-3 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="text-sm font-semibold text-neutral-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-neutral-500">{user?.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          href="/perfil"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors rounded-xl mx-2"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User size={16} />
                          Mi Perfil
                        </Link>
                        
                        {hasRole('ADMIN') && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors rounded-xl mx-2"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <Shield size={16} />
                            Panel Admin
                          </Link>
                        )}
                        
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-secondary-500 hover:bg-secondary-50 transition-colors rounded-xl mx-2 w-full"
                        >
                          <LogOut size={16} />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="btn-outline btn-sm rounded-2xl">
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="btn-primary btn-sm rounded-2xl">
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button - siempre visible pero con estilo adaptativo */}
          <button
            onClick={toggleMenu}
            className={cn(
              "lg:hidden p-3 rounded-2xl transition-all duration-200",
              isScrolled 
                ? "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100" 
                : "text-white hover:bg-white/20 backdrop-blur-sm"
            )}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-neutral-100 shadow-lg">
          <div className="container-modern py-4">
            <nav className="space-y-2">
              <MobileNavLink href="/tiendas" onClick={() => setIsMenuOpen(false)}>
                <ShoppingBag size={18} />
                Tiendas
              </MobileNavLink>
              <MobileNavLink href="/eventos" onClick={() => setIsMenuOpen(false)}>
                <Calendar size={18} />
                Eventos
              </MobileNavLink>
              <MobileNavLink href="/nosotros" onClick={() => setIsMenuOpen(false)}>
                <Users size={18} />
                Nosotros
              </MobileNavLink>
              <MobileNavLink href="/chatbot" onClick={() => setIsMenuOpen(false)}>
                <MessageCircle size={18} />
                Eli Chat
              </MobileNavLink>
            </nav>
            
            {isAuthenticated && user ? (
              <div className="mt-6 pt-6 border-t border-neutral-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-neutral-500">{user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <MobileNavLink href="/perfil" onClick={() => setIsMenuOpen(false)}>
                    <User size={18} />
                    Mi Perfil
                  </MobileNavLink>
                  
                  {hasRole('ADMIN') && (
                    <MobileNavLink href="/admin" onClick={() => setIsMenuOpen(false)}>
                      <Shield size={18} />
                      Panel Admin
                    </MobileNavLink>
                  )}
                  
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-secondary-500 hover:bg-secondary-50 transition-colors rounded-xl"
                  >
                    <LogOut size={18} />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-neutral-100 space-y-3">
                <Link 
                  href="/login" 
                  className="btn-outline w-full justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  href="/register" 
                  className="btn-primary w-full justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'nav-link flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-200 hover:bg-neutral-100 hover:scale-105',
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
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-50 transition-colors rounded-xl"
    >
      {children}
    </Link>
  );
}
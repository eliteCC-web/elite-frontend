/* eslint-disable */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  LayoutDashboard, Store, Calendar, Users, Bell, Settings, LogOut, 
  Menu, X, ChevronDown, Search, Home
} from 'lucide-react';
import AuthService from '@/services/auth.service';
import assets from '@/public/assets';
import Navbar from '../navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const checkAuth = () => {
      const isAuth = AuthService.isAuthenticated();
      if (!isAuth) {
        router.push('/login');
        return;
      }

      const currentUser = AuthService.getCurrentUser();
      if (!currentUser || !AuthService.hasRole('ADMIN')) {
        AuthService.logout();
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    AuthService.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: <LayoutDashboard size={20} />,
      active: pathname === '/admin/dashboard'
    },
    { 
      name: 'Tiendas', 
      href: '/admin/stores', 
      icon: <Store size={20} />,
      active: pathname.startsWith('/admin/stores')
    },
    { 
      name: 'Eventos', 
      href: '/admin/events', 
      icon: <Calendar size={20} />,
      active: pathname.startsWith('/admin/events')
    },
    { 
      name: 'Usuarios', 
      href: '/admin/users', 
      icon: <Users size={20} />,
      active: pathname.startsWith('/admin/users')
    }
  ];

  return (<>
    <Navbar/>
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar para pantallas grandes */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-40 w-64 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile close button */}
        <div className="md:hidden absolute right-4 top-4">
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image
              src={assets.logo_png}
              alt="Centro Comercial Elite"
              width={36}
              height={36}
            />
            <span className="font-semibold text-gray-800">Elite Admin</span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="px-4 py-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
                    item.active
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botones inferiores */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Home size={20} />
              <span className="font-medium">Ir al sitio</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          {/* Menu button (mobile) */}
          <button
            className="md:hidden text-gray-700 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Search (desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-sm">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Right Header Items */}
          <div className="flex items-center gap-4">
            {/* Notification */}
            <button className="text-gray-600 hover:text-gray-900 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </button>

            {/* Settings */}
            <button className="text-gray-600 hover:text-gray-900">
              <Settings size={20} />
            </button>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user?.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <Users size={18} className="text-gray-500" />
                  )}
                </div>
                <span className="hidden md:block font-medium text-gray-700">
                  {user?.firstName || 'Admin'}
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-lg z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700">{user?.email}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.roles?.map((role: any) => role.name).join(', ')}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Mi perfil
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Configuración
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div></>
  );
}
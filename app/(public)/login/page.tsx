/* eslint-disable */
// app/(public)/login/page.tsx - CORREGIDO
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { User, Lock, AlertCircle, Eye, EyeOff, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { EmailVerificationService } from '@/services/email-verification.service';
import assets from '@/public/assets';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (error) setError('');
    if (showResendButton) setShowResendButton(false);
    if (resendMessage) setResendMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowResendButton(false);
    setResendMessage('');

    try {
      await login(formData.email, formData.password);
      // El AuthContext maneja la redirección
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 
        'Credenciales incorrectas. Por favor, verifica tu email y contraseña.';
      
      // Si el error es sobre email no verificado, mostrar un mensaje más específico
      if (errorMessage.includes('verify your email')) {
        setError('Tu cuenta no ha sido verificada. Por favor revisa tu correo electrónico y haz clic en el enlace de verificación antes de iniciar sesión.');
        setShowResendButton(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setResendMessage('Por favor ingresa tu email primero');
      return;
    }

    setResending(true);
    setResendMessage('');

    try {
      await EmailVerificationService.resendVerificationEmail(formData.email);
      setResendMessage('Email de verificación reenviado exitosamente. Revisa tu bandeja de entrada.');
    } catch (err: any) {
      setResendMessage(err.response?.data?.message || 'Error al reenviar el email de verificación');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* Logo y título */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Image
                  src={assets.logo_png}
                  alt="Centro Comercial Elite"
                  width={80}
                  height={80}
                  className="mx-auto"
                />
              </div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Iniciar Sesión
              </h1>
              <p className="text-gray-500 mt-2">
                Accede al sistema del Centro Comercial Elite
              </p>
            </div>

            {/* Credenciales de prueba */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Credenciales de prueba:</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Admin:</strong> admin@elitecc.com / Admin123</p>
                <p><strong>Colaborador:</strong> colaborador1@elitecc.com / Elite123</p>
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Botón de reenvío de verificación */}
            {showResendButton && (
              <div className="mb-6 space-y-3">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resending}
                  className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                >
                  {resending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
                      <span>Reenviando...</span>
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      <span>Reenviar email de verificación</span>
                    </>
                  )}
                </button>
                
                {resendMessage && (
                  <div className={`p-3 rounded-md text-sm ${
                    resendMessage.includes('exitosamente') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {resendMessage}
                  </div>
                )}
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="admin@elitecc.com"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Recordarme
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-red-600 hover:text-red-500">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors
                      ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Iniciando sesión...</span>
                      </div>
                    ) : (
                      'Iniciar sesión'
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Pie del formulario */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    o volver a
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link 
                  href="/"
                  className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Página principal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
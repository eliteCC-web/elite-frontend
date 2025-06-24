'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EmailVerificationService } from '../../../services/email-verification.service';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Token de verificación no encontrado');
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await EmailVerificationService.verifyEmail(token);
      
      if (response.success) {
        setStatus('success');
        setMessage(response.message);
      } else {
        if (response.message.includes('expirado')) {
          setStatus('expired');
        } else {
          setStatus('error');
        }
        setMessage(response.message);
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Error al verificar el email');
    }
  };

  const resendVerificationEmail = async () => {
    if (!email) {
      setMessage('Por favor ingresa tu email para reenviar la verificación');
      return;
    }

    setIsResending(true);
    try {
      await EmailVerificationService.resendVerificationEmail(email);
      setMessage('Email de verificación reenviado exitosamente. Revisa tu bandeja de entrada.');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error al reenviar el email de verificación');
    } finally {
      setIsResending(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Verificando tu email...
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Por favor espera mientras verificamos tu cuenta.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100">
            {status === 'success' ? (
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : status === 'error' ? (
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {status === 'success' && '¡Email verificado!'}
            {status === 'error' && 'Error de verificación'}
            {status === 'expired' && 'Token expirado'}
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            {message}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {status === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Tu cuenta ha sido verificada exitosamente
                    </p>
                    <p className="mt-1 text-sm text-green-700">
                      Ya puedes iniciar sesión en tu cuenta.
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleLogin}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Ir al login
              </button>
            </div>
          )}

          {(status === 'error' || status === 'expired') && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {status === 'expired' ? 'El enlace ha expirado' : 'Error en la verificación'}
                    </p>
                    <p className="mt-1 text-sm text-red-700">
                      {status === 'expired' 
                        ? 'El enlace de verificación ha expirado. Solicita uno nuevo.'
                        : 'No se pudo verificar tu email. Intenta nuevamente.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="tu@email.com"
                  />
                </div>

                <button
                  onClick={resendVerificationEmail}
                  disabled={isResending}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Reenviando...</span>
                    </>
                  ) : (
                    'Reenviar email de verificación'
                  )}
                </button>

                <button
                  onClick={handleLogin}
                  className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Ir al login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
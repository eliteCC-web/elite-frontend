/* eslint-disable */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, UserPlus, Play, CheckCircle, AlertCircle } from 'lucide-react';
import UserGeneratorService, { UserGenerationConfig } from '@/services/user-generator.service';

export default function GenerateUsersPage() {
  const [config, setConfig] = useState<UserGenerationConfig>({
    colaboradores: 75,
    clientesInternos: 75,
    clientesExternos: 25
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [progress, setProgress] = useState('');

  const handleConfigChange = (field: keyof UserGenerationConfig, value: number) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    setProgress('Iniciando generación de usuarios...');

    try {
      const generationResult = await UserGeneratorService.generateUsers(config);
      setResult(generationResult);
      setProgress('');
    } catch (error) {
      setResult({
        success: false,
        message: 'Error inesperado: ' + error
      });
      setProgress('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateDefault = async () => {
    setIsGenerating(true);
    setResult(null);
    setProgress('Generando usuarios con configuración predeterminada...');

    try {
      const generationResult = await UserGeneratorService.generateDefaultUsers();
      setResult(generationResult);
      setProgress('');
    } catch (error) {
      setResult({
        success: false,
        message: 'Error inesperado: ' + error
      });
      setProgress('');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalUsers = config.colaboradores + config.clientesInternos + (config.clientesExternos || 0);

  return (
    <div>
      {/* Encabezado */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Link 
            href="/admin/users" 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Generar Usuarios Automáticamente</h1>
        </div>
        <p className="text-gray-600">Crea usuarios en lote para colaboradores y clientes del centro comercial</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de configuración */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Configuración de Generación</h2>
          
          <div className="space-y-6">
            {/* Colaboradores */}
            <div>
              <label htmlFor="colaboradores" className="block text-sm font-medium text-gray-700 mb-2">
                Colaboradores del Centro Comercial
              </label>
              <div className="flex items-center gap-4">
                <Users size={20} className="text-blue-600" />
                <input
                  id="colaboradores"
                  type="number"
                  min="0"
                  max="200"
                  value={config.colaboradores}
                  onChange={(e) => handleConfigChange('colaboradores', parseInt(e.target.value) || 0)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Empleados con acceso a gestión de eventos y tiendas
              </p>
            </div>

            {/* Clientes Internos */}
            <div>
              <label htmlFor="clientesInternos" className="block text-sm font-medium text-gray-700 mb-2">
                Clientes Internos (Dueños de locales)
              </label>
              <div className="flex items-center gap-4">
                <UserPlus size={20} className="text-green-600" />
                <input
                  id="clientesInternos"
                  type="number"
                  min="0"
                  max="200"
                  value={config.clientesInternos}
                  onChange={(e) => handleConfigChange('clientesInternos', parseInt(e.target.value) || 0)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Propietarios y administradores de tiendas
              </p>
            </div>

            {/* Clientes Externos */}
            <div>
              <label htmlFor="clientesExternos" className="block text-sm font-medium text-gray-700 mb-2">
                Clientes Externos (Visitantes) - Opcional
              </label>
              <div className="flex items-center gap-4">
                <Users size={20} className="text-purple-600" />
                <input
                  id="clientesExternos"
                  type="number"
                  min="0"
                  max="100"
                  value={config.clientesExternos || 0}
                  onChange={(e) => handleConfigChange('clientesExternos', parseInt(e.target.value) || 0)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Clientes regulares del centro comercial
              </p>
            </div>

            {/* Resumen */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Resumen</h3>
              <p className="text-sm text-gray-600">
                Total de usuarios a crear: <span className="font-semibold">{totalUsers}</span>
              </p>
              <div className="text-xs text-gray-500 mt-2 space-y-1">
                <p>• Colaboradores: {config.colaboradores}</p>
                <p>• Clientes Internos: {config.clientesInternos}</p>
                <p>• Clientes Externos: {config.clientesExternos || 0}</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || totalUsers === 0}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-colors ${
                  isGenerating || totalUsers === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                    Generando...
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Generar Usuarios
                  </>
                )}
              </button>

              <button
                onClick={handleGenerateDefault}
                disabled={isGenerating}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md font-medium transition-colors ${
                  isGenerating
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users size={18} />
                Usar Configuración Predeterminada
              </button>
            </div>
          </div>
        </div>

        {/* Panel de resultados */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Resultados</h2>
          
          {progress && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600"></div>
              <span className="text-blue-800">{progress}</span>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {result.success ? (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="font-medium text-green-800">Generación Completada</span>
                  </div>
                  <p className="text-sm text-green-700">{result.message}</p>
                  
                  {result.results && (
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">Total usuarios:</span>
                          <span className="ml-2">{result.results.totalUsers}</span>
                        </div>
                        <div>
                          <span className="font-medium">Creados exitosamente:</span>
                          <span className="ml-2 text-green-600">{result.results.created}</span>
                        </div>
                        {result.results.errors > 0 && (
                          <div className="col-span-2">
                            <span className="font-medium text-orange-600">Errores:</span>
                            <span className="ml-2">{result.results.errors}</span>
                          </div>
                        )}
                      </div>
                      
                      {result.results.errorDetails && result.results.errorDetails.length > 0 && (
                        <details className="mt-4">
                          <summary className="cursor-pointer text-orange-600 font-medium">
                            Ver detalles de errores ({result.results.errorDetails.length})
                          </summary>
                          <div className="mt-2 max-h-40 overflow-y-auto bg-white border rounded p-2">
                            {result.results.errorDetails.map((error: any, index: any) => (
                              <div key={index} className="text-xs text-gray-600 py-1">
                                <span className="font-medium">{error.email}:</span> {error.error}
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={20} className="text-red-600" />
                    <span className="font-medium text-red-800">Error en la Generación</span>
                  </div>
                  <p className="text-sm text-red-700">{result.message}</p>
                </div>
              )}
            </div>
          )}

          {!progress && !result && (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Los resultados aparecerán aquí una vez que inicies la generación</p>
            </div>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Información Importante</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-2">Credenciales de Acceso:</h4>
            <ul className="space-y-1">
              <li>• <strong>Email:</strong> [tipo][número]@elitecc.com</li>
              <li>• <strong>Contraseña:</strong> Elite123</li>
              <li>• <strong>Ejemplo:</strong> colaborador1@elitecc.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Roles Asignados:</h4>
            <ul className="space-y-1">
              <li>• <strong>Colaboradores:</strong> Gestión de eventos y tiendas</li>
              <li>• <strong>Clientes Internos:</strong> Gestión de sus propias tiendas</li>
              <li>• <strong>Clientes Externos:</strong> Solo lectura</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Nota:</strong> Los usuarios se generan en lotes de 25 para evitar sobrecargar el servidor. 
            El proceso puede tomar varios minutos dependiendo de la cantidad de usuarios.
          </p>
        </div>
      </div>
    </div>
  );
}
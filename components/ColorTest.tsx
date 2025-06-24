"use client";

import React from 'react'
import { Button, Badge, Alert, LoadingSpinner } from '@/components/ui'

export default function ColorTest() {
  return (
    <div className="container-modern py-12">
      <h1 className="text-3xl font-bold text-primary-500 mb-8">Paleta de Colores Elite</h1>
      
      {/* Colores Principales */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Colores Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Azul Principal (#002d5a)</h3>
              <div className="space-y-3">
                <div className="h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white font-semibold">
                  Primary 500
                </div>
                <div className="h-12 bg-primary-400 rounded-lg flex items-center justify-center text-white font-semibold">
                  Primary 400
                </div>
                <div className="h-12 bg-primary-300 rounded-lg flex items-center justify-center text-primary-900 font-semibold">
                  Primary 300
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Rojo Secundario (#d51a1e)</h3>
              <div className="space-y-3">
                <div className="h-12 bg-secondary-500 rounded-lg flex items-center justify-center text-white font-semibold">
                  Secondary 500
                </div>
                <div className="h-12 bg-secondary-400 rounded-lg flex items-center justify-center text-white font-semibold">
                  Secondary 400
                </div>
                <div className="h-12 bg-secondary-300 rounded-lg flex items-center justify-center text-secondary-900 font-semibold">
                  Secondary 300
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Colores de Acento</h3>
              <div className="space-y-3">
                <div className="h-12 bg-accent-yellow rounded-lg flex items-center justify-center text-neutral-900 font-semibold">
                  Amarillo (#ffce00)
                </div>
                <div className="h-12 bg-accent-green rounded-lg flex items-center justify-center text-white font-semibold">
                  Verde (#19be31)
                </div>
                <div className="h-12 bg-accent-purple rounded-lg flex items-center justify-center text-white font-semibold">
                  Púrpura (#8a2c73)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Botones */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Botones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Variantes</h3>
              <div className="space-y-3">
                <Button variant="primary" className="w-full">Primary</Button>
                <Button variant="secondary" className="w-full">Secondary</Button>
                <Button variant="outline" className="w-full">Outline</Button>
                <Button variant="danger" className="w-full">Danger</Button>
                <Button variant="success" className="w-full">Success</Button>
                <Button variant="warning" className="w-full">Warning</Button>
                <Button variant="ghost" className="w-full">Ghost</Button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Tamaños</h3>
              <div className="space-y-3">
                <Button variant="primary" size="sm" className="w-full">Small</Button>
                <Button variant="primary" size="md" className="w-full">Medium</Button>
                <Button variant="primary" size="lg" className="w-full">Large</Button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Estados</h3>
              <div className="space-y-3">
                <Button variant="primary" className="w-full">Normal</Button>
                <Button variant="primary" loading className="w-full">Loading</Button>
                <Button variant="primary" disabled className="w-full">Disabled</Button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Con Iconos</h3>
              <div className="space-y-3">
                <Button variant="primary" className="w-full">📝 Crear</Button>
                <Button variant="secondary" className="w-full">🗑️ Eliminar</Button>
                <Button variant="success" className="w-full">✅ Guardar</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Badges</h2>
        <div className="card">
          <div className="card-body">
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="neutral">Neutral</Badge>
              <Badge variant="accent-yellow">Amarillo</Badge>
              <Badge variant="accent-green">Verde</Badge>
              <Badge variant="accent-purple">Púrpura</Badge>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Tamaños</h4>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary" size="sm">Small</Badge>
                <Badge variant="primary" size="md">Medium</Badge>
                <Badge variant="primary" size="lg">Large</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alertas */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Alertas</h2>
        <div className="space-y-4">
          <Alert variant="success" title="¡Éxito!">
            La operación se completó correctamente.
          </Alert>
          <Alert variant="error" title="Error">
            Ha ocurrido un error inesperado.
          </Alert>
          <Alert variant="warning" title="Advertencia">
            Ten cuidado con esta acción.
          </Alert>
          <Alert variant="info" title="Información">
            Aquí tienes información importante.
          </Alert>
        </div>
      </section>

      {/* Loading Spinners */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Loading Spinners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Colores</h3>
              <div className="space-y-4">
                <LoadingSpinner color="primary" text="Primary" />
                <LoadingSpinner color="secondary" text="Secondary" />
                <LoadingSpinner color="success" text="Success" />
                <LoadingSpinner color="warning" text="Warning" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Tamaños</h3>
              <div className="space-y-4">
                <LoadingSpinner size="sm" text="Small" />
                <LoadingSpinner size="md" text="Medium" />
                <LoadingSpinner size="lg" text="Large" />
                <LoadingSpinner size="xl" text="Extra Large" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4">Sin Texto</h3>
              <div className="flex justify-center space-x-4">
                <LoadingSpinner size="sm" />
                <LoadingSpinner size="md" />
                <LoadingSpinner size="lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filosofía de Diseño */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Filosofía de Diseño</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4 text-primary-500">Minimalista</h3>
              <p className="text-neutral-600">
                Diseño limpio y sin elementos innecesarios. El azul principal (#002d5a) 
                domina la interfaz, seguido del blanco para espacios limpios y el rojo 
                para acciones importantes.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-4 text-accent-purple">Vanguardista</h3>
              <p className="text-neutral-600">
                Uso estratégico de colores de acento (amarillo, verde, púrpura) para 
                elementos especiales, estados y detalles que requieren atención.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Uso de Colores */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Guía de Uso de Colores</h2>
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-primary-500 mb-2">Azul Principal (#002d5a)</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Botones principales</li>
                  <li>• Enlaces importantes</li>
                  <li>• Encabezados</li>
                  <li>• Elementos de navegación</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-secondary-500 mb-2">Rojo Secundario (#d51a1e)</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Acciones destructivas</li>
                  <li>• Alertas de error</li>
                  <li>• Botones de cancelar</li>
                  <li>• Estados críticos</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-accent-yellow mb-2">Amarillo (#ffce00)</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Advertencias</li>
                  <li>• Estados de atención</li>
                  <li>• Elementos destacados</li>
                  <li>• Promociones especiales</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-accent-green mb-2">Verde (#19be31)</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Estados de éxito</li>
                  <li>• Confirmaciones</li>
                  <li>• Elementos positivos</li>
                  <li>• Progreso completado</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-accent-purple mb-2">Púrpura (#8a2c73)</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Elementos premium</li>
                  <li>• Funciones avanzadas</li>
                  <li>• Estados especiales</li>
                  <li>• Características exclusivas</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-500 mb-2">Neutros</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Texto secundario</li>
                  <li>• Bordes y separadores</li>
                  <li>• Fondos sutiles</li>
                  <li>• Estados inactivos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
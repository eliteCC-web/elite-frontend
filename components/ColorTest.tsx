"use client";

import React, { useState } from 'react';

export default function ColorTest() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-6 border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Test de Colores Interactivo</h2>
      
      <div className="space-y-4">
        {/* Colores con clases de Tailwind */}
        <div className="bg-red-600 text-white p-4 rounded-lg">Rojo (bg-red-600)</div>
        <div className="bg-blue-700 text-white p-4 rounded-lg">Azul (bg-blue-700)</div>
        <div className="bg-yellow-400 text-black p-4 rounded-lg">Amarillo (bg-yellow-400)</div>
        <div className="bg-green-500 text-white p-4 rounded-lg">Verde (bg-green-500)</div>
        
        {/* Colores con las clases personalizadas del globals.css */}
        <div className="tw-bg-red-600 tw-text-white tw-p-4 tw-rounded-lg tw-mb-2">
          Rojo (tw-bg-red-600)
        </div>
        <div className="tw-bg-blue-700 tw-text-white tw-p-4 tw-rounded-lg tw-mb-2">
          Azul (tw-bg-blue-700)
        </div>
        
        {/* Elemento interactivo para probar que el JavaScript funciona */}
        <div className="mt-6">
          <button 
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
            style={{ backgroundColor: count % 2 === 0 ? '#9333ea' : '#22c55e' }}
          >
            Contador: {count}
          </button>
          <p className="mt-2">
            (Este botón cambia de color al hacer clic, demostrando que la interactividad funciona)
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from 'react';
import { Radio, X, ChevronUp, ChevronDown } from 'lucide-react';

export function RadioPlayer() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <button
        onClick={() => { setIsVisible(true); setIsExpanded(true); }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        title="Abrir Elite Radio"
      >
        <Radio size={22} className="group-hover:animate-pulse" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-strong border border-neutral-100 overflow-hidden">
        {/* Header mínimo: solo controles */}
        <div
          className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-primary-500 to-primary-600 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 text-white">
            {/* Sound bars animadas */}
            <div className="flex items-end gap-[3px] h-3.5">
              <div className="soundbar" />
              <div className="soundbar" />
              <div className="soundbar" />
              <div className="soundbar" />
            </div>
            <span className="text-xs font-bold">Elite Radio</span>
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="p-1 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
              className="p-1 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* El iframe maneja todo: sonando ahora, título, controles */}
        {isExpanded && (
          <iframe
            src="https://cloud8.vsgtech.co/cp/widgets/player/single/?p=8072&autoplay=true"
            height="110"
            width="100%"
            scrolling="no"
            allow="autoplay"
            style={{ border: 'none', display: 'block' }}
            title="Elite Radio Player"
          />
        )}
      </div>
    </div>
  );
}

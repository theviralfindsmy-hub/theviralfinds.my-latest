'use client';

/**
 * TheViralFinds (TVF) — 3D Isometric Interactive Showcase Component
 * Exact Emons Aesthetic & Layout Blueprint:
 * - Bright daylight low-poly diorama canvas
 * - Floating matte white card with dual red pill CTAs
 * - Sticky bottom 5-step slider with transport icons & progress track
 * - Solid white circular [+] hotspots anchored in 3D world space
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TVF_WAYPOINTS,
  TVF_HOTSPOTS,
  TVFSceneEngine,
  type TVFWaypoint,
  type TVFHotspot
} from './tvf-3d-scene-engine';
import { tvfSound } from './tvf-sound-engine';
import {
  Truck,
  Package,
  Plane,
  Train,
  Building2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  ArrowRight,
  Sparkles,
  Search,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

const STEP_ICONS = [Truck, Package, Plane, Train, Building2];

export function TVF3DIsometricShowcase() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<TVFSceneEngine | null>(null);

  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlayingTour, setIsPlayingTour] = useState<boolean>(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<TVFHotspot | null>(null);
  const [screenHotspots, setScreenHotspots] = useState<{ id: string; x: number; y: number; visible: boolean }[]>([]);
  const [simulatedActionMessage, setSimulatedActionMessage] = useState<string | null>(null);

  const currentWaypoint = TVF_WAYPOINTS[activeStep];

  // Initialize Three.js Engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new TVFSceneEngine(canvasRef.current);
    engineRef.current = engine;

    engine.setHotspotCallback((hotspots) => {
      setScreenHotspots(hotspots);
    });

    const handleResize = () => {
      engine.handleResize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.destroy();
    };
  }, []);

  // Handle Step Navigation
  const goToStep = useCallback((index: number) => {
    if (index < 0 || index >= TVF_WAYPOINTS.length) return;
    setActiveStep(index);
    tvfSound.playWarp();
    if (engineRef.current) {
      engineRef.current.navigateToWaypoint(TVF_WAYPOINTS[index]);
    }
  }, []);

  // Keyboard navigation (1-5 and Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToStep((activeStep + 1) % TVF_WAYPOINTS.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToStep((activeStep - 1 + TVF_WAYPOINTS.length) % TVF_WAYPOINTS.length);
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        goToStep(parseInt(e.key, 10) - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStep, goToStep]);

  // Guided Tour Autoplay
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlayingTour) {
      interval = setInterval(() => {
        setActiveStep((prev) => {
          const next = (prev + 1) % TVF_WAYPOINTS.length;
          if (engineRef.current) {
            engineRef.current.navigateToWaypoint(TVF_WAYPOINTS[next]);
          }
          tvfSound.playClick();
          return next;
        });
      }, 7000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingTour]);

  const toggleAudio = () => {
    const nextState = !isAudioEnabled;
    setIsAudioEnabled(nextState);
    tvfSound.setEnabled(nextState);
    if (nextState) tvfSound.playClick();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleHotspotClick = (hotspot: TVFHotspot) => {
    setSelectedHotspot(hotspot);
    tvfSound.playBeacon();
    setSimulatedActionMessage(null);
  };

  const runHotspotSimulation = () => {
    if (!selectedHotspot) return;

    if (selectedHotspot.stationId === 'revenue') {
      tvfSound.playSuccess();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      setSimulatedActionMessage('🎉 Berjaya! Komisen RM1,450.00 telah dikreditkan ke dompet afiliasi.');
    } else if (selectedHotspot.stationId === 'radar') {
      tvfSound.playBeacon();
      setSimulatedActionMessage('🔍 3 Produk Viral Terkini Dijumpai: "Smart RGB Lamp", "Air Pods Pro Case", "Wireless Car Vacuum" (Margin 68%).');
    } else if (selectedHotspot.stationId === 'studio') {
      tvfSound.playSuccess();
      setSimulatedActionMessage('🎙️ Audio Neural Yasmin siap digabungkan dengan visual 1080x1920 60fps.');
    } else if (selectedHotspot.stationId === 'hermes') {
      tvfSound.playBeacon();
      setSimulatedActionMessage('🛡️ Hermes OS 24/7 Watchdog: Status Hijau. Semua 12 Subagent beroperasi optimum.');
    } else {
      tvfSound.playSuccess();
      setSimulatedActionMessage('🚀 Video berjaya dijadualkan ke TikTok, Instagram Reels, dan YouTube Shorts.');
    }
  };

  return (
    <div className="relative w-full h-screen min-h-[640px] max-h-[1080px] bg-[#eef1f6] text-zinc-900 select-none overflow-hidden font-sans">
      {/* 1. 3D Daylight WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
      />

      {/* 2. Top Header Navigation (Exact Emons Red Logo & Pill Buttons) */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-white/90 via-white/50 to-transparent backdrop-blur-[2px]">
        {/* Left: Red Box Logo */}
        <div className="flex items-center gap-6">
          <div className="flex items-center justify-center px-4 py-2 bg-[#e52421] text-white font-black text-xl tracking-tight rounded-md shadow-md italic">
            TheViralFinds
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-700">
            <a href="#about" className="hover:text-[#e52421] transition-colors">Tentang Kami</a>
            <a href="#services" className="hover:text-[#e52421] transition-colors">Perkhidmatan</a>
            <a href="#contacts" className="hover:text-[#e52421] transition-colors">Hubungi</a>
            <a href="#customer" className="hover:text-[#e52421] transition-colors">Kawasan Pelanggan</a>
            <a href="#careers" className="hover:text-[#e52421] transition-colors">Kerjaya</a>
          </nav>
        </div>

        {/* Right: Pill Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => goToStep(0)}
            className="hidden sm:flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff5252] to-[#e52421] text-white text-xs font-semibold shadow-sm hover:opacity-95 transition-all"
          >
            <span>Penjejakan Produk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => goToStep(1)}
            className="hidden sm:flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff5252] to-[#e52421] text-white text-xs font-semibold shadow-sm hover:opacity-95 transition-all"
          >
            <span>Jana Video AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => goToStep(3)}
            className="hidden md:flex items-center gap-1 px-4 py-2 rounded-full bg-[#ffcbb4] text-[#8c2d19] text-xs font-semibold hover:bg-[#ffbea3] transition-all"
          >
            <span>Pelanggan Persendirian</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Autoplay Tour Toggle */}
          <button
            onClick={() => {
              setIsPlayingTour(!isPlayingTour);
              tvfSound.playClick();
            }}
            className={`h-9 px-3 text-xs font-medium rounded-full border transition-all flex items-center gap-1.5 ${
              isPlayingTour
                ? 'bg-[#e52421] text-white border-[#e52421] shadow-md'
                : 'bg-white/90 text-zinc-700 border-zinc-300 hover:bg-white'
            }`}
          >
            {isPlayingTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlayingTour ? 'Jeda' : 'Auto Tour'}</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className="h-9 w-9 rounded-full bg-white/90 text-zinc-700 border border-zinc-300 hover:bg-white flex items-center justify-center shadow-sm"
            title={isAudioEnabled ? 'Mute' : 'Unmute'}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-[#e52421]" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
          </button>
        </div>
      </header>

      {/* 3. Solid White Circular [+] Hotspots (Exact Emons Style) */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {screenHotspots.map((spot) => {
          const hotspotData = TVF_HOTSPOTS.find((h) => h.id === spot.id);
          if (!hotspotData || !spot.visible) return null;

          return (
            <div
              key={spot.id}
              className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-transform duration-100"
              style={{ left: `${spot.x}px`, top: `${spot.y}px` }}
              onClick={() => handleHotspotClick(hotspotData)}
            >
              {/* White Solid Circle with Black + */}
              <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white text-zinc-900 font-bold text-base flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.18)] border border-zinc-100 group-hover:scale-125 transition-transform">
                  +
                </div>

                {/* Floating Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-zinc-900/90 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shadow-xl">
                  <span className="font-bold">{hotspotData.title}</span>
                  <span className="text-[#ff8a73] ml-1.5 font-mono">({hotspotData.metric})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Left Floating Hero Card (Exact Emons White Card Structure) */}
      <motion.div
        key={currentWaypoint.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="absolute left-6 bottom-24 w-80 sm:w-96 z-20 pointer-events-none"
      >
        <div className="p-6 sm:p-7 rounded-3xl bg-white/95 border border-zinc-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.12)] backdrop-blur-md pointer-events-auto space-y-4">
          <h1 className="text-2xl sm:text-[26px] font-bold text-zinc-950 leading-tight tracking-tight">
            {currentWaypoint.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            {currentWaypoint.description}
          </p>

          {/* Dual Action Pill Buttons (Exact Emons Style) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => {
                const related = TVF_HOTSPOTS.find((h) => h.stationId === currentWaypoint.id);
                if (related) handleHotspotClick(related);
              }}
              className="px-5 py-2.5 rounded-full bg-[#e52421] text-white text-xs font-bold hover:bg-[#d0201d] transition-colors shadow-sm"
            >
              Gambaran Perkhidmatan
            </button>

            <button
              onClick={() => goToStep((activeStep + 1) % TVF_WAYPOINTS.length)}
              className="px-5 py-2.5 rounded-full bg-[#ff5252] text-white text-xs font-bold hover:bg-[#e52421] transition-colors shadow-sm"
            >
              Untuk Permohonan Sebut Harga
            </button>
          </div>
        </div>
      </motion.div>

      {/* 5. Bottom Step Slider Dock (Exact Emons 5-Step Carousel Layout) */}
      <footer className="absolute bottom-4 left-6 right-6 z-20 flex items-center justify-between pointer-events-auto">
        {/* Step Carousel Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
          {TVF_WAYPOINTS.map((wp, idx) => {
            const Icon = STEP_ICONS[idx];
            const isActive = activeStep === idx;

            return (
              <button
                key={wp.id}
                onClick={() => goToStep(idx)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 shadow-sm ${
                  isActive
                    ? 'bg-[#e52421] text-white shadow-[0_4px_12px_rgba(229,36,33,0.35)]'
                    : 'bg-[#ffcbb4]/60 text-[#8c2d19] hover:bg-[#ffbea3]'
                }`}
              >
                <span className="font-mono">{wp.stepNum}</span>
                <Icon className="w-3.5 h-3.5" />
                {isActive && <span className="ml-0.5">{wp.name}</span>}
              </button>
            );
          })}
        </div>

        {/* Right "Semua Perkhidmatan →" Pill Button */}
        <button
          onClick={() => goToStep((activeStep + 1) % TVF_WAYPOINTS.length)}
          className="hidden sm:flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#e52421] text-white text-xs font-bold hover:bg-[#d0201d] transition-all shadow-md shrink-0 ml-3"
        >
          <span>Semua Perkhidmatan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </footer>

      {/* 6. Interactive Modal Drawer */}
      <AnimatePresence>
        {selectedHotspot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-white border border-zinc-200 shadow-2xl space-y-4"
            >
              <button
                onClick={() => setSelectedHotspot(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#e52421]/10 text-[#e52421] flex items-center justify-center font-bold text-lg">
                  +
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-[#e52421] uppercase">Fasiliti Logistik AI</div>
                  <h2 className="text-lg font-bold text-zinc-900">{selectedHotspot.title}</h2>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 leading-relaxed">
                {selectedHotspot.details}
                <div className="mt-2 pt-2 border-t border-zinc-200 flex justify-between font-mono text-[11px]">
                  <span className="text-zinc-500">Kapasiti / Metrik:</span>
                  <span className="text-[#e52421] font-bold">{selectedHotspot.metric}</span>
                </div>
              </div>

              {simulatedActionMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                  {simulatedActionMessage}
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={runHotspotSimulation}
                  className="flex-1 h-10 rounded-full bg-[#e52421] hover:bg-[#d0201d] text-white font-bold text-xs shadow-md transition-colors"
                >
                  {selectedHotspot.actionText}
                </button>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="h-10 px-4 rounded-full border border-zinc-300 text-zinc-700 font-medium text-xs hover:bg-zinc-100"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { BuretteSvg } from './BuretteSvg';
import { ErlenmeyerSvg } from './ErlenmeyerSvg';
import { ReagentShelf } from './ReagentShelf';
import { EquilibriumPoint } from '../../engine/equilibrium';

interface LabBenchProps {
  currentDeliveredMl: number;
  isStopcockOpen: boolean;
  flowRate: 'dropwise' | 'fast' | 'closed';
  hasBubble: boolean;
  indicatorDrops: number;
  isBubblePurged: boolean;
  isStirring: boolean;
  equilibrium: EquilibriumPoint;
  onToggleStopcock: () => void;
  onSetFlowRate: (rate: 'dropwise' | 'fast' | 'closed') => void;
  onOpenLoupe: () => void;
  onAddIndicator: () => void;
  onPurgeBubble: () => void;
  onToggleStirring: () => void;
  onResetBench: () => void;
  onTickTitration: (deltaMl: number) => void;
}

export const LabBench: React.FC<LabBenchProps> = ({
  currentDeliveredMl,
  isStopcockOpen,
  flowRate,
  hasBubble,
  indicatorDrops,
  isBubblePurged,
  isStirring,
  equilibrium,
  onToggleStopcock,
  onSetFlowRate,
  onOpenLoupe,
  onAddIndicator,
  onPurgeBubble,
  onToggleStirring,
  onResetBench,
  onTickTitration,
}) => {
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Bucle de simulación en tiempo real a 60 FPS cuando la llave está abierta
  useEffect(() => {
    if (!isStopcockOpen || flowRate === 'closed') {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000; // segundos
      lastTimeRef.current = now;

      // Velocidad de flujo:
      // Dropwise: 0.15 mL/segundo (~3 gotas por segundo, cada gota 0.05 mL)
      // Fast: 1.20 mL/segundo
      const rateMlPerSec = flowRate === 'dropwise' ? 0.18 : 1.25;
      const deltaMl = rateMlPerSec * dt;

      onTickTitration(deltaMl);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isStopcockOpen, flowRate, onTickTitration]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-3 sm:p-4 lab-bench-bg rounded-2xl border border-slate-700/80 shadow-2xl relative overflow-y-auto overflow-x-hidden min-h-0">
      {/* Selector de Velocidad de la Llave */}
      <div className="w-full flex items-center justify-between z-10 px-2 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-xl shadow">
          <span className="text-[11px] sm:text-xs text-slate-300 font-medium">Modo:</span>
          <button
            onClick={() => onSetFlowRate('dropwise')}
            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold border transition-all ${
              flowRate === 'dropwise'
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-slate-700 border-slate-600 text-slate-300 hover:text-white'
            }`}
          >
            Gota a Gota
          </button>
          <button
            onClick={() => onSetFlowRate('fast')}
            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold border transition-all ${
              flowRate === 'fast'
                ? 'bg-amber-600 border-amber-400 text-white'
                : 'bg-slate-700 border-slate-600 text-slate-300 hover:text-white'
            }`}
          >
            Chorro Rápido
          </button>
        </div>

        {/* Notificación de Viraje en tiempo real */}
        {equilibrium.endpointQuality !== 'none' && (
          <div
            className={`px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-bold border shadow animate-in fade-in shrink-0 ${
              equilibrium.endpointQuality === 'perfect'
                ? 'bg-pink-950/80 text-pink-300 border-pink-500'
                : 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-600 animate-pulse'
            }`}
          >
            {equilibrium.endpointQuality === 'perfect'
              ? '🌸 ¡Punto final alcanzado!'
              : '⚠️ Solución sobretitulada'}
          </div>
        )}
      </div>

      {/* Mesada Central: Bureta + Matraz Erlenmeyer alineados */}
      <div className="flex flex-col items-center justify-center my-auto py-1 relative shrink min-h-0">
        <BuretteSvg
          currentDeliveredMl={currentDeliveredMl}
          isStopcockOpen={isStopcockOpen}
          flowRate={flowRate}
          hasBubble={hasBubble}
          onToggleStopcock={onToggleStopcock}
          onOpenLoupe={onOpenLoupe}
        />

        <ErlenmeyerSvg
          liquidColorRgba={equilibrium.liquidRgba}
          volumeAddedMl={currentDeliveredMl}
          initialVolumeMl={50}
          isStirring={isStirring}
          hasIndicator={indicatorDrops > 0}
          pH={equilibrium.pH}
          onToggleStirring={onToggleStirring}
        />
      </div>

      {/* Superficie de madera de la mesada de laboratorio con reactivos */}
      <div className="w-full z-10 shrink-0 pt-1">
        <ReagentShelf
          indicatorDrops={indicatorDrops}
          isBubblePurged={isBubblePurged}
          onAddIndicator={onAddIndicator}
          onPurgeBubble={onPurgeBubble}
          onResetBench={onResetBench}
        />
      </div>
    </div>
  );
};

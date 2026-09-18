import React, { useEffect, useRef } from 'react';
import { BuretteSvg } from './BuretteSvg';
import { ErlenmeyerSvg } from './ErlenmeyerSvg';
import { ReagentShelf } from './ReagentShelf';
import { EquilibriumPoint } from '../../engine/equilibrium';

interface LabBenchProps {
  practiceNumber?: number;
  currentDeliveredMl: number;
  isBuretteLoaded: boolean;
  isSampleDissolved: boolean;
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
  onOpenTipZoom?: () => void;
  onOpenDropperModal?: () => void;
  onLoadBurette: () => void;
  onOpenTransferModal: () => void;
  onPurgeBubble: () => void;
  onToggleStirring: () => void;
  onResetBench: () => void;
  onTickTitration: (deltaMl: number) => void;
}

export const LabBench: React.FC<LabBenchProps> = ({
  practiceNumber = 4,
  currentDeliveredMl,
  isBuretteLoaded,
  isSampleDissolved,
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
  onOpenTipZoom,
  onOpenDropperModal = () => {},
  onLoadBurette,
  onOpenTransferModal,
  onPurgeBubble,
  onToggleStirring,
  onResetBench,
  onTickTitration,
}) => {
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Bucle de simulación en tiempo real a 60 FPS cuando la llave está abierta y la bureta tiene líquido
  useEffect(() => {
    if (!isStopcockOpen || flowRate === 'closed' || !isBuretteLoaded) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Velocidad de flujo:
      // Dropwise: 0.18 mL/segundo (~3.5 gotas/s)
      // Fast: 1.25 mL/segundo
      const rateMlPerSec = flowRate === 'dropwise' ? 0.18 : 1.25;
      const deltaMl = rateMlPerSec * dt;

      onTickTitration(deltaMl);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isStopcockOpen, flowRate, isBuretteLoaded, onTickTitration]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-3 sm:p-4 lab-bench-bg rounded-2xl border border-[#262626] shadow-2xl relative overflow-y-auto overflow-x-hidden min-h-0 font-sans">
      {/* Selector de Velocidad de la Llave */}
      <div className="w-full flex items-center justify-between z-10 px-2 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#121212] border border-[#2e2e2e] px-2.5 py-1 rounded-xl shadow-lg">
          <span className="text-[11px] sm:text-xs text-[#888888] font-bold uppercase tracking-wider">Modo:</span>
          <button
            onClick={() => onSetFlowRate('dropwise')}
            className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold border transition-all cursor-pointer ${
              flowRate === 'dropwise'
                ? 'bg-[#dc2626] border-[#ef4444] text-white shadow-[0_2px_10px_rgba(220,38,38,0.4)]'
                : 'bg-[#1a1a1a] border-[#333333] text-[#888888] hover:text-white'
            }`}
          >
            Gota a Gota
          </button>
          <button
            onClick={() => onSetFlowRate('fast')}
            className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold border transition-all cursor-pointer ${
              flowRate === 'fast'
                ? 'bg-[#dc2626] border-[#ef4444] text-white shadow-[0_2px_10px_rgba(220,38,38,0.4)]'
                : 'bg-[#1a1a1a] border-[#333333] text-[#888888] hover:text-white'
            }`}
          >
            Chorro Rápido
          </button>
        </div>

        {/* Notificación de Viraje en tiempo real */}
        {equilibrium.endpointQuality !== 'none' && isSampleDissolved && (
          <div
            className={`px-3 py-1 rounded-xl text-[11px] sm:text-xs font-extrabold border shadow-lg animate-in fade-in shrink-0 font-serif ${
              equilibrium.endpointQuality === 'perfect'
                ? 'bg-[#1f0808] text-[#ef4444] border-[#dc2626]'
                : 'bg-[#2a0505] text-[#ff4444] border-2 border-[#ef4444] animate-pulse'
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
          isBuretteLoaded={isBuretteLoaded}
          isStopcockOpen={isStopcockOpen}
          flowRate={flowRate}
          hasBubble={hasBubble}
          onToggleStopcock={onToggleStopcock}
          onOpenLoupe={onOpenLoupe}
          onOpenTipZoom={onOpenTipZoom}
        />

        <ErlenmeyerSvg
          liquidColorRgba={equilibrium.liquidRgba}
          volumeAddedMl={currentDeliveredMl}
          initialVolumeMl={50}
          isSampleDissolved={isSampleDissolved}
          hasElectrode={practiceNumber === 7 && isSampleDissolved}
          isStirring={isStirring}
          hasIndicator={indicatorDrops > 0}
          pH={equilibrium.pH}
          practiceNumber={practiceNumber}
          onToggleStirring={onToggleStirring}
          onOpenTransferModal={onOpenTransferModal}
        />
      </div>

      {/* Superficie de madera de la mesada de laboratorio con reactivos */}
      <div className="w-full z-10 shrink-0 pt-1">
        <ReagentShelf
          practiceNumber={practiceNumber}
          isBuretteLoaded={isBuretteLoaded}
          isSampleDissolved={isSampleDissolved}
          indicatorDrops={indicatorDrops}
          isBubblePurged={isBubblePurged}
          onLoadBurette={onLoadBurette}
          onOpenTransferModal={onOpenTransferModal}
          onOpenDropperModal={onOpenDropperModal}
          onPurgeBubble={onPurgeBubble}
          onResetBench={onResetBench}
        />
      </div>
    </div>
  );
};

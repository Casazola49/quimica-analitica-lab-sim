import React from 'react';
import { Droplet, Wind, RefreshCw, FlaskConical, Scale, Box } from 'lucide-react';

interface ReagentShelfProps {
  practiceNumber?: number;
  isBuretteLoaded: boolean;
  isSampleDissolved: boolean;
  indicatorDrops: number;
  isBubblePurged: boolean;
  onLoadBurette: () => void;
  onOpenTransferModal: () => void;
  onOpenDropperModal: () => void;
  onPurgeBubble: () => void;
  onResetBench: () => void;
}

export const ReagentShelf: React.FC<ReagentShelfProps> = ({
  practiceNumber = 4,
  isBuretteLoaded,
  isSampleDissolved,
  indicatorDrops,
  isBubblePurged,
  onLoadBurette,
  onOpenTransferModal,
  onOpenDropperModal,
  onPurgeBubble,
  onResetBench,
}) => {
  return (
    <div className="w-full flex flex-col space-y-2 p-2 sm:p-2.5 bg-sumi-900/90 backdrop-blur border border-sumi-700/80 rounded-2xl shadow-xl">
      {/* Bandeja de Materiales e Inventario Físico de Mesada */}
      <div className="flex items-center justify-between px-2 text-[10px] font-mono text-sumi-400 border-b border-sumi-800 pb-1">
        <span className="flex items-center gap-1.5 text-washi-300 font-bold uppercase tracking-wider">
          <Box size={13} className="text-cinabrio-500" />
          <span>Bandeja de Reactivos & Materiales de Mesada:</span>
        </span>
        <span className="hidden sm:inline text-sumi-500">
          *Haga clic en cada reactivo o instrumental para manipular
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {/* 1. Cargar Bureta */}
        {!isBuretteLoaded ? (
          <button
            onClick={onLoadBurette}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cinabrio-600 hover:bg-cinabrio-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg transition-all animate-pulse cursor-pointer"
            title="Llenar la bureta con solución de NaOH ~0.1 N mediante embudo"
          >
            <FlaskConical size={14} />
            <span>1. Cargar Bureta con NaOH 0.1 N</span>
          </button>
        ) : (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-sumi-800 border border-sumi-600 text-washi-300 rounded-xl text-[11px] font-semibold">
            ✓ Bureta cargada con NaOH
          </span>
        )}

        {/* 2. Pesar KHP (P4) o Pipetear HCl (P7) */}
        {!isSampleDissolved ? (
          <button
            onClick={onOpenTransferModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg transition-all animate-pulse cursor-pointer"
            title={practiceNumber === 7 ? "Pipetear 25.00 mL de HCl con propipeta" : "Pesar patrón primario KHP en la balanza analítica Mettler"}
          >
            <Scale size={14} />
            <span>{practiceNumber === 7 ? '2. Pipetear 25.00 mL de HCl' : '2. Pesar KHP en Balanza'}</span>
          </button>
        ) : (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-purple-950/60 border border-purple-700/50 text-purple-300 rounded-xl text-[11px] font-semibold">
            {practiceNumber === 7 ? '✓ 25.00 mL HCl + Electrodo' : '✓ KHP Disuelto en Erlenmeyer'}
          </span>
        )}

        {/* 3. Purga de Burbuja con Zoom */}
        <button
          onClick={onPurgeBubble}
          disabled={isBubblePurged || !isBuretteLoaded}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
            !isBuretteLoaded
              ? 'bg-sumi-800 border-sumi-700 text-sumi-500 cursor-not-allowed'
              : isBubblePurged
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 cursor-default'
              : 'bg-amber-600/30 hover:bg-amber-600/50 border-amber-500 text-amber-200 animate-pulse cursor-pointer'
          }`}
          title="Inspeccionar extremo capilar y purgar burbujas hacia vaso de desecho"
        >
          <Wind size={14} className={isBubblePurged ? 'text-emerald-400' : 'text-amber-400'} />
          <span>{isBubblePurged ? '✓ Llave Purgada' : 'Purgar Burbuja (Zoom)'}</span>
        </button>

        {/* 4. Frasco Cuentagotas de Fenolftaleína Interactivo */}
        <button
          onClick={onOpenDropperModal}
          disabled={!isSampleDissolved || indicatorDrops >= 5}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${
            !isSampleDissolved
              ? 'bg-sumi-800 border-sumi-700 text-sumi-500 cursor-not-allowed'
              : indicatorDrops > 0
              ? 'bg-pink-950/60 border-pink-500/50 text-pink-200'
              : 'bg-pink-600/30 hover:bg-pink-600/50 border-pink-400 text-pink-100 animate-pulse'
          }`}
          title="Abrir gotero ámbar para añadir gotas con halo cromático"
        >
          <Droplet size={14} className={indicatorDrops > 0 ? 'text-pink-400 fill-pink-400/50' : 'text-pink-300'} />
          <span>
            Gotero Fenolftaleína ({indicatorDrops} {indicatorDrops === 1 ? 'gota' : 'gotas'})
          </span>
        </button>

        {/* 5. Reiniciar Mesada */}
        <button
          onClick={onResetBench}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-sumi-800 hover:bg-sumi-700 border border-sumi-600 text-washi-300 hover:text-white rounded-xl text-xs font-medium transition-all cursor-pointer"
          title="Reiniciar valoración con nuevo montaje en blanco"
        >
          <RefreshCw size={13} />
          <span>Reiniciar</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Droplet, Wind, RefreshCw, FlaskConical, Scale } from 'lucide-react';

interface ReagentShelfProps {
  practiceNumber?: number;
  isBuretteLoaded: boolean;
  isSampleDissolved: boolean;
  indicatorDrops: number;
  isBubblePurged: boolean;
  onLoadBurette: () => void;
  onOpenTransferModal: () => void;
  onAddIndicator: () => void;
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
  onAddIndicator,
  onPurgeBubble,
  onResetBench,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-2xl shadow-xl">
      {/* Botón de Cargar Bureta si aún no fue cargada */}
      {!isBuretteLoaded ? (
        <button
          onClick={onLoadBurette}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg transition-all animate-pulse"
          title="Llenar la bureta con solución de NaOH ~0.1 N mediante embudo"
        >
          <FlaskConical size={14} />
          <span>1. Cargar Bureta con NaOH 0.1 N</span>
        </button>
      ) : (
        <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-950/60 border border-blue-700/50 text-blue-300 rounded-xl text-[11px] font-semibold">
          ✓ Bureta con NaOH
        </span>
      )}

      {/* Botón de Pesar KHP (P4) o Pipetear HCl (P7) */}
      {!isSampleDissolved ? (
        <button
          onClick={onOpenTransferModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg transition-all animate-pulse"
          title={practiceNumber === 7 ? "Pipetear 25.00 mL de HCl con propipeta" : "Pesar patrón primario KHP en la balanza analítica"}
        >
          <Scale size={14} />
          <span>{practiceNumber === 7 ? '2. Pipetear 25.00 mL de HCl' : '2. Pesar KHP en Balanza'}</span>
        </button>
      ) : (
        <span className="flex items-center gap-1 px-2.5 py-1 bg-purple-950/60 border border-purple-700/50 text-purple-300 rounded-xl text-[11px] font-semibold">
          {practiceNumber === 7 ? '✓ 25.00 mL HCl + Electrodo pH' : '✓ KHP Disuelto en Erlenmeyer'}
        </span>
      )}

      {/* Botón de Purga de Burbuja */}
      <button
        onClick={onPurgeBubble}
        disabled={isBubblePurged || !isBuretteLoaded}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
          !isBuretteLoaded
            ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
            : isBubblePurged
            ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 cursor-default'
            : 'bg-amber-600/30 hover:bg-amber-600/50 border-amber-500 text-amber-200 animate-pulse'
        }`}
        title="Abrir llave bruscamente hacia vaso de desecho para purgar burbuja"
      >
        <Wind size={14} className={isBubblePurged ? 'text-emerald-400' : 'text-amber-400'} />
        <span>{isBubblePurged ? '✓ Llave Purgada' : 'Purgar Burbuja'}</span>
      </button>

      {/* Botón de Fenolftaleína */}
      <button
        onClick={onAddIndicator}
        disabled={indicatorDrops >= 5 || !isSampleDissolved}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
          !isSampleDissolved
            ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
            : indicatorDrops > 0
            ? 'bg-pink-600/30 border-pink-500/50 text-pink-200'
            : 'bg-slate-700/80 hover:bg-slate-600 border-slate-500 text-slate-100 hover:border-pink-400'
        }`}
        title="Añadir gotas de fenolftaleína al matraz"
      >
        <Droplet size={14} className={indicatorDrops > 0 ? 'text-pink-400 fill-pink-400/50' : 'text-slate-300'} />
        <span>
          Fenolftaleína ({indicatorDrops} {indicatorDrops === 1 ? 'gota' : 'gotas'})
        </span>
      </button>

      {/* Botón de Reiniciar Mesada */}
      <button
        onClick={onResetBench}
        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-700/60 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all"
        title="Reiniciar valoración con nuevo montaje"
      >
        <RefreshCw size={13} />
        <span>Reiniciar</span>
      </button>
    </div>
  );
};

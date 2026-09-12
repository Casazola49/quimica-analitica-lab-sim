import React from 'react';
import { Droplet, Wind, RefreshCw } from 'lucide-react';

interface ReagentShelfProps {
  indicatorDrops: number;
  isBubblePurged: boolean;
  onAddIndicator: () => void;
  onPurgeBubble: () => void;
  onResetBench: () => void;
}

export const ReagentShelf: React.FC<ReagentShelfProps> = ({
  indicatorDrops,
  isBubblePurged,
  onAddIndicator,
  onPurgeBubble,
  onResetBench,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-3 bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-2xl shadow-xl">
      {/* Botón de Fenolftaleína */}
      <button
        onClick={onAddIndicator}
        disabled={indicatorDrops >= 5}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
          indicatorDrops > 0
            ? 'bg-pink-600/30 border-pink-500/50 text-pink-200'
            : 'bg-slate-700/80 hover:bg-slate-600 border-slate-500 text-slate-100 hover:border-pink-400'
        }`}
        title="Añadir gotas de fenolftaleína al matraz"
      >
        <Droplet size={16} className={indicatorDrops > 0 ? 'text-pink-400 fill-pink-400/50' : 'text-slate-300'} />
        <span>
          Fenolftaleína ({indicatorDrops} {indicatorDrops === 1 ? 'gota' : 'gotas'})
        </span>
      </button>

      {/* Botón de Purga de Burbuja */}
      <button
        onClick={onPurgeBubble}
        disabled={isBubblePurged}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
          isBubblePurged
            ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 cursor-default'
            : 'bg-amber-600/30 hover:bg-amber-600/50 border-amber-500 text-amber-200 animate-pulse'
        }`}
        title="Abrir llave bruscamente para purgar burbujas de aire"
      >
        <Wind size={16} className={isBubblePurged ? 'text-emerald-400' : 'text-amber-400'} />
        <span>{isBubblePurged ? '✓ Llave Purgada (Sin aire)' : 'Purgar Burbuja de Bureta'}</span>
      </button>

      {/* Botón de Reiniciar Mesada */}
      <button
        onClick={onResetBench}
        className="flex items-center gap-1.5 px-3 py-2 bg-slate-700/60 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all"
        title="Reiniciar valoración con nueva alícuota"
      >
        <RefreshCw size={14} />
        <span>Reiniciar</span>
      </button>
    </div>
  );
};

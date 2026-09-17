import React, { useState } from 'react';
import { X, Droplet } from 'lucide-react';

interface IndicatorDropperModalProps {
  isOpen: boolean;
  currentDrops: number;
  isStirring: boolean;
  onClose: () => void;
  onAddDrop: () => void;
}

export const IndicatorDropperModal: React.FC<IndicatorDropperModalProps> = ({
  isOpen,
  currentDrops,
  isStirring,
  onClose,
  onAddDrop,
}) => {
  const [isSqueezing, setIsSqueezing] = useState<boolean>(false);
  const [haloVisible, setHaloVisible] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSqueezeBulb = () => {
    if (currentDrops >= 5) return;

    setIsSqueezing(true);
    onAddDrop();
    setHaloVisible(true);

    setTimeout(() => {
      setIsSqueezing(false);
    }, 200);

    const fadeTime = isStirring ? 600 : 1500;
    setTimeout(() => {
      setHaloVisible(false);
    }, fadeTime);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md bg-sumi-900 border border-sumi-700 rounded-2xl shadow-2xl p-5 flex flex-col items-center text-washi-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-sumi-400 hover:text-white rounded-lg hover:bg-sumi-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-1.5">
          <Droplet size={20} className="text-pink-400 fill-pink-400/40" />
          <h3 className="text-base font-bold text-washi-100">
            Adición Táctil de Fenolftaleína con Gotero
          </h3>
        </div>
        <p className="text-xs text-sumi-400 text-center mb-4 leading-relaxed">
          Presione la perilla de goma del frasco gotero para dosificar 2 a 3 gotas de fenolftaleína al 0.1% sobre el matraz.
        </p>

        {/* Visualización 2D del gotero sobre la boca del matraz */}
        <div className="relative w-72 h-64 bg-sumi-950 border-2 border-pink-500/30 rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-between p-3">
          <svg width="240" height="230" viewBox="0 0 240 230" className="overflow-visible">
            <defs>
              <linearGradient id="pipetteAmberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="40%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              {/* Fogonazo fucsia transitorio de la fenolftaleína */}
              <radialGradient id="haloBloom" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(236, 72, 153, 0.95)" />
                <stop offset="50%" stopColor="rgba(219, 39, 119, 0.6)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* 1. Frasco Cuentagotas / Pipeta Pasteur con perilla de goma */}
            <g id="dropperAssembly" transform="translate(120, 10)">
              {/* Perilla de goma roja/negra interactiva */}
              <g
                className="cursor-pointer group"
                onClick={handleSqueezeBulb}
                style={{
                  transform: `scale(${isSqueezing ? '0.82, 0.9' : '1, 1'})`,
                  transformOrigin: '0 15px',
                  transition: 'transform 0.15s ease-in-out',
                }}
              >
                <ellipse cx="0" cy="15" rx="14" ry="18" fill="#b91c1c" stroke="#dc2626" strokeWidth="1.5" className="group-hover:fill-red-600 transition-colors" />
                <rect x="-6" y="28" width="12" height="6" fill="#171717" />
              </g>

              {/* Tubo de vidrio de la pipeta gotero */}
              <rect x="-3" y="34" width="6" height="50" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
              {/* Líquido alcohólico dentro del tubo */}
              <rect x="-2" y="35" width="4" height="48" fill="rgba(244, 114, 182, 0.3)" />

              {/* Punta cónica capilar del gotero */}
              <path d="M -3 84 L -1 102 L 1 102 L 3 84 Z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />

              {/* Gota desprendiéndose de la punta si se presiona la perilla */}
              {isSqueezing && (
                <g className="animate-falling-drop">
                  <ellipse cx="0" cy="112" rx="3" ry="5" fill="#f472b6" />
                </g>
              )}
            </g>

            {/* 2. Boca del Erlenmeyer receptor */}
            <g id="flaskMouth" transform="translate(120, 150)">
              {/* Boca y cuello de vidrio */}
              <ellipse cx="0" cy="0" rx="36" ry="6" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
              <path d="M -36 0 L -30 25 L -55 60 L 55 60 L 30 25 L 36 0" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
              {/* Nivel de solución en el cuello */}
              <rect x="-50" y="30" width="100" height="30" fill="rgba(224, 242, 254, 0.35)" />

              {/* Halo fucsia transitorio generado por el impacto de la gota */}
              {haloVisible && (
                <g className={isStirring ? "animate-indicator-bloom" : "animate-pulse"}>
                  <ellipse cx="0" cy="36" rx="28" ry="12" fill="url(#haloBloom)" />
                </g>
              )}
            </g>
          </svg>

          {/* Estado de gotas añadidas */}
          <div className="absolute top-2 left-2 px-2.5 py-1 bg-sumi-900/90 border border-sumi-700 rounded-lg text-xs font-mono text-pink-300">
            Gotas en matraz: <span className="font-bold text-sm">{currentDrops}</span> / 3 óptimas
          </div>
        </div>

        {/* Acciones y Botón interactivo */}
        <div className="w-full mt-4 space-y-2">
          <button
            onClick={handleSqueezeBulb}
            disabled={currentDrops >= 5}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Droplet size={16} className="fill-white" />
            <span>
              {currentDrops < 5
                ? `Apretar Perilla del Gotero (+1 Gota de Fenolftaleína)`
                : 'Dosis máxima añadida (5 gotas)'}
            </span>
          </button>

          {currentDrops >= 2 && (
            <div className="p-2.5 bg-emerald-950/70 border border-emerald-500 rounded-xl text-center text-xs text-emerald-300 animate-in fade-in space-y-1">
              <span className="font-bold">✓ Dosis analítica correcta alcanzada ({currentDrops} gotas).</span>
              <p className="text-[11px] text-emerald-200">
                La fenolftaleína está disuelta homogéneamente en la alícuota ácida (incolora a pH &lt; 8.2).
              </p>
              <button
                onClick={onClose}
                className="mt-1 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all"
              >
                Volver a la Mesada
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

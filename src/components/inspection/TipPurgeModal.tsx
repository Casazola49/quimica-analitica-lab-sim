import React, { useState } from 'react';
import { X, Check, AlertTriangle, RotateCw, CheckCircle2 } from 'lucide-react';
import { HankoSeal } from '../common/HankoSeal';

interface TipPurgeModalProps {
  isOpen: boolean;
  hasBubble: boolean;
  onClose: () => void;
  onPurgeComplete: () => void;
}

export const TipPurgeModal: React.FC<TipPurgeModalProps> = ({
  isOpen,
  hasBubble,
  onClose,
  onPurgeComplete,
}) => {
  const [stopcockRotated, setStopcockRotated] = useState<boolean>(false);
  const [isFlushing, setIsFlushing] = useState<boolean>(false);
  const [bubbleDislodged, setBubbleDislodged] = useState<boolean>(!hasBubble);

  if (!isOpen) return null;

  const handleTwistStopcock = () => {
    if (isFlushing) return;

    setIsFlushing(true);
    setStopcockRotated(true);

    setTimeout(() => {
      setBubbleDislodged(true);
      onPurgeComplete();
      setIsFlushing(false);
      setTimeout(() => {
        setStopcockRotated(false);
      }, 400);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none font-sans">
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-[#262626] rounded-2xl shadow-2xl p-6 flex flex-col items-center text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#666666] hover:text-white rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-1.5">
          <HankoSeal size="sm" variant="stamp" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-serif">
            Inspección y Purga del Pico de la Bureta (4x)
          </h3>
        </div>
        <p className="text-xs text-[#888888] text-center mb-4 leading-relaxed">
          Acérquese al extremo inferior de la bureta. En el laboratorio real debe abrir bruscamente la llave hacia el vaso de desecho para desalojar el aire atrapado por empuje hidrostático.
        </p>

        {/* Visor SVG del Pico (Zoom 4x) */}
        <div className="relative w-72 h-64 bg-[#050505] border-2 border-[#dc2626]/60 rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-center">
          <svg width="280" height="250" viewBox="0 0 280 250" className="overflow-visible">
            <defs>
              <linearGradient id="tipGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="30%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
              </linearGradient>

              <linearGradient id="tipLiquidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.55)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.85)" />
              </linearGradient>
            </defs>

            {/* Cuerpo de la bureta superior */}
            <rect x="115" y="10" width="50" height="60" fill="url(#tipLiquidGrad)" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />

            {/* Llave de Bureta (Stopcock ampliado en Cinabrio) */}
            <g id="stopcockZoom" transform="translate(140, 70)">
              <rect x="-24" y="-12" width="48" height="24" rx="3" fill="#171717" stroke="#383838" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="8" fill="#080808" />

              <g
                style={{
                  transform: `rotate(${stopcockRotated ? 90 : 0}deg)`,
                  transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformOrigin: '0 0',
                }}
              >
                <rect x="-35" y="-6" width="70" height="12" rx="6" fill="#dc2626" stroke="#ef4444" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="5" fill="#ffffff" />
              </g>
            </g>

            {/* Punta cónica capilar */}
            <path
              d="M 125 82 L 134 165 L 146 165 L 155 82 Z"
              fill={bubbleDislodged || isFlushing ? "url(#tipLiquidGrad)" : "rgba(255,255,255,0.1)"}
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2"
            />

            {/* Burbuja atrapada con resplandor cinabrio */}
            {!bubbleDislodged && (
              <g className={isFlushing ? "animate-ping" : "animate-pulse"}>
                <ellipse
                  cx="140"
                  cy={isFlushing ? 175 : 125}
                  rx="6"
                  ry="12"
                  fill="#ffffff"
                  stroke="#dc2626"
                  strokeWidth="2"
                />
                <text x="152" y="128" fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  Burbuja de aire (~0.2 mL)
                </text>
              </g>
            )}

            {/* Chorro de purga */}
            {isFlushing && (
              <line x1="140" y1="165" x2="140" y2="215" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" className="animate-pulse" />
            )}

            {/* Vaso de desecho */}
            <g id="wasteBeaker" transform="translate(100, 195)">
              <rect x="0" y="0" width="80" height="50" rx="3" fill="#141414" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              <rect x="2" y="25" width="76" height="23" fill="rgba(255, 255, 255, 0.15)" />
              <text x="40" y="40" fill="#888888" fontSize="8" textAnchor="middle" fontFamily="sans-serif">
                Vaso Desecho
              </text>
            </g>
          </svg>

          <div className="absolute top-2 left-2 px-2.5 py-1 bg-[#0a0a0a]/95 border border-[#262626] rounded-lg text-xs font-mono">
            {bubbleDislodged ? (
              <span className="text-white font-bold flex items-center gap-1">
                <Check size={13} className="text-[#dc2626]" /> Punta llena (Sin aire)
              </span>
            ) : (
              <span className="text-[#ef4444] font-bold flex items-center gap-1">
                <AlertTriangle size={13} /> Aire en el capilar
              </span>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="w-full mt-4 space-y-2 font-serif">
          {!bubbleDislodged ? (
            <button
              onClick={handleTwistStopcock}
              disabled={isFlushing}
              className="w-full py-3 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-red-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <RotateCw size={16} className={isFlushing ? "animate-spin" : ""} />
              <span>Girar llave con golpe enérgico de 180°</span>
            </button>
          ) : (
            <div className="p-3.5 bg-[#1f0808] border-2 border-[#dc2626] rounded-xl text-center space-y-1.5 text-xs text-white animate-in fade-in">
              <div className="flex items-center justify-center gap-1.5 font-bold text-[#ef4444]">
                <CheckCircle2 size={16} />
                <span>¡PICO DE BURETA PURGADO EXITOSAMENTE!</span>
              </div>
              <p className="text-[11px] text-[#cccccc] font-sans">
                La columna de titulante ahora es continua hasta la punta. No habrá falso desplazamiento de volumen.
              </p>
              <button
                onClick={onClose}
                className="mt-2 w-full py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-xl text-xs transition-all cursor-pointer uppercase tracking-wider"
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

import React, { useState } from 'react';
import { X, Check, Wind, AlertTriangle, RotateCw, CheckCircle2 } from 'lucide-react';

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

    // Animación de expulsión violenta de la burbuja por presión hidrostática
    setTimeout(() => {
      setBubbleDislodged(true);
      onPurgeComplete();
      setIsFlushing(false);
      setTimeout(() => {
        setStopcockRotated(false); // Cierra automáticamente tras el golpe de purga
      }, 400);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 flex flex-col items-center text-slate-100">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-1.5">
          <Wind size={20} className="text-amber-400" />
          <h3 className="text-base font-bold text-slate-100">
            Inspección y Purga del Pico de la Bureta (4x)
          </h3>
        </div>
        <p className="text-xs text-slate-400 text-center mb-4 leading-relaxed">
          Acérquese al extremo inferior de la bureta. En el laboratorio real debe abrir bruscamente la llave hacia el vaso de desecho para desalojar el aire atrapado por empuje hidrostático.
        </p>

        {/* Visor SVG de Inspección del Pico (Zoom 4x) */}
        <div className="relative w-72 h-64 bg-slate-950 border-2 border-amber-500/40 rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-center">
          <svg width="280" height="250" viewBox="0 0 280 250" className="overflow-visible">
            <defs>
              <linearGradient id="tipGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="30%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
              </linearGradient>

              <linearGradient id="tipLiquidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(224, 242, 254, 0.7)" />
                <stop offset="100%" stopColor="rgba(186, 230, 253, 0.9)" />
              </linearGradient>
            </defs>

            {/* 1. Cuerpo de la bureta superior (ancho ampliado 50px) */}
            <rect x="115" y="10" width="50" height="60" fill="url(#tipLiquidGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />

            {/* 2. Llave de Bureta (Stopcock con válvula de teflón ampliada) */}
            <g id="stopcockZoom" transform="translate(140, 70)">
              {/* Cuerpo cilíndrico esmerilado */}
              <rect x="-24" y="-12" width="48" height="24" rx="3" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="8" fill="#334155" />

              {/* Vástago giratorio con animación al girar */}
              <g
                style={{
                  transform: `rotate(${stopcockRotated ? 90 : 0}deg)`,
                  transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformOrigin: '0 0',
                }}
              >
                <rect x="-35" y="-6" width="70" height="12" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="5" fill="#f8fafc" />
              </g>
            </g>

            {/* 3. Tubo capilar cónico y punta de la bureta */}
            <path
              d="M 125 82 L 134 165 L 146 165 L 155 82 Z"
              fill={bubbleDislodged || isFlushing ? "url(#tipLiquidGrad)" : "rgba(255,255,255,0.1)"}
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2"
            />

            {/* 4. Burbuja de aire atrapada en la punta si no fue purgada */}
            {!bubbleDislodged && (
              <g className={isFlushing ? "animate-ping" : "animate-pulse"}>
                <ellipse
                  cx="140"
                  cy={isFlushing ? 175 : 125}
                  rx="6"
                  ry="12"
                  fill="rgba(255,255,255,0.95)"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                <text x="152" y="128" fill="#f59e0b" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
                  Burbuja de aire (~0.2 mL)
                </text>
              </g>
            )}

            {/* 5. Chorro de purga hacia el vaso de desecho */}
            {isFlushing && (
              <line x1="140" y1="165" x2="140" y2="215" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" className="animate-pulse" />
            )}

            {/* 6. Vaso de precipitado de desecho colocado debajo */}
            <g id="wasteBeaker" transform="translate(100, 195)">
              <rect x="0" y="0" width="80" height="50" rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              <rect x="2" y="25" width="76" height="23" fill="rgba(224, 242, 254, 0.3)" />
              <text x="40" y="40" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle" fontFamily="sans-serif">
                Vaso Desecho
              </text>
            </g>
          </svg>

          {/* Estado de la punta */}
          <div className="absolute top-2 left-2 px-2.5 py-1 bg-slate-900/90 border border-slate-700 rounded-lg text-xs font-mono">
            {bubbleDislodged ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check size={13} /> Punta llena (Sin aire)
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <AlertTriangle size={13} /> Aire en el capilar
              </span>
            )}
          </div>
        </div>

        {/* Acciones interactivas */}
        <div className="w-full mt-4 space-y-2">
          {!bubbleDislodged ? (
            <button
              onClick={handleTwistStopcock}
              disabled={isFlushing}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <RotateCw size={16} className={isFlushing ? "animate-spin" : ""} />
              <span>Girar llave con golpe enérgico de 180° hacia el desecho</span>
            </button>
          ) : (
            <div className="p-3 bg-emerald-950/70 border border-emerald-500 rounded-xl text-center space-y-1 text-xs text-emerald-300 animate-in fade-in">
              <div className="flex items-center justify-center gap-1.5 font-bold">
                <CheckCircle2 size={16} />
                <span>¡Pico de bureta purgado exitosamente!</span>
              </div>
              <p className="text-[11px] text-emerald-200">
                La columna de titulante ahora es continua hasta la punta. No habrá falso desplazamiento de volumen.
              </p>
              <button
                onClick={onClose}
                className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all"
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

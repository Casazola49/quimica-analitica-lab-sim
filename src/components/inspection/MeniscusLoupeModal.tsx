import React, { useState } from 'react';
import { X, Check, Eye, AlertTriangle } from 'lucide-react';
import { HankoSeal } from '../common/HankoSeal';

interface MeniscusLoupeModalProps {
  isOpen: boolean;
  currentActualVolumeMl: number;
  initialReadingRecorded: boolean;
  onClose: () => void;
  onTransferReading: (volume: number, target: 'initial' | 'final') => void;
  onParallaxChanged: (angleDegrees: number) => void;
}

export const MeniscusLoupeModal: React.FC<MeniscusLoupeModalProps> = ({
  isOpen,
  currentActualVolumeMl,
  initialReadingRecorded,
  onClose,
  onTransferReading,
  onParallaxChanged,
}) => {
  const [parallaxAngle, setParallaxAngle] = useState<number>(0);
  const [readingTarget, setReadingTarget] = useState<'initial' | 'final'>(
    initialReadingRecorded ? 'final' : 'initial'
  );

  if (!isOpen) return null;

  const parallaxOffsetMl = Math.sin((parallaxAngle * Math.PI) / 180) * 0.45;
  const observedReadingMl = Math.max(0, Math.min(50, currentActualVolumeMl + parallaxOffsetMl));

  const handleAngleChange = (angle: number) => {
    setParallaxAngle(angle);
    onParallaxChanged(angle);
  };

  const handleConfirm = () => {
    onTransferReading(Number(observedReadingMl.toFixed(2)), readingTarget);
    onClose();
  };

  const integerPart = Math.floor(observedReadingMl);
  const fractionalPart = observedReadingMl - integerPart;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none font-sans">
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
            Lupa Óptica de Menisco (4x)
          </h3>
        </div>
        <p className="text-xs text-[#888888] text-center mb-4 leading-relaxed">
          Observe la base del menisco cóncavo tangencial a la graduación. Ajuste la línea de mira para corregir el error de paralaje.
        </p>

        {/* Visor SVG de la Lupa (Zoom 4x) en Negro y Blanco de Alto Contraste */}
        <div className="relative w-72 h-64 bg-[#050505] border-2 border-[#dc2626]/60 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
          <svg width="280" height="250" viewBox="0 0 280 250" className="overflow-visible">
            <defs>
              <linearGradient id="loupeGlass" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                <stop offset="40%" stopColor="transparent" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.35)" />
              </linearGradient>

              <linearGradient id="loupeLiquid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.75)" />
              </linearGradient>
            </defs>

            {/* Columna de la bureta ampliada */}
            <rect x="80" y="0" width="120" height="250" fill="#0d0d0d" stroke="#383838" strokeWidth="2" />
            <rect x="80" y="125" width="120" height="125" fill="url(#loupeLiquid)" />

            {/* Menisco cóncavo con acento rojo cinabrio */}
            <path
              d={`M 80 125 C 110 ${125 + 24 - parallaxAngle * 1.5}, 170 ${125 + 24 - parallaxAngle * 1.5}, 200 125`}
              stroke="#dc2626"
              strokeWidth="4"
              fill="rgba(220, 38, 38, 0.3)"
            />

            {/* Línea horizontal guía de mira óptica */}
            <line
              x1="30"
              y1="125"
              x2="250"
              y2={125 + parallaxAngle * 2.5}
              stroke={Math.abs(parallaxAngle) < 1.5 ? '#ffffff' : '#dc2626'}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />

            {/* Graduaciones cada 0.1 mL */}
            {Array.from({ length: 21 }).map((_, idx) => {
              const mlOffset = (idx - 10) * 0.1;
              const lineY = 125 - mlOffset * 80;
              const isMajor = Math.abs(Math.round(mlOffset * 10)) % 10 === 0;
              const isHalf = Math.abs(Math.round(mlOffset * 10)) % 5 === 0 && !isMajor;
              const width = isMajor ? 32 : isHalf ? 20 : 12;

              if (lineY < 10 || lineY > 240) return null;
              const labelValue = Number((integerPart + fractionalPart + mlOffset).toFixed(1));

              return (
                <g key={idx}>
                  <line
                    x1={200 - width}
                    y1={lineY}
                    x2={200}
                    y2={lineY}
                    stroke="#ffffff"
                    strokeWidth={isMajor ? 2.5 : isHalf ? 1.8 : 1.2}
                  />
                  {isMajor && (
                    <text
                      x="208"
                      y={lineY + 4}
                      fill="#ffffff"
                      fontSize="13"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {labelValue.toFixed(0)}
                    </text>
                  )}
                </g>
              );
            })}

            <rect x="80" y="0" width="120" height="250" fill="url(#loupeGlass)" pointerEvents="none" />
          </svg>

          {/* Valor de lectura estimada */}
          <div className="absolute top-2 left-2 px-2.5 py-1 bg-[#0a0a0a]/95 border border-[#2b2b2b] rounded-lg text-xs font-mono text-white">
            Lectura: <span className="font-bold text-sm text-[#ef4444]">{observedReadingMl.toFixed(2)} mL</span>
          </div>
        </div>

        {/* Control interactivo de Error de Paralaje */}
        <div className="w-full mt-4 p-3.5 bg-[#121212] border border-[#262626] rounded-xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#aaaaaa] font-medium flex items-center gap-1">
              <Eye size={14} className="text-[#dc2626]" />
              Línea de visión (Ángulo de mira):
            </span>
            <span
              className={`font-mono font-bold ${
                Math.abs(parallaxAngle) < 1.5 ? 'text-white' : 'text-[#ef4444]'
              }`}
            >
              {parallaxAngle > 0 ? `+${parallaxAngle}° (Desde arriba)` : parallaxAngle < 0 ? `${parallaxAngle}° (Desde abajo)` : '0° (Horizontal Tangencial)'}
            </span>
          </div>

          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={parallaxAngle}
            onChange={(e) => handleAngleChange(Number(e.target.value))}
            className="w-full h-2 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-[#dc2626]"
          />

          {Math.abs(parallaxAngle) >= 2 && (
            <div className="flex items-start gap-1.5 text-[11px] text-[#ff8888] bg-[#2a0505] p-2.5 rounded-lg border border-[#dc2626]/60">
              <AlertTriangle size={14} className="text-[#ef4444] shrink-0 mt-0.5" />
              <span>
                <strong>Atención:</strong> La línea de mira inclinada introduce un error sistemático de paralaje de {(parallaxOffsetMl >= 0 ? '+' : '') + parallaxOffsetMl.toFixed(2)} mL.
              </span>
            </div>
          )}
        </div>

        {/* Acciones de cota inicial/final y confirmación */}
        <div className="w-full mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={() => setReadingTarget('initial')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                readingTarget === 'initial'
                  ? 'bg-[#dc2626] border-[#ef4444] text-white'
                  : 'bg-[#141414] border-[#2b2b2b] text-[#888888] hover:text-white'
              }`}
            >
              Cota Inicial (V0)
            </button>
            <button
              onClick={() => setReadingTarget('final')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                readingTarget === 'final'
                  ? 'bg-[#dc2626] border-[#ef4444] text-white'
                  : 'bg-[#141414] border-[#2b2b2b] text-[#888888] hover:text-white'
              }`}
            >
              Cota Final (Vf)
            </button>
          </div>

          <button
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-950/40 transition-all cursor-pointer uppercase tracking-wider font-serif"
          >
            <Check size={16} />
            <span>Anotar en Libreta</span>
          </button>
        </div>
      </div>
    </div>
  );
};

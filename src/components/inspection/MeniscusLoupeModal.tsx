import React, { useState } from 'react';
import { X, Check, Eye, AlertTriangle } from 'lucide-react';

interface MeniscusLoupeModalProps {
  isOpen: boolean;
  currentActualVolumeMl: number; // volumen real entregado
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

  // Cálculo del error óptico de paralaje inducido por el ángulo visual:
  // delta_V = sin(angle) * 0.4 mL
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

  // Coordenadas ampliadas de la lupa (Zoom 4x)
  // Ventana centrada en observedReadingMl
  const integerPart = Math.floor(observedReadingMl);
  const fractionalPart = observedReadingMl - integerPart;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Eye size={22} className="text-blue-400" />
          <h3 className="text-lg font-bold text-slate-100">Lupa Óptica de Menisco (4x)</h3>
        </div>
        <p className="text-xs text-slate-400 text-center mb-4">
          Observe la base del menisco cóncavo tangencial a la graduación. Ajuste la línea de mira para corregir el error de paralaje.
        </p>

        {/* Visor SVG de la Lupa (Zoom 4x) */}
        <div className="relative w-72 h-64 bg-slate-950 border-2 border-blue-500/40 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
          <svg width="280" height="250" viewBox="0 0 280 250" className="overflow-visible">
            <defs>
              <linearGradient id="loupeGlass" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="40%" stopColor="transparent" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
              </linearGradient>

              <linearGradient id="loupeLiquid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(56, 189, 248, 0.4)" />
                <stop offset="100%" stopColor="rgba(2, 132, 199, 0.6)" />
              </linearGradient>
            </defs>

            {/* Columna de la bureta ampliada (ancho 120px) */}
            <rect x="80" y="0" width="120" height="250" fill="#0f172a" stroke="#475569" strokeWidth="2" />

            {/* Masa de líquido bajo el menisco */}
            {/* El menisco se posiciona centrado en Y = 125 */}
            <rect x="80" y="125" width="120" height="125" fill="url(#loupeLiquid)" />

            {/* Menisco cóncavo (curva Bézier con deformación por ángulo de paralaje) */}
            <path
              d={`M 80 125 C 110 ${125 + 24 - parallaxAngle * 1.5}, 170 ${125 + 24 - parallaxAngle * 1.5}, 200 125`}
              stroke="#38bdf8"
              strokeWidth="4"
              fill="rgba(56, 189, 248, 0.25)"
            />

            {/* Línea horizontal guía de mira óptica (verde cuando ángulo es 0°) */}
            <line
              x1="30"
              y1="125"
              x2="250"
              y2={125 + parallaxAngle * 2.5}
              stroke={Math.abs(parallaxAngle) < 1.5 ? '#10b981' : '#f59e0b'}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />

            {/* Graduaciones cada 0.1 mL proyectadas con escala ampliada */}
            {/* 1 mL = 80px en coordenadas SVG */}
            {Array.from({ length: 21 }).map((_, idx) => {
              // idx = 0 corresponde a -1.0 mL respecto a la cota actual
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
                      fill="#f8fafc"
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

            {/* Vidrio frontal con brillo */}
            <rect x="80" y="0" width="120" height="250" fill="url(#loupeGlass)" pointerEvents="none" />
          </svg>

          {/* Valor de lectura estimada en tiempo real */}
          <div className="absolute top-2 left-2 px-2.5 py-1 bg-slate-900/90 border border-slate-700 rounded-lg text-xs font-mono text-cyan-300">
            Lectura observada: <span className="font-bold text-sm">{observedReadingMl.toFixed(2)} mL</span>
          </div>
        </div>

        {/* Control interactivo de Error de Paralaje */}
        <div className="w-full mt-4 p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-300 font-medium flex items-center gap-1">
              <Eye size={14} className="text-blue-400" />
              Ángulo de mira (Línea de visión):
            </span>
            <span
              className={`font-mono font-bold ${
                Math.abs(parallaxAngle) < 1.5 ? 'text-emerald-400' : 'text-amber-400'
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
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />

          {Math.abs(parallaxAngle) >= 2 && (
            <div className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/30">
              <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Atención:</strong> La línea de mira no está perpendicular al tubo. Esto induce un error sistemático de paralaje de {(parallaxOffsetMl >= 0 ? '+' : '') + parallaxOffsetMl.toFixed(2)} mL.
              </span>
            </div>
          )}
        </div>

        {/* Selector de destino de transferencia y confirmación */}
        <div className="w-full mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReadingTarget('initial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                readingTarget === 'initial'
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              Cota Inicial (V0)
            </button>
            <button
              onClick={() => setReadingTarget('final')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                readingTarget === 'final'
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              Cota Final (Vf)
            </button>
          </div>

          <button
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-lg transition-all"
          >
            <Check size={16} />
            <span>Anotar en Libreta</span>
          </button>
        </div>
      </div>
    </div>
  );
};

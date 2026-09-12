import React from 'react';
import { RotateCw } from 'lucide-react';

interface ErlenmeyerSvgProps {
  liquidColorRgba: string;
  volumeAddedMl: number;
  initialVolumeMl: number; // 50 mL de disolución inicial
  isStirring: boolean;
  hasIndicator: boolean;
  pH: number;
  onToggleStirring: () => void;
}

export const ErlenmeyerSvg: React.FC<ErlenmeyerSvgProps> = ({
  liquidColorRgba,
  volumeAddedMl,
  initialVolumeMl,
  isStirring,
  hasIndicator,
  pH,
  onToggleStirring,
}) => {
  const currentTotalMl = initialVolumeMl + volumeAddedMl;
  // Mapeo de volumen (50 mL a 80 mL) a altura del líquido dentro del matraz
  // Nivel base a 50 mL: Y = 135
  // Nivel máximo a 80 mL: Y = 110
  const fillLevelY = Math.max(105, 140 - ((currentTotalMl - 50) / 30) * 28);

  return (
    <div className="relative flex flex-col items-center select-none -mt-4">
      <svg width="220" height="200" viewBox="0 0 220 200" className="overflow-visible">
        <defs>
          {/* Sombra de la base del erlenmeyer */}
          <radialGradient id="baseShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.5)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Máscara interna para que el líquido respete la forma cónica */}
          <clipPath id="flaskClip">
            <path d="M 92 35 L 92 75 L 35 170 C 35 178, 45 182, 60 182 L 160 182 C 175 182, 185 178, 185 170 L 128 75 L 128 35 Z" />
          </clipPath>
        </defs>

        {/* 1. Base del Agitador Magnético */}
        <g id="magneticStirrerPlate">
          <ellipse cx="110" cy="188" rx="85" ry="12" fill="url(#baseShadow)" />
          {/* Placa calefactora/agitadora blanca de porcelana */}
          <rect x="25" y="180" width="170" height="14" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
          <ellipse cx="110" cy="180" rx="75" ry="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        </g>

        {/* 2. Cuerpo del Matraz Erlenmeyer de 250 mL */}
        <g id="flaskBody">
          {/* Líquido coloreado recortado con la máscara cónica */}
          <g clipPath="url(#flaskClip)">
            {/* Masa de líquido con transición de color fluida */}
            <rect
              x="20"
              y={fillLevelY}
              width="180"
              height={185 - fillLevelY}
              fill={liquidColorRgba}
              className="transition-colors duration-200"
            />

            {/* Vórtice de agitación magnética en el centro si está activo */}
            {isStirring && (
              <path
                d={`M 104 ${fillLevelY} Q 110 ${fillLevelY + 8} 116 ${fillLevelY} Q 110 ${fillLevelY + 20} 110 ${fillLevelY + 35}`}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
              />
            )}

            {/* Barra magnética de teflón girando en el fondo */}
            <rect
              x={isStirring ? "98" : "96"}
              y="172"
              width="24"
              height="6"
              rx="3"
              fill="#ffffff"
              stroke="#94a3b8"
              strokeWidth="0.8"
              className={isStirring ? "animate-spin origin-center" : ""}
            />
          </g>

          {/* Vidrio exterior del matraz (boca, cuello recto y cono) */}
          <path
            d="M 92 35 L 92 75 L 35 170 C 35 178, 45 182, 60 182 L 160 182 C 175 182, 185 170 L 128 75 L 128 35 Z"
            fill="none"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="2"
          />

          {/* Reborde esmerilado de la boca del matraz */}
          <ellipse cx="110" cy="35" rx="19" ry="4" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />

          {/* Graduaciones serigrafiadas blancas en el vidrio (100, 150, 200 mL) */}
          <line x1="85" y1="145" x2="105" y2="145" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          <text x="108" y="148" fill="rgba(255,255,255,0.6)" fontSize="7" fontFamily="sans-serif">100 mL</text>

          <line x1="90" y1="125" x2="108" y2="125" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          <text x="111" y="128" fill="rgba(255,255,255,0.6)" fontSize="7" fontFamily="sans-serif">150 mL</text>

          {/* Reflejo curvado del vidrio lateral */}
          <path
            d="M 45 168 L 96 78"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Panel de control de agitación y lecturas instantáneas */}
      <div className="flex items-center gap-3 mt-1 text-xs">
        <button
          onClick={onToggleStirring}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-medium transition-all shadow-sm ${
            isStirring
              ? 'bg-blue-600/30 border-blue-400 text-blue-300'
              : 'bg-slate-800 border-slate-600 text-slate-400 hover:text-slate-200'
          }`}
          title="Activar/desactivar agitador magnético"
        >
          <RotateCw size={14} className={isStirring ? 'animate-spin text-blue-400' : ''} />
          <span>{isStirring ? 'Agitación ON' : 'Agitación OFF'}</span>
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-300 font-mono">
          <span className="text-slate-400">pH:</span>
          <span className="font-bold text-amber-300">{pH.toFixed(2)}</span>
        </div>

        {!hasIndicator && (
          <span className="text-[11px] text-rose-400 font-medium animate-pulse">
            ⚠️ Sin indicador
          </span>
        )}
      </div>
    </div>
  );
};

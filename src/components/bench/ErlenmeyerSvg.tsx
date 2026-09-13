import React from 'react';
import { Waves } from 'lucide-react';

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
  // Nivel base a 50 mL: Y = 138
  // Nivel máximo a 80 mL: Y = 112
  const fillLevelY = Math.max(105, 140 - ((currentTotalMl - 50) / 30) * 28);

  // Cuando la agitación está encendida, se forma un vórtice cóncavo en el centro
  const vortexDepth = isStirring ? 14 : 3;

  return (
    <div className="relative flex flex-col items-center select-none -mt-4">
      <svg width="220" height="200" viewBox="0 0 220 200" className="overflow-visible">
        <defs>
          {/* Sombra de la base del erlenmeyer */}
          <radialGradient id="baseShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.5)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Máscara interna para que el líquido respete la forma cónica del Erlenmeyer */}
          <clipPath id="flaskClip">
            <path d="M 92 35 L 92 75 L 35 170 C 35 178, 45 182, 60 182 L 160 182 C 175 182, 185 178, 185 170 L 128 75 L 128 35 Z" />
          </clipPath>

          {/* Gradiente de luz para la barra magnética de teflón */}
          <linearGradient id="teflonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {/* 1. Base del Agitador Magnético */}
        <g id="magneticStirrerPlate">
          <ellipse cx="110" cy="188" rx="85" ry="12" fill="url(#baseShadow)" />
          {/* Placa calefactora/agitadora blanca de porcelana con chasis de laboratorio */}
          <rect x="25" y="180" width="170" height="14" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
          <ellipse cx="110" cy="180" rx="75" ry="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          {/* Indicador LED verde de agitación activa */}
          <circle cx="178" cy="187" r="2" fill={isStirring ? '#10b981' : '#64748b'} className={isStirring ? 'animate-ping' : ''} />
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
              className="transition-colors duration-300"
            />

            {/* Superficie libre del líquido con curvatura de menisco o depresión por vórtice */}
            <path
              d={`M 30 ${fillLevelY} Q 110 ${fillLevelY + vortexDepth} 190 ${fillLevelY} L 190 ${fillLevelY + 2} Q 110 ${fillLevelY + vortexDepth + 2} 30 ${fillLevelY + 2} Z`}
              fill="rgba(255, 255, 255, 0.45)"
            />

            {/* Espiral interna y ondas del vórtice cuando está en agitación constante */}
            {isStirring && (
              <g opacity="0.6">
                {/* Remolino cónico descendente */}
                <path
                  d={`M 104 ${fillLevelY + 2} Q 110 ${fillLevelY + 14} 116 ${fillLevelY + 2} Q 110 ${fillLevelY + 24} 107 ${fillLevelY + 36}`}
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                <path
                  d={`M 108 ${fillLevelY + 8} Q 110 ${fillLevelY + 18} 112 ${fillLevelY + 28}`}
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1.2"
                  fill="none"
                />
                {/* Microburbujas generadas por la agitación en el seno del líquido */}
                <circle cx="102" cy={fillLevelY + 22} r="1" fill="#ffffff" opacity="0.8" />
                <circle cx="118" cy={fillLevelY + 28} r="1.2" fill="#ffffff" opacity="0.7" />
                <circle cx="98" cy={fillLevelY + 35} r="0.8" fill="#ffffff" opacity="0.6" />
              </g>
            )}

            {/* Barra magnética de teflón (Pez magnético) en el fondo del matraz */}
            <g transform="translate(110, 175)">
              <g className={isStirring ? 'animate-stir-bar' : ''}>
                {/* Forma de cápsula cilíndrica de teflón blanca */}
                <rect
                  x="-12"
                  y="-3"
                  width="24"
                  height="6"
                  rx="3"
                  fill="url(#teflonGrad)"
                  stroke="#64748b"
                  strokeWidth="0.8"
                  filter="drop-shadow(0 1px 2px rgba(0,0,0,0.3))"
                />
                {/* Anillo central estabilizador de la barra */}
                <line x1="0" y1="-3" x2="0" y2="3" stroke="#94a3b8" strokeWidth="1" />
              </g>
            </g>
          </g>

          {/* Vidrio exterior del matraz (boca esmerilada, cuello recto y cono) */}
          <path
            d="M 92 35 L 92 75 L 35 170 C 35 178, 45 182, 60 182 L 160 182 C 175 182, 185 178, 185 170 L 128 75 L 128 35 Z"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
          />

          {/* Reborde reforzado de la boca del matraz */}
          <ellipse cx="110" cy="35" rx="19" ry="4" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" />

          {/* Graduaciones serigrafiadas blancas en el vidrio (100, 150, 200 mL) */}
          <line x1="85" y1="145" x2="105" y2="145" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          <text x="108" y="148" fill="rgba(255,255,255,0.7)" fontSize="7.5" fontFamily="monospace">100 mL</text>

          <line x1="90" y1="125" x2="108" y2="125" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          <text x="111" y="128" fill="rgba(255,255,255,0.7)" fontSize="7.5" fontFamily="monospace">150 mL</text>

          {/* Reflejos especulares curvos del vidrio */}
          <path
            d="M 45 168 L 96 78"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 52 166 L 98 84"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Panel de control de agitación y lecturas instantáneas */}
      <div className="flex items-center gap-2.5 mt-1 text-xs">
        <button
          onClick={onToggleStirring}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border font-medium transition-all shadow-sm active:scale-95 ${
            isStirring
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-emerald-950/50'
              : 'bg-slate-800 border-slate-600 text-slate-400 hover:text-slate-200'
          }`}
          title="Conmutar agitación magnética continua"
        >
          <Waves size={14} className={isStirring ? 'text-emerald-400 animate-pulse' : ''} />
          <span>{isStirring ? 'Agitación: 450 RPM (Vórtice)' : 'Agitación: Detenida'}</span>
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-300 font-mono">
          <span className="text-slate-400 text-[11px]">pH:</span>
          <span className="font-bold text-amber-300 text-xs">{pH.toFixed(2)}</span>
        </div>

        {!hasIndicator && (
          <span className="text-[11px] text-rose-400 font-semibold px-2 py-0.5 bg-rose-950/40 border border-rose-800/40 rounded-lg animate-pulse">
            ⚠️ Sin indicador
          </span>
        )}
      </div>
    </div>
  );
};

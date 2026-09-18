import React from 'react';
import { Waves } from 'lucide-react';

interface ErlenmeyerSvgProps {
  liquidColorRgba: string;
  volumeAddedMl: number;
  initialVolumeMl: number; // 50 mL de disolución inicial
  isSampleDissolved: boolean; // si ya se preparó la disolución
  hasElectrode?: boolean; // si está insertado el electrodo de pH (P7)
  isStirring: boolean;
  hasIndicator: boolean;
  pH: number;
  practiceNumber?: number;
  onToggleStirring: () => void;
  onOpenTransferModal?: () => void;
}

export const ErlenmeyerSvg: React.FC<ErlenmeyerSvgProps> = ({
  liquidColorRgba,
  volumeAddedMl,
  initialVolumeMl,
  isSampleDissolved,
  hasElectrode = false,
  isStirring,
  hasIndicator,
  pH,
  practiceNumber = 4,
  onToggleStirring,
  onOpenTransferModal,
}) => {
  const currentTotalMl = initialVolumeMl + volumeAddedMl;
  const fillLevelY = Math.max(105, 140 - ((currentTotalMl - 50) / 30) * 28);
  const vortexDepth = isStirring ? 14 : 3;

  return (
    <div className="relative flex flex-col items-center select-none -mt-2 shrink min-h-0 font-sans">
      <svg
        viewBox="0 0 220 200"
        className="h-[18vh] min-h-[120px] max-h-[175px] w-auto overflow-visible select-none shrink"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="baseShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.8)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <clipPath id="flaskClip">
            <path d="M 92 35 L 92 75 L 35 170 C 35 178, 45 182, 60 182 L 160 182 C 175 182, 185 178, 185 170 L 128 75 L 128 35 Z" />
          </clipPath>

          <linearGradient id="teflonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f5f5f5" />
            <stop offset="100%" stopColor="#d4d4d4" />
          </linearGradient>
        </defs>

        {/* 1. Base del Agitador Magnético en Laca Negra Carbón Urushi */}
        <g id="magneticStirrerPlate">
          <ellipse cx="110" cy="188" rx="85" ry="12" fill="url(#baseShadow)" />
          <rect x="25" y="180" width="170" height="14" rx="4" fill="#141414" stroke="#333333" strokeWidth="1.5" />
          <ellipse cx="110" cy="180" rx="75" ry="8" fill="#fafafa" stroke="#e5e5e5" strokeWidth="1" />
          {/* Indicador LED en Rojo Cinabrio tradicional */}
          <circle cx="178" cy="187" r="2" fill={isStirring ? '#dc2626' : '#444444'} className={isStirring ? 'animate-ping' : ''} />
        </g>

        {/* 2. Cuerpo del Matraz Erlenmeyer de 250 mL */}
        <g id="flaskBody">
          {isSampleDissolved ? (
            <g clipPath="url(#flaskClip)">
              <rect
                x="20"
                y={fillLevelY}
                width="180"
                height={185 - fillLevelY}
                fill={liquidColorRgba}
                className="transition-colors duration-300"
              />

              <path
                d={`M 30 ${fillLevelY} Q 110 ${fillLevelY + vortexDepth} 190 ${fillLevelY} L 190 ${fillLevelY + 2} Q 110 ${fillLevelY + vortexDepth + 2} 30 ${fillLevelY + 2} Z`}
                fill="rgba(255, 255, 255, 0.55)"
              />

              {isStirring && (
                <g opacity="0.6">
                  <path
                    d={`M 104 ${fillLevelY + 2} Q 110 ${fillLevelY + 14} 116 ${fillLevelY + 2} Q 110 ${fillLevelY + 24} 107 ${fillLevelY + 36}`}
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  <path
                    d={`M 108 ${fillLevelY + 8} Q 110 ${fillLevelY + 18} 112 ${fillLevelY + 28}`}
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="1.2"
                    fill="none"
                  />
                  <circle cx="102" cy={fillLevelY + 22} r="1" fill="#ffffff" opacity="0.8" />
                  <circle cx="118" cy={fillLevelY + 28} r="1.2" fill="#ffffff" opacity="0.7" />
                  <circle cx="98" cy={fillLevelY + 35} r="0.8" fill="#ffffff" opacity="0.6" />
                </g>
              )}

              {/* Barra magnética de teflón blanca */}
              <g transform="translate(110, 175)">
                <g className={isStirring ? 'animate-stir-bar' : ''}>
                  <rect
                    x="-12"
                    y="-3"
                    width="24"
                    height="6"
                    rx="3"
                    fill="url(#teflonGrad)"
                    stroke="#525252"
                    strokeWidth="0.8"
                    filter="drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
                  />
                  <line x1="0" y1="-3" x2="0" y2="3" stroke="#dc2626" strokeWidth="1" />
                </g>
              </g>
            </g>
          ) : (
            <g clipPath="url(#flaskClip)">
              <g transform="translate(110, 175)">
                <rect
                  x="-12"
                  y="-3"
                  width="24"
                  height="6"
                  rx="3"
                  fill="url(#teflonGrad)"
                  stroke="#525252"
                  strokeWidth="0.8"
                />
              </g>
            </g>
          )}

          {/* Vidrio exterior del matraz */}
          <path
            d="M 92 35 L 92 75 L 35 170 C 35 178, 45 182, 60 182 L 160 182 C 175 182, 185 178, 185 170 L 128 75 L 128 35 Z"
            fill="none"
            stroke="rgba(255,255,255,0.75)"
            strokeWidth="2"
          />

          <ellipse cx="110" cy="35" rx="19" ry="4" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />

          {/* Electrodo combinado de vidrio (P7) */}
          {hasElectrode && (
            <g id="phElectrode" transform="translate(122, 10)">
              <path d="M 6 0 Q 18 -15 35 -10" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
              <rect x="1" y="0" width="10" height="18" rx="2" fill="#0f0f0f" stroke="#333333" strokeWidth="1" />
              <rect x="2" y="18" width="8" height="120" rx="1" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
              <rect x="3" y="35" width="6" height="100" fill="rgba(255, 255, 255, 0.2)" />
              <line x1="6" y1="18" x2="6" y2="128" stroke="#ffffff" strokeWidth="1.2" />
              <circle cx="6" cy="140" r="6.5" fill="rgba(255, 255, 255, 0.5)" stroke="#dc2626" strokeWidth="1.5" />
              <circle cx="2" cy="126" r="1.5" fill="#f8fafc" />
            </g>
          )}

          {/* Graduaciones en blanco nítido */}
          <line x1="85" y1="145" x2="105" y2="145" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
          <text x="108" y="148" fill="#ffffff" fontSize="7.5" fontFamily="monospace">100 mL</text>

          <line x1="90" y1="125" x2="108" y2="125" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
          <text x="111" y="128" fill="#ffffff" fontSize="7.5" fontFamily="monospace">150 mL</text>

          <path
            d="M 45 168 L 96 78"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Panel de control de agitación */}
      <div className="flex items-center gap-2 mt-1 text-xs font-mono">
        {isSampleDissolved ? (
          <>
            <button
              onClick={onToggleStirring}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                isStirring
                  ? 'bg-[#dc2626] border-[#ef4444] text-white shadow-[0_2px_12px_rgba(220,38,38,0.45)]'
                  : 'bg-[#141414] border-[#333333] text-[#a3a3a3] hover:text-white hover:border-white'
              }`}
              title="Conmutar agitación magnética continua"
            >
              <Waves size={14} className={isStirring ? 'text-white animate-pulse' : ''} />
              <span>{isStirring ? 'Agitación: 450 RPM (Vórtice)' : 'Agitación: Detenida'}</span>
            </button>

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#121212] border border-[#2b2b2b] rounded-xl text-white">
              <span className="text-[#888888] text-[11px]">pH:</span>
              <span className="font-extrabold text-[#ef4444] text-xs">{pH.toFixed(2)}</span>
            </div>

            {!hasIndicator && (
              <span className="text-[11px] text-[#ef4444] font-bold px-2 py-0.5 bg-[#1f0808] border border-[#dc2626]/70 rounded-lg animate-pulse">
                ⚠️ Sin indicador
              </span>
            )}
          </>
        ) : (
          <button
            onClick={onOpenTransferModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-bold rounded-xl border border-[#ef4444] shadow-lg shadow-red-950/50 text-xs transition-all animate-pulse cursor-pointer uppercase tracking-wider"
          >
            <span>
              {practiceNumber === 7
                ? 'Vaso vacío: Pipetear 25.00 mL de HCl ➔'
                : 'Matraz vacío: Pesar KHP en Balanza Analítica ➔'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

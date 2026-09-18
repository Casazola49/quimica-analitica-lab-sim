import React from 'react';
import { ZoomIn, AlertCircle } from 'lucide-react';

interface BuretteSvgProps {
  currentDeliveredMl: number; // volumen entregado acumulado (mL)
  isBuretteLoaded: boolean; // si ya fue cargada con NaOH
  isStopcockOpen: boolean;
  flowRate: 'dropwise' | 'fast' | 'closed';
  hasBubble: boolean;
  onToggleStopcock: () => void;
  onOpenLoupe: () => void;
  onOpenTipZoom?: () => void;
}

export const BuretteSvg: React.FC<BuretteSvgProps> = ({
  currentDeliveredMl,
  isBuretteLoaded,
  isStopcockOpen,
  flowRate,
  hasBubble,
  onToggleStopcock,
  onOpenLoupe,
  onOpenTipZoom,
}) => {
  const tubeWidth = 24;
  const tubeHeight = 360;
  const topY = 20;
  const stopcockY = topY + tubeHeight;
  const tipHeight = 50;

  const maxVolumeDisplayed = 25;
  const liquidY = !isBuretteLoaded
    ? stopcockY
    : topY + 15 + (Math.min(maxVolumeDisplayed, currentDeliveredMl) / maxVolumeDisplayed) * (tubeHeight - 35);

  const stopcockAngle = isStopcockOpen ? (flowRate === 'dropwise' ? 45 : 90) : 0;

  return (
    <div className="relative flex flex-col items-center select-none shrink min-h-0 font-sans">
      {/* Botón flotante para abrir la Lupa de Menisco con Estilo Sumi-e */}
      {isBuretteLoaded && (
        <button
          onClick={onOpenLoupe}
          className="absolute top-2 -right-14 z-20 flex items-center gap-1.5 px-2.5 py-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold rounded-xl shadow-[0_2px_12px_rgba(220,38,38,0.45)] border border-[#ef4444] transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
          title="Inspeccionar menisco con aumento 4x"
        >
          <ZoomIn size={14} />
          <span className="hidden sm:inline">Lupa Menisco</span>
          <span className="sm:hidden">Lupa</span>
        </button>
      )}

      {/* Alerta interactiva si hay burbuja en el pico (Estilo Cinabrio Hanko) */}
      {hasBubble && isBuretteLoaded && (
        <button
          onClick={onOpenTipZoom}
          className="absolute top-1/2 -left-32 z-20 flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1f0808] hover:bg-[#2c0d0d] border-2 border-[#dc2626] text-[#ef4444] text-[11px] font-bold rounded-xl shadow-[0_2px_16px_rgba(220,38,38,0.5)] transition-all active:scale-95 animate-pulse cursor-pointer uppercase tracking-wider"
          title="Acercarse a la punta de la bureta para inspeccionar y purgar burbuja"
        >
          <AlertCircle size={14} className="text-[#ef4444] shrink-0" />
          <span>Purgar Pico (Zoom)</span>
        </button>
      )}

      <svg
        viewBox="0 0 180 490"
        className="h-[34vh] min-h-[220px] max-h-[340px] w-auto overflow-visible select-none shrink"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradiente de vidrio de alto contraste Washi */}
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="25%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.75)" />
          </linearGradient>

          {/* Gradiente de solución de NaOH pura */}
          <linearGradient id="naohGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.65)" />
            <stop offset="50%" stopColor="rgba(240, 248, 255, 0.45)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.75)" />
          </linearGradient>

          <filter id="standShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* 1. Soporte Universal (Varilla y Nuez en Laca Negra Carbón) */}
        <g id="stand" filter="url(#standShadow)">
          <rect x="40" y="5" width="8" height="460" rx="4" fill="#383838" stroke="#525252" strokeWidth="1" />
          <rect x="36" y="140" width="38" height="12" rx="2" fill="#171717" stroke="#dc2626" strokeWidth="1" />
          <circle cx="44" cy="146" r="3.5" fill="#f5f5f5" />
          <rect x="36" y="270" width="38" height="12" rx="2" fill="#171717" stroke="#dc2626" strokeWidth="1" />
          <circle cx="44" cy="276" r="3.5" fill="#f5f5f5" />
        </g>

        {/* 2. Tubo de Vidrio de la Bureta */}
        <g id="buretteGlass">
          <rect
            x={90 - tubeWidth / 2}
            y={topY}
            width={tubeWidth}
            height={tubeHeight}
            rx="2"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.6"
          />

          {isBuretteLoaded && liquidY < stopcockY && (
            <rect
              x={90 - tubeWidth / 2 + 1}
              y={liquidY}
              width={tubeWidth - 2}
              height={stopcockY - liquidY}
              fill="url(#naohGrad)"
            />
          )}

          {/* Menisco cóncavo con acento rojo cinabrio */}
          {isBuretteLoaded && (
            <g className="cursor-pointer group" onClick={onOpenLoupe}>
              <path
                d={`M ${90 - tubeWidth / 2 + 1} ${liquidY} Q 90 ${liquidY + 4} ${90 + tubeWidth / 2 - 1} ${liquidY}`}
                stroke="#dc2626"
                strokeWidth="2.8"
                fill="rgba(220, 38, 38, 0.4)"
                className="group-hover:stroke-[#ef4444] group-hover:stroke-[3.8px] transition-all"
              />
              <circle cx="90" cy={liquidY} r="16" fill="transparent" />
            </g>
          )}

          {/* Graduaciones métricas en blanco puro */}
          {Array.from({ length: 26 }).map((_, i) => {
            const lineY = topY + 15 + (i / maxVolumeDisplayed) * (tubeHeight - 35);
            const isMajor = i % 5 === 0;
            const isMedium = i % 1 === 0 && !isMajor;
            const lineWidth = isMajor ? 10 : isMedium ? 6 : 3;

            return (
              <g key={i}>
                <line
                  x1={90 + tubeWidth / 2 - lineWidth}
                  y1={lineY}
                  x2={90 + tubeWidth / 2}
                  y2={lineY}
                  stroke="#ffffff"
                  strokeWidth={isMajor ? 1.4 : 0.8}
                />
                {isMajor && (
                  <text
                    x={90 + tubeWidth / 2 + 3}
                    y={lineY + 3.5}
                    fill="#ffffff"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {i}
                  </text>
                )}
              </g>
            );
          })}

          <rect
            x={90 - tubeWidth / 2}
            y={topY}
            width={tubeWidth}
            height={tubeHeight}
            fill="url(#glassGrad)"
            pointerEvents="none"
          />
        </g>

        {/* 3. Llave de Bureta (Válvula en Rojo Cinabrio tradicional) */}
        <g id="stopcock" className="cursor-pointer" onClick={onToggleStopcock}>
          <rect x={90 - 9} y={stopcockY} width="18" height="16" rx="2" fill="#1f1f1f" stroke="#ffffff" strokeWidth="1.2" />
          <circle cx="90" cy={stopcockY + 8} r="5" fill="#0d0d0d" />

          {/* Vástago giratorio en rojo cinabrio */}
          <g transform={`translate(90, ${stopcockY + 8})`}>
            <g
              style={{
                transform: `rotate(${stopcockAngle}deg)`,
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <rect x="-16" y="-3.5" width="32" height="7" rx="3.5" fill="#dc2626" stroke="#ef4444" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="3.5" fill="#ffffff" stroke="#991b1b" strokeWidth="1" />
            </g>
          </g>
        </g>

        {/* 4. Pico de la Bureta */}
        <g id="buretteTip">
          <path
            d={`M ${90 - 5} ${stopcockY + 16} L ${90 - 1.5} ${stopcockY + 16 + tipHeight} L ${90 + 1.5} ${stopcockY + 16 + tipHeight} L ${90 + 5} ${stopcockY + 16} Z`}
            fill={isBuretteLoaded ? "url(#naohGrad)" : "none"}
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.2"
          />

          {/* Burbuja atrapada con resplandor cinabrio */}
          {hasBubble && isBuretteLoaded && (
            <ellipse
              cx="90"
              cy={stopcockY + 30}
              rx="3"
              ry="6"
              fill="#ffffff"
              stroke="#dc2626"
              strokeWidth="1.8"
              className="animate-pulse"
            />
          )}

          {/* Caída de gotas */}
          {isStopcockOpen && isBuretteLoaded && (
            <g id="streamEffect">
              {flowRate === 'fast' ? (
                <line
                  x1="90"
                  y1={stopcockY + 16 + tipHeight}
                  x2="90"
                  y2={stopcockY + 16 + tipHeight + 45}
                  stroke="#ffffff"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              ) : (
                <g transform={`translate(90, ${stopcockY + 16 + tipHeight})`}>
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="3"
                    ry="4.5"
                    fill="#ffffff"
                    stroke="#dc2626"
                    strokeWidth="0.8"
                    className="animate-falling-drop"
                  />
                </g>
              )}
            </g>
          )}
        </g>
      </svg>

      {/* Indicador de estado de la llave */}
      <div className="mt-1 flex items-center gap-2 font-mono">
        <button
          onClick={onToggleStopcock}
          disabled={!isBuretteLoaded}
          className={`px-3.5 py-1 rounded-full text-xs font-bold border transition-all shadow-md cursor-pointer ${
            !isBuretteLoaded
              ? 'bg-[#141414] border-[#2b2b2b] text-[#555555] cursor-not-allowed'
              : isStopcockOpen
              ? 'bg-[#dc2626] border-[#ef4444] text-white shadow-[0_2px_12px_rgba(220,38,38,0.5)]'
              : 'bg-[#171717] border-[#383838] text-[#cccccc] hover:border-white hover:text-white'
          }`}
        >
          {!isBuretteLoaded
            ? 'Bureta vacía'
            : isStopcockOpen
            ? flowRate === 'dropwise'
              ? 'Llave: Gota a Gota'
              : 'Llave: Flujo Rápido'
            : 'Llave: Cerrada'}
        </button>
      </div>
    </div>
  );
};

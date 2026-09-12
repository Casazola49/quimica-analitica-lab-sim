import React from 'react';
import { ZoomIn, AlertCircle } from 'lucide-react';

interface BuretteSvgProps {
  currentDeliveredMl: number; // volumen entregado acumulado (mL)
  isStopcockOpen: boolean;
  flowRate: 'dropwise' | 'fast' | 'closed';
  hasBubble: boolean;
  onToggleStopcock: () => void;
  onOpenLoupe: () => void;
}

export const BuretteSvg: React.FC<BuretteSvgProps> = ({
  currentDeliveredMl,
  isStopcockOpen,
  flowRate,
  hasBubble,
  onToggleStopcock,
  onOpenLoupe,
}) => {
  // Altura total del tubo de la bureta en coordenadas SVG
  const tubeWidth = 24;
  const tubeHeight = 360;
  const topY = 20;
  const stopcockY = topY + tubeHeight;
  const tipHeight = 50;

  // Mapeo de volumen (0 mL a 25 mL) a posición Y del líquido
  // Nivel inicial en 0 mL: Y = topY + 10
  // Nivel a 25 mL: Y = topY + tubeHeight - 20
  const maxVolumeDisplayed = 25;
  const liquidY = topY + 15 + (Math.min(maxVolumeDisplayed, currentDeliveredMl) / maxVolumeDisplayed) * (tubeHeight - 35);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Botón flotante para abrir la Lupa de Menisco */}
      <button
        onClick={onOpenLoupe}
        className="absolute top-8 -right-16 z-20 flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600/90 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg border border-blue-400/40 backdrop-blur transition-all active:scale-95"
        title="Inspeccionar menisco con aumento 4x"
      >
        <ZoomIn size={15} />
        <span>Lupa Menisco</span>
      </button>

      {/* Alerta sutil si hay burbuja en el pico */}
      {hasBubble && (
        <div className="absolute top-1/2 -left-28 z-20 flex items-center gap-1 px-2 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] rounded shadow-md backdrop-blur">
          <AlertCircle size={13} className="text-amber-400 shrink-0" />
          <span>Burbuja en el pico</span>
        </div>
      )}

      <svg width="180" height="490" viewBox="0 0 180 490" className="overflow-visible">
        <defs>
          {/* Gradiente de vidrio para la bureta */}
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="25%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
          </linearGradient>

          {/* Gradiente de solución transparente (NaOH 0.1 N) */}
          <linearGradient id="naohGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(224, 242, 254, 0.6)" />
            <stop offset="50%" stopColor="rgba(224, 242, 254, 0.4)" />
            <stop offset="100%" stopColor="rgba(186, 230, 253, 0.7)" />
          </linearGradient>

          {/* Sombra del soporte universal */}
          <filter id="standShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 1. Soporte Universal (Varilla y Nuez de sujeción) */}
        <g id="stand" filter="url(#standShadow)">
          {/* Varilla vertical de acero */}
          <rect x="40" y="5" width="8" height="460" rx="4" fill="#94a3b8" />
          {/* Doble pinza para bureta con tornillo */}
          <rect x="36" y="140" width="38" height="12" rx="2" fill="#475569" />
          <circle cx="44" cy="146" r="3.5" fill="#cbd5e1" />
          <rect x="36" y="270" width="38" height="12" rx="2" fill="#475569" />
          <circle cx="44" cy="276" r="3.5" fill="#cbd5e1" />
        </g>

        {/* 2. Tubo de Vidrio de la Bureta (Centrado en x = 90) */}
        <g id="buretteGlass">
          {/* Columna de vidrio exterior */}
          <rect
            x={90 - tubeWidth / 2}
            y={topY}
            width={tubeWidth}
            height={tubeHeight}
            rx="2"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
          />

          {/* Líquido contenido en la bureta (desde liquidY hasta la llave) */}
          {liquidY < stopcockY && (
            <rect
              x={90 - tubeWidth / 2 + 1}
              y={liquidY}
              width={tubeWidth - 2}
              height={stopcockY - liquidY}
              fill="url(#naohGrad)"
            />
          )}

          {/* Menisco cóncavo interactivo (clic para lupa) */}
          <g className="cursor-pointer group" onClick={onOpenLoupe}>
            <path
              d={`M ${90 - tubeWidth / 2 + 1} ${liquidY} Q 90 ${liquidY + 4} ${90 + tubeWidth / 2 - 1} ${liquidY}`}
              stroke="#38bdf8"
              strokeWidth="2.5"
              fill="rgba(56, 189, 248, 0.4)"
              className="group-hover:stroke-blue-400 group-hover:stroke-[3.5px] transition-all"
            />
            {/* Círculo guía transparente para facilitar el toque en móviles */}
            <circle cx="90" cy={liquidY} r="16" fill="transparent" />
          </g>

          {/* Graduaciones volumétricas cada 1 mL y 0.5 mL */}
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
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth={isMajor ? 1.2 : 0.7}
                />
                {isMajor && (
                  <text
                    x={90 + tubeWidth / 2 + 3}
                    y={lineY + 3.5}
                    fill="rgba(255,255,255,0.85)"
                    fontSize="8.5"
                    fontFamily="monospace"
                  >
                    {i}
                  </text>
                )}
              </g>
            );
          })}

          {/* Brillo de reflejo de vidrio */}
          <rect
            x={90 - tubeWidth / 2}
            y={topY}
            width={tubeWidth}
            height={tubeHeight}
            fill="url(#glassGrad)"
            pointerEvents="none"
          />
        </g>

        {/* 3. Llave de Bureta (Stopcock con válvula de teflón) */}
        <g id="stopcock" className="cursor-pointer" onClick={onToggleStopcock}>
          {/* Cuerpo de la llave */}
          <rect x={90 - 9} y={stopcockY} width="18" height="16" rx="2" fill="#64748b" stroke="#cbd5e1" strokeWidth="1" />
          
          {/* Vástago giratorio de la llave (horizontal = cerrada, vertical = abierta) */}
          <g
            transform={`rotate(${isStopcockOpen ? (flowRate === 'dropwise' ? 45 : 90) : 0}, 90, ${stopcockY + 8})`}
            className="transition-transform duration-150"
          >
            <rect x="74" y={stopcockY + 5} width="32" height="6" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="90" cy={stopcockY + 8} r="4" fill="#f8fafc" />
          </g>
        </g>

        {/* 4. Pico de la Bureta (Punta capilar cónica) */}
        <g id="buretteTip">
          {/* Punta cónica de vidrio */}
          <path
            d={`M ${90 - 5} ${stopcockY + 16} L ${90 - 1.5} ${stopcockY + 16 + tipHeight} L ${90 + 1.5} ${stopcockY + 16 + tipHeight} L ${90 + 5} ${stopcockY + 16} Z`}
            fill="url(#naohGrad)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
          />

          {/* Simulación visual de burbuja atrapada en la punta si no fue purgada */}
          {hasBubble && (
            <ellipse
              cx="90"
              cy={stopcockY + 30}
              rx="3"
              ry="6"
              fill="rgba(255,255,255,0.95)"
              stroke="#38bdf8"
              strokeWidth="1"
              className="animate-pulse"
            />
          )}

          {/* Gota o Chorro cayendo hacia el Erlenmeyer */}
          {isStopcockOpen && (
            <g id="streamEffect">
              {flowRate === 'fast' ? (
                // Chorro continuo
                <line
                  x1="90"
                  y1={stopcockY + 16 + tipHeight}
                  x2="90"
                  y2={stopcockY + 16 + tipHeight + 45}
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              ) : (
                // Gota discreta cayendo (animación CSS suave)
                <circle
                  cx="90"
                  cy={stopcockY + 16 + tipHeight + 20}
                  r="3.5"
                  fill="#38bdf8"
                  className="animate-bounce"
                />
              )}
            </g>
          )}
        </g>
      </svg>

      {/* Indicador de estado de la llave para interacción táctil rápida */}
      <div className="mt-1 flex items-center gap-2">
        <button
          onClick={onToggleStopcock}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors shadow ${
            isStopcockOpen
              ? 'bg-emerald-600/80 border-emerald-400 text-white'
              : 'bg-slate-700/80 border-slate-500 text-slate-200 hover:bg-slate-600'
          }`}
        >
          {isStopcockOpen ? (flowRate === 'dropwise' ? 'Llave: Gota a Gota' : 'Llave: Flujo Rápido') : 'Llave: Cerrada'}
        </button>
      </div>
    </div>
  );
};

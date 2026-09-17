import React from 'react';

interface HankoSealProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'stamp' | 'badge';
  className?: string;
}

export const HankoSeal: React.FC<HankoSealProps> = ({
  size = 'md',
  variant = 'stamp',
  className = '',
}) => {
  const dimensions =
    size === 'sm' ? { width: 32, height: 32, fontMain: 11, fontSub: 7 } :
    size === 'lg' ? { width: 56, height: 56, fontMain: 19, fontSub: 10 } :
    { width: 42, height: 42, fontMain: 14, fontSub: 8.5 };

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 px-2.5 py-1 bg-sumi-900 border border-cinabrio-600/60 rounded-xl shadow-lg shadow-cinabrio-950/40 select-none ${className}`}>
        {/* Pequeño sello Hanko cuadrado */}
        <div className="w-5 h-5 bg-cinabrio-600 rounded-sm border border-cinabrio-400/80 flex flex-col items-center justify-center text-[9px] font-black text-white leading-none shadow">
          <span>化</span>
        </div>
        <div className="flex flex-col text-left leading-none">
          <span className="text-[11px] font-bold text-washi-100 tracking-wider">ALQUÍMICA-33</span>
          <span className="text-[8px] font-mono text-cinabrio-400 tracking-widest">アルキミカ三十三</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative inline-block select-none transform hover:scale-105 transition-transform ${className}`}
      title="Sello Oficial de Laboratorio • Alquímica-33 (アルキミカ三十三)"
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 50 50"
        className="overflow-visible drop-shadow-[0_2px_8px_rgba(220,38,38,0.35)]"
      >
        <defs>
          <linearGradient id="hankoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="60%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>

          {/* Textura rugosa de sello de tinta de cinabrio tallado a mano */}
          <filter id="hankoInk" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Marco exterior tallado del sello Hanko */}
        <rect
          x="3"
          y="3"
          width="44"
          height="44"
          rx="5"
          fill="none"
          stroke="url(#hankoGrad)"
          strokeWidth="3.2"
          filter="url(#hankoInk)"
        />

        {/* Marco interior fino de doble reborde tradicional */}
        <rect
          x="7.5"
          y="7.5"
          width="35"
          height="35"
          rx="3"
          fill="none"
          stroke="rgba(220, 38, 38, 0.45)"
          strokeWidth="1"
        />

        {/* Caracteres verticales:
            Columna derecha: 錬 (Alquimia/Química) o 化 (Transformación química)
            Columna izquierda: 三十三 (33 en kanji) o '33'
        */}
        <text
          x="25"
          y="23"
          textAnchor="middle"
          fill="#dc2626"
          fontSize="17"
          fontFamily="serif"
          fontWeight="900"
          filter="url(#hankoInk)"
        >
          錬
        </text>

        <text
          x="25"
          y="39"
          textAnchor="middle"
          fill="#dc2626"
          fontSize="13"
          fontFamily="monospace"
          fontWeight="900"
          letterSpacing="1"
        >
          33
        </text>

        {/* Pequeños puntos decorativos de sello */}
        <circle cx="9" cy="9" r="1" fill="#dc2626" opacity="0.7" />
        <circle cx="41" cy="41" r="1" fill="#dc2626" opacity="0.7" />
      </svg>
    </div>
  );
};

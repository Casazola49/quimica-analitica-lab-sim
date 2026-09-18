import React, { useState } from 'react';
import { X, Check, AlertTriangle, ArrowRight, Eye } from 'lucide-react';
import { HankoSeal } from '../common/HankoSeal';

interface PipetteTransferModalProps {
  isOpen: boolean;
  aliquotVolumeMl: number;
  onClose: () => void;
  onAliquotTransferred: (volumeMl: number, blewDrop: boolean) => void;
}

export const PipetteTransferModal: React.FC<PipetteTransferModalProps> = ({
  isOpen,
  aliquotVolumeMl,
  onClose,
  onAliquotTransferred,
}) => {
  const [stage, setStage] = useState<number>(0);

  if (!isOpen) return null;

  const handleNextStage = () => setStage((prev) => prev + 1);

  const handleFinish = (blewDrop: boolean) => {
    onAliquotTransferred(aliquotVolumeMl, blewDrop);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none font-sans">
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#262626] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Encabezado Sumi-e */}
        <div className="p-4 bg-[#121212] border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HankoSeal size="sm" variant="stamp" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
                Pipeta Volumétrica Aforada de 25.00 mL (Clase A)
              </h3>
              <p className="text-[11px] text-[#888888]">
                Transferencia cuantitativa de alícuota de HCl con propipeta de seguridad
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#666666] hover:text-white rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Visualización 2D de la pipeta */}
        <div className="p-5 flex flex-col items-center space-y-4">
          <div className="relative w-full max-w-xs h-48 bg-[#050505] rounded-xl border border-[#222222] flex items-center justify-center p-3 shadow-inner">
            <svg width="220" height="170" viewBox="0 0 220 170" className="overflow-visible">
              <defs>
                <linearGradient id="hclPipetteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
                  <stop offset="100%" stopColor="rgba(240, 248, 255, 0.85)" />
                </linearGradient>
              </defs>

              {/* Propipeta roja en laca cinabrio */}
              <g id="propipette" transform="translate(110, 22)">
                <ellipse cx="0" cy="0" rx="14" ry="18" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                <rect x="-3" y="16" width="6" height="8" fill="#141414" />
                <circle cx="-6" cy="-4" r="2.5" fill="#ffffff" opacity="0.8" />
              </g>

              {/* Cuerpo de la Pipeta Aforada */}
              <g id="pipetteBody">
                <rect x="107" y="44" width="6" height="40" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
                
                {stage >= 1 && (
                  <rect x="107.5" y={stage === 1 ? "48" : "64"} width="5" height={stage === 1 ? "36" : "20"} fill="url(#hclPipetteGrad)" />
                )}

                {/* Línea de aforo en rojo cinabrio */}
                <line x1="104" y1="64" x2="116" y2="64" stroke="#dc2626" strokeWidth="1.8" />
                <text x="119" y="67" fill="#ffffff" fontSize="7.5" fontFamily="monospace" fontWeight="bold">25 mL</text>

                <ellipse cx="110" cy="100" rx="18" ry="18" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
                
                {(stage === 1 || stage === 2) && (
                  <ellipse cx="110" cy="100" rx="17" ry="17" fill="url(#hclPipetteGrad)" />
                )}

                <path
                  d="M 107 118 L 108.5 155 L 111.5 155 L 113 118 Z"
                  fill="none"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1.2"
                />

                {(stage === 1 || stage === 2) && (
                  <path d="M 107.5 118 L 109 155 L 111 155 L 112.5 118 Z" fill="url(#hclPipetteGrad)" />
                )}

                {(stage === 3 || stage === 4) && (
                  <circle cx="110" cy="158" r="2.5" fill="#ffffff" stroke="#dc2626" strokeWidth="1" />
                )}
              </g>

              {stage >= 3 && (
                <path
                  d="M 85 140 L 95 165 L 140 165 L 130 140"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                />
              )}
            </svg>
          </div>

          {/* Pasos interactivos */}
          <div className="w-full space-y-2 text-xs font-serif">
            {stage === 0 && (
              <button
                onClick={handleNextStage}
                className="w-full py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>1. Aspirar solución de HCl por encima del aforo con la pera</span>
                <ArrowRight size={15} />
              </button>
            )}

            {stage === 1 && (
              <button
                onClick={handleNextStage}
                className="w-full py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <Eye size={15} />
                <span>2. Ajustar menisco cóncavo tangencial a la línea de aforo (25.00 mL)</span>
              </button>
            )}

            {stage === 2 && (
              <button
                onClick={handleNextStage}
                className="w-full py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>3. Descarga libre vertical tocando la pared del vaso (15 s)</span>
                <ArrowRight size={15} />
              </button>
            )}

            {stage === 3 && (
              <div className="space-y-2.5 p-3.5 bg-[#121212] border border-[#2b2b2b] rounded-xl animate-in fade-in">
                <span className="text-[11px] font-bold text-white block text-center uppercase tracking-wider">
                  ¿Qué debe hacer con la última gota que queda retenida en la punta?
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-sans">
                  <button
                    onClick={() => handleFinish(false)}
                    className="p-3 bg-[#171717] hover:bg-[#222222] border-2 border-[#dc2626] active:scale-95 text-white font-semibold rounded-xl text-left text-[11px] shadow-lg transition-all cursor-pointer"
                  >
                    <div className="font-bold text-xs flex items-center gap-1 mb-0.5 text-[#ef4444]">
                      <Check size={14} />
                      <span>Retirar sin soplar (Correcto)</span>
                    </div>
                    <span className="text-[#cccccc]">Calibrada para verter (TD/Ex); la gota ya fue calculada por el fabricante.</span>
                  </button>

                  <button
                    onClick={() => handleFinish(true)}
                    className="p-3 bg-[#240808] hover:bg-[#340b0b] border border-[#dc2626]/50 active:scale-95 text-white font-semibold rounded-xl text-left text-[11px] shadow transition-all cursor-pointer"
                  >
                    <div className="font-bold text-xs flex items-center gap-1 mb-0.5 text-rose-300">
                      <AlertTriangle size={14} />
                      <span>Soplar con la pera</span>
                    </div>
                    <span className="text-[#a0a0a0]">Expulsar forzadamente la última gota hacia la disolución.</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-full p-2.5 bg-[#121212] border border-[#262626] rounded-xl text-[11px] text-[#888888] flex items-start gap-2">
            <AlertTriangle size={15} className="text-[#dc2626] shrink-0 mt-0.5" />
            <span>
              <strong>Técnica Cuantitativa (Skoog Cap. 2):</strong> Las pipetas volumétricas aforadas tipo TD ("To Deliver") están calibradas para drenar su volumen nominal por gravedad libre.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

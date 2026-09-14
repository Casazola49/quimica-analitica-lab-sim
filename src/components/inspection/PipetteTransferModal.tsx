import React, { useState } from 'react';
import { Pipette, X, Check, AlertTriangle, ArrowRight, Eye } from 'lucide-react';

interface PipetteTransferModalProps {
  isOpen: boolean;
  aliquotVolumeMl: number; // 25.00 mL
  onClose: () => void;
  onAliquotTransferred: (volumeMl: number, blewDrop: boolean) => void;
}

export const PipetteTransferModal: React.FC<PipetteTransferModalProps> = ({
  isOpen,
  aliquotVolumeMl,
  onClose,
  onAliquotTransferred,
}) => {
  // Etapas del pipeteo analítico:
  // 0: Pipeta aforada y propipeta listas
  // 1: Aspiración con propipeta por encima del aforo
  // 2: Enrase exacto al menisco tangencial (25.00 mL)
  // 3: Vaciado libre por gravedad vertical tocando la pared del vaso
  // 4: Decisión de la última gota (¿Soplar o retirar sin soplar?)
  const [stage, setStage] = useState<number>(0);

  if (!isOpen) return null;

  const handleNextStage = () => setStage((prev) => prev + 1);

  const handleFinish = (blewDrop: boolean) => {
    onAliquotTransferred(aliquotVolumeMl, blewDrop);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Encabezado */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 border border-blue-500/40 rounded-xl text-blue-400">
              <Pipette size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Pipeta Volumétrica Aforada de 25.00 mL (Clase A)
              </h3>
              <p className="text-[11px] text-slate-400">
                Transferencia cuantitativa de alícuota de HCl con propipeta de seguridad
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Visualización 2D de la pipeta con la pera de goma */}
        <div className="p-5 flex flex-col items-center space-y-4">
          <div className="relative w-full max-w-xs h-48 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-center p-3 shadow-inner">
            <svg width="220" height="170" viewBox="0 0 220 170" className="overflow-visible">
              <defs>
                {/* Solución de HCl límpida */}
                <linearGradient id="hclPipetteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(224, 242, 254, 0.7)" />
                  <stop offset="100%" stopColor="rgba(186, 230, 253, 0.9)" />
                </linearGradient>
              </defs>

              {/* Propipeta / Pera de goma roja conectada arriba */}
              <g id="propipette" transform="translate(110, 22)">
                <ellipse cx="0" cy="0" rx="14" ry="18" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                <rect x="-3" y="16" width="6" height="8" fill="#475569" />
                {/* Válvula de aspiración */}
                <circle cx="-6" cy="-4" r="2.5" fill="#f8fafc" opacity="0.8" />
              </g>

              {/* Cuerpo de la Pipeta Aforada de 25 mL */}
              <g id="pipetteBody">
                {/* Tubo superior */}
                <rect x="107" y="44" width="6" height="40" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
                
                {/* Líquido en tubo superior si stage >= 1 */}
                {stage >= 1 && (
                  <rect x="107.5" y={stage === 1 ? "48" : "64"} width="5" height={stage === 1 ? "36" : "20"} fill="url(#hclPipetteGrad)" />
                )}

                {/* Línea de aforo (Cota 25 mL) */}
                <line x1="104" y1="64" x2="116" y2="64" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="119" y="67" fill="#38bdf8" fontSize="7" fontFamily="monospace" fontWeight="bold">25 mL</text>

                {/* Bulbo central ensanchado de la pipeta aforada */}
                <ellipse cx="110" cy="100" rx="18" ry="18" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
                
                {/* Líquido llenando el bulbo si stage 1 o 2 */}
                {(stage === 1 || stage === 2) && (
                  <ellipse cx="110" cy="100" rx="17" ry="17" fill="url(#hclPipetteGrad)" />
                )}

                {/* Tubo capilar inferior y punta */}
                <path
                  d="M 107 118 L 108.5 155 L 111.5 155 L 113 118 Z"
                  fill="none"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1.2"
                />

                {/* Líquido en capilar si stage 1 o 2 */}
                {(stage === 1 || stage === 2) && (
                  <path d="M 107.5 118 L 109 155 L 111 155 L 112.5 118 Z" fill="url(#hclPipetteGrad)" />
                )}

                {/* Gota residual suspendida en la punta por capilaridad en stage 3 o 4 */}
                {(stage === 3 || stage === 4) && (
                  <circle cx="110" cy="158" r="2.5" fill="#38bdf8" opacity="0.9" />
                )}
              </g>

              {/* Matraz o Vaso receptor en stage 3 */}
              {stage >= 3 && (
                <path
                  d="M 85 140 L 95 165 L 140 165 L 130 140"
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                />
              )}
            </svg>
          </div>

          {/* Pasos interactivos de técnica de pipeteo */}
          <div className="w-full space-y-2 text-xs">
            {stage === 0 && (
              <button
                onClick={handleNextStage}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <span>1. Aspirar solución de HCl por encima del aforo con la pera</span>
                <ArrowRight size={15} />
              </button>
            )}

            {stage === 1 && (
              <button
                onClick={handleNextStage}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <Eye size={15} />
                <span>2. Ajustar menisco cóncavo tangencial a la línea de aforo (25.00 mL)</span>
              </button>
            )}

            {stage === 2 && (
              <button
                onClick={handleNextStage}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <span>3. Descarga libre vertical tocando la pared del vaso (15 s)</span>
                <ArrowRight size={15} />
              </button>
            )}

            {stage === 3 && (
              <div className="space-y-2 p-3 bg-slate-800/90 border border-slate-700 rounded-xl animate-in fade-in">
                <span className="text-[11px] font-bold text-amber-300 block text-center">
                  ¿Qué debe hacer con la última gota que queda retenida en la punta?
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleFinish(false)}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold rounded-xl text-left text-[11px] shadow transition-all"
                  >
                    <div className="font-bold text-xs flex items-center gap-1 mb-0.5">
                      <Check size={14} />
                      <span>Retirar sin soplar</span>
                    </div>
                    <span>Calibrada para verter (TD/Ex); la gota ya fue calculada por el fabricante.</span>
                  </button>

                  <button
                    onClick={() => handleFinish(true)}
                    className="p-2.5 bg-rose-700/80 hover:bg-rose-600 active:scale-95 text-white font-semibold rounded-xl text-left text-[11px] shadow transition-all"
                  >
                    <div className="font-bold text-xs flex items-center gap-1 mb-0.5 text-rose-200">
                      <AlertTriangle size={14} />
                      <span>Soplar con la pera</span>
                    </div>
                    <span>Expulsar forzadamente la última gota hacia la disolución.</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Criterio analítico */}
          <div className="w-full p-2.5 bg-slate-800/70 border border-slate-700 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
            <AlertTriangle size={15} className="text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>Técnica Cuantitativa (Skoog Cap. 2):</strong> Las pipetas volumétricas aforadas tipo TD ("To Deliver") están calibradas para drenar su volumen nominal por gravedad libre.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

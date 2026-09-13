import React, { useState } from 'react';
import { Scale, X, Check, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';

interface AnalyticalBalanceModalProps {
  isOpen: boolean;
  targetSampleMass: number;
  onClose: () => void;
  onSampleWeighedAndDissolved: (mass: number) => void;
}

export const AnalyticalBalanceModal: React.FC<AnalyticalBalanceModalProps> = ({
  isOpen,
  targetSampleMass,
  onClose,
  onSampleWeighedAndDissolved,
}) => {
  // Estados del procedimiento de pesada analítica:
  // 0: Platillo vacío (0.0000 g)
  // 1: Pesafiltro colocado (masa de tara ~12.4521 g)
  // 2: Balanza tarada a cero con pesafiltro (0.0000 g)
  // 3: KHP añadido con espátula (targetSampleMass)
  const [stage, setStage] = useState<number>(0);
  const [tareMass] = useState<number>(12.4521);
  const [draftShieldClosed] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentDisplayMass =
    stage === 0
      ? 0.0
      : stage === 1
      ? tareMass
      : stage === 2
      ? 0.0
      : targetSampleMass;

  const handlePlaceVessel = () => setStage(1);
  const handleTare = () => setStage(2);
  const handleAddChemical = () => setStage(3);

  const handleTransfer = () => {
    onSampleWeighedAndDissolved(targetSampleMass);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Encabezado */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 border border-blue-500/40 rounded-xl text-blue-400">
              <Scale size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Balanza Analítica Digital (Sensibilidad 0.1 mg)
              </h3>
              <p className="text-[11px] text-slate-400">
                Pesada cuantitativa de biftalato de potasio (KHP patrón primario)
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

        {/* Cámara de pesada y pantalla digital */}
        <div className="p-5 flex flex-col items-center space-y-4">
          {/* Pantalla LCD de la Balanza Analítica */}
          <div className="w-full max-w-xs bg-slate-950 p-4 rounded-xl border-2 border-emerald-500/40 shadow-inner flex flex-col items-center">
            <div className="w-full flex justify-between items-center text-[10px] text-emerald-400/80 font-mono mb-1">
              <span>METTLER TOLEDO • ANALYTICAL</span>
              <span>{draftShieldClosed ? '● PUERTAS CERRADAS' : '○ PUERTA ABIERTA'}</span>
            </div>

            <div className="flex items-baseline gap-2 font-mono text-emerald-400">
              <span className="text-3xl font-extrabold tracking-wider">
                {currentDisplayMass.toFixed(4)}
              </span>
              <span className="text-sm font-bold text-emerald-500">g</span>
            </div>

            <div className="w-full flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1 pt-1 border-t border-slate-800">
              <span>ESTABILIDAD: {stage === 3 ? 'ESTABLE (*)' : 'LISTO'}</span>
              <span>RANGO: 0 - 220 g</span>
            </div>
          </div>

          {/* Gráfico 2D de la cámara de pesada con platillo */}
          <div className="relative w-64 h-36 bg-slate-800/60 rounded-xl border border-slate-700 flex flex-col items-center justify-end p-2 overflow-hidden shadow-inner">
            {/* Vitrina de vidrio (Draft Shield) */}
            <div className="absolute inset-2 border-2 border-dashed border-cyan-500/30 rounded-lg pointer-events-none" />

            {/* Platillo metálico de acero inoxidable */}
            <div className="relative flex flex-col items-center">
              {/* Pesafiltro de vidrio si está colocado (stage >= 1) */}
              {stage >= 1 && (
                <div className="relative w-16 h-10 bg-blue-100/20 border-2 border-blue-300/60 rounded-b-xl flex items-center justify-center mb-0.5 shadow-sm">
                  {/* Sal de biftalato de potasio en polvo blanco si fue añadido (stage >= 3) */}
                  {stage >= 3 && (
                    <div className="w-12 h-3.5 bg-white/90 rounded-full shadow-inner animate-in fade-in" title="KHP sólido en polvo" />
                  )}
                </div>
              )}

              {/* Plato de la balanza */}
              <div className="w-28 h-2.5 bg-slate-300 rounded-t-sm shadow-md border-t border-white/60" />
              {/* Eje de la celda de carga */}
              <div className="w-6 h-5 bg-slate-500 rounded-b" />
            </div>
          </div>

          {/* Pasos interactivos guiados */}
          <div className="w-full space-y-2 text-xs">
            {stage === 0 && (
              <button
                onClick={handlePlaceVessel}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <span>1. Colocar pesafiltro seco en el platillo</span>
                <ArrowRight size={15} />
              </button>
            )}

            {stage === 1 && (
              <button
                onClick={handleTare}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={15} />
                <span>2. Presionar botón de Tara (TARE ➔ 0.0000 g)</span>
              </button>
            )}

            {stage === 2 && (
              <button
                onClick={handleAddChemical}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <span>3. Adicionar Biftalato de Potasio con espátula (~0.21 g)</span>
                <ArrowRight size={15} />
              </button>
            )}

            {stage === 3 && (
              <button
                onClick={handleTransfer}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Check size={16} />
                <span>4. Transferir muestra al Erlenmeyer y disolver con agua destilada</span>
              </button>
            )}
          </div>

          {/* Explicación pedagógica */}
          <div className="w-full p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
            <AlertCircle size={15} className="text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>Criterio de Laboratorio (Skoog Cap. 2):</strong> La pesada de un patrón primario en balanza analítica debe registrarse con sus 4 cifras decimales exactas para no introducir error sistemático en la normalidad calculada.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

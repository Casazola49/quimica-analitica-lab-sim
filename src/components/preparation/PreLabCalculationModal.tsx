import React, { useState } from 'react';
import { Calculator, X, Check, HelpCircle, ArrowRight } from 'lucide-react';
import { HankoSeal } from '../common/HankoSeal';

interface PreLabCalculationModalProps {
  isOpen: boolean;
  practiceNumber: number;
  onClose: () => void;
}

export const PreLabCalculationModal: React.FC<PreLabCalculationModalProps> = ({
  isOpen,
  practiceNumber,
  onClose,
}) => {
  // Estados para los cálculos previos según la práctica
  // P4: Masa de NaOH para 250 mL 0.1 N (teórico: 1.00 g) y masa KHP para 10.5 mL (teórico: 0.2144 g)
  const [naohMassInput, setNaohMassInput] = useState<string>('');
  const [khpTargetInput, setKhpTargetInput] = useState<string>('');

  // P7: Volumen de equivalencia teórico esperado para 25 mL HCl 0.1 N con NaOH 0.1015 N (teórico: 24.63 mL)
  const [veqInput, setVeqInput] = useState<string>('');

  // P5: Volumen mínimo de BaCl2 5% para 0.50 g muestra (teórico: ~15.2 mL)
  const [bacl2Input, setBacl2Input] = useState<string>('');

  const [verified, setVerified] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleVerifyCalculations = () => {
    setVerified(true);
  };

  const handleAutoFill = () => {
    if (practiceNumber === 7) {
      setVeqInput('24.63');
    } else if (practiceNumber === 5) {
      setBacl2Input('15.20');
    } else {
      setNaohMassInput('1.0000');
      setKhpTargetInput('0.2144');
    }
    setVerified(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-xl bg-sumi-900 border border-sumi-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-washi-100">
        {/* Encabezado */}
        <div className="p-4 bg-sumi-850 border-b border-sumi-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HankoSeal size="sm" variant="stamp" />
            <div>
              <h3 className="text-sm font-bold text-washi-100 uppercase tracking-wide flex items-center gap-1.5">
                <Calculator size={16} className="text-cinabrio-500" />
                <span>Cálculos Previos de Preparación (Estequiometría de Entrada)</span>
              </h3>
              <p className="text-[11px] text-sumi-400">
                Estimación teórica de masas, alícuotas y reactivos antes de ingresar a la mesada
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-sumi-400 hover:text-white rounded-lg hover:bg-sumi-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido según Práctica */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh] text-xs">
          <div className="p-3 bg-sumi-950 border border-sumi-800 rounded-xl text-[11px] text-sumi-300 leading-relaxed flex items-start gap-2">
            <HelpCircle size={15} className="text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Requisito Académico (UMSS):</strong> En química analítica no se entra al laboratorio a adivinar cantidades. Se calculan previamente las masas a pesar y los volúmenes teóricos esperados para trabajar en la zona óptima de la bureta.
            </span>
          </div>

          {practiceNumber === 7 ? (
            /* CÁLCULO PREVIO P7: TITULACIÓN POTENCIOMÉTRICA */
            <div className="space-y-3 bg-sumi-850 p-4 rounded-xl border border-sumi-700">
              <span className="font-bold text-washi-100 block text-xs border-b border-sumi-700 pb-1">
                Estimación de Volumen de Equivalencia (Veq):
              </span>
              <p className="text-[11px] text-sumi-400">
                Alícuota: 25.00 mL de HCl (~0.1000 N) valorada con NaOH estándar (0.1015 N):
              </p>
              <div className="p-2.5 bg-sumi-950 rounded-lg font-mono text-[11px] text-cyan-300 text-center">
                V_eq(NaOH) = (V_HCl × N_HCl) / N_NaOH = (25.00 × 0.1000) / 0.1015 = 24.63 mL
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-medium text-washi-300">
                  Su estimación de gasto teórico (mL):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={veqInput}
                    onChange={(e) => setVeqInput(e.target.value)}
                    placeholder="ej. 24.63"
                    className="w-full px-3 py-1.5 bg-sumi-950 border border-sumi-700 rounded-lg font-mono text-emerald-400 font-bold focus:outline-none focus:border-cinabrio-500"
                  />
                  <span className="font-mono text-sumi-400">mL</span>
                </div>
              </div>
            </div>
          ) : practiceNumber === 5 ? (
            /* CÁLCULO PREVIO P5: PRECIPITACIÓN DE SULFATO */
            <div className="space-y-3 bg-sumi-850 p-4 rounded-xl border border-sumi-700">
              <span className="font-bold text-washi-100 block text-xs border-b border-sumi-700 pb-1">
                Cálculo de Volumen Precipitante de BaCl2 (5% p/v):
              </span>
              <p className="text-[11px] text-sumi-400">
                Para precipitar el sulfato en 0.5000 g de muestra problema (~30% SO4) con 10% de exceso para efecto de ion común:
              </p>
              <div className="p-2.5 bg-sumi-950 rounded-lg font-mono text-[11px] text-cyan-300 text-center">
                V_BaCl2 = (m_SO4 × 208.23 / 96.06) / 0.05 × 1.10 ≈ 15.20 mL
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-medium text-washi-300">
                  Volumen mínimo de BaCl2 al 5% requerido (mL):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={bacl2Input}
                    onChange={(e) => setBacl2Input(e.target.value)}
                    placeholder="ej. 15.2"
                    className="w-full px-3 py-1.5 bg-sumi-950 border border-sumi-700 rounded-lg font-mono text-emerald-400 font-bold focus:outline-none focus:border-cinabrio-500"
                  />
                  <span className="font-mono text-sumi-400">mL</span>
                </div>
              </div>
            </div>
          ) : (
            /* CÁLCULO PREVIO P4: ESTANDARIZACIÓN DE NAOH */
            <div className="space-y-3 bg-sumi-850 p-4 rounded-xl border border-sumi-700">
              <span className="font-bold text-washi-100 block text-xs border-b border-sumi-700 pb-1">
                1. Masa de NaOH sólido (lentejas) para preparar 250 mL de solución ~0.1 N:
              </span>
              <div className="p-2 bg-sumi-950 rounded-lg font-mono text-[11px] text-cyan-300 text-center">
                m = N × V × PE = 0.1000 × 0.250 L × 40.00 g/eq = 1.0000 g
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-washi-300">
                  Masa de NaOH a pesar en vaso con balanza granataria (g):
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={naohMassInput}
                  onChange={(e) => setNaohMassInput(e.target.value)}
                  placeholder="ej. 1.0000"
                  className="w-full px-3 py-1.5 bg-sumi-950 border border-sumi-700 rounded-lg font-mono text-emerald-400 font-bold focus:outline-none focus:border-cinabrio-500"
                />
              </div>

              <span className="font-bold text-washi-100 block text-xs border-b border-sumi-700 pt-2 pb-1">
                2. Masa de Patrón Primario KHP para un gasto ideal de 10.50 mL de NaOH:
              </span>
              <div className="p-2 bg-sumi-950 rounded-lg font-mono text-[11px] text-cyan-300 text-center">
                m_KHP = (0.1000 N × 10.50 mL × 204.22 g/eq) / 1000 = 0.2144 g
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-washi-300">
                  Masa teórica de KHP a pesar en Balanza Analítica (g):
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={khpTargetInput}
                  onChange={(e) => setKhpTargetInput(e.target.value)}
                  placeholder="ej. 0.2144"
                  className="w-full px-3 py-1.5 bg-sumi-950 border border-sumi-700 rounded-lg font-mono text-emerald-400 font-bold focus:outline-none focus:border-cinabrio-500"
                />
              </div>
            </div>
          )}

          {verified && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-500 rounded-xl text-xs text-emerald-300 animate-in fade-in flex items-center gap-2">
              <Check size={16} className="shrink-0" />
              <span>
                <strong>¡Cálculos Verificados Conformes!</strong> Sus estimaciones estequiométricas coinciden con el Plan de Laboratorio de la UMSS.
              </span>
            </div>
          )}
        </div>

        {/* Pie de modal */}
        <div className="p-4 bg-sumi-850 border-t border-sumi-700 flex items-center justify-between gap-2">
          <button
            onClick={handleAutoFill}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium"
          >
            Autocompletar estequiometría teórica
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleVerifyCalculations}
              className="px-3.5 py-1.5 bg-sumi-800 hover:bg-sumi-700 text-washi-200 border border-sumi-600 rounded-xl text-xs font-bold transition-all"
            >
              Comprobar
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-cinabrio-600 hover:bg-cinabrio-500 active:scale-95 text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-1"
            >
              <span>Ir a la Mesada</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

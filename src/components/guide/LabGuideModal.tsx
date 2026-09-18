import React, { useState } from 'react';
import { BookOpen, Monitor, ShieldAlert, X, Target } from 'lucide-react';
import { HankoSeal } from '../common/HankoSeal';

interface LabGuideModalProps {
  isOpen: boolean;
  practiceNumber?: number;
  onClose: () => void;
}

export const LabGuideModal: React.FC<LabGuideModalProps> = ({ isOpen, practiceNumber = 4, onClose }) => {
  const [activeTab, setActiveTab] = useState<'real_lab' | 'simulator'>('real_lab');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none font-sans">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0a0a0a] border border-[#262626] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Encabezado Sumi-e */}
        <div className="p-4 bg-[#121212] border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HankoSeal size="sm" variant="stamp" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
                Guía de Procedimiento: {practiceNumber === 12 ? 'P12 (Espectrofotometría UV-Vis Fe)' : practiceNumber === 5 ? 'P5 (Gravimetría BaSO4)' : practiceNumber === 7 ? 'P7 (Potenciometría HCl)' : 'P4 (Estandarización NaOH)'}
              </h3>
              <p className="text-[11px] text-[#888888]">
                Departamento de Química — UMSS (Cochabamba, Bolivia)
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

        {/* Barra de pestañas */}
        <div className="flex border-b border-[#222222] bg-[#0d0d0d] px-4 pt-2 gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('real_lab')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-bold border-t border-x transition-all cursor-pointer ${
              activeTab === 'real_lab'
                ? 'bg-[#171717] border-[#333333] border-t-2 border-t-[#dc2626] text-white'
                : 'border-transparent text-[#777777] hover:text-white'
            }`}
          >
            <BookOpen size={14} className="text-[#dc2626]" />
            <span>1. Protocolo de Laboratorio Presencial</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-bold border-t border-x transition-all cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-[#171717] border-[#333333] border-t-2 border-t-[#dc2626] text-white'
                : 'border-transparent text-[#777777] hover:text-white'
            }`}
          >
            <Monitor size={14} className="text-[#dc2626]" />
            <span>2. Operación de la Mesada Virtual (Paso a Paso)</span>
          </button>
        </div>

        {/* Cuerpo de la Guía */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-[#cccccc]">
          {activeTab === 'real_lab' ? (
            <div className="space-y-4 animate-in fade-in">
              {/* Objetivos */}
              <div className="p-3.5 bg-[#121212] border-l-4 border-l-[#dc2626] border-y border-r border-[#262626] rounded-xl space-y-1.5 shadow">
                <div className="flex items-center gap-1.5 text-white font-bold uppercase tracking-wider text-[11px] font-serif">
                  <Target size={15} className="text-[#dc2626]" />
                  <span>Objetivo de la Práctica</span>
                </div>
                <p className="text-[#cccccc] leading-relaxed text-[11px]">
                  {practiceNumber === 12
                    ? 'Determinar trazas de hierro total en disolución acuosa mediante la formación del quelato coloreado ferroso-1,10-fenantrolina [Fe(phen)3]2+ a 508 nm, evaluando la absortividad molar y ajustando la recta de calibración de Beer-Lambert por mínimos cuadrados.'
                    : practiceNumber === 5
                    ? 'Precipitar cuantitativamente el ion sulfato como sulfato de bario (BaSO4) en medio ácido clorhídrico caliente, controlar la sobresaturación relativa, ejecutar la digestión Ostwald, filtrar con papel Whatman 42, lavar hasta ausencia de cloruros y calcinar en mufla a peso constante.'
                    : practiceNumber === 7
                    ? 'Titular una alícuota de 25.00 mL de ácido clorhídrico con NaOH estandarizado, evaluando simultáneamente el viraje del indicador de fenolftaleína y la respuesta potenciométrica de un electrodo combinado de vidrio, para construir la curva sigmoidal y aplicar el método de la primera derivada numérica (dpH/dV).'
                    : 'Determinar con exactitud analítica la normalidad de una solución de hidróxido de sodio (~0.1 N) mediante titulación de neutralización ácido-base frente a biftalato de potasio (KHP) como patrón primario ácido, empleando fenolftaleína como indicador de viraje visual.'}
                </p>
              </div>

              {/* Reacción Química y Fundamento */}
              <div className="p-3.5 bg-[#121212] border border-[#262626] rounded-xl space-y-2">
                <span className="font-bold text-white uppercase text-[11px] tracking-wider block font-serif">
                  Fundamento Estequiométrico
                </span>
                <div className="p-2.5 bg-[#050505] rounded-lg border border-[#222222] font-mono text-[11px] text-[#ef4444] text-center font-bold">
                  {practiceNumber === 12
                    ? 'Fe²⁺ + 3 phen ➔ [Fe(phen)₃]²⁺  (λ_max = 508 nm, ε = 1.11 × 10⁴ L/(mol·cm))'
                    : practiceNumber === 5
                    ? 'SO₄²⁻ + Ba²⁺ ➔ BaSO₄ (s)  (Medio HCl caliente, FG = 0.4116)'
                    : practiceNumber === 7
                    ? 'HCl (ac) + NaOH (ac) ➔ NaCl (ac) + H₂O (l)'
                    : 'KHC₈H₄O₄ + NaOH ➔ KNaC₈H₄O₄ + H₂O'}
                </div>
                <p className="text-[11px] text-[#aaaaaa] leading-relaxed">
                  {practiceNumber === 12
                    ? 'La 1,10-fenantrolina reacciona exclusivamente con Fe(II). El uso de hidroxilamina asegura la reducción de Fe(III) y el tampón acetato fija el pH a 4.5 para garantizar la estabilidad del complejo.'
                    : practiceNumber === 5
                    ? 'La digestión térmica a 85 °C promueve la disolución de los cristales microscópicos coloidales y su recristalización en partículas densas, evitando pérdidas durante la filtración por gravedad.'
                    : practiceNumber === 7
                    ? 'En la neutralización de ácido fuerte con base fuerte el salto de pH es vertical entre 3.5 y 10.0, permitiendo que la fenolftaleína vire casi simultáneamente con el punto de equivalencia estequiométrico.'
                    : 'El biftalato de potasio (KHP) es un patrón primario de alta pureza (MW = 204.22 g/eq) que neutraliza al NaOH 1:1, permitiendo determinar con 4 cifras significativas la concentración real del titulante.'}
                </p>
              </div>

              {/* Normas de Bioseguridad */}
              <div className="p-3.5 bg-[#1f0808] border border-[#dc2626]/60 rounded-xl flex items-start gap-2.5 text-white">
                <ShieldAlert size={18} className="text-[#ef4444] shrink-0 mt-0.5" />
                <div className="space-y-1 text-[11px]">
                  <strong className="text-[#ef4444] uppercase tracking-wider font-serif">Normas de Bioseguridad y Cuidados Críticos:</strong>
                  <ul className="list-disc list-inside text-[#cccccc] space-y-0.5">
                    <li>El NaOH es fuertemente cáustico: usar gafas de seguridad y guantes de nitrilo.</li>
                    <li>No soplar jamás la última gota retenida en pipetas volumétricas aforadas (calibradas TD/Ex).</li>
                    <li>No tocar las caras ópticas transparentes de las cubetas de espectrofotometría con los dedos.</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in text-[11px]">
              <div className="p-3.5 bg-[#121212] border border-[#262626] rounded-xl text-[#cccccc] leading-relaxed">
                <strong className="text-white uppercase tracking-wider font-serif block mb-1">
                  Guía de Manejo de la Mesada Virtual:
                </strong>
                Siga estrictamente el stepper superior: apruebe la lista de materiales, prepare la alícuota en balanza o pipeta, purgue la bureta, agregue el indicador con el gotero y registre los datos en la libreta digital.
              </div>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="p-4 bg-[#121212] border-t border-[#222222] flex items-center justify-between font-serif">
          <span className="text-[11px] text-[#666666] font-mono">
            Plan de Laboratorio • Departamento de Química UMSS
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#dc2626] hover:bg-[#b91c1c] rounded-xl text-xs font-bold text-white shadow cursor-pointer uppercase tracking-wider"
          >
            Entendido, volver a la mesada
          </button>
        </div>
      </div>
    </div>
  );
};

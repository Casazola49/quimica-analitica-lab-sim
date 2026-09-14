import React, { useState } from 'react';
import { BookOpen, Monitor, ShieldAlert, X, FlaskConical, Target } from 'lucide-react';

interface LabGuideModalProps {
  isOpen: boolean;
  practiceNumber?: number;
  onClose: () => void;
}

export const LabGuideModal: React.FC<LabGuideModalProps> = ({ isOpen, practiceNumber = 4, onClose }) => {
  const [activeTab, setActiveTab] = useState<'real_lab' | 'simulator'>('real_lab');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Encabezado */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 border border-blue-500/40 rounded-xl text-blue-400">
              <FlaskConical size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Guía de Procedimiento: {practiceNumber === 7 ? 'Práctica 7 (Titulación Potenciométrica HCl)' : 'Práctica 4 (Estandarización NaOH)'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Departamento de Química — Facultad de Ciencias y Tecnología (UMSS 5to Semestre)
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

        {/* Barra de pestañas: Laboratorio Real vs Simulador Virtual */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('real_lab')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold border-t border-x transition-all ${
              activeTab === 'real_lab'
                ? 'bg-slate-900 border-slate-700 text-blue-300 border-b-transparent'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen size={15} />
            <span>1. Protocolo de Laboratorio Real (Presencial)</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold border-t border-x transition-all ${
              activeTab === 'simulator'
                ? 'bg-slate-900 border-slate-700 text-cyan-300 border-b-transparent'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor size={15} />
            <span>2. Cómo Operar la Mesada Virtual (Paso a Paso)</span>
          </button>
        </div>

        {/* Cuerpo de la Guía */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-300">
          {activeTab === 'real_lab' ? (
            <div className="space-y-4 animate-in fade-in">
              {/* Objetivos */}
              <div className="p-3.5 bg-slate-800/60 border border-slate-700 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-blue-300 font-bold uppercase tracking-wider text-[11px]">
                  <Target size={15} />
                  <span>Objetivo de la Práctica</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {practiceNumber === 7
                    ? 'Titular una alícuota de 25.00 mL de ácido clorhídrico (~0.1 N) con NaOH estandarizado, evaluando simultáneamente el viraje del indicador de fenolftaleína y la respuesta potenciométrica de un electrodo combinado de vidrio, para construir la curva sigmoidal y aplicar el método de la primera derivada numérica (dpH/dV) en la detección del punto de equivalencia.'
                    : 'Determinar con exactitud analítica la normalidad de una solución de hidróxido de sodio (~0.1 N) mediante titulación de neutralización ácido-base frente a biftalato de potasio (KHP) como patrón primario ácido, empleando fenolftaleína como indicador de viraje visual.'}
                </p>
              </div>

              {/* Reacción Química y Fundamento */}
              <div className="p-3.5 bg-slate-800/60 border border-slate-700 rounded-xl space-y-2">
                <span className="font-bold text-slate-200 uppercase text-[11px] tracking-wider">
                  Reacción Química Estequiométrica
                </span>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 text-center">
                  {practiceNumber === 7
                    ? 'HCl (ac) + NaOH (ac) ➔ NaCl (ac) + H₂O (l)'
                    : 'KHC₈H₄O₄ + NaOH ➔ KNaC₈H₄O₄ + H₂O'}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {practiceNumber === 7
                    ? 'En la neutralización de un ácido fuerte con una base fuerte, antes del punto de equivalencia el pH está gobernado por la concentración de H+ no reaccionado. En el punto de equivalencia exacto, la solución contiene únicamente agua y NaCl neutro (pH = 7.00). El salto de pH es vertical y abrupto (de ~3.5 a ~10.5 en apenas 0.05 mL), lo que permite que el viraje de fenolftaleína (pH 8.3-8.5) coincida prácticamente con el punto de equivalencia estequiométrico con un error menor al 0.1%.'
                    : 'El biftalato de potasio (KHP) actúa como ácido monoprótico con un peso equivalente igual a su peso molecular (204.22 g/eq). En el punto de equivalencia estequiométrico el pH es débilmente básico (~8.7) por la hidrólisis del ion ftalato, motivo por el cual la fenolftaleína (rango de viraje pH 8.2 - 10.0) es el indicador ideal según Skoog (Cap. 14).'}
                </p>
              </div>

              {/* Procedimiento Presencial */}
              <div className="space-y-2.5">
                <span className="font-bold text-slate-200 uppercase text-[11px] tracking-wider">
                  Procedimiento Experimental en Laboratorio
                </span>

                <ol className="space-y-2 text-[11px] list-none">
                  {practiceNumber === 7 ? (
                    <>
                      <li className="p-2.5 bg-slate-800/40 border border-slate-700/80 rounded-xl flex items-start gap-2.5">
                        <span className="font-bold font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700/60">Paso 1</span>
                        <p>
                          <strong>Calibración del pH-metro:</strong> Calibrar el instrumento con tampones estándar certificados de pH 7.00 y 4.00 (calibración en dos puntos). Enjuagar minuciosamente el electrodo de vidrio con pizeta de agua destilada y secar con papel tissue suave sin frotar el bulbo.
                        </p>
                      </li>
                      <li className="p-2.5 bg-slate-800/40 border border-slate-700/80 rounded-xl flex items-start gap-2.5">
                        <span className="font-bold font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700/60">Paso 2</span>
                        <p>
                          <strong>Toma de Alícuota con Pipeta Aforada:</strong> Emplear la propipeta de tres vías para aspirar 25.00 mL de solución de HCl. Enrasar el menisco a la altura de los ojos y transferir al vaso de 150 mL tocando la pared por gravedad libre. <strong>No soplar la última gota retenida en la punta</strong>.
                        </p>
                      </li>
                      <li className="p-2.5 bg-slate-800/40 border border-slate-700/80 rounded-xl flex items-start gap-2.5">
                        <span className="font-bold font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700/60">Paso 3</span>
                        <p>
                          <strong>Montaje de Celda y Carga de Bureta:</strong> Sumergir el electrodo de vidrio asegurando que el bulbo y el diafragma queden completamente cubiertos de líquido sin tocar la barra magnética. Cargar la bureta con NaOH 0.1 N estandarizado y purgar la burbuja de aire.
                        </p>
                      </li>
                      <li className="p-2.5 bg-slate-800/40 border border-slate-700/80 rounded-xl flex items-start gap-2.5">
                        <span className="font-bold font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700/60">Paso 4</span>
                        <p>
                          <strong>Titulación y Registro Potenciométrico:</strong> Agregar 2 gotas de fenolftaleína. Activar la agitación magnética. Titular gota a gota registrando los pares de datos de volumen entregado y pH medido. Observar la primera derivada para identificar el salto abrupto de pH y anotar el volumen de viraje.
                        </p>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="p-2.5 bg-slate-800/40 border border-slate-700/80 rounded-xl flex items-start gap-2.5">
                        <span className="font-bold font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700/60">Paso 1</span>
                        <p>
                          <strong>Pesada en Balanza Analítica:</strong> Pesar con exactitud en pesafiltro entre 0.2000 g y 0.2500 g de biftalato de potasio previamente desecado en estufa a 110 °C durante 2 horas. Anotar la masa con 4 cifras decimales (0.1 mg).
                        </p>
                      </li>
                      <li className="p-2.5 bg-slate-800/40 border border-slate-700/80 rounded-xl flex items-start gap-2.5">
                        <span className="font-bold font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700/60">Paso 2</span>
                        <p>
                          <strong>Disolución en Erlenmeyer:</strong> Transferir la sal al matraz lavando con agua destilada recién hervida (exenta de CO₂) hasta ~50 mL. Agitar hasta disolución total.
                        </p>
                      </li>
                      <li className="p-2.5 bg-slate-800/40 border border-slate-700/80 rounded-xl flex items-start gap-2.5">
                        <span className="font-bold font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700/60">Paso 3</span>
                        <p>
                          <strong>Carga y Purga de la Bureta:</strong> Llenar la bureta con NaOH 0.1 N y purgar enérgicamente la llave abriéndola de golpe hacia un vaso de desecho para desalojar cualquier burbuja de aire en la punta.
                        </p>
                      </li>
                      <li className="p-2.5 bg-slate-800/40 border border-slate-700/80 rounded-xl flex items-start gap-2.5">
                        <span className="font-bold font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700/60">Paso 4</span>
                        <p>
                          <strong>Detección del Punto Final:</strong> Agregar 2 gotas de fenolftaleína y titular con agitación continua hasta el primer rosa tenue que persista al menos 30 segundos.
                        </p>
                      </li>
                    </>
                  )}
                </ol>
              </div>

              {/* Normas de Bioseguridad */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2 text-amber-200">
                <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-[11px]">
                  <strong>Normas de Bioseguridad y Cuidados Críticos:</strong>
                  <ul className="list-disc list-inside text-slate-300">
                    <li>El bulbo de vidrio del electrodo es de membrana delgada (~0.1 mm): cuidarse de no golpearlo con la barra de agitación magnética.</li>
                    <li>No soplar jamás la última gota retenida en pipetas volumétricas aforadas (calibradas TD/Ex).</li>
                    <li>Mantener el electrodo hidratado en solución de KCl 3M cuando no esté en uso; no dejar secar al aire.</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in text-[11px]">
              <div className="p-3.5 bg-cyan-950/40 border border-cyan-800/50 rounded-xl flex items-start gap-2 text-cyan-200">
                <Monitor size={16} className="shrink-0 mt-0.5 text-cyan-400" />
                <p className="leading-relaxed">
                  <strong>Instrucciones para la Mesada Virtual de {practiceNumber === 7 ? 'P7' : 'P4'}:</strong>
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-slate-800/50 border border-slate-700 rounded-xl">
                  <strong>Paso 1: Requisición de Materiales:</strong> Presentar al ayudante la lista de materiales requeridos aprobando el control de entrada.
                </div>
                <div className="p-2.5 bg-slate-800/50 border border-slate-700 rounded-xl">
                  <strong>Paso 2: Cargar NaOH:</strong> Pulsar "1. Cargar Bureta con NaOH 0.1 N".
                </div>
                <div className="p-2.5 bg-slate-800/50 border border-slate-700 rounded-xl">
                  {practiceNumber === 7
                    ? 'Paso 3: Pipetear 25.00 mL de HCl con la propipeta y transferir sin soplar la última gota.'
                    : 'Paso 3: Pesar ~0.21 g de KHP en la Balanza Analítica digital (tarando a 0.0000 g).'}
                </div>
                <div className="p-2.5 bg-slate-800/50 border border-slate-700 rounded-xl">
                  <strong>Paso 4: Purgar y Enrasar:</strong> Purgar la burbuja del pico y registrar V0 con la Lupa 4x sin error de paralaje.
                </div>
                <div className="p-2.5 bg-slate-800/50 border border-slate-700 rounded-xl">
                  <strong>Paso 5: Indicador y Agitación:</strong> Agregar gotas de fenolftaleína y encender el agitador magnético.
                </div>
                <div className="p-2.5 bg-slate-800/50 border border-slate-700 rounded-xl">
                  {practiceNumber === 7
                    ? 'Paso 6: Titular hasta viraje. En la libreta consultar la pestaña "Curva pH & 1ra Derivada" para verificar el pico Veq y evaluar con 4 cifras significativas.'
                    : 'Paso 6: Titular hasta viraje rosa tenue, anotar Vf con la Lupa y evaluar el informe en la libreta.'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="p-4 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Química Analítica Cuantitativa — Depto. Química UMSS
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white shadow"
          >
            Entendido, volver a la mesada
          </button>
        </div>
      </div>
    </div>
  );
};

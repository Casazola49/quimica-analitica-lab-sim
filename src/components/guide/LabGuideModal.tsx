import React, { useState } from 'react';
import { BookOpen, Monitor, ShieldAlert, CheckCircle2, X, FlaskConical, Target } from 'lucide-react';

interface LabGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LabGuideModal: React.FC<LabGuideModalProps> = ({ isOpen, onClose }) => {
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
                Guía de Procedimiento de Laboratorio y Mesada
              </h3>
              <p className="text-[11px] text-slate-400">
                Práctica 4: Preparación y Estandarización de Soluciones de NaOH (UMSS 5to Semestre)
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
                  Determinar con exactitud analítica la normalidad de una solución de hidróxido de sodio (~0.1 N) mediante titulación de neutralización ácido-base frente a biftalato de potasio (KHP) como patrón primario ácido, empleando fenolftaleína como indicador de viraje visual.
                </p>
              </div>

              {/* Reacción Química y Fundamento */}
              <div className="p-3.5 bg-slate-800/60 border border-slate-700 rounded-xl space-y-2">
                <span className="font-bold text-slate-200 uppercase text-[11px] tracking-wider">
                  Reacción Química Estequiométrica
                </span>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 text-center">
                  KHC₈H₄O₄ + NaOH ➔ KNaC₈H₄O₄ + H₂O
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  El biftalato de potasio (KHP) actúa como ácido monoprótico con un peso equivalente igual a su peso molecular (204.22 g/eq). En el punto de equivalencia estequiométrico el pH es débilmente básico (~8.7) por la hidrólisis del ion ftalato, motivo por el cual la fenolftaleína (rango de viraje pH 8.2 - 10.0) es el indicador ideal según Skoog (Cap. 14).
                </p>
              </div>

              {/* Procedimiento Presencial */}
              <div className="space-y-2.5">
                <span className="font-bold text-slate-200 uppercase text-[11px] tracking-wider">
                  Procedimiento Experimental en Laboratorio
                </span>

                <ol className="space-y-2 text-[11px] list-none">
                  <li className="p-2.5 bg-slate-800/40 border border-slate-700/80 rounded-xl flex items-start gap-2.5">
                    <span className="font-bold font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700/60">Paso 1</span>
                    <p>
                      <strong>Pesada en Balanza Analítica:</strong> Pesar con exactitud en pesafiltro entre 0.2000 g y 0.2500 g de biftalato de potasio previamente desecado en estufa a 110 °C durante 2 horas. Anotar la masa con 4 cifras decimales (0.1 mg).
                    </p>
                  </li>

                  <li className="p-2.5 bg-slate-800/40 border border-slate-700/80 rounded-xl flex items-start gap-2.5">
                    <span className="font-bold font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700/60">Paso 2</span>
                    <p>
                      <strong>Disolución en Erlenmeyer:</strong> Transferir cuantitativamente la sal al matraz Erlenmeyer de 250 mL lavando el pesafiltro con agua destilada recién hervida (exenta de CO₂) hasta un volumen aproximado de 50 mL. Agitar suavemente hasta disolución total.
                    </p>
                  </li>

                  <li className="p-2.5 bg-slate-800/40 border border-slate-700/80 rounded-xl flex items-start gap-2.5">
                    <span className="font-bold font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700/60">Paso 3</span>
                    <p>
                      <strong>Carga y Purga de la Bureta:</strong> Enjuagar la bureta de 50 mL con pequeñas porciones de la solución de NaOH. Llenar la bureta por encima del cero. <strong>Purgar enérgicamente la llave</strong> abriéndola de golpe hacia un vaso de desecho para desalojar cualquier burbuja de aire atrapada en la punta capilar.
                    </p>
                  </li>

                  <li className="p-2.5 bg-slate-800/40 border border-slate-700/80 rounded-xl flex items-start gap-2.5">
                    <span className="font-bold font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700/60">Paso 4</span>
                    <p>
                      <strong>Enrase y Cota Inicial (V0):</strong> Ajustar el menisco a 0.00 mL o registrar la cota exacta colocando los ojos rigurosamente a la altura del menisco tangencial para evitar error de paralaje.
                    </p>
                  </li>

                  <li className="p-2.5 bg-slate-800/40 border border-slate-700/80 rounded-xl flex items-start gap-2.5">
                    <span className="font-bold font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700/60">Paso 5</span>
                    <p>
                      <strong>Adición de Indicador y Titulación:</strong> Añadir 2 a 3 gotas de solución alcohólica de fenolftaleína al matraz. Colocar el erlenmeyer sobre un fondo blanco (o plato de agitador). Iniciar el goteo de NaOH con la mano izquierda manipulando la llave y la mano derecha agitando continuamente el matraz.
                    </p>
                  </li>

                  <li className="p-2.5 bg-slate-800/40 border border-slate-700/80 rounded-xl flex items-start gap-2.5">
                    <span className="font-bold font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded border border-blue-700/60">Paso 6</span>
                    <p>
                      <strong>Detección del Punto Final:</strong> Al observar que el halo rosado transitorio tarda en disiparse, agregar gota a gota estricta (e incluso fracciones de gota lavando la punta con pizeta). Detener la titulación ante la aparición del <strong>primer color rosa muy tenue que persista durante al menos 30 segundos</strong>. Registrar el volumen final (Vf).
                    </p>
                  </li>
                </ol>
              </div>

              {/* Normas de Bioseguridad */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2 text-amber-200">
                <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-[11px]">
                  <strong>Normas de Bioseguridad y Cuidados Críticos:</strong>
                  <ul className="list-disc list-inside text-slate-300">
                    <li>El NaOH es fuertemente cáustico: usar gafas de seguridad y guantes de nitrilo. En caso de salpicadura lavar con abundante agua.</li>
                    <li>No soplar jamás la última gota retenida en la punta de pipetas volumétricas de transferencia (calibradas TD/Ex).</li>
                    <li>No dejar la solución alcalina de NaOH en la bureta después de terminar la práctica, pues ataca el vidrio esmerilado de la llave.</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 bg-cyan-950/40 border border-cyan-800/50 rounded-xl flex items-start gap-2 text-cyan-200">
                <Monitor size={16} className="shrink-0 mt-0.5 text-cyan-400" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Guía Interactiva de la Mesada Virtual:</strong> El simulador modela la física volumétrica y la técnica analítica en tiempo real. Siga este flujo paso a paso para evitar penalizaciones en su reporte de auditoría.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <CheckCircle2 size={16} />
                    <span>Paso 1: Purgar la Burbuja en el Pico de la Bureta</span>
                  </div>
                  <p className="text-[11px] text-slate-300 pl-6">
                    Mire la punta capilar de la bureta: si observa una burbuja parpadeante en el pico, presione el botón ámbar <strong>"Purgar Burbuja de Bureta"</strong> en la bandeja inferior de reactivos. Si titula con aire atrapado, el volumen desalojado falseará su gasto neto (TDA penalizará error por exceso).
                  </p>
                </div>

                <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <CheckCircle2 size={16} />
                    <span>Paso 2: Inspeccionar el Menisco con la Lupa 4x y Anotar V0</span>
                  </div>
                  <p className="text-[11px] text-slate-300 pl-6">
                    Haga clic sobre el menisco en la bureta o presione el botón flotante <strong>"Lupa Menisco"</strong>. Ajuste el control deslizante de ángulo a 0° para anular el error de paralaje y presione <strong>"Anotar en Libreta (Cota Inicial V0)"</strong>.
                  </p>
                </div>

                <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <CheckCircle2 size={16} />
                    <span>Paso 3: Añadir 2-3 Gotas de Fenolftaleína</span>
                  </div>
                  <p className="text-[11px] text-slate-300 pl-6">
                    En la repisa inferior, haga clic en el gotero de <strong>"Fenolftaleína"</strong> hasta añadir al menos 2 gotas al matraz. Sin indicador, no habrá viraje visible y sobretitulará la muestra sin notarlo.
                  </p>
                </div>

                <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <CheckCircle2 size={16} />
                    <span>Paso 4: Abrir la Llave de la Bureta (Gota a Gota vs Flujo Rápido)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 pl-6">
                    Presione sobre la llave giratoria o el botón de la llave para abrir el flujo. Utilice el modo <strong>"Gota a Gota"</strong> cuando se aproxime al volumen esperado (~10-11 mL) para evitar sobretitular. Asegúrese de que el agitador magnético esté encendido ("Agitación: 450 RPM").
                  </p>
                </div>

                <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <CheckCircle2 size={16} />
                    <span>Paso 5: Detener el Flujo ante el Primer Viraje Rosa Tenue</span>
                  </div>
                  <p className="text-[11px] text-slate-300 pl-6">
                    En cuanto el matraz adquiera una tonalidad rosa translúcida muy pálida (pH ~8.3-8.5), cierre inmediatamente la llave. Si la solución se torna fucsia intenso, se registrará un defecto de sobretitulación.
                  </p>
                </div>

                <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <CheckCircle2 size={16} />
                    <span>Paso 6: Abrir la Lupa para Vf y Realizar los Cálculos en la Libreta</span>
                  </div>
                  <p className="text-[11px] text-slate-300 pl-6">
                    Abra nuevamente la lupa de menisco y transfiera la lectura final como Vf. En la Libreta Digital (a la derecha en PC o en el botón flotante en móviles), calcule ΔV, aplique la fórmula estequiométrica ingresando su concentración con 4 cifras significativas y presione <strong>"Evaluar Informe y Cálculos"</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie de página */}
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

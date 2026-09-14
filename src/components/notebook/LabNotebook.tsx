import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Calculator, Award, CheckCircle2, XCircle, ExternalLink, LineChart, Table } from 'lucide-react';
import { EvaluationResult, LabNotebookData, TechniqueDefect } from '../../types';
import { evaluateStudentNotebook } from '../../engine/evaluator';

interface TitrationDataPoint {
  volume: number;
  pH: number;
}

interface LabNotebookProps {
  practiceNumber?: number;
  initialVolume: number;
  finalVolume: number;
  sampleMass: number; // En P4: masa en g. En P7: no se usa o es alícuota 25 mL
  trueConcentration: number;
  currentDeliveredMl?: number;
  currentPH?: number;
  defects: TechniqueDefect[];
  onOpenAuditModal: () => void;
}

export const LabNotebook: React.FC<LabNotebookProps> = ({
  practiceNumber = 4,
  initialVolume,
  finalVolume,
  sampleMass,
  trueConcentration,
  currentDeliveredMl = 0,
  currentPH = 7.0,
  defects,
  onOpenAuditModal,
}) => {
  const [activeTab, setActiveTab] = useState<'data' | 'graph'>('data');
  const [v0, setV0] = useState<string>(initialVolume.toFixed(2));
  const [vf, setVf] = useState<string>(finalVolume.toFixed(2));
  const [netV, setNetV] = useState<string>('');
  const [mass, setMass] = useState<string>(sampleMass.toFixed(4));
  const [aliquotVolume, setAliquotVolume] = useState<string>('25.00');
  const [calculatedN, setCalculatedN] = useState<string>('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // Registro dinámico de puntos de la curva de titulación potenciométrica (P7)
  const [titrationPoints, setTitrationPoints] = useState<TitrationDataPoint[]>([
    { volume: 0, pH: practiceNumber === 7 ? 1.05 : 3.5 },
  ]);

  // Actualizar puntos de titulación en tiempo real
  useEffect(() => {
    if (currentDeliveredMl > 0) {
      setTitrationPoints((prev) => {
        const last = prev[prev.length - 1];
        if (!last || Math.abs(currentDeliveredMl - last.volume) >= 0.4) {
          return [...prev, { volume: Number(currentDeliveredMl.toFixed(2)), pH: Number(currentPH.toFixed(2)) }];
        }
        return prev;
      });
    }
  }, [currentDeliveredMl, currentPH]);

  // Reset al cambiar de práctica o reiniciar
  useEffect(() => {
    if (currentDeliveredMl === 0) {
      setTitrationPoints([{ volume: 0, pH: practiceNumber === 7 ? 1.05 : 3.5 }]);
    }
  }, [currentDeliveredMl, practiceNumber]);

  // Sincronizar cotas de lectura transferidas desde la lupa
  useEffect(() => {
    setV0(initialVolume.toFixed(2));
  }, [initialVolume]);

  useEffect(() => {
    setVf(finalVolume.toFixed(2));
  }, [finalVolume]);

  useEffect(() => {
    setMass(sampleMass.toFixed(4));
  }, [sampleMass]);

  const handleCalculateDiff = () => {
    const num0 = parseFloat(v0) || 0;
    const numF = parseFloat(vf) || 0;
    const diff = Math.max(0, numF - num0);
    setNetV(diff.toFixed(2));
  };

  const handleEvaluate = () => {
    const data: LabNotebookData = {
      analyteName: practiceNumber === 7 ? 'Ácido Clorhídrico (HCl)' : 'Biftalato de Potasio',
      titrantName: 'Hidróxido de Sodio',
      sampleMass: parseFloat(mass) || 0,
      initialVolume: parseFloat(v0) || 0,
      finalVolume: parseFloat(vf) || 0,
      netVolume: parseFloat(netV) || 0,
      studentConcentration: parseFloat(calculatedN) || 0,
    };

    const res = evaluateStudentNotebook(data, trueConcentration, defects, practiceNumber);
    setEvaluation(res);
  };

  // Cálculo de la Primera Derivada Numérica (dpH/dV)
  const derivativeData = useMemo(() => {
    if (titrationPoints.length < 2) return [];
    const deriv: { volume: number; dpH_dV: number }[] = [];
    for (let i = 1; i < titrationPoints.length; i++) {
      const p1 = titrationPoints[i - 1];
      const p2 = titrationPoints[i];
      const dV = p2.volume - p1.volume;
      if (dV > 0.05) {
        const dpH = p2.pH - p1.pH;
        const midV = (p1.volume + p2.volume) / 2;
        deriv.push({
          volume: Number(midV.toFixed(2)),
          dpH_dV: Number((dpH / dV).toFixed(2)),
        });
      }
    }
    return deriv;
  }, [titrationPoints]);

  // Encontrar el pico de la primera derivada (Veq estimado)
  const maxDerivativePoint = useMemo(() => {
    if (derivativeData.length === 0) return null;
    return derivativeData.reduce((max, p) => (p.dpH_dV > max.dpH_dV ? p : max), derivativeData[0]);
  }, [derivativeData]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden min-h-0">
      {/* Encabezado de la Libreta */}
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-400" size={18} />
          <h2 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wide">
            Libreta de Laboratorio Digital
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 border border-blue-700/50 rounded-full font-semibold">
          {practiceNumber === 7 ? 'P7: Titulación Potenciométrica' : 'P4: Estandarización'}
        </span>
      </div>

      {/* Pestañas si es P7 (Datos vs Gráfico Potenciométrico) */}
      {practiceNumber === 7 && (
        <div className="flex border-b border-slate-800 bg-slate-950/70 px-3 pt-1.5 gap-2 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-bold border-t border-x text-[11px] transition-all ${
              activeTab === 'data'
                ? 'bg-slate-900 border-slate-700 text-blue-300 border-b-transparent'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table size={13} />
            <span>Datos & Cálculos</span>
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-bold border-t border-x text-[11px] transition-all ${
              activeTab === 'graph'
                ? 'bg-slate-900 border-slate-700 text-cyan-300 border-b-transparent'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LineChart size={13} />
            <span>Curva pH & 1ra Derivada ({titrationPoints.length} pts)</span>
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs text-slate-200 min-h-0">
        {activeTab === 'data' ? (
          <>
            {/* Tarjeta de Fórmula Canónica */}
            <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
                <Calculator size={14} />
                <span>Fórmula Estequiométrica:</span>
              </div>
              <p className="font-mono text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                {practiceNumber === 7
                  ? 'N(HCl) = (V_NaOH [mL] × N_NaOH [0.1015 N]) / V_alícuota [25.00 mL]'
                  : 'N(NaOH) = (m_KHP [g] × 1000) / (204.22 [g/eq] × ΔV [mL])'}
              </p>
            </div>

            {/* Formulario de Registro Experimental */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Parámetro de entrada (Masa KHP en P4, o Alícuota en P7) */}
              {practiceNumber === 7 ? (
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-medium">Volumen Alícuota HCl (Pipeta):</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.01"
                      value={aliquotVolume}
                      onChange={(e) => setAliquotVolume(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-cyan-300 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-slate-400 font-mono">mL</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-medium">Masa KHP (Balanza Analítica):</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.0001"
                      value={mass}
                      onChange={(e) => setMass(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-cyan-300 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-slate-400 font-mono">g</span>
                  </div>
                </div>
              )}

              {/* Lectura inicial V0 */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Lectura Inicial (V0 bureta):</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.01"
                    value={v0}
                    onChange={(e) => setV0(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-cyan-300 focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-slate-400 font-mono">mL</span>
                </div>
              </div>

              {/* Lectura final Vf */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Lectura Final (Vf viraje):</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.01"
                    value={vf}
                    onChange={(e) => setVf(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-cyan-300 focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-slate-400 font-mono">mL</span>
                </div>
              </div>

              {/* Gasto neto Delta V */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] text-slate-400 font-medium">Volumen Neto (ΔV = Vf - V0):</label>
                  <button
                    type="button"
                    onClick={handleCalculateDiff}
                    className="text-[10px] text-blue-400 hover:text-blue-300 underline"
                  >
                    Calcular resta
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.01"
                    value={netV}
                    onChange={(e) => setNetV(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-amber-300 focus:outline-none focus:border-blue-500 font-bold"
                  />
                  <span className="text-slate-400 font-mono">mL</span>
                </div>
              </div>
            </div>

            {/* Campo de concentración calculada por el alumno */}
            <div className="p-3 bg-blue-950/30 border border-blue-800/50 rounded-xl space-y-1.5">
              <label className="text-xs font-semibold text-blue-200">
                Su Concentración de {practiceNumber === 7 ? 'HCl' : 'NaOH'} Calculada:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.0001"
                  value={calculatedN}
                  onChange={(e) => setCalculatedN(e.target.value)}
                  placeholder="ej. 0.1012"
                  className="w-full px-3 py-2 bg-slate-900 border border-blue-500/60 rounded-lg font-mono text-sm text-emerald-400 font-bold focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <span className="text-sm font-mono text-blue-300 font-bold">N (eq/L)</span>
              </div>
              <p className="text-[10px] text-slate-400">
                *Exprese el resultado con 4 cifras significativas rigurosas.
              </p>
            </div>

            {/* Botón de evaluación */}
            <button
              onClick={handleEvaluate}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg border border-blue-400/30 transition-all flex items-center justify-center gap-2"
            >
              <Award size={16} />
              <span>Evaluar Informe y Cálculos</span>
            </button>

            {/* Resultados de la Evaluación */}
            {evaluation && (
              <div className="mt-3 p-4 bg-slate-800 border border-slate-700 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-xs font-bold text-slate-200">Puntaje Formativo:</span>
                  <span
                    className={`text-base font-extrabold font-mono px-3 py-0.5 rounded-full border ${
                      evaluation.score >= 85
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-600'
                        : evaluation.score >= 60
                        ? 'bg-amber-950 text-amber-400 border-amber-600'
                        : 'bg-rose-950 text-rose-400 border-rose-600'
                    }`}
                  >
                    {evaluation.score} / 100 pts
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span>1. Integridad de Datos Físicos:</span>
                    {evaluation.dataIntegrityPassed ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Correcto</span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1"><XCircle size={12} /> Falla detectada</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span>2. Precisión Aritmética (Fórmula):</span>
                    {evaluation.arithmeticAccuracyPassed ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Correcto</span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1"><XCircle size={12} /> Error aritmético</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span>3. Cifras Significativas (4 cifras):</span>
                    {evaluation.significantFiguresPassed ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Válido</span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1"><XCircle size={12} /> Formato incorrecto</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between font-mono pt-1 border-t border-slate-700/60">
                    <span className="text-slate-400">Error Relativo (% Er):</span>
                    <span className={evaluation.relativeErrorPercent <= 2 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {evaluation.relativeErrorPercent}%
                    </span>
                  </div>
                </div>

                {evaluation.feedbackNotes.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-slate-700">
                    <span className="text-[11px] font-bold text-amber-300">Observaciones Analíticas:</span>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                      {evaluation.feedbackNotes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={onOpenAuditModal}
                  className="w-full mt-2 py-2 bg-slate-700 hover:bg-slate-600 active:scale-95 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Ver Citas de la Tríada Digital (Skoog / Day & Underwood)</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Pestaña de Gráfico Potenciométrico y Primera Derivada */
          <div className="space-y-4 animate-in fade-in">
            <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl space-y-1.5">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                <LineChart size={15} />
                <span>Curva Potenciométrica en Tiempo Real (pH vs V_NaOH)</span>
              </span>
              <p className="text-[11px] text-slate-400">
                La curva azul representa la respuesta del electrodo de vidrio. La curva esmeralda traza la primera derivada numérica (ΔpH/ΔV), cuyo pico marca el punto de equivalencia exacto (Veq).
              </p>
            </div>

            {/* Gráfico SVG de Titulación */}
            <div className="w-full h-56 bg-slate-950 p-2 rounded-xl border border-slate-800 relative flex items-center justify-center shadow-inner">
              <svg width="100%" height="100%" viewBox="0 0 340 180" className="overflow-visible">
                <defs>
                  <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Ejes cartesianos (Origen en x=35, y=155. Max X: 320, Max Y: 15) */}
                <rect x="35" y="15" width="285" height="140" fill="url(#gridGrad)" stroke="#334155" strokeWidth="1" />

                {/* Líneas de cuadrícula horizontal para pH = 0, 7, 14 */}
                <line x1="35" y1="155" x2="320" y2="155" stroke="#475569" strokeWidth="1" />
                <text x="12" y="158" fill="#94a3b8" fontSize="8" fontFamily="monospace">pH 0</text>

                <line x1="35" y1="85" x2="320" y2="85" stroke="#475569" strokeWidth="0.8" strokeDasharray="3 3" />
                <text x="12" y="88" fill="#10b981" fontSize="8" fontFamily="monospace">pH 7</text>

                <line x1="35" y1="15" x2="320" y2="15" stroke="#475569" strokeWidth="1" />
                <text x="8" y="18" fill="#94a3b8" fontSize="8" fontFamily="monospace">pH 14</text>

                {/* Etiquetas de volumen X (0, 10, 20, 30 mL) */}
                <text x="35" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">0 mL</text>
                <text x="125" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">10 mL</text>
                <text x="215" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">20 mL</text>
                <text x="305" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">30 mL</text>

                {/* Trazo de la Curva Sigmoidal (pH vs V) */}
                {titrationPoints.length > 1 && (
                  <path
                    d={titrationPoints
                      .map((p, idx) => {
                        const x = 35 + (Math.min(30, p.volume) / 30) * 285;
                        const y = 155 - (Math.min(14, Math.max(0, p.pH)) / 14) * 140;
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}

                {/* Puntos experimentales registrados */}
                {titrationPoints.map((p, idx) => {
                  const x = 35 + (Math.min(30, p.volume) / 30) * 285;
                  const y = 155 - (Math.min(14, Math.max(0, p.pH)) / 14) * 140;
                  return <circle key={idx} cx={x} cy={y} r="2" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />;
                })}

                {/* Trazo de la Primera Derivada (dpH/dV) en verde esmeralda */}
                {derivativeData.length > 1 && (
                  <path
                    d={derivativeData
                      .map((p, idx) => {
                        const x = 35 + (Math.min(30, p.volume) / 30) * 285;
                        // Escalar derivada: dpH/dV hasta 30 unidades
                        const y = 155 - (Math.min(30, Math.max(0, p.dpH_dV)) / 30) * 135;
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.8"
                    strokeDasharray="2 1"
                  />
                )}

                {/* Marcador vertical del pico de equivalencia si se superó Veq */}
                {maxDerivativePoint && maxDerivativePoint.dpH_dV > 4 && (
                  <g>
                    <line
                      x1={35 + (maxDerivativePoint.volume / 30) * 285}
                      y1="15"
                      x2={35 + (maxDerivativePoint.volume / 30) * 285}
                      y2="155"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    <text
                      x={35 + (maxDerivativePoint.volume / 30) * 285 - 18}
                      y="28"
                      fill="#f59e0b"
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      Veq: {maxDerivativePoint.volume} mL
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Datos estadísticos de la curva */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1 text-[11px] font-mono">
              <div className="flex justify-between text-cyan-300">
                <span>Lectura actual:</span>
                <span>V = {currentDeliveredMl.toFixed(2)} mL | pH = {currentPH.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Pico 1ra derivada (Veq estimado):</span>
                <span>{maxDerivativePoint ? `${maxDerivativePoint.volume} mL (ΔpH/ΔV = ${maxDerivativePoint.dpH_dV})` : 'Pendiente...'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

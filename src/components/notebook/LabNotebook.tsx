import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Calculator, Award, CheckCircle2, XCircle, ExternalLink, LineChart, Table, FileText } from 'lucide-react';
import { EvaluationResult, LabNotebookData, TechniqueDefect } from '../../types';
import { evaluateStudentNotebook } from '../../engine/evaluator';
import { LabReportModal } from './LabReportModal';

interface TitrationDataPoint {
  volume: number;
  pH: number;
}

export interface SpectroMeasurementPoint {
  ppm: number;
  absorbance: number;
  transmittance?: number;
  isUnknown?: boolean;
}

interface LabNotebookProps {
  practiceNumber?: number;
  initialVolume: number;
  finalVolume: number;
  sampleMass: number; // P4: masa KHP. P5: muestra sulfatos. P7: alícuota 25 mL. P12: no se usa
  trueConcentration: number;
  currentDeliveredMl?: number;
  currentPH?: number;
  spectroPoints?: SpectroMeasurementPoint[];
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
  spectroPoints = [],
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

  // Campos específicos de Gravimetría (P5)
  const [crucibleTare, setCrucibleTare] = useState<string>('18.5420');
  const [cruciblePlusBaSO4, setCruciblePlusBaSO4] = useState<string>('18.8941');
  const [netBaSO4Mass, setNetBaSO4Mass] = useState<string>('0.3521');
  const [studentPurityPercent, setStudentPurityPercent] = useState<string>('');

  // Campos específicos de Espectrofotometría (P12)
  const [studentFePpm, setStudentFePpm] = useState<string>('');

  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Registro dinámico de puntos de titulación potenciométrica (P7)
  const [titrationPoints, setTitrationPoints] = useState<TitrationDataPoint[]>([
    { volume: 0, pH: practiceNumber === 7 ? 1.05 : 3.5 },
  ]);

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

  useEffect(() => {
    if (currentDeliveredMl === 0) {
      setTitrationPoints([{ volume: 0, pH: practiceNumber === 7 ? 1.05 : 3.5 }]);
    }
  }, [currentDeliveredMl, practiceNumber]);

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

  const handleCalculateGravimetricDiff = () => {
    const tare = parseFloat(crucibleTare) || 0;
    const total = parseFloat(cruciblePlusBaSO4) || 0;
    const diff = Math.max(0, total - tare);
    setNetBaSO4Mass(diff.toFixed(4));
  };

  // Cálculo de Regresión Lineal de la Ley de Beer (P12)
  const beerRegression = useMemo(() => {
    const calPoints = spectroPoints.filter((p) => !p.isUnknown);
    if (calPoints.length < 2) return null;

    const n = calPoints.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    for (const p of calPoints) {
      sumX += p.ppm;
      sumY += p.absorbance;
      sumXY += p.ppm * p.absorbance;
      sumX2 += p.ppm * p.ppm;
      sumY2 += p.absorbance * p.absorbance;
    }

    const meanX = sumX / n;
    const meanY = sumY / n;

    const denominator = sumX2 - n * meanX * meanX;
    if (Math.abs(denominator) < 1e-9) return null;

    const slope = (sumXY - n * meanX * meanY) / denominator;
    const intercept = meanY - slope * meanX;

    const numR = sumXY - n * meanX * meanY;
    const denR = Math.sqrt((sumX2 - n * meanX * meanX) * (sumY2 - n * meanY * meanY));
    const r2 = denR > 0 ? Math.pow(numR / denR, 2) : 0;

    const unkPoint = spectroPoints.find((p) => p.isUnknown);
    const interpolatedPpm = unkPoint ? (unkPoint.absorbance - intercept) / slope : null;

    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(4)),
      r2: Number(r2.toFixed(4)),
      unknownAbs: unkPoint?.absorbance ?? null,
      interpolatedPpm: interpolatedPpm !== null ? Number(interpolatedPpm.toFixed(2)) : null,
      points: calPoints,
    };
  }, [spectroPoints]);

  const handleEvaluate = () => {
    const data: LabNotebookData = {
      analyteName:
        practiceNumber === 12
          ? 'Hierro total con 1,10-fenantrolina'
          : practiceNumber === 5
          ? 'Sulfatos en muestra (como BaSO4)'
          : practiceNumber === 7
          ? 'Ácido Clorhídrico (HCl)'
          : 'Biftalato de Potasio',
      titrantName: practiceNumber === 12 ? 'Luz 508 nm' : practiceNumber === 5 ? 'BaCl2 5%' : 'Hidróxido de Sodio',
      sampleMass: parseFloat(mass) || 0,
      initialVolume: parseFloat(v0) || 0,
      finalVolume: parseFloat(vf) || 0,
      netVolume: practiceNumber === 5 ? parseFloat(netBaSO4Mass) || 0 : parseFloat(netV) || 0,
      studentConcentration: practiceNumber === 12 ? parseFloat(studentFePpm) || 0 : parseFloat(calculatedN) || 0,
      studentPurityPercent: parseFloat(studentPurityPercent) || 0,
    };

    const res = evaluateStudentNotebook(data, trueConcentration, defects, practiceNumber);
    setEvaluation(res);
  };

  // Primera Derivada Numérica para P7
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

  const maxDerivativePoint = useMemo(() => {
    if (derivativeData.length === 0) return null;
    return derivativeData.reduce((max, p) => (p.dpH_dV > max.dpH_dV ? p : max), derivativeData[0]);
  }, [derivativeData]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden min-h-0">
      {/* Encabezado */}
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-400" size={18} />
          <h2 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wide">
            Libreta de Laboratorio Digital
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 border border-blue-700/50 rounded-full font-semibold">
          {practiceNumber === 12
            ? 'P12: Ley de Beer UV-Vis'
            : practiceNumber === 5
            ? 'P5: Gravimetría BaSO4'
            : practiceNumber === 7
            ? 'P7: Potenciometría HCl'
            : 'P4: Estandarización'}
        </span>
      </div>

      {/* Pestañas para P7 y P12 */}
      {(practiceNumber === 7 || practiceNumber === 12) && (
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
            <span>
              {practiceNumber === 12
                ? `Curva de Calibración (${spectroPoints.length} pts)`
                : `Curva pH & 1ra Derivada (${titrationPoints.length} pts)`}
            </span>
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
                {practiceNumber === 12
                  ? 'A = m · C(ppm) + c  ➔  C_muestra(ppm) = (A_muestra - c) / m'
                  : practiceNumber === 5
                  ? '% SO4(2-) = (m_BaSO4 [g] × 0.4116 [FG]) / m_muestra [g] × 100%'
                  : practiceNumber === 7
                  ? 'N(HCl) = (V_NaOH [mL] × N_NaOH [0.1015 N]) / V_alícuota [25.00 mL]'
                  : 'N(NaOH) = (m_KHP [g] × 1000) / (204.22 [g/eq] × ΔV [mL])'}
              </p>
            </div>

            {/* FORMULARIO P12 (ESPECTROFOTOMETRÍA) */}
            {practiceNumber === 12 ? (
              <div className="space-y-3">
                {/* Tabla de Lecturas de la Serie */}
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left font-mono text-[10px]">
                    <thead className="bg-slate-800 text-slate-300">
                      <tr>
                        <th className="p-2">Solución</th>
                        <th className="p-2">C (ppm Fe)</th>
                        <th className="p-2">Absorbancia (A)</th>
                        <th className="p-2">%T</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                      {spectroPoints.map((pt, i) => (
                        <tr key={i} className={pt.isUnknown ? 'bg-amber-950/30 text-amber-300 font-bold' : ''}>
                          <td className="p-2">{pt.isUnknown ? 'Problema' : pt.ppm === 0 ? 'Blanco' : `Std ${i}`}</td>
                          <td className="p-2">{pt.isUnknown ? '?' : `${pt.ppm.toFixed(2)}`}</td>
                          <td className="p-2 text-cyan-400 font-bold">{pt.absorbance.toFixed(3)}</td>
                          <td className="p-2 text-slate-400">{pt.transmittance ?? '--'}%</td>
                        </tr>
                      ))}
                      {spectroPoints.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-3 text-center text-slate-500 italic">
                            Aún no se han medido estándares en el espectrofotómetro.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Parámetros de la Recta de Calibración */}
                {beerRegression && (
                  <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between text-cyan-300">
                      <span>Ecuación de Beer:</span>
                      <span className="font-bold">A = {beerRegression.slope} · C + {beerRegression.intercept}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>Coeficiente R²:</span>
                      <span className="font-bold">{beerRegression.r2} {beerRegression.r2 >= 0.995 ? '✓ (Lineal)' : '⚠️'}</span>
                    </div>
                  </div>
                )}

                {/* Campo de concentración calculada */}
                <div className="p-3 bg-blue-950/30 border border-blue-800/50 rounded-xl space-y-1.5">
                  <label className="text-xs font-semibold text-blue-200">
                    Su Concentración de Fe en Muestra Problema (ppm):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={studentFePpm}
                      onChange={(e) => setStudentFePpm(e.target.value)}
                      placeholder="ej. 2.45"
                      className="w-full px-3 py-2 bg-slate-900 border border-blue-500/60 rounded-lg font-mono text-sm text-emerald-400 font-bold focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <span className="text-sm font-mono text-blue-300 font-bold">ppm Fe</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    *Despeje C_x empleando su ecuación de regresión de mínimos cuadrados.
                  </p>
                </div>
              </div>
            ) : practiceNumber === 5 ? (
              /* FORMULARIO P5 (GRAVIMETRÍA) */
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-medium">Masa Muestra Problema:</label>
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

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-medium">Factor Gravimétrico (FG):</label>
                    <input
                      type="text"
                      disabled
                      value="0.4116 (SO4/BaSO4)"
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg font-mono text-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-medium">Masa Crisol Vacío (Tara):</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.0001"
                        value={crucibleTare}
                        onChange={(e) => setCrucibleTare(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-cyan-300 focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-slate-400 font-mono">g</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-medium">Crisol + BaSO4 (Peso Cte):</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.0001"
                        value={cruciblePlusBaSO4}
                        onChange={(e) => setCruciblePlusBaSO4(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-cyan-300 focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-slate-400 font-mono">g</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] text-slate-400 font-medium">Masa Neta BaSO4 Calcinado (Δm):</label>
                    <button
                      type="button"
                      onClick={handleCalculateGravimetricDiff}
                      className="text-[10px] text-blue-400 hover:text-blue-300 underline"
                    >
                      Calcular resta
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.0001"
                      value={netBaSO4Mass}
                      onChange={(e) => setNetBaSO4Mass(e.target.value)}
                      placeholder="0.0000"
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg font-mono text-amber-300 font-bold focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-slate-400 font-mono">g</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-950/30 border border-blue-800/50 rounded-xl space-y-1.5">
                  <label className="text-xs font-semibold text-blue-200">
                    Su Porcentaje (% p/p) de SO4(2-) Calculado:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={studentPurityPercent}
                      onChange={(e) => setStudentPurityPercent(e.target.value)}
                      placeholder="ej. 28.98"
                      className="w-full px-3 py-2 bg-slate-900 border border-blue-500/60 rounded-lg font-mono text-sm text-emerald-400 font-bold focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <span className="text-sm font-mono text-blue-300 font-bold">%</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    *Exprese el resultado con al menos 2 cifras decimales rigurosas.
                  </p>
                </div>
              </div>
            ) : (
              /* FORMULARIO P4 Y P7 (VOLUMETRÍA) */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div className="col-span-1 sm:col-span-2 p-3 bg-blue-950/30 border border-blue-800/50 rounded-xl space-y-1.5">
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
              </div>
            )}

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
                    <span>3. Cifras Significativas:</span>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={onOpenAuditModal}
                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 active:scale-95 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Citas Tríada Digital</span>
                    <ExternalLink size={13} />
                  </button>

                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white border border-blue-400/50 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all"
                  >
                    <FileText size={14} />
                    <span>Descargar Informe (PDF)</span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : practiceNumber === 12 ? (
          /* PESTAÑA GRÁFICO P12: CURVA DE BEER-LAMBERT */
          <div className="space-y-4 animate-in fade-in">
            <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl space-y-1.5">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                <LineChart size={15} />
                <span>Curva de Calibración de Beer-Lambert (A vs C a 508 nm)</span>
              </span>
              <p className="text-[11px] text-slate-400">
                La recta de regresión lineal demuestra la proporcionalidad directa entre Absorbancia y Concentración según la ley A = ε · b · C.
              </p>
            </div>

            {/* Gráfico SVG de Calibración */}
            <div className="w-full h-56 bg-slate-950 p-2 rounded-xl border border-slate-800 relative flex items-center justify-center shadow-inner">
              <svg width="100%" height="100%" viewBox="0 0 340 180" className="overflow-visible">
                <defs>
                  <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Ejes (Origen en x=35, y=155. Max X: 320, Max Y: 15) */}
                <rect x="35" y="15" width="285" height="140" fill="url(#gridGrad)" stroke="#334155" strokeWidth="1" />

                {/* Líneas de cuadrícula horizontal para Absorbancia A = 0, 0.5, 1.0 */}
                <line x1="35" y1="155" x2="320" y2="155" stroke="#475569" strokeWidth="1" />
                <text x="10" y="158" fill="#94a3b8" fontSize="8" fontFamily="monospace">0.00</text>

                <line x1="35" y1="85" x2="320" y2="85" stroke="#475569" strokeWidth="0.8" strokeDasharray="3 3" />
                <text x="10" y="88" fill="#94a3b8" fontSize="8" fontFamily="monospace">0.50</text>

                <line x1="35" y1="15" x2="320" y2="15" stroke="#475569" strokeWidth="1" />
                <text x="10" y="18" fill="#94a3b8" fontSize="8" fontFamily="monospace">1.00</text>

                {/* Etiquetas eje X (0 a 5 ppm Fe) */}
                <text x="35" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">0 ppm</text>
                <text x="92" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">1 ppm</text>
                <text x="149" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">2 ppm</text>
                <text x="206" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">3 ppm</text>
                <text x="263" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">4 ppm</text>
                <text x="310" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">5 ppm</text>

                {/* Recta de Regresión Ajustada */}
                {beerRegression && (
                  <line
                    x1="35"
                    y1={155 - (beerRegression.intercept / 1.0) * 140}
                    x2="320"
                    y2={155 - ((beerRegression.slope * 5 + beerRegression.intercept) / 1.0) * 140}
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                )}

                {/* Puntos de Calibración Medidos */}
                {spectroPoints
                  .filter((p) => !p.isUnknown)
                  .map((p, idx) => {
                    const x = 35 + (p.ppm / 5.0) * 285;
                    const y = 155 - (Math.min(1.0, p.absorbance) / 1.0) * 140;
                    return (
                      <g key={idx}>
                        <circle cx={x} cy={y} r="3.5" fill="#f97316" stroke="#ffffff" strokeWidth="1" />
                      </g>
                    );
                  })}

                {/* Proyección de la Muestra Problema si fue medida */}
                {beerRegression?.unknownAbs !== null && beerRegression?.unknownAbs !== undefined && (
                  <g>
                    <line
                      x1="35"
                      y1={155 - (Math.min(1.0, beerRegression.unknownAbs) / 1.0) * 140}
                      x2={35 + ((beerRegression.interpolatedPpm ?? 2.5) / 5.0) * 285}
                      y2={155 - (Math.min(1.0, beerRegression.unknownAbs) / 1.0) * 140}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    <line
                      x1={35 + ((beerRegression.interpolatedPpm ?? 2.5) / 5.0) * 285}
                      y1={155 - (Math.min(1.0, beerRegression.unknownAbs) / 1.0) * 140}
                      x2={35 + ((beerRegression.interpolatedPpm ?? 2.5) / 5.0) * 285}
                      y2="155"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    <circle
                      cx={35 + ((beerRegression.interpolatedPpm ?? 2.5) / 5.0) * 285}
                      cy={155 - (Math.min(1.0, beerRegression.unknownAbs) / 1.0) * 140}
                      r="4.5"
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x={35 + ((beerRegression.interpolatedPpm ?? 2.5) / 5.0) * 285 + 6}
                      y={155 - (Math.min(1.0, beerRegression.unknownAbs) / 1.0) * 140 - 6}
                      fill="#f59e0b"
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      Muestra: {beerRegression.interpolatedPpm} ppm
                    </text>
                  </g>
                )}
              </svg>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1 text-[11px] font-mono">
              <div className="flex justify-between text-cyan-300">
                <span>Ecuación:</span>
                <span>A = {beerRegression?.slope ?? '0.1987'} · C + {beerRegression?.intercept ?? '0.000'}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Correlación R²:</span>
                <span>{beerRegression?.r2 ?? '0.9998'}</span>
              </div>
            </div>
          </div>
        ) : (
          /* PESTAÑA GRÁFICO P7: TITULACIÓN POTENCIOMÉTRICA */
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

            <div className="w-full h-56 bg-slate-950 p-2 rounded-xl border border-slate-800 relative flex items-center justify-center shadow-inner">
              <svg width="100%" height="100%" viewBox="0 0 340 180" className="overflow-visible">
                <defs>
                  <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                <rect x="35" y="15" width="285" height="140" fill="url(#gridGrad)" stroke="#334155" strokeWidth="1" />

                <line x1="35" y1="155" x2="320" y2="155" stroke="#475569" strokeWidth="1" />
                <text x="12" y="158" fill="#94a3b8" fontSize="8" fontFamily="monospace">pH 0</text>

                <line x1="35" y1="85" x2="320" y2="85" stroke="#475569" strokeWidth="0.8" strokeDasharray="3 3" />
                <text x="12" y="88" fill="#10b981" fontSize="8" fontFamily="monospace">pH 7</text>

                <line x1="35" y1="15" x2="320" y2="15" stroke="#475569" strokeWidth="1" />
                <text x="8" y="18" fill="#94a3b8" fontSize="8" fontFamily="monospace">pH 14</text>

                <text x="35" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">0 mL</text>
                <text x="125" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">10 mL</text>
                <text x="215" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">20 mL</text>
                <text x="305" y="168" fill="#94a3b8" fontSize="8" fontFamily="monospace">30 mL</text>

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

                {titrationPoints.map((p, idx) => {
                  const x = 35 + (Math.min(30, p.volume) / 30) * 285;
                  const y = 155 - (Math.min(14, Math.max(0, p.pH)) / 14) * 140;
                  return <circle key={idx} cx={x} cy={y} r="2" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />;
                })}

                {derivativeData.length > 1 && (
                  <path
                    d={derivativeData
                      .map((p, idx) => {
                        const x = 35 + (Math.min(30, p.volume) / 30) * 285;
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

      {/* Modal de Informe Formal Imprimible / Descargable */}
      {evaluation && (
        <LabReportModal
          isOpen={isReportModalOpen}
          practiceNumber={practiceNumber}
          data={{
            analyteName:
              practiceNumber === 12
                ? 'Hierro total con 1,10-fenantrolina'
                : practiceNumber === 5
                ? 'Sulfatos en muestra (como BaSO4)'
                : practiceNumber === 7
                ? 'Ácido Clorhídrico (HCl)'
                : 'Biftalato de Potasio',
            titrantName: practiceNumber === 12 ? 'Luz 508 nm' : practiceNumber === 5 ? 'BaCl2 5%' : 'Hidróxido de Sodio',
            sampleMass: parseFloat(mass) || 0,
            initialVolume: parseFloat(v0) || 0,
            finalVolume: parseFloat(vf) || 0,
            netVolume: practiceNumber === 5 ? parseFloat(netBaSO4Mass) || 0 : parseFloat(netV) || 0,
            studentConcentration: practiceNumber === 12 ? parseFloat(studentFePpm) || 0 : parseFloat(calculatedN) || 0,
            studentPurityPercent: parseFloat(studentPurityPercent) || 0,
          }}
          evaluation={evaluation}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
};

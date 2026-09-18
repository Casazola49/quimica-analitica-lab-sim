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
  sampleMass: number;
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
    <div className="w-full h-full flex flex-col bg-[#0a0a0a] border border-[#2b2b2b] rounded-2xl shadow-2xl overflow-hidden min-h-0 font-sans">
      {/* Encabezado Sumi-e con Sello Hanko */}
      <div className="px-4 py-3 bg-[#121212] border-b border-[#222222] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="text-[#dc2626]" size={18} />
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-serif">
            Libreta de Laboratorio
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#1f0808] text-[#ef4444] border border-[#dc2626]/70 rounded-full font-bold">
          {practiceNumber === 12
            ? 'P12: Espectrofotometría'
            : practiceNumber === 5
            ? 'P5: Gravimetría BaSO4'
            : practiceNumber === 7
            ? 'P7: Potenciometría HCl'
            : 'P4: Estandarización'}
        </span>
      </div>

      {/* Pestañas para P7 y P12 */}
      {(practiceNumber === 7 || practiceNumber === 12) && (
        <div className="flex border-b border-[#222222] bg-[#0d0d0d] px-3 pt-1.5 gap-2 text-xs shrink-0 font-mono">
          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-bold border-t border-x text-[11px] transition-all cursor-pointer ${
              activeTab === 'data'
                ? 'bg-[#171717] border-[#333333] border-t-2 border-t-[#dc2626] text-white'
                : 'border-transparent text-[#777777] hover:text-white'
            }`}
          >
            <Table size={13} />
            <span>Datos & Cálculos</span>
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-bold border-t border-x text-[11px] transition-all cursor-pointer ${
              activeTab === 'graph'
                ? 'bg-[#171717] border-[#333333] border-t-2 border-t-[#dc2626] text-white'
                : 'border-transparent text-[#777777] hover:text-white'
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

      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs text-white min-h-0">
        {activeTab === 'data' ? (
          <>
            {/* Tarjeta de Fórmula Canónica */}
            <div className="p-3.5 bg-[#121212] border-l-4 border-l-[#dc2626] border-y border-r border-[#262626] rounded-xl space-y-1 shadow">
              <div className="flex items-center gap-1.5 text-[#ef4444] font-bold uppercase tracking-wider text-[11px]">
                <Calculator size={14} />
                <span>Fórmula Estequiométrica Canónica:</span>
              </div>
              <p className="font-mono text-[11px] text-white bg-[#080808] p-2.5 rounded-lg border border-[#222222]">
                {practiceNumber === 12
                  ? 'A = m · C(ppm) + c  ➔  C_muestra(ppm) = (A_muestra - c) / m'
                  : practiceNumber === 5
                  ? '% SO4(2-) = (m_BaSO4 [g] × 0.4116 [FG]) / m_muestra [g] × 100%'
                  : practiceNumber === 7
                  ? 'N(HCl) = (V_NaOH [mL] × N_NaOH [0.1015 N]) / V_alícuota [25.00 mL]'
                  : 'N(NaOH) = (m_KHP [g] × 1000) / (204.22 [g/eq] × ΔV [mL])'}
              </p>
            </div>

            {/* FORMULARIO SEGÚN PRÁCTICA */}
            {practiceNumber === 12 ? (
              <div className="space-y-3">
                <div className="border border-[#262626] rounded-xl overflow-hidden shadow">
                  <table className="w-full text-left font-mono text-[10px]">
                    <thead className="bg-[#171717] text-[#cccccc] uppercase tracking-wider">
                      <tr>
                        <th className="p-2">Solución</th>
                        <th className="p-2">C (ppm Fe)</th>
                        <th className="p-2">Absorbancia (A)</th>
                        <th className="p-2">%T</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222222] bg-[#0d0d0d]">
                      {spectroPoints.map((pt, i) => (
                        <tr key={i} className={pt.isUnknown ? 'bg-[#2a0505] text-[#ff4444] font-bold' : ''}>
                          <td className="p-2">{pt.isUnknown ? 'Problema' : pt.ppm === 0 ? 'Blanco' : `Std ${i}`}</td>
                          <td className="p-2">{pt.isUnknown ? '?' : `${pt.ppm.toFixed(2)}`}</td>
                          <td className="p-2 text-white font-bold">{pt.absorbance.toFixed(3)}</td>
                          <td className="p-2 text-[#888888]">{pt.transmittance ?? '--'}%</td>
                        </tr>
                      ))}
                      {spectroPoints.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-3 text-center text-[#666666] italic">
                            Aún no se han medido estándares en el espectrofotómetro.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {beerRegression && (
                  <div className="p-3 bg-[#141414] border border-[#2e2e2e] rounded-xl space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between text-white">
                      <span>Ecuación de Beer:</span>
                      <span className="font-bold text-[#ef4444]">A = {beerRegression.slope} · C + {beerRegression.intercept}</span>
                    </div>
                    <div className="flex justify-between text-[#cccccc]">
                      <span>Coeficiente R²:</span>
                      <span className="font-bold text-white">{beerRegression.r2} {beerRegression.r2 >= 0.995 ? '✓ (Lineal)' : '⚠️'}</span>
                    </div>
                  </div>
                )}

                <div className="p-3.5 bg-[#170505] border border-[#dc2626]/60 rounded-xl space-y-1.5 shadow-lg">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Su Concentración de Fe en Muestra Problema (ppm):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={studentFePpm}
                      onChange={(e) => setStudentFePpm(e.target.value)}
                      placeholder="ej. 2.45"
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#dc2626] rounded-lg font-mono text-sm text-white font-bold focus:outline-none focus:ring-1 focus:ring-[#ef4444]"
                    />
                    <span className="text-sm font-mono text-[#ef4444] font-bold">ppm Fe</span>
                  </div>
                </div>
              </div>
            ) : practiceNumber === 5 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#aaaaaa] font-medium">Masa Muestra Problema:</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.0001"
                        value={mass}
                        onChange={(e) => setMass(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#333333] rounded-lg font-mono text-white focus:border-[#dc2626] focus:outline-none"
                      />
                      <span className="text-[#888888] font-mono">g</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[#aaaaaa] font-medium">Factor Gravimétrico (FG):</label>
                    <input
                      type="text"
                      disabled
                      value="0.4116 (SO4/BaSO4)"
                      className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#222222] rounded-lg font-mono text-[#777777]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[#aaaaaa] font-medium">Masa Crisol Vacío (Tara):</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.0001"
                        value={crucibleTare}
                        onChange={(e) => setCrucibleTare(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#333333] rounded-lg font-mono text-white focus:border-[#dc2626] focus:outline-none"
                      />
                      <span className="text-[#888888] font-mono">g</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[#aaaaaa] font-medium">Crisol + BaSO4 (Peso Cte):</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.0001"
                        value={cruciblePlusBaSO4}
                        onChange={(e) => setCruciblePlusBaSO4(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#333333] rounded-lg font-mono text-white focus:border-[#dc2626] focus:outline-none"
                      />
                      <span className="text-[#888888] font-mono">g</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] text-[#aaaaaa] font-medium">Masa Neta BaSO4 Calcinado (Δm):</label>
                    <button
                      type="button"
                      onClick={handleCalculateGravimetricDiff}
                      className="text-[10px] text-[#ef4444] hover:underline font-bold"
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
                      className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#333333] rounded-lg font-mono text-white font-bold focus:border-[#dc2626] focus:outline-none"
                    />
                    <span className="text-[#888888] font-mono">g</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#170505] border border-[#dc2626]/60 rounded-xl space-y-1.5 shadow-lg">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Su Porcentaje (% p/p) de SO4(2-) Calculado:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={studentPurityPercent}
                      onChange={(e) => setStudentPurityPercent(e.target.value)}
                      placeholder="ej. 28.98"
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#dc2626] rounded-lg font-mono text-sm text-white font-bold focus:outline-none focus:ring-1 focus:ring-[#ef4444]"
                    />
                    <span className="text-sm font-mono text-[#ef4444] font-bold">%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {practiceNumber === 7 ? (
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#aaaaaa] font-medium">Volumen Alícuota HCl (Pipeta):</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.01"
                        value={aliquotVolume}
                        onChange={(e) => setAliquotVolume(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#333333] rounded-lg font-mono text-white focus:border-[#dc2626] focus:outline-none"
                      />
                      <span className="text-[#888888] font-mono">mL</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#aaaaaa] font-medium">Masa KHP (Balanza Analítica):</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.0001"
                        value={mass}
                        onChange={(e) => setMass(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#333333] rounded-lg font-mono text-white focus:border-[#dc2626] focus:outline-none"
                      />
                      <span className="text-[#888888] font-mono">g</span>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] text-[#aaaaaa] font-medium">Lectura Inicial (V0 bureta):</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.01"
                      value={v0}
                      onChange={(e) => setV0(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#333333] rounded-lg font-mono text-white focus:border-[#dc2626] focus:outline-none"
                    />
                    <span className="text-[#888888] font-mono">mL</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#aaaaaa] font-medium">Lectura Final (Vf viraje):</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.01"
                      value={vf}
                      onChange={(e) => setVf(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#333333] rounded-lg font-mono text-white focus:border-[#dc2626] focus:outline-none"
                    />
                    <span className="text-[#888888] font-mono">mL</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] text-[#aaaaaa] font-medium">Volumen Neto (ΔV = Vf - V0):</label>
                    <button
                      type="button"
                      onClick={handleCalculateDiff}
                      className="text-[10px] text-[#ef4444] hover:underline font-bold"
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
                      className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#333333] rounded-lg font-mono text-white font-bold focus:border-[#dc2626] focus:outline-none"
                    />
                    <span className="text-[#888888] font-mono">mL</span>
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2 p-3.5 bg-[#170505] border border-[#dc2626]/60 rounded-xl space-y-1.5 shadow-lg">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Su Concentración de {practiceNumber === 7 ? 'HCl' : 'NaOH'} Calculada:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.0001"
                      value={calculatedN}
                      onChange={(e) => setCalculatedN(e.target.value)}
                      placeholder="ej. 0.1012"
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#dc2626] rounded-lg font-mono text-sm text-white font-bold focus:outline-none focus:ring-1 focus:ring-[#ef4444]"
                    />
                    <span className="text-sm font-mono text-[#ef4444] font-bold">N (eq/L)</span>
                  </div>
                  <p className="text-[10px] text-[#888888]">
                    *Exprese el resultado con 4 cifras significativas rigurosas.
                  </p>
                </div>
              </div>
            )}

            {/* Botón de evaluación Sumi-e */}
            <button
              onClick={handleEvaluate}
              className="w-full py-3 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-[0.99] text-white font-extrabold rounded-xl shadow-lg shadow-red-950/40 border border-[#ef4444] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Award size={16} />
              <span>Evaluar Informe y Cálculos</span>
            </button>

            {/* Resultados de la Evaluación */}
            {evaluation && (
              <div className="mt-3 p-4 bg-[#121212] border-2 border-[#dc2626] rounded-xl space-y-3 animate-in fade-in shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#2b2b2b] pb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Puntaje Formativo Obtenido:
                  </span>
                  <span
                    className={`text-base font-black font-mono px-3 py-0.5 rounded-full border-2 ${
                      evaluation.score >= 85
                        ? 'bg-[#1f0808] text-[#ef4444] border-[#dc2626]'
                        : evaluation.score >= 60
                        ? 'bg-[#171717] text-white border-[#555555]'
                        : 'bg-[#2a0505] text-[#ff4444] border-[#dc2626]'
                    }`}
                  >
                    {evaluation.score} / 100 pts
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between">
                    <span>1. Integridad de Datos Físicos:</span>
                    {evaluation.dataIntegrityPassed ? (
                      <span className="text-white font-bold flex items-center gap-1"><CheckCircle2 size={12} className="text-[#dc2626]" /> Correcto</span>
                    ) : (
                      <span className="text-[#ef4444] font-bold flex items-center gap-1"><XCircle size={12} /> Falla</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span>2. Precisión Aritmética (Fórmula):</span>
                    {evaluation.arithmeticAccuracyPassed ? (
                      <span className="text-white font-bold flex items-center gap-1"><CheckCircle2 size={12} className="text-[#dc2626]" /> Correcto</span>
                    ) : (
                      <span className="text-[#ef4444] font-bold flex items-center gap-1"><XCircle size={12} /> Error</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span>3. Cifras Significativas:</span>
                    {evaluation.significantFiguresPassed ? (
                      <span className="text-white font-bold flex items-center gap-1"><CheckCircle2 size={12} className="text-[#dc2626]" /> Válido</span>
                    ) : (
                      <span className="text-[#ef4444] font-bold flex items-center gap-1"><XCircle size={12} /> Incorrecto</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#262626]">
                    <span className="text-[#888888]">Error Relativo (% Er):</span>
                    <span className={evaluation.relativeErrorPercent <= 2 ? 'text-white font-bold' : 'text-[#ef4444] font-bold'}>
                      {evaluation.relativeErrorPercent}%
                    </span>
                  </div>
                </div>

                {evaluation.feedbackNotes.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-[#262626]">
                    <span className="text-[11px] font-bold text-[#ef4444] uppercase tracking-wider">
                      Observaciones Analíticas:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-[#cccccc]">
                      {evaluation.feedbackNotes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#262626]">
                  <button
                    onClick={onOpenAuditModal}
                    className="w-full py-2 bg-[#171717] hover:bg-[#222222] active:scale-95 text-[#e5e5e5] border border-[#333333] hover:border-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Citas Tríada Digital</span>
                    <ExternalLink size={13} />
                  </button>

                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full py-2 bg-white hover:bg-[#e5e5e5] active:scale-95 text-black font-extrabold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <FileText size={14} className="text-[#dc2626]" />
                    <span>Descargar Informe (PDF)</span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : practiceNumber === 12 ? (
          /* GRÁFICO P12: CURVA DE BEER-LAMBERT EN BLANCO, NEGRO Y ROJO */
          <div className="space-y-4 animate-in fade-in">
            <div className="p-3.5 bg-[#121212] border border-[#2b2b2b] rounded-xl space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5 text-xs font-serif uppercase tracking-wider">
                <LineChart size={15} className="text-[#dc2626]" />
                <span>Curva de Calibración de Beer-Lambert (A vs C a 508 nm)</span>
              </span>
              <p className="text-[11px] text-[#888888] font-sans">
                Ajuste lineal A = ε · b · C en tinta negra con puntos medidos en rojo cinabrio.
              </p>
            </div>

            <div className="w-full h-56 bg-[#050505] p-2 rounded-xl border border-[#222222] relative flex items-center justify-center shadow-inner">
              <svg width="100%" height="100%" viewBox="0 0 340 180" className="overflow-visible font-mono">
                <rect x="35" y="15" width="285" height="140" fill="#0a0a0a" stroke="#262626" strokeWidth="1" />

                <line x1="35" y1="155" x2="320" y2="155" stroke="#444444" strokeWidth="1" />
                <text x="10" y="158" fill="#888888" fontSize="8">0.00</text>

                <line x1="35" y1="85" x2="320" y2="85" stroke="#222222" strokeWidth="0.8" strokeDasharray="3 3" />
                <text x="10" y="88" fill="#888888" fontSize="8">0.50</text>

                <line x1="35" y1="15" x2="320" y2="15" stroke="#444444" strokeWidth="1" />
                <text x="10" y="18" fill="#888888" fontSize="8">1.00</text>

                <text x="35" y="168" fill="#888888" fontSize="8">0 ppm</text>
                <text x="92" y="168" fill="#888888" fontSize="8">1 ppm</text>
                <text x="149" y="168" fill="#888888" fontSize="8">2 ppm</text>
                <text x="206" y="168" fill="#888888" fontSize="8">3 ppm</text>
                <text x="263" y="168" fill="#888888" fontSize="8">4 ppm</text>
                <text x="310" y="168" fill="#888888" fontSize="8">5 ppm</text>

                {beerRegression && (
                  <line
                    x1="35"
                    y1={155 - (beerRegression.intercept / 1.0) * 140}
                    x2="320"
                    y2={155 - ((beerRegression.slope * 5 + beerRegression.intercept) / 1.0) * 140}
                    stroke="#ffffff"
                    strokeWidth="2.2"
                  />
                )}

                {spectroPoints
                  .filter((p) => !p.isUnknown)
                  .map((p, idx) => {
                    const x = 35 + (p.ppm / 5.0) * 285;
                    const y = 155 - (Math.min(1.0, p.absorbance) / 1.0) * 140;
                    return (
                      <g key={idx}>
                        <circle cx={x} cy={y} r="4" fill="#dc2626" stroke="#ffffff" strokeWidth="1.2" />
                      </g>
                    );
                  })}

                {beerRegression?.unknownAbs !== null && beerRegression?.unknownAbs !== undefined && (
                  <g>
                    <line
                      x1="35"
                      y1={155 - (Math.min(1.0, beerRegression.unknownAbs) / 1.0) * 140}
                      x2={35 + ((beerRegression.interpolatedPpm ?? 2.5) / 5.0) * 285}
                      y2={155 - (Math.min(1.0, beerRegression.unknownAbs) / 1.0) * 140}
                      stroke="#dc2626"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    <line
                      x1={35 + ((beerRegression.interpolatedPpm ?? 2.5) / 5.0) * 285}
                      y1={155 - (Math.min(1.0, beerRegression.unknownAbs) / 1.0) * 140}
                      x2={35 + ((beerRegression.interpolatedPpm ?? 2.5) / 5.0) * 285}
                      y2="155"
                      stroke="#dc2626"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    <circle
                      cx={35 + ((beerRegression.interpolatedPpm ?? 2.5) / 5.0) * 285}
                      cy={155 - (Math.min(1.0, beerRegression.unknownAbs) / 1.0) * 140}
                      r="5"
                      fill="#ffffff"
                      stroke="#dc2626"
                      strokeWidth="2"
                    />
                    <text
                      x={35 + ((beerRegression.interpolatedPpm ?? 2.5) / 5.0) * 285 + 6}
                      y={155 - (Math.min(1.0, beerRegression.unknownAbs) / 1.0) * 140 - 6}
                      fill="#dc2626"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      Muestra: {beerRegression.interpolatedPpm} ppm
                    </text>
                  </g>
                )}
              </svg>
            </div>

            <div className="p-3 bg-[#121212] border border-[#2b2b2b] rounded-xl space-y-1 text-[11px] font-mono">
              <div className="flex justify-between text-white">
                <span>Ecuación:</span>
                <span className="font-bold text-[#ef4444]">A = {beerRegression?.slope ?? '0.1987'} · C + {beerRegression?.intercept ?? '0.000'}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Correlación R²:</span>
                <span className="font-bold text-white">{beerRegression?.r2 ?? '0.9998'}</span>
              </div>
            </div>
          </div>
        ) : (
          /* GRÁFICO P7: TITULACIÓN POTENCIOMÉTRICA */
          <div className="space-y-4 animate-in fade-in">
            <div className="p-3.5 bg-[#121212] border border-[#2b2b2b] rounded-xl space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5 text-xs font-serif uppercase tracking-wider">
                <LineChart size={15} className="text-[#dc2626]" />
                <span>Curva Potenciométrica en Tiempo Real (pH vs V_NaOH)</span>
              </span>
              <p className="text-[11px] text-[#888888] font-sans">
                Curva en blanco nítido y primera derivada numérica (ΔpH/ΔV) en rojo cinabrio.
              </p>
            </div>

            <div className="w-full h-56 bg-[#050505] p-2 rounded-xl border border-[#222222] relative flex items-center justify-center shadow-inner">
              <svg width="100%" height="100%" viewBox="0 0 340 180" className="overflow-visible font-mono">
                <rect x="35" y="15" width="285" height="140" fill="#0a0a0a" stroke="#262626" strokeWidth="1" />

                <line x1="35" y1="155" x2="320" y2="155" stroke="#444444" strokeWidth="1" />
                <text x="12" y="158" fill="#888888" fontSize="8">pH 0</text>

                <line x1="35" y1="85" x2="320" y2="85" stroke="#222222" strokeWidth="0.8" strokeDasharray="3 3" />
                <text x="12" y="88" fill="#ffffff" fontSize="8">pH 7</text>

                <line x1="35" y1="15" x2="320" y2="15" stroke="#444444" strokeWidth="1" />
                <text x="8" y="18" fill="#888888" fontSize="8">pH 14</text>

                <text x="35" y="168" fill="#888888" fontSize="8">0 mL</text>
                <text x="125" y="168" fill="#888888" fontSize="8">10 mL</text>
                <text x="215" y="168" fill="#888888" fontSize="8">20 mL</text>
                <text x="305" y="168" fill="#888888" fontSize="8">30 mL</text>

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
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}

                {titrationPoints.map((p, idx) => {
                  const x = 35 + (Math.min(30, p.volume) / 30) * 285;
                  const y = 155 - (Math.min(14, Math.max(0, p.pH)) / 14) * 140;
                  return <circle key={idx} cx={x} cy={y} r="2" fill="#ffffff" stroke="#dc2626" strokeWidth="1" />;
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
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeDasharray="3 1.5"
                  />
                )}

                {maxDerivativePoint && maxDerivativePoint.dpH_dV > 4 && (
                  <g>
                    <line
                      x1={35 + (maxDerivativePoint.volume / 30) * 285}
                      y1="15"
                      x2={35 + (maxDerivativePoint.volume / 30) * 285}
                      y2="155"
                      stroke="#dc2626"
                      strokeWidth="1.8"
                      strokeDasharray="4 2"
                    />
                    <text
                      x={35 + (maxDerivativePoint.volume / 30) * 285 - 18}
                      y="28"
                      fill="#dc2626"
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

            <div className="p-3 bg-[#121212] border border-[#2b2b2b] rounded-xl space-y-1 text-[11px] font-mono">
              <div className="flex justify-between text-white">
                <span>Lectura actual:</span>
                <span className="font-bold">V = {currentDeliveredMl.toFixed(2)} mL | pH = {currentPH.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#ef4444]">
                <span>Pico 1ra derivada (Veq):</span>
                <span className="font-bold">{maxDerivativePoint ? `${maxDerivativePoint.volume} mL (ΔpH/ΔV = ${maxDerivativePoint.dpH_dV})` : 'Pendiente...'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Informe Formal */}
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

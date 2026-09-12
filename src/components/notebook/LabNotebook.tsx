import React, { useState } from 'react';
import { BookOpen, Calculator, Award, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { EvaluationResult, LabNotebookData, TechniqueDefect } from '../../types';
import { evaluateStudentNotebook } from '../../engine/evaluator';

interface LabNotebookProps {
  initialVolume: number;
  finalVolume: number;
  sampleMass: number;
  trueNormality: number;
  defects: TechniqueDefect[];
  onOpenAuditModal: () => void;
}

export const LabNotebook: React.FC<LabNotebookProps> = ({
  initialVolume,
  finalVolume,
  sampleMass,
  trueNormality,
  defects,
  onOpenAuditModal,
}) => {
  const [v0, setV0] = useState<string>(initialVolume.toFixed(2));
  const [vf, setVf] = useState<string>(finalVolume.toFixed(2));
  const [netV, setNetV] = useState<string>('');
  const [mass, setMass] = useState<string>(sampleMass.toFixed(4));
  const [calculatedN, setCalculatedN] = useState<string>('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // Sincronizar si la lupa transfirió valores
  React.useEffect(() => {
    setV0(initialVolume.toFixed(2));
  }, [initialVolume]);

  React.useEffect(() => {
    setVf(finalVolume.toFixed(2));
  }, [finalVolume]);

  const handleCalculateDiff = () => {
    const num0 = parseFloat(v0) || 0;
    const numF = parseFloat(vf) || 0;
    const diff = Math.max(0, numF - num0);
    setNetV(diff.toFixed(2));
  };

  const handleEvaluate = () => {
    const data: LabNotebookData = {
      analyteName: 'Biftalato de Potasio',
      titrantName: 'Hidróxido de Sodio',
      sampleMass: parseFloat(mass) || 0,
      initialVolume: parseFloat(v0) || 0,
      finalVolume: parseFloat(vf) || 0,
      netVolume: parseFloat(netV) || 0,
      studentConcentration: parseFloat(calculatedN) || 0,
    };

    const res = evaluateStudentNotebook(data, trueNormality, defects);
    setEvaluation(res);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
      {/* Encabezado de la Libreta */}
      <div className="px-5 py-3.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-400" size={18} />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Libreta de Laboratorio Digital
          </h2>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-0.5 bg-blue-900/50 text-blue-300 border border-blue-700/50 rounded-full">
          Práctica 4: Estandarización
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-200">
        {/* Tarjeta de Fórmula Canónica */}
        <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
            <Calculator size={14} />
            <span>Fórmula Estequiométrica:</span>
          </div>
          <p className="font-mono text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            N(NaOH) = (m_KHP [g] × 1000) / (204.22 [g/eq] × ΔV [mL])
          </p>
        </div>

        {/* Formulario de Registro Experimental */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Masa pesada */}
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
            Su Concentración de NaOH Calculada:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.0001"
              value={calculatedN}
              onChange={(e) => setCalculatedN(e.target.value)}
              placeholder="ej. 0.1024"
              className="w-full px-3 py-2 bg-slate-900 border border-blue-500/60 rounded-lg font-mono text-sm text-emerald-400 font-bold focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <span className="text-sm font-mono text-blue-300 font-bold">N (eq/L)</span>
          </div>
          <p className="text-[10px] text-slate-400">
            *Recuerde expresar el resultado con 4 cifras significativas rigurosas.
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

        {/* Resultados de la Evaluación (Pipeline en 3 Etapas) */}
        {evaluation && (
          <div className="mt-4 p-4 bg-slate-800 border border-slate-700 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="text-xs font-bold text-slate-200">Puntaje Formativo Obtenido:</span>
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

            {/* Checklist de etapas */}
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span>1. Integridad de Datos Físicos:</span>
                {evaluation.dataIntegrityPassed ? (
                  <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Correcto</span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1"><XCircle size={12} /> Fallas detectadas</span>
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

            {/* Notas y Retroalimentación */}
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

            {/* Botón para ver citas de la Tríada Digital */}
            <button
              onClick={onOpenAuditModal}
              className="w-full mt-2 py-2 bg-slate-700 hover:bg-slate-600 active:scale-95 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Ver Citas de la Tríada Digital (Skoog / Day & Underwood)</span>
              <ExternalLink size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useRef } from 'react';
import { X, Printer, CheckCircle2, FileText } from 'lucide-react';
import { EvaluationResult, LabNotebookData } from '../../types';
import { PEDAGOGICAL_CITATIONS } from '../../data/pedagogicalCitations';

interface LabReportModalProps {
  isOpen: boolean;
  practiceNumber: number;
  data: LabNotebookData;
  evaluation: EvaluationResult;
  onClose: () => void;
}

export const LabReportModal: React.FC<LabReportModalProps> = ({
  isOpen,
  practiceNumber,
  data,
  evaluation,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const practiceTitle =
    practiceNumber === 12
      ? 'Práctica 12: Colorimetría y Espectrofotometría UV-Vis (Ley de Beer)'
      : practiceNumber === 5
      ? 'Práctica 5: Determinación Gravimétrica de Sulfatos (BaSO4)'
      : practiceNumber === 7
      ? 'Práctica 7: Titulación Potenciométrica de HCl con NaOH estándar'
      : 'Práctica 4: Estandarización de NaOH 0.1 N con Biftalato de Potasio';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Barra superior de herramientas */}
        <div className="p-3.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="text-cyan-400" size={20} />
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Informe Oficial de Laboratorio (Vista Previa de Impresión)
              </h3>
              <p className="text-[11px] text-slate-400">
                Documento formal académico con datos, estequiometría, evaluación y firmas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow transition-all"
            >
              <Printer size={15} />
              <span>Imprimir / Guardar como PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CUERPO DEL INFORME (DISEÑADO EN FORMATO HOJA FORMAL) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/70 flex justify-center">
          <div
            ref={printRef}
            id="printable-lab-report"
            className="w-full max-w-3xl bg-white text-slate-900 p-8 rounded-xl shadow-xl space-y-6 font-sans border border-slate-200"
          >
            {/* Encabezado Institucional */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <h1 className="text-xs font-bold tracking-widest text-slate-700 uppercase">
                Universidad Mayor de San Simón • Facultad de Ciencias y Tecnología
              </h1>
              <h2 className="text-sm font-black tracking-wider text-slate-900 uppercase">
                Departamento de Química • Licenciatura en Ingeniería Química
              </h2>
              <p className="text-[11px] font-semibold text-slate-600">
                Laboratorio de Química Analítica Cuantitativa (SISS: 2004061) — 5to Semestre
              </p>
              <div className="pt-2">
                <h3 className="text-base font-extrabold text-blue-900 tracking-tight">
                  {practiceTitle}
                </h3>
              </div>
            </div>

            {/* Metadatos del Estudiante y Sesión */}
            <div className="grid grid-cols-2 gap-4 text-xs p-3 bg-slate-50 border border-slate-300 rounded-lg">
              <div>
                <span className="font-bold text-slate-700">Grupo / Equipo:</span>{' '}
                <span className="font-semibold text-slate-900">Alquímica-33</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-700">Fecha de Emisión:</span>{' '}
                <span className="text-slate-800">{currentDate}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Analito Evaluado:</span>{' '}
                <span className="text-slate-800">{data.analyteName}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-700">Reactivo Titulante / Medio:</span>{' '}
                <span className="text-slate-800">{data.titrantName}</span>
              </div>
            </div>

            {/* 1. Registro Experimental de Datos */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 flex items-center gap-1.5">
                <span>1. Registro Metrológico y Datos Experimentales</span>
              </h4>

              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead className="bg-slate-100 font-bold text-slate-800">
                  <tr>
                    <th className="border border-slate-300 p-2">Parámetro Medido</th>
                    <th className="border border-slate-300 p-2">Valor Registrado</th>
                    <th className="border border-slate-300 p-2">Unidad</th>
                    <th className="border border-slate-300 p-2">Instrumento Empleado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono text-xs">
                  {practiceNumber === 5 ? (
                    <>
                      <tr>
                        <td className="border border-slate-300 p-2 font-sans">Masa Muestra de Sulfatos</td>
                        <td className="border border-slate-300 p-2 font-bold">{data.sampleMass.toFixed(4)}</td>
                        <td className="border border-slate-300 p-2">g</td>
                        <td className="border border-slate-300 p-2 font-sans">Balanza Analítica (0.1 mg)</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-sans">Masa Neta BaSO4 Calcinado</td>
                        <td className="border border-slate-300 p-2 font-bold">{data.netVolume.toFixed(4)}</td>
                        <td className="border border-slate-300 p-2">g</td>
                        <td className="border border-slate-300 p-2 font-sans">Crisol calcinado en mufla 800 °C</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-sans">Factor Gravimétrico (FG)</td>
                        <td className="border border-slate-300 p-2 font-bold">0.4116</td>
                        <td className="border border-slate-300 p-2">adimensional</td>
                        <td className="border border-slate-300 p-2 font-sans">SO4 / BaSO4 (96.06 / 233.39)</td>
                      </tr>
                    </>
                  ) : practiceNumber === 12 ? (
                    <>
                      <tr>
                        <td className="border border-slate-300 p-2 font-sans">Longitud de Onda de Trabajo (λ)</td>
                        <td className="border border-slate-300 p-2 font-bold">508</td>
                        <td className="border border-slate-300 p-2">nm</td>
                        <td className="border border-slate-300 p-2 font-sans">Monocromador UV-Vis</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-sans">Camino de Paso Óptico (b)</td>
                        <td className="border border-slate-300 p-2 font-bold">1.00</td>
                        <td className="border border-slate-300 p-2">cm</td>
                        <td className="border border-slate-300 p-2 font-sans">Cubeta de vidrio óptico</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-sans">Absortividad Molar (ε)</td>
                        <td className="border border-slate-300 p-2 font-bold">1.11 × 10⁴</td>
                        <td className="border border-slate-300 p-2">L / (mol·cm)</td>
                        <td className="border border-slate-300 p-2 font-sans">[Fe(phen)3]²⁺ a pH 4.5</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <td className="border border-slate-300 p-2 font-sans">
                          {practiceNumber === 7 ? 'Alícuota de HCl tomada' : 'Masa Patrón KHP pesada'}
                        </td>
                        <td className="border border-slate-300 p-2 font-bold">
                          {practiceNumber === 7 ? '25.00' : data.sampleMass.toFixed(4)}
                        </td>
                        <td className="border border-slate-300 p-2">{practiceNumber === 7 ? 'mL' : 'g'}</td>
                        <td className="border border-slate-300 p-2 font-sans">
                          {practiceNumber === 7 ? 'Pipeta aforada Clase A' : 'Balanza Analítica (0.1 mg)'}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-sans">Cota Inicial de Bureta (V0)</td>
                        <td className="border border-slate-300 p-2 font-bold">{data.initialVolume.toFixed(2)}</td>
                        <td className="border border-slate-300 p-2">mL</td>
                        <td className="border border-slate-300 p-2 font-sans">Bureta 50 mL Clase A</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-sans">Cota Final de Viraje (Vf)</td>
                        <td className="border border-slate-300 p-2 font-bold">{data.finalVolume.toFixed(2)}</td>
                        <td className="border border-slate-300 p-2">mL</td>
                        <td className="border border-slate-300 p-2 font-sans">Bureta 50 mL Clase A</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-sans">Gasto Neto de Titulante (ΔV)</td>
                        <td className="border border-slate-300 p-2 font-bold">{data.netVolume.toFixed(2)}</td>
                        <td className="border border-slate-300 p-2">mL</td>
                        <td className="border border-slate-300 p-2 font-sans">Diferencia Vf - V0</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* 2. Cálculos Estequiométricos y Resultados */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                2. Evaluación Estequiométrica y Desempeño Analítico
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 block font-semibold">VALOR OBTENIDO</span>
                  <span className="text-sm font-bold font-mono text-blue-900">
                    {practiceNumber === 5
                      ? `${(data.studentPurityPercent || 0).toFixed(2)} % SO4`
                      : practiceNumber === 12
                      ? `${data.studentConcentration.toFixed(2)} ppm Fe`
                      : `${data.studentConcentration.toFixed(4)} N`}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 block font-semibold">VALOR VERDADERO</span>
                  <span className="text-sm font-bold font-mono text-slate-700">
                    {practiceNumber === 5
                      ? `${evaluation.trueConcentration.toFixed(2)} %`
                      : practiceNumber === 12
                      ? `${evaluation.trueConcentration.toFixed(2)} ppm`
                      : `${evaluation.trueConcentration.toFixed(4)} N`}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 block font-semibold">ERROR RELATIVO (% Er)</span>
                  <span
                    className={`text-sm font-bold font-mono ${
                      evaluation.relativeErrorPercent <= 2 ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {evaluation.relativeErrorPercent}%
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 block font-semibold">CALIFICACIÓN FINAL</span>
                  <span
                    className={`text-sm font-extrabold font-mono ${
                      evaluation.score >= 85
                        ? 'text-emerald-700'
                        : evaluation.score >= 60
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {evaluation.score} / 100
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Dictamen de Auditoría de Técnica Analítica (TDA) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                3. Dictamen de Auditoría de Técnica Analítica (TDA) y Citas de la Tríada Digital
              </h4>

              {evaluation.defectsRecorded.length === 0 ? (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>
                    <strong>Técnica Experimental Conforme:</strong> El operador no incurrió en defectos sistemáticos de mesada. El enrase, la purga, el lavado y las mediciones cumplen con los estándares de buenas prácticas de laboratorio cuantitativo.
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  {evaluation.defectsRecorded.map((defect, idx) => {
                    const citation = PEDAGOGICAL_CITATIONS[defect.citationId];
                    return (
                      <div key={idx} className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between text-amber-900 font-bold">
                          <span>• {defect.type}: {citation?.chapterTitle}</span>
                          <span className="text-[10px] font-mono text-amber-800">
                            {citation?.book} — Pág. {citation?.pagePhysical}
                          </span>
                        </div>
                        <p className="text-slate-700 italic font-serif text-[11px]">
                          "{citation?.exactQuote}"
                        </p>
                        <p className="text-[10px] text-slate-600">
                          <strong>Impacto en el error:</strong> {citation?.pedagogicalImpact}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Bloque de Firmas Manuscritas */}
            <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-12 text-center text-xs">
              <div className="space-y-8">
                <div className="h-10" />
                <div className="border-t border-slate-800 pt-1 font-bold text-slate-900">
                  Firma del Estudiante Evaluado
                  <span className="block text-[10px] font-normal text-slate-600">
                    Equipo de Trabajo: Alquímica-33
                  </span>
                </div>
              </div>

              <div className="space-y-8">
                <div className="h-10" />
                <div className="border-t border-slate-800 pt-1 font-bold text-slate-900">
                  V°B° Ayudante de Laboratorio / Docente
                  <span className="block text-[10px] font-normal text-slate-600">
                    Departamento de Química — UMSS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie no imprimible */}
        <div className="p-3 bg-slate-800 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400 no-print shrink-0">
          <span>
            Documento generado localmente en el navegador • Conforme a la Norma ISO/IEC 17025
          </span>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
          >
            <Printer size={14} />
            <span>Imprimir Informe</span>
          </button>
        </div>
      </div>
    </div>
  );
};

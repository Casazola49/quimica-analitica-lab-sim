import React, { useState } from 'react';
import { Sparkles, Eye, CheckCircle2, RefreshCw, Layers } from 'lucide-react';
import { TechniqueDefectType } from '../../types';

export interface SpectroStandard {
  id: string;
  label: string;
  concentrationPpm: number;
  colorRgba: string;
  isUnknown?: boolean;
}

interface SpectrophotometryBenchProps {
  unknownTruePpm: number; // e.g. 2.45 ppm
  onRecordDefect: (type: TechniqueDefectType, citationId: string) => void;
  onRecordMeasurement: (data: { ppm: number; absorbance: number; transmittance: number; isUnknown?: boolean }) => void;
}

export const SpectrophotometryBench: React.FC<SpectrophotometryBenchProps> = ({
  unknownTruePpm,
  onRecordDefect,
  onRecordMeasurement,
}) => {
  // Configuración del Espectrofotómetro
  const [wavelength, setWavelength] = useState<number>(508); // nm (Óptimo = 508 nm para Fe-phen)
  const [isZeroedWithBlank, setIsZeroedWithBlank] = useState<boolean>(false);
  const [isCuvetteWiped, setIsCuvetteWiped] = useState<boolean>(false);
  const [selectedStandardIndex, setSelectedStandardIndex] = useState<number>(0);

  // Lectura actual en display
  const [currentAbsorbance, setCurrentAbsorbance] = useState<number | null>(null);
  const [measuredList, setMeasuredList] = useState<Set<number>>(new Set());

  // Serie de calibración oficial de 0 a 5 ppm de Fe según protocolo UMSS
  // Pendiente de Beer teórica: m ≈ 0.1987 ppm^-1 a 508 nm
  const standards: SpectroStandard[] = [
    { id: 'std_0', label: 'Blanco (0.00 ppm Fe)', concentrationPpm: 0.0, colorRgba: 'rgba(235, 245, 255, 0.25)' },
    { id: 'std_1', label: 'Patrón 1 (1.00 ppm)', concentrationPpm: 1.0, colorRgba: 'rgba(251, 146, 60, 0.35)' },
    { id: 'std_2', label: 'Patrón 2 (2.00 ppm)', concentrationPpm: 2.0, colorRgba: 'rgba(249, 115, 22, 0.55)' },
    { id: 'std_3', label: 'Patrón 3 (3.00 ppm)', concentrationPpm: 3.0, colorRgba: 'rgba(234, 88, 12, 0.75)' },
    { id: 'std_4', label: 'Patrón 4 (4.00 ppm)', concentrationPpm: 4.0, colorRgba: 'rgba(194, 65, 12, 0.88)' },
    { id: 'std_5', label: 'Patrón 5 (5.00 ppm)', concentrationPpm: 5.0, colorRgba: 'rgba(154, 52, 18, 0.95)' },
    { id: 'std_unk', label: 'Muestra Problema (?)', concentrationPpm: unknownTruePpm, colorRgba: 'rgba(249, 115, 22, 0.65)', isUnknown: true },
  ];

  const currentStandard = standards[selectedStandardIndex];

  // Cálculo físico de absorbancia de la Ley de Beer
  const calculateAbsorbance = (ppm: number, lambda: number, zeroed: boolean, wiped: boolean): number => {
    // Factor de atenuación por longitud de onda (Campana gaussiana centrada en 508 nm con FWHM ~ 40 nm)
    const lambdaOffset = Math.abs(lambda - 508);
    const wavelengthFactor = Math.exp(-Math.pow(lambdaOffset / 28, 2));

    const nominalSlope = 0.1987;
    let A = ppm * nominalSlope * wavelengthFactor;

    // Error sistemático si no se calibró con blanco (offset constante espurio)
    if (!zeroed && ppm > 0) {
      A += 0.048;
    }

    // Error si la cubeta tiene huellas dactilares
    if (!wiped) {
      A += 0.065;
    }

    // Ruido electrónico instrumental (±0.002)
    A += (Math.random() - 0.5) * 0.003;

    return Number(Math.max(0, A).toFixed(3));
  };

  const handleZeroBlank = () => {
    if (wavelength !== 508) {
      onRecordDefect('DEFECT_WRONG_WAVELENGTH', 'CITE_NO_BLANK_ZERO');
    }
    setIsZeroedWithBlank(true);
    setCurrentAbsorbance(0.0);
  };

  const handleMeasure = () => {
    // Validar técnica
    if (!isCuvetteWiped) {
      onRecordDefect('DEFECT_FINGERPRINTS_ON_CUVETTE', 'CITE_FINGERPRINTS_ON_CUVETTE');
    }
    if (!isZeroedWithBlank && currentStandard.concentrationPpm > 0) {
      onRecordDefect('DEFECT_NO_BLANK_ZERO', 'CITE_NO_BLANK_ZERO');
    }
    if (Math.abs(wavelength - 508) >= 5) {
      onRecordDefect('DEFECT_WRONG_WAVELENGTH', 'CITE_NO_BLANK_ZERO');
    }

    const A = calculateAbsorbance(
      currentStandard.concentrationPpm,
      wavelength,
      isZeroedWithBlank,
      isCuvetteWiped
    );

    setCurrentAbsorbance(A);

    const T = Number((Math.pow(10, -A) * 100).toFixed(1));

    // Registrar en libreta
    onRecordMeasurement({
      ppm: currentStandard.concentrationPpm,
      absorbance: A,
      transmittance: T,
      isUnknown: currentStandard.isUnknown,
    });

    setMeasuredList((prev) => new Set(prev).add(selectedStandardIndex));
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-4 lab-bench-bg rounded-2xl border border-slate-700/80 shadow-2xl relative overflow-y-auto min-h-0 text-slate-100">
      {/* Encabezado Instrumental */}
      <div className="w-full bg-slate-900/90 border border-slate-700 px-3 py-2 rounded-xl flex items-center justify-between gap-2 text-xs shrink-0 shadow">
        <div className="flex items-center gap-2">
          <Sparkles className="text-cyan-400" size={16} />
          <span className="font-bold text-slate-200">
            Espectrofotómetro UV-Visible Digital (Genesys / Shimadzu)
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-900/50 text-blue-300 border border-blue-700/50 rounded-full font-semibold">
          Práctica 12: Ley de Beer
        </span>
      </div>

      {/* ÁREA CENTRAL: CONSOLA INSTRUMENTAL 2D */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-2 relative min-h-0 space-y-4">
        {/* Consola del Espectrofotómetro */}
        <div className="w-full max-w-lg bg-slate-900/90 border-2 border-slate-700 rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row items-center gap-5">
          {/* Pantalla LCD de la consola */}
          <div className="flex-1 w-full bg-slate-950 p-3.5 rounded-xl border-2 border-cyan-500/40 shadow-inner flex flex-col justify-between space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400/80 border-b border-slate-800 pb-1">
              <span>UV-VIS SPECTROPHOTOMETER</span>
              <span className={isZeroedWithBlank ? 'text-emerald-400' : 'text-amber-400'}>
                {isZeroedWithBlank ? '● ZERO CALIBRATED' : '○ UNCALIBRATED'}
              </span>
            </div>

            {/* Lectura de Absorbancia y %T */}
            <div className="flex items-baseline justify-between font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">ABSORBANCIA (A)</span>
                <span className="text-3xl font-extrabold text-cyan-300 tracking-wider">
                  {currentAbsorbance !== null ? currentAbsorbance.toFixed(3) : '---'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">TRANSMITANCIA (%T)</span>
                <span className="text-lg font-bold text-emerald-400">
                  {currentAbsorbance !== null
                    ? `${(Math.pow(10, -currentAbsorbance) * 100).toFixed(1)}%`
                    : '---'}
                </span>
              </div>
            </div>

            {/* Selector de Longitud de Onda λ */}
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-xs">
              <span className="text-[11px] text-slate-400 font-medium">Longitud de Onda (λ):</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setWavelength((prev) => Math.max(400, prev - 10))}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[10px]"
                >
                  -10
                </button>
                <button
                  onClick={() => setWavelength((prev) => Math.max(400, prev - 1))}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[10px]"
                >
                  -1
                </button>
                <span
                  className={`font-mono font-extrabold px-2 py-0.5 rounded text-xs ${
                    wavelength === 508 ? 'text-amber-300 bg-amber-950/60 border border-amber-500/40' : 'text-slate-300 bg-slate-800'
                  }`}
                >
                  {wavelength} nm
                </span>
                <button
                  onClick={() => setWavelength((prev) => Math.min(700, prev + 1))}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[10px]"
                >
                  +1
                </button>
                <button
                  onClick={() => setWavelength((prev) => Math.min(700, prev + 10))}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[10px]"
                >
                  +10
                </button>
              </div>
            </div>
          </div>

          {/* Compartimento de Cubeta Óptica (SVG 2D) */}
          <div className="flex flex-col items-center space-y-2 shrink-0">
            <div className="relative w-28 h-36 bg-slate-950 border-2 border-slate-700 rounded-xl flex items-center justify-center p-2 shadow-inner">
              {/* Haz de luz monocromático verde/azul cruzando la cubeta */}
              <line x1="0" y1="65" x2="112" y2="65" stroke="#38bdf8" strokeWidth="3" strokeDasharray="3 2" className="animate-pulse" />

              {/* Cubeta de vidrio de 1.00 cm con líquido coloreado */}
              <div className="relative w-12 h-28 bg-blue-100/10 border-2 border-slate-400/70 rounded-sm flex flex-col justify-end overflow-hidden shadow">
                {/* Menisco y columna de líquido con la absorción del estándar activo */}
                <div
                  className="w-full h-24 transition-colors duration-300"
                  style={{ backgroundColor: currentStandard.colorRgba }}
                />
                {/* Caras transparentes de la cubeta */}
                <div className="absolute inset-0 border-x border-cyan-400/30" />
                {/* Huella dactilar si no se limpió */}
                {!isCuvetteWiped && (
                  <div className="absolute top-8 left-2 w-4 h-6 border border-dashed border-amber-400/60 rounded-full opacity-60 pointer-events-none" title="Huella dactilar grasa" />
                )}
              </div>
            </div>

            {/* Botón de Limpiar caras ópticas */}
            <button
              onClick={() => setIsCuvetteWiped(true)}
              className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                isCuvetteWiped
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-amber-600/30 hover:bg-amber-600/50 border-amber-500 text-amber-200 animate-pulse'
              }`}
            >
              {isCuvetteWiped ? '✓ Caras ópticas limpias' : 'Limpiar con papel para lentes'}
            </button>
          </div>
        </div>

        {/* Controles de Acción Instrumental */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full max-w-lg">
          {selectedStandardIndex === 0 && (
            <button
              onClick={handleZeroBlank}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={14} />
              <span>Calibrar Blanco (Auto-Zero ➔ A = 0.000)</span>
            </button>
          )}

          <button
            onClick={handleMeasure}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
          >
            <Eye size={15} />
            <span>Medir {currentStandard.label}</span>
          </button>
        </div>
      </div>

      {/* GRADILLA DE MATRACES AFORADOS (SERIE DE CALIBRACIÓN DE FE) */}
      <div className="w-full bg-slate-900/90 border border-slate-700/80 p-2.5 rounded-xl shrink-0 space-y-1.5 shadow-lg">
        <div className="flex justify-between items-center text-xs px-1">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Layers size={13} className="text-blue-400" />
            Serie de Matraces Aforados de 50 mL (Seleccione para cargar en cubeta):
          </span>
          <span className="text-[10px] text-cyan-300 font-mono">
            {measuredList.size} / 7 medidos
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
          {standards.map((std, idx) => {
            const isSelected = selectedStandardIndex === idx;
            const isDone = measuredList.has(idx);

            return (
              <button
                key={std.id}
                onClick={() => {
                  setSelectedStandardIndex(idx);
                  setCurrentAbsorbance(null);
                  setIsCuvetteWiped(false);
                }}
                className={`p-2 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/70 border-blue-500 shadow-md ring-1 ring-blue-400'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-inner"
                    style={{ backgroundColor: std.colorRgba }}
                  />
                  {isDone && <CheckCircle2 size={13} className="text-emerald-400" />}
                </div>

                <span className="font-bold text-[11px] text-slate-200 block truncate">
                  {std.isUnknown ? 'Problema' : `${std.concentrationPpm.toFixed(1)} ppm`}
                </span>
                <span className="text-[9px] text-slate-400 block truncate">
                  {std.isUnknown ? 'Desconocido' : idx === 0 ? 'Blanco' : `Std ${idx}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

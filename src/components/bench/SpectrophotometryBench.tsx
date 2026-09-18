import React, { useState } from 'react';
import { Eye, CheckCircle2, RefreshCw, Layers } from 'lucide-react';
import { TechniqueDefectType } from '../../types';
import { HankoSeal } from '../common/HankoSeal';

export interface SpectroStandard {
  id: string;
  label: string;
  concentrationPpm: number;
  colorRgba: string;
  isUnknown?: boolean;
}

interface SpectrophotometryBenchProps {
  unknownTruePpm: number;
  onRecordDefect: (type: TechniqueDefectType, citationId: string) => void;
  onRecordMeasurement: (data: { ppm: number; absorbance: number; transmittance: number; isUnknown?: boolean }) => void;
}

export const SpectrophotometryBench: React.FC<SpectrophotometryBenchProps> = ({
  unknownTruePpm,
  onRecordDefect,
  onRecordMeasurement,
}) => {
  const [wavelength, setWavelength] = useState<number>(508);
  const [isZeroedWithBlank, setIsZeroedWithBlank] = useState<boolean>(false);
  const [isCuvetteWiped, setIsCuvetteWiped] = useState<boolean>(false);
  const [selectedStandardIndex, setSelectedStandardIndex] = useState<number>(0);

  const [currentAbsorbance, setCurrentAbsorbance] = useState<number | null>(null);
  const [measuredList, setMeasuredList] = useState<Set<number>>(new Set());

  const standards: SpectroStandard[] = [
    { id: 'std_0', label: 'Blanco (0.00 ppm Fe)', concentrationPpm: 0.0, colorRgba: 'rgba(255, 255, 255, 0.12)' },
    { id: 'std_1', label: 'Patrón 1 (1.00 ppm)', concentrationPpm: 1.0, colorRgba: 'rgba(239, 68, 68, 0.35)' },
    { id: 'std_2', label: 'Patrón 2 (2.00 ppm)', concentrationPpm: 2.0, colorRgba: 'rgba(220, 38, 38, 0.55)' },
    { id: 'std_3', label: 'Patrón 3 (3.00 ppm)', concentrationPpm: 3.0, colorRgba: 'rgba(185, 28, 28, 0.75)' },
    { id: 'std_4', label: 'Patrón 4 (4.00 ppm)', concentrationPpm: 4.0, colorRgba: 'rgba(153, 27, 27, 0.88)' },
    { id: 'std_5', label: 'Patrón 5 (5.00 ppm)', concentrationPpm: 5.0, colorRgba: 'rgba(127, 29, 29, 0.98)' },
    { id: 'std_unk', label: 'Muestra Problema (?)', concentrationPpm: unknownTruePpm, colorRgba: 'rgba(220, 38, 38, 0.65)', isUnknown: true },
  ];

  const currentStandard = standards[selectedStandardIndex];

  const calculateAbsorbance = (ppm: number, lambda: number, zeroed: boolean, wiped: boolean): number => {
    const lambdaOffset = Math.abs(lambda - 508);
    const wavelengthFactor = Math.exp(-Math.pow(lambdaOffset / 28, 2));

    const nominalSlope = 0.1987;
    let A = ppm * nominalSlope * wavelengthFactor;

    if (!zeroed && ppm > 0) {
      A += 0.048;
    }

    if (!wiped) {
      A += 0.065;
    }

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

    onRecordMeasurement({
      ppm: currentStandard.concentrationPpm,
      absorbance: A,
      transmittance: T,
      isUnknown: currentStandard.isUnknown,
    });

    setMeasuredList((prev) => new Set(prev).add(selectedStandardIndex));
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-4 lab-bench-bg rounded-2xl border border-[#262626] shadow-2xl relative overflow-y-auto min-h-0 text-white font-sans">
      {/* Encabezado Instrumental Sumi-e */}
      <div className="w-full bg-[#121212] border border-[#2b2b2b] px-3 py-2 rounded-xl flex items-center justify-between gap-2 text-xs shrink-0 shadow-lg">
        <div className="flex items-center gap-2">
          <HankoSeal size="sm" variant="stamp" />
          <span className="font-bold text-white font-serif uppercase tracking-wider">
            Espectrofotómetro UV-Visible Digital (Genesys / Shimadzu)
          </span>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#1f0808] text-[#ef4444] border border-[#dc2626]/70 rounded-full font-bold">
          P12: Ley de Beer (508 nm)
        </span>
      </div>

      {/* ÁREA CENTRAL: CONSOLA INSTRUMENTAL 2D */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-2 relative min-h-0 space-y-4">
        {/* Consola del Espectrofotómetro en Urushi Black y Cinnabar */}
        <div className="w-full max-w-lg bg-[#0d0d0d] border-2 border-[#333333] rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-center gap-5">
          {/* Pantalla LCD de la consola */}
          <div className="flex-1 w-full bg-[#050505] p-4 rounded-xl border-2 border-[#dc2626]/50 shadow-inner flex flex-col justify-between space-y-2.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-[#888888] border-b border-[#222222] pb-1.5">
              <span className="tracking-wider">UV-VIS SPECTROPHOTOMETER</span>
              <span className={isZeroedWithBlank ? 'text-[#ef4444] font-bold' : 'text-[#666666]'}>
                {isZeroedWithBlank ? '● ZERO CALIBRATED' : '○ UNCALIBRATED'}
              </span>
            </div>

            <div className="flex items-baseline justify-between font-mono">
              <div>
                <span className="text-[10px] text-[#666666] block">ABSORBANCIA (A)</span>
                <span className="text-3xl font-black text-white tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                  {currentAbsorbance !== null ? currentAbsorbance.toFixed(3) : '---'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#666666] block">TRANSMITANCIA (%T)</span>
                <span className="text-lg font-bold text-[#ef4444]">
                  {currentAbsorbance !== null
                    ? `${(Math.pow(10, -currentAbsorbance) * 100).toFixed(1)}%`
                    : '---'}
                </span>
              </div>
            </div>

            {/* Selector de Longitud de Onda λ */}
            <div className="flex items-center justify-between pt-2 border-t border-[#222222] text-xs font-mono">
              <span className="text-[11px] text-[#aaaaaa] font-medium">Longitud λ:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setWavelength((prev) => Math.max(400, prev - 10))}
                  className="px-2 py-0.5 bg-[#171717] hover:bg-[#252525] text-white rounded text-[10px] cursor-pointer"
                >
                  -10
                </button>
                <button
                  onClick={() => setWavelength((prev) => Math.max(400, prev - 1))}
                  className="px-2 py-0.5 bg-[#171717] hover:bg-[#252525] text-white rounded text-[10px] cursor-pointer"
                >
                  -1
                </button>
                <span
                  className={`font-mono font-black px-2.5 py-0.5 rounded text-xs ${
                    wavelength === 508 ? 'text-white bg-[#dc2626] border border-[#ef4444]' : 'text-white bg-[#1a1a1a]'
                  }`}
                >
                  {wavelength} nm
                </span>
                <button
                  onClick={() => setWavelength((prev) => Math.min(700, prev + 1))}
                  className="px-2 py-0.5 bg-[#171717] hover:bg-[#252525] text-white rounded text-[10px] cursor-pointer"
                >
                  +1
                </button>
                <button
                  onClick={() => setWavelength((prev) => Math.min(700, prev + 10))}
                  className="px-2 py-0.5 bg-[#171717] hover:bg-[#252525] text-white rounded text-[10px] cursor-pointer"
                >
                  +10
                </button>
              </div>
            </div>
          </div>

          {/* Compartimento de Cubeta Óptica */}
          <div className="flex flex-col items-center space-y-2 shrink-0">
            <div className="relative w-28 h-36 bg-[#050505] border-2 border-[#333333] rounded-xl flex items-center justify-center p-2 shadow-inner">
              <line x1="0" y1="65" x2="112" y2="65" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 2" className="animate-pulse" />

              <div className="relative w-12 h-28 bg-white/5 border-2 border-white/70 rounded-sm flex flex-col justify-end overflow-hidden shadow">
                <div
                  className="w-full h-24 transition-colors duration-300"
                  style={{ backgroundColor: currentStandard.colorRgba }}
                />
                <div className="absolute inset-0 border-x border-white/40" />
                {!isCuvetteWiped && (
                  <div className="absolute top-8 left-2 w-4 h-6 border border-dashed border-[#dc2626] rounded-full opacity-70 pointer-events-none" title="Huella dactilar grasa" />
                )}
              </div>
            </div>

            <button
              onClick={() => setIsCuvetteWiped(true)}
              className={`text-[10px] px-3 py-1 rounded-xl border font-bold transition-all cursor-pointer ${
                isCuvetteWiped
                  ? 'bg-[#1f0808] border-[#dc2626] text-[#ef4444]'
                  : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white animate-pulse'
              }`}
            >
              {isCuvetteWiped ? '✓ Caras limpias' : 'Limpiar con papel'}
            </button>
          </div>
        </div>

        {/* Acciones de Medición y Calibración */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full max-w-lg font-serif">
          {selectedStandardIndex === 0 && (
            <button
              onClick={handleZeroBlank}
              className="flex-1 py-2.5 bg-[#171717] hover:bg-[#252525] active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 border border-[#333333] hover:border-[#dc2626] cursor-pointer uppercase tracking-wider"
            >
              <RefreshCw size={14} className="text-[#dc2626]" />
              <span>Calibrar Blanco (Auto-Zero ➔ A = 0.000)</span>
            </button>
          )}

          <button
            onClick={handleMeasure}
            className="flex-1 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-red-950/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <Eye size={15} />
            <span>Medir {currentStandard.label}</span>
          </button>
        </div>
      </div>

      {/* GRADILLA DE MATRACES AFORADOS CON ESTILO SUMI-E */}
      <div className="w-full bg-[#121212] border border-[#262626] p-3 rounded-xl shrink-0 space-y-1.5 shadow-lg">
        <div className="flex justify-between items-center text-xs px-1">
          <span className="text-[#888888] font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono text-[11px]">
            <Layers size={13} className="text-[#dc2626]" />
            Serie de Matraces Aforados de 50 mL:
          </span>
          <span className="text-[10px] text-white font-mono font-bold">
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
                className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#1c0808] border-[#dc2626] shadow-md ring-1 ring-[#dc2626]'
                    : 'bg-[#171717] hover:bg-[#222222] border-[#2b2b2b]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-inner"
                    style={{ backgroundColor: std.colorRgba }}
                  />
                  {isDone && <CheckCircle2 size={13} className="text-[#dc2626]" />}
                </div>

                <span className="font-bold text-[11px] text-white block truncate font-mono">
                  {std.isUnknown ? 'Problema' : `${std.concentrationPpm.toFixed(1)} ppm`}
                </span>
                <span className="text-[9px] text-[#888888] block truncate">
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

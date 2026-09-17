import React, { useState, useEffect } from 'react';
import { X, Check, RefreshCw, DoorClosed, DoorOpen, Sparkles } from 'lucide-react';
import { HankoSeal } from '../common/HankoSeal';

interface AnalyticalBalanceModalProps {
  isOpen: boolean;
  targetSampleMass: number; // ~0.2150 g
  onClose: () => void;
  onSampleWeighedAndDissolved: (mass: number) => void;
}

export const AnalyticalBalanceModal: React.FC<AnalyticalBalanceModalProps> = ({
  isOpen,
  targetSampleMass,
  onClose,
  onSampleWeighedAndDissolved,
}) => {
  // Estado instrumental de la balanza
  const [isPowerOn, setIsPowerOn] = useState<boolean>(true);
  const [isDraftShieldClosed, setIsDraftShieldClosed] = useState<boolean>(true);
  const [hasVesselOnPan, setHasVesselOnPan] = useState<boolean>(false);
  const [chemicalMassInVessel, setChemicalMassInVessel] = useState<number>(0);
  const [tareOffset, setTareOffset] = useState<number>(0);
  const [jitter, setJitter] = useState<number>(0);

  // Espátula y dosificación
  const [spatulaPowder, setSpatulaPowder] = useState<number>(0);

  // Masa nominal del pesafiltro seco de vidrio
  const vesselTareMass = 14.8521;

  // Ruido de corrientes de aire si la vitrina está abierta
  useEffect(() => {
    if (!isOpen || !isPowerOn) return;

    const interval = setInterval(() => {
      if (!isDraftShieldClosed) {
        // Fluctuación errática por corrientes de aire (±0.0018 g)
        const airDrift = (Math.random() - 0.5) * 0.0036;
        setJitter(airDrift);
      } else {
        // En vitrina cerrada el ruido analítico es apenas ±0.0001 g
        const microNoise = (Math.random() - 0.5) * 0.0002;
        setJitter(microNoise);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [isOpen, isPowerOn, isDraftShieldClosed]);

  if (!isOpen) return null;

  // Masa bruta sobre el platillo
  const grossMassOnPan = (hasVesselOnPan ? vesselTareMass : 0) + chemicalMassInVessel;

  // Masa neta mostrada en el display digital LCD
  const rawDisplayedMass = grossMassOnPan - tareOffset + jitter;
  const displayedMass = Math.max(0, rawDisplayedMass);

  // Botón TARE físico de la balanza
  const handlePressTare = () => {
    setTareOffset(grossMassOnPan);
  };

  // Botón ZERO físico
  const handlePressZero = () => {
    setTareOffset(0);
  };

  // Cargar espátula con KHP sólido desde el frasco
  const handleScoopPowder = (amount: 'macro' | 'fine' | 'micro') => {
    if (!hasVesselOnPan) return;
    const qty = amount === 'macro' ? 0.075 : amount === 'fine' ? 0.015 : 0.002;
    // Variación analítica en la cucharada
    const actualScoop = Number((qty + (Math.random() - 0.5) * (qty * 0.15)).toFixed(4));
    setSpatulaPowder(actualScoop);
  };

  // Descargar la espátula sobre el pesafiltro en la balanza
  const handleDropPowderIntoVessel = () => {
    if (!hasVesselOnPan || spatulaPowder <= 0) return;
    setChemicalMassInVessel((prev) => Number((prev + spatulaPowder).toFixed(4)));
    setSpatulaPowder(0);
  };

  // Retirar una porción con la espátula si se sobrepasó
  const handleRemoveExcessPowder = () => {
    if (chemicalMassInVessel <= 0) return;
    const removed = Math.min(chemicalMassInVessel, 0.025);
    setChemicalMassInVessel((prev) => Number(Math.max(0, prev - removed).toFixed(4)));
  };

  // Autocompletar pesada analítica exacta para agilidad si el estudiante lo desea
  const handleAutoWeighOptimal = () => {
    setHasVesselOnPan(true);
    setTareOffset(vesselTareMass);
    setChemicalMassInVessel(targetSampleMass);
    setIsDraftShieldClosed(true);
    setSpatulaPowder(0);
  };

  const handleFinishWeighing = () => {
    onSampleWeighedAndDissolved(chemicalMassInVessel > 0 ? chemicalMassInVessel : targetSampleMass);
    onClose();
  };

  // Criterio de pesada aceptable para P4 (0.2000 g a 0.2500 g de KHP con vitrina cerrada)
  const isWeighedInRange = chemicalMassInVessel >= 0.1900 && chemicalMassInVessel <= 0.2600;
  const isStable = isDraftShieldClosed && isWeighedInRange;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl bg-sumi-900 border border-sumi-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-washi-100">
        {/* Encabezado con estética Alquímica-33 */}
        <div className="p-4 bg-sumi-850 border-b border-sumi-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HankoSeal size="sm" variant="stamp" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-washi-100 uppercase tracking-wider">
                  Balanza Analítica Digital Mettler Toledo (0.1 mg)
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-cinabrio-950 border border-cinabrio-700 text-cinabrio-400 font-mono rounded-full font-bold">
                  Sensibilidad ±0.0001 g
                </span>
              </div>
              <p className="text-[11px] text-sumi-400">
                Pesada analítica interactiva de patrón primario KHP con vitrina corrediza y espátula
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-sumi-400 hover:text-white rounded-lg hover:bg-sumi-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* CUERPO CENTRAL DE LA BALANZA */}
        <div className="p-5 flex flex-col items-center space-y-4 overflow-y-auto max-h-[82vh]">
          {/* 1. Consola y Display Digital de la Balanza */}
          <div className="w-full max-w-lg bg-sumi-950 p-4 rounded-2xl border-2 border-sumi-700 shadow-2xl flex flex-col items-center relative overflow-hidden">
            {/* Barra superior de estado de la pantalla */}
            <div className="w-full flex justify-between items-center text-[10px] font-mono border-b border-sumi-800 pb-1.5">
              <span className="text-washi-300 font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                METTLER TOLEDO • CLASS I ANALYTICAL
              </span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  isDraftShieldClosed ? 'text-emerald-400' : 'text-amber-400 animate-pulse'
                }`}
              >
                {isDraftShieldClosed ? '● PUERTAS CERRADAS (ESTABLE)' : '⚠️ PUERTA ABIERTA (FLUCTUACIÓN)'}
              </span>
            </div>

            {/* Lectura numérica en pantalla de 4 decimales */}
            <div className="h-20 w-full flex items-center justify-between px-4 my-1">
              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                    isDraftShieldClosed ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800' : 'text-amber-400 bg-amber-950/60 border border-amber-800'
                  }`}
                >
                  {isDraftShieldClosed ? 'STABLE (*)' : 'UNSTABLE (~) '}
                </span>
                {tareOffset > 0 && (
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-1.5 py-0.5 rounded font-bold">
                    NET
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2 font-mono text-washi-50">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-widest text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                  {isPowerOn ? displayedMass.toFixed(4) : '       '}
                </span>
                <span className="text-lg font-bold text-emerald-500">g</span>
              </div>
            </div>

            {/* BOTONES FÍSICOS DE LA CONSOLA DE LA BALANZA */}
            <div className="w-full pt-2 border-t border-sumi-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setIsPowerOn((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all active:scale-95 ${
                  isPowerOn
                    ? 'bg-sumi-800 border-sumi-600 text-washi-300 hover:text-white'
                    : 'bg-rose-950 border-rose-700 text-rose-300'
                }`}
              >
                {isPowerOn ? 'ON/OFF' : 'ENCENDER'}
              </button>

              {/* Botón Central Grande de TARA (O/T) */}
              <button
                onClick={handlePressTare}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-cyan-900/80 to-blue-900/80 hover:from-cyan-800 hover:to-blue-800 active:scale-[0.98] border border-cyan-500/50 rounded-xl text-xs font-black text-white shadow-lg tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw size={14} />
                <span>TARE / ZERO (➔ 0.0000 g)</span>
              </button>

              <button
                onClick={handlePressZero}
                className="px-3 py-1.5 bg-sumi-800 hover:bg-sumi-700 border border-sumi-600 text-washi-400 rounded-xl text-[11px] font-bold transition-all"
                title="Limpiar Tara a Bruto"
              >
                BRUTO
              </button>
            </div>
          </div>

          {/* 2. CÁMARA DE PESADA CON VITRINA CORREDIZA Y PLATILLO */}
          <div className="w-full max-w-lg bg-sumi-950 p-4 rounded-2xl border border-sumi-700 flex flex-col items-center space-y-3 relative">
            {/* Control de Vitrina (Draft Shield) */}
            <div className="w-full flex justify-between items-center text-xs">
              <span className="text-sumi-400 font-medium flex items-center gap-1.5">
                {isDraftShieldClosed ? <DoorClosed size={15} className="text-emerald-400" /> : <DoorOpen size={15} className="text-amber-400" />}
                Vitrina Protectora de Vidrio (Draft Shield):
              </span>
              <button
                onClick={() => setIsDraftShieldClosed((prev) => !prev)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all active:scale-95 ${
                  isDraftShieldClosed
                    ? 'bg-sumi-800 border-sumi-600 text-washi-300 hover:text-white'
                    : 'bg-amber-600/30 border-amber-500 text-amber-200 animate-pulse'
                }`}
              >
                {isDraftShieldClosed ? 'Abrir Puertas Corredizas' : 'Cerrar Puertas Corredizas'}
              </button>
            </div>

            {/* Gráfico SVG de la Cámara de Pesada */}
            <div className="relative w-72 h-44 bg-sumi-900 border-2 border-sumi-700 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
              <svg width="260" height="160" viewBox="0 0 260 160" className="overflow-visible">
                <defs>
                  {/* Vidrio de la vitrina */}
                  <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                    <stop offset="30%" stopColor="rgba(255,255,255,0.02)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                  </linearGradient>

                  {/* Acero inoxidable del platillo */}
                  <linearGradient id="panSteelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                </defs>

                {/* Cámara interior de la balanza */}
                <rect x="25" y="15" width="210" height="130" rx="3" fill="#0d0d0d" stroke="#383838" strokeWidth="1.5" />

                {/* Corrientes de aire si está abierta */}
                {!isDraftShieldClosed && (
                  <g opacity="0.4" className="animate-pulse">
                    <path d="M 30 40 Q 60 50 90 35 Q 120 20 150 40" stroke="#38bdf8" strokeWidth="1" fill="none" strokeDasharray="3 2" />
                    <path d="M 50 70 Q 90 85 130 65 Q 170 50 210 75" stroke="#38bdf8" strokeWidth="1" fill="none" strokeDasharray="3 2" />
                  </g>
                )}

                {/* Eje de la celda de carga central */}
                <rect x="125" y="120" width="10" height="25" fill="#404040" />

                {/* Platillo metálico de acero inoxidable */}
                <ellipse cx="130" cy="120" rx="55" ry="8" fill="url(#panSteelGrad)" stroke="#475569" strokeWidth="1" />

                {/* Pesafiltro de vidrio colocado en el platillo */}
                {hasVesselOnPan && (
                  <g id="weighingBottle" transform="translate(105, 76)">
                    {/* Cuerpo cilíndrico de vidrio del pesafiltro */}
                    <rect x="0" y="5" width="50" height="38" rx="2" fill="rgba(224, 242, 254, 0.15)" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
                    <ellipse cx="25" cy="5" rx="25" ry="4" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />

                    {/* Montículo de polvo blanco de biftalato de potasio sólido si fue añadido */}
                    {chemicalMassInVessel > 0 && (
                      <g>
                        <ellipse
                          cx="25"
                          cy="38"
                          rx={Math.min(22, 10 + (chemicalMassInVessel / 0.25) * 12)}
                          ry={Math.min(10, 4 + (chemicalMassInVessel / 0.25) * 6)}
                          fill="#ffffff"
                          stroke="#e2e8f0"
                          strokeWidth="0.8"
                          className="animate-in fade-in"
                        />
                        {/* Granos en polvo de KHP */}
                        <circle cx="21" cy="34" r="1" fill="#cbd5e1" />
                        <circle cx="28" cy="35" r="1.2" fill="#cbd5e1" />
                        <circle cx="25" cy="31" r="1.5" fill="#f8fafc" />
                      </g>
                    )}
                  </g>
                )}

                {/* Puertas de vidrio corredizas (cerradas o corridas) */}
                <rect
                  x={isDraftShieldClosed ? "25" : "15"}
                  y="15"
                  width={isDraftShieldClosed ? "210" : "100"}
                  height="130"
                  fill="url(#shieldGrad)"
                  stroke="rgba(56, 189, 248, 0.25)"
                  strokeWidth="1"
                  pointerEvents="none"
                />
              </svg>

              {/* Indicador sobre la cámara */}
              <div className="absolute top-2 left-2 text-[10px] font-mono text-sumi-400">
                CHAMBER {isDraftShieldClosed ? '[SEALED]' : '[OPEN]'}
              </div>
            </div>
          </div>

          {/* 3. BANDEJA DE MANIPULACIÓN TÁCTIL (HERRAMIENTAS Y REACTIVOS) */}
          <div className="w-full max-w-lg p-4 bg-sumi-850 border border-sumi-700 rounded-2xl space-y-3 shadow-lg">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-washi-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles size={14} className="text-cinabrio-500" />
                <span>Mesada de Pesada: Manipulación de Muestra</span>
              </span>
              <button
                onClick={handleAutoWeighOptimal}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium"
              >
                Autopesar óptimo (~{targetSampleMass} g)
              </button>
            </div>

            {/* Acciones físicas con los materiales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Pesafiltro */}
              <button
                onClick={() => setHasVesselOnPan((prev) => !prev)}
                className={`p-2.5 rounded-xl border text-left font-semibold transition-all active:scale-95 ${
                  hasVesselOnPan
                    ? 'bg-cyan-950/60 border-cyan-600 text-cyan-200'
                    : 'bg-sumi-800 hover:bg-sumi-700 border-sumi-600 text-washi-300'
                }`}
              >
                <div className="font-bold text-xs">
                  {hasVesselOnPan ? '✓ Pesafiltro en el Platillo' : 'Colocar Pesafiltro en Platillo'}
                </div>
                <div className="text-[10px] text-sumi-400 mt-0.5">
                  Masa de tara de vidrio: {vesselTareMass} g
                </div>
              </button>

              {/* Retirar exceso con espátula */}
              <button
                onClick={handleRemoveExcessPowder}
                disabled={chemicalMassInVessel <= 0}
                className="p-2.5 bg-sumi-800 hover:bg-sumi-700 disabled:opacity-40 disabled:cursor-not-allowed border border-sumi-600 text-washi-300 rounded-xl text-left font-semibold transition-all"
              >
                <div className="font-bold text-xs">Retirar exceso con espátula</div>
                <div className="text-[10px] text-sumi-400 mt-0.5">
                  Resta ~0.025 g hacia el frasco
                </div>
              </button>
            </div>

            {/* Dosificación con Espátula Analítica */}
            <div className="p-3 bg-sumi-900 border border-sumi-700 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-washi-200 text-[11px]">
                  Dosificar Biftalato de Potasio con Espátula:
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  En pesafiltro: {chemicalMassInVessel.toFixed(4)} g (Meta: 0.20-0.25 g)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    handleScoopPowder('macro');
                    setTimeout(handleDropPowderIntoVessel, 250);
                  }}
                  disabled={!hasVesselOnPan}
                  className="py-2 bg-sumi-800 hover:bg-sumi-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border border-sumi-600 text-washi-200 font-bold rounded-xl text-[11px] transition-all"
                >
                  Porción Macro (+0.075 g)
                </button>

                <button
                  onClick={() => {
                    handleScoopPowder('fine');
                    setTimeout(handleDropPowderIntoVessel, 250);
                  }}
                  disabled={!hasVesselOnPan}
                  className="py-2 bg-sumi-800 hover:bg-sumi-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border border-sumi-600 text-washi-200 font-bold rounded-xl text-[11px] transition-all"
                >
                  Toque Fino (+0.015 g)
                </button>

                <button
                  onClick={() => {
                    handleScoopPowder('micro');
                    setTimeout(handleDropPowderIntoVessel, 250);
                  }}
                  disabled={!hasVesselOnPan}
                  className="py-2 bg-sumi-800 hover:bg-sumi-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border border-sumi-600 text-washi-200 font-bold rounded-xl text-[11px] transition-all"
                >
                  Micro-Ajuste (+0.002 g)
                </button>
              </div>
            </div>

            {/* Botón de Confirmación y Transferencia */}
            <button
              onClick={handleFinishWeighing}
              disabled={chemicalMassInVessel < 0.1500 || !isDraftShieldClosed}
              className={`w-full py-3 rounded-xl font-bold text-xs shadow-xl flex items-center justify-center gap-2 transition-all ${
                isStable
                  ? 'bg-gradient-to-r from-cinabrio-600 to-red-600 hover:from-cinabrio-500 hover:to-red-500 text-white cursor-pointer active:scale-[0.98]'
                  : 'bg-sumi-800 border border-sumi-700 text-sumi-400 cursor-not-allowed'
              }`}
            >
              <Check size={16} />
              <span>
                {!isDraftShieldClosed
                  ? 'Cierre la vitrina antes de transferir la pesada'
                  : !isWeighedInRange
                  ? `Dosis actual: ${chemicalMassInVessel.toFixed(4)} g (Ajuste entre 0.2000 y 0.2500 g)`
                  : `Transferir ${chemicalMassInVessel.toFixed(4)} g al Erlenmeyer y Disolver con Agua`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

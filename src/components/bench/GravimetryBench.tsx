import React, { useState } from 'react';
import { Flame, Filter, Droplet, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { TechniqueDefectType } from '../../types';

interface GravimetryBenchProps {
  sampleMassGrams: number; // ~0.5000 g
  onRecordDefect: (type: TechniqueDefectType, citationId: string) => void;
  onCompleteGravimetry: (data: {
    crucibleTare: number;
    cruciblePlusBaSO4: number;
    netBaSO4Mass: number;
  }) => void;
}

export const GravimetryBench: React.FC<GravimetryBenchProps> = ({
  sampleMassGrams,
  onRecordDefect,
  onCompleteGravimetry,
}) => {
  // Estación activa: 1 a 5
  const [station, setStation] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Estados de Estación 1 (Precipitación)
  const [precipitationDone, setPrecipitationDone] = useState<boolean>(false);
  const [isRapidPrecipitation, setIsRapidPrecipitation] = useState<boolean>(false);

  // Estados de Estación 2 (Digestión)
  const [isDigesting, setIsDigesting] = useState<boolean>(false);
  const [digestionDone, setDigestionDone] = useState<boolean>(false);
  const [testedCompleteness, setTestedCompleteness] = useState<boolean>(false);

  // Estados de Estación 3 (Filtración)
  const [filtrationDone, setFiltrationDone] = useState<boolean>(false);

  // Estados de Estación 4 (Lavado y Test AgNO3)
  const [washCount, setWashCount] = useState<number>(0);
  const [lastAgNO3Result, setLastAgNO3Result] = useState<'none' | 'turbid' | 'clear'>('none');

  // Estados de Estación 5 (Calcinación y Peso Constante)
  const [crucibleTare] = useState<number>(18.5420); // g
  const trueBaSO4Mass = Number((sampleMassGrams * 0.7042).toFixed(4)); // ~0.3521 g
  const [calcinated, setCalcinated] = useState<boolean>(false);
  const [coolingDone, setCoolingDone] = useState<boolean>(false);
  const [weighStep, setWeighStep] = useState<number>(0);
  const [mass1, setMass1] = useState<number | null>(null);
  const [mass2, setMass2] = useState<number | null>(null);

  // 1. Precipitación
  const handlePrecipitate = (rapid: boolean) => {
    setIsRapidPrecipitation(rapid);
    setPrecipitationDone(true);
    if (rapid) {
      onRecordDefect('DEFECT_RAPID_PRECIPITATION', 'CITE_NO_DIGESTION');
    }
  };

  // 2. Digestión
  const handleStartDigestion = () => {
    setIsDigesting(true);
    setTimeout(() => {
      setIsDigesting(false);
      setDigestionDone(true);
    }, 1200);
  };

  // 3. Filtración
  const handleStartFiltration = () => {
    setFiltrationDone(true);
    if (!digestionDone) {
      onRecordDefect('DEFECT_NO_DIGESTION', 'CITE_NO_DIGESTION');
    }
  };

  // 4. Lavado
  const handleAddWash = () => {
    setWashCount((prev) => prev + 1);
    setLastAgNO3Result('none');
  };

  const handleTestAgNO3 = () => {
    if (washCount < 3) {
      setLastAgNO3Result('turbid'); // Positivo a cloruros (turbidez lechosa)
    } else {
      setLastAgNO3Result('clear'); // Negativo a cloruros (límpido)
    }
  };

  // 5. Calcinación y Balanza
  const handleCalcinate = () => {
    setCalcinated(true);
    if (washCount < 3) {
      onRecordDefect('DEFECT_INCOMPLETE_WASHING', 'CITE_INCOMPLETE_WASHING');
    }
  };

  const handleCoolInDesiccator = () => {
    setCoolingDone(true);
  };

  const handleWeighHot = () => {
    // Defecto: pesar en caliente sin enfriar en desecador
    onRecordDefect('DEFECT_WEIGHING_HOT_CRUCIBLE', 'CITE_WEIGHING_HOT_CRUCIBLE');
    setMass1(Number((crucibleTare + trueBaSO4Mass - 0.0042).toFixed(4)));
    setWeighStep(1);
  };

  const handleWeigh1 = () => {
    setMass1(Number((crucibleTare + trueBaSO4Mass + 0.0001).toFixed(4)));
    setWeighStep(1);
  };

  const handleWeigh2 = () => {
    const finalVal = Number((crucibleTare + trueBaSO4Mass).toFixed(4));
    setMass2(finalVal);
    setWeighStep(2);
    onCompleteGravimetry({
      crucibleTare,
      cruciblePlusBaSO4: finalVal,
      netBaSO4Mass: Number((finalVal - crucibleTare).toFixed(4)),
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-4 lab-bench-bg rounded-2xl border border-slate-700/80 shadow-2xl relative overflow-y-auto min-h-0 text-slate-100">
      {/* Navegador Superior de Estaciones Gravimétricas */}
      <div className="w-full bg-slate-900/90 border border-slate-700 px-3 py-2 rounded-xl flex items-center justify-between gap-2 text-xs shrink-0 shadow">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
          {[
            { num: 1, label: '1. Precipitación' },
            { num: 2, label: '2. Digestión' },
            { num: 3, label: '3. Filtración' },
            { num: 4, label: '4. Test AgNO3' },
            { num: 5, label: '5. Calcinación' },
          ].map((st) => (
            <button
              key={st.num}
              onClick={() => setStation(st.num as any)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all shrink-0 text-[11px] ${
                station === st.num
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
          Práctica 5: Gravimetría de BaSO4 (Paso {station} de 5)
        </span>
      </div>

      {/* ÁREA CENTRAL DE LA ESTACIÓN ACTIVA */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-2 relative min-h-0">
        {/* ESTACIÓN 1: PRECIPITACIÓN EN CALIENTE */}
        {station === 1 && (
          <div className="flex flex-col items-center space-y-3 animate-in fade-in max-w-md text-center">
            <h3 className="font-bold text-sm text-cyan-300">
              Estación 1: Precipitación en Caliente de BaSO4 con BaCl2
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              La disolución de sulfatos está acidificada con HCl en vaso de 400 mL a 85 °C. Para minimizar la sobresaturación relativa de Von Weimarn y evitar partículas coloidales difíciles de filtrar, el reactivo precipitante debe añadirse lentamente con agitación continua.
            </p>

            {/* Vaso de 400 mL en SVG */}
            <svg width="180" height="150" viewBox="0 0 180 150">
              {/* Placa calefactora */}
              <rect x="20" y="130" width="140" height="16" rx="3" fill="#334155" stroke="#64748b" />
              <line x1="30" y1="130" x2="150" y2="130" stroke="#ef4444" strokeWidth="2" />
              {/* Vaso de precipitados */}
              <rect x="40" y="30" width="100" height="100" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" />
              {/* Líquido */}
              <rect
                x="42"
                y="65"
                width="96"
                height="63"
                fill={precipitationDone ? 'rgba(255, 255, 255, 0.7)' : 'rgba(224, 242, 254, 0.4)'}
                className="transition-colors duration-500"
              />
              {/* Precipitado de BaSO4 en suspensión si ya precipitó */}
              {precipitationDone && (
                <g>
                  {Array.from({ length: isRapidPrecipitation ? 30 : 15 }).map((_, i) => (
                    <circle
                      key={i}
                      cx={50 + (i * 17) % 80}
                      cy={75 + (i * 11) % 48}
                      r={isRapidPrecipitation ? 1 : 2}
                      fill="#ffffff"
                    />
                  ))}
                </g>
              )}
              {/* Varilla de vidrio */}
              <line x1="60" y1="15" x2="110" y2="120" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinecap="round" />
            </svg>

            {!precipitationDone ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full pt-1">
                <button
                  onClick={() => handlePrecipitate(false)}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow transition-all"
                >
                  Adición Lenta Gota a Gota con Varilla (Recomendada)
                </button>
                <button
                  onClick={() => handlePrecipitate(true)}
                  className="py-2 px-3 bg-amber-600/80 hover:bg-amber-600 active:scale-95 text-white font-semibold rounded-xl text-xs transition-all"
                >
                  Adición Rápida de Golpe
                </button>
              </div>
            ) : (
              <div className="space-y-2 w-full">
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-500 rounded-xl text-[11px] text-emerald-300">
                  ✓ Precipitación completada. Precipitado lechoso de BaSO4 formado.
                  {isRapidPrecipitation && ' (Nota: La adición rápida incrementó la formación de núcleos coloidales).'}
                </div>
                <button
                  onClick={() => setStation(2)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-1.5"
                >
                  <span>Pasar a Estación 2: Digestión Térmica</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ESTACIÓN 2: DIGESTIÓN TÉRMICA */}
        {station === 2 && (
          <div className="flex flex-col items-center space-y-3 animate-in fade-in max-w-md text-center">
            <h3 className="font-bold text-sm text-cyan-300">
              Estación 2: Digestión Térmica (Maduración de Ostwald a 85 °C)
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              El vaso cubierto con vidrio de reloj reposa en caliente para permitir que los cristales pequeños se redisuelvan y recristalicen sobre los grandes, sedimentando en el fondo y dejando el sobrenadante transparente.
            </p>

            <svg width="180" height="150" viewBox="0 0 180 150">
              <rect x="20" y="130" width="140" height="16" rx="3" fill="#334155" />
              <line x1="30" y1="130" x2="150" y2="130" stroke="#f97316" strokeWidth="2.5" className={isDigesting ? 'animate-pulse' : ''} />
              <rect x="40" y="30" width="100" height="100" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" />
              {/* Vidrio de reloj tapando el vaso */}
              <path d="M 38 28 Q 90 20 142 28" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
              {/* Líquido sobrenadante */}
              <rect x="42" y="65" width="96" height={digestionDone ? "40" : "63"} fill={digestionDone ? "rgba(224, 242, 254, 0.25)" : "rgba(255, 255, 255, 0.7)"} />
              {/* Cristales gruesos sedimentados al fondo tras digestión */}
              {digestionDone && (
                <rect x="42" y="105" width="96" height="23" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              )}
            </svg>

            {!digestionDone ? (
              <button
                onClick={handleStartDigestion}
                disabled={isDigesting}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-2"
              >
                <Flame size={15} className={isDigesting ? 'animate-bounce' : ''} />
                <span>{isDigesting ? 'Digiriendo a 85 °C (Maduración)...' : 'Iniciar Digestión Térmica (45 min)'}</span>
              </button>
            ) : (
              <div className="space-y-2 w-full">
                <div className="p-2 bg-emerald-950/60 border border-emerald-500 rounded-xl text-[11px] text-emerald-300">
                  ✓ Digestión completada: BaSO4 sedimentado en cristales densos. Sobrenadante transparente.
                </div>

                {!testedCompleteness ? (
                  <button
                    onClick={() => setTestedCompleteness(true)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-cyan-300 font-semibold rounded-xl text-xs"
                  >
                    Test de precipitación completa (+2 gotas BaCl2 en sobrenadante)
                  </button>
                ) : (
                  <div className="text-[11px] text-cyan-300 font-medium">
                    ✓ Sin turbidez adicional: Precipitación cuantitativa 100% completa.
                  </div>
                )}

                <button
                  onClick={() => setStation(3)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-1.5"
                >
                  <span>Pasar a Estación 3: Filtración Cuantitativa</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ESTACIÓN 3: FILTRACIÓN CUANTITATIVA */}
        {station === 3 && (
          <div className="flex flex-col items-center space-y-3 animate-in fade-in max-w-md text-center">
            <h3 className="font-bold text-sm text-cyan-300">
              Estación 3: Filtración por Gravedad con Papel Whatman N° 42
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Se trasvasa el líquido mediante la varilla de vidrio al embudo analítico de vástago lleno con papel sin cenizas (Whatman 42).
            </p>

            <svg width="180" height="150" viewBox="0 0 180 150">
              {/* Soporte de embudo */}
              <rect x="25" y="10" width="6" height="135" fill="#64748b" />
              <rect x="25" y="55" width="45" height="8" fill="#475569" />
              {/* Embudo cónico */}
              <path d="M 60 40 L 120 40 L 93 80 L 93 125 L 87 125 L 87 80 Z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              {/* Papel filtro Whatman 42 en el cono */}
              <path d="M 65 42 L 115 42 L 90 78 Z" fill={filtrationDone ? "#ffffff" : "rgba(255,255,255,0.4)"} stroke="#94a3b8" strokeWidth="1" />
              {/* Matraz erlenmeyer receptor */}
              <path d="M 80 100 L 70 140 L 110 140 L 100 100 Z" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              {/* Filtrado líquido transparente cayendo */}
              {filtrationDone && (
                <line x1="90" y1="125" x2="90" y2="138" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" />
              )}
            </svg>

            {!filtrationDone ? (
              <button
                onClick={handleStartFiltration}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-2"
              >
                <Filter size={15} />
                <span>Verter por varilla y arrastrar precipitado con pizeta caliente</span>
              </button>
            ) : (
              <div className="space-y-2 w-full">
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-500 rounded-xl text-[11px] text-emerald-300">
                  ✓ Precipitado blanco retenido cuantitativamente en el cono de papel Whatman 42.
                </div>
                <button
                  onClick={() => setStation(4)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-1.5"
                >
                  <span>Pasar a Estación 4: Control de Lavado (Test AgNO3)</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ESTACIÓN 4: CONTROL DE LAVADO DE CLORUROS */}
        {station === 4 && (
          <div className="flex flex-col items-center space-y-3 animate-in fade-in max-w-md text-center">
            <h3 className="font-bold text-sm text-cyan-300">
              Estación 4: Ensayo de Cloruros con AgNO3 en Aguas de Lavado
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              El precipitado debe lavarse con agua destilada caliente para eliminar iones Ba(2+) y Cl(-) adsorbidos. Se recogen gotas del filtrado en un tubo de ensayo y se añade 1 gota de AgNO3 0.1 N hasta obtener reacción límpida.
            </p>

            <svg width="180" height="140" viewBox="0 0 180 140">
              {/* Gradilla con tubo de ensayo */}
              <rect x="40" y="115" width="100" height="15" rx="2" fill="#475569" />
              {/* Tubo de ensayo */}
              <rect x="80" y="30" width="20" height="85" rx="8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              {/* Líquido en el tubo de ensayo */}
              <rect
                x="81.5"
                y="75"
                width="17"
                height="38"
                rx="6"
                fill={
                  lastAgNO3Result === 'turbid'
                    ? 'rgba(255, 255, 255, 0.9)' // Blanco lechoso (AgCl)
                    : lastAgNO3Result === 'clear'
                    ? 'rgba(224, 242, 254, 0.4)' // Límpido
                    : 'rgba(224, 242, 254, 0.2)'
                }
              />
            </svg>

            <div className="w-full space-y-2">
              <div className="flex justify-between items-center text-xs px-1">
                <span className="text-slate-400">Lavados con agua caliente:</span>
                <span className="font-bold font-mono text-cyan-300">{washCount} lavados</span>
              </div>

              <div className="flex gap-2 w-full">
                <button
                  onClick={handleAddWash}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <Droplet size={14} className="text-blue-400" />
                  <span>Lavar precipitado</span>
                </button>

                <button
                  onClick={handleTestAgNO3}
                  className="py-2 px-3.5 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow"
                >
                  +1 gota AgNO3 0.1 N
                </button>
              </div>

              {lastAgNO3Result === 'turbid' && (
                <div className="p-2 bg-rose-950/60 border border-rose-600 rounded-xl text-[11px] text-rose-300">
                  ⚠️ Turbidez lechosa de AgCl: Aún quedan cloruros adsorbidos. Continúe lavando.
                </div>
              )}

              {lastAgNO3Result === 'clear' && (
                <div className="p-2 bg-emerald-950/60 border border-emerald-500 rounded-xl text-[11px] text-emerald-300">
                  ✓ Ensayo negativo de cloruros: Solución perfectamente transparente. Lavado cuantitativo finalizado.
                </div>
              )}

              <button
                onClick={() => setStation(5)}
                className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-1.5"
              >
                <span>Pasar a Estación 5: Calcinación y Peso Constante</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ESTACIÓN 5: CALCINACIÓN EN MUFLA Y MASA CONSTANTE */}
        {station === 5 && (
          <div className="flex flex-col items-center space-y-3 animate-in fade-in max-w-md text-center">
            <h3 className="font-bold text-sm text-cyan-300">
              Estación 5: Calcinación a 800 °C y Criterio de Peso Constante
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              El papel con el BaSO4 se dobla en el crisol tarado (18.5420 g), se carboniza sin llama y se calcina en mufla a 800 °C, enfriando en desecador antes de cada pesada analítica.
            </p>

            {/* Crisol de porcelana y mufla */}
            <svg width="180" height="130" viewBox="0 0 180 130">
              {/* Horno Mufla exterior */}
              <rect x="25" y="10" width="130" height="110" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              {/* Cámara refractaria incandescente si calcinated */}
              <rect x="40" y="25" width="100" height="80" rx="2" fill={calcinated ? "#991b1b" : "#0f172a"} />
              {/* Crisol de porcelana */}
              <path d="M 75 60 L 105 60 L 100 95 L 80 95 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.2" />
              {/* BaSO4 blanco dentro del crisol */}
              <ellipse cx="90" cy="72" rx="8" ry="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
            </svg>

            {/* Pasos de calcinación */}
            <div className="w-full space-y-2 text-xs">
              {!calcinated ? (
                <button
                  onClick={handleCalcinate}
                  className="w-full py-2.5 bg-red-700 hover:bg-red-600 active:scale-95 text-white font-bold rounded-xl shadow flex items-center justify-center gap-2"
                >
                  <Flame size={15} />
                  <span>Calcinar crisol en mufla a 800 °C (30 min)</span>
                </button>
              ) : !coolingDone ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={handleCoolInDesiccator}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs"
                    >
                      Enfriar 30 min en Desecador (Recomendado)
                    </button>
                    <button
                      onClick={handleWeighHot}
                      className="py-2 px-3 bg-amber-600/70 hover:bg-amber-600 text-white font-semibold rounded-xl text-xs"
                    >
                      Pesar en Caliente
                    </button>
                  </div>
                </div>
              ) : weighStep === 0 ? (
                <button
                  onClick={handleWeigh1}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow"
                >
                  Realizar Pesada 1 en Balanza Analítica (0.1 mg)
                </button>
              ) : weighStep === 1 ? (
                <button
                  onClick={handleWeigh2}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow"
                >
                  Calcinación adicional 15 min ➔ Desecador ➔ Pesada 2
                </button>
              ) : (
                <div className="p-3 bg-emerald-950/70 border border-emerald-500 rounded-xl space-y-1 text-emerald-300">
                  <div className="flex items-center justify-center gap-1.5 font-bold">
                    <CheckCircle2 size={16} />
                    <span>¡Peso Constante Alcanzado!</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-200">
                    Pesada 1: {mass1?.toFixed(4)} g | Pesada 2: {mass2?.toFixed(4)} g (Δ = 0.0001 g ≤ 0.0002 g)
                  </div>
                  <div className="font-bold text-white pt-1">
                    Masa neta de BaSO4: {(mass2! - crucibleTare).toFixed(4)} g
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pie con selector de navegación hacia adelante/atrás */}
      <div className="w-full flex items-center justify-between z-10 pt-2 border-t border-slate-800 text-xs shrink-0">
        <button
          onClick={() => setStation((prev) => Math.max(1, prev - 1) as any)}
          disabled={station === 1}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-slate-300"
        >
          <ArrowLeft size={14} />
          <span>Estación Anterior</span>
        </button>

        <span className="text-slate-400 font-mono text-[11px]">
          Estación {station} / 5
        </span>

        <button
          onClick={() => setStation((prev) => Math.min(5, prev + 1) as any)}
          disabled={station === 5}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-slate-300"
        >
          <span>Siguiente Estación</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Flame, Filter, Droplet, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { TechniqueDefectType } from '../../types';

interface GravimetryBenchProps {
  sampleMassGrams: number;
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
  const [station, setStation] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [precipitationDone, setPrecipitationDone] = useState<boolean>(false);
  const [isRapidPrecipitation, setIsRapidPrecipitation] = useState<boolean>(false);

  const [isDigesting, setIsDigesting] = useState<boolean>(false);
  const [digestionDone, setDigestionDone] = useState<boolean>(false);
  const [testedCompleteness, setTestedCompleteness] = useState<boolean>(false);

  const [filtrationDone, setFiltrationDone] = useState<boolean>(false);

  const [washCount, setWashCount] = useState<number>(0);
  const [lastAgNO3Result, setLastAgNO3Result] = useState<'none' | 'turbid' | 'clear'>('none');

  const [crucibleTare] = useState<number>(18.5420);
  const trueBaSO4Mass = Number((sampleMassGrams * 0.7042).toFixed(4));
  const [calcinated, setCalcinated] = useState<boolean>(false);
  const [coolingDone, setCoolingDone] = useState<boolean>(false);
  const [weighStep, setWeighStep] = useState<number>(0);
  const [mass1, setMass1] = useState<number | null>(null);
  const [mass2, setMass2] = useState<number | null>(null);

  const handlePrecipitate = (rapid: boolean) => {
    setIsRapidPrecipitation(rapid);
    setPrecipitationDone(true);
    if (rapid) {
      onRecordDefect('DEFECT_RAPID_PRECIPITATION', 'CITE_NO_DIGESTION');
    }
  };

  const handleStartDigestion = () => {
    setIsDigesting(true);
    setTimeout(() => {
      setIsDigesting(false);
      setDigestionDone(true);
    }, 1200);
  };

  const handleStartFiltration = () => {
    setFiltrationDone(true);
    if (!digestionDone) {
      onRecordDefect('DEFECT_NO_DIGESTION', 'CITE_NO_DIGESTION');
    }
  };

  const handleAddWash = () => {
    setWashCount((prev) => prev + 1);
    setLastAgNO3Result('none');
  };

  const handleTestAgNO3 = () => {
    if (washCount < 3) {
      setLastAgNO3Result('turbid');
    } else {
      setLastAgNO3Result('clear');
    }
  };

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
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-4 lab-bench-bg rounded-2xl border border-[#262626] shadow-2xl relative overflow-y-auto min-h-0 text-white font-sans">
      {/* Navegador Superior de Estaciones en Rojo Cinabrio y Negro Tinta */}
      <div className="w-full bg-[#121212] border border-[#2b2b2b] px-3 py-2 rounded-xl flex items-center justify-between gap-2 text-xs shrink-0 shadow-lg">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto font-mono">
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
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 text-[11px] cursor-pointer ${
                station === st.num
                  ? 'bg-[#dc2626] text-white shadow-[0_2px_10px_rgba(220,38,38,0.4)]'
                  : 'bg-[#1c1c1c] text-[#888888] hover:text-white border border-[#333333]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <span className="text-[10px] text-[#888888] font-mono hidden md:inline">
          P5 Gravimetría • Estación {station} / 5
        </span>
      </div>

      {/* ÁREA CENTRAL DE LA ESTACIÓN ACTIVA */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-2 relative min-h-0">
        {/* ESTACIÓN 1: PRECIPITACIÓN EN CALIENTE */}
        {station === 1 && (
          <div className="flex flex-col items-center space-y-3 animate-in fade-in max-w-md text-center">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider font-serif">
              Estación 1: Precipitación en Caliente de BaSO4 con BaCl2
            </h3>
            <p className="text-[11px] text-[#cccccc] leading-relaxed">
              La disolución de sulfatos está acidificada con HCl en vaso de 400 mL a 85 °C. Para controlar la sobresaturación relativa de Von Weimarn, el reactivo precipitante debe añadirse lentamente con varilla.
            </p>

            <svg width="180" height="150" viewBox="0 0 180 150">
              <rect x="20" y="130" width="140" height="16" rx="3" fill="#1f1f1f" stroke="#383838" />
              <line x1="30" y1="130" x2="150" y2="130" stroke="#dc2626" strokeWidth="2" />
              <rect x="40" y="30" width="100" height="100" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" />
              <rect
                x="42"
                y="65"
                width="96"
                height="63"
                fill={precipitationDone ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.25)'}
                className="transition-colors duration-500"
              />
              {precipitationDone && (
                <g>
                  {Array.from({ length: isRapidPrecipitation ? 30 : 15 }).map((_, i) => (
                    <circle
                      key={i}
                      cx={50 + (i * 17) % 80}
                      cy={75 + (i * 11) % 48}
                      r={isRapidPrecipitation ? 1 : 2.2}
                      fill="#ffffff"
                    />
                  ))}
                </g>
              )}
              <line x1="60" y1="15" x2="110" y2="120" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            </svg>

            {!precipitationDone ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full pt-1">
                <button
                  onClick={() => handlePrecipitate(false)}
                  className="flex-1 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer uppercase tracking-wider"
                >
                  Adición Lenta Gota a Gota con Varilla (Óptima)
                </button>
                <button
                  onClick={() => handlePrecipitate(true)}
                  className="py-2.5 px-3 bg-[#1c1c1c] hover:bg-[#282828] active:scale-95 text-white border border-[#444444] font-semibold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Adición Rápida
                </button>
              </div>
            ) : (
              <div className="space-y-2 w-full">
                <div className="p-2.5 bg-[#1f0808] border border-[#dc2626] rounded-xl text-[11px] text-[#ef4444] font-semibold">
                  ✓ Precipitación completada. Precipitado lechoso de BaSO4 formado.
                </div>
                <button
                  onClick={() => setStation(2)}
                  className="w-full py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
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
            <h3 className="font-bold text-sm text-white uppercase tracking-wider font-serif">
              Estación 2: Digestión Térmica (Maduración de Ostwald a 85 °C)
            </h3>
            <p className="text-[11px] text-[#cccccc] leading-relaxed">
              El vaso cubierto reposa en caliente para permitir que los cristales pequeños se recristalicen sobre los grandes, sedimentando en el fondo y dejando el líquido sobrenadante transparente.
            </p>

            <svg width="180" height="150" viewBox="0 0 180 150">
              <rect x="20" y="130" width="140" height="16" rx="3" fill="#1f1f1f" stroke="#333333" />
              <line x1="30" y1="130" x2="150" y2="130" stroke="#dc2626" strokeWidth="2.5" className={isDigesting ? 'animate-pulse' : ''} />
              <rect x="40" y="30" width="100" height="100" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" />
              <path d="M 38 28 Q 90 20 142 28" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
              <rect x="42" y="65" width="96" height={digestionDone ? "40" : "63"} fill={digestionDone ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.7)"} />
              {digestionDone && (
                <rect x="42" y="105" width="96" height="23" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              )}
            </svg>

            {!digestionDone ? (
              <button
                onClick={handleStartDigestion}
                disabled={isDigesting}
                className="w-full py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <Flame size={15} className={isDigesting ? 'animate-bounce' : ''} />
                <span>{isDigesting ? 'Digiriendo a 85 °C (Maduración)...' : 'Iniciar Digestión Térmica (45 min)'}</span>
              </button>
            ) : (
              <div className="space-y-2 w-full">
                <div className="p-2.5 bg-[#1f0808] border border-[#dc2626] rounded-xl text-[11px] text-[#ef4444] font-semibold">
                  ✓ Digestión completada: BaSO4 sedimentado en cristales densos. Sobrenadante transparente.
                </div>

                {!testedCompleteness ? (
                  <button
                    onClick={() => setTestedCompleteness(true)}
                    className="w-full py-2 bg-[#171717] hover:bg-[#262626] border border-[#383838] text-white font-semibold rounded-xl text-xs cursor-pointer"
                  >
                    Test de precipitación completa (+2 gotas BaCl2 en sobrenadante)
                  </button>
                ) : (
                  <div className="text-[11px] text-white font-bold font-mono">
                    ✓ Sin turbidez adicional: Precipitación cuantitativa 100% completa.
                  </div>
                )}

                <button
                  onClick={() => setStation(3)}
                  className="w-full py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
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
            <h3 className="font-bold text-sm text-white uppercase tracking-wider font-serif">
              Estación 3: Filtración por Gravedad con Papel Whatman N° 42
            </h3>
            <p className="text-[11px] text-[#cccccc] leading-relaxed">
              Se trasvasa el líquido mediante la varilla de vidrio al embudo analítico de vástago lleno con papel sin cenizas (Whatman 42).
            </p>

            <svg width="180" height="150" viewBox="0 0 180 150">
              <rect x="25" y="10" width="6" height="135" fill="#444444" />
              <rect x="25" y="55" width="45" height="8" fill="#262626" stroke="#dc2626" strokeWidth="0.8" />
              <path d="M 60 40 L 120 40 L 93 80 L 93 125 L 87 125 L 87 80 Z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              <path d="M 65 42 L 115 42 L 90 78 Z" fill={filtrationDone ? "#ffffff" : "rgba(255,255,255,0.4)"} stroke="#94a3b8" strokeWidth="1" />
              <path d="M 80 100 L 70 140 L 110 140 L 100 100 Z" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              {filtrationDone && (
                <line x1="90" y1="125" x2="90" y2="138" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="3 2" />
              )}
            </svg>

            {!filtrationDone ? (
              <button
                onClick={handleStartFiltration}
                className="w-full py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <Filter size={15} />
                <span>Verter por varilla y arrastrar precipitado con pizeta caliente</span>
              </button>
            ) : (
              <div className="space-y-2 w-full">
                <div className="p-2.5 bg-[#1f0808] border border-[#dc2626] rounded-xl text-[11px] text-[#ef4444] font-semibold">
                  ✓ Precipitado blanco retenido cuantitativamente en el cono de papel Whatman 42.
                </div>
                <button
                  onClick={() => setStation(4)}
                  className="w-full py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
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
            <h3 className="font-bold text-sm text-white uppercase tracking-wider font-serif">
              Estación 4: Ensayo de Cloruros con AgNO3 en Aguas de Lavado
            </h3>
            <p className="text-[11px] text-[#cccccc] leading-relaxed">
              El precipitado debe lavarse con agua caliente para eliminar iones Ba(2+) y Cl(-) adsorbidos. Se recogen gotas en tubo de ensayo y se añade 1 gota de AgNO3 0.1 N hasta obtener reacción transparente.
            </p>

            <svg width="180" height="140" viewBox="0 0 180 140">
              <rect x="40" y="115" width="100" height="15" rx="2" fill="#262626" />
              <rect x="80" y="30" width="20" height="85" rx="8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              <rect
                x="81.5"
                y="75"
                width="17"
                height="38"
                rx="6"
                fill={
                  lastAgNO3Result === 'turbid'
                    ? '#ffffff'
                    : lastAgNO3Result === 'clear'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.08)'
                }
              />
            </svg>

            <div className="w-full space-y-2">
              <div className="flex justify-between items-center text-xs px-1 font-mono">
                <span className="text-[#888888]">Lavados con agua caliente:</span>
                <span className="font-bold text-white">{washCount} lavados</span>
              </div>

              <div className="flex gap-2 w-full">
                <button
                  onClick={handleAddWash}
                  className="flex-1 py-2 bg-[#171717] hover:bg-[#252525] border border-[#383838] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Droplet size={14} className="text-[#dc2626]" />
                  <span>Lavar precipitado</span>
                </button>

                <button
                  onClick={handleTestAgNO3}
                  className="py-2 px-3.5 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-bold rounded-xl text-xs shadow cursor-pointer"
                >
                  +1 gota AgNO3 0.1 N
                </button>
              </div>

              {lastAgNO3Result === 'turbid' && (
                <div className="p-2.5 bg-[#2a0505] border border-[#dc2626] rounded-xl text-[11px] text-[#ff4444] font-bold">
                  ⚠️ Turbidez lechosa de AgCl: Aún quedan cloruros adsorbidos. Continúe lavando.
                </div>
              )}

              {lastAgNO3Result === 'clear' && (
                <div className="p-2.5 bg-[#1f0808] border border-[#dc2626] rounded-xl text-[11px] text-[#ef4444] font-bold">
                  ✓ Ensayo negativo de cloruros: Solución transparente. Lavado cuantitativo finalizado.
                </div>
              )}

              <button
                onClick={() => setStation(5)}
                className="w-full mt-2 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
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
            <h3 className="font-bold text-sm text-white uppercase tracking-wider font-serif">
              Estación 5: Calcinación a 800 °C y Criterio de Peso Constante
            </h3>
            <p className="text-[11px] text-[#cccccc] leading-relaxed">
              El papel con el BaSO4 se dobla en el crisol tarado (18.5420 g), se carboniza sin llama y se calcina en mufla a 800 °C, enfriando en desecador antes de cada pesada analítica.
            </p>

            <svg width="180" height="130" viewBox="0 0 180 130">
              <rect x="25" y="10" width="130" height="110" rx="4" fill="#141414" stroke="#333333" strokeWidth="2" />
              <rect x="40" y="25" width="100" height="80" rx="2" fill={calcinated ? "#991b1b" : "#050505"} />
              <path d="M 75 60 L 105 60 L 100 95 L 80 95 Z" fill="#fafafa" stroke="#a3a3a3" strokeWidth="1.2" />
              <ellipse cx="90" cy="72" rx="8" ry="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
            </svg>

            <div className="w-full space-y-2 text-xs">
              {!calcinated ? (
                <button
                  onClick={handleCalcinate}
                  className="w-full py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <Flame size={15} />
                  <span>Calcinar crisol en mufla a 800 °C (30 min)</span>
                </button>
              ) : !coolingDone ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={handleCoolInDesiccator}
                      className="flex-1 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-xl text-xs cursor-pointer uppercase tracking-wider"
                    >
                      Enfriar 30 min en Desecador
                    </button>
                    <button
                      onClick={handleWeighHot}
                      className="py-2.5 px-3 bg-[#1c1c1c] hover:bg-[#282828] border border-[#383838] text-white font-semibold rounded-xl text-xs cursor-pointer"
                    >
                      Pesar en Caliente
                    </button>
                  </div>
                </div>
              ) : weighStep === 0 ? (
                <button
                  onClick={handleWeigh1}
                  className="w-full py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-xl shadow-lg cursor-pointer uppercase tracking-wider"
                >
                  Realizar Pesada 1 en Balanza Analítica (0.1 mg)
                </button>
              ) : weighStep === 1 ? (
                <button
                  onClick={handleWeigh2}
                  className="w-full py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-xl shadow-lg cursor-pointer uppercase tracking-wider"
                >
                  Calcinación adicional 15 min ➔ Desecador ➔ Pesada 2
                </button>
              ) : (
                <div className="p-3.5 bg-[#1f0808] border-2 border-[#dc2626] rounded-xl space-y-1 text-white">
                  <div className="flex items-center justify-center gap-1.5 font-bold font-serif text-[#ef4444]">
                    <CheckCircle2 size={16} />
                    <span>¡PESO CONSTANTE ALCANZADO!</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#cccccc]">
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

      {/* Pie con navegación hacia adelante/atrás */}
      <div className="w-full flex items-center justify-between z-10 pt-2 border-t border-[#262626] text-xs shrink-0 font-mono">
        <button
          onClick={() => setStation((prev) => Math.max(1, prev - 1) as any)}
          disabled={station === 1}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#141414] hover:bg-[#222222] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-white border border-[#2b2b2b] cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Estación Anterior</span>
        </button>

        <span className="text-[#888888] font-mono text-[11px]">
          Estación {station} / 5
        </span>

        <button
          onClick={() => setStation((prev) => Math.min(5, prev + 1) as any)}
          disabled={station === 5}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#141414] hover:bg-[#222222] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-white border border-[#2b2b2b] cursor-pointer"
        >
          <span>Siguiente Estación</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

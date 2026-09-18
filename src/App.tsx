import React, { useState, useRef, useCallback } from 'react';
import { LabBench } from './components/bench/LabBench';
import { GravimetryBench } from './components/bench/GravimetryBench';
import { SpectrophotometryBench } from './components/bench/SpectrophotometryBench';
import { LabNotebook, SpectroMeasurementPoint } from './components/notebook/LabNotebook';
import { MeniscusLoupeModal } from './components/inspection/MeniscusLoupeModal';
import { AnalyticalBalanceModal } from './components/inspection/AnalyticalBalanceModal';
import { PipetteTransferModal } from './components/inspection/PipetteTransferModal';
import { TipPurgeModal } from './components/inspection/TipPurgeModal';
import { AuditModal } from './components/feedback/AuditModal';
import { MaterialSelectionModal } from './components/preparation/MaterialSelectionModal';
import { LabGuideModal } from './components/guide/LabGuideModal';
import { PracticeSelectorModal } from './components/navigation/PracticeSelectorModal';
import { ProcedureEngine } from './engine/procedureFsm';
import { evaluateBenchEquilibrium } from './engine/equilibrium';
import { PRACTICE_4_CONFIG } from './data/practiceConfig';
import { TechniqueDefectType } from './types';
import { BookOpen, ShieldCheck, ChevronUp, PackageCheck, HelpCircle, Layers, CheckCircle2, Circle, Home, Calculator } from 'lucide-react';
import { LandingHub } from './components/home/LandingHub';
import { HankoSeal } from './components/common/HankoSeal';
import { IndicatorDropperModal } from './components/inspection/IndicatorDropperModal';
import { PreLabCalculationModal } from './components/preparation/PreLabCalculationModal';

export const App: React.FC = () => {
  // Vista activa: 'home' (Portal de Inicio) o 'bench' (Mesada de Laboratorio)
  const [currentView, setCurrentView] = useState<'home' | 'bench'>('home');

  // Práctica actualmente seleccionada (P4, P5, P7 o P12)
  const [currentPracticeNumber, setCurrentPracticeNumber] = useState<number>(4);

  // Parámetros aleatorizados de la sesión:
  // P4: Masa KHP objetivo (~0.2150 g)
  const [targetMassP4] = useState<number>(() => Number((0.2150 + (Math.random() - 0.5) * 0.02).toFixed(4)));
  const [actualSampleMassP4, setActualSampleMassP4] = useState<number>(0);
  const [trueNormalityP4] = useState<number>(() => Number((0.1015 + (Math.random() - 0.5) * 0.006).toFixed(4)));

  // P7: Normalidad real de HCl (~0.1010 N)
  const [trueNormalityP7] = useState<number>(() => Number((0.1010 + (Math.random() - 0.5) * 0.005).toFixed(4)));
  const titrantNormality = 0.1015;

  // P5: Masa de muestra sulfatos (~0.5000 g) y % verdadero (~28.95%)
  const [sampleMassP5] = useState<number>(() => Number((0.5000 + (Math.random() - 0.5) * 0.03).toFixed(4)));
  const [truePercentSO4] = useState<number>(() => Number((28.95 + (Math.random() - 0.5) * 0.8).toFixed(2)));

  // P12: Concentración de Fe problema (~2.45 ppm)
  const [unknownTrueFePpm] = useState<number>(() => Number((2.45 + (Math.random() - 0.5) * 0.8).toFixed(2)));
  const [spectroPoints, setSpectroPoints] = useState<SpectroMeasurementPoint[]>([]);

  // Instancia de la Máquina de Estados Procedimental (TDA)
  const engineRef = useRef<ProcedureEngine>(new ProcedureEngine());

  // Estado del flujo físico del experimento:
  const [isMaterialsApproved, setIsMaterialsApproved] = useState<boolean>(false);
  const [isBuretteLoaded, setIsBuretteLoaded] = useState<boolean>(false);
  const [isSampleDissolved, setIsSampleDissolved] = useState<boolean>(false);

  // La agitación empieza estrictamente APAGADA al inicio
  const [isStirring, setIsStirring] = useState<boolean>(false);

  // Estado de simulación de fluidos volumétricos (P4/P7)
  const [deliveredMl, setDeliveredMl] = useState<number>(0);
  const [isStopcockOpen, setIsStopcockOpen] = useState<boolean>(false);
  const [flowRate, setFlowRate] = useState<'dropwise' | 'fast' | 'closed'>('dropwise');
  const [indicatorDrops, setIndicatorDrops] = useState<number>(0);
  const [isBubblePurged, setIsBubblePurged] = useState<boolean>(false);

  // Lecturas transferidas a la libreta
  const [recordedV0, setRecordedV0] = useState<number>(0);
  const [recordedVf, setRecordedVf] = useState<number>(0);

  // Modales interactivos
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState<boolean>(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState<boolean>(false);
  const [isPipetteModalOpen, setIsPipetteModalOpen] = useState<boolean>(false);
  const [isTipPurgeModalOpen, setIsTipPurgeModalOpen] = useState<boolean>(false);
  const [isDropperModalOpen, setIsDropperModalOpen] = useState<boolean>(false);
  const [isCalculationModalOpen, setIsCalculationModalOpen] = useState<boolean>(false);
  const [isLoupeOpen, setIsLoupeOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isPracticeSelectorOpen, setIsPracticeSelectorOpen] = useState<boolean>(false);
  const [isMobileNotebookOpen, setIsMobileNotebookOpen] = useState<boolean>(false);

  // Concentración verdadera según práctica
  const activeTrueConcentration =
    currentPracticeNumber === 12
      ? unknownTrueFePpm
      : currentPracticeNumber === 5
      ? truePercentSO4
      : currentPracticeNumber === 7
      ? trueNormalityP7
      : trueNormalityP4;

  // Masa activa
  const activeSampleMass =
    currentPracticeNumber === 5
      ? sampleMassP5
      : currentPracticeNumber === 7
      ? 25.0
      : actualSampleMassP4 > 0
      ? actualSampleMassP4
      : targetMassP4;

  // Evaluación físico-química del punto instantáneo (pH y color del matraz/vaso)
  const equilibrium = evaluateBenchEquilibrium(
    currentPracticeNumber === 7
      ? trueNormalityP7
      : actualSampleMassP4 > 0
      ? actualSampleMassP4
      : targetMassP4,
    PRACTICE_4_CONFIG.analyte.equivalentWeight,
    titrantNormality,
    deliveredMl,
    indicatorDrops,
    currentPracticeNumber
  );

  // Manejo de titulación continua a 60 FPS
  const handleTickTitration = useCallback((deltaMl: number) => {
    setDeliveredMl((prev) => {
      const next = Number((prev + deltaMl).toFixed(3));
      if (next >= 50) {
        setIsStopcockOpen(false);
        return 50;
      }
      return next;
    });

    engineRef.current.onTitrationStarted();

    if (equilibrium.endpointQuality !== 'none') {
      engineRef.current.onEndpointReached(equilibrium.endpointQuality);
    }
  }, [equilibrium.endpointQuality]);

  const handleToggleStopcock = () => {
    if (!isBuretteLoaded) return;
    setIsStopcockOpen((prev) => !prev);
  };

  const handleLoadBurette = () => {
    setIsBuretteLoaded(true);
    engineRef.current.completeMilestone('MS_BURETTE_LOADED');
  };

  const handleOpenTransferModal = () => {
    if (currentPracticeNumber === 7) {
      setIsPipetteModalOpen(true);
    } else {
      setIsBalanceModalOpen(true);
    }
  };

  const handleSampleWeighedAndDissolved = (mass: number) => {
    setActualSampleMassP4(mass);
    setIsSampleDissolved(true);
    engineRef.current.completeMilestone('MS_ALIQUOT_DELIVERED');
  };

  const handleAliquotTransferred = (_volumeMl: number, blewDrop: boolean) => {
    setIsSampleDissolved(true);
    engineRef.current.completeMilestone('MS_ALIQUOT_DELIVERED');
    if (blewDrop) {
      engineRef.current.completeMilestone('MS_ALIQUOT_DELIVERED');
    }
  };

  const handlePurgeBubble = () => {
    engineRef.current.purgeBuretteBubble();
    setIsBubblePurged(true);
  };

  const handleAddIndicator = () => {
    if (!isSampleDissolved) return;
    engineRef.current.addIndicatorDrop();
    setIndicatorDrops((prev) => Math.min(5, prev + 1));
  };

  const handleToggleStirring = () => {
    const active = engineRef.current.toggleStirring();
    setIsStirring(active);
  };

  const handleParallaxChanged = (degrees: number) => {
    engineRef.current.setParallaxAngle(degrees);
  };

  const handleTransferReading = (vol: number, target: 'initial' | 'final') => {
    if (target === 'initial') {
      setRecordedV0(vol);
      engineRef.current.completeMilestone('MS_MENISCUS_ALIGNED');
    } else {
      setRecordedVf(vol);
      engineRef.current.completeMilestone('MS_FINAL_READING');
    }
  };

  const handleRecordGravimetricDefect = (type: TechniqueDefectType, citationId: string) => {
    engineRef.current['recordDefect']?.(type, citationId);
  };

  const handleCompleteGravimetry = (_data: {
    crucibleTare: number;
    cruciblePlusBaSO4: number;
    netBaSO4Mass: number;
  }) => {
    // Gravimetría completada
  };

  // Registro de medición en espectrofotometría (P12)
  const handleRecordSpectroMeasurement = (data: {
    ppm: number;
    absorbance: number;
    transmittance: number;
    isUnknown?: boolean;
  }) => {
    setSpectroPoints((prev) => {
      // Si ya existe este estándar medido, actualizarlo; sino, agregarlo
      const existingIdx = prev.findIndex((p) => (data.isUnknown ? p.isUnknown : p.ppm === data.ppm));
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = data;
        return copy;
      }
      return [...prev, data];
    });
  };

  const handleResetBench = () => {
    engineRef.current = new ProcedureEngine();
    setDeliveredMl(0);
    setIsStopcockOpen(false);
    setFlowRate('dropwise');
    setIndicatorDrops(0);
    setIsBubblePurged(false);
    setIsStirring(false);
    setIsBuretteLoaded(false);
    setIsSampleDissolved(false);
    setActualSampleMassP4(0);
    setRecordedV0(0);
    setRecordedVf(0);
    setSpectroPoints([]);
  };

  const handleSelectPractice = (practiceNum: number) => {
    setCurrentPracticeNumber(practiceNum);
    setIsMaterialsApproved(false);
    setIsMaterialsModalOpen(true);
    handleResetBench();
  };

  const handleStartPracticeFromHub = (practiceNum: number) => {
    setCurrentPracticeNumber(practiceNum);
    setCurrentView('bench');
    setIsMaterialsApproved(false);
    setIsMaterialsModalOpen(true);
    handleResetBench();
  };

  // Determinar paso actual para el Stepper
  const currentStep = !isMaterialsApproved
    ? 1
    : !isBuretteLoaded && currentPracticeNumber !== 5 && currentPracticeNumber !== 12
    ? 2
    : !isSampleDissolved && currentPracticeNumber !== 5 && currentPracticeNumber !== 12
    ? 3
    : !isBubblePurged && currentPracticeNumber !== 5 && currentPracticeNumber !== 12
    ? 4
    : (indicatorDrops === 0 || !isStirring) && currentPracticeNumber !== 5 && currentPracticeNumber !== 12
    ? 5
    : 6;

  if (currentView === 'home') {
    return (
      <>
        <LandingHub
          onSelectPractice={handleStartPracticeFromHub}
          onOpenGuide={(pNum) => {
            if (pNum) setCurrentPracticeNumber(pNum);
            setIsGuideModalOpen(true);
          }}
          onOpenAuditRAG={() => setIsAuditModalOpen(true)}
        />
        <LabGuideModal
          isOpen={isGuideModalOpen}
          practiceNumber={currentPracticeNumber}
          onClose={() => setIsGuideModalOpen(false)}
        />
        <AuditModal
          isOpen={isAuditModalOpen}
          defects={engineRef.current.getState().defects}
          onClose={() => setIsAuditModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#f5f5f5] antialiased selection:bg-[#dc2626] selection:text-white font-sans">
      {/* Barra de Navegación Superior con Estilo Sumi-e Alquímica-33 */}
      <header className="h-14 px-3 sm:px-6 bg-[#0a0a0a] border-b-2 border-[#dc2626] flex items-center justify-between z-30 shrink-0 shadow-2xl">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <HankoSeal size="sm" variant="stamp" className="shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap font-serif">
              <h1 className="text-xs sm:text-base font-bold text-white truncate uppercase tracking-wider">
                Alquímica-33
              </h1>
              <span className="text-[10px] px-2 py-0.5 bg-[#1f0808] text-[#ef4444] border border-[#dc2626]/70 rounded-full font-mono shrink-0 font-bold">
                UMSS • 5to Semestre
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#888888] truncate hidden sm:block font-sans">
              {currentPracticeNumber === 12
                ? 'Práctica 12: Colorimetría y Espectrofotometría UV-Vis (Ley de Beer)'
                : currentPracticeNumber === 5
                ? 'Práctica 5: Determinación Gravimétrica de Sulfatos (BaSO4)'
                : currentPracticeNumber === 7
                ? 'Práctica 7: Titulación Potenciométrica de HCl con NaOH estándar'
                : 'Práctica 4: Estandarización de NaOH 0.1 N con Biftalato de Potasio'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 font-sans">
          {/* Botón Volver al Menú Principal */}
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#141414] hover:bg-[#222222] border border-[#333333] hover:border-white text-[#d4d4d4] hover:text-white rounded-xl text-xs font-semibold shadow transition-all active:scale-95 cursor-pointer"
            title="Volver al Portal de Prácticas"
          >
            <Home size={15} className="text-[#dc2626]" />
            <span className="hidden sm:inline">Menú Principal</span>
            <span className="sm:hidden">Menú</span>
          </button>

          {/* Selector de Prácticas */}
          <button
            onClick={() => setIsPracticeSelectorOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#141414] hover:bg-[#222222] border border-[#333333] hover:border-white text-[#d4d4d4] hover:text-white rounded-xl text-xs font-semibold shadow transition-all active:scale-95 cursor-pointer"
            title="Ver catálogo de las 13 prácticas del plan de estudios"
          >
            <Layers size={15} className="text-[#dc2626]" />
            <span className="hidden sm:inline">Prácticas (13)</span>
            <span className="sm:hidden font-bold text-white">P{currentPracticeNumber}</span>
          </button>

          {/* Botón Cálculos Previos */}
          <button
            onClick={() => setIsCalculationModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#141414] hover:bg-[#222222] border border-[#333333] hover:border-[#dc2626] text-white rounded-xl text-xs font-semibold shadow transition-all active:scale-95 cursor-pointer"
            title="Ver o estimar cálculos estequiométricos de entrada"
          >
            <Calculator size={15} className="text-[#ef4444]" />
            <span className="hidden sm:inline">Cálculos Previos</span>
            <span className="sm:hidden">Cálculos</span>
          </button>

          {/* Guía Oficial */}
          <button
            onClick={() => setIsGuideModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#141414] hover:bg-[#222222] border border-[#333333] hover:border-white text-[#d4d4d4] hover:text-white rounded-xl text-xs font-semibold shadow transition-all active:scale-95 cursor-pointer"
            title="Ver Guía de Laboratorio Real y de la Mesada"
          >
            <HelpCircle size={15} className="text-[#dc2626]" />
            <span className="hidden sm:inline">Guía</span>
            <span className="sm:hidden">Guía</span>
          </button>

          {/* Solicitud Materiales */}
          <button
            onClick={() => setIsMaterialsModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border shadow-lg transition-all active:scale-95 cursor-pointer ${
              isMaterialsApproved
                ? 'bg-[#1a0505] border-[#dc2626] text-[#ef4444]'
                : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white animate-pulse border-[#ef4444]'
            }`}
            title="Seleccionar Materiales y Reactivos requeridos"
          >
            <PackageCheck size={15} />
            <span className="hidden md:inline">{isMaterialsApproved ? '✓ Materiales Aprobados' : 'Solicitar Materiales'}</span>
            <span className="md:hidden">Materiales</span>
          </button>

          {/* Auditoría RAG */}
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#141414] hover:bg-[#200808] border border-[#333333] hover:border-[#dc2626] text-[#ef4444] rounded-xl text-xs font-bold shadow transition-all active:scale-95 cursor-pointer"
          >
            <ShieldCheck size={15} />
            <span className="hidden sm:inline">RAG</span>
            <span className="sm:hidden">RAG</span>
          </button>
        </div>
      </header>

      {/* Stepper de Laboratorio Sumi-e */}
      <div className="bg-[#0c0c0c] border-b border-[#222222] px-3 sm:px-6 py-2 overflow-x-auto flex items-center justify-between gap-3 text-[11px] shrink-0 font-mono">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className={`flex items-center gap-1.5 ${isMaterialsApproved ? 'text-white font-bold' : 'text-[#ef4444] font-black animate-pulse'}`}>
            {isMaterialsApproved ? <CheckCircle2 size={13} className="text-[#dc2626]" /> : <Circle size={13} />}
            <span>1. Materiales</span>
          </div>
          <span className="text-[#333333]">➔</span>

          {currentPracticeNumber === 12 ? (
            <>
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Circle size={13} />
                <span>2. λ = 508 nm</span>
              </div>
              <span className="text-[#333333]">➔</span>
              <div className="flex items-center gap-1.5 text-[#666666]">
                <Circle size={13} />
                <span>3. Auto-Zero</span>
              </div>
              <span className="text-[#333333]">➔</span>
              <div className="flex items-center gap-1.5 text-[#666666]">
                <Circle size={13} />
                <span>4. Limpiar Cubeta</span>
              </div>
              <span className="text-[#333333]">➔</span>
              <div className="flex items-center gap-1.5 text-[#666666]">
                <Circle size={13} />
                <span>5. Medir Serie</span>
              </div>
              <span className="text-[#333333]">➔</span>
              <div className="flex items-center gap-1.5 text-[#ef4444] font-bold">
                <Circle size={13} />
                <span>6. Ley de Beer</span>
              </div>
            </>
          ) : currentPracticeNumber === 5 ? (
            <>
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <Circle size={13} />
                <span>2. Precipitación</span>
              </div>
              <span className="text-[#333333]">➔</span>
              <div className="flex items-center gap-1.5 text-[#666666]">
                <Circle size={13} />
                <span>3. Digestión</span>
              </div>
              <span className="text-[#333333]">➔</span>
              <div className="flex items-center gap-1.5 text-[#666666]">
                <Circle size={13} />
                <span>4. Filtración</span>
              </div>
              <span className="text-[#333333]">➔</span>
              <div className="flex items-center gap-1.5 text-[#666666]">
                <Circle size={13} />
                <span>5. Test AgNO3</span>
              </div>
              <span className="text-[#333333]">➔</span>
              <div className="flex items-center gap-1.5 text-[#ef4444] font-bold">
                <Circle size={13} />
                <span>6. Calcinación</span>
              </div>
            </>
          ) : (
            <>
              <div className={`flex items-center gap-1.5 ${isBuretteLoaded ? 'text-white font-bold' : currentStep === 2 ? 'text-[#ef4444] font-black animate-pulse' : 'text-[#666666]'}`}>
                {isBuretteLoaded ? <CheckCircle2 size={13} className="text-[#dc2626]" /> : <Circle size={13} />}
                <span>2. Cargar NaOH</span>
              </div>
              <span className="text-[#333333]">➔</span>

              <div className={`flex items-center gap-1.5 ${isSampleDissolved ? 'text-white font-bold' : currentStep === 3 ? 'text-[#ef4444] font-black animate-pulse' : 'text-[#666666]'}`}>
                {isSampleDissolved ? <CheckCircle2 size={13} className="text-[#dc2626]" /> : <Circle size={13} />}
                <span>{currentPracticeNumber === 7 ? '3. Pipetear HCl' : '3. Pesar KHP'}</span>
              </div>
              <span className="text-[#333333]">➔</span>

              <div className={`flex items-center gap-1.5 ${isBubblePurged ? 'text-white font-bold' : currentStep === 4 ? 'text-[#ef4444] font-black animate-pulse' : 'text-[#666666]'}`}>
                {isBubblePurged ? <CheckCircle2 size={13} className="text-[#dc2626]" /> : <Circle size={13} />}
                <span>4. Purgar & Enrasar</span>
              </div>
              <span className="text-[#333333]">➔</span>

              <div className={`flex items-center gap-1.5 ${indicatorDrops > 0 && isStirring ? 'text-white font-bold' : currentStep === 5 ? 'text-[#ef4444] font-black animate-pulse' : 'text-[#666666]'}`}>
                {indicatorDrops > 0 && isStirring ? <CheckCircle2 size={13} className="text-[#dc2626]" /> : <Circle size={13} />}
                <span>5. Indicador & Agitador</span>
              </div>
              <span className="text-[#333333]">➔</span>

              <div className={`flex items-center gap-1.5 ${currentStep === 6 ? 'text-[#ef4444] font-bold' : 'text-[#666666]'}`}>
                <Circle size={13} />
                <span>6. Titular</span>
              </div>
            </>
          )}
        </div>

        <div className="text-[10px] text-[#777777] font-mono hidden xl:block">
          *Paso actual: {
            currentStep === 1 ? 'Presentar lista de materiales al ayudante' :
            currentPracticeNumber === 12 ? 'Calibrar blanco, limpiar cubetas y medir serie espectrofotométrica a 508 nm' :
            currentPracticeNumber === 5 ? 'Ejecutar las 5 estaciones de gravimetría secuencialmente' :
            currentStep === 2 ? 'Cargar solución de NaOH en la bureta' :
            currentStep === 3 ? (currentPracticeNumber === 7 ? 'Pipetear 25.00 mL de HCl con propipeta' : 'Pesar KHP en balanza y disolver') :
            currentStep === 4 ? 'Purgar burbuja y enrasar' :
            currentStep === 5 ? 'Agregar gotas de fenolftaleína y encender agitador' :
            'Titular muestra hasta punto final'
          }
        </div>
      </div>

      {/* Contenedor Principal */}
      <main className="flex-1 p-2.5 sm:p-4 flex flex-col lg:flex-row gap-3 sm:gap-4 overflow-hidden min-h-0 relative">
        {/* Mesada Virtual 2D (Conmutable entre Volumetría P4/P7, Gravimetría P5 y Espectrofotometría P12) */}
        <section className="flex-1 h-full min-h-0 flex flex-col pb-16 lg:pb-0">
          {currentPracticeNumber === 12 ? (
            <SpectrophotometryBench
              unknownTruePpm={unknownTrueFePpm}
              onRecordDefect={handleRecordGravimetricDefect}
              onRecordMeasurement={handleRecordSpectroMeasurement}
            />
          ) : currentPracticeNumber === 5 ? (
            <GravimetryBench
              sampleMassGrams={sampleMassP5}
              onRecordDefect={handleRecordGravimetricDefect}
              onCompleteGravimetry={handleCompleteGravimetry}
            />
          ) : (
            <LabBench
              practiceNumber={currentPracticeNumber}
              currentDeliveredMl={deliveredMl}
              isBuretteLoaded={isBuretteLoaded}
              isSampleDissolved={isSampleDissolved}
              isStopcockOpen={isStopcockOpen}
              flowRate={flowRate}
              hasBubble={!isBubblePurged}
              indicatorDrops={indicatorDrops}
              isBubblePurged={isBubblePurged}
              isStirring={isStirring}
              equilibrium={equilibrium}
              onToggleStopcock={handleToggleStopcock}
              onSetFlowRate={setFlowRate}
              onOpenLoupe={() => setIsLoupeOpen(true)}
              onOpenTipZoom={() => setIsTipPurgeModalOpen(true)}
              onOpenDropperModal={() => setIsDropperModalOpen(true)}
              onLoadBurette={handleLoadBurette}
              onOpenTransferModal={handleOpenTransferModal}
              onPurgeBubble={() => {
                if (!isBubblePurged) {
                  setIsTipPurgeModalOpen(true);
                }
              }}
              onToggleStirring={handleToggleStirring}
              onResetBench={handleResetBench}
              onTickTitration={handleTickTitration}
            />
          )}
        </section>

        {/* Libreta de Laboratorio Digital (Desktop) */}
        <section className="hidden lg:flex flex-col w-[380px] xl:w-[430px] h-full min-h-0 shrink-0">
          <LabNotebook
            practiceNumber={currentPracticeNumber}
            initialVolume={recordedV0}
            finalVolume={recordedVf}
            sampleMass={activeSampleMass}
            trueConcentration={activeTrueConcentration}
            currentDeliveredMl={deliveredMl}
            currentPH={equilibrium.pH}
            spectroPoints={spectroPoints}
            defects={engineRef.current.getState().defects}
            onOpenAuditModal={() => setIsAuditModalOpen(true)}
          />
        </section>

        {/* Botón Flotante en Móviles para abrir la Libreta (Estilo Cinabrio) */}
        <div className="lg:hidden fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setIsMobileNotebookOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-extrabold text-xs rounded-full shadow-2xl border border-[#ef4444] active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
          >
            <BookOpen size={16} />
            <span>Abrir Libreta de Laboratorio</span>
            <ChevronUp size={16} />
          </button>
        </div>

        {/* Cajón Deslizable Inferior (Bottom Sheet) para Smartphones */}
        {isMobileNotebookOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="h-[80vh] w-full bg-[#0a0a0a] rounded-t-3xl border-t-2 border-[#dc2626] shadow-2xl overflow-hidden flex flex-col">
              <div className="p-3 bg-[#121212] flex items-center justify-between border-b border-[#222222]">
                <span className="text-xs font-bold text-white font-serif uppercase tracking-wider">Libreta de Laboratorio</span>
                <button
                  onClick={() => setIsMobileNotebookOpen(false)}
                  className="px-3 py-1 bg-[#1a1a1a] hover:bg-[#262626] rounded-lg text-xs font-semibold text-white border border-[#333333] cursor-pointer"
                >
                  Volver a Mesada ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <LabNotebook
                  practiceNumber={currentPracticeNumber}
                  initialVolume={recordedV0}
                  finalVolume={recordedVf}
                  sampleMass={activeSampleMass}
                  trueConcentration={activeTrueConcentration}
                  currentDeliveredMl={deliveredMl}
                  currentPH={equilibrium.pH}
                  spectroPoints={spectroPoints}
                  defects={engineRef.current.getState().defects}
                  onOpenAuditModal={() => setIsAuditModalOpen(true)}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modales de Inspección, Materiales, Balanza (P4), Pipeta (P7), Guía y Auditoría */}
      <MaterialSelectionModal
        isOpen={isMaterialsModalOpen}
        practiceNumber={currentPracticeNumber}
        onClose={() => setIsMaterialsModalOpen(false)}
        onValidationSuccess={() => {
          setIsMaterialsApproved(true);
        }}
      />

      <AnalyticalBalanceModal
        isOpen={isBalanceModalOpen}
        targetSampleMass={targetMassP4}
        onClose={() => setIsBalanceModalOpen(false)}
        onSampleWeighedAndDissolved={handleSampleWeighedAndDissolved}
      />

      <PipetteTransferModal
        isOpen={isPipetteModalOpen}
        aliquotVolumeMl={25.00}
        onClose={() => setIsPipetteModalOpen(false)}
        onAliquotTransferred={handleAliquotTransferred}
      />

      <MeniscusLoupeModal
        isOpen={isLoupeOpen}
        currentActualVolumeMl={deliveredMl}
        initialReadingRecorded={recordedV0 > 0}
        onClose={() => setIsLoupeOpen(false)}
        onTransferReading={handleTransferReading}
        onParallaxChanged={handleParallaxChanged}
      />

      <TipPurgeModal
        isOpen={isTipPurgeModalOpen}
        hasBubble={!isBubblePurged}
        onClose={() => setIsTipPurgeModalOpen(false)}
        onPurgeComplete={() => {
          handlePurgeBubble();
        }}
      />

      <IndicatorDropperModal
        isOpen={isDropperModalOpen}
        currentDrops={indicatorDrops}
        isStirring={isStirring}
        onClose={() => setIsDropperModalOpen(false)}
        onAddDrop={handleAddIndicator}
      />

      <PreLabCalculationModal
        isOpen={isCalculationModalOpen}
        practiceNumber={currentPracticeNumber}
        onClose={() => setIsCalculationModalOpen(false)}
      />

      <LabGuideModal
        isOpen={isGuideModalOpen}
        practiceNumber={currentPracticeNumber}
        onClose={() => setIsGuideModalOpen(false)}
      />

      <PracticeSelectorModal
        isOpen={isPracticeSelectorOpen}
        currentPracticeNumber={currentPracticeNumber}
        onClose={() => setIsPracticeSelectorOpen(false)}
        onSelectPractice={handleSelectPractice}
      />

      <AuditModal
        isOpen={isAuditModalOpen}
        defects={engineRef.current.getState().defects}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
};

export default App;

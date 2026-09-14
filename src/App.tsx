import React, { useState, useRef, useCallback } from 'react';
import { LabBench } from './components/bench/LabBench';
import { GravimetryBench } from './components/bench/GravimetryBench';
import { LabNotebook } from './components/notebook/LabNotebook';
import { MeniscusLoupeModal } from './components/inspection/MeniscusLoupeModal';
import { AnalyticalBalanceModal } from './components/inspection/AnalyticalBalanceModal';
import { PipetteTransferModal } from './components/inspection/PipetteTransferModal';
import { AuditModal } from './components/feedback/AuditModal';
import { MaterialSelectionModal } from './components/preparation/MaterialSelectionModal';
import { LabGuideModal } from './components/guide/LabGuideModal';
import { PracticeSelectorModal } from './components/navigation/PracticeSelectorModal';
import { ProcedureEngine } from './engine/procedureFsm';
import { evaluateBenchEquilibrium } from './engine/equilibrium';
import { PRACTICE_4_CONFIG } from './data/practiceConfig';
import { TechniqueDefectType } from './types';
import { FlaskConical, BookOpen, ShieldCheck, ChevronUp, PackageCheck, HelpCircle, Layers, CheckCircle2, Circle } from 'lucide-react';

export const App: React.FC = () => {
  // Práctica actualmente seleccionada (P4, P5 o P7)
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
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState<boolean>(true);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState<boolean>(false);
  const [isPipetteModalOpen, setIsPipetteModalOpen] = useState<boolean>(false);
  const [isLoupeOpen, setIsLoupeOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isPracticeSelectorOpen, setIsPracticeSelectorOpen] = useState<boolean>(false);
  const [isMobileNotebookOpen, setIsMobileNotebookOpen] = useState<boolean>(false);

  // Concentración verdadera según práctica
  const activeTrueConcentration =
    currentPracticeNumber === 5
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
    // Registrar defecto en el motor
    engineRef.current['recordDefect']?.(type, citationId);
  };

  const handleCompleteGravimetry = (_data: {
    crucibleTare: number;
    cruciblePlusBaSO4: number;
    netBaSO4Mass: number;
  }) => {
    // Gravimetría finalizada
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
  };

  const handleSelectPractice = (practiceNum: number) => {
    setCurrentPracticeNumber(practiceNum);
    setIsMaterialsApproved(false);
    setIsMaterialsModalOpen(true);
    handleResetBench();
  };

  // Determinar paso actual para el Stepper
  const currentStep = !isMaterialsApproved
    ? 1
    : !isBuretteLoaded && currentPracticeNumber !== 5
    ? 2
    : !isSampleDissolved && currentPracticeNumber !== 5
    ? 3
    : !isBubblePurged && currentPracticeNumber !== 5
    ? 4
    : (indicatorDrops === 0 || !isStirring) && currentPracticeNumber !== 5
    ? 5
    : 6;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased">
      {/* Barra de Navegación Superior */}
      <header className="h-14 px-3 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 bg-blue-600/20 border border-blue-500/40 rounded-xl text-blue-400 shrink-0">
            <FlaskConical size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xs sm:text-base font-bold text-slate-100 truncate">
                Simulador de Laboratorio: Química Analítica
              </h1>
              <span className="text-[10px] px-2 py-0.5 bg-blue-900/40 text-blue-400 border border-blue-700/40 rounded-full font-mono shrink-0 hidden md:inline">
                UMSS 5to Semestre
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate hidden sm:block">
              {currentPracticeNumber === 5
                ? 'Práctica 5: Determinación Gravimétrica de Sulfatos (BaSO4)'
                : currentPracticeNumber === 7
                ? 'Práctica 7: Titulación Potenciométrica de HCl con NaOH estándar'
                : 'Práctica 4: Estandarización de NaOH 0.1 N con Biftalato de Potasio'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Selector de Prácticas */}
          <button
            onClick={() => setIsPracticeSelectorOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold shadow transition-all active:scale-95"
            title="Ver catálogo de las 13 prácticas del plan de estudios"
          >
            <Layers size={15} className="text-blue-400" />
            <span className="hidden sm:inline">Prácticas (13)</span>
            <span className="sm:hidden font-bold text-cyan-300">P{currentPracticeNumber}</span>
          </button>

          {/* Guía Oficial */}
          <button
            onClick={() => setIsGuideModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-blue-950/60 hover:bg-blue-900/80 border border-blue-700/60 text-blue-300 rounded-xl text-xs font-semibold shadow transition-all active:scale-95"
            title="Ver Guía de Laboratorio Real y de la Mesada"
          >
            <HelpCircle size={15} />
            <span className="hidden sm:inline">Guía de Práctica</span>
            <span className="sm:hidden">Guía</span>
          </button>

          {/* Solicitud Materiales */}
          <button
            onClick={() => setIsMaterialsModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border shadow transition-all active:scale-95 ${
              isMaterialsApproved
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                : 'bg-purple-950/70 hover:bg-purple-900 border-purple-600 text-purple-200 animate-pulse'
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
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 rounded-xl text-xs font-semibold shadow transition-all active:scale-95"
          >
            <ShieldCheck size={15} />
            <span className="hidden sm:inline">Auditoría RAG</span>
            <span className="sm:hidden">RAG</span>
          </button>
        </div>
      </header>

      {/* Stepper de Laboratorio */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 sm:px-6 py-2 overflow-x-auto flex items-center justify-between gap-3 text-[11px] shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className={`flex items-center gap-1.5 ${isMaterialsApproved ? 'text-emerald-400 font-semibold' : 'text-purple-400 font-bold animate-pulse'}`}>
            {isMaterialsApproved ? <CheckCircle2 size={13} /> : <Circle size={13} />}
            <span>1. Materiales</span>
          </div>
          <span className="text-slate-600">➔</span>

          {currentPracticeNumber === 5 ? (
            /* Stepper específico de Gravimetría P5 */
            <>
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <Circle size={13} />
                <span>2. Precipitación</span>
              </div>
              <span className="text-slate-600">➔</span>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Circle size={13} />
                <span>3. Digestión</span>
              </div>
              <span className="text-slate-600">➔</span>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Circle size={13} />
                <span>4. Filtración</span>
              </div>
              <span className="text-slate-600">➔</span>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Circle size={13} />
                <span>5. Test AgNO3</span>
              </div>
              <span className="text-slate-600">➔</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Circle size={13} />
                <span>6. Calcinación</span>
              </div>
            </>
          ) : (
            /* Stepper de Volumetría P4/P7 */
            <>
              <div className={`flex items-center gap-1.5 ${isBuretteLoaded ? 'text-emerald-400 font-semibold' : currentStep === 2 ? 'text-blue-400 font-bold animate-pulse' : 'text-slate-500'}`}>
                {isBuretteLoaded ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                <span>2. Cargar NaOH</span>
              </div>
              <span className="text-slate-600">➔</span>

              <div className={`flex items-center gap-1.5 ${isSampleDissolved ? 'text-emerald-400 font-semibold' : currentStep === 3 ? 'text-purple-400 font-bold animate-pulse' : 'text-slate-500'}`}>
                {isSampleDissolved ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                <span>{currentPracticeNumber === 7 ? '3. Pipetear HCl' : '3. Pesar KHP'}</span>
              </div>
              <span className="text-slate-600">➔</span>

              <div className={`flex items-center gap-1.5 ${isBubblePurged ? 'text-emerald-400 font-semibold' : currentStep === 4 ? 'text-amber-400 font-bold animate-pulse' : 'text-slate-500'}`}>
                {isBubblePurged ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                <span>4. Purgar & Enrasar</span>
              </div>
              <span className="text-slate-600">➔</span>

              <div className={`flex items-center gap-1.5 ${indicatorDrops > 0 && isStirring ? 'text-emerald-400 font-semibold' : currentStep === 5 ? 'text-pink-400 font-bold animate-pulse' : 'text-slate-500'}`}>
                {indicatorDrops > 0 && isStirring ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                <span>5. Indicador & Agitador</span>
              </div>
              <span className="text-slate-600">➔</span>

              <div className={`flex items-center gap-1.5 ${currentStep === 6 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                <Circle size={13} />
                <span>6. Titular</span>
              </div>
            </>
          )}
        </div>

        <div className="text-[10px] text-slate-400 font-mono hidden xl:block">
          *Paso actual: {
            currentStep === 1 ? 'Presentar lista de materiales al ayudante' :
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
        {/* Mesada Virtual 2D (Conmutable entre Volumetría P4/P7 y Gravimetría P5) */}
        <section className="flex-1 h-full min-h-0 flex flex-col">
          {currentPracticeNumber === 5 ? (
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
              onLoadBurette={handleLoadBurette}
              onOpenTransferModal={handleOpenTransferModal}
              onAddIndicator={handleAddIndicator}
              onPurgeBubble={handlePurgeBubble}
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
            defects={engineRef.current.getState().defects}
            onOpenAuditModal={() => setIsAuditModalOpen(true)}
          />
        </section>

        {/* Botón Flotante en Móviles para abrir la Libreta */}
        <div className="lg:hidden fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setIsMobileNotebookOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-full shadow-2xl border border-blue-400 active:scale-95 transition-all"
          >
            <BookOpen size={16} />
            <span>Abrir Libreta de Laboratorio</span>
            <ChevronUp size={16} />
          </button>
        </div>

        {/* Cajón Deslizable Inferior (Bottom Sheet) para Smartphones */}
        {isMobileNotebookOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div className="h-[80vh] w-full bg-slate-900 rounded-t-3xl border-t border-slate-700 shadow-2xl overflow-hidden flex flex-col">
              <div className="p-3 bg-slate-800 flex items-center justify-between border-b border-slate-700">
                <span className="text-xs font-bold text-slate-200">Libreta de Laboratorio</span>
                <button
                  onClick={() => setIsMobileNotebookOpen(false)}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold text-slate-300"
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

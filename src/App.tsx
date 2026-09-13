import React, { useState, useRef, useCallback } from 'react';
import { LabBench } from './components/bench/LabBench';
import { LabNotebook } from './components/notebook/LabNotebook';
import { MeniscusLoupeModal } from './components/inspection/MeniscusLoupeModal';
import { AnalyticalBalanceModal } from './components/inspection/AnalyticalBalanceModal';
import { AuditModal } from './components/feedback/AuditModal';
import { MaterialSelectionModal } from './components/preparation/MaterialSelectionModal';
import { LabGuideModal } from './components/guide/LabGuideModal';
import { PracticeSelectorModal } from './components/navigation/PracticeSelectorModal';
import { ProcedureEngine } from './engine/procedureFsm';
import { evaluateBenchEquilibrium } from './engine/equilibrium';
import { PRACTICE_4_CONFIG } from './data/practiceConfig';
import { FlaskConical, BookOpen, ShieldCheck, ChevronUp, PackageCheck, HelpCircle, Layers, CheckCircle2, Circle } from 'lucide-react';

export const App: React.FC = () => {
  // Práctica actualmente seleccionada (por defecto P4: Estandarización de NaOH)
  const [currentPracticeNumber, setCurrentPracticeNumber] = useState<number>(4);

  // Masa nominal aleatoria objetivo para la balanza (~0.2150 g)
  const [targetMass] = useState<number>(() => Number((0.2150 + (Math.random() - 0.5) * 0.02).toFixed(4)));
  // Masa real pesada por el alumno (inicia en 0 hasta que pese en la balanza)
  const [actualSampleMass, setActualSampleMass] = useState<number>(0);
  const [trueNormality] = useState<number>(() => Number((0.1015 + (Math.random() - 0.5) * 0.006).toFixed(4)));

  // Instancia de la Máquina de Estados Procedimental (TDA)
  const engineRef = useRef<ProcedureEngine>(new ProcedureEngine());

  // Estado del flujo físico del experimento desde el inicio:
  const [isMaterialsApproved, setIsMaterialsApproved] = useState<boolean>(false);
  const [isBuretteLoaded, setIsBuretteLoaded] = useState<boolean>(false);
  const [isSampleDissolved, setIsSampleDissolved] = useState<boolean>(false);

  // La agitación empieza estrictamente APAGADA (en reposo, el alumno debe accionarla)
  const [isStirring, setIsStirring] = useState<boolean>(false);

  // Estado de simulación de fluidos
  const [deliveredMl, setDeliveredMl] = useState<number>(0);
  const [isStopcockOpen, setIsStopcockOpen] = useState<boolean>(false);
  const [flowRate, setFlowRate] = useState<'dropwise' | 'fast' | 'closed'>('dropwise');
  const [indicatorDrops, setIndicatorDrops] = useState<number>(0);
  const [isBubblePurged, setIsBubblePurged] = useState<boolean>(false);

  // Lecturas registradas transferidas a la libreta
  const [recordedV0, setRecordedV0] = useState<number>(0);
  const [recordedVf, setRecordedVf] = useState<number>(0);

  // Modales interactivos (el modal de materiales se abre de entrada si no fue aprobado aún)
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState<boolean>(true);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState<boolean>(false);
  const [isLoupeOpen, setIsLoupeOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isPracticeSelectorOpen, setIsPracticeSelectorOpen] = useState<boolean>(false);
  const [isMobileNotebookOpen, setIsMobileNotebookOpen] = useState<boolean>(false);

  // Evaluación físico-química del punto instantáneo (pH y color del erlenmeyer)
  const equilibrium = evaluateBenchEquilibrium(
    actualSampleMass > 0 ? actualSampleMass : targetMass,
    PRACTICE_4_CONFIG.primaryStandard.equivalentWeight,
    trueNormality,
    deliveredMl,
    indicatorDrops
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

  const handleSampleWeighedAndDissolved = (mass: number) => {
    setActualSampleMass(mass);
    setIsSampleDissolved(true);
    engineRef.current.completeMilestone('MS_ALIQUOT_DELIVERED');
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

  const handleResetBench = () => {
    engineRef.current = new ProcedureEngine();
    setDeliveredMl(0);
    setIsStopcockOpen(false);
    setFlowRate('dropwise');
    setIndicatorDrops(0);
    setIsBubblePurged(false);
    setIsStirring(false); // Siempre apagado al reiniciar
    setIsBuretteLoaded(false);
    setIsSampleDissolved(false);
    setActualSampleMass(0);
    setRecordedV0(0);
    setRecordedVf(0);
  };

  const handleSelectPractice = (practiceNum: number) => {
    setCurrentPracticeNumber(practiceNum);
    handleResetBench();
  };

  // Determinar paso actual para el Stepper de Laboratorio
  const currentStep = !isMaterialsApproved
    ? 1
    : !isBuretteLoaded
    ? 2
    : !isSampleDissolved
    ? 3
    : !isBubblePurged
    ? 4
    : indicatorDrops === 0 || !isStirring
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
              {currentPracticeNumber === 4
                ? 'Práctica 4: Estandarización de NaOH 0.1 N con Biftalato de Potasio'
                : `Práctica ${currentPracticeNumber}: Volumetría Ácido-Base`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Botón Selector de las 13 Prácticas */}
          <button
            onClick={() => setIsPracticeSelectorOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold shadow transition-all active:scale-95"
            title="Ver catálogo de las 13 prácticas del plan de estudios"
          >
            <Layers size={15} className="text-blue-400" />
            <span className="hidden sm:inline">Prácticas (13)</span>
            <span className="sm:hidden">P{currentPracticeNumber}</span>
          </button>

          {/* Botón Guía Oficial */}
          <button
            onClick={() => setIsGuideModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-blue-950/60 hover:bg-blue-900/80 border border-blue-700/60 text-blue-300 rounded-xl text-xs font-semibold shadow transition-all active:scale-95"
            title="Ver Guía de Laboratorio Real y de la Mesada"
          >
            <HelpCircle size={15} />
            <span className="hidden sm:inline">Guía de Práctica</span>
            <span className="sm:hidden">Guía</span>
          </button>

          {/* Botón Solicitud Materiales y Reactivos */}
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

          {/* Botón Auditoría RAG */}
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

      {/* Stepper de Laboratorio: Guía de Pasos Procedimentales */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 sm:px-6 py-2 overflow-x-auto flex items-center justify-between gap-3 text-[11px] shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className={`flex items-center gap-1.5 ${isMaterialsApproved ? 'text-emerald-400 font-semibold' : 'text-purple-400 font-bold animate-pulse'}`}>
            {isMaterialsApproved ? <CheckCircle2 size={13} /> : <Circle size={13} />}
            <span>1. Materiales</span>
          </div>
          <span className="text-slate-600">➔</span>

          <div className={`flex items-center gap-1.5 ${isBuretteLoaded ? 'text-emerald-400 font-semibold' : currentStep === 2 ? 'text-blue-400 font-bold animate-pulse' : 'text-slate-500'}`}>
            {isBuretteLoaded ? <CheckCircle2 size={13} /> : <Circle size={13} />}
            <span>2. Cargar NaOH</span>
          </div>
          <span className="text-slate-600">➔</span>

          <div className={`flex items-center gap-1.5 ${isSampleDissolved ? 'text-emerald-400 font-semibold' : currentStep === 3 ? 'text-purple-400 font-bold animate-pulse' : 'text-slate-500'}`}>
            {isSampleDissolved ? <CheckCircle2 size={13} /> : <Circle size={13} />}
            <span>3. Pesar KHP</span>
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
            <span>6. Titular & Evaluar</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-mono hidden xl:block">
          *Paso actual: {
            currentStep === 1 ? 'Presentar lista al ayudante' :
            currentStep === 2 ? 'Cargar bureta con solución de NaOH' :
            currentStep === 3 ? 'Pesar KHP en balanza y disolver' :
            currentStep === 4 ? 'Purgar burbuja y enrasar' :
            currentStep === 5 ? 'Agregar gotas de fenolftaleína y activar agitador' :
            'Goteo hasta primer viraje rosa tenue'
          }
        </div>
      </div>

      {/* Contenedor Principal con Layout Responsivo */}
      <main className="flex-1 p-2.5 sm:p-4 flex flex-col lg:flex-row gap-3 sm:gap-4 overflow-hidden min-h-0 relative">
        {/* Mesada Virtual 2D (60% en desktop, 100% en móvil) */}
        <section className="flex-1 h-full min-h-0 flex flex-col">
          <LabBench
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
            onOpenBalanceModal={() => setIsBalanceModalOpen(true)}
            onAddIndicator={handleAddIndicator}
            onPurgeBubble={handlePurgeBubble}
            onToggleStirring={handleToggleStirring}
            onResetBench={handleResetBench}
            onTickTitration={handleTickTitration}
          />
        </section>

        {/* Libreta de Laboratorio Digital (Desktop: 40% fijo al costado) */}
        <section className="hidden lg:flex flex-col w-[380px] xl:w-[420px] h-full min-h-0 shrink-0">
          <LabNotebook
            initialVolume={recordedV0}
            finalVolume={recordedVf}
            sampleMass={actualSampleMass > 0 ? actualSampleMass : targetMass}
            trueNormality={trueNormality}
            defects={engineRef.current.getState().defects}
            onOpenAuditModal={() => setIsAuditModalOpen(true)}
          />
        </section>

        {/* Botón Flotante en Móviles para abrir la Libreta (Bottom Sheet) */}
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
                  initialVolume={recordedV0}
                  finalVolume={recordedVf}
                  sampleMass={actualSampleMass > 0 ? actualSampleMass : targetMass}
                  trueNormality={trueNormality}
                  defects={engineRef.current.getState().defects}
                  onOpenAuditModal={() => setIsAuditModalOpen(true)}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modales de Inspección, Materiales, Balanza, Guía, Selector de Prácticas y Auditoría */}
      <MaterialSelectionModal
        isOpen={isMaterialsModalOpen}
        onClose={() => setIsMaterialsModalOpen(false)}
        onValidationSuccess={() => {
          setIsMaterialsApproved(true);
        }}
      />

      <AnalyticalBalanceModal
        isOpen={isBalanceModalOpen}
        targetSampleMass={targetMass}
        onClose={() => setIsBalanceModalOpen(false)}
        onSampleWeighedAndDissolved={handleSampleWeighedAndDissolved}
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

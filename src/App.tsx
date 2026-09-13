import React, { useState, useRef, useCallback } from 'react';
import { LabBench } from './components/bench/LabBench';
import { LabNotebook } from './components/notebook/LabNotebook';
import { MeniscusLoupeModal } from './components/inspection/MeniscusLoupeModal';
import { AuditModal } from './components/feedback/AuditModal';
import { MaterialSelectionModal } from './components/preparation/MaterialSelectionModal';
import { LabGuideModal } from './components/guide/LabGuideModal';
import { PracticeSelectorModal } from './components/navigation/PracticeSelectorModal';
import { ProcedureEngine } from './engine/procedureFsm';
import { evaluateBenchEquilibrium } from './engine/equilibrium';
import { PRACTICE_4_CONFIG } from './data/practiceConfig';
import { FlaskConical, BookOpen, ShieldCheck, ChevronUp, PackageCheck, HelpCircle, Layers } from 'lucide-react';

export const App: React.FC = () => {
  // Práctica actualmente seleccionada (por defecto P4: Estandarización de NaOH)
  const [currentPracticeNumber, setCurrentPracticeNumber] = useState<number>(4);

  // Parámetros de la sesión aleatorizados para el estudiante:
  // Masa nominal de KHP: entre 0.2050 y 0.2350 g
  // Normalidad verdadera de NaOH: entre 0.0985 y 0.1035 N
  const [sampleMass] = useState<number>(() => Number((0.2150 + (Math.random() - 0.5) * 0.02).toFixed(4)));
  const [trueNormality] = useState<number>(() => Number((0.1015 + (Math.random() - 0.5) * 0.006).toFixed(4)));

  // Instancia de la Máquina de Estados Procedimental (TDA)
  const engineRef = useRef<ProcedureEngine>(new ProcedureEngine());

  // Estado reactivo de la simulación
  const [deliveredMl, setDeliveredMl] = useState<number>(0);
  const [isStopcockOpen, setIsStopcockOpen] = useState<boolean>(false);
  const [flowRate, setFlowRate] = useState<'dropwise' | 'fast' | 'closed'>('dropwise');
  const [indicatorDrops, setIndicatorDrops] = useState<number>(0);
  const [isBubblePurged, setIsBubblePurged] = useState<boolean>(false);
  const [isStirring, setIsStirring] = useState<boolean>(true);

  // Control de preparación de materiales y reactivos
  const [isMaterialsApproved, setIsMaterialsApproved] = useState<boolean>(false);

  // Lecturas registradas transferidas a la libreta
  const [recordedV0, setRecordedV0] = useState<number>(0);
  const [recordedVf, setRecordedVf] = useState<number>(0);

  // Modales y vistas
  const [isLoupeOpen, setIsLoupeOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isPracticeSelectorOpen, setIsPracticeSelectorOpen] = useState<boolean>(false);
  const [isMobileNotebookOpen, setIsMobileNotebookOpen] = useState<boolean>(false);

  // Evaluación físico-química del punto instantáneo (pH y color del erlenmeyer)
  const equilibrium = evaluateBenchEquilibrium(
    sampleMass,
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
    setIsStopcockOpen((prev) => !prev);
  };

  const handlePurgeBubble = () => {
    engineRef.current.purgeBuretteBubble();
    setIsBubblePurged(true);
  };

  const handleAddIndicator = () => {
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
    setIsStirring(true);
    setRecordedV0(0);
    setRecordedVf(0);
  };

  const handleSelectPractice = (practiceNum: number) => {
    setCurrentPracticeNumber(practiceNum);
    handleResetBench();
  };

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

      {/* Banner Notificación de Solicitud de Materiales si aún no fue realizada */}
      {!isMaterialsApproved && (
        <div className="bg-purple-950/80 border-b border-purple-800/80 px-4 py-2 flex items-center justify-between text-xs text-purple-200">
          <div className="flex items-center gap-2">
            <PackageCheck size={16} className="text-purple-400 shrink-0" />
            <span>
              <strong>Control de Entrada de Laboratorio:</strong> Antes de comenzar, debes presentar al ayudante la lista de materiales y reactivos que vas a utilizar.
            </span>
          </div>
          <button
            onClick={() => setIsMaterialsModalOpen(true)}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold rounded-lg text-xs shadow transition-all shrink-0 ml-2"
          >
            Llenar Solicitud ➔
          </button>
        </div>
      )}

      {/* Contenedor Principal con Layout Responsivo */}
      <main className="flex-1 p-2.5 sm:p-4 flex flex-col lg:flex-row gap-3 sm:gap-4 overflow-hidden min-h-0 relative">
        {/* Mesada Virtual 2D (60% en desktop, 100% en móvil) */}
        <section className="flex-1 h-full min-h-0 flex flex-col">
          <LabBench
            currentDeliveredMl={deliveredMl}
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
            sampleMass={sampleMass}
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
                  sampleMass={sampleMass}
                  trueNormality={trueNormality}
                  defects={engineRef.current.getState().defects}
                  onOpenAuditModal={() => setIsAuditModalOpen(true)}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modales de Inspección, Materiales, Guía, Selector de Prácticas y Auditoría */}
      <MeniscusLoupeModal
        isOpen={isLoupeOpen}
        currentActualVolumeMl={deliveredMl}
        initialReadingRecorded={recordedV0 > 0}
        onClose={() => setIsLoupeOpen(false)}
        onTransferReading={handleTransferReading}
        onParallaxChanged={handleParallaxChanged}
      />

      <MaterialSelectionModal
        isOpen={isMaterialsModalOpen}
        onClose={() => setIsMaterialsModalOpen(false)}
        onValidationSuccess={() => {
          setIsMaterialsApproved(true);
        }}
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

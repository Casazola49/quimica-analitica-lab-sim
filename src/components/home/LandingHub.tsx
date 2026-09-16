import React, { useState } from 'react';
import { FlaskConical, BookOpen, ShieldCheck, HelpCircle, Layers, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { ALL_PRACTICES } from '../../data/allPractices';

interface LandingHubProps {
  onSelectPractice: (practiceNumber: number) => void;
  onOpenGuide: (practiceNumber?: number) => void;
  onOpenAuditRAG: () => void;
}

export const LandingHub: React.FC<LandingHubProps> = ({
  onSelectPractice,
  onOpenGuide,
  onOpenAuditRAG,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'active' | 'volumetry' | 'gravimetry' | 'instrumental'>('all');

  const filteredPractices = ALL_PRACTICES.filter((p) => {
    if (filterCategory === 'active') return p.status === 'active';
    if (filterCategory === 'volumetry') return p.category === 'volumetry';
    if (filterCategory === 'gravimetry') return p.category === 'gravimetry';
    if (filterCategory === 'instrumental') return p.category === 'instrumental';
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      {/* Barra de Navegación del Portal */}
      <header className="h-16 px-4 sm:px-8 bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/20 border border-blue-500/40 rounded-xl text-blue-400 shadow-inner">
            <FlaskConical size={22} />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Simulador de Química Analítica Cuantitativa</span>
              <span className="text-[10px] px-2 py-0.5 bg-blue-900/40 text-blue-300 border border-blue-700/50 rounded-full font-mono hidden md:inline">
                UMSS 5to Semestre
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Facultad de Ciencias y Tecnología — Departamento de Química
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenGuide(4)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold shadow transition-all active:scale-95"
          >
            <HelpCircle size={15} className="text-blue-400" />
            <span className="hidden sm:inline">Guía Metodológica</span>
            <span className="sm:hidden">Guía</span>
          </button>

          <button
            onClick={onOpenAuditRAG}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 rounded-xl text-xs font-semibold shadow transition-all active:scale-95"
          >
            <ShieldCheck size={15} className="text-cyan-400" />
            <span className="hidden sm:inline">Tríada Digital RAG</span>
            <span className="sm:hidden">RAG</span>
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-10">
        {/* HERO INSTITUCIONAL */}
        <section className="text-center space-y-4 pt-4 sm:pt-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/70 border border-blue-600/40 rounded-full text-blue-300 text-xs font-semibold shadow">
            <Sparkles size={14} className="text-cyan-400" />
            <span>Entorno Interactivo de Mesada • Costo $0 • PWA Offline</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Laboratorio Virtual de Química Analítica Cuantitativa
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Plataforma pedagógica interactiva para estudiantes de Ingeniería Química de la UMSS. Domine las técnicas volumétricas, gravimétricas e instrumentales con simulación física precisa, auditoría de errores de técnica analítica (TDA) y retroalimentación fundamentada en los libros oficiales de la Tríada Digital.
          </p>
        </section>

        {/* METODOLOGÍA DE LABORATORIO EN 3 PASOS */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
              Metodología del Simulador
            </h3>
            <h4 className="text-lg font-bold text-slate-100">
              ¿Cómo Funciona Cada Práctica en el Laboratorio Virtual?
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Paso 1 */}
            <div className="p-5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl shadow-lg space-y-2.5 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-700/50 flex items-center justify-center text-purple-400 font-bold text-sm">
                1
              </div>
              <h5 className="font-bold text-slate-100 text-sm">
                Control de Entrada: Requisición de Materiales
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Antes de iniciar la mesada, debe presentar al ayudante de laboratorio la lista exacta de reactivos y vidriería requeridos, discriminando los distractores innecesarios.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="p-5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl shadow-lg space-y-2.5 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-700/50 flex items-center justify-center text-blue-400 font-bold text-sm">
                2
              </div>
              <h5 className="font-bold text-slate-100 text-sm">
                Mesada 2D y Cuidado de Técnica Analítica (TDA)
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Opere buretas vectoriales con purga de burbujas, balanza analítica a 0.1 mg, pipetas aforadas con propipeta, lupa de menisco 4x sin error de paralaje o consola espectrofotométrica.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="p-5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl shadow-lg space-y-2.5 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-700/50 flex items-center justify-center text-emerald-400 font-bold text-sm">
                3
              </div>
              <h5 className="font-bold text-slate-100 text-sm">
                Libreta de Laboratorio & Tríada Digital
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Registre masas y gastos netos, calcule concentraciones con 4 cifras significativas rigurosas y reciba la auditoría pedagógica con citas textuales de Skoog, Day & Underwood y Aguilar.
              </p>
            </div>
          </div>
        </section>

        {/* CATÁLOGO DE PRÁCTICAS DEL PLAN DE ESTUDIOS */}
        <section className="space-y-5 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Layers className="text-blue-400" size={20} />
                <span>Selecciona la Práctica de Laboratorio a Realizar</span>
              </h3>
              <p className="text-xs text-slate-400">
                13 prácticas estructuradas del plan curricular de 5to semestre
              </p>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                  filterCategory === 'all'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Todas (13)
              </button>
              <button
                onClick={() => setFilterCategory('active')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                  filterCategory === 'active'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                ● Operativas en Mesada (4)
              </button>
              <button
                onClick={() => setFilterCategory('volumetry')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                  filterCategory === 'volumetry'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Volumetría
              </button>
              <button
                onClick={() => setFilterCategory('gravimetry')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                  filterCategory === 'gravimetry'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Gravimetría
              </button>
              <button
                onClick={() => setFilterCategory('instrumental')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                  filterCategory === 'instrumental'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Instrumental
              </button>
            </div>
          </div>

          {/* GRID DE PRÁCTICAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPractices.map((practice) => {
              const isActive = practice.status === 'active';

              return (
                <div
                  key={practice.number}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isActive
                      ? 'bg-slate-900 border-blue-500/50 hover:border-blue-400 shadow-xl ring-1 ring-blue-500/20'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Badge de Unidad y Estado */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                        P{practice.number} • Unidad {practice.unitNumber}
                      </span>

                      {isActive ? (
                        <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-600 text-emerald-400 text-[10px] font-bold rounded-full flex items-center gap-1 shadow-sm">
                          <CheckCircle2 size={11} />
                          <span>Mesada Activa</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 text-[10px] rounded-full">
                          Plan Curricular
                        </span>
                      )}
                    </div>

                    {/* Título */}
                    <h4 className="font-bold text-sm text-slate-100 leading-snug">
                      {practice.title}
                    </h4>

                    {/* Objetivo */}
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {practice.shortObjective}
                    </p>

                    {/* Reactivos Clave */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Reactivos / Patrones:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {practice.keyReagents.slice(0, 3).map((r, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-950 text-slate-300 border border-slate-800 rounded text-[10px] truncate max-w-[200px]"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Botón de Acción */}
                  <div className="pt-4 mt-3 border-t border-slate-800">
                    {isActive ? (
                      <button
                        onClick={() => onSelectPractice(practice.number)}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Iniciar Laboratorio P{practice.number}</span>
                        <ArrowRight size={15} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenGuide(practice.number)}
                        className="w-full py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-700"
                      >
                        <BookOpen size={13} />
                        <span>Ver Ficha y Objetivos Curriculares</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Pie de página institucional */}
      <footer className="mt-12 py-6 px-4 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">
          Laboratorio de Química Analítica Cuantitativa (SISS: 2004061) — Carrera de Ingeniería Química
        </p>
        <p className="text-[11px] text-slate-500">
          Universidad Mayor de San Simón (UMSS) • Cochabamba, Bolivia • Código Abierto bajo Licencia MIT
        </p>
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import { BookOpen, ShieldCheck, HelpCircle, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ALL_PRACTICES } from '../../data/allPractices';
import { HankoSeal } from '../common/HankoSeal';

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
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#f5f5f5] antialiased selection:bg-[#dc2626] selection:text-white relative overflow-hidden font-serif">
      {/* Marca de agua caligráfica Sumi-e en el fondo (Kanji de Alquimia y Transmutación) */}
      <div className="absolute -top-16 -right-16 select-none pointer-events-none opacity-[0.035] text-[280px] font-serif leading-none text-white z-0">
        錬
      </div>
      <div className="absolute top-1/2 -left-20 select-none pointer-events-none opacity-[0.025] text-[240px] font-serif leading-none text-[#dc2626] z-0">
        墨
      </div>

      {/* Barra de Navegación del Portal Sumi-e */}
      <header className="h-16 px-4 sm:px-8 bg-[#0a0a0a]/95 border-b border-[#222222] backdrop-blur sticky top-0 z-30 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <HankoSeal size="md" variant="stamp" className="shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black tracking-wider text-white uppercase">
                Alquímica-33
              </h1>
              <span className="text-[10px] px-2 py-0.5 bg-[#1f0808] border border-[#dc2626]/70 text-[#ef4444] rounded-full font-mono font-bold">
                水墨画 • 5to Semestre
              </span>
            </div>
            <p className="text-[11px] text-[#888888] font-sans hidden sm:block">
              Química Analítica Cuantitativa • UMSS Cochabamba
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-sans">
          <button
            onClick={() => onOpenGuide(4)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] hover:bg-[#222222] border border-[#333333] hover:border-white text-[#d4d4d4] hover:text-white rounded-xl text-xs font-semibold shadow transition-all active:scale-95 cursor-pointer"
          >
            <HelpCircle size={15} className="text-[#dc2626]" />
            <span className="hidden sm:inline">Guía de Práctica</span>
            <span className="sm:hidden">Guía</span>
          </button>

          <button
            onClick={onOpenAuditRAG}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1c0808] hover:bg-[#2c0d0d] border border-[#dc2626]/60 text-[#ef4444] rounded-xl text-xs font-bold shadow-lg shadow-red-950/40 transition-all active:scale-95 cursor-pointer"
          >
            <ShieldCheck size={15} />
            <span className="hidden sm:inline">Tríada Digital RAG</span>
            <span className="sm:hidden">RAG</span>
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-12 z-10 relative">
        {/* HERO INSTITUCIONAL SUMI-E */}
        <section className="text-center space-y-5 pt-6 sm:pt-10 max-w-3xl mx-auto">
          {/* Badge caligráfico */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#121212] border border-[#dc2626]/50 rounded-full text-[#f0f0f0] text-xs font-mono tracking-wider shadow-[0_2px_16px_rgba(220,38,38,0.25)]">
            <span className="text-[#dc2626] font-serif font-black text-sm">朱</span>
            <span className="font-bold">ESTILO SUIBOKUGA (水墨画) • ROJO, NEGRO Y BLANCO</span>
          </div>

          <h2 className="text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight uppercase font-serif">
            Laboratorio Virtual de Química Analítica Cuantitativa
          </h2>

          {/* Línea divisoria de pincel Sumi */}
          <div className="flex items-center justify-center gap-2 py-1">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#dc2626]" />
            <div className="w-2 h-2 rotate-45 bg-[#dc2626]" />
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#dc2626]" />
          </div>

          <p className="text-xs sm:text-sm text-[#cccccc] font-sans leading-relaxed max-w-2xl mx-auto">
            Entorno interactivo para los estudiantes de Ingeniería Química de la UMSS. Desarrolle destreza experimental en volumetría, gravimetría y espectrofotometría con instrumental analítico de precisión, auditoría de técnica (TDA) y referencias bibliográficas de la Tríada Digital.
          </p>
        </section>

        {/* METODOLOGÍA DE LABORATORIO EN 3 PASOS (ESTILO ROLLOS JAPONESES) */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-xs font-mono uppercase text-[#ef4444] font-bold tracking-widest">
              PROTOCOLO ACADÉMICO EN TRES ETAPAS
            </h3>
            <h4 className="text-lg font-bold text-white uppercase tracking-wide">
              Flujo Metrológico de Cada Laboratorio
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Paso 1 */}
            <div className="p-6 bg-[#0f0f0f] border-l-4 border-l-[#dc2626] border-y border-r border-[#242424] rounded-2xl shadow-xl space-y-3 relative overflow-hidden group hover:border-[#dc2626] transition-all">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#1f0808] border border-[#dc2626]/70 flex items-center justify-center text-[#ef4444] font-mono font-black text-base shadow">
                  1
                </div>
                <span className="text-[11px] font-mono text-[#777777] uppercase tracking-wider">
                  Etapa Inicial
                </span>
              </div>
              <h5 className="font-bold text-white text-sm">
                Control de Entrada: Requisición de Materiales
              </h5>
              <p className="text-xs text-[#a0a0a0] font-sans leading-relaxed">
                Presente la lista exacta de reactivos y vidriería requeridos para la práctica, identificando y descartando los distractores no cuantitativos.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="p-6 bg-[#0f0f0f] border-l-4 border-l-[#dc2626] border-y border-r border-[#242424] rounded-2xl shadow-xl space-y-3 relative overflow-hidden group hover:border-[#dc2626] transition-all">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#1f0808] border border-[#dc2626]/70 flex items-center justify-center text-[#ef4444] font-mono font-black text-base shadow">
                  2
                </div>
                <span className="text-[11px] font-mono text-[#777777] uppercase tracking-wider">
                  Mesada Virtual
                </span>
              </div>
              <h5 className="font-bold text-white text-sm">
                Mesada 2D y Cuidado de Técnica Analítica (TDA)
              </h5>
              <p className="text-xs text-[#a0a0a0] font-sans leading-relaxed">
                Opere la balanza analítica Mettler, purgue burbujas en el pico de la bureta, añada indicador con el cuentagotas o calibre a 508 nm en el espectrofotómetro.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="p-6 bg-[#0f0f0f] border-l-4 border-l-[#dc2626] border-y border-r border-[#242424] rounded-2xl shadow-xl space-y-3 relative overflow-hidden group hover:border-[#dc2626] transition-all">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#1f0808] border border-[#dc2626]/70 flex items-center justify-center text-[#ef4444] font-mono font-black text-base shadow">
                  3
                </div>
                <span className="text-[11px] font-mono text-[#777777] uppercase tracking-wider">
                  Dictamen & PDF
                </span>
              </div>
              <h5 className="font-bold text-white text-sm">
                Libreta de Laboratorio & Tríada Digital
              </h5>
              <p className="text-xs text-[#a0a0a0] font-sans leading-relaxed">
                Calcule concentraciones con 4 cifras significativas, determine el error relativo %, consulte las citas de Skoog y descargue su informe firmado.
              </p>
            </div>
          </div>
        </section>

        {/* CATÁLOGO DE PRÁCTICAS DEL PLAN DE ESTUDIOS */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262626] pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                <Layers className="text-[#dc2626]" size={20} />
                <span>Selecciona la Práctica de Laboratorio a Realizar</span>
              </h3>
              <p className="text-xs text-[#888888] font-sans">
                13 prácticas estructuradas del plan de estudios oficial de la UMSS
              </p>
            </div>

            {/* Filtros estilo Sumi-e */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 sm:pb-0 font-sans">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  filterCategory === 'all'
                    ? 'bg-[#dc2626] text-white shadow-[0_2px_12px_rgba(220,38,38,0.4)]'
                    : 'bg-[#141414] text-[#888888] hover:text-white border border-[#2a2a2a]'
                }`}
              >
                Todas (13)
              </button>
              <button
                onClick={() => setFilterCategory('active')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  filterCategory === 'active'
                    ? 'bg-[#dc2626] text-white shadow-[0_2px_12px_rgba(220,38,38,0.4)]'
                    : 'bg-[#141414] text-[#888888] hover:text-white border border-[#2a2a2a]'
                }`}
              >
                ● Operativas (4)
              </button>
              <button
                onClick={() => setFilterCategory('volumetry')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  filterCategory === 'volumetry'
                    ? 'bg-[#dc2626] text-white shadow-[0_2px_12px_rgba(220,38,38,0.4)]'
                    : 'bg-[#141414] text-[#888888] hover:text-white border border-[#2a2a2a]'
                }`}
              >
                Volumetría
              </button>
              <button
                onClick={() => setFilterCategory('gravimetry')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  filterCategory === 'gravimetry'
                    ? 'bg-[#dc2626] text-white shadow-[0_2px_12px_rgba(220,38,38,0.4)]'
                    : 'bg-[#141414] text-[#888888] hover:text-white border border-[#2a2a2a]'
                }`}
              >
                Gravimetría
              </button>
              <button
                onClick={() => setFilterCategory('instrumental')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  filterCategory === 'instrumental'
                    ? 'bg-[#dc2626] text-white shadow-[0_2px_12px_rgba(220,38,38,0.4)]'
                    : 'bg-[#141414] text-[#888888] hover:text-white border border-[#2a2a2a]'
                }`}
              >
                Instrumental
              </button>
            </div>
          </div>

          {/* GRID DE PRÁCTICAS CON ESTILO ALQUÍMICA-33 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPractices.map((practice) => {
              const isActive = practice.status === 'active';

              return (
                <div
                  key={practice.number}
                  className={`p-6 rounded-2xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                    isActive
                      ? 'bg-[#0f0f0f] border-[#333333] hover:border-[#dc2626] shadow-2xl hover:shadow-[0_4px_30px_rgba(220,38,38,0.22)] ring-1 ring-[#dc2626]/20'
                      : 'bg-[#0a0a0a]/80 border-[#1f1f1f] hover:border-[#333333]'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Badge de Unidad y Estado */}
                    <div className="flex items-center justify-between gap-2 font-mono">
                      <span className="text-[10px] px-2.5 py-0.5 bg-[#171717] text-[#cccccc] rounded border border-[#2e2e2e]">
                        P{practice.number} • Unidad {practice.unitNumber}
                      </span>

                      {isActive ? (
                        <span className="px-2.5 py-0.5 bg-[#1f0808] border border-[#dc2626]/70 text-[#ef4444] text-[10px] font-bold rounded-full flex items-center gap-1">
                          <CheckCircle2 size={11} />
                          <span>Mesada Activa</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#141414] border border-[#262626] text-[#777777] text-[10px] rounded-full">
                          Plan Oficial
                        </span>
                      )}
                    </div>

                    {/* Título */}
                    <h4 className="font-bold text-base text-white leading-snug tracking-tight font-serif">
                      {practice.title}
                    </h4>

                    {/* Objetivo */}
                    <p className="text-xs text-[#9e9e9e] font-sans leading-relaxed line-clamp-3">
                      {practice.shortObjective}
                    </p>

                    {/* Reactivos Clave */}
                    <div className="space-y-1.5 pt-1 font-sans">
                      <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">
                        Reactivos Principales:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {practice.keyReagents.slice(0, 3).map((r, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-[#141414] text-[#cccccc] border border-[#262626] rounded text-[10px] truncate max-w-[200px]"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Botón de Acción */}
                  <div className="pt-5 mt-4 border-t border-[#222222] font-sans">
                    {isActive ? (
                      <button
                        onClick={() => onSelectPractice(practice.number)}
                        className="w-full py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-[0.98] text-white font-bold rounded-xl text-xs shadow-lg shadow-red-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                      >
                        <span>Iniciar Laboratorio P{practice.number}</span>
                        <ArrowRight size={15} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenGuide(practice.number)}
                        className="w-full py-2 bg-[#141414] hover:bg-[#1f1f1f] text-[#aaaaaa] hover:text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 border border-[#2b2b2b] cursor-pointer"
                      >
                        <BookOpen size={13} />
                        <span>Ficha y Objetivos Curriculares</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Pie de página institucional Alquímica-33 */}
      <footer className="mt-16 py-8 px-4 bg-[#0a0a0a] border-t border-[#222222] text-center text-xs text-[#777777] font-sans space-y-2 z-10 relative">
        <div className="flex items-center justify-center gap-3">
          <HankoSeal size="sm" variant="badge" />
        </div>
        <p className="font-semibold text-[#cccccc]">
          Laboratorio de Química Analítica Cuantitativa (SISS: 2004061) — Carrera de Ingeniería Química
        </p>
        <p className="text-[11px] text-[#555555]">
          Universidad Mayor de San Simón (UMSS) • Cochabamba, Bolivia • Grupo Alquímica-33
        </p>
      </footer>
    </div>
  );
};

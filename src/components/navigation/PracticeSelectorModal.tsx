import React, { useState } from 'react';
import { X, CheckCircle2, FlaskConical, Filter, Layers, ArrowRight } from 'lucide-react';
import { ALL_PRACTICES, PracticeSummary } from '../../data/allPractices';

interface PracticeSelectorModalProps {
  isOpen: boolean;
  currentPracticeNumber: number;
  onClose: () => void;
  onSelectPractice: (practiceNumber: number) => void;
}

export const PracticeSelectorModal: React.FC<PracticeSelectorModalProps> = ({
  isOpen,
  currentPracticeNumber,
  onClose,
  onSelectPractice,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'volumetry' | 'gravimetry' | 'instrumental' | 'preparatory'>('all');
  const [selectedPracticeDetail, setSelectedPracticeDetail] = useState<PracticeSummary | null>(
    ALL_PRACTICES.find((p) => p.number === currentPracticeNumber) || ALL_PRACTICES[3]
  );

  if (!isOpen) return null;

  const filteredPractices = ALL_PRACTICES.filter((p) => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Encabezado */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 border border-blue-500/40 rounded-xl text-blue-400">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Plan de Estudios: 13 Prácticas de Laboratorio (UMSS)
              </h3>
              <p className="text-[11px] text-slate-400">
                Laboratorio de Química Analítica Cuantitativa — 5to Semestre Ing. Química
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Barra de Filtros */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
            <Filter size={13} /> Filtrar:
          </span>
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all shrink-0 ${
              filterCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Todas (13)
          </button>
          <button
            onClick={() => setFilterCategory('volumetry')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all shrink-0 ${
              filterCategory === 'volumetry'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Volumetría (P4, P6-P10)
          </button>
          <button
            onClick={() => setFilterCategory('gravimetry')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all shrink-0 ${
              filterCategory === 'gravimetry'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Gravimetría (P5)
          </button>
          <button
            onClick={() => setFilterCategory('instrumental')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all shrink-0 ${
              filterCategory === 'instrumental'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Instrumental (P11-P13)
          </button>
          <button
            onClick={() => setFilterCategory('preparatory')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all shrink-0 ${
              filterCategory === 'preparatory'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Metrología (P1-P3)
          </button>
        </div>

        {/* Contenido: Lista a la izquierda (45%) y Ficha de Detalle a la derecha (55%) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden text-xs">
          {/* Lista de Prácticas */}
          <div className="w-full md:w-1/2 border-r border-slate-800 overflow-y-auto p-3 space-y-2">
            {filteredPractices.map((p) => {
              const isSelected = selectedPracticeDetail?.number === p.number;

              return (
                <div
                  key={p.number}
                  onClick={() => setSelectedPracticeDetail(p)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/60 border-blue-500 shadow-md'
                      : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/70 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-100 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] font-mono text-cyan-300">
                        P{p.number}
                      </span>
                      <span className="truncate max-w-[200px]">{p.title}</span>
                    </span>

                    {/* Badge de Estado */}
                    {p.status === 'active' ? (
                      <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-600 text-emerald-300 font-bold text-[9px] rounded-full shrink-0">
                        ● Operativa
                      </span>
                    ) : p.status === 'specified' ? (
                      <span className="px-2 py-0.5 bg-blue-950 border border-blue-600 text-blue-300 font-medium text-[9px] rounded-full shrink-0">
                        Especificada
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-slate-400 text-[9px] rounded-full shrink-0">
                        Plan Oficial
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {p.shortObjective}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Ficha de Detalle de la Práctica Seleccionada */}
          <div className="w-full md:w-1/2 p-5 overflow-y-auto bg-slate-950/50 space-y-4">
            {selectedPracticeDetail ? (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-blue-400 font-bold tracking-wider">
                      {selectedPracticeDetail.unitTitle} (Unidad {selectedPracticeDetail.unitNumber})
                    </span>
                    {selectedPracticeDetail.status === 'active' && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 size={13} /> Lista para simular
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 mt-1">
                    P{selectedPracticeDetail.number}: {selectedPracticeDetail.title}
                  </h4>
                </div>

                {/* Objetivo */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Objetivo Formativo
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {selectedPracticeDetail.shortObjective}
                  </p>
                </div>

                {/* Reactivos Principales */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Reactivos y Patrones Químicos
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPracticeDetail.keyReagents.map((r, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-purple-950/40 border border-purple-800/50 text-purple-200 text-[10px] rounded-lg"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Instrumental Requerido */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Instrumental y Material de Vidrio
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPracticeDetail.keyEquipment.map((e, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-950/40 border border-blue-800/50 text-blue-200 text-[10px] rounded-lg"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botón de Cargar en Mesada */}
                <div className="pt-3 border-t border-slate-800">
                  {selectedPracticeDetail.status === 'active' ? (
                    <button
                      onClick={() => {
                        onSelectPractice(selectedPracticeDetail.number);
                        onClose();
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                    >
                      <FlaskConical size={16} />
                      <span>Cargar Práctica {selectedPracticeDetail.number} en la Mesada Virtual</span>
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-center space-y-1">
                      <span className="text-[11px] text-amber-300 font-semibold">
                        Especificación técnica y curricular registrada (ADR)
                      </span>
                      <p className="text-[10px] text-slate-400">
                        El protocolo, reactivos y cálculos están documentados en la ontología oficial. La mesada volumétrica actual está activa en P4/P7.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Pie */}
        <div className="p-3.5 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Ontología sincronizada con <code className="text-cyan-300 font-mono">curriculum_spec.json</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-semibold text-slate-200"
          >
            Cerrar Selector
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, CheckCircle2, FlaskConical, Filter, ArrowRight } from 'lucide-react';
import { ALL_PRACTICES, PracticeSummary } from '../../data/allPractices';
import { HankoSeal } from '../common/HankoSeal';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none font-sans">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a] border border-[#262626] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Encabezado Sumi-e */}
        <div className="p-4 bg-[#121212] border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HankoSeal size="sm" variant="stamp" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
                Plan Curricular: 13 Prácticas de Laboratorio (UMSS)
              </h3>
              <p className="text-[11px] text-[#888888]">
                Química Analítica Cuantitativa • 5to Semestre Ing. Química
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#666666] hover:text-white rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Barra de Filtros */}
        <div className="px-4 py-2.5 bg-[#0e0e0e] border-b border-[#222222] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#666666] flex items-center gap-1 shrink-0 font-bold uppercase tracking-wider text-[10px]">
            <Filter size={12} className="text-[#dc2626]" /> Filtrar:
          </span>
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-[#dc2626] text-white shadow-[0_2px_8px_rgba(220,38,38,0.4)]'
                : 'bg-[#141414] text-[#888888] hover:text-white border border-[#2a2a2a]'
            }`}
          >
            Todas (13)
          </button>
          <button
            onClick={() => setFilterCategory('volumetry')}
            className={`px-3 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
              filterCategory === 'volumetry'
                ? 'bg-[#dc2626] text-white shadow-[0_2px_8px_rgba(220,38,38,0.4)]'
                : 'bg-[#141414] text-[#888888] hover:text-white border border-[#2a2a2a]'
            }`}
          >
            Volumetría (P4, P6-P10)
          </button>
          <button
            onClick={() => setFilterCategory('gravimetry')}
            className={`px-3 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
              filterCategory === 'gravimetry'
                ? 'bg-[#dc2626] text-white shadow-[0_2px_8px_rgba(220,38,38,0.4)]'
                : 'bg-[#141414] text-[#888888] hover:text-white border border-[#2a2a2a]'
            }`}
          >
            Gravimetría (P5)
          </button>
          <button
            onClick={() => setFilterCategory('instrumental')}
            className={`px-3 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
              filterCategory === 'instrumental'
                ? 'bg-[#dc2626] text-white shadow-[0_2px_8px_rgba(220,38,38,0.4)]'
                : 'bg-[#141414] text-[#888888] hover:text-white border border-[#2a2a2a]'
            }`}
          >
            Instrumental (P11-P13)
          </button>
          <button
            onClick={() => setFilterCategory('preparatory')}
            className={`px-3 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
              filterCategory === 'preparatory'
                ? 'bg-[#dc2626] text-white shadow-[0_2px_8px_rgba(220,38,38,0.4)]'
                : 'bg-[#141414] text-[#888888] hover:text-white border border-[#2a2a2a]'
            }`}
          >
            Metrología (P1-P3)
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden text-xs">
          {/* Lista de Prácticas */}
          <div className="w-full md:w-1/2 border-r border-[#222222] overflow-y-auto p-3 space-y-2">
            {filteredPractices.map((p) => {
              const isSelected = selectedPracticeDetail?.number === p.number;

              return (
                <div
                  key={p.number}
                  onClick={() => setSelectedPracticeDetail(p)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#1c0808] border-[#dc2626] shadow-lg shadow-red-950/40'
                      : 'bg-[#121212] hover:bg-[#1a1a1a] border-[#222222] text-[#aaaaaa]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 font-mono">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 bg-[#0a0a0a] border border-[#333333] rounded text-[10px]">
                        P{p.number}
                      </span>
                      <span className="truncate max-w-[200px] font-serif">{p.title}</span>
                    </span>

                    {p.status === 'active' ? (
                      <span className="px-2 py-0.5 bg-[#1f0808] border border-[#dc2626] text-[#ef4444] font-bold text-[9px] rounded-full shrink-0">
                        ● Activa
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#141414] border border-[#222222] text-[#666666] text-[9px] rounded-full shrink-0">
                        Plan Oficial
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#888888] line-clamp-2">
                    {p.shortObjective}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Ficha de Detalle */}
          <div className="w-full md:w-1/2 p-5 overflow-y-auto bg-[#080808] space-y-4">
            {selectedPracticeDetail ? (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[10px] uppercase text-[#ef4444] font-bold tracking-wider">
                      {selectedPracticeDetail.unitTitle} (Unidad {selectedPracticeDetail.unitNumber})
                    </span>
                    {selectedPracticeDetail.status === 'active' && (
                      <span className="text-[10px] text-[#ef4444] font-bold flex items-center gap-1">
                        <CheckCircle2 size={13} /> Lista para simular
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white mt-1 font-serif">
                    P{selectedPracticeDetail.number}: {selectedPracticeDetail.title}
                  </h4>
                </div>

                <div className="p-3 bg-[#121212] border border-[#262626] rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider block font-serif">
                    Objetivo Formativo
                  </span>
                  <p className="text-[11px] text-[#aaaaaa] leading-relaxed">
                    {selectedPracticeDetail.shortObjective}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">
                    Reactivos y Patrones Químicos:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPracticeDetail.keyReagents.map((r, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-[#141414] border border-[#262626] text-[#cccccc] text-[10px] rounded-lg"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">
                    Instrumental y Vidriería:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPracticeDetail.keyEquipment.map((e, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-[#141414] border border-[#262626] text-[#cccccc] text-[10px] rounded-lg"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#222222] font-serif">
                  {selectedPracticeDetail.status === 'active' ? (
                    <button
                      onClick={() => {
                        onSelectPractice(selectedPracticeDetail.number);
                        onClose();
                      }}
                      className="w-full py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-extrabold rounded-xl shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer uppercase tracking-wider"
                    >
                      <FlaskConical size={16} />
                      <span>Cargar Práctica {selectedPracticeDetail.number} en Mesada</span>
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <div className="p-3 bg-[#121212] border border-[#262626] rounded-xl text-center space-y-1">
                      <span className="text-[11px] text-[#ef4444] font-bold">
                        Especificación técnica y curricular registrada (ADR)
                      </span>
                      <p className="text-[10px] text-[#888888]">
                        El protocolo y fórmulas están documentados en la ontología oficial.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Pie */}
        <div className="p-3.5 bg-[#121212] border-t border-[#222222] flex items-center justify-between">
          <span className="text-[11px] text-[#666666] font-mono">
            Ontología sincronizada con curriculum_spec.json
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#171717] hover:bg-[#252525] border border-[#333333] rounded-xl text-xs font-bold text-white cursor-pointer"
          >
            Cerrar Selector
          </button>
        </div>
      </div>
    </div>
  );
};

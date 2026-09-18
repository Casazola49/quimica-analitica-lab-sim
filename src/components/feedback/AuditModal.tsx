import React from 'react';
import { X, ExternalLink, ShieldAlert, CheckCircle } from 'lucide-react';
import { TechniqueDefect } from '../../types';
import { PEDAGOGICAL_CITATIONS } from '../../data/pedagogicalCitations';
import { HankoSeal } from '../common/HankoSeal';

interface AuditModalProps {
  isOpen: boolean;
  defects: TechniqueDefect[];
  onClose: () => void;
}

export const AuditModal: React.FC<AuditModalProps> = ({
  isOpen,
  defects,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleOpenRagDeepLink = (query: string) => {
    const encoded = encodeURIComponent(query);
    const ragUrl = `https://github.com/Casazola49/quimica-analitica-rag#query=${encoded}`;
    window.open(ragUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none font-sans">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0a0a0a] border border-[#262626] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Encabezado Sumi-e */}
        <div className="p-4 bg-[#121212] border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HankoSeal size="sm" variant="stamp" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              Auditoría Pedagógica y Citas de la Tríada Digital
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#666666] hover:text-white rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cuerpo con Scroll */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {defects.length === 0 ? (
            <div className="p-8 text-center space-y-3 bg-[#121212] border border-[#262626] rounded-xl shadow">
              <CheckCircle size={40} className="mx-auto text-[#dc2626]" />
              <h4 className="text-sm font-bold text-white font-serif uppercase tracking-wider">¡Técnica de Laboratorio Impecable!</h4>
              <p className="text-[#888888] max-w-md mx-auto leading-relaxed">
                No se registraron defectos sistemáticos en la mesada: la bureta fue purgada correctamente, la lectura de menisco no presentó error de paralaje y la titulación se detuvo en el viraje óptimo.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5 text-white bg-[#1f0808] p-3.5 rounded-xl border border-[#dc2626]/70 shadow">
                <ShieldAlert size={18} className="text-[#ef4444] shrink-0" />
                <span className="leading-relaxed">
                  Se identificaron <strong className="text-[#ef4444]">{defects.length}</strong> desviaciones de técnica en la mesada. A continuación se presentan las citas exactas de los libros oficiales que explican el impacto metrológico:
                </span>
              </div>

              {defects.map((defect, index) => {
                const citation = PEDAGOGICAL_CITATIONS[defect.citationId];
                if (!citation) return null;

                return (
                  <div
                    key={index}
                    className="p-4 bg-[#121212] border border-[#2b2b2b] rounded-xl space-y-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between border-b border-[#222222] pb-2">
                      <span className="font-bold text-sm text-white font-serif">
                        {index + 1}. {citation.chapterTitle}
                      </span>
                      <span className="px-2.5 py-0.5 bg-[#1f0808] text-[#ef4444] border border-[#dc2626]/70 text-[10px] font-mono rounded-full font-bold">
                        {citation.book} — {citation.edition}
                      </span>
                    </div>

                    <div className="p-3 bg-[#050505] border-l-4 border-l-[#dc2626] rounded-r-lg space-y-1">
                      <p className="italic text-[#f5f5f5] font-serif leading-relaxed text-[11px]">
                        "{citation.exactQuote}"
                      </p>
                      <span className="block text-[10px] text-[#ef4444] font-mono text-right font-bold">
                        — {citation.book}, Cap. {citation.chapter}, Pág. {citation.pagePhysical}
                      </span>
                    </div>

                    <div className="space-y-1 text-[#cccccc]">
                      <strong className="text-[#ef4444] font-serif uppercase tracking-wider text-[10px] block">Impacto en el Resultado:</strong>
                      <p className="text-[11px] leading-relaxed">{citation.pedagogicalImpact}</p>
                    </div>

                    <div className="pt-2.5 border-t border-[#222222] flex items-center justify-between gap-3 font-sans">
                      <div className="text-[11px] text-white">
                        <strong className="text-[#dc2626]">Remediación:</strong> {citation.remediationAdvice}
                      </div>

                      <button
                        onClick={() => handleOpenRagDeepLink(citation.ragDeepLinkQuery)}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-bold text-[11px] rounded-xl shadow-lg transition-colors cursor-pointer uppercase tracking-wider"
                      >
                        <span>Consultar RAG</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

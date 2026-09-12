import React from 'react';
import { X, BookOpen, ExternalLink, ShieldAlert, CheckCircle } from 'lucide-react';
import { TechniqueDefect } from '../../types';
import { PEDAGOGICAL_CITATIONS } from '../../data/pedagogicalCitations';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Encabezado */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-cyan-400" size={20} />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Auditoría Pedagógica y Citas de la Tríada Digital
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cuerpo con Scroll */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {defects.length === 0 ? (
            <div className="p-8 text-center space-y-3 bg-slate-800/40 border border-slate-700 rounded-xl">
              <CheckCircle size={40} className="mx-auto text-emerald-400" />
              <h4 className="text-sm font-bold text-emerald-300">¡Técnica de Laboratorio Impecable!</h4>
              <p className="text-slate-400 max-w-md mx-auto">
                No se registraron defectos sistemáticos en la mesada: la bureta fue purgada correctamente, la lectura de menisco no presentó error de paralaje y la titulación se detuvo en el viraje óptimo.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
                <ShieldAlert size={18} className="shrink-0" />
                <span>
                  Se identificaron <strong>{defects.length}</strong> desviaciones de técnica en la mesada. A continuación se presentan las citas exactas de los libros oficiales que explican el impacto metrológico:
                </span>
              </div>

              {defects.map((defect, index) => {
                const citation = PEDAGOGICAL_CITATIONS[defect.citationId];
                if (!citation) return null;

                return (
                  <div
                    key={index}
                    className="p-4 bg-slate-800/70 border border-slate-700 rounded-xl space-y-3 shadow-md"
                  >
                    {/* Título y Libro */}
                    <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                      <span className="font-bold text-sm text-cyan-300">
                        {index + 1}. {citation.chapterTitle}
                      </span>
                      <span className="px-2.5 py-0.5 bg-blue-950 text-blue-300 border border-blue-700 text-[10px] font-mono rounded-full font-semibold">
                        {citation.book} — {citation.edition}
                      </span>
                    </div>

                    {/* Cita Textual Verificada */}
                    <div className="p-3 bg-slate-950/80 border-l-4 border-cyan-500 rounded-r-lg space-y-1">
                      <p className="italic text-slate-200 font-serif leading-relaxed">
                        "{citation.exactQuote}"
                      </p>
                      <span className="block text-[10px] text-cyan-400/80 font-mono text-right">
                        — {citation.book}, Cap. {citation.chapter}, Pág. {citation.pagePhysical}
                      </span>
                    </div>

                    {/* Impacto Pedagógico */}
                    <div className="space-y-1 text-slate-300">
                      <strong className="text-amber-300">Impacto en el Resultado:</strong>
                      <p>{citation.pedagogicalImpact}</p>
                    </div>

                    {/* Acción Correctiva y Deep Link */}
                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-3">
                      <div className="text-[11px] text-emerald-300">
                        <strong>Remediación:</strong> {citation.remediationAdvice}
                      </div>

                      <button
                        onClick={() => handleOpenRagDeepLink(citation.ragDeepLinkQuery)}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-medium text-[11px] rounded-lg shadow transition-colors"
                      >
                        <span>Profundizar con Asistente RAG</span>
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

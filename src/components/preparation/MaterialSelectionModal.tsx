import React, { useState } from 'react';
import { CheckSquare, Square, AlertCircle, CheckCircle2, PackageCheck, HelpCircle, X } from 'lucide-react';

export interface MaterialItem {
  id: string;
  name: string;
  category: 'material' | 'reagent';
  isRequired: boolean;
  reason: string;
}

export const LAB_ITEMS: MaterialItem[] = [
  // Materiales Requeridos
  { id: 'm_burette', name: 'Bureta de 50 mL Clase A (graduada cada 0.1 mL)', category: 'material', isRequired: true, reason: 'Instrumento volumétrico fundamental para la entrega controlada del titulante NaOH.' },
  { id: 'm_stand', name: 'Soporte universal con pinza mariposa para bureta', category: 'material', isRequired: true, reason: 'Sujeta la bureta verticalmente asegurando estabilidad durante el enrase y titulación.' },
  { id: 'm_erlenmeyer', name: 'Matraz Erlenmeyer de 250 mL (boca estrecha)', category: 'material', isRequired: true, reason: 'Recipiente óptimo para la titulación porque su forma cónica evita salpicaduras al agitar.' },
  { id: 'm_balance', name: 'Balanza analítica digital (sensibilidad 0.1 mg / 0.0001 g)', category: 'material', isRequired: true, reason: 'Indispensable para la pesada exacta del patrón primario biftalato de potasio.' },
  { id: 'm_stirrer', name: 'Agitador magnético con barra de teflón (pez)', category: 'material', isRequired: true, reason: 'Garantiza homogenización continua e instantánea de cada gota de titulante añadida.' },
  { id: 'm_beaker', name: 'Vaso de precipitado de 100 mL (recipiente de desecho/purga)', category: 'material', isRequired: true, reason: 'Necesario para recibir el líquido expulsado durante la purga de burbujas de la bureta.' },
  { id: 'm_washbottle', name: 'Frasco lavador (pizeta) con agua destilada', category: 'material', isRequired: true, reason: 'Para disolver el patrón y lavar las paredes internas del erlenmeyer durante la valoración.' },
  { id: 'm_watchglass', name: 'Pesafiltro o vidrio de reloj seco', category: 'material', isRequired: true, reason: 'Soporte para pesar el biftalato en la balanza analítica sin contaminar el platillo.' },

  // Materiales Distractores
  { id: 'd_cylinder', name: 'Probeta graduada de 100 mL', category: 'material', isRequired: false, reason: 'Incorrecto: La probeta tiene un error de ±1 mL y no tiene precisión analítica cuantitativa.' },
  { id: 'd_crucible', name: 'Crisol de porcelana con tapa', category: 'material', isRequired: false, reason: 'Incorrecto: El crisol es material para calcinación gravimétrica (P5), no para volumetría.' },
  { id: 'd_testtube', name: 'Tubos de ensayo con gradilla de madera', category: 'material', isRequired: false, reason: 'Incorrecto: Material de química cualitativa preparatoria, no para volumetría cuantitativa.' },
  { id: 'd_bunsen', name: 'Mechero Bunsen con trípode y tela de amianto', category: 'material', isRequired: false, reason: 'Incorrecto: La estandarización de NaOH con KHP se realiza estrictamente a temperatura ambiente.' },

  // Reactivos Requeridos
  { id: 'r_khp', name: 'Biftalato de potasio (KHC8H4O4, KHP) patrón primario desecado a 110 °C', category: 'reagent', isRequired: true, reason: 'Patrón primario ácido de alta pureza (MW = 204.22 g/eq) que reacciona estequiométricamente 1:1 con NaOH.' },
  { id: 'r_naoh', name: 'Solución de Hidróxido de Sodio (NaOH) ~0.1 N a estandarizar', category: 'reagent', isRequired: true, reason: 'Reactivo titulante alcalino cuya concentración exacta se busca determinar.' },
  { id: 'r_phenolphthalein', name: 'Solución de Fenolftaleína al 0.1% en etanol', category: 'reagent', isRequired: true, reason: 'Indicador visual cuyo viraje (incoloro a rosa pálido tenue, pH 8.2-10.0) coincide con el punto de equivalencia.' },
  { id: 'r_water', name: 'Agua destilada desionizada recientemente hervida (exenta de CO2)', category: 'reagent', isRequired: true, reason: 'Medio disolvente libre de dióxido de carbono disuelto que interferiría como ácido carbónico.' },

  // Reactivos Distractores
  { id: 'd_hcl', name: 'Ácido clorhídrico concentrado (HCl 37% p/p)', category: 'reagent', isRequired: false, reason: 'Incorrecto: El HCl es una solución ácida secundaria; aquí el ácido patrón es el biftalato sólido.' },
  { id: 'd_bacl2', name: 'Cloruro de Bario (BaCl2) al 5%', category: 'reagent', isRequired: false, reason: 'Incorrecto: Reactivo precipitante de sulfatos para gravimetría (P5).' },
  { id: 'd_net', name: 'Negro de Eriocromo T (NET) en polvo con NaCl', category: 'reagent', isRequired: false, reason: 'Incorrecto: Indicador metalocrómico utilizado en complejometría con EDTA (P10).' },
  { id: 'd_k2cr2o7', name: 'Dicromato de potasio (K2Cr2O7) patrón primario', category: 'reagent', isRequired: false, reason: 'Incorrecto: Patrón oxidante para volumetría redox (P8).' }
];

interface MaterialSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidationSuccess: () => void;
}

export const MaterialSelectionModal: React.FC<MaterialSelectionModalProps> = ({
  isOpen,
  onClose,
  onValidationSuccess,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
    setSubmitted(false);
  };

  const requiredMaterials = LAB_ITEMS.filter((i) => i.category === 'material' && i.isRequired);
  const requiredReagents = LAB_ITEMS.filter((i) => i.category === 'reagent' && i.isRequired);

  const missingRequired = LAB_ITEMS.filter((i) => i.isRequired && !selectedIds.has(i.id));
  const chosenDistractors = LAB_ITEMS.filter((i) => !i.isRequired && selectedIds.has(i.id));

  const isPerfect = missingRequired.length === 0 && chosenDistractors.length === 0;

  const handleSubmit = () => {
    setSubmitted(true);
    if (isPerfect) {
      onValidationSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Encabezado */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="text-blue-400" size={22} />
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Solicitud Pre-Laboratorio: Materiales y Reactivos
              </h3>
              <p className="text-[11px] text-slate-400">
                Seleccione el instrumental y reactivos estrictamente necesarios para la Estandarización de NaOH con KHP.
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

        {/* Contenido dividido en 2 columnas: Materiales vs Reactivos */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs">
          <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl flex items-start gap-2 text-blue-200">
            <HelpCircle size={16} className="shrink-0 mt-0.5 text-blue-400" />
            <p className="text-[11px] leading-relaxed">
              <strong>Control de Entrada de la Cátedra (UMSS):</strong> El ayudante de laboratorio exige presentar la lista exacta de reactivos y materiales antes de autorizar el ingreso a la mesada. Seleccione con cuidado; evite instrumentos de baja precisión o reactivos ajenos a esta práctica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Columna 1: Instrumental y Materiales */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-700">
                <span className="font-bold text-slate-200 uppercase text-[11px] tracking-wider">
                  1. Instrumental y Vidriería
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {LAB_ITEMS.filter((i) => i.category === 'material' && selectedIds.has(i.id)).length} seleccionados
                </span>
              </div>

              <div className="space-y-1.5">
                {LAB_ITEMS.filter((i) => i.category === 'material').map((item) => {
                  const isChecked = selectedIds.has(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-2 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-blue-950/50 border-blue-500/70 text-blue-100 shadow-sm'
                          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                      }`}
                    >
                      <button type="button" className="mt-0.5 shrink-0 text-blue-400">
                        {isChecked ? <CheckSquare size={16} className="text-blue-400 fill-blue-950" /> : <Square size={16} className="text-slate-500" />}
                      </button>
                      <span className="text-[11px] font-medium leading-tight select-none">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Columna 2: Reactivos Químicos */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-700">
                <span className="font-bold text-slate-200 uppercase text-[11px] tracking-wider">
                  2. Reactivos Químicos y Patrones
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {LAB_ITEMS.filter((i) => i.category === 'reagent' && selectedIds.has(i.id)).length} seleccionados
                </span>
              </div>

              <div className="space-y-1.5">
                {LAB_ITEMS.filter((i) => i.category === 'reagent').map((item) => {
                  const isChecked = selectedIds.has(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-2 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-purple-950/50 border-purple-500/70 text-purple-100 shadow-sm'
                          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                      }`}
                    >
                      <button type="button" className="mt-0.5 shrink-0 text-purple-400">
                        {isChecked ? <CheckSquare size={16} className="text-purple-400 fill-purple-950" /> : <Square size={16} className="text-slate-500" />}
                      </button>
                      <span className="text-[11px] font-medium leading-tight select-none">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Resultado de la Validación */}
          {submitted && (
            <div className="mt-4 p-4 rounded-xl border animate-in fade-in space-y-2.5">
              {isPerfect ? (
                <div className="flex items-center gap-3 text-emerald-300 bg-emerald-950/60 border border-emerald-500 p-3.5 rounded-xl">
                  <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider">
                      ¡Lista de Solicitud Aprobada por el Ayudante!
                    </h4>
                    <p className="text-[11px] text-emerald-200">
                      Has seleccionado exactamente los {requiredMaterials.length} materiales y {requiredReagents.length} reactivos canónicos requeridos sin distractores. Podés proceder con seguridad a la mesada virtual.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 bg-rose-950/40 border border-rose-800/60 p-3.5 rounded-xl text-rose-200">
                  <div className="flex items-center gap-2 font-bold text-xs text-rose-300">
                    <AlertCircle size={18} className="text-rose-400 shrink-0" />
                    <span>Solicitud Observada: Corrija su selección</span>
                  </div>

                  {missingRequired.length > 0 && (
                    <div className="text-[11px] space-y-1">
                      <strong className="text-amber-300">Elementos requeridos faltantes ({missingRequired.length}):</strong>
                      <ul className="list-disc list-inside text-slate-300">
                        {missingRequired.map((m) => (
                          <li key={m.id}><span className="font-semibold text-white">{m.name}</span>: {m.reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {chosenDistractors.length > 0 && (
                    <div className="text-[11px] space-y-1 pt-2 border-t border-rose-900/50">
                      <strong className="text-rose-300">Materiales o reactivos distractores innecesarios ({chosenDistractors.length}):</strong>
                      <ul className="list-disc list-inside text-slate-300">
                        {chosenDistractors.map((d) => (
                          <li key={d.id}><span className="font-semibold text-rose-200">{d.name}</span>: {d.reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pie de modal con acciones */}
        <div className="p-4 bg-slate-800 border-t border-slate-700 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              // Seleccionar todos los correctos automáticamente como ayuda
              const autoSet = new Set(LAB_ITEMS.filter((i) => i.isRequired).map((i) => i.id));
              setSelectedIds(autoSet);
              setSubmitted(false);
            }}
            className="text-[11px] text-slate-400 hover:text-cyan-300 underline"
          >
            Autocompletar recomendados
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-semibold text-slate-300"
            >
              Cerrar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
            >
              Verificar Lista con Ayudante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

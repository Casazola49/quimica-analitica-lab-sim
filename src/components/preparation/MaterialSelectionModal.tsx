import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, AlertCircle, CheckCircle2, PackageCheck, HelpCircle, X, ArrowRight, RotateCcw } from 'lucide-react';

export interface MaterialItem {
  id: string;
  name: string;
  category: 'material' | 'reagent';
  isRequired: boolean;
  reason: string;
}

export const P4_ITEMS: MaterialItem[] = [
  // Materiales Requeridos P4
  { id: 'm_burette', name: 'Bureta de 50 mL Clase A (graduada cada 0.1 mL)', category: 'material', isRequired: true, reason: 'Instrumento volumétrico fundamental para la entrega controlada del titulante NaOH.' },
  { id: 'm_stand', name: 'Soporte universal con pinza mariposa para bureta', category: 'material', isRequired: true, reason: 'Sujeta la bureta verticalmente asegurando estabilidad durante el enrase y titulación.' },
  { id: 'm_erlenmeyer', name: 'Matraz Erlenmeyer de 250 mL (boca estrecha)', category: 'material', isRequired: true, reason: 'Recipiente óptimo para la titulación porque su forma cónica evita salpicaduras al agitar.' },
  { id: 'm_balance', name: 'Balanza analítica digital (sensibilidad 0.1 mg / 0.0001 g)', category: 'material', isRequired: true, reason: 'Indispensable para la pesada exacta del patrón primario biftalato de potasio.' },
  { id: 'm_stirrer', name: 'Agitador magnético con barra de teflón (pez)', category: 'material', isRequired: true, reason: 'Garantiza homogenización continua e instantánea de cada gota de titulante añadida.' },
  { id: 'm_beaker', name: 'Vaso de precipitado de 100 mL (recipiente de desecho/purga)', category: 'material', isRequired: true, reason: 'Necesario para recibir el líquido expulsado durante la purga de burbujas de la bureta.' },
  { id: 'm_washbottle', name: 'Frasco lavador (pizeta) con agua destilada', category: 'material', isRequired: true, reason: 'Para disolver el patrón y lavar las paredes internas del erlenmeyer durante la valoración.' },
  { id: 'm_watchglass', name: 'Pesafiltro o vidrio de reloj seco', category: 'material', isRequired: true, reason: 'Soporte para pesar el biftalato en la balanza analítica sin contaminar el platillo.' },

  // Distractores P4
  { id: 'd_cylinder', name: 'Probeta graduada de 100 mL', category: 'material', isRequired: false, reason: 'Incorrecto: La probeta tiene un error de ±1 mL y no tiene precisión analítica cuantitativa.' },
  { id: 'd_crucible', name: 'Crisol de porcelana con tapa', category: 'material', isRequired: false, reason: 'Incorrecto: El crisol es material para calcinación gravimétrica (P5), no para volumetría.' },
  { id: 'd_testtube', name: 'Tubos de ensayo con gradilla de madera', category: 'material', isRequired: false, reason: 'Incorrecto: Material de química cualitativa preparatoria, no para volumetría cuantitativa.' },
  { id: 'd_bunsen', name: 'Mechero Bunsen con trípode y tela de amianto', category: 'material', isRequired: false, reason: 'Incorrecto: La estandarización de NaOH con KHP se realiza estrictamente a temperatura ambiente.' },

  // Reactivos Requeridos P4
  { id: 'r_khp', name: 'Biftalato de potasio (KHC8H4O4, KHP) patrón primario desecado a 110 °C', category: 'reagent', isRequired: true, reason: 'Patrón primario ácido de alta pureza (MW = 204.22 g/eq) que reacciona estequiométricamente 1:1 con NaOH.' },
  { id: 'r_naoh', name: 'Solución de Hidróxido de Sodio (NaOH) ~0.1 N a estandarizar', category: 'reagent', isRequired: true, reason: 'Reactivo titulante alcalino cuya concentración exacta se busca determinar.' },
  { id: 'r_phenolphthalein', name: 'Solución de Fenolftaleína al 0.1% en etanol', category: 'reagent', isRequired: true, reason: 'Indicador visual cuyo viraje (incoloro a rosa pálido tenue, pH 8.2-10.0) coincide con el punto de equivalencia.' },
  { id: 'r_water', name: 'Agua destilada desionizada recientemente hervida (exenta de CO2)', category: 'reagent', isRequired: true, reason: 'Medio disolvente libre de dióxido de carbono disuelto que interferiría como ácido carbónico.' },

  // Distractores P4
  { id: 'd_hcl', name: 'Ácido clorhídrico concentrado (HCl 37% p/p)', category: 'reagent', isRequired: false, reason: 'Incorrecto: El HCl es una solución ácida secundaria; aquí el ácido patrón es el biftalato sólido.' },
  { id: 'd_bacl2', name: 'Cloruro de Bario (BaCl2) al 5%', category: 'reagent', isRequired: false, reason: 'Incorrecto: Reactivo precipitante de sulfatos para gravimetría (P5).' },
  { id: 'd_net', name: 'Negro de Eriocromo T (NET) en polvo con NaCl', category: 'reagent', isRequired: false, reason: 'Incorrecto: Indicador metalocrómico utilizado en complejometría con EDTA (P10).' },
  { id: 'd_k2cr2o7', name: 'Dicromato de potasio (K2Cr2O7) patrón primario', category: 'reagent', isRequired: false, reason: 'Incorrecto: Patrón oxidante para volumetría redox (P8).' },
];

export const P7_ITEMS: MaterialItem[] = [
  // Materiales Requeridos P7
  { id: 'm_phmeter', name: 'pH-metro digital de mesa (resolución 0.01 pH)', category: 'material', isRequired: true, reason: 'Instrumento potenciométrico para medir la f.e.m. y el pH continuo de la celda galvánica.' },
  { id: 'm_electrode', name: 'Electrodo combinado de vidrio y referencia Ag/AgCl con KCl 3M', category: 'material', isRequired: true, reason: 'Sensor electroquímico sensible a la actividad de iones H+ sumergido en la disolución.' },
  { id: 'm_pipette', name: 'Pipeta volumétrica aforada de 25.00 mL Clase A', category: 'material', isRequired: true, reason: 'Instrumento de máxima exactitud para tomar la alícuota líquida de HCl.' },
  { id: 'm_propipette', name: 'Propipeta de goma de 3 vías (pera de succión)', category: 'material', isRequired: true, reason: 'Dispositivo de bioseguridad para aspirar el ácido clorhídrico sin pipetear jamás con la boca.' },
  { id: 'm_burette', name: 'Bureta de 25 o 50 mL Clase A con llave de teflón', category: 'material', isRequired: true, reason: 'Para suministrar el reactivo titulante NaOH en incrementos de volumen exactos.' },
  { id: 'm_stand', name: 'Soporte universal con pinza doble para bureta y electrodo', category: 'material', isRequired: true, reason: 'Fija sólidamente la bureta y sostiene el electrodo suspendido sin tocar la barra magnética.' },
  { id: 'm_beaker', name: 'Vaso de precipitados de 150 mL de forma alta (recipiente de titulación)', category: 'material', isRequired: true, reason: 'Permite acomodar simultáneamente el electrodo de vidrio, el pico de bureta y la barra magnética.' },
  { id: 'm_stirrer', name: 'Agitador magnético con barra recubierta de teflón', category: 'material', isRequired: true, reason: 'Garantiza mezclado rápido y respuesta estable del electrodo de vidrio sin golpearlo.' },
  { id: 'm_washbottle', name: 'Frasco lavador con agua destilada neutra', category: 'material', isRequired: true, reason: 'Para enjuagar minuciosamente el electrodo de vidrio entre lecturas y calibraciones.' },

  // Distractores P7
  { id: 'd_balance', name: 'Balanza analítica digital (0.1 mg)', category: 'material', isRequired: false, reason: 'Incorrecto: En P7 la muestra de HCl es una solución líquida medida con pipeta aforada; no se realiza pesada de sólidos.' },
  { id: 'd_cylinder', name: 'Probeta graduada de 100 mL', category: 'material', isRequired: false, reason: 'Incorrecto: La probeta tiene un error volumétrico inaceptable para medir la alícuota analítica.' },
  { id: 'd_crucible', name: 'Crisol de porcelana para calcinación', category: 'material', isRequired: false, reason: 'Incorrecto: El crisol es exclusivo de gravimetría por calcinación en mufla (P5).' },
  { id: 'd_bunsen', name: 'Mechero Bunsen con trípode', category: 'material', isRequired: false, reason: 'Incorrecto: La titulación potenciométrica ácido fuerte - base fuerte se realiza a 25 °C.' },

  // Reactivos Requeridos P7
  { id: 'r_hcl', name: 'Solución de Ácido Clorhídrico (HCl ~0.1 N) problema a valorar', category: 'reagent', isRequired: true, reason: 'Analito ácido fuerte cuya normalidad exacta se determinará potenciométricamente.' },
  { id: 'r_naoh', name: 'Solución estandarizada de NaOH ~0.1 N (titulante de P4)', category: 'reagent', isRequired: true, reason: 'Base fuerte patrón de concentración exactamente conocida estandarizada previamente.' },
  { id: 'r_buffers', name: 'Soluciones amortiguadoras de calibración: pH 4.00, 7.00 y 10.00', category: 'reagent', isRequired: true, reason: 'Imprescindibles para calibrar la pendiente (Nernst) y el cero del electrodo en el pH-metro.' },
  { id: 'r_phenolphthalein', name: 'Solución de Fenolftaleína al 0.1% en etanol', category: 'reagent', isRequired: true, reason: 'Para contrastar el punto final visual frente al punto de equivalencia potenciométrico (Skoog Cap. 14).' },
  { id: 'r_water', name: 'Agua destilada neutra recién hervida', category: 'reagent', isRequired: true, reason: 'Para dilución de la alícuota e inmersión adecuada del bulbo del electrodo.' },

  // Distractores P7
  { id: 'd_khp', name: 'Biftalato de potasio sólido desecado a 110 °C', category: 'reagent', isRequired: false, reason: 'Incorrecto: El KHP se usó como patrón primario en P4; en P7 el analito ya es la solución de HCl.' },
  { id: 'd_bacl2', name: 'Cloruro de bario (BaCl2 al 5%)', category: 'reagent', isRequired: false, reason: 'Incorrecto: Reactivo precipitante de sulfatos en gravimetría (P5).' },
  { id: 'd_edta', name: 'Sal disódica de EDTA 0.01 M', category: 'reagent', isRequired: false, reason: 'Incorrecto: Agente quelante para valoración de dureza de agua Ca2+/Mg2+ (P10).' },
  { id: 'd_k2cr2o7', name: 'Dicromato de potasio patrón primario', category: 'reagent', isRequired: false, reason: 'Incorrecto: Oxidante patrón para volumetría redox de hierro (P8).' },
];

export const P5_ITEMS: MaterialItem[] = [
  // Materiales Requeridos P5 (Gravimetría)
  { id: 'm_beaker400', name: 'Vaso de precipitados de 400 mL de forma alta', category: 'material', isRequired: true, reason: 'Recipiente amplio para contener la disolución caliente de sulfatos sin pérdidas por proyección.' },
  { id: 'm_hotplate', name: 'Placa calefactora de laboratorio con control de temperatura', category: 'material', isRequired: true, reason: 'Para mantener la digestión térmica a 85-90 °C durante la maduración de Ostwald.' },
  { id: 'm_funnel', name: 'Embudo analítico cónico de 60° con vástago largo lleno', category: 'material', isRequired: true, reason: 'Asegura una columna líquida continua en el vástago para una filtración por gravedad rápida y cuantitativa.' },
  { id: 'm_whatman', name: 'Papel filtro cuantitativo sin cenizas Whatman N° 42 (banda azul)', category: 'material', isRequired: true, reason: 'Papel de poro fino que retiene los cristales de BaSO4 y cuyas cenizas tras calcinación son despreciables (≤0.00008 g).' },
  { id: 'm_testtube', name: 'Tubos de ensayo en gradilla para control de lavado', category: 'material', isRequired: true, reason: 'Para recolectar porciones de las aguas de filtrado y ensayar la presencia de cloruros residuales.' },
  { id: 'm_crucible', name: 'Crisol de porcelana refractario con tapa', category: 'material', isRequired: true, reason: 'Recipiente inerte para la carbonización del papel y calcinación del BaSO4 a 800 °C en mufla.' },
  { id: 'm_muffle', name: 'Horno mufla de alta temperatura (800 - 900 °C)', category: 'material', isRequired: true, reason: 'Permite calcinar cuantitativamente el precipitado hasta descomposición total del carbón residual.' },
  { id: 'm_desiccator', name: 'Desecador de vidrio con gel de sílice activa deshidratante', category: 'material', isRequired: true, reason: 'Enfría el crisol caliente hasta temperatura ambiente en atmósfera seca antes de la pesada analítica.' },
  { id: 'm_balance', name: 'Balanza analítica digital (sensibilidad 0.1 mg / 0.0001 g)', category: 'material', isRequired: true, reason: 'Fundamental para las pesadas del crisol vacío y con precipitado hasta masa constante.' },
  { id: 'm_glassrod', name: 'Varilla de vidrio con policía de goma', category: 'material', isRequired: true, reason: 'Para guiar el chorro de líquido hacia el embudo y arrastrar cuantitativamente partículas adheridas a las paredes.' },
  { id: 'm_washbottle', name: 'Frasco lavador con agua destilada caliente', category: 'material', isRequired: true, reason: 'El lavado en caliente aumenta la solubilidad de las impurezas adsorbidas facilitando su eliminación.' },

  // Distractores P5
  { id: 'd_burette', name: 'Bureta graduada de 50 mL Clase A', category: 'material', isRequired: false, reason: 'Incorrecto: La bureta es material de análisis volumétrico; en gravimetría se determina masa calcinada, no volumen gastado.' },
  { id: 'd_pipette', name: 'Pipeta volumétrica aforada de 25 mL', category: 'material', isRequired: false, reason: 'Incorrecto: En gravimetría la muestra sólida se pesa en balanza analítica, no se requiere pipeta aforada de precisión.' },
  { id: 'd_phmeter', name: 'pH-metro digital de mesa con electrodo', category: 'material', isRequired: false, reason: 'Incorrecto: El pH-metro es instrumental potenciométrico (P7), no aplicable a gravimetría clásica de BaSO4.' },
  { id: 'd_cylinder', name: 'Probeta graduada de 100 mL', category: 'material', isRequired: false, reason: 'Incorrecto: La probeta no posee precisión analítica cuantitativa.' },

  // Reactivos Requeridos P5
  { id: 'r_sample', name: 'Muestra problema con sulfatos soluble (Na2SO4 / sulfato)', category: 'reagent', isRequired: true, reason: 'Muestra analítica cuya concentración de SO4(2-) se determinará por precipitación cuantitativa.' },
  { id: 'r_bacl2', name: 'Solución de Cloruro de Bario (BaCl2 al 5% p/v)', category: 'reagent', isRequired: true, reason: 'Reactivo precipitante que aporta iones Ba(2+) para formar el precipitado insoluble de BaSO4.' },
  { id: 'r_hcl', name: 'Ácido clorhídrico concentrado (HCl diluido 1:1)', category: 'reagent', isRequired: true, reason: 'Medio ácido necesario para prevenir la coprecipitación de sales de bario insolubles en medio básico (como BaCO3).' },
  { id: 'r_agno3', name: 'Solución de Nitrato de Plata (AgNO3 0.1 N)', category: 'reagent', isRequired: true, reason: 'Reactivo para el ensayo de cloruros: precipita AgCl blanco lechoso si el lavado del precipitado aún es incompleto.' },
  { id: 'r_hotwater', name: 'Agua destilada recién hervida (caliente)', category: 'reagent', isRequired: true, reason: 'Medio de lavado continuo para arrastrar iones Ba(2+) y Cl(-) del cono de papel filtro.' },

  // Distractores P5
  { id: 'd_naoh', name: 'Solución de Hidróxido de Sodio (NaOH 0.1 N)', category: 'reagent', isRequired: false, reason: 'Incorrecto: El NaOH es un reactivo titulante alcalino para volumetría de neutralización (P4/P7).' },
  { id: 'd_phenolphthalein', name: 'Solución de Fenolftaleína al 0.1%', category: 'reagent', isRequired: false, reason: 'Incorrecto: Indicador de pH volumétrico innecesario en determinaciones gravimétricas de sulfatos.' },
  { id: 'd_edta', name: 'Sal disódica de EDTA 0.01 M', category: 'reagent', isRequired: false, reason: 'Incorrecto: Agente quelante para dureza de agua en complejometría (P10).' },
  { id: 'd_k2cr2o7', name: 'Dicromato de potasio patrón primario', category: 'reagent', isRequired: false, reason: 'Incorrecto: Patrón oxidante de volumetría redox de hierro (P8).' },
];

export const P12_ITEMS: MaterialItem[] = [
  // Materiales Requeridos P12 (Espectrofotometría UV-Vis)
  { id: 'm_spectro', name: 'Espectrofotómetro UV-Visible digital con monocromador a 508 nm', category: 'material', isRequired: true, reason: 'Instrumento óptico para medir la absorbancia y transmitancia del haz de luz monocromático transmitido.' },
  { id: 'm_cuvettes', name: 'Par de cubetas apareadas de vidrio óptico de 1.00 cm de camino de paso', category: 'material', isRequired: true, reason: 'Celdas ópticas con ventanas transparentes paralelas idénticas para contener el blanco y los estándares.' },
  { id: 'm_flasks', name: 'Serie de 6 matraces aforados de 50 mL Clase A (blanco y 5 patrones)', category: 'material', isRequired: true, reason: 'Para preparar por dilución volumétrica exacta la curva de calibración de 0 a 5 ppm de Fe.' },
  { id: 'm_pipettes', name: 'Micropipetas automáticas de precisión calibradas (100 - 1000 µL)', category: 'material', isRequired: true, reason: 'Para dosificar con reproducibilidad los volúmenes de patrón de Fe, hidroxilamina, tampón y fenantrolina.' },
  { id: 'm_lenspaper', name: 'Papel especial de limpieza para lentes y superficies ópticas', category: 'material', isRequired: true, reason: 'Limpia las caras transparentes de la cubeta sin rayarlas ni dejar pelusas que dispersen la luz.' },

  // Distractores P12
  { id: 'd_burette', name: 'Bureta graduada de 50 mL Clase A', category: 'material', isRequired: false, reason: 'Incorrecto: La bureta es para valoraciones volumétricas gota a gota, no para espectrofotometría.' },
  { id: 'd_crucible', name: 'Crisol de porcelana con tapa', category: 'material', isRequired: false, reason: 'Incorrecto: El crisol es material refractario exclusivo para calcinación en mufla (P5).' },
  { id: 'd_phmeter', name: 'pH-metro digital de mesa con electrodo combinado de vidrio', category: 'material', isRequired: false, reason: 'Incorrecto: En P12 el pH se fija químicamente con solución tampón acetato; no se titula potenciométricamente.' },
  { id: 'd_cylinder', name: 'Probeta graduada de 100 mL', category: 'material', isRequired: false, reason: 'Incorrecto: La probeta carece de la exactitud volumétrica requerida para curvas de calibración espectrofotométricas.' },

  // Reactivos Requeridos P12
  { id: 'r_festandard', name: 'Solución estándar concentrada de Hierro (100 ppm de Fe)', category: 'reagent', isRequired: true, reason: 'Solución madre analítica a partir de la cual se preparan las diluciones estándar de la curva de Beer.' },
  { id: 'r_phen', name: 'Solución de clorhidrato de 1,10-fenantrolina al 0.1% p/v en agua', category: 'reagent', isRequired: true, reason: 'Reactivo complejante cromóforo que forma el quelato rojo-anaranjado [Fe(phen)3](2+) con absorción máxima a 508 nm.' },
  { id: 'r_hydroxylamine', name: 'Solución reductora de clorhidrato de hidroxilamina (NH2OH·HCl) al 10%', category: 'reagent', isRequired: true, reason: 'Agente reductor indispensable para reducir cuantitativamente todo Fe(3+) a Fe(2+), estado que reacciona con la fenantrolina.' },
  { id: 'r_acetate', name: 'Solución amortiguadora de acetato de sodio (pH 4.5)', category: 'reagent', isRequired: true, reason: 'Fija el medio en el rango óptimo de pH 4.0 - 5.0 donde el quelato ferroso-fenantrolina es termodinámicamente estable.' },
  { id: 'r_sample', name: 'Muestra problema desconocida con trazas de hierro a cuantificar', category: 'reagent', isRequired: true, reason: 'Disolución acuosa cuya concentración de Fe se interpolará en la recta de calibración.' },
  { id: 'r_water', name: 'Agua desionizada ultra-pura para enrase', category: 'reagent', isRequired: true, reason: 'Medio disolvente libre de trazas metálicas interferentes para aforar los matraces de 50 mL.' },

  // Distractores P12
  { id: 'd_naoh', name: 'Solución de Hidróxido de Sodio (NaOH 0.1 N)', category: 'reagent', isRequired: false, reason: 'Incorrecto: El NaOH precipitaría el hierro como hidróxido insoluble Fe(OH)3 arruinando la solución homogénea.' },
  { id: 'd_bacl2', name: 'Solución de Cloruro de Bario (BaCl2 al 5%)', category: 'reagent', isRequired: false, reason: 'Incorrecto: Reactivo precipitante de sulfatos para gravimetría (P5).' },
  { id: 'd_edta', name: 'Sal disódica de EDTA 0.01 M', category: 'reagent', isRequired: false, reason: 'Incorrecto: El EDTA competiría por el ion Fe(2+) destruyendo el complejo coloreado con la fenantrolina.' },
  { id: 'd_phenolphthalein', name: 'Solución de Fenolftaleína indicadora', category: 'reagent', isRequired: false, reason: 'Incorrecto: Indicador de pH volumétrico completamente ajeno a la colorimetría de hierro.' },
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface MaterialSelectionModalProps {
  isOpen: boolean;
  practiceNumber?: number;
  onClose: () => void;
  onValidationSuccess: () => void;
}

export const MaterialSelectionModal: React.FC<MaterialSelectionModalProps> = ({
  isOpen,
  practiceNumber = 4,
  onClose,
  onValidationSuccess,
}) => {
  const baseItems =
    practiceNumber === 12
      ? P12_ITEMS
      : practiceNumber === 5
      ? P5_ITEMS
      : practiceNumber === 7
      ? P7_ITEMS
      : P4_ITEMS;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [shuffledMaterials, setShuffledMaterials] = useState<MaterialItem[]>([]);
  const [shuffledReagents, setShuffledReagents] = useState<MaterialItem[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setShuffledMaterials(shuffleArray(baseItems.filter((i) => i.category === 'material')));
      setShuffledReagents(shuffleArray(baseItems.filter((i) => i.category === 'reagent')));
      setShowFeedbackModal(false);
      setSelectedIds(new Set());
    }
  }, [isOpen, practiceNumber]);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const missingRequired = baseItems.filter((i) => i.isRequired && !selectedIds.has(i.id));
  const chosenDistractors = baseItems.filter((i) => !i.isRequired && selectedIds.has(i.id));
  const isPerfect = missingRequired.length === 0 && chosenDistractors.length === 0;

  const handleVerify = () => {
    setShowFeedbackModal(true);
  };

  const handleAcceptSuccess = () => {
    onValidationSuccess();
    setShowFeedbackModal(false);
    onClose();
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
                Solicitud Pre-Laboratorio: {practiceNumber === 12 ? 'Práctica 12 (Espectrofotometría UV-Vis Fe)' : practiceNumber === 5 ? 'Práctica 5 (Gravimetría de BaSO4)' : practiceNumber === 7 ? 'Práctica 7 (Titulación Potenciométrica HCl)' : 'Práctica 4 (Estandarización NaOH)'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Seleccione el instrumental y reactivos estrictamente necesarios (lista barajada dinámicamente).
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

        {/* Contenido dividido en 2 columnas mezcladas dinámicamente */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl flex items-start justify-between gap-2 text-blue-200">
            <div className="flex items-start gap-2">
              <HelpCircle size={16} className="shrink-0 mt-0.5 text-blue-400" />
              <p className="text-[11px] leading-relaxed">
                <strong>Control de Entrada de la Cátedra (UMSS):</strong> El ayudante exige presentar la lista exacta de reactivos e instrumental antes de autorizar el ingreso a la mesada. Los ítems cambian de posición aleatoriamente para desafiar su criterio técnico.
              </p>
            </div>
            <button
              onClick={() => {
                setShuffledMaterials(shuffleArray(baseItems.filter((i) => i.category === 'material')));
                setShuffledReagents(shuffleArray(baseItems.filter((i) => i.category === 'reagent')));
              }}
              className="shrink-0 flex items-center gap-1 text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
              title="Volver a mezclar posiciones"
            >
              <RotateCcw size={11} />
              <span>Mezclar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Columna 1: Instrumental y Materiales (Barajados dinámicamente) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-700">
                <span className="font-bold text-slate-200 uppercase text-[11px] tracking-wider">
                  1. Instrumental y Vidriería
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {shuffledMaterials.filter((i) => selectedIds.has(i.id)).length} seleccionados
                </span>
              </div>

              <div className="space-y-1.5">
                {shuffledMaterials.map((item) => {
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

            {/* Columna 2: Reactivos Químicos (Barajados dinámicamente) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-700">
                <span className="font-bold text-slate-200 uppercase text-[11px] tracking-wider">
                  2. Reactivos Químicos y Patrones
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {shuffledReagents.filter((i) => selectedIds.has(i.id)).length} seleccionados
                </span>
              </div>

              <div className="space-y-1.5">
                {shuffledReagents.map((item) => {
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
        </div>

        {/* Pie de modal con acciones */}
        <div className="p-4 bg-slate-800 border-t border-slate-700 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              const autoSet = new Set(baseItems.filter((i) => i.isRequired).map((i) => i.id));
              setSelectedIds(autoSet);
            }}
            className="text-[11px] text-slate-300 hover:text-cyan-300 underline font-medium"
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
              onClick={handleVerify}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
            >
              Verificar Lista con Ayudante
            </button>
          </div>
        </div>

        {/* NOTIFICACIÓN CENTRADA AL MEDIO (INMEDIATA, SIN SCROLL) */}
        {showFeedbackModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
            <div className="w-full max-w-md bg-slate-900 border-2 rounded-2xl p-5 shadow-2xl space-y-4 text-center">
              {isPerfect ? (
                <>
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-emerald-400 uppercase tracking-wide">
                      ¡Solicitud Aprobada por el Ayudante!
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Has seleccionado con precisión los {baseItems.filter((i) => i.category === 'material' && i.isRequired).length} materiales y {baseItems.filter((i) => i.category === 'reagent' && i.isRequired).length} reactivos requeridos sin distractores. Podés ingresar a la mesada virtual.
                    </p>
                  </div>

                  <button
                    onClick={handleAcceptSuccess}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs transition-all"
                  >
                    <span>Ingresar a la Mesada Virtual</span>
                    <ArrowRight size={15} />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400">
                    <AlertCircle size={32} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-amber-400 uppercase tracking-wide">
                      Solicitud Observada: Corregir Lista
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      El ayudante de laboratorio no puede despacharte los materiales por los siguientes motivos:
                    </p>
                  </div>

                  <div className="max-h-48 overflow-y-auto text-left text-[11px] space-y-2.5 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                    {missingRequired.length > 0 && (
                      <div>
                        <strong className="text-amber-400">Faltan ({missingRequired.length}) necesarios:</strong>
                        <ul className="list-disc list-inside text-slate-300 mt-0.5 space-y-0.5">
                          {missingRequired.map((m) => (
                            <li key={m.id} className="truncate">{m.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {chosenDistractors.length > 0 && (
                      <div className="pt-1 border-t border-slate-800">
                        <strong className="text-rose-400">Distractores innecesarios ({chosenDistractors.length}):</strong>
                        <ul className="list-disc list-inside text-slate-300 mt-0.5 space-y-0.5">
                          {chosenDistractors.map((d) => (
                            <li key={d.id} className="text-rose-300 truncate">{d.name} ({d.reason})</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white font-bold rounded-xl text-xs transition-all"
                  >
                    Revisar y Corregir Lista
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export interface PracticeSummary {
  number: number;
  unitNumber: number;
  unitTitle: string;
  title: string;
  category: 'volumetry' | 'gravimetry' | 'instrumental' | 'preparatory';
  status: 'active' | 'specified' | 'catalog';
  shortObjective: string;
  keyReagents: string[];
  keyEquipment: string[];
}

export const ALL_PRACTICES: PracticeSummary[] = [
  {
    number: 1,
    unitNumber: 1,
    unitTitle: 'Seguridad y Metrología',
    title: 'Seguridad en el Laboratorio y Bioseguridad',
    category: 'preparatory',
    status: 'catalog',
    shortObjective: 'Protocolos de bioseguridad, manejo de reactivos corrosivos/tóxicos y clasificación de residuos analíticos.',
    keyReagents: ['Ácidos concentrados', 'Soluciones neutralizantes', 'Material absorbente'],
    keyEquipment: ['Campana de extracción de gases', 'Ducha de emergencia y lavaojos', 'Gafas de seguridad']
  },
  {
    number: 2,
    unitNumber: 1,
    unitTitle: 'Seguridad y Metrología',
    title: 'Tratamiento Estadístico de Datos y Calibración',
    category: 'preparatory',
    status: 'catalog',
    shortObjective: 'Pesada por diferencia en balanza analítica (0.1 mg) y calibración gravimétrica de material volumétrico clase A.',
    keyReagents: ['Agua destilada desgasificada', 'Termómetro de precisión'],
    keyEquipment: ['Balanza analítica digital (0.0001 g)', 'Pesafiltros de vidrio', 'Matraz aforado 25 mL']
  },
  {
    number: 3,
    unitNumber: 2,
    unitTitle: 'Puesta en Solución',
    title: 'Puesta en Solución y Disolución de Muestras',
    category: 'preparatory',
    status: 'catalog',
    shortObjective: 'Ataque químico húmedo y disgregación por fusión en crisoles para muestras sólidas minerales.',
    keyReagents: ['HCl, HNO3 y H2SO4 p.a.', 'Fundente carbonato de sodio'],
    keyEquipment: ['Placa calefactora', 'Crisol de platino o porcelana', 'Campana de tiro']
  },
  {
    number: 4,
    unitNumber: 3,
    unitTitle: 'Estandarización de Soluciones',
    title: 'Preparación y Estandarización de Soluciones (NaOH / HCl / KMnO4)',
    category: 'volumetry',
    status: 'active',
    shortObjective: 'Estandarización de NaOH 0.1 N con biftalato de potasio (KHP) y fenolftaleína.',
    keyReagents: ['Biftalato de potasio patrón primario', 'Solución NaOH ~0.1 N', 'Fenolftaleína al 0.1%'],
    keyEquipment: ['Bureta de 50 mL Clase A', 'Matraz Erlenmeyer 250 mL', 'Balanza analítica (0.1 mg)', 'Agitador magnético']
  },
  {
    number: 5,
    unitNumber: 4,
    unitTitle: 'Gravimetría',
    title: 'Determinación Gravimétrica de Sulfatos (BaSO4)',
    category: 'gravimetry',
    status: 'active',
    shortObjective: 'Precipitación cuantitativa en caliente con BaCl2, digestión térmica, filtración con papel Whatman 42 y calcinación a peso constante.',
    keyReagents: ['Muestra de sulfatos', 'Cloruro de bario (BaCl2 5%)', 'HCl diluido', 'AgNO3 0.1 M'],
    keyEquipment: ['Vaso de precipitado 400 mL', 'Embudo analítico de vástago largo', 'Papel filtro Whatman 42', 'Crisol de porcelana', 'Mufla a 800 °C', 'Desecador']
  },
  {
    number: 6,
    unitNumber: 5,
    unitTitle: 'Volumetría de Precipitación',
    title: 'Volumetría de Precipitación: Determinación de Cloruros (Mohr / Fajans)',
    category: 'volumetry',
    status: 'catalog',
    shortObjective: 'Argentometría con AgNO3 estándar empleando K2CrO4 o fluoresceína para determinación de cloruros.',
    keyReagents: ['Nitrato de plata (AgNO3 ~0.05 N)', 'Cromato de potasio indicador', 'Fluoresceína', 'NaCl patrón'],
    keyEquipment: ['Bureta ámbar de 25 mL', 'Erlenmeyer de 250 mL', 'Agitador magnético']
  },
  {
    number: 7,
    unitNumber: 5,
    unitTitle: 'Volumetría de Neutralización',
    title: 'Volumetría Ácido - Base: Acidez Total en Vinagres',
    category: 'volumetry',
    status: 'active',
    shortObjective: 'Determinación potenciométrica y volumétrica de ácido acético en vinagres comerciales con NaOH estándar.',
    keyReagents: ['Vinagre comercial', 'NaOH 0.1 N valorado', 'Fenolftaleína', 'Agua destilada exenta de CO2'],
    keyEquipment: ['Bureta de 50 mL', 'pH-metro con electrodo combinado', 'Pipeta volumétrica aforada 25 mL']
  },
  {
    number: 8,
    unitNumber: 5,
    unitTitle: 'Volumetría Redox',
    title: 'Volumetría Redox: Dicromatometría y Determinación de Hierro',
    category: 'volumetry',
    status: 'catalog',
    shortObjective: 'Oxidación de Fe(II) con K2Cr2O7 patrón primario en presencia de indicador difenilaminosulfonato de bario.',
    keyReagents: ['Dicromato de potasio patrón primario', 'SnCl2 (reductor)', 'HgCl2', 'Mezcla sulfo-fosfórica', 'Difenilaminosulfonato'],
    keyEquipment: ['Bureta de 50 mL', 'Erlenmeyer de 500 mL', 'Placa calefactora']
  },
  {
    number: 9,
    unitNumber: 5,
    unitTitle: 'Volumetría Redox',
    title: 'Volumetría Redox: Yodometría y Determinación de Cobre / Vitamina C',
    category: 'volumetry',
    status: 'catalog',
    shortObjective: 'Estandarización de Na2S2O3 con KIO3 y valoración yodométrica indirecta con almidón como indicador.',
    keyReagents: ['Tiosulfato de sodio ~0.1 N', 'Yodato de potasio KIO3 patrón', 'KI', 'Solución de almidón al 1%'],
    keyEquipment: ['Bureta de 50 mL', 'Matraz yodométrico con tapón esmerilado']
  },
  {
    number: 10,
    unitNumber: 5,
    unitTitle: 'Complejometría',
    title: 'Complejometría con EDTA: Determinación de Dureza Total en Aguas',
    category: 'volumetry',
    status: 'catalog',
    shortObjective: 'Quelatometría de Ca2+ y Mg2+ con EDTA estándar tamponado a pH 10 con indicador Negro de Eriocromo T (NET).',
    keyReagents: ['EDTA sal disódica 0.01 M', 'Tampón NH3/NH4Cl pH 10', 'Negro de Eriocromo T (NET)', 'CaCO3 patrón'],
    keyEquipment: ['Bureta de 50 mL', 'Erlenmeyer de 250 mL', 'Pipeta aforada de 50 mL']
  },
  {
    number: 11,
    unitNumber: 6,
    unitTitle: 'Electroquímica Instrumental',
    title: 'Electrogravimetría: Electrodeposición Cuantitativa de Cobre',
    category: 'instrumental',
    status: 'catalog',
    shortObjective: 'Depósito catódico exhaustivo de Cu2+ sobre electrodo de gasa de platino bajo potencial controlado.',
    keyReagents: ['Solución de sulfato de cobre', 'Ácido nítrico y sulfúrico', 'Etanol'],
    keyEquipment: ['Celda electrolítica', 'Electrodos de gasa de platino (ánodo y cátodo)', 'Fuente DC regulada', 'Balanza analítica']
  },
  {
    number: 12,
    unitNumber: 7,
    unitTitle: 'Espectrofotometría Molecular',
    title: 'Colorimetría y Espectrofotometría UV-Vis (Hierro con 1,10-Fenantrolina)',
    category: 'instrumental',
    status: 'active',
    shortObjective: 'Curva de calibración de Beer-Lambert a 508 nm para el complejo ferroso-fenantrolina y regresión lineal por mínimos cuadrados.',
    keyReagents: ['Patrón Fe 100 ppm', '1,10-Fenantrolina 0.1%', 'Hidroxilamina reductora', 'Tampón acetato pH 4.5'],
    keyEquipment: ['Espectrofotómetro UV-Vis digital', 'Par de cubetas de vidrio óptico 1 cm', 'Matraces aforados 50 mL', 'Micropipetas']
  },
  {
    number: 13,
    unitNumber: 8,
    unitTitle: 'Espectroscopía Atómica',
    title: 'Fotometría de Llama: Determinación de Sodio y Potasio',
    category: 'instrumental',
    status: 'catalog',
    shortObjective: 'Espectrometría de emisión atómica por llama aire-gas para cuantificación de Na (589 nm) y K (766 nm).',
    keyReagents: ['Estándares de NaCl y KCl (1-20 ppm)', 'Agua ultra-pura'],
    keyEquipment: ['Fotómetro de llama con filtros ópticos para Na y K', 'Compresor de aire y cilindro de gas GLP']
  }
];

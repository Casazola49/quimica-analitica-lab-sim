// Configuración canónica de las prácticas volumétricas (P4 y P7)
// Derivadas de data/curriculum_spec.json (UMSS)

export interface PracticeDefinition {
  id: number;
  unitNumber: number;
  code: string;
  title: string;
  objective: string;
  analyte: {
    name: string;
    formula: string;
    equivalentWeight: number;
    nominalVolumeMl?: number; // Para líquidos (P7: 25.00 mL)
    nominalConcentration?: number; // ~0.1000 N
    nominalMassMin?: number; // Para sólidos (P4: 0.2000 g)
    nominalMassMax?: number; // 0.2500 g
  };
  titrant: {
    name: string;
    formula: string;
    targetNormality: number; // 0.1000 N
  };
  indicator: {
    name: string;
    type: 'phenolphthalein' | 'bromothymol_blue';
    pKin: number;
    transitionRange: [number, number];
    optimalDrops: number;
  };
  instrumentalMethod?: {
    type: 'potentiometry';
    electrodeType: 'combined_glass_ag_agcl';
    calibrationBuffers: number[]; // [4.00, 7.00, 10.00]
  };
}

export const PRACTICE_4_CONFIG: PracticeDefinition = {
  id: 4,
  unitNumber: 3,
  code: 'P04_ESTANDARIZACION_NAOH',
  title: 'Preparación y Estandarización de Soluciones (NaOH 0.1 N con Biftalato de Potasio)',
  objective: 'Determinar con exactitud analítica la normalidad de una solución de hidróxido de sodio empleando biftalato de potasio como patrón primario ácido y fenolftaleína como indicador de viraje.',
  analyte: {
    name: 'Biftalato de Potasio (Patrón Primario)',
    formula: 'KHC8H4O4',
    equivalentWeight: 204.22,
    nominalMassMin: 0.2000,
    nominalMassMax: 0.2500,
  },
  titrant: {
    name: 'Hidróxido de Sodio',
    formula: 'NaOH',
    targetNormality: 0.1000,
  },
  indicator: {
    name: 'Fenolftaleína al 0.1% en etanol',
    type: 'phenolphthalein',
    pKin: 9.3,
    transitionRange: [8.2, 10.0],
    optimalDrops: 2,
  },
};

export const PRACTICE_7_CONFIG: PracticeDefinition = {
  id: 7,
  unitNumber: 5,
  code: 'P07_TITULACION_POTENCIOMETRICA_HCL',
  title: 'Volumetría Ácido-Base: Titulación Potenciométrica de HCl con NaOH estándar',
  objective: 'Titular una alícuota de ácido fuerte (HCl ~0.1 N) con NaOH patrón evaluando simultáneamente el viraje con fenolftaleína y la respuesta de un electrodo de pH combinado, trazando la curva de titulación y su primera derivada (dpH/dV) para determinar el punto de equivalencia.',
  analyte: {
    name: 'Ácido Clorhídrico (Alícuota con Pipeta Aforada)',
    formula: 'HCl',
    equivalentWeight: 36.46,
    nominalVolumeMl: 25.00,
    nominalConcentration: 0.1000,
  },
  titrant: {
    name: 'Hidróxido de Sodio (Estandarizado en P4)',
    formula: 'NaOH',
    targetNormality: 0.1015,
  },
  indicator: {
    name: 'Fenolftaleína al 0.1% en etanol',
    type: 'phenolphthalein',
    pKin: 9.3,
    transitionRange: [8.2, 10.0],
    optimalDrops: 2,
  },
  instrumentalMethod: {
    type: 'potentiometry',
    electrodeType: 'combined_glass_ag_agcl',
    calibrationBuffers: [4.00, 7.00, 10.00],
  },
};

export function getPracticeConfig(practiceNumber: number): PracticeDefinition {
  if (practiceNumber === 7) return PRACTICE_7_CONFIG;
  return PRACTICE_4_CONFIG;
}

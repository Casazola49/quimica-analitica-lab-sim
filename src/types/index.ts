// Tipos de dominio para el simulador interactivo de química analítica

export type IndicatorType = 'phenolphthalein' | 'methyl_orange' | 'eriochrome_black_t';

export interface ChemicalSpecies {
  name: string;
  formula: string;
  molecularWeight: number; // g/mol
  equivalentWeight: number; // g/eq
}

export type TechniqueDefectType = 
  | 'DEFECT_UNPURGED_BUBBLE'
  | 'DEFECT_PARALLAX'
  | 'DEFECT_BLOWN_PIPETTE_DROP'
  | 'DEFECT_MISSING_INDICATOR'
  | 'DEFECT_OVERTITRATED'
  | 'DEFECT_INSUFFICIENT_STIRRING';

export interface TechniqueDefect {
  type: TechniqueDefectType;
  title: string;
  description: string;
  physicalImpact: string;
  timestamp: number;
  citationId: string;
}

export type MilestoneType = 
  | 'MS_BURETTE_LOADED'
  | 'MS_BUBBLE_PURGED'
  | 'MS_MENISCUS_ALIGNED'
  | 'MS_ALIQUOT_DELIVERED'
  | 'MS_INDICATOR_ADDED'
  | 'MS_TITRATION_IN_PROGRESS'
  | 'MS_ENDPOINT_DETECTED'
  | 'MS_FINAL_READING';

export interface Milestone {
  id: MilestoneType;
  label: string;
  completed: boolean;
  timestamp?: number;
}

export interface PedagogicalCitation {
  id: string;
  defectType: TechniqueDefectType;
  practiceId: number;
  book: 'Skoog' | 'Day & Underwood' | 'Aguilar';
  edition: string;
  chapter: number;
  chapterTitle: string;
  pagePhysical: number;
  exactQuote: string;
  pedagogicalImpact: string;
  remediationAdvice: string;
  ragDeepLinkQuery: string;
}

export interface LabNotebookData {
  analyteName: string;
  titrantName: string;
  sampleMass: number; // g
  initialVolume: number; // mL
  finalVolume: number; // mL
  netVolume: number; // mL (calculado por alumno)
  studentConcentration: number; // Normalidad o Molaridad calculada por alumno
  studentPurityPercent?: number; // % p/p
}

export interface EvaluationResult {
  score: number; // 0 - 100
  dataIntegrityPassed: boolean;
  arithmeticAccuracyPassed: boolean;
  significantFiguresPassed: boolean;
  relativeErrorPercent: number; // Er %
  trueConcentration: number;
  trueVolumeRequired: number;
  defectsRecorded: TechniqueDefect[];
  feedbackNotes: string[];
}

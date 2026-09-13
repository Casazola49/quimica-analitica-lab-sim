import { Milestone, MilestoneType, TechniqueDefect, TechniqueDefectType } from '../types';
import { PEDAGOGICAL_CITATIONS } from '../data/pedagogicalCitations';

export interface ProcedureState {
  milestones: Record<MilestoneType, Milestone>;
  defects: TechniqueDefect[];
  isBubblePurged: boolean;
  bubbleVolumeMl: number; // burbuja alojada en el pico de la bureta (0.20 mL por defecto)
  indicatorDrops: number;
  isStirring: boolean;
  parallaxAngle: number; // grados de inclinación visual (-10 a +10)
}

export const INITIAL_MILESTONES: Record<MilestoneType, Milestone> = {
  MS_BURETTE_LOADED: { id: 'MS_BURETTE_LOADED', label: 'Cargar solución de NaOH en la bureta', completed: true },
  MS_BUBBLE_PURGED: { id: 'MS_BUBBLE_PURGED', label: 'Purgar burbuja de aire en el pico de la bureta', completed: false },
  MS_MENISCUS_ALIGNED: { id: 'MS_MENISCUS_ALIGNED', label: 'Enrasar y registrar lectura inicial (V0)', completed: false },
  MS_ALIQUOT_DELIVERED: { id: 'MS_ALIQUOT_DELIVERED', label: 'Pesar y disolver biftalato de potasio en erlenmeyer', completed: true },
  MS_INDICATOR_ADDED: { id: 'MS_INDICATOR_ADDED', label: 'Añadir 2-3 gotas de fenolftaleína', completed: false },
  MS_TITRATION_IN_PROGRESS: { id: 'MS_TITRATION_IN_PROGRESS', label: 'Titular gota a gota con agitación constante', completed: false },
  MS_ENDPOINT_DETECTED: { id: 'MS_ENDPOINT_DETECTED', label: 'Detener flujo en el primer viraje rosa tenue persistente', completed: false },
  MS_FINAL_READING: { id: 'MS_FINAL_READING', label: 'Registrar lectura final (Vf) en libreta', completed: false },
};

export class ProcedureEngine {
  private state: ProcedureState;

  constructor() {
    this.state = {
      milestones: { ...INITIAL_MILESTONES },
      defects: [],
      isBubblePurged: false,
      bubbleVolumeMl: 0.20, // 0.20 mL de burbuja en el pico
      indicatorDrops: 0,
      isStirring: false, // Inicia estrictamente detenido
      parallaxAngle: 0,
    };
  }

  public getState(): ProcedureState {
    return { ...this.state };
  }

  public purgeBuretteBubble(): void {
    if (!this.state.isBubblePurged) {
      this.state.isBubblePurged = true;
      this.state.bubbleVolumeMl = 0;
      this.completeMilestone('MS_BUBBLE_PURGED');
    }
  }

  public addIndicatorDrop(): void {
    this.state.indicatorDrops += 1;
    if (this.state.indicatorDrops >= 2) {
      this.completeMilestone('MS_INDICATOR_ADDED');
    }
  }

  public toggleStirring(): boolean {
    this.state.isStirring = !this.state.isStirring;
    return this.state.isStirring;
  }

  public setParallaxAngle(degrees: number): void {
    this.state.parallaxAngle = degrees;
    if (Math.abs(degrees) > 2) {
      this.recordDefect('DEFECT_PARALLAX', 'CITE_PARALLAX_ERROR');
    }
  }

  public onTitrationStarted(): void {
    this.completeMilestone('MS_TITRATION_IN_PROGRESS');

    // Regla TDA: ¿Se titula con la burbuja atrapada en la llave?
    if (!this.state.isBubblePurged && this.state.bubbleVolumeMl > 0) {
      this.recordDefect('DEFECT_UNPURGED_BUBBLE', 'CITE_BURETTE_BUBBLE');
      // La burbuja se desaloja durante el flujo, desplazando líquido falsamente
      this.state.isBubblePurged = true; // ya salió hacia el matraz
    }

    // Regla TDA: ¿Se titula sin haber agregado indicador?
    if (this.state.indicatorDrops === 0) {
      this.recordDefect('DEFECT_MISSING_INDICATOR', 'CITE_MISSING_INDICATOR');
    }
  }

  public onEndpointReached(quality: 'perfect' | 'overtitrated'): void {
    this.completeMilestone('MS_ENDPOINT_DETECTED');
    if (quality === 'overtitrated') {
      this.recordDefect('DEFECT_OVERTITRATED', 'CITE_OVERTITRATED');
    }
  }

  public completeMilestone(type: MilestoneType): void {
    if (this.state.milestones[type] && !this.state.milestones[type].completed) {
      this.state.milestones[type] = {
        ...this.state.milestones[type],
        completed: true,
        timestamp: Date.now(),
      };
    }
  }

  private recordDefect(type: TechniqueDefectType, citationId: string): void {
    const exists = this.state.defects.some((d) => d.type === type);
    if (!exists) {
      const citation = PEDAGOGICAL_CITATIONS[citationId];
      this.state.defects.push({
        type,
        title: citation.chapterTitle,
        description: citation.pedagogicalImpact,
        physicalImpact: citation.remediationAdvice,
        timestamp: Date.now(),
        citationId,
      });
    }
  }
}

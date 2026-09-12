// Motor de Equilibrios Químicos y Mapeo Cromático Continuo (ADR-0003)

export interface TitrationState {
  sampleMassGrams: number; // masa pesada de KHP (g)
  titrantNormality: number; // concentración real de NaOH (N = eq/L)
  initialBuretteVolumeMl: number; // V0
  currentBuretteVolumeMl: number; // Volumen entregado acumulado V (mL)
  indicatorDrops: number; // gotas agregadas
}

export interface EquilibriumPoint {
  volumeAddedMl: number;
  pH: number;
  indicatorFraction: number; // alpha [0, 1]
  liquidRgba: string;
  isEndpointPassed: boolean;
  endpointQuality: 'none' | 'perfect' | 'overtitrated';
}

/**
 * Calcula el pH exacto de la titulación de Biftalato de Potasio con NaOH.
 * KHP es una sal ácida que actúa como ácido monoprótico débil:
 * HP- + OH- -> P2- + H2O
 * pKa2 del ácido ftálico = 5.408 a 25 °C.
 */
export function calculateAcidBasePH(
  sampleMassGrams: number,
  equivalentWeight: number,
  titrantNormality: number,
  volumeTitrantAddedMl: number,
  initialDilutionVolumeMl: number = 50 // agua destilada agregada en erlenmeyer
): number {
  const kw = 1.0e-14;
  const ka = 3.91e-6; // Ka2 de KHP (pKa ~ 5.408)
  const molesAnalyte = sampleMassGrams / equivalentWeight;
  const volumeEquivalenceMl = (molesAnalyte / titrantNormality) * 1000;
  const currentTotalVolumeL = (initialDilutionVolumeMl + volumeTitrantAddedMl) / 1000;

  // 1. Antes de iniciar la titulación (V = 0)
  if (volumeTitrantAddedMl <= 0.0001) {
    const cAnalyte = molesAnalyte / (initialDilutionVolumeMl / 1000);
    // [H+] = sqrt(Ka * C)
    const hConc = Math.sqrt(ka * cAnalyte);
    return Math.min(14, Math.max(0, -Math.log10(hConc)));
  }

  // 2. Zona buffer (antes del punto de equivalencia: V < Veq)
  if (volumeTitrantAddedMl < volumeEquivalenceMl - 0.005) {
    const molesTitrantAdded = (volumeTitrantAddedMl / 1000) * titrantNormality;
    const molesUnreacted = molesAnalyte - molesTitrantAdded;
    // Henderson-Hasselbalch: pH = pKa + log10([Base]/[Ácido])
    const ratio = molesTitrantAdded / molesUnreacted;
    const ph = 5.408 + Math.log10(ratio);
    return Math.min(14, Math.max(0, ph));
  }

  // 3. Punto de equivalencia estricto (V ~ Veq)
  if (Math.abs(volumeTitrantAddedMl - volumeEquivalenceMl) <= 0.005) {
    // Hidrólisis del ftalato (base débil): P2- + H2O <=> HP- + OH-
    // Kb = Kw / Ka
    const kb = kw / ka;
    const cSalt = molesAnalyte / currentTotalVolumeL;
    const ohConc = Math.sqrt(kb * cSalt);
    const poh = -Math.log10(ohConc);
    return Math.min(14, Math.max(0, 14 - poh));
  }

  // 4. Exceso de reactivo titulante (después del punto de equivalencia: V > Veq)
  const excessVolumeL = (volumeTitrantAddedMl - volumeEquivalenceMl) / 1000;
  const molesExcessOh = excessVolumeL * titrantNormality;
  const ohConc = molesExcessOh / currentTotalVolumeL;
  const poh = -Math.log10(ohConc);
  return Math.min(14, Math.max(0, 14 - poh));
}

/**
 * Calcula la fracción disociada del indicador de fenolftaleína (pKin = 9.3)
 * alpha = 1 / (1 + 10^(pKin - pH))
 */
export function calculatePhenolphthaleinAlpha(ph: number, pKin: number = 9.3): number {
  const exponent = pKin - ph;
  if (exponent > 10) return 0;
  if (exponent < -10) return 1;
  return 1 / (1 + Math.pow(10, exponent));
}

/**
 * Mapea la fracción disociada a un color RGBA continuo.
 * Incoloro -> Rosa Tenue (Punto Final Ideal) -> Fucsia Intenso (Sobretitulado).
 */
export function getIndicatorColor(alpha: number, hasIndicator: boolean): string {
  if (!hasIndicator || alpha < 0.02) {
    // Solución incolora con tenue refracción azulada de agua limpia
    return 'rgba(235, 245, 255, 0.35)';
  }

  // Si hay indicador, interpolamos el matiz fucsia/rosado
  // Punto final ideal: alpha entre 0.08 y 0.25 (rosa translúcido muy pálido)
  // Sobretitulación: alpha > 0.40 (fucsia profundo saturado)
  const r = 244;
  const g = Math.round(114 - alpha * 90); // 114 -> 24
  const b = Math.round(182 - alpha * 70); // 182 -> 112
  const opacity = Math.min(0.88, Math.max(0.35, 0.35 + alpha * 0.53));

  return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;
}

/**
 * Evaluación unificada del punto instantáneo de la mesada.
 */
export function evaluateBenchEquilibrium(
  sampleMassGrams: number,
  equivalentWeight: number,
  titrantNormality: number,
  volumeAddedMl: number,
  indicatorDrops: number
): EquilibriumPoint {
  const ph = calculateAcidBasePH(
    sampleMassGrams,
    equivalentWeight,
    titrantNormality,
    volumeAddedMl
  );

  const hasIndicator = indicatorDrops > 0;
  const alpha = hasIndicator ? calculatePhenolphthaleinAlpha(ph) : 0;
  const color = getIndicatorColor(alpha, hasIndicator);

  const molesAnalyte = sampleMassGrams / equivalentWeight;
  const volumeEquivalenceMl = (molesAnalyte / titrantNormality) * 1000;
  const isEndpointPassed = volumeAddedMl >= volumeEquivalenceMl;

  let endpointQuality: 'none' | 'perfect' | 'overtitrated' = 'none';
  if (alpha >= 0.08 && alpha <= 0.30) {
    endpointQuality = 'perfect'; // Rosa pálido tenue (Skoog pág. 328)
  } else if (alpha > 0.30) {
    endpointQuality = 'overtitrated'; // Fucsia intenso
  }

  return {
    volumeAddedMl,
    pH: Number(ph.toFixed(2)),
    indicatorFraction: Number(alpha.toFixed(3)),
    liquidRgba: color,
    isEndpointPassed,
    endpointQuality,
  };
}

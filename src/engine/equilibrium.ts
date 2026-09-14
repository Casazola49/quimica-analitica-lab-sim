// Motor de Equilibrios Químicos y Mapeo Cromático Continuo (ADR-0003 & ADR-0009)

export interface EquilibriumPoint {
  volumeAddedMl: number;
  pH: number;
  indicatorFraction: number; // alpha [0, 1]
  liquidRgba: string;
  isEndpointPassed: boolean;
  endpointQuality: 'none' | 'perfect' | 'overtitrated';
}

/**
 * Calcula el pH exacto de P4: Biftalato de Potasio (sal ácida monoprótica débil) con NaOH.
 * pKa2 de KHP = 5.408
 */
export function calculateP4PH(
  sampleMassGrams: number,
  equivalentWeight: number,
  titrantNormality: number,
  volumeTitrantAddedMl: number,
  initialDilutionVolumeMl: number = 50
): number {
  const kw = 1.0e-14;
  const ka = 3.91e-6; // Ka2 de KHP (pKa ~ 5.408)
  const molesAnalyte = sampleMassGrams / equivalentWeight;
  const volumeEquivalenceMl = (molesAnalyte / titrantNormality) * 1000;
  const currentTotalVolumeL = (initialDilutionVolumeMl + volumeTitrantAddedMl) / 1000;

  if (volumeTitrantAddedMl <= 0.0001) {
    const cAnalyte = molesAnalyte / (initialDilutionVolumeMl / 1000);
    const hConc = Math.sqrt(ka * cAnalyte);
    return Math.min(14, Math.max(0, -Math.log10(hConc)));
  }

  if (volumeTitrantAddedMl < volumeEquivalenceMl - 0.005) {
    const molesTitrantAdded = (volumeTitrantAddedMl / 1000) * titrantNormality;
    const molesUnreacted = molesAnalyte - molesTitrantAdded;
    const ratio = molesTitrantAdded / molesUnreacted;
    const ph = 5.408 + Math.log10(ratio);
    return Math.min(14, Math.max(0, ph));
  }

  if (Math.abs(volumeTitrantAddedMl - volumeEquivalenceMl) <= 0.005) {
    const kb = kw / ka;
    const cSalt = molesAnalyte / currentTotalVolumeL;
    const ohConc = Math.sqrt(kb * cSalt);
    const poh = -Math.log10(ohConc);
    return Math.min(14, Math.max(0, 14 - poh));
  }

  const excessVolumeL = (volumeTitrantAddedMl - volumeEquivalenceMl) / 1000;
  const molesExcessOh = excessVolumeL * titrantNormality;
  const ohConc = molesExcessOh / currentTotalVolumeL;
  const poh = -Math.log10(ohConc);
  return Math.min(14, Math.max(0, 14 - poh));
}

/**
 * Calcula el pH exacto de P7: Ácido Fuerte (HCl) con Base Fuerte (NaOH).
 * Salto abrupto de pH 3 a pH 10 en la vecindad de Veq.
 */
export function calculateP7PH(
  aliquotVolumeMl: number, // 25.00 mL
  acidNormality: number, // ~0.1000 N
  titrantNormality: number, // ~0.1015 N
  volumeTitrantAddedMl: number,
  initialDilutionVolumeMl: number = 25
): number {
  const molesAcid = (aliquotVolumeMl / 1000) * acidNormality;
  const volumeEquivalenceMl = (molesAcid / titrantNormality) * 1000;
  const currentTotalVolumeL = (aliquotVolumeMl + initialDilutionVolumeMl + volumeTitrantAddedMl) / 1000;

  // 1. Antes del punto de equivalencia (V < Veq)
  if (volumeTitrantAddedMl < volumeEquivalenceMl - 0.005) {
    const molesBaseAdded = (volumeTitrantAddedMl / 1000) * titrantNormality;
    const molesUnreactedH = molesAcid - molesBaseAdded;
    const hConc = molesUnreactedH / currentTotalVolumeL;
    const ph = -Math.log10(Math.max(1e-14, hConc));
    return Math.min(14, Math.max(0.5, ph));
  }

  // 2. En el punto de equivalencia exacto (V ~ Veq)
  if (Math.abs(volumeTitrantAddedMl - volumeEquivalenceMl) <= 0.005) {
    return 7.00; // Agua neutra con NaCl inerte
  }

  // 3. Después del punto de equivalencia (V > Veq)
  const molesExcessOh = ((volumeTitrantAddedMl - volumeEquivalenceMl) / 1000) * titrantNormality;
  const ohConc = molesExcessOh / currentTotalVolumeL;
  const poh = -Math.log10(Math.max(1e-14, ohConc));
  return Math.min(14, Math.max(7, 14 - poh));
}

/**
 * Calcula la fracción disociada del indicador de fenolftaleína (pKin = 9.3)
 */
export function calculatePhenolphthaleinAlpha(ph: number, pKin: number = 9.3): number {
  const exponent = pKin - ph;
  if (exponent > 10) return 0;
  if (exponent < -10) return 1;
  return 1 / (1 + Math.pow(10, exponent));
}

/**
 * Mapea la fracción disociada a un color RGBA continuo.
 */
export function getIndicatorColor(alpha: number, hasIndicator: boolean): string {
  if (!hasIndicator || alpha < 0.02) {
    return 'rgba(235, 245, 255, 0.35)';
  }

  const r = 244;
  const g = Math.round(114 - alpha * 90);
  const b = Math.round(182 - alpha * 70);
  const opacity = Math.min(0.88, Math.max(0.35, 0.35 + alpha * 0.53));

  return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;
}

/**
 * Evaluación unificada del punto instantáneo de la mesada según la práctica.
 */
export function evaluateBenchEquilibrium(
  sampleAmount: number, // g en P4 (masa KHP), o N_HCl en P7
  equivalentWeight: number,
  titrantNormality: number,
  volumeAddedMl: number,
  indicatorDrops: number,
  practiceNumber: number = 4
): EquilibriumPoint {
  let ph = 7.0;
  let volumeEquivalenceMl = 10.0;

  if (practiceNumber === 7) {
    // P7: sampleAmount es la normalidad de HCl (~0.1000 N), alícuota fija 25 mL
    const acidNormality = sampleAmount > 0.01 ? sampleAmount : 0.1000;
    ph = calculateP7PH(25.0, acidNormality, titrantNormality, volumeAddedMl);
    volumeEquivalenceMl = ((25.0 * acidNormality) / titrantNormality);
  } else {
    // P4: sampleAmount es la masa de KHP en gramos (~0.2150 g)
    ph = calculateP4PH(sampleAmount, equivalentWeight, titrantNormality, volumeAddedMl);
    const molesAnalyte = sampleAmount / equivalentWeight;
    volumeEquivalenceMl = (molesAnalyte / titrantNormality) * 1000;
  }

  const hasIndicator = indicatorDrops > 0;
  const alpha = hasIndicator ? calculatePhenolphthaleinAlpha(ph) : 0;
  const color = getIndicatorColor(alpha, hasIndicator);
  const isEndpointPassed = volumeAddedMl >= volumeEquivalenceMl;

  let endpointQuality: 'none' | 'perfect' | 'overtitrated' = 'none';
  if (alpha >= 0.08 && alpha <= 0.30) {
    endpointQuality = 'perfect';
  } else if (alpha > 0.30) {
    endpointQuality = 'overtitrated';
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

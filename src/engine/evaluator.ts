import { EvaluationResult, LabNotebookData, TechniqueDefect } from '../types';

/**
 * Pipeline de Evaluación Estequiométrica en Tres Etapas (ADR-0005)
 * Práctica: Estandarización de NaOH con Biftalato de Potasio
 * Fórmula canónica: N = (m_KHP * 1000) / (PE_KHP * Delta_V)
 */
export function evaluateStudentNotebook(
  data: LabNotebookData,
  trueNormality: number, // Valor teórico verdadero aleatorizado de la sesión
  defects: TechniqueDefect[],
  equivalentWeight: number = 204.22
): EvaluationResult {
  const feedbackNotes: string[] = [];
  let score = 100;

  // Etapa 1: Validación de Consistencia Física de Datos Crudos
  let dataIntegrityPassed = true;
  if (data.sampleMass <= 0 || data.sampleMass > 2.0) {
    dataIntegrityPassed = false;
    feedbackNotes.push('La masa de patrón primario debe ser un valor positivo razonable (típicamente 0.20 a 0.25 g).');
    score -= 20;
  }

  if (data.finalVolume < data.initialVolume) {
    dataIntegrityPassed = false;
    feedbackNotes.push('El volumen final de la bureta (Vf) no puede ser menor a la lectura inicial (V0).');
    score -= 20;
  }

  const calculatedNetVolume = Number((data.finalVolume - data.initialVolume).toFixed(2));
  if (Math.abs(data.netVolume - calculatedNetVolume) > 0.05) {
    dataIntegrityPassed = false;
    feedbackNotes.push(`El volumen neto anotado (${data.netVolume} mL) difiere de la resta (Vf - V0 = ${calculatedNetVolume} mL).`);
    score -= 15;
  }

  // Etapa 2: Rigor Aritmético y Cifras Significativas
  let arithmeticAccuracyPassed = false;
  let significantFiguresPassed = false;

  if (dataIntegrityPassed && data.netVolume > 0) {
    // Cálculo teórico con los datos brutos del estudiante:
    const expectedStudentN = (data.sampleMass * 1000) / (equivalentWeight * data.netVolume);
    const relativeArithmeticDiff = Math.abs(data.studentConcentration - expectedStudentN) / expectedStudentN;

    if (relativeArithmeticDiff <= 0.005) {
      arithmeticAccuracyPassed = true;
    } else {
      feedbackNotes.push(`Error en el cálculo aritmético: según sus datos (m=${data.sampleMass} g, ΔV=${data.netVolume} mL), la normalidad debería ser ${expectedStudentN.toFixed(4)} N, pero ingresó ${data.studentConcentration} N.`);
      score -= 25;
    }

    // Validación de Cifras Significativas: En volumetría analítica se exigen 4 cifras significativas (ej: 0.1024)
    const strVal = data.studentConcentration.toString();
    const decimalPart = strVal.split('.')[1] || '';
    if (decimalPart.length >= 3 && decimalPart.length <= 5) {
      significantFiguresPassed = true;
    } else {
      feedbackNotes.push('Atención a las cifras significativas: la concentración de una solución valorada debe expresarse con 4 cifras significativas (ej. 0.1023 N).');
      score -= 10;
    }
  }

  // Etapa 3: Metrología y Comparación contra el Valor Verdadero
  const molesReal = data.sampleMass / equivalentWeight;
  const trueVolumeRequired = (molesReal / trueNormality) * 1000;
  const relativeErrorPercent = Math.abs((data.studentConcentration - trueNormality) / trueNormality) * 100;

  if (relativeErrorPercent > 3.0) {
    score -= Math.min(25, Math.round(relativeErrorPercent * 2));
    feedbackNotes.push(`Su concentración calculada (${data.studentConcentration} N) difiere del valor verdadero de la solución (${trueNormality.toFixed(4)} N) en un ${relativeErrorPercent.toFixed(2)}%.`);
  }

  // Deducción por Defectos de Técnica de Mesada (TDA)
  for (const defect of defects) {
    if (defect.type === 'DEFECT_UNPURGED_BUBBLE') {
      score -= 15;
      feedbackNotes.push('Penalización TDA: Tituló con aire en el pico de la bureta. El volumen desalojado falseó el gasto neto.');
    } else if (defect.type === 'DEFECT_PARALLAX') {
      score -= 10;
      feedbackNotes.push('Penalización TDA: Lectura de menisco con error de paralaje (línea de mira inclinada).');
    } else if (defect.type === 'DEFECT_OVERTITRATED') {
      score -= 15;
      feedbackNotes.push('Penalización TDA: Sobretitulación evidente (solución fucsia intensa en lugar de rosa pálido tenue).');
    } else if (defect.type === 'DEFECT_MISSING_INDICATOR') {
      score -= 25;
      feedbackNotes.push('Penalización TDA: Inició la titulación sin haber añadido fenolftaleína a la alícuota.');
    }
  }

  const finalScore = Math.max(0, Math.min(100, score));

  return {
    score: finalScore,
    dataIntegrityPassed,
    arithmeticAccuracyPassed,
    significantFiguresPassed,
    relativeErrorPercent: Number(relativeErrorPercent.toFixed(2)),
    trueConcentration: trueNormality,
    trueVolumeRequired: Number(trueVolumeRequired.toFixed(2)),
    defectsRecorded: defects,
    feedbackNotes,
  };
}

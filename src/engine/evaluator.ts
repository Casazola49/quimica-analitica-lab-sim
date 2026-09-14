import { EvaluationResult, LabNotebookData, TechniqueDefect } from '../types';

/**
 * Pipeline de Evaluación Estequiométrica en Tres Etapas (ADR-0005 & ADR-0009)
 * Soporta:
 * - Práctica 4: Estandarización de NaOH con Biftalato de Potasio
 * - Práctica 7: Titulación de Ácido Clorhídrico (HCl) con NaOH estándar
 */
export function evaluateStudentNotebook(
  data: LabNotebookData,
  trueConcentration: number, // Valor teórico verdadero aleatorizado de la sesión
  defects: TechniqueDefect[],
  practiceNumber: number = 4,
  equivalentWeight: number = 204.22,
  titrantNormalityP7: number = 0.1015
): EvaluationResult {
  const feedbackNotes: string[] = [];
  let score = 100;

  // Etapa 1: Validación de Consistencia Física de Datos Crudos
  let dataIntegrityPassed = true;

  if (practiceNumber === 4) {
    if (data.sampleMass <= 0 || data.sampleMass > 2.0) {
      dataIntegrityPassed = false;
      feedbackNotes.push('La masa de patrón primario KHP debe ser un valor positivo razonable (típicamente 0.20 a 0.25 g).');
      score -= 20;
    }
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
    let expectedStudentN = 0.1000;

    if (practiceNumber === 7) {
      // P7: N_HCl = (V_NaOH * N_NaOH) / V_alicuota (con V_alicuota = 25.00 mL)
      const aliquotVolume = 25.00;
      expectedStudentN = (data.netVolume * titrantNormalityP7) / aliquotVolume;
    } else {
      // P4: N_NaOH = (m_KHP * 1000) / (PE_KHP * Delta_V)
      expectedStudentN = (data.sampleMass * 1000) / (equivalentWeight * data.netVolume);
    }

    const relativeArithmeticDiff = Math.abs(data.studentConcentration - expectedStudentN) / expectedStudentN;

    if (relativeArithmeticDiff <= 0.005) {
      arithmeticAccuracyPassed = true;
    } else {
      feedbackNotes.push(
        practiceNumber === 7
          ? `Error en el cálculo aritmético: según sus datos (ΔV=${data.netVolume} mL, Valícuota=25.00 mL, N_NaOH=${titrantNormalityP7}), la concentración de HCl debería ser ${expectedStudentN.toFixed(4)} N, pero ingresó ${data.studentConcentration} N.`
          : `Error en el cálculo aritmético: según sus datos (m=${data.sampleMass} g, ΔV=${data.netVolume} mL), la normalidad debería ser ${expectedStudentN.toFixed(4)} N, pero ingresó ${data.studentConcentration} N.`
      );
      score -= 25;
    }

    // Validación de Cifras Significativas (4 cifras exigidas en volumetría analítica)
    const strVal = data.studentConcentration.toString();
    const decimalPart = strVal.split('.')[1] || '';
    if (decimalPart.length >= 3 && decimalPart.length <= 5) {
      significantFiguresPassed = true;
    } else {
      feedbackNotes.push('Atención a las cifras significativas: exprese la concentración con 4 cifras significativas rigurosas (ej. 0.1012 N).');
      score -= 10;
    }
  }

  // Etapa 3: Metrología y Comparación contra el Valor Verdadero
  let trueVolumeRequired = 0;
  if (practiceNumber === 7) {
    trueVolumeRequired = (25.00 * trueConcentration) / titrantNormalityP7;
  } else {
    const molesReal = data.sampleMass / equivalentWeight;
    trueVolumeRequired = (molesReal / trueConcentration) * 1000;
  }

  const relativeErrorPercent = Math.abs((data.studentConcentration - trueConcentration) / trueConcentration) * 100;

  if (relativeErrorPercent > 3.0) {
    score -= Math.min(25, Math.round(relativeErrorPercent * 2));
    feedbackNotes.push(`Su concentración calculada (${data.studentConcentration} N) difiere del valor verdadero (${trueConcentration.toFixed(4)} N) en un ${relativeErrorPercent.toFixed(2)}%.`);
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
      feedbackNotes.push('Penalización TDA: Inició la titulación sin haber añadido indicador a la alícuota.');
    } else if (defect.type === 'DEFECT_BLOWN_PIPETTE_DROP') {
      score -= 15;
      feedbackNotes.push('Penalización TDA: Sopló la última gota de la pipeta aforada calibrada para vertido libre TD/Ex.');
    }
  }

  const finalScore = Math.max(0, Math.min(100, score));

  return {
    score: finalScore,
    dataIntegrityPassed,
    arithmeticAccuracyPassed,
    significantFiguresPassed,
    relativeErrorPercent: Number(relativeErrorPercent.toFixed(2)),
    trueConcentration,
    trueVolumeRequired: Number(trueVolumeRequired.toFixed(2)),
    defectsRecorded: defects,
    feedbackNotes,
  };
}

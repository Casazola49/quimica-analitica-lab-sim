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

  if (practiceNumber === 12) {
    // P12: Espectrofotometría UV-Vis (Concentración en ppm Fe)
    if (data.studentConcentration <= 0 || data.studentConcentration > 20) {
      dataIntegrityPassed = false;
      feedbackNotes.push('La concentración de la muestra problema de hierro debe ser un valor positivo razonable (típicamente 1 a 5 ppm).');
      score -= 20;
    }
  } else if (practiceNumber === 5) {
    // P5: Gravimetría de BaSO4
    if (data.sampleMass <= 0 || data.sampleMass > 2.0) {
      dataIntegrityPassed = false;
      feedbackNotes.push('La masa de muestra de sulfatos debe ser positiva (~0.5000 g).');
      score -= 20;
    }
    if ((data.studentPurityPercent || 0) <= 0 || (data.studentPurityPercent || 0) > 100) {
      dataIntegrityPassed = false;
      feedbackNotes.push('El porcentaje de sulfato debe estar entre 0% y 100%.');
      score -= 20;
    }
  } else {
    // Volumetría (P4 y P7)
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
  }

  // Etapa 2: Rigor Aritmético y Cifras Significativas
  let arithmeticAccuracyPassed = false;
  let significantFiguresPassed = false;

  if (practiceNumber === 12) {
    // P12: Interpolación por Ley de Beer
    const relDiff = Math.abs(data.studentConcentration - trueConcentration) / trueConcentration;
    if (relDiff <= 0.03) {
      arithmeticAccuracyPassed = true;
    } else {
      feedbackNotes.push(`Error en la interpolación de la Ley de Beer: según la recta de calibración, la concentración debería aproximarse a ${trueConcentration.toFixed(2)} ppm, pero ingresó ${data.studentConcentration} ppm.`);
      score -= 25;
    }

    const strPpm = data.studentConcentration.toString();
    if (strPpm.includes('.') && strPpm.split('.')[1].length >= 2) {
      significantFiguresPassed = true;
    } else {
      feedbackNotes.push('Atención a las cifras significativas: exprese la concentración fotométrica con al menos 2 decimales (ej. 2.45 ppm).');
      score -= 10;
    }
  } else if (practiceNumber === 5) {
    // P5: % SO4 = (m_BaSO4 * 0.4116 / m_muestra) * 100
    const netBaSO4 = data.netVolume;
    const expectedPercent = (netBaSO4 * 0.4116 * 100) / data.sampleMass;
    const studentPct = data.studentPurityPercent || 0;
    const relDiff = Math.abs(studentPct - expectedPercent) / expectedPercent;

    if (relDiff <= 0.01) {
      arithmeticAccuracyPassed = true;
    } else {
      feedbackNotes.push(`Error en la estequiometría gravimétrica: según sus datos (m_BaSO4=${netBaSO4} g, m_muestra=${data.sampleMass} g, FG=0.4116), el porcentaje de SO4 debería ser ${expectedPercent.toFixed(2)}%, pero ingresó ${studentPct.toFixed(2)}%.`);
      score -= 25;
    }

    const strPct = studentPct.toString();
    if (strPct.includes('.') && strPct.split('.')[1].length >= 2) {
      significantFiguresPassed = true;
    } else {
      feedbackNotes.push('Atención a las cifras significativas: exprese el porcentaje gravimétrico con al menos 2 cifras decimales (ej. 28.98%).');
      score -= 10;
    }
  } else if (dataIntegrityPassed && data.netVolume > 0) {
    let expectedStudentN = 0.1000;

    if (practiceNumber === 7) {
      const aliquotVolume = 25.00;
      expectedStudentN = (data.netVolume * titrantNormalityP7) / aliquotVolume;
    } else {
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
  let relativeErrorPercent = 0;
  let trueVolumeRequired = 0;

  if (practiceNumber === 12) {
    relativeErrorPercent = Math.abs((data.studentConcentration - trueConcentration) / trueConcentration) * 100;
    if (relativeErrorPercent > 3.0) {
      score -= Math.min(25, Math.round(relativeErrorPercent * 2));
      feedbackNotes.push(`Su concentración interpolada (${data.studentConcentration} ppm) difiere del valor verdadero de la muestra (${trueConcentration.toFixed(2)} ppm) en un ${relativeErrorPercent.toFixed(2)}%.`);
    }
  } else if (practiceNumber === 5) {
    const studentPct = data.studentPurityPercent || 0;
    relativeErrorPercent = Math.abs((studentPct - trueConcentration) / trueConcentration) * 100;
    if (relativeErrorPercent > 3.0) {
      score -= Math.min(25, Math.round(relativeErrorPercent * 2));
      feedbackNotes.push(`Su porcentaje obtenido (${studentPct.toFixed(2)}%) difiere del valor verdadero de la muestra (${trueConcentration.toFixed(2)}%) en un ${relativeErrorPercent.toFixed(2)}%.`);
    }
  } else {
    if (practiceNumber === 7) {
      trueVolumeRequired = (25.00 * trueConcentration) / titrantNormalityP7;
    } else {
      const molesReal = data.sampleMass / equivalentWeight;
      trueVolumeRequired = (molesReal / trueConcentration) * 1000;
    }

    relativeErrorPercent = Math.abs((data.studentConcentration - trueConcentration) / trueConcentration) * 100;

    if (relativeErrorPercent > 3.0) {
      score -= Math.min(25, Math.round(relativeErrorPercent * 2));
      feedbackNotes.push(`Su concentración calculada (${data.studentConcentration} N) difiere del valor verdadero (${trueConcentration.toFixed(4)} N) en un ${relativeErrorPercent.toFixed(2)}%.`);
    }
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
    } else if (defect.type === 'DEFECT_NO_DIGESTION') {
      score -= 20;
      feedbackNotes.push('Penalización TDA: Filtró sin completar la digestión térmica. Pérdida de cristales finos coloidales de BaSO4.');
    } else if (defect.type === 'DEFECT_INCOMPLETE_WASHING') {
      score -= 20;
      feedbackNotes.push('Penalización TDA: Lavado incompleto del precipitado (prueba de AgNO3 aún positiva a cloruros).');
    } else if (defect.type === 'DEFECT_WEIGHING_HOT_CRUCIBLE') {
      score -= 15;
      feedbackNotes.push('Penalización TDA: Pesó el crisol caliente sin esperar enfriamiento en desecador (error de convección).');
    } else if (defect.type === 'DEFECT_FINGERPRINTS_ON_CUVETTE') {
      score -= 15;
      feedbackNotes.push('Penalización TDA: Cubeta óptica con huellas dactilares (aumento espurio de absorbancia por dispersión).');
    } else if (defect.type === 'DEFECT_NO_BLANK_ZERO') {
      score -= 20;
      feedbackNotes.push('Penalización TDA: Omitió el ajuste de cero de absorbancia con el blanco de reactivos.');
    } else if (defect.type === 'DEFECT_WRONG_WAVELENGTH') {
      score -= 15;
      feedbackNotes.push('Penalización TDA: Medición fuera de la longitud de onda de máxima absorción (508 nm).');
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

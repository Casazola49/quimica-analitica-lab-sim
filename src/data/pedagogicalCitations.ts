import { PedagogicalCitation } from '../types';

export const PEDAGOGICAL_CITATIONS: Record<string, PedagogicalCitation> = {
  CITE_BURETTE_BUBBLE: {
    id: 'CITE_BURETTE_BUBBLE',
    defectType: 'DEFECT_UNPURGED_BUBBLE',
    practiceId: 4,
    book: 'Skoog',
    edition: '9na Edición (2014)',
    chapter: 2,
    chapterTitle: 'Productos químicos, aparatos y operaciones unitarias en química analítica',
    pagePhysical: 41,
    exactQuote: 'Antes de realizar la lectura inicial, el espacio comprendido entre la llave y el orificio de salida de la bureta debe llenarse de líquido y eliminarse completamente cualquier burbuja de aire atrapada. Una burbuja que se desaloje durante la valoración introduce un error determinado por exceso en el volumen medido.',
    pedagogicalImpact: 'La burbuja de aire alojada en la punta desaloja volumen durante la titulación que se suma falsamente al volumen consumido de titulante (ΔVaparente > ΔVreal), provocando un cálculo erróneo por defecto de la concentración real.',
    remediationAdvice: 'Abra rápidamente la llave de la bureta hacia un vaso de precipitado de desecho con un giro enérgico de 180° para forzar la salida de la burbuja por presión hidrostática antes de registrar V0.',
    ragDeepLinkQuery: 'como purgar burbujas de aire en la punta de la bureta error volumetrico'
  },
  CITE_PARALLAX_ERROR: {
    id: 'CITE_PARALLAX_ERROR',
    defectType: 'DEFECT_PARALLAX',
    practiceId: 4,
    book: 'Day & Underwood',
    edition: '6ta Edición (1989)',
    chapter: 2,
    chapterTitle: 'Tratamiento de datos analíticos y operaciones volumétricas',
    pagePhysical: 34,
    exactQuote: 'Al leer la posición del menisco en una bureta o pipeta, el ojo del observador debe estar exactamente en el mismo plano horizontal que la superficie del menisco. Si el ojo está por encima, el menisco parece más bajo (error por defecto); si está por debajo, parece más alto (error por exceso). A esto se le conoce como error de paralaje.',
    pedagogicalImpact: 'Una inclinación visual de apenas 5° respecto a la horizontal puede introducir un error de lectura de 0.05 a 0.15 mL en cada cota, acumulando un desvío inaceptable en el gasto neto.',
    remediationAdvice: 'Ajuste la altura de la bureta en el soporte universal de modo que la cota de líquido quede a la altura exacta de su línea de visión antes de registrar el volumen.',
    ragDeepLinkQuery: 'error de paralaje en lectura de meniscos de bureta y pipeta'
  },
  CITE_BLOWN_PIPETTE: {
    id: 'CITE_BLOWN_PIPETTE',
    defectType: 'DEFECT_BLOWN_PIPETTE_DROP',
    practiceId: 4,
    book: 'Skoog',
    edition: '9na Edición (2014)',
    chapter: 2,
    chapterTitle: 'Productos químicos, aparatos y operaciones unitarias en química analítica',
    pagePhysical: 39,
    exactQuote: 'Las pipetas volumétricas de transferencia están calibradas para verter (marcada TD o Ex) su volumen nominal por gravedad libre. La última porción que queda en la punta no debe expulsarse soplando ni sacudiendo, pues dicha porción ya ha sido tomada en cuenta en la calibración del fabricante.',
    pedagogicalImpact: 'Expulsar forzadamente la última gota transfiere aproximadamente 0.03 a 0.05 mL adicionales de analito o alícuota, adulterando la masa real sometida a valoración.',
    remediationAdvice: 'Deje que la pipeta drene libremente en posición vertical tocando la pared interna inclinada del erlenmeyer durante 15 segundos; retire la punta sin soplar.',
    ragDeepLinkQuery: 'por que no se debe soplar la ultima gota de una pipeta aforada TD Ex'
  },
  CITE_MISSING_INDICATOR: {
    id: 'CITE_MISSING_INDICATOR',
    defectType: 'DEFECT_MISSING_INDICATOR',
    practiceId: 4,
    book: 'Aguilar',
    edition: '2da Edición (1999)',
    chapter: 5,
    chapterTitle: 'Equilibrios ácido-base y volumetrías de neutralización',
    pagePhysical: 112,
    exactQuote: 'El punto de equivalencia estequiométrico es una condición teórica ideal. Para hacerlo visible experimentalmente como punto final se requiere un indicador químico que experimente un cambio brusco de color en la vecindad inmediata del salto de pH.',
    pedagogicalImpact: 'Sin indicador químico disuelto en la alícuota, la neutralización estequiométrica ocurre de manera invisible y el operador vacía la bureta por completo sin detectar viraje.',
    remediationAdvice: 'Añada siempre 2 a 3 gotas de la solución de indicador antes de iniciar el goteo del reactivo titulante.',
    ragDeepLinkQuery: 'eleccion de indicador quimico en volumetrias de neutralizacion acido base'
  },
  CITE_OVERTITRATED: {
    id: 'CITE_OVERTITRATED',
    defectType: 'DEFECT_OVERTITRATED',
    practiceId: 4,
    book: 'Skoog',
    edition: '9na Edición (2014)',
    chapter: 14,
    chapterTitle: 'Principios de las valoraciones de neutralización',
    pagePhysical: 328,
    exactQuote: 'En la valoración con fenolftaleína de una disolución incolora con NaOH, el punto final correcto corresponde a la aparición del primer color rosa muy tenue que persista durante al menos 30 segundos. Un color fucsia o magenta intenso es síntoma inequívoco de sobrevaloración, habiéndose añadido un exceso apreciable de reactivo.',
    pedagogicalImpact: 'La sobretitulación incrementa el volumen medido más allá del punto estequiométrico, produciendo un error por exceso en la concentración de analito calculada.',
    remediationAdvice: 'Al observar que las gotas de titulante dejan un halo de color transitorio que tarda en disiparse, disminuya la velocidad de flujo a gota a gota estricta con agitación constante.',
    ragDeepLinkQuery: 'como detectar el viraje exacto de fenolftaleina sin sobretitular'
  }
};

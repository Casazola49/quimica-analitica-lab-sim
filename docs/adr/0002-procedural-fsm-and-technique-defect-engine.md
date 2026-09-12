# 2. Máquina de Estados Procedimental y Motor de Auditoría de Defectos de Técnica (TDA)

Date: 2026-09-12
Status: Accepted

## Contexto

En la enseñanza de Química Analítica Cuantitativa universitaria (UMSS, 5to semestre), el objetivo del laboratorio no es meramente memorizar una receta secuencial, sino adquirir destreza en la técnica analítica y comprender cómo los errores experimentales (sistemáticos y aleatorios) afectan el resultado final.

Existen dos enfoques extremos e inadecuados en simuladores educativos:
1. **El Asistente Lineal Rígido ("Wizard")**: Obliga al alumno a hacer clic en un único botón permitido a la vez ("Paso 1 completado, haga clic en Paso 2"). Elimina toda autonomía, no enseña a pensar y hace imposible que el alumno cometa errores de técnica formativos.
2. **El Sandbox Libre sin Reglas**: Permite cualquier acción sin estructura, requiriendo motores de física molecular hipercomplejos que desvían el foco pedagógico y confunden al estudiante.

El simulador necesita un modelo intermedio: **libertad operativa en la mesada virtual con seguimiento no intrusivo y propagación física de defectos procedimentales**.

## Decisión

Se adopta una **Arquitectura de Doble Capa**:

### Capa 1: Estado Físico-Químico Fenomenológico de Mesada
Mantiene las variables continuas y discretas de los instrumentos en la mesada:
- Instrumental presente y su acoplamiento (bureta en soporte universal, erlenmeyer bajo el pico, balanza tarada).
- Estado de fluidos: volúmenes contenidos, concentraciones de analito/titulante, presencia de gotas de indicador, volumen de burbuja en pico de bureta ($V_{\text{burbuja}} \ge 0$).
- Ángulo de observación visual respecto a la línea de enrase (detección de paralaje: $\Delta h_{\text{ojo}} \ne 0$).

### Capa 2: Máquina de Hitos Procedimentales (Milestone FSM) y Auditoría de Defectos (TDA)
El procedimiento de cada práctica definida en `data/curriculum_spec.json` se modela como un grafo de **Hitos Experimentales (Milestones)** con **Invariantes de Técnica**:

1. **Hitos Clave en Volumetría**:
   - `MS_BURETTE_LOADED`: Carga de solución titulante en la bureta.
   - `MS_BUBBLE_PURGED`: Apertura rápida de llave para desalojar burbujas de aire en el pico.
   - `MS_MENISCUS_ALIGNED`: Enrase a la línea de graduación o registro de lectura inicial $V_0$.
   - `MS_ALIQUOT_DELIVERED`: Transferencia de muestra con pipeta aforada al erlenmeyer sin soplar la punta.
   - `MS_INDICATOR_ADDED`: Adición de 2 a 3 gotas de indicador adecuado.
   - `MS_TITRATION_IN_PROGRESS`: Flujo gota a gota con agitación circular constante.
   - `MS_ENDPOINT_DETECTED`: Detección del primer viraje persistente (≥ 30 s).
   - `MS_FINAL_READING`: Lectura final de volumen $V_f$ en la bureta.

2. **Catálogo de Defectos de Técnica y Consecuencia Física**:
   - `DEFECT_UNPURGED_BUBBLE`: Si se titula con aire en el pico, la burbuja se desaloja durante el goteo y el volumen aparente leído en la bureta aumenta en el tamaño de la burbuja ($\Delta V_{\text{leído}} = \Delta V_{\text{real}} + V_{\text{burbuja}}$). Error sistemático por exceso.
   - `DEFECT_PARALLAX`: Si el alumno lee el menisco con la cámara inclinada fuera del plano tangencial, la lectura registrada incorpora un error óptico de $\pm 0.05$ a $\pm 0.20$ mL.
   - `DEFECT_BLOWN_PIPETTE_DROP`: Si el estudiante fuerza la expulsión de la última gota retenida por capilaridad en una pipeta aforada (calibrada para vertido libre TD/Ex), la masa de analito transferida excede el valor nominal en ~0.04 mL.
   - `DEFECT_MISSING_INDICATOR`: Si se titula sin indicador, la reacción química ocurre pero no hay señal visual de viraje, permitiendo que el alumno sobretitule y agote la bureta sin notar el cambio.
   - `DEFECT_OVERTITRATED`: Si el alumno sigue agregando titulante tras el punto estequiométrico, la intensidad cromática satura (ej. rosa pálido $\rightarrow$ fucsia intenso) y el volumen registrado genera un error estequiométrico en el cálculo final.

3. **Intervención Pedagógica**:
   - Las fallas no interrumpen abruptamente la experiencia; se reflejan en las lecturas de la **Libreta de Laboratorio Digital**.
   - Al finalizar o al cotejar el informe, el motor TDA despliega la auditoría con la referencia bibliográfica exacta (capítulo y página de Skoog o Day & Underwood) explicando el origen del error experimental.

## Consecuencias

### Positivas
- Realismo pedagógico: el alumno experimenta las consecuencias reales de una mala técnica en su libreta de datos.
- Modelo declarativo puro: cada práctica en `data/curriculum_spec.json` define sus hitos y reglas de penalización mediante esquemas TypeScript sin acoplamiento a componentes de interfaz.
- Reutilizable para volumetría (ácido-base, redox, complejometría, precipitación) y gravimetría (pesadas, calcinación a peso constante).

### Negativas / Mitigaciones
- *Riesgo*: Un estudiante novato podría perderse si la mesada es demasiado permisiva.
- *Mitigación*: Se implementa un indicador sutil de "Guía de Procedimiento" (modo principiante con check-list de hitos sugeridos, conmutable a modo examen sin pistas).

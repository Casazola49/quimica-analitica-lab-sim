# 5. UX de Libreta de Laboratorio Digital, Lupa Óptica y Pipeline de Evaluación Estequiométrica

Date: 2026-09-12
Status: Accepted

## Contexto

En el laboratorio presencial de Química Analítica Cuantitativa, la libreta de laboratorio es el instrumento central de trabajo: el estudiante debe registrar masas pesadas en balanza analítica ($0.0001\text{ g}$), lecturas de bureta ($0.01\text{ mL}$ estimados), realizar cálculos estequiométricos aplicando las reglas de cifras significativas y calcular el error relativo porcentual.

En un simulador web para dispositivos móviles y computadoras modestas surgen dos desafíos críticos de UX y pedagogía:
1. **Legibilidad de la escala de la bureta en pantallas pequeñas**: En un teléfono de 6 pulgadas, las 500 líneas de una bureta de 50 mL son físicamente ilegibles si no existe un mecanismo de aumento.
2. **Pedagogía de la medición y cálculo**: Si el simulador autocompleta los números o calcula el resultado automáticamente, el estudiante no aprende. La libreta debe exigir que el alumno lea, anote y calcule manualmente, ofreciendo validación formativa.

## Decisión

Se adopta una **Arquitectura de Interfaz Responsiva de Dos Vistas con Lupa Óptica de Aumento y Pipeline de Evaluación Estequiométrica en Tres Etapas**.

### 1. Disposición Responsiva de Vistas (Split-Screen / Bottom Sheet)
- **Desktop y Tablets ($\ge 1024\text{ px}$)**:
  - Disposición en pantalla dividida: 60% Mesada Virtual 2D (izquierda) y 40% Libreta de Laboratorio persistente (derecha).
- **Smartphones y Pantallas Pequeñas ($< 1024\text{ px}$)**:
  - Mesada Virtual a pantalla completa.
  - Libreta accesible mediante un **Cajón Inferior Deslizable (Bottom Sheet)** retráctil mediante gesto táctil (swipe up) o toque en el botón flotante de libreta (FAB).

### 2. Componente de Lupa Óptica de Menisco (`MeniscusLoupe`)
Al tocar la zona de menisco de la bureta o del matraz aforado, se abre una lupa vectorial SVG flotante:
- **Aumento 4x**: Muestra con absoluta nitidez las graduaciones cada $0.1\text{ mL}$ y permite estimar centésimas ($0.02\text{ mL}$).
- **Control Interactivo de Paralaje**:
  - Un deslizador de ángulo de visión o giroscopio móvil permite mover la línea de mira por encima o por debajo de la horizontal.
  - Cuando el ángulo se desvía de $0^\circ$, la graduación frontal y la graduación posterior del tubo se desalinean visualmente y la lectura aparente cambia (enseñando empíricamente el error de paralaje).
- **Acción Rápida**: Botón `"Transferir lectura a Libreta"` que copia el valor medido a la celda activa ($V_{\text{inicial}}$ o $V_{\text{final}}$).

### 3. Pipeline de Evaluación Estequiométrica en Tres Etapas

La libreta evalúa el desempeño del alumno en tres niveles pedagógicos independientes:

```
[Datos Crudos Registrados] 
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ Etapa 1: Validación de Consistencia Experimental       │
│ - ¿Masa > 0? ¿V_f >= V_0? ¿Delta V > 0?                │
└────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ Etapa 2: Rigor en Cifras Significativas y Cálculo       │
│ - Evalúa la fórmula ingresada por el alumno con sus    │
│   propios datos experimentales anotados.               │
│ - Tolerancia numérica: ±0.5%                           │
│ - Penaliza exceso/defecto de cifras significativas     │
│   (ej: exige 4 cifras significativas en concentración) │
└────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ Etapa 3: Metrología y Comparación con Valor Teórico    │
│ - Compara el resultado del alumno con el valor         │
│   verdadero aleatorizado de la sesión.                 │
│ - Calcula Error Relativo Porcentual:                   │
│   E_r = (|C_exp - C_teorico| / C_teorico) * 100%       │
│ - Desglosa si el error se debió a defectos de técnica  │
│   (TDA) en mesada o a cálculo aritmético.              │
└────────────────────────────────────────────────────────┘
```

### 4. Reporte Formativo Final
Al concluir la práctica, la libreta genera una tarjeta de auditoría:
- **Nota Formativa de Desempeño** (100 puntos desglosados en: Técnica de Mesada, Exactitud de Medición y Cálculo).
- **Citas de la Tríada Digital**: Vinculadas a cada error detectado (vía ADR-0004).
- **Exportación**: Descarga en PDF/JSON del informe completo de laboratorio listo para revisión docente.

## Consecuencias

### Positivas
- Experiencia idéntica al laboratorio real: el estudiante practica la lectura visual de escalas analógicas y el cálculo estequiométrico riguroso.
- Interfaz 100% utilizable en celulares económicos sin pérdida de precisión visual gracias a la lupa vectorial.
- Separación clara entre error de manipulación física (mesada) y error matemático (cálculo en libreta).

### Negativas / Mitigaciones
- *Riesgo*: Escribir números en teléfonos puede ser incómodo con teclados virtuales.
- *Mitigación*: Se incorporan botones de autocompletado rápido ("Pegar lectura del menisco", "Pegar lectura de balanza") que facilitan la entrada de datos sin escribir a mano si el alumno lo desea.

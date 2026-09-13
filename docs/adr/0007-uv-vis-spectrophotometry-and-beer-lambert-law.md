# 7. Simulador de Espectrofotometría UV-Vis y Ley de Beer (P12 Colorimetría: Determinación de Hierro con 1,10-Fenantrolina)

Date: 2026-09-13
Status: Accepted

## Contexto

La práctica P12 ("Colorimetría / Determinación fotométrica de Hierro") introduce al estudiante al análisis instrumental espectroscópico mediante la Ley de Beer-Lambert:
$$A = -\log_{10}(T) = \varepsilon \cdot b \cdot C$$
donde:
- $A$: Absorbancia (adimensional).
- $T$: Transmitancia ($I / I_0$).
- $\varepsilon$: Absortividad molar ($\approx 1.11 \times 10^4\text{ L}/(\text{mol}\cdot\text{cm})$ para $[Fe(phen)_3]^{2+}$ a $\lambda = 508\text{ nm}$).
- $b$: Longitud del paso óptico ($1.00\text{ cm}$).
- $C$: Concentración analítica.

Para modelar esta práctica en un entorno web interactivo 2D ágil a costo $0$, se requiere simular tanto la consola instrumental del espectrofotómetro UV-Vis como la preparación química de las disoluciones coloreadas y el ajuste matemático de la recta de calibración por mínimos cuadrados.

## Decisión

Se adopta una **Arquitectura de Módulo Espectrofotométrico Interactivo con Celda Óptica y Regresión Lineal Integrada**:

### 1. Modelo del Espectrofotómetro Virtual (Consola Instrumental 2D)
La interfaz del equipo presenta los controles reales de un espectrofotómetro analítico de laboratorio (tipo Genesys / Shimadzu):
- **Pantalla Digital**: Lectura instantánea conmutada de Absorbancia ($A$, $0.000$ a $2.500$) y Transmitancia ($\%T$, $0.0\%$ a $100.0\%$).
- **Selector Digital de Longitud de Onda ($\lambda$)**: Ajuste continuo o por pasos de 1 nm (rango 400 a 700 nm). La longitud de onda óptima teórica es $\lambda_{\max} = 508\text{ nm}$.
- **Compartimento de Celda Basculante**: Aloja una cubeta de vidrio óptico apareada de $1.00\text{ cm}$ orientada hacia el haz de luz monocromático.
- **Botón `Auto-Zero / Calibrar Blanco`**: Calibra la absorbancia a $0.000$ ($\%T = 100.0\%$) empleando la cubeta con el blanco de reactivos.
- **Control de Limpieza de Caras Ópticas**: El estudiante debe aplicar el paño de limpieza de lentes antes de insertar la cubeta en el haz de luz.

### 2. Preparación Química de la Serie de Calibración
La libreta y la mesada modelan la preparación volumétrica en matraces aforados de 50 mL:
- Blanco (0.0 ppm Fe)
- Estándar 1 (1.0 ppm Fe)
- Estándar 2 (2.0 ppm Fe)
- Estándar 3 (3.0 ppm Fe)
- Estándar 4 (4.0 ppm Fe)
- Estándar 5 (5.0 ppm Fe)
- Muestra Problema (desconocida)

**Requisitos Químicos Críticos del Protocolo (UMSS)**:
1. Adición de **clorhidrato de hidroxilamina** ($\text{NH}_2\text{OH}\cdot\text{HCl}$): Reduce cuantitativamente todo $\text{Fe}^{3+}$ presente a $\text{Fe}^{2+}$:
   $$2\text{Fe}^{3+} + 2\text{NH}_2\text{OH} \rightarrow 2\text{Fe}^{2+} + \text{N}_2 + 2\text{H}_2\text{O} + 4\text{H}^+$$
2. Adición de **tampón acetato de sodio** ($\text{CH}_3\text{COONa}$): Fija el pH en la zona óptima $4.0 - 5.0$ para la estabilidad del quelato.
3. Adición de **1,10-fenantrolina**: Formación del complejo quelato trifenantrolínico ferroso de color rojo-anaranjado intenso:
   $$\text{Fe}^{2+} + 3\text{phen} \rightarrow [\text{Fe}(\text{phen})_3]^{2+}$$

### 3. Motor de Cálculo de la Recta de Calibración (Mínimos Cuadrados)
La libreta de laboratorio grafica en tiempo real los pares $(C_i, A_i)$ y calcula la regresión lineal:
$$A = m \cdot C + c$$
$$m = \frac{\sum (C_i - \bar{C})(A_i - \bar{A})}{\sum (C_i - \bar{C})^2}, \quad c = \bar{A} - m \bar{C}$$
$$R^2 = \frac{\left[\sum (C_i - \bar{C})(A_i - \bar{A})\right]^2}{\sum (C_i - \bar{C})^2 \sum (A_i - \bar{A})^2}$$

El alumno utiliza la ecuación de calibración para despejar la concentración de la muestra problema:
$$C_{\text{muestra}} = \frac{A_{\text{muestra}} - c}{m}$$

### 4. Catálogo de Defectos TDA en Espectrofotometría
- `DEFECT_NO_BLANK_ZERO`: Insertar patrones sin haber ajustado el cero instrumental con el blanco de reactivos (introduce un sesgo positivo constante $\Delta A \approx +0.025$).
- `DEFECT_FINGERPRINTS_ON_CUVETTE`: Tocar las caras transparentes de la cubeta o no limpiarlas con papel especial; las huellas grasas dispersan el haz de luz (aumento espurio de absorbancia entre $+0.04$ y $+0.12$).
- `DEFECT_WRONG_WAVELENGTH`: Medir fuera de $\lambda_{\max} = 508\text{ nm}$ (ej. 450 nm o 600 nm); la pendiente de sensibilidad $m$ decae drásticamente y se violan las condiciones de Beer.
- `DEFECT_OMITTED_REDUCING_AGENT`: Omitir la hidroxilamina; la fenantrolina no reacciona con Fe(III), resultando en absorbancias casi nulas y error por defecto crítico.
- `DEFECT_BUBBLES_IN_CUVETTE`: Llenar la cubeta con turbulencia dejando microburbujas adheridas a la cara interna óptica.

## Consecuencias

### Positivas
- Brinda a los estudiantes experiencia interactiva idéntica a los espectrofotómetros de laboratorio de la UMSS.
- Integra química de coordinación, equilibrio redox, ajuste espectroscópico y estadística de regresión lineal en una sola práctica.

### Negativas / Mitigaciones
- *Limitación*: Requiere trazar gráficos cartesianos de dispersión interactivos.
- *Mitigación*: Se implementa un componente SVG nativo liviano de gráfico de dispersión con puntos interactivos y línea de tendencia sin agregar librerías externas pesadas como Chart.js.

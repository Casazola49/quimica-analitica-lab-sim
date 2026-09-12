# 3. Motor de Equilibrios Químicos y Mapeo Cromático Continuo en Cliente (O(1) a 60 FPS)

Date: 2026-09-12
Status: Accepted

## Contexto

El simulador requiere calcular en tiempo real el estado físico-químico del sistema de titulación (pH en ácido-base, pM en complejometría, potencial en redox) y reflejar el viraje del indicador en la solución del erlenmeyer a 60 fps mientras cae el chorro o goteo de reactivo desde la bureta.

Requisitos:
1. **Rendimiento Máximo en Hardware Modesto**: El cálculo no puede bloquear el hilo principal ni depender de solvers numéricos iterativos pesados de equilibrios simultáneos que descarguen la batería de dispositivos móviles.
2. **Realismo Fenomenológico**: El viraje no debe ser un salto binario instantáneo ("on/off"), sino una curva sigmoidal de color suave que permita al estudiante entrenar el ojo para detectar el primer tono rosa pálido persistente (fenolftaleína) o el azul neto sin matiz violeta (NET), distinguiéndolo de la sobretitulación.
3. **Cero Dependencias de Red**: Todo el cálculo debe ejecutarse en el cliente en TypeScript puro.

## Decisión

Se adopta un **Motor de Ecuaciones Analíticas en Forma Cerrada ($O(1)$) y Mapeo Cromático Sigmoidal Sigmoidal HSL/RGB**.

### 1. Formulación de Curvas de Titulación ($O(1)$)

Para cada tipo de práctica volumétrica, el motor evalúa ecuaciones en forma cerrada derivadas de los balances de masa, carga y constantes de equilibrio termodinámicas:

#### Ácido Fuerte vs Base Fuerte (ej. P4: HCl vs NaOH)
- Punto de equivalencia: $V_{eq} = \frac{V_a C_a}{C_t}$.
- Antes de $V_{eq}$: $[H^+] = \frac{V_a C_a - V C_t}{V_a + V} \implies \text{pH} = -\log_{10}[H^+]$.
- En $V_{eq}$: $[H^+] = \sqrt{K_w} = 10^{-7} \implies \text{pH} = 7.00$.
- Después de $V_{eq}$: $[OH^-] = \frac{V C_t - V_a C_a}{V_a + V} \implies \text{pH} = 14.00 - (-\log_{10}[OH^-])$.

#### Ácido Débil vs Base Fuerte (ej. P7: Ácido Acético en Vinagre vs NaOH)
- Inicial ($V = 0$): $\text{pH} = \frac{1}{2}(\text{pK}_a - \log_{10}C_a)$ (con $\text{pK}_a = 4.76$).
- Zona Buffer ($0 < V < V_{eq}$): $\text{pH} = \text{pK}_a + \log_{10}\left(\frac{V C_t}{V_a C_a - V C_t}\right)$.
  - En semiequivalencia ($V = V_{eq}/2$): $\text{pH} = \text{pK}_a = 4.76$.
- En $V_{eq}$: Hidrólisis básica del acetato:
  $[OH^-] = \sqrt{\frac{K_w}{K_a} \cdot \frac{V_a C_a}{V_a + V_{eq}}} \implies \text{pH} = 14 - \text{pOH} \approx 8.72$.
- Exceso ($V > V_{eq}$): $[OH^-] \approx \frac{(V - V_{eq})C_t}{V_a + V} \implies \text{pH} = 14 - \text{pOH}$.

#### Complejometría con EDTA (ej. P10: Dureza de Agua con $\text{Ca}^{2+}/\text{Mg}^{2+}$ a pH 10)
- Curva de $\text{pM} = -\log_{10}[M^{2+}]$ evaluada mediante la constante de formación condicional $K'_{MY} = \alpha_{Y^{4-}} \cdot K_{MY}$.

### 2. Mapeo Cromático Sigmoidal del Indicador

El equilibrio de disociación del indicador $\text{HIn} \rightleftharpoons \text{In}^- + \text{H}^+$ determina la fracción disociada $\alpha$:

$$\alpha(\text{pH}) = \frac{1}{1 + 10^{\text{pK}_{\text{In}} - \text{pH}}}$$

La interpolación del color resultante $\vec{C}(\text{pH})$ en el espacio RGBA se calcula como:

$$\vec{C}(\text{pH}) = (1 - \alpha(\text{pH})) \cdot \vec{C}_{\text{HIn}} + \alpha(\text{pH}) \cdot \vec{C}_{\text{In}^-}$$

- **Fenolftaleína ($\text{pK}_{\text{In}} = 9.3$)**:
  - $\text{pH} \le 8.2$: $\alpha < 0.07 \implies$ Incoloro / agua pura.
  - $\text{pH} = 8.3 - 8.5$: $\alpha \in [0.09, 0.14] \implies$ Rosa tenue (Punto final correcto).
  - $\text{pH} \ge 9.5$: $\alpha > 0.61 \implies$ Fucsia intenso (Sobretitulación).
- **Negro de Eriocromo T (NET a pH 10)**:
  - Exceso de $\text{Mg}^{2+}$: Rojo vino ($\text{rgba}(140, 20, 50, 0.8)$).
  - En punto final: Azul puro ($\text{rgba}(20, 60, 180, 0.8)$).
  - Transición intermedia: Púrpura / violeta.

### 3. Rendimiento en el Navegador

- Complejidad temporal: $O(1)$ por evaluación (< 0.02 ms por cálculo).
- Capacidad de refresco: Puede evaluarse 60 veces por segundo en el ciclo de animación del chorro/goteo sin generar presión sobre el Garbage Collector.

## Consecuencias

### Positivas
- Cero retraso en la retroalimentación visual al girar la llave de la bureta.
- Curvas teóricas idénticas a las explicadas en Skoog (Capítulo 14) y Day & Underwood (Capítulo 7).
- Permite al estudiante exportar o visualizar el gráfico de titulación experimental ($\text{pH}$ vs $V$) directamente en su libreta de laboratorio.

### Negativas / Mitigaciones
- *Limitación*: Las fórmulas analíticas cerradas asumen fuerza iónica constante e idealidad diluida.
- *Mitigación*: En el laboratorio de pregrado de química analítica cuantitativa, las soluciones son típicamente $0.05 - 0.1\text{ M}$, donde estas ecuaciones estándar coinciden con la bibliografía de referencia de la cátedra.

# 9. Práctica P7: Volumetría Ácido-Base Potenciométrica con Electrodo de Vidrio, Curva Sigmoidal y Primera Derivada

Date: 2026-09-13
Status: Accepted

## Contexto

La Práctica 7 del plan de estudios oficial del Departamento de Química de la UMSS ("Volumetría Ácido-Base: Titulación de un ácido fuerte con una base fuerte patrón") es la contraparte analítica directa de la estandarización (P4). En esta práctica, el estudiante:
1. Utiliza la solución de $\text{NaOH}$ estandarizada en P4 como reactivo titulante en la bureta.
2. Mide y transfiere una alícuota líquida exacta de $25.00\text{ mL}$ de $\text{HCl} \approx 0.1\text{ N}$ empleando una **pipeta volumétrica aforada de transferencia con propipeta**, reforzando la técnica de vaciado libre por gravedad sin forzar la última gota capilar.
3. Realiza simultáneamente dos métodos de detección del punto final:
   - **Método Instrumental Potenciométrico**: Empleo de un $\text{pH}$-metro digital de mesa conectado a un electrodo combinado de vidrio ($\text{Ag/AgCl}$) sumergido en la disolución para registrar los pares $(V_i, \text{pH}_i)$.
   - **Método Visual Colorimétrico**: Adición de fenolftaleína para contrastar el viraje rosa tenue frente al punto de inflexión estequiométrico.
4. Determina el volumen de equivalencia mediante el método matemático de la **primera derivada numérica**:
   $$\left(\frac{\Delta \text{pH}}{\Delta V}\right)_i = \frac{\text{pH}_{i+1} - \text{pH}_{i-1}}{V_{i+1} - V_{i-1}}$$
   donde el punto de equivalencia $V_{\text{eq}}$ coincide con el máximo o pico agudo de la curva derivada.

## Decisión

Se adopta una **Arquitectura de Módulo de Titulación Potenciométrica Dual (Colorimétrica + Instrumental)**:

### 1. Instrumental Adicional en Mesada 2D
- **Sonda de Electrodo Combinado de Vidrio**: Representación vectorial del cuerpo de vidrio cilíndrico con bulbo sensible esférico sumergido en el recipiente de reacción junto al agitador magnético.
- **pH-metro Digital de Mesa**: Consola con pantalla LCD que muestra la lectura de $\text{pH}$ con resolución de $0.01$ en tiempo real mientras cae el reactivo titulante.

### 2. Modal de Pipeteo Cuantitativo (`PipetteTransferModal`)
Para transferir la alícuota de $25.00\text{ mL}$ de $\text{HCl}$, se implementa la simulación de la pipeta aforada con propipeta de goma:
- Aspiración con pera de goma hasta superar la línea de aforo.
- Enrase al menisco a la altura visual de la línea de mira.
- Descarga por gravedad libre contra la pared interna del vaso.
- Opción pedagógica de *"Soplar la última gota"* vs *"Retirar punta sin soplar"*: si el alumno fuerza la gota, se registra el defecto `DEFECT_BLOWN_PIPETTE_DROP` con cita a Skoog (Cap. 2).

### 3. Curva de Titulación y Gráfico de Primera Derivada en la Libreta Digital
La Libreta de Laboratorio para P7 incluye un visor gráfico SVG:
- Traza la curva sigmoidal de $\text{pH}$ vs $V_{\text{NaOH}}$ a medida que se entregan alícuotas.
- Calcula y superpone la curva de la primera derivada numérica $(\Delta \text{pH}/\Delta V)$, destacando el pico de $V_{\text{eq}}$.
- Permite al estudiante comparar el volumen del viraje visual de fenolftaleína con el punto de inflexión potenciométrico exacto ($\text{pH} = 7.00$).

### 4. Modelo de Equilibrio Ácido Fuerte vs Base Fuerte ($O(1)$)
- $V_{\text{eq}} = \frac{V_a \cdot N_{\text{HCl}}}{N_{\text{NaOH}}}$
- Antes de $V_{\text{eq}}$:
  $$[\text{H}^+] = \frac{V_a N_{\text{HCl}} - V N_{\text{NaOH}}}{V_a + V_{\text{dilución}} + V} \implies \text{pH} = -\log_{10}[\text{H}^+]$$
- En $V_{\text{eq}}$: Neutralización completa en agua pura $\implies \text{pH} = 7.00$.
- Después de $V_{\text{eq}}$:
  $$[\text{OH}^-] = \frac{V N_{\text{NaOH}} - V_a N_{\text{HCl}}}{V_a + V_{\text{dilución}} + V} \implies \text{pH} = 14.00 - (-\log_{10}[\text{OH}^-])$$

## Consecuencias

### Positivas
- Integra el uso de instrumental potenciométrico y cálculo diferencial analítico sin requerir software externo como Excel.
- Reutiliza la infraestructura reactiva probada en P4 con costo computacional casi nulo.
- Enseña la técnica correcta de pipeteo volumétrico analítico.

### Negativas / Mitigaciones
- *Espacio en pantalla*: El gráfico de titulación compite con los campos de entrada de la libreta.
- *Mitigación*: Se organiza en pestañas internas en la Libreta: `[Datos y Cálculos]` y `[Gráfico Potenciométrico & Derivada]`.

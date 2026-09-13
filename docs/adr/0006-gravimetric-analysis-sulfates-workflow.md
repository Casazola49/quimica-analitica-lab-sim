# 6. Flujo de Simulación de Gravimetría de Sulfatos (P5 BaSO4: Precipitación, Filtración, Calcinación y Peso Constante)

Date: 2026-09-13
Status: Accepted

## Contexto

A diferencia de la volumetría (donde la mesada es continua con bureta y erlenmeyer), la gravimetría cuantitativa de precipitación (P5: Determinación gravimétrica de sulfatos como BaSO4) involucra una secuencia multietapa de operaciones unitarias de laboratorio:
1. Ataque y acidificación de la muestra en vaso de precipitado con HCl diluido.
2. Adición lenta con agitación del reactivo precipitante (BaCl2 5%) en caliente.
3. Digestión térmica del precipitado (Ostwald ripening) en baño maría o plancha para promover la nucleación secundaria y crecimiento cristalino.
4. Filtración cuantitativa por gravedad mediante papel filtro analítico cuantitativo sin cenizas (Whatman 42 o banda azul).
5. Lavado sistemático del precipitado con agua destilada caliente hasta ensayo negativo de cloruros con AgNO3 (ausencia de turbidez blanca de AgCl).
6. Carbonización lenta del cono de papel en crisol de porcelana y calcinación a 800 °C en mufla.
7. Enfriamiento en desecador con gel de sílice y ciclos sucesivos de pesada en balanza analítica hasta alcanzar masa constante (variación ≤ 0.0002 g).

## Decisión

Se adopta una **Arquitectura de Mesada Multifase Modular para Gravimetría**:

### 1. Las 5 Estaciones de Operación Gravimétrica
En lugar de una única vista fija, la práctica P5 se organiza en 5 estaciones de trabajo interactivas 2D:

1. **Estación 1: Precipitación en Caliente y Control de Sobresaturación**:
   - Vaso de 400 mL sobre plancha calefactora.
   - Gotero/pipeta de BaCl2: La adición debe ser lenta gota a gota por las paredes mientras se agita con varilla de vidrio para mantener baja la sobresaturación relativa ($R = \frac{Q - S}{S}$, según Von Weimarn).
2. **Estación 2: Digestión Térmica**:
   - Mantenimiento a 80–90 °C durante 30 minutos sin ebullición turbulenta.
   - Efecto visual: el precipitado lechoso inicial coagula en cristales gruesos que sedimentan rápidamente dejando un sobrenadante transparente ("líquido madre").
   - Test de precipitación completa: adición de 2 gotas de BaCl2 al sobrenadante límpido.
3. **Estación 3: Filtración Cuantitativa y Lavado**:
   - Embudo analítico de 60° con vástago largo lleno de columna líquida continua.
   - Plegado correcto del papel filtro Whatman 42 (cenizas conocidas ≤ 0.00008 g).
   - Técnica de trasvase por varilla de vidrio sin salpicaduras.
4. **Estación 4: Control de Lavado de Cloruros (Test AgNO3)**:
   - Tubo de ensayo recolector de gotas del filtrado.
   - Adición de 1 gota de AgNO3 0.1 M: Si hay Cl- libre, aparece turbidez lechosa de AgCl ($\text{Ag}^+ + \text{Cl}^- \rightarrow \text{AgCl}_{(s)}$). El estudiante debe continuar lavando con pizeta caliente hasta que la reacción sea completamente límpida.
5. **Estación 5: Calcinación y Balanza Analítica (Peso Constante)**:
   - Crisol de porcelana previamente tarado.
   - Quemado del papel en mechero Bunsen: llama oxidante suave inclinada. Si el estudiante aplica llama directa sin oxígeno, el carbono reduce el sulfato:
     $$\text{BaSO}_4 + 4\text{C} \rightarrow \text{BaS} + 4\text{CO} \quad (\text{Defecto grave})$$
   - Ciclos de Desecador ➔ Balanza Analítica:
     - Pesada 1: $m_1$
     - Calcinación 15 min ➔ Desecador ➔ Pesada 2: $m_2$
     - Criterio de parada: $|m_2 - m_1| \le 0.0002\text{ g}$.

### 2. Catálogo de Defectos TDA para Gravimetría
- `DEFECT_NO_DIGESTION`: Filtrar inmediatamente sin digerir; el BaSO4 coloidal fino atraviesa los poros del papel y enturbia el filtrado, perdiendo masa analítica (error negativo).
- `DEFECT_INCOMPLETE_WASHING`: Suspender el lavado antes de dar negativo el test de AgNO3; los iones Ba2+ y Cl- adsorbidos incrementan falsamente la masa final calcinada (error positivo).
- `DEFECT_REDUCTION_TO_BAS`: Calcinar el papel con llama reductora incompleta o cerrada, reduciendo BaSO4 a sulfuro de bario BaS (pérdida de masa estequiométrica).
- `DEFECT_WEIGHING_HOT_CRUCIBLE`: Pesar el crisol tibio sin respetar los 30 min en desecador; las corrientes de convección térmica en el platillo de la balanza producen una lectura inestable y menor a la real.
- `DEFECT_NOT_CONSTANT_WEIGHT`: Registrar una sola pesada sin verificar peso constante (variación > 0.0002 g).

### 3. Fórmulas de Libreta Estequiométrica
- Factor Gravimétrico:
  $$F_g = \frac{\text{PM}(\text{SO}_4^{2-})}{\text{PM}(\text{BaSO}_4)} = \frac{96.06}{233.39} = 0.4116$$
- Porcentaje de Sulfato en Muestra:
  $$\% \text{SO}_4^{2-} = \frac{m_{\text{BaSO}_4} \times F_g}{m_{\text{muestra}}} \times 100\%$$

## Consecuencias

### Positivas
- Enseña la técnica cuantitativa más rigurosa de la química analítica clásica con sus cuidados críticos.
- El estudiante comprende por qué cada etapa (digestión, lavado, desecador) no es opcional sino indispensable para la exactitud analítica.

### Negativas / Mitigaciones
- *Complejidad*: Requiere modelar 5 sub-vistas.
- *Mitigación*: Se estructura como un flujo secuencial con barra de progreso superior que guía al alumno de estación en estación.

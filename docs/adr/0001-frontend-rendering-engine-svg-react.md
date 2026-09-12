# 1. Motor de Renderizado 2D de Mesada: React + SVG Parametrizado Nativo

Date: 2026-09-12
Status: Accepted

## Contexto

El simulador de mesada de laboratorio para las 13 prácticas de Química Analítica Cuantitativa (UMSS) requiere:
1. Renderizado interactivo 2D fluido en dispositivos móviles y hardware modesto (tablets y teléfonos de estudiantes).
2. Representación geométrica exacta de instrumental de vidrio graduado: bureta de 50 mL con escala legible cada 0.1 mL, pipeta aforada vs graduada, matraz aforado con línea de enrase, probetas y balanza analítica digital.
3. Simulación de menisco líquido con visualización de error de paralaje (lupa de aumento para lectura visual del volumen gastado).
4. Viraje cromático de indicadores químicos continuo y suave durante la titulación.
5. Soporte táctil reactivo sin lag para operaciones de arrastrar/acoplar (drag-and-drop de pipetas y matraces) y manipulación fina (apertura de la llave de la bureta para caída gota a gota de 0.05 mL).
6. Presupuesto estricto de infraestructura: Costo $0 absoluto (alojamiento estático en GitHub Pages / Vercel) y bundle ultra liviano (< 200 KB gzipped) para redes móviles universitarias lentas.

Se evaluaron tres alternativas arquitectónicas:
- **Opción A (React + SVG Parametrizado Nativo + Tailwind CSS)**: Componentes React que renderizan primitivas SVG vectoriales en el DOM (`<svg>`, `<path>`, `<rect>`, `<clipPath>`, `<linearGradient>`) con eventos de puntero unificados (`PointerEvents`).
- **Opción B (HTML5 Canvas 2D con Konva.js / Pixi.js)**: Motor de canvas imperativo basado en bucle de juego (requestAnimationFrame) y texturas rasterizadas.
- **Opción C (Streamlit Components nativos / Canvas embebido)**: Renderizado desde Python con puentes iframes hacia componentes web.

## Decisión

Se adopta **React 19 + TypeScript + Vite + Tailwind CSS con Componentes SVG Parametrizados Nativos** como motor de renderizado y mesada interactiva, gobernado por **HTML5 Pointer Events nativos (`setPointerCapture`)** para el control táctil.

### Justificación Técnica y Pedagógica

1. **Nitidez Vectorial y Escala Sub-milimétrica**:
   El instrumental de química analítica vive de la lectura de precisión. En un canvas HTML5, dibujar una bureta de 50 mL con 500 marcas de graduación de 0.1 mL requiere escalar resoluciones de canvas manualmente según el `window.devicePixelRatio`, aumentando drásticamente el consumo de memoria gráfica (VRAM) en teléfonos modestos. En SVG, las graduaciones son vectores matemáticos puros que no se pixelan jamás a ningún nivel de zoom (permitiendo una lupa óptica de aumento de menisco con costo computacional cero).

2. **Simulación Geométrica de Meniscos y Líquidos**:
   El menisco se modela mediante curvas Bézier cúbicas SVG (`M x,y C cx1,cy1 cx2,cy2 x2,y2`). El nivel de líquido se enmascara con un `<clipPath>` del contorno interno del recipiente, lo que garantiza que el líquido nunca "desborde" el vidrio sin necesidad de simulaciones de colisión por física pesada.

3. **Viraje Cromático Continuo por Gradientes Paramétricos**:
   Las transiciones de color de indicadores (ej. fenolftaleína de incoloro a fucsia pH 8.2–10.0, o Negro de Eriocromo T de rojo vino a azul puro) se implementan mediante interpolación de color `linearGradient` en espacio HSL/RGB gobernada por el estado estequiométrico de la mezcla.

4. **Soporte Táctil Robusto con `PointerEvents` y `setPointerCapture`**:
   Los eventos de puntero estándar unifican ratón, lápiz y gestos táctiles (touch). El uso de `setPointerCapture(event.pointerId)` previene la pérdida del arrastre cuando el dedo del estudiante se mueve rápido fuera de la mesada, resolviendo el problema más común de los simuladores web en pantallas táctiles móviles.

5. **Bundle Size y Rendimiento Extremo**:
   - React + Vite + Tailwind + iconos/SVG: ~85–115 KB gzipped.
   - En contraste, Pixi.js o Phaser superan los 300–600 KB únicamente en la librería gráfica.
   - Lighthouse Performance Score proyectado: 98–100 en dispositivos móviles de gama baja.

## Consecuencias

### Positivas
- 100% estático: se compila a HTML/JS/CSS puro mediante `npm run build` y se despliega en GitHub Pages sin necesidad de servidor Node.js ni Python.
- Facilidad de composición: cada instrumento de laboratorio (Bureta, PipetaVolumétrica, MatrazAforado, BalanzaAnalítica, AgitadorMagnético) es un componente React puro y testeable con Vitest/Testing Library.
- Accesibilidad (a11y): cada instrumento posee etiquetas ARIA nativas en el DOM, permitiendo lectores de pantalla y navegación por teclado.

### Negativas / Mitigaciones
- *Limitación*: SVG no es adecuado para renderizar miles de partículas simultáneas (ej. turbulencia de fluidos o spray).
- *Mitigación*: En química analítica cuantitativa de mesada las reacciones son homogéneas en fase acuosa o precipitaciones macroscópicas. El comportamiento se modela mediante opacidad, cambios de textura de precipitado (filtros SVG `<feTurbulence>`) y gradientes de color, lo cual es computacionalmente liviano y pedagógicamente idéntico a la realidad del laboratorio.

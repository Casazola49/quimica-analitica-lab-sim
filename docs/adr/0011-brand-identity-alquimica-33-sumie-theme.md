# 11. Identidad de Marca Alquímica-33 y Estilo Visual Sumi-e / Suibokuga (Rojo, Negro, Blanco)

Date: 2026-09-16
Status: Accepted (Planificado para Fase de Pulido Estético)

## Contexto

El grupo de trabajo de laboratorio universitario se denomina **"Alquímica-33"** (estudiantes de Ingeniería Química de la UMSS). Como visión de identidad visual y estilo de marca para el simulador, se definió adoptar una estética de inspiración japonesa minimalista basada en el arte clásico **Sumi-e (墨絵)** o **Suibokuga (水墨画)** —pintura tradicional con tinta china al agua— combinada con acentos de sello de cinabrio (*Hanko / Inkan*).

Paleta cromática estricta de 3 tonos base y sus transiciones tonales:
1. **Negro Tinta (Sumi / 墨)**: Negro profundo carbón (`#0a0a0a`), gris carbón húmedo (`#171717`) y trazo de tinta seca (`#262626`).
2. **Blanco Papel de Arroz (Washi / 和紙)**: Blanco marfil suave (`#fdfbf7`), blanco puro de laboratorio (`#ffffff`) y tenue textura de papel translúcido.
3. **Rojo Bermellón / Cinabrio (Shu-iro / 朱色)**: Rojo bermellón japonés (`#dc2626`, `#b91c1c`, `#ef4444`), color de los sellos de lacre, advertencias de bioseguridad y botones de acción principal.

## Decisión

Se define formalmente el sistema de diseño para la identidad de marca **"Alquímica-33"** en el simulador:

### 1. Elementos de Marca y Logotipo
- **Denominación**: `Alquímica-33 • Laboratorio Analítico` (アルキミカ三十三).
- **Emblema**: Sello de laca roja cuadrangular estilizado tipo *Hanko* con el kanji de alquimia/transformación química (化 o 錬) y el número 33.
- **Trazos y Bordes**: Efectos visuales de trazo de pincel fluido (*Fude / 筆*) en separadores, bordes de contenedores y transiciones cromáticas en lugar de bordes rectos planos genéricos.

### 2. Paleta de Tailwind Personalizada
```javascript
// Tokens de Color Sumi-e / Alquímica-33
colors: {
  sumi: {
    ink: '#0a0a0a',        // Fondo base negro carbón
    charcoal: '#171717',   // Paneles y tarjetas
    wash: '#262626',       // Bordes y separadores sutiles
    mist: '#404040',       // Textos secundarios y guías
  },
  washi: {
    paper: '#fdfbf7',      // Papel de informe y fondo claro
    pure: '#ffffff',       // Textos de alto contraste
    dim: '#d4d4d4',        // Texto neutro legible
  },
  vermilion: {
    cinabrio: '#dc2626',   // Acento rojo principal y sellos
    flame: '#ef4444',      // Hover interactivo
    deep: '#991b1b',       // Sombra de sello
  }
}
```

### 3. Fases de Aplicación
- **Fase Actual (v1.0.0)**: La identidad ya aparece acreditada formalmente en los informes de laboratorio y metadatos de sesión ("Equipo de Trabajo: Alquímica-33").
- **Fase Siguiente (v2.0)**: Conmutador de tema de interfaz (*Theme Switcher: Laboratorio Estándar / Alquímica-33 Sumi-e Mode*) que renderiza la mesada con fondos negros tinta, instrumental en contraste blanco pergamino y virajes/acentos en rojo bermellón.

## Consecuencias

### Positivas
- Identidad única, memorable y diferenciada del resto de simuladores web tradicionales.
- El alto contraste natural de la tríada Rojo-Negro-Blanco mejora la legibilidad de escalas volumétricas y meniscos.
- El código se mantiene desacoplado mediante variables CSS y clases semánticas de Tailwind.

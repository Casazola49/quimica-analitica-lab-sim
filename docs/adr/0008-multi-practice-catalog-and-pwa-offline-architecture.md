# 8. Arquitectura del Selector Modular de 13 Prácticas y Modo PWA 100% Offline

Date: 2026-09-13
Status: Accepted

## Contexto

El plan de estudios oficial del Departamento de Química de la UMSS para el 5to semestre de Ingeniería Química ("Laboratorio de Química Analítica Cuantitativa", código SISS 2004061) comprende 13 prácticas organizadas en 8 unidades temáticas:
- Unidad 1: Bioseguridad y Tratamiento Estadístico (P1, P2)
- Unidad 2: Puesta en Solución de Muestras (P3)
- Unidad 3: Preparación y Estandarización de Soluciones (P4)
- Unidad 4: Gravimetría de Sulfatos BaSO4 (P5)
- Unidad 5: Volumetría de Precipitación, Ácido-Base, Redox y Complejometría (P6, P7, P8, P9, P10)
- Unidad 6: Métodos Instrumentales de Electrodeposición (P11)
- Unidad 7: Espectrofotometría Molecular y Colorimetría (P12)
- Unidad 8: Espectroscopía de Emisión y Fotometría de Llama (P13)

Además, en los laboratorios docentes de la Facultad de Ciencias y Tecnología de la UMSS suele haber baja o nula cobertura celular, por lo que el simulador debe ser instalable en teléfonos móviles como Progressive Web App (PWA) y funcionar de manera completamente autónoma sin conexión a internet (Cache Storage + Service Worker).

## Decisión

Se adopta una **Arquitectura de Catálogo Curricular Unificado con Router de Prácticas y Soporte PWA Offline**:

### 1. Registro Curricular Modular (`src/data/allPractices.ts`)
Se compila la ontología completa de `data/curriculum_spec.json` en un catálogo tipado de TypeScript que clasifica las 13 prácticas por unidad, código SISS, instrumental, reactivos y estado de implementación:
- **`active`**: Práctica 100% operativa en la mesada virtual con simulación física y libreta interactiva (P4: Estandarización de NaOH; P7: Ácido-Base).
- **`specified`**: Prácticas con especificación formal completa de mesada (P5: Gravimetría de BaSO4 en ADR-0006; P12: Espectrofotometría UV-Vis en ADR-0007).
- **`catalog`**: Prácticas con ficha curricular oficial, objetivos, bioseguridad y fórmulas para autoestudio y requisición de materiales.

### 2. Navegador de Prácticas (`PracticeSelectorModal`)
El encabezado del simulador incorpora un selector que despliega el mapa curricular:
- Filtro por tipo de análisis: Volumetría, Gravimetría, Óptica, Instrumental.
- Vista previa de la ficha técnica: objetivos, reacciones químicas involucradas, reactivos obligatorios y normas de bioseguridad.
- Persistencia en `localStorage` del progreso del alumno: última práctica seleccionada, estatus de requisición aprobada y mejores puntajes de evaluación.

### 3. Progressive Web App (PWA) y Service Worker Offline
- **Web App Manifest (`public/manifest.json`)**: Configura el simulador como aplicación nativa instalable en Android, iOS y ChromeOS con tema oscuro (`#0f172a`), orientación responsiva y display `standalone`.
- **Service Worker (`public/sw.js`)**: Estrategia de caching `Cache-First` para los assets compilados (HTML, JS, CSS, JSON de citas y especificaciones). Una vez visitado por primera vez o instalado en el teléfono, el alumno puede abrir la aplicación en el laboratorio presencial con modo avión activado.

## Consecuencias

### Positivas
- El simulador no es una demo aislada de una sola práctica, sino una plataforma curricular unificada que cubre las 13 prácticas oficiales de la UMSS.
- Independencia total de la red: 100% funcional sin internet en los laboratorios de la universidad.
- Mantiene el costo $0 absoluto de infraestructura.

### Negativas / Mitigaciones
- *Actualizaciones*: Los service workers pueden retener versiones cacheadas anteriores.
- *Mitigación*: Se implementa un evento `controllerchange` y un banner sutil de "Nueva versión disponible: Actualizar" cuando se despliega un commit en GitHub Pages.

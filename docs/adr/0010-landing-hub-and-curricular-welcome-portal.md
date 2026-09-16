# 10. Portal de Inicio y Hub Curricular de Bienvenida (Landing Menu)

Date: 2026-09-14
Status: Accepted

## Contexto

Al ingresar a la URL de producción (`https://casazola49.github.io/quimica-analitica-lab-sim/`), el simulador abría de forma inmediata un modal bloqueante de "Solicitud Pre-Laboratorio de Materiales" forzando la Práctica 4 (Estandarización de NaOH).

Esto generaba fricción pedagógica y de usabilidad:
1. **Desorientación inicial**: El estudiante o docente no sabía en qué práctica estaba, qué otras opciones existían, ni cómo operaba la metodología del simulador.
2. **Ausencia de elección**: Un estudiante que iba a realizar la práctica de Gravimetría (P5), Potenciometría (P7) o Espectrofotometría (P12) era obligado a responder una lista de reactivos de P4 antes de poder cambiar de práctica.

## Decisión

Se adopta un **Portal de Inicio / Hub Curricular de Bienvenida (`LandingHub`)** como vista raíz inicial de la aplicación.

### 1. Estructura de la Vista de Bienvenida
- **Hero Institucional**:
  - Título y filiación académica: *Universidad Mayor de San Simón (UMSS) - Facultad de Ciencias y Tecnología - Departamento de Química*.
  - Materia: *Laboratorio de Química Analítica Cuantitativa (SISS: 2004061, 5to Semestre)*.
  - Badges informativos: *Costo $0 de Infraestructura*, *PWA 100% Offline*, *Tríada Digital*.
- **Metodología de Laboratorio en 3 Pasos**:
  - *Paso 1: Requisición de Materiales y Reactivos (Control de Entrada)*: Selección técnica contra distractores con lista mezclada aleatoriamente.
  - *Paso 2: Mesada Interactiva 2D y Cuidado de Técnica (TDA)*: Instrumental vectorial sub-milimétrico (buretas, balanza analítica, pipetas aforadas con propipeta, espectrofotómetro o mufla).
  - *Paso 3: Libreta de Laboratorio Digital y Feedback RAG*: Cálculo estequiométrico con 4 cifras significativas, error relativo % y citas textuales de la Tríada Digital (Skoog, Day & Underwood, Aguilar).
- **Catálogo Grid de las 13 Prácticas Oficiales**:
  - Organizadas por áreas curriculares (Volumetría, Gravimetría, Análisis Instrumental, Metrología).
  - Tarjetas interactivas que destacan las prácticas operativas en mesada (P4, P5, P7, P12) con botón directo **`"Iniciar Laboratorio ➔"`**.
  - Muestra los reactivos e instrumental clave antes de entrar.

### 2. Flujo de Navegación Bidireccional
- Al hacer clic en `"Iniciar Laboratorio"` en una práctica:
  - Se activa la mesada correspondiente (Volumetría para P4/P7, 5 Estaciones para P5, Consola Óptica para P12).
  - Se abre el modal de requisición de materiales *específico* de esa práctica.
- En la barra superior de la mesada virtual, se añade el botón **`"← Menú de Prácticas"`**, permitiendo al alumno volver al portal principal en cualquier momento.

## Consecuencias

### Positivas
- Experiencia de usuario natural, profesional y amigable.
- El estudiante comprende de entrada la filosofía pedagógica del laboratorio antes de comenzar a operar.
- Permite seleccionar directamente cualquiera de las prácticas activas (P4, P5, P7, P12) o consultar el catálogo oficial.

### Negativas / Mitigaciones
- *Transición*: Requiere mantener el estado de vista activa (`'home' | 'bench'`) en `App.tsx`.
- *Mitigación*: Se gestiona con un estado reactivo simple en React sin añadir librerías pesadas de enrutamiento como react-router, manteniendo el bundle ultraliviano.

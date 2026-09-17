# Simulador Web Interactivo de Laboratorio de Química Analítica Cuantitativa (UMSS)

Entorno interactivo 2D modular, ágil y pedagógico para estudiantes de Ingeniería Química de la Universidad Mayor de San Simón (UMSS, 5to semestre), diseñado como complemento práctico de mesada para las 13 prácticas oficiales y articulado con el sistema RAG de la Tríada Digital.

[![Deploy to GitHub Pages](https://github.com/Casazola49/quimica-analitica-lab-sim/actions/workflows/deploy.yml/badge.svg)](https://github.com/Casazola49/quimica-analitica-lab-sim/actions/workflows/deploy.yml)
[![Bundle Size](https://img.shields.io/badge/bundle%20size-85%20KB%20gzip-success)](https://github.com/Casazola49/quimica-analitica-lab-sim)
[![Infrastructure Cost](https://img.shields.io/badge/infrastructure%20cost-%240.00-blue)](https://github.com/Casazola49/quimica-analitica-lab-sim)

---

## 🔬 Visión y Características de Arquitectura

- **Identidad de Marca Alquímica-33 (Estilo Sumi-e / Suibokuga)**: Estética de inspiración japonesa clásica con paleta estricta de Negro Tinta (Sumi), Blanco Washi y Rojo Cinabrio con sellos tradicionales Hanko.
- **Portal de Inicio y Hub de Selección (LandingHub)**: Pantalla de bienvenida institucional de la UMSS que explica la metodología en 3 pasos y ofrece acceso directo a las prácticas.
- **Balanza Analítica Digital "Per Se" (Mettler Toledo)**: Vitrina corrediza (draft shield) con fluctuación por corrientes de aire, botones físicos funcionales (TARE / ZERO a 0.0000 g) y dosificación táctil con espátula analítica.
- **Cuentagotas Interactivo con Halo Cromático**: Descarga de gotas de fenolftaleína con fogonazo fucsia transitorio dispersado por el vórtice de agitación magnética.
- **Inspección y Purga de Bureta con Zoom 4x**: Visor ampliado del pico capilar para desalojar burbujas con golpe de 180° hacia el vaso de desecho.
- **Cálculos Previos de Preparación**: Módulo estequiométrico para estimar masas de soluto y volúmenes de viraje antes de ingresar a la mesada.
- **Costo $0 de Infraestructura**: Alojable 100% de forma estática en GitHub Pages con soporte PWA 100% Offline.
- **Instrumental Vectorial Nítido (SVG Nativo)**: Buretas con escala métrica cada 0.1 mL con zoom óptico sin pixelación.
- **Lupa Óptica de Menisco (4x) con Simulación de Paralaje**: Demuestra interactivamente el desvío óptico al desviar la línea de visión del plano horizontal.
- **Motor Físico-Químico $O(1)$ a 60 FPS**: Cálculo de curvas de titulación y virajes continuos de indicadores sin solvers pesados.
- **Libreta Digital e Informes Formales Imprimibles (PDF)**: Documento oficial académico con membrete de la UMSS, datos, estequiometría, citas de la Tríada Digital y firmas del estudiante (Alquímica-33) y docente.

---

## 🛠️ Stack Tecnológico

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 6
- **Estilos**: Tailwind CSS 3
- **Iconografía**: Lucide React
- **Gráficos**: SVG Parametrizado Nativo con Pointer Events (`setPointerCapture`)
- **Ontología Canónica**: `data/curriculum_spec.json`

---

## 🚀 Instalación y Ejecución Local

```bash
# Clonar el repositorio
git clone https://github.com/Casazola49/quimica-analitica-lab-sim.git
cd quimica-analitica-lab-sim

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción (GitHub Pages)
npm run build
```

---

## 📖 Arquitectura de Decisiones (ADRs)

Todas las decisiones de diseño fueron registradas siguiendo la metodología de ingeniería de software:
- [ADR-0001: Motor de Renderizado 2D de Mesada (React + SVG Parametrizado Nativo)](docs/adr/0001-frontend-rendering-engine-svg-react.md)
- [ADR-0002: Máquina de Estados Procedimental y Motor TDA](docs/adr/0002-procedural-fsm-and-technique-defect-engine.md)
- [ADR-0003: Motor de Equilibrios Químicos y Mapeo Cromático a 60 FPS](docs/adr/0003-equilibrium-stoichiometry-and-colorimetry-engine.md)
- [ADR-0004: Contrato de Integración y Feedback RAG (Tríada Digital)](docs/adr/0004-rag-integration-and-pedagogical-feedback-contract.md)
- [ADR-0005: UX de Libreta Digital, Lupa Óptica y Pipeline de Evaluación](docs/adr/0005-digital-lab-notebook-and-evaluation-pipeline.md)

---

## 🏛️ Créditos y Referencias Curriculares

- **Universidad**: Universidad Mayor de San Simón (UMSS)
- **Carrera**: Licenciatura en Ingeniería Química (5to Semestre)
- **Materia**: Laboratorio de Química Analítica Cuantitativa (SISS: 2004061)
- **Bibliografía Oficial de la Tríada Digital**:
  - *Fundamentos de Química Analítica*, Skoog, West, Holler, Crouch (9na Edición).
  - *Química Analítica Cuantitativa*, Day & Underwood (6ta Edición).
  - *Química Analítica*, Aguilar Sanjuán (2da Edición).

# Simulador Web Interactivo de Laboratorio de Química Analítica Cuantitativa (UMSS)

Entorno interactivo 2D modular, ágil y pedagógico para estudiantes de Ingeniería Química de la Universidad Mayor de San Simón (UMSS, 5to semestre), diseñado como complemento práctico de mesada para las 13 prácticas oficiales y articulado con el sistema RAG de la Tríada Digital.

[![Deploy to GitHub Pages](https://github.com/Casazola49/quimica-analitica-lab-sim/actions/workflows/deploy.yml/badge.svg)](https://github.com/Casazola49/quimica-analitica-lab-sim/actions/workflows/deploy.yml)
[![Bundle Size](https://img.shields.io/badge/bundle%20size-85%20KB%20gzip-success)](https://github.com/Casazola49/quimica-analitica-lab-sim)
[![Infrastructure Cost](https://img.shields.io/badge/infrastructure%20cost-%240.00-blue)](https://github.com/Casazola49/quimica-analitica-lab-sim)

---

## 🔬 Visión y Características de Arquitectura

- **Costo $0 de Infraestructura**: Alojable 100% de forma estática en GitHub Pages, Vercel o Netlify.
- **Micro-Bundle Ultra Liviano (<85 KB gzipped)**: Carga instantánea en redes móviles universitarias sin frameworks 3D pesados ni dependencias de servidor.
- **Instrumental Vectorial Nítido (SVG Nativo)**: Buretas con escala métrica cada 0.1 mL con zoom óptico sin pixelación en pantallas de cualquier resolución.
- **Lupa Óptica de Menisco (4x) con Simulación de Paralaje**: Demuestra interactivamente el desvío óptico al desviar la línea de visión del plano horizontal.
- **Motor Físico-Químico $O(1)$ a 60 FPS**: Cálculo de curvas de titulación y viraje continuo de indicadores (fenolftaleína, naranja de metilo, NET) mediante funciones sigmoidales en espacio RGBA en el cliente.
- **Auditoría de Defectos de Técnica (TDA)**: Si el alumno titula con burbuja en la llave de la bureta o mira con paralaje, el error se propaga físicamente a los números de la bureta.
- **Libreta de Laboratorio Digital con Pipeline en 3 Etapas**: Evaluación de integridad de datos, cálculo aritmético, control estricto de 4 cifras significativas y cálculo de error relativo porcentual ($E_r\%$).
- **Integración con la Tríada Digital (RAG)**: Citas textuales exactas verificadas de Skoog (9na ed.), Day & Underwood (6ta ed.) y Aguilar (2da ed.) ante cualquier desviación experimental.

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

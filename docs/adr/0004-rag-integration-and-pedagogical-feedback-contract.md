# 4. Contrato de Integración y Feedback Pedagógico con el Sistema RAG (Tríada Digital)

Date: 2026-09-12
Status: Accepted

## Contexto

El simulador interactivo de laboratorio debe proporcionar retroalimentación formativa de alto nivel académico cuando el estudiante comete errores de técnica (purga de burbujas, enrase incorrecto, soplado de pipetas, sobretitulación) o errores de cálculo estequiométrico en la libreta.

El sistema RAG existente (`Casazola49/quimica-analitica-rag`) contiene el índice SQLite FTS5 de la Tríada Digital (Skoog 9ed, Day & Underwood 6ed, Aguilar 2ed) y la interfaz en Streamlit con BYOK. Sin embargo, acoplar directamente el simulador web cliente a un backend dependiente de Streamlit generaría:
1. Vulnerabilidad ante cold starts o caídas del servidor gratuito de Streamlit Cloud.
2. Inoperabilidad cuando los estudiantes estén en laboratorios universitarios con mala o nula conectividad celular.
3. Costos potenciales o complejidad de CORS / autenticación innecesaria.

Se requiere un protocolo de integración robusto, desacoplado, offline-first y a costo $0.

## Decisión

Se adopta un **Protocolo Híbrido Offline-First de Tres Niveles**:

### Nivel 1: Almacén Estático Canónico de Citas de la Tríada Digital (100% Offline)
El simulador incorpora un archivo estático indexado (`data/pedagogical_citations.json`), empaquetado en el bundle del cliente, que mapea cada código de defecto de técnica (`DEFECT_*`) y discrepancia analítica con su correspondiente cita textual verificada de la Tríada Digital.

#### Esquema del Contrato TypeScript (`PedagogicalCitation`):
```typescript
export interface PedagogicalCitation {
  id: string; // ej: "CITE_BURETTE_BUBBLE"
  defectType: string; // ej: "DEFECT_UNPURGED_BUBBLE"
  practiceId: number; // ej: 4 (Estandarización) o 7 (Ácido-Base)
  book: 'Skoog' | 'Day & Underwood' | 'Aguilar';
  edition: string; // ej: "9na Edición"
  chapter: number; // ej: 2
  chapterTitle: string; // ej: "Productos químicos, aparatos y operaciones unitarias"
  pagePhysical: number; // ej: 41
  exactQuote: string; // Cita textual idéntica al libro impreso
  pedagogicalImpact: string; // Explicación del impacto en el error sistemático
  remediationAdvice: string; // Acción correctiva práctica en la mesada
  ragDeepLinkQuery: string; // Parámetro de búsqueda para el RAG
}
```

### Nivel 2: Deep-Linking Contextual hacia el Asistente RAG
En cada tarjeta de retroalimentación de la libreta o del motor TDA, el estudiante dispone del botón:
`"Profundizar con el Asistente RAG ↗"`

Este botón abre la aplicación Streamlit en una nueva pestaña mediante una URL parametrizada:
```
https://quimica-analitica-rag.streamlit.app/?source=sim&practice=4&defect=DEFECT_UNPURGED_BUBBLE&query=por+que+es+critico+purgar+la+burbuja+en+la+bureta
```
El Streamlit RAG pre-carga la consulta, filtra la búsqueda en la unidad temática correspondiente y ofrece al estudiante un diálogo socrático extendido.

### Nivel 3: Tutor Analítico en Cliente mediante BYOK Opcional (Zero-Cost)
Si el estudiante introduce su clave personal gratuita de Google AI Studio (almacenada localmente en `localStorage`), el simulador puede invocar directamente en el navegador a Gemini 1.5/2.0 Flash para generar una evaluación personalizada:
- Compara los datos anotados en su libreta ($m_{\text{pesada}}$, $V_{\text{gastado}}$, $C_{\text{calculada}}$) contra el valor estequiométrico teórico aleatorizado de su sesión.
- Inyecta como contexto obligatorio la cita estática del Nivel 1, impidiendo alucinaciones del modelo.

## Consecuencias

### Positivas
- **Indestructibilidad en el Laboratorio**: El simulador funciona 100% desconectado de internet en el aula; las citas textuales de los libros están garantizadas en el cliente.
- **Cero Costo de Servidor**: No se requiere un servidor puente ni mantenimiento de APIs en la nube.
- **Sinergia Real con el RAG**: El estudiante puede saltar del simulador práctico al chat teórico RAG de forma orgánica y contextual.

### Negativas / Mitigaciones
- *Limitación*: Modificaciones en las citas textuales requieren actualizar el JSON estático en el simulador.
- *Mitigación*: Como la bibliografía canónica (Skoog 9ed, Day & Underwood 6ed) es estática y definitiva para el semestre, el catálogo de citas no sufre obsolescencia.

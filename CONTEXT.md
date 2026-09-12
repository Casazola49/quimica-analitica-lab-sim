# Simulador Web Interactivo de Laboratorio de Química Analítica Cuantitativa (UMSS)

Entorno interactivo 2D modular y pedagógico para estudiantes de Ingeniería Química de la UMSS (5to semestre), diseñado como complemento práctico de mesada para las 13 prácticas oficiales y conectado al sistema RAG de la Tríada Digital.

## Dominio de Simulación y Laboratorio

**Mesada Virtual**:
Área de trabajo 2D interactiva donde se disponen, manipulan y combinan los instrumentos y reactivos de cada práctica de laboratorio.
_Avoid_: Tablero de juego, canvas 3D

**Instrumental de Laboratorio**:
Equipamiento volumétrico (bureta, matraz aforado, pipeta volumétrica/aforada, pipeta graduada, probeta), recipientes de reacción (erlenmeyer, vaso de precipitado) y gravimétrico (pesafiltro, crisol, desecador, balanza analítica) modelados con precisión geométrica y física.
_Avoid_: Utensilios, herramientas

**Máquina de Estados Procedimental**:
Motor formal de estados finitos que valida el orden secuencial de operaciones experimentales (purga de burbuja en bureta, enrase a la altura del menisco, adición de indicador, titulación gota a gota, pesada a peso constante) y detecta errores operativos del alumno.
_Avoid_: Script de pasos, flujo lineal

**Curva y Viraje de Titulación**:
Transición visual cromática (gradiente de color) calculada analíticamente en función de la estequiometría de la reacción y el volumen de titulante consumido, simulando el punto final experimental.
_Avoid_: Cambio de color instantáneo sin gradiente

**Libreta de Laboratorio Digital**:
Módulo interactivo de registro de datos experimentales (masa pesada, volumen inicial, volumen final, gasto neto) y cálculo estequiométrico que compara el resultado del estudiante contra el valor teórico parametrizado.
_Avoid_: Formulario de preguntas, examen

**Feedback Pedagógico RAG**:
Explicación formativa contextual activada ante fallas de técnica, errores de paralaje, sobretitulación o cálculos incorrectos, enlazada a las citas exactas de los libros de la Tríada Digital (Skoog 9ed, Day & Underwood 6ed, Aguilar 2ed).
_Avoid_: Mensaje de error genérico, pista

**Especificación Curricular Canónica**:
Ontología JSON formal (`data/curriculum_spec.json`) que define las 13 prácticas de laboratorio con sus objetivos, reactivos, instrumental, reacciones químicas, fórmulas de cálculo y referencias bibliográficas.
_Avoid_: Configuración de prácticas, archivo de datos

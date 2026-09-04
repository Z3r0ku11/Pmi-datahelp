# Inventario Consolidado de Governance

**Fuente:** Framework Corporativo v3.1 + Framework Ágil v1  
**Fecha:** $(date)  
**Analista:** Kiro PMO Discovery  
**Objetivo:** Modelo maestro de Governance para PMO Framework Hub

## 1. RESUMEN EJECUTIVO

### 1.1 Frameworks Analizados
- **Framework Corporativo y Proceso de Gestión de Proyectos v3.1** (PMO-FWK-003)
- **Framework Gestión Ágil de Proyectos V1**

### 1.2 Estadísticas del Inventario
- **Niveles de Governance:** 3 (confirmados en ambos frameworks)
- **Controles formales:** 6 (Framework Corporativo), 6 (Framework Ágil - informales)
- **Gates identificados:** 2 explícitos + 4 checkpoints
- **Mecanismos de reporte:** 3 formales
- **Evidencias de governance:** 15 artefactos relacionados
- **Gaps identificados:** 8 gaps críticos

### 1.3 Hallazgo Principal
**[FRAMEWORK]** Ambos frameworks mantienen estructura de governance de 3 niveles pero con **diferentes enfoques de control:**
- **Corporativo:** Control formal con gates explícitos
- **Ágil:** Validación continua con checkpoints implícitos
## 2. PRINCIPIO DE GOVERNANCE

### 2.1 Framework Corporativo v3.1

**[FRAMEWORK]**
- **Definición:** "Modelo integral, estructurado y escalable que permite gestionar iniciativas de forma consistente"
- **Objetivo:** "Asegurar alineación entre estrategia, gobernanza, coordinación y ejecución"
- **Alcance:** Todos los proyectos Professional Services - Cloud
- **Responsables:** PMO (estratégico), Líder JP (táctico), PM (operativo)
- **Niveles de Governance:** 3 niveles diferenciados
- **Mecanismos de control:** Controles formales, gates, validaciones estructuradas
- **Mecanismos de reporte:** Reportería semanal, dashboards, KPIs consolidados
- **Mecanismos de escalamiento:** Matriz de escalamiento organizacional
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 11-12, 37

### 2.2 Framework Ágil v1

**[FRAMEWORK]**
- **Definición:** "Modelo organizacional, metodológico y operativo adaptable, colaborativo y orientado a resultados"
- **Objetivo:** "Mantener alineación con capacidades técnicas y estratégicas, manteniendo control organizacional"
- **Alcance:** Proyectos tecnológicos bajo modelos iterativos, ≤4 semanas
- **Responsables:** PMO (gobierno ágil), PM Lead (supervisión), PM (gestión ágil)
- **Niveles de Governance:** 3 niveles (adaptados del corporativo)
- **Mecanismos de control:** Validación continua, trazabilidad organizacional
- **Mecanismos de reporte:** **Información no definida en el Framework**
- **Mecanismos de escalamiento:** Facilitación de bloqueos
- **Fuente documental:** Framework Ágil v1
- **Sección:** 5, 6
## 3. NIVELES DE GOVERNANCE

### 3.1 Validación de Hallazgos Previos
**CONFIRMADO:** 3 niveles de governance en ambos frameworks

### 3.2 GOV-CORP-001: Nivel Estratégico (PMO)
- **ID:** GOV-CORP-001
- **Nombre:** Nivel Estratégico - PMO
- **Framework:** Framework Corporativo v3.1
- **Objetivo:** Gobierno del modelo corporativo de gestión de proyectos
- **Alcance:** Portafolio organizacional completo
- **Participantes:** PMO
- **Decisiones:** 
  - Definición y mantenimiento del framework
  - Validación entrada de proyectos (PMO Intake)
  - Consolidación KPIs organizacionales
  - Escalamiento organizacional
- **Frecuencia:** **Información no definida en el Framework**
- **Mecanismo escalamiento:** Nivel superior organizacional (no especificado)
- **Fuente:** Página 11-12
- **Observaciones:** Nivel más alto definido en el framework

### 3.3 GOV-CORP-002: Nivel Táctico (Líder JP)
- **ID:** GOV-CORP-002
- **Nombre:** Nivel Táctico - Líder de Jefes de Proyecto
- **Framework:** Framework Corporativo v3.1
- **Objetivo:** Supervisión y coordinación operativa del portafolio
- **Alcance:** Portafolio operativo (múltiples proyectos)
- **Participantes:** Líder de Jefes de Proyecto
- **Decisiones:**
  - Handover y transferencia de proyectos
  - Supervisión metodológica
  - Detección temprana desviaciones
  - Escalamiento operativo hacia PMO
- **Frecuencia:** Continua (acompañamiento permanente)
- **Mecanismo escalamiento:** Hacia GOV-CORP-001 (PMO)
- **Fuente:** Página 12-14
- **Observaciones:** Enlace entre estratégico y operativo

### 3.4 GOV-CORP-003: Nivel Operativo (PM)
- **ID:** GOV-CORP-003
- **Nombre:** Nivel Operativo - Project Manager
- **Framework:** Framework Corporativo v3.1
- **Objetivo:** Ejecución integral del proyecto individual
- **Alcance:** Proyecto individual
- **Participantes:** Project Manager
- **Decisiones:**
  - Planificación y configuración del proyecto
  - Coordinación técnica diaria
  - Control de ejecución
  - Gestión de stakeholders
- **Frecuencia:** Diaria/continua durante proyecto
- **Mecanismo escalamiento:** Hacia GOV-CORP-002 (Líder JP)
- **Fuente:** Página 14-15
- **Observaciones:** Responsable directo del proyecto
### 3.5 GOV-AGL-001: Nivel Estratégico Ágil (PMO)
- **ID:** GOV-AGL-001
- **Nombre:** Nivel Estratégico - PMO Ágil
- **Framework:** Framework Ágil v1
- **Objetivo:** Gobierno del framework ágil
- **Alcance:** Portfolio de iniciativas ágiles
- **Participantes:** PMO
- **Decisiones:**
  - Gobernar el framework ágil
  - Supervisar salud del portafolio ágil
  - Consolidar KPIs ágiles
  - Facilitar escalamiento
- **Frecuencia:** **Información no definida en el Framework**
- **Mecanismo escalamiento:** **Información no definida en el Framework**
- **Fuente:** Sección 6.1
- **Observaciones:** Mantiene rol estratégico pero adaptado a agilidad

### 3.6 GOV-AGL-002: Nivel Táctico Ágil (PM Lead)
- **ID:** GOV-AGL-002
- **Nombre:** Nivel Táctico - PM Lead Ágil
- **Framework:** Framework Ágil v1
- **Objetivo:** Supervisión ejecución ágil
- **Alcance:** Múltiples iniciativas ágiles
- **Participantes:** PM Lead
- **Decisiones:**
  - Supervisar ejecución ágil
  - Facilitar resolución de bloqueos
  - Guiar metodológicamente a los PM
  - Validar alineación operacional
- **Frecuencia:** Continua (supervisión ágil)
- **Mecanismo escalamiento:** Hacia GOV-AGL-001 (PMO)
- **Fuente:** Sección 6.2
- **Observaciones:** Enfoque en facilitación vs control

### 3.7 GOV-AGL-003: Nivel Operativo Ágil (PM)
- **ID:** GOV-AGL-003
- **Nombre:** Nivel Operativo - PM Ágil
- **Framework:** Framework Ágil v1
- **Objetivo:** Gestión operativa de iniciativas ágiles
- **Alcance:** Iniciativa ágil individual
- **Participantes:** Project Manager
- **Decisiones:**
  - Gestionar backlog y entregas
  - Liderar ceremonias ágiles
  - Coordinar equipo técnico
  - Mantener visibilidad operacional
- **Frecuencia:** Iterativa (por sprint)
- **Mecanismo escalamiento:** Hacia GOV-AGL-002 (PM Lead)
- **Fuente:** Sección 6.3
- **Observaciones:** Enfoque iterativo y adaptativo

## 4. CONTROLES

### 4.1 Framework Corporativo - Controles Formales

#### 4.1.1 CTRL-CORP-001: Control de Entrada PMO
- **ID:** CTRL-CORP-001
- **Nombre:** Validación PMO Intake
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-001 (PMO Intake)
- **Proceso:** PROC-CORP-001 (PMO Intake)
- **Objetivo:** Validar requisitos mínimos para iniciar gestión
- **Trigger:** Proyecto aprobado comercialmente
- **Frecuencia:** Por proyecto (una vez)
- **Responsable:** PMO
- **Participantes:** PMO, información comercial
- **Qué se controla:** Información base del proyecto, viabilidad inicial
- **Validación:** Completitud y consistencia de información
- **Criterio:** Información base completa y proyecto viable
- **Evidencia requerida:** ART-CORP-001 (Información Base del Proyecto)
- **Artefactos asociados:** ART-CORP-001, ART-CORP-017 (SOW)
- **Resultado esperado:** Proyecto validado o rechazado
- **Acción ante incumplimiento:** Rechazo o solicitud información adicional
- **Escalamiento:** **Información no definida en el Framework**
- **Gate relacionado:** GATE-CORP-001 (Entrada al Framework)
- **Fuente:** Página 19-20
- **Obligatoriedad:** OBLIGATORIO
- **Observaciones:** Control crítico de entrada al framework
#### 4.1.2 CTRL-CORP-002: Control de Transferencia
- **ID:** CTRL-CORP-002
- **Nombre:** Validación Handover
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-002 (Project Handover)
- **Proceso:** PROC-CORP-002 (Project Handover)
- **Objetivo:** Asegurar transferencia estructurada de conocimiento
- **Trigger:** PMO Intake completado
- **Frecuencia:** Por proyecto (una vez)
- **Responsable:** Líder de Jefes de Proyecto
- **Participantes:** Líder JP, PMO, PM, Cloud Team
- **Qué se controla:** Consistencia SOW vs capacidad, completitud información
- **Validación:** Transferencia completa y comprensión del proyecto
- **Criterio:** Proyecto comprendido y listo para planificación
- **Evidencia requerida:** Sesiones Pre-Kickoff completadas
- **Artefactos asociados:** ART-CORP-017 (SOW), información transferida
- **Resultado esperado:** Proyecto listo para planificación
- **Acción ante incumplimiento:** Completar transferencia pendiente
- **Escalamiento:** Hacia PMO (GOV-CORP-001)
- **Gate relacionado:** CHK-CORP-001 (Transferencia Validada)
- **Fuente:** Página 20-21
- **Obligatoriedad:** OBLIGATORIO

#### 4.1.3 CTRL-CORP-003: Control de Planificación
- **ID:** CTRL-CORP-003
- **Nombre:** Aprobación Línea Base
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-003 (Planificación del Proyecto)
- **Proceso:** PROC-CORP-003 (Planificación del Proyecto)
- **Objetivo:** Aprobar línea base del proyecto
- **Trigger:** Planificación completada
- **Frecuencia:** Por proyecto (una vez)
- **Responsable:** Project Manager
- **Participantes:** PM, Cloud Team, Líder JP
- **Qué se controla:** Completitud y viabilidad de la planificación
- **Validación:** Validación técnica Cloud Team
- **Criterio:** Planificación viable y completa
- **Evidencia requerida:** WBS, Cronograma, Plan Comunicación, validación técnica
- **Artefactos asociados:** ART-CORP-002, ART-CORP-003, ART-CORP-004, ART-CORP-005
- **Resultado esperado:** Línea base aprobada
- **Acción ante incumplimiento:** Revisión y ajuste de planificación
- **Escalamiento:** Hacia Líder JP (GOV-CORP-002)
- **Gate relacionado:** GATE-CORP-002 (Aprobación Planificación)
- **Fuente:** Página 21-22
- **Obligatoriedad:** OBLIGATORIO

#### 4.1.4 CTRL-CORP-004: Control de Seguimiento
- **ID:** CTRL-CORP-004
- **Nombre:** Monitoreo Continuo
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-006 (Monitoreo y Control)
- **Proceso:** PROC-CORP-006 (Monitoreo y Control)
- **Objetivo:** Seguimiento continuo durante ejecución
- **Trigger:** Ejecución iniciada
- **Frecuencia:** Continua durante ejecución
- **Responsable:** Project Manager (operativo), Líder JP (táctico), PMO (estratégico)
- **Participantes:** PM, Líder JP, PMO, Cloud Team
- **Qué se controla:** Cumplimiento hitos, consumo HH, riesgos, cambios, cronograma
- **Validación:** Reportería continua, dashboards, KPIs
- **Criterio:** Proyecto dentro de parámetros controlados
- **Evidencia requerida:** Reportes, dashboards, registros de seguimiento
- **Artefactos asociados:** ART-CORP-022 (Reportería Semanal), ART-CORP-016 (Dashboards)
- **Resultado esperado:** Control permanente y decisiones oportunas
- **Acción ante incumplimiento:** Escalamiento según matriz
- **Escalamiento:** Según ART-CORP-020 (Matriz de Escalamiento)
- **Gate relacionado:** Revisiones periódicas (múltiples checkpoints)
- **Fuente:** Página 23
- **Obligatoriedad:** OBLIGATORIO
#### 4.1.5 CTRL-CORP-005: Control de Aceptación
- **ID:** CTRL-CORP-005
- **Nombre:** Validación de Entregables
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-007 (Validación de Entregables)
- **Proceso:** PROC-CORP-007 (Validación de Entregables)
- **Objetivo:** Asegurar cumplimiento y aceptación de entregables
- **Trigger:** Entregables completados
- **Frecuencia:** Por entregable (según cronograma)
- **Responsable:** Project Manager
- **Participantes:** PM, Cloud Team, Cliente, Stakeholders
- **Qué se controla:** Cumplimiento criterios aceptación, calidad entregables
- **Validación:** Revisión técnica, validación funcional, aprobación cliente
- **Criterio:** Entregables cumplen criterios de aceptación
- **Evidencia requerida:** Aprobación formal del cliente
- **Artefactos asociados:** Criterios de aceptación, evidencias de validación
- **Resultado esperado:** Entregables aceptados formalmente
- **Acción ante incumplimiento:** Corrección y re-validación
- **Escalamiento:** Hacia Cliente/Líder JP según caso
- **Gate relacionado:** CHK-CORP-002 (Aceptación Entregables)
- **Fuente:** Página 23-24
- **Obligatoriedad:** OBLIGATORIO

#### 4.1.6 CTRL-CORP-006: Control de Cierre
- **ID:** CTRL-CORP-006
- **Nombre:** Validación Cierre Formal
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-008 (Cierre del Proyecto)
- **Proceso:** PROC-CORP-008 (Cierre del Proyecto)
- **Objetivo:** Formalizar finalización bajo criterios control y trazabilidad
- **Trigger:** Entregables validados y aceptados
- **Frecuencia:** Por proyecto (una vez)
- **Responsable:** Project Manager
- **Participantes:** PM, Cloud Team, PMO, Líder JP
- **Qué se controla:** Completitud documentación, validación financiera, cierre administrativo
- **Validación:** Consolidación documental, control HH, facturación
- **Criterio:** Proyecto cerrado completamente
- **Evidencia requerida:** Documentación final, lecciones aprendidas, validación financiera
- **Artefactos asociados:** ART-CORP-006, ART-CORP-007, ART-CORP-008, ART-CORP-009, ART-CORP-010, ART-CORP-024
- **Resultado esperado:** Proyecto formalmente cerrado
- **Acción ante incumplimiento:** Completar pendientes de cierre
- **Escalamiento:** Hacia Líder JP/PMO según caso
- **Gate relacionado:** GATE-CORP-003 (Cierre Formal)
- **Fuente:** Página 24
- **Obligatoriedad:** OBLIGATORIO

### 4.2 Framework Ágil - Controles Informales

**[FRAMEWORK]** El Framework Ágil no define controles formales con la misma estructura que el corporativo, sino **validaciones continuas** y **mecanismos de adaptación**.

#### 4.2.1 CTRL-AGL-001: Validación Inicial Ágil
- **ID:** CTRL-AGL-001
- **Nombre:** Validación Inicial de Viabilidad
- **Framework:** Framework Ágil v1
- **Fase:** PHA-AGL-001 (Agile Intake & Handover)
- **Proceso:** PROC-AGL-001 (Agile Intake & Handover)
- **Objetivo:** Asegurar que proyecto ingrese correctamente estructurado al framework ágil
- **Trigger:** Requerimiento comercial para iniciativa ágil
- **Frecuencia:** Por iniciativa (una vez)
- **Responsable:** Equipo comercial → Equipo operativo
- **Participantes:** Comercial, PMO, PM, Cloud Team
- **Qué se controla:** Readiness para inicio ágil, duración ≤4 semanas
- **Validación:** **Información no definida en el Framework**
- **Criterio:** Iniciativa apta para framework ágil
- **Evidencia requerida:** **Información no definida en el Framework**
- **Resultado esperado:** Iniciativa lista para discovery
- **Obligatoriedad:** **NO DETERMINADO**
- **Fuente:** Sección 7.1
- **Observaciones:** Control implícito, no formalizado
#### 4.2.2 CTRL-AGL-002: Validación Discovery
- **ID:** CTRL-AGL-002
- **Nombre:** Validación Completitud Discovery
- **Framework:** Framework Ágil v1
- **Fase:** PHA-AGL-002 (Discovery)
- **Proceso:** PROC-AGL-002 (Discovery Ágil)
- **Objetivo:** Asegurar requerimientos suficientes para planificación
- **Trigger:** Discovery completado
- **Frecuencia:** Por iniciativa
- **Responsable:** Project Manager
- **Qué se controla:** Completitud de requerimientos levantados
- **Criterio:** Requerimientos suficientes para sprint planning
- **Evidencia requerida:** Workshops completados, requerimientos documentados
- **Obligatoriedad:** **NO DETERMINADO**
- **Fuente:** Sección 7.2

#### 4.2.3 CTRL-AGL-003: Validación Sprint Planning
- **ID:** CTRL-AGL-003
- **Nombre:** Validación Viabilidad del Sprint
- **Framework:** Framework Ágil v1
- **Fase:** PHA-AGL-003 (Sprint Planning)
- **Proceso:** PROC-AGL-003 (Sprint Planning)
- **Objetivo:** Validar viabilidad del backlog para ejecución
- **Trigger:** Sprint planning completado
- **Frecuencia:** Por sprint (recurrente)
- **Responsable:** Project Manager
- **Qué se controla:** Viabilidad del backlog construido
- **Criterio:** Backlog ready para ejecución
- **Evidencia requerida:** ART-AGL-001 (Backlog del Proyecto)
- **Obligatoriedad:** **NO DETERMINADO**
- **Fuente:** Sección 7.3

#### 4.2.4 CTRL-AGL-004: Seguimiento Iterativo
- **ID:** CTRL-AGL-004
- **Nombre:** Seguimiento Continuo de Avance
- **Framework:** Framework Ágil v1
- **Fase:** PHA-AGL-004 (Ejecución Iterativa)
- **Proceso:** PROC-AGL-004 (Ejecución Iterativa)
- **Objetivo:** Monitorear avance incremental
- **Trigger:** Ejecución en progreso
- **Frecuencia:** Continua durante iteración
- **Responsable:** Project Manager, Cloud Team
- **Qué se controla:** Progreso de entregas incrementales
- **Criterio:** **Información no definida en el Framework**
- **Obligatoriedad:** **NO DETERMINADO**
- **Fuente:** Sección 7.4

#### 4.2.5 CTRL-AGL-005: Validación Incremental
- **ID:** CTRL-AGL-005
- **Nombre:** Validación Incremental de Valor
- **Framework:** Framework Ágil v1
- **Fase:** PHA-AGL-005 (Validación Continua)
- **Proceso:** PROC-AGL-005 (Validación Continua)
- **Objetivo:** Obtener feedback y validar valor incremental
- **Trigger:** Entregas incrementales disponibles
- **Frecuencia:** Por iteración (recurrente)
- **Responsable:** Project Manager
- **Qué se controla:** Valor entregado y feedback cliente
- **Criterio:** Aprobación incremental del cliente
- **Evidencia requerida:** Feedback de demos, validaciones registradas
- **Obligatoriedad:** OBLIGATORIO
- **Fuente:** Sección 7.5

#### 4.2.6 CTRL-AGL-006: Validación Cierre Ágil
- **ID:** CTRL-AGL-006
- **Nombre:** Validación Cierre Simplificado
- **Framework:** Framework Ágil v1
- **Fase:** PHA-AGL-006 (Cierre Ágil)
- **Proceso:** PROC-AGL-006 (Cierre Ágil)
- **Objetivo:** Validar cierre con documentación mínima
- **Trigger:** Objetivos de iniciativa cumplidos
- **Frecuencia:** Por iniciativa (una vez)
- **Responsable:** Project Manager
- **Qué se controla:** Completitud de cierre ágil
- **Criterio:** Cierre formal validado
- **Evidencia requerida:** Entregables técnicos, presentación ejecutiva, lecciones aprendidas
- **Artefactos asociados:** ART-AGL-002, ART-AGL-003, ART-AGL-004
- **Obligatoriedad:** OBLIGATORIO
- **Fuente:** Sección 7.6
## 5. GATES Y CHECKPOINTS

### 5.1 Gates Explícitos (Framework Corporativo)

#### 5.1.1 GATE-CORP-001: Entrada al Framework
- **ID:** GATE-CORP-001
- **Nombre:** Gate de Entrada al Framework Corporativo
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-001 (PMO Intake)
- **Objetivo:** Determinar si proyecto puede ingresar al framework
- **Momento:** Final del PMO Intake
- **Condiciones de entrada:** Proyecto aprobado comercialmente
- **Inputs:** Información comercial del proyecto
- **Artefactos requeridos:** ART-CORP-001 (Información Base), ART-CORP-017 (SOW)
- **Controles previos:** CTRL-CORP-001 (Validación PMO Intake)
- **Responsable:** PMO
- **Aprobador:** PMO
- **Participantes:** PMO
- **Validaciones:** Completitud información, viabilidad inicial, clasificación por criticidad
- **Criterios de aprobación:** 
  - Información base completa
  - Proyecto viable técnica y operativamente
  - Recursos disponibles para asignación
- **Resultado Go:** Proyecto pasa a Handover
- **Resultado No-Go:** Proyecto rechazado o diferido
- **Excepciones:** **Información no definida en el Framework**
- **Evidencia:** Registro en portafolio, proyecto creado en Asana
- **Proceso siguiente:** PROC-CORP-002 (Project Handover)
- **Fuente:** Página 19-20
- **Observaciones:** Gate crítico de entrada

#### 5.1.2 GATE-CORP-002: Aprobación Planificación
- **ID:** GATE-CORP-002
- **Nombre:** Gate de Aprobación de Planificación
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-003 (Planificación del Proyecto)
- **Objetivo:** Aprobar línea base para ejecución
- **Momento:** Final de planificación
- **Condiciones de entrada:** Planificación completada
- **Inputs:** WBS, Cronograma, estimaciones, validación técnica
- **Artefactos requeridos:** ART-CORP-002 (WBS), ART-CORP-003 (Cronograma), ART-CORP-004 (Plan Comunicación)
- **Controles previos:** CTRL-CORP-003 (Control de Planificación)
- **Responsable:** Project Manager
- **Aprobador:** **Información no definida en el Framework**
- **Participantes:** PM, Cloud Team, Líder JP
- **Validaciones:** Validación técnica Cloud Team, viabilidad cronograma
- **Criterios de aprobación:**
  - Validación técnica exitosa
  - Cronograma viable
  - Recursos confirmados
- **Resultado Go:** Línea base aprobada, pasa a configuración
- **Resultado No-Go:** Revisión y ajuste de planificación
- **Evidencia:** ART-CORP-005 (Línea Base aprobada)
- **Proceso siguiente:** PROC-CORP-004 (Configuración Operativa)
- **Fuente:** Página 21-22

### 5.2 Checkpoints (Framework Corporativo)

#### 5.2.1 CHK-CORP-001: Transferencia Validada
- **ID:** CHK-CORP-001
- **Nombre:** Checkpoint Transferencia Validada
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-002 (Project Handover)
- **Objetivo:** Validar transferencia completa de conocimiento
- **Momento:** Final del handover
- **Responsable:** Líder de Jefes de Proyecto
- **Validaciones:** Sesiones Pre-Kickoff completadas, comprensión del proyecto
- **Criterios:** Proyecto comprendido y listo para planificación
- **Evidencia:** Sesiones Pre-Kickoff documentadas
- **Control relacionado:** CTRL-CORP-002
- **Fuente:** Página 20-21
#### 5.2.2 CHK-CORP-002: Aceptación Entregables
- **ID:** CHK-CORP-002
- **Nombre:** Checkpoint Aceptación de Entregables
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-007 (Validación de Entregables)
- **Objetivo:** Validar aceptación formal de entregables
- **Momento:** Por entregable según cronograma
- **Responsable:** Project Manager
- **Validaciones:** Aprobación formal del cliente
- **Criterios:** Entregables cumplen criterios de aceptación
- **Evidencia:** Aprobación cliente documentada
- **Control relacionado:** CTRL-CORP-005
- **Fuente:** Página 23-24

### 5.3 GATE-CORP-003: Cierre Formal
- **ID:** GATE-CORP-003
- **Nombre:** Gate de Cierre Formal del Proyecto
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-008 (Cierre del Proyecto)
- **Objetivo:** Formalizar cierre completo del proyecto
- **Momento:** Final del proyecto
- **Condiciones de entrada:** Entregables validados y aceptados
- **Inputs:** Documentación completa, validación financiera
- **Artefactos requeridos:** ART-CORP-006, ART-CORP-007, ART-CORP-008, ART-CORP-009, ART-CORP-010, ART-CORP-024
- **Controles previos:** CTRL-CORP-006 (Control de Cierre)
- **Responsable:** Project Manager
- **Aprobador:** **Información no definida en el Framework**
- **Validaciones:** Documentación completa, lecciones aprendidas, validación financiera
- **Criterios de aprobación:**
  - Documentación técnica completa
  - Validación financiera exitosa
  - Lecciones aprendidas documentadas
- **Resultado Go:** Proyecto formalmente cerrado
- **Resultado No-Go:** Completar pendientes de cierre
- **Evidencia:** Cierre administrativo completo
- **Fuente:** Página 24

### 5.4 Gates/Checkpoints Ágiles (Implícitos)

**[FRAMEWORK]** El Framework Ágil no define gates formales sino **validaciones continuas**:

#### 5.4.1 CHK-AGL-001: Readiness Ágil
- **ID:** CHK-AGL-001
- **Nombre:** Checkpoint Readiness para Framework Ágil
- **Framework:** Framework Ágil v1
- **Fase:** PHA-AGL-001 (Agile Intake & Handover)
- **Objetivo:** Validar aptitud para metodología ágil
- **Momento:** Final del agile intake
- **Responsable:** **Información no definida en el Framework**
- **Criterios:** Iniciativa apta para framework ágil, duración ≤4 semanas
- **Control relacionado:** CTRL-AGL-001
- **Fuente:** Sección 7.1

#### 5.4.2 CHK-AGL-002: Backlog Ready
- **ID:** CHK-AGL-002
- **Nombre:** Checkpoint Backlog Ready para Ejecución
- **Framework:** Framework Ágil v1
- **Fase:** PHA-AGL-003 (Sprint Planning)
- **Objetivo:** Validar backlog listo para ejecución
- **Momento:** Final del sprint planning
- **Responsable:** Project Manager
- **Criterios:** Backlog priorizado y viable
- **Evidencia:** ART-AGL-001 (Backlog del Proyecto)
- **Control relacionado:** CTRL-AGL-003
- **Fuente:** Sección 7.3

#### 5.4.3 CHK-AGL-003: Validación Incremental
- **ID:** CHK-AGL-003
- **Nombre:** Checkpoint Validación Incremental
- **Framework:** Framework Ágil v1
- **Fase:** PHA-AGL-005 (Validación Continua)
- **Objetivo:** Validar valor incremental entregado
- **Momento:** Por iteración
- **Responsable:** Project Manager + Cliente
- **Criterios:** Aprobación incremental del cliente
- **Evidencia:** Feedback de demos, validaciones
- **Control relacionado:** CTRL-AGL-005
- **Fuente:** Sección 7.5
## 6. GOVERNANCE RECURRENTE

### 6.1 Mecanismos Recurrentes Framework Corporativo

#### 6.1.1 REC-CORP-001: Reportería Semanal
- **ID:** REC-CORP-001
- **Mecanismo:** Reportería Semanal
- **Framework:** Framework Corporativo v3.1
- **Objetivo:** Comunicar estado y avance del proyecto
- **Frecuencia:** Semanal
- **Responsable:** Project Manager
- **Participantes:** PM, stakeholders definidos
- **Input:** Estado proyecto, hitos, riesgos, avance
- **Información revisada:** Progreso, desviaciones, bloqueos
- **Artefactos:** ART-CORP-022 (Reportería Semanal)
- **Output:** Reporte de estado
- **Escalamiento:** Según ART-CORP-020 (Matriz de Escalamiento)
- **Fuente:** Página 35

#### 6.1.2 REC-CORP-002: Monitoreo de Dashboards
- **ID:** REC-CORP-002
- **Mecanismo:** Supervisión mediante Dashboards
- **Framework:** Framework Corporativo v3.1
- **Objetivo:** Visibilidad continua del portafolio
- **Frecuencia:** Continua
- **Responsable:** Project Manager, Líder JP, PMO
- **Participantes:** Múltiples niveles governance
- **Información revisada:** Progreso general, estado hitos, tareas atrasadas, riesgos
- **Artefactos:** ART-CORP-016 (Dashboards y Vistas Operativas)
- **Output:** Visibilidad operacional
- **Escalamiento:** Automático según configuración
- **Fuente:** Página 32

### 6.2 Mecanismos Recurrentes Framework Ágil

#### 6.2.1 REC-AGL-001: Demos Incrementales
- **ID:** REC-AGL-001
- **Mecanismo:** Demos con Cliente
- **Framework:** Framework Ágil v1
- **Objetivo:** Presentar avances incrementales y obtener feedback
- **Frecuencia:** Por iteración
- **Responsable:** Project Manager
- **Participantes:** PM, Cloud Team, Cliente
- **Input:** Entregas incrementales
- **Información revisada:** Funcionalidad implementada, valor generado
- **Output:** Feedback cliente, ajustes backlog
- **Escalamiento:** **Información no definida en el Framework**
- **Fuente:** Sección 7.5

#### 6.2.2 REC-AGL-002: Workshops Técnicos
- **ID:** REC-AGL-002
- **Mecanismo:** Workshops
- **Framework:** Framework Ágil v1
- **Objetivo:** Levantamiento requerimientos y colaboración
- **Frecuencia:** Según necesidad (Discovery, Ejecución)
- **Responsable:** Project Manager, Cloud Team
- **Participantes:** PM, Cloud Team, Cliente, Stakeholders
- **Input:** Requerimientos, contexto técnico
- **Output:** Requerimientos clarificados, decisiones técnicas
- **Fuente:** Sección 7.2, 7.4

## 7. REPORTERÍA

### 7.1 Mecanismos Formales de Reporte

#### 7.1.1 REP-CORP-001: Reportería Semanal
- **ID:** REP-CORP-001
- **Nombre:** Reporte Semanal de Estado
- **Audiencia:** Stakeholders del proyecto
- **Owner:** Project Manager
- **Frecuencia:** Semanal
- **Contenido:** Estado proyecto, hitos, riesgos, avance, bloqueos
- **Indicadores:** **Información no definida en el Framework**
- **Artefacto:** ART-CORP-022 (Reportería Semanal)
- **Canal:** **Información no definida en el Framework**
- **Evidencia:** Reporte documentado
- **Escalamiento:** Según matriz de escalamiento
- **Referencia:** Página 35

#### 7.1.2 REP-CORP-002: Dashboards Consolidados
- **ID:** REP-CORP-002
- **Nombre:** Dashboards Ejecutivos y Operacionales
- **Audiencia:** PM, Líder JP, PMO
- **Owner:** Project Manager (configuración), PMO (consolidación)
- **Frecuencia:** Continua (tiempo real)
- **Contenido:** Progreso, hitos, tareas atrasadas, distribución carga, riesgos
- **Artefacto:** ART-CORP-016 (Dashboards y Vistas Operativas)
- **Canal:** Asana (plataforma)
- **Referencia:** Página 32
#### 7.1.3 REP-CORP-003: Presentación Ejecutiva
- **ID:** REP-CORP-003
- **Nombre:** Presentación Ejecutiva de Cierre
- **Audiencia:** Nivel ejecutivo
- **Owner:** Project Manager
- **Frecuencia:** Final de proyecto
- **Contenido:** Resultados ejecutivos, valor generado, cierre formal
- **Artefacto:** ART-CORP-009 (Presentación Ejecutiva)
- **Canal:** Presentación formal
- **Referencia:** Página 24

### 7.2 Gaps de Reportería Identificados

**GAP-REP-001:** Framework Ágil no especifica mecanismos formales de reportería
- **Problema:** No se define cómo comunicar avance en iniciativas ágiles
- **Impacto:** Falta visibilidad para governance ágil
- **Fuente:** Framework Ágil v1 (ausencia de información)

## 8. ESCALAMIENTO

### 8.1 Reglas Formales de Escalamiento

#### 8.1.1 ESC-CORP-001: Escalamiento Operativo
- **ID:** ESC-CORP-001
- **Trigger:** Desviaciones, bloqueos, riesgos críticos
- **Origen:** GOV-CORP-003 (PM)
- **Destino:** GOV-CORP-002 (Líder JP)
- **Responsable:** Project Manager
- **Condición:** **Información no definida en el Framework** (definida en Matriz de Escalamiento)
- **Información requerida:** Naturaleza del problema, impacto, propuestas
- **Artefacto/evidencia:** ART-CORP-020 (Matriz de Escalamiento)
- **Resultado esperado:** Resolución o escalamiento adicional
- **Fuente:** Página 13, 34

#### 8.1.2 ESC-CORP-002: Escalamiento Organizacional
- **ID:** ESC-CORP-002
- **Trigger:** Problemas que superan nivel táctico
- **Origen:** GOV-CORP-002 (Líder JP)
- **Destino:** GOV-CORP-001 (PMO)
- **Responsable:** Líder de Jefes de Proyecto
- **Condición:** **Información no definida en el Framework**
- **Información requerida:** Análisis táctico, recomendaciones
- **Resultado esperado:** Decisión estratégica o escalamiento superior
- **Fuente:** Página 12-13

### 8.2 Escalamiento Ágil

#### 8.2.1 ESC-AGL-001: Facilitación de Bloqueos
- **ID:** ESC-AGL-001
- **Trigger:** Bloqueos en ejecución ágil
- **Origen:** GOV-AGL-003 (PM Ágil)
- **Destino:** GOV-AGL-002 (PM Lead Ágil)
- **Responsable:** Project Manager
- **Condición:** **Información no definida en el Framework**
- **Resultado esperado:** Facilitación y resolución
- **Fuente:** Sección 6.2
- **Observaciones:** Enfoque en facilitación vs escalamiento formal

## 9. DECISIONES Y APROBACIONES

### 9.1 Matriz de Decisiones Framework Corporativo

#### 9.1.1 DEC-CORP-001: Aprobación Entrada Framework
- **ID:** DEC-CORP-001
- **Decisor:** PMO
- **Qué puede aprobar:** Entrada de proyectos al framework
- **Momento:** PMO Intake
- **Evidencia requerida:** ART-CORP-001 (Información Base del Proyecto)
- **Resultado:** Proyecto ingresa al framework o es rechazado
- **Role ID:** ROL-CORP-001 (PMO)
- **Process ID:** PROC-CORP-001 (PMO Intake)
- **Gate ID:** GATE-CORP-001 (Entrada al Framework)
- **Control ID:** CTRL-CORP-001 (Control de Entrada)
- **Fuente:** Página 19-20

#### 9.1.2 DEC-CORP-002: Aprobación Línea Base
- **ID:** DEC-CORP-002
- **Decisor:** **Información no definida en el Framework**
- **Qué puede aprobar:** Línea base del proyecto
- **Momento:** Final de planificación
- **Evidencia requerida:** WBS, Cronograma, Plan Comunicación, validación técnica
- **Resultado:** Línea base aprobada para ejecución
- **Process ID:** PROC-CORP-003 (Planificación)
- **Gate ID:** GATE-CORP-002 (Aprobación Planificación)
- **Control ID:** CTRL-CORP-003 (Control de Planificación)
- **Fuente:** Página 21-22
#### 9.1.3 DEC-CORP-003: Aceptación Entregables
- **ID:** DEC-CORP-003
- **Decisor:** Cliente
- **Qué puede aprobar:** Entregables del proyecto
- **Momento:** Según cronograma de entregables
- **Evidencia requerida:** Entregables cumpliendo criterios de aceptación
- **Resultado:** Entregables aceptados o rechazados
- **Process ID:** PROC-CORP-007 (Validación de Entregables)
- **Control ID:** CTRL-CORP-005 (Control de Aceptación)
- **Fuente:** Página 23-24

### 9.2 Decisiones Framework Ágil

#### 9.2.1 DEC-AGL-001: Priorización Backlog
- **ID:** DEC-AGL-001
- **Decisor:** Product Owner Cliente (si aplica), Project Manager
- **Qué puede aprobar:** Priorización de backlog
- **Momento:** Sprint Planning
- **Evidencia requerida:** Requerimientos levantados
- **Resultado:** Backlog priorizado para ejecución
- **Process ID:** PROC-AGL-003 (Sprint Planning)
- **Artifact ID:** ART-AGL-001 (Backlog del Proyecto)
- **Fuente:** Sección 6.5, 7.3

#### 9.2.2 DEC-AGL-002: Validación Incremental
- **ID:** DEC-AGL-002
- **Decisor:** Cliente
- **Qué puede aprobar:** Entregas incrementales
- **Momento:** Por iteración
- **Evidencia requerida:** Demos, entregables incrementales
- **Resultado:** Feedback y ajustes o aprobación incremental
- **Process ID:** PROC-AGL-005 (Validación Continua)
- **Control ID:** CTRL-AGL-005 (Validación Incremental)
- **Fuente:** Sección 7.5

## 10. EVIDENCIAS DE GOVERNANCE

### 10.1 Catálogo de Evidencias

#### 10.1.1 EV-001: Registro en Portafolio
- **ID:** EV-001
- **Nombre:** Registro del Proyecto en Portafolio PMO
- **Control relacionado:** CTRL-CORP-001
- **Gate relacionado:** GATE-CORP-001
- **Proceso relacionado:** PROC-CORP-001
- **Owner:** PMO
- **Momento:** PMO Intake
- **Repositorio indicado:** Sistema PMO
- **Obligatoriedad:** OBLIGATORIO
- **Referencia:** Página 20

#### 10.1.2 EV-002: Sesiones Pre-Kickoff
- **ID:** EV-002
- **Nombre:** Sesiones Pre-Kickoff Documentadas
- **Control relacionado:** CTRL-CORP-002
- **Gate relacionado:** CHK-CORP-001
- **Proceso relacionado:** PROC-CORP-002
- **Owner:** Líder de Jefes de Proyecto
- **Momento:** Project Handover
- **Obligatoriedad:** OBLIGATORIO
- **Referencia:** Página 21

#### 10.1.3 EV-003: Validación Técnica Cloud Team
- **ID:** EV-003
- **Nombre:** Validación Técnica del Cloud Team
- **Control relacionado:** CTRL-CORP-003
- **Gate relacionado:** GATE-CORP-002
- **Proceso relacionado:** PROC-CORP-003
- **Owner:** Cloud Team
- **Momento:** Planificación
- **Obligatoriedad:** OBLIGATORIO
- **Referencia:** Página 22

#### 10.1.4 EV-004: Aprobación Formal Cliente
- **ID:** EV-004
- **Nombre:** Aprobación Formal del Cliente
- **Control relacionado:** CTRL-CORP-005
- **Gate relacionado:** CHK-CORP-002
- **Proceso relacionado:** PROC-CORP-007
- **Owner:** Cliente
- **Momento:** Validación entregables
- **Obligatoriedad:** OBLIGATORIO
- **Referencia:** Página 24
## 11. RELACIÓN GOVERNANCE → ARTEFACTOS

### 11.1 Artefactos como Evidencia de Governance

| ART-ID | Artefacto | CTRL-ID | GATE-ID | Tipo de Relación | Obligatoriedad | Referencia |
|---------|-----------|---------|----------|------------------|----------------|------------|
| ART-CORP-001 | Información Base del Proyecto | CTRL-CORP-001 | GATE-CORP-001 | Input de Gate | OBLIGATORIO | Pág. 19-20 |
| ART-CORP-017 | SOW | CTRL-CORP-001 | GATE-CORP-001 | Input de Gate | OBLIGATORIO | Pág. 33 |
| ART-CORP-002 | WBS | CTRL-CORP-003 | GATE-CORP-002 | Input de Gate | OBLIGATORIO | Pág. 21 |
| ART-CORP-003 | Cronograma | CTRL-CORP-003 | GATE-CORP-002 | Input de Gate | OBLIGATORIO | Pág. 21 |
| ART-CORP-004 | Plan de Comunicación | CTRL-CORP-003 | GATE-CORP-002 | Input de Gate | OBLIGATORIO | Pág. 21 |
| ART-CORP-005 | Línea Base del Proyecto | CTRL-CORP-003 | GATE-CORP-002 | Output de Gate | OBLIGATORIO | Pág. 22 |
| ART-CORP-020 | Matriz de Escalamiento | CTRL-CORP-004 | - | Evidencia de Control | OBLIGATORIO | Pág. 34 |
| ART-CORP-022 | Reportería Semanal | CTRL-CORP-004 | - | Evidencia de Control | OBLIGATORIO | Pág. 35 |
| ART-CORP-016 | Dashboards y Vistas | CTRL-CORP-004 | - | Evidencia de Control | OBLIGATORIO | Pág. 32 |
| ART-CORP-006 | Documentación Técnica Final | CTRL-CORP-006 | GATE-CORP-003 | Input de Gate | OBLIGATORIO | Pág. 24 |
| ART-CORP-009 | Presentación Ejecutiva | CTRL-CORP-006 | GATE-CORP-003 | Input de Gate | OBLIGATORIO | Pág. 24 |
| ART-CORP-010 | Lecciones Aprendidas | CTRL-CORP-006 | GATE-CORP-003 | Input de Gate | OBLIGATORIO | Pág. 24 |
| ART-AGL-001 | Backlog del Proyecto | CTRL-AGL-003 | CHK-AGL-002 | Input de Checkpoint | OBLIGATORIO | Secc. 7.3 |
| ART-AGL-003 | Presentación Ejecutiva Cierre | CTRL-AGL-006 | - | Output de Control | OBLIGATORIO | Secc. 7.6 |
| ART-AGL-004 | Lecciones Aprendidas Ágiles | CTRL-AGL-006 | - | Output de Control | OBLIGATORIO | Secc. 7.6 |

## 12. REEVALUACIÓN DE PRIORIDAD DE ARTEFACTOS

### 12.1 Recomendaciones de Repriorización

**[PROPUESTA PORTAL]** Basado en relación con governance:

#### 12.1.1 Mantener P0 (Confirmados por Governance)
- **ART-CORP-001:** Información Base - Input crítico GATE-CORP-001
- **ART-CORP-002:** WBS - Input obligatorio GATE-CORP-002  
- **ART-CORP-003:** Cronograma - Input obligatorio GATE-CORP-002
- **ART-CORP-020:** Matriz de Escalamiento - Evidencia crítica governance
- **ART-CORP-022:** Reportería Semanal - Evidencia recurrente governance
- **ART-AGL-001:** Backlog - Input crítico governance ágil

#### 12.1.2 Subir a P0 (Por Importancia Governance)
- **ART-CORP-004:** Plan de Comunicación
  - **Prioridad actual:** P0 
  - **Prioridad sugerida:** P0 (confirmado)
  - **Motivo:** Input obligatorio GATE-CORP-002

#### 12.1.3 Considerar P1 → P0
- **ART-CORP-009:** Presentación Ejecutiva
  - **Prioridad actual:** P0
  - **Prioridad sugerida:** P0 (confirmado)  
  - **Motivo:** Input obligatorio GATE-CORP-003, reporte crítico

### 12.2 Validación Pendiente PMO
Todas las modificaciones quedan **pendientes de aprobación PMO**.

## 13. GOVERNANCE CORPORATIVO VS ÁGIL

### 13.1 Comparación de Elementos de Governance

| Elemento | Corporativo | Ágil | Relación | Diferencias | Observaciones |
|----------|-------------|------|----------|-------------|---------------|
| **Controles** | 6 controles formales | 6 validaciones informales | PARCIALMENTE EQUIVALENTE | Formal vs continuo | Diferentes filosofías |
| **Frecuencia** | Gates puntuales | Validación continua | DIFERENTE | Puntual vs iterativo | Ágil más frecuente |
| **Aprobaciones** | Gates formales | Checkpoints implícitos | DIFERENTE | Formal vs colaborativo | Menos ceremonia ágil |
| **Roles** | Jerarquía clara | Roles adaptados | COMÚN | Misma base organizacional | Estructura mantenida |
| **Escalamiento** | Matriz formal | Facilitación bloqueos | DIFERENTE | Proceso vs facilitación | Enfoques diferentes |
| **Reportería** | Semanal + Dashboards | **No especificada** | EXCLUSIVO CORPORATIVO | Formal vs informal | Gap en ágil |
| **Gates** | 3 gates explícitos | 0 gates explícitos | EXCLUSIVO CORPORATIVO | Formales vs implícitos | Mayor control corporativo |
| **Evidencias** | Documentación formal | Mínima documentación | DIFERENTE | Completa vs esencial | Filosofías diferentes |
| **Autonomía equipo** | Control jerárquico | Mayor autonomía | DIFERENTE | Supervisión vs confianza | Ágil más autónomo |
## 14. GOVERNANCE CHECKLIST

### 14.1 Evaluación para Checklist

| Control | Fase | Responsable | Evidencia | Apto para Checklist | Razón |
|---------|------|-------------|-----------|-------------------|-------|
| CTRL-CORP-001 | PMO Intake | PMO | ART-CORP-001 | APTO | Criterios claros, evidencia definida |
| CTRL-CORP-002 | Handover | Líder JP | Sesiones Pre-Kickoff | APTO | Validación clara |
| CTRL-CORP-003 | Planificación | PM | Validación técnica | APTO | Criterios objetivos |
| CTRL-CORP-004 | Monitoreo | PM/Líder JP/PMO | Reportes, dashboards | APTO | Evidencia sistemática |
| CTRL-CORP-005 | Validación | PM | Aprobación cliente | APTO | Criterio binario claro |
| CTRL-CORP-006 | Cierre | PM | Documentación completa | APTO | Lista verificable |
| CTRL-AGL-001 | Agile Intake | **No definido** | **No definida** | NO APTO | Falta definición |
| CTRL-AGL-005 | Validación Continua | PM | Feedback demos | APTO | Validación incremental |
| CTRL-AGL-006 | Cierre Ágil | PM | Entregables + lecciones | APTO | Criterios claros |

### 14.2 Propuesta Estructura Checklist

**[PROPUESTA PORTAL]**
```
Control ID | Fase | Responsable | Evidencia | Estado | Validación | Fecha | Observaciones
CTRL-CORP-001 | PMO Intake | PMO | ART-CORP-001 | ⬜ Pendiente | ⬜ Validado | [fecha] | [notas]
```

## 15. CUMPLIMIENTO

### 15.1 Métricas de Cumplimiento Identificadas

**[FRAMEWORK]** **"Los Frameworks no definen una fórmula de Governance Compliance."**

**Hallazgos:**
- No se encontraron métricas formales de cumplimiento
- No se identificaron scores o porcentajes
- No se definen semáforos de governance
- No se establecen SLAs de governance

**Evidencia de búsqueda:**
- Framework Corporativo: Sin métricas cuantitativas de governance
- Framework Ágil: Sin métricas de compliance definidas

**[PROPUESTA PORTAL]** Conceptos como "Governance Score" o "% Compliance" podrán evaluarse posteriormente.

## 16. HERRAMIENTAS DE GOVERNANCE

### 16.1 Herramientas Corporativas Documentadas

| Herramienta | Uso | Proceso | Control | Artefacto | Fuente |
|-------------|-----|---------|---------|-----------|--------|
| **Asana** | Gestión operativa, dashboards | PROC-CORP-004, PROC-CORP-006 | CTRL-CORP-004 | ART-CORP-012, ART-CORP-016 | Pág. 22, 25, 32 |
| **Timetracker** | Control de horas | PROC-CORP-004, PROC-CORP-006 | CTRL-CORP-004 | Registro HH | Pág. 22, 25 |
| **Google Drive** | Repositorio documental | Múltiples procesos | Múltiples controles | Documentación | Pág. 26 |
| **Google Slides** | Presentaciones ejecutivas | PROC-CORP-008 | CTRL-CORP-006 | ART-CORP-009 | Pág. 26-27 |
| **Google Sheets** | Matrices, reportes | PROC-CORP-003, PROC-CORP-006 | CTRL-CORP-003, CTRL-CORP-004 | ART-CORP-020, reportería | Pág. 27 |

### 16.2 Herramientas Framework Ágil
**[FRAMEWORK]** **"Información no definida en el Framework"** - No se especifican herramientas para governance ágil.

## 17. GAPS DE GOVERNANCE

### 17.1 Gaps Críticos Identificados

#### 17.1.1 GAP-GOV-001: Aprobadores no Definidos
- **ID:** GAP-GOV-001
- **Tema:** Aprobadores de Gates no especificados
- **Descripción:** GATE-CORP-002 y GATE-CORP-003 sin aprobador definido
- **Impacto:** Ambigüedad en proceso de aprobación
- **Fuente:** Página 21-22, 24
- **Decisión requerida PMO:** Definir aprobadores formales

#### 17.1.2 GAP-GOV-002: Criterios Gates Incompletos
- **ID:** GAP-GOV-002  
- **Tema:** Criterios cuantitativos de gates
- **Descripción:** Gates sin criterios específicos medibles
- **Impacto:** Subjetividad en aprobaciones
- **Fuente:** Multiple gates
- **Decisión requerida PMO:** Establecer criterios específicos

#### 17.1.3 GAP-GOV-003: Governance Ágil Incompleto
- **ID:** GAP-GOV-003
- **Tema:** Governance ágil sin formalizar
- **Descripción:** Controles ágiles sin estructura formal
- **Impacto:** Inconsistencia governance entre frameworks  
- **Fuente:** Framework Ágil v1
- **Decisión requerida PMO:** Formalizar governance ágil
#### 17.1.4 GAP-GOV-004: Reportería Ágil Ausente
- **ID:** GAP-GOV-004
- **Tema:** Sin reportería definida para framework ágil
- **Descripción:** No se especifica cómo reportar en iniciativas ágiles
- **Impacto:** Falta visibilidad governance ágil
- **Fuente:** Framework Ágil v1 (ausencia)
- **Decisión requerida PMO:** Definir reportería ágil

#### 17.1.5 GAP-GOV-005: Escalamiento Ágil Sin Protocolo
- **ID:** GAP-GOV-005
- **Tema:** Escalamiento ágil sin proceso formal
- **Descripción:** "Facilitación de bloqueos" sin protocolo específico
- **Impacto:** Escalamiento ad-hoc en iniciativas ágiles
- **Fuente:** Sección 6.2
- **Decisión requerida PMO:** Protocolo escalamiento ágil

#### 17.1.6 GAP-GOV-006: Herramientas Ágiles No Definidas
- **ID:** GAP-GOV-006
- **Tema:** Stack tecnológico ágil ausente
- **Descripción:** No se especifican herramientas para governance ágil
- **Impacto:** Inconsistencia herramientas entre frameworks
- **Fuente:** Framework Ágil v1 (ausencia)
- **Decisión requerida PMO:** Definir herramientas ágiles

#### 17.1.7 GAP-GOV-007: Repositorios de Evidencia
- **ID:** GAP-GOV-007
- **Tema:** Repositorios de evidencia no especificados
- **Descripción:** No se define dónde almacenar evidencias de governance
- **Impacto:** Trazabilidad inconsistente
- **Fuente:** Múltiples controles
- **Decisión requerida PMO:** Definir repositorios oficiales

#### 17.1.8 GAP-GOV-008: Métricas de Governance
- **ID:** GAP-GOV-008
- **Tema:** Sin métricas de cumplimiento governance
- **Descripción:** No existen indicadores de salud governance
- **Impacto:** Imposibilidad medir efectividad governance
- **Fuente:** Ambos frameworks
- **Decisión requerida PMO:** Definir métricas governance

## 18. CONTRADICCIONES

### 18.1 Issues de Governance Identificados

#### 18.1.1 ISSUE-GOV-001: Diferentes Enfoques Control
- **ID:** ISSUE-GOV-001
- **Tema:** Filosofías contradictorias de control
- **Descripción:** Framework Corporativo (control formal) vs Ágil (validación continua)
- **Impacto:** Posible confusión en aplicación
- **Fuente:** Ambos frameworks
- **Resolución:** **No resolver automáticamente** - Decisión PMO

#### 18.1.2 ISSUE-GOV-002: Duplicidad Roles Governance
- **ID:** ISSUE-GOV-002
- **Tema:** Roles PMO/PM Lead duplicados entre frameworks
- **Descripción:** Mismos roles con responsabilidades ligeramente diferentes
- **Impacto:** Ambigüedad responsabilidades según framework usado
- **Fuente:** Secciones 6.1-6.2 (Ágil) vs Páginas 11-14 (Corporativo)
- **Resolución:** **Pendiente aclaración PMO**

## 19. MODELO PARA EL PORTAL

### 19.1 Propuesta Estructura /governance

**[PROPUESTA PORTAL]** Componentes recomendados para PMO Framework Hub:

```
/governance
├── overview (Principios governance, niveles, comparación frameworks)
├── levels (GOV-CORP-001/002/003, GOV-AGL-001/002/003)
├── controls (CTRL-CORP-XXX, CTRL-AGL-XXX)
├── gates (GATE-CORP-XXX, CHK-XXX)  
├── checkpoints (Validaciones, aprobaciones)
├── reporting (REP-CORP-XXX, mecanismos reporte)
├── escalation (ESC-CORP-XXX, ESC-AGL-XXX)
├── evidence (EV-XXX, catálogo evidencias)
└── checklist (Governance Checklist tool)
```

### 19.2 Relación Visual Propuesta

```
Framework → Fase → Proceso → Control → Evidencia → Artefacto → Gate → Aprobación
```

## 20. MATRIZ MAESTRA

| ID | Tipo | Framework | Fase | Proceso | Nombre | Owner | Aprobador | Frecuencia | Artefactos | Evidencia | Gate | Escalamiento | Obligatoriedad | Referencia |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CTRL-CORP-001 | CONTROL | Corporativo | PMO Intake | PROC-CORP-001 | Validación PMO Intake | PMO | PMO | Por proyecto | ART-CORP-001, ART-CORP-017 | Registro portafolio | GATE-CORP-001 | - | OBLIGATORIO | Pág. 19-20 |
| GATE-CORP-001 | GATE | Corporativo | PMO Intake | PROC-CORP-001 | Entrada al Framework | PMO | PMO | Por proyecto | ART-CORP-001 | EV-001 | - | ESC-CORP-001 | OBLIGATORIO | Pág. 19-20 |
| CTRL-CORP-003 | CONTROL | Corporativo | Planificación | PROC-CORP-003 | Aprobación Línea Base | PM | **No definido** | Por proyecto | ART-CORP-002,003,004,005 | Validación técnica | GATE-CORP-002 | ESC-CORP-001 | OBLIGATORIO | Pág. 21-22 |
| REP-CORP-001 | REPORTE | Corporativo | Monitoreo | PROC-CORP-006 | Reportería Semanal | PM | - | Semanal | ART-CORP-022 | Reporte documentado | - | ESC-CORP-001 | OBLIGATORIO | Pág. 35 |
| CTRL-AGL-005 | CONTROL | Ágil | Validación Continua | PROC-AGL-005 | Validación Incremental | PM | Cliente | Por iteración | Feedback demos | Aprobación incremental | CHK-AGL-003 | ESC-AGL-001 | OBLIGATORIO | Secc. 7.5 |
## 21. VALIDACIÓN DE HALLAZGOS PREVIOS

### 21.1 Verificación Estadísticas Previas

**CONFIRMADO:** Framework Corporativo - 6 controles formales
- ✅ CTRL-CORP-001 a CTRL-CORP-006 identificados y validados

**CONFIRMADO:** Governance de 3 niveles
- ✅ Estratégico (PMO), Táctico (Líder JP), Operativo (PM) en ambos frameworks

**PARCIALMENTE CONFIRMADO:** Framework Ágil
- ✅ 3 niveles governance confirmados
- ❌ Controles "informales" vs "formales" - son validaciones continuas
- ❌ 6 controles: algunos identificados como validaciones implícitas

### 21.2 Correcciones Necesarias
- **Framework Ágil:** 6 validaciones identificadas (no "controles formales")
- **Gates:** 2 gates explícitos + 4 checkpoints (no 6 gates)
- **Reportería:** Solo corporativo tiene reportería formal definida

## 22. RESUMEN EJECUTIVO

### 22.1 GOVERNANCE INVENTORY — RESUMEN

#### **Framework Corporativo:**
- **Niveles de Governance:** 3 (Estratégico/Táctico/Operativo)
- **Controles:** 6 controles formales
- **Gates:** 2 gates explícitos + 1 de cierre
- **Checkpoints:** 2 checkpoints intermedios
- **Aprobaciones:** 3 puntos de aprobación formal
- **Mecanismos de reporte:** 3 (Semanal, Dashboards, Ejecutivo)
- **Mecanismos de escalamiento:** 2 niveles de escalamiento formal

#### **Framework Ágil:**
- **Niveles de Governance:** 3 (adaptados del corporativo)
- **Controles:** 6 validaciones continuas
- **Gates:** 0 gates explícitos
- **Checkpoints:** 3 checkpoints implícitos
- **Aprobaciones:** 2 validaciones incrementales
- **Mecanismos de reporte:** **No especificados**
- **Mecanismos de escalamiento:** Facilitación de bloqueos

#### **Estadísticas Consolidadas:**
- **Evidencias identificadas:** 15 artefactos relacionados con governance
- **Artefactos que podrían subir a P0:** 2 confirmados en P0
- **Controles aptos para Governance Checklist:** 8 de 12 total
- **Gaps:** 8 gaps críticos
- **Contradicciones:** 2 issues principales

### 22.2 TOP 10 CONTROLES DE GOVERNANCE

1. **🥇 CTRL-CORP-001:** Validación PMO Intake - Control crítico de entrada
2. **🥈 CTRL-CORP-003:** Aprobación Línea Base - Gate de planificación
3. **🥉 CTRL-CORP-005:** Validación Entregables - Control de aceptación
4. **4️⃣ CTRL-CORP-006:** Validación Cierre Formal - Control de cierre completo
5. **5️⃣ CTRL-CORP-004:** Monitoreo Continuo - Control transversal ejecución
6. **6️⃣ CTRL-AGL-005:** Validación Incremental - Control ágil principal
7. **7️⃣ CTRL-CORP-002:** Validación Handover - Control de transferencia
8. **8️⃣ CTRL-AGL-003:** Validación Sprint Planning - Control planning ágil
9. **9️⃣ CTRL-AGL-006:** Validación Cierre Ágil - Control cierre simplificado
10. **🔟 CTRL-AGL-001:** Validación Inicial Ágil - Control entrada ágil

### 22.3 GATES / CHECKPOINTS PRINCIPALES

#### **Gates Críticos:**
- **GATE-CORP-001:** Entrada al Framework Corporativo
- **GATE-CORP-002:** Aprobación de Planificación  
- **GATE-CORP-003:** Cierre Formal del Proyecto

#### **Checkpoints Clave:**
- **CHK-CORP-001:** Transferencia Validada
- **CHK-CORP-002:** Aceptación de Entregables
- **CHK-AGL-002:** Backlog Ready para Ejecución
- **CHK-AGL-003:** Validación Incremental

### 22.4 ARTEFACTOS CRÍTICOS DE GOVERNANCE

**P0 - Críticos para Governance:**
- **ART-CORP-001:** Información Base (Input GATE-CORP-001)
- **ART-CORP-002:** WBS (Input GATE-CORP-002)
- **ART-CORP-003:** Cronograma (Input GATE-CORP-002)  
- **ART-CORP-020:** Matriz de Escalamiento (Evidencia crítica)
- **ART-CORP-022:** Reportería Semanal (Evidencia recurrente)
- **ART-AGL-001:** Backlog (Input governance ágil)

**P1 - Importantes para Governance:**
- **ART-CORP-009:** Presentación Ejecutiva (Input GATE-CORP-003)
- **ART-CORP-016:** Dashboards (Evidencia continua)
- **ART-CORP-004:** Plan Comunicación (Input GATE-CORP-002)

### 22.5 DECISIONES REQUERIDAS PMO

#### **Governance Corporativo:**
1. **Definir aprobadores formales** para GATE-CORP-002 y GATE-CORP-003
2. **Establecer criterios cuantitativos** para gates (% avance, scores, métricas)
3. **Definir repositorios oficiales** para evidencias de governance
4. **Establecer métricas de cumplimiento** governance (KPIs, health scores)

#### **Governance Ágil:**
5. **Formalizar controles ágiles** - convertir validaciones en controles estructurados
6. **Definir reportería ágil** - mecanismos comunicación para iniciativas ágiles
7. **Establecer protocolo escalamiento ágil** - proceso formal vs facilitación
8. **Especificar herramientas governance ágil** - stack tecnológico para validaciones

#### **Governance Unificado:**
9. **Resolver contradicciones** entre enfoques control formal vs validación continua
10. **Definir criterios selección** governance (cuándo usar corporativo vs ágil)
11. **Establecer governance consolidado** para portafolio mixto
12. **Crear métricas unificadas** para visibilidad ejecutiva de ambos frameworks

---

**Estado:** COMPLETO - Inventario consolidado de governance  
**Fecha:** $(date)  
**Analista:** Kiro PMO Discovery  
**Próximo paso:** 08-role-inventory.md

### **🎯 HALLAZGOS CRÍTICOS:**

**✅ FORTALEZAS IDENTIFICADAS:**
- Governance de 3 niveles bien estructurado en ambos frameworks
- 6 controles formales robustos en Framework Corporativo  
- Artefactos críticos bien identificados para evidencia
- Relación clara proceso → control → evidencia → gate

**⚠️ GAPS CRÍTICOS:**
- 8 gaps importantes de governance identificados
- Governance ágil sin formalizar completamente
- Aprobadores de gates no definidos
- Sin métricas de cumplimiento definidas

**🔄 DECISIÓN PMO REQUERIDA:**
- Priorizar resolución de 12 decisiones críticas identificadas
- Definir roadmap de formalización governance ágil
- Establecer governance unificado para ambos frameworks

**¿Continuar con paso 8 del Discovery (Inventario de Roles) o revisar este análisis de governance primero?**
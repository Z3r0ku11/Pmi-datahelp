# Inventario Consolidado de Artefactos

**Fuente:** Framework Corporativo v3.1 + Framework Ágil v1  
**Fecha:** $(date)  
**Analista:** Kiro PMO Discovery  
**Objetivo:** Catálogo maestro de artefactos para PMO Framework Hub

## 1. RESUMEN EJECUTIVO

### 1.1 Frameworks Analizados
- **Framework Corporativo y Proceso de Gestión de Proyectos v3.1** (PMO-FWK-003)
- **Framework Gestión Ágil de Proyectos V1**

### 1.2 Estadísticas del Inventario
- **Framework Corporativo:** 24 artefactos identificados
- **Framework Ágil:** 4 artefactos principales identificados
- **Artefactos únicos totales:** 28 artefactos
- **Artefactos equivalentes:** 3 pares
- **Artefactos duplicados:** 0
- **Candidatos a plantilla:** 20 artefactos
- **Candidatos a generador online:** 12 artefactos
- **Artefactos P0 (MVP):** 8 artefactos

### 1.3 Metodología de Catalogación
- **IDs estables:** ART-CORP-XXX y ART-AGL-XXX
- **Trazabilidad:** Enlace a proceso, fase y fuente documental
- **Clasificación técnica:** Tipo de artefacto para portal
- **Obligatoriedad:** Basada únicamente en evidencia documental
## 2. CATÁLOGO MAESTRO - FRAMEWORK CORPORATIVO

### 2.1 ART-CORP-001: Información Base del Proyecto
- **ID:** ART-CORP-001
- **Nombre oficial:** Información Base del Proyecto
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Conjunto de información mínima requerida para validar viabilidad del proyecto
- **Objetivo:** Validar requisitos mínimos para iniciar gestión del proyecto
- **Tipo:** FORMULARIO
- **Fase ID:** PHA-CORP-001
- **Fase:** PMO Intake
- **Proceso ID:** PROC-CORP-001
- **Proceso:** PMO Intake
- **Owner:** PMO
- **Roles participantes:** PMO, Comercial
- **Momento de utilización:** Inicio del PMO Intake
- **Trigger:** Proyecto aprobado comercialmente
- **Contenido esperado:**
  - Alcance
  - SOW (Statement of Work)
  - Costos
  - Horas estimadas
  - Plazos
  - Entregables
  - Arquitectura preliminar
  - Criterios de aceptación
  - Supuestos
  - Restricciones
  - Nivel de complejidad
- **Control relacionado:** CTRL-CORP-001
- **Herramienta relacionada:** Sistema de registro PMO
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "validación información base necesaria"
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 19-20
- **Observaciones:** Artefacto crítico de entrada al framework
### 2.2 ART-CORP-002: WBS - Work Breakdown Structure
- **ID:** ART-CORP-002
- **Nombre oficial:** WBS - Work Breakdown Structure
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Estructura jerárquica del trabajo del proyecto
- **Objetivo:** Descomponer el alcance del proyecto en componentes gestionables
- **Tipo:** DOCUMENTO
- **Fase ID:** PHA-CORP-003
- **Fase:** Planificación del Proyecto
- **Proceso ID:** PROC-CORP-003
- **Proceso:** Planificación del Proyecto
- **Actividad relacionada:** Construcción del WBS
- **Owner:** Project Manager
- **Roles participantes:** Project Manager, Cloud Team
- **Momento de utilización:** Planificación
- **Trigger:** Handover completado
- **Inputs:** Alcance contractual
- **Outputs:** Estructura de trabajo definida
- **Control relacionado:** CTRL-CORP-003
- **Herramienta relacionada:** Google Sheets, Excel, Microsoft Project
- **Formato documentado:** NO DETERMINADO (implícito: tabular)
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "Construcción del WBS" listado como actividad obligatoria
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 21
- **Observaciones:** Base para cronograma y asignación de tareas

### 2.3 ART-CORP-003: Cronograma del Proyecto
- **ID:** ART-CORP-003
- **Nombre oficial:** Cronograma del Proyecto
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Secuencia temporal de actividades del proyecto
- **Objetivo:** Planificar temporalmente la ejecución del proyecto
- **Tipo:** CRONOGRAMA
- **Fase ID:** PHA-CORP-003
- **Fase:** Planificación del Proyecto
- **Proceso ID:** PROC-CORP-003
- **Proceso:** Planificación del Proyecto
- **Actividad relacionada:** Desarrollo cronograma
- **Owner:** Project Manager
- **Roles participantes:** Project Manager, Cloud Team
- **Momento de utilización:** Planificación
- **Contenido esperado:** Secuencia lógica de actividades, dependencias, fechas, ruta crítica
- **Control relacionado:** CTRL-CORP-003
- **Herramienta relacionada:** Google Sheets, Excel, Microsoft Project
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "Cronograma" listado como actividad obligatoria
- **Frecuencia:** Por proyecto (una vez, con actualizaciones)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 21
- **Observaciones:** Incluye hitos contractuales y ruta crítica
### 2.4 ART-CORP-004: Plan de Comunicación
- **ID:** ART-CORP-004
- **Nombre oficial:** Plan de Comunicación
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Estrategia y mecanismos de comunicación del proyecto
- **Objetivo:** Definir cómo se comunicarán stakeholders durante el proyecto
- **Tipo:** PLAN
- **Fase ID:** PHA-CORP-003
- **Fase:** Planificación del Proyecto
- **Proceso ID:** PROC-CORP-003
- **Proceso:** Planificación del Proyecto
- **Actividad relacionada:** Plan de comunicación
- **Owner:** Project Manager
- **Roles participantes:** Project Manager
- **Momento de utilización:** Planificación
- **Contenido esperado:** Stakeholders, canales, frecuencias, responsables
- **Control relacionado:** CTRL-CORP-003
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "Plan de comunicación" listado como actividad obligatoria
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 21
- **Observaciones:** Crítico para coordinación de stakeholders

### 2.5 ART-CORP-005: Línea Base del Proyecto
- **ID:** ART-CORP-005
- **Nombre oficial:** Línea Base del Proyecto
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Referencia aprobada para control del proyecto
- **Objetivo:** Establecer baseline consolidada para seguimiento y control
- **Tipo:** DOCUMENTO
- **Fase ID:** PHA-CORP-003
- **Fase:** Planificación del Proyecto
- **Proceso ID:** PROC-CORP-003
- **Proceso:** Planificación del Proyecto
- **Owner:** Project Manager
- **Roles participantes:** Project Manager, Cloud Team, Líder JP
- **Momento de utilización:** Final de planificación
- **Trigger:** Planificación completada
- **Outputs:** Línea base aprobada
- **Control relacionado:** CTRL-CORP-003
- **Gate relacionado:** Aprobación planificación
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "línea base aprobada para control del proyecto"
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 22
- **Observaciones:** Resultado consolidado de planificación
### 2.6 ART-CORP-006: Documentación Técnica Final
- **ID:** ART-CORP-006
- **Nombre oficial:** Documentación Técnica Final
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Documentación técnica completa de la implementación
- **Objetivo:** Documentar implementación técnica realizada
- **Tipo:** DOCUMENTO
- **Fase ID:** PHA-CORP-008
- **Fase:** Cierre del Proyecto
- **Proceso ID:** PROC-CORP-008
- **Proceso:** Cierre del Proyecto
- **Owner:** Cloud Team
- **Roles participantes:** Cloud Team, Project Manager
- **Momento de utilización:** Cierre del proyecto
- **Control relacionado:** CTRL-CORP-006
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** Listado explícitamente en actividades de cierre
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 24
- **Observaciones:** Documento técnico de cierre

### 2.7 ART-CORP-007: Arquitectura Implementada
- **ID:** ART-CORP-007
- **Nombre oficial:** Arquitectura Implementada
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Documentación de la arquitectura final implementada
- **Objetivo:** Registrar arquitectura real implementada en el proyecto
- **Tipo:** DOCUMENTO
- **Fase ID:** PHA-CORP-008
- **Fase:** Cierre del Proyecto
- **Proceso ID:** PROC-CORP-008
- **Proceso:** Cierre del Proyecto
- **Owner:** Cloud Team
- **Roles participantes:** Cloud Team
- **Momento de utilización:** Cierre del proyecto
- **Control relacionado:** CTRL-CORP-006
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** Listado explícitamente en actividades de cierre
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 24
- **Observaciones:** Arquitectura as-built del proyecto
### 2.8 ART-CORP-008: Manuales Operativos
- **ID:** ART-CORP-008
- **Nombre oficial:** Manuales Operativos
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Documentación operativa de la solución implementada
- **Objetivo:** Guiar la operación de la solución implementada
- **Tipo:** DOCUMENTO
- **Fase ID:** PHA-CORP-008
- **Fase:** Cierre del Proyecto
- **Proceso ID:** PROC-CORP-008
- **Proceso:** Cierre del Proyecto
- **Owner:** Cloud Team
- **Roles participantes:** Cloud Team
- **Momento de utilización:** Cierre del proyecto
- **Control relacionado:** CTRL-CORP-006
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** Listado explícitamente en actividades de cierre
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 24
- **Observaciones:** Manuales para operación post-implementación

### 2.9 ART-CORP-009: Presentación Ejecutiva
- **ID:** ART-CORP-009
- **Nombre oficial:** Presentación Ejecutiva
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Presentación de resultados ejecutivos del proyecto
- **Objetivo:** Comunicar resultados y valor generado a nivel ejecutivo
- **Tipo:** PRESENTACIÓN
- **Fase ID:** PHA-CORP-008
- **Fase:** Cierre del Proyecto
- **Proceso ID:** PROC-CORP-008
- **Proceso:** Cierre del Proyecto
- **Owner:** Project Manager
- **Roles participantes:** Project Manager
- **Momento de utilización:** Cierre del proyecto
- **Control relacionado:** CTRL-CORP-006
- **Herramienta relacionada:** Google Slides
- **Formato documentado:** NO DETERMINADO (implícito: PPTX)
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** Listado explícitamente en actividades de cierre
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 24
- **Observaciones:** Presentación de cierre ejecutivo
### 2.10 ART-CORP-010: Lecciones Aprendidas
- **ID:** ART-CORP-010
- **Nombre oficial:** Lecciones Aprendidas
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Registro de aprendizajes para mejora continua
- **Objetivo:** Capturar conocimiento y aprendizajes para proyectos futuros
- **Tipo:** REGISTRO
- **Fase ID:** PHA-CORP-008
- **Fase:** Cierre del Proyecto
- **Proceso ID:** PROC-CORP-008
- **Proceso:** Cierre del Proyecto
- **Owner:** Project Manager
- **Roles participantes:** Project Manager, Cloud Team
- **Momento de utilización:** Cierre del proyecto
- **Control relacionado:** CTRL-CORP-006
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** Listado explícitamente en actividades de cierre
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 24
- **Observaciones:** Crítico para mejora continua organizacional

### 2.11 ART-CORP-011: IDD - Implementation Design Document
- **ID:** ART-CORP-011
- **Nombre oficial:** IDD - Implementation Design Document
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Documento de diseño de implementación
- **Objetivo:** NO DETERMINADO
- **Tipo:** DOCUMENTO
- **Fase ID:** NO DETERMINADO
- **Owner:** Cloud Team
- **Roles participantes:** Cloud Team
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** NO DETERMINADO
- **Frecuencia:** NO DETERMINADO
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 11
- **Observaciones:** GAP - Mencionado pero no definido en detalle

### 2.12 ART-CORP-012: Proyecto Base en Asana
- **ID:** ART-CORP-012
- **Nombre oficial:** Proyecto Base en Asana
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Plantilla inicial para estructura operativa del proyecto
- **Objetivo:** Establecer base de gobernanza y control en Asana
- **Tipo:** TABLERO
- **Fase ID:** PHA-CORP-001 (creación), PHA-CORP-004 (configuración)
- **Proceso ID:** PROC-CORP-001, PROC-CORP-004
- **Owner:** PMO (creación), Project Manager (configuración)
- **Momento de utilización:** PMO Intake (creación), Configuración Operativa (uso)
- **Contenido esperado:** Estructura base, metadata administrativa
- **Herramienta relacionada:** Asana
- **Formato documentado:** Asana (plataforma)
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "Creación del proyecto" en actividades obligatorias
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 28-29
- **Observaciones:** Artefacto específico de herramienta Asana
### 2.13 ART-CORP-013: Estructura por Fases en Asana
- **ID:** ART-CORP-013
- **Nombre oficial:** Estructura por Fases
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Organización del proyecto reflejando ciclo de vida del Framework
- **Objetivo:** Mantener consistencia entre proyectos en Asana
- **Tipo:** TABLERO
- **Fase ID:** PHA-CORP-004
- **Proceso ID:** PROC-CORP-004
- **Owner:** Project Manager
- **Momento de utilización:** Configuración Operativa
- **Contenido esperado:** Secciones: Inicio, Planificación, Ejecución, Monitoreo y Control, Cierre
- **Herramienta relacionada:** Asana
- **Formato documentado:** Asana (secciones)
- **Obligatoriedad:** RECOMENDADO
- **Evidencia obligatoriedad:** "secciones recomendadas"
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 29
- **Observaciones:** Estructura recomendada, no obligatoria

### 2.14 ART-CORP-014: Planificación Operativa en Asana
- **ID:** ART-CORP-014
- **Nombre oficial:** Planificación Operativa
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Conversión de WBS y cronograma en tareas ejecutables
- **Objetivo:** Transformar planificación en estructura operativa
- **Tipo:** TABLERO
- **Fase ID:** PHA-CORP-004
- **Proceso ID:** PROC-CORP-004
- **Owner:** Project Manager
- **Momento de utilización:** Configuración Operativa
- **Contenido esperado:**
  - Tareas y subtareas
  - Responsables asignados
  - Fechas de inicio y término
  - Dependencias configuradas
  - Horas estimadas
  - Organización por fases
- **Herramienta relacionada:** Asana
- **Formato documentado:** Asana (tareas)
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** Proceso de "conversión del WBS en tareas" es obligatorio
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 29-30
- **Observaciones:** Núcleo operativo de la gestión en Asana
### 2.15 ART-CORP-015: Milestones (Hitos) en Asana
- **ID:** ART-CORP-015
- **Nombre oficial:** Milestones - Hitos Contractuales
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Hitos contractuales o eventos relevantes configurados como Milestones
- **Objetivo:** Representar compromisos contractuales y fechas críticas
- **Tipo:** REGISTRO
- **Fase ID:** PHA-CORP-004 (configuración), PHA-CORP-005 (seguimiento)
- **Proceso ID:** PROC-CORP-004, PROC-CORP-006
- **Owner:** Project Manager
- **Momento de utilización:** Configuración y seguimiento
- **Contenido esperado:**
  - Entregables clave
  - Validaciones cliente
  - Compromisos contractuales
  - Fechas críticas del proyecto
- **Herramienta relacionada:** Asana
- **Formato documentado:** Asana (milestones)
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "hitos contractuales" son obligatorios
- **Frecuencia:** Según cronograma
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 31
- **Observaciones:** Relacionados con tareas críticas y criterios de aceptación

### 2.16 ART-CORP-016: Dashboards y Vistas Operativas
- **ID:** ART-CORP-016
- **Nombre oficial:** Dashboards y Vistas Operativas
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Dashboards y vistas para supervisión transversal
- **Objetivo:** Facilitar monitoreo del portafolio y proyectos individuales
- **Tipo:** TABLERO
- **Fase ID:** PHA-CORP-004 (configuración), PHA-CORP-006 (uso)
- **Proceso ID:** PROC-CORP-004, PROC-CORP-006
- **Owner:** Project Manager
- **Roles participantes:** Project Manager, Líder JP, PMO
- **Momento de utilización:** Configuración y monitoreo continuo
- **Contenido esperado:**
  - Progreso general
  - Estado de hitos
  - Tareas atrasadas
  - Distribución de carga
  - Riesgos y bloqueos
- **Herramienta relacionada:** Asana
- **Formato documentado:** Asana (dashboards)
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "Activación de dashboards" listado como actividad obligatoria
- **Frecuencia:** Continua
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 32
- **Observaciones:** Utilizado por múltiples niveles organizacionales
### 2.17 ART-CORP-017: SOW - Statement of Work
- **ID:** ART-CORP-017
- **Nombre oficial:** SOW - Statement of Work
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Definición contractual del alcance
- **Objetivo:** Establecer alcance contractual del proyecto
- **Tipo:** DOCUMENTO
- **Fase ID:** PHA-CORP-001
- **Proceso ID:** PROC-CORP-001
- **Owner:** Comercial (creación), PMO (validación)
- **Momento de utilización:** PMO Intake
- **Trigger:** Aprobación comercial
- **Control relacionado:** CTRL-CORP-001, CTRL-CORP-002
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "Recepción SOW/Contrato" en flujo obligatorio
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 33
- **Observaciones:** Documento contractual base

### 2.18 ART-CORP-018: NDA - Non-Disclosure Agreement
- **ID:** ART-CORP-018
- **Nombre oficial:** NDA - Acuerdo de Confidencialidad
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Acuerdo de protección de información confidencial
- **Objetivo:** Proteger información confidencial del proyecto
- **Tipo:** DOCUMENTO
- **Fase ID:** PHA-CORP-001
- **Proceso ID:** PROC-CORP-001
- **Owner:** PMO
- **Momento de utilización:** PMO Intake
- **Control relacionado:** CTRL-CORP-001
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OPCIONAL
- **Evidencia obligatoriedad:** "Recepción NDA (si aplica)" - condicional
- **Frecuencia:** Por proyecto (si aplica)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 33
- **Observaciones:** Condicional según requerimientos del cliente

### 2.19 ART-CORP-019: Baseline (Flujo Detallado)
- **ID:** ART-CORP-019
- **Nombre oficial:** Baseline
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Línea base consolidada para control
- **Objetivo:** Referencia para control del proyecto
- **Tipo:** DOCUMENTO
- **Fase ID:** PHA-CORP-003
- **Proceso ID:** PROC-CORP-003
- **Owner:** Project Manager
- **Momento de utilización:** Final de planificación
- **Control relacionado:** CTRL-CORP-003
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "Construcción baseline" en flujo detallado
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 34
- **Observaciones:** Mismo concepto que ART-CORP-005 pero en flujo detallado
### 2.20 ART-CORP-020: Matriz de Escalamiento
- **ID:** ART-CORP-020
- **Nombre oficial:** Matriz de Escalamiento
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Definición de proceso de escalamiento de riesgos y decisiones
- **Objetivo:** Establecer protocolo de escalamiento organizacional
- **Tipo:** MATRIZ
- **Fase ID:** PHA-CORP-003
- **Proceso ID:** PROC-CORP-003
- **Actividad relacionada:** Definición matriz escalamiento
- **Owner:** Project Manager
- **Momento de utilización:** Planificación
- **Control relacionado:** CTRL-CORP-003
- **Formato documentado:** NO DETERMINADO (implícito: tabular)
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "Definición matriz escalamiento" en flujo detallado
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 34
- **Observaciones:** Crítico para gestión de riesgos y decisiones

### 2.21 ART-CORP-021: Agenda Kickoff
- **ID:** ART-CORP-021
- **Nombre oficial:** Agenda Kickoff
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Estructura para reunión de inicio formal con cliente
- **Objetivo:** Organizar reunión de kickoff del proyecto
- **Tipo:** DOCUMENTO
- **Fase ID:** PHA-CORP-005
- **Proceso ID:** PROC-CORP-005
- **Owner:** Project Manager
- **Momento de utilización:** Pre-Kickoff/Kickoff
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "Revisión agenda Kickoff" en flujo detallado
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 35
- **Observaciones:** Preparación para reunión crítica con cliente

### 2.22 ART-CORP-022: Reportería Semanal
- **ID:** ART-CORP-022
- **Nombre oficial:** Reportería Semanal
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Reporte periódico de avance y estado del proyecto
- **Objetivo:** Comunicar estado y avance del proyecto semanalmente
- **Tipo:** REPORTE
- **Fase ID:** PHA-CORP-006
- **Proceso ID:** PROC-CORP-006
- **Owner:** Project Manager
- **Momento de utilización:** Durante ejecución (semanal)
- **Control relacionado:** CTRL-CORP-004
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "Reportería semanal" en flujo de monitoreo
- **Frecuencia:** Semanal
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 35
- **Observaciones:** Artefacto recurrente de comunicación
### 2.23 ART-CORP-023: Gestión de Cambios (CPP)
- **ID:** ART-CORP-023
- **Nombre oficial:** Gestión de Cambios - CPP
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Gestión de cambios del proyecto
- **Objetivo:** NO DETERMINADO (CPP no especificado)
- **Tipo:** REGISTRO
- **Fase ID:** PHA-CORP-006
- **Proceso ID:** PROC-CORP-006
- **Owner:** Project Manager
- **Momento de utilización:** Durante ejecución
- **Control relacionado:** CTRL-CORP-004
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** NO DETERMINADO
- **Frecuencia:** Según cambios
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 35
- **Observaciones:** GAP - CPP mencionado pero no definido

### 2.24 ART-CORP-024: Evidencias
- **ID:** ART-CORP-024
- **Nombre oficial:** Evidencias del Proyecto
- **Framework:** Framework Corporativo v3.1
- **Versión Framework:** 3.1
- **Descripción:** Evidencias de cumplimiento y entrega
- **Objetivo:** Documentar evidencias del proyecto completado
- **Tipo:** DOCUMENTO
- **Fase ID:** PHA-CORP-008
- **Proceso ID:** PROC-CORP-008
- **Owner:** Cloud Team
- **Momento de utilización:** Cierre del proyecto
- **Control relacionado:** CTRL-CORP-006
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "Evidencias" listado en flujo de cierre
- **Frecuencia:** Por proyecto (una vez)
- **Fuente documental:** Framework Corporativo v3.1
- **Página:** 36
- **Observaciones:** Evidencias de entregables y cumplimiento

## 3. CATÁLOGO MAESTRO - FRAMEWORK ÁGIL

### 3.1 ART-AGL-001: Backlog del Proyecto
- **ID:** ART-AGL-001
- **Nombre oficial:** Backlog del Proyecto
- **Framework:** Framework Ágil v1
- **Versión Framework:** V1
- **Descripción:** Lista priorizada de requerimientos y tareas del proyecto
- **Objetivo:** Gestionar y priorizar trabajo del equipo ágil
- **Tipo:** BACKLOG
- **Fase ID:** PHA-AGL-003 (creación), PHA-AGL-004/005 (uso/ajuste)
- **Proceso ID:** PROC-AGL-003, PROC-AGL-005
- **Owner:** Project Manager
- **Roles participantes:** Project Manager, Product Owner Cliente (si aplica), Cloud Team
- **Momento de utilización:** Sprint Planning y ajustes continuos
- **Contenido esperado:** Requerimientos priorizados, tareas asignadas
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "Construcción backlog" es actividad principal
- **Frecuencia:** Recurrente (por sprint)
- **Fuente documental:** Framework Ágil v1
- **Sección:** 7.3, 7.5
- **Observaciones:** Artefacto central del modelo ágil
### 3.2 ART-AGL-002: Entregables Técnicos
- **ID:** ART-AGL-002
- **Nombre oficial:** Entregables Técnicos
- **Framework:** Framework Ágil v1
- **Versión Framework:** V1
- **Descripción:** Resultados técnicos de la iniciativa ágil
- **Objetivo:** Materializar valor técnico de la iniciativa
- **Tipo:** DOCUMENTO
- **Fase ID:** PHA-AGL-004 (generación), PHA-AGL-006 (validación final)
- **Proceso ID:** PROC-AGL-004, PROC-AGL-006
- **Owner:** Cloud Team
- **Roles participantes:** Cloud Team, Project Manager
- **Momento de utilización:** Ejecución iterativa y cierre
- **Control relacionado:** Validación técnica
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "Generar entregables técnicos" es responsabilidad del Cloud Team
- **Frecuencia:** Por iteración
- **Fuente documental:** Framework Ágil v1
- **Sección:** 6.4, 7.4, 7.6
- **Observaciones:** Entregables incrementales del trabajo técnico

### 3.3 ART-AGL-003: Presentación Ejecutiva de Cierre
- **ID:** ART-AGL-003
- **Nombre oficial:** Presentación Ejecutiva de Cierre
- **Framework:** Framework Ágil v1
- **Versión Framework:** V1
- **Descripción:** Presentación de resultados ejecutivos de la iniciativa ágil
- **Objetivo:** Comunicar resultados y valor de la iniciativa ágil
- **Tipo:** PRESENTACIÓN
- **Fase ID:** PHA-AGL-006
- **Proceso ID:** PROC-AGL-006
- **Owner:** Project Manager
- **Momento de utilización:** Cierre ágil
- **Formato documentado:** NO DETERMINADO (implícito: PPTX)
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "Presentación ejecutiva de cierre" listada en actividades
- **Frecuencia:** Por iniciativa (una vez)
- **Fuente documental:** Framework Ágil v1
- **Sección:** 7.6
- **Observaciones:** Equivalente ágil de presentación corporativa

### 3.4 ART-AGL-004: Lecciones Aprendidas Ágiles
- **ID:** ART-AGL-004
- **Nombre oficial:** Lecciones Aprendidas Ágiles
- **Framework:** Framework Ágil v1
- **Versión Framework:** V1
- **Descripción:** Aprendizajes y mejoras para iteraciones futuras
- **Objetivo:** Capturar aprendizajes específicos del modelo ágil
- **Tipo:** REGISTRO
- **Fase ID:** PHA-AGL-006
- **Proceso ID:** PROC-AGL-006
- **Owner:** Project Manager
- **Roles participantes:** Project Manager, Cloud Team
- **Momento de utilización:** Cierre ágil
- **Contenido esperado:** Mejoras identificadas, iniciativas futuras
- **Formato documentado:** NO DETERMINADO
- **Obligatoriedad:** OBLIGATORIO
- **Evidencia obligatoriedad:** "Lecciones aprendidas" listadas en actividades de cierre
- **Frecuencia:** Por iniciativa (una vez)
- **Fuente documental:** Framework Ágil v1
- **Sección:** 7.6
- **Observaciones:** Enfoque en mejora continua ágil
## 4. DUPLICIDADES IDENTIFICADAS

### 4.1 Análisis de Duplicidades

**DUP-ART-001: Línea Base vs Baseline**
- **Artefacto A:** ART-CORP-005 (Línea Base del Proyecto)
- **Artefacto B:** ART-CORP-019 (Baseline - Flujo Detallado)
- **Framework:** Framework Corporativo v3.1
- **Relación:** EQUIVALENTE
- **Motivo:** Mismo concepto referenciado en diferentes secciones del documento
- **Referencia:** Página 22 vs Página 34
- **Recomendación:** Consolidar en ART-CORP-005, eliminar ART-CORP-019

### 4.2 Resultado Final
- **Duplicidades encontradas:** 1
- **Artefactos únicos reales:** 27 (después de eliminar duplicidad)

## 5. ARTEFACTOS CORPORATIVO VS ÁGIL

### 5.1 Matriz de Equivalencias

| Artefacto Corporativo | Artefacto Ágil | Relación | Diferencias | Observación |
|----------------------|-----------------|----------|-------------|-------------|
| ART-CORP-009 (Presentación Ejecutiva) | ART-AGL-003 (Presentación Ejecutiva Cierre) | EQUIVALENTE | Corporativo más formal | Mismo propósito comunicativo |
| ART-CORP-010 (Lecciones Aprendidas) | ART-AGL-004 (Lecciones Aprendidas Ágiles) | PARCIALMENTE EQUIVALENTE | Ágil enfocado en iteraciones | Ambos para mejora continua |
| ART-CORP-006/007 (Documentación/Arquitectura) | ART-AGL-002 (Entregables Técnicos) | PARCIALMENTE EQUIVALENTE | Corporativo más estructurado | Documentación técnica |

### 5.2 Artefactos Exclusivos

#### **Exclusivos Framework Corporativo (21 artefactos):**
- Información Base del Proyecto
- WBS, Cronograma, Plan de Comunicación
- Matriz de Escalamiento
- SOW, NDA
- Configuración completa Asana
- Reportería Semanal
- Manuales Operativos
- Evidencias

#### **Exclusivos Framework Ágil (1 artefacto):**
- ART-AGL-001 (Backlog del Proyecto)

## 6. ARTEFACTOS SIN DEFINICIÓN SUFICIENTE

### 6.1 Gaps Identificados

**GAP-ART-001: IDD - Implementation Design Document**
- **ID:** ART-CORP-011
- **Problema:** Mencionado pero no descrito
- **Información faltante:** Objetivo, contenido, momento de uso, obligatoriedad
- **Fuente:** Página 11

**GAP-ART-002: Gestión de Cambios (CPP)**
- **ID:** ART-CORP-023
- **Problema:** CPP no definido
- **Información faltante:** Qué es CPP, proceso, formato, contenido
- **Fuente:** Página 35

**GAP-ART-003: Reportería Framework Ágil**
- **Problema:** No se especifica reportería en modelo ágil
- **Información faltante:** Cómo se comunica avance en iniciativas ágiles

**GAP-ART-004: Herramientas Framework Ágil**
- **Problema:** No se especifican herramientas para gestión ágil
- **Información faltante:** Herramientas para backlog, demos, colaboración
## 7. CANDIDATOS A PLANTILLA

### 7.1 Evaluación de Plantillas

| Prioridad | ART-ID | Artefacto | Framework | Fase | Formato Oficial | Formato Propuesto | Nomenclatura Propuesta | Razón | Reutilización |
|-----------|--------|-----------|-----------|------|-----------------|-------------------|----------------------|-------|---------------|
| P0 | ART-CORP-001 | Información Base del Proyecto | Corporativo | PMO Intake | NO DETERMINADO | DOCX | MO-PMO-TPL-InfoBaseProyecto-v1.0.docx | Crítico para entrada | ALTA |
| P0 | ART-CORP-002 | WBS | Corporativo | Planificación | NO DETERMINADO | XLSX | MO-PMO-TPL-WBS-v1.0.xlsx | Base de planificación | ALTA |
| P0 | ART-CORP-003 | Cronograma | Corporativo | Planificación | NO DETERMINADO | XLSX/MPP | MO-PMO-TPL-Cronograma-v1.0.xlsx | Planificación temporal | ALTA |
| P0 | ART-CORP-004 | Plan de Comunicación | Corporativo | Planificación | NO DETERMINADO | DOCX | MO-PMO-TPL-PlanComunicacion-v1.0.docx | Gestión stakeholders | ALTA |
| P0 | ART-CORP-020 | Matriz de Escalamiento | Corporativo | Planificación | NO DETERMINADO | XLSX | MO-PMO-TPL-MatrizEscalamiento-v1.0.xlsx | Governance crítica | ALTA |
| P0 | ART-CORP-022 | Reportería Semanal | Corporativo | Monitoreo | NO DETERMINADO | DOCX/PPTX | MO-PMO-TPL-ReporteSemanal-v1.0.docx | Comunicación recurrente | ALTA |
| P0 | ART-CORP-009 | Presentación Ejecutiva | Corporativo | Cierre | PPTX | PPTX | MO-PMO-TPL-PresentacionEjecutiva-v1.0.pptx | Comunicación ejecutiva | ALTA |
| P0 | ART-AGL-001 | Backlog del Proyecto | Ágil | Sprint Planning | NO DETERMINADO | XLSX | MO-PMO-TPL-BacklogAgil-v1.0.xlsx | Núcleo metodología ágil | ALTA |
| P1 | ART-CORP-010 | Lecciones Aprendidas | Corporativo | Cierre | NO DETERMINADO | DOCX | MO-PMO-TPL-LeccionesAprendidas-v1.0.docx | Mejora continua | MEDIA |
| P1 | ART-CORP-021 | Agenda Kickoff | Corporativo | Ejecución | NO DETERMINADO | DOCX | MO-PMO-TPL-AgendaKickoff-v1.0.docx | Reunión crítica | MEDIA |
| P1 | ART-AGL-003 | Presentación Ejecutiva Cierre | Ágil | Cierre | PPTX | PPTX | MO-PMO-TPL-PresentacionCierreAgil-v1.0.pptx | Comunicación ágil | MEDIA |
| P1 | ART-AGL-004 | Lecciones Aprendidas Ágiles | Ágil | Cierre | NO DETERMINADO | DOCX | MO-PMO-TPL-LeccionesAgilesv1.0.docx | Mejora ágil | MEDIA |
| P2 | ART-CORP-006 | Documentación Técnica Final | Corporativo | Cierre | NO DETERMINADO | DOCX | MO-PMO-TPL-DocTecnicaFinal-v1.0.docx | Cierre técnico | BAJA |
| P2 | ART-CORP-007 | Arquitectura Implementada | Corporativo | Cierre | NO DETERMINADO | DOCX | MO-PMO-TPL-ArquitecturaImpl-v1.0.docx | Documentación técnica | BAJA |
| P2 | ART-CORP-008 | Manuales Operativos | Corporativo | Cierre | NO DETERMINADO | DOCX | MO-PMO-TPL-ManualesOp-v1.0.docx | Transferencia operativa | BAJA |
| P3 | ART-CORP-017 | SOW | Corporativo | Intake | NO DETERMINADO | DOCX | MO-PMO-TPL-SOW-v1.0.docx | Documento comercial | BAJA |
| P3 | ART-CORP-018 | NDA | Corporativo | Intake | NO DETERMINADO | DOCX | MO-PMO-TPL-NDA-v1.0.docx | Documento legal | BAJA |

**Total candidatos a plantilla:** 17 de 27 artefactos (63%)

### 7.2 Artefactos NO Candidatos a Plantilla
- **ART-CORP-012 a ART-CORP-016:** Específicos de Asana (configuración de plataforma)
- **ART-CORP-024:** Evidencias (específicas por proyecto)
- **ART-AGL-002:** Entregables Técnicos (específicos por tecnología)

## 8. CANDIDATOS A GENERADOR ONLINE

### 8.1 Evaluación de Generadores Online

| Prioridad | ART-ID | Artefacto | Tipo | Caso de Uso | Inputs Principales | Cálculos | Validaciones | Exportación | Complejidad | Valor PM |
|-----------|--------|-----------|------|-------------|-------------------|----------|--------------|-------------|-------------|----------|
| P0 | ART-CORP-020 | Matriz de Escalamiento | MATRIZ | Definir escalamiento | Roles, niveles, criterios | Automático | Roles válidos | XLSX/PDF | BAJA | ALTA |
| P0 | ART-CORP-022 | Reportería Semanal | REPORTE | Status semanal | Hitos, riesgos, avance % | Progress tracking | Fechas, % válidos | DOCX/PDF | MEDIA | ALTA |
| P0 | ART-AGL-001 | Backlog del Proyecto | BACKLOG | Gestión ágil | User stories, prioridades | Puntos, velocidad | Prioridades únicas | XLSX | MEDIA | ALTA |
| P1 | ART-CORP-001 | Información Base Proyecto | FORMULARIO | Intake validation | Datos proyecto básicos | Automatización campos | Campos obligatorios | DOCX/PDF | MEDIA | MEDIA |
| P1 | ART-CORP-004 | Plan de Comunicación | PLAN | Gestión stakeholders | Stakeholders, frecuencias | Calendario comunicación | Frecuencias válidas | DOCX | MEDIA | MEDIA |
| P1 | ART-CORP-010 | Lecciones Aprendidas | REGISTRO | Captura aprendizajes | Categorías, impactos | Clasificación automática | Campos requeridos | DOCX | BAJA | MEDIA |
| P2 | ART-CORP-002 | WBS | MATRIZ | Estructura trabajo | Paquetes, niveles | Numeración automática | Jerarquía válida | XLSX | ALTA | MEDIA |
| P2 | ART-CORP-003 | Cronograma | CRONOGRAMA | Planificación temporal | Actividades, duraciones | Fechas, dependencias | Lógica temporal | XLSX/MPP | ALTA | ALTA |
| P2 | ART-CORP-021 | Agenda Kickoff | FORMULARIO | Preparación reunión | Participantes, temas | Tiempo estimado | Agenda completa | DOCX | BAJA | BAJA |
| P3 | ART-AGL-004 | Lecciones Aprendidas Ágiles | REGISTRO | Retrospectivas | Iteraciones, mejoras | Tendencias | Completitud | DOCX | BAJA | BAJA |

**Total candidatos a generador online:** 10 de 27 artefactos (37%)

### 8.2 Generadores NO Viables
- **Documentos narrativos complejos:** Documentación técnica, manuales
- **Artefactos específicos plataforma:** Configuraciones Asana
- **Documentos legales/contractuales:** SOW, NDA
- **Entregables técnicos:** Específicos por tecnología
## 9. CATÁLOGO PARA EL PORTAL

### 9.1 Vista Consolidada para PMO Framework Hub

| ID | Nombre | Descripción Corta | Framework | Fase | Proceso | Tipo | Formato | Owner | Obligatoriedad | Tiene Plantilla | Tiene Generador | Exportación | Referencia |
|----|--------|-------------------|-----------|------|---------|------|---------|-------|---------------|----------------|----------------|-------------|------------|
| ART-CORP-001 | Información Base del Proyecto | Datos mínimos para validar proyecto | Corporativo | PMO Intake | PMO Intake | FORMULARIO | DOCX | PMO | OBLIGATORIO | SÍ | SÍ | DOCX/PDF | Pág. 19-20 |
| ART-CORP-002 | WBS | Estructura jerárquica del trabajo | Corporativo | Planificación | Planificación | DOCUMENTO | XLSX | PM | OBLIGATORIO | SÍ | SÍ | XLSX | Pág. 21 |
| ART-CORP-003 | Cronograma | Secuencia temporal de actividades | Corporativo | Planificación | Planificación | CRONOGRAMA | XLSX/MPP | PM | OBLIGATORIO | SÍ | SÍ | XLSX/MPP | Pág. 21 |
| ART-CORP-004 | Plan de Comunicación | Estrategia comunicación stakeholders | Corporativo | Planificación | Planificación | PLAN | DOCX | PM | OBLIGATORIO | SÍ | SÍ | DOCX | Pág. 21 |
| ART-CORP-005 | Línea Base del Proyecto | Referencia aprobada para control | Corporativo | Planificación | Planificación | DOCUMENTO | - | PM | OBLIGATORIO | NO | NO | - | Pág. 22 |
| ART-CORP-006 | Documentación Técnica Final | Documentación implementación | Corporativo | Cierre | Cierre | DOCUMENTO | DOCX | Cloud Team | OBLIGATORIO | SÍ | NO | DOCX | Pág. 24 |
| ART-CORP-007 | Arquitectura Implementada | Documentación arquitectura final | Corporativo | Cierre | Cierre | DOCUMENTO | DOCX | Cloud Team | OBLIGATORIO | SÍ | NO | DOCX | Pág. 24 |
| ART-CORP-008 | Manuales Operativos | Guías operación solución | Corporativo | Cierre | Cierre | DOCUMENTO | DOCX | Cloud Team | OBLIGATORIO | SÍ | NO | DOCX | Pág. 24 |
| ART-CORP-009 | Presentación Ejecutiva | Resultados ejecutivos proyecto | Corporativo | Cierre | Cierre | PRESENTACIÓN | PPTX | PM | OBLIGATORIO | SÍ | NO | PPTX | Pág. 24 |
| ART-CORP-010 | Lecciones Aprendidas | Aprendizajes mejora continua | Corporativo | Cierre | Cierre | REGISTRO | DOCX | PM | OBLIGATORIO | SÍ | SÍ | DOCX | Pág. 24 |
| ART-CORP-011 | IDD | Documento diseño implementación | Corporativo | - | - | DOCUMENTO | - | Cloud Team | NO DETERMINADO | NO | NO | - | Pág. 11 |
| ART-CORP-017 | SOW | Definición contractual alcance | Corporativo | PMO Intake | PMO Intake | DOCUMENTO | DOCX | Comercial | OBLIGATORIO | SÍ | NO | DOCX | Pág. 33 |
| ART-CORP-018 | NDA | Acuerdo confidencialidad | Corporativo | PMO Intake | PMO Intake | DOCUMENTO | DOCX | PMO | OPCIONAL | SÍ | NO | DOCX | Pág. 33 |
| ART-CORP-020 | Matriz de Escalamiento | Protocolo escalamiento decisiones | Corporativo | Planificación | Planificación | MATRIZ | XLSX | PM | OBLIGATORIO | SÍ | SÍ | XLSX/PDF | Pág. 34 |
| ART-CORP-021 | Agenda Kickoff | Estructura reunión inicio | Corporativo | Ejecución | Ejecución | DOCUMENTO | DOCX | PM | OBLIGATORIO | SÍ | SÍ | DOCX | Pág. 35 |
| ART-CORP-022 | Reportería Semanal | Estado semanal proyecto | Corporativo | Monitoreo | Monitoreo | REPORTE | DOCX | PM | OBLIGATORIO | SÍ | SÍ | DOCX/PDF | Pág. 35 |
| ART-CORP-023 | Gestión de Cambios | Gestión cambios proyecto | Corporativo | Monitoreo | Monitoreo | REGISTRO | - | PM | NO DETERMINADO | NO | NO | - | Pág. 35 |
| ART-CORP-024 | Evidencias | Evidencias cumplimiento proyecto | Corporativo | Cierre | Cierre | DOCUMENTO | - | Cloud Team | OBLIGATORIO | NO | NO | - | Pág. 36 |
| ART-AGL-001 | Backlog del Proyecto | Lista priorizada requerimientos | Ágil | Sprint Planning | Sprint Planning | BACKLOG | XLSX | PM | OBLIGATORIO | SÍ | SÍ | XLSX | Secc. 7.3 |
| ART-AGL-002 | Entregables Técnicos | Resultados técnicos iniciativa | Ágil | Ejecución | Ejecución Iterativa | DOCUMENTO | - | Cloud Team | OBLIGATORIO | NO | NO | - | Secc. 7.4 |
| ART-AGL-003 | Presentación Ejecutiva Cierre | Resultados ejecutivos ágil | Ágil | Cierre | Cierre Ágil | PRESENTACIÓN | PPTX | PM | OBLIGATORIO | SÍ | NO | PPTX | Secc. 7.6 |
| ART-AGL-004 | Lecciones Aprendidas Ágiles | Aprendizajes iteraciones ágiles | Ágil | Cierre | Cierre Ágil | REGISTRO | DOCX | PM | OBLIGATORIO | SÍ | SÍ | DOCX | Secc. 7.6 |

**Nota:** Excluidos artefactos específicos de Asana (ART-CORP-012 a ART-CORP-016) por ser configuraciones de plataforma.
## 10. ESTADÍSTICAS FINALES

### 10.1 Inventario por Framework
- **Framework Corporativo v3.1:** 24 artefactos (incluyendo 5 específicos Asana)
- **Framework Ágil v1:** 4 artefactos principales
- **Artefactos únicos totales:** 27 (después de eliminar 1 duplicidad)

### 10.2 Análisis de Obligatoriedad
- **Artefactos obligatorios:** 20 (74%)
- **Artefactos recomendados:** 1 (4%)
- **Artefactos opcionales:** 1 (4%)
- **Artefactos sin obligatoriedad definida:** 5 (18%)

### 10.3 Análisis de Formatos
- **Formato documentado:** 2 artefactos (PPTX implícito)
- **Formato no determinado:** 25 artefactos (93%)
- **Formato específico plataforma:** 5 artefactos (Asana)

### 10.4 Candidatos PMO Framework Hub
- **Candidatos a plantilla:** 17 artefactos (63%)
- **Candidatos a generador online:** 10 artefactos (37%)
- **Artefactos P0 (MVP):** 8 artefactos
- **Gaps identificados:** 4 artefactos sin definición suficiente

## 11. INVENTARIO DE ARTEFACTOS — RESUMEN EJECUTIVO

### 11.1 Artefactos Framework Corporativo: 24
- **Críticos:** Información Base, WBS, Cronograma, Línea Base
- **Governance:** Matriz Escalamiento, Reportería Semanal
- **Comunicación:** Plan Comunicación, Presentación Ejecutiva
- **Cierre:** 6 artefactos de documentación y transferencia
- **Asana:** 5 artefactos específicos de configuración

### 11.2 Artefactos Framework Ágil: 4
- **Backlog:** Gestión priorizada de requerimientos
- **Entregables:** Resultados técnicos incrementales
- **Comunicación:** Presentación ejecutiva simplificada
- **Mejora:** Lecciones aprendidas ágiles

### 11.3 Equivalencias: 3 pares
- Presentaciones ejecutivas (corporativo vs ágil)
- Lecciones aprendidas (corporativo vs ágil)  
- Documentación técnica (estructurada vs incremental)

### 11.4 Duplicidades: 1
- Línea Base mencionada en dos secciones del Framework Corporativo

### 11.5 Artefactos P0 (Fundamentales MVP): 8
1. **ART-CORP-001:** Información Base del Proyecto
2. **ART-CORP-002:** WBS
3. **ART-CORP-003:** Cronograma  
4. **ART-CORP-004:** Plan de Comunicación
5. **ART-CORP-020:** Matriz de Escalamiento
6. **ART-CORP-022:** Reportería Semanal
7. **ART-CORP-009:** Presentación Ejecutiva
8. **ART-AGL-001:** Backlog del Proyecto

## 12. TOP 10 ARTEFACTOS PMO

### 12.1 Ranking por Valor Metodológico y Reutilización

1. **🥇 Información Base del Proyecto** - Entrada crítica al framework
2. **🥈 Backlog del Proyecto** - Núcleo metodología ágil
3. **🥉 WBS** - Base estructural de planificación
4. **4️⃣ Cronograma** - Planificación temporal esencial
5. **5️⃣ Matriz de Escalamiento** - Governance crítica
6. **6️⃣ Reportería Semanal** - Comunicación recurrente
7. **7️⃣ Plan de Comunicación** - Gestión stakeholders
8. **8️⃣ Presentación Ejecutiva** - Comunicación ejecutiva
9. **9️⃣ Lecciones Aprendidas** - Mejora continua
10. **🔟 Línea Base del Proyecto** - Control y seguimiento

## 13. PLANTILLAS PRIORITARIAS

### 13.1 P0 - MVP Esencial (8 plantillas)
- ✅ **Información Base del Proyecto** (Formulario entrada)
- ✅ **WBS** (Estructura trabajo)
- ✅ **Cronograma** (Planificación temporal)
- ✅ **Plan de Comunicación** (Gestión stakeholders)
- ✅ **Matriz de Escalamiento** (Governance)
- ✅ **Reportería Semanal** (Status comunicación)
- ✅ **Presentación Ejecutiva** (Cierre formal)
- ✅ **Backlog del Proyecto** (Gestión ágil)

### 13.2 P1 - Alta Prioridad (4 plantillas)
- Lecciones Aprendidas
- Agenda Kickoff  
- Presentación Ejecutiva Cierre Ágil
- Lecciones Aprendidas Ágiles

## 14. GENERADORES ONLINE PRIORITARIOS

### 14.1 P0 - MVP Esencial (3 generadores)
1. **🎯 Matriz de Escalamiento Generator**
   - Input: Roles, niveles, criterios
   - Output: Matriz escalamiento XLSX/PDF
   - Valor: Governance automatizada

2. **📊 Reportería Semanal Generator**  
   - Input: Hitos, riesgos, avance %
   - Output: Reporte estado DOCX/PDF
   - Valor: Status tracking automático

3. **📋 Backlog Manager (Ágil)**
   - Input: User stories, prioridades
   - Output: Backlog priorizado XLSX
   - Valor: Gestión ágil integrada

### 14.2 P1 - Alta Prioridad (2 generadores)
- **Información Base Proyecto:** Formulario intake validación
- **Plan de Comunicación:** Gestión stakeholders automatizada

## 15. DECISIONES REQUERIDAS AL PMO

### 15.1 Definiciones Metodológicas Pendientes
1. **¿Qué es CPP en Gestión de Cambios?** - Definir proceso y formato
2. **¿IDD es obligatorio?** - Clarificar uso del Implementation Design Document
3. **¿Reportería en Framework Ágil?** - Definir comunicación en iniciativas ágiles
4. **¿Herramientas para Framework Ágil?** - Especificar stack tecnológico

### 15.2 Decisiones de Implementación Portal
1. **¿Formatos oficiales?** - Definir DOCX vs XLSX vs PDF por artefacto
2. **¿Nomenclatura plantillas?** - Aprobar patrón MO-PMO-TPL-*
3. **¿Prioridad generadores?** - Confirmar roadmap P0 → P1 → P2
4. **¿Integración Asana?** - Definir exportación desde/hacia Asana

### 15.3 Governance Portal
1. **¿Control de versiones?** - Definir versionado plantillas
2. **¿Aprobación plantillas?** - Proceso validación antes publicación
3. **¿Métricas uso?** - Tracking descargas y generaciones
4. **¿Feedback loop?** - Mecanismo mejora continua plantillas

---

**Estado:** COMPLETO - Inventario consolidado de artefactos  
**Fecha:** $(date)  
**Analista:** Kiro PMO Discovery  
**Próximo paso:** 07-governance-inventory.md

### **🎯 PRÓXIMOS PASOS RECOMENDADOS:**
1. **Validar gaps metodológicos** identificados con stakeholders
2. **Aprobar plantillas P0** para desarrollo MVP
3. **Definir formatos oficiales** por tipo de artefacto  
4. **Proceder con inventario de governance** para completar Discovery

**¿Continuar con paso 7 del Discovery (Governance) o revisar este inventario primero?**
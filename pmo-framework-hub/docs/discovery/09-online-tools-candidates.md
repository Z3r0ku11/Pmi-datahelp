# Candidatos a Herramientas Online

**Fuente:** Inventarios Discovery + Frameworks originales  
**Fecha:** $(date)  
**Analista:** Kiro PMO Discovery  
**Objetivo:** Análisis funcional y priorización de artefactos para herramientas interactivas /tools

## 1. RESUMEN EJECUTIVO

### 1.1 Fuentes Utilizadas
- `/docs/discovery/05-process-inventory.md` (14 procesos)
- `/docs/discovery/06-artifact-inventory.md` (28 artefactos)
- `/docs/discovery/07-governance-inventory.md` (12 controles, 3 gates)
- `/docs/discovery/08-role-inventory.md` (10 roles)
- **Frameworks originales** para validación documental

### 1.2 Estadísticas del Análisis
- **Total artefactos evaluados:** 28 artefactos
- **Candidatos a herramienta online:** 8 candidatos
- **Generadores P0 (MVP):** 4 herramientas
- **Generadores P1:** 2 herramientas
- **Generadores P2:** 2 herramientas
- **Artefactos no candidatos:** 20 (plantillas/documentos)
- **Herramientas READY:** 2
- **Herramientas PARTIALLY READY:** 4
- **Herramientas BLOCKED:** 2
- **Nuevos gaps identificados:** 3

### 1.3 Definiciones Utilizadas

#### A. MANAGEMENT TOOL
Herramientas utilizadas para gestionar proyectos (Asana, Timetracker, GitHub, Google Workspace)

#### B. PMO ONLINE GENERATOR
Herramienta del PMO Framework Hub que permite crear un artefacto

#### C. TEMPLATE
Archivo reutilizable descargable (MO-PMO-TPL-[Artefacto]-v1.0.xlsx)

#### D. ARTIFACT
Objeto metodológico definido en el Framework
## 2. CRITERIOS DE ELEGIBILIDAD

### 2.1 Metodología de Evaluación **[PROPUESTA PORTAL]**

| Criterio | Peso | Descripción |
|----------|------|-------------|
| **E1. Uso recurrente** | 3 | Frecuencia de uso en proyectos |
| **E2. Contenido estructurado** | 3 | Campos claramente definidos |
| **E3. Campos identificables** | 2 | Estructura de datos clara |
| **E4. Reglas de validación** | 2 | Validaciones documentadas |
| **E5. Cálculos automatizables** | 2 | Fórmulas o algoritmos identificados |
| **E6. Valor para Project Manager** | 3 | Beneficio operativo |
| **E7. Relación con Governance** | 2 | Vínculo con controles/gates |
| **E8. Frecuencia de actualización** | 1 | Dinámismo del artefacto |
| **E9. Viabilidad de exportación** | 2 | Posibilidad de generar archivos |
| **E10. Beneficio generación online** | 3 | Ventaja vs plantilla estática |

**Online Suitability Score = Σ (Criterio × Peso) / 23 × 100**

### 2.2 Clasificación de Prioridad **[PROPUESTA PORTAL]**
- **P0 — MVP esencial:** Score ≥ 70 + alta relación governance + uso frecuente
- **P1 — Alta prioridad:** Score 60-69 + valor operativo confirmado
- **P2 — Media prioridad:** Score 50-59 + beneficio moderado
- **P3 — Baja prioridad:** Score < 50 o baja viabilidad

## 3. CATÁLOGO DE CANDIDATOS

### 3.1 TOOL-PMO-001: Información Base del Proyecto (**P0**)
- **Tool ID:** TOOL-PMO-001
- **ART-ID:** ART-CORP-001
- **Nombre:** Información Base del Proyecto
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-001 (PMO Intake)
- **Proceso:** PROC-CORP-001 (PMO Intake)
- **Owner:** PMO (ROL-CORP-001)
- **Descripción:** Formulario estructurado para validación de información mínima del proyecto
- **Caso de uso:** Recepción formal de proyecto post-aprobación comercial
- **Usuario principal:** PMO
- **Frecuencia:** Por proyecto (una vez)
- **Relación Governance:** CTRL-CORP-001 (Validación PMO Intake)
- **Control IDs:** CTRL-CORP-001
- **Gate IDs:** GATE-CORP-001
- **Prioridad:** P0 (MVP esencial)
- **Online Suitability Score:** 78 **[PROPUESTA PORTAL]**
- **Complejidad:** MEDIA
- **Formato de exportación:** JSON → PMO System, PDF para archivo
- **Plantilla asociada:** MO-PMO-TPL-InfoBase-v1.0
- **Fuente:** Framework Corporativo v3.1, pág. 19-20
- **Observaciones:** Entrada crítica al framework, alta estructuración

#### 3.1.1 Campos del Generador
| Field ID | Nombre | Tipo | Requerido | Origen | Validación |
|----------|--------|------|-----------|---------|------------|
| FLD-001 | projectName | TEXT | SÍ | **PROPUESTA PORTAL** | No vacío |
| FLD-002 | projectScope | TEXT | SÍ | **FRAMEWORK** | No vacío |
| FLD-003 | sowDocument | FILE/TEXT | SÍ | **FRAMEWORK** | Archivo o descripción |
| FLD-004 | estimatedCost | NUMBER | SÍ | **FRAMEWORK** | > 0 |
| FLD-005 | estimatedHours | NUMBER | SÍ | **FRAMEWORK** | > 0 |
| FLD-006 | timeline | DATE_RANGE | SÍ | **FRAMEWORK** | Fecha fin > fecha inicio |
| FLD-007 | deliverables | TEXT_ARRAY | SÍ | **FRAMEWORK** | Al menos uno |
| FLD-008 | preliminaryArchitecture | TEXT | NO | **FRAMEWORK** | - |
| FLD-009 | acceptanceCriteria | TEXT | NO | **FRAMEWORK** | - |
| FLD-010 | assumptions | TEXT_ARRAY | NO | **FRAMEWORK** | - |
| FLD-011 | constraints | TEXT_ARRAY | NO | **FRAMEWORK** | - |
| FLD-012 | complexityLevel | SELECT | SÍ | **FRAMEWORK** | BAJA/MEDIA/ALTA |

#### 3.1.2 Validaciones Implementables
- **FRAMEWORK:** Todo proyecto debe tener alcance, costos, horas, plazos y entregables
- **UX:** Formulario muestra progress bar y validación en tiempo real
- **FRAMEWORK:** PMO debe validar información antes de registro

### 3.2 TOOL-PMO-002: Matriz de Riesgos Online (**P0**)
- **Tool ID:** TOOL-PMO-002
- **ART-ID:** ART-CORP-012 (Registro de Riesgos)
- **Nombre:** Matriz de Riesgos Online
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-003 (Planificación) - PHA-CORP-006 (Monitoreo)
- **Proceso:** PROC-CORP-003 (Planificación), PROC-CORP-006 (Monitoreo)
- **Owner:** Project Manager (ROL-CORP-003)
- **Descripción:** Herramienta para identificar, evaluar y gestionar riesgos del proyecto
- **Caso de uso:** Gestión integral de riesgos durante todo el ciclo del proyecto
- **Usuario principal:** Project Manager, Cloud Team
- **Frecuencia:** Continua (actualización semanal)
- **Relación Governance:** CTRL-CORP-004 (Monitoreo y Control)
- **Control IDs:** CTRL-CORP-004
- **Gate IDs:** -
- **Prioridad:** P0 (MVP esencial)
- **Online Suitability Score:** 85 **[PROPUESTA PORTAL]**
- **Complejidad:** ALTA
- **Formato de exportación:** XLSX (matriz visual), PDF (reporte)
- **Plantilla asociada:** MO-PMO-TPL-RiskMatrix-v1.0.xlsx
- **Fuente:** Framework Corporativo v3.1, pág. 23, 35
- **Observaciones:** **REQUIERE DECISIÓN PMO** - Escalas y umbrales no definidos

#### 3.2.1 Campos Identificados
**NOTA:** Framework no define escalas específicas - los siguientes son **PROPUESTA PORTAL**:

| Field ID | Nombre | Tipo | Requerido | Origen | Validación |
|----------|--------|------|-----------|---------|------------|
| RSK-001 | riskId | AUTO | SÍ | **PROPUESTA PORTAL** | Auto-incremental |
| RSK-002 | riskDescription | TEXT | SÍ | **FRAMEWORK** | No vacío |
| RSK-003 | riskCategory | SELECT | NO | **PROPUESTA PORTAL** | TÉCNICO/OPERATIVO/EXTERNO |
| RSK-004 | probability | SELECT | SÍ | **PROPUESTA PORTAL** | BAJA/MEDIA/ALTA |
| RSK-005 | impact | SELECT | SÍ | **PROPUESTA PORTAL** | BAJA/MEDIA/ALTA |
| RSK-006 | riskScore | CALC | SÍ | **PROPUESTA PORTAL** | probability × impact |
| RSK-007 | owner | SELECT | SÍ | **FRAMEWORK** | Roles válidos |
| RSK-008 | mitigation | TEXT | NO | **FRAMEWORK** | - |
| RSK-009 | status | SELECT | SÍ | **PROPUESTA PORTAL** | IDENTIFICADO/EN_SEGUIMIENTO/MITIGADO |
| RSK-010 | lastUpdate | DATE | SÍ | **PROPUESTA PORTAL** | Auto-actualizable |

#### 3.2.2 Cálculos Requeridos **[PROPUESTA PORTAL]**
**IMPORTANTE:** Framework no define fórmulas específicas
- **Risk Score:** Probabilidad × Impacto (escala por definir PMO)
- **Portfolio Risk Level:** Agregación por definir PMO
- **Trends:** Análisis temporal por definir PMO

#### 3.2.3 Gap Identificado
**GAP-TOOL-001:** Escalas y umbrales de riesgo no definidos en Framework
- **Impacto:** No se puede implementar cálculo automatizado
- **Decisión PMO:** Definir escalas BAJA(1)/MEDIA(2)/ALTA(3) y umbrales
### 3.3 TOOL-PMO-003: Status Report Generator (**P0**)
- **Tool ID:** TOOL-PMO-003
- **ART-ID:** ART-CORP-022 (Reportería Semanal)
- **Nombre:** Status Report Generator
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-006 (Monitoreo y Control)
- **Proceso:** PROC-CORP-006 (Monitoreo y Control)
- **Owner:** Project Manager (ROL-CORP-003)
- **Descripción:** Generador de reportes de estado semanal del proyecto
- **Caso de uso:** Comunicación regular del estado del proyecto a stakeholders
- **Usuario principal:** Project Manager
- **Frecuencia:** Semanal
- **Relación Governance:** CTRL-CORP-004 (Monitoreo y Control)
- **Control IDs:** CTRL-CORP-004
- **Gate IDs:** -
- **Prioridad:** P0 (MVP esencial)
- **Online Suitability Score:** 82 **[PROPUESTA PORTAL]**
- **Complejidad:** MEDIA
- **Formato de exportación:** DOCX (principal), PDF (backup), PPTX (ejecutivo)
- **Plantilla asociada:** MO-PMO-TPL-StatusReport-v1.0.docx
- **Fuente:** Framework Corporativo v3.1, pág. 35
- **Observaciones:** Artefacto crítico para visibilidad del proyecto

#### 3.3.1 Campos Documentados
| Field ID | Nombre | Tipo | Requerido | Origen | Validación |
|----------|--------|------|-----------|---------|------------|
| STR-001 | reportWeek | DATE | SÍ | **PROPUESTA PORTAL** | Semana del reporte |
| STR-002 | projectName | TEXT | SÍ | **PROJECT CONTEXT** | Del contexto |
| STR-003 | projectManager | TEXT | SÍ | **PROJECT CONTEXT** | Del contexto |
| STR-004 | overallStatus | SELECT | SÍ | **FRAMEWORK** | GREEN/YELLOW/RED |
| STR-005 | accomplishments | TEXT | SÍ | **FRAMEWORK** | Logros de la semana |
| STR-006 | nextWeekPlans | TEXT | SÍ | **FRAMEWORK** | Planes próxima semana |
| STR-007 | issues | TEXT_ARRAY | NO | **FRAMEWORK** | Problemas identificados |
| STR-008 | risks | TEXT_ARRAY | NO | **FRAMEWORK** | Riesgos activos |
| STR-009 | decisions | TEXT_ARRAY | NO | **FRAMEWORK** | Decisiones requeridas |
| STR-010 | milestones | TEXT_ARRAY | NO | **FRAMEWORK** | Hitos próximos |
| STR-011 | teamHealth | SELECT | NO | **PROPUESTA PORTAL** | GOOD/CONCERN/CRITICAL |

### 3.4 TOOL-PMO-004: Governance Checklist (**P0**)
- **Tool ID:** TOOL-PMO-004
- **ART-ID:** Derivado de 07-governance-inventory.md
- **Nombre:** Governance Checklist
- **Framework:** Framework Corporativo v3.1
- **Fase:** Transversal (todas las fases)
- **Proceso:** Múltiples procesos
- **Owner:** Project Manager (ROL-CORP-003)
- **Descripción:** Checklist interactivo de controles de governance del framework
- **Caso de uso:** Verificación cumplimiento controles metodológicos
- **Usuario principal:** Project Manager, Líder JP
- **Frecuencia:** Por fase + validaciones ad-hoc
- **Relación Governance:** Todos los CTRL-CORP-XXX
- **Control IDs:** CTRL-CORP-001 a CTRL-CORP-006
- **Gate IDs:** GATE-CORP-001, GATE-CORP-002, GATE-CORP-003
- **Prioridad:** P0 (MVP esencial)
- **Online Suitability Score:** 75 **[PROPUESTA PORTAL]**
- **Complejidad:** MEDIA
- **Formato de exportación:** PDF (checklist), XLSX (tracking)
- **Plantilla asociada:** MO-PMO-TPL-GovernanceCheck-v1.0.xlsx
- **Fuente:** Framework Corporativo v3.1, múltiples páginas
- **Observaciones:** Herramienta crítica para asegurar compliance metodológico

#### 3.4.1 Controles Incluidos
| Control ID | Nombre | Fase | Owner | Evidencia Requerida |
|------------|--------|------|-------|-------------------|
| CTRL-CORP-001 | Validación PMO Intake | PMO Intake | PMO | ART-CORP-001 completo |
| CTRL-CORP-002 | Control de Transferencia | Handover | Líder JP | Handover validado |
| CTRL-CORP-003 | Control de Planificación | Planificación | PM | WBS + Cronograma |
| CTRL-CORP-004 | Monitoreo y Control | Monitoreo | PM | Reportería semanal |
| CTRL-CORP-005 | Control de Validación | Validación | PM | Entregables validados |
| CTRL-CORP-006 | Control de Cierre | Cierre | PM | Documentación completa |

#### 3.4.2 Cálculo Compliance **[PROPUESTA PORTAL]**
**FÓRMULA:** Controles cumplidos / Controles aplicables × 100
- **Verde:** ≥ 90% compliance
- **Amarillo:** 70-89% compliance  
- **Rojo:** < 70% compliance

### 3.5 TOOL-PMO-005: Minuta Online (**P1**)
- **Tool ID:** TOOL-PMO-005
- **ART-ID:** ART-CORP-014 (Minutas/Actas)
- **Nombre:** Minuta Online
- **Framework:** Framework Corporativo v3.1
- **Fase:** Transversal
- **Proceso:** Múltiples (reuniones de proyecto)
- **Owner:** Project Manager (ROL-CORP-003)
- **Descripción:** Generador de minutas de reunión estructuradas
- **Caso de uso:** Documentación formal de reuniones del proyecto
- **Usuario principal:** Project Manager
- **Frecuencia:** Por reunión
- **Relación Governance:** CTRL-CORP-004 (como evidencia)
- **Control IDs:** CTRL-CORP-004
- **Gate IDs:** -
- **Prioridad:** P1 (Alta prioridad)
- **Online Suitability Score:** 68 **[PROPUESTA PORTAL]**
- **Complejidad:** BAJA
- **Formato de exportación:** DOCX (principal)
- **Plantilla asociada:** MO-PMO-TPL-Minutes-v1.0.docx
- **Fuente:** Framework Corporativo v3.1, pág. 34
- **Observaciones:** Valor moderado, estructura simple

#### 3.5.1 Campos Identificados
| Field ID | Nombre | Tipo | Requerido | Origen |
|----------|--------|------|-----------|---------|
| MIN-001 | meetingDate | DATE | SÍ | **FRAMEWORK** |
| MIN-002 | meetingType | SELECT | SÍ | **PROPUESTA PORTAL** |
| MIN-003 | participants | TEXT_ARRAY | SÍ | **FRAMEWORK** |
| MIN-004 | objective | TEXT | SÍ | **FRAMEWORK** |
| MIN-005 | topics | TEXT_ARRAY | SÍ | **FRAMEWORK** |
| MIN-006 | decisions | TEXT_ARRAY | NO | **FRAMEWORK** |
| MIN-007 | commitments | OBJECT_ARRAY | NO | **FRAMEWORK** |
| MIN-008 | nextMeeting | DATE | NO | **PROPUESTA PORTAL** |

### 3.6 TOOL-PMO-006: Matriz de Escalamiento (**P1**)
- **Tool ID:** TOOL-PMO-006
- **ART-ID:** ART-CORP-020 (Matriz de Escalamiento)
- **Nombre:** Matriz de Escalamiento
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-003 (Planificación)
- **Proceso:** PROC-CORP-003 (Planificación)
- **Owner:** Project Manager (ROL-CORP-003)
- **Descripción:** Definición de rutas de escalamiento del proyecto
- **Caso de uso:** Establecer protocolos de escalamiento por tipo de situación
- **Usuario principal:** Project Manager
- **Frecuencia:** Por proyecto (una vez)
- **Relación Governance:** CTRL-CORP-003
- **Control IDs:** CTRL-CORP-003
- **Gate IDs:** GATE-CORP-002
- **Prioridad:** P1 (Alta prioridad)
- **Online Suitability Score:** 62 **[PROPUESTA PORTAL]**
- **Complejidad:** MEDIA
- **Formato de exportación:** XLSX (matriz), PDF (documento)
- **Plantilla asociada:** MO-PMO-TPL-EscalationMatrix-v1.0.xlsx
- **Fuente:** Framework Corporativo v3.1, pág. 34
- **Observaciones:** **PARTIALLY READY** - Referencias matriz no desarrollada

#### 3.6.1 Gap Identificado
**GAP-TOOL-002:** Estructura de matriz de escalamiento no definida
- **Impacto:** No se pueden definir campos específicos
- **Decisión PMO:** Desarrollar estructura estándar de escalamiento

### 3.7 TOOL-PMO-007: Backlog Ágil (**P2**)
- **Tool ID:** TOOL-PMO-007
- **ART-ID:** ART-AGL-001 (Backlog del Proyecto)
- **Nombre:** Backlog Ágil
- **Framework:** Framework Ágil v1
- **Fase:** PHA-AGL-003 (Sprint Planning)
- **Proceso:** PROC-AGL-003 (Sprint Planning)
- **Owner:** Project Manager Ágil (ROL-AGL-003) + Product Owner (ROL-AGL-005)
- **Descripción:** Gestión del backlog del proyecto ágil
- **Caso de uso:** Priorización y gestión de características del proyecto
- **Usuario principal:** PM Ágil, Product Owner (opcional)
- **Frecuencia:** Continua (actualizaciones por sprint)
- **Relación Governance:** CTRL-AGL-003
- **Control IDs:** CTRL-AGL-003
- **Gate IDs:** -
- **Prioridad:** P2 (Media prioridad)
- **Online Suitability Score:** 58 **[PROPUESTA PORTAL]**
- **Complejidad:** MEDIA
- **Formato de exportación:** XLSX (backlog), CSV (Asana import)
- **Plantilla asociada:** MO-PMO-TPL-AgilBacklog-v1.0.xlsx
- **Fuente:** Framework Ágil v1, secc. 7.3
- **Observaciones:** **EVALUAR DUPLICIDAD** con Asana - considerar integración vs desarrollo

### 3.8 TOOL-PMO-008: Cierre de Proyecto (**P2**)
- **Tool ID:** TOOL-PMO-008
- **ART-ID:** ART-CORP-010 (Lecciones Aprendidas) + ART-CORP-009 (Presentación Ejecutiva)
- **Nombre:** Cierre de Proyecto
- **Framework:** Framework Corporativo v3.1
- **Fase:** PHA-CORP-008 (Cierre del Proyecto)
- **Proceso:** PROC-CORP-008 (Cierre del Proyecto)
- **Owner:** Project Manager (ROL-CORP-003)
- **Descripción:** Herramienta integral para cierre formal del proyecto
- **Caso de uso:** Consolidación de cierre técnico y administrativo
- **Usuario principal:** Project Manager
- **Frecuencia:** Por proyecto (una vez)
- **Relación Governance:** CTRL-CORP-006, GATE-CORP-003
- **Control IDs:** CTRL-CORP-006
- **Gate IDs:** GATE-CORP-003
- **Prioridad:** P2 (Media prioridad)
- **Online Suitability Score:** 55 **[PROPUESTA PORTAL]**
- **Complejidad:** ALTA
- **Formato de exportación:** DOCX (lecciones), PPTX (presentación ejecutiva)
- **Plantilla asociada:** MO-PMO-TPL-ProjectClosure-v1.0
- **Fuente:** Framework Corporativo v3.1, pág. 24
- **Observaciones:** **BLOCKED** - GAP-GOV-001 (aprobador GATE-CORP-003 no definido)
## 4. PROJECT CONTEXT

### 4.1 Contexto Común Identificado **[PROPUESTA PORTAL]**
Campos comunes utilizables por múltiples herramientas:

| Field ID | Nombre | Tipo | Origen | Utilizado por |
|----------|--------|------|---------|---------------|
| CTX-001 | projectId | AUTO | **PROPUESTA PORTAL** | Todas las herramientas |
| CTX-002 | projectName | TEXT | **PROPUESTA PORTAL** | Todas las herramientas |
| CTX-003 | clientName | TEXT | **FRAMEWORK** | TOOL-PMO-001, 003, 005 |
| CTX-004 | projectManager | SELECT | **FRAMEWORK** | TOOL-PMO-003, 004, 005, 008 |
| CTX-005 | startDate | DATE | **FRAMEWORK** | TOOL-PMO-001, 003, 008 |
| CTX-006 | frameworkType | SELECT | **FRAMEWORK** | TOOL-PMO-004, 007 |
| CTX-007 | currentPhase | SELECT | **DERIVADO** | TOOL-PMO-003, 004 |
| CTX-008 | sponsor | TEXT | **PROPUESTA PORTAL** | TOOL-PMO-001, 008 |
| CTX-009 | pmoId | AUTO | **PROPUESTA PORTAL** | TOOL-PMO-001 |

**Nota:** projectContext permite reutilizar información entre herramientas y mantener consistencia

## 5. VALIDACIONES IDENTIFICADAS

### 5.1 Validaciones por Framework

#### **VALIDACIONES DEL FRAMEWORK:**
- **ART-CORP-001:** "Todo proyecto debe tener información base completa" (TOOL-PMO-001)
- **ART-CORP-012:** "Todo riesgo debe tener responsable" (TOOL-PMO-002)
- **ART-CORP-022:** "Reportería semanal obligatoria" (TOOL-PMO-003)
- **Controles:** "Cumplimiento de controles según fase" (TOOL-PMO-004)

#### **VALIDACIONES UX [PROPUESTA PORTAL]:**
- **Formularios:** Validación en tiempo real, progress bar
- **Exportación:** Warning si faltan campos críticos
- **Autoguardado:** Advertencia de pérdida de datos
- **Navegación:** Confirmación antes de salir con cambios

### 5.2 Dependencias Identificadas
- **TOOL-PMO-002:** Depende de definición de escalas de riesgo (GAP-TOOL-001)
- **TOOL-PMO-004:** Depende de aprobadores de gates (GAP-GOV-001)
- **TOOL-PMO-006:** Depende de estructura de matriz (GAP-TOOL-002)
- **TOOL-PMO-008:** Depende de aprobador GATE-CORP-003 (GAP-GOV-001)

## 6. CÁLCULOS IDENTIFICADOS

### 6.1 Cálculos Documentados

#### **FRAMEWORK:**
- **Sin cálculos explícitos documentados en frameworks**

#### **PMO EXISTENTE:**
- **Información no definida en el Framework**

#### **PROPUESTA PORTAL:**
- **Risk Score:** probability × impact (TOOL-PMO-002)
- **Compliance Score:** controles cumplidos / aplicables × 100 (TOOL-PMO-004)
- **Status Trend:** análisis temporal de estados (TOOL-PMO-003)

#### **NO DEFINIDO:**
- **SPI, CPI:** No documentados en frameworks
- **Desviación presupuestal:** No especificada
- **Velocity ágil:** No definida en Framework Ágil

### 6.2 Gap de Cálculos
**GAP-TOOL-003:** Métricas de proyecto no definidas
- **Impacto:** No se pueden automatizar KPIs específicos
- **Decisión PMO:** Definir métricas estándar organizacionales

## 7. NO DUPLICAR HERRAMIENTAS EXISTENTES

### 7.1 Evaluación de Duplicidad

#### **ASANA (Management Tool):**
- **Funcionalidad:** Gestión de tareas, cronogramas, seguimiento
- **Recomendación TOOL-PMO-007:** Evaluar integración vs desarrollo propio
- **Decisión:** Backlog ágil puede ser más apropiado en Asana que generador propio

#### **GOOGLE WORKSPACE (Management Tool):**
- **Funcionalidad:** Documentos colaborativos, hojas de cálculo
- **Complemento:** Generadores PMO crean plantillas para Google Workspace
- **No duplicidad:** Generadores facilitan creación, no reemplazan colaboración

#### **TIMETRACKER (Management Tool):**
- **Funcionalidad:** Time tracking
- **No duplicidad:** Ningún generador PMO compite con time tracking

#### **GITHUB (Management Tool):**
- **Funcionalidad:** Código fuente, documentación técnica
- **No duplicidad:** Generadores PMO no gestionan código

### 7.2 Integraciones Futuras Recomendadas
- **TOOL-PMO-007 ↔ Asana:** Exportar backlog a Asana para gestión operativa
- **TOOL-PMO-003 ↔ Google Slides:** Generar presentación ejecutiva automática
- **TOOL-PMO-001 ↔ PMO System:** Integración directa con sistema organizacional

## 8. COMPLEJIDAD TÉCNICA

### 8.1 Clasificación de Complejidad

| Tool ID | Complejidad | Justificación |
|---------|-------------|---------------|
| **TOOL-PMO-001** | MEDIA | Formulario con validaciones múltiples + exportación |
| **TOOL-PMO-002** | ALTA | Matrices dinámicas + cálculos + visualización |
| **TOOL-PMO-003** | MEDIA | Template generation + múltiples formatos |
| **TOOL-PMO-004** | MEDIA | Lógica de controles + cálculo compliance |
| **TOOL-PMO-005** | BAJA | Formulario simple + exportación DOCX |
| **TOOL-PMO-006** | MEDIA | Matriz estructurada + relaciones |
| **TOOL-PMO-007** | MEDIA | Gestión de items + priorización |
| **TOOL-PMO-008** | ALTA | Múltiples artefactos + consolidación |

### 8.2 Factores de Complejidad
- **Cálculos automáticos:** Risk matrix, compliance score
- **Múltiples formatos:** DOCX, XLSX, PPTX, PDF
- **Tablas dinámicas:** Add/remove rows en riesgos, backlog
- **Validaciones complejas:** Cross-validation entre campos
- **Estado local:** Autoguardado y recuperación de borradores

## 9. EXPORTACIÓN Y FORMATOS

### 9.1 Matriz de Exportación

| Tool ID | Primary Export | Secondary Export | Official Format | Recommended Format |
|---------|----------------|------------------|-----------------|-------------------|
| **TOOL-PMO-001** | PDF | JSON | **NO DETERMINADO** | PDF |
| **TOOL-PMO-002** | XLSX | PDF | **NO DETERMINADO** | XLSX |
| **TOOL-PMO-003** | DOCX | PPTX | **NO DETERMINADO** | DOCX |
| **TOOL-PMO-004** | PDF | XLSX | **NO DETERMINADO** | PDF |
| **TOOL-PMO-005** | DOCX | - | **NO DETERMINADO** | DOCX |
| **TOOL-PMO-006** | XLSX | PDF | **NO DETERMINADO** | XLSX |
| **TOOL-PMO-007** | XLSX | CSV | **NO DETERMINADO** | XLSX |
| **TOOL-PMO-008** | PPTX | DOCX | **NO DETERMINADO** | PPTX |

### 9.2 Librerías Técnicas Recomendadas **[PROPUESTA PORTAL]**
- **ExcelJS:** Generación XLSX (risk matrix, backlog, checklist)
- **docx:** Generación DOCX (status report, minutes, closure)
- **PptxGenJS:** Generación PPTX (executive presentations)
- **jsPDF:** Generación PDF (forms, reports)

**IMPORTANTE:** No instalar todavía - solo recomendación técnica futura

## 10. AUTOGUARDADO Y ESTADO LOCAL

### 10.1 Requerimientos de Autoguardado **[PROPUESTA PORTAL]**

| Tool ID | Autoguardado | Justificación |
|---------|--------------|---------------|
| **TOOL-PMO-001** | REQUERIDO | Formulario largo, información crítica |
| **TOOL-PMO-002** | REQUERIDO | Datos extensos, actualización continua |
| **TOOL-PMO-003** | RECOMENDADO | Reports semanales, tiempo de elaboración |
| **TOOL-PMO-004** | NO NECESARIO | Checklist rápido |
| **TOOL-PMO-005** | RECOMENDADO | Minutas pueden tomar tiempo |
| **TOOL-PMO-006** | REQUERIDO | Matriz compleja |
| **TOOL-PMO-007** | REQUERIDO | Backlog evolutivo |
| **TOOL-PMO-008** | RECOMENDADO | Proceso de cierre extenso |

### 10.2 Tecnología Propuesta **[PROPUESTA PORTAL]**
- **MVP:** localStorage (simple, rápido)
- **Futuro:** IndexedDB (mayor capacidad, mejor performance)

## 11. DEPENDENCIAS DE DECISIONES PMO

### 11.1 Estado de Preparación

| Tool ID | Ready Status | Blocking Gaps | Decisiones PMO Requeridas |
|---------|--------------|---------------|---------------------------|
| **TOOL-PMO-001** | **READY** | Ninguno | Ninguna - desarrollo directo |
| **TOOL-PMO-002** | **BLOCKED** | GAP-TOOL-001 | Definir escalas de riesgo |
| **TOOL-PMO-003** | **READY** | Ninguno | Ninguna - desarrollo directo |
| **TOOL-PMO-004** | **PARTIALLY READY** | GAP-GOV-001 | Aprobadores de gates |
| **TOOL-PMO-005** | **READY** | Ninguno | Ninguna - desarrollo directo |
| **TOOL-PMO-006** | **BLOCKED** | GAP-TOOL-002 | Estructura matriz escalamiento |
| **TOOL-PMO-007** | **PARTIALLY READY** | - | Decisión integración vs desarrollo |
| **TOOL-PMO-008** | **BLOCKED** | GAP-GOV-001 | Aprobador GATE-CORP-003 |

### 11.2 Nuevos Gaps Identificados

#### **GAP-TOOL-001: Escalas de Riesgo No Definidas**
- **Herramienta afectada:** TOOL-PMO-002 (Matriz de Riesgos)
- **Descripción:** Framework no define escalas numéricas para probabilidad/impacto
- **Propuesta:** BAJA(1) / MEDIA(2) / ALTA(3) + umbrales GREEN(<4), YELLOW(4-6), RED(>6)
- **Impacto:** Bloquea cálculo automático de risk score

#### **GAP-TOOL-002: Estructura Matriz Escalamiento**
- **Herramienta afectada:** TOOL-PMO-006 (Matriz de Escalamiento)
- **Descripción:** ART-CORP-020 referenciado pero estructura no desarrollada
- **Propuesta:** Definir campos estándar (situación → responsable → timeframe)
- **Impacto:** No se pueden definir campos específicos del generador

#### **GAP-TOOL-003: Métricas de Proyecto**
- **Herramientas afectadas:** TOOL-PMO-003, TOOL-PMO-004
- **Descripción:** No existen KPIs cuantitativos definidos en frameworks
- **Propuesta:** Definir métricas organizacionales estándar
- **Impacto:** Limitación en automatización de cálculos
## 12. MATRIZ DE PRIORIZACIÓN

### 12.1 PMO ONLINE GENERATORS — MASTER CATALOG

| Priority | Tool ID | ART-ID | Nombre | Framework | Fase | Proceso | Owner | Caso de uso | Campos | Validaciones | Cálculos | Governance | Export | Complexity | Ready Status | Blocking Gaps |
|----------|---------|--------|--------|-----------|------|---------|--------|-------------|---------|-------------|----------|------------|---------|------------|--------------|---------------|
| **P0** | TOOL-PMO-001 | ART-CORP-001 | Información Base | Corporativo | PMO Intake | PMO Intake | PMO | Recepción formal proyecto | 12 campos | Framework + UX | Ninguno | CTRL-CORP-001 | PDF, JSON | MEDIA | **READY** | Ninguno |
| **P0** | TOOL-PMO-002 | ART-CORP-012 | Matriz Riesgos | Corporativo | Planificación-Monitoreo | Múltiples | PM | Gestión riesgos integral | 10 campos | Framework + Portal | Risk Score | CTRL-CORP-004 | XLSX, PDF | ALTA | **BLOCKED** | GAP-TOOL-001 |
| **P0** | TOOL-PMO-003 | ART-CORP-022 | Status Report | Corporativo | Monitoreo | Monitoreo | PM | Reportería semanal | 11 campos | Framework + Portal | Status Trends | CTRL-CORP-004 | DOCX, PDF, PPTX | MEDIA | **READY** | Ninguno |
| **P0** | TOOL-PMO-004 | Governance | Governance Checklist | Corporativo | Transversal | Múltiples | PM | Compliance metodológico | 6 controles | Framework | Compliance % | Todos CTRL | PDF, XLSX | MEDIA | **PARTIALLY READY** | GAP-GOV-001 |
| **P1** | TOOL-PMO-005 | ART-CORP-014 | Minuta Online | Corporativo | Transversal | Múltiples | PM | Documentación reuniones | 8 campos | Framework | Ninguno | CTRL-CORP-004 | DOCX | BAJA | **READY** | Ninguno |
| **P1** | TOOL-PMO-006 | ART-CORP-020 | Matriz Escalamiento | Corporativo | Planificación | Planificación | PM | Protocolos escalamiento | Por definir | Por definir | Ninguno | CTRL-CORP-003 | XLSX, PDF | MEDIA | **BLOCKED** | GAP-TOOL-002 |
| **P2** | TOOL-PMO-007 | ART-AGL-001 | Backlog Ágil | Ágil | Sprint Planning | Sprint Planning | PM Ágil + PO | Gestión backlog ágil | 8 campos | Framework + Portal | Priorización | CTRL-AGL-003 | XLSX, CSV | MEDIA | **PARTIALLY READY** | Decisión integración |
| **P2** | TOOL-PMO-008 | ART-CORP-009/010 | Cierre Proyecto | Corporativo | Cierre | Cierre | PM | Cierre integral proyecto | 15+ campos | Framework + Portal | Ninguno | CTRL-CORP-006 | PPTX, DOCX | ALTA | **BLOCKED** | GAP-GOV-001 |

### 12.2 Metodología de Score **[PROPUESTA PORTAL]**

**Fórmula:** Online Suitability Score = Σ (Criterio × Peso) / 23 × 100

**Rangos de Priorización:**
- **P0:** Score ≥ 70 + alta relación governance + uso frecuente
- **P1:** Score 60-69 + valor operativo confirmado  
- **P2:** Score 50-59 + beneficio moderado
- **P3:** Score < 50 o baja viabilidad

## 13. MVP RECOMENDADO

### 13.1 PMO FRAMEWORK HUB — ONLINE TOOLS MVP

#### **TOOL-PMO-001: Información Base del Proyecto**
- **ART-ID:** ART-CORP-001
- **Motivo:** Entrada crítica al framework, uso obligatorio por proyecto
- **Valor:** Estandarización recepción proyectos, integración PMO System
- **Formato exportación:** PDF (archivo), JSON (sistema)
- **Dependencias:** Ninguna
- **Ready Status:** READY

#### **TOOL-PMO-003: Status Report Generator**
- **ART-ID:** ART-CORP-022
- **Motivo:** Uso semanal, alta frecuencia, valor operativo inmediato
- **Valor:** Automatización reportería, consistencia comunicación
- **Formato exportación:** DOCX (principal), PPTX (ejecutivo)
- **Dependencias:** Ninguna
- **Ready Status:** READY

#### **TOOL-PMO-005: Minuta Online**  
- **ART-ID:** ART-CORP-014
- **Motivo:** Simplicidad desarrollo, valor inmediato, uso frecuente
- **Valor:** Estandarización documentación reuniones
- **Formato exportación:** DOCX
- **Dependencias:** Ninguna
- **Ready Status:** READY

#### **TOOL-PMO-004: Governance Checklist** 
- **ART-ID:** Derivado Governance Inventory
- **Motivo:** Compliance metodológico crítico, diferenciador PMO
- **Valor:** Asegurar adherencia framework, visibilidad governance
- **Formato exportación:** PDF (checklist), XLSX (tracking)
- **Dependencias:** Definición aprobadores gates (parcial)
- **Ready Status:** PARTIALLY READY

**DECISIÓN MVP:** Iniciar con 4 herramientas P0, 3 READY + 1 PARTIALLY READY

## 14. ROADMAP POST-MVP

### 14.1 P1 - Alta Prioridad (Post-MVP)
- **TOOL-PMO-006:** Matriz de Escalamiento (requiere GAP-TOOL-002)
- **Integraciones:** TOOL-PMO-001 ↔ PMO System, TOOL-PMO-003 ↔ Google Slides

### 14.2 P2 - Media Prioridad
- **TOOL-PMO-002:** Matriz de Riesgos (requiere GAP-TOOL-001)
- **TOOL-PMO-007:** Backlog Ágil (decisión integración vs desarrollo)
- **TOOL-PMO-008:** Cierre de Proyecto (requiere GAP-GOV-001)

### 14.3 P3 - Baja Prioridad / Futuro
- **Calculadoras avanzadas:** SPI/CPI (si se definen métricas)
- **Dashboard integrado:** Consolidación múltiples herramientas
- **Workflow engine:** Automatización flujos aprobación

## 15. ARQUITECTURA FUNCIONAL CONCEPTUAL

### 15.1 Navegación Propuesta **[PROPUESTA PORTAL]**

```
PMO Framework Hub
└── /tools
    ├── /info-base-proyecto          (TOOL-PMO-001)
    ├── /status-report              (TOOL-PMO-003)  
    ├── /minuta-online             (TOOL-PMO-005)
    ├── /governance-checklist      (TOOL-PMO-004)
    ├── /matriz-riesgos           (TOOL-PMO-002) [Post-MVP]
    ├── /matriz-escalamiento      (TOOL-PMO-006) [Post-MVP]
    ├── /backlog-agil             (TOOL-PMO-007) [Post-MVP]
    └── /cierre-proyecto          (TOOL-PMO-008) [Post-MVP]
```

### 15.2 Funcionalidad por Herramienta

**Para cada herramienta:**
- **CREAR ONLINE:** Generador interactivo
- **DESCARGAR PLANTILLA:** Template oficial descargable
- **VER PROCEDIMIENTO:** Enlace a proceso del framework
- **CONTINUAR BORRADOR:** Recuperar trabajo guardado

### 15.3 Relaciones Implementables

**Tool → Artifact → Process → Framework:**
- TOOL-PMO-001 → ART-CORP-001 → PROC-CORP-001 → Framework Corporativo
- Navegación contextual entre herramienta, artefacto y metodología

## 16. REUTILIZACIÓN ENTRE HERRAMIENTAS

### 16.1 Componentes Funcionales Comunes **[PROPUESTA PORTAL]**

#### **Datos Compartidos:**
- **Project Context:** Información común proyecto (CTX-001 a CTX-009)
- **People Selector:** Selector roles/responsables
- **Date Components:** Selectores fecha consistentes
- **Status Selector:** Estados estándar (GREEN/YELLOW/RED)

#### **Funcionalidad Compartida:**
- **Dynamic Table:** Add/remove rows (riesgos, backlog, compromisos)
- **Document Metadata:** Información documento (versión, fecha, autor)
- **Validation Panel:** Mensajes validación consistentes
- **Export Engine:** Motor exportación multi-formato
- **Autosave Manager:** Gestión autoguardado local
- **Preview Component:** Previsualización antes de exportar

### 16.2 Beneficio Arquitectura Modular
- **Consistencia UX:** Misma experiencia entre herramientas
- **Desarrollo eficiente:** Reutilización componentes
- **Mantenimiento:** Cambios centralizados

## 17. HERRAMIENTAS QUE NO CONVIENE DESARROLLAR

### 17.1 Artefactos Evaluados como NO CANDIDATOS

#### **Documentos Complejos (No estructurados):**
- **ART-CORP-006:** Documentación Técnica Final (muy variable)
- **ART-CORP-007:** Arquitectura Implementada (diagramas técnicos)
- **ART-CORP-008:** Manuales Operativos (contenido específico)
- **ART-CORP-011:** IDD (documento técnico extenso)

#### **Artefactos de Bajo Valor Online:**
- **ART-CORP-017:** SOW (recibido, no generado)
- **ART-CORP-018:** NDA (formato legal fijo)
- **ART-CORP-019:** Contrato (formato legal/comercial)
- **ART-CORP-023:** Asana Project (Management Tool)

#### **Documentos Únicos por Proyecto:**
- **ART-CORP-015:** Registro de Cambios (muy contextual)
- **ART-CORP-016:** Comunicación Formal (caso por caso)
- **ART-CORP-024:** Evidencias (archivos diversos)

### 17.2 Justificación No Desarrollo
- **Baja estructuración:** Contenido muy variable
- **Complejidad técnica desproporcionada:** Desarrollo > beneficio
- **Duplicidad herramientas existentes:** Ya cubierto por Management Tools
- **Frecuencia baja:** Uso esporádico no justifica desarrollo

## 18. INTEGRACIONES FUTURAS RECOMENDADAS

### 18.1 Integraciones Prioritarias

#### **TOOL-PMO-001 ↔ PMO System**
- **Tipo:** API integration
- **Beneficio:** Registro automático en portafolio organizacional
- **Complejidad:** Media (requiere API PMO System)

#### **TOOL-PMO-007 ↔ Asana**
- **Tipo:** Export/Import
- **Beneficio:** Gestión operativa del backlog en herramienta especializada
- **Complejidad:** Baja (CSV export/import)

#### **TOOL-PMO-003 ↔ Google Slides**
- **Tipo:** Template integration  
- **Beneficio:** Presentación ejecutiva automática
- **Complejidad:** Media (Google APIs)

### 18.2 Integraciones Futuras
- **TOOL-PMO-002 ↔ Risk Management Systems**
- **TOOL-PMO-004 ↔ Compliance Dashboards**
- **Multi-tool ↔ Business Intelligence**

## 19. DECISIONES REQUERIDAS PMO

### 19.1 Decisiones Críticas para MVP

#### **Decisión 1: Escalas de Riesgo (GAP-TOOL-001)**
- **Herramienta afectada:** TOOL-PMO-002 (P0 - MVP)
- **Opciones:** 
  - Escala 1-3 (BAJA/MEDIA/ALTA)
  - Escala 1-5 (más granular)
  - Posponer a post-MVP
- **Recomendación:** Escala 1-3 para MVP, expandir posteriormente
- **Urgencia:** Media (P0 pero puede posponerse)

#### **Decisión 2: Aprobadores Gates (GAP-GOV-001)**
- **Herramienta afectada:** TOOL-PMO-004 (P0 - MVP), TOOL-PMO-008 (P2)
- **Opciones:**
  - Implementar checklist sin aprobadores formales
  - Definir aprobadores antes del desarrollo
  - Funcionalidad parcial en MVP
- **Recomendación:** Funcionalidad parcial en MVP (controles sin gates)
- **Urgencia:** Media (afecta MVP parcialmente)

### 19.2 Decisiones de Arquitectura

#### **Decisión 3: Backlog Ágil vs Asana**
- **Herramienta afectada:** TOOL-PMO-007 (P2)
- **Opciones:**
  - Desarrollar generador propio
  - Integración con Asana únicamente
  - Generador + export a Asana
- **Recomendación:** Generador + export (flexibilidad máxima)
- **Urgencia:** Baja (P2 - post-MVP)

#### **Decisión 4: Prioridad de Desarrollo MVP**
- **Opciones:**
  - 3 herramientas READY únicamente
  - 4 herramientas incluyendo PARTIALLY READY
  - Desarrollo en fases (1-2-1-0)
- **Recomendación:** 4 herramientas con funcionalidad parcial
- **Urgencia:** Alta (define alcance MVP)

## 20. CONTROL DE CALIDAD

### 20.1 Verificaciones Completadas ✅

- ✅ Cada TOOL-ID tiene ART-ID correspondiente
- ✅ Cada ART-ID validado contra 06-artifact-inventory.md
- ✅ PROC-IDs validados contra 05-process-inventory.md
- ✅ CTRL/GATE-IDs validados contra 07-governance-inventory.md  
- ✅ ROL-IDs validados contra 08-role-inventory.md
- ✅ No se inventaron artefactos para justificar herramientas
- ✅ Distinción clara Management Tool vs Online Generator
- ✅ Distinción clara Template vs Artifact
- ✅ Cálculos marcados como PROPUESTA PORTAL vs FRAMEWORK
- ✅ Campos UX marcados como propuesta vs documentados
- ✅ Gaps bloqueantes identificados y documentados

### 20.2 Trazabilidad Completa
**Todas las herramientas tienen trazabilidad completa:**
Tool → ART-ID → PROC-ID → Framework → Página/Sección

## 21. RESUMEN EJECUTIVO FINAL

### 21.1 ONLINE TOOLS CANDIDATES — RESUMEN

1. **Total artefactos evaluados:** 28 artefactos
2. **Generadores candidatos:** 8 candidatos
3. **READY:** 3 herramientas (TOOL-PMO-001, 003, 005)
4. **PARTIALLY READY:** 2 herramientas (TOOL-PMO-004, 007)
5. **BLOCKED:** 3 herramientas (TOOL-PMO-002, 006, 008)
6. **P0 (MVP):** 4 herramientas
7. **P1:** 2 herramientas  
8. **P2:** 2 herramientas
9. **P3:** 0 herramientas
10. **Nuevos gaps:** 3 gaps técnicos identificados

### 21.2 TOP 4 PARA MVP

1. **TOOL-PMO-001: Información Base** (READY) - Entrada crítica framework
2. **TOOL-PMO-003: Status Report** (READY) - Uso semanal, alta frecuencia
3. **TOOL-PMO-005: Minuta Online** (READY) - Desarrollo simple, valor inmediato
4. **TOOL-PMO-004: Governance Checklist** (PARTIALLY READY) - Compliance metodológico

### 21.3 HERRAMIENTAS QUE NO CONVIENE DESARROLLAR

**20 artefactos evaluados como NO CANDIDATOS:**
- **Documentos técnicos complejos:** Arquitectura, IDD, manuales (7 artefactos)
- **Artefactos legales/comerciales:** SOW, NDA, contratos (3 artefactos)
- **Documentos únicos/contextuales:** Cambios, comunicaciones, evidencias (6 artefactos)
- **Management tools existentes:** Asana project, configuraciones (4 artefactos)

### 21.4 INTEGRACIONES FUTURAS RECOMENDADAS

**Prioritarias:**
1. **TOOL-PMO-001 → PMO System** (registro automático portafolio)
2. **TOOL-PMO-007 → Asana** (gestión operativa backlog)
3. **TOOL-PMO-003 → Google Slides** (presentación ejecutiva automática)

### 21.5 DECISIONES REQUERIDAS PMO

**Críticas para MVP:**
1. **Escalas de riesgo:** BAJA/MEDIA/ALTA vs posponer TOOL-PMO-002
2. **Aprobadores gates:** Funcionalidad parcial vs definición previa
3. **Alcance MVP:** 3 vs 4 herramientas iniciales

**Arquitectura (Post-MVP):**
4. **Backlog ágil:** Desarrollo propio vs integración Asana vs híbrido

---

## 22. CONCLUSIÓN ANÁLISIS HERRAMIENTAS

**ANÁLISIS COMPLETADO** con 8 candidatos identificados, 4 herramientas MVP seleccionadas (3 READY + 1 PARTIALLY READY), arquitectura funcional conceptual definida y 3 gaps técnicos documentados.

**Framework Corporativo** proporciona base sólida para 7 de 8 herramientas, con artefactos bien estructurados y relación clara con governance.

**Framework Ágil** contribuye 1 herramienta (backlog) con evaluación de integración vs desarrollo propio recomendada.

**Próximo paso:** 10-gaps-and-ambiguities.md para consolidación de todos los gaps antes de trazabilidad final y validación PMO.

---

**STOP** - Archivo 09-online-tools-candidates.md completado. Esperando revisión PMO antes de continuar con consolidación de gaps.
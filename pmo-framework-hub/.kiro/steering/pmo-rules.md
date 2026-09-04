# PMO Framework Hub - Reglas PMO Permanentes

## Principios Fundamentales

### 1. Los Frameworks son Fuente de Verdad
- **Regla Absoluta**: Los documentos oficiales "Framework Corporativo v3.1" y "Framework Ágil v1.0" son la única fuente autoritativa de metodología
- **Prohibición**: Está prohibido crear, modificar o sugerir metodología que no esté explícitamente documentada en los frameworks oficiales
- **Validación**: Todo contenido metodológico debe poder citarse con referencia específica (Framework + Capítulo + Página)
- **Actualizaciones**: Solo el PMO Office de Morris & Opazo puede autorizar cambios metodológicos

### 2. No Inventar Metodología
- **Prohibición Explícita**: No se debe crear procesos, actividades, roles, responsabilidades o artefactos que no estén en los frameworks
- **Interpretación**: Ante ambigüedad, citar literalmente el framework sin interpretación propia
- **Gaps Identificados**: Cuando falte información, marcar explícitamente como "Información no definida en el Framework"
- **Escalación**: Gaps metodológicos deben escalarse al PMO Office para resolución oficial

### 3. Trazabilidad Documental Obligatoria
- **Cada Proceso**: Debe incluir referencia específica al framework fuente
- **Cada Actividad**: Debe citar sección y página del documento oficial
- **Cada Rol**: Debe referenciar definición exacta en el framework
- **Cada Artefacto**: Debe indicar origen metodológico preciso
- **Formato de Referencia**: `[Framework Tipo] v[Versión] - Cap [X] - Pág [Y] - Sección [Z]`

## Gestión de Versiones y Artefactos

### 4. Versionado Obligatorio de Artefactos
- **Formato**: Semantic Versioning (MAJOR.MINOR.PATCH)
- **MAJOR**: Cambios incompatibles en estructura o metodología
- **MINOR**: Nuevas funcionalidades manteniendo compatibilidad
- **PATCH**: Correcciones de errores sin cambios funcionales
- **Metadatos**: Todo artefacto debe incluir versión, fecha, autor, aprobador
- **Historial**: Mantener registro de cambios y justificación por versión

### 5. Relación Framework → Fase → Proceso
- **Estructura Obligatoria**: Todo artefacto debe mapearse jerárquicamente
  ```
  Framework (Corporativo | Ágil)
    └── Fase (Iniciación | Planificación | Ejecución | Control | Cierre)
        └── Proceso (Específico del framework)
            └── Actividad (Detallada en framework)
                └── Artefacto (Output definido)
  ```
- **Prohibición**: No crear artefactos huérfanos sin relación metodológica clara
- **Validación**: Cada artefacto debe poder trazar su path completo al framework

### 6. URLs y Distribución Segura
- **Prohibición Absoluta**: Nunca usar URLs públicas directas de S3
- **Obligatorio**: Todo documento descargable debe usar CloudFront distribution
- **Formato URL**: `https://pmo.morrisopazo.com/downloads/[categoria]/[archivo]`
- **Control de Acceso**: CloudFront OAC para controlar acceso a recursos S3
- **Logging**: Registrar todas las descargas para auditoría y analytics

## Nomenclatura y Estándares

### 7. Nomenclatura MO-PMO
- **Prefijo Obligatorio**: Todos los documentos generados deben usar prefijo `MO-PMO-`
- **Estructura**: `MO-PMO-[TIPO]-[PROYECTO]-[FECHA]-v[VERSION]`
- **Ejemplos**:
  - `MO-PMO-CHARTER-CRM-20260903-v1.0.docx`
  - `MO-PMO-WBS-INFRAESTRUCTURA-20260903-v2.1.xlsx`
  - `MO-PMO-STATUS-MIGRACION-20260903-v1.3.pptx`
- **Consistencia**: Aplicar nomenclatura en archivos generados y referencias internas

## Separación de Responsabilidades

### 8. Separación Información vs Código
- **Principio**: La información metodológica debe estar completamente separada del código UI
- **Implementación**: Usar archivos JSON estructurados para almacenar datos metodológicos
- **Prohibición**: No hardcodear información de frameworks en componentes React
- **Estructura de Datos**: 
  ```json
  {
    "framework": "corporativo | agil",
    "version": "semver",
    "source": "document reference",
    "content": "methodology data"
  }
  ```

### 9. Información Metodológica en JSON
- **Formato Estandarizado**: Toda metodología debe estructurarse en JSON schemas validados
- **Ubicación**: `/src/data/methodology/` para información PMO
- **Versionado**: JSON files deben incluir versión y referencia al framework fuente
- **Validación**: Usar JSON Schema para validar consistencia de datos metodológicos
- **Ejemplo**:
  ```json
  {
    "framework": {
      "type": "corporativo",
      "version": "3.1",
      "phases": [
        {
          "name": "Iniciación", 
          "source": "Framework Corporativo v3.1 - Cap 3 - Pág 15",
          "processes": [...],
          "deliverables": [...]
        }
      ]
    }
  }
  ```

## Resolución de Conflictos

### 10. Gestión de Contradicciones Documentales
- **Prohibición**: No tomar decisiones arbitrarias ante contradicciones entre frameworks
- **Proceso Obligatorio**:
  1. **Documentar** la contradicción específica con referencias exactas
  2. **Escalar** al PMO Office de Morris & Opazo
  3. **Marcar** temporalmente como "Contradicción identificada - En resolución"
  4. **Actualizar** solo después de resolución oficial del PMO Office
- **Transparencia**: Mantener log público de contradicciones identificadas y resoluciones

## Compliance y Auditoría

### 11. Registro de Cambios Metodológicos
- **Log Obligatorio**: Todo cambio en contenido metodológico debe registrarse
- **Información Requerida**: Fecha, responsable, justificación, framework afectado
- **Aprobación**: Cambios metodológicos requieren aprobación del PMO Office
- **Trazabilidad**: Mantener cadena completa de cambios para auditoría

### 12. Validación Continua
- **Review Periódico**: Validar mensualmente consistencia entre portal y frameworks oficiales
- **Automatización**: Implementar validaciones automáticas de referencias documentales
- **Métricas**: Trackear compliance rate y identificar gaps metodológicos
- **Reporting**: Generar reportes regulares de adherencia a frameworks

## Excepciones y Escalaciones

### 13. Proceso de Excepciones
- **Principio**: Las reglas PMO no admiten excepciones sin autorización formal
- **Escalación**: Solicitudes de excepción deben dirigirse al PMO Director
- **Justificación**: Debe incluir impacto, riesgo, y propuesta de mitigación
- **Documentación**: Excepciones aprobadas deben documentarse y comunicarse

### 14. Autoridades Decisorias
- **PMO Director**: Autoridad final para cambios metodológicos mayores
- **PMO Manager**: Autorización de cambios menores y clarificaciones
- **Framework Specialists**: Validación técnica de implementaciones
- **Desarrollo**: Implementación siguiendo especificaciones PMO exactas

## Sanciones y Cumplimiento

### 15. Consecuencias de Incumplimiento
- **Rollback Inmediato**: Cualquier contenido que viole reglas PMO debe revertirse
- **Review Obligatorio**: Cambios futuros del responsable requieren doble validación
- **Escalación**: Incumplimientos reiterados se escalan a management
- **Responsabilidad**: Cada desarrollador es responsable de conocer y cumplir estas reglas

### 16. Monitoreo y Enforcement
- **Auditorías Regulares**: Review mensual de adherencia a reglas PMO
- **Métricas de Compliance**: KPIs específicos para cumplimiento de reglas
- **Feedback Loop**: Canal directo para reportar violaciones de reglas PMO
- **Mejora Continua**: Actualización periódica de reglas basada en lecciones aprendidas
# Changelog

Todos los cambios relevantes del proyecto se documentarán en este archivo.

El formato sigue las recomendaciones de Keep a Changelog y Semantic Versioning.

---

# [1.0.0]

## Added

- Extracción de proyectos desde Asana.
- Extracción de tareas y subtareas.
- Transformación de datos.
- Generación de datasets CSV.
- Publicación en Amazon S3.
- Compatibilidad con AWS Lambda.
- Métricas PMO por proyecto.

---

## Próxima versión

1.1.0

Objetivo:

Dashboard Ejecutivo en Amazon QuickSight.

### Added

- Diccionario gobernado del modelo semántico ejecutivo.
- Veintiséis campos calculados reutilizables y ocho definiciones de KPI.
- Organización de campos en ocho carpetas funcionales.
- Validación local y preflight create-only para QuickSight.
- Réplica S3 privada, cifrada y versionada en `us-east-1`.
- Tres data sources regionales para proyectos, tareas y métricas.
- Dataset SPICE `pmo-executive-semantic-v1-1` con unión 1:1.
- Análisis editable `pmo-executive-analysis-v1-1`.
- Dashboard publicado `pmo-executive-dashboard-v1-1`, versión 1.
- Ocho KPI ejecutivos en la hoja `01 - Resumen Ejecutivo`.

### Security

- El despliegue del modelo no escribe ni reemplaza objetos en Amazon S3.
- El script se detiene si el dataset de destino ya existe.
- QuickSight tiene acceso de solo lectura al bucket regional.
- Región operativa consolidada en `us-east-1`.
- Configuración ETL y manifiestos actualizados al bucket de N. Virginia.
- Secreto `pmo/asana` replicado en Secrets Manager de `us-east-1`.
- Recursos QuickSight y conexión VPC de QuickSight retirados de `us-east-2`.
- Secreto `pmo/asana` de Ohio programado para eliminación con recuperación de
  siete días.

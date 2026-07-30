# PMO Dashboard — Contexto del proyecto

## Identificación

- **Proyecto:** PMO Dashboard
- **Repositorio:** `pmo-asana-analytics`
- **Release estable declarada:** `v1.0.0`
- **Propósito:** extraer información de Asana, transformarla en datasets
  ejecutivos, publicarla en Amazon S3 y consumirla desde Amazon QuickSight.

Este documento describe el estado observado en el repositorio. No define cambios
de arquitectura ni compromisos futuros.

## Flujo funcional actual

El punto de entrada `src/exporter/app.py` ejecuta un proceso ETL con cuatro
etapas:

1. Consulta los proyectos de un portfolio de Asana.
2. Selecciona proyectos según el campo personalizado
   `Responsable Proyecto`.
3. Extrae tareas y subtareas, y calcula indicadores por proyecto.
4. Genera tres archivos CSV y los carga en Amazon S3.

La ejecución está preparada como handler de AWS Lambda mediante
`lambda_handler`. El mismo módulo también admite ejecución directa.

## Fuentes y alcance de datos

La fuente es la API REST de Asana. La configuración identifica:

- un workspace;
- un portfolio;
- una lista configurable de responsables de proyecto permitidos;
- un límite opcional de proyectos.

El token de Asana se obtiene desde AWS Secrets Manager. El secreto configurado
debe contener una propiedad JSON llamada `ASANA_TOKEN`.

## Salidas oficiales

Los siguientes nombres son contratos de integración y no deben cambiarse sin
autorización:

| Dataset | Granularidad | Destino S3 predeterminado |
|---|---|---|
| `projects.csv` | Una fila por proyecto seleccionado | `projects/projects.csv` |
| `tasks.csv` | Una fila por tarea o subtarea | `tasks/tasks.csv` |
| `project_metrics.csv` | Una fila de indicadores por proyecto | `project_metrics/project_metrics.csv` |

El repositorio contiene muestras generadas en `output/`. Los manifiestos de
`projects.csv` y `tasks.csv` describen archivos CSV con encabezado para su
consumo desde S3.

## Configuración operativa observada

| Elemento | Valor predeterminado |
|---|---|
| Región AWS | `us-east-1` |
| Bucket S3 | `pmo-asana-analytics-us-east-1-664858858204` |
| Secreto | `pmo/asana` |
| Tiempo máximo por solicitud a Asana | 60 segundos |
| Tamaño de página de Asana | 100 registros |
| Reintentos HTTP | 3 para errores transitorios y limitación de tasa |

La configuración se puede sobrescribir mediante variables de entorno definidas
en `src/exporter/config.py`.

## Réplica analítica en N. Virginia

Para alojar el modelo semántico en la región principal de QuickSight se creó
una réplica aislada en `us-east-1`:

- Bucket: `pmo-asana-analytics-us-east-1-664858858204`.
- Cifrado: AES-256.
- Acceso público: bloqueado.
- S3 Versioning: habilitado.
- Dataset QuickSight: `pmo-executive-semantic-v1-1`.
- Modo de importación: SPICE.
- Análisis: `pmo-executive-analysis-v1-1`.
- Dashboard: `pmo-executive-dashboard-v1-1`.

El despliegue conserva los tres contratos CSV oficiales. N. Virginia es la
región operativa del PMO Dashboard.

Los recursos QuickSight de Ohio fueron retirados. El secreto `pmo/asana` de
Ohio quedó programado para eliminación después de validar criptográficamente
su réplica en N. Virginia.

## Componentes principales

- `src/exporter/asana_client.py`: autenticación, paginación, reintentos y
  consultas a Asana.
- `src/exporter/project_service.py`: recuperación, validación y selección de
  proyectos.
- `src/exporter/task_service.py`: extracción y normalización de tareas y
  subtareas.
- `src/exporter/project_metrics_service.py`: cálculo de métricas, alertas y
  salud del proyecto.
- `src/exporter/csv_exporter.py`: escritura de CSV.
- `src/exporter/s3_repository.py`: publicación de archivos en S3.
- `src/exporter/app.py`: orquestación completa del ETL.

## Estado documental y de validación

Al momento de elaborar este documento:

- `README.md` está vacío;
- `cloudformation/analytics.yaml` está vacío;
- `tests/` no contiene pruebas;
- `data/current/` y `data/history/` no contienen datasets;
- existen logs y CSV de ejecuciones locales;
- existe un paquete `PMO-Dashboard-v1.0.0.zip`.

Estos elementos describen el estado del repositorio, pero por sí solos no
demuestran que el despliegue AWS esté automatizado ni que la release cuente con
pruebas automatizadas.

## Restricciones vigentes

Se debe conservar la arquitectura Asana → Python ETL → CSV → S3 → QuickSight.
No se deben incorporar servicios adicionales de datos, monitoreo o persistencia
sin aprobación previa. La estabilidad de `v1.0.0`, la seguridad de los secretos
y la compatibilidad de los datasets tienen prioridad.

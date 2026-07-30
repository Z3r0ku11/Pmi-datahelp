# Modelo semántico ejecutivo de PMO

Este directorio contiene la definición gobernada de la capa semántica de
QuickSight para la versión 1.1.0.

## Principios

- La granularidad es una fila por proyecto.
- `projects.csv` aporta dimensiones, presupuesto y capacidad.
- `project_metrics.csv` aporta avance, plazo, alertas y salud.
- La unión es `projects.PROJECT ID = project_metrics.project_gid`.
- `tasks.csv` no forma parte del dataset ejecutivo para evitar duplicar
  importes y contadores.
- Los objetos existentes de QuickSight y los objetos de S3 no se actualizan.

## Archivos

- `semantic-model.json`: diccionario funcional y técnico.
- `build-dataset-definition.ps1`: genera la definición nativa de QuickSight.
- `validate-semantic-model.ps1`: validación local del contrato.
- `deploy-semantic-model.ps1`: preflight y despliegue create-only.
- `build-executive-dashboard.ps1`: genera y publica el tema oscuro, análisis
  y dashboard ejecutivo con 18 visuales y 8 filtros globales.

## Despliegue

Primero se valida el modelo:

```powershell
.\quicksight\validate-semantic-model.ps1
```

Después se ejecuta un preflight, que no modifica AWS:

```powershell
.\quicksight\deploy-semantic-model.ps1 `
  -AwsAccountId 123456789012 `
  -ProjectsDataSourceArn <arn-proyectos> `
  -MetricsDataSourceArn <arn-metricas>
```

El despliegue real requiere `-Deploy`:

```powershell
.\quicksight\deploy-semantic-model.ps1 `
  -AwsAccountId 123456789012 `
  -ProjectsDataSourceArn <arn-proyectos> `
  -MetricsDataSourceArn <arn-metricas> `
  -Deploy
```

El script usa la región `us-east-1`, el perfil indicado en
`-AwsProfile` y el identificador `pmo-executive-semantic-v1-1`. Si ese
dataset ya existe, termina sin modificarlo.

## Requisitos previos

- Dos data sources de QuickSight basados en los manifiestos existentes de
  `projects.csv` y `project_metrics.csv`.
- Acceso de QuickSight al bucket
  `pmo-asana-analytics-us-east-1-664858858204`.
- Tipos numéricos confirmados para `Total presupuestado` y
  `Horas Planificadas`.
- Un perfil AWS autenticado y con permisos de lectura y creación en
  QuickSight.

## Despliegue en N. Virginia

La réplica regional utiliza:

```text
Bucket: pmo-asana-analytics-us-east-1-664858858204
Región: us-east-1
```

Los manifiestos regionales están en `manifests/us-east-1/`.

## Recursos ejecutivos

```text
Dataset:  pmo-executive-semantic-v1-1
Análisis: pmo-executive-analysis-v1-1
Dashboard: pmo-executive-dashboard-v1-1
```

La definición declarativa del análisis está en
`analysis/pmo-executive-analysis-v1-1.json`.

## Dashboard ejecutivo

El dashboard premium se genera primero en modo local:

```powershell
.\quicksight\build-executive-dashboard.ps1
```

La publicación actualiza únicamente el tema, análisis y dashboard de
QuickSight en `us-east-1`:

```powershell
.\quicksight\build-executive-dashboard.ps1 -Deploy
```

Los artefactos generados quedan en `quicksight/generated/`. El proceso no
escribe en S3 ni modifica recursos de QuickSight en otras regiones.

### Fechas

El dataset convierte las fechas operativas a `DATETIME` y el dashboard las
presenta como `DD-MM-YYYY`. Todas las fórmulas funcionales utilizan
`Fecha Inicio del proyecto` y `Fecha Planificada Termino del proyecto`.
`Dias para Finalizar` representa la diferencia entre la fecha planificada de
término y la fecha de corte; un valor negativo identifica días de atraso.
Los campos técnicos `start_on`, `due_on` y `days_to_finish` no se utilizan en
los cálculos ni en los visuales.

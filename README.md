# PMO Intelligence Platform

PMO Intelligence Platform (`PMO-IP`) centraliza la extracción de Asana,
la capa semántica de QuickSight y el portal ejecutivo de la PMO.

## Estado actual

La solución conserva el flujo contractual:

```text
Asana -> Python ETL -> CSV -> Amazon S3 -> Amazon QuickSight
```

Los datasets oficiales son:

- `projects.csv`
- `tasks.csv`
- `project_metrics.csv`

Los nombres, esquemas y destinos de estos archivos son contratos de
integración y no deben cambiarse sin una decisión explícita.

## Componentes

- `src/exporter/`: extracción, transformación y publicación en S3.
- `quicksight/`: modelo semántico, análisis, dashboard y validadores.
- `portal/`: portal ejecutivo publicado mediante S3 y CloudFront.
- `cloudformation/`: infraestructura declarativa.
- `scripts/`: despliegue, validación y snapshots.
- `tests/`: pruebas automatizadas.
- `docs/`: arquitectura, contexto, operación y roadmap.

## Desarrollo local

Requisitos:

- Python 3.12
- PowerShell 7
- AWS CLI v2

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m unittest discover -s tests -v
```

Las credenciales y el token de Asana no se almacenan en Git. El ETL obtiene
el token desde AWS Secrets Manager.

## Ambientes

- Región operativa: `us-east-1`
- Portal DEV: CloudFront
- Portal PROD: CloudFront
- QuickSight: Enterprise, usuario administrador estándar

## Piloto de Intelligence

La preparación de la Fase 2 y la migración del ETL a ECS Fargate están
descritas en [docs/PILOT_PHASE_2.md](docs/PILOT_PHASE_2.md).

## Seguridad

Nunca deben versionarse:

- `.env`;
- tokens o credenciales;
- CSV con datos reales;
- logs de ejecución;
- respaldos;
- salidas generadas;
- URLs temporales de QuickSight.

## Flujo Git

`main` representa la base estable. Los cambios se realizan en ramas breves,
se validan mediante CI y llegan a `main` por Pull Request.

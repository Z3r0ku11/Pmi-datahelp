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
- `src/intelligence/`: contratos de artefactos y validaciones de Fase II.
- `cloudformation/risk-analysis-dev.yaml`: generador serverless de riesgos DEV.
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

## Operación productiva

- Región operativa: `us-east-1`
- Bucket contractual: `pmo-asana-analytics-us-east-1-664858858204`
- Runtime: ECS Fargate
- Programación: EventBridge Scheduler, cada hora al minuto 5,
  `America/Santiago`
- Secuencia: Asana -> ECS -> CSV/manifiestos en S3 -> `CreateIngestion` de
  QuickSight
- Credencial Asana: AWS Secrets Manager, secreto `pmo/asana`

La ejecución horaria no depende de GitHub Actions, estaciones de trabajo ni
interacción humana. El ciclo de datos lo ejecuta AWS.

## Despliegue del ETL en producción

La infraestructura productiva está definida en
`cloudformation/asana-etl-prod.yaml`. AWS CodeBuild obtiene el código de la
rama publicada, construye la imagen dentro de AWS y la publica en ECR. ECS
Fargate ejecuta esa imagen y EventBridge Scheduler inicia el ciclo horario.

El Scheduler se crea inicialmente deshabilitado. Solo se habilita después de
publicar la imagen y validar una tarea Fargate productiva. El camino DEV
permanece deshabilitado para impedir que una ejecución secundaria escriba
datos contractuales.

La primera creación del stack requiere una sesión AWS autorizada para crear
los roles IAM, CodeBuild, ECR, ECS, red y Scheduler. El runtime no usa
credenciales fuera de AWS.

## Piloto de Intelligence

La preparación de la Fase 2 y la migración del ETL a ECS Fargate están
descritas en [docs/PILOT_PHASE_2.md](docs/PILOT_PHASE_2.md).

El generador de Matriz de Riesgos y sus límites operativos se documentan en
[docs/RISK_ANALYSIS_PILOT.md](docs/RISK_ANALYSIS_PILOT.md).

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

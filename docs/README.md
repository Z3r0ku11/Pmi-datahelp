# PMO Dashboard

Pipeline ETL desarrollado en Python para extraer información desde Asana, generar indicadores ejecutivos de PMO y publicar datasets en Amazon S3 para su consumo desde Amazon QuickSight.

---

# Objetivo

Automatizar la extracción y transformación de datos de Asana para construir un modelo analítico reutilizable que permita visualizar indicadores ejecutivos mediante Amazon QuickSight.

---

# Arquitectura

```
Asana
   │
   ▼
Python ETL
   │
   ▼
CSV
   │
   ▼
Amazon S3
   │
   ▼
Amazon QuickSight
```

---

# Características

- Extracción de proyectos.
- Extracción de tareas.
- Extracción de subtareas.
- Cálculo de métricas PMO.
- Generación de archivos CSV.
- Publicación en Amazon S3.
- Compatible con AWS Lambda.
- Ejecución local para desarrollo.

---

# Tecnologías

| Tecnología | Uso |
|------------|-----|
| Python 3.12 | ETL |
| Asana API | Fuente de datos |
| AWS Lambda | Ejecución |
| Amazon S3 | Almacenamiento |
| Amazon QuickSight | Visualización |
| AWS Secrets Manager | Credenciales |
| CloudFormation | Infraestructura |

---

# Estructura del proyecto

```text
pmo-asana-analytics/
│
├── cloudformation/
├── docs/
├── output/
├── src/
│   ├── exporter/
│   └── manifest/
├── tests/
│
├── AGENTS.md
├── CHANGELOG.md
├── README.md
└── requirements.txt
```

---

# Componentes principales

| Archivo | Responsabilidad |
|----------|-----------------|
| app.py | Punto de entrada |
| asana_client.py | Cliente Asana |
| project_service.py | Proyectos |
| task_service.py | Tareas |
| project_metrics_service.py | KPIs PMO |
| csv_exporter.py | Exportación CSV |
| s3_repository.py | Publicación S3 |
| config.py | Configuración |

---

# Datasets generados

| Dataset | Descripción |
|----------|-------------|
| projects.csv | Información de proyectos |
| tasks.csv | Información de tareas |
| project_metrics.csv | KPIs ejecutivos |

Estos datasets son consumidos por Amazon QuickSight.

---

# Configuración

El proyecto utiliza variables de entorno y AWS Secrets Manager.

No almacenar credenciales en el código fuente.

Variables principales:

- AWS_REGION
- S3_BUCKET
- SECRET_NAME
- ASANA_WORKSPACE_ID
- ASANA_PORTFOLIO_ID

---

# Instalación

Crear entorno virtual:

```bash
python -m venv .venv
```

Activar entorno:

Windows

```bash
.venv\Scripts\activate
```

Linux

```bash
source .venv/bin/activate
```

Instalar dependencias:

```bash
pip install -r requirements.txt
```

---

# Ejecución

Ejecutar el ETL:

```bash
python src/exporter/app.py
```

---

# Salida

El proceso genera:

```
projects.csv
tasks.csv
project_metrics.csv
```

Posteriormente son publicados en Amazon S3.

---

# Roadmap

## v1.0.0

✔ ETL operativo

## v1.1.0

Dashboard Ejecutivo QuickSight

## v1.2.0

Automatización

## v1.3.0

Forecast y Capacity Planning

---

# Documentación

Toda la documentación funcional y técnica se encuentra en:

```
docs/
```

- PROJECT_CONTEXT.md
- ARCHITECTURE.md
- DOMAIN.md
- ROADMAP.md
- BACKLOG.md

---

# Buenas prácticas

- PEP 8
- Type Hints
- Clean Code
- Variables de entorno
- AWS Secrets Manager
- Logging
- Manejo de excepciones
- Compatibilidad con QuickSight

---

# Versionado

El proyecto utiliza Semantic Versioning.

Versión actual:

```
v1.0.0
```

---

# Autor

Desarrollado como solución de analítica PMO basada en Asana y AWS.
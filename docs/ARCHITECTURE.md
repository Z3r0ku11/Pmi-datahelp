# Arquitectura del Sistema

## 1. Objetivo

El proyecto **PMO Dashboard** implementa un proceso ETL que extrae información desde Asana, transforma los datos en un modelo analítico y publica datasets en Amazon S3 para su consumo desde Amazon QuickSight.

La arquitectura está diseñada para ser simple, desacoplada y orientada al análisis de datos.

---

# 2. Arquitectura General

```text
                    +----------------------+
                    |       Asana API      |
                    +----------+-----------+
                               |
                               |
                     Extracción de Datos
                               |
                               ▼
                 +---------------------------+
                 |      Python ETL           |
                 |  (AWS Lambda / Local)     |
                 +-------------+-------------+
                               |
                +--------------+--------------+
                |                             |
                ▼                             ▼
        Transformación                 Métricas PMO
                |                             |
                +--------------+--------------+
                               |
                               ▼
                    Generación de CSV
                               |
                               ▼
                    Amazon S3 (Datasets)
                               |
                               ▼
                 Amazon QuickSight Dashboard
```

---

# 3. Componentes

## 3.1 Asana

Sistema origen de la información.

Responsabilidades:

- Proyectos
- Tareas
- Subtareas
- Responsables
- Fechas
- Estado

---

## 3.2 ETL Python

Responsable de:

- consumir la API
- transformar datos
- calcular indicadores
- generar datasets
- publicar archivos

Punto de entrada:

```
src/exporter/app.py
```

Puede ejecutarse:

- Localmente
- AWS Lambda

---

## 3.3 Amazon S3

Repositorio central de datasets.

Contiene los archivos:

```
projects.csv
tasks.csv
project_metrics.csv
```

S3 desacopla el proceso ETL de la capa de visualización.

---

## 3.4 Amazon QuickSight

Consume los datasets desde S3.

Responsabilidades:

- KPIs
- Dashboard Ejecutivo
- Visualizaciones
- Filtros
- Tendencias

QuickSight no consulta directamente Asana.

---

# 4. Flujo de Datos

## Paso 1

Obtención de proyectos desde Asana.

↓

## Paso 2

Obtención de tareas y subtareas.

↓

## Paso 3

Normalización de datos.

↓

## Paso 4

Cálculo de métricas PMO.

↓

## Paso 5

Generación de archivos CSV.

↓

## Paso 6

Carga hacia Amazon S3.

↓

## Paso 7

Consumo por Amazon QuickSight.

---

# 5. Componentes del Código

| Archivo | Responsabilidad |
|----------|-----------------|
| app.py | Punto de entrada del ETL |
| asana_client.py | Cliente API Asana |
| project_service.py | Obtención de proyectos |
| task_service.py | Obtención de tareas |
| project_metrics_service.py | Indicadores PMO |
| csv_exporter.py | Generación de CSV |
| s3_repository.py | Publicación en Amazon S3 |
| config.py | Configuración |
| models.py | Modelos de datos |
| utils.py | Funciones reutilizables |

---

# 6. Principios de Arquitectura

La solución se basa en los siguientes principios:

- Separación de responsabilidades.
- Configuración desacoplada mediante variables de entorno.
- Componentes reutilizables.
- Bajo acoplamiento.
- Alta cohesión.
- Simplicidad.
- Escalabilidad.

---

# 7. Seguridad

La solución considera las siguientes prácticas:

- Uso de AWS Secrets Manager para credenciales.
- No almacenar secretos en el código.
- Variables de entorno para configuración.
- Separación entre configuración y lógica.
- Acceso a AWS mediante IAM.

---

# 8. Escalabilidad

La arquitectura permite escalar mediante:

- AWS Lambda.
- Amazon S3.
- Procesamiento desacoplado.
- QuickSight como capa independiente de visualización.

No requiere cambios estructurales para aumentar el volumen de datos.

---

# 9. Costos

Los principales componentes de costo son:

- AWS Lambda (ejecución del ETL).
- Amazon S3 (almacenamiento).
- Amazon QuickSight (visualización).
- API de Asana.

La arquitectura evita componentes de alto costo como bases de datos administradas o clústeres analíticos.

---

# 10. Riesgos Técnicos

| Riesgo | Impacto | Mitigación |
|---------|----------|------------|
| Cambios en la API de Asana | Alto | Mantener encapsulado `asana_client.py` |
| Cambios en columnas de CSV | Alto | Mantener compatibilidad con QuickSight |
| Secretos expuestos | Alto | Uso exclusivo de AWS Secrets Manager |
| Crecimiento del volumen de datos | Medio | Optimizar procesamiento y particionado si es necesario |
| Cambios manuales en S3 | Medio | Mantener estructura controlada del bucket |

---

# 11. Decisiones Arquitectónicas

## Adoptadas

- Python como lenguaje principal.
- AWS Lambda para ejecución.
- Amazon S3 como almacenamiento.
- CSV como formato de intercambio.
- Amazon QuickSight como herramienta BI.

## Pendientes

- Automatización de la ejecución del ETL.
- Estrategia de historización de datos.
- Definición de políticas de retención.
- Versionado de datasets.

---

# 12. Restricciones

No modificar sin una decisión de arquitectura:

- Nombres de los datasets.
- Contrato de columnas.
- Flujo principal del ETL.
- Integración con QuickSight.
- Configuración de AWS Secrets Manager.

---

# 13. Evolución Esperada

La siguiente etapa del proyecto considera:

1. Construcción del Dashboard Ejecutivo.
2. Automatización de la ejecución.
3. Forecast y Capacity Planning.
4. Evolución incremental manteniendo compatibilidad con la Release estable.

---

# 14. Despliegue Regional de QuickSight

El modelo semántico ejecutivo de la versión 1.1.0 se despliega en
`us-east-1`, región principal de la cuenta QuickSight.

```text
Asana
  |
Python ETL
  |
CSV
  |
S3 us-east-1 (origen analítico versionado)
  |
  +-- QuickSight SPICE us-east-1
          |
          +-- PMO Executive Semantic Model
```

El despliegue regional mantiene los nombres `projects.csv`, `tasks.csv` y
`project_metrics.csv`. N. Virginia es la región operativa autorizada para S3,
Secrets Manager y QuickSight.

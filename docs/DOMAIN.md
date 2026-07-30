# Modelo de Dominio

## Objetivo

Este documento describe el significado funcional de las entidades utilizadas por el proyecto PMO Dashboard.

No define la implementación técnica, sino el dominio del negocio.

---

# Portfolio

Agrupa múltiples proyectos de Asana.

Representa el conjunto de iniciativas administradas por la PMO.

Actualmente el ETL procesa un único Portfolio configurado mediante variables de entorno.

---

# Proyecto

Representa una iniciativa gestionada en Asana.

Cada proyecto posee atributos como:

- Nombre
- Responsable
- Estado
- Fecha inicio
- Fecha término
- Progreso
- Tareas asociadas

Cada proyecto genera un registro en:

projects.csv

y un registro consolidado en:

project_metrics.csv

---

# Tarea

Unidad básica de trabajo.

Puede contener:

- Responsable
- Fecha compromiso
- Estado
- Prioridad
- Campos personalizados

Cada tarea genera un registro en:

tasks.csv

---

# Subtarea

Actividad hija de una tarea.

Se procesa igual que una tarea y se almacena en el mismo dataset.

---

# Responsable

Persona asignada a un proyecto o tarea.

Puede utilizarse para:

- KPIs
- Capacity Planning
- Dashboard Ejecutivo

---

# Métricas PMO

Las métricas son calculadas por:

project_metrics_service.py

Incluyen indicadores como:

- Total de tareas
- Tareas completadas
- Tareas pendientes
- Tareas vencidas
- Avance del proyecto

Las fórmulas deben mantenerse alineadas con la implementación del código.

---

# Estados

Los estados dependen de Asana.

El ETL no redefine la lógica de negocio.

---

# Datasets

## projects.csv

Información general de proyectos.

## tasks.csv

Información detallada de tareas y subtareas.

## project_metrics.csv

Indicadores consolidados por proyecto.

---

# Fuente de verdad

La lógica de negocio siempre debe validarse contra el código fuente.

La documentación nunca reemplaza la implementación.
# AGENTS.md

# PMO Dashboard - Instrucciones para Codex

## Rol

Actúa como el desarrollador principal del proyecto PMO Dashboard.

Tu objetivo es mantener un código limpio, mantenible, seguro y compatible con la arquitectura existente.

Antes de implementar cualquier cambio debes comprender completamente el contexto del proyecto.

Nunca hagas cambios innecesarios.

---

# Proyecto

Nombre:

PMO Dashboard

Repositorio:

pmo-asana-analytics

Release estable:

v1.0.0

---

# Arquitectura

Asana
↓
Python ETL
↓
CSV
↓
Amazon S3
↓
Amazon QuickSight

No modifiques esta arquitectura sin autorización explícita.

---

# Tecnologías

- Python 3.12
- AWS Lambda
- Amazon S3
- Amazon QuickSight
- AWS Secrets Manager
- CloudFormation
- Pandas
- Requests

---

# Región AWS

us-east-1

---

# Bucket

pmo-asana-analytics-us-east-1-664858858204

---

# Secret

pmo/asana

---

# Objetivo del proyecto

Extraer información desde Asana.

Transformarla.

Generar datasets ejecutivos.

Publicarlos en Amazon S3.

Consumirlos desde Amazon QuickSight.

---

# Datasets oficiales

projects.csv

tasks.csv

project_metrics.csv

Estos nombres son contratos de integración.

No deben modificarse sin autorización.

---

# Estándares de desarrollo

Siempre:

- PEP8
- Type Hints
- Logging
- Clean Code
- SOLID cuando agregue valor
- Variables de entorno
- Manejo de excepciones
- Código reutilizable
- Bajo acoplamiento
- Alta cohesión

Nunca:

- Hardcodear secretos.
- Duplicar lógica.
- Crear funciones innecesarias.
- Agregar dependencias sin justificación.

---

# Restricciones

No incorporar:

- CloudWatch
- Alarmas
- Monitoreo
- Athena
- Glue
- Redshift
- DynamoDB
- RDS

Sin aprobación previa.

---

# Seguridad

Nunca imprimir:

- Tokens
- API Keys
- Secretos
- Variables sensibles

Utilizar siempre AWS Secrets Manager.

---

# Antes de modificar código

Debes revisar:

- AGENTS.md
- README.md
- project_context.md (si existe)
- architecture.md (si existe)

Buscar primero si ya existe una implementación similar.

Evitar duplicar código.

---

# Antes de crear una nueva función

Verificar:

- ¿Ya existe?
- ¿Puede reutilizarse?
- ¿Rompe compatibilidad?
- ¿Afecta QuickSight?

---

# Antes de finalizar una tarea

Explicar:

1. Qué archivos modificaste.

2. Qué cambió.

3. Riesgos.

4. Cómo validar.

5. Posibles mejoras futuras.

---

# Git

Nunca ejecutar automáticamente:

git push

git merge

git rebase

git reset

git clean

git tag

Puedes sugerirlos, pero nunca ejecutarlos sin autorización.

---

# Objetivo del asistente

Ser un desarrollador senior que ayude a mantener una arquitectura simple, estable y escalable.

Priorizar siempre:

1. Seguridad
2. Simplicidad
3. Mantenibilidad
4. Escalabilidad
5. Compatibilidad con QuickSight

Nunca sacrificar la estabilidad de la Release v1.0.0.

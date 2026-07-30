# PMO-IP — Piloto de Fase 2

## Objetivo

Preparar PMO Intelligence Platform para:

1. ejecutar la extracción de Asana directamente en AWS;
2. eliminar la dependencia operativa del computador local;
3. incorporar lectura y clasificación documental de forma incremental;
4. conservar los contratos CSV y la integración actual con QuickSight.

## Orden de implementación

### Etapa 0 — Git y entrega continua

- Repositorio GitHub privado.
- `main` protegida.
- Pull Requests.
- CI para Python, portal y modelo semántico.
- GitHub OIDC para AWS, sin Access Keys persistentes.
- Despliegue DEV automático y PROD con aprobación.

### Etapa 1 — Asana ETL en AWS

```text
EventBridge Scheduler
        |
        v
ECS Fargate Task
        |
        +--> Secrets Manager: pmo/asana
        +--> Asana API
        +--> CSV contractuales
        +--> Amazon S3
        +--> CloudWatch Logs
        |
        v
Amazon QuickSight
```

Se utilizará Fargate porque la ejecución completa puede superar el límite de
15 minutos de AWS Lambda.

### Etapa 2 — Intelligence piloto

- Máximo inicial: 25 proyectos y 5.000 páginas al mes.
- S3 para documentos originales, normalizados y Knowledge Packs.
- Parser nativo para documentos digitales.
- Textract únicamente para escaneos.
- Bedrock Data Automation únicamente para documentos complejos.
- Nova Lite como modelo principal.
- Nova Pro como validación excepcional.
- Titan Text Embeddings V2.
- S3 Vectors.
- Validación humana antes de aprobar conocimiento.

## Recursos del ETL

- Repositorio Amazon ECR.
- Cluster ECS sin instancias permanentes.
- Task Definition Fargate.
- EventBridge Scheduler.
- IAM Task Role de mínimo privilegio.
- Security Group sin reglas de entrada.
- Acceso saliente HTTPS.
- Secreto existente `pmo/asana`.
- Bucket S3 DEV aislado; el bucket contractual actual se mantiene sin cambios.
- CloudWatch Logs.

Para evitar el costo permanente de un NAT Gateway, el piloto usará una tarea
Fargate efímera con conectividad pública saliente y sin puertos de entrada.
El stack DEV incluye una VPC mínima, dos subredes públicas y un Internet
Gateway porque la VPC existente de Control Tower solo posee subredes privadas.
Estos componentes no tienen cargo horario; el IPv4 público existe únicamente
durante cada ejecución de Fargate.

## Promoción DEV a PROD

DEV no publica en el bucket que consume QuickSight. Antes de promover:

1. ejecutar el ETL manualmente tres veces en DEV;
2. validar los tres CSV contractuales y revisar CloudWatch Logs;
3. comparar columnas y tipos con la versión productiva;
4. estimar el costo real con la duración observada;
5. aprobar explícitamente la promoción;
6. crear la configuración PROD apuntando al bucket contractual existente.

El calendario de DEV permanece deshabilitado hasta una decisión explícita.

## CloudWatch de bajo costo

Log groups:

```text
/pmo-ip/dev/asana-exporter
/pmo-ip/prod/asana-exporter
```

Configuración:

- DEV: retención de 7 días.
- PROD: retención de 14 días.
- Formato JSON estructurado.
- Nivel predeterminado `INFO`.
- Prohibido registrar tokens, documentos, tareas completas o datos sensibles.
- Un evento resumido por etapa, no por registro.
- Una alarma de fallo para PROD.
- Sin dashboard CloudWatch durante el piloto.

Campos mínimos:

```json
{
  "run_id": "uuid",
  "git_sha": "commit",
  "environment": "dev",
  "stage": "publish",
  "status": "success",
  "projects": 0,
  "tasks": 0,
  "duration_seconds": 0
}
```

Con una ejecución diaria y logs resumidos, el objetivo es mantener CloudWatch
por debajo de USD 1 mensual.

## Estimación mensual incremental

| Recurso | Estimación piloto |
|---|---:|
| Fargate, 1 vCPU y 2 GB, una hora diaria | USD 1,50 |
| ECR | USD 0,10 |
| Secrets Manager existente | sin incremento esperado |
| IPv4 temporal | USD 0,10–0,20 |
| EventBridge Scheduler | centavos |
| CloudWatch Logs y una alarma | USD 0,10–1,00 |
| S3 | centavos |
| Total ETL AWS | USD 2–4/mes |
| Intelligence, hasta 5.000 páginas | USD 10–20/mes |

El presupuesto recomendado para el piloto completo es de USD 30 mensuales.

## Criterios de salida del piloto

- Tres ejecuciones consecutivas del ETL en AWS.
- Los tres CSV coinciden con sus contratos.
- Cero secretos en Git o logs.
- Reintentos ante errores transitorios de Asana.
- Dashboard QuickSight actualizado desde los archivos publicados por AWS.
- Costos mensuales dentro del presupuesto.
- Knowledge Packs con evidencia y revisión humana.

## Restricciones preservadas

No se incorporan Athena, Glue, Redshift, DynamoDB ni RDS. La migración a
Fargate cambia el lugar de ejecución, pero no modifica el flujo funcional
Asana -> Python -> CSV -> S3 -> QuickSight.

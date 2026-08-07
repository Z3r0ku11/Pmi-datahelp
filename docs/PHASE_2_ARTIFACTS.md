# Fase II — Contrato inicial de artefactos

## Alcance del piloto

La primera entrega de Intelligence cubre tres artefactos vinculados:

1. EDT/WBS;
2. Plan o cronograma en semanas y horas;
3. Registro y matriz de riesgos.

La EDT es la estructura maestra. Las actividades del cronograma deben apuntar
a un código EDT y los riesgos pueden vincularse al paquete de trabajo que los
origina. El servicio genera un único `Project Knowledge Pack` normalizado por
proyecto.

## EDT / WBS

Campos mínimos:

| Campo | Regla |
|---|---|
| `code` | Identificador único, por ejemplo `1.2.1` |
| `parent_code` | Vacío para raíz o código EDT existente |
| `name` | Obligatorio |
| `deliverable` | Entregable verificable |
| `owner` | Responsable |
| `planned_hours` | Número mayor o igual a cero |

## Plan / Cronograma

Campos mínimos:

| Campo | Regla |
|---|---|
| `id` | Identificador único de actividad |
| `wbs_code` | Código EDT existente |
| `name` | Obligatorio |
| `owner` | Responsable |
| `start_date` / `end_date` | Fechas ISO `YYYY-MM-DD` cuando existan |
| `planned_hours` | Número mayor o igual a cero |
| `planned_weeks` | Calculado como horas / capacidad semanal |
| `dependencies` | IDs de actividades existentes |

La capacidad semanal predeterminada es 40 horas, pero se configura por
proyecto. Un valor vacío de horas se normaliza a cero.

## Riesgos

Cada análisis puede contener como máximo 10 riesgos consolidados y
priorizados. Si no existe evidencia suficiente, el resultado puede contener
menos de 10; nunca se crean riesgos únicamente para completar el límite.

Campos mínimos:

| Campo | Regla |
|---|---|
| `id` | Identificador único |
| `wbs_code` | Opcional; debe existir cuando se informa |
| `description` | Obligatorio |
| `category` | Predeterminado `General` |
| `probability` | Entero de 1 a 5; vacío equivale a 1 |
| `impact` | Entero de 1 a 5; vacío equivale a 1 |
| `score` | Probabilidad por impacto |
| `owner` | Responsable |
| `response` | Predeterminado `Mitigar` |
| `mitigation` | Acción de tratamiento |
| `status` | Predeterminado `Abierto` |

Bandas iniciales:

- 1–4: Bajo;
- 5–9: Medio;
- 10–16: Alto;
- 17–25: Crítico.

Estas bandas representan exposición al riesgo y no se reutilizan para el
índice de peso o complejidad del proyecto.

## Integración futura con IA

La IA no escribirá directamente artefactos aprobados. El flujo será:

```text
Documento -> extracción -> propuesta estructurada -> validación del contrato
          -> revisión humana -> versión aprobada del Knowledge Pack
```

Los campos propuestos por IA deberán conservar evidencia de origen,
confianza, fecha de extracción y estado de revisión. Ningún servicio de IA se
activa en esta primera entrega.

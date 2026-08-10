from __future__ import annotations

import logging
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from config import settings
from csv_exporter import CsvExporter
from health_snapshot_service import (
    HealthSnapshotService,
    PORTFOLIO_HEALTH_FIELDS,
    PROJECT_HEALTH_FIELDS,
)
from project_metrics_service import ProjectMetricsService
from project_service import ProjectService
from s3_repository import S3Repository
from task_service import TaskService
from utils import get_custom_field_value, get_custom_field_numeric_value

logging.basicConfig(
    level=logging.INFO,
    format=(
        "%(asctime)s | %(levelname)s | "
        "%(name)s | %(message)s"
    ),
)

logger = logging.getLogger(__name__)


PROJECT_FIELDS = [
    "NAME",
    "URL",
    "CREATED",
    "ALL TASKS",
    "COMPLETE",
    "INCOMPLETE",
    "STATUS COLOR",
    "PMO ID",
    "Fecha Inicio del proyecto",
    "Fecha Planificada Termino del proyecto",
    "Cliente",
    "Total presupuestado",
    "Fase del proyecto",
    "Responsable Proyecto",
    "AWS OPP ID",
    "Pais",
    "Tipo Proyecto",
    "Segmento empresa",
    "Horas Planificadas",
    "Fecha Termino Efectiva",
    "Pago Cliente",
    "Fondos AWS",
    "Incentivos",
    "Creditos AWS",
    "Inversion Morris",
    "Clasificación",
    "PROJECT ID",
    "LATEST STATUS UPDATE",
    "LATEST STATUS DATE",
    "DATA REFRESH",
]

PROJECT_CUSTOM_FIELDS = [
    "PMO ID",
    "Fecha Inicio del proyecto",
    "Fecha Planificada Termino del proyecto",
    "Cliente",
    "Total presupuestado",
    "Fase del proyecto",
    "Responsable Proyecto",
    "AWS OPP ID",
    "Pais",
    "Tipo Proyecto",
    "Segmento empresa",
    "Horas Planificadas",
    "Fecha Termino Efectiva",
    "Pago Cliente",
    "Fondos AWS",
    "Incentivos",
    "Creditos AWS",
    "Inversion Morris",
    "Clasificación",
]

NUMERIC_CUSTOM_FIELDS = {
    "Total presupuestado",
    "Horas Planificadas",
    "Pago Cliente",
    "Fondos AWS",
    "Incentivos",
    "Creditos AWS",
    "Inversion Morris",
}

PROJECT_STATUS_LABELS = {
    "green": "En Curso",
    "yellow": "En riesgo",
    "red": "Con retraso",
    "blue": "On Hold",
    "complete": "Finalizado",
    "dropped": "Descartado",
}

SYNC_METADATA_KEY = "metadata/last_sync.json"


TASK_FIELDS = [
    "project_gid",
    "project_name",
    "responsable_proyecto",
    "record_type",
    "task_gid",
    "task_name",
    "parent_task_gid",
    "parent_task_name",
    "section_name",
    "assignee_gid",
    "assignee_name",
    "completed",
    "completed_at",
    "created_at",
    "modified_at",
    "start_on",
    "start_at",
    "due_on",
    "due_at",
    "permalink_url",
]


PROJECT_METRICS_FIELDS = [
    "project_gid",
    "project_name",
    "responsable_proyecto",
    "owner_name",
    "project_status",
    "completed",
    "archived",
    "start_on",
    "due_on",
    "days_to_finish",
    "total_tasks",
    "completed_tasks",
    "pending_tasks",
    "overdue_tasks",
    "progress_pct",
    "overdue_tasks_pct",
    "pending_tasks_pct",
    "is_overdue",
    "due_within_7_days",
    "due_within_15_days",
    "due_within_30_days",
    "missing_due_date",
    "missing_responsible",
    "alert_level",
    "alert_label",
    "health_score",
    "health_status",
    "snapshot_date",
]


def build_project_records(
    projects: list[dict[str, Any]],
    tasks: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Construye el contrato PMO_Projects con una fila por proyecto.
    """
    records: list[dict[str, Any]] = []
    tasks_by_project: dict[str, list[dict[str, Any]]] = defaultdict(list)
    data_refresh = datetime.now(timezone.utc).isoformat()

    for task in tasks:
        project_gid = str(task.get("project_gid") or "")

        if project_gid:
            tasks_by_project[project_gid].append(task)

    for project in projects:
        if not isinstance(project, dict):
            logger.warning(
                "Proyecto omitido porque no es un diccionario: %s",
                type(project).__name__,
            )
            continue

        current_status = project.get("current_status") or {}

        if not isinstance(current_status, dict):
            current_status = {}

        custom_fields = project.get("custom_fields") or []

        if not isinstance(custom_fields, list):
            custom_fields = []

        project_gid = str(project.get("gid") or "")
        project_tasks = tasks_by_project.get(project_gid, [])
        complete = sum(
            1
            for task in project_tasks
            if bool(task.get("completed", False))
        )

        record = {
            "NAME": project.get("name") or "",
            "URL": project.get("permalink_url") or "",
            "CREATED": project.get("created_at") or "",
            "ALL TASKS": len(project_tasks),
            "COMPLETE": complete,
            "INCOMPLETE": len(project_tasks) - complete,
            "STATUS COLOR": get_project_status_label(
                status_color=current_status.get("color"),
                completed=bool(project.get("completed", False)),
                archived=bool(project.get("archived", False)),
            ),
            "PROJECT ID": project_gid,
            "LATEST STATUS UPDATE": (
                current_status.get("text")
                or current_status.get("title")
                or ""
            ),
            "LATEST STATUS DATE": (
                current_status.get("created_at") or ""
            ),
            "DATA REFRESH": data_refresh,
        }

        for field_name in PROJECT_CUSTOM_FIELDS:
            if field_name in NUMERIC_CUSTOM_FIELDS:
                record[field_name] = get_custom_field_numeric_value(
                    custom_fields=custom_fields,
                    field_name=field_name,
                )
            else:
                record[field_name] = get_custom_field_value(
                    custom_fields=custom_fields,
                    field_name=field_name,
                )

        records.append(record)

    return records


def get_project_status_label(
    status_color: Any,
    completed: bool = False,
    archived: bool = False,
) -> str:
    """Convierte el color de estado de Asana en una etiqueta PMO."""
    if completed:
        return "Finalizado"

    if archived:
        return "Descartado"

    normalized_color = str(status_color or "").strip().lower()

    if not normalized_color:
        return "On Hold"

    return PROJECT_STATUS_LABELS.get(
        normalized_color,
        str(status_color).strip(),
    )


def validate_project_result(
    project_result: Any,
) -> list[dict[str, Any]]:
    """
    Valida la estructura devuelta por ProjectService.
    """
    if not isinstance(project_result, dict):
        raise TypeError(
            "ProjectService no devolvió un diccionario válido."
        )

    projects = project_result.get(
        "projects",
        [],
    )

    if not isinstance(projects, list):
        raise TypeError(
            "ProjectService no devolvió una lista válida "
            "de proyectos."
        )

    invalid_indexes = [
        index
        for index, project in enumerate(projects)
        if not isinstance(project, dict)
    ]

    if invalid_indexes:
        raise TypeError(
            "ProjectService devolvió proyectos inválidos "
            f"en las posiciones: {invalid_indexes[:10]}"
        )

    return projects


def validate_task_records(
    tasks: Any,
) -> list[dict[str, Any]]:
    """
    Valida la estructura devuelta por TaskService.
    """
    if not isinstance(tasks, list):
        raise TypeError(
            "TaskService no devolvió una lista válida de tareas."
        )

    invalid_indexes = [
        index
        for index, task in enumerate(tasks)
        if not isinstance(task, dict)
    ]

    if invalid_indexes:
        raise TypeError(
            "TaskService devolvió registros inválidos "
            f"en las posiciones: {invalid_indexes[:10]}"
        )

    return tasks


def ensure_output_directory() -> Path:
    """
    Crea el directorio temporal o local donde se generarán los CSV.
    """
    output_directory = settings.output_path

    output_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    return output_directory


def lambda_handler(
    event: dict[str, Any] | None,
    context: Any,
) -> dict[str, Any]:
    """
    Ejecuta el pipeline:

    Asana -> proyectos y tareas -> métricas PMO -> CSV -> S3.
    """
    del event

    request_id = getattr(
        context,
        "aws_request_id",
        "local",
    )

    logger.info(
        "Iniciando ETL PMO | request_id=%s",
        request_id,
    )

    try:
        output_directory = ensure_output_directory()

        csv_exporter = CsvExporter()
        s3_repository = S3Repository()
        project_service = ProjectService()
        task_service = TaskService()
        metrics_service = ProjectMetricsService()
        health_snapshot_service = HealthSnapshotService()

        # Read last sync timestamp for incremental extraction
        last_sync_metadata = s3_repository.read_json(
            SYNC_METADATA_KEY
        )
        last_sync_timestamp = None
        if last_sync_metadata:
            last_sync_timestamp = last_sync_metadata.get(
                "last_sync_at"
            )
            logger.info(
                "Última sincronización: %s",
                last_sync_timestamp,
            )
        else:
            logger.info(
                "Primera ejecución: extracción completa"
            )

        sync_start = datetime.now(timezone.utc).isoformat()

        projects_path = (
            output_directory / "projects.csv"
        )
        tasks_path = (
            output_directory / "tasks.csv"
        )
        project_metrics_path = (
            output_directory / "project_metrics.csv"
        )
        project_health_snapshot_path = (
            output_directory / "project_health_snapshot.csv"
        )
        portfolio_health_snapshot_path = (
            output_directory / "portfolio_health_snapshot.csv"
        )

        # -----------------------------------------------------
        # 1. Proyectos
        # -----------------------------------------------------
        logger.info(
            "Iniciando extracción de proyectos desde Asana"
        )

        project_result = project_service.execute()
        projects = validate_project_result(
            project_result
        )

        # -----------------------------------------------------
        # 2. Tareas y subtareas
        # -----------------------------------------------------
        logger.info(
            "Iniciando extracción de tareas y subtareas"
        )

        tasks_result = task_service.execute(
            projects,
            modified_since=last_sync_timestamp,
            previous_tasks=(
                s3_repository.read_csv(settings.tasks_key)
                if last_sync_timestamp
                else None
            ),
        )

        tasks = validate_task_records(
            tasks_result
        )

        logger.info(
            "Tareas y subtareas obtenidas | registros=%s",
            len(tasks),
        )

        if tasks:
            logger.info(
                "Campos disponibles en tareas: %s",
                sorted(tasks[0].keys()),
            )

        tasks_file = csv_exporter.export(
            records=tasks,
            output_path=str(tasks_path),
            fieldnames=TASK_FIELDS,
        )

        logger.info(
            "Archivo de tareas generado | "
            "path=%s | registros=%s",
            tasks_file,
            len(tasks),
        )

        project_records = build_project_records(
            projects=projects,
            tasks=tasks,
        )

        logger.info(
            "Proyectos normalizados | registros=%s",
            len(project_records),
        )

        projects_file = csv_exporter.export(
            records=project_records,
            output_path=str(projects_path),
            fieldnames=PROJECT_FIELDS,
        )

        logger.info(
            "Archivo de proyectos generado | "
            "path=%s | registros=%s",
            projects_file,
            len(project_records),
        )

        # -----------------------------------------------------
        # 3. Métricas ejecutivas
        # -----------------------------------------------------
        logger.info(
            "Iniciando cálculo de métricas ejecutivas PMO"
        )

        project_metrics = (
            metrics_service.build_metrics(
                projects=projects,
                tasks=tasks,
            )
        )

        if len(project_metrics) != len(
            project_records
        ):
            logger.warning(
                "La cantidad de métricas no coincide con "
                "la cantidad de proyectos | "
                "proyectos=%s | métricas=%s",
                len(project_records),
                len(project_metrics),
            )

        project_metrics_file = (
            csv_exporter.export(
                records=project_metrics,
                output_path=str(
                    project_metrics_path
                ),
                fieldnames=PROJECT_METRICS_FIELDS,
            )
        )

        logger.info(
            "Archivo de métricas generado | "
            "path=%s | registros=%s",
            project_metrics_file,
            len(project_metrics),
        )

        # -----------------------------------------------------
        # 4. Snapshot mensual de salud
        # -----------------------------------------------------
        (
            project_health_snapshot,
            portfolio_health_snapshot,
        ) = health_snapshot_service.build(
            projects=project_records,
        )
        project_health_snapshot_file = csv_exporter.export(
            records=project_health_snapshot,
            output_path=str(project_health_snapshot_path),
            fieldnames=PROJECT_HEALTH_FIELDS,
        )
        portfolio_health_snapshot_file = csv_exporter.export(
            records=portfolio_health_snapshot,
            output_path=str(portfolio_health_snapshot_path),
            fieldnames=PORTFOLIO_HEALTH_FIELDS,
        )
        project_health_snapshot_key = (
            health_snapshot_service.project_object_key(
                settings.project_health_history_prefix
            )
        )
        portfolio_health_snapshot_key = (
            health_snapshot_service.portfolio_object_key(
                settings.portfolio_health_history_prefix
            )
        )

        # -----------------------------------------------------
        # 5. Carga a S3
        # -----------------------------------------------------
        logger.info(
            "Iniciando carga de archivos a S3 | bucket=%s",
            settings.s3_bucket,
        )

        s3_repository.upload_file(
            local_path=str(projects_file),
            object_key=settings.projects_key,
        )

        s3_repository.upload_file(
            local_path=str(tasks_file),
            object_key=settings.tasks_key,
        )

        s3_repository.upload_file(
            local_path=str(
                project_metrics_file
            ),
            object_key=(
                settings.project_metrics_key
            ),
        )
        s3_repository.upload_file(
            local_path=str(project_health_snapshot_file),
            object_key=project_health_snapshot_key,
        )
        s3_repository.upload_file(
            local_path=str(portfolio_health_snapshot_file),
            object_key=portfolio_health_snapshot_key,
        )

        # -----------------------------------------------------
        # 6. Guardar timestamp de sincronización
        # -----------------------------------------------------
        s3_repository.write_json(
            object_key=SYNC_METADATA_KEY,
            data={
                "last_sync_at": sync_start,
                "request_id": request_id,
                "projects_count": len(project_records),
                "tasks_count": len(tasks),
            },
        )

        logger.info(
            "Metadata de sincronización guardada | timestamp=%s",
            sync_start,
        )

        result = {
            "statusCode": 200,
            "requestId": request_id,
            "projects": len(project_records),
            "tasksAndSubtasks": len(tasks),
            "projectMetrics": len(
                project_metrics
            ),
            "files": {
                "projects": str(projects_file),
                "tasks": str(tasks_file),
                "projectMetrics": str(
                    project_metrics_file
                ),
                "projectHealthSnapshot": str(
                    project_health_snapshot_file
                ),
                "portfolioHealthSnapshot": str(
                    portfolio_health_snapshot_file
                ),
            },
            "s3Uris": {
                "projects": (
                    f"s3://{settings.s3_bucket}/"
                    f"{settings.projects_key}"
                ),
                "tasks": (
                    f"s3://{settings.s3_bucket}/"
                    f"{settings.tasks_key}"
                ),
                "projectMetrics": (
                    f"s3://{settings.s3_bucket}/"
                    f"{settings.project_metrics_key}"
                ),
                "projectHealthSnapshot": (
                    f"s3://{settings.s3_bucket}/"
                    f"{project_health_snapshot_key}"
                ),
                "portfolioHealthSnapshot": (
                    f"s3://{settings.s3_bucket}/"
                    f"{portfolio_health_snapshot_key}"
                ),
            },
        }

        logger.info(
            "ETL PMO finalizado correctamente | "
            "proyectos=%s | "
            "tareas_subtareas=%s | "
            "métricas=%s | "
            "bucket=%s",
            len(project_records),
            len(tasks),
            len(project_metrics),
            settings.s3_bucket,
        )

        return result

    except Exception:
        logger.exception(
            "Error crítico ejecutando ETL PMO | "
            "request_id=%s",
            request_id,
        )
        raise


if __name__ == "__main__":
    print(lambda_handler(None, None))

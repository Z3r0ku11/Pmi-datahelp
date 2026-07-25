from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from config import settings
from csv_exporter import CsvExporter
from project_metrics_service import ProjectMetricsService
from project_service import ProjectService
from s3_repository import S3Repository
from task_service import TaskService

logging.basicConfig(
    level=logging.INFO,
    format=(
        "%(asctime)s | %(levelname)s | "
        "%(name)s | %(message)s"
    ),
)

logger = logging.getLogger(__name__)


PROJECT_FIELDS = [
    "project_gid",
    "project_name",
    "responsable_proyecto",
    "owner_name",
    "archived",
    "completed",
    "created_at",
    "modified_at",
    "start_on",
    "due_on",
    "status_title",
    "status_color",
    "permalink_url",
]


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
) -> list[dict[str, Any]]:
    """
    Normaliza los proyectos obtenidos desde Asana.
    """
    records: list[dict[str, Any]] = []

    for project in projects:
        if not isinstance(project, dict):
            logger.warning(
                "Proyecto omitido porque no es un diccionario: %s",
                type(project).__name__,
            )
            continue

        owner = project.get("owner") or {}

        if not isinstance(owner, dict):
            owner = {}

        current_status = project.get("current_status") or {}

        if not isinstance(current_status, dict):
            current_status = {}

        records.append(
            {
                "project_gid": str(
                    project.get("gid") or ""
                ),
                "project_name": (
                    project.get("name") or ""
                ),
                "responsable_proyecto": (
                    project.get(
                        "responsable_proyecto"
                    )
                    or ""
                ),
                "owner_name": (
                    owner.get("name") or ""
                ),
                "archived": project.get(
                    "archived",
                    False,
                ),
                "completed": project.get(
                    "completed",
                    False,
                ),
                "created_at": (
                    project.get("created_at") or ""
                ),
                "modified_at": (
                    project.get("modified_at") or ""
                ),
                "start_on": (
                    project.get("start_on") or ""
                ),
                "due_on": (
                    project.get("due_on") or ""
                ),
                "status_title": (
                    current_status.get("title") or ""
                ),
                "status_color": (
                    current_status.get("color") or ""
                ),
                "permalink_url": (
                    project.get("permalink_url") or ""
                ),
            }
        )

    return records


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

        projects_path = (
            output_directory / "projects.csv"
        )
        tasks_path = (
            output_directory / "tasks.csv"
        )
        project_metrics_path = (
            output_directory / "project_metrics.csv"
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

        project_records = build_project_records(
            projects
        )

        logger.info(
            "Proyectos normalizados | registros=%s",
            len(project_records),
        )

        if project_records:
            logger.info(
                "Campos disponibles en proyectos: %s",
                sorted(project_records[0].keys()),
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
        # 2. Tareas y subtareas
        # -----------------------------------------------------
        logger.info(
            "Iniciando extracción de tareas y subtareas"
        )

        tasks_result = task_service.execute(
            projects
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

        # -----------------------------------------------------
        # 3. Métricas ejecutivas
        # -----------------------------------------------------
        logger.info(
            "Iniciando cálculo de métricas ejecutivas PMO"
        )

        project_metrics = (
            metrics_service.build_metrics(
                projects=project_records,
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
        # 4. Carga a S3
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
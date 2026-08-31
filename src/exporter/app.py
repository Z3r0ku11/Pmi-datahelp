from __future__ import annotations

import logging
from collections import defaultdict
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

from config import settings
from csv_exporter import CsvExporter
from derived_datasets import build_derived_artifacts
from health_snapshot_service import (
    HealthSnapshotService,
    PORTFOLIO_HEALTH_FIELDS,
    PROJECT_HEALTH_FIELDS,
)
from project_metrics_service import ProjectMetricsService
from project_service import ProjectService
from quicksight_ingestion import QuickSightIngestionService
from s3_repository import S3Repository
from task_service import TaskService
from utils import (
    get_custom_field_value,
    get_custom_field_numeric_value,
    get_project_filter_dimensions,
)

logging.basicConfig(
    level=logging.INFO,
    format=(
        "%(asctime)s | %(levelname)s | "
        "%(name)s | %(message)s"
    ),
)

logger = logging.getLogger(__name__)
SANTIAGO_TZ = ZoneInfo("America/Santiago")


def parse_effective_end_date(value: Any) -> date | None:
    """Parse the effective end date used to determine project closure."""
    if value is None:
        return None
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.date()
        return value.astimezone(SANTIAGO_TZ).date()
    if isinstance(value, date):
        return value

    text = str(value).strip()
    if not text:
        return None
    try:
        if len(text) == 10:
            return date.fromisoformat(text)
        parsed = datetime.fromisoformat(text.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            return parsed.date()
        return parsed.astimezone(SANTIAGO_TZ).date()
    except ValueError:
        return None


def santiago_today() -> date:
    """Return today's date in the business timezone."""
    return datetime.now(SANTIAGO_TZ).date()


def _publish_progress(
    stage: str,
    percentage: int,
    message: str,
) -> None:
    """Registra el avance sin requerir un servicio externo de progreso."""
    logger.info(
        "Progreso ETL | etapa=%s | porcentaje=%s | mensaje=%s",
        stage,
        percentage,
        message,
    )


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
    "Grupo Responsable",
    "Año Proyecto",
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
    "update Asana",
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

FINANCIAL_RESOURCE_TYPES = [
    ("Pago Cliente", "Pago Cliente"),
    ("Fondos AWS", "Fondos AWS"),
    ("Incentivos", "Incentivos"),
    ("Creditos AWS", "Creditos AWS"),
    ("Inversion Morris", "Inversion Morris"),
]

FINANCIAL_BREAKDOWN_FIELDS = [
    "project_gid",
    "project_name",
    "tipo_recurso",
    "monto",
]


TASK_FIELDS = [
    "project_gid",
    "project_name",
    "responsable_proyecto",
    "pmo_id",
    "project_year",
    "responsable_grupo",
    "record_type",
    "resource_type",
    "resource_subtype",
    "deleted",
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
    "pmo_id",
    "project_year",
    "responsable_grupo",
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
    "tasks_closed_7d",
    "tasks_modified_7d",
    "has_weekly_update",
    "pm_activity_score",
    "governance_update_score",
    "has_valid_section",
    "has_valid_milestone",
    "has_valid_top_level_task",
    "has_valid_subtask",
    "governance_structure_score",
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
        effective_end_value = get_custom_field_value(
            custom_fields=custom_fields,
            field_name="Fecha Termino Efectiva",
        )
        complete = sum(
            1
            for task in project_tasks
            if str(task.get("completed", "")).strip().lower()
            in ("true", "1", "yes")
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
                effective_end_date=effective_end_value,
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
            "update Asana": data_refresh,
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

        dimensions = get_project_filter_dimensions(project)
        record["Grupo Responsable"] = dimensions["responsable_grupo"]
        record["Año Proyecto"] = dimensions["project_year"]
        records.append(record)

    return records


def get_project_status_label(
    status_color: Any,
    completed: bool = False,
    archived: bool = False,
    effective_end_date: Any = None,
    evaluation_date: date | None = None,
) -> str:
    """Convert Asana status and effective closure into a PMO label."""
    if completed:
        return "Finalizado"

    if archived:
        return "Descartado"

    effective_date = parse_effective_end_date(effective_end_date)
    current_date = evaluation_date or santiago_today()
    if effective_date is not None and effective_date <= current_date:
        return "Finalizado"

    normalized_color = str(status_color or "").strip().lower()

    if not normalized_color:
        return "On Hold"

    return PROJECT_STATUS_LABELS.get(
        normalized_color,
        str(status_color).strip(),
    )


def build_financial_breakdown(
    project_records: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Genera un dataset unpivot de recursos financieros.

    Cada proyecto genera hasta 6 filas (una por tipo de recurso + residual)
    solo si el monto es mayor a 0. La categoría 'Otros (Sin registro)'
    cubre la diferencia entre Total presupuestado y la suma de fuentes.
    """
    breakdown: list[dict[str, Any]] = []
    for record in project_records:
        project_gid = record.get("PROJECT ID", "")
        project_name = record.get("NAME", "")
        total_sources = 0.0
        for field_name, label in FINANCIAL_RESOURCE_TYPES:
            raw_value = record.get(field_name)
            try:
                monto = float(raw_value) if raw_value else 0.0
            except (ValueError, TypeError):
                monto = 0.0
            if monto > 0:
                breakdown.append(
                    {
                        "project_gid": project_gid,
                        "project_name": project_name,
                        "tipo_recurso": label,
                        "monto": monto,
                    }
                )
                total_sources += monto
        # Residual: diferencia con Total presupuestado
        raw_budget = record.get("Total presupuestado")
        try:
            budget = float(raw_budget) if raw_budget else 0.0
        except (ValueError, TypeError):
            budget = 0.0
        residual = budget - total_sources
        if residual > 0:
            breakdown.append(
                {
                    "project_gid": project_gid,
                    "project_name": project_name,
                    "tipo_recurso": "Otros (Sin registro)",
                    "monto": residual,
                }
            )
    return breakdown


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

        if settings.force_full_sync:
            logger.info(
                "Extracción completa forzada: se ignorará metadata/last_sync.json"
            )
            last_sync_metadata = None
        else:
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
                "Primera ejecución o extracción completa"
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

        _publish_progress(
            "Extrayendo proyectos",
            5,
            "Conectando con Asana y consultando el portafolio",
        )

        project_result = project_service.execute()
        projects = validate_project_result(
            project_result
        )
        _publish_progress(
            "Extrayendo proyectos",
            40,
            f"{len(projects)} proyectos seleccionados; iniciando tareas",
        )

        # -----------------------------------------------------
        # 2. Tareas y subtareas
        # -----------------------------------------------------
        logger.info(
            "Iniciando extracción de tareas y subtareas"
        )

        _publish_progress(
            "Extrayendo tareas",
            40,
            f"{len(projects)} proyectos encontrados. Obteniendo tareas...",
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
        _publish_progress(
            "Extrayendo tareas",
            75,
            f"{len(tasks)} tareas y subtareas obtenidas",
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
        # 2b. Financial breakdown (unpivot)
        # -----------------------------------------------------
        financial_breakdown_path = (
            output_directory / "financial_breakdown.csv"
        )
        financial_breakdown = build_financial_breakdown(
            project_records=project_records,
        )
        financial_breakdown_file = csv_exporter.export(
            records=financial_breakdown,
            output_path=str(financial_breakdown_path),
            fieldnames=FINANCIAL_BREAKDOWN_FIELDS,
        )
        logger.info(
            "Archivo de breakdown financiero generado | "
            "path=%s | registros=%s",
            financial_breakdown_file,
            len(financial_breakdown),
        )

        # -----------------------------------------------------
        # 3. Métricas ejecutivas
        # -----------------------------------------------------
        logger.info(
            "Iniciando cálculo de métricas ejecutivas PMO"
        )

        _publish_progress(
            "Calculando métricas",
            80,
            f"{len(tasks)} tareas extraídas. Generando métricas...",
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
        # 3b. Datasets derivados para QuickSight
        # -----------------------------------------------------
        derived_artifacts = build_derived_artifacts(
            projects=project_records,
            tasks=tasks,
            metrics=project_metrics,
        )
        derived_files = []
        for artifact in derived_artifacts:
            local_path = output_directory / artifact.key.replace("/", "_")
            derived_file = csv_exporter.export(
                records=artifact.records,
                output_path=str(local_path),
                fieldnames=artifact.fieldnames,
            )
            derived_files.append((artifact, derived_file))

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

        _publish_progress(
            "Subiendo a S3",
            90,
            "CSV generados. Publicando archivos contractuales en S3...",
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
            local_path=str(financial_breakdown_file),
            object_key=settings.financial_breakdown_key,
        )
        s3_repository.upload_file(
            local_path=str(project_health_snapshot_file),
            object_key=project_health_snapshot_key,
        )
        s3_repository.upload_file(
            local_path=str(portfolio_health_snapshot_file),
            object_key=portfolio_health_snapshot_key,
        )

        s3_repository.write_manifest(
            object_key="financial_breakdown/manifest.json",
            csv_key=settings.financial_breakdown_key,
        )
        for artifact, derived_file in derived_files:
            s3_repository.upload_file(
                local_path=str(derived_file),
                object_key=artifact.key,
            )
            s3_repository.write_manifest(
                object_key=artifact.manifest_key,
                csv_key=artifact.key,
            )

        published_keys = [
            settings.projects_key,
            settings.tasks_key,
            settings.project_metrics_key,
            settings.financial_breakdown_key,
            "financial_breakdown/manifest.json",
            project_health_snapshot_key,
            portfolio_health_snapshot_key,
        ] + [
            key
            for artifact, _ in derived_files
            for key in (artifact.key, artifact.manifest_key)
        ]
        for published_key in published_keys:
            size = s3_repository.head_object(published_key)
            logger.info(
                "Objeto S3 validado | key=%s | bytes=%s",
                published_key,
                size,
            )

        # Replicar a bucket secundario (PROD)
        if settings.secondary_s3_bucket:
            logger.info(
                "Replicando archivos a bucket secundario | bucket=%s",
                settings.secondary_s3_bucket,
            )
            for local, key in [
                (projects_file, settings.projects_key),
                (tasks_file, settings.tasks_key),
                (project_metrics_file, settings.project_metrics_key),
                (financial_breakdown_file, settings.financial_breakdown_key),
                (project_health_snapshot_file, project_health_snapshot_key),
                (portfolio_health_snapshot_file, portfolio_health_snapshot_key),
            ]:
                try:
                    s3_repository.upload_file(
                        local_path=str(local),
                        object_key=key,
                        bucket=settings.secondary_s3_bucket,
                    )
                except Exception:
                    logger.warning(
                        "No fue posible replicar a bucket secundario | key=%s",
                        key,
                        exc_info=True,
                    )

        # -----------------------------------------------------
        # 6. Guardar timestamp de sincronización
        # -----------------------------------------------------
        _publish_progress(
            "Completado", 100,
            f"{len(project_records)} proyectos, {len(tasks)} tareas"
        )

        s3_repository.write_json(
            object_key=SYNC_METADATA_KEY,
            data={
                "last_sync_at": sync_start,
                "request_id": request_id,
                "projects_count": len(project_records),
                "tasks_count": len(tasks),
            },
        )

        # Publicar estado en bucket del portal (visible en frontend)
        if settings.portal_bucket:
            try:
                import boto3 as _boto3
                portal_s3 = _boto3.client(
                    "s3", region_name=settings.aws_region
                )
                import json as _json
                portal_s3.put_object(
                    Bucket=settings.portal_bucket,
                    Key="sync_status.json",
                    Body=_json.dumps({
                        "last_sync_at": sync_start,
                        "projects": len(project_records),
                        "tasks": len(tasks),
                    }, ensure_ascii=False),
                    ServerSideEncryption="AES256",
                    ContentType="application/json",
                    CacheControl="no-cache, no-store, must-revalidate",
                )
                logger.info(
                    "sync_status.json publicado en portal | bucket=%s",
                    settings.portal_bucket,
                )
            except Exception:
                logger.warning(
                    "No fue posible publicar sync_status.json en el portal",
                    exc_info=True,
                )

        # Publicar sync_status en portal secundario (PROD)
        if settings.secondary_portal_bucket:
            try:
                import boto3 as _boto3
                import json as _json
                portal_s3 = _boto3.client(
                    "s3", region_name=settings.aws_region
                )
                portal_s3.put_object(
                    Bucket=settings.secondary_portal_bucket,
                    Key="sync_status.json",
                    Body=_json.dumps({
                        "last_sync_at": sync_start,
                        "projects": len(project_records),
                        "tasks": len(tasks),
                    }, ensure_ascii=False),
                    ServerSideEncryption="AES256",
                    ContentType="application/json",
                    CacheControl="no-cache, no-store, must-revalidate",
                )
                logger.info(
                    "sync_status.json publicado en portal PROD | bucket=%s",
                    settings.secondary_portal_bucket,
                )
            except Exception:
                logger.warning(
                    "No fue posible publicar sync_status.json en portal PROD",
                    exc_info=True,
                )

        logger.info(
            "Metadata de sincronización guardada | timestamp=%s",
            sync_start,
        )

        ingestion_results = QuickSightIngestionService().start_all(
            run_id=(
                "etl-prod-"
                + sync_start.replace("-", "").replace(":", "").replace("+00:00", "Z")
            )
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
                "derived": [
                    {
                        "key": artifact.key,
                        "records": len(artifact.records),
                    }
                    for artifact, _ in derived_files
                ],
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
                "financialBreakdown": (
                    f"s3://{settings.s3_bucket}/"
                    f"{settings.financial_breakdown_key}"
                ),
                "derived": [
                    f"s3://{settings.s3_bucket}/{artifact.key}"
                    for artifact, _ in derived_files
                ],
            },
            "quickSightIngestions": ingestion_results,
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

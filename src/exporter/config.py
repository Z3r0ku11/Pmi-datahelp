from __future__ import annotations

import os
import tempfile
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()


def _get_bool(
    environment_variable: str,
    default: bool = False,
) -> bool:
    """Read a boolean environment variable with a safe default."""
    raw_value = os.getenv(environment_variable)
    if raw_value is None:
        return default
    return raw_value.strip().lower() in ("1", "true", "yes", "on")


def _get_optional_int(
    environment_variable: str,
) -> int | None:
    raw_value = os.getenv(environment_variable)

    if raw_value is None or not raw_value.strip():
        return None

    try:
        value = int(raw_value)
    except ValueError as exc:
        raise ValueError(
            f"La variable {environment_variable} debe ser un entero."
        ) from exc

    if value <= 0:
        raise ValueError(
            f"La variable {environment_variable} debe ser mayor que cero."
        )

    return value


def _get_csv_values(
    environment_variable: str,
    default: tuple[str, ...],
) -> tuple[str, ...]:
    raw_value = os.getenv(environment_variable)
    if raw_value is None or not raw_value.strip():
        return default
    values = tuple(value.strip() for value in raw_value.split(",") if value.strip())
    if not values:
        raise ValueError(
            f"{environment_variable} no contiene valores válidos."
        )
    return values


def _get_project_managers() -> tuple[str, ...]:
    default_managers = (
        "Carlo Sorrel",
        "Daniel Barrios",
        "Fernando Moreno",
        "Sebastian Neira",
        "Luis Montero",
        "Denisse Arce",
        "Hector Cayul",
        "Victor Vivallo",
    )

    raw_value = os.getenv("ALLOWED_PROJECT_MANAGERS")

    if raw_value is None or not raw_value.strip():
        return default_managers

    managers = tuple(
        manager.strip()
        for manager in raw_value.split(",")
        if manager.strip()
    )

    if not managers:
        raise ValueError(
            "ALLOWED_PROJECT_MANAGERS no contiene valores válidos."
        )

    return managers


@dataclass(frozen=True)
class Settings:
    aws_region: str = os.getenv(
        "AWS_REGION",
        "us-east-1",
    )

    aws_account_id: str = os.getenv(
        "AWS_ACCOUNT_ID",
        "664858858204",
    )

    secret_name: str = os.getenv(
        "SECRET_NAME",
        "pmo/asana",
    )

    workspace_id: str = os.getenv(
        "ASANA_WORKSPACE_ID",
        "677426918442017",
    )

    portfolio_id: str = os.getenv(
        "ASANA_PORTFOLIO_ID",
        "1207850474099261",
    )

    s3_bucket: str = os.getenv(
        "S3_BUCKET",
        "pmo-asana-analytics-us-east-1-664858858204",
    )

    projects_key: str = os.getenv(
        "PROJECTS_KEY",
        "projects/projects.csv",
    )

    tasks_key: str = os.getenv(
        "TASKS_KEY",
        "tasks/tasks.csv",
    )

    project_metrics_key: str = os.getenv(
        "PROJECT_METRICS_KEY",
        "project_metrics/project_metrics.csv",
    )

    financial_breakdown_key: str = os.getenv(
        "FINANCIAL_BREAKDOWN_KEY",
        "financial_breakdown/financial_breakdown.csv",
    )

    project_health_history_prefix: str = os.getenv(
        "PROJECT_HEALTH_HISTORY_PREFIX",
        "history/project_health",
    )

    portfolio_health_history_prefix: str = os.getenv(
        "PORTFOLIO_HEALTH_HISTORY_PREFIX",
        "history/portfolio_health",
    )

    portal_bucket: str = os.getenv(
        "PORTAL_BUCKET",
        "",
    )

    secondary_s3_bucket: str = os.getenv(
        "SECONDARY_S3_BUCKET",
        "",
    )

    secondary_portal_bucket: str = os.getenv(
        "SECONDARY_PORTAL_BUCKET",
        "",
    )

    quicksight_ingestion_enabled: bool = _get_bool(
        "QUICKSIGHT_INGESTION_ENABLED",
        default=False,
    )

    quicksight_dataset_ids: tuple[str, ...] = _get_csv_values(
        "QUICKSIGHT_DATASET_IDS",
        (
            "pmo-dataset-unificado-v1",
            "pmo-financial-breakdown-v1",
            "pmo-project-s-curve-dev",
            "pmo-project-timeline-dev",
            "pmo-project-load-timeline-v1",
            "pmo-pm-compliance-v1",
            "facturacion_proyectos_proximos_finalizar",
            "facturacion_proyectos_proximos_finalizar_resumen",
        ),
    )

    force_full_sync: bool = _get_bool(
        "FORCE_FULL_SYNC",
        default=False,
    )

    include_all_projects: bool = _get_bool(
        "INCLUDE_ALL_PROJECTS",
        default=False,
    )

    output_directory: str = os.getenv(
        "OUTPUT_DIRECTORY",
        tempfile.gettempdir(),
    )

    max_projects: int | None = _get_optional_int(
        "MAX_PROJECTS"
    )

    allowed_project_managers: tuple[str, ...] = (
        _get_project_managers()
    )

    @property
    def output_path(self) -> Path:
        return Path(self.output_directory)


settings = Settings()

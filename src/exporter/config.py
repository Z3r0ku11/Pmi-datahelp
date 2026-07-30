from __future__ import annotations

import os
import tempfile
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()


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

    project_health_history_prefix: str = os.getenv(
        "PROJECT_HEALTH_HISTORY_PREFIX",
        "history/project_health",
    )

    portfolio_health_history_prefix: str = os.getenv(
        "PORTFOLIO_HEALTH_HISTORY_PREFIX",
        "history/portfolio_health",
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

from __future__ import annotations

import logging
from collections import defaultdict
from dataclasses import dataclass
from datetime import date, datetime
from typing import Any, Iterable

from utils import get_custom_field_value

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class HealthScoreConfig:
    initial_score: int = 100
    overdue_project_penalty: int = 30
    due_7_days_penalty: int = 20
    due_15_days_penalty: int = 10
    due_30_days_penalty: int = 5
    missing_due_date_penalty: int = 20
    missing_project_manager_penalty: int = 15
    overdue_task_penalty: int = 1
    maximum_overdue_tasks_penalty: int = 20


class ProjectMetricsService:
    """
    Construye una capa analítica con una fila por proyecto.

    La clase no consulta Asana ni escribe archivos.
    Solo transforma proyectos y tareas previamente obtenidos.
    """

    def __init__(
        self,
        health_config: HealthScoreConfig | None = None,
        today: date | None = None,
    ) -> None:
        self._health_config = health_config or HealthScoreConfig()
        self._today = today or date.today()

    def build_metrics(
        self,
        projects: Iterable[dict[str, Any]],
        tasks: Iterable[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        project_list = list(projects)
        task_list = list(tasks)

        logger.info(
            "Construyendo métricas PMO: projects=%s tasks=%s",
            len(project_list),
            len(task_list),
        )

        tasks_by_project = self._group_tasks_by_project(task_list)
        records: list[dict[str, Any]] = []

        for project in project_list:
            project_gid = self._get_project_gid(project)

            if not project_gid:
                logger.warning(
                    "Proyecto omitido porque no contiene identificador: %s",
                    project,
                )
                continue

            project_tasks = tasks_by_project.get(project_gid, [])

            try:
                record = self._build_record(project, project_tasks)
                records.append(record)
            except (TypeError, ValueError, KeyError) as exc:
                logger.exception(
                    "No fue posible calcular métricas para project_gid=%s: %s",
                    project_gid,
                    exc,
                )

        logger.info(
            "Métricas PMO construidas correctamente: records=%s",
            len(records),
        )

        return records

    def _build_record(
        self,
        project: dict[str, Any],
        tasks: list[dict[str, Any]],
    ) -> dict[str, Any]:
        project_gid = self._get_project_gid(project)
        project_name = self._get_first_value(
            project,
            "project_name",
            "name",
            default="Sin nombre",
        )

        responsible = self._get_first_value(
            project,
            "responsable_proyecto",
            "responsable",
            "project_manager",
            default="",
        )

        owner_name = self._extract_owner_name(project)

        completed = self._to_bool(
            self._get_first_value(
                project,
                "completed",
                default=False,
            )
        )

        archived = self._to_bool(
            self._get_first_value(
                project,
                "archived",
                default=False,
            )
        )

        start_on = self._parse_date(
            self._get_project_date_value(
                project=project,
                direct_keys=("start_on", "start_date"),
                custom_field_name="Fecha Inicio del proyecto",
            )
        )

        due_on = self._parse_date(
            self._get_project_date_value(
                project=project,
                direct_keys=("due_on", "due_date"),
                custom_field_name=(
                    "Fecha Planificada Termino del proyecto"
                ),
            )
        )

        total_tasks = len(tasks)
        completed_tasks = sum(
            1 for task in tasks if self._is_task_completed(task)
        )
        pending_tasks = total_tasks - completed_tasks
        overdue_tasks = sum(
            1 for task in tasks if self._is_task_overdue(task)
        )

        progress_pct = self._calculate_progress(
            total_tasks=total_tasks,
            completed_tasks=completed_tasks,
            project_completed=completed,
        )

        days_to_finish = self._calculate_days_to_finish(due_on)

        alert_level, alert_label = self._calculate_alert(
            due_on=due_on,
            completed=completed,
        )

        health_score = self._calculate_health_score(
            alert_level=alert_level,
            responsible=responsible,
            overdue_tasks=overdue_tasks,
        )

        health_status = self._classify_health(health_score)

        project_status = self._calculate_project_status(
            completed=completed,
            archived=archived,
            alert_level=alert_level,
        )

        overdue_tasks_pct = self._calculate_percentage(
            numerator=overdue_tasks,
            denominator=total_tasks,
        )

        pending_tasks_pct = self._calculate_percentage(
            numerator=pending_tasks,
            denominator=total_tasks,
        )

        return {
            "project_gid": project_gid,
            "project_name": project_name,
            "responsable_proyecto": responsible or "Sin responsable",
            "owner_name": owner_name or "Sin owner",
            "project_status": project_status,
            "completed": completed,
            "archived": archived,
            "start_on": self._format_date(start_on),
            "due_on": self._format_date(due_on),
            "days_to_finish": days_to_finish,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "overdue_tasks": overdue_tasks,
            "progress_pct": progress_pct,
            "overdue_tasks_pct": overdue_tasks_pct,
            "pending_tasks_pct": pending_tasks_pct,
            "is_overdue": int(alert_level == "OVERDUE"),
            "due_within_7_days": int(alert_level == "DUE_7"),
            "due_within_15_days": int(alert_level == "DUE_15"),
            "due_within_30_days": int(alert_level == "DUE_30"),
            "missing_due_date": int(due_on is None),
            "missing_responsible": int(not responsible),
            "alert_level": alert_level,
            "alert_label": alert_label,
            "health_score": health_score,
            "health_status": health_status,
            "snapshot_date": self._today.isoformat(),
        }

    def _group_tasks_by_project(
        self,
        tasks: Iterable[dict[str, Any]],
    ) -> dict[str, list[dict[str, Any]]]:
        grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)

        for task in tasks:
            project_ids = self._extract_task_project_ids(task)

            if not project_ids:
                logger.debug(
                    "Tarea sin proyecto asociable: task_gid=%s",
                    self._get_first_value(task, "task_gid", "gid", default=""),
                )
                continue

            for project_gid in project_ids:
                grouped[project_gid].append(task)

        return dict(grouped)

    def _extract_task_project_ids(
        self,
        task: dict[str, Any],
    ) -> set[str]:
        project_ids: set[str] = set()

        direct_project_gid = self._get_first_value(
            task,
            "project_gid",
            "project_id",
            default=None,
        )

        if direct_project_gid:
            project_ids.add(str(direct_project_gid))

        projects = task.get("projects")

        if isinstance(projects, list):
            for project in projects:
                if isinstance(project, dict) and project.get("gid"):
                    project_ids.add(str(project["gid"]))
                elif isinstance(project, str):
                    project_ids.add(project)

        memberships = task.get("memberships")

        if isinstance(memberships, list):
            for membership in memberships:
                if not isinstance(membership, dict):
                    continue

                project = membership.get("project")

                if isinstance(project, dict) and project.get("gid"):
                    project_ids.add(str(project["gid"]))

        return project_ids

    def _is_task_completed(self, task: dict[str, Any]) -> bool:
        return self._to_bool(
            self._get_first_value(
                task,
                "completed",
                "is_completed",
                default=False,
            )
        )

    def _is_task_overdue(self, task: dict[str, Any]) -> bool:
        if self._is_task_completed(task):
            return False

        due_on = self._parse_date(
            self._get_first_value(
                task,
                "due_on",
                "due_date",
                default=None,
            )
        )

        return due_on is not None and due_on < self._today

    def _calculate_progress(
        self,
        total_tasks: int,
        completed_tasks: int,
        project_completed: bool,
    ) -> float:
        if project_completed:
            return 100.0

        if total_tasks == 0:
            return 0.0

        return round((completed_tasks / total_tasks) * 100, 2)

    def _calculate_days_to_finish(
        self,
        due_on: date | None,
    ) -> int | None:
        if due_on is None:
            return None

        return (due_on - self._today).days

    def _calculate_alert(
        self,
        due_on: date | None,
        completed: bool,
    ) -> tuple[str, str]:
        if completed:
            return "COMPLETED", "✅ Proyecto completado"

        if due_on is None:
            return "NO_DUE_DATE", "⚪ Sin fecha planificada"

        days_to_finish = (due_on - self._today).days

        if days_to_finish < 0:
            return "OVERDUE", "🔴 Proyecto atrasado"

        if days_to_finish <= 7:
            return "DUE_7", "🟠 Vence en 7 días o menos"

        if days_to_finish <= 15:
            return "DUE_15", "🟡 Vence en 15 días o menos"

        if days_to_finish <= 30:
            return "DUE_30", "🟡 Vence en 30 días o menos"

        return "ON_TRACK", "🟢 Sin alerta"

    def _calculate_health_score(
        self,
        alert_level: str,
        responsible: str,
        overdue_tasks: int,
    ) -> int:
        config = self._health_config
        score = config.initial_score

        alert_penalties = {
            "OVERDUE": config.overdue_project_penalty,
            "DUE_7": config.due_7_days_penalty,
            "DUE_15": config.due_15_days_penalty,
            "DUE_30": config.due_30_days_penalty,
            "NO_DUE_DATE": config.missing_due_date_penalty,
        }

        score -= alert_penalties.get(alert_level, 0)

        if not responsible:
            score -= config.missing_project_manager_penalty

        overdue_penalty = min(
            overdue_tasks * config.overdue_task_penalty,
            config.maximum_overdue_tasks_penalty,
        )
        score -= overdue_penalty

        return max(0, min(100, score))

    @staticmethod
    def _classify_health(score: int) -> str:
        if score >= 90:
            return "Excelente"
        if score >= 70:
            return "Saludable"
        if score >= 50:
            return "Atención"
        if score >= 30:
            return "Riesgo"
        return "Crítico"

    @staticmethod
    def _calculate_project_status(
        completed: bool,
        archived: bool,
        alert_level: str,
    ) -> str:
        if archived:
            return "Archivado"
        if completed:
            return "Completado"
        if alert_level == "OVERDUE":
            return "Atrasado"
        return "Activo"

    @staticmethod
    def _calculate_percentage(
        numerator: int,
        denominator: int,
    ) -> float:
        if denominator == 0:
            return 0.0

        return round((numerator / denominator) * 100, 2)

    @staticmethod
    def _get_project_gid(project: dict[str, Any]) -> str:
        value = project.get("project_gid") or project.get("gid")
        return str(value) if value else ""

    @staticmethod
    def _extract_owner_name(project: dict[str, Any]) -> str:
        owner = project.get("owner")

        if isinstance(owner, dict):
            return str(owner.get("name") or "")

        return str(
            project.get("owner_name")
            or owner
            or ""
        )

    @classmethod
    def _get_project_date_value(
        cls,
        project: dict[str, Any],
        direct_keys: tuple[str, ...],
        custom_field_name: str,
    ) -> Any:
        direct_value = cls._get_first_value(
            project,
            *direct_keys,
            default=None,
        )

        if direct_value not in (None, ""):
            return direct_value

        custom_fields = project.get("custom_fields")

        if not isinstance(custom_fields, list):
            return None

        return get_custom_field_value(
            custom_fields=custom_fields,
            field_name=custom_field_name,
        )

    @staticmethod
    def _get_first_value(
        source: dict[str, Any],
        *keys: str,
        default: Any = None,
    ) -> Any:
        for key in keys:
            value = source.get(key)

            if value is not None and value != "":
                return value

        return default

    @staticmethod
    def _parse_date(value: Any) -> date | None:
        if value is None or value == "":
            return None

        if isinstance(value, datetime):
            return value.date()

        if isinstance(value, date):
            return value

        text = str(value).strip()

        accepted_formats = (
            "%Y-%m-%d",
            "%Y-%m-%dT%H:%M:%S.%fZ",
            "%Y-%m-%dT%H:%M:%SZ",
        )

        for date_format in accepted_formats:
            try:
                return datetime.strptime(text, date_format).date()
            except ValueError:
                continue

        try:
            return datetime.fromisoformat(
                text.replace("Z", "+00:00")
            ).date()
        except ValueError as exc:
            raise ValueError(
                f"Formato de fecha no soportado: {value}"
            ) from exc

    @staticmethod
    def _format_date(value: date | None) -> str:
        return value.isoformat() if value else ""

    @staticmethod
    def _to_bool(value: Any) -> bool:
        if isinstance(value, bool):
            return value

        if isinstance(value, int):
            return value == 1

        if isinstance(value, str):
            return value.strip().lower() in {
                "true",
                "1",
                "yes",
                "si",
                "sí",
            }

        return bool(value)

import logging
from typing import Any

from asana_client import AsanaApiError, AsanaClient

logger = logging.getLogger(__name__)


class TaskService:
    def __init__(self) -> None:
        self.client = AsanaClient()

    def execute(
        self,
        projects: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        task_records: list[dict[str, Any]] = []

        for project_index, project in enumerate(projects, start=1):
            project_id = str(project.get("gid", "")).strip()
            project_name = str(project.get("name", "")).strip()
            responsible = str(
                project.get("responsable_proyecto", "")
            ).strip()

            if not project_id:
                logger.warning(
                    "Proyecto omitido porque no tiene GID | nombre=%s",
                    project_name,
                )
                continue

            logger.info(
                "Extrayendo tareas del proyecto %s de %s | "
                "gid=%s | nombre=%s",
                project_index,
                len(projects),
                project_id,
                project_name,
            )

            try:
                tasks = self.client.get_project_tasks(project_id)

            except AsanaApiError as exc:
                logger.warning(
                    "No fue posible extraer tareas | "
                    "project_gid=%s | status=%s | error=%s",
                    project_id,
                    exc.status_code,
                    exc,
                )
                continue

            except Exception:
                logger.exception(
                    "Error inesperado extrayendo tareas | "
                    "project_gid=%s | nombre=%s",
                    project_id,
                    project_name,
                )
                continue

            logger.info(
                "Tareas encontradas | project_gid=%s | cantidad=%s",
                project_id,
                len(tasks),
            )

            for task in tasks:
                task_record = self._build_task_record(
                    project=project,
                    task=task,
                    record_type="task",
                )

                task_records.append(task_record)

                task_id = str(task.get("gid", "")).strip()

                if not task_id:
                    continue

                try:
                    subtasks = self.client.get_subtasks(task_id)

                except AsanaApiError as exc:
                    logger.warning(
                        "No fue posible extraer subtareas | "
                        "task_gid=%s | status=%s | error=%s",
                        task_id,
                        exc.status_code,
                        exc,
                    )
                    continue

                except Exception:
                    logger.exception(
                        "Error inesperado extrayendo subtareas | "
                        "task_gid=%s | task_name=%s",
                        task_id,
                        task.get("name", ""),
                    )
                    continue

                for subtask in subtasks:
                    subtask_record = self._build_task_record(
                        project=project,
                        task=subtask,
                        record_type="subtask",
                        parent_task=task,
                    )

                    task_records.append(subtask_record)

        logger.info(
            "Extracción de tareas finalizada | registros=%s",
            len(task_records),
        )

        return task_records

    @staticmethod
    def _build_task_record(
        project: dict[str, Any],
        task: dict[str, Any],
        record_type: str,
        parent_task: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        assignee = task.get("assignee") or {}

        if not isinstance(assignee, dict):
            assignee = {}

        parent = task.get("parent") or {}

        if not isinstance(parent, dict):
            parent = {}

        memberships = task.get("memberships") or []

        if not isinstance(memberships, list):
            memberships = []

        section_name = ""

        for membership in memberships:
            if not isinstance(membership, dict):
                continue

            section = membership.get("section") or {}

            if not isinstance(section, dict):
                continue

            section_name = str(section.get("name", "")).strip()

            if section_name:
                break

        if parent_task:
            parent_task_gid = str(
                parent_task.get("gid", "")
            ).strip()

            parent_task_name = str(
                parent_task.get("name", "")
            ).strip()
        else:
            parent_task_gid = str(
                parent.get("gid", "")
            ).strip()

            parent_task_name = str(
                parent.get("name", "")
            ).strip()

        return {
            "project_gid": str(project.get("gid", "")).strip(),
            "project_name": str(project.get("name", "")).strip(),
            "responsable_proyecto": str(
                project.get("responsable_proyecto", "")
            ).strip(),
            "record_type": record_type,
            "task_gid": str(task.get("gid", "")).strip(),
            "task_name": str(task.get("name", "")).strip(),
            "parent_task_gid": parent_task_gid,
            "parent_task_name": parent_task_name,
            "section_name": section_name,
            "assignee_gid": str(
                assignee.get("gid", "")
            ).strip(),
            "assignee_name": str(
                assignee.get("name", "")
            ).strip(),
            "completed": bool(task.get("completed", False)),
            "completed_at": task.get("completed_at") or "",
            "created_at": task.get("created_at") or "",
            "modified_at": task.get("modified_at") or "",
            "start_on": task.get("start_on") or "",
            "start_at": task.get("start_at") or "",
            "due_on": task.get("due_on") or "",
            "due_at": task.get("due_at") or "",
            "permalink_url": task.get("permalink_url") or "",
        }
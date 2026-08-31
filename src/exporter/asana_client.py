import json
import logging
from typing import Any

import boto3
import requests
from requests import Response
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from config import settings

logger = logging.getLogger(__name__)


class AsanaApiError(RuntimeError):
    """Error controlado al consumir la API de Asana."""

    def __init__(
        self,
        message: str,
        status_code: int | None = None,
        response_body: str | None = None,
    ) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.response_body = response_body


class AsanaClient:
    BASE_URL = "https://app.asana.com/api/1.0"
    REQUEST_TIMEOUT = 60
    PAGE_LIMIT = 100

    PROJECT_OPT_FIELDS = ",".join(
        [
            "gid",
            "name",
            "resource_type",
            "archived",
            "deleted",
            "completed",
            "completed_at",
            "created_at",
            "modified_at",
            "start_on",
            "due_on",
            "notes",
            "permalink_url",
            "owner.gid",
            "owner.name",
            "current_status.title",
            "current_status.text",
            "current_status.color",
            "current_status.created_at",
            "custom_fields.gid",
            "custom_fields.name",
            "custom_fields.resource_subtype",
            "custom_fields.display_value",
            "custom_fields.text_value",
            "custom_fields.number_value",
            "custom_fields.date_value.date",
            "custom_fields.date_value.date_time",
            "custom_fields.enum_value.gid",
            "custom_fields.enum_value.name",
            "custom_fields.multi_enum_values.gid",
            "custom_fields.multi_enum_values.name",
            "custom_fields.people_value.gid",
            "custom_fields.people_value.name",
        ]
    )

    TASK_OPT_FIELDS = ",".join(
        [
            "gid",
            "name",
            "resource_type",
            "resource_subtype",
            "deleted",
            "completed",
            "completed_at",
            "created_at",
            "modified_at",
            "start_at",
            "start_on",
            "due_at",
            "due_on",
            "notes",
            "permalink_url",
            "assignee.gid",
            "assignee.name",
            "assignee_status",
            "parent.gid",
            "parent.name",
            "memberships.project.gid",
            "memberships.project.name",
            "memberships.section.gid",
            "memberships.section.name",
            "custom_fields.gid",
            "custom_fields.name",
            "custom_fields.resource_subtype",
            "custom_fields.display_value",
            "custom_fields.text_value",
            "custom_fields.number_value",
            "custom_fields.enum_value.gid",
            "custom_fields.enum_value.name",
            "custom_fields.multi_enum_values.gid",
            "custom_fields.multi_enum_values.name",
            "custom_fields.people_value.gid",
            "custom_fields.people_value.name",
        ]
    )

    SUBTASK_OPT_FIELDS = ",".join(
        [
            "gid",
            "name",
            "resource_type",
            "resource_subtype",
            "deleted",
            "completed",
            "completed_at",
            "created_at",
            "modified_at",
            "start_at",
            "start_on",
            "due_at",
            "due_on",
            "notes",
            "permalink_url",
            "assignee.gid",
            "assignee.name",
            "assignee_status",
            "parent.gid",
            "parent.name",
            "memberships.project.gid",
            "memberships.project.name",
            "memberships.section.gid",
            "memberships.section.name",
            "custom_fields.gid",
            "custom_fields.name",
            "custom_fields.resource_subtype",
            "custom_fields.display_value",
            "custom_fields.text_value",
            "custom_fields.number_value",
            "custom_fields.enum_value.gid",
            "custom_fields.enum_value.name",
            "custom_fields.multi_enum_values.gid",
            "custom_fields.multi_enum_values.name",
            "custom_fields.people_value.gid",
            "custom_fields.people_value.name",
        ]
    )

    SECTION_OPT_FIELDS = ",".join(
        [
            "gid",
            "name",
            "resource_type",
            "deleted",
        ]
    )

    def __init__(self) -> None:
        token = self._load_secret()

        self.session = requests.Session()
        self.session.headers.update(
            {
                "Authorization": f"Bearer {token}",
                "Accept": "application/json",
            }
        )

        retry_strategy = Retry(
            total=3,
            connect=3,
            read=3,
            status=3,
            backoff_factor=1,
            status_forcelist=(429, 500, 502, 503, 504),
            allowed_methods=frozenset({"GET"}),
            respect_retry_after_header=True,
            raise_on_status=False,
        )

        adapter = HTTPAdapter(
            max_retries=retry_strategy,
            pool_connections=10,
            pool_maxsize=10,
        )

        self.session.mount("https://", adapter)

    def _load_secret(self) -> str:
        secrets_client = boto3.client(
            "secretsmanager",
            region_name=settings.aws_region,
        )

        response = secrets_client.get_secret_value(
            SecretId=settings.secret_name,
        )

        secret_string = response.get("SecretString")

        if not secret_string:
            raise ValueError(
                f"El secreto '{settings.secret_name}' "
                "no contiene SecretString."
            )

        try:
            secret = json.loads(secret_string)
        except json.JSONDecodeError as exc:
            raise ValueError(
                f"El secreto '{settings.secret_name}' "
                "no contiene JSON válido."
            ) from exc

        token = secret.get("ASANA_TOKEN")

        if not isinstance(token, str) or not token.strip():
            raise ValueError(
                "El secreto debe contener la propiedad "
                "'ASANA_TOKEN' con un valor válido."
            )

        return token.strip()

    def get(
        self,
        endpoint: str,
        params: dict[str, Any] | None = None,
        paginate: bool = True,
    ) -> list[dict[str, Any]] | dict[str, Any]:
        url = f"{self.BASE_URL}/{endpoint.lstrip('/')}"

        if not paginate:
            response = self.session.get(
                url,
                params=params,
                timeout=self.REQUEST_TIMEOUT,
            )

            payload = self._parse_response(response)
            return payload.get("data", payload)

        results: list[dict[str, Any]] = []
        request_params = dict(params or {})

        request_params.setdefault("limit", self.PAGE_LIMIT)

        while True:
            response = self.session.get(
                url,
                params=request_params,
                timeout=self.REQUEST_TIMEOUT,
            )

            payload = self._parse_response(response)
            data = payload.get("data", [])

            if isinstance(data, list):
                results.extend(data)

            elif isinstance(data, dict):
                return data

            else:
                raise AsanaApiError(
                    "Asana devolvió un tipo inesperado en 'data': "
                    f"{type(data).__name__}"
                )

            next_page = payload.get("next_page")

            if not isinstance(next_page, dict):
                break

            offset = next_page.get("offset")

            if not offset:
                break

            request_params["offset"] = offset

        return results

    def get_portfolio_projects(
        self,
        portfolio_id: str,
        workspace_id: str,
    ) -> list[dict[str, Any]]:
        result = self.get(
            f"portfolios/{portfolio_id}/items",
            params={
                "limit": self.PAGE_LIMIT,
                "workspace": workspace_id,
            },
            paginate=True,
        )

        if not isinstance(result, list):
            raise TypeError(
                "Se esperaba una lista de elementos del portafolio, "
                f"pero Asana devolvió: {type(result).__name__}"
            )

        return result

    def get_project(
        self,
        project_id: str,
    ) -> dict[str, Any]:
        result = self.get(
            f"projects/{project_id}",
            params={
                "opt_fields": self.PROJECT_OPT_FIELDS,
            },
            paginate=False,
        )

        if not isinstance(result, dict):
            raise TypeError(
                "Se esperaba el detalle de un proyecto, "
                f"pero Asana devolvió: {type(result).__name__}"
            )

        return result

    def get_project_sections(
        self,
        project_id: str,
    ) -> list[dict[str, Any]]:
        result = self.get(
            f"projects/{project_id}/sections",
            params={
                "opt_fields": self.SECTION_OPT_FIELDS,
                "limit": self.PAGE_LIMIT,
            },
            paginate=True,
        )

        if not isinstance(result, list):
            raise TypeError(
                "Se esperaba una lista de secciones para el proyecto "
                f"'{project_id}', pero Asana devolvió: "
                f"{type(result).__name__}"
            )

        return result

    def get_project_tasks(
        self,
        project_id: str,
    ) -> list[dict[str, Any]]:
        result = self.get(
            f"projects/{project_id}/tasks",
            params={
                "opt_fields": self.TASK_OPT_FIELDS,
                "limit": self.PAGE_LIMIT,
            },
            paginate=True,
        )

        if not isinstance(result, list):
            raise TypeError(
                "Se esperaba una lista de tareas para el proyecto "
                f"'{project_id}', pero Asana devolvió: "
                f"{type(result).__name__}"
            )

        return result

    def get_subtasks(
        self,
        task_id: str,
    ) -> list[dict[str, Any]]:
        result = self.get(
            f"tasks/{task_id}/subtasks",
            params={
                "opt_fields": self.SUBTASK_OPT_FIELDS,
                "limit": self.PAGE_LIMIT,
            },
            paginate=True,
        )

        if not isinstance(result, list):
            raise TypeError(
                "Se esperaba una lista de subtareas para la tarea "
                f"'{task_id}', pero Asana devolvió: "
                f"{type(result).__name__}"
            )

        return result

    @staticmethod
    def _parse_response(
        response: Response,
    ) -> dict[str, Any]:
        if not response.ok:
            logger.error(
                "Error Asana API | status=%s | url=%s",
                response.status_code,
                response.url,
            )

            raise AsanaApiError(
                message=(
                    f"Asana respondió HTTP {response.status_code}. "
                    f"URL: {response.url}."
                ),
                status_code=response.status_code,
            )

        try:
            payload = response.json()

        except requests.exceptions.JSONDecodeError as exc:
            raise AsanaApiError(
                message=(
                    "Asana devolvió una respuesta que no contiene "
                    "JSON válido."
                ),
                status_code=response.status_code,
                response_body=response.text,
            ) from exc

        if not isinstance(payload, dict):
            raise AsanaApiError(
                message=(
                    "Asana devolvió una estructura JSON inesperada: "
                    f"{type(payload).__name__}."
                ),
                status_code=response.status_code,
                response_body=response.text,
            )

        return payload

import logging
from typing import Any

from asana_client import AsanaApiError, AsanaClient
from config import settings
from utils import get_custom_field_value, normalize_text

logger = logging.getLogger(__name__)


class ProjectService:
    RESPONSIBLE_FIELD_NAME = "Responsable Proyecto"

    def __init__(self) -> None:
        self.client = AsanaClient()

        self.allowed_responsibles = {
            normalize_text(name)
            for name in settings.allowed_project_managers
        }

    def execute(self) -> dict[str, Any]:
        portfolio_items = self.client.get_portfolio_projects(
            portfolio_id=settings.portfolio_id,
            workspace_id=settings.workspace_id,
        )

        logger.info(
            "Elementos encontrados en el portafolio: %s",
            len(portfolio_items),
        )

        selected_projects: list[dict[str, Any]] = []
        discarded_projects: list[dict[str, str]] = []
        invalid_projects: list[dict[str, str]] = []
        skipped_items: list[dict[str, str]] = []

        for index, item in enumerate(portfolio_items, start=1):
            project_id = str(item.get("gid", "")).strip()
            project_name = str(item.get("name", "")).strip()
            resource_type = str(
                item.get("resource_type", "")
            ).strip()

            logger.info(
                "Procesando elemento %s de %s | gid=%s | nombre=%s",
                index,
                len(portfolio_items),
                project_id or "SIN GID",
                project_name or "SIN NOMBRE",
            )

            if not project_id:
                skipped_items.append(
                    {
                        "project_id": "",
                        "project_name": project_name,
                        "reason": "Elemento sin GID",
                    }
                )

                logger.warning(
                    "Elemento omitido porque no contiene GID | item=%s",
                    item,
                )
                continue

            if resource_type and resource_type != "project":
                skipped_items.append(
                    {
                        "project_id": project_id,
                        "project_name": project_name,
                        "reason": (
                            f"resource_type no soportado: {resource_type}"
                        ),
                    }
                )

                logger.warning(
                    "Elemento omitido porque no es proyecto | "
                    "gid=%s | resource_type=%s",
                    project_id,
                    resource_type,
                )
                continue

            try:
                project = self.client.get_project(project_id)

            except AsanaApiError as exc:
                reason = (
                    "Proyecto eliminado, inválido o no accesible"
                    if exc.status_code == 404
                    else f"Error HTTP de Asana: {exc.status_code}"
                )

                invalid_projects.append(
                    {
                        "project_id": project_id,
                        "project_name": project_name,
                        "reason": reason,
                    }
                )

                logger.warning(
                    "Proyecto omitido | gid=%s | nombre=%s | "
                    "status=%s | motivo=%s",
                    project_id,
                    project_name,
                    exc.status_code,
                    reason,
                )
                continue

            except Exception as exc:
                reason = (
                    f"Error inesperado: "
                    f"{type(exc).__name__}: {exc}"
                )

                invalid_projects.append(
                    {
                        "project_id": project_id,
                        "project_name": project_name,
                        "reason": reason,
                    }
                )

                logger.exception(
                    "Error inesperado procesando proyecto | "
                    "gid=%s | nombre=%s",
                    project_id,
                    project_name,
                )
                continue

            project_name = str(
                project.get("name", project_name)
            ).strip()

            custom_fields = project.get("custom_fields", [])

            if not isinstance(custom_fields, list):
                logger.warning(
                    "custom_fields no es una lista | "
                    "gid=%s | tipo=%s",
                    project_id,
                    type(custom_fields).__name__,
                )
                custom_fields = []

            responsible = get_custom_field_value(
                custom_fields=custom_fields,
                field_name=self.RESPONSIBLE_FIELD_NAME,
            )

            if not self._is_allowed_responsible(responsible):
                discarded_projects.append(
                    {
                        "project_id": project_id,
                        "project_name": project_name,
                        "responsible": (
                            responsible or "SIN RESPONSABLE"
                        ),
                    }
                )

                logger.info(
                    "Proyecto descartado | gid=%s | nombre=%s | "
                    "responsable=%s",
                    project_id,
                    project_name,
                    responsible or "SIN RESPONSABLE",
                )
                continue

            project["responsable_proyecto"] = responsible
            selected_projects.append(project)

            logger.info(
                "Proyecto seleccionado | gid=%s | nombre=%s | "
                "responsable=%s | seleccionados=%s/%s",
                project_id,
                project_name,
                responsible,
                len(selected_projects),
                (
                    settings.max_projects
                    if settings.max_projects is not None
                    else "SIN LÍMITE"
                ),
            )

            if (
                settings.max_projects is not None
                and len(selected_projects) >= settings.max_projects
            ):
                logger.info(
                    "Límite de proyectos alcanzado | limite=%s",
                    settings.max_projects,
                )
                break

        self._print_summary(
            portfolio_total=len(portfolio_items),
            selected_projects=selected_projects,
            discarded_projects=discarded_projects,
            invalid_projects=invalid_projects,
            skipped_items=skipped_items,
        )

        return {
            "statusCode": 200,
            "portfolioId": settings.portfolio_id,
            "workspaceId": settings.workspace_id,
            "portfolioItems": len(portfolio_items),
            "selectedProjects": len(selected_projects),
            "discardedProjects": len(discarded_projects),
            "invalidProjects": len(invalid_projects),
            "skippedItems": len(skipped_items),
            "projects": selected_projects,
            "responsibles": sorted(
                {
                    str(project["responsable_proyecto"])
                    for project in selected_projects
                }
            ),
        }

    def _is_allowed_responsible(
        self,
        responsible: str | None,
    ) -> bool:
        normalized_responsible = normalize_text(responsible)

        if not normalized_responsible:
            return False

        return normalized_responsible in self.allowed_responsibles

    @staticmethod
    def _print_summary(
        portfolio_total: int,
        selected_projects: list[dict[str, Any]],
        discarded_projects: list[dict[str, str]],
        invalid_projects: list[dict[str, str]],
        skipped_items: list[dict[str, str]],
    ) -> None:
        print()
        print("=" * 100)
        print("RESUMEN DE EXTRACCIÓN Y FILTRO PMO")
        print("=" * 100)
        print(
            f"Elementos en portafolio          : "
            f"{portfolio_total}"
        )
        print(
            f"Proyectos seleccionados          : "
            f"{len(selected_projects)}"
        )
        print(
            f"Proyectos descartados            : "
            f"{len(discarded_projects)}"
        )
        print(
            f"Proyectos inválidos/inaccesibles : "
            f"{len(invalid_projects)}"
        )
        print(
            f"Elementos omitidos               : "
            f"{len(skipped_items)}"
        )
        print()

        if selected_projects:
            print("PROYECTOS SELECCIONADOS")
            print("-" * 100)

            for project in selected_projects:
                print(
                    f"- {project.get('gid', '')} | "
                    f"{project.get('name', '')} | "
                    f"{project.get('responsable_proyecto', '')}"
                )

        if discarded_projects:
            print()
            print("PROYECTOS DESCARTADOS POR RESPONSABLE")
            print("-" * 100)

            for project in discarded_projects:
                print(
                    f"- {project['project_id']} | "
                    f"{project['project_name']} | "
                    f"{project['responsible']}"
                )

        if invalid_projects:
            print()
            print("PROYECTOS INVÁLIDOS O INACCESIBLES")
            print("-" * 100)

            for project in invalid_projects:
                print(
                    f"- {project['project_id']} | "
                    f"{project['project_name']} | "
                    f"{project['reason']}"
                )

        if skipped_items:
            print()
            print("ELEMENTOS OMITIDOS")
            print("-" * 100)

            for item in skipped_items:
                print(
                    f"- {item['project_id'] or 'SIN GID'} | "
                    f"{item['project_name'] or 'SIN NOMBRE'} | "
                    f"{item['reason']}"
                )

        print()
        print("=" * 100)
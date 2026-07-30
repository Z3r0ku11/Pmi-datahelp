from __future__ import annotations

from datetime import date
from typing import Any


PROJECT_HEALTH_FIELDS = [
    "snapshot_date",
    "snapshot_month",
    "baseline_type",
    "project_id",
    "project_name",
    "project_status",
    "health_project_score",
    "included_in_portfolio_health",
]

PORTFOLIO_HEALTH_FIELDS = [
    "snapshot_date",
    "snapshot_month",
    "baseline_type",
    "portfolio_health",
    "active_projects",
    "earned_points",
    "maximum_points",
    "projects_in_course",
    "projects_waiting",
    "projects_at_risk",
    "projects_delayed",
    "projects_without_status",
    "projects_finalized",
    "projects_discarded",
]


class HealthSnapshotService:
    """Construye snapshots mensuales de salud sin alterar datasets oficiales."""

    STATUS_SCORES = {
        "en curso": 100,
        "on hold": 60,
        "en riesgo": 30,
        "con retraso": 0,
        "sin estado": 0,
    }
    CLOSED_STATUSES = {"finalizado", "descartado"}

    def __init__(self, snapshot_date: date | None = None) -> None:
        self.snapshot_date = snapshot_date or date.today()

    def build(
        self,
        projects: list[dict[str, Any]],
        baseline_type: str = "MONTHLY_SNAPSHOT",
    ) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
        project_rows = [
            self._build_project_row(project, baseline_type)
            for project in projects
        ]
        portfolio_row = self._build_portfolio_row(
            project_rows,
            baseline_type,
        )
        return project_rows, [portfolio_row]

    def project_object_key(self, prefix: str) -> str:
        return self._monthly_object_key(
            prefix,
            "project_health_snapshot.csv",
        )

    def portfolio_object_key(self, prefix: str) -> str:
        return self._monthly_object_key(
            prefix,
            "portfolio_health_snapshot.csv",
        )

    def _monthly_object_key(
        self,
        prefix: str,
        filename: str,
    ) -> str:
        return (
            f"{prefix.rstrip('/')}/"
            f"year={self.snapshot_date:%Y}/"
            f"month={self.snapshot_date:%m}/"
            f"{filename}"
        )

    def _build_project_row(
        self,
        project: dict[str, Any],
        baseline_type: str,
    ) -> dict[str, Any]:
        raw_status = str(project.get("STATUS COLOR") or "On Hold")
        status = raw_status.strip() or "On Hold"
        normalized_status = status.casefold()
        included = normalized_status not in self.CLOSED_STATUSES
        score = (
            self.STATUS_SCORES.get(normalized_status, 0)
            if included
            else ""
        )

        return {
            "snapshot_date": self.snapshot_date.isoformat(),
            "snapshot_month": self.snapshot_date.strftime("%Y-%m"),
            "baseline_type": baseline_type,
            "project_id": str(project.get("PROJECT ID") or ""),
            "project_name": str(project.get("NAME") or ""),
            "project_status": status,
            "health_project_score": score,
            "included_in_portfolio_health": int(included),
        }

    def _build_portfolio_row(
        self,
        project_rows: list[dict[str, Any]],
        baseline_type: str,
    ) -> dict[str, Any]:
        active_rows = [
            row
            for row in project_rows
            if row["included_in_portfolio_health"] == 1
        ]
        earned_points = sum(
            int(row["health_project_score"])
            for row in active_rows
        )
        maximum_points = len(active_rows) * 100
        portfolio_health = (
            round(earned_points / maximum_points * 100, 2)
            if maximum_points
            else 0.0
        )
        status_counts: dict[str, int] = {}

        for row in project_rows:
            normalized_status = str(row["project_status"]).casefold()
            status_counts[normalized_status] = (
                status_counts.get(normalized_status, 0) + 1
            )

        return {
            "snapshot_date": self.snapshot_date.isoformat(),
            "snapshot_month": self.snapshot_date.strftime("%Y-%m"),
            "baseline_type": baseline_type,
            "portfolio_health": portfolio_health,
            "active_projects": len(active_rows),
            "earned_points": earned_points,
            "maximum_points": maximum_points,
            "projects_in_course": status_counts.get("en curso", 0),
            "projects_waiting": status_counts.get("on hold", 0),
            "projects_at_risk": status_counts.get("en riesgo", 0),
            "projects_delayed": status_counts.get("con retraso", 0),
            "projects_without_status": status_counts.get("sin estado", 0),
            "projects_finalized": status_counts.get("finalizado", 0),
            "projects_discarded": status_counts.get("descartado", 0),
        }

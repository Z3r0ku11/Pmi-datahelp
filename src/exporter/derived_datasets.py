"""Build the Asana-derived CSV datasets published to the production bucket."""

from __future__ import annotations

import logging
from collections import defaultdict
from datetime import date, datetime, timedelta
from typing import Any

import pandas as pd

try:
    from facturacion.facturacion_proximos_finalizar import (
        BASE_OUTPUT_FIELDS,
        SUMMARY_FIELDS,
        build_detail_records,
        build_summary_record,
    )
except ImportError:
    from Facturacion.facturacion_proximos_finalizar import (
        BASE_OUTPUT_FIELDS,
        SUMMARY_FIELDS,
        build_detail_records,
        build_summary_record,
    )

from utils import project_year, responsible_group

LOGGER = logging.getLogger(__name__)


class DerivedDatasetError(ValueError):
    """Raised when a derived dataset cannot be built from the ETL records."""


class DerivedArtifact:
    """A CSV and its QuickSight manifest contract."""

    def __init__(
        self,
        key: str,
        manifest_key: str,
        fieldnames: list[str],
        records: list[dict[str, Any]],
    ) -> None:
        self.key = key
        self.manifest_key = manifest_key
        self.fieldnames = fieldnames
        self.records = records


S_CURVE_FIELDS = [
    "project_id", "pmo_id", "project_name", "responsable_proyecto",
    "responsable_grupo", "project_year", "curve_date",
    "planned_progress_pct", "actual_progress_pct", "variance_pct",
    "total_planned_tasks", "cohort_task_count", "curve_series",
    "progress_pct", "progress_units",
]

TIMELINE_FIELDS = [
    "project_id", "pmo_id", "project_name", "responsable_proyecto",
    "responsable_grupo", "project_year", "estado_proyecto", "start_date",
    "end_date", "timeline_date", "progress_pct", "timeline_value",
    "timeline_phase",
]

LOAD_TIMELINE_FIELDS = [
    "project_gid", "project_name", "responsable", "pmo_id", "project_year",
    "responsable_grupo", "periodo", "periodo_label",
]

COMPLIANCE_FIELDS = [
    "responsable", "proyectos_activos", "proyectos_con_update_semanal",
    "pct_update_semanal", "tareas_total", "tareas_cerradas_30d",
    "tareas_vencidas", "pct_cierre_tareas", "tareas_modificadas_7d",
    "pct_actividad_reciente", "score_updates", "score_gestion",
    "score_actividad", "compliance_score", "compliance_nivel",
    "snapshot_date",
]


def _text(value: Any) -> str:
    return str(value or "").strip()


def _parse_date(value: Any) -> date | None:
    text = _text(value)
    if not text:
        return None
    try:
        parsed = datetime.fromisoformat(text.replace("Z", "+00:00"))
        return parsed.date()
    except ValueError:
        try:
            return date.fromisoformat(text[:10])
        except ValueError:
            return None


def _date_series(frame: pd.DataFrame, column: str) -> pd.Series:
    return pd.to_datetime(frame[column], errors="coerce", utc=True).dt.tz_convert(None)


def build_s_curve(tasks: list[dict[str, Any]], projects: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Build the weekly planned-versus-actual task progress curve."""
    required_tasks = {"project_gid", "task_gid", "start_on", "due_on", "completed", "completed_at", "deleted"}
    required_projects = {"PROJECT ID", "PMO ID", "NAME", "Responsable Proyecto", "Fecha Inicio del proyecto", "Fecha Planificada Termino del proyecto"}
    if tasks and not required_tasks.issubset(tasks[0]):
        raise DerivedDatasetError("tasks.csv no contiene columnas para Curva S.")
    if projects and not required_projects.issubset(projects[0]):
        raise DerivedDatasetError("projects.csv no contiene columnas para Curva S.")

    task_frame = pd.DataFrame(tasks)
    project_frame = pd.DataFrame(projects)
    if task_frame.empty or project_frame.empty:
        return []
    for column in required_tasks:
        if column not in task_frame:
            task_frame[column] = ""
    task_frame["project_gid"] = task_frame["project_gid"].map(_text)
    task_frame["task_gid"] = task_frame["task_gid"].map(_text)
    task_frame = task_frame[(task_frame["project_gid"] != "") & (task_frame["task_gid"] != "")]
    deleted = task_frame["deleted"].map(_text).str.lower().isin({"true", "1", "yes"})
    task_frame = task_frame[~deleted].drop_duplicates(["project_gid", "task_gid"])
    for column in ("start_on", "due_on", "created_at", "completed_at"):
        if column not in task_frame:
            task_frame[column] = ""
        task_frame[column] = _date_series(task_frame, column)
    task_frame["is_completed"] = task_frame["completed"].map(_text).str.lower().isin({"true", "1", "yes"})

    project_frame = project_frame.drop_duplicates("PROJECT ID").copy()
    for column in required_projects:
        if column not in project_frame:
            project_frame[column] = ""
    project_frame["PROJECT ID"] = project_frame["PROJECT ID"].map(_text)
    project_frame["pmo_id"] = project_frame["PMO ID"].map(_text)
    project_frame["project_start"] = _date_series(project_frame, "Fecha Inicio del proyecto")
    project_frame["project_due"] = _date_series(project_frame, "Fecha Planificada Termino del proyecto")
    project_frame["project_year"] = project_frame["Fecha Inicio del proyecto"].map(project_year)
    project_frame["responsable_grupo"] = project_frame["Responsable Proyecto"].map(responsible_group)

    for column in ("pmo_id", "project_year", "responsable_grupo"):
        if column not in task_frame:
            task_frame[column] = ""

    frame = task_frame.merge(
        project_frame[
            [
                "PROJECT ID",
                "pmo_id",
                "project_start",
                "project_due",
                "project_year",
                "responsable_grupo",
            ]
        ].rename(
            columns={
                "pmo_id": "project_pmo_id",
                "project_year": "project_project_year",
                "responsable_grupo": "project_responsable_grupo",
            }
        ),
        left_on="project_gid",
        right_on="PROJECT ID",
        how="left",
    )
    for column, project_column in (
        ("pmo_id", "project_pmo_id"),
        ("project_year", "project_project_year"),
        ("responsable_grupo", "project_responsable_grupo"),
    ):
        project_values = frame[project_column].fillna("")
        frame[column] = project_values.where(
            project_values.map(_text) != "",
            frame[column],
        )
    valid_task_plan = frame["start_on"].notna() & frame["due_on"].notna() & (frame["due_on"] >= frame["start_on"])
    valid_project_plan = frame["project_start"].notna() & frame["project_due"].notna() & (frame["project_due"] >= frame["project_start"])
    frame["effective_start"] = frame["start_on"].where(valid_task_plan, frame["project_start"])
    frame["effective_due"] = frame["due_on"].where(valid_task_plan, frame["project_due"])
    frame["has_plan"] = valid_task_plan | valid_project_plan
    today = pd.Timestamp.now().normalize()
    rows: list[dict[str, Any]] = []
    projects_with_curve: set[str] = set()
    for project_id, group in frame[frame["has_plan"]].groupby("project_gid"):
        projects_with_curve.add(str(project_id))
        total = len(group)
        start = min(today - pd.Timedelta(days=7), group["effective_start"].min()).normalize() - pd.Timedelta(days=7)
        end = max(today, group["effective_due"].max()).normalize()
        dates = list(pd.date_range(start=start, end=end, freq="7D"))
        if not dates or dates[-1] != end:
            dates.append(end)
        durations = (group["effective_due"] - group["effective_start"]).dt.days
        for curve_date in dates:
            elapsed = (curve_date - group["effective_start"]).dt.days
            planned = pd.Series(0.0, index=group.index)
            regular = durations > 0
            planned.loc[regular] = (elapsed.loc[regular] / durations.loc[regular]).clip(0.0, 1.0)
            same_day = durations == 0
            planned.loc[same_day] = (curve_date >= group.loc[same_day, "effective_due"]).astype(float)
            completed = ((group["completed_at"].notna()) & (group["completed_at"].dt.normalize() <= curve_date)) | (group["is_completed"] & group["completed_at"].isna() & (curve_date >= today))
            planned_units = float(planned.sum())
            actual_units = float(completed.sum())
            planned_pct = planned_units / total * 100.0
            actual_pct = actual_units / total * 100.0
            base = {
                "project_id": str(project_id),
                "pmo_id": _text(group["pmo_id"].iloc[0]),
                "project_name": _text(group["project_name"].iloc[0]),
                "responsable_proyecto": _text(group["responsable_proyecto"].iloc[0]),
                "responsable_grupo": _text(group["responsable_grupo"].iloc[0]),
                "project_year": _text(group["project_year"].iloc[0]),
                "curve_date": curve_date.strftime("%Y-%m-%d"),
                "planned_progress_pct": round(planned_pct, 4),
                "actual_progress_pct": round(actual_pct, 4),
                "variance_pct": round(actual_pct - planned_pct, 4),
                "total_planned_tasks": total,
                "cohort_task_count": total,
            }
            rows.extend([
                {**base, "curve_series": "Avance estimado", "progress_pct": round(planned_pct, 4), "progress_units": round(planned_units, 4)},
                {**base, "curve_series": "Avance real", "progress_pct": round(actual_pct, 4), "progress_units": round(actual_units, 4)},
            ])
    project_columns = project_frame.to_dict("records")
    for project in project_columns:
        project_id = _text(project.get("PROJECT ID"))
        if not project_id or project_id in projects_with_curve:
            continue
        for curve_date in (today - pd.Timedelta(days=7), today):
            base = {
                "project_id": project_id, "pmo_id": _text(project.get("PMO ID")),
                "project_name": _text(project.get("NAME")),
                "responsable_proyecto": _text(project.get("Responsable Proyecto")),
                "responsable_grupo": responsible_group(project.get("Responsable Proyecto")),
                "project_year": project_year(project.get("Fecha Inicio del proyecto")),
                "curve_date": curve_date.strftime("%Y-%m-%d"),
                "planned_progress_pct": 0.0, "actual_progress_pct": 0.0,
                "variance_pct": 0.0, "total_planned_tasks": 0, "cohort_task_count": 0,
            }
            rows.extend([
                {**base, "curve_series": "Avance estimado", "progress_pct": 0.0, "progress_units": 0.0},
                {**base, "curve_series": "Avance real", "progress_pct": 0.0, "progress_units": 0.0},
            ])
    return rows


def build_timeline(projects: list[dict[str, Any]], metrics: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Build weekly project timeline rows from official project metrics."""
    metrics_by_id = {_text(row.get("project_gid")): row for row in metrics}
    rows: list[dict[str, Any]] = []
    for project in projects:
        project_id = _text(project.get("PROJECT ID"))
        start = _parse_date(project.get("Fecha Inicio del proyecto"))
        end = _parse_date(project.get("Fecha Planificada Termino del proyecto"))
        if not project_id or not start or not end or end < start:
            continue
        progress = float(metrics_by_id.get(project_id, {}).get("progress_pct") or 0)
        progress = min(max(progress, 0.0), 100.0)
        duration = max((end - start).days, 1)
        timeline_dates = [start + timedelta(days=7 * index) for index in range((end - start).days // 7 + 1)]
        if not timeline_dates or timeline_dates[-1] != end:
            timeline_dates.append(end)
        for timeline_date in timeline_dates:
            elapsed = (timeline_date - start).days / duration
            completed = elapsed <= progress / 100.0
            rows.append({
                "project_id": project_id, "pmo_id": _text(project.get("PMO ID")),
                "project_name": _text(project.get("NAME")),
                "responsable_proyecto": _text(project.get("Responsable Proyecto")),
                "responsable_grupo": responsible_group(project.get("Responsable Proyecto")),
                "project_year": project_year(project.get("Fecha Inicio del proyecto")),
                "estado_proyecto": _text(project.get("STATUS COLOR")),
                "start_date": start.isoformat(), "end_date": end.isoformat(),
                "timeline_date": timeline_date.isoformat(), "progress_pct": progress / 100.0,
                "timeline_value": 2 if completed else 1,
                "timeline_phase": "Avance completado" if completed else "Planificado",
            })
    return rows


def build_load_timeline(projects: list[dict[str, Any]], months: int = 12) -> list[dict[str, Any]]:
    """Build the monthly active-project load by responsible."""
    today = date.today()
    periods = []
    for index in range(months):
        month = today.month - 1 + index
        year = today.year + month // 12
        month = month % 12 + 1
        periods.append(date(year, month, 1))
    rows: list[dict[str, Any]] = []
    for project in projects:
        responsible = _text(project.get("Responsable Proyecto"))
        created = _parse_date(project.get("CREATED"))
        planned_start = _parse_date(project.get("Fecha Inicio del proyecto"))
        planned_end = _parse_date(project.get("Fecha Planificada Termino del proyecto"))
        effective_end = _parse_date(project.get("Fecha Termino Efectiva"))
        starts = [value for value in (created, planned_start) if value]
        start = max(starts) if starts else None
        end = effective_end or planned_end
        if not responsible or not start:
            continue
        for period in periods:
            next_month = period.replace(day=28) + timedelta(days=4)
            month_end = next_month - timedelta(days=next_month.day)
            if start <= month_end and (end is None or end >= period):
                rows.append({
                    "project_gid": _text(project.get("PROJECT ID")),
                    "project_name": _text(project.get("NAME")),
                    "responsable": responsible,
                    "pmo_id": _text(project.get("PMO ID")),
                    "project_year": project_year(project.get("Fecha Inicio del proyecto") or project.get("CREATED")),
                    "responsable_grupo": responsible_group(responsible),
                    "periodo": period.isoformat(),
                    "periodo_label": period.strftime("%b %Y"),
                })
    return rows


def build_compliance(projects: list[dict[str, Any]], tasks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Build PM compliance scores from the current Asana snapshot."""
    today = date.today()
    seven_days_ago = today - timedelta(days=7)
    thirty_days_ago = today - timedelta(days=30)
    project_groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for project in projects:
        responsible = _text(project.get("Responsable Proyecto"))
        if not responsible or _text(project.get("STATUS COLOR")) in {"Finalizado", "Descartado"}:
            continue
        project_groups[responsible].append({"status_date": _parse_date(project.get("LATEST STATUS DATE"))})
    task_groups: dict[str, dict[str, int]] = defaultdict(lambda: {"total": 0, "completed_30d": 0, "overdue": 0, "modified_7d": 0})
    for task in tasks:
        responsible = _text(task.get("responsable_proyecto"))
        if responsible not in project_groups:
            continue
        metrics = task_groups[responsible]
        metrics["total"] += 1
        completed_at = _parse_date(task.get("completed_at"))
        if completed_at and completed_at >= thirty_days_ago:
            metrics["completed_30d"] += 1
        if _text(task.get("completed")).lower() not in {"true", "1", "yes"}:
            due = _parse_date(task.get("due_on"))
            if due and due < today:
                metrics["overdue"] += 1
        modified = _parse_date(task.get("modified_at"))
        if modified and modified >= seven_days_ago:
            metrics["modified_7d"] += 1
    rows: list[dict[str, Any]] = []
    for responsible, assigned_projects in sorted(project_groups.items()):
        active = len(assigned_projects)
        updates = sum(bool(item["status_date"] and item["status_date"] >= seven_days_ago) for item in assigned_projects)
        data = task_groups[responsible]
        pct_update = updates / active * 100 if active else 0.0
        closure = data["completed_30d"] / max(data["completed_30d"] + data["overdue"], 1) * 100 if data["total"] else 50.0
        activity = min(data["modified_7d"] / data["total"] * 100, 100) if data["total"] else 0.0
        score = round(min(pct_update * 0.4 + closure * 0.3 + activity * 0.3, 100), 1)
        level = "Excelente" if score >= 90 else "Cumple" if score >= 70 else "Parcial" if score >= 50 else "Bajo" if score >= 30 else "Critico"
        rows.append({
            "responsable": responsible, "proyectos_activos": active,
            "proyectos_con_update_semanal": updates, "pct_update_semanal": round(pct_update, 1),
            "tareas_total": data["total"], "tareas_cerradas_30d": data["completed_30d"],
            "tareas_vencidas": data["overdue"], "pct_cierre_tareas": round(closure, 1),
            "tareas_modificadas_7d": data["modified_7d"], "pct_actividad_reciente": round(activity, 1),
            "score_updates": round(pct_update, 1), "score_gestion": round(closure, 1),
            "score_actividad": round(activity, 1), "compliance_score": score,
            "compliance_nivel": level, "snapshot_date": today.isoformat(),
        })
    return rows


def build_derived_artifacts(
    projects: list[dict[str, Any]],
    tasks: list[dict[str, Any]],
    metrics: list[dict[str, Any]],
) -> list[DerivedArtifact]:
    """Build all derived CSV contracts required by the production dashboard."""
    facturation_records, facturation_fields = build_detail_records(projects)
    artifacts = [
        DerivedArtifact("project_s_curve/project_s_curve.csv", "quicksight/manifests/project_s_curve.json", S_CURVE_FIELDS, build_s_curve(tasks, projects)),
        DerivedArtifact("project_timeline/project_timeline.csv", "quicksight/manifests/project_timeline.json", TIMELINE_FIELDS, build_timeline(projects, metrics)),
        DerivedArtifact("project_load_timeline/project_load_timeline.csv", "project_load_timeline/manifest.json", LOAD_TIMELINE_FIELDS, build_load_timeline(projects)),
        DerivedArtifact("pm_compliance/pm_compliance.csv", "pm_compliance/manifest.json", COMPLIANCE_FIELDS, build_compliance(projects, tasks)),
        DerivedArtifact("Facturacion/proyectos_proximos_finalizar.csv", "Facturacion/manifests/proyectos_proximos_finalizar.json", facturation_fields, facturation_records),
        DerivedArtifact("Facturacion/proyectos_proximos_finalizar_resumen.csv", "Facturacion/manifests/proyectos_proximos_finalizar_resumen.json", SUMMARY_FIELDS, [build_summary_record(facturation_records)]),
    ]
    LOGGER.info("Datasets derivados construidos | artifacts=%d", len(artifacts))
    return artifacts

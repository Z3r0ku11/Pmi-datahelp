"""Build and validate the first PMO Intelligence artifact pack."""

from __future__ import annotations

from datetime import UTC, date, datetime
from typing import Any

MAX_RISKS_PER_ANALYSIS = 10


class ArtifactValidationError(ValueError):
    """Raised when an artifact violates the PMO domain contract."""


def _required_text(value: Any, field_name: str) -> str:
    text = str(value or "").strip()
    if not text:
        raise ArtifactValidationError(f"{field_name} es obligatorio.")
    return text


def _non_negative_number(value: Any, field_name: str) -> float:
    if value in (None, ""):
        return 0.0
    try:
        number = float(value)
    except (TypeError, ValueError) as error:
        raise ArtifactValidationError(
            f"{field_name} debe ser numérico."
        ) from error
    if number < 0:
        raise ArtifactValidationError(
            f"{field_name} no puede ser negativo."
        )
    return number


def _scale_value(value: Any, field_name: str) -> int:
    if value in (None, ""):
        return 1
    try:
        number = int(value)
    except (TypeError, ValueError) as error:
        raise ArtifactValidationError(
            f"{field_name} debe ser un entero entre 1 y 5."
        ) from error
    if number < 1 or number > 5:
        raise ArtifactValidationError(
            f"{field_name} debe estar entre 1 y 5."
        )
    return number


def _risk_level(score: int) -> str:
    if score <= 4:
        return "Bajo"
    if score <= 9:
        return "Medio"
    if score <= 16:
        return "Alto"
    return "Crítico"


def _optional_iso_date(value: Any, field_name: str) -> str:
    text = str(value or "").strip()
    if not text:
        return ""
    try:
        date.fromisoformat(text)
    except ValueError as error:
        raise ArtifactValidationError(
            f"{field_name} debe usar formato YYYY-MM-DD."
        ) from error
    return text


def _reject_cycles(
    relationships: dict[str, list[str]],
    relationship_name: str,
) -> None:
    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(identifier: str) -> None:
        if identifier in visiting:
            raise ArtifactValidationError(
                f"Se detectó un ciclo en {relationship_name}: {identifier}."
            )
        if identifier in visited:
            return
        visiting.add(identifier)
        for related in relationships.get(identifier, []):
            visit(related)
        visiting.remove(identifier)
        visited.add(identifier)

    for identifier in relationships:
        visit(identifier)


def _build_wbs(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    codes: set[str] = set()
    for item in items:
        code = _required_text(item.get("code"), "wbs.code")
        if code in codes:
            raise ArtifactValidationError(f"Código EDT duplicado: {code}.")
        codes.add(code)
        result.append(
            {
                "code": code,
                "parent_code": str(item.get("parent_code") or "").strip(),
                "name": _required_text(item.get("name"), "wbs.name"),
                "deliverable": str(item.get("deliverable") or "").strip(),
                "owner": str(item.get("owner") or "").strip(),
                "planned_hours": _non_negative_number(
                    item.get("planned_hours"),
                    "wbs.planned_hours",
                ),
            }
        )

    for item in result:
        parent_code = item["parent_code"]
        if parent_code == item["code"]:
            raise ArtifactValidationError(
                f"El elemento EDT {item['code']} no puede ser su propio padre."
            )
        if parent_code and parent_code not in codes:
            raise ArtifactValidationError(
                f"Padre EDT inexistente: {parent_code}."
            )
    _reject_cycles(
        {
            item["code"]: [item["parent_code"]]
            if item["parent_code"]
            else []
            for item in result
        },
        "la EDT",
    )
    return result


def _build_schedule(
    items: list[dict[str, Any]],
    wbs_codes: set[str],
    hours_per_week: float,
) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    identifiers: set[str] = set()
    for item in items:
        item_id = _required_text(item.get("id"), "schedule.id")
        if item_id in identifiers:
            raise ArtifactValidationError(
                f"Actividad de cronograma duplicada: {item_id}."
            )
        identifiers.add(item_id)
        wbs_code = _required_text(
            item.get("wbs_code"),
            "schedule.wbs_code",
        )
        if wbs_code not in wbs_codes:
            raise ArtifactValidationError(
                f"La actividad {item_id} referencia una EDT inexistente: "
                f"{wbs_code}."
            )
        planned_hours = _non_negative_number(
            item.get("planned_hours"),
            "schedule.planned_hours",
        )
        dependencies = [
            str(value).strip()
            for value in item.get("dependencies", [])
            if str(value).strip()
        ]
        start_date = _optional_iso_date(
            item.get("start_date"),
            "schedule.start_date",
        )
        end_date = _optional_iso_date(
            item.get("end_date"),
            "schedule.end_date",
        )
        if start_date and end_date and end_date < start_date:
            raise ArtifactValidationError(
                f"La actividad {item_id} termina antes de comenzar."
            )
        result.append(
            {
                "id": item_id,
                "wbs_code": wbs_code,
                "name": _required_text(item.get("name"), "schedule.name"),
                "owner": str(item.get("owner") or "").strip(),
                "start_date": start_date,
                "end_date": end_date,
                "planned_hours": planned_hours,
                "planned_weeks": round(planned_hours / hours_per_week, 2),
                "dependencies": dependencies,
            }
        )

    for item in result:
        for dependency in item["dependencies"]:
            if dependency == item["id"]:
                raise ArtifactValidationError(
                    f"La actividad {item['id']} no puede depender de sí misma."
                )
            if dependency not in identifiers:
                raise ArtifactValidationError(
                    f"Dependencia inexistente: {dependency}."
                )
    _reject_cycles(
        {item["id"]: item["dependencies"] for item in result},
        "las dependencias del cronograma",
    )
    return result


def _build_risks(
    items: list[dict[str, Any]],
    wbs_codes: set[str],
) -> list[dict[str, Any]]:
    if len(items) > MAX_RISKS_PER_ANALYSIS:
        raise ArtifactValidationError(
            "Un análisis no puede contener más de 10 riesgos."
        )
    result: list[dict[str, Any]] = []
    identifiers: set[str] = set()
    for item in items:
        risk_id = _required_text(item.get("id"), "risk.id")
        if risk_id in identifiers:
            raise ArtifactValidationError(f"Riesgo duplicado: {risk_id}.")
        identifiers.add(risk_id)
        wbs_code = str(item.get("wbs_code") or "").strip()
        if wbs_code and wbs_code not in wbs_codes:
            raise ArtifactValidationError(
                f"El riesgo {risk_id} referencia una EDT inexistente: "
                f"{wbs_code}."
            )
        probability = _scale_value(
            item.get("probability"),
            "risk.probability",
        )
        impact = _scale_value(item.get("impact"), "risk.impact")
        score = probability * impact
        result.append(
            {
                "id": risk_id,
                "wbs_code": wbs_code,
                "description": _required_text(
                    item.get("description"),
                    "risk.description",
                ),
                "category": str(item.get("category") or "General").strip(),
                "probability": probability,
                "impact": impact,
                "score": score,
                "level": _risk_level(score),
                "owner": str(item.get("owner") or "").strip(),
                "response": str(item.get("response") or "Mitigar").strip(),
                "mitigation": str(item.get("mitigation") or "").strip(),
                "status": str(item.get("status") or "Abierto").strip(),
            }
        )
    return result


def build_project_pack(payload: dict[str, Any]) -> dict[str, Any]:
    """Return a validated and normalized Phase II project artifact pack."""

    project = payload.get("project") or {}
    project_id = _required_text(project.get("id"), "project.id")
    project_name = _required_text(project.get("name"), "project.name")
    hours_per_week = _non_negative_number(
        project.get("hours_per_week", 40),
        "project.hours_per_week",
    )
    if hours_per_week == 0:
        raise ArtifactValidationError(
            "project.hours_per_week debe ser mayor que cero."
        )

    wbs = _build_wbs(payload.get("wbs") or [])
    wbs_codes = {item["code"] for item in wbs}
    schedule = _build_schedule(
        payload.get("schedule") or [],
        wbs_codes,
        hours_per_week,
    )
    risks = _build_risks(payload.get("risks") or [], wbs_codes)

    total_hours = sum(item["planned_hours"] for item in schedule)
    return {
        "schema_version": "1.0",
        "generated_at": datetime.now(UTC).isoformat(),
        "project": {
            "id": project_id,
            "name": project_name,
            "hours_per_week": hours_per_week,
        },
        "summary": {
            "wbs_items": len(wbs),
            "schedule_items": len(schedule),
            "planned_hours": total_hours,
            "planned_weeks": round(total_hours / hours_per_week, 2),
            "risks": len(risks),
            "high_or_critical_risks": sum(
                risk["level"] in {"Alto", "Crítico"}
                for risk in risks
            ),
        },
        "wbs": wbs,
        "schedule": schedule,
        "risks": risks,
    }

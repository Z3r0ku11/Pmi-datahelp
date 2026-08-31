"""Construcción y validación de proyectos próximos a finalizar.

La fuente es el contrato existente ``projects/projects.csv`` en S3. Este
módulo no modifica los CSV oficiales; genera salidas nuevas bajo Facturacion.
"""

from __future__ import annotations

import csv
import io
import math
from collections.abc import Iterable, Mapping
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal, InvalidOperation
from typing import Any
from zoneinfo import ZoneInfo

SANTIAGO_TZ = ZoneInfo("America/Santiago")
EXCLUDED_STATUSES = {"Finalizado", "Descartado"}
WINDOW_30 = "Próximos 30 días"
WINDOW_31_60 = "Entre 31 y 60 días"
PAYMENT_TYPE_FIELD = "Tipo de pago"
PAYMENT_TYPES = (
    ("Pago Cliente", "Pago Cliente"),
    ("Fondos AWS", "Fondos AWS"),
    ("Incentivos", "Incentivos"),
    ("Creditos AWS", "Creditos AWS"),
    ("Inversion Morris", "Inversion Morris"),
)

BASE_OUTPUT_FIELDS = [
    "PROJECT ID",
    "PMO ID",
    "Proyecto",
    "URL",
    "Cliente",
    "Responsable Proyecto",
    "Estado Proyecto",
    "Fase del proyecto",
    "Fecha Inicio del proyecto",
    "Fecha Planificada Termino del proyecto",
    "Dias para finalizar",
    "Ventana de finalizacion",
    PAYMENT_TYPE_FIELD,
    "Total presupuestado",
    "Pago Cliente",
    "Fondos AWS",
    "Incentivos",
    "Creditos AWS",
    "Inversion Morris",
    "Pais",
    "Tipo Proyecto",
    "Clasificacion",
    "LATEST STATUS DATE",
    "DATA REFRESH",
]
OPTIONAL_OUTPUT_FIELDS = [
    "Avance Real %",
    "Avance Esperado %",
    "SPI",
    "Índice de Envergadura",
]
DATE_FIELDS = {
    "Fecha Inicio del proyecto",
    "Fecha Planificada Termino del proyecto",
    "LATEST STATUS DATE",
}
INTEGER_FIELDS = {"Dias para finalizar"}
DECIMAL_FIELDS = {
    "Total presupuestado",
    "Pago Cliente",
    "Fondos AWS",
    "Incentivos",
    "Creditos AWS",
    "Inversion Morris",
    "Avance Real %",
    "Avance Esperado %",
    "SPI",
    "Índice de Envergadura",
}
SUMMARY_FIELDS = [
    "Total de proyectos próximos a finalizar",
    "Cantidad que finaliza en los próximos 30 días",
    "Cantidad que finaliza entre 31 y 60 días",
    "Presupuesto total de los proyectos próximos a finalizar",
    "Presupuesto de proyectos de los próximos 30 días",
    "Presupuesto de proyectos entre 31 y 60 días",
    "Promedio de avance real",
    "Promedio de avance esperado",
    "SPI general de los proyectos próximos a finalizar",
]


def santiago_today() -> date:
    """Return today's date in the required America/Santiago timezone."""
    return datetime.now(SANTIAGO_TZ).date()


def parse_source_date(value: Any) -> date | None:
    """Parse ISO/date values and normalize timestamps to Santiago date."""
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    try:
        if len(text) == 10:
            return date.fromisoformat(text)
        normalized = text.replace("Z", "+00:00")
        parsed = datetime.fromisoformat(normalized)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(SANTIAGO_TZ).date()
    except ValueError:
        return None


def project_status_as_of(
    row: Mapping[str, Any],
    evaluation_date: date,
) -> str:
    """Apply effective closure without overriding an archived project."""
    status = normalize_text(
        source_field(row, "STATUS COLOR", "Estado Proyecto")
    )
    effective_end_date = parse_source_date(
        source_field(row, "Fecha Termino Efectiva")
    )
    if (
        status != "Descartado"
        and effective_end_date is not None
        and effective_end_date <= evaluation_date
    ):
        return "Finalizado"
    return status


def normalize_text(value: Any) -> str:
    """Normalize identifiers and labels without exposing source secrets."""
    return str(value or "").strip()


def parse_decimal(value: Any) -> Decimal | None:
    """Parse a numeric source value, returning None for invalid data."""
    text = normalize_text(value)
    if not text:
        return None
    try:
        parsed = Decimal(text.replace(",", ""))
    except InvalidOperation:
        return None
    return parsed if parsed.is_finite() else None


def build_payment_type(row: Mapping[str, Any]) -> str:
    """Return positive financial payment types in the defined display order."""
    payment_types = [
        label
        for source_name, label in PAYMENT_TYPES
        if (amount := parse_decimal(source_field(row, source_name))) is not None
        and amount > 0
    ]
    return " | ".join(payment_types) or "Sin pago registrado"


def csv_value(value: Any) -> str:
    """Serialize values consistently for CSV output."""
    if value is None:
        return ""
    if isinstance(value, Decimal):
        return format(value, "f")
    if isinstance(value, date):
        return value.isoformat()
    return str(value)


def source_field(row: Mapping[str, Any], *names: str) -> Any:
    """Return the first available source column value."""
    for name in names:
        if name in row:
            return row.get(name)
    return None


def selected_project_id(row: Mapping[str, Any]) -> str:
    """Use PROJECT ID and fall back to PMO ID when necessary."""
    return normalize_text(source_field(row, "PROJECT ID")) or normalize_text(
        source_field(row, "PMO ID")
    )


def classify_window(days_remaining: int) -> str | None:
    """Classify inclusive, non-overlapping 0-30 and 31-60 day windows."""
    if 0 <= days_remaining <= 30:
        return WINDOW_30
    if 31 <= days_remaining <= 60:
        return WINDOW_31_60
    return None


def validate_unique_ids(rows: Iterable[Mapping[str, Any]]) -> None:
    """Reject blank or duplicated project identifiers before publication."""
    identifiers: list[str] = []
    for row in rows:
        identifier = selected_project_id(row)
        if not identifier:
            raise ValueError("Existe un proyecto sin PROJECT ID ni PMO ID.")
        identifiers.append(identifier)
    duplicates = sorted(
        identifier
        for identifier in set(identifiers)
        if identifiers.count(identifier) > 1
    )
    if duplicates:
        raise ValueError(
            "PROJECT ID/PMO ID duplicados en la fuente: "
            + ", ".join(duplicates[:10])
        )


def build_detail_records(
    rows: list[dict[str, Any]],
    today: date | None = None,
) -> tuple[list[dict[str, Any]], list[str]]:
    """Build sorted detail records for active projects in the 0-60 day range."""
    validate_unique_ids(rows)
    current_date = today or santiago_today()
    available_optional = [
        field
        for field in OPTIONAL_OUTPUT_FIELDS
        if any(field in row for row in rows)
    ]
    output_fields = BASE_OUTPUT_FIELDS + available_optional
    result: list[dict[str, Any]] = []

    for row in rows:
        status = project_status_as_of(row, current_date)
        if status in EXCLUDED_STATUSES:
            continue

        planned_date = parse_source_date(
            source_field(row, "Fecha Planificada Termino del proyecto")
        )
        if planned_date is None:
            continue
        days_remaining = (planned_date - current_date).days
        window = classify_window(days_remaining)
        if window is None:
            continue

        start_date = parse_source_date(
            source_field(row, "Fecha Inicio del proyecto")
        )
        latest_status_date = parse_source_date(
            source_field(row, "LATEST STATUS DATE")
        )
        record: dict[str, Any] = {
            "PROJECT ID": selected_project_id(row),
            "PMO ID": normalize_text(source_field(row, "PMO ID")),
            "Proyecto": normalize_text(source_field(row, "NAME", "Proyecto")),
            "URL": normalize_text(source_field(row, "URL")),
            "Cliente": normalize_text(source_field(row, "Cliente")),
            "Responsable Proyecto": normalize_text(
                source_field(row, "Responsable Proyecto")
            ),
            "Estado Proyecto": status,
            "Fase del proyecto": normalize_text(
                source_field(row, "Fase del proyecto")
            ),
            "Fecha Inicio del proyecto": start_date,
            "Fecha Planificada Termino del proyecto": planned_date,
            "Dias para finalizar": days_remaining,
            "Ventana de finalizacion": window,
            PAYMENT_TYPE_FIELD: build_payment_type(row),
            "Pais": normalize_text(source_field(row, "Pais")),
            "Tipo Proyecto": normalize_text(source_field(row, "Tipo Proyecto")),
            "Clasificacion": normalize_text(
                source_field(row, "Clasificación", "Clasificacion")
            ),
            "LATEST STATUS DATE": latest_status_date,
            "DATA REFRESH": normalize_text(source_field(row, "DATA REFRESH")),
        }
        for field in DECIMAL_FIELDS:
            if field in output_fields:
                record[field] = parse_decimal(source_field(row, field))
        result.append(record)

    result.sort(
        key=lambda record: (
            record["Dias para finalizar"],
            record["Fecha Planificada Termino del proyecto"],
            record["Cliente"].casefold(),
            record["Proyecto"].casefold(),
        )
    )
    return result, output_fields


def normalized_progress(value: Any) -> Decimal | None:
    """Normalize progress values that may be represented as 0-1 or 0-100."""
    parsed = parse_decimal(value)
    if parsed is None or parsed < 0 or parsed > 100:
        return None
    return parsed / 100 if parsed > 1 else parsed


def average(values: list[Decimal]) -> Decimal | None:
    """Return a finite average or None when no valid values exist."""
    if not values:
        return None
    return sum(values, Decimal("0")) / Decimal(len(values))


def build_summary_record(records: list[dict[str, Any]]) -> dict[str, Any]:
    """Build the requested summary without inventing unavailable metrics."""
    records_30 = [
        row for row in records if row["Ventana de finalizacion"] == WINDOW_30
    ]
    records_31_60 = [
        row for row in records if row["Ventana de finalizacion"] == WINDOW_31_60
    ]

    def budget(rows_to_sum: list[dict[str, Any]]) -> Decimal:
        return sum(
            (
                parse_decimal(row.get("Total presupuestado")) or Decimal("0")
                for row in rows_to_sum
            ),
            Decimal("0"),
        )

    real_values: list[Decimal] = []
    expected_values: list[Decimal] = []
    weighted_real = Decimal("0")
    weighted_expected = Decimal("0")
    weighted_rows = 0
    ratio_values: list[Decimal] = []
    has_weight = any("Índice de Envergadura" in row for row in records)

    for row in records:
        real = normalized_progress(row.get("Avance Real %"))
        expected = normalized_progress(row.get("Avance Esperado %"))
        if real is not None:
            real_values.append(real)
        if expected is not None:
            expected_values.append(expected)
        if real is None or expected is None or expected <= 0:
            continue
        if has_weight:
            weight = parse_decimal(row.get("Índice de Envergadura"))
            if weight is not None and weight > 0:
                weighted_real += real * weight
                weighted_expected += expected * weight
                weighted_rows += 1
        ratio_values.append(real / expected)

    if has_weight and weighted_rows and weighted_expected > 0:
        spi_general: Decimal | None = weighted_real / weighted_expected
    else:
        spi_general = average(ratio_values)

    return {
        "Total de proyectos próximos a finalizar": len(records),
        "Cantidad que finaliza en los próximos 30 días": len(records_30),
        "Cantidad que finaliza entre 31 y 60 días": len(records_31_60),
        "Presupuesto total de los proyectos próximos a finalizar": budget(records),
        "Presupuesto de proyectos de los próximos 30 días": budget(records_30),
        "Presupuesto de proyectos entre 31 y 60 días": budget(records_31_60),
        "Promedio de avance real": average(real_values),
        "Promedio de avance esperado": average(expected_values),
        "SPI general de los proyectos próximos a finalizar": spi_general,
    }


def read_projects_csv(content: str) -> list[dict[str, str]]:
    """Read project records from the official CSV contract."""
    reader = csv.DictReader(io.StringIO(content))
    if not reader.fieldnames:
        raise ValueError("projects.csv no contiene encabezados.")
    return [dict(row) for row in reader]


def csv_content(records: list[dict[str, Any]], fieldnames: list[str]) -> str:
    """Serialize records to UTF-8 CSV content."""
    output = io.StringIO(newline="")
    writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction="ignore")
    writer.writeheader()
    for record in records:
        writer.writerow({field: csv_value(record.get(field)) for field in fieldnames})
    return output.getvalue()


def summary_fieldnames() -> list[str]:
    """Return the stable summary schema."""
    return SUMMARY_FIELDS.copy()


def source_has_optional_fields(rows: list[dict[str, Any]]) -> set[str]:
    """Return optional fields physically available in the source rows."""
    return {
        field for field in OPTIONAL_OUTPUT_FIELDS if any(field in row for row in rows)
    }

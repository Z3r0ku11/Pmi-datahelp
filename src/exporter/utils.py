import logging
import unicodedata
from datetime import date, datetime
from typing import Any

logger = logging.getLogger(__name__)

SERVICES_PROFESSIONALS = frozenset(
    {
        "daniel barrios",
        "hector cayul",
        "denisse arce",
        "luis montero",
        "sebastian neira",
        "carlo sorrel",
        "carlos sorrel",
        "fernando moreno",
        "fernando morales",
        "victor vivallo",
    }
)


def normalize_text(value: str | None) -> str:
    if not value:
        return ""

    normalized = unicodedata.normalize("NFKD", value)

    without_accents = "".join(
        character
        for character in normalized
        if not unicodedata.combining(character)
    )

    return " ".join(
        without_accents.lower().strip().split()
    )


def responsible_group(value: Any) -> str:
    """Return the governed responsible group for filter dimensions."""
    return (
        "Servicios profesionales"
        if normalize_text(str(value or "")) in SERVICES_PROFESSIONALS
        else "Otros PM"
    )


def project_year(value: Any) -> str:
    """Extract the ISO calendar year from a project date value."""
    if value in (None, ""):
        return ""
    if isinstance(value, datetime):
        return str(value.year)
    if isinstance(value, date):
        return str(value.year)
    text = str(value).strip()
    if len(text) >= 4 and text[:4].isdigit():
        return text[:4]
    return ""


def get_project_filter_dimensions(
    project: dict[str, Any],
) -> dict[str, str]:
    """Build the common dimensions copied to derived project datasets."""
    custom_fields = project.get("custom_fields") or []
    if not isinstance(custom_fields, list):
        custom_fields = []
    responsible = str(
        project.get("responsable_proyecto")
        or get_custom_field_value(custom_fields, "Responsable Proyecto")
        or ""
    ).strip()
    start_value = get_custom_field_value(
        custom_fields,
        "Fecha Inicio del proyecto",
    )
    return {
        "pmo_id": get_custom_field_value(custom_fields, "PMO ID"),
        "project_year": project_year(start_value),
        "responsable_grupo": responsible_group(responsible),
    }


def get_custom_field_value(
    custom_fields: list[dict[str, Any]],
    field_name: str,
) -> str:
    normalized_target = normalize_text(field_name)

    for custom_field in custom_fields:
        current_name = normalize_text(
            custom_field.get("name")
        )

        if current_name != normalized_target:
            continue

        display_value = custom_field.get("display_value")

        if display_value not in (None, ""):
            return str(display_value).strip()

        enum_value = custom_field.get("enum_value")

        if enum_value:
            return str(
                enum_value.get("name", "")
            ).strip()

        text_value = custom_field.get("text_value")

        if text_value not in (None, ""):
            return str(text_value).strip()

        number_value = custom_field.get("number_value")

        if number_value is not None:
            return str(number_value)

        date_value = custom_field.get("date_value")

        if isinstance(date_value, dict):
            value = (
                date_value.get("date")
                or date_value.get("date_time")
            )

            if value not in (None, ""):
                return str(value).strip()

        people_value = custom_field.get("people_value")

        if isinstance(people_value, list):
            names = [
                str(person.get("name") or "").strip()
                for person in people_value
                if isinstance(person, dict)
                and person.get("name")
            ]

            if names:
                return ", ".join(names)

        multi_enum_values = custom_field.get(
            "multi_enum_values"
        )

        if isinstance(multi_enum_values, list):
            names = [
                str(value.get("name") or "").strip()
                for value in multi_enum_values
                if isinstance(value, dict)
                and value.get("name")
            ]

            if names:
                return ", ".join(names)

    return ""


def get_custom_field_numeric_value(
    custom_fields: list[dict[str, Any]],
    field_name: str,
) -> float | None:
    """
    Extrae el valor numérico de un custom field de Asana.

    Retorna float si el campo tiene un valor numérico válido,
    None en caso contrario.
    """
    normalized_target = normalize_text(field_name)

    for custom_field in custom_fields:
        current_name = normalize_text(
            custom_field.get("name")
        )

        if current_name != normalized_target:
            continue

        number_value = custom_field.get("number_value")

        if number_value is not None:
            try:
                return float(number_value)
            except (TypeError, ValueError):
                logger.warning(
                    "Campo '%s' tiene number_value no convertible: %s",
                    field_name,
                    number_value,
                )
                return None

        # Fallback: intentar parsear display_value como número
        display_value = custom_field.get("display_value")

        if display_value not in (None, ""):
            cleaned = (
                str(display_value)
                .strip()
                .replace(",", "")
                .replace("$", "")
                .replace(" ", "")
            )

            try:
                return float(cleaned)
            except (TypeError, ValueError):
                return None

    return None

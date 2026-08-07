"""Cascade the Project Detail project control from the shared PM filter."""

from __future__ import annotations

import argparse
import copy
import logging
import time
from typing import Any

import boto3


LOGGER = logging.getLogger(__name__)
PROJECT_DETAIL_NAME = "PROJECT DETAIL"
OVERVIEW_NAME = "PROJECT MANAGER OVERVIEW"
PROJECT_FILTER_ID = "overview-filter-project"
PM_SOURCE_CONTROL_ID = "project-detail-control-pm-source"
OVERVIEW_PROJECT_CONTROL_ID = "overview-control-project"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--account-id", required=True)
    parser.add_argument("--analysis-id", required=True)
    parser.add_argument("--region", default="us-east-1")
    parser.add_argument("--apply", action="store_true")
    return parser.parse_args()


def find_project_detail(definition: dict[str, Any]) -> dict[str, Any]:
    matches = [
        sheet
        for sheet in definition.get("Sheets") or []
        if PROJECT_DETAIL_NAME in str(sheet.get("Name") or "").upper()
    ]
    if len(matches) != 1:
        raise ValueError("No se encontró una única hoja Project Detail.")
    return matches[0]


def find_overview(definition: dict[str, Any]) -> dict[str, Any]:
    matches = [
        sheet
        for sheet in definition.get("Sheets") or []
        if OVERVIEW_NAME in str(sheet.get("Name") or "").upper()
    ]
    if len(matches) != 1:
        raise ValueError("No se encontró una única hoja Project Manager Overview.")
    return matches[0]


def control_for_filter(
    sheets: list[dict[str, Any]],
    source_filter_id: str,
) -> dict[str, Any]:
    matches = []
    for sheet in sheets:
        for control in sheet.get("FilterControls") or []:
            body = control.get("CrossSheet") or control.get("Dropdown")
            if body and body.get("SourceFilterId") == source_filter_id:
                matches.append(body)
    if len(matches) != 1:
        raise ValueError(
            f"No se encontró un único control para {source_filter_id}."
        )
    return matches[0]


def pin_control(
    sheet: dict[str, Any],
    control_id: str,
    column_index: int,
    column_span: int = 9,
    row_span: int = 3,
) -> bool:
    layouts = sheet.get("Layouts") or []
    if len(layouts) != 1:
        raise ValueError("La hoja debe tener un único layout para fijar controles.")
    grid = layouts[0]["Configuration"]["GridLayout"]
    elements = grid["Elements"]
    matches = [
        element
        for element in elements
        if element.get("ElementId") == control_id
    ]
    expected = {
        "ElementId": control_id,
        "ElementType": "FILTER_CONTROL",
        "ColumnIndex": column_index,
        "ColumnSpan": column_span,
        "RowIndex": 0,
        "RowSpan": row_span,
    }
    if matches:
        if matches[0] == expected:
            return False
        matches[0].clear()
        matches[0].update(expected)
        return True
    elements.append(expected)
    return True


def configure(definition: dict[str, Any]) -> bool:
    overview = find_overview(definition)
    sheet = find_project_detail(definition)
    changed = False

    try:
        overview_project_control = control_for_filter(
            [overview],
            PROJECT_FILTER_ID,
        )
    except ValueError:
        overview_project_control = {
            "FilterControlId": OVERVIEW_PROJECT_CONTROL_ID,
            "SourceFilterId": PROJECT_FILTER_ID,
        }
        overview.setdefault("FilterControls", []).append(
            {"CrossSheet": overview_project_control}
        )
        changed = True

    if "CascadingControlConfiguration" in overview_project_control:
        overview_project_control.pop("CascadingControlConfiguration")
        changed = True
    changed = pin_control(
        overview,
        overview_project_control["FilterControlId"],
        6,
        column_span=6,
        row_span=2,
    ) or changed

    project_control = control_for_filter([sheet], PROJECT_FILTER_ID)
    if "CascadingControlConfiguration" in project_control:
        project_control.pop("CascadingControlConfiguration")
        changed = True
    controls = sheet.get("FilterControls") or []
    cleaned_controls = [
        control
        for control in controls
        if (control.get("CrossSheet") or {}).get("FilterControlId")
        != PM_SOURCE_CONTROL_ID
    ]
    if len(cleaned_controls) != len(controls):
        sheet["FilterControls"] = cleaned_controls
        changed = True
    changed = pin_control(
        sheet,
        project_control["FilterControlId"],
        0,
        column_span=12,
    ) or changed
    return changed


def wait_for_analysis(client: Any, account_id: str, analysis_id: str) -> None:
    for _ in range(60):
        response = client.describe_analysis(
            AwsAccountId=account_id,
            AnalysisId=analysis_id,
        )
        status = response["Analysis"]["Status"]
        if status in {"UPDATE_SUCCESSFUL", "CREATION_SUCCESSFUL"}:
            return
        if status.endswith("FAILED"):
            raise RuntimeError(f"QuickSight rechazó el análisis: {status}")
        time.sleep(2)
    raise TimeoutError("QuickSight no completó el análisis dentro del plazo.")


def main() -> None:
    args = parse_args()
    logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
    client = boto3.client("quicksight", region_name=args.region)
    current = client.describe_analysis_definition(
        AwsAccountId=args.account_id,
        AnalysisId=args.analysis_id,
    )
    definition = copy.deepcopy(current["Definition"])
    changed = configure(definition)
    LOGGER.info("Preflight: changed=%s", changed)
    if not args.apply or not changed:
        return

    arguments: dict[str, Any] = {
        "AwsAccountId": args.account_id,
        "AnalysisId": args.analysis_id,
        "Name": current["Name"],
        "Definition": definition,
    }
    if current.get("ThemeArn"):
        arguments["ThemeArn"] = current["ThemeArn"]
    client.update_analysis(**arguments)
    wait_for_analysis(client, args.account_id, args.analysis_id)
    LOGGER.info("Controles cross-sheet de Proyecto actualizados.")


if __name__ == "__main__":
    main()

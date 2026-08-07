"""Recreate compatible local PM and Project controls on two analysis sheets."""

from __future__ import annotations

import argparse
import copy
import logging
import time
from typing import Any

import boto3


LOGGER = logging.getLogger(__name__)
DATASET = "PMOExecutive"
OVERVIEW_NAME = "PROJECT MANAGER OVERVIEW"
DETAIL_NAME = "PROJECT DETAIL"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--account-id", required=True)
    parser.add_argument("--analysis-id", required=True)
    parser.add_argument("--region", default="us-east-1")
    parser.add_argument("--apply", action="store_true")
    return parser.parse_args()


def find_sheet(definition: dict[str, Any], name: str) -> dict[str, Any]:
    matches = [
        sheet
        for sheet in definition.get("Sheets") or []
        if name in str(sheet.get("Name") or "").upper()
    ]
    if len(matches) != 1:
        raise ValueError(f"No se encontró una única hoja {name}.")
    return matches[0]


def category_filter(
    filter_id: str,
    column_name: str,
) -> dict[str, Any]:
    return {
        "CategoryFilter": {
            "FilterId": filter_id,
            "Column": {
                "DataSetIdentifier": DATASET,
                "ColumnName": column_name,
            },
            "Configuration": {
                "FilterListConfiguration": {
                    "MatchOperator": "CONTAINS",
                    "SelectAllOptions": "FILTER_ALL_VALUES",
                    "NullOption": "ALL_VALUES",
                }
            },
        }
    }


def filter_group(
    group_id: str,
    filter_id: str,
    column_name: str,
    sheet_id: str,
    cross_dataset: str,
) -> dict[str, Any]:
    return {
        "FilterGroupId": group_id,
        "Filters": [category_filter(filter_id, column_name)],
        "ScopeConfiguration": {
            "SelectedSheets": {
                "SheetVisualScopingConfigurations": [
                    {"SheetId": sheet_id, "Scope": "ALL_VISUALS"}
                ]
            }
        },
        "Status": "ENABLED",
        "CrossDataset": cross_dataset,
    }


def dropdown(
    control_id: str,
    filter_id: str,
    title: str,
    source_control_id: str | None = None,
) -> dict[str, Any]:
    body: dict[str, Any] = {
        "FilterControlId": control_id,
        "Title": title,
        "SourceFilterId": filter_id,
        "DisplayOptions": {
            "SelectAllOptions": {"Visibility": "VISIBLE"},
            "TitleOptions": {"Visibility": "VISIBLE"},
            "InfoIconLabelOptions": {"Visibility": "HIDDEN"},
        },
        "Type": "MULTI_SELECT",
        "CommitMode": "AUTO",
    }
    if source_control_id:
        body["CascadingControlConfiguration"] = {
            "SourceControls": [
                {
                    "SourceSheetControlId": source_control_id,
                    "ColumnToMatch": {
                        "DataSetIdentifier": DATASET,
                        "ColumnName": "Responsable Proyecto",
                    },
                }
            ]
        }
    return {"Dropdown": body}


def pin_control(
    sheet: dict[str, Any],
    control_id: str,
    column_index: int,
    column_span: int,
    row_span: int,
) -> None:
    grid = sheet["Layouts"][0]["Configuration"]["GridLayout"]
    grid["Elements"] = [
        element
        for element in grid["Elements"]
        if element.get("ElementId") != control_id
    ]
    grid["Elements"].append(
        {
            "ElementId": control_id,
            "ElementType": "FILTER_CONTROL",
            "ColumnIndex": column_index,
            "ColumnSpan": column_span,
            "RowIndex": 0,
            "RowSpan": row_span,
        }
    )


def calculated_field(
    definition: dict[str, Any],
    name: str,
    expression: str,
) -> None:
    fields = definition.setdefault("CalculatedFields", [])
    matches = [
        field
        for field in fields
        if field.get("DataSetIdentifier") == "PMOTasks"
        and field.get("Name") == name
    ]
    if matches:
        matches[0]["Expression"] = expression
        return
    fields.append(
        {
            "DataSetIdentifier": "PMOTasks",
            "Name": name,
            "Expression": expression,
        }
    )


def configure(definition: dict[str, Any]) -> None:
    overview = find_sheet(definition, OVERVIEW_NAME)
    detail = find_sheet(definition, DETAIL_NAME)
    group_ids = {
        "group-overview-filter-pm",
        "group-overview-filter-project",
        "group-detail-local-pm",
        "group-detail-local-project",
    }
    definition["FilterGroups"] = [
        group
        for group in definition.get("FilterGroups") or []
        if group.get("FilterGroupId") not in group_ids
    ]
    definition["FilterGroups"].extend(
        [
            filter_group(
                "group-overview-filter-pm",
                "overview-filter-pm",
                "Responsable Proyecto",
                overview["SheetId"],
                "SINGLE_DATASET",
            ),
            filter_group(
                "group-overview-filter-project",
                "overview-filter-project",
                "Proyecto",
                overview["SheetId"],
                "SINGLE_DATASET",
            ),
            filter_group(
                "group-detail-local-pm",
                "detail-local-filter-pm",
                "Responsable Proyecto",
                detail["SheetId"],
                "ALL_DATASETS",
            ),
            filter_group(
                "group-detail-local-project",
                "detail-local-filter-project",
                "Proyecto",
                detail["SheetId"],
                "ALL_DATASETS",
            ),
        ]
    )

    preserved_overview = [
        control
        for control in overview.get("FilterControls") or []
        if (control.get("Dropdown") or control.get("CrossSheet") or {}).get(
            "SourceFilterId"
        )
        not in {"overview-filter-pm", "overview-filter-project"}
    ]
    overview["FilterControls"] = preserved_overview + [
        dropdown("overview-control-pm", "overview-filter-pm", "RESPONSABLE"),
        dropdown(
            "overview-control-project",
            "overview-filter-project",
            "PROYECTOS",
            "overview-control-pm",
        ),
    ]

    detail["FilterControls"] = [
        dropdown("detail-control-pm", "detail-local-filter-pm", "RESPONSABLE"),
        dropdown(
            "detail-control-project",
            "detail-local-filter-project",
            "PROYECTOS",
            "detail-control-pm",
        ),
    ]
    for obsolete_id in (
        "0af0341a-762d-4090-88c4-8349f3486162",
        "project-detail-control-pm-source",
    ):
        grid = detail["Layouts"][0]["Configuration"]["GridLayout"]
        grid["Elements"] = [
            element
            for element in grid["Elements"]
            if element.get("ElementId") != obsolete_id
        ]
    pin_control(overview, "overview-control-pm", 0, 6, 2)
    pin_control(overview, "overview-control-project", 6, 6, 2)
    pin_control(detail, "detail-control-pm", 0, 6, 3)
    pin_control(detail, "detail-control-project", 6, 6, 3)
    calculated_field(definition, "Proyecto", "{project_name}")
    calculated_field(
        definition,
        "Responsable Proyecto",
        "{responsable_proyecto}",
    )


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
    configure(definition)
    LOGGER.info("Preflight listo para recrear cuatro controles locales.")
    if not args.apply:
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
    LOGGER.info("Filtros locales recreados en ambas hojas.")


if __name__ == "__main__":
    main()

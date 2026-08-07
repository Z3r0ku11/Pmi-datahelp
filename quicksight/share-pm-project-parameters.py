"""Share PM and Project selections across two sheets using parameters."""

from __future__ import annotations

import argparse
import copy
import logging
import time
from typing import Any

import boto3


LOGGER = logging.getLogger(__name__)
DATASET = "PMOExecutive"
PM_PARAMETER = "SharedPM"
PROJECT_PARAMETER = "SharedProject"
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


def parameter_declaration(name: str) -> dict[str, Any]:
    return {
        "StringParameterDeclaration": {
            "Name": name,
            "ParameterValueType": "SINGLE_VALUED",
            "ValueWhenUnset": {"ValueWhenUnsetOption": "NULL"},
        }
    }


def parameter_control(
    control_id: str,
    parameter_name: str,
    title: str,
    column_name: str,
    source_control_id: str | None = None,
) -> dict[str, Any]:
    body: dict[str, Any] = {
        "ParameterControlId": control_id,
        "Title": title,
        "SourceParameterName": parameter_name,
        "SelectableValues": {
            "LinkToDataSetColumn": {
                "DataSetIdentifier": DATASET,
                "ColumnName": column_name,
            }
        },
        "Type": "SINGLE_SELECT",
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


def parameter_filter(
    group_id: str,
    filter_id: str,
    parameter_name: str,
    column_name: str,
    sheet_ids: list[str],
) -> dict[str, Any]:
    return {
        "FilterGroupId": group_id,
        "Filters": [
            {
                "CategoryFilter": {
                    "FilterId": filter_id,
                    "Column": {
                        "DataSetIdentifier": DATASET,
                        "ColumnName": column_name,
                    },
                    "Configuration": {
                        "CustomFilterConfiguration": {
                            "MatchOperator": "EQUALS",
                            "ParameterName": parameter_name,
                            "NullOption": "ALL_VALUES",
                        }
                    },
                }
            }
        ],
        "ScopeConfiguration": {
            "SelectedSheets": {
                "SheetVisualScopingConfigurations": [
                    {"SheetId": sheet_id, "Scope": "ALL_VISUALS"}
                    for sheet_id in sheet_ids
                ]
            }
        },
        "Status": "ENABLED",
        "CrossDataset": "ALL_DATASETS",
    }


def replace_layout_controls(
    sheet: dict[str, Any],
    obsolete_ids: set[str],
    pm_control_id: str,
    project_control_id: str,
    row_span: int,
) -> None:
    grid = sheet["Layouts"][0]["Configuration"]["GridLayout"]
    grid["Elements"] = [
        element
        for element in grid["Elements"]
        if element.get("ElementId") not in obsolete_ids
    ]
    grid["Elements"].extend(
        [
            {
                "ElementId": pm_control_id,
                "ElementType": "PARAMETER_CONTROL",
                "ColumnIndex": 0,
                "ColumnSpan": 6,
                "RowIndex": 0,
                "RowSpan": row_span,
            },
            {
                "ElementId": project_control_id,
                "ElementType": "PARAMETER_CONTROL",
                "ColumnIndex": 6,
                "ColumnSpan": 6,
                "RowIndex": 0,
                "RowSpan": row_span,
            },
        ]
    )


def configure(definition: dict[str, Any]) -> None:
    overview = find_sheet(definition, OVERVIEW_NAME)
    detail = find_sheet(definition, DETAIL_NAME)
    declarations = [
        declaration
        for declaration in definition.get("ParameterDeclarations") or []
        if (declaration.get("StringParameterDeclaration") or {}).get("Name")
        not in {PM_PARAMETER, PROJECT_PARAMETER}
    ]
    declarations.extend(
        [
            parameter_declaration(PM_PARAMETER),
            parameter_declaration(PROJECT_PARAMETER),
        ]
    )
    definition["ParameterDeclarations"] = declarations

    local_groups = {
        "group-overview-filter-pm",
        "group-overview-filter-project",
        "group-detail-local-pm",
        "group-detail-local-project",
        "group-shared-parameter-pm",
        "group-shared-parameter-project",
    }
    definition["FilterGroups"] = [
        group
        for group in definition.get("FilterGroups") or []
        if group.get("FilterGroupId") not in local_groups
    ]
    sheet_ids = [overview["SheetId"], detail["SheetId"]]
    definition["FilterGroups"].extend(
        [
            parameter_filter(
                "group-shared-parameter-pm",
                "shared-parameter-filter-pm",
                PM_PARAMETER,
                "Responsable Proyecto",
                sheet_ids,
            ),
            parameter_filter(
                "group-shared-parameter-project",
                "shared-parameter-filter-project",
                PROJECT_PARAMETER,
                "Proyecto",
                sheet_ids,
            ),
        ]
    )

    overview["FilterControls"] = [
        control
        for control in overview.get("FilterControls") or []
        if (control.get("Dropdown") or {}).get("SourceFilterId")
        not in {"overview-filter-pm", "overview-filter-project"}
    ]
    detail["FilterControls"] = []
    overview["ParameterControls"] = [
        parameter_control(
            "overview-parameter-pm",
            PM_PARAMETER,
            "RESPONSABLE",
            "Responsable Proyecto",
        ),
        parameter_control(
            "overview-parameter-project",
            PROJECT_PARAMETER,
            "PROYECTOS",
            "Proyecto",
            "overview-parameter-pm",
        ),
    ]
    detail["ParameterControls"] = [
        parameter_control(
            "detail-parameter-pm",
            PM_PARAMETER,
            "RESPONSABLE",
            "Responsable Proyecto",
        ),
        parameter_control(
            "detail-parameter-project",
            PROJECT_PARAMETER,
            "PROYECTOS",
            "Proyecto",
            "detail-parameter-pm",
        ),
    ]
    replace_layout_controls(
        overview,
        {"overview-control-pm", "overview-control-project"},
        "overview-parameter-pm",
        "overview-parameter-project",
        2,
    )
    replace_layout_controls(
        detail,
        {"detail-control-pm", "detail-control-project"},
        "detail-parameter-pm",
        "detail-parameter-project",
        3,
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
    LOGGER.info("Preflight de parámetros compartidos listo.")
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
    LOGGER.info("Parámetros compartidos aplicados a ambas hojas.")


if __name__ == "__main__":
    main()

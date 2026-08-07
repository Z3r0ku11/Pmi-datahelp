"""Add the project control to the Project Manager overview and republish it."""

from __future__ import annotations

import argparse
import copy
import logging
import time
from typing import Any

import boto3


LOGGER = logging.getLogger(__name__)
OVERVIEW_NAME = "PROJECT MANAGER OVERVIEW"
FILTER_ID = "overview-filter-project"
FILTER_GROUP_ID = "group-overview-filter-project"
CONTROL_ID = "overview-control-project"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--account-id", required=True)
    parser.add_argument("--analysis-id", required=True)
    parser.add_argument("--dashboard-id", required=True)
    parser.add_argument("--region", default="us-east-1")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument(
        "--publish",
        action="store_true",
        help="Publish the updated analysis definition to the dashboard.",
    )
    return parser.parse_args()


def find_overview(definition: dict[str, Any]) -> dict[str, Any]:
    sheets = definition.get("Sheets") or []
    matches = [
        sheet
        for sheet in sheets
        if OVERVIEW_NAME in str(sheet.get("Name") or "").upper()
    ]
    if len(matches) != 1:
        raise ValueError("No se encontró una única hoja Project Manager Overview.")
    return matches[0]


def configure_project_filter(definition: dict[str, Any]) -> bool:
    sheet = find_overview(definition)
    controls = sheet.setdefault("FilterControls", [])
    changed = False
    control_by_id = {
        control.get("Dropdown", {}).get("FilterControlId"): control["Dropdown"]
        for control in controls
        if control.get("Dropdown")
    }

    sheet_id = sheet["SheetId"]
    filter_groups = definition.setdefault("FilterGroups", [])
    if not any(group.get("FilterGroupId") == FILTER_GROUP_ID for group in filter_groups):
        filter_groups.append({
            "FilterGroupId": FILTER_GROUP_ID,
            "Filters": [
                {
                    "CategoryFilter": {
                        "FilterId": FILTER_ID,
                        "Column": {
                            "DataSetIdentifier": "PMOExecutive",
                            "ColumnName": "Proyecto",
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
            ],
            "ScopeConfiguration": {
                "SelectedSheets": {
                    "SheetVisualScopingConfigurations": [
                        {"SheetId": sheet_id, "Scope": "ALL_VISUALS"}
                    ]
                }
            },
            "Status": "ENABLED",
            "CrossDataset": "SINGLE_DATASET",
        })
        changed = True
    if CONTROL_ID not in control_by_id:
        project_control = {
            "Dropdown": {
                "FilterControlId": CONTROL_ID,
                "Title": "PROYECTO",
                "SourceFilterId": FILTER_ID,
                "DisplayOptions": {
                    "SelectAllOptions": {"Visibility": "VISIBLE"},
                    "TitleOptions": {"Visibility": "VISIBLE"},
                    "InfoIconLabelOptions": {"Visibility": "HIDDEN"},
                },
                "Type": "MULTI_SELECT",
                "CommitMode": "AUTO",
            },
        }
        controls.append(project_control)
        control_by_id[CONTROL_ID] = project_control["Dropdown"]
        changed = True

    expected_titles = {CONTROL_ID: "PROYECTO | ALL"}
    for control_id, title in expected_titles.items():
        control = control_by_id.get(control_id)
        if not control:
            raise ValueError(f"No se encontró el control {control_id}.")
        if control.get("Title") != title:
            control["Title"] = title
            changed = True

    pm_control = control_by_id.get("overview-control-pm")
    if not pm_control:
        raise ValueError("No se encontró el control overview-control-pm.")
    pm_title = {
        "RichText": (
            '<control-title>\n  <inline font-size="14px">'
            "RESPONSABLE | PROJECT TEAM</inline>\n</control-title>"
        )
    }
    if pm_control.get("ControlTitleFormatText") != pm_title:
        pm_control["ControlTitleFormatText"] = pm_title
        pm_control["Title"] = ""
        changed = True

    cascading = {
        "SourceControls": [
            {
                "SourceSheetControlId": "overview-control-pm",
                "ColumnToMatch": {
                    "DataSetIdentifier": "PMOExecutive",
                    "ColumnName": "Responsable Proyecto",
                },
            }
        ]
    }
    project_dropdown = control_by_id[CONTROL_ID]
    if project_dropdown.get("CascadingControlConfiguration") != cascading:
        project_dropdown["CascadingControlConfiguration"] = cascading
        changed = True

    layouts = sheet.get("Layouts") or []
    if len(layouts) != 1:
        raise ValueError("La hoja Overview debe tener un único layout.")
    grid = layouts[0]["Configuration"]["GridLayout"]
    elements = grid["Elements"]
    top_controls = {
        element["ElementId"]: element
        for element in elements
        if element.get("ElementType") == "FILTER_CONTROL"
    }
    required = {"overview-control-pm", "overview-control-status"}
    if not required.issubset(top_controls):
        raise ValueError("No se encontraron los controles superiores esperados.")
    for column, control_id in enumerate(
        ("overview-control-pm", CONTROL_ID, "overview-control-status")
    ):
        if control_id in top_controls:
            element = top_controls[control_id]
            element.update(ColumnIndex=column * 6, ColumnSpan=6)
        else:
            elements.append(
                {
                    "ElementId": control_id,
                    "ElementType": "FILTER_CONTROL",
                    "ColumnIndex": column * 6,
                    "ColumnSpan": 6,
                    "RowIndex": 0,
                    "RowSpan": 2,
                }
            )
            changed = True
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
            raise RuntimeError(f"QuickSight no pudo actualizar el análisis: {status}")
        time.sleep(2)
    raise TimeoutError("QuickSight no completó el análisis dentro del plazo.")


def wait_for_dashboard_version(
    client: Any,
    account_id: str,
    dashboard_id: str,
    version_number: int,
) -> None:
    for _ in range(60):
        response = client.describe_dashboard(
            AwsAccountId=account_id,
            DashboardId=dashboard_id,
            VersionNumber=version_number,
        )
        status = response["Dashboard"]["Version"]["Status"]
        if status == "CREATION_SUCCESSFUL":
            return
        if status == "CREATION_FAILED":
            raise RuntimeError("QuickSight no pudo crear la versión del dashboard.")
        time.sleep(2)
    raise TimeoutError("QuickSight no completó el dashboard dentro del plazo.")


def main() -> None:
    args = parse_args()
    logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
    client = boto3.client("quicksight", region_name=args.region)
    current = client.describe_analysis_definition(
        AwsAccountId=args.account_id,
        AnalysisId=args.analysis_id,
    )
    definition = copy.deepcopy(current["Definition"])
    changed = configure_project_filter(definition)
    overview = find_overview(definition)
    LOGGER.info(
        "Preflight: analysis=%s sheet=%s changed=%s controls=%s",
        args.analysis_id,
        overview["SheetId"],
        changed,
        len(overview.get("FilterControls") or []),
    )
    if not args.apply and not args.publish:
        return

    if changed:
        update_arguments: dict[str, Any] = {
            "AwsAccountId": args.account_id,
            "AnalysisId": args.analysis_id,
            "Name": current["Name"],
            "Definition": definition,
        }
        if current.get("ThemeArn"):
            update_arguments["ThemeArn"] = current["ThemeArn"]
        client.update_analysis(**update_arguments)
        wait_for_analysis(client, args.account_id, args.analysis_id)
        current = client.describe_analysis_definition(
            AwsAccountId=args.account_id,
            AnalysisId=args.analysis_id,
        )
        definition = current["Definition"]

    if not args.publish:
        LOGGER.info("Análisis listo. Dashboard sin cambios.")
        return

    dashboard = client.describe_dashboard(
        AwsAccountId=args.account_id,
        DashboardId=args.dashboard_id,
    )["Dashboard"]
    dashboard_update = client.update_dashboard(
        AwsAccountId=args.account_id,
        DashboardId=args.dashboard_id,
        Name=dashboard["Name"],
        Definition=definition,
        VersionDescription="Add top-level Project filter to PM overview",
    )
    version_arn = dashboard_update["VersionArn"]
    version_number = int(version_arn.rsplit("/", 1)[-1])
    wait_for_dashboard_version(
        client,
        args.account_id,
        args.dashboard_id,
        version_number,
    )
    client.update_dashboard_published_version(
        AwsAccountId=args.account_id,
        DashboardId=args.dashboard_id,
        VersionNumber=version_number,
    )
    LOGGER.info("Análisis actualizado y dashboard republicado.")


if __name__ == "__main__":
    main()

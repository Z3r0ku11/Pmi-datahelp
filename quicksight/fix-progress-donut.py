"""
Reconfigure the OVERALL PROGRESS donut chart in Project Detail V2
to show real task completion percentage (Completadas vs Pendientes).
"""

from __future__ import annotations

import argparse
import copy
import logging
import time
from typing import Any

import boto3


LOGGER = logging.getLogger(__name__)

ACCOUNT_ID = "664858858204"
REGION = "us-east-1"
ANALYSIS_ID = "c1030556-faa8-4110-8ca3-1fd979a68993"
DASHBOARD_ID = "pmo-project-manager-dashboard-v1"
VISUAL_ID = "53543d09-075c-427b-aadf-fefa61a9e526_v2-progress-gauge"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Reconfigurar donut OVERALL PROGRESS con avance real de tareas.",
    )
    parser.add_argument("--profile", default="pmo-asana")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--publish", action="store_true")
    return parser.parse_args()


def build_donut_visual() -> dict[str, Any]:
    """Build the donut chart showing real task progress %."""
    return {
        "PieChartVisual": {
            "VisualId": VISUAL_ID,
            "Title": {
                "Visibility": "VISIBLE",
                "FormatText": {
                    "PlainText": "AVANCE REAL TAREAS (%)",
                },
            },
            "Subtitle": {"Visibility": "HIDDEN"},
            "ChartConfiguration": {
                "FieldWells": {
                    "PieChartAggregatedFieldWells": {
                        "Category": [
                            {
                                "CategoricalDimensionField": {
                                    "FieldId": "v2-donut-category",
                                    "Column": {
                                        "DataSetIdentifier": "PMOTasks",
                                        "ColumnName": "Estado Tarea Binario",
                                    },
                                }
                            }
                        ],
                        "Values": [
                            {
                                "NumericalMeasureField": {
                                    "FieldId": "v2-donut-value",
                                    "Column": {
                                        "DataSetIdentifier": "PMOTasks",
                                        "ColumnName": "Tarea Registro",
                                    },
                                    "AggregationFunction": {
                                        "SimpleNumericalAggregation": "SUM",
                                    },
                                }
                            }
                        ],
                    }
                },
                "SortConfiguration": {
                    "CategorySort": [
                        {
                            "FieldSort": {
                                "FieldId": "v2-donut-value",
                                "Direction": "DESC",
                            }
                        }
                    ]
                },
                "DonutOptions": {
                    "ArcOptions": {"ArcThickness": "MEDIUM"},
                    "DonutCenterOptions": {"LabelVisibility": "VISIBLE"},
                },
                "Legend": {
                    "Visibility": "VISIBLE",
                    "Position": "BOTTOM",
                },
                "DataLabels": {
                    "Visibility": "VISIBLE",
                    "MeasureLabelVisibility": "VISIBLE",
                    "CategoryLabelVisibility": "VISIBLE",
                    "LabelContent": "PERCENT",
                    "Overlap": "DISABLE_OVERLAP",
                },
                "Tooltip": {
                    "TooltipVisibility": "VISIBLE",
                    "SelectedTooltipType": "BASIC",
                    "FieldBasedTooltip": {
                        "AggregationVisibility": "HIDDEN",
                        "TooltipTitleType": "PRIMARY_VALUE",
                        "TooltipFields": [
                            {
                                "FieldTooltipItem": {
                                    "FieldId": "v2-donut-category",
                                    "Visibility": "VISIBLE",
                                }
                            },
                            {
                                "FieldTooltipItem": {
                                    "FieldId": "v2-donut-value",
                                    "Visibility": "VISIBLE",
                                }
                            },
                        ],
                    },
                },
            },
            "Actions": [],
            "ColumnHierarchies": [],
            "VisualContentAltText": "Avance real de tareas: completadas vs pendientes",
        }
    }


def ensure_calculated_field(definition: dict[str, Any]) -> bool:
    """Ensure 'Estado Tarea Binario' calculated field exists."""
    calculated = definition.setdefault("CalculatedFields", [])
    field_name = "Estado Tarea Binario"

    for field in calculated:
        if field.get("Name") == field_name:
            return False

    calculated.append({
        "DataSetIdentifier": "PMOTasks",
        "Name": field_name,
        "Expression": (
            "ifelse({completed}='true' OR {completed}='True',"
            "'Completadas','Pendientes')"
        ),
    })
    LOGGER.info("Campo calculado '%s' agregado.", field_name)
    return True


def update_visual(definition: dict[str, Any]) -> bool:
    """Replace the existing donut visual with the new configuration."""
    for sheet in definition.get("Sheets", []):
        if "DETAIL V2" not in sheet.get("Name", "").upper():
            continue

        visuals = sheet.get("Visuals", [])
        new_visual = build_donut_visual()

        for i, v in enumerate(visuals):
            if "PieChartVisual" in v:
                if v["PieChartVisual"].get("VisualId") == VISUAL_ID:
                    visuals[i] = new_visual
                    LOGGER.info("Visual donut reconfigurado.")
                    return True

        # If not found, append
        visuals.append(new_visual)
        LOGGER.info("Visual donut agregado (no existia).")
        return True

    return False


def wait_for_analysis(client: Any) -> None:
    for _ in range(90):
        response = client.describe_analysis(
            AwsAccountId=ACCOUNT_ID, AnalysisId=ANALYSIS_ID
        )
        status = response["Analysis"]["Status"]
        if status in {"UPDATE_SUCCESSFUL", "CREATION_SUCCESSFUL"}:
            return
        if status.endswith("FAILED"):
            raise RuntimeError(f"Analisis fallo: {status}")
        time.sleep(2)
    raise TimeoutError("Analisis no completo.")


def wait_for_dashboard(client: Any, version_number: int) -> None:
    for _ in range(90):
        response = client.describe_dashboard(
            AwsAccountId=ACCOUNT_ID,
            DashboardId=DASHBOARD_ID,
            VersionNumber=version_number,
        )
        status = response["Dashboard"]["Version"]["Status"]
        if status == "CREATION_SUCCESSFUL":
            return
        if status == "CREATION_FAILED":
            errors = response["Dashboard"]["Version"].get("Errors", [])
            for err in errors:
                LOGGER.error("Error: %s - %s", err.get("Type"), err.get("Message"))
            raise RuntimeError("Dashboard fallo.")
        time.sleep(2)
    raise TimeoutError("Dashboard no completo.")


def main() -> None:
    args = parse_args()
    logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")

    session = boto3.Session(profile_name=args.profile, region_name=REGION)
    client = session.client("quicksight")

    current = client.describe_analysis_definition(
        AwsAccountId=ACCOUNT_ID, AnalysisId=ANALYSIS_ID
    )
    definition = copy.deepcopy(current["Definition"])
    name = current["Name"]
    theme_arn = current.get("ThemeArn")

    c1 = ensure_calculated_field(definition)
    c2 = update_visual(definition)
    changed = c1 or c2

    LOGGER.info("Preflight: calculated_field=%s visual=%s changed=%s", c1, c2, changed)

    if not changed:
        LOGGER.info("Sin cambios necesarios.")
        return

    if not args.apply:
        LOGGER.info("Cambios detectados. Use --apply para publicar.")
        return

    request: dict[str, Any] = {
        "AwsAccountId": ACCOUNT_ID,
        "AnalysisId": ANALYSIS_ID,
        "Name": name,
        "Definition": definition,
        "ValidationStrategy": {"Mode": "LENIENT"},
    }
    if theme_arn:
        request["ThemeArn"] = theme_arn

    response = client.update_analysis(**request)
    LOGGER.info("Analisis actualizado: status=%s", response["Status"])
    wait_for_analysis(client)

    if not args.publish:
        LOGGER.info("Analisis listo. Dashboard sin cambios.")
        return

    dashboard = client.describe_dashboard(
        AwsAccountId=ACCOUNT_ID, DashboardId=DASHBOARD_ID
    )["Dashboard"]

    dashboard_response = client.update_dashboard(
        AwsAccountId=ACCOUNT_ID,
        DashboardId=DASHBOARD_ID,
        Name=dashboard["Name"],
        Definition=definition,
        VersionDescription="Donut chart: avance real tareas (%)",
        ValidationStrategy={"Mode": "LENIENT"},
    )
    version_arn = dashboard_response["VersionArn"]
    version_number = int(version_arn.rsplit("/", 1)[-1])
    wait_for_dashboard(client, version_number)

    client.update_dashboard_published_version(
        AwsAccountId=ACCOUNT_ID,
        DashboardId=DASHBOARD_ID,
        VersionNumber=version_number,
    )
    LOGGER.info("Dashboard republicado con donut de avance real.")


if __name__ == "__main__":
    main()

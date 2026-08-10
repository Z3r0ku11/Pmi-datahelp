"""
Enable multi-select on the Project filter (SharedProject parameter)
in the PROJECT DETAIL V2 sheet, keeping the cascading link to PM.

Changes:
1. SharedProject parameter: SINGLE_VALUED -> MULTI_VALUED
2. v2-control-project ParameterControl: SINGLE_SELECT -> MULTI_SELECT
3. CascadingControlConfiguration: PRESERVED (filters projects by selected PM)
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
PARAMETER_NAME = "SharedProject"
CONTROL_ID = "v2-control-project"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Habilitar multi-select en filtro Proyecto (Hoja 2) con cascading por PM.",
    )
    parser.add_argument("--profile", default="pmo-asana")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--publish", action="store_true")
    return parser.parse_args()


def upgrade_parameter(definition: dict[str, Any]) -> bool:
    """Change SharedProject from SINGLE_VALUED to MULTI_VALUED."""
    changed = False
    for param in definition.get("ParameterDeclarations", []):
        decl = param.get("StringParameterDeclaration")
        if not decl or decl.get("Name") != PARAMETER_NAME:
            continue
        if decl.get("ParameterValueType") != "MULTI_VALUED":
            decl["ParameterValueType"] = "MULTI_VALUED"
            decl["DefaultValues"] = {"StaticValues": []}
            # Remove ValueWhenUnset - not used for multi-valued
            decl.pop("ValueWhenUnset", None)
            changed = True
            LOGGER.info("Parametro SharedProject cambiado a MULTI_VALUED.")
    return changed


def upgrade_control(definition: dict[str, Any]) -> bool:
    """Change the ParameterControl dropdown to MULTI_SELECT, keep cascading."""
    changed = False
    for sheet in definition.get("Sheets", []):
        for control in sheet.get("ParameterControls", []):
            dropdown = control.get("Dropdown")
            if not dropdown:
                continue
            if dropdown.get("ParameterControlId") != CONTROL_ID:
                continue
            if dropdown.get("Type") != "MULTI_SELECT":
                dropdown["Type"] = "MULTI_SELECT"
                changed = True
                LOGGER.info("Control v2-control-project cambiado a MULTI_SELECT.")
            # Ensure SelectAllOptions visible
            display = dropdown.setdefault("DisplayOptions", {})
            sao = display.setdefault("SelectAllOptions", {})
            if sao.get("Visibility") != "VISIBLE":
                sao["Visibility"] = "VISIBLE"
                changed = True
            # KEEP CascadingControlConfiguration - do NOT remove it
            if "CascadingControlConfiguration" in dropdown:
                LOGGER.info("CascadingControlConfiguration preservada (filtra por PM).")
            else:
                # Re-add cascading if missing
                dropdown["CascadingControlConfiguration"] = {
                    "SourceControls": [
                        {
                            "SourceSheetControlId": "v2-control-pm",
                            "ColumnToMatch": {
                                "DataSetIdentifier": "PMOExecutive",
                                "ColumnName": "Responsable Proyecto",
                            },
                        }
                    ]
                }
                changed = True
                LOGGER.info("CascadingControlConfiguration restaurada.")
    return changed


def wait_for_analysis(client: Any) -> None:
    for _ in range(90):
        response = client.describe_analysis(
            AwsAccountId=ACCOUNT_ID,
            AnalysisId=ANALYSIS_ID,
        )
        status = response["Analysis"]["Status"]
        if status in {"UPDATE_SUCCESSFUL", "CREATION_SUCCESSFUL"}:
            return
        if status.endswith("FAILED"):
            raise RuntimeError(f"QuickSight rechazo el analisis: {status}")
        time.sleep(2)
    raise TimeoutError("El analisis no se completo dentro del plazo.")


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
            raise RuntimeError("QuickSight no pudo crear la version del dashboard.")
        time.sleep(2)
    raise TimeoutError("El dashboard no se completo dentro del plazo.")


def main() -> None:
    args = parse_args()
    logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")

    session = boto3.Session(profile_name=args.profile, region_name=REGION)
    client = session.client("quicksight")

    current = client.describe_analysis_definition(
        AwsAccountId=ACCOUNT_ID,
        AnalysisId=ANALYSIS_ID,
    )
    definition = copy.deepcopy(current["Definition"])
    name = current["Name"]
    theme_arn = current.get("ThemeArn")

    c1 = upgrade_parameter(definition)
    c2 = upgrade_control(definition)
    changed = c1 or c2

    LOGGER.info("Preflight: param=%s control=%s changed=%s", c1, c2, changed)

    if not changed:
        LOGGER.info("Ya esta configurado como multi-select. Sin cambios.")
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
        AwsAccountId=ACCOUNT_ID,
        DashboardId=DASHBOARD_ID,
    )["Dashboard"]

    dashboard_response = client.update_dashboard(
        AwsAccountId=ACCOUNT_ID,
        DashboardId=DASHBOARD_ID,
        Name=dashboard["Name"],
        Definition=definition,
        VersionDescription="Multi-select Project filter with PM cascading",
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
    LOGGER.info("Dashboard republicado con multi-select + cascading.")


if __name__ == "__main__":
    main()

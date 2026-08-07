"""Map the shared Project filter to the PMOTasks dataset in an analysis."""

from __future__ import annotations

import argparse
import copy
import logging
import time
from typing import Any

import boto3


LOGGER = logging.getLogger(__name__)
DATASET_IDENTIFIER = "PMOTasks"
FIELD_NAME = "Proyecto"
FIELD_EXPRESSION = "{project_name}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--account-id", required=True)
    parser.add_argument("--analysis-id", required=True)
    parser.add_argument("--region", default="us-east-1")
    parser.add_argument("--apply", action="store_true")
    return parser.parse_args()


def configure(definition: dict[str, Any]) -> bool:
    fields = definition.setdefault("CalculatedFields", [])
    matches = [
        field
        for field in fields
        if field.get("DataSetIdentifier") == DATASET_IDENTIFIER
        and field.get("Name") == FIELD_NAME
    ]
    if len(matches) > 1:
        raise ValueError("Existe más de un campo PMOTasks.Proyecto.")
    if matches:
        if matches[0].get("Expression") == FIELD_EXPRESSION:
            return False
        matches[0]["Expression"] = FIELD_EXPRESSION
        return True
    fields.append(
        {
            "DataSetIdentifier": DATASET_IDENTIFIER,
            "Name": FIELD_NAME,
            "Expression": FIELD_EXPRESSION,
        }
    )
    return True


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
    LOGGER.info("PMOTasks.Proyecto quedó disponible para mapeo cruzado.")


if __name__ == "__main__":
    main()

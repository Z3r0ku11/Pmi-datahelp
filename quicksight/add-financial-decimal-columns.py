"""
Add Pago Cliente, Fondos AWS, Incentivos, Creditos AWS, Inversion Morris
as DECIMAL columns to the PMO Executive Semantic Model dataset.

Updates the existing dataset by:
1. Adding columns to the physical table InputColumns
2. Adding CastColumnTypeOperation to cast them to DECIMAL
3. Adding them to the field folder '06 - Finanzas y capacidad'
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
DATASET_ID = "pmo-executive-semantic-v1-1"

FINANCIAL_COLUMNS = [
    "Pago Cliente",
    "Fondos AWS",
    "Incentivos",
    "Creditos AWS",
    "Inversion Morris",
]

FOLDER_NAME = "06 - Finanzas y capacidad"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Agregar columnas financieras como DECIMAL al dataset.",
    )
    parser.add_argument("--profile", default="pmo-asana")
    parser.add_argument("--apply", action="store_true")
    return parser.parse_args()


def add_columns_to_dataset(dataset: dict[str, Any]) -> bool:
    changed = False

    # 1. Add to physical table InputColumns (projectsPhysical)
    physical_map = dataset.get("PhysicalTableMap", {})
    projects_physical = physical_map.get("projectsPhysical", {})
    s3_source = projects_physical.get("S3Source", {})
    input_columns = s3_source.get("InputColumns", [])

    existing_names = {col["Name"] for col in input_columns}
    for col_name in FINANCIAL_COLUMNS:
        if col_name not in existing_names:
            input_columns.append({"Name": col_name, "Type": "STRING"})
            changed = True
            LOGGER.info("Agregada InputColumn: %s", col_name)

    # 2. Add CastColumnTypeOperation to projectsLogical transforms
    logical_map = dataset.get("LogicalTableMap", {})
    projects_logical = logical_map.get("projectsLogical", {})
    transforms = projects_logical.get("DataTransforms", [])

    existing_casts = set()
    for transform in transforms:
        cast_op = transform.get("CastColumnTypeOperation")
        if cast_op:
            existing_casts.add(cast_op["ColumnName"])

    for col_name in FINANCIAL_COLUMNS:
        if col_name not in existing_casts:
            transforms.append({
                "CastColumnTypeOperation": {
                    "ColumnName": col_name,
                    "NewColumnType": "DECIMAL",
                }
            })
            changed = True
            LOGGER.info("Agregado cast DECIMAL: %s", col_name)

    # 3. Add to field folder
    field_folders = dataset.get("FieldFolders", {})
    folder = field_folders.get(FOLDER_NAME, {})
    folder_columns = folder.get("columns", [])

    for col_name in FINANCIAL_COLUMNS:
        if col_name not in folder_columns:
            folder_columns.append(col_name)
            changed = True
            LOGGER.info("Agregada a folder '%s': %s", FOLDER_NAME, col_name)

    if FOLDER_NAME not in field_folders:
        field_folders[FOLDER_NAME] = {
            "columns": folder_columns,
            "description": "Campos gobernados del modelo semantico PMO v1.1.0.",
        }
        changed = True

    return changed


def main() -> None:
    args = parse_args()
    logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")

    session = boto3.Session(profile_name=args.profile, region_name=REGION)
    client = session.client("quicksight")

    # Get current dataset
    current = client.describe_data_set(
        AwsAccountId=ACCOUNT_ID,
        DataSetId=DATASET_ID,
    )["DataSet"]

    # Remove read-only fields
    dataset = copy.deepcopy(current)
    for key in [
        "Arn", "CreatedTime", "LastUpdatedTime", "OutputColumns",
        "ConsumedSpiceCapacityInBytes", "DataSetUsageConfiguration",
    ]:
        dataset.pop(key, None)

    changed = add_columns_to_dataset(dataset)

    LOGGER.info("Preflight: changed=%s", changed)

    if not changed:
        LOGGER.info("Las columnas ya existen. Sin cambios.")
        return

    if not args.apply:
        LOGGER.info("Cambios detectados. Use --apply para aplicar.")
        return

    # Update dataset
    response = client.update_data_set(
        AwsAccountId=ACCOUNT_ID,
        DataSetId=dataset["DataSetId"],
        Name=dataset["Name"],
        PhysicalTableMap=dataset["PhysicalTableMap"],
        LogicalTableMap=dataset["LogicalTableMap"],
        ImportMode=dataset["ImportMode"],
        FieldFolders=dataset.get("FieldFolders", {}),
    )
    LOGGER.info("Dataset actualizado: status=%s", response["Status"])

    # Trigger SPICE refresh
    ingestion_id = f"add-financial-cols-{int(time.time())}"
    client.create_ingestion(
        AwsAccountId=ACCOUNT_ID,
        DataSetId=DATASET_ID,
        IngestionId=ingestion_id,
    )
    LOGGER.info("Ingestion iniciada: %s", ingestion_id)

    # Wait for ingestion
    for _ in range(120):
        ing = client.describe_ingestion(
            AwsAccountId=ACCOUNT_ID,
            DataSetId=DATASET_ID,
            IngestionId=ingestion_id,
        )["Ingestion"]
        status = ing["IngestionStatus"]
        if status == "COMPLETED":
            rows = ing.get("RowInfo", {}).get("RowsIngested", "?")
            LOGGER.info("Ingestion completada: %s filas.", rows)
            return
        if status in ("FAILED", "CANCELLED"):
            LOGGER.error("Ingestion fallo: %s", ing.get("ErrorInfo"))
            raise RuntimeError(f"Ingestion fallo: {status}")
        time.sleep(5)

    raise TimeoutError("Ingestion no completo en tiempo.")


if __name__ == "__main__":
    main()

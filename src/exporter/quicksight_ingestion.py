"""Start QuickSight SPICE ingestions after S3 publication."""

from __future__ import annotations

import hashlib
import logging
import re
import time
from datetime import datetime, timezone
from typing import Any

import boto3
from botocore.exceptions import ClientError

from config import settings

LOGGER = logging.getLogger(__name__)
_ACTIVE_STATUSES = {"INITIALIZED", "QUEUED", "RUNNING"}
_SAFE_ID = re.compile(r"[^A-Za-z0-9_-]+")


class QuickSightIngestionService:
    """Start one non-overlapping ingestion per configured dataset."""

    def __init__(self, client: Any | None = None) -> None:
        self.client = client

    def start_all(self, run_id: str | None = None) -> list[dict[str, str]]:
        if not settings.quicksight_ingestion_enabled:
            LOGGER.info("Ingestas QuickSight deshabilitadas por configuración")
            return []
        if self.client is None:
            self.client = boto3.client(
                "quicksight", region_name=settings.aws_region
            )

        execution_id = run_id or datetime.now(timezone.utc).strftime(
            "%Y%m%dT%H%M%SZ"
        )
        results = []
        failures = []
        for dataset_id in settings.quicksight_dataset_ids:
            try:
                results.append(self._start(dataset_id, execution_id))
            except Exception as exc:
                LOGGER.exception(
                    "Falló la solicitud de ingesta QuickSight | dataset=%s",
                    dataset_id,
                )
                results.append({
                    "datasetId": dataset_id,
                    "status": "FAILED",
                    "ingestionId": "",
                })
                failures.append((dataset_id, exc))
        if failures:
            failed_ids = ", ".join(dataset_id for dataset_id, _ in failures)
            raise RuntimeError(
                f"Fallaron ingestas QuickSight para: {failed_ids}"
            ) from failures[0][1]
        return results

    def _start(self, dataset_id: str, execution_id: str) -> dict[str, str]:
        active = self._active_ingestion(dataset_id)
        if active:
            ingestion_id = str(active.get("IngestionId", "unknown"))
            LOGGER.warning(
                "Ingesta QuickSight omitida por solapamiento | dataset=%s | ingestion=%s",
                dataset_id,
                ingestion_id,
            )
            return {"datasetId": dataset_id, "status": "SKIPPED_ACTIVE", "ingestionId": ingestion_id}

        ingestion_id = self._ingestion_id(dataset_id, execution_id)
        request = {
            "AwsAccountId": settings.aws_account_id,
            "DataSetId": dataset_id,
            "IngestionId": ingestion_id,
        }
        try:
            self.client.create_ingestion(**request)
        except ClientError as exc:
            code = exc.response.get("Error", {}).get("Code", "Unknown")
            if code in {"ConflictException", "ResourceExistsException"}:
                LOGGER.warning(
                    "Ingesta QuickSight ya iniciada | dataset=%s | ingestion=%s",
                    dataset_id,
                    ingestion_id,
                )
                return {"datasetId": dataset_id, "status": "ALREADY_STARTED", "ingestionId": ingestion_id}
            if code == "ThrottlingException":
                time.sleep(2)
                self.client.create_ingestion(**request)
            else:
                LOGGER.error(
                    "No fue posible iniciar ingesta QuickSight | dataset=%s | code=%s",
                    dataset_id,
                    code,
                )
                raise

        LOGGER.info(
            "Ingesta QuickSight iniciada | dataset=%s | ingestion=%s",
            dataset_id,
            ingestion_id,
        )
        return {"datasetId": dataset_id, "status": "REQUESTED", "ingestionId": ingestion_id}

    def _active_ingestion(self, dataset_id: str) -> dict[str, Any] | None:
        response = self.client.list_ingestions(
            AwsAccountId=settings.aws_account_id,
            DataSetId=dataset_id,
        )
        for ingestion in response.get("Ingestions", []):
            if ingestion.get("IngestionStatus") in _ACTIVE_STATUSES:
                return ingestion
        return None

    @staticmethod
    def _ingestion_id(dataset_id: str, execution_id: str) -> str:
        safe_execution = _SAFE_ID.sub("-", execution_id).strip("-")[:24]
        safe_dataset = _SAFE_ID.sub("-", dataset_id).strip("-")[:24]
        dataset_hash = hashlib.sha256(dataset_id.encode("utf-8")).hexdigest()[:10]
        value = f"etl-{safe_execution}-{dataset_hash}-{safe_dataset}"
        return value[:64].rstrip("-")

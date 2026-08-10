import logging
from pathlib import Path

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from config import settings

logger = logging.getLogger(__name__)


class S3Repository:
    def __init__(self) -> None:
        self.client = boto3.client(
            "s3",
            region_name=settings.aws_region,
        )

    def upload_file(
        self,
        local_path: str,
        object_key: str,
    ) -> None:
        path = Path(local_path)

        if not path.exists():
            raise FileNotFoundError(
                f"No existe el archivo local: {path}"
            )

        if not path.is_file():
            raise ValueError(
                f"La ruta indicada no corresponde a un archivo: {path}"
            )

        try:
            self.client.upload_file(
                Filename=str(path),
                Bucket=settings.s3_bucket,
                Key=object_key,
                ExtraArgs={
                    "ServerSideEncryption": "AES256",
                    "ContentType": "text/csv",
                },
            )

        except (ClientError, BotoCoreError):
            logger.exception(
                "No fue posible cargar el archivo a S3 | "
                "bucket=%s | key=%s | local_path=%s",
                settings.s3_bucket,
                object_key,
                path,
            )
            raise

        logger.info(
            "Archivo cargado correctamente a S3 | "
            "bucket=%s | key=%s | local_path=%s",
            settings.s3_bucket,
            object_key,
            path,
        )

    def read_json(self, object_key: str) -> dict | None:
        """Read a JSON object from S3. Returns None if not found."""
        try:
            response = self.client.get_object(
                Bucket=settings.s3_bucket,
                Key=object_key,
            )
            import json
            return json.loads(response["Body"].read())
        except ClientError as exc:
            if exc.response["Error"]["Code"] in ("NoSuchKey", "404"):
                return None
            raise

    def write_json(self, object_key: str, data: dict) -> None:
        """Write a JSON object to S3."""
        import json
        self.client.put_object(
            Bucket=settings.s3_bucket,
            Key=object_key,
            Body=json.dumps(data, ensure_ascii=False, default=str),
            ServerSideEncryption="AES256",
            ContentType="application/json",
        )

    def read_csv(self, object_key: str) -> list[dict[str, str]] | None:
        """Read a CSV file from S3 as list of dicts. Returns None if not found."""
        import csv
        import io
        try:
            response = self.client.get_object(
                Bucket=settings.s3_bucket,
                Key=object_key,
            )
            content = response["Body"].read().decode("utf-8-sig")
            reader = csv.DictReader(io.StringIO(content))
            return list(reader)
        except ClientError as exc:
            if exc.response["Error"]["Code"] in ("NoSuchKey", "404"):
                return None
            raise
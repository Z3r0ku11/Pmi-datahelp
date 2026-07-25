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
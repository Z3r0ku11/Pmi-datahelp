import csv
import logging
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


class CsvExporter:
    """Exporta colecciones de diccionarios a archivos CSV."""

    def export(
        self,
        records: list[dict[str, Any]],
        output_path: str,
        fieldnames: list[str],
    ) -> Path:
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)

        try:
            with path.open(
                mode="w",
                encoding="utf-8-sig",
                newline="",
            ) as csv_file:
                writer = csv.DictWriter(
                    csv_file,
                    fieldnames=fieldnames,
                    extrasaction="ignore",
                )

                writer.writeheader()
                writer.writerows(records)

        except OSError:
            logger.exception(
                "No fue posible generar el archivo CSV | path=%s",
                path,
            )
            raise

        logger.info(
            "CSV generado correctamente | path=%s | registros=%s",
            path,
            len(records),
        )

        return path
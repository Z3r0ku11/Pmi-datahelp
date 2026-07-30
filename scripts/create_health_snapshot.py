from __future__ import annotations

import argparse
import csv
import sys
from datetime import date
from pathlib import Path


EXPORTER_DIRECTORY = (
    Path(__file__).resolve().parents[1] / "src" / "exporter"
)
sys.path.insert(0, str(EXPORTER_DIRECTORY))

from csv_exporter import CsvExporter  # noqa: E402
from health_snapshot_service import (  # noqa: E402
    HealthSnapshotService,
    PORTFOLIO_HEALTH_FIELDS,
    PROJECT_HEALTH_FIELDS,
)


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Genera snapshots de salud desde projects.csv.",
    )
    parser.add_argument(
        "--projects",
        required=True,
        type=Path,
        help="Ruta al projects.csv oficial.",
    )
    parser.add_argument(
        "--output-directory",
        required=True,
        type=Path,
        help="Directorio donde se escribirán los snapshots.",
    )
    parser.add_argument(
        "--snapshot-date",
        type=date.fromisoformat,
        default=date.today(),
        help="Fecha ISO del snapshot. Predeterminado: hoy.",
    )
    parser.add_argument(
        "--baseline-type",
        default="INITIAL_BASELINE",
        choices=("INITIAL_BASELINE", "MONTHLY_SNAPSHOT"),
    )
    return parser.parse_args()


def main() -> None:
    arguments = parse_arguments()

    with arguments.projects.open(
        mode="r",
        encoding="utf-8-sig",
        newline="",
    ) as csv_file:
        projects = list(csv.DictReader(csv_file))

    service = HealthSnapshotService(
        snapshot_date=arguments.snapshot_date
    )
    project_rows, portfolio_rows = service.build(
        projects=projects,
        baseline_type=arguments.baseline_type,
    )
    exporter = CsvExporter()
    exporter.export(
        records=project_rows,
        output_path=str(
            arguments.output_directory
            / "project_health_snapshot.csv"
        ),
        fieldnames=PROJECT_HEALTH_FIELDS,
    )
    exporter.export(
        records=portfolio_rows,
        output_path=str(
            arguments.output_directory
            / "portfolio_health_snapshot.csv"
        ),
        fieldnames=PORTFOLIO_HEALTH_FIELDS,
    )

    print(
        "Snapshot generado | "
        f"proyectos={len(project_rows)} | "
        f"portfolio_health="
        f"{portfolio_rows[0]['portfolio_health']}"
    )


if __name__ == "__main__":
    main()

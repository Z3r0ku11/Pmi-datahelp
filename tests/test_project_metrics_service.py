from datetime import date
from unittest import TestCase

from project_metrics_service import ProjectMetricsService


class ProjectMetricsServiceTest(TestCase):
    def test_uses_planned_end_custom_field_as_due_date(self) -> None:
        service = ProjectMetricsService(today=date(2026, 7, 27))
        project = {
            "gid": "project-1",
            "name": "Proyecto",
            "custom_fields": [
                {
                    "name": (
                        "Fecha Planificada Termino del proyecto"
                    ),
                    "date_value": {
                        "date": "2026-08-10",
                    },
                },
            ],
        }

        record = service.build_metrics([project], [])[0]

        self.assertEqual(record["due_on"], "2026-08-10")
        self.assertEqual(record["days_to_finish"], 14)
        self.assertEqual(record["missing_due_date"], 0)
        self.assertEqual(record["alert_level"], "DUE_15")

    def test_direct_due_date_has_priority(self) -> None:
        service = ProjectMetricsService(today=date(2026, 7, 27))
        project = {
            "gid": "project-1",
            "name": "Proyecto",
            "due_on": "2026-08-01",
            "custom_fields": [
                {
                    "name": (
                        "Fecha Planificada Termino del proyecto"
                    ),
                    "date_value": {
                        "date": "2026-08-10",
                    },
                },
            ],
        }

        record = service.build_metrics([project], [])[0]

        self.assertEqual(record["due_on"], "2026-08-01")
        self.assertEqual(record["days_to_finish"], 5)
        self.assertEqual(record["alert_level"], "DUE_7")

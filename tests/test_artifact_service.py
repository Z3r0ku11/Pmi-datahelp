import unittest

from intelligence.artifact_service import (
    ArtifactValidationError,
    build_project_pack,
)


class ArtifactServiceTest(unittest.TestCase):
    def setUp(self):
        self.payload = {
            "project": {
                "id": "PMO-100",
                "name": "Migración piloto",
                "hours_per_week": 40,
            },
            "wbs": [
                {
                    "code": "1",
                    "name": "Proyecto",
                    "planned_hours": 120,
                },
                {
                    "code": "1.1",
                    "parent_code": "1",
                    "name": "Diseño",
                    "deliverable": "Diseño aprobado",
                    "planned_hours": 40,
                },
            ],
            "schedule": [
                {
                    "id": "ACT-1",
                    "wbs_code": "1.1",
                    "name": "Preparar diseño",
                    "planned_hours": 40,
                },
                {
                    "id": "ACT-2",
                    "wbs_code": "1.1",
                    "name": "Aprobar diseño",
                    "planned_hours": 20,
                    "dependencies": ["ACT-1"],
                },
            ],
            "risks": [
                {
                    "id": "R-1",
                    "wbs_code": "1.1",
                    "description": "Demora en aprobación",
                    "probability": 4,
                    "impact": 5,
                }
            ],
        }

    def test_builds_linked_pack_and_week_summary(self):
        result = build_project_pack(self.payload)

        self.assertEqual(result["summary"]["planned_hours"], 60)
        self.assertEqual(result["summary"]["planned_weeks"], 1.5)
        self.assertEqual(result["summary"]["high_or_critical_risks"], 1)
        self.assertEqual(result["risks"][0]["level"], "Crítico")

    def test_empty_risk_values_use_lowest_score(self):
        self.payload["risks"][0]["probability"] = None
        self.payload["risks"][0]["impact"] = None

        result = build_project_pack(self.payload)

        self.assertEqual(result["risks"][0]["score"], 1)
        self.assertEqual(result["risks"][0]["level"], "Bajo")

    def test_rejects_unknown_wbs_reference(self):
        self.payload["schedule"][0]["wbs_code"] = "9.9"

        with self.assertRaisesRegex(
            ArtifactValidationError,
            "EDT inexistente",
        ):
            build_project_pack(self.payload)

    def test_rejects_unknown_dependency(self):
        self.payload["schedule"][1]["dependencies"] = ["ACT-99"]

        with self.assertRaisesRegex(
            ArtifactValidationError,
            "Dependencia inexistente",
        ):
            build_project_pack(self.payload)

    def test_rejects_schedule_dependency_cycle(self):
        self.payload["schedule"][0]["dependencies"] = ["ACT-2"]

        with self.assertRaisesRegex(
            ArtifactValidationError,
            "ciclo",
        ):
            build_project_pack(self.payload)

    def test_rejects_end_date_before_start_date(self):
        self.payload["schedule"][0]["start_date"] = "2026-08-10"
        self.payload["schedule"][0]["end_date"] = "2026-08-01"

        with self.assertRaisesRegex(
            ArtifactValidationError,
            "termina antes",
        ):
            build_project_pack(self.payload)

    def test_rejects_more_than_ten_risks(self):
        base_risk = self.payload["risks"][0]
        self.payload["risks"] = [
            {**base_risk, "id": f"R-{index:03d}"}
            for index in range(1, 12)
        ]

        with self.assertRaisesRegex(
            ArtifactValidationError,
            "más de 10 riesgos",
        ):
            build_project_pack(self.payload)

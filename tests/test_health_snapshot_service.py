from datetime import date
from unittest import TestCase

from health_snapshot_service import HealthSnapshotService


class HealthSnapshotServiceTest(TestCase):
    def setUp(self) -> None:
        self.service = HealthSnapshotService(
            snapshot_date=date(2026, 7, 28)
        )

    def test_builds_project_and_portfolio_baseline(self) -> None:
        projects = [
            {
                "PROJECT ID": "1",
                "NAME": "Curso",
                "STATUS COLOR": "En Curso",
            },
            {
                "PROJECT ID": "2",
                "NAME": "Espera",
                "STATUS COLOR": "On Hold",
            },
            {
                "PROJECT ID": "3",
                "NAME": "Finalizado",
                "STATUS COLOR": "Finalizado",
            },
        ]

        project_rows, portfolio_rows = self.service.build(
            projects,
            baseline_type="INITIAL_BASELINE",
        )

        self.assertEqual(project_rows[0]["health_project_score"], 100)
        self.assertEqual(project_rows[1]["health_project_score"], 60)
        self.assertEqual(project_rows[2]["health_project_score"], "")
        self.assertEqual(
            project_rows[2]["included_in_portfolio_health"],
            0,
        )
        self.assertEqual(portfolio_rows[0]["portfolio_health"], 80.0)
        self.assertEqual(portfolio_rows[0]["active_projects"], 2)
        self.assertEqual(
            portfolio_rows[0]["baseline_type"],
            "INITIAL_BASELINE",
        )

    def test_uses_one_stable_object_per_month(self) -> None:
        self.assertEqual(
            self.service.project_object_key("history/project_health/"),
            (
                "history/project_health/year=2026/month=07/"
                "project_health_snapshot.csv"
            ),
        )
        self.assertEqual(
            self.service.portfolio_object_key(
                "history/portfolio_health"
            ),
            (
                "history/portfolio_health/year=2026/month=07/"
                "portfolio_health_snapshot.csv"
            ),
        )

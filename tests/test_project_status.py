from unittest import TestCase

from app import get_project_status_label


class ProjectStatusTest(TestCase):
    def test_completed_has_priority_over_color(self) -> None:
        self.assertEqual(
            get_project_status_label(
                status_color="green",
                completed=True,
            ),
            "Finalizado",
        )

    def test_archived_has_priority_over_color(self) -> None:
        self.assertEqual(
            get_project_status_label(
                status_color="green",
                archived=True,
            ),
            "Descartado",
        )

    def test_empty_color_is_not_discarded(self) -> None:
        self.assertEqual(
            get_project_status_label(status_color=None),
            "On Hold",
        )

    def test_maps_asana_color_to_business_status(self) -> None:
        self.assertEqual(
            get_project_status_label(status_color="red"),
            "Con retraso",
        )

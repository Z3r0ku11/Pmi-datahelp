from datetime import date, datetime


class TaskTransformer:

    @staticmethod
    def enrich(task: dict) -> dict:
        ...
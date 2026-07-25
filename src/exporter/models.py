from dataclasses import dataclass


@dataclass(slots=True)
class ProjectRecord:
    project_gid: str
    project_name: str
    responsable_proyecto: str
    owner_name: str
    archived: bool
    completed: bool
    created_at: str | None
    modified_at: str | None
    start_on: str | None
    due_on: str | None
    status_title: str
    permalink_url: str


@dataclass(slots=True)
class TaskRecord:
    project_gid: str
    project_name: str
    responsable_proyecto: str
    task_gid: str
    task_name: str
    assignee_name: str
    completed: bool
    due_on: str | None
    section_name: str 
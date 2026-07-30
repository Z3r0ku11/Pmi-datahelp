from __future__ import annotations

import argparse
from copy import deepcopy
from typing import Any

import boto3


ACCOUNT_ID = "664858858204"
REGION = "us-east-1"
ANALYSIS_ID = "c1030556-faa8-4110-8ca3-1fd979a68993"
PROTECTED_ANALYSIS_ID = "pmo-executive-analysis-v2"
PROJECTS_DATASET_ID = "pmo-executive-semantic-v1-1"
TASKS_DATASET_ID = "aff40eb2-5662-4b7d-bf3a-7c1f4644104c"
PROJECTS_IDENTIFIER = "PMOExecutive"
TASKS_IDENTIFIER = "PMOTasks"


def column(dataset: str, name: str) -> dict[str, str]:
    return {"DataSetIdentifier": dataset, "ColumnName": name}


def title(text: str) -> dict[str, Any]:
    return {
        "Visibility": "VISIBLE",
        "FormatText": {"PlainText": text},
    }


def numerical_measure(
    dataset: str,
    field_id: str,
    name: str,
    aggregation: str = "SUM",
) -> dict[str, Any]:
    return {
        "NumericalMeasureField": {
            "FieldId": field_id,
            "Column": column(dataset, name),
            "AggregationFunction": {
                "SimpleNumericalAggregation": aggregation,
            },
        }
    }


def categorical_dimension(
    dataset: str,
    field_id: str,
    name: str,
) -> dict[str, Any]:
    return {
        "CategoricalDimensionField": {
            "FieldId": field_id,
            "Column": column(dataset, name),
        }
    }


def categorical_kpi(
    dataset: str,
    visual_id: str,
    visual_title: str,
    name: str,
) -> dict[str, Any]:
    return {
        "KPIVisual": {
            "VisualId": visual_id,
            "Title": title(visual_title),
            "Subtitle": {"Visibility": "HIDDEN"},
            "ChartConfiguration": {
                "FieldWells": {
                    "Values": [
                        {
                            "CategoricalMeasureField": {
                                "FieldId": f"{visual_id}-value",
                                "Column": column(dataset, name),
                                "AggregationFunction": "DISTINCT_COUNT",
                            }
                        }
                    ],
                    "TargetValues": [],
                    "TrendGroups": [],
                },
                "SortConfiguration": {},
                "KPIOptions": {"PrimaryValueDisplayType": "ACTUAL"},
            },
            "Actions": [],
            "ColumnHierarchies": [],
            "VisualContentAltText": visual_title,
        }
    }


def numerical_kpi(
    dataset: str,
    visual_id: str,
    visual_title: str,
    name: str,
    aggregation: str = "SUM",
) -> dict[str, Any]:
    return {
        "KPIVisual": {
            "VisualId": visual_id,
            "Title": title(visual_title),
            "Subtitle": {"Visibility": "HIDDEN"},
            "ChartConfiguration": {
                "FieldWells": {
                    "Values": [
                        numerical_measure(
                            dataset,
                            f"{visual_id}-value",
                            name,
                            aggregation,
                        )
                    ],
                    "TargetValues": [],
                    "TrendGroups": [],
                },
                "SortConfiguration": {},
                "KPIOptions": {"PrimaryValueDisplayType": "ACTUAL"},
            },
            "Actions": [],
            "ColumnHierarchies": [],
            "VisualContentAltText": visual_title,
        }
    }


def bar_visual(
    dataset: str,
    visual_id: str,
    visual_title: str,
    category: str,
    value: str,
) -> dict[str, Any]:
    return {
        "BarChartVisual": {
            "VisualId": visual_id,
            "Title": title(visual_title),
            "Subtitle": {"Visibility": "HIDDEN"},
            "ChartConfiguration": {
                "FieldWells": {
                    "BarChartAggregatedFieldWells": {
                        "Category": [
                            categorical_dimension(
                                dataset,
                                f"{visual_id}-category",
                                category,
                            )
                        ],
                        "Values": [
                            numerical_measure(
                                dataset,
                                f"{visual_id}-value",
                                value,
                            )
                        ],
                        "Colors": [],
                    }
                },
                "SortConfiguration": {},
                "Orientation": "HORIZONTAL",
                "BarsArrangement": "CLUSTERED",
                "DataLabels": {"Visibility": "VISIBLE"},
                "Legend": {"Visibility": "HIDDEN"},
            },
            "Actions": [],
            "ColumnHierarchies": [],
            "VisualContentAltText": visual_title,
        }
    }


def table_visual(
    dataset: str,
    visual_id: str,
    visual_title: str,
    categorical: list[str],
    numerical: list[str],
    dates: list[str],
) -> dict[str, Any]:
    group_by: list[dict[str, Any]] = []
    index = 0

    for name in categorical:
        group_by.append(
            categorical_dimension(dataset, f"{visual_id}-cat-{index}", name)
        )
        index += 1

    for name in numerical:
        group_by.append(
            {
                "NumericalDimensionField": {
                    "FieldId": f"{visual_id}-num-{index}",
                    "Column": column(dataset, name),
                }
            }
        )
        index += 1

    for name in dates:
        group_by.append(
            {
                "DateDimensionField": {
                    "FieldId": f"{visual_id}-date-{index}",
                    "Column": column(dataset, name),
                    "DateGranularity": "DAY",
                }
            }
        )
        index += 1

    return {
        "TableVisual": {
            "VisualId": visual_id,
            "Title": title(visual_title),
            "Subtitle": {"Visibility": "HIDDEN"},
            "ChartConfiguration": {
                "FieldWells": {
                    "TableAggregatedFieldWells": {
                        "GroupBy": group_by,
                        "Values": [],
                    }
                },
                "SortConfiguration": {},
                "TableOptions": {
                    "HeaderStyle": {"TextWrap": "WRAP", "Height": 30},
                    "CellStyle": {"Height": 28},
                    "RowAlternateColorOptions": {"Status": "ENABLED"},
                },
            },
            "Actions": [],
            "VisualContentAltText": visual_title,
        }
    }


def filter_group(
    dataset: str,
    sheet_id: str,
    filter_id: str,
    name: str,
    visual_ids: list[str],
) -> dict[str, Any]:
    return {
        "FilterGroupId": f"group-{filter_id}",
        "Filters": [
            {
                "CategoryFilter": {
                    "FilterId": filter_id,
                    "Column": column(dataset, name),
                    "Configuration": {
                        "FilterListConfiguration": {
                            "MatchOperator": "CONTAINS",
                            "SelectAllOptions": "FILTER_ALL_VALUES",
                            "NullOption": "ALL_VALUES",
                        }
                    },
                }
            }
        ],
        "ScopeConfiguration": {
            "SelectedSheets": {
                "SheetVisualScopingConfigurations": [
                    {
                        "SheetId": sheet_id,
                        "Scope": "SELECTED_VISUALS",
                        "VisualIds": visual_ids,
                    }
                ]
            }
        },
        "Status": "ENABLED",
        "CrossDataset": "SINGLE_DATASET",
    }


def dropdown(control_id: str, label: str, filter_id: str) -> dict[str, Any]:
    return {
        "Dropdown": {
            "FilterControlId": control_id,
            "Title": label,
            "SourceFilterId": filter_id,
            "Type": "MULTI_SELECT",
            "DisplayOptions": {
                "SelectAllOptions": {"Visibility": "VISIBLE"},
                "TitleOptions": {"Visibility": "VISIBLE"},
            },
        }
    }


def layout(
    controls: list[str],
    visual_specs: list[tuple[str, int, int, int, int]],
) -> list[dict[str, Any]]:
    elements: list[dict[str, Any]] = []
    for index, control_id in enumerate(controls):
        elements.append(
            {
                "ElementId": control_id,
                "ElementType": "FILTER_CONTROL",
                "ColumnIndex": index * 9,
                "ColumnSpan": 9,
                "RowIndex": 0,
                "RowSpan": 3,
            }
        )

    for visual_id, column_index, row_index, column_span, row_span in visual_specs:
        elements.append(
            {
                "ElementId": visual_id,
                "ElementType": "VISUAL",
                "ColumnIndex": column_index,
                "RowIndex": row_index,
                "ColumnSpan": column_span,
                "RowSpan": row_span,
            }
        )

    return [
        {
            "Configuration": {
                "GridLayout": {
                    "Elements": elements,
                    "CanvasSizeOptions": {
                        "ScreenCanvasSizeOptions": {
                            "ResizeOption": "FIXED",
                            "OptimizedViewPortWidth": "1600px",
                        }
                    },
                }
            }
        }
    ]


def build_project_sheet() -> tuple[dict[str, Any], list[dict[str, Any]]]:
    sheet_id = "project-detail"
    visuals = [
        numerical_kpi(
            PROJECTS_IDENTIFIER,
            "project-health",
            "HEALTH PROYECTO",
            "Health Proyecto Score",
            "AVERAGE",
        ),
        numerical_kpi(
            PROJECTS_IDENTIFIER,
            "project-weight",
            "INDICE PESO",
            "Indice Peso Proyecto",
            "AVERAGE",
        ),
        numerical_kpi(
            PROJECTS_IDENTIFIER,
            "project-budget",
            "PRESUPUESTO",
            "Total presupuestado",
        ),
        numerical_kpi(
            PROJECTS_IDENTIFIER,
            "project-hours",
            "HORAS PLANIFICADAS",
            "Horas Planificadas",
        ),
        numerical_kpi(
            PROJECTS_IDENTIFIER,
            "project-progress",
            "AVANCE TAREAS",
            "progress_pct",
            "AVERAGE",
        ),
        numerical_kpi(
            PROJECTS_IDENTIFIER,
            "project-days",
            "DIAS PARA FINALIZAR",
            "Dias para Finalizar",
            "AVERAGE",
        ),
        table_visual(
            PROJECTS_IDENTIFIER,
            "project-master-table",
            "DETALLE DE PROYECTOS",
            [
                "PMO ID",
                "Proyecto",
                "Cliente",
                "Responsable Proyecto",
                "Estado Proyecto",
                "Fase",
                "Clasificacion Peso Proyecto",
                "Health Proyecto",
            ],
            [
                "Total presupuestado",
                "Horas Planificadas",
                "progress_pct",
                "Dias para Finalizar",
            ],
            [
                "Fecha Inicio del proyecto",
                "Fecha Planificada Termino del proyecto",
                "LATEST STATUS DATE",
            ],
        ),
    ]
    visual_ids = [
        next(iter(visual.values()))["VisualId"] for visual in visuals
    ]
    filters = [
        ("project-filter-pm", "Responsable Proyecto", "project-control-pm", "PM"),
        ("project-filter-project", "Proyecto", "project-control-project", "Proyecto"),
        ("project-filter-client", "Cliente", "project-control-client", "Cliente"),
        ("project-filter-status", "Estado Proyecto", "project-control-status", "Estado"),
    ]
    controls = [
        dropdown(control_id, label, filter_id)
        for filter_id, _, control_id, label in filters
    ]
    groups = [
        filter_group(
            PROJECTS_IDENTIFIER,
            sheet_id,
            filter_id,
            name,
            visual_ids,
        )
        for filter_id, name, _, _ in filters
    ]
    specs = [
        ("project-health", 0, 3, 6, 4),
        ("project-weight", 6, 3, 6, 4),
        ("project-budget", 12, 3, 6, 4),
        ("project-hours", 18, 3, 6, 4),
        ("project-progress", 24, 3, 6, 4),
        ("project-days", 30, 3, 6, 4),
        ("project-master-table", 0, 7, 36, 20),
    ]
    return (
        {
            "SheetId": sheet_id,
            "Name": "PROJECT DETAIL | Delivery and Financial View",
            "ContentType": "INTERACTIVE",
            "FilterControls": controls,
            "Visuals": visuals,
            "Layouts": layout(
                [control[2] for control in filters],
                specs,
            ),
        },
        groups,
    )


def build_overview_sheet() -> tuple[dict[str, Any], list[dict[str, Any]]]:
    sheet_id = "project-manager-overview"
    visuals = [
        categorical_kpi(
            PROJECTS_IDENTIFIER,
            "overview-total",
            "TOTAL PROYECTOS",
            "Proyecto ID",
        ),
        numerical_kpi(
            PROJECTS_IDENTIFIER,
            "overview-active",
            "PROYECTOS ACTIVOS",
            "Proyecto Activo",
        ),
        numerical_kpi(
            PROJECTS_IDENTIFIER,
            "overview-risk",
            "EN RIESGO",
            "Proyecto en Riesgo",
        ),
        numerical_kpi(
            PROJECTS_IDENTIFIER,
            "overview-overdue",
            "CON RETRASO",
            "Proyecto con Retraso",
        ),
        numerical_kpi(
            PROJECTS_IDENTIFIER,
            "overview-budget",
            "PRESUPUESTO ADMINISTRADO",
            "Total presupuestado",
        ),
        numerical_kpi(
            PROJECTS_IDENTIFIER,
            "overview-hours",
            "HORAS PLANIFICADAS",
            "Horas Planificadas",
        ),
        bar_visual(
            PROJECTS_IDENTIFIER,
            "overview-by-pm",
            "CARGA DE PROYECTOS POR PM",
            "Responsable Proyecto",
            "Registro Completo",
        ),
        bar_visual(
            PROJECTS_IDENTIFIER,
            "overview-hours-pm",
            "HORAS PLANIFICADAS POR PM",
            "Responsable Proyecto",
            "Horas Planificadas",
        ),
        table_visual(
            PROJECTS_IDENTIFIER,
            "overview-project-table",
            "PORTAFOLIO ASIGNADO",
            [
                "PMO ID",
                "Proyecto",
                "Cliente",
                "Responsable Proyecto",
                "Estado Proyecto",
                "Clasificacion Peso Proyecto",
                "Health Proyecto",
            ],
            [
                "Indice Peso Proyecto",
                "Total presupuestado",
                "Horas Planificadas",
                "progress_pct",
            ],
            ["Fecha Planificada Termino del proyecto"],
        ),
    ]
    visual_ids = [
        next(iter(visual.values()))["VisualId"] for visual in visuals
    ]
    filters = [
        ("overview-filter-pm", "Responsable Proyecto", "overview-control-pm", "PM"),
        ("overview-filter-client", "Cliente", "overview-control-client", "Cliente"),
        ("overview-filter-status", "Estado Proyecto", "overview-control-status", "Estado"),
        ("overview-filter-type", "Tipo Proyecto", "overview-control-type", "Tipo"),
    ]
    controls = [
        dropdown(control_id, label, filter_id)
        for filter_id, _, control_id, label in filters
    ]
    groups = [
        filter_group(
            PROJECTS_IDENTIFIER,
            sheet_id,
            filter_id,
            name,
            visual_ids,
        )
        for filter_id, name, _, _ in filters
    ]
    specs = [
        ("overview-total", 0, 3, 6, 4),
        ("overview-active", 6, 3, 6, 4),
        ("overview-risk", 12, 3, 6, 4),
        ("overview-overdue", 18, 3, 6, 4),
        ("overview-budget", 24, 3, 6, 4),
        ("overview-hours", 30, 3, 6, 4),
        ("overview-by-pm", 0, 7, 18, 10),
        ("overview-hours-pm", 18, 7, 18, 10),
        ("overview-project-table", 0, 17, 36, 18),
    ]
    return (
        {
            "SheetId": sheet_id,
            "Name": "PROJECT MANAGER OVERVIEW | Portfolio Load",
            "ContentType": "INTERACTIVE",
            "FilterControls": controls,
            "Visuals": visuals,
            "Layouts": layout(
                [control[2] for control in filters],
                specs,
            ),
        },
        groups,
    )


def build_task_sheet() -> tuple[dict[str, Any], list[dict[str, Any]]]:
    sheet_id = "task-detail"
    visuals = [
        categorical_kpi(
            TASKS_IDENTIFIER,
            "task-total",
            "TOTAL TAREAS",
            "task_gid",
        ),
        numerical_kpi(
            TASKS_IDENTIFIER,
            "task-completed",
            "COMPLETADAS",
            "Tarea Completada",
        ),
        numerical_kpi(
            TASKS_IDENTIFIER,
            "task-pending",
            "PENDIENTES",
            "Tarea Pendiente",
        ),
        numerical_kpi(
            TASKS_IDENTIFIER,
            "task-overdue",
            "VENCIDAS",
            "Tarea Vencida",
        ),
        numerical_kpi(
            TASKS_IDENTIFIER,
            "task-next-seven",
            "VENCEN EN 7 DIAS",
            "Tarea Proxima 7 Dias",
        ),
        bar_visual(
            TASKS_IDENTIFIER,
            "task-by-assignee",
            "TAREAS POR ASIGNADO",
            "assignee_name",
            "Tarea Registro",
        ),
        bar_visual(
            TASKS_IDENTIFIER,
            "task-by-section",
            "TAREAS POR SECCION",
            "section_name",
            "Tarea Registro",
        ),
        table_visual(
            TASKS_IDENTIFIER,
            "task-master-table",
            "DETALLE DE TAREAS Y SUBTAREAS",
            [
                "project_name",
                "record_type",
                "task_name",
                "parent_task_name",
                "section_name",
                "assignee_name",
                "Estado Tarea",
                "permalink_url",
            ],
            ["Dias Atraso Tarea", "Dias Sin Actualizar Tarea"],
            ["start_on", "due_on", "modified_at", "completed_at"],
        ),
    ]
    visual_ids = [
        next(iter(visual.values()))["VisualId"] for visual in visuals
    ]
    filters = [
        ("task-filter-pm", "responsable_proyecto", "task-control-pm", "PM"),
        ("task-filter-project", "project_name", "task-control-project", "Proyecto"),
        ("task-filter-assignee", "assignee_name", "task-control-assignee", "Asignado"),
        ("task-filter-state", "Estado Tarea", "task-control-state", "Estado"),
    ]
    controls = [
        dropdown(control_id, label, filter_id)
        for filter_id, _, control_id, label in filters
    ]
    groups = [
        filter_group(
            TASKS_IDENTIFIER,
            sheet_id,
            filter_id,
            name,
            visual_ids,
        )
        for filter_id, name, _, _ in filters
    ]
    specs = [
        ("task-total", 0, 3, 7, 4),
        ("task-completed", 7, 3, 7, 4),
        ("task-pending", 14, 3, 7, 4),
        ("task-overdue", 21, 3, 7, 4),
        ("task-next-seven", 28, 3, 8, 4),
        ("task-by-assignee", 0, 7, 18, 10),
        ("task-by-section", 18, 7, 18, 10),
        ("task-master-table", 0, 17, 36, 20),
    ]
    return (
        {
            "SheetId": sheet_id,
            "Name": "TASK DETAIL | Execution Control",
            "ContentType": "INTERACTIVE",
            "FilterControls": controls,
            "Visuals": visuals,
            "Layouts": layout(
                [control[2] for control in filters],
                specs,
            ),
        },
        groups,
    )


TASK_CALCULATED_FIELDS = [
    {
        "DataSetIdentifier": TASKS_IDENTIFIER,
        "Name": "Tarea Registro",
        "Expression": "1",
    },
    {
        "DataSetIdentifier": TASKS_IDENTIFIER,
        "Name": "Tarea Completada",
        "Expression": (
            "ifelse({completed}='true' OR {completed}='True',1,0)"
        ),
    },
    {
        "DataSetIdentifier": TASKS_IDENTIFIER,
        "Name": "Tarea Pendiente",
        "Expression": (
            "ifelse({completed}='true' OR {completed}='True',0,1)"
        ),
    },
    {
        "DataSetIdentifier": TASKS_IDENTIFIER,
        "Name": "Tarea Vencida",
        "Expression": (
            "ifelse({completed}='true' OR {completed}='True',0,"
            "isNull({due_on}),0,{due_on}<truncDate('DD',now()),1,0)"
        ),
    },
    {
        "DataSetIdentifier": TASKS_IDENTIFIER,
        "Name": "Tarea Proxima 7 Dias",
        "Expression": (
            "ifelse({completed}='true' OR {completed}='True',0,"
            "isNull({due_on}),0,dateDiff(truncDate('DD',now()),"
            "{due_on},'DD')>=0 AND dateDiff(truncDate('DD',now()),"
            "{due_on},'DD')<=7,1,0)"
        ),
    },
    {
        "DataSetIdentifier": TASKS_IDENTIFIER,
        "Name": "Dias Atraso Tarea",
        "Expression": (
            "ifelse({completed}='true' OR {completed}='True',0,"
            "isNull({due_on}),0,{due_on}<truncDate('DD',now()),"
            "dateDiff({due_on},truncDate('DD',now()),'DD'),0)"
        ),
    },
    {
        "DataSetIdentifier": TASKS_IDENTIFIER,
        "Name": "Dias Sin Actualizar Tarea",
        "Expression": (
            "ifelse(isNull({modified_at}),0,"
            "dateDiff({modified_at},truncDate('DD',now()),'DD'))"
        ),
    },
    {
        "DataSetIdentifier": TASKS_IDENTIFIER,
        "Name": "Estado Tarea",
        "Expression": (
            "ifelse({completed}='true' OR {completed}='True','Completada',"
            "isNull({due_on}),'Pendiente',"
            "{due_on}<truncDate('DD',now()),'Vencida',"
            "dateDiff(truncDate('DD',now()),{due_on},'DD')>=0 AND "
            "dateDiff(truncDate('DD',now()),{due_on},'DD')<=7,"
            "'Proxima a vencer','Pendiente')"
        ),
    },
]


def build_definition(client: Any) -> tuple[dict[str, Any], str, str | None]:
    current = client.describe_analysis_definition(
        AwsAccountId=ACCOUNT_ID,
        AnalysisId=ANALYSIS_ID,
    )
    definition = deepcopy(current["Definition"])
    name = current["Name"]

    declarations = definition.setdefault(
        "DataSetIdentifierDeclarations",
        [],
    )
    declarations = [
        item
        for item in declarations
        if item["Identifier"] != TASKS_IDENTIFIER
    ]
    declarations.append(
        {
            "Identifier": TASKS_IDENTIFIER,
            "DataSetArn": (
                f"arn:aws:quicksight:{REGION}:{ACCOUNT_ID}:"
                f"dataset/{TASKS_DATASET_ID}"
            ),
        }
    )
    definition["DataSetIdentifierDeclarations"] = declarations

    calculated = definition.setdefault("CalculatedFields", [])
    task_names = {item["Name"] for item in TASK_CALCULATED_FIELDS}
    calculated = [
        item
        for item in calculated
        if item.get("Name") not in task_names
    ]
    calculated.extend(deepcopy(TASK_CALCULATED_FIELDS))
    definition["CalculatedFields"] = calculated

    overview_sheet, overview_filters = build_overview_sheet()
    project_sheet, project_filters = build_project_sheet()
    task_sheet, task_filters = build_task_sheet()
    replacement_sheet_ids = {
        overview_sheet["SheetId"],
        project_sheet["SheetId"],
        task_sheet["SheetId"],
    }
    existing_sheets = [
        sheet
        for sheet in definition.get("Sheets", [])
        if sheet["SheetId"] not in replacement_sheet_ids
    ]
    definition["Sheets"] = existing_sheets + [
        overview_sheet,
        project_sheet,
        task_sheet,
    ]

    replacement_filter_ids = {
        item["FilterGroupId"]
        for item in overview_filters + project_filters + task_filters
    }
    existing_filters = [
        item
        for item in definition.get("FilterGroups", [])
        if item["FilterGroupId"] not in replacement_filter_ids
    ]
    definition["FilterGroups"] = (
        existing_filters
        + overview_filters
        + project_filters
        + task_filters
    )

    analysis = client.describe_analysis(
        AwsAccountId=ACCOUNT_ID,
        AnalysisId=ANALYSIS_ID,
    )["Analysis"]
    return definition, name, analysis.get("ThemeArn")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--profile", default="pmo-asana")
    parser.add_argument("--deploy", action="store_true")
    args = parser.parse_args()

    if ANALYSIS_ID == PROTECTED_ANALYSIS_ID:
        raise RuntimeError("El análisis ejecutivo V2 está protegido.")

    session = boto3.Session(
        profile_name=args.profile,
        region_name=REGION,
    )
    client = session.client("quicksight")
    definition, name, theme_arn = build_definition(client)

    print(
        "Preflight Project Manager Analysis: "
        f"sheets={len(definition['Sheets'])}, "
        f"datasets={len(definition['DataSetIdentifierDeclarations'])}, "
        f"calculated_fields={len(definition.get('CalculatedFields', []))}"
    )

    if not args.deploy:
        print("Sin cambios. Use --deploy para publicar.")
        return

    request: dict[str, Any] = {
        "AwsAccountId": ACCOUNT_ID,
        "AnalysisId": ANALYSIS_ID,
        "Name": name,
        "Definition": definition,
        "ValidationStrategy": {"Mode": "LENIENT"},
    }
    if theme_arn:
        request["ThemeArn"] = theme_arn

    response = client.update_analysis(**request)
    print(
        "Actualización enviada: "
        f"status={response['Status']}, "
        f"analysis_id={ANALYSIS_ID}"
    )


if __name__ == "__main__":
    main()

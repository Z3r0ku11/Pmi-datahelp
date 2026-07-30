[CmdletBinding()]
param(
    [string]$AwsAccountId = "664858858204",
    [string]$AwsRegion = "us-east-1",
    [string]$AnalysisId = "pmo-executive-analysis-v1-1",
    [string]$DashboardId = "pmo-executive-dashboard-v1-1",
    [string]$ThemeId = "pmo-executive-dark",
    [string]$AnalysisName = "PMO Executive Analysis v1.1",
    [string]$DashboardName = "PMO Executive Dashboard v1.1",
    [switch]$Deploy
)

$ErrorActionPreference = "Stop"
$dataSetIdentifier = "PMOExecutive"
$principalArn = (
    "arn:aws:quicksight:us-east-1:664858858204:user/default/" +
    "AWSReservedSSO_AWSAdministratorAccess_cd675fd79d1b75e0/dbarrios"
)

function New-Column {
    param([string]$Name)

    return @{
        DataSetIdentifier = $dataSetIdentifier
        ColumnName = $Name
    }
}

function New-Title {
    param([string]$Text)

    return @{
        Visibility = "VISIBLE"
        FormatText = @{ PlainText = $Text }
    }
}

function New-NumericalMeasure {
    param(
        [string]$FieldId,
        [string]$ColumnName,
        [string]$Aggregation = "SUM"
    )

    return @{
        NumericalMeasureField = @{
            FieldId = $FieldId
            Column = New-Column -Name $ColumnName
            AggregationFunction = @{
                SimpleNumericalAggregation = $Aggregation
            }
        }
    }
}

function New-CategoricalDimension {
    param(
        [string]$FieldId,
        [string]$ColumnName
    )

    return @{
        CategoricalDimensionField = @{
            FieldId = $FieldId
            Column = New-Column -Name $ColumnName
        }
    }
}

function New-DateDimension {
    param(
        [string]$FieldId,
        [string]$ColumnName,
        [string]$Granularity = "MONTH"
    )

    return @{
        DateDimensionField = @{
            FieldId = $FieldId
            Column = New-Column -Name $ColumnName
            DateGranularity = $Granularity
        }
    }
}

function New-KpiVisual {
    param(
        [string]$Id,
        [string]$Title,
        [string]$ColumnName,
        [string]$Aggregation = "SUM"
    )

    return @{
        KPIVisual = @{
            VisualId = $Id
            Title = New-Title -Text $Title
            Subtitle = @{ Visibility = "HIDDEN" }
            ChartConfiguration = @{
                FieldWells = @{
                    Values = @(
                        New-NumericalMeasure `
                            -FieldId "$Id-value" `
                            -ColumnName $ColumnName `
                            -Aggregation $Aggregation
                    )
                    TargetValues = @()
                    TrendGroups = @()
                }
                SortConfiguration = @{}
                KPIOptions = @{
                    PrimaryValueDisplayType = "ACTUAL"
                    Comparison = @{
                        ComparisonMethod = "DIFFERENCE"
                    }
                }
            }
            Actions = @()
            ColumnHierarchies = @()
            VisualContentAltText = $Title
        }
    }
}

function New-KpiCategoricalVisual {
    param(
        [string]$Id,
        [string]$Title,
        [string]$ColumnName
    )

    return @{
        KPIVisual = @{
            VisualId = $Id
            Title = New-Title -Text $Title
            Subtitle = @{ Visibility = "HIDDEN" }
            ChartConfiguration = @{
                FieldWells = @{
                    Values = @(
                        @{
                            CategoricalMeasureField = @{
                                FieldId = "$Id-value"
                                Column = New-Column -Name $ColumnName
                                AggregationFunction = "DISTINCT_COUNT"
                            }
                        }
                    )
                    TargetValues = @()
                    TrendGroups = @()
                }
                SortConfiguration = @{}
                KPIOptions = @{
                    PrimaryValueDisplayType = "ACTUAL"
                    Comparison = @{
                        ComparisonMethod = "DIFFERENCE"
                    }
                }
            }
            Actions = @()
            ColumnHierarchies = @()
            VisualContentAltText = $Title
        }
    }
}

function New-BarVisual {
    param(
        [string]$Id,
        [string]$Title,
        [string]$Category,
        [string]$Value = "",
        [string]$Aggregation = "SUM",
        [string]$Orientation = "HORIZONTAL"
    )

    $values = @()

    if (-not [string]::IsNullOrWhiteSpace($Value)) {
        $values += New-NumericalMeasure `
            -FieldId "$Id-value" `
            -ColumnName $Value `
            -Aggregation $Aggregation
    }

    return @{
        BarChartVisual = @{
            VisualId = $Id
            Title = New-Title -Text $Title
            Subtitle = @{ Visibility = "HIDDEN" }
            ChartConfiguration = @{
                FieldWells = @{
                    BarChartAggregatedFieldWells = @{
                        Category = @(
                            New-CategoricalDimension `
                                -FieldId "$Id-category" `
                                -ColumnName $Category
                        )
                        Values = $values
                        Colors = @()
                    }
                }
                SortConfiguration = @{
                    CategoryItemsLimit = @{
                        OtherCategories = "INCLUDE"
                    }
                    ColorItemsLimit = @{
                        OtherCategories = "INCLUDE"
                    }
                    SmallMultiplesLimitConfiguration = @{
                        OtherCategories = "INCLUDE"
                    }
                }
                Orientation = $Orientation
                BarsArrangement = "CLUSTERED"
                DataLabels = @{
                    Visibility = "VISIBLE"
                    Overlap = "DISABLE_OVERLAP"
                }
                Legend = @{ Visibility = "HIDDEN" }
                Tooltip = @{
                    TooltipVisibility = "VISIBLE"
                    SelectedTooltipType = "DETAILED"
                }
            }
            Actions = @()
            ColumnHierarchies = @()
            VisualContentAltText = $Title
        }
    }
}

function New-PieVisual {
    param(
        [string]$Id,
        [string]$Title,
        [string]$Category,
        [string]$Value = "",
        [string]$Aggregation = "SUM"
    )

    $values = @()

    if (-not [string]::IsNullOrWhiteSpace($Value)) {
        $values += New-NumericalMeasure `
            -FieldId "$Id-value" `
            -ColumnName $Value `
            -Aggregation $Aggregation
    }

    return @{
        PieChartVisual = @{
            VisualId = $Id
            Title = New-Title -Text $Title
            Subtitle = @{ Visibility = "HIDDEN" }
            ChartConfiguration = @{
                FieldWells = @{
                    PieChartAggregatedFieldWells = @{
                        Category = @(
                            New-CategoricalDimension `
                                -FieldId "$Id-category" `
                                -ColumnName $Category
                        )
                        Values = $values
                    }
                }
                SortConfiguration = @{
                    CategoryItemsLimit = @{
                        OtherCategories = "INCLUDE"
                    }
                    SmallMultiplesLimitConfiguration = @{
                        OtherCategories = "INCLUDE"
                    }
                }
                DonutOptions = @{
                    ArcOptions = @{ ArcThickness = "LARGE" }
                    DonutCenterOptions = @{
                        LabelVisibility = "VISIBLE"
                    }
                }
                CategoryLabelOptions = @{ Visibility = "VISIBLE" }
                ValueLabelOptions = @{ Visibility = "VISIBLE" }
                Legend = @{ Visibility = "VISIBLE"; Position = "RIGHT" }
                DataLabels = @{
                    Visibility = "VISIBLE"
                    Overlap = "DISABLE_OVERLAP"
                }
                Tooltip = @{
                    TooltipVisibility = "VISIBLE"
                    SelectedTooltipType = "DETAILED"
                }
            }
            Actions = @()
            ColumnHierarchies = @()
            VisualContentAltText = $Title
        }
    }
}

function New-LineVisual {
    param(
        [string]$Id,
        [string]$Title
    )

    return @{
        LineChartVisual = @{
            VisualId = $Id
            Title = New-Title -Text $Title
            Subtitle = @{ Visibility = "HIDDEN" }
            ChartConfiguration = @{
                FieldWells = @{
                    LineChartAggregatedFieldWells = @{
                        Category = @(
                            @{
                                DateDimensionField = @{
                                    FieldId = "$Id-date"
                                    Column = New-Column -Name (
                                        "Fecha Inicio del proyecto"
                                    )
                                    DateGranularity = "MONTH"
                                    HierarchyId = "$Id-date-hierarchy"
                                }
                            }
                        )
                        Values = @(
                            New-NumericalMeasure `
                                -FieldId "$Id-value" `
                                -ColumnName "Proyecto Activo" `
                                -Aggregation "SUM"
                        )
                        Colors = @()
                    }
                }
                SortConfiguration = @{}
                Type = "AREA"
                DataLabels = @{
                    Visibility = "VISIBLE"
                    Overlap = "DISABLE_OVERLAP"
                }
                Legend = @{ Visibility = "HIDDEN" }
                Tooltip = @{
                    TooltipVisibility = "VISIBLE"
                    SelectedTooltipType = "DETAILED"
                }
            }
            Actions = @()
            ColumnHierarchies = @(
                @{
                    DateTimeHierarchy = @{
                        HierarchyId = "$Id-date-hierarchy"
                    }
                }
            )
            VisualContentAltText = $Title
        }
    }
}

function New-TableVisual {
    param(
        [string]$Id,
        [string]$Title,
        [array]$CategoricalColumns,
        [array]$DateColumns,
        [array]$NumericalColumns
    )

    $groupBy = @()
    $index = 0

    foreach ($column in $CategoricalColumns) {
        $groupBy += New-CategoricalDimension `
            -FieldId "$Id-category-$index" `
            -ColumnName $column
        $index++
    }

    foreach ($column in $NumericalColumns) {
        $groupBy += @{
            NumericalDimensionField = @{
                FieldId = "$Id-number-$index"
                Column = New-Column -Name $column
            }
        }
        $index++
    }

    foreach ($column in $DateColumns) {
        $groupBy += New-DateDimension `
            -FieldId "$Id-date-$index" `
            -ColumnName $column `
            -Granularity "DAY"
        $index++
    }

    return @{
        TableVisual = @{
            VisualId = $Id
            Title = New-Title -Text $Title
            Subtitle = @{ Visibility = "HIDDEN" }
            ChartConfiguration = @{
                FieldWells = @{
                    TableAggregatedFieldWells = @{
                        GroupBy = $groupBy
                        Values = @()
                    }
                }
                SortConfiguration = @{}
                TableOptions = @{
                    HeaderStyle = @{
                        TextWrap = "WRAP"
                        Height = 28
                    }
                    CellStyle = @{ Height = 28 }
                    RowAlternateColorOptions = @{
                        Status = "ENABLED"
                        UsePrimaryBackgroundColor = "DISABLED"
                    }
                }
            }
            Actions = @()
            VisualContentAltText = $Title
        }
    }
}

function New-CategoryFilter {
    param(
        [string]$FilterId,
        [string]$ColumnName,
        [array]$VisualIds
    )

    return @{
        FilterGroupId = "group-$FilterId"
        Filters = @(
            @{
                CategoryFilter = @{
                    FilterId = $FilterId
                    Column = New-Column -Name $ColumnName
                    Configuration = @{
                        FilterListConfiguration = @{
                            MatchOperator = "CONTAINS"
                            SelectAllOptions = "FILTER_ALL_VALUES"
                            NullOption = "ALL_VALUES"
                        }
                    }
                }
            }
        )
        ScopeConfiguration = @{
            SelectedSheets = @{
                SheetVisualScopingConfigurations = @(
                    @{
                        SheetId = "resumen-ejecutivo"
                        Scope = "SELECTED_VISUALS"
                        VisualIds = $VisualIds
                    }
                )
            }
        }
        Status = "ENABLED"
        CrossDataset = "SINGLE_DATASET"
    }
}

function New-DropdownControl {
    param(
        [string]$ControlId,
        [string]$Title,
        [string]$FilterId
    )

    return @{
        Dropdown = @{
            FilterControlId = $ControlId
            Title = $Title
            SourceFilterId = $FilterId
            DisplayOptions = @{
                SelectAllOptions = @{ Visibility = "VISIBLE" }
                TitleOptions = @{
                    Visibility = "VISIBLE"
                    FontConfiguration = @{
                        FontColor = "#F9FAFB"
                    }
                }
            }
            Type = "MULTI_SELECT"
        }
    }
}

function New-DateRangeControl {
    param(
        [string]$ControlId,
        [string]$Title,
        [string]$FilterId
    )

    return @{
        DateTimePicker = @{
            FilterControlId = $ControlId
            Title = $Title
            SourceFilterId = $FilterId
            Type = "DATE_RANGE"
            CommitMode = "AUTO"
        }
    }
}

$calculatedFields = @(
    @{
        DataSetIdentifier = $dataSetIdentifier
        Name = "Proyecto Registro"
        Expression = "1"
    },
    @{
        DataSetIdentifier = $dataSetIdentifier
        Name = "Proyecto Espera Sin Estado"
        Expression = (
            "ifelse({Estado Proyecto}='On Hold' OR " +
            "isNull({Estado Proyecto}),1,0)"
        )
    },
    @{
        DataSetIdentifier = $dataSetIdentifier
        Name = "Proyecto Descartado"
        Expression = "ifelse({Estado Proyecto}='Descartado',1,0)"
    },
    @{
        DataSetIdentifier = $dataSetIdentifier
        Name = "Cierre 30 Dias"
        Expression = (
            "ifelse({Proyecto Activo}=1 AND " +
            "dateDiff(truncDate('DD',now())," +
            "{Fecha Planificada Termino del proyecto},'DD')>=0 AND " +
            "dateDiff(truncDate('DD',now())," +
            "{Fecha Planificada Termino del proyecto},'DD')<=30,1,0)"
        )
    },
    @{
        DataSetIdentifier = $dataSetIdentifier
        Name = "Cierre 60 Dias"
        Expression = (
            "ifelse({Proyecto Activo}=1 AND " +
            "dateDiff(truncDate('DD',now())," +
            "{Fecha Planificada Termino del proyecto},'DD')>=0 AND " +
            "dateDiff(truncDate('DD',now())," +
            "{Fecha Planificada Termino del proyecto},'DD')<=60,1,0)"
        )
    },
    @{
        DataSetIdentifier = $dataSetIdentifier
        Name = "Duracion Proyecto Dias"
        Expression = (
            "ifelse(isNull({Fecha Inicio del proyecto}) OR " +
            "isNull({Fecha Planificada Termino del proyecto}),NULL," +
            "dateDiff({Fecha Inicio del proyecto}," +
            "{Fecha Planificada Termino del proyecto},'DD'))"
        )
    },
    @{
        DataSetIdentifier = $dataSetIdentifier
        Name = "Dias Transcurridos"
        Expression = (
            "ifelse(isNull({Fecha Inicio del proyecto}) OR " +
            "{Fecha Inicio del proyecto}>truncDate('DD',now()),NULL," +
            "dateDiff({Fecha Inicio del proyecto}," +
            "truncDate('DD',now()),'DD'))"
        )
    },
    @{
        DataSetIdentifier = $dataSetIdentifier
        Name = "PM Asignado Pct"
        Expression = (
            "ifelse(isNull({Responsable Proyecto}) OR " +
            "trim({Responsable Proyecto})='',0,100)"
        )
    },
    @{
        DataSetIdentifier = $dataSetIdentifier
        Name = "Actualizado 7 Dias Pct"
        Expression = (
            "ifelse(isNull({LATEST STATUS DATE}),0," +
            "dateDiff({LATEST STATUS DATE},truncDate('DD',now())," +
            "'DD')>=0 AND dateDiff({LATEST STATUS DATE}," +
            "truncDate('DD',now()),'DD')<=7,100,0)"
        )
    },
    @{
        DataSetIdentifier = $dataSetIdentifier
        Name = "Sin Actualizacion 15 Dias"
        Expression = (
            "ifelse({Proyecto Activo}=1 AND " +
            "(isNull({LATEST STATUS DATE}) OR " +
            "dateDiff({LATEST STATUS DATE},truncDate('DD',now())," +
            "'DD')>15),1,0)"
        )
    },
    @{
        DataSetIdentifier = $dataSetIdentifier
        Name = "Atencion Vencimiento"
        Expression = (
            "ifelse({Proyecto Activo}=1 AND " +
            "dateDiff(truncDate('DD',now())," +
            "{Fecha Planificada Termino del proyecto},'DD')<=60,1,0)"
        )
    },
    @{
        DataSetIdentifier = $dataSetIdentifier
        Name = "KPI Clientes"
        Expression = "distinct_count({Cliente})"
    },
    @{
        DataSetIdentifier = $dataSetIdentifier
        Name = "KPI PM"
        Expression = "distinct_count({Responsable Proyecto})"
    }
)

$visuals = @(
    New-KpiVisual -Id "kpi-health" `
        -Title "PORTFOLIO HEALTH" `
        -ColumnName "Health Proyecto Score" -Aggregation "AVERAGE"
    New-KpiVisual -Id "kpi-activos" `
        -Title "PROYECTOS ACTIVOS" `
        -ColumnName "Proyecto Activo"
    New-KpiVisual -Id "kpi-riesgo" `
        -Title "PROYECTOS EN RIESGO" `
        -ColumnName "Proyecto en Riesgo"
    New-KpiVisual -Id "kpi-retraso" `
        -Title "PROYECTOS CON RETRASO" `
        -ColumnName "Proyecto con Retraso"
    New-KpiVisual -Id "kpi-presupuesto" `
        -Title "PRESUPUESTO TOTAL" `
        -ColumnName "Total presupuestado"
    New-KpiVisual -Id "kpi-horas" `
        -Title "HORAS PLANIFICADAS" `
        -ColumnName "Horas Planificadas"
    New-KpiCategoricalVisual -Id "kpi-clientes" `
        -Title "CLIENTES ACTIVOS" `
        -ColumnName "Cliente"
    New-KpiCategoricalVisual -Id "kpi-pm" `
        -Title "PM ACTIVOS" `
        -ColumnName "Responsable Proyecto"
    New-PieVisual -Id "donut-estado" `
        -Title "DISTRIBUCION POR ESTADO" `
        -Category "Estado Proyecto" `
        -Value "Proyecto Registro"
    New-BarVisual -Id "bar-responsable" `
        -Title "PROYECTOS POR RESPONSABLE" `
        -Category "Responsable Proyecto" `
        -Value "Proyecto Registro"
    New-BarVisual -Id "bar-cliente" `
        -Title "PROYECTOS POR CLIENTE" `
        -Category "Cliente" `
        -Value "Proyecto Registro"
    New-BarVisual -Id "bar-tipo" `
        -Title "PROYECTOS POR TIPO" `
        -Category "Tipo Proyecto" `
        -Value "Proyecto Registro"
    New-LineVisual -Id "line-evolucion" `
        -Title "EVOLUCION DE PROYECTOS"
    New-KpiVisual -Id "gov-pm-asignado" `
        -Title "PROYECTOS CON PM ASIGNADO %" `
        -ColumnName "PM Asignado Pct" -Aggregation "AVERAGE"
    New-KpiVisual -Id "gov-actualizados-7" `
        -Title "ACTUALIZADOS < 7 DIAS %" `
        -ColumnName "Actualizado 7 Dias Pct" -Aggregation "AVERAGE"
    New-KpiVisual -Id "gov-sin-actualizar-15" `
        -Title "SIN ACTUALIZACION > 15 DIAS" `
        -ColumnName "Sin Actualizacion 15 Dias"
    New-KpiVisual -Id "gov-proximos" `
        -Title "PROXIMOS A VENCER" `
        -ColumnName "Proyecto Proximo a Vencer"
    New-KpiVisual -Id "gov-retraso" `
        -Title "CON RETRASO" `
        -ColumnName "Proyecto con Retraso"
    New-TableVisual -Id "table-timeline" `
        -Title "TIMELINE DE PROYECTOS" `
        -CategoricalColumns @(
            "Proyecto",
            "Estado Proyecto"
        ) `
        -DateColumns @(
            "Fecha Inicio del proyecto",
            "Fecha Planificada Termino del proyecto"
        ) `
        -NumericalColumns @("Duracion Proyecto Dias")
    New-PieVisual -Id "donut-presupuesto-cliente" `
        -Title "PRESUPUESTO POR CLIENTE" `
        -Category "Cliente" `
        -Value "Total presupuestado"
    New-BarVisual -Id "bar-presupuesto-tipo" `
        -Title "PRESUPUESTO POR CATEGORIA" `
        -Category "Tipo Proyecto" `
        -Value "Total presupuestado" `
        -Orientation "VERTICAL"
    New-PieVisual -Id "donut-complejidad" `
        -Title "DISTRIBUCION DE COMPLEJIDAD" `
        -Category "Clasificacion Peso Proyecto" `
        -Value "Proyecto Registro"
    New-TableVisual -Id "table-proximos" `
        -Title "PROXIMOS A VENCER" `
        -CategoricalColumns @(
            "Proyecto",
            "Cliente",
            "Responsable Proyecto",
            "Estado Proyecto"
        ) `
        -DateColumns @("Fecha Planificada Termino del proyecto") `
        -NumericalColumns @("Dias para Finalizar")
    New-TableVisual -Id "table-ultima-actualizacion" `
        -Title "ULTIMA ACTUALIZACION DEL DATASET" `
        -CategoricalColumns @("DATA REFRESH") `
        -DateColumns @() `
        -NumericalColumns @()
)

$visualIds = @(
    $visuals | ForEach-Object {
        $type = @($_.Keys)[0]
        $_[$type].VisualId
    }
)

$filterDefinitions = @(
    @("filter-cliente", "Cliente", "control-cliente", "Cliente"),
    @("filter-responsable", "Responsable Proyecto", "control-responsable", "Responsable"),
    @("filter-pais", "Pais", "control-pais", "Pais"),
    @("filter-segmento", "Segmento", "control-segmento", "Segmento"),
    @("filter-tipo", "Tipo Proyecto", "control-tipo", "Tipo Proyecto"),
    @("filter-estado", "Estado Proyecto", "control-estado", "Estado"),
    @("filter-proyecto", "Proyecto", "control-proyecto", "Detalle Proyecto")
)

$filterGroups = @()
$filterControls = @()

foreach ($filter in $filterDefinitions) {
    $filterGroups += New-CategoryFilter `
        -FilterId $filter[0] `
        -ColumnName $filter[1] `
        -VisualIds $visualIds
    $filterControls += New-DropdownControl `
        -ControlId $filter[2] `
        -Title $filter[3] `
        -FilterId $filter[0]
}

$filterGroups += @{
    FilterGroupId = "group-periodo"
    Filters = @(
        @{
            TimeRangeFilter = @{
                FilterId = "filter-periodo"
                Column = New-Column -Name "Fecha Inicio del proyecto"
                NullOption = "ALL_VALUES"
                IncludeMinimum = $true
                IncludeMaximum = $true
                TimeGranularity = "DAY"
            }
        }
    )
    ScopeConfiguration = @{
        SelectedSheets = @{
            SheetVisualScopingConfigurations = @(
                @{
                    SheetId = "resumen-ejecutivo"
                    Scope = "SELECTED_VISUALS"
                    VisualIds = $visualIds
                }
            )
        }
    }
    Status = "ENABLED"
    CrossDataset = "SINGLE_DATASET"
}

$filterControls += New-DateRangeControl `
    -ControlId "control-periodo" `
    -Title "Periodo" `
    -FilterId "filter-periodo"

$filterGroups += @{
    FilterGroupId = "group-proximos"
    Filters = @(
        @{
            NumericEqualityFilter = @{
                FilterId = "filter-proximos"
                Column = New-Column -Name "Atencion Vencimiento"
                MatchOperator = "EQUALS"
                Value = 1
                NullOption = "NON_NULLS_ONLY"
            }
        }
    )
    ScopeConfiguration = @{
        SelectedSheets = @{
            SheetVisualScopingConfigurations = @(
                @{
                    SheetId = "resumen-ejecutivo"
                    Scope = "SELECTED_VISUALS"
                    VisualIds = @("table-proximos")
                }
            )
        }
    }
    Status = "ENABLED"
    CrossDataset = "SINGLE_DATASET"
}

$filterGroups += @{
    FilterGroupId = "group-kpi-dimensiones-activas"
    Filters = @(
        @{
            NumericEqualityFilter = @{
                FilterId = "filter-kpi-dimensiones-activas"
                Column = New-Column -Name "Proyecto Activo"
                MatchOperator = "EQUALS"
                Value = 1
                NullOption = "NON_NULLS_ONLY"
            }
        }
    )
    ScopeConfiguration = @{
        SelectedSheets = @{
            SheetVisualScopingConfigurations = @(
                @{
                    SheetId = "resumen-ejecutivo"
                    Scope = "SELECTED_VISUALS"
                    VisualIds = @("kpi-clientes", "kpi-pm")
                }
            )
        }
    }
    Status = "ENABLED"
    CrossDataset = "SINGLE_DATASET"
}

$elements = @()

for ($index = 0; $index -lt $filterDefinitions.Count; $index++) {
    $elements += @{
        ElementId = $filterDefinitions[$index][2]
        ElementType = "FILTER_CONTROL"
        ColumnIndex = $index * 4
        ColumnSpan = 4
        RowIndex = 0
        RowSpan = 3
    }
}

$elements += @{
    ElementId = "control-periodo"
    ElementType = "FILTER_CONTROL"
    ColumnIndex = 28
    ColumnSpan = 8
    RowIndex = 0
    RowSpan = 3
}

$topKpiColumns = @(0, 4, 8, 13, 18, 22, 27, 31)
$topKpiSpans = @(4, 4, 5, 5, 4, 5, 4, 5)

for ($index = 0; $index -lt 8; $index++) {
    $elements += @{
        ElementId = $visualIds[$index]
        ElementType = "VISUAL"
        ColumnIndex = $topKpiColumns[$index]
        ColumnSpan = $topKpiSpans[$index]
        RowIndex = 3
        RowSpan = 4
    }
}

$layoutDefinitions = @(
    @("donut-estado", 0, 7, 8, 10),
    @("bar-responsable", 8, 7, 9, 10),
    @("bar-cliente", 17, 7, 9, 10),
    @("bar-tipo", 26, 7, 10, 10),
    @("line-evolucion", 0, 17, 9, 12),
    @("table-timeline", 9, 17, 9, 12),
    @("donut-presupuesto-cliente", 18, 17, 9, 12),
    @("bar-presupuesto-tipo", 27, 17, 9, 12),
    @("donut-complejidad", 0, 29, 9, 12),
    @("table-proximos", 9, 29, 14, 12),
    @("gov-pm-asignado", 23, 29, 3, 7),
    @("gov-actualizados-7", 26, 29, 3, 7),
    @("gov-sin-actualizar-15", 29, 29, 3, 7),
    @("gov-proximos", 32, 29, 2, 7),
    @("gov-retraso", 34, 29, 2, 7),
    @("table-ultima-actualizacion", 23, 36, 13, 5)
)

foreach ($layout in $layoutDefinitions) {
    $elements += @{
        ElementId = $layout[0]
        ElementType = "VISUAL"
        ColumnIndex = $layout[1]
        RowIndex = $layout[2]
        ColumnSpan = $layout[3]
        RowSpan = $layout[4]
    }
}

$definition = @{
    DataSetIdentifierDeclarations = @(
        @{
            Identifier = $dataSetIdentifier
            DataSetArn = (
                "arn:aws:quicksight:$AwsRegion`:$AwsAccountId" +
                ":dataset/pmo-executive-semantic-v1-1"
            )
        }
    )
    CalculatedFields = $calculatedFields
    ColumnConfigurations = @(
        @(
            "CREATED",
            "Fecha Inicio del proyecto",
            "Fecha Planificada Termino del proyecto",
            "Fecha Termino Efectiva",
            "LATEST STATUS DATE"
        ) | ForEach-Object {
            @{
                Column = New-Column -Name $_
                FormatConfiguration = @{
                    DateTimeFormatConfiguration = @{
                        DateTimeFormat = "DD-MM-YYYY"
                        NullValueFormatConfiguration = @{
                            NullString = "Sin fecha"
                        }
                    }
                }
                Role = "DIMENSION"
            }
        }
    )
    FilterGroups = $filterGroups
    Sheets = @(
        @{
            SheetId = "resumen-ejecutivo"
            Name = (
                "PMO EXECUTIVE PORTFOLIO DASHBOARD | Strategic Delivery"
            )
            ContentType = "INTERACTIVE"
            FilterControls = $filterControls
            Visuals = $visuals
            Layouts = @(
                @{
                    Configuration = @{
                        GridLayout = @{
                            Elements = $elements
                            CanvasSizeOptions = @{
                                ScreenCanvasSizeOptions = @{
                                    ResizeOption = "FIXED"
                                    OptimizedViewPortWidth = "1600px"
                                }
                            }
                        }
                    }
                }
            )
        }
    )
    AnalysisDefaults = @{
        DefaultNewSheetConfiguration = @{
            InteractiveLayoutConfiguration = @{
                Grid = @{
                    CanvasSizeOptions = @{
                        ScreenCanvasSizeOptions = @{
                            ResizeOption = "FIXED"
                            OptimizedViewPortWidth = "1600px"
                        }
                    }
                }
            }
            SheetContentType = "INTERACTIVE"
        }
    }
    Options = @{
        WeekStart = "MONDAY"
        QBusinessInsightsStatus = "DISABLED"
    }
}

$themeConfiguration = @{
    DataColorPalette = @{
        Colors = @(
            "#3B82F6",
            "#7C3AED",
            "#22C55E",
            "#F59E0B",
            "#EF4444",
            "#14B8A6",
            "#9CA3AF",
            "#F9FAFB"
        )
        MinMaxGradient = @("#EF4444", "#22C55E")
        EmptyFillColor = "#374151"
    }
    UIColorPalette = @{
        PrimaryForeground = "#F9FAFB"
        PrimaryBackground = "#0B1120"
        SecondaryForeground = "#9CA3AF"
        SecondaryBackground = "#111827"
        Accent = "#3B82F6"
        AccentForeground = "#F9FAFB"
        Danger = "#EF4444"
        DangerForeground = "#F9FAFB"
        Warning = "#F59E0B"
        WarningForeground = "#0B1120"
        Success = "#22C55E"
        SuccessForeground = "#0B1120"
        Dimension = "#7C3AED"
        DimensionForeground = "#F9FAFB"
        Measure = "#3B82F6"
        MeasureForeground = "#F9FAFB"
    }
    Sheet = @{
        Background = @{ Color = "#0B1120" }
        Tile = @{
            BackgroundColor = "#111827FF"
            Border = @{
                Show = $true
                Color = "#1F2937FF"
                Width = "1px"
            }
            BorderRadius = "12px"
        }
        TileLayout = @{
            Gutter = @{ Show = $true }
            Margin = @{ Show = $true }
        }
    }
}

$outputDirectory = Join-Path $PSScriptRoot "generated"
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
$definitionPath = Join-Path $outputDirectory "executive-analysis-definition.json"
$themePath = Join-Path $outputDirectory "executive-dark-theme.json"

$definition |
    ConvertTo-Json -Depth 100 |
    Set-Content -LiteralPath $definitionPath -Encoding utf8NoBOM
$themeConfiguration |
    ConvertTo-Json -Depth 30 |
    Set-Content -LiteralPath $themePath -Encoding utf8NoBOM

Write-Host "Definición generada: $definitionPath"
Write-Host "Tema generado: $themePath"
Write-Host (
    "Visuales: {0}; filtros globales: {1}." -f
    $visuals.Count,
    $filterGroups.Count
)

if (-not $Deploy) {
    Write-Host "Preflight local completado. Use -Deploy para publicar."
    exit 0
}

$themeArn = "arn:aws:quicksight:$AwsRegion`:$AwsAccountId`:theme/$ThemeId"
$themeExists = $true

try {
    aws quicksight describe-theme `
        --aws-account-id $AwsAccountId `
        --theme-id $ThemeId `
        --region $AwsRegion `
        --no-cli-pager 2>$null | Out-Null

    if ($LASTEXITCODE -ne 0) {
        $themeExists = $false
    }
} catch {
    $themeExists = $false
}

if ($themeExists) {
    aws quicksight update-theme `
        --aws-account-id $AwsAccountId `
        --theme-id $ThemeId `
        --name "PMO Executive Dark" `
        --base-theme-id "MIDNIGHT" `
        --configuration "file://$themePath" `
        --region $AwsRegion `
        --no-cli-pager

    if ($LASTEXITCODE -ne 0) {
        throw "QuickSight rechazó la actualización del tema."
    }
} else {
    aws quicksight create-theme `
        --aws-account-id $AwsAccountId `
        --theme-id $ThemeId `
        --name "PMO Executive Dark" `
        --base-theme-id "MIDNIGHT" `
        --configuration "file://$themePath" `
        --permissions (
            "Principal=$principalArn," +
            "Actions=quicksight:DescribeTheme," +
            "quicksight:ListThemeVersions," +
            "quicksight:DescribeThemeAlias," +
            "quicksight:ListThemeAliases," +
            "quicksight:UpdateTheme," +
            "quicksight:DeleteTheme," +
            "quicksight:UpdateThemePermissions," +
            "quicksight:DescribeThemePermissions," +
            "quicksight:CreateThemeAlias," +
            "quicksight:UpdateThemeAlias," +
            "quicksight:DeleteThemeAlias"
        ) `
        --region $AwsRegion `
        --no-cli-pager

    if ($LASTEXITCODE -ne 0) {
        throw "QuickSight rechazó la creación del tema."
    }
}

$analysisExists = $true

aws quicksight describe-analysis `
    --aws-account-id $AwsAccountId `
    --analysis-id $AnalysisId `
    --region $AwsRegion `
    --no-cli-pager 2>$null | Out-Null

if ($LASTEXITCODE -ne 0) {
    $analysisExists = $false
}

if ($analysisExists) {
    aws quicksight update-analysis `
        --aws-account-id $AwsAccountId `
        --analysis-id $AnalysisId `
        --name $AnalysisName `
        --definition "file://$definitionPath" `
        --theme-arn $themeArn `
        --validation-strategy Mode=LENIENT `
        --region $AwsRegion `
        --no-cli-pager
} else {
    aws quicksight create-analysis `
        --aws-account-id $AwsAccountId `
        --analysis-id $AnalysisId `
        --name $AnalysisName `
        --definition "file://$definitionPath" `
        --theme-arn $themeArn `
        --validation-strategy Mode=LENIENT `
        --permissions (
            "Principal=$principalArn," +
            "Actions=quicksight:RestoreAnalysis," +
            "quicksight:UpdateAnalysisPermissions," +
            "quicksight:DeleteAnalysis," +
            "quicksight:QueryAnalysis," +
            "quicksight:DescribeAnalysisPermissions," +
            "quicksight:DescribeAnalysis," +
            "quicksight:UpdateAnalysis"
        ) `
        --region $AwsRegion `
        --no-cli-pager
}

if ($LASTEXITCODE -ne 0) {
    throw "QuickSight rechazó la publicación del análisis."
}

$dashboardExists = $true

aws quicksight describe-dashboard `
    --aws-account-id $AwsAccountId `
    --dashboard-id $DashboardId `
    --region $AwsRegion `
    --no-cli-pager 2>$null | Out-Null

if ($LASTEXITCODE -ne 0) {
    $dashboardExists = $false
}

if ($dashboardExists) {
    aws quicksight update-dashboard `
        --aws-account-id $AwsAccountId `
        --dashboard-id $DashboardId `
        --name $DashboardName `
        --definition "file://$definitionPath" `
        --theme-arn $themeArn `
        --validation-strategy Mode=LENIENT `
        --region $AwsRegion `
        --no-cli-pager
} else {
    aws quicksight create-dashboard `
        --aws-account-id $AwsAccountId `
        --dashboard-id $DashboardId `
        --name $DashboardName `
        --definition "file://$definitionPath" `
        --theme-arn $themeArn `
        --validation-strategy Mode=LENIENT `
        --permissions (
            "Principal=$principalArn," +
            "Actions=quicksight:DescribeDashboard," +
            "quicksight:ListDashboardVersions," +
            "quicksight:UpdateDashboardPermissions," +
            "quicksight:QueryDashboard," +
            "quicksight:UpdateDashboard," +
            "quicksight:DeleteDashboard," +
            "quicksight:DescribeDashboardPermissions," +
            "quicksight:UpdateDashboardPublishedVersion"
        ) `
        --region $AwsRegion `
        --no-cli-pager
}

if ($LASTEXITCODE -ne 0) {
    throw "QuickSight rechazó la publicación del dashboard."
}

Write-Host "Publicación iniciada para análisis, tema y dashboard."

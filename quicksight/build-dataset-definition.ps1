[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [ValidatePattern("^\d{12}$")]
    [string]$AwsAccountId,

    [Parameter(Mandatory)]
    [string]$ProjectsDataSourceArn,

    [Parameter(Mandatory)]
    [string]$MetricsDataSourceArn,

    [Parameter(Mandatory)]
    [string]$PrincipalArn
)

$ErrorActionPreference = "Stop"
$modelPath = Join-Path $PSScriptRoot "semantic-model.json"
$model = Get-Content -LiteralPath $modelPath -Raw |
    ConvertFrom-Json -Depth 20

function New-InputColumn {
    param(
        [Parameter(Mandatory)]
        [string]$Name,
        [Parameter(Mandatory)]
        [string]$Type
    )

    return @{
        Name = $Name
        Type = $Type
    }
}

$projectStringColumns = @(
    "NAME",
    "URL",
    "CREATED",
    "STATUS COLOR",
    "PMO ID",
    "Fecha Inicio del proyecto",
    "Fecha Planificada Termino del proyecto",
    "Cliente",
    "Fase del proyecto",
    "Responsable Proyecto",
    "AWS OPP ID",
    "Pais",
    "Tipo Proyecto",
    "Segmento empresa",
    "Fecha Termino Efectiva",
    "Clasificación",
    "PROJECT ID",
    "LATEST STATUS UPDATE",
    "LATEST STATUS DATE",
    "DATA REFRESH"
)

$projectIntegerColumns = @(
    "ALL TASKS",
    "COMPLETE",
    "INCOMPLETE"
)

$projectDecimalColumns = @(
    "Total presupuestado",
    "Horas Planificadas",
    "Pago Cliente",
    "Fondos AWS",
    "Incentivos",
    "Creditos AWS",
    "Inversion Morris"
)

$projectDateFormats = [ordered]@{
    "CREATED" = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    "Fecha Inicio del proyecto" = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    "Fecha Planificada Termino del proyecto" = (
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    )
    "Fecha Termino Efectiva" = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    "LATEST STATUS DATE" = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
}

$metricStringColumns = @(
    "project_gid",
    "project_name",
    "responsable_proyecto",
    "owner_name",
    "project_status",
    "start_on",
    "due_on",
    "alert_level",
    "alert_label",
    "health_status",
    "snapshot_date"
)

$metricIntegerColumns = @(
    "completed",
    "archived",
    "days_to_finish",
    "total_tasks",
    "completed_tasks",
    "pending_tasks",
    "overdue_tasks",
    "is_overdue",
    "due_within_7_days",
    "due_within_15_days",
    "due_within_30_days",
    "missing_due_date",
    "missing_responsible",
    "health_score"
)

$metricDecimalColumns = @(
    "progress_pct",
    "overdue_tasks_pct",
    "pending_tasks_pct"
)

$metricDateFormats = [ordered]@{
    "start_on" = "yyyy-MM-dd"
    "due_on" = "yyyy-MM-dd"
    "snapshot_date" = "yyyy-MM-dd"
}

$projectInputColumns = @(
    $projectStringColumns +
    $projectIntegerColumns +
    $projectDecimalColumns |
    ForEach-Object { New-InputColumn -Name $_ -Type "STRING" }
)

$metricInputColumns = @(
    $metricStringColumns +
    $metricIntegerColumns +
    $metricDecimalColumns |
    ForEach-Object { New-InputColumn -Name $_ -Type "STRING" }
)

$uploadSettings = @{
    Format = "CSV"
    StartFromRow = 1
    ContainsHeader = $true
    TextQualifier = "DOUBLE_QUOTE"
    Delimiter = ","
}

$projectRenames = @(
    @("NAME", "Proyecto"),
    @("PROJECT ID", "Proyecto ID"),
    @("Pais", "Pais"),
    @("Segmento empresa", "Segmento"),
    @("Fase del proyecto", "Fase"),
    @("STATUS COLOR", "Estado Proyecto"),
    @("Clasificación", "Clasificacion")
) | ForEach-Object {
    @{
        RenameColumnOperation = @{
            ColumnName = $_[0]
            NewColumnName = $_[1]
        }
    }
}

$metricRenames = @(
    @("project_gid", "Metrica Proyecto ID"),
    @("project_name", "Metrica Proyecto"),
    @("responsable_proyecto", "Metrica Responsable"),
    @("project_status", "Estado Tecnico Proyecto")
) | ForEach-Object {
    @{
        RenameColumnOperation = @{
            ColumnName = $_[0]
            NewColumnName = $_[1]
        }
    }
}

$projectCasts = @()
$projectCasts += $projectIntegerColumns | ForEach-Object {
    @{
        CastColumnTypeOperation = @{
            ColumnName = $_
            NewColumnType = "INTEGER"
        }
    }
}
$projectCasts += $projectDecimalColumns | ForEach-Object {
    @{
        CastColumnTypeOperation = @{
            ColumnName = $_
            NewColumnType = "DECIMAL"
        }
    }
}
$projectCasts += $projectDateFormats.GetEnumerator() | ForEach-Object {
    @{
        CastColumnTypeOperation = @{
            ColumnName = $_.Key
            NewColumnType = "DATETIME"
            Format = $_.Value
        }
    }
}

$metricCasts = @()
$metricCasts += $metricIntegerColumns | ForEach-Object {
    @{
        CastColumnTypeOperation = @{
            ColumnName = $_
            NewColumnType = "INTEGER"
        }
    }
}
$metricCasts += $metricDecimalColumns | ForEach-Object {
    @{
        CastColumnTypeOperation = @{
            ColumnName = $_
            NewColumnType = "DECIMAL"
        }
    }
}
$metricCasts += $metricDateFormats.GetEnumerator() | ForEach-Object {
    @{
        CastColumnTypeOperation = @{
            ColumnName = $_.Key
            NewColumnType = "DATETIME"
            Format = $_.Value
        }
    }
}

$baseCalculatedNames = @(
    "Proyecto Activo",
    "Proyecto Finalizado",
    "Proyecto En Curso",
    "Proyecto en Riesgo",
    "Proyecto con Retraso",
    "Proyecto en Espera"
)

$baseCalculatedColumns = @(
    $model.calculatedFields |
    Where-Object name -In $baseCalculatedNames |
    ForEach-Object {
        @{
            ColumnName = $_.name
            ColumnId = $_.id
            Expression = $_.expression
        }
    }
)

$derivedCalculatedColumns = @(
    $model.calculatedFields |
    Where-Object name -NotIn $baseCalculatedNames |
    ForEach-Object {
        @{
            ColumnName = $_.name
            ColumnId = $_.id
            Expression = $_.expression
        }
    }
)

$joinedTransforms = @(
    @{
        CreateColumnsOperation = @{
            Columns = $baseCalculatedColumns
        }
    },
    @{
        CreateColumnsOperation = @{
            Columns = $derivedCalculatedColumns
        }
    }
)

$fieldFolders = @{}

foreach ($folderName in @(
    "01 - Dimensiones",
    "02 - Estado y ciclo de vida",
    "03 - Plazos",
    "04 - Avance y tareas",
    "05 - Portfolio Health",
    "06 - Finanzas y capacidad",
    "07 - Control de datos"
)) {
    $columns = @(
        $model.sourceFields |
        Where-Object folder -EQ $folderName |
        ForEach-Object semanticName
    )
    $columns += @(
        $model.calculatedFields |
        Where-Object folder -EQ $folderName |
        ForEach-Object name
    )

    $fieldFolders[$folderName] = @{
        columns = $columns
        description = (
            "Campos gobernados del modelo semántico PMO v1.1.0."
        )
    }
}

$permissions = @(
    @{
        Principal = $PrincipalArn
        Actions = @(
            "quicksight:DeleteDataSet",
            "quicksight:UpdateDataSetPermissions",
            "quicksight:PutDataSetRefreshProperties",
            "quicksight:CreateRefreshSchedule",
            "quicksight:CancelIngestion",
            "quicksight:PassDataSet",
            "quicksight:ListIngestions",
            "quicksight:UpdateDataSet",
            "quicksight:DeleteDataSetRefreshProperties",
            "quicksight:DescribeDataSetRefreshProperties",
            "quicksight:DescribeDataSet",
            "quicksight:CreateIngestion",
            "quicksight:DescribeRefreshSchedule",
            "quicksight:ListRefreshSchedules",
            "quicksight:DeleteRefreshSchedule",
            "quicksight:UpdateRefreshSchedule",
            "quicksight:DescribeDataSetPermissions",
            "quicksight:DescribeIngestion"
        )
    }
)

@{
    AwsAccountId = $AwsAccountId
    DataSetId = $model.datasetId
    Name = $model.name
    ImportMode = "SPICE"
    PhysicalTableMap = @{
        projectsPhysical = @{
            S3Source = @{
                DataSourceArn = $ProjectsDataSourceArn
                InputColumns = $projectInputColumns
                UploadSettings = $uploadSettings
            }
        }
        metricsPhysical = @{
            S3Source = @{
                DataSourceArn = $MetricsDataSourceArn
                InputColumns = $metricInputColumns
                UploadSettings = $uploadSettings
            }
        }
    }
    LogicalTableMap = @{
        projectsLogical = @{
            Alias = "Proyectos"
            Source = @{
                PhysicalTableId = "projectsPhysical"
            }
            DataTransforms = @($projectRenames) + @($projectCasts)
        }
        metricsLogical = @{
            Alias = "Metricas de proyecto"
            Source = @{
                PhysicalTableId = "metricsPhysical"
            }
            DataTransforms = @($metricRenames) + @($metricCasts)
        }
        executiveJoin = @{
            Alias = "Modelo Ejecutivo PMO"
            Source = @{
                JoinInstruction = @{
                    LeftOperand = "projectsLogical"
                    RightOperand = "metricsLogical"
                    Type = "LEFT"
                    OnClause = (
                        "{Proyecto ID} = {Metrica Proyecto ID}"
                    )
                    LeftJoinKeyProperties = @{
                        UniqueKey = $true
                    }
                    RightJoinKeyProperties = @{
                        UniqueKey = $true
                    }
                }
            }
            DataTransforms = $joinedTransforms
        }
    }
    FieldFolders = $fieldFolders
    Permissions = $permissions
    DataSetUsageConfiguration = @{
        DisableUseAsDirectQuerySource = $true
        DisableUseAsImportedSource = $false
    }
}

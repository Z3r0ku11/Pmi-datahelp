[CmdletBinding()]
param(
    [string]$ModelPath = (
        Join-Path $PSScriptRoot "semantic-model.json"
    )
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $ModelPath -PathType Leaf)) {
    throw "No existe el modelo semántico: $ModelPath"
}

$model = Get-Content -LiteralPath $ModelPath -Raw |
    ConvertFrom-Json -Depth 20

$errors = [System.Collections.Generic.List[string]]::new()
$requiredTopLevel = @(
    "modelVersion",
    "name",
    "grain",
    "datasetId",
    "join",
    "sourceFields",
    "calculatedFields",
    "kpis"
)

foreach ($property in $requiredTopLevel) {
    if ($null -eq $model.$property) {
        $errors.Add("Falta la propiedad obligatoria '$property'.")
    }
}

if ($model.join.type -ne "LEFT") {
    $errors.Add("La unión ejecutiva debe ser LEFT.")
}

if (
    $model.join.leftKey -ne "PROJECT ID" -or
    $model.join.rightKey -ne "project_gid"
) {
    $errors.Add(
        "La unión debe usar PROJECT ID = project_gid."
    )
}

$duplicateCalculatedNames = $model.calculatedFields |
    Group-Object -Property name |
    Where-Object Count -gt 1

foreach ($duplicate in $duplicateCalculatedNames) {
    $errors.Add(
        "Campo calculado duplicado: $($duplicate.Name)."
    )
}

$duplicateCalculatedIds = $model.calculatedFields |
    Group-Object -Property id |
    Where-Object Count -gt 1

foreach ($duplicate in $duplicateCalculatedIds) {
    $errors.Add(
        "ID de campo calculado duplicado: $($duplicate.Name)."
    )
}

$allowedFolders = @(
    "01 - Dimensiones",
    "02 - Estado y ciclo de vida",
    "03 - Plazos",
    "04 - Avance y tareas",
    "05 - Portfolio Health",
    "06 - Finanzas y capacidad",
    "07 - Control de datos",
    "08 - KPIs"
)

$allFields = @($model.sourceFields) +
    @($model.calculatedFields) +
    @($model.kpis)

foreach ($field in $allFields) {
    if ($field.folder -notin $allowedFolders) {
        $errors.Add(
            "Carpeta no gobernada en '$($field.name)': " +
            "'$($field.folder)'."
        )
    }
}

$expressions = @($model.calculatedFields.expression) +
    @($model.kpis.expression)

foreach ($expression in $expressions) {
    if ([string]::IsNullOrWhiteSpace($expression)) {
        $errors.Add("Se encontró una expresión vacía.")
    }
}

if ($model.calculatedFields.Count -lt 15) {
    $errors.Add(
        "El modelo debe contener al menos 15 campos calculados."
    )
}

if ($errors.Count -gt 0) {
    $errors | ForEach-Object {
        Write-Error $_
    }
    exit 1
}

Write-Host (
    "Modelo válido: {0} campos calculados y {1} KPIs." -f
    $model.calculatedFields.Count,
    $model.kpis.Count
)

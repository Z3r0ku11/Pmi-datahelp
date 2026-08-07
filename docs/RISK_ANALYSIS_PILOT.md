# Piloto DEV — Generador de Matriz de Riesgos

## Objetivo

Generar una matriz de hasta 10 riesgos a partir de una propuesta comercial
PDF digital o PPTX y, opcionalmente, un SOW y un NDA. La IA propone riesgos con evidencia y
un usuario autenticado debe revisarlos antes de considerarlos aprobados.

## Flujo

```text
CloudFront + Cognito
        |
        v
API Gateway HTTP API
        |
        +--> URL de carga temporal
        +--> S3 privado y versionado
        +--> Lambda asíncrona
                  |
                  v
             Nova Lite
                  |
                  v
        JSON con máximo 10 riesgos
```

## Archivos admitidos

- Propuesta: exactamente un archivo `.pdf` digital o `.pptx`, obligatorio.
- SOW: `.pdf` digital o `.pptx`, opcional.
- NDA: `.pdf` digital o `.pptx`, opcional.
- Máximo: tres archivos y 20 MB por archivo.

Los PDF deben contener texto digital extraíble. Los PDF escaneados, protegidos
con contraseña y el formato heredado `.ppt` no se admiten. El parser `pypdf`
se ejecuta dentro de Lambda; no se utiliza OCR, Textract ni Data Automation.

## Seguridad

- API protegida por el Cognito existente.
- Carga directa mediante formulario S3 prefirmado con expiración de 15 minutos.
- Bucket con cifrado, bloqueo de acceso público y versionado.
- Cada usuario escribe bajo un prefijo derivado de su `sub` de Cognito.
- Documentos y resultados DEV expiran después de 30 días.
- Logs con retención de siete días.
- No se registra el texto de documentos en CloudWatch.
- El documento original nunca se almacena en Git.

## Controles de costo

- Inferencia exclusivamente por solicitud explícita.
- Modelo predeterminado: `amazon.nova-lite-v1:0`.
- Máximo 120.000 caracteres por análisis.
- Máximo 3.500 tokens de salida.
- Máximo 10 riesgos.
- Una sola ejecución concurrente del worker.
- Sin Knowledge Bases, Data Automation, Textract ni capacidad reservada.

## Validación inicial

Prueba realizada el 31 de julio de 2026 con una propuesta de 29 diapositivas:

| Métrica | Resultado |
|---|---:|
| Archivos | 1 PPTX |
| Riesgos | 10 |
| Tokens de entrada | 3.875 |
| Tokens de salida | 1.637 |
| Costo estimado de inferencia | USD 0,00063 |

El cálculo usa USD 0,06 por millón de tokens de entrada y USD 0,24 por millón
de tokens de salida. No incluye impuestos ni cambios posteriores de tarifa.

## Recursos DEV

- Stack: `pmo-ip-risk-analysis-dev`.
- API: `pmo-ip-dev-risk-analysis`.
- Bucket: `pmo-ip-risk-analysis-dev-<cuenta>-us-east-1`.
- Lambda API: `pmo-ip-dev-risk-analysis-api`.
- Lambda worker: `pmo-ip-dev-risk-analysis-worker`.
- Logs: `/pmo-ip/dev/risk-analysis-api` y
  `/pmo-ip/dev/risk-analysis-worker`.

No existen recursos PROD para esta funcionalidad.

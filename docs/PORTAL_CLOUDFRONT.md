# Portal CloudFront para PMO Executive Dashboard

## Objetivo

Publicar un portal web liviano para embeber el Dashboard V2 de QuickSight en
dos ambientes aislados:

- `DEV`
- `PROD`

Cada ambiente usa:

- un bucket S3 privado;
- una distribución CloudFront con dominio predeterminado `cloudfront.net`;
- Origin Access Control;
- HTTPS administrado por CloudFront;
- bloqueo completo de acceso público en S3;
- versionado y cifrado AES-256.

El portal no hace público el dashboard. Cognito autentica al usuario y una
Lambda genera una URL temporal de embedding para el usuario registrado en
QuickSight. API Gateway valida el token antes de invocar la Lambda.

## Preflight

```powershell
.\scripts\deploy-secure-portal.ps1
```

## Despliegue

```powershell
.\scripts\deploy-secure-portal.ps1 -Environment all -Deploy
```

También puede desplegarse un solo ambiente:

```powershell
.\scripts\deploy-secure-portal.ps1 -Environment dev -Deploy
.\scripts\deploy-secure-portal.ps1 -Environment prod -Deploy
```

## Dominios de QuickSight

Después del despliegue, copiar las dos salidas
`QuickSightAllowedDomain` y agregarlas en:

```text
QuickSight
  > Manage QuickSight
  > Domains and Embedding
```

Los dominios deben registrarse con `https://`. La Lambda también limita cada
URL temporal al dominio CloudFront que originó la solicitud.

## Primer acceso

CloudFormation crea un usuario Cognito con el correo configurado y envía una
contraseña temporal. En el primer inicio de sesión, Cognito solicita definir
una contraseña definitiva. Esta identidad del portal no agrega una licencia
de QuickSight; el embedding usa el usuario QuickSight existente.

## Validación

```powershell
.\scripts\test-portal.ps1 -Environment all
```

La validación comprueba:

- respuesta HTTP 200 desde CloudFront;
- existencia de ambos stacks;
- bloqueo completo de acceso público en los buckets.

## Costos

No se requiere dominio propio, Route 53 ni certificado ACM personalizado.
Cognito, Lambda y API Gateway se mantienen dentro de sus niveles gratuitos o
en costos de centavos para un único usuario y uso ejecutivo normal. CloudFront,
S3 y QuickSight pueden generar cargos según uso y condiciones de la cuenta.
La plantilla utiliza `PriceClass_100` para limitar la distribución a las
ubicaciones de menor costo.

## Eliminación

Los buckets tienen política de retención para proteger los archivos del
portal. La eliminación de stacks y buckets debe realizarse de manera
deliberada; no se incluye eliminación automática.

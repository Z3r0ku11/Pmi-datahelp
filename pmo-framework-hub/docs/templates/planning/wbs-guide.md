# Guía: Work Breakdown Structure (WBS) Template

## Descripción General

La Estructura de Descomposición del Trabajo (WBS) es una descomposición jerárquica orientada a los entregables del trabajo a ser ejecutado por el equipo del proyecto para lograr los objetivos del proyecto y crear los entregables requeridos.

## Propósito

- **Organización del Trabajo**: Estructurar todo el trabajo del proyecto de manera lógica
- **Definición de Paquetes de Trabajo**: Crear unidades manejables de trabajo
- **Base para Estimación**: Facilitar estimaciones de tiempo, costo y recursos
- **Control y Seguimiento**: Establecer puntos de control para el monitoreo del progreso

## Principios Fundamentales del WBS

### Regla del 100%
- El WBS debe incluir el 100% del trabajo definido por el alcance del proyecto
- Cada nivel descendente debe representar el 100% del trabajo del nivel superior
- Ningún trabajo debe aparecer fuera de la estructura del WBS

### Orientación a Entregables
- Los elementos del WBS deben ser orientados a productos/entregables, no a actividades
- Cada elemento debe representar un producto, servicio o resultado verificable
- Los verbos (actividades) aparecen a nivel de paquete de trabajo, no en niveles superiores

### Niveles Jerárquicos
- **Nivel 0**: Proyecto completo
- **Nivel 1**: Entregables principales o fases del proyecto
- **Nivel 2**: Sub-entregables o componentes principales
- **Nivel 3+**: Descomposición adicional hasta llegar a paquetes de trabajo

## Estructura del Template

### 1. Información del Proyecto
```
- Nombre del Proyecto
- Código WBS del Proyecto (1.0)
- Project Manager
- Fecha de Creación
- Versión del WBS
- Fecha de Última Actualización
```

### 2. Niveles de Descomposición

#### Nivel 1: Entregables Principales
```
1.1 Gestión del Proyecto
1.2 Análisis y Diseño
1.3 Desarrollo/Implementación
1.4 Testing y Validación
1.5 Despliegue y Go-Live
1.6 Cierre del Proyecto
```

#### Nivel 2: Sub-entregables
```
1.1 Gestión del Proyecto
    1.1.1 Iniciación
    1.1.2 Planificación
    1.1.3 Ejecución y Control
    1.1.4 Cierre

1.2 Análisis y Diseño
    1.2.1 Análisis de Requisitos
    1.2.2 Diseño de Solución
    1.2.3 Arquitectura Técnica
    1.2.4 Documentación de Diseño
```

#### Nivel 3+: Paquetes de Trabajo
```
1.2.1 Análisis de Requisitos
    1.2.1.1 Requisitos Funcionales
    1.2.1.2 Requisitos No Funcionales
    1.2.1.3 Casos de Uso
    1.2.1.4 Matriz de Trazabilidad
```

### 3. Diccionario del WBS

Para cada elemento del WBS:
```
- Código WBS
- Nombre del Elemento
- Descripción Detallada
- Entregables Asociados
- Criterios de Aceptación
- Responsable
- Estimación de Esfuerzo
- Dependencias
- Riesgos Asociados
```

## Tipos de WBS

### Por Fases del Proyecto
- Estructura basada en el ciclo de vida del proyecto
- Apropiado para proyectos con fases claramente definidas
- Facilita el control por etapas del proyecto

### Por Entregables
- Estructura basada en productos/servicios finales
- Apropiado para proyectos con múltiples productos
- Facilita la asignación de responsabilidades por entregable

### Híbrido
- Combinación de fases y entregables
- Primer nivel por fases, segundo nivel por entregables
- Máxima flexibilidad de organización

## Instrucciones de Uso

### Paso 1: Preparación
1. Revisa el Project Charter y la documentación del alcance
2. Identifica los entregables principales del proyecto
3. Define el enfoque del WBS (por fases, entregables o híbrido)
4. Reúne al equipo clave para sesión de construcción del WBS

### Paso 2: Construcción del WBS

#### Enfoque Top-Down (Recomendado)
1. **Nivel 1**: Identifica los entregables principales o fases
2. **Nivel 2**: Descompone cada elemento del Nivel 1 en sub-entregables
3. **Nivel 3+**: Continúa descomponiendo hasta llegar a paquetes de trabajo manejables
4. **Validación**: Asegura que cada nivel suma el 100% del nivel superior

#### Enfoque Bottom-Up
1. Lista todas las actividades conocidas del proyecto
2. Agrupa actividades relacionadas en paquetes de trabajo
3. Agrupa paquetes de trabajo en entregables mayores
4. Continúa agregando hasta llegar al proyecto completo

### Paso 3: Definir Paquetes de Trabajo

Criterios para Paquetes de Trabajo:
- **Duración**: 8-80 horas de trabajo (regla general)
- **Responsabilidad**: Un solo responsable por paquete
- **Medible**: Progreso claramente verificable
- **Independiente**: Mínima dependencia con otros paquetes
- **Entregable**: Produce un resultado tangible

### Paso 4: Crear Diccionario del WBS
1. Documenta cada elemento del WBS con detalle
2. Define criterios de aceptación claros
3. Establece responsabilidades
4. Identifica dependencias y riesgos

### Paso 5: Validación y Aprobación
1. Revisa completitud (regla del 100%)
2. Valida con stakeholders clave
3. Asegura alineación con el alcance del proyecto
4. Obtiene aprobación formal

## Mejores Prácticas

### ✅ Hacer
- **Usar Sustantivos**: Los elementos del WBS deben ser sustantivos (productos), no verbos (actividades)
- **Aplicar Regla 100%**: Cada nivel debe sumar exactamente el 100% del nivel superior
- **Mantener Consistencia**: Usar el mismo nivel de detalle en elementos del mismo nivel
- **Código Único**: Asignar código único a cada elemento del WBS
- **Involucrar al Equipo**: Incluir a expertos técnicos en la construcción
- **Documentar Detalle**: Crear diccionario completo del WBS

### ❌ Evitar
- **Exceso de Detalle**: Descomponer más allá de paquetes de trabajo manejables
- **Falta de Detalle**: Paquetes de trabajo demasiado grandes para controlar
- **Mezclar Criterios**: Combinar fases y entregables en el mismo nivel sin lógica
- **Elementos Duplicados**: Mismo trabajo aparece en múltiples lugares
- **Omitir Gestión**: No incluir actividades de gestión del proyecto
- **WBS Estático**: No actualizar conforme evoluciona el proyecto

## Herramientas y Formatos

### Formato Jerárquico (Indentado)
```
1.0 Proyecto Sistema CRM
    1.1 Gestión del Proyecto
        1.1.1 Iniciación
        1.1.2 Planificación
    1.2 Análisis y Diseño
        1.2.1 Análisis de Requisitos
        1.2.2 Diseño de Solución
```

### Formato Gráfico (Organigrama)
- Representación visual en forma de árbol
- Útil para presentaciones y comunicación
- Facilita comprensión de la estructura

### Formato Tabular (Excel)
- Incluye códigos, descripciones, responsables, estimaciones
- Facilita cálculos y análisis
- Permite filtrado y ordenamiento

## Integración con Otras Herramientas

### Cronograma del Proyecto
- Los paquetes de trabajo se convierten en actividades del cronograma
- La estructura del WBS define la estructura del cronograma
- Los códigos WBS facilitan la trazabilidad

### Presupuesto del Proyecto
- Estimaciones de costo se asignan a elementos del WBS
- Facilita control de costos por entregable
- Permite análisis de valor ganado

### Asignación de Recursos
- Recursos se asignan a paquetes de trabajo específicos
- Facilita balanceamento y optimización de recursos
- Clarifica responsabilidades del equipo

## Ejemplo Práctico: Proyecto de Software

### WBS para Sistema de Gestión de Inventarios
```
1.0 Sistema de Gestión de Inventarios
    1.1 Gestión del Proyecto (15%)
        1.1.1 Project Charter
        1.1.2 Plan del Proyecto
        1.1.3 Reportes de Status
        1.1.4 Cierre del Proyecto
    
    1.2 Análisis y Diseño (25%)
        1.2.1 Análisis de Requisitos
        1.2.2 Diseño de Base de Datos
        1.2.3 Diseño de Interfaces
        1.2.4 Arquitectura de Software
    
    1.3 Desarrollo (40%)
        1.3.1 Módulo de Entrada de Inventario
        1.3.2 Módulo de Reportes
        1.3.3 Módulo de Administración
        1.3.4 Integración de Módulos
    
    1.4 Testing (15%)
        1.4.1 Test Unitario
        1.4.2 Test de Integración
        1.4.3 Test de Usuario
        1.4.4 Test de Performance
    
    1.5 Implementación (5%)
        1.5.1 Instalación en Producción
        1.5.2 Migración de Datos
        1.5.3 Capacitación de Usuarios
        1.5.4 Go-Live y Soporte
```

## Plantillas Relacionadas

- **Project Schedule Template** - Para cronograma basado en WBS
- **Resource Assignment Matrix** - Para asignación de responsabilidades
- **Cost Estimation Template** - Para presupuesto por elemento WBS
- **Risk Register Template** - Para riesgos por paquete de trabajo

---

**Archivo de Plantilla**: `WBS-Template-v1.5.xlsx`  
**Última Actualización**: Septiembre 2026  
**Responsable**: PMO Planning Team
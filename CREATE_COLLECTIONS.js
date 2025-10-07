// Definiciones de colecciones y validaciones del sistema académico
// Objetivo: crear colecciones con validaciones robustas ($jsonSchema) y reglas de negocio básicas
// Notas:
// - Se emplean patrones y enums para asegurar formatos válidos
// - Algunas reglas temporales usan $expr (ej.: fechas no futuras)
// - IDs referenciales se manejan como strings (códigos) para simplificar el CRUD y los inserts de ejemplo

// Crear colección estudiantes

// Propósito: almacenar datos personales, estado académico y métricas clave del estudiante
// Reglas destacadas:
// - 'documento' con patrón de cédula colombiana (6 a 10 dígitos)
// - 'estado' validado por enum (Activo, Inactivo, Graduado, Retirado)
// - 'fecha_nacimiento' tipo date y validada como fecha pasada mediante $expr
// - 'promedio_acumulado' entre 0.0 y 5.0

db.createCollection("estudiantes", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["codigo", "nombre", "email", "programa", "fecha_nacimiento", "documento"],
        properties: {
          codigo: {
            bsonType: "string",
            description: "Código único del estudiante - requerido"
          },
          nombre: {
            bsonType: "string",
            description: "Nombre completo - requerido"
          },
          email: {
            bsonType: "string",
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            description: "Email institucional válido"
          },
          programa: {
            bsonType: "string",
            description: "ID del programa académico - requerido"
          },
          semestre_actual: {
            bsonType: "number",
            minimum: 1,
            maximum: 12
          },
          promedio_acumulado: {
            bsonType: "double",
            minimum: 0.0,
            maximum: 5.0
          },
          estado: {
            bsonType: "string",
            enum: ["Activo", "Inactivo", "Graduado", "Retirado"],
            description: "Estado del estudiante (Activo, Inactivo, Graduado, Retirado)"
          },
          fecha_nacimiento: {
            bsonType: "date",
            description: "Fecha de nacimiento del estudiante"
          },
          documento: {
            bsonType: "string",
            pattern: "^[0-9]{6,10}$",
            description: "Documento de identidad colombiano (cédula, solo números, 6 a 10 dígitos) - requerido"
          }
        }
      },
      $expr: { $lt: ["$fecha_nacimiento", "$$NOW"] }
    }
});

// Crear colección profesores

// Propósito: registrar docentes, sus especialidades y materias asignadas
// Reglas destacadas:
// - 'documento' con patrón de cédula colombiana
// - 'email' validado con patrón
// - 'materias' como arreglo de códigos de materias

db.createCollection("profesores", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["codigo", "nombre", "email", "especialidades", "materias", "documento"],
            properties: {
                codigo: {
                    bsonType: "string",
                    description: "Código único del profesor - requerido"
                },
                nombre: {
                    bsonType: "string",
                    description: "Nombre completo - requerido"
                },
                email: {
                    bsonType: "string",
                    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                    description: "Email institucional válido"
                },
                especialidades: {
                    bsonType: "array",
                    items: {
                        bsonType: "string"
                    },
                    description: "Lista de especialidades"
                },
                materias: {
                    bsonType: "array",
                    items: {
                        bsonType: "string"
                    },
                    description: "Materias asignadas (referencia a materias)"
                },
                documento: {
                    bsonType: "string",
                    pattern: "^[0-9]{6,10}$",
                    description: "Documento de identidad colombiano (cédula, solo números, 6 a 10 dígitos) - requerido"
                },
            }
        }
    }
})

// Crear colección materias

// Propósito: definir oferta académica (asignaturas), su información y relaciones
// Reglas destacadas:
// - 'creditos' entero entre 1 y 10
// - 'profesor' como código de profesor
// - 'prerrequisitos' como arreglo de códigos de materias

db.createCollection("materias", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["codigo", "nombre", "información", "profesor", "creditos"],
            properties: {
                codigo: {
                    bsonType: "string",
                    description: "Código único de la materia - requerido"
                },
                nombre: {
                    bsonType: "string",
                    description: "Nombre de la materia - requerido"
                },
                información: {
                    bsonType: "string",
                    description: "Descripción de la materia - requerido"
                },
                profesor: {
                    bsonType: "string",
                    description: "ID del profesor asignado - requerido"
                },
                creditos: {
                    bsonType: "int",
                    minimum: 1,
                    maximum: 10,
                    description: "Cantidad de créditos de la materia - requerido (mínimo 1, máximo 10)"
                },
                prerrequisitos: {
                    bsonType: "array",
                    items: {
                        bsonType: "string"
                    },
                    description: "Lista de materias que son prerrequisito (referencia a materias)"
                }
            }
        }
    }
})

// Crear colección programas

// Propósito: definir programas académicos y sus planes de estudio
// Reglas destacadas:
// - 'plan_estudio' lista de códigos de materias
// - 'requisitos' lista libre de condiciones de ingreso/graduación

db.createCollection("programas", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["codigo", "nombre", "descripcion", "plan_estudio"],
            properties: {
                codigo: {
                    bsonType: "string",
                    description: "Código único del programa - requerido"
                },
                nombre: {
                    bsonType: "string",
                    description: "Nombre del programa - requerido"
                },
                descripcion: {
                    bsonType: "string",
                    description: "Descripción del programa"
                },
                plan_estudio: {
                    bsonType: "array",
                    items: {
                        bsonType: "string"
                    },
                    description: "Materias del plan de estudio (referencia a materias)"
                },
                requisitos: {
                    bsonType: "array",
                    items: {
                        bsonType: "string"
                    },
                    description: "Requisitos generales del programa"
                }
            }
        }
    }
})

// Crear colección inscripciones

// Propósito: registrar la relación estudiante-materia por período y su estado
// Reglas destacadas:
// - 'fecha_inscripcion' no puede ser futura (validación con $expr)
// - 'estado' validado por enum (activa, retirada, aprobada, finalizada)
// - 'nota' entre 0.0 y 5.0 (opcional)

db.createCollection("inscripciones", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["estudiante", "materia", "periodo", "fecha_inscripcion"],
            properties: {
                estudiante: {
                    bsonType: "string",
                    description: "ID del estudiante inscrito - requerido"
                },
                materia: {
                    bsonType: "string",
                    description: "ID de la materia inscrita - requerido"
                },
                periodo: {
                    bsonType: "string",
                    description: "Período académico (ej: 2025-2) - requerido"
                },
                fecha_inscripcion: {
                    bsonType: "date",
                    description: "Fecha de inscripción - requerido"
                },
                estado: {
                    bsonType: "string",
                    enum: ["activa", "retirada", "aprobada", "finalizada"],
                    description: "Estado de la inscripción (activa, retirada, aprobada)"
                },
                nota: {
                    bsonType: "double",
                    minimum: 0.0,
                    maximum: 5.0,
                    description: "Nota del estudiante en esa materia"
                },
            }
        },
        $expr: { $lte: ["$fecha_inscripcion", "$$NOW"] }
    }
})

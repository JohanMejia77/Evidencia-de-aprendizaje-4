// Crear colección estudiantes

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
            bsonType: "objectId",
            description: "ID del programa académico - requerido"
          },
          semestre_actual: {
            bsonType: "int",
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

db.createCollection("profesores", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["codigo", "nombre", "email", "especialidades", "materias"],
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
                        bsonType: "objectId"
                    },
                    description: "Materias asignadas (referencia a materias)"
                }
            }
        }
    }
})

// Crear colección materias

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
                    bsonType: "objectId",
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
                        bsonType: "objectId"
                    },
                    description: "Lista de materias que son prerrequisito (referencia a materias)"
                }
            }
        }
    }
})

// Crear colección programas

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
                        bsonType: "objectId"
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

db.createCollection("inscripciones", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["estudiante", "materia", "periodo", "fecha_inscripcion"],
            properties: {
                estudiante: {
                    bsonType: "objectId",
                    description: "ID del estudiante inscrito - requerido"
                },
                materia: {
                    bsonType: "objectId",
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
                    enum: ["activa", "retirada", "aprobada"],
                    description: "Estado de la inscripción (activa, retirada, aprobada)"
                }
            }
        },
        $expr: { $lte: ["$fecha_inscripcion", "$$NOW"] }
    }
})

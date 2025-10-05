function crearEstudiante(codigo, documento, nombre, email, programa, fecha_nacimiento, estado, semestre_actual, promedio_acumulado) {
    const estudiante = db.estudiantes.findOne({ documento });
    if (estudiante) {
        return {
            error: "Estudiante ya existe"
        }
    }
    db.estudiantes.insertOne({
        codigo,
        documento,
        nombre,
        email,
        programa,
        fecha_nacimiento,
        estado,
        semestre_actual,
        promedio_acumulado
    });
    return {
        success: "Estudiante creado correctamente"
    }
}

// Buscar estudiantes con diferentes filtros y criterios
// Ejemplos de uso:
// buscarEstudiante({ documento: "1002345678" })
// buscarEstudiante({ nombre: /Juan/i, estado: "Activo" })
// buscarEstudiante({ programa: "ING-SIS", estado: "Graduado" })
// buscarEstudiante({ promedio_min: 4.0 })
function buscarEstudiante(filtros) {
    const query = {};
    if (filtros.documento) {
        query.documento = filtros.documento;
    }
    if (filtros.nombre) {
        query.nombre = filtros.nombre;
    }
    if (filtros.estado) {
        query.estado = filtros.estado;
    }
    if (filtros.programa) {
        query.programa = filtros.programa;
    }
    if (filtros.semestre_actual) {
        query.semestre_actual = filtros.semestre_actual;
    }
    if (filtros.promedio_min || filtros.promedio_max) {
        query.promedio_acumulado = {};
        if (filtros.promedio_min) query.promedio_acumulado.$gte = filtros.promedio_min;
        if (filtros.promedio_max) query.promedio_acumulado.$lte = filtros.promedio_max;
    }
    return db.estudiantes.find(query).toArray();
}

// Actualizar estudiante
function actualizarEstudiante(documento, datos) {
    const estudiante = db.estudiantes.findOne({ documento });
    if (!estudiante) {
        return {
            error: "Estudiante no encontrado"
        }
    }
    db.estudiantes.updateOne({ documento }, { $set: datos });
    return {
        success: "Estudiante actualizado correctamente"
    }
}

// Eliminar estudiante
function eliminarEstudiante(documento) {
    const estudiante = db.estudiantes.findOne({ documento });
    if (!estudiante) {
        return {
            error: "Estudiante no encontrado"
        }
    }
    // Validar si tiene inscripciones activas o aprobadas
    const inscripcionActiva = db.inscripciones.findOne({
        estudiante: estudiante._id,
        estado: { $in: ["activa", "aprobada"] }
    });
    if (inscripcionActiva) {
        return {
            error: "No se puede eliminar: el estudiante tiene inscripciones activas o aprobadas"
        }
    }
    db.estudiantes.deleteOne({ documento });
    return {
        success: "Estudiante eliminado correctamente"
    }
}
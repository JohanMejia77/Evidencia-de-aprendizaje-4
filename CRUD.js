// CRUD del sistema académico sobre colecciones principales
// Propósito: encapsular operaciones de creación, consulta, actualización y eliminación
// Colecciones cubiertas: estudiantes, profesores, materias, programas, inscripciones
// Notas:
// - Validaciones previas (existencia, unicidad, dependencias) antes de escribir
// - Retornos uniformes { success: string } o { error: string }
// - Filtros dinámicos para consultas READ

function crearEstudiante(codigo, documento, nombre, email, programa, fecha_nacimiento, estado, semestre_actual, promedio_acumulado) {
    // Crea un estudiante si no existe un documento igual
    // Parámetros: identificadores y datos personales/ académicos
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
    // Parámetros: objeto con filtros opcionales
    // Retorna: arreglo de estudiantes que cumplen el filtro
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
    // Actualiza campos del estudiante por 'documento'
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
    // Elimina un estudiante si no tiene inscripciones activas o aprobadas
    const estudiante = db.estudiantes.findOne({ documento });
    if (!estudiante) {
        return {
            error: "Estudiante no encontrado"
        }
    }
    // Validar si tiene inscripciones activas o aprobadas
    const inscripcionActiva = db.inscripciones.findOne({
        estudiante: estudiante.codigo,
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

// CRUD para la colección profesores

// Crear profesor
function crearProfesor(codigo, documento, nombre, email, especialidades, materias) {
    // Crea un profesor si no existe un documento igual
    const profesor = db.profesores.findOne({ documento });
    if (profesor) {
        return {
            error: "Profesor ya existe"
        }
    }
    db.profesores.insertOne({
        codigo,
        documento,
        nombre,
        email,
        especialidades,
        materias
    });
    return {
        success: "Profesor creado correctamente"
    }
}

// Buscar profesores con diferentes filtros y criterios
// Ejemplos de uso:
// buscarProfesor({ codigo: "P001" })
// buscarProfesor({ nombre: /María/i, especialidades: ["Matemáticas"] })
// buscarProfesor({ materias: ["MAT101"] })
function buscarProfesor(filtros) {
    // Parámetros: objeto de filtros (codigo, documento, nombre, email, especialidades, materias)
    const query = {};
    if (filtros.codigo) {
        query.codigo = filtros.codigo;
    }
    if (filtros.documento) {
        query.documento = filtros.documento;
    }
    if (filtros.nombre) {
        query.nombre = filtros.nombre;
    }
    if (filtros.email) {
        query.email = filtros.email;
    }
    if (filtros.especialidades) {
        query.especialidades = { $in: filtros.especialidades };
    }
    if (filtros.materias) {
        query.materias = { $in: filtros.materias };
    }
    return db.profesores.find(query).toArray();
}

// Actualizar profesor
function actualizarProfesor(documento, datos) {
    // Actualiza campos del profesor por 'documento'
    const profesor = db.profesores.findOne({ documento });
    if (!profesor) {
        return {
            error: "Profesor no encontrado"
        }
    }
    db.profesores.updateOne({ documento }, { $set: datos });
    return {
        success: "Profesor actualizado correctamente"
    }
}

// Eliminar profesor
function eliminarProfesor(documento) {
    // No permite eliminar si tiene materias asignadas
    const profesor = db.profesores.findOne({ documento });
    if (!profesor) {
        return {
            error: "Profesor no encontrado"
        }
    }
    // Validar si tiene materias asignadas
    const materiaAsignada = db.materias.findOne({
        profesor: profesor.codigo
    });
    if (materiaAsignada) {
        return {
            error: "No se puede eliminar: el profesor tiene materias asignadas"
        }
    }
    db.profesores.deleteOne({ codigo });
    return {
        success: "Profesor eliminado correctamente"
    }
}

// CRUD para la colección materias

// Crear materia
function crearMateria(codigo, nombre, información, profesor, creditos, prerrequisitos) {
    // Crea una materia si no existe el código
    const materia = db.materias.findOne({ codigo });
    if (materia) {
        return {
            error: "Materia ya existe"
        }
    }
    db.materias.insertOne({
        codigo,
        nombre,
        información,
        profesor,
        creditos,
        prerrequisitos
    });
    return {
        success: "Materia creada correctamente"
    }
}

// Buscar materias con diferentes filtros y criterios
// Ejemplos de uso:
// buscarMateria({ codigo: "MAT101" })
// buscarMateria({ nombre: /Matemáticas/i, creditos: { $gte: 3 } })
// buscarMateria({ profesor: "P001" })
function buscarMateria(filtros) {
    // Parámetros: combinación de filtros de nombre/código/profesor/créditos/prerrequisitos
    const query = {};
    if (filtros.codigo) {
        query.codigo = filtros.codigo;
    }
    if (filtros.nombre) {
        query.nombre = filtros.nombre;
    }
    if (filtros.profesor) {
        query.profesor = filtros.profesor;
    }
    if (filtros.creditos) {
        query.creditos = filtros.creditos;
    }
    if (filtros.prerrequisitos) {
        query.prerrequisitos = { $in: filtros.prerrequisitos };
    }
    return db.materias.find(query).toArray();
}

// Actualizar materia
function actualizarMateria(codigo, datos) {
    // Actualiza una materia por 'codigo'
    const materia = db.materias.findOne({ codigo });
    if (!materia) {
        return {
            error: "Materia no encontrada"
        }
    }
    db.materias.updateOne({ codigo }, { $set: datos });
    return {
        success: "Materia actualizada correctamente"
    }
}

// Eliminar materia
function eliminarMateria(codigo) {
    // No permite eliminar si hay inscripciones activas/aprobadas o si es prerrequisito de otras
    const materia = db.materias.findOne({ codigo });
    if (!materia) {
        return {
            error: "Materia no encontrada"
        }
    }
    // Validar si tiene inscripciones activas
    const inscripcionActiva = db.inscripciones.findOne({
        materia: materia.codigo,
        estado: { $in: ["activa", "aprobada"] }
    });
    if (inscripcionActiva) {
        return {
            error: "No se puede eliminar: la materia tiene inscripciones activas o aprobadas"
        }
    }
    // Validar si es prerrequisito de otras materias
    const esPrerrequisito = db.materias.findOne({
        prerrequisitos: { $in: [materia.codigo] }
    });
    if (esPrerrequisito) {
        return {
            error: "No se puede eliminar: la materia es prerrequisito de otras materias"
        }
    }
    db.materias.deleteOne({ codigo });
    return {
        success: "Materia eliminada correctamente"
    }
}

// CRUD para la colección programas

// Crear programa
function crearPrograma(codigo, nombre, descripcion, plan_estudio, requisitos) {
    // Crea un programa si no existe el código
    const programa = db.programas.findOne({ codigo });
    if (programa) {
        return {
            error: "Programa ya existe"
        }
    }
    db.programas.insertOne({
        codigo,
        nombre,
        descripcion,
        plan_estudio,
        requisitos
    });
    return {
        success: "Programa creado correctamente"
    }
}

// Buscar programas con diferentes filtros y criterios
// Ejemplos de uso:
// buscarPrograma({ codigo: "ING-SIS" })
// buscarPrograma({ nombre: /Ingeniería/i })
// buscarPrograma({ plan_estudio: { $in: ["MAT101"] } })
function buscarPrograma(filtros) {
    // Parámetros: filtros de código/nombre/descripcion/plan_estudio/requisitos
    const query = {};
    if (filtros.codigo) {
        query.codigo = filtros.codigo;
    }
    if (filtros.nombre) {
        query.nombre = filtros.nombre;
    }
    if (filtros.descripcion) {
        query.descripcion = filtros.descripcion;
    }
    if (filtros.plan_estudio) {
        query.plan_estudio = { $in: filtros.plan_estudio };
    }
    if (filtros.requisitos) {
        query.requisitos = { $in: filtros.requisitos };
    }
    return db.programas.find(query).toArray();
}

// Actualizar programa
function actualizarPrograma(codigo, datos) {
    // Actualiza un programa por 'codigo'
    const programa = db.programas.findOne({ codigo });
    if (!programa) {
        return {
            error: "Programa no encontrado"
        }
    }
    db.programas.updateOne({ codigo }, { $set: datos });
    return {
        success: "Programa actualizado correctamente"
    }
}

// Eliminar programa
function eliminarPrograma(codigo) {
    // No permite eliminar si existen estudiantes asociados al programa
    const programa = db.programas.findOne({ codigo });
    if (!programa) {
        return {
            error: "Programa no encontrado"
        }
    }
    // Validar si tiene estudiantes inscritos
    const estudianteInscrito = db.estudiantes.findOne({
        programa: programa.codigo
    });
    if (estudianteInscrito) {
        return {
            error: "No se puede eliminar: el programa tiene estudiantes inscritos"
        }
    }
    db.programas.deleteOne({ codigo });
    return {
        success: "Programa eliminado correctamente"
    }
}

// CRUD para la colección inscripciones

// Crear inscripción
function crearInscripcion(estudiante, materia, periodo, fecha_inscripcion, estado) {
    // Crea una inscripción si estudiante y materia existen y no está duplicada en el período
    // Identificadores esperados: 'estudiante' y 'materia' por código
    // Validar que el estudiante existe
    const estudianteExiste = db.estudiantes.findOne({ codigo: estudiante });
    if (!estudianteExiste) {
        return {
            error: "Estudiante no encontrado"
        }
    }
    // Validar que la materia existe
    const materiaExiste = db.materias.findOne({ codigo: materia });
    if (!materiaExiste) {
        return {
            error: "Materia no encontrada"
        }
    }
    // Validar que no esté ya inscrito en la misma materia en el mismo período
    const inscripcionExistente = db.inscripciones.findOne({
        estudiante: estudianteExiste.codigo,
        materia: materiaExiste.codigo,
        periodo
    });
    if (inscripcionExistente) {
        return {
            error: "El estudiante ya está inscrito en esta materia en este período"
        }
    }
    db.inscripciones.insertOne({
        estudiante: estudianteExiste.codigo,
        materia: materiaExiste.codigo,
        periodo,
        fecha_inscripcion,
        estado
    });
    return {
        success: "Inscripción creada correctamente"
    }
}

// Buscar inscripciones con diferentes filtros y criterios
// Ejemplos de uso:
// buscarInscripcion({ estudiante: "E001" })
// buscarInscripcion({ materia: "MAT101", estado: "activa" })
// buscarInscripcion({ periodo: "2025-1" })
function buscarInscripcion(filtros) {
    // Parámetros: filtros por estudiante/materia (códigos), periodo, estado, rango de fechas
    const query = {};
    if (filtros.estudiante) {
        const estudiante = db.estudiantes.findOne({ codigo: filtros.estudiante });
        if (estudiante) {
            query.estudiante = estudiante.codigo;
        }
    }
    if (filtros.materia) {
        const materia = db.materias.findOne({ codigo: filtros.materia });
        if (materia) {
            query.materia = materia.codigo;
        }
    }
    if (filtros.periodo) {
        query.periodo = filtros.periodo;
    }
    if (filtros.estado) {
        query.estado = filtros.estado;
    }
    if (filtros.fecha_desde || filtros.fecha_hasta) {
        query.fecha_inscripcion = {};
        if (filtros.fecha_desde) query.fecha_inscripcion.$gte = new Date(filtros.fecha_desde);
        if (filtros.fecha_hasta) query.fecha_inscripcion.$lte = new Date(filtros.fecha_hasta);
    }
    return db.inscripciones.find(query).toArray();
}

// Actualizar inscripción
function actualizarInscripcion(estudiante, materia, periodo, datos) {
    // Actualiza inscripción encontrada por combinación estudiante/materia/período (por códigos)
    const estudianteExiste = db.estudiantes.findOne({ codigo: estudiante });
    const materiaExiste = db.materias.findOne({ codigo: materia });
    if (!estudianteExiste || !materiaExiste) {
        return {
            error: "Estudiante o materia no encontrados"
        }
    }
    const inscripcion = db.inscripciones.findOne({
        estudiante: estudianteExiste.codigo,
        materia: materiaExiste.codigo,
        periodo: periodo
    });
    if (!inscripcion) {
        return {
            error: "Inscripción no encontrada"
        }
    }
    db.inscripciones.updateOne({
        estudiante: estudianteExiste.codigo,
        materia: materiaExiste.codigo,
        periodo,
    }, { $set: datos });
    return {
        success: "Inscripción actualizada correctamente"
    }
}

// Eliminar inscripción
function eliminarInscripcion(estudiante, materia, periodo) {
    // No permite eliminar inscripciones en estado 'aprobada'
    const estudianteExiste = db.estudiantes.findOne({ codigo: estudiante });
    const materiaExiste = db.materias.findOne({ codigo: materia });
    if (!estudianteExiste || !materiaExiste) {
        return {
            error: "Estudiante o materia no encontrados"
        }
    }
    const inscripcion = db.inscripciones.findOne({
        estudiante: estudianteExiste.codigo,
        materia: materiaExiste.codigo,
        periodo
    });
    if (!inscripcion) {
        return {
            error: "Inscripción no encontrada"
        }
    }
    // Validar que no esté en estado "aprobada"
    if (inscripcion.estado === "aprobada") {
        return {
            error: "No se puede eliminar: la inscripción está en estado aprobada"
        }
    }
    db.inscripciones.deleteOne({
        estudiante: estudianteExiste.codigo,
        materia: materiaExiste.codigo,
        periodo
    });
    return {
        success: "Inscripción eliminada correctamente"
    }
}
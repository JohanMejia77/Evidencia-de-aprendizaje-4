// Change Streams para el sistema académico

// 1. Auditoría de cambios en estudiantes
function iniciarAuditoriaEstudiantes() {
    const changeStream = db.estudiantes.watch();
    
    changeStream.on('change', (change) => {
        const auditoria = {
            coleccion: 'estudiantes',
            operacion: change.operationType,
            documento_id: change.documentKey._id,
            timestamp: new Date(),
            datos_anteriores: change.fullDocumentBeforeChange,
            datos_nuevos: change.fullDocument
        };
        
        db.auditoria.insertOne(auditoria);
        print(`Auditoría: ${change.operationType} en estudiante ${change.documentKey._id}`);
    });
    
    return changeStream;
}

// 2. Notificación de riesgo académico
function iniciarNotificacionRiesgo() {
    const changeStream = db.estudiantes.watch([
        { $match: { 'updateDescription.updatedFields.promedio_acumulado': { $exists: true } } }
    ]);
    
    changeStream.on('change', (change) => {
        const nuevoPromedio = change.updateDescription.updatedFields.promedio_acumulado;
        
        if (nuevoPromedio < 3.0) {
            const notificacion = {
                tipo: 'riesgo_academico',
                estudiante_id: change.documentKey._id,
                promedio: nuevoPromedio,
                fecha: new Date(),
                mensaje: `Alerta: Estudiante en riesgo académico (promedio: ${nuevoPromedio})`
            };
            
            db.notificaciones.insertOne(notificacion);
            print(`ALERTA: Estudiante en riesgo - Promedio: ${nuevoPromedio}`);
        }
    });
    
    return changeStream;
}

// 3. Control de cupos por materia
function iniciarControlCupos() {
    const changeStream = db.inscripciones.watch([
        { $match: { operationType: 'insert' } }
    ]);
    
    changeStream.on('change', (change) => {
        const inscripcion = change.fullDocument;
        const materiaId = inscripcion.materia;
        
        // Contar estudiantes activos en la materia
        const cupoActual = db.inscripciones.countDocuments({
            materia: materiaId,
            estado: 'activa'
        });
        
        const cupoMaximo = 30;
        
        if (cupoActual > cupoMaximo) {
            // Revertir la inscripción
            db.inscripciones.deleteOne({ _id: inscripcion._id });
            
            const error = {
                tipo: 'cupo_excedido',
                materia_id: materiaId,
                cupo_actual: cupoActual,
                cupo_maximo: cupoMaximo,
                fecha: new Date()
            };
            
            db.errores_cupos.insertOne(error);
            print(`ERROR: Cupo excedido en materia ${materiaId}`);
        }
    });
    
    return changeStream;
}

// 4. Historial de cambios en calificaciones
function iniciarHistorialCalificaciones() {
    const changeStream = db.inscripciones.watch([
        { $match: { 'updateDescription.updatedFields.nota': { $exists: true } } }
    ]);
    
    changeStream.on('change', (change) => {
        const notaAnterior = change.fullDocumentBeforeChange?.nota;
        const notaNueva = change.updateDescription.updatedFields.nota;
        
        const historial = {
            inscripcion_id: change.documentKey._id,
            estudiante: change.fullDocument.estudiante,
            materia: change.fullDocument.materia,
            nota_anterior: notaAnterior,
            nota_nueva: notaNueva,
            fecha_cambio: new Date(),
            operacion: 'actualizacion_calificacion'
        };
        
        db.historial_calificaciones.insertOne(historial);
        print(`Historial: Calificación cambiada de ${notaAnterior} a ${notaNueva}`);
    });
    
    return changeStream;
}

// Función para iniciar todos los change streams
function iniciarTodosLosStreams() {
    const streams = {
        auditoria: iniciarAuditoriaEstudiantes(),
        riesgo: iniciarNotificacionRiesgo(),
        cupos: iniciarControlCupos(),
        calificaciones: iniciarHistorialCalificaciones(),
    };
    
    print("Todos los Change Streams iniciados correctamente");
    return streams;
}

// Función para detener todos los streams
function detenerTodosLosStreams(streams) {
    Object.values(streams).forEach(stream => {
        if (stream) {
            stream.close();
        }
    });
    print("Todos los Change Streams detenidos");
}
// Transacciones para operaciones críticas del sistema académico
// Objetivo: garantizar consistencia e integridad de datos en procesos sensibles mediante transacciones
// Reglas generales:
// - Se crea una sesión por operación y se inicia una transacción
// - Se valida existencia de entidades y reglas de negocio antes de escribir
// - En cualquier error, se realiza abortTransaction y se retorna el mensaje
// - En éxito, se hace commitTransaction
// Notas:
// - Las referencias entre colecciones usan códigos (strings) según el modelo implementado
// - Estas funciones asumen un clúster/replica set que soporta transacciones

// 1. Inscripción de estudiante en múltiples materias
// Propósito: inscribir atómicamente a un estudiante en varias materias en un período dado
// Parámetros:
// - estudianteCodigo: código del estudiante (string)
// - materiasCodigos: arreglo de códigos de materias (string[])
// - periodo: período académico (string)
// Validaciones:
// - Estudiante existente
// - Todas las materias existen
// - No existe inscripción duplicada (misma materia y período)
// Efectos:
// - Inserta inscripciones con estado "activa" y fecha actual
// Retorno: { success } o { error }
function inscribirEstudianteMultiplesMaterias(estudianteCodigo, materiasCodigos, periodo) {
    const session = db.getMongo().startSession();
    
    try {
        session.startTransaction();
        
        // Validar que el estudiante existe
        const estudiante = db.estudiantes.findOne({ codigo: estudianteCodigo }, { session });
        if (!estudiante) {
            throw new Error("Estudiante no encontrado");
        }
        
        // Validar que todas las materias existen
        const materias = [];
        for (const materiaCodigo of materiasCodigos) {
            const materia = db.materias.findOne({ codigo: materiaCodigo }, { session });
            if (!materia) {
                throw new Error(`Materia ${materiaCodigo} no encontrada`);
            }
            materias.push(materia);
        }
        
        // Validar que no esté ya inscrito en ninguna de las materias
        for (const materia of materias) {
            const inscripcionExistente = db.inscripciones.findOne({
                estudiante: estudianteCodigo,
                materia: materia.codigo,
                periodo: periodo
            }, { session });
            if (inscripcionExistente) {
                throw new Error(`Ya está inscrito en ${materia.nombre} para el período ${periodo}`);
            }
        }
        
        // Crear todas las inscripciones
        for (const materia of materias) {
            const inscripcion = {
                estudiante: estudianteCodigo,
                materia: materia.codigo,
                periodo: periodo,
                fecha_inscripcion: new Date(),
                estado: "activa"
            };
            db.inscripciones.insertOne(inscripcion, { session });
        }
        
        session.commitTransaction();
        return {
            success: "Estudiante inscrito en todas las materias correctamente",
        };
        
    } catch (error) {
        session.abortTransaction();
        return {
            error: error.message
        };
    } finally {
        session.endSession();
    }
}

// 2. Registro de calificaciones y actualización de promedio
// Propósito: registrar notas por materia/período y recalcular el promedio acumulado del estudiante
// Parámetros:
// - estudianteCodigo: código del estudiante (string)
// - calificaciones: arreglo de objetos { materiaCodigo, nota, periodo }
// Validaciones:
// - Estudiante y materia existen
// - Inscripción existente para esa materia/período
// Efectos:
// - Actualiza inscripciones (nota y estado aprobada/reprobada)
// - Recalcula y persiste el promedio_acumulado
// Retorno: { success } o { error }
function registrarCalificaciones(estudianteCodigo, calificaciones) {
    const session = db.getMongo().startSession();
    
    try {
        session.startTransaction();
        
        // Validar que el estudiante existe
        const estudiante = db.estudiantes.findOne({ codigo: estudianteCodigo }, { session });
        if (!estudiante) {
            throw new Error("Estudiante no encontrado");
        }
        
        // Procesar cada calificación
        for (const calificacion of calificaciones) {
            const { materiaCodigo, nota, periodo } = calificacion;
            
            // Validar que la materia existe
            const materia = db.materias.findOne({ codigo: materiaCodigo }, { session });
            if (!materia) {
                throw new Error(`Materia ${materiaCodigo} no encontrada`);
            }
            
            // Validar que la inscripción existe
            const inscripcion = db.inscripciones.findOne({
                estudiante: estudianteCodigo,
                materia: materiaCodigo,
                periodo
            }, { session });
            if (!inscripcion) {
                throw new Error(`No está inscrito en ${materia.nombre} para el período ${periodo}`);
            }
            
            // Actualizar la inscripción con la calificación
            db.inscripciones.updateOne({
                estudiante: estudianteCodigo,
                materia: materiaCodigo,
                periodo
            }, {
                $set: {
                    nota,
                    estado: nota >= 3.0 ? "aprobada" : "reprobada"
                }
            }, { session });
        }
        
        // Recalcular promedio acumulado
        const inscripcionesAprobadas = db.inscripciones.find({
            estudiante: estudianteCodigo,
            estado: "aprobada"
        }, { session }).toArray();
        
        if (inscripcionesAprobadas.length > 0) {
            const sumaNotas = inscripcionesAprobadas.reduce((sum, inscripcion) => sum + inscripcion.nota, 0);
            const nuevoPromedio = sumaNotas / inscripcionesAprobadas.length;
            
            db.estudiantes.updateOne(
                { codigo: estudianteCodigo },
                { $set: { promedio_acumulado: nuevoPromedio } },
                { session }
            );
        }
        
        session.commitTransaction();
        return {
            success: "Calificaciones registradas y promedio actualizado correctamente"
        };
        
    } catch (error) {
        session.abortTransaction();
        return {
            error: error.message
        };
    } finally {
        session.endSession();
    }
}

// 3. Retiro de materia con actualización de créditos
// Propósito: cambiar una inscripción activa a "retirada" y recalcular promedio sin contarla
// Parámetros:
// - estudianteCodigo: código del estudiante (string)
// - materiaCodigo: código de la materia (string)
// - periodo: período académico (string)
// Validaciones:
// - Estudiante y materia existen
// - Inscripción activa existente
// Efectos:
// - Actualiza estado de inscripción a "retirada"
// - Recalcula promedio_acumulado excluyendo retiradas
// Retorno: { success } o { error }
function retirarMateria(estudianteCodigo, materiaCodigo, periodo) {
    const session = db.getMongo().startSession();
    
    try {
        session.startTransaction();
        
        // Validar que el estudiante existe
        const estudiante = db.estudiantes.findOne({ codigo: estudianteCodigo }, { session });
        if (!estudiante) {
            throw new Error("Estudiante no encontrado");
        }
        
        // Validar que la materia existe
        const materia = db.materias.findOne({ codigo: materiaCodigo }, { session });
        if (!materia) {
            throw new Error("Materia no encontrada");
        }
        
        // Validar que la inscripción existe y está activa
        const inscripcion = db.inscripciones.findOne({
            estudiante: estudianteCodigo,
            materia: materiaCodigo,
            periodo: periodo
        }, { session });
        if (!inscripcion) {
            throw new Error("No está inscrito en esta materia");
        }
        if (inscripcion.estado !== "activa") {
            throw new Error("No se puede retirar una materia que no está activa");
        }
        
        // Actualizar el estado de la inscripción a "retirada"
        db.inscripciones.updateOne({
            estudiante: estudianteCodigo,
            materia: materiaCodigo,
            periodo: periodo
        }, {
            $set: {
                estado: "retirada",
            }
        }, { session });
        
        // Recalcular promedio acumulado (excluyendo materias retiradas)
        const inscripcionesAprobadas = db.inscripciones.find({
            estudiante: estudianteCodigo,
            estado: "aprobada"
        }, { session }).toArray();
        
        if (inscripcionesAprobadas.length > 0) {
            const sumaNotas = inscripcionesAprobadas.reduce((sum, inscripcion) => sum + inscripcion.nota, 0);
            const nuevoPromedio = sumaNotas / inscripcionesAprobadas.length;
            
            db.estudiantes.updateOne(
                { codigo: estudianteCodigo },
                { $set: { promedio_acumulado: nuevoPromedio } },
                { session }
            );
        }
        
        session.commitTransaction();
        return {
            success: "Materia retirada correctamente y promedio actualizado"
        };
        
    } catch (error) {
        session.abortTransaction();
        return {
            error: error.message
        };
    } finally {
        session.endSession();
    }
}

// 4. Graduación de estudiante (cambio de estado y actualización de registros)
// Propósito: graduar a un estudiante si cumple plan de estudio y promedio mínimo
// Parámetros:
// - estudianteCodigo: código del estudiante (string)
// Validaciones:
// - Estudiante activo
// - Programa existente y plan_estudio completo aprobado
// - Promedio mínimo 3.0
// Efectos:
// - Actualiza estado a "Graduado"
// - Finaliza inscripciones activas a "finalizada"
// Retorno: { success } o { error }
function graduarEstudiante(estudianteCodigo) {
    const session = db.getMongo().startSession();
    
    try {
        session.startTransaction();
        
        // Validar que el estudiante existe
        const estudiante = db.estudiantes.findOne({ codigo: estudianteCodigo }, { session });
        if (!estudiante) {
            throw new Error("Estudiante no encontrado");
        }
        
        // Validar que el estudiante está activo
        if (estudiante.estado !== "Activo") {
            throw new Error("Solo se pueden graduar estudiantes activos");
        }
        
        // Validar que tiene todas las materias aprobadas del plan de estudio
        const programa = db.programas.findOne({ codigo: estudiante.programa }, { session });
        if (!programa) {
            throw new Error("Programa no encontrado");
        }
        
        const materiasPlan = programa.plan_estudio || [];
        const materiasAprobadas = db.inscripciones.find({
            estudiante: estudianteCodigo,
            estado: "aprobada",
            materia: { $in: materiasPlan }
        }, { session }).toArray();
        
        if (materiasAprobadas.length < materiasPlan.length) {
            throw new Error("El estudiante no ha aprobado todas las materias del plan de estudio");
        }
        
        // Validar promedio mínimo para graduación (3.0)
        if (estudiante.promedio_acumulado < 3.0) {
            throw new Error("El estudiante no cumple con el promedio mínimo para graduación (3.0)");
        }
        
        // Actualizar estado del estudiante a "Graduado"
        db.estudiantes.updateOne(
            { codigo: estudianteCodigo },
            { 
                $set: { 
                    estado: "Graduado",
                }
            },
            { session }
        );
        
        // Cambiar estado de todas las inscripciones activas a "finalizada"
        db.inscripciones.updateMany({
            estudiante: estudianteCodigo,
            estado: "activa"
        }, {
            $set: {
                estado: "finalizada",
            }
        }, { session });
        
        session.commitTransaction();
        return {
            success: "Estudiante graduado correctamente",
        };
        
    } catch (error) {
        session.abortTransaction();
        return {
            error: error.message
        };
    } finally {
        session.endSession();
    }
}

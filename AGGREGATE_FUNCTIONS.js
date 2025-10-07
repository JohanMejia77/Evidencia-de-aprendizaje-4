// Funciones de agregación para análisis académico
// Objetivo: proveer consultas de lectura (reportes) simples y rápidas
// Notas:
// - Las referencias entre colecciones usan códigos (strings) según el modelo
// - Cada función retorna un arreglo (toArray) con los resultados

// 1. Estudiantes en riesgo académico (promedio < 3.0)
// Propósito: obtener estudiantes activos con promedio por debajo de 3.0
// Parámetros: ninguno
// Retorno: [{ codigo, nombre, ... }] estudiantes activos en riesgo
function estudiantesEnRiesgo() {
    return db.estudiantes.find({
        promedio_acumulado: { $lt: 3.0 },
        estado: "Activo"
    }).toArray();
}

// 2. Estadísticas de graduación por programa
// Propósito: calcular totales y promedio de egresados por programa
// Parámetros: ninguno
// Retorno: [{ _id: <programa>, total_graduados, promedio }]
function estadisticasGraduacion() {
    return db.estudiantes.aggregate([
        { $match: { estado: "Graduado" } },
        {
            $group: {
                _id: "$programa",
                total_graduados: { $sum: 1 },
                promedio: { $avg: "$promedio_acumulado" }
            }
        }
    ]).toArray();
}

// 3. Ranking de mejores estudiantes
// Propósito: listar los mejores estudiantes activos por promedio
// Parámetros: limite (number) cantidad máxima de resultados (default 10)
// Retorno: arreglo ordenado desc por promedio_acumulado
function rankingEstudiantes(limite = 10) {
    return db.estudiantes.find({
        estado: "Activo"
    }).sort({ promedio_acumulado: -1 }).limit(limite).toArray();
}

// 4. Análisis de deserción
// Propósito: agrupar estudiantes retirados o inactivos por programa
// Parámetros: ninguno
// Retorno: [{ _id: <programa>, total_deserciones, promedio_desertores }]
function analisisDesercion() {
    return db.estudiantes.aggregate([
        { $match: { estado: { $in: ["Retirado", "Inactivo"] } } },
        {
            $group: {
                _id: "$programa",
                total_deserciones: { $sum: 1 },
                promedio_desertores: { $avg: "$promedio_acumulado" }
            }
        }
    ]).toArray();
}
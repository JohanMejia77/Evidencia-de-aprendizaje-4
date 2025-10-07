// Funciones de agregación para análisis académico
// 1. Estudiantes en riesgo académico (promedio < 3.0)
function estudiantesEnRiesgo() {
    return db.estudiantes.find({
        promedio_acumulado: { $lt: 3.0 },
        estado: "Activo"
    }).toArray();
}
// 2. Estadísticas de graduación por programa
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
function rankingEstudiantes(limite = 10) {
    return db.estudiantes.find({
        estado: "Activo"
    }).sort({ promedio_acumulado: -1 }).limit(limite).toArray();
}
// 4. Análisis de deserción
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
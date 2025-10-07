// Datos de ejemplo del sistema académico
// Propósito: poblar las colecciones con datos realistas, variados y coherentes
// Notas:
// - Las referencias entre colecciones se hacen por códigos (strings) para facilitar lectura y carga
// - Los programas incluyen 'plan_estudio' con códigos de materias
// - Las materias referencian profesores por su código
// - Los estudiantes referencian programas por código y traen documento/estado/fecha_nacimiento
// - Las inscripciones referencian estudiantes y materias por código, con período/estado/fecha

// Insertar programas académicos
// Incluye 20 programas con diversidad de áreas, requisitos y plan de estudio por códigos de materias

db.programas.insertMany([
  { codigo: "ING-SIS", nombre: "Ingeniería de Sistemas", descripcion: "Formación en desarrollo de software y sistemas informáticos.", requisitos: ["Prueba Saber 11", "Entrevista"], plan_estudio: ["MAT101", "PROG101", "MAT201", "PROG201", "MAT301", "PROG301", "PROG401"] },
  { codigo: "ADM-EMP", nombre: "Administración de Empresas", descripcion: "Gestión y dirección de organizaciones empresariales.", requisitos: ["Prueba Saber 11"], plan_estudio: ["ADM101", "ADM201", "ADM301", "MAT101", "MAT401"] },
  { codigo: "DER", nombre: "Derecho", descripcion: "Estudios jurídicos y legales.", requisitos: ["Prueba Saber 11", "Entrevista"], plan_estudio: ["DER101", "DER201", "DER301"] },
  { codigo: "PSI", nombre: "Psicología", descripcion: "Estudios del comportamiento humano.", requisitos: ["Prueba Saber 11"], plan_estudio: ["PSI101", "PSI201", "PSI301"] },
  { codigo: "MED", nombre: "Medicina", descripcion: "Formación en ciencias de la salud.", requisitos: ["Prueba Saber 11", "Entrevista", "Examen médico"], plan_estudio: ["MED101", "MED201", "MED301"] },
  { codigo: "ARQ", nombre: "Arquitectura", descripcion: "Diseño y construcción de espacios arquitectónicos.", requisitos: ["Prueba Saber 11", "Entrevista"], plan_estudio: ["MAT101", "MAT201", "MAT301", "MAT401"] },
  { codigo: "COM", nombre: "Comunicación Social", descripcion: "Estudios en medios y comunicación.", requisitos: ["Prueba Saber 11"], plan_estudio: ["ADM101", "ADM201", "ADM301"] },
  { codigo: "ENF", nombre: "Enfermería", descripcion: "Cuidado y atención en salud.", requisitos: ["Prueba Saber 11", "Entrevista"], plan_estudio: ["MED101", "MED201", "MED301"] },
  { codigo: "CONT", nombre: "Contaduría Pública", descripcion: "Gestión y auditoría financiera.", requisitos: ["Prueba Saber 11"], plan_estudio: ["ADM201", "ADM301", "MAT401"] },
  { codigo: "BIO", nombre: "Biología", descripcion: "Estudio de los seres vivos.", requisitos: ["Prueba Saber 11"], plan_estudio: ["MED101", "MED201", "MAT101"] },
  { codigo: "FIS", nombre: "Física", descripcion: "Estudio de la materia y la energía.", requisitos: ["Prueba Saber 11"], plan_estudio: ["MAT101", "MAT201", "MAT301", "MAT401"] },
  { codigo: "QUI", nombre: "Química", descripcion: "Estudio de la composición de la materia.", requisitos: ["Prueba Saber 11"], plan_estudio: ["MAT101", "MAT201", "MAT301"] },
  { codigo: "FIL", nombre: "Filosofía", descripcion: "Estudio del pensamiento y la razón.", requisitos: ["Prueba Saber 11"], plan_estudio: ["DER101", "DER201"] },
  { codigo: "HIS", nombre: "Historia", descripcion: "Estudio de los hechos históricos.", requisitos: ["Prueba Saber 11"], plan_estudio: ["DER101", "DER201", "DER301"] },
  { codigo: "SOC", nombre: "Sociología", descripcion: "Estudio de la sociedad y sus fenómenos.", requisitos: ["Prueba Saber 11"], plan_estudio: ["PSI101", "PSI201"] },
  { codigo: "LET", nombre: "Letras", descripcion: "Estudios literarios y lingüísticos.", requisitos: ["Prueba Saber 11"], plan_estudio: ["ADM101", "ADM201"] },
  { codigo: "MAT", nombre: "Matemáticas", descripcion: "Estudio de las matemáticas puras.", requisitos: ["Prueba Saber 11"], plan_estudio: ["MAT101", "MAT201", "MAT301", "MAT401"] },
  { codigo: "EST", nombre: "Estadística", descripcion: "Análisis y modelado estadístico.", requisitos: ["Prueba Saber 11"], plan_estudio: ["MAT101", "MAT201", "MAT401"] },
  { codigo: "INF", nombre: "Informática", descripcion: "Estudios en tecnologías de la información.", requisitos: ["Prueba Saber 11"], plan_estudio: ["PROG101", "PROG201", "PROG301", "PROG401"] },
  { codigo: "GEO", nombre: "Geografía", descripcion: "Estudio de la tierra y el espacio geográfico.", requisitos: ["Prueba Saber 11"], plan_estudio: ["MAT101", "MAT401"] }
]);

// Insertar materias
// 20 materias con créditos validados, profesor por código y prerrequisitos como códigos de materias

db.materias.insertMany([
  { codigo: "MAT101", nombre: "Matemáticas Básicas", información: "Fundamentos de matemáticas.", profesor: "P001", creditos: 3, prerrequisitos: [] },
  { codigo: "PROG101", nombre: "Introducción a la Programación", información: "Lógica y fundamentos de programación.", profesor: "P002", creditos: 4, prerrequisitos: [] },
  { codigo: "ADM101", nombre: "Fundamentos de Administración", información: "Principios básicos de administración.", profesor: "P003", creditos: 3, prerrequisitos: [] },
  { codigo: "DER101", nombre: "Introducción al Derecho", información: "Bases del derecho.", profesor: "P004", creditos: 3, prerrequisitos: [] },
  { codigo: "PSI101", nombre: "Psicología General", información: "Conceptos básicos de psicología.", profesor: "P005", creditos: 3, prerrequisitos: [] },
  { codigo: "MED101", nombre: "Biología Humana", información: "Estructura y función del cuerpo humano.", profesor: "P006", creditos: 4, prerrequisitos: [] },
  { codigo: "MAT201", nombre: "Álgebra Lineal", información: "Vectores y matrices.", profesor: "P001", creditos: 3, prerrequisitos: ["MAT101"] },
  { codigo: "PROG201", nombre: "Estructuras de Datos", información: "Listas, pilas, colas, árboles.", profesor: "P002", creditos: 4, prerrequisitos: ["PROG101"] },
  { codigo: "ADM201", nombre: "Contabilidad Básica", información: "Principios de contabilidad.", profesor: "P003", creditos: 3, prerrequisitos: [] },
  { codigo: "DER201", nombre: "Derecho Constitucional", información: "Constitución y derechos fundamentales.", profesor: "P004", creditos: 3, prerrequisitos: ["DER101"] },
  { codigo: "PSI201", nombre: "Psicología del Desarrollo", información: "Desarrollo humano.", profesor: "P005", creditos: 3, prerrequisitos: ["PSI101"] },
  { codigo: "MED201", nombre: "Anatomía", información: "Estructura del cuerpo humano.", profesor: "P006", creditos: 4, prerrequisitos: ["MED101"] },
  { codigo: "MAT301", nombre: "Cálculo Diferencial", información: "Derivadas y aplicaciones.", profesor: "P001", creditos: 4, prerrequisitos: ["MAT101"] },
  { codigo: "PROG301", nombre: "Bases de Datos", información: "Modelado y consultas de datos.", profesor: "P002", creditos: 4, prerrequisitos: ["PROG101"] },
  { codigo: "ADM301", nombre: "Gestión de Talento Humano", información: "Administración de personal.", profesor: "P003", creditos: 3, prerrequisitos: ["ADM101"] },
  { codigo: "DER301", nombre: "Derecho Penal", información: "Delitos y sanciones.", profesor: "P004", creditos: 3, prerrequisitos: ["DER201"] },
  { codigo: "PSI301", nombre: "Psicopatología", información: "Trastornos mentales.", profesor: "P005", creditos: 3, prerrequisitos: ["PSI201"] },
  { codigo: "MED301", nombre: "Fisiología", información: "Funciones del cuerpo humano.", profesor: "P006", creditos: 4, prerrequisitos: ["MED201"] },
  { codigo: "MAT401", nombre: "Estadística", información: "Probabilidad y estadística.", profesor: "P007", creditos: 3, prerrequisitos: ["MAT201"] },
  { codigo: "PROG401", nombre: "Ingeniería de Software", información: "Procesos de desarrollo de software.", profesor: "P008", creditos: 4, prerrequisitos: ["PROG201"] }
]);

// Insertar profesores
// 20 profesores con documento, especialidades y asignación de materias por códigos

db.profesores.insertMany([
  { codigo: "P001", documento: "2001234567", nombre: "María Gómez", email: "mgomez@universidad.edu.co", especialidades: ["Matemáticas"], materias: ["MAT101", "MAT201", "MAT301"] },
  { codigo: "P002", documento: "2002345678", nombre: "Carlos Pérez", email: "cperez@universidad.edu.co", especialidades: ["Programación"], materias: ["PROG101", "PROG201", "PROG301", "PROG401"] },
  { codigo: "P003", documento: "2003456789", nombre: "Ana Torres", email: "atorres@universidad.edu.co", especialidades: ["Administración"], materias: ["ADM101", "ADM201", "ADM301"] },
  { codigo: "P004", documento: "2004567890", nombre: "Luis Martínez", email: "lmartinez@universidad.edu.co", especialidades: ["Derecho"], materias: ["DER101", "DER201", "DER301"] },
  { codigo: "P005", documento: "2005678901", nombre: "Sofía Ramírez", email: "sramirez@universidad.edu.co", especialidades: ["Psicología"], materias: ["PSI101", "PSI201", "PSI301"] },
  { codigo: "P006", documento: "2006789012", nombre: "Jorge Herrera", email: "jherrera@universidad.edu.co", especialidades: ["Medicina"], materias: ["MED101", "MED201", "MED301"] },
  { codigo: "P007", documento: "2007890123", nombre: "Paula Díaz", email: "pdiaz@universidad.edu.co", especialidades: ["Estadística"], materias: ["MAT401"] },
  { codigo: "P008", documento: "2008901234", nombre: "Ricardo López", email: "rlopez@universidad.edu.co", especialidades: ["Ingeniería de Software"], materias: ["PROG401"] },
  { codigo: "P009", documento: "2009012345", nombre: "Laura Castro", email: "lcastro@universidad.edu.co", especialidades: ["Contabilidad"], materias: ["ADM201"] },
  { codigo: "P010", documento: "2010123456", nombre: "Miguel Ruiz", email: "mruiz@universidad.edu.co", especialidades: ["Talento Humano"], materias: ["ADM301"] },
  { codigo: "P011", documento: "2011234567", nombre: "Andrea Silva", email: "asilva@universidad.edu.co", especialidades: ["Psicología Clínica"], materias: ["PSI301"] },
  { codigo: "P012", documento: "2012345678", nombre: "Juan Cárdenas", email: "jcardenas@universidad.edu.co", especialidades: ["Derecho Penal"], materias: ["DER301"] },
  { codigo: "P013", documento: "2013456789", nombre: "Camila Vargas", email: "cvargas@universidad.edu.co", especialidades: ["Biología"], materias: ["MED101"] },
  { codigo: "P014", documento: "2014567890", nombre: "Esteban Ríos", email: "erios@universidad.edu.co", especialidades: ["Fisiología"], materias: ["MED301"] },
  { codigo: "P015", documento: "2015678901", nombre: "Valentina Mora", email: "vmora@universidad.edu.co", especialidades: ["Desarrollo Humano"], materias: ["PSI201"] },
  { codigo: "P016", documento: "2016789012", nombre: "David Romero", email: "dromero@universidad.edu.co", especialidades: ["Penal"], materias: ["DER301"] },
  { codigo: "P017", documento: "2017890123", nombre: "Natalia Peña", email: "npena@universidad.edu.co", especialidades: ["Psicopatología"], materias: ["PSI301"] },
  { codigo: "P018", documento: "2018901234", nombre: "Sebastián Gil", email: "sgil@universidad.edu.co", especialidades: ["Álgebra"], materias: ["MAT201"] },
  { codigo: "P019", documento: "2019012345", nombre: "Juliana Acosta", email: "jacosta@universidad.edu.co", especialidades: ["Bases de Datos"], materias: ["PROG301"] },
  { codigo: "P020", documento: "2020123456", nombre: "Tomás Salazar", email: "tsalazar@universidad.edu.co", especialidades: ["Cálculo"], materias: ["MAT301"] }
]);

// Insertar estudiantes
// 20 estudiantes con documentos únicos, estados variados y fechas de nacimiento realistas

db.estudiantes.insertMany([
  { codigo: "E001", documento: "1002345678", nombre: "Juan Pérez", email: "jperez@universidad.edu.co", programa: "ING-SIS", semestre_actual: 1, promedio_acumulado: 4.2, estado: "Activo", fecha_nacimiento: new Date("2005-03-15") },
  { codigo: "E002", documento: "1003456789", nombre: "Laura Gómez", email: "lgomez@universidad.edu.co", programa: "ADM-EMP", semestre_actual: 2, promedio_acumulado: 3.8, estado: "Activo", fecha_nacimiento: new Date("2004-07-22") },
  { codigo: "E003", documento: "1004567890", nombre: "Carlos Ruiz", email: "cruiz@universidad.edu.co", programa: "DER", semestre_actual: 3, promedio_acumulado: 3.5, estado: "Inactivo", fecha_nacimiento: new Date("2003-11-10") },
  { codigo: "E004", documento: "1005678901", nombre: "Ana Torres", email: "atorres2@universidad.edu.co", programa: "PSI", semestre_actual: 4, promedio_acumulado: 4.1, estado: "Activo", fecha_nacimiento: new Date("2002-01-05") },
  { codigo: "E005", documento: "1006789012", nombre: "Sofía Ramírez", email: "sramirez2@universidad.edu.co", programa: "MED", semestre_actual: 5, promedio_acumulado: 4.5, estado: "Activo", fecha_nacimiento: new Date("2001-09-30") },
  { codigo: "E006", documento: "1007890123", nombre: "Miguel Herrera", email: "mherrera@universidad.edu.co", programa: "ING-SIS", semestre_actual: 6, promedio_acumulado: 2.9, estado: "Retirado", fecha_nacimiento: new Date("2000-12-12") },
  { codigo: "E007", documento: "1008901234", nombre: "Valentina Díaz", email: "vdiaz@universidad.edu.co", programa: "ADM-EMP", semestre_actual: 7, promedio_acumulado: 3.2, estado: "Activo", fecha_nacimiento: new Date("2002-06-18") },
  { codigo: "E008", documento: "1009012345", nombre: "David Romero", email: "dromero2@universidad.edu.co", programa: "DER", semestre_actual: 8, promedio_acumulado: 2.5, estado: "Retirado", fecha_nacimiento: new Date("2001-02-27") },
  { codigo: "E009", documento: "1010123456", nombre: "Camila Vargas", email: "cvargas2@universidad.edu.co", programa: "PSI", semestre_actual: 9, promedio_acumulado: 4.7, estado: "Activo", fecha_nacimiento: new Date("2000-10-09") },
  { codigo: "E010", documento: "1011234567", nombre: "Sebastián Gil", email: "sgil2@universidad.edu.co", programa: "MED", semestre_actual: 10, promedio_acumulado: 3.9, estado: "Graduado", fecha_nacimiento: new Date("1999-05-14") },
  { codigo: "E011", documento: "1012345678", nombre: "Juliana Acosta", email: "jacosta2@universidad.edu.co", programa: "ING-SIS", semestre_actual: 11, promedio_acumulado: 4.1, estado: "Graduado", fecha_nacimiento: new Date("1998-08-21") },
  { codigo: "E012", documento: "1013456789", nombre: "Tomás Salazar", email: "tsalazar2@universidad.edu.co", programa: "ADM-EMP", semestre_actual: 12, promedio_acumulado: 2.7, estado: "Inactivo", fecha_nacimiento: new Date("1997-04-03") },
  { codigo: "E013", documento: "1014567890", nombre: "María Gómez", email: "mgomez2@universidad.edu.co", programa: "DER", semestre_actual: 1, promedio_acumulado: 3.6, estado: "Activo", fecha_nacimiento: new Date("2005-12-11") },
  { codigo: "E014", documento: "1015678901", nombre: "Carlos Pérez", email: "cperez2@universidad.edu.co", programa: "PSI", semestre_actual: 2, promedio_acumulado: 4.3, estado: "Activo", fecha_nacimiento: new Date("2004-02-28") },
  { codigo: "E015", documento: "1016789012", nombre: "Andrea Silva", email: "asilva2@universidad.edu.co", programa: "MED", semestre_actual: 3, promedio_acumulado: 3.4, estado: "Activo", fecha_nacimiento: new Date("2003-06-06") },
  { codigo: "E016", documento: "1017890123", nombre: "Juan Cárdenas", email: "jcardenas2@universidad.edu.co", programa: "ING-SIS", semestre_actual: 4, promedio_acumulado: 4.2, estado: "Activo", fecha_nacimiento: new Date("2002-09-19") },
  { codigo: "E017", documento: "1018901234", nombre: "Camila Vargas", email: "cvargas3@universidad.edu.co", programa: "ADM-EMP", semestre_actual: 5, promedio_acumulado: 3.7, estado: "Activo", fecha_nacimiento: new Date("2001-11-23") },
  { codigo: "E018", documento: "1019012345", nombre: "Esteban Ríos", email: "erios2@universidad.edu.co", programa: "DER", semestre_actual: 6, promedio_acumulado: 2.8, estado: "Retirado", fecha_nacimiento: new Date("2000-03-17") },
  { codigo: "E019", documento: "1020123456", nombre: "Valentina Mora", email: "vmora2@universidad.edu.co", programa: "PSI", semestre_actual: 7, promedio_acumulado: 4.6, estado: "Activo", fecha_nacimiento: new Date("2002-05-25") },
  { codigo: "E020", documento: "1021234567", nombre: "David Romero", email: "dromero3@universidad.edu.co", programa: "MED", semestre_actual: 8, promedio_acumulado: 3.3, estado: "Graduado", fecha_nacimiento: new Date("2001-08-08") }
]);

// Insertar inscripciones
// 40 inscripciones con combinación de estados, periodos y fechas válidas (no futuras)


db.inscripciones.insertMany([
  { estudiante: "E001", materia: "MAT101", periodo: "2025-1", fecha_inscripcion: new Date("2025-01-10"), estado: "aprobada" },
  { estudiante: "E001", materia: "PROG101", periodo: "2025-1", fecha_inscripcion: new Date("2025-01-10"), estado: "aprobada" },
  { estudiante: "E001", materia: "MAT201", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-10"), estado: "activa" },
  { estudiante: "E002", materia: "ADM101", periodo: "2025-1", fecha_inscripcion: new Date("2025-01-11"), estado: "aprobada" },
  { estudiante: "E002", materia: "ADM201", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-11"), estado: "activa" },
  { estudiante: "E003", materia: "DER101", periodo: "2025-1", fecha_inscripcion: new Date("2025-01-12"), estado: "aprobada" },
  { estudiante: "E003", materia: "DER201", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-12"), estado: "retirada" },
  { estudiante: "E004", materia: "PSI101", periodo: "2025-1", fecha_inscripcion: new Date("2025-01-13"), estado: "aprobada" },
  { estudiante: "E004", materia: "PSI201", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-13"), estado: "activa" },
  { estudiante: "E005", materia: "MED101", periodo: "2025-1", fecha_inscripcion: new Date("2025-01-14"), estado: "aprobada" },
  { estudiante: "E005", materia: "MED201", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-14"), estado: "activa" },
  { estudiante: "E006", materia: "MAT101", periodo: "2025-1", fecha_inscripcion: new Date("2025-01-15"), estado: "retirada" },
  { estudiante: "E007", materia: "ADM101", periodo: "2025-1", fecha_inscripcion: new Date("2025-01-16"), estado: "aprobada" },
  { estudiante: "E008", materia: "DER101", periodo: "2025-1", fecha_inscripcion: new Date("2025-01-17"), estado: "aprobada" },
  { estudiante: "E009", materia: "PSI101", periodo: "2025-1", fecha_inscripcion: new Date("2025-01-18"), estado: "aprobada" },
  { estudiante: "E010", materia: "MED101", periodo: "2025-1", fecha_inscripcion: new Date("2025-01-19"), estado: "aprobada" },
  { estudiante: "E011", materia: "MAT201", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-20"), estado: "activa" },
  { estudiante: "E012", materia: "ADM201", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-21"), estado: "activa" },
  { estudiante: "E013", materia: "DER201", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-22"), estado: "activa" },
  { estudiante: "E014", materia: "PSI201", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-23"), estado: "activa" },
  { estudiante: "E015", materia: "MED201", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-24"), estado: "activa" },
  { estudiante: "E016", materia: "MAT301", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-25"), estado: "activa" },
  { estudiante: "E017", materia: "ADM301", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-26"), estado: "activa" },
  { estudiante: "E018", materia: "DER301", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-27"), estado: "activa" },
  { estudiante: "E019", materia: "PSI301", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-28"), estado: "activa" },
  { estudiante: "E020", materia: "MED301", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-29"), estado: "activa" },
  // Casos especiales: materias perdidas, inscripciones retiradas, etc.
  { estudiante: "E006", materia: "MAT201", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-30"), estado: "retirada" },
  { estudiante: "E008", materia: "DER201", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-31"), estado: "retirada" },
  { estudiante: "E012", materia: "ADM201", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-30"), estado: "retirada" },
  { estudiante: "E018", materia: "DER301", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-31"), estado: "retirada" },
  { estudiante: "E001", materia: "PROG201", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-10"), estado: "activa" },
  { estudiante: "E002", materia: "ADM301", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-11"), estado: "activa" },
  { estudiante: "E003", materia: "DER301", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-12"), estado: "activa" },
  { estudiante: "E004", materia: "PSI301", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-13"), estado: "activa" },
  { estudiante: "E005", materia: "MED301", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-14"), estado: "activa" },
  { estudiante: "E006", materia: "MAT301", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-15"), estado: "activa" },
  { estudiante: "E007", materia: "ADM301", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-16"), estado: "activa" },
  { estudiante: "E008", materia: "DER301", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-17"), estado: "activa" },
  { estudiante: "E009", materia: "PSI301", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-18"), estado: "activa" },
  { estudiante: "E010", materia: "MED301", periodo: "2025-2", fecha_inscripcion: new Date("2025-07-19"), estado: "activa" }
]);

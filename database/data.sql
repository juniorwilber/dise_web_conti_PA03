USE continental_PA03;
GO

-- Insertar estudiantes de prueba
IF NOT EXISTS (SELECT * FROM estudiantes WHERE codigo = 'UC2021001')
BEGIN
    INSERT INTO estudiantes (codigo, nombres, apellidos, correo, carrera) VALUES
    ('UC2021001', 'Carlos Alberto', 'Ramirez Torres', 'carlos.ramirez@continental.edu.pe', 'Ingenieria de Sistemas'),
    ('UC2021002', 'Maria Fernanda', 'Lopez Gutierrez', 'maria.lopez@continental.edu.pe', 'Administracion de Empresas'),
    ('UC2021003', 'Juan Pablo', 'Mendoza Vega', 'juan.mendoza@continental.edu.pe', 'Contabilidad'),
    ('UC2021004', 'Ana Sofia', 'Castillo Flores', 'ana.castillo@continental.edu.pe', 'Psicologia'),
    ('UC2021005', 'Luis Miguel', 'Herrera Sanchez', 'luis.herrera@continental.edu.pe', 'Ingenieria Civil');
END
GO

-- Insertar cursos de prueba
IF NOT EXISTS (SELECT * FROM cursos WHERE codigo = 'IS101')
BEGIN
    INSERT INTO cursos (codigo, nombre, carrera, creditos, docente) VALUES
    ('IS101', 'Programacion Orientada a Objetos', 'Ingeniería de Sistemas e Informática', 4, 'Dr. Roberto Figueroa'),
    ('IS102', 'Base de Datos Avanzado', 'Ingeniería de Sistemas e Informática', 4, 'Mg. Patricia Salas'),
    ('IS103', 'Arquitectura de Software', 'Ingeniería de Sistemas e Informática', 3, 'Dr. Fernando Cruz'),
    ('IS104', 'Desarrollo Web Full Stack', 'Ingeniería de Sistemas e Informática', 4, 'Mg. Carmen Quispe'),
    ('IS105', 'Seguridad Informatica', 'Ingeniería de Sistemas e Informática', 3, 'Dr. Marco Valdivia');
END
GO

PRINT 'Datos de prueba insertados exitosamente';
GO

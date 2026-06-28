-- Crear base de datos
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'continental_PA03')
BEGIN
    CREATE DATABASE continental_PA03;
END
GO

USE continental_PA03;
GO

-- Crear tabla estudiantes
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'estudiantes')
BEGIN
    CREATE TABLE estudiantes (
        id INT IDENTITY(1,1) PRIMARY KEY,
        codigo VARCHAR(20) NOT NULL UNIQUE,
        nombres VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        correo VARCHAR(150) NOT NULL UNIQUE,
        carrera VARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- Crear tabla cursos
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'cursos')
BEGIN
    CREATE TABLE cursos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        codigo VARCHAR(20) NOT NULL UNIQUE,
        nombre VARCHAR(150) NOT NULL,
        carrera VARCHAR(100) NOT NULL DEFAULT 'Sin asignar',
        creditos INT NOT NULL,
        docente VARCHAR(150) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );
END
GO

PRINT 'Schema creado exitosamente en continental_PA03';
GO

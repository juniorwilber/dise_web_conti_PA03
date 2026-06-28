const { getConnection, sql } = require('../config/db');

const getAllEstudiantes = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .query('SELECT * FROM estudiantes ORDER BY id DESC');
    return result.recordset;
};

const getEstudianteById = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM estudiantes WHERE id = @id');
    return result.recordset[0];
};

const createEstudiante = async ({ codigo, nombres, apellidos, correo, carrera }) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('codigo', sql.VarChar(20), codigo)
        .input('nombres', sql.VarChar(100), nombres)
        .input('apellidos', sql.VarChar(100), apellidos)
        .input('correo', sql.VarChar(150), correo)
        .input('carrera', sql.VarChar(100), carrera)
        .query(`INSERT INTO estudiantes (codigo, nombres, apellidos, correo, carrera)
                OUTPUT INSERTED.*
                VALUES (@codigo, @nombres, @apellidos, @correo, @carrera)`);
    return result.recordset[0];
};

const updateEstudiante = async (id, { codigo, nombres, apellidos, correo, carrera }) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('codigo', sql.VarChar(20), codigo)
        .input('nombres', sql.VarChar(100), nombres)
        .input('apellidos', sql.VarChar(100), apellidos)
        .input('correo', sql.VarChar(150), correo)
        .input('carrera', sql.VarChar(100), carrera)
        .query(`UPDATE estudiantes
                SET codigo = @codigo, nombres = @nombres, apellidos = @apellidos,
                    correo = @correo, carrera = @carrera, updated_at = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id`);
    return result.recordset[0];
};

const deleteEstudiante = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM estudiantes OUTPUT DELETED.* WHERE id = @id');
    return result.recordset[0];
};

module.exports = {
    getAllEstudiantes,
    getEstudianteById,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante
};

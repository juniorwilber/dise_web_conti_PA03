const { getConnection, sql } = require('../config/db');

const getAllCursos = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .query('SELECT * FROM cursos ORDER BY id DESC');
    return result.recordset;
};

const getCursoById = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM cursos WHERE id = @id');
    return result.recordset[0];
};

const createCurso = async ({ codigo, nombre, carrera, creditos, docente }) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('codigo',   sql.VarChar(20),  codigo)
        .input('nombre',   sql.VarChar(150), nombre)
        .input('carrera',  sql.VarChar(100), carrera)
        .input('creditos', sql.Int,          creditos)
        .input('docente',  sql.VarChar(150), docente)
        .query(`INSERT INTO cursos (codigo, nombre, carrera, creditos, docente)
                OUTPUT INSERTED.*
                VALUES (@codigo, @nombre, @carrera, @creditos, @docente)`);
    return result.recordset[0];
};

const updateCurso = async (id, { codigo, nombre, carrera, creditos, docente }) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id',       sql.Int,          id)
        .input('codigo',   sql.VarChar(20),  codigo)
        .input('nombre',   sql.VarChar(150), nombre)
        .input('carrera',  sql.VarChar(100), carrera)
        .input('creditos', sql.Int,          creditos)
        .input('docente',  sql.VarChar(150), docente)
        .query(`UPDATE cursos
                SET codigo = @codigo, nombre = @nombre, carrera = @carrera,
                    creditos = @creditos, docente = @docente, updated_at = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id`);
    return result.recordset[0];
};

const deleteCurso = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM cursos OUTPUT DELETED.* WHERE id = @id');
    return result.recordset[0];
};

module.exports = { getAllCursos, getCursoById, createCurso, updateCurso, deleteCurso };

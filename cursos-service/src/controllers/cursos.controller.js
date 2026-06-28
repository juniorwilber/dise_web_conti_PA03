const model = require('../models/cursos.model');

const getAll = async (req, res) => {
    try {
        const cursos = await model.getAllCursos();
        res.json({ success: true, data: cursos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener cursos', error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const curso = await model.getCursoById(req.params.id);
        if (!curso) return res.status(404).json({ success: false, message: 'Curso no encontrado' });
        res.json({ success: true, data: curso });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener curso', error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { codigo, nombre, carrera, creditos, docente } = req.body;
        if (!codigo || !nombre || !carrera || !creditos || !docente) {
            return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
        }
        const curso = await model.createCurso({ codigo, nombre, carrera, creditos: parseInt(creditos), docente });
        res.status(201).json({ success: true, data: curso, message: 'Curso creado exitosamente' });
    } catch (error) {
        if (error.message && error.message.includes('UNIQUE')) {
            return res.status(409).json({ success: false, message: 'El codigo del curso ya existe' });
        }
        res.status(500).json({ success: false, message: 'Error al crear curso', error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { codigo, nombre, carrera, creditos, docente } = req.body;
        if (!codigo || !nombre || !carrera || !creditos || !docente) {
            return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
        }
        const curso = await model.updateCurso(req.params.id, { codigo, nombre, carrera, creditos: parseInt(creditos), docente });
        if (!curso) return res.status(404).json({ success: false, message: 'Curso no encontrado' });
        res.json({ success: true, data: curso, message: 'Curso actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar curso', error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const curso = await model.deleteCurso(req.params.id);
        if (!curso) return res.status(404).json({ success: false, message: 'Curso no encontrado' });
        res.json({ success: true, message: 'Curso eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar curso', error: error.message });
    }
};

module.exports = { getAll, getById, create, update, remove };

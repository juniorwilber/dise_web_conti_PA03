const model = require('../models/estudiantes.model');

const getAll = async (req, res) => {
    try {
        const estudiantes = await model.getAllEstudiantes();
        res.json({ success: true, data: estudiantes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener estudiantes', error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const estudiante = await model.getEstudianteById(req.params.id);
        if (!estudiante) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
        res.json({ success: true, data: estudiante });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener estudiante', error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { codigo, nombres, apellidos, correo, carrera } = req.body;
        if (!codigo || !nombres || !apellidos || !correo || !carrera) {
            return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
        }
        const estudiante = await model.createEstudiante({ codigo, nombres, apellidos, correo, carrera });
        res.status(201).json({ success: true, data: estudiante, message: 'Estudiante creado exitosamente' });
    } catch (error) {
        if (error.message && error.message.includes('UNIQUE')) {
            return res.status(409).json({ success: false, message: 'El codigo o correo ya existe' });
        }
        res.status(500).json({ success: false, message: 'Error al crear estudiante', error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { codigo, nombres, apellidos, correo, carrera } = req.body;
        if (!codigo || !nombres || !apellidos || !correo || !carrera) {
            return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
        }
        const estudiante = await model.updateEstudiante(req.params.id, { codigo, nombres, apellidos, correo, carrera });
        if (!estudiante) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
        res.json({ success: true, data: estudiante, message: 'Estudiante actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar estudiante', error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const estudiante = await model.deleteEstudiante(req.params.id);
        if (!estudiante) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
        res.json({ success: true, message: 'Estudiante eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar estudiante', error: error.message });
    }
};

module.exports = { getAll, getById, create, update, remove };

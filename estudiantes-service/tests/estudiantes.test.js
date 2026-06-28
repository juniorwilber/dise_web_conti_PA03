const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/models/estudiantes.model', () => ({
    getAllEstudiantes: jest.fn(),
    getEstudianteById: jest.fn(),
    createEstudiante: jest.fn(),
    updateEstudiante: jest.fn(),
    deleteEstudiante: jest.fn()
}));

const model = require('../src/models/estudiantes.model');

const mockEstudiante = {
    id: 1,
    codigo: 'UC2021001',
    nombres: 'Carlos Alberto',
    apellidos: 'Ramirez Torres',
    correo: 'carlos@test.com',
    carrera: 'Ingenieria de Sistemas'
};

describe('GET /api/estudiantes', () => {
    it('debe retornar lista de estudiantes', async () => {
        model.getAllEstudiantes.mockResolvedValue([mockEstudiante]);
        const res = await request(app).get('/api/estudiantes');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});

describe('GET /api/estudiantes/:id', () => {
    it('debe retornar un estudiante por id', async () => {
        model.getEstudianteById.mockResolvedValue(mockEstudiante);
        const res = await request(app).get('/api/estudiantes/1');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(1);
    });

    it('debe retornar 404 si no existe el estudiante', async () => {
        model.getEstudianteById.mockResolvedValue(null);
        const res = await request(app).get('/api/estudiantes/999');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

describe('POST /api/estudiantes', () => {
    it('debe crear un estudiante', async () => {
        model.createEstudiante.mockResolvedValue(mockEstudiante);
        const res = await request(app).post('/api/estudiantes').send(mockEstudiante);
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });

    it('debe retornar 400 si faltan campos obligatorios', async () => {
        const res = await request(app).post('/api/estudiantes').send({ codigo: 'UC001' });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('debe retornar 400 si el body esta vacio', async () => {
        const res = await request(app).post('/api/estudiantes').send({});
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

describe('PUT /api/estudiantes/:id', () => {
    it('debe actualizar un estudiante', async () => {
        model.updateEstudiante.mockResolvedValue(mockEstudiante);
        const res = await request(app).put('/api/estudiantes/1').send(mockEstudiante);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('debe retornar 404 si el estudiante no existe', async () => {
        model.updateEstudiante.mockResolvedValue(null);
        const res = await request(app).put('/api/estudiantes/999').send(mockEstudiante);
        expect(res.status).toBe(404);
    });
});

describe('DELETE /api/estudiantes/:id', () => {
    it('debe eliminar un estudiante', async () => {
        model.deleteEstudiante.mockResolvedValue(mockEstudiante);
        const res = await request(app).delete('/api/estudiantes/1');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('debe retornar 404 si el estudiante no existe', async () => {
        model.deleteEstudiante.mockResolvedValue(null);
        const res = await request(app).delete('/api/estudiantes/999');
        expect(res.status).toBe(404);
    });
});

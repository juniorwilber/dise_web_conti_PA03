const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/models/cursos.model', () => ({
    getAllCursos: jest.fn(),
    getCursoById: jest.fn(),
    createCurso: jest.fn(),
    updateCurso: jest.fn(),
    deleteCurso: jest.fn()
}));

const model = require('../src/models/cursos.model');

const mockCurso = {
    id: 1,
    codigo: 'IS101',
    nombre: 'Programacion Orientada a Objetos',
    creditos: 4,
    docente: 'Dr. Roberto Figueroa'
};

describe('GET /api/cursos', () => {
    it('debe retornar lista de cursos', async () => {
        model.getAllCursos.mockResolvedValue([mockCurso]);
        const res = await request(app).get('/api/cursos');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});

describe('GET /api/cursos/:id', () => {
    it('debe retornar un curso por id', async () => {
        model.getCursoById.mockResolvedValue(mockCurso);
        const res = await request(app).get('/api/cursos/1');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(1);
    });

    it('debe retornar 404 si no existe el curso', async () => {
        model.getCursoById.mockResolvedValue(null);
        const res = await request(app).get('/api/cursos/999');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

describe('POST /api/cursos', () => {
    it('debe crear un curso', async () => {
        model.createCurso.mockResolvedValue(mockCurso);
        const res = await request(app).post('/api/cursos').send(mockCurso);
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });

    it('debe retornar 400 si faltan campos obligatorios', async () => {
        const res = await request(app).post('/api/cursos').send({ codigo: 'IS001' });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('debe retornar 400 si el body esta vacio', async () => {
        const res = await request(app).post('/api/cursos').send({});
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

describe('PUT /api/cursos/:id', () => {
    it('debe actualizar un curso', async () => {
        model.updateCurso.mockResolvedValue(mockCurso);
        const res = await request(app).put('/api/cursos/1').send(mockCurso);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('debe retornar 404 si el curso no existe', async () => {
        model.updateCurso.mockResolvedValue(null);
        const res = await request(app).put('/api/cursos/999').send(mockCurso);
        expect(res.status).toBe(404);
    });
});

describe('DELETE /api/cursos/:id', () => {
    it('debe eliminar un curso', async () => {
        model.deleteCurso.mockResolvedValue(mockCurso);
        const res = await request(app).delete('/api/cursos/1');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('debe retornar 404 si el curso no existe', async () => {
        model.deleteCurso.mockResolvedValue(null);
        const res = await request(app).delete('/api/cursos/999');
        expect(res.status).toBe(404);
    });
});

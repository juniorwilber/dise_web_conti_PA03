require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors());

const ESTUDIANTES_URL = process.env.ESTUDIANTES_SERVICE_URL || 'http://localhost:4001';
const CURSOS_URL = process.env.CURSOS_SERVICE_URL || 'http://localhost:4002';

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'gateway',
        port: process.env.PORT || 4000,
        services: {
            estudiantes: ESTUDIANTES_URL,
            cursos: CURSOS_URL
        }
    });
});

app.use('/api/estudiantes', createProxyMiddleware({
    target: ESTUDIANTES_URL,
    changeOrigin: true,
    on: {
        error: (err, req, res) => {
            res.status(502).json({ success: false, message: 'Estudiantes service no disponible', error: err.message });
        }
    }
}));

app.use('/api/cursos', createProxyMiddleware({
    target: CURSOS_URL,
    changeOrigin: true,
    on: {
        error: (err, req, res) => {
            res.status(502).json({ success: false, message: 'Cursos service no disponible', error: err.message });
        }
    }
}));

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada en el gateway' });
});

module.exports = app;

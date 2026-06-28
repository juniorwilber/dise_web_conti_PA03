const express = require('express');
const cors = require('cors');
require('dotenv').config();

const cursosRoutes = require('./routes/cursos.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'cursos-service', port: process.env.PORT || 4002 });
});

app.use('/api/cursos', cursosRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

module.exports = app;

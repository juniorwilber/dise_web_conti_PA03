require('dotenv').config();
const app = require('./app');
const { getConnection } = require('./config/db');

const PORT = process.env.PORT || 4002;

const startServer = async () => {
    try {
        await getConnection();
        app.listen(PORT, () => {
            console.log(`Cursos Service corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor:', error.message);
        process.exit(1);
    }
};

startServer();

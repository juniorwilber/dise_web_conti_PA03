require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Gateway corriendo en http://localhost:${PORT}`);
    console.log(`  -> /api/estudiantes -> ${process.env.ESTUDIANTES_SERVICE_URL}`);
    console.log(`  -> /api/cursos      -> ${process.env.CURSOS_SERVICE_URL}`);
});

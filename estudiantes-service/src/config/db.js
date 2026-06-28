require('dotenv').config();
const sql = require('mssql/msnodesqlv8');

const server = process.env.DB_SERVER || 'localhost,1433';
const database = process.env.DB_DATABASE || 'continental_PA03';

const makeConfig = (driver) => ({
    connectionString: `Driver={${driver}};Server=${server};Database=${database};Trusted_Connection=yes;TrustServerCertificate=yes;`
});

let pool = null;

const getConnection = async () => {
    if (pool) return pool;
    const drivers = [
        'ODBC Driver 18 for SQL Server',
        'ODBC Driver 17 for SQL Server',
        'SQL Server'
    ];
    let lastErr;
    for (const driver of drivers) {
        try {
            pool = await sql.connect(makeConfig(driver));
            console.log(`Conexion a SQL Server establecida con [${driver}] - Estudiantes Service`);
            return pool;
        } catch (err) {
            lastErr = err;
        }
    }
    throw lastErr;
};

module.exports = { getConnection, sql };

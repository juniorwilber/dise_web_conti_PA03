# Sistema de Gestión Académica — PA03
**Universidad Continental | Diseño Web**

Proyecto académico basado en arquitectura de microservicios con Node.js, Express y SQL Server.

---

## Estructura del proyecto

```
dise_web_conti_P03/
├── database/               # Scripts SQL (schema y datos iniciales)
│   ├── schema.sql
│   └── data.sql
├── estudiantes-service/    # Microservicio de estudiantes (puerto 4001)
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   └── package.json
├── cursos-service/         # Microservicio de cursos (puerto 4002)
│   ├── src/
│   └── package.json
├── gateway/                # API Gateway — punto de entrada (puerto 4000)
│   ├── src/
│   └── package.json
└── frontend/               # Interfaz de usuario (Bootstrap 5)
    ├── index.html
    ├── css/styles.css
    └── js/app.js
```

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js + Express |
| Base de datos | SQL Server Express (autenticación Windows) |
| Driver DB | mssql + msnodesqlv8 |
| Gateway | http-proxy-middleware |
| Frontend | HTML5 + Bootstrap 5 (CDN) |
| Pruebas | Jest + Supertest |

---

## Requisitos previos

- Node.js v18 o superior
- SQL Server Express (`localhost\SQLEXPRESS`)
- Autenticación Windows habilitada en SQL Server
- ODBC Driver 17 o 18 para SQL Server

---

## Instalación y ejecución

### 1. Crear la base de datos

Ejecutar en SQL Server (con sqlcmd o SSMS):

```bash
sqlcmd -S localhost\SQLEXPRESS -E -C -i database/schema.sql
sqlcmd -S localhost\SQLEXPRESS -E -C -i database/data.sql
```

### 2. Instalar dependencias de cada servicio

```bash
cd estudiantes-service && npm install
cd ../cursos-service   && npm install
cd ../gateway          && npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en cada servicio:

**estudiantes-service/.env**
```
PORT=4001
DB_SERVER=localhost,1433
DB_DATABASE=continental_PA03
```

**cursos-service/.env**
```
PORT=4002
DB_SERVER=localhost,1433
DB_DATABASE=continental_PA03
```

**gateway/.env**
```
PORT=4000
ESTUDIANTES_SERVICE_URL=http://localhost:4001
CURSOS_SERVICE_URL=http://localhost:4002
```

### 4. Iniciar los servicios

Abrir una terminal por cada servicio:

```bash
# Terminal 1
cd estudiantes-service && node src/server.js

# Terminal 2
cd cursos-service && node src/server.js

# Terminal 3
cd gateway && node src/server.js
```

### 5. Abrir el frontend

Abrir el archivo `frontend/index.html` directamente en el navegador.

---

## Endpoints de la API (a través del Gateway en puerto 4000)

### Estudiantes
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/estudiantes` | Listar todos |
| GET | `/api/estudiantes/:id` | Obtener uno |
| POST | `/api/estudiantes` | Crear |
| PUT | `/api/estudiantes/:id` | Actualizar |
| DELETE | `/api/estudiantes/:id` | Eliminar |

### Cursos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/cursos` | Listar todos |
| GET | `/api/cursos/:id` | Obtener uno |
| POST | `/api/cursos` | Crear |
| PUT | `/api/cursos/:id` | Actualizar |
| DELETE | `/api/cursos/:id` | Eliminar |

---

## Pruebas unitarias

```bash
cd estudiantes-service && npm test
cd cursos-service      && npm test
```

---

## Autor
Proyecto PA03 — Universidad Continental

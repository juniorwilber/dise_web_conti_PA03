const API_BASE = 'http://localhost:4000';
let deleteCallback = null;
let modalEliminar = null;

document.addEventListener('DOMContentLoaded', () => {
    modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminar'));
    document.getElementById('btnConfirmarEliminar').addEventListener('click', () => {
        if (deleteCallback) deleteCallback();
        modalEliminar.hide();
    });
    showSection('inicio');
    checkServicesStatus();
});

// ===== NAVEGACIÓN =====
function showSection(name) {
    ['inicio', 'estudiantes', 'cursos'].forEach(s => {
        document.getElementById('section' + capitalize(s)).classList.add('d-none');
    });
    document.getElementById('section' + capitalize(name)).classList.remove('d-none');
    document.querySelectorAll('.navbar-nav .nav-link').forEach(l => l.classList.remove('active'));
    if (name === 'estudiantes') loadEstudiantes();
    if (name === 'cursos') loadCursos();
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ===== ALERTAS =====
function showAlert(message, type = 'success') {
    const container = document.getElementById('alertContainer');
    const id = 'alert_' + Date.now();
    const icons = { success: 'check-circle-fill', danger: 'x-circle-fill', warning: 'exclamation-triangle-fill', info: 'info-circle-fill' };
    container.innerHTML = `
        <div id="${id}" class="alert alert-${type} alert-dismissible fade show d-flex align-items-center gap-2" role="alert">
            <i class="bi bi-${icons[type] || 'info-circle-fill'}"></i>
            <span>${message}</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
    setTimeout(() => { const el = document.getElementById(id); if (el) el.remove(); }, 4000);
}

// ===== STATUS SERVICIOS =====
async function checkServicesStatus() {
    const checks = [
        { url: `${API_BASE}/api/estudiantes`, id: 'statusEstudiantes', label: 'Servicio activo' },
        { url: `${API_BASE}/api/cursos`,      id: 'statusCursos',      label: 'Servicio activo' }
    ];
    for (const c of checks) {
        try {
            const r = await fetch(c.url, { signal: AbortSignal.timeout(4000) });
            const el = document.getElementById(c.id);
            if (el) {
                if (r.ok) { el.className = 'badge bg-success'; el.textContent = c.label; }
                else      { el.className = 'badge bg-danger';  el.textContent = 'Error ' + r.status; }
            }
        } catch {
            const el = document.getElementById(c.id);
            if (el) { el.className = 'badge bg-danger'; el.textContent = 'Servicio offline'; }
        }
    }
}

// ===== ESTUDIANTES =====
async function loadEstudiantes() {
    const tbody = document.getElementById('tablaEstudiantes');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4"><div class="spinner-border uc-spinner"></div></td></tr>';
    try {
        const res = await fetch(`${API_BASE}/api/estudiantes`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        const data = json.data;
        if (!data.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4"><i class="bi bi-inbox fs-4 d-block"></i>No hay estudiantes registrados</td></tr>';
            return;
        }
        tbody.innerHTML = data.map((e, i) => `
            <tr>
                <td>${i + 1}</td>
                <td><span class="badge uc-badge-primary">${e.codigo}</span></td>
                <td>${e.nombres}</td>
                <td>${e.apellidos}</td>
                <td class="d-none d-md-table-cell">${e.correo}</td>
                <td class="d-none d-lg-table-cell"><span class="badge uc-badge-secondary">${e.carrera}</span></td>
                <td>
                    <button class="btn btn-warning btn-action me-1" onclick="editEstudiante(${e.id})" title="Editar">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button class="btn btn-danger btn-action" onclick="confirmDeleteEstudiante(${e.id}, '${e.nombres} ${e.apellidos}')" title="Eliminar">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            </tr>`).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4"><i class="bi bi-exclamation-triangle me-2"></i>${err.message}</td></tr>`;
    }
}

document.getElementById('formEstudiante').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('estId').value;
    const correoUser = document.getElementById('estCorreoUser').value.trim();
    const body = {
        codigo:    document.getElementById('estCodigo').value.trim(),
        nombres:   document.getElementById('estNombres').value.trim(),
        apellidos: document.getElementById('estApellidos').value.trim(),
        correo:    correoUser + '@continental.edu.pe',
        carrera:   document.getElementById('estCarrera').value
    };
    try {
        const url = id ? `${API_BASE}/api/estudiantes/${id}` : `${API_BASE}/api/estudiantes`;
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        showAlert(json.message || (id ? 'Estudiante actualizado' : 'Estudiante registrado'), 'success');
        cancelEditEstudiante();
        loadEstudiantes();
    } catch (err) {
        showAlert('Error: ' + err.message, 'danger');
    }
});

async function editEstudiante(id) {
    try {
        const res = await fetch(`${API_BASE}/api/estudiantes/${id}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        const e = json.data;
        document.getElementById('estId').value = e.id;
        document.getElementById('estCodigo').value = e.codigo;
        document.getElementById('estNombres').value = e.nombres;
        document.getElementById('estApellidos').value = e.apellidos;
        // Mostrar solo la parte antes del @
        document.getElementById('estCorreoUser').value = e.correo ? e.correo.split('@')[0] : '';
        const estCarreraEl = document.getElementById('estCarrera');
        estCarreraEl.value = e.carrera;
        if (!estCarreraEl.value && e.carrera) {
            const opt = new Option(e.carrera, e.carrera);
            estCarreraEl.add(opt);
            estCarreraEl.value = e.carrera;
        }
        document.getElementById('formEstTitle').textContent = 'Editar Estudiante';
        document.getElementById('btnEstSubmit').innerHTML = '<i class="bi bi-save me-1"></i>Actualizar';
        document.getElementById('btnEstSubmit').className = 'btn uc-btn-warning';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        showAlert('Error al cargar estudiante: ' + err.message, 'danger');
    }
}

function cancelEditEstudiante() {
    document.getElementById('formEstudiante').reset();
    document.getElementById('estId').value = '';
    document.getElementById('formEstTitle').textContent = 'Registrar Estudiante';
    document.getElementById('btnEstSubmit').innerHTML = '<i class="bi bi-save me-1"></i>Guardar';
    document.getElementById('btnEstSubmit').className = 'btn uc-btn-primary';
}

function confirmDeleteEstudiante(id, nombre) {
    document.getElementById('modalEliminarMsg').textContent = `¿Eliminar al estudiante "${nombre}"? Esta acción no se puede deshacer.`;
    deleteCallback = () => deleteEstudiante(id);
    modalEliminar.show();
}

async function deleteEstudiante(id) {
    try {
        const res = await fetch(`${API_BASE}/api/estudiantes/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        showAlert('Estudiante eliminado exitosamente', 'success');
        loadEstudiantes();
    } catch (err) {
        showAlert('Error al eliminar: ' + err.message, 'danger');
    }
}

// ===== CURSOS =====
async function loadCursos() {
    const tbody = document.getElementById('tablaCursos');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4"><div class="spinner-border uc-spinner"></div></td></tr>';
    try {
        const res = await fetch(`${API_BASE}/api/cursos`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        const data = json.data;
        if (!data.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4"><i class="bi bi-inbox fs-4 d-block"></i>No hay cursos registrados</td></tr>';
            return;
        }
        tbody.innerHTML = data.map((c, i) => `
            <tr>
                <td>${i + 1}</td>
                <td><span class="badge uc-badge-secondary">${c.codigo}</span></td>
                <td>${c.nombre}</td>
                <td><span class="badge bg-secondary">${c.creditos} cr.</span></td>
                <td class="d-none d-md-table-cell">${c.docente}</td>
                <td class="d-none d-lg-table-cell"><span class="badge uc-badge-primary">${c.carrera || 'Sin asignar'}</span></td>
                <td>
                    <button class="btn btn-warning btn-action me-1" onclick="editCurso(${c.id})" title="Editar">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button class="btn btn-danger btn-action" onclick="confirmDeleteCurso(${c.id}, '${c.nombre.replace(/'/g, "\\'")}')" title="Eliminar">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            </tr>`).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4"><i class="bi bi-exclamation-triangle me-2"></i>${err.message}</td></tr>`;
    }
}

document.getElementById('formCurso').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('curId').value;
    const body = {
        codigo:   document.getElementById('curCodigo').value.trim(),
        nombre:   document.getElementById('curNombre').value.trim(),
        carrera:  document.getElementById('curCarrera').value,
        creditos: parseInt(document.getElementById('curCreditos').value),
        docente:  document.getElementById('curDocente').value.trim()
    };
    try {
        const url = id ? `${API_BASE}/api/cursos/${id}` : `${API_BASE}/api/cursos`;
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        showAlert(json.message || (id ? 'Curso actualizado' : 'Curso registrado'), 'success');
        cancelEditCurso();
        loadCursos();
    } catch (err) {
        showAlert('Error: ' + err.message, 'danger');
    }
});

async function editCurso(id) {
    try {
        const res = await fetch(`${API_BASE}/api/cursos/${id}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        const c = json.data;
        document.getElementById('curId').value = c.id;
        document.getElementById('curCodigo').value = c.codigo;
        document.getElementById('curNombre').value = c.nombre;
        const curCarreraEl = document.getElementById('curCarrera');
        curCarreraEl.value = c.carrera || '';
        if (!curCarreraEl.value && c.carrera) {
            const opt = new Option(c.carrera, c.carrera);
            curCarreraEl.add(opt);
            curCarreraEl.value = c.carrera;
        }
        document.getElementById('curCreditos').value = c.creditos;
        document.getElementById('curDocente').value = c.docente;
        document.getElementById('formCurTitle').textContent = 'Editar Curso';
        document.getElementById('btnCurSubmit').innerHTML = '<i class="bi bi-save me-1"></i>Actualizar';
        document.getElementById('btnCurSubmit').className = 'btn btn-warning';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        showAlert('Error al cargar curso: ' + err.message, 'danger');
    }
}

function cancelEditCurso() {
    document.getElementById('formCurso').reset();
    document.getElementById('curId').value = '';
    document.getElementById('formCurTitle').textContent = 'Registrar Curso';
    document.getElementById('btnCurSubmit').innerHTML = '<i class="bi bi-save me-1"></i>Guardar';
    document.getElementById('btnCurSubmit').className = 'btn uc-btn-secondary';
}

function confirmDeleteCurso(id, nombre) {
    document.getElementById('modalEliminarMsg').textContent = `¿Eliminar el curso "${nombre}"? Esta acción no se puede deshacer.`;
    deleteCallback = () => deleteCurso(id);
    modalEliminar.show();
}

async function deleteCurso(id) {
    try {
        const res = await fetch(`${API_BASE}/api/cursos/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        showAlert('Curso eliminado exitosamente', 'success');
        loadCursos();
    } catch (err) {
        showAlert('Error al eliminar: ' + err.message, 'danger');
    }
}

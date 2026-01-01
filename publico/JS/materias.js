// publico/JS/materias.js
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const formMateria = document.getElementById('form-materia');
    const btnGuardar = document.getElementById('btn-guardar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnNuevo = document.getElementById('btn-nuevo');
    const btnBuscar = document.getElementById('btn-buscar');
    const inputBusqueda = document.getElementById('input-busqueda');
    const tablaMaterias = document.getElementById('tabla-materias').getElementsByTagName('tbody')[0];
    const modalMateria = document.getElementById('modal-materia');
    
    let materiaEditando = null;
    
    // Inicializar
    cargarMaterias();
    cargarProfesores();
    configurarEventos();
    
    function configurarEventos() {
        // Botón nuevo
        btnNuevo.addEventListener('click', function() {
            materiaEditando = null;
            resetForm();
            mostrarModal();
        });
        
        // Botón guardar
        btnGuardar.addEventListener('click', function(e) {
            e.preventDefault();
            guardarMateria();
        });
        
        // Botón cancelar
        btnCancelar.addEventListener('click', function() {
            cerrarModal();
        });
        
        // Buscar
        btnBuscar.addEventListener('click', buscarMaterias);
        inputBusqueda.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                buscarMaterias();
            }
        });
        
        // Cerrar modal al hacer clic fuera
        modalMateria.addEventListener('click', function(e) {
            if (e.target === modalMateria) {
                cerrarModal();
            }
        });
    }
    
    function cargarMaterias() {
        // RUTA CORREGIDA: Desde publico/JS apunta a ../APIS/materias.api.js/listar
        fetch('../APIS/materias.api.js/listar', {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarMaterias(data.materias);
            } else {
                mostrarError('Error al cargar materias');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarError('Error de conexión');
        });
    }
    
    function cargarProfesores() {
        // RUTA CORREGIDA: Para obtener profesores (si este endpoint existe)
        // Si no existe, deberías crearlo o ajustar la lógica
        fetch('../APIS/materias.api.js/profesores/lista', {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                llenarSelectProfesores(data.profesores);
            } else {
                // Si no hay endpoint, crear lista vacía
                llenarSelectProfesores([]);
            }
        })
        .catch(error => {
            console.error('Error al cargar profesores:', error);
            llenarSelectProfesores([]);
        });
    }
    
    function llenarSelectProfesores(profesores) {
        const selectProfesor = document.getElementById('id_profesor');
        if (!selectProfesor) return;
        
        selectProfesor.innerHTML = '<option value="">Seleccionar profesor...</option>';
        
        profesores.forEach(profesor => {
            const option = document.createElement('option');
            option.value = profesor.id;
            option.textContent = profesor.nombre_completo;
            selectProfesor.appendChild(option);
        });
    }
    
    function mostrarMaterias(materias) {
        if (!tablaMaterias) return;
        
        tablaMaterias.innerHTML = '';
        
        if (materias.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="8" class="text-center">
                    No se encontraron materias
                </td>
            `;
            tablaMaterias.appendChild(tr);
            return;
        }
        
        materias.forEach(materia => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${materia.codigo}</td>
                <td>${materia.nombre}</td>
                <td>${materia.descripcion || '-'}</td>
                <td class="text-center">${materia.creditos}</td>
                <td class="text-center">${materia.horas_semana}</td>
                <td>${materia.profesor_nombre || 'Sin asignar'}</td>
                <td>
                    <span class="badge ${materia.estado === 'activo' ? 'bg-success' : 'bg-secondary'}">
                        ${materia.estado}
                    </span>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning btn-editar" data-id="${materia.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${materia.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tablaMaterias.appendChild(tr);
        });
        
        // Agregar eventos a los botones
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                editarMateria(id);
            });
        });
        
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                eliminarMateria(id);
            });
        });
    }
    
    function editarMateria(id) {
        // RUTA CORREGIDA
        fetch(`../APIS/materias.api.js/buscar/${id}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                materiaEditando = data.materia;
                llenarFormulario(data.materia);
                mostrarModal();
            } else {
                mostrarError('Error al cargar materia');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarError('Error de conexión');
        });
    }
    
    function llenarFormulario(materia) {
        if (document.getElementById('codigo')) document.getElementById('codigo').value = materia.codigo;
        if (document.getElementById('nombre')) document.getElementById('nombre').value = materia.nombre;
        if (document.getElementById('descripcion')) document.getElementById('descripcion').value = materia.descripcion || '';
        if (document.getElementById('creditos')) document.getElementById('creditos').value = materia.creditos;
        if (document.getElementById('horas_semana')) document.getElementById('horas_semana').value = materia.horas_semana;
        if (document.getElementById('id_profesor')) document.getElementById('id_profesor').value = materia.id_profesor || '';
        if (document.getElementById('estado')) document.getElementById('estado').value = materia.estado;
        
        // Actualizar título del modal si existe
        const modalTitle = document.querySelector('#modal-materia .modal-title');
        if (modalTitle) {
            modalTitle.textContent = 'Editar Materia';
        }
    }
    
    function guardarMateria() {
        const formData = {
            codigo: document.getElementById('codigo') ? document.getElementById('codigo').value.trim() : '',
            nombre: document.getElementById('nombre') ? document.getElementById('nombre').value.trim() : '',
            descripcion: document.getElementById('descripcion') ? document.getElementById('descripcion').value.trim() : '',
            creditos: document.getElementById('creditos') ? document.getElementById('creditos').value : 0,
            horas_semana: document.getElementById('horas_semana') ? document.getElementById('horas_semana').value : 0,
            id_profesor: document.getElementById('id_profesor') ? document.getElementById('id_profesor').value || null : null,
            estado: document.getElementById('estado') ? document.getElementById('estado').value : 'activo'
        };
        
        // Validaciones
        if (!formData.codigo || !formData.nombre) {
            mostrarError('Código y nombre son requeridos');
            return;
        }
        
        // Si estamos editando, agregar el ID
        if (materiaEditando) {
            formData.id = materiaEditando.id;
        }
        
        // RUTAS CORREGIDAS
        const url = materiaEditando ? '../APIS/materias.api.js/actualizar' : '../APIS/materias.api.js/registrar';
        const method = materiaEditando ? 'PUT' : 'POST';
        
        if (btnGuardar) {
            btnGuardar.disabled = true;
            btnGuardar.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Procesando...';
        }
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (btnGuardar) {
                btnGuardar.disabled = false;
                btnGuardar.innerHTML = materiaEditando ? 'Actualizar' : 'Guardar';
            }
            
            if (data.success) {
                mostrarExito(data.message);
                cerrarModal();
                cargarMaterias();
            } else {
                mostrarError(data.message);
            }
        })
        .catch(error => {
            if (btnGuardar) {
                btnGuardar.disabled = false;
                btnGuardar.innerHTML = materiaEditando ? 'Actualizar' : 'Guardar';
            }
            console.error('Error:', error);
            mostrarError('Error de conexión');
        });
    }
    
    function eliminarMateria(id) {
        if (!confirm('¿Está seguro de eliminar esta materia?')) {
            return;
        }
        
        // RUTA CORREGIDA
        fetch('../APIS/materias.api.js/eliminar', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id }),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarExito(data.message);
                cargarMaterias();
            } else {
                mostrarError(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarError('Error de conexión');
        });
    }
    
    function buscarMaterias() {
        const termino = inputBusqueda ? inputBusqueda.value.trim() : '';
        
        if (!termino) {
            cargarMaterias();
            return;
        }
        
        // RUTA CORREGIDA (ajustar según tu API)
        fetch(`../APIS/materias.api.js/buscar/termino/${encodeURIComponent(termino)}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarMaterias(data.materias);
            } else {
                mostrarError('Error en la búsqueda');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarError('Error de conexión');
        });
    }
    
    function resetForm() {
        if (formMateria) formMateria.reset();
        if (document.getElementById('estado')) document.getElementById('estado').value = 'activo';
        
        const modalTitle = document.querySelector('#modal-materia .modal-title');
        if (modalTitle) {
            modalTitle.textContent = 'Nueva Materia';
        }
    }
    
    function mostrarModal() {
        if (modalMateria) {
            modalMateria.style.display = 'block';
            modalMateria.classList.add('show');
        }
    }
    
    function cerrarModal() {
        if (modalMateria) {
            modalMateria.style.display = 'none';
            modalMateria.classList.remove('show');
        }
        resetForm();
        materiaEditando = null;
    }
    
    function mostrarExito(mensaje) {
        // Mejor implementación con Toast
        const toast = document.createElement('div');
        toast.className = 'alert alert-success alert-dismissible fade show position-fixed';
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
        toast.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }
    
    function mostrarError(mensaje) {
        // Mejor implementación con Toast
        const toast = document.createElement('div');
        toast.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
        toast.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }
    
    // Exportar para uso global si es necesario
    window.Materias = {
        cargarMaterias: cargarMaterias,
        mostrarModalNueva: function() {
            materiaEditando = null;
            resetForm();
            mostrarModal();
        },
        guardarMateria: guardarMateria,
        eliminarMateria: eliminarMateria
    };
});
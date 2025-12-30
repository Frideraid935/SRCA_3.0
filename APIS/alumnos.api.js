// alumnos-api.js - Funciones para comunicarse con el backend

const API_BASE = "/api/alumnos";

export class AlumnosAPI {
    // Registrar alumno
    static async registrar(data) {
        try {
            const response = await fetch(`${API_BASE}/registrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            return { status: 'error', message: 'Error de conexión' };
        }
    }

    // Listar todos los alumnos
    static async listarTodos() {
        try {
            const response = await fetch(`${API_BASE}/listar`);
            return await response.json();
        } catch (error) {
            return [];
        }
    }

    // Buscar alumno por número de control
    static async buscarPorNumero(numero) {
        try {
            const response = await fetch(`${API_BASE}/buscar/${numero}`);
            return await response.json();
        } catch (error) {
            return { status: 'error', message: 'Error de conexión' };
        }
    }

    // Actualizar alumno
    static async actualizar(data) {
        try {
            const response = await fetch(`${API_BASE}/actualizar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            return { status: 'error', message: 'Error de conexión' };
        }
    }

    // Eliminar alumno
    static async eliminar(numero) {
        try {
            const response = await fetch(`${API_BASE}/eliminar`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ numero_de_control: numero })
            });
            return await response.json();
        } catch (error) {
            return { status: 'error', message: 'Error de conexión' };
        }
    }
}
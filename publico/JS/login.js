document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, password })
        });

        const data = await res.json();

        if (data.success) {
            alert('Login correcto');
            window.location.href = '../menu_inicio/menu_inicio_admin.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert('Error al conectar con el servidor');
    }
});


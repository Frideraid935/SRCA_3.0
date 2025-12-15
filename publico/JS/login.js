document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ usuario, password })
  });

  const data = await res.json();

  const mensaje = document.getElementById('mensaje');

  if (data.success) {
    mensaje.textContent = 'Login correcto';
    // window.location.href = 'dashboard.html';
  } else {
    mensaje.textContent = data.message;
  }
});

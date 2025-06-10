// LOGIN
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('http://localhost:8080/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    localStorage.setItem('token', 'usuario-autenticado');
    window.location.href = 'index.html';
  } else {
    const data = await res.json();
    alert(data.message || 'Credenciales inválidas');
  }
});

// REGISTRO
document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;

  const res = await fetch('http://localhost:8080/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
    document.getElementById('registerCard').style.display = 'none';
    document.getElementById('loginCard').style.display = 'block';
  } else {
    const data = await res.json();
    alert(data.message || 'Error al registrar usuario');
  }
});
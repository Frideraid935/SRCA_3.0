const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Redirigir raíz a login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Rutas API
app.use('/api', require('./routes/auth.routes'));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

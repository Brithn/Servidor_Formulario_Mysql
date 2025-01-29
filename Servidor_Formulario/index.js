const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '1234', 
  database: 'registro_usuarios', 
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
  }
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'El correo electrónico no tiene un formato válido.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }
  
  // Verificar si el correo electrónico ya existe
  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }
  });
  const sql = 'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al guardar el usuario en la base de datos' });
    }
    res.status(201).json({ message: 'Usuario registrado ' });
  });

  app.get('/usuarios', (req, res)=>{
    db.query('SELECT * FROM usuarios', (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al obtener los usuarios' });
      }
      res.status(200).json(result);
    });
  } )
});

// Ruta para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
    res.status(200).json(result);
  });
});
// Ruta para obtener todos los usuarios
app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
    res.status(200).json({ message: 'Usuario eliminado' });
  });
});






// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

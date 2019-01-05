// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// Body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar rutas
var appRoutes = require('./Routes/app');
var usuarioRoutes = require('./Routes/usuario');
var loginRoutes = require('./Routes/login');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos en puerto 27017: \x1b[32m%s\x1b[0m', 'online')
})

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server en puerto 3000: \x1b[32m%s\x1b[0m', 'online')
})
// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

//  CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    next();
});

// Body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar rutas
var appRoutes = require('./Routes/app');
var usuarioRoutes = require('./Routes/usuario');
var loginRoutes = require('./Routes/login');
var hospitalRoutes = require('./Routes/hospital');
var medicoRoutes = require('./Routes/medico');
var busquedaRoutes = require('./Routes/busqueda');
var uploadRoutes = require('./Routes/upload');
var imagenesRoutes = require('./Routes/imagenes');
var osRoutes = require('./Routes/os');
var pacienteRoutes = require('./Routes/paciente');
var localidadRoutes = require('./Routes/localidad');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos en puerto 27017: \x1b[32m%s\x1b[0m', 'online')
})

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/os', osRoutes);
app.use('/paciente', pacienteRoutes);
app.use('/localidad', localidadRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server en puerto 3000: \x1b[32m%s\x1b[0m', 'online')
})
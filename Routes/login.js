// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Inicializar variables
var app = express();
var Usuario = require('../Models/usuario');
var seed = require('../Config/config').SEED;

// =======================================
// Login normal
// =======================================
app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: { message: 'Usuario no encontrado' }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: { message: 'El password ingresado es incorrecto' }
            });
        }

        // Crear un token
        usuarioDB.password = ':(';
        var token = jwt.sign({ usuario: usuarioDB }, seed, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });

    })

})


module.exports = app;
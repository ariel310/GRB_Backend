// Requires
var express = require('express');

// Inicializar variables
var app = express();
var Hospital = require('../Models/hospital');
var Medico = require('../Models/medico');
var Usuario = require('../Models/usuario');

// ========================================
// Busqueda por colección
// ========================================

app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuario':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'hospital':
            promesa = buscarHospitales(busqueda, regex);
            break;

        case 'medico':
            promesa = buscarMedicos(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar la tabla',
                error: { mensaje: 'No se encontro la tabla solicitada' }
            });
    }

    promesa.then(respuesta => {
        res.status(200).json({
            ok: true,
            [tabla]: respuesta
        });

    })

});

function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales');
                } else {
                    resolve(hospitales)
                }

            });

    })
}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar los medicos');
                } else {
                    resolve(medicos)
                }

            });

    })
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar los usuarios');
                } else {
                    resolve(usuarios)
                }

            });

    })
}


// ========================================
// Busqueda General
// ========================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {


            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

        })

});

function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales');
                } else {
                    resolve(hospitales)
                }

            });

    })
}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar los medicos');
                } else {
                    resolve(medicos)
                }

            });

    })
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar los usuarios');
                } else {
                    resolve(usuarios)
                }

            });

    })
}


module.exports = app;
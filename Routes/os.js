// Requires
var express = require('express');

var mdAutenticacion = require('../Middlewares/autenticacion');

// Inicializar variables
var app = express();
var OS = require('../Models/os');

//========================================
// Obtener todas las os
//========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    var limit = req.query.limit || 0;
    limit = Number(limit);

    OS.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limit)
        .exec(
            (err, oss) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando obras sociales',
                        errors: err
                    });
                }

                OS.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        os: oss
                    });
                })

            })

})

//========================================
// Obtener una os
//========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    OS.findById(id)
        .populate('usuario', 'nombre email img')
        .exec((err, osCargada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar una obra social',
                    errors: err
                });
            }

            if (!osCargada) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Obra social no encontrada',
                    errors: { message: 'No existe una obra social con el id: ' + id }
                });
            }

            OS.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    os: osCargada
                });
            })
        })
})

//========================================
// Actualizar una os
//========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    OS.findById(id, (err, os) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar una obra social',
                errors: err
            });
        }

        if (!os) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Obra social no encontrada',
                errors: { message: 'No existe una obra social con el id:' + id }
            });
        }

        os.nombre = body.nombre;
        os.usuario = req.usuario._id

        os.save((err, osGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la obra social',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                os: osGuardada
            });

        })

    });

})

//========================================
// Crear os
//========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var os = new OS({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    os.save((err, osGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear una obra social',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            os: osGuardada,
            usuarioToken: req.usuario
        });
    })

});

//========================================
// Borrar os por id
//========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    OS.findByIdAndRemove(id, (err, osBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar una obra social',
                errors: err
            });
        }

        if (!osBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Obra social no encontrada',
                errors: { message: 'No existe una obra social con el id:' + id }
            });
        }

        res.status(200).json({
            ok: true,
            os: osBorrada
        });

    })
})


module.exports = app;
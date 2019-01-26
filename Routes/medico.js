// Requires
var express = require('express');

var mdAutenticacion = require('../Middlewares/autenticacion');

// Inicializar variables
var app = express();
var Medico = require('../Models/medico');

//========================================
// Obtener todos los medicos
//========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre')
        .skip(desde)
        .limit(5)
        .exec(
            (err, medicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        medicos
                    });
                })

            })

})

//========================================
// Obtener un medico
//========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((err, medicoCargado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                });
            }

            if (!medicoCargado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico no encontrado',
                    errors: { message: 'No existe un medico con el id: ' + id }
                });
            }

            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    medico: medicoCargado
                });
            })
        })
})

//========================================
// Actualizar un medico
//========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medicos',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Medico no encontrado',
                errors: { message: 'No existe un medico con el id:' + id }
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.hospital = body.hospital;
        medico.usuario = req.usuario._id

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el medico',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        })

    });

})

//========================================
// Crear medicos
//========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        hospital: body.hospital,
        usuario: req.usuario._id
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuarioToken: req.usuario
        });
    })

});

//========================================
// Borrar medico por id
//========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar un medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Medico no encontrado',
                errors: { message: 'No existe un medico con el id:' + id }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    })
})


module.exports = app;
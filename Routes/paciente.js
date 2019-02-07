// Requires
var express = require('express');

var mdAutenticacion = require('../Middlewares/autenticacion');

// Inicializar variables
var app = express();
var Paciente = require('../Models/paciente');

var common = require('../Config/common');

//========================================
// Obtener todos los pacientes
//========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    var limit = req.query.limit || 0;
    limit = Number(limit);

    Paciente.find({})
        .populate('usuario', 'nombre email')
        .populate('os', 'nombre')
        .populate('planesOS', 'nombre')
        .populate('Direccion', 'calle numero piso depto ciudad')
        .skip(desde)
        .limit(limit)
        .exec(
            (err, pacientes) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando pacientes',
                        errors: err
                    });
                }

                Paciente.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        paciente: pacientes
                    });
                })

            })

})

//========================================
// Obtener un paciente
//========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Paciente.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('os', 'nombre')
        .populate('planesOS', 'nombre')
        .populate('Direccion', 'calle numero piso depto ciudad')
        .exec((err, pacienteCargado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar un paciente',
                    errors: err
                });
            }

            if (!pacienteCargado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Paciente no encontrado',
                    errors: { message: 'No existe un paciente con el id: ' + id }
                });
            }

            Paciente.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    paciente: pacienteCargado
                });
            })
        })
})

//========================================
// Actualizar un paciente
//========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Paciente.findById(id, (err, pacientes) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un paciente',
                errors: err
            });
        }

        if (!pacientes) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Paciente no encontrado',
                errors: { message: 'No existe un paciente con el id:' + id }
            });
        }

        pacientes.nombre = common.capitalize(body.nombre);
        pacientes.apellido = common.capitalize(body.apellido);
        pacientes.telCelular = body.telCelular;
        pacientes.telFijo = body.telFijo;
        pacientes.email = body.email;
        pacientes.planOS = body.planOS;
        pacientes.afiliado = body.afiliado;
        pacientes.domicilio = body.domicilio;
        pacientes.fechaNac = body.fechaNac;
        pacientes.sexo = body.sexo;
        pacientes.profesion = common.capitalize(body.profesion);
        pacientes.dni = body.dni;
        pacientes.usuario = req.usuario._id

        pacientes.save((err, pacienteGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el paciente',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                paciente: pacienteGuardado
            });

        })

    });

})

//========================================
// Crear pacientes
//========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var paciente = new Paciente({
        nombre: common.capitalize(body.nombre),
        apellido: common.capitalize(body.apellido),
        telCelular: body.telCelular,
        telFijo: body.telFijo,
        email: body.email,
        planOS: body.planOS,
        afiliado: body.afiliado,
        domicilio: body.domicilio,
        fechaNac: body.fechaNac,
        sexo: body.sexo,
        profesion: common.capitalize(body.profesion),
        dni: body.dni,
        usuario: req.usuario._id
    });

    paciente.save((err, pacienteGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un paciente',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            paciente: pacienteGuardado,
            usuarioToken: req.usuario
        });
    })

});

//========================================
// Borrar paciente por id
//========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Paciente.findByIdAndRemove(id, (err, pacienteBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar un paciente',
                errors: err
            });
        }

        if (!pacienteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Paciente no encontrado',
                errors: { message: 'No existe un paciente con el id:' + id }
            });
        }

        res.status(200).json({
            ok: true,
            paciente: pacienteBorrado
        });

    })
})


module.exports = app;
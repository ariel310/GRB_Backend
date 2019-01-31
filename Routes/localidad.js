// Requires
var express = require('express');

var mdAutenticacion = require('../Middlewares/autenticacion');

// Inicializar variables
var app = express();
var Ciudad = require('../Models/ciudad');

//========================================
// Obtener todas las ciudades
//========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    var limit = req.query.limit || 0;
    limit = Number(limit);

    Ciudad.find({})
        .populate('usuario', 'nombre email')
        .populate('Provincia', 'nombre')
        .skip(desde)
        .limit(limit)
        .exec(
            (err, ciudades) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando ciudades',
                        errors: err
                    });
                }

                Ciudad.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        paciente: ciudades
                    });
                })

            })

})

//========================================
// Obtener una ciudad
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
                    mensaje: 'Paciente encontrado',
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

        if (!os) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Paciente no encontrado',
                errors: { message: 'No existe un paciente con el id:' + id }
            });
        }

        pacientes.nombre = body.nombre;
        pacientes.apellido = body.apellido;
        pacientes.telCelular = body.telCelular;
        pacientes.telFijo = body.telFijo;
        pacientes.email = body.email;
        pacientes.os = body.os;
        pacientes.planOS = body.planOS;
        pacientes.afiliado = body.afiliado;
        pacientes.domicilio = body.domicilio;
        pacientes.fechaNac = body.fechaNac;
        pacientes.sexo = body.sexo;
        pacientes.profesion = body.profesion;
        pacientes.dni = body.dni;
        pacientes.usuario = req.usuario._id

        os.save((err, pacienteGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la obra social',
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
        nombre: body.nombre,
        apellido: body.apellido,
        telCelular: body.telCelular,
        telFijo: body.telFijo,
        email: body.email,
        os: body.os,
        planOS: body.planOS,
        afiliado: body.afiliado,
        domicilio: body.domicilio,
        fechaNac: body.fechaNac,
        sexo: body.sexo,
        profesion: body.profesion,
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
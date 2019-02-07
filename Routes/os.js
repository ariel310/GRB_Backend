// Requires
var express = require('express');

var mdAutenticacion = require('../Middlewares/autenticacion');

// Inicializar variables
var app = express();
var OS = require('../Models/os');
var planOS = require('../Models/planesOS');

var common = require('../Config/common');


//========================================
// Obtener todas los planes de os
//========================================
app.get('/plan', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    var limit = req.query.limit || 0;
    limit = Number(limit);

    planOS.find({})
        .populate('os', 'nombre')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limit)
        .exec(
            (err, planesOS) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando los planes de obras sociales',
                        errors: err
                    });
                }

                planOS.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        planes: planesOS
                    });
                })

            })

})

//========================================
// Obtener una plan de os
//========================================
app.get('/plan/:id', (req, res) => {

    var id = req.params.id;

    planOS.findById(id)
        .populate('os', 'nombre')
        .populate('usuario', 'nombre email img')
        .exec((err, planOSCargado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar un plan de obra social',
                    errors: err
                });
            }

            if (!planOSCargado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Plan de obra social no encontrada',
                    errors: { message: 'No existe un plan de una obra social con el id: ' + id }
                });
            }

            planOS.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    os: planOSCargado
                });
            })
        })
})

//========================================
// Actualizar un plan de os
//========================================
app.put('/plan/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    planOS.findById(id, (err, planOS) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un plan de obra social',
                errors: err
            });
        }

        if (!planOS) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Obra social no encontrada',
                errors: { message: 'No existe una obra social con el id:' + id }
            });
        }

        planOS.nombre = common.capitalize(body.nombre);
        planOS.os = body.os;
        planOS.usuario = req.usuario._id

        planOS.save((err, planOSGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el plan de la obra social',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                os: planOSGuardada
            });

        })

    });

})

//========================================
// Crear plan de OS
//========================================
app.post('/plan', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    nuevoPlanOS(common.capitalize(body.nombre), body.os, req.usuario._id, response => {

        err = response.error;
        planOSGuardada = response.plan;

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el plan para una obra social',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            os: planOSGuardada,
            usuarioToken: req.usuario
        });
    });

});

//========================================
// Borrar os por id
//========================================
app.delete('/plan/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    planOS.findByIdAndRemove(id, (err, planOSBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el plan de la obra social',
                errors: err
            });
        }

        if (!planOSBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Plan de oObra social no encontrada',
                errors: { message: 'No existe un plan de una obra social con el id:' + id }
            });
        }

        res.status(200).json({
            ok: true,
            os: planOSBorrada
        });

    })
})

function nuevaOS(nombre, usuario, callback) {

    var osNuevoId = null;

    var os = new OS({
        nombre: nombre,
        usuario: usuario
    });

    return os.save((err, osGuardada) => {

        if (err) {
            if (err._message === 'OS validation failed') {

                return OS.findOne({ nombre: nombre }, (err2, osExistente) => {
                    osNuevoId = osExistente._id;
                    response = { error: err, os: osGuardada, nuevoId: osNuevoId }

                    return callback(response);
                });
            }

        } else if (osGuardada) {
            osNuevoId = osExistente._id;
            response = { error: err, os: osGuardada, nuevoId: osNuevoId }

            return callback(response);
        }

        response = { error: err, os: osGuardada, nuevoId: osExistente._id }

        return callback(response);

    });
}

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

        os.nombre = common.capitalize(body.nombre);
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
    nuevaOS(common.capitalize(body.nombre), req.usuario._id, response => {

        console.log(response);
        err = response.error;
        osGuardada = response.os;

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
    });

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


function nuevoPlanOS(nombre, os, usuario, callback) {

    var plan = new planOS({
        nombre: nombre,
        os: os,
        usuario: usuario
    });

    return plan.save((err, planOSGuardada) => {

        response = { error: err, plan: planOSGuardada };

        callback(response);
    });
}

function buscarPlanPorNombre(plan, os, callback) {

    planOS.findOne({ nombre: plan })
        .populate({
            path: 'os',
            select: 'nombre',
            match: { nombre: os }
        })
        .exec((err, planes) => {

            response = { error: err, planes: planes };

            callback(response);
        })

}

//========================================
// Buscar planes con OS completa por nombre
//========================================
app.post('/planes', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    var usuario = req.usuario._id;

    os = common.capitalize(body.os);
    plan = common.capitalize(body.plan);

    nuevosInserts = 0;

    buscarPlanPorNombre(plan, os, resultado => {

        err = resultado.err;
        planes = resultado.planes;

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al recuperar los planes',
                errors: err
            });
        }

        console.log(planes);

        if (!planes) {
            nuevosInserts = 1;
        } else if (!planes.os) {
            nuevosInserts = 1;
        } else {
            res.status(201).json({
                ok: true,
                plan: planes,
                mensaje: "El plan ya existe"
            });
        }


        if (nuevosInserts) {
            console.log('No existe la combinación deseada');

            nuevaOS(os, usuario, response => {
                if (response.nuevoId) {
                    nuevoPlanOS(plan, response.nuevoId, usuario, response => {
                        console.log('Response Plan', response);

                        err = response.error;
                        nuevoPlan = response.plan;

                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: 'Error al crear una plan',
                                errors: err
                            });
                        }

                        res.status(201).json({
                            ok: true,
                            planes: nuevoPlan
                        });
                    });
                } else {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error inesperado al crear la nueva os',
                        errors: response
                    });
                }
            });
        }
    });
});

module.exports = app;
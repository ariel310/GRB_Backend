// Requires
var express = require('express');

var mdAutenticacion = require('../Middlewares/autenticacion');

// Inicializar variables
var app = express();
var Ciudad = require('../Models/ciudad');
var Provincia = require('../Models/provincia');
var Pais = require('../Models/pais');

var common = require('../Config/common');


//========================================
// Obtener todas las ciudades
//========================================
app.get('/ciudad', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    var limit = req.query.limit || 0;
    limit = Number(limit);

    Ciudad.find({})
        .populate({
            path: 'provincia',
            select: 'nombre pais',
            populate: ({ path: 'pais', select: 'nombre' })
        })
        .populate('usuario', 'nombre email')
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
                        ciudad: ciudades
                    });
                })

            })

})

//========================================
// Obtener una ciudad
//========================================
app.get('/ciudad/:id', (req, res) => {

    var id = req.params.id;

    Ciudad.findById(id)
        .populate({
            path: 'provincia',
            select: 'nombre pais',
            populate: ({ path: 'pais', select: 'nombre' })
        })
        .populate('usuario', 'nombre email')
        .exec((err, ciudadCargada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar una ciudad',
                    errors: err
                });
            }

            if (!ciudadCargada) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Ciudad no encontrada',
                    errors: { message: 'No existe una ciudad con el id: ' + id }
                });
            }

            Ciudad.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    ciudad: ciudadCargada
                });
            })
        })
})

//========================================
// Actualizar una ciudad
//========================================
app.put('/ciudad/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Ciudad.findById(id, (err, ciudades) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar una ciudad',
                errors: err
            });
        }

        if (!ciudades) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Ciudad no encontrada',
                errors: { message: 'No existe una ciudad con el id:' + id }
            });
        }

        ciudades.nombre = common.capitalize(body.nombre);
        ciudades.provincia = body.provincia;
        ciudades.usuario = req.usuario._id

        ciudades.save((err, ciudadGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la ciudad',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                ciudad: ciudadGuardada
            });

        })

    });

})

//========================================
// Crear ciudades
//========================================
app.post('/ciudad', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var ciudad = new Ciudad({
        nombre: common.capitalize(body.nombre),
        provincia: body.provincia,
        usuario: req.usuario._id
    });

    ciudad.save((err, ciudadGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear una ciudad',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            ciudad: ciudadGuardada,
            usuarioToken: req.usuario
        });
    })

});

//========================================
// Borrar ciudad por id
//========================================
app.delete('/ciudad/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Ciudad.findByIdAndRemove(id, (err, ciudadBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar un ciudad',
                errors: err
            });
        }

        if (!ciudadBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Ciudad no encontrada',
                errors: { message: 'No existe una ciudad con el id:' + id }
            });
        }

        res.status(200).json({
            ok: true,
            ciudad: ciudadBorrada
        });

    })
})

//========================================
// Obtener todas las provincias
//========================================
app.get('/provincia', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    var limit = req.query.limit || 0;
    limit = Number(limit);

    Provincia.find({})
        .populate('pais', 'nombre')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limit)
        .exec(
            (err, provincias) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando provincias',
                        errors: err
                    });
                }

                Provincia.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        provincia: provincias
                    });
                })

            })

})

//========================================
// Obtener una provincia
//========================================
app.get('/provincia/:id', (req, res) => {

    var id = req.params.id;

    Provincia.findById(id)
        .populate('pais', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, provinciaCargada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar una provincia',
                    errors: err
                });
            }

            if (!provinciaCargada) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Provincia no encontrada',
                    errors: { message: 'No existe una provincia con el id: ' + id }
                });
            }

            Provincia.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    provincia: provinciaCargada
                });
            })
        })
})

//========================================
// Actualizar una provincia
//========================================
app.put('/provincia/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Provincia.findById(id, (err, provincias) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar una provincia',
                errors: err
            });
        }

        if (!provincias) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Provincia no encontrada',
                errors: { message: 'No existe una provincia con el id:' + id }
            });
        }

        provincias.nombre = common.capitalize(body.nombre);
        provincias.pais = body.pais;
        provincias.usuario = req.usuario._id

        provincias.save((err, provinciasGuardadas) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la provincia',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                provincia: provinciasGuardadas
            });

        })

    });

})

//========================================
// Crear provincias
//========================================
app.post('/provincia', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var provincia = new Provincia({
        nombre: common.capitalize(body.nombre),
        pais: body.pais,
        usuario: req.usuario._id
    });

    provincia.save((err, provinciaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear una provincia',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            provincia: provinciaGuardada,
            usuarioToken: req.usuario
        });
    })

});

//========================================
// Borrar provincia por id
//========================================
app.delete('/provincia/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Provincia.findByIdAndRemove(id, (err, provinciaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar un provincia',
                errors: err
            });
        }

        if (!provinciaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Provincia no encontrada',
                errors: { message: 'No existe una provincia con el id:' + id }
            });
        }

        res.status(200).json({
            ok: true,
            provincia: provinciaBorrada
        });

    })
})


//========================================
// Obtener todas los paises
//========================================
app.get('/pais', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    var limit = req.query.limit || 0;
    limit = Number(limit);

    Pais.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limit)
        .exec(
            (err, paises) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando paises',
                        errors: err
                    });
                }

                Pais.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        pais: paises
                    });
                })

            })

})

//========================================
// Obtener un pais
//========================================
app.get('/pais/:id', (req, res) => {

    var id = req.params.id;

    Pais.findById(id)
        .populate('usuario', 'nombre email')
        .exec((err, paisCargado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar un pais',
                    errors: err
                });
            }

            if (!paisCargado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Pais no encontrado',
                    errors: { message: 'No existe un pais con el id: ' + id }
                });
            }

            Pais.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    pais: paisCargado
                });
            })
        })
})

//========================================
// Actualizar un pais
//========================================
app.put('/pais/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Pais.findById(id, (err, paises) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un pais',
                errors: err
            });
        }

        if (!paises) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Pais no encontrado',
                errors: { message: 'No existe un pais con el id:' + id }
            });
        }

        paises.nombre = common.capitalize(body.nombre);
        paises.usuario = req.usuario._id

        paises.save((err, paisGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el pais',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                pais: paisGuardado
            });

        })

    });

})

//========================================
// Crear paises
//========================================
app.post('/pais', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var paisCorregido = common.capitalize(body.nombre);

    nuevoPais(paisCorregido, req.usuario._id, respuesta => {

        err = respuesta.error;
        paisGuardado = respuesta.paisGuardado;

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear un pais',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            pais: paisGuardado,
            usuarioToken: req.usuario
        });
    })
});

function nuevoPais(nombre, usuario, callback) {

    var pais = new Pais({
        nombre: nombre,
        usuario: usuario
    });

    pais.save((err, paisGuardado) => {

        response = { error: err, pais: paisGuardado }

        callback(response);
    });
}

//========================================
// Borrar pais por id
//========================================
app.delete('/pais/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Pais.findByIdAndRemove(id, (err, paisBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar un pais',
                errors: err
            });
        }

        if (!paisBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Pais no encontrada',
                errors: { message: 'No existe un pais con el id:' + id }
            });
        }

        res.status(200).json({
            ok: true,
            pais: paisBorrado
        });

    })
});


function buscarCiudadPorNombre(ciudad, callback) {

    Ciudad.find({ nombre: ciudad })
        .populate({
            path: 'provincia',
            select: 'nombre',
            populate: {
                path: 'pais',
                select: 'nombre'
            }
        })
        .exec((err, ciudades) => {

            response = { error: err, ciudades: ciudades };

            callback(response);
        })

}

//========================================
// Buscar ubicacion completa por nombre
//========================================
app.get('/ubicacion', (req, res) => {

    var body = req.body;

    city = common.capitalize(body.ciudad);
    state = common.capitalize(body.provincia);
    country = common.capitalize(body.pais);

    usuario = req.usuario._id;

    buscarCiudadPorNombre(city, resultado => {

        err = resultado.err;
        ciudad = resultado.ciudades;

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al recuperar la ubicacion',
                errors: err
            });
        }

        console.log(ciudad);

        if (!ciudad) {
            return res.status(400).json({
                ok: false,
                id: null,
                errors: { message: 'No existe una ciudad con el nombre: ' + city }
            });
        }

        if (ciudad.provincia.nombre !== state) {
            return res.status(400).json({
                ok: false,
                id: null,
                errors: { message: 'No existe una ciudad con el nombre: ' + city + ' en: ' + state }
            });
        }

        if (ciudad.provincia.pais.nombre !== country) {
            return res.status(400).json({
                ok: false,
                id: null,
                errors: { message: 'No existe una ciudad con el nombre: ' + city + ' en: ' + state + '/' + country }
            });
        }

        res.status(200).json({
            ok: true,
            id: ciudad
        });

    });


});

module.exports = app;
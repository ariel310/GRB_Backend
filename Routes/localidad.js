// Requires
var express = require('express');

var mdAutenticacion = require('../Middlewares/autenticacion');

// Inicializar variables
var app = express();
var Ciudad = require('../Models/ciudad');
var Provincia = require('../Models/provincia');
var Pais = require('../Models/pais');
var Direccion = require('../Models/direccion');

var common = require('../Config/common');

//========================================
// Obtener todas las direcciones
//========================================
app.get('/direccion', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    var limit = req.query.limit || 0;
    limit = Number(limit);

    Direccion.find({})
        .populate({
            path: 'ciudad',
            select: 'nombre',
            populate: {
                path: 'provincia',
                select: 'nombre pais',
                populate: ({ path: 'pais', select: 'nombre' })
            }
        })
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limit)
        .exec(
            (err, direcciones) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando las direcciones',
                        errors: err
                    });
                }

                Direccion.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        direccion: direcciones
                    });
                })

            })

})

//========================================
// Obtener una direccion
//========================================
app.get('/direccion/:id', (req, res) => {

    var id = req.params.id;

    Direccion.findById(id)
        .populate({
            path: 'ciudad',
            select: 'nombre',
            populate: {
                path: 'provincia',
                select: 'nombre pais',
                populate: ({ path: 'pais', select: 'nombre' })
            }
        })
        .populate('usuario', 'nombre email')
        .exec((err, direccionCargada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar una direccion',
                    errors: err
                });
            }

            if (!direccionCargada) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Direccion no encontrada',
                    errors: { message: 'No existe una direccion con el id: ' + id }
                });
            }

            Direccion.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    direccion: direccionCargada
                });
            })
        })
})

//========================================
// Actualizar una ciudad
//========================================
app.put('/direccion/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Direccion.findById(id, (err, direcciones) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar una direccion',
                errors: err
            });
        }

        if (!direcciones) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Direccion no encontrada',
                errors: { message: 'No existe una direccion con el id:' + id }
            });
        }

        direcciones.calle = common.capitalize(body.calle);
        direcciones.numero = common.capitalize(body.numero);
        direcciones.piso = common.capitalize(body.piso);
        direcciones.depto = common.capitalize(body.depto);
        direcciones.ciudad = body.ciudad;
        direcciones.usuario = req.usuario._id

        direcciones.save((err, direccionGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la direccion',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                direccion: direccionGuardada
            });

        })

    });

})

//========================================
// Crear direcciones
//========================================
app.post('/direccion', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    nuevaDireccion(common.capitalize(body.calle),
        body.numero,
        body.piso,
        body.depto,
        body.ciudad,
        req.usuario._id,
        response => {

            err = response.error;
            direccionGuardada = response.direccion;

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear una direccion',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                direccion: direccionGuardada,
                usuarioToken: req.usuario
            });
        });

});

function nuevaDireccion(calle, numero, piso, depto, ciudad, usuario, callback) {

    var direccion = new Direccion({
        calle: calle,
        numero: numero,
        piso: piso,
        depto: depto,
        ciudad: ciudad,
        usuario: usuario
    });

    direccion.save((err, direccionGuardada) => {

        response = { error: err, direccion: direccionGuardada };

        return callback(response);

    });
};

//========================================
// Borrar direccion por id
//========================================
app.delete('/direccion/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Direccion.findByIdAndRemove(id, (err, direccionBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar un direccion',
                errors: err
            });
        }

        if (!direccionBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Direccion no encontrada',
                errors: { message: 'No existe una direccion con el id:' + id }
            });
        }

        res.status(200).json({
            ok: true,
            direccion: direccionBorrada
        });

    })
})


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

    nuevaCiudad(common.capitalize(body.nombre), body.provincia, req.usuario._id, response => {

        err = response.error;
        ciudadGuardada = response.ciudad;

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
    });

});

function nuevaCiudad(nombre, provincia, usuario, callback) {

    var ciudad = new Ciudad({
        nombre: nombre,
        provincia: provincia,
        usuario: usuario
    });

    return ciudad.save((err, ciudadGuardada) => {

        if (err) {
            if (err._message === 'Ciudad validation failed') {

                return Ciudad.findOne({ nombre: nombre, provincia: provincia }, (err2, ciudadExistente) => {

                    response = { error: err, ciudad: ciudadGuardada, nuevoId: ciudadExistente._id }

                    return callback(response);
                });
            }

        } else if (ciudadGuardada) {

            response = { error: err, ciudad: ciudadGuardada, nuevoId: ciudadGuardada._id }

            return callback(response);
        }

        response = { error: err, ciudad: ciudadGuardada, nuevoId: null }

        return callback(response);

    });
};

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

    nuevaProvincia(common.capitalize(body.nombre), body.pais, req.usuario._id, response => {
        err = response.error;
        provinciaGuardada = response.provincia;

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
    });

});


function nuevaProvincia(nombre, pais, usuario, callback) {

    var provinciaNuevoId = null;

    var provincia = new Provincia({
        nombre: nombre,
        pais: pais,
        usuario: usuario
    });

    return provincia.save((err, provinciaGuardada) => {

        if (err) {
            if (err._message === 'Provincia validation failed') {

                return Provincia.findOne({ nombre: nombre }, (err2, provinciaExistente) => {
                    provinciaNuevoId = provinciaExistente._id;
                    response = { error: err, provincia: provinciaGuardada, nuevoId: provinciaNuevoId }

                    return callback(response);
                });
            }

        } else if (provinciaGuardada) {
            provinciaNuevoId = provinciaGuardada._id;
            response = { error: err, provincia: provinciaGuardada, nuevoId: provinciaNuevoId }

            return callback(response);
        }

        response = { error: err, provincia: provinciaGuardada, nuevoId: provinciaNuevoId }

        return callback(response);

    });
}

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
        paisGuardado = respuesta.pais;

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

    var paisNuevoId = null;

    var pais = new Pais({
        nombre: nombre,
        usuario: usuario
    });

    pais.save((err, paisGuardado) => {

        if (err) {

            if (err._message === 'Pais validation failed') {

                return Pais.findOne({ nombre: nombre }, (err2, paisExistente) => {

                    paisNuevoId = paisExistente._id;
                    console.log(paisNuevoId);
                    response = { error: err, pais: paisGuardado, nuevoId: paisNuevoId }

                    return callback(response);

                });
            }

        } else if (paisGuardado) {
            paisNuevoId = paisGuardado._id;
            console.log(paisNuevoId);
            response = { error: err, pais: paisGuardado, nuevoId: paisNuevoId }

            return callback(response);
        }

        console.log(paisNuevoId);
        response = { error: err, pais: paisGuardado, nuevoId: paisNuevoId }

        return callback(response);

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

function buscarDireccionPorNombre(calle, numero, piso, depto, ciudad, provincia, pais, callback) {

    Direccion.findOne({ calle: calle, numero: numero, piso: piso, depto: depto })
        .populate({
            path: 'ciudad',
            select: 'nombre',
            match: { nombre: ciudad },
            populate: {
                path: 'provincia',
                select: 'nombre',
                match: { nombre: provincia },
                populate: {
                    path: 'pais',
                    select: 'nombre',
                    match: { nombre: pais }
                }
            }
        })
        .exec((err, direcciones) => {

            response = { error: err, direcciones: direcciones };

            callback(response);
        })

}

//========================================
// Buscar ubicacion completa por nombre
//========================================
app.post('/ubicacion', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    var usuario = req.usuario._id;

    address = common.capitalize(body.direccion);
    number = body.numero;
    floor = body.piso;
    apt = body.depto;

    city = common.capitalize(body.ciudad);
    state = common.capitalize(body.provincia);
    country = common.capitalize(body.pais);

    paisNuevoId = null;
    provinciaNuevoId = null;

    nuevosInserts = 0;

    buscarDireccionPorNombre(address, number, floor, apt, city, state, country, resultado => {

        err = resultado.err;
        direccion = resultado.direcciones;

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al recuperar la ubicacion',
                errors: err
            });
        }

        console.log(direccion);

        if (!direccion) {
            nuevosInserts = 1;
        } else if (!direccion.ciudad) {
            nuevosInserts = 1;
        } else if (!direccion.ciudad.provincia) {
            nuevosInserts = 1;
        } else if (!direccion.ciudad.provincia.pais) {
            nuevosInserts = 1;
        } else {
            res.status(201).json({
                ok: true,
                ciudad: ciudad,
                mensaje: "La dirección ya existe"
            });
        }


        if (nuevosInserts) {
            console.log('No existe la combinación deseada');

            nuevoPais(country, usuario, response => {
                console.log('Response Pais', response);
                if (response.nuevoId) {

                    nuevaProvincia(state, response.nuevoId, usuario, response => {
                        if (response.nuevoId) {

                            nuevaCiudad(city, response.nuevoId, usuario, response => {

                                if (response.nuevoId) {

                                    nuevaDireccion(address, number, floor, apt, response.nuevoId, usuario, response => {

                                        err = response.error;
                                        nuevaDireccion = response.direccion;

                                        if (err) {
                                            return res.status(400).json({
                                                ok: false,
                                                mensaje: 'Error al crear una dirección',
                                                errors: err
                                            });
                                        }

                                        res.status(201).json({
                                            ok: true,
                                            direccion: nuevaDireccion
                                        });

                                    })
                                } else {
                                    return res.status(500).json({
                                        ok: false,
                                        mensaje: 'Error inesperado al crear la nueva ciudad',
                                        errors: response
                                    });
                                }
                            });
                        } else {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error inesperado al crear la nueva provincia',
                                errors: response
                            });
                        }
                    });
                } else {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error inesperado al crear el nuevo País',
                        errors: response
                    });
                }
            });
        }
    });
});

module.exports = app;
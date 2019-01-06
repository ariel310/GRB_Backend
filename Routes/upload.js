// Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

// Inicializar variables
var app = express();
var Usuario = require('../Models/usuario');
var Hospital = require('../Models/hospital');
var Medico = require('../Models/medico');

var common = require('../Config/common');

// Middeware
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colecciones
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });

    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se selecciono archivo',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo acepto estas extensiones
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Formato de archivo incorrecto',
            errors: { message: 'Las extensiones validas son: ' + extensionesValidas.join(', ') }
        });

    }

    // Nombre de archivo personalizado
    var fechaMillis = new Date().getMilliseconds();
    var nombreArchivo = `${ id }-${ fechaMillis }.${ extensionArchivo }`;

    // Mover el archivo temporal a un path especifico
    var path = `./uploads/${ tipo }/${ nombreArchivo }`

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                error: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        /* res.status(200).json({
            ok: true,
            mensaje: 'Archivo movido'
        }); */
    })

})

function subirPorTipo(tipo, id, nombreArchivo, res) {

    var objeto;

    switch (tipo) {

        case 'usuarios':
            objeto = Usuario;
            break;

        case 'medicos':
            objeto = Medico;
            break;

        case 'hospitales':
            objeto = Hospital;
            break;

    }

    objeto.findById(id, (err, objetoDB) => {

        ok = common.validateError(err, res, 500, `Se produjo un error al buscar ${ tipo }`);

        if (ok) {

            if (!objetoDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: tipo + ' no encontrado',
                    errors: { message: `No existe un ${tipo} con el id:` + id }
                });
            }
            var pathViejo = `./Uploads/${tipo}/` + objetoDB.img;

            // Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            objetoDB.img = nombreArchivo;

            objetoDB.save((err, objetoActualizado) => {

                ok = common.validateError(err, res, 500, `Se produjo un error guardar ${ tipo }`);

                if (ok) {
                    return common.responseOK(objetoActualizado, tipo, res, 200, `Imagen de ${tipo} actualizada`);
                }
            })
        }

    })
}

module.exports = app;
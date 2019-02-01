var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var ciudadSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre	es necesario'] },
    provincia: { type: Schema.Types.ObjectId, ref: 'Provincia', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },

});

ciudadSchema.index({ nombre: 1, provincia: 1 }, { unique: true });

ciudadSchema.plugin(uniqueValidator, { message: 'El {PATH} ingresado ya existe' });

module.exports = mongoose.model('Ciudad', ciudadSchema);
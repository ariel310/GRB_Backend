var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var planesOSSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre	es necesario'] },
    os: { type: Schema.Types.ObjectId, ref: 'OS', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },

});

planesOSSchema.index({ nombre: 1, os: 1 }, { unique: true });

planesOSSchema.plugin(uniqueValidator, { message: 'El {PATH} ingresado ya existe' });

module.exports = mongoose.model('planesOS', planesOSSchema);
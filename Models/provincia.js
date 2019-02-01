var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var provinciaSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre	es necesario'] },
    pais: { type: Schema.Types.ObjectId, ref: 'Pais', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },

});

provinciaSchema.index({ nombre: 1, pais: 1 }, { unique: true });

provinciaSchema.plugin(uniqueValidator, { message: 'El {PATH} ingresado ya existe' });

module.exports = mongoose.model('Provincia', provinciaSchema);
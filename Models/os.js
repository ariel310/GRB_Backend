var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var osSchema = new Schema({

    nombre: { type: String, unique: true, required: [true, 'El nombre es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },

});

osSchema.plugin(uniqueValidator, { message: 'El {PATH} ingresado ya existe' });


module.exports = mongoose.model('OS', osSchema);
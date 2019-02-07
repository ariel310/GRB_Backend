var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var direccionSchema = new Schema({

    calle: { type: String, required: [true, 'La calle es necesaria'] },
    numero: { type: Number, required: [true, 'El número	es necesario'] },
    piso: { type: String, required: false },
    depto: { type: String, required: false },
    ciudad: { type: Schema.Types.ObjectId, ref: 'Ciudad', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },

});

direccionSchema.index({ calle: 1, numero: 1, piso: 1, depto: 1, ciudad: 1 }, { unique: true });

direccionSchema.plugin(uniqueValidator, { message: 'El {PATH} ingresado ya existe' });

module.exports = mongoose.model('Direccion', direccionSchema);
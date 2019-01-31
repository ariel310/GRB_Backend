var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var direccionSchema = new Schema({

    calle: { type: String, required: [true, 'La calle es necesaria'] },
    numero: { type: Number, required: [true, 'El número	es necesario'] },
    piso: { type: String, required: false },
    depto: { type: String, required: false },
    ciudad: { type: Schema.Types.ObjectId, ref: 'Ciudad', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },

});


module.exports = mongoose.model('Direccion', direccionSchema);
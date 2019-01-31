var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ciudadSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre	es necesario'] },
    provincia: { type: Schema.Types.ObjectId, ref: 'Provincia', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },

});


module.exports = mongoose.model('Ciudad', ciudadSchema);
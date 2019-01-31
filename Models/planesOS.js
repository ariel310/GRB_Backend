var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var planesOSSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre	es necesario'] },
    os: { type: Schema.Types.ObjectId, ref: 'OS', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },

});


module.exports = mongoose.model('planesOS', planesOSSchema);
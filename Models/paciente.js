var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var sexosValidos = {
    values: ['M', 'F'],
    message: '{VALUE} no es un sexo válido'
}

var pacienteSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre	es necesario'] },
    apellido: { type: String, required: [true, 'El apellido	es necesario'] },
    telCelular: { type: String, required: [true, 'El telefono celular es necesario'] },
    telFijo: { type: String, required: false },
    email: { type: String, required: [true, 'El email es necesario'] },
    planOS: { type: Schema.Types.ObjectId, ref: 'planesOS', required: [true, 'El plan es un campo obligatorio'] },
    afiliado: { type: String, required: false }, // Hacer a mano la validación de que debe existir si la OS no es particular
    domicilio: { type: Schema.Types.ObjectId, ref: 'Direccion', required: [true, 'La dirección es un campo obligatorio'] },
    fechaNac: { type: Date, required: [true, 'La fecha de nacimiento es necesaria'] },
    sexo: { type: String, required: true, enum: sexosValidos },
    profesion: { type: String, required: false },
    dni: { type: String, unique: true, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },

});


module.exports = mongoose.model('Pacientes', pacienteSchema);
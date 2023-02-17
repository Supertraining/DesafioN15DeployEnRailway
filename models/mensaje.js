import mongoose from 'mongoose';

const mensajesCollection = 'mensajes';

const mensajeSchema = new mongoose.Schema({
	author: {
		id: { type: String, require: true, max: 150 },
		nombre: { type: String, require: true, max: 100 },
		apellido: { type: String, require: true, max: 100 },
		edad: { type: Number, require: true },
		alias: { type: String, require: true, max: 100 },
		avatar: { type: String, require: true, max: 100 },
	},
	text: { type: String, require: true, max: 140 },
	id: { type: Number, require: true },
});
export const mensaje = mongoose.model(mensajesCollection, mensajeSchema);

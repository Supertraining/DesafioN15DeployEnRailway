import mongoose from 'mongoose';
import * as model from '../models/mensaje.js';
import { normalize, schema } from 'normalizr';

class ClienteMongo {
	constructor(url) {
		this.url = url;
		this.connect();
	}
	async connect() {
		try {
			const URL = `${this.url}`;
			mongoose.set('strictQuery', true)
			let response = await mongoose.connect(URL, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
			console.log('Database MongoDb Atlas connected');
		} catch (err) {
			console.log('Ocurrio un error' + err);
		}
	}
	async insertarMensaje(msj) {
		try {
			await model.mensaje.insertMany(msj);
		} catch (err) {
			console.log('Ocurrio un error' + err);
		}
	}

	async getAllNormalized() {
		let data = null;
		let dBdata = null;
		try {
			dBdata = await model.mensaje.find({}, { _id: 0, __v: 0 });

			const stringifyData = JSON.stringify(dBdata);
			const parsedData = JSON.parse(stringifyData);

			let newId = 1;
			parsedData.forEach((e) => (e.id = newId++));
			data = { id: 1, mensajes: parsedData };

			const authorSchema = new schema.Entity('author', {}, { idAttribute: 'id' });
			const messageSchema = new schema.Entity('message', {
				author: authorSchema,
			});
			const postSchema = new schema.Entity('post', {
				mensajes: [messageSchema],
			});
			const mensajesNormalizados = normalize(data, postSchema);
			return mensajesNormalizados;
		} catch (err) {
			console.log('Ocurrio error' + err);
			return (data = []);
		}
	}
	async getProductByID(id) {
		let data = null;
		try {
			data = await model.mensaje.findById(id);
			return data;
		} catch (err) {
			console.log('Ocurrio un error' + err);
			return (data = []);
		}
	}

	async deleteProduct(id) {
		try {
			await model.mensaje.deleteOne(id);
		} catch {
			throw new Error('ocurrio un error' + err);
		}
	}

	async updatedProduct(obj) {
		try {
			await model.mensaje.updateOne(obj);
		} catch {
			throw new Error('ocurrio un error' + err);
		}
	}
}

export default ClienteMongo;

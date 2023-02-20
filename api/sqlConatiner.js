import knex from 'knex';
import { faker } from '@faker-js/faker';
faker.locale = 'es';


class ClienteSQL {
	constructor(options, tabla) {
		this.knex = knex(options);
		this.tabla = tabla;
	}

	async insertarProductos(productos) {
		try {
			await this.knex(`${this.tabla}`).insert(productos);
		} catch (err) {
			console.log('Ocurrio un error' + err);
		}
	}
	async fakerProducts() {
		let data = [];
		try {
			for (let i = 0; i < 5; i++) {
				data.push(
					await {
						nombre: faker.commerce.product(),
						precio: faker.commerce.price(100),
						foto: faker.image.fashion(100, 150, true),
					}
				);
			}
		} catch (err) {
			console.log('Ocurrio un error' + err);
		}
		return data;
	}
	async getAll() {
		let data = null;
		try {
			data = await this.knex(`${this.tabla}`).select('*');
			return data;
		} catch (err) {
			console.log('Ocurrio error' + err);
			return (data = []);
		}
	}
	async getProductByID(id) {
		let data = null;
		try {
			data = await this.knex(`${this.tabla}`).select('*').where('id', '=', id);
			return data;
		} catch (err) {
			console.log('Ocurrio un error' + err);
			return (data = []);
		}
	}

	async deleteProduct(id) {
		try {
			await this.knex(`${this.tabla}`).where('id', '=', id).del();
		} catch (err) {
			throw new Error('ocurrio un error' + err);
		}
	}

	async updatedProduct(obj) {
		try {
			await this.knex(`${this.tabla}`)
				.where('id', '=', obj.id)
				.update({ nombre: obj.nombre, precio: obj.precio, imagen: obj.imagen });
		} catch (err) {
			throw new Error('ocurrio un error' + err);
		}
	}
	async close(data) {
		if (data) {
			try {
				await this.knex.destroy();
			} catch (err) {
				throw new Error('ocurrio un error' + err);
			}
		}
	}
}

export default ClienteSQL;

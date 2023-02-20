import ClienteSQL from '../api/sqlConatiner.js';
import { options } from '../options/mariaDB.js';
import io from '../server.js'


const productContainer = new ClienteSQL(options, 'productos');

export default async function getAllProducts () {
	try {
		let productos = await productContainer.getAll('productos')
		return productos	
	} catch (error) {
		console.log(error);
	}
	
}

export const insertProduct = async (data) => {
	await productContainer.insertarProductos(data);
	let productos = await productContainer.getAll('productos');
	io.sockets.emit('productos', productos);
};

export const deleteProduct = async (id) => {
	await productContainer.deleteProduct(id);
	let productos = await productContainer.getAll('productos');
	io.sockets.emit('productos', productos);
};

export const updateProduct = async (data) => {
	await productContainer.updatedProduct(data);
	let productos = await productContainer.getAll('productos');
	io.sockets.emit('productos', productos);
};

export const selectProduct = async (id) => {
	let producto = await productContainer.getProductByID(id);
	io.sockets.emit('selectedProd', producto);
};


export const getFakerProducts = async (req, res) => {
	let fproducts = await productContainer
		.fakerProducts()
		res.render('../fakeproducts', { fproducts: fproducts });
}

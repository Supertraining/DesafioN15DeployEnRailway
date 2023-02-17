import * as model from '../models/user.js';
import bcrypt from 'bcrypt';

function createHash(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

class userContainer {
	async getUser(username) {
		let data = null;
		try {
			data = await model.usermodel.find({ username: username });
			return data[0];
		} catch (err) {
			console.log('Ocurrio un error' + err);
			return (data = null);
		}
	}
	async authHash(username, password) {
		try {
			let data = await this.getUser(username);
			let auth = await bcrypt.compare(password, data.password);
			return auth;
		} catch (err) {
			console.log('Ocurrio un error' + err);
		}
	}
	async insertUser(data) {
		try {
			const user = { username: data.username, password: createHash(data.password) };
			await model.usermodel.insertMany(user);
			let newUser = data;
			return newUser;
		} catch (err) {
			console.log('Ocurrio un error' + err);
		}
	}
}

export default userContainer;

import dotenv from 'dotenv'
dotenv.config();

const options = {
	client: 'mysql',
	connection: {
		host: process.env.MYSQLHOST || '127.0.0.1',
		user: 'root',
		password: '',
		database: 'ecommerce'
	},
};

export { options };

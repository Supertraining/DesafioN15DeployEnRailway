import dotenv from 'dotenv'
dotenv.config();

const options = {
	client: 'mysql',
	connection: {
		host: process.env.MYSQLHOST,
		user: 'root',
		password: '',
		database: 'ecommerce'
	},
};

export { options };

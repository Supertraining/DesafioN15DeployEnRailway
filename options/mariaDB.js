import dotenv from 'dotenv'
dotenv.config();

const options = {
	client: 'mysql',
	connection: {
		host: process.env.MYSQLHOST || '0.0.0.0',
		user: process.env.MYSQLUSER || 'root',
		password: process.env.MYSQLPASSWORD || '',
		database: process.env.MYSQLDATABASE || 'ecommerce'
	},
};

export { options };

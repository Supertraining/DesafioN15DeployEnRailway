import dotenv from 'dotenv'
dotenv.config();

const options = {
	// client: 'mysql',
	connection: {
		host: process.env.SQLHOST || 'localhost',
		user: process.env.SQLUSER || 'root',
		password: process.env.SQLPASSWORD || '',
		database: process.env.SQLDATABASE || 'ecommerce',
		port: process.env.SQLPORT
	},
};

export { options };

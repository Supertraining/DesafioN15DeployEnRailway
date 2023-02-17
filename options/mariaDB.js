import dotenv from 'dotenv'
dotenv.config();

const options = {
	client: 'mysql',
	connection: {
		host: '127.0.0.1',
		user: process.env.SQLUSERNAME,
		password: '',
		database: process.env.SQLDATABASE,
	},
};

export { options };
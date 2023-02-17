import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import passport from 'passport';
import userRouter from './routes/router.js';
import dotenv from 'dotenv';
import parseArgs from 'minimist';
import forkRouter from './routes/routerCalculo.js';
import getAllProducts, {
	deleteProduct,
	getFakerProducts,
	insertProduct,
	selectProduct,
	updateProduct,
} from './controllers/productController.js';
import getAllMessages, { newMessages } from './controllers/messageCrontroller.js';

import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;

dotenv.config();

const config = {
	alias: {
		p: 'puerto',
		m: 'modo',
	},
	default: {
		puerto: 8080,
		modo: 'FORK',
	},
};

const { puerto } = parseArgs(process.argv.slice(2), config);
const { modo } = parseArgs(process.argv.slice(3), config);

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
export default io;

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
app.use(
	session({
		store: mongoStore.create({
			mongoUrl: process.env.MONGODBURL,
			mongoOptions: advancedOptions,
			collectionName: 'sessions',
			ttl: 600,
		}),
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);

app.get('/info', (req, res) => {
	res.json({
		argumentos_de_entrada: process.argv.slice(2).join(' '),
		sistema_operativo: process.platform,
		version_de_Node: process.version,
		memoria_total_reservada: process.memoryUsage().rss,
		path_de_ejecucion: process.argv[0],
		process_id: process.pid,
		carpeta_del_proyecto: process.cwd(),
		numero_de_procesadores: numCPUs,
		puerto: puerto
})
})

app.get('/api/productos-test', getFakerProducts);

io.on('connection', async (Socket) => {
	console.log('Nuevo usuario conectado');

	let productos = await getAllProducts();
	Socket.emit('productos', productos);

	Socket.on('new-product', insertProduct);

	Socket.on('deleteProduct', deleteProduct);

	Socket.on('updatedProduct', updateProduct);

	Socket.on('selectedProduct', selectProduct);

	Socket.on('new-message', newMessages);

	let messages = await getAllMessages();
	Socket.emit('normalizedMessages', messages);
});

if (cluster.isMaster && modo === 'CLUSTER') {
	console.log(`Primary Process PID ${process.pid}`);
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on('exit', (worker) => {
		console.log(`worker ${worker.process.pid}, died: ${new Date().toLocaleString()}`);
		cluster.fork();
	});
} else {
	app.use(forkRouter);
	const PORT = process.env.PORT || puerto;
	httpServer.listen(PORT, () => {
		console.log(`Server on at ${PORT} - PID: ${process.pid} - ${new Date().toLocaleString()}`);
	});
}

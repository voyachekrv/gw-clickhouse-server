import app from './app';
import * as debugFactory from 'debug';
import * as http from 'http';

const debug = debugFactory('gw-clickhouse-server:server');

/**
 * Нормализация порта.
 */
const normalizePort = (val: string) => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		// Именованный канал
		return val;
	}

	if (port >= 0) {
		// Номер порта
		return port;
	}

	return false;
};

/**
 * Получения порта из переменных окружения в Express.
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Создание HTTP-сервера.
 */
const server = http.createServer(app);

/**
 * Обработчик события ошибки на сервере.
 */
const onError = error => {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

	// Обработка специфических ошибок с выводом дружественных сообщений
	switch (error.code) {
		case 'EACCES':
			console.error(`${bind} requires elevated privileges`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(`${bind} is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
};

/**
 * Обработчик события прослушивания порта на сервере.
 */
const onListening = port => {
	const address = server.address();
	const bind =
		typeof address === 'string'
			? `pipe ${address}`
			: `port ${address.port}`;
	debug(`Listening on ${bind}`);

	console.log(`Server is listening on port ${port}`);
};

/**
 * Прослушивание заданного порта на всех сетевых интерфейсах.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening.bind(this, port));

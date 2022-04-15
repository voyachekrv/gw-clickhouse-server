import * as request from 'supertest';
import { app } from '../app';

/**
 * Интеграционный тест передачи текста запроса на эндпоинт контроллера посещений
 */
describe('Visits query text test', () => {
	let currentApp: request.SuperTest<request.Test>;

	// Инициализация приложения в тестовой среде
	beforeEach(() => {
		currentApp = request(app);
	});

	/**
	 * Тест по умолчанию - получение значения без параметров
	 */
	test('Default positive test', async () => {
		const response = await currentApp.get(
			'/visits/query?text="SELECT * FROM gw_clickhouse.visit;"'
		);

		// Проверка кода ответа
		expect(response.statusCode).toBe(200);

		// Проверка JSON
		expect(response.body.length).toBeGreaterThan(0);
		expect(response.body[0]['item']).toBe('фильтр воздушный');
		expect(response.body[0]['price']).toBe(699);
		expect(response.body[0]['priceCurrency']).toBe('RUB');

		// Проверка заголовка
		expect(response.header['content-type']).toBe(
			'application/json; charset=utf-8'
		);
	});

	/**
	 * Тест по умолчанию - получение значения без параметров (SELECT COUNT(*))
	 */
	test('Default positive test (count)', async () => {
		const response = await currentApp.get(
			'/visits/query?text="SELECT count(*) as "count" FROM gw_clickhouse.visit;"'
		);

		// Проверка кода ответа
		expect(response.statusCode).toBe(200);

		expect(response.body[0]['count']).toBeDefined();
		expect(response.body[0]['count']).toBeGreaterThan(0);

		// Проверка заголовка
		expect(response.header['content-type']).toBe(
			'application/json; charset=utf-8'
		);
	});

	/**
	 * Негативное тестирование - отправка недопустимого запроса
	 */
	test('Negative test', () => {
		setTimeout(async () => {
			const response = await currentApp.get(
				'/visits/query?text="INSERT INTO gw_clickhouse.visit\n' +
					'(id, createdAt, traderId, ip, visitorId, item, price, priceCurrency)\n' +
					// eslint-disable-next-line
					'VALUES(\'\', \'\', \'\', \'\', \'\', \'\', 0, \'\');"'
			);

			// Проверка кода ответа
			expect(response.statusCode).toBe(400);
		}, 3000);
	});
});

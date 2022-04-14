import * as request from 'supertest';
import { app } from '../app';
import { executeQuery } from './test-utils';

/**
 * Интеграционный тест контроллера посещений интернет-магазина
 */
describe('Visits router test', () => {
	let currentApp: request.SuperTest<request.Test>;

	// Создание тестовой таблицы
	beforeAll(() => {
		executeQuery(`
			CREATE TABLE IF NOT EXISTS gw_clickhouse.visit_test
			(
    			id String,
    			createdAt DateTime,
    			traderId String,
    			ip String,
    			visitorId String,
    			item String,
    			price Float64,
    			priceCurrency String
			)
			ENGINE = MergeTree()
			PRIMARY KEY (id);
		`);
	});

	// Удаление тестовой таблицы
	afterAll(() => {
		executeQuery('DROP TABLE IF EXISTS gw_clickhouse.visit_test;');
	});

	// Инициализация приложения в тестовой среде
	beforeEach(() => {
		currentApp = request(app);
	});

	/**
	 * Тест на вставку значения
	 */
	test('Insert value', async () => {
		const response = await currentApp
			.post('/visits/94e11ef5-9357-4ee9-963a-b3ef03b40822')
			.set('Content-type', 'application/json')
			.send({
				name: 'фильтр воздушный',
				price: 699,
				priceCurrency: 'RUB',
				visitorId: '6f642bb3-9dc8-4fdd-a16c-f63a88729f2c'
			});

		// Проверка кода ответа
		expect(response.statusCode).toBe(201);

		// Проверка заголовка
		expect(response.header['content-type']).toBe(
			'text/plain; charset=utf-8'
		);
	});

	/**
	 * Тест по умолчанию - получение значения без параметров
	 */
	test('Default positive test', async () => {
		const response = await currentApp.get(
			'/visits/94e11ef5-9357-4ee9-963a-b3ef03b40822'
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
	 * Тест по умолчанию - получение значения с параметрами
	 */
	test('Default positive test with query params', async () => {
		const response = await currentApp.get(
			encodeURI(
				'/visits/94e11ef5-9357-4ee9-963a-b3ef03b40822' +
					'?where=item="фильтр воздушный"&orderBy=price&direction=ASC&limit=1&offset=0'
			)
		);

		// Код состояния
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
	 * Тест по умолчанию - получение значения с параметрами (дополнительный тест на параметр where)
	 */
	test('Default positive test with query params (where)', async () => {
		const response = await currentApp.get(
			encodeURI(
				'/visits/94e11ef5-9357-4ee9-963a-b3ef03b40822' +
					'?where=item="фильтр воздушный";priceCurrency="RUB"' +
					'&orderBy=price&direction=ASC&limit=1&offset=0'
			)
		);

		// Код состояния
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
	 * Негативный тест - невалидные входные данные
	 */
	test('Negative test with uncorrect query param data', async () => {
		const response = await currentApp.get(
			encodeURI(
				'/visits/94e11ef5-9357-4ee9-963a-b3ef03b40822' +
					'?where=dshkdsjlds&orderBy=sdssdsd&direction=dsdsdsd&limit=sddsds&offset=sddsdsds'
			)
		);

		// Код состояния
		expect(response.statusCode).toBe(400);

		// Проверка JSON
		expect(response.body['code']).toBe(400);

		// Проверка заголовка
		expect(response.header['content-type']).toBe(
			'application/json; charset=utf-8'
		);
	});

	/**
	 * Негативный тест - деструктивный тест
	 */
	test('Negative destructive test', () => {
		setTimeout(async () => {
			const response = await currentApp
				.get(encodeURI('/visits/qqqqqqqq?wwwwwwwww'))
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json');

			// Код состояния
			expect(response.statusCode).toBe(200);

			// Проверка заголовка
			expect(response.header['content-type']).toBe(
				'application/json; charset=utf-8'
			);

			// Проверка JSON
			expect(response.body.toString()).toBe('[]');
		}, 3000);
	});
});

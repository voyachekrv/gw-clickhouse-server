import * as request from 'supertest';
import { app } from '../app';
import { executeQuery } from './test-utils';

describe('Visits router', () => {
	beforeAll(() => {
		executeQuery(`
			CREATE TABLE gw_clickhouse.visit_test
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

	afterAll(() => {
		executeQuery('DROP TABLE IF EXISTS gw_clickhouse.visit_test;');
	});

	test('Insert value', async () => {
		const response = await request(app)
			.post('/visits/94e11ef5-9357-4ee9-963a-b3ef03b40822')
			.set('Content-type', 'application/json')
			.send({
				name: 'фильтр воздушный',
				price: 699,
				priceCurrency: 'RUB',
				visitorId: '6f642bb3-9dc8-4fdd-a16c-f63a88729f2c'
			});

		expect(response.statusCode).toBe(201);
	});

	test('Get list', async () => {
		const response = await request(app).get(
			'/visits/94e11ef5-9357-4ee9-963a-b3ef03b40822'
		);

		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBeGreaterThan(0);
		expect(response.body[0]['item']).toBe('фильтр воздушный');
		expect(response.body[0]['price']).toBe(699);
		expect(response.body[0]['priceCurrency']).toBe('RUB');
	});
});

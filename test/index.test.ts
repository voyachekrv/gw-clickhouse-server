import * as request from 'supertest';
import { app } from '../app';

describe('Routers', () => {
	test('Index router', async () => {
		const response = await request(app).get('/');

		expect(response.statusCode).toBe(200);
		expect(response.body[0]['user_id']).toBe(1);
		expect(response.body[0]['message']).toBe('Привет, мир!');
	});

	test('User router', async () => {
		const response = await request(app).get('/users');

		expect(response.statusCode).toBe(200);
		expect(response.body['name']).toBe('Users');
	});
});

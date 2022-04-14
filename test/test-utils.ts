import { clickhouse } from '../database/clickhouse-connector';

/**
 * Утилита для исполнения SQL-запроса в среде тестирования
 * @async
 * @param {string} query SQL-запрос
 * @return {void}
 */
export const executeQuery = async (query: string): Promise<void> => {
	try {
		await clickhouse.query(query).toPromise();
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
};

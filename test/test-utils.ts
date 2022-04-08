import { clickhouse } from '../database/clickhouse-config';

export const executeQuery = async (query: string): Promise<void> => {
	try {
		await clickhouse.query(query).toPromise();
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
};

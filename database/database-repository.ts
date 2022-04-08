import { Entity } from './domain/entity';
import { clickhouse } from './clickhouse-config';
import { QueryBuilder } from './query-builder';

export class DatabaseRepository<T extends Entity> {
	private readonly tableName: string;

	constructor(tableName: string) {
		this.tableName = tableName;
	}

	public createQueryBuilder(): QueryBuilder<T> {
		return new QueryBuilder<T>(this.buildTableName());
	}

	public buildTableName(): string {
		if (process.env.IS_DEVELOPMENT) {
			return `${this.tableName}_test`;
		}

		return this.tableName;
	}

	public async query(queryString: string): Promise<unknown> {
		try {
			return await clickhouse.query(queryString).toPromise();
		} catch (e) {
			throw new Error(e);
		}
	}

	public async save(entity: T): Promise<void> {
		const correctType = (
			value: string | number | boolean
		): string | number | boolean => {
			if (!isNaN(Number(value))) {
				return value;
			} else if (value.toString().match(/^\w.*\(.*\)$/gm)) {
				return value;
			} else if (
				value === true ||
				value === 'true' ||
				value === false ||
				value === 'false'
			) {
				return value;
			}

			return `'${value}'`;
		};

		const correctedValues = Object.keys(entity)
			.map(key => correctType(entity[key]))
			.splice(1, Object.keys(entity).length - 1);

		const keys = Object.keys(entity).splice(
			1,
			Object.keys(entity).length - 1
		);

		const query = `INSERT INTO ${
			process.env.DATABASE_NAME
		}.${this.buildTableName()} (id, createdAt, ${keys.join(', ')})
		VALUES (generateUUIDv4(), now() , ${correctedValues.join(', ')})`;

		try {
			await clickhouse.query(query).toPromise();
		} catch (e) {
			throw new Error(e);
		}
	}
}

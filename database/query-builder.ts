import { Entity } from './domain/entity';
import { clickhouse } from './clickhouse-config';

export class QueryBuilder<T extends Entity> {
	private query: string;

	private readonly table: string;

	constructor(table: string) {
		this.table = table;

		this.query = `SELECT * FROM ${process.env.DATABASE_NAME}.${this.table}`;
	}

	public select(fields: string[]): QueryBuilder<T> {
		if (fields.length > 0) {
			this.query = `SELECT * FROM ${process.env.DATABASE_NAME}.${this.table}`;
		}

		return this;
	}

	public where(condition: string): QueryBuilder<T> {
		this.query = `${this.query} WHERE ${condition}`;

		return this;
	}

	public andWhere(condition: string): QueryBuilder<T> {
		this.query = `${this.query} AND WHERE ${condition}`;

		return this;
	}

	public orWhere(condition: string): QueryBuilder<T> {
		this.query = `${this.query} OR WHERE ${condition}`;

		return this;
	}

	public orderBy(field: string, direction: 'ASC' | 'DESC') {
		this.query = `${this.query} ORDER BY ${field} ${direction}`;

		return this;
	}

	public async getMany(): Promise<T[]> {
		try {
			const result = await clickhouse.query(`${this.query};`).toPromise();

			return result.map(record => record as T);
		} catch (e) {
			throw new Error(e);
		}
	}

	public async getOne(): Promise<T> {
		try {
			const result = await clickhouse.query(`${this.query};`).toPromise();

			return result[0] as T;
		} catch (e) {
			throw new Error(e);
		}
	}
}

import { Entity } from './domain/entity';
import { clickhouse } from './clickhouse-connector';

/**
 * Построитель SQL-запросов типа SELECT для БД Clickhouse
 */
export class QueryBuilder<T extends Entity> {
	/**
	 * Текст запроса
	 * @type {string}
	 */
	private query: string;

	/**
	 * Название запрашиваемой таблицы
	 * @type {string}
	 * @readonly
	 */
	private readonly table: string;

	/**
	 * @param {string} table Название таблицы
	 */
	constructor(table: string) {
		this.table = table;

		this.query = `SELECT * FROM ${process.env.DATABASE_NAME}.${this.table}`;
	}

	/**
	 * Выборка полей в секции запроса SELECT
	 * @param {string[]} fields Список запрашиваемых полей
	 * @return {QueryBuilder}
	 */
	public select(fields: string[]): QueryBuilder<T> {
		if (fields.length > 0) {
			this.query = `SELECT ${fields.join(', ')} FROM ${
				process.env.DATABASE_NAME
			}.${this.table}`;
		}

		return this;
	}

	/**
	 * Создание секции WHERE в запросе
	 * @param {string} condition условие, заданное в секции
	 * @return {QueryBuilder}
	 */
	public where(condition: string): QueryBuilder<T> {
		this.query = `${this.query} WHERE ${condition}`;

		return this;
	}

	/**
	 * Создание секции AND WHERE в запросе
	 * @param {string} condition условие, заданное в секции
	 * @return {QueryBuilder}
	 */
	public andWhere(condition: string): QueryBuilder<T> {
		this.query = `${this.query} AND ${condition}`;

		return this;
	}

	/**
	 * Создание секции OR WHERE в запросе
	 * @param {string} condition условие, заданное в секции
	 * @return {QueryBuilder}
	 */
	public orWhere(condition: string): QueryBuilder<T> {
		this.query = `${this.query} OR ${condition}`;

		return this;
	}

	/**
	 * Создание секции ORDER BY в запросе
	 * @param {string} field поле, по которому происходит сортировка
	 * @param {'ASC' | 'DESC'} direction направление сортировки
	 * @return {QueryBuilder}
	 */
	public orderBy(field: string, direction: 'ASC' | 'DESC'): QueryBuilder<T> {
		this.query = `${this.query} ORDER BY ${field} ${direction}`;

		return this;
	}

	/**
	 * Создание секции LIMIT в запросе
	 * @param {number} count Количество записей
	 * @return {QueryBuilder}
	 */
	public limit(count = 0): QueryBuilder<T> {
		this.query = `${this.query} LIMIT ${count} `;

		return this;
	}

	/**
	 * Создание секции OFFSET в запросе
	 * @param {number} count Количество записей
	 * @return {QueryBuilder}
	 */
	public offset(count = 0): QueryBuilder<T> {
		this.query = `${this.query} OFFSET ${count} `;

		return this;
	}

	/**
	 * Получение списка сущностей в результате выполнения запроса
	 * @async
	 * @return {object[]}
	 */
	public async getMany(): Promise<T[]> {
		const queryText = `${this.query};`;

		try {
			const result = await clickhouse.query(queryText).toPromise();

			return result.map(record => record as T);
		} catch (e) {
			throw new Error(e);
		}
	}

	public __dumpQuery(): string {
		return `${this.query};`;
	}

	/**
	 * Получение единственной сущности в результате выполнения запроса
	 * @async
	 * @return {object[]}
	 */
	public async getOne(): Promise<T> {
		try {
			const result = await clickhouse.query(`${this.query};`).toPromise();

			return result[0] as T;
		} catch (e) {
			throw new Error(e);
		}
	}
}

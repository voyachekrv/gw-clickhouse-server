import { Entity } from './domain/entity';
import { clickhouse } from './clickhouse-connector';
import { QueryBuilder } from './query-builder';

/**
 * Репозиторий для сущности, хранящейся в таблице БД Clickhouse
 */
export class DatabaseRepository<T extends Entity> {
	/**
	 * Название таблицы
	 * @type {string}
	 */
	private readonly tableName: string;

	/**
	 * @param {string} tableName Название таблицы
	 */
	constructor(tableName: string) {
		this.tableName = tableName;
	}

	/**
	 * Создание нового экземпляра построителя SELECT-запросов
	 * @return {QueryBuilder}
	 */
	public createQueryBuilder(): QueryBuilder<T> {
		return new QueryBuilder<T>(this.buildTableName());
	}

	/**
	 * Построение названия таблицы в зависимости от режима разработки
	 * @return {string}
	 */
	public buildTableName(): string {
		if (process.env.IS_DEVELOPMENT === 'true') {
			return `${this.tableName}_test`;
		}

		return this.tableName;
	}

	/**
	 * Исполнение переданного SQL-запроса
	 * @async
	 * @param {string} queryString строка запроса
	 * @return {object}
	 */
	public async query(queryString: string): Promise<unknown> {
		try {
			return await clickhouse.query(queryString).toPromise();
		} catch (e) {
			throw new Error(e);
		}
	}

	/**
	 * Сохранение сущности в базу данных
	 * @async
	 * @param {object} entity Данные сохраняемой сущности
	 * @return {void}
	 */
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
			.splice(0, Object.keys(entity).length);

		const keys = Object.keys(entity).splice(0, Object.keys(entity).length);

		const query = `INSERT INTO ${
			process.env.DATABASE_NAME
		}.${this.buildTableName()} (id, createdAt, ${keys.join(', ')})
		VALUES (generateUUIDv4(), now(), ${correctedValues.join(', ')})`;

		try {
			await clickhouse.query(query).toPromise();
		} catch (e) {
			throw new Error(e);
		}
	}
}

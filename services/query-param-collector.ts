type AscDescAlias = 'ASC' | 'DESC';

/**
 * Коллектор query-параметров с преобразованием их в элементы строки SQL-запроса
 */
export class QueryParamCollector {
	private readonly where?: string[];

	private readonly orderBy?: string;

	private readonly direction?: AscDescAlias;

	private readonly limit?: number;

	private readonly offset?: number;

	constructor(reqQuery: any) {
		if (reqQuery['where']) {
			this.where = reqQuery['where'].split(';');
		}

		if (reqQuery['orderBy']) {
			this.orderBy = reqQuery['orderBy'];
		}

		if (reqQuery['direction']) {
			this.direction = reqQuery['direction'];
		}

		if (reqQuery['limit']) {
			this.limit = reqQuery['limit'];
		}

		if (reqQuery['offset']) {
			this.offset = reqQuery['offset'];
		}
	}

	/**
	 * Список параметров, задаваемых через ключевое слово WHERE
	 * @type {string[]}
	 */
	public getWhere(): string[] {
		return this.where;
	}

	/**
	 * Параметр, по которому производится сортировка
	 * @type {string[]}
	 */
	public getOrderBy(): string {
		return this.orderBy;
	}

	/**
	 * Направление сортировки
	 * @type {AscDescAlias}
	 */
	public getDirection(): AscDescAlias {
		return this.direction;
	}

	/**
	 * Лимит количества записей
	 * @type {number}
	 */
	public getLimit(): number {
		return this.limit;
	}

	/**
	 * Пропуск количества записей
	 * @type {number}
	 */
	public getOffset(): number {
		return this.offset;
	}
}

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

	public getWhere(): string[] {
		return this.where;
	}

	public getOrderBy(): string {
		return this.orderBy;
	}

	public getDirection(): AscDescAlias {
		return this.direction;
	}

	public getLimit(): number {
		return this.limit;
	}

	public getOffset(): number {
		return this.offset;
	}
}

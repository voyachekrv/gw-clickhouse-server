import { Visit } from '../database/domain/visit';

/**
 * Валидатор query-параметров.
 */
export class QueryParamValidator {
	/**
	 * Объект с query-параметрами из URL
	 * @type {object}
	 */
	private readonly reqQuery: any;

	/**
	 * @param {object} reqQuery query-параметры из URL
	 */
	constructor(reqQuery: any) {
		this.reqQuery = reqQuery;
	}

	/**
	 * Результат валидации query-параметров.
	 * @return {boolean}
	 */
	public validate(): boolean {
		let result = true;

		/**
		 * Обновление результата в зависимости от успешности прохождения валидации.
		 * @param {string} field название поля
		 * @param {Function} validator валидатор, отрабатывающий при запросе валидации заданного поля
		 * @return {void}
		 */
		const changeResult = (
			field: string,
			validator: (str?: string) => boolean
		): void => {
			if (this.reqQuery[field]) {
				result &&= validator(field);
			}
		};

		/**
		 * Валидатор позитивного целого числа.
		 * @param {number} int число для валидации
		 * @return {boolean}
		 */
		const validatePositiveInteger = (int: number): boolean => {
			return int >>> 0 === parseFloat(int.toString());
		};

		changeResult('where', this.validateWhereSection.bind(this));
		changeResult('orderBy', this.validateOrderBySection.bind(this));
		changeResult('direction', this.validateDirectionSection.bind(this));
		changeResult(
			'limit',
			validatePositiveInteger.bind(this, this.reqQuery['limit'])
		);
		changeResult(
			'offset',
			validatePositiveInteger.bind(this, this.reqQuery['offset'])
		);

		return result;
	}

	/**
	 *  Валидация параметра where
	 *  @return {boolean}
	 */
	private validateWhereSection(): boolean {
		const wherePairs = this.reqQuery['where'].split(';');

		for (const pair of wherePairs) {
			if (pair.match(/^\w+=(.*|".*"|'.*')$/) === null) {
				return false;
			}
		}

		const currentWhereParams = {};

		for (const pair of wherePairs) {
			const [key, value] = pair.split('=');
			currentWhereParams[key] = value;

			// eslint-disable-next-line
			if (value === '' || value === "''" || value === '""') {
				return false;
			}

			if (!key || !value) {
				return false;
			}
		}

		/**
		 *  Получение информации из метаданных сущности - является ли тип валидируемого параметра заключаемым в кавычки
		 *  @param {string} name
		 *  @return {string}
		 */
		const getQuotable = (name: string): 'true' | 'false' => {
			const rec = Visit.MetaData.fieldsQuotable.find(x => x[name]);

			return rec[Object.keys(rec)[0]];
		};

		for (const key of Object.keys(currentWhereParams)) {
			if (Visit.MetaData.fields.indexOf(key) === -1) {
				return false;
			}

			if (getQuotable(key) === 'true') {
				if (currentWhereParams[key].match(/^'.*'|".*"$/) === null) {
					return false;
				}
			} else if (
				currentWhereParams[key].match(/^(true|false|\d*)$/) === null
			) {
				return false;
			}
		}

		return true;
	}

	/**
	 *  Валидация параметра orderBy
	 *  @return {boolean}
	 */
	private validateOrderBySection(): boolean {
		return Visit.MetaData.fields.indexOf(this.reqQuery['orderBy']) !== -1;
	}

	/**
	 *  Валидация параметра direction
	 *  @return {boolean}
	 */
	private validateDirectionSection(): boolean {
		return (
			this.reqQuery['direction'].match(/^(ASC|DESC|asc|desc)$/) !== null
		);
	}
}

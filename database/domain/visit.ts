import { Entity } from './entity';

/**
 * Сущность - посещение страницы
 */
export class Visit extends Entity {
	constructor(
		traderId?: string,
		ip?: string,
		visitorId?: string,
		item?: string,
		price?: number,
		priceCurrency?: string
	) {
		super();
		this.traderId = traderId;
		this.ip = ip;
		this.visitorId = visitorId;
		this.item = item;
		this.price = price;
		this.priceCurrency = priceCurrency;
	}

	/**
	 * UUID интернет-магазина
	 * @type {string}
	 */
	public traderId: string;

	/**
	 * IP посетителя страницы
	 * @type {string}
	 */
	public ip: string;

	/**
	 * UUID посетителя страницы
	 * @type {string}
	 */
	public visitorId: string;

	/**
	 * Название просмотренного товара
	 * @type {string}
	 */
	public item: string;

	/**
	 * Цена просмотренного товара
	 * @type {number}
	 */
	public price: number;

	/**
	 * Валюта цены просмотренного товара
	 * @type {number}
	 */
	public priceCurrency: string;

	/**
	 * Метаданные сущности
	 */
	public static MetaData = class {
		/**
		 * Список полей с параметром - является ли значение поля заключаемым в кавычки в тексте SQL-запроса
		 * @type {object}
		 */
		public static readonly fieldsQuotable: Record<
			string,
			'true' | 'false'
		>[] = [
			{ traderId: 'true' },
			{ ip: 'true' },
			{ visitorId: 'true' },
			{ item: 'true' },
			{ price: 'false' },
			{ priceCurrency: 'true' }
		];

		/**
		 * Список полей сущности
		 * @type {string[]}
		 */
		public static readonly fields = [
			'traderId',
			'ip',
			'visitorId',
			'item',
			'price',
			'priceCurrency'
		];
	};
}

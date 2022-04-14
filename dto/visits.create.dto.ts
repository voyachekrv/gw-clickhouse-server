/**
 * Данные для создания записи о посещении определённого товара в интернет-магазине
 */
export interface VisitsCreateDto {
	/**
	 * Идентификатор посетителя
	 * @type {string}
	 */
	visitorId: string;

	/**
	 * Название товара
	 * @type {string}
	 */
	name: string;

	/**
	 * Стоимость товара
	 * @type {number}
	 */
	price: number;

	/**
	 * Валюта, в которой указана стоимость товара
	 * @type {string}
	 */
	priceCurrency: string;
}

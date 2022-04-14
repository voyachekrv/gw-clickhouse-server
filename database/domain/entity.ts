/**
 * Базовая сущность, наследовать которую должна любая сущность, сохраняемая в аналитической БД
 * @abstract
 */
export abstract class Entity {
	/**
	 * UUID записи
	 * @type {string}
	 */
	public id: string;

	/**
	 * Дата и время создания
	 * @type {string | Date}
	 */
	public createdAt: string | Date;
}

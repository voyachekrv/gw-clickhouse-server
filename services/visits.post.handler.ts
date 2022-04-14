import { DatabaseRepository } from '../database/database-repository';
import { Visit } from '../database/domain/visit';
import { VisitsCreateDto } from '../dto/visits.create.dto';

/**
 *  Обработчик, вызываемый по маршруту /visits/:traderId с HTTP-методом POST
 *  @async
 *  @param {string} trader ID интернет-магазина
 *  @param {string} ip IP-адрес посетителя интернет-магазина
 *  @param {string} body Тело HTTP-запроса
 *  @return {void}
 */
export const visitsPostHandler = async (
	trader: string,
	ip: string,
	body: VisitsCreateDto
): Promise<void> => {
	const repository = new DatabaseRepository<Visit>('visit');

	const visit = new Visit(
		trader,
		ip,
		body.visitorId,
		body.name,
		body.price,
		body.priceCurrency
	);

	await repository.save(visit);
};

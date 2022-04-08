import { DatabaseRepository } from '../database/database-repository';
import { Visit } from '../database/domain/visit';
import { VisitsCreateDto } from '../dto/visits.create.dto';

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

import { Visit } from '../database/domain/visit';
import { DatabaseRepository } from '../database/database-repository';

export const visitsGetHandler = async (traderId: string): Promise<Visit[]> => {
	const repository = new DatabaseRepository<Visit>('visit');

	return await repository
		.createQueryBuilder()
		.where(`${repository.buildTableName()}.traderId = '${traderId}'`)
		.orderBy('id', 'DESC')
		.getMany();
};

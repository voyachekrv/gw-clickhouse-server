import { Visit } from '../database/domain/visit';
import { DatabaseRepository } from '../database/database-repository';

/**
 *  Обработчик, вызываемый по маршруту /visits/query
 *  @async
 *  @param {string} query Текст запроса
 *  @return {Visit[]}
 */
export const visitsSqlGetHandler = async (query: any): Promise<unknown> => {
	const repository = new DatabaseRepository<Visit>('visit');

	return await repository.query(query);
};

import { Visit } from '../database/domain/visit';
import { DatabaseRepository } from '../database/database-repository';
import { QueryParamCollector } from './query-param-collector';

/**
 *  Обработчик, вызываемый по маршруту /visits/:traderId
 *  @async
 *  @param {string} traderId ID интернет-магазина
 *  @param reqQuery
 *  @return {Visit}
 */
export const visitsGetHandler = async (
	traderId: string,
	reqQuery: any
): Promise<Visit[]> => {
	const repository = new DatabaseRepository<Visit>('visit');

	const collector = new QueryParamCollector(reqQuery);

	const queryBuilder = repository.createQueryBuilder();

	queryBuilder.where(
		`${repository.buildTableName()}.traderId = '${traderId}'`
	);

	if (reqQuery['where']) {
		for (const param of collector.getWhere()) {
			// eslint-disable-next-line
			queryBuilder.andWhere(`${repository.buildTableName()}.${param.replace(/"/g, "'")}`);
		}
	}

	if (reqQuery['orderBy']) {
		if (reqQuery['direction']) {
			queryBuilder.orderBy(
				`${repository.buildTableName()}.${collector.getOrderBy()}`,
				collector.getDirection()
			);
		} else {
			queryBuilder.orderBy(
				`${repository.buildTableName()}.${collector.getOrderBy()}`,
				'ASC'
			);
		}
	}

	if (reqQuery['limit']) {
		queryBuilder.limit(collector.getLimit());
	}

	if (reqQuery['offset']) {
		queryBuilder.offset(collector.getOffset());
	}

	return await queryBuilder.getMany();
};

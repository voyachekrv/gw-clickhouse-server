import { Router } from 'express';
import { Request, Response } from 'express/ts4.0';
import { clickhouse } from '../database/clickhouse-config';

const indexRouter: Router = Router();

indexRouter.get('/', async (req: Request, res: Response) => {
	const data = await clickhouse
		.query('SELECT * FROM gw_clickhouse.my_first_table;')
		.toPromise();

	res.json(data);
});

export default indexRouter;

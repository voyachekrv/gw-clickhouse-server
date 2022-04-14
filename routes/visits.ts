import { Router } from 'express';
import { Request, Response } from 'express/ts4.0';
import { visitsPostHandler } from '../services/visits.post.handler';
import { visitsGetHandler } from '../services/visits.get.handler';
import { QueryParamValidator } from '../services/query-param-validator';

const visitsRouter: Router = Router();

/**
 * Callback, вызываемый по маршруту /visits/:traderId с методом GET
 */
visitsRouter.get('/:trader', async (req: Request, res: Response) => {
	const validator = new QueryParamValidator(req.query);

	const result = validator.validate();
	if (!result) {
		res.status(400).json({ code: 400, error: 'Bad request' });
		return;
	}

	const resp = await visitsGetHandler(req.params['trader'], req.query);

	res.status(200).json(resp);
});

/**
 * Callback, вызываемый по маршруту /visits/:traderId с методом POST
 */
visitsRouter.post('/:trader', async (req: Request, res: Response) => {
	if (!req.body) {
		res.sendStatus(400);
	}

	try {
		await visitsPostHandler(req.params['trader'], req.clientIp, req.body);

		res.sendStatus(201);
	} catch (e) {
		res.sendStatus(500);
	}
});

export default visitsRouter;

import { Router } from 'express';
import { Request, Response } from 'express/ts4.0';
import { visitsPostHandler } from '../services/visits.post.handler';
import { visitsGetHandler } from '../services/visits.get.handler';

const visitsRouter: Router = Router();

visitsRouter.get('/:trader', async (req: Request, res: Response) => {
	res.json(await visitsGetHandler(req.params['trader']));
});

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

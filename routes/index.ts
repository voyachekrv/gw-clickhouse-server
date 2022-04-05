import { Router } from 'express';
import { Request, Response } from 'express/ts4.0';

const indexRouter: Router = Router();

indexRouter.get('/', (req: Request, res: Response) => {
	res.json({ name: 'index' });
});

export default indexRouter;

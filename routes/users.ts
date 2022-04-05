import { Router } from 'express';
import { Request, Response } from 'express/ts4.0';

export const usersRouter: Router = Router();

usersRouter.get('/', (req: Request, res: Response) => {
	res.json({ name: 'Users' });
});

export default usersRouter;

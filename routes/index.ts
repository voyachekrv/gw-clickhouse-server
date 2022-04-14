import { Router } from 'express';
import { Request, Response } from 'express/ts4.0';

const indexRouter: Router = Router();

/**
 * Callback, вызываемый по запросу на URL по умолчанию
 */
indexRouter.get('/', (req: Request, res: Response) => {
	res.json({ version: process.env.npm_package_version });
});

export default indexRouter;

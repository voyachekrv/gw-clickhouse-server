import { Router } from 'express';

const indexRouter = Router();

indexRouter.get('/', (req, res) => {
	res.json({ name: 'index' });
});

export default indexRouter;

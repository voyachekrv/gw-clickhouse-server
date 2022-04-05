import { Router } from 'express';

export const usersRouter = Router();

usersRouter.get('/', (req, res) => {
	res.json({ name: 'Users' });
});

export default usersRouter;

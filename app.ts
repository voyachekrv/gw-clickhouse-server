import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as dotenv from 'dotenv';
import * as requestIp from 'request-ip';
import * as cors from 'cors';

import indexRouter from './routes/index';
import visitsRouter from './routes/visits';

import { Express } from 'express/ts4.0';

dotenv.config();

/**
 *  Инициализация Express-приложения
 */
export const app: Express = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(requestIp.mw());

app.use('/', indexRouter);
app.use('/visits', visitsRouter);

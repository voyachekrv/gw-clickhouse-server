/* eslint-disable camelcase */

import { ClickHouse } from 'clickhouse';
import { ClickhouseConfig } from '../clickhouse.config';

/**
 * Подключение к БД Clickhouse
 */
export const clickhouse: ClickHouse = new ClickHouse({ ...ClickhouseConfig });

/* eslint-disable camelcase */

import { ClickHouse } from 'clickhouse';

export const clickhouse: ClickHouse = new ClickHouse({
	url: process.env.DATABASE_ADDRESS || 'http://localhost',
	port: process.env.DATABASE_PORT || 8123,
	debug: false,
	basicAuth: {
		username: process.env.DATABASE_USER_NAME,
		password: process.env.DATABASE_USER_PASSWORD
	},
	isUseGzip: false,
	trimQuery: false,
	usePost: false,
	format: 'json',
	config: {
		session_timeout: 60,
		output_format_json_quote_64bit_integers: 0,
		enable_http_compression: 0,
		database: process.env.DATABASE_NAME
	}
});

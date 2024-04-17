import Debug from 'debug';
import pg from 'pg';
import 'dotenv/config';

const debug = Debug('app:pgclient');
const { Pool } = pg;

/**
 * Instance of pg Pool. It will connect to the PostgreSQL database
 * using the connection string from the environment variables.
 * @type {Pool} pool
 *
 */
const pool = new Pool({ connectionString: process.env.PGURL });

/**
 * A client dedicated to the connection pool. It's used to query the database.
 * @type {PoolClient} client
 */
const client = await pool.connect();

debug('connected to database');

export default client;

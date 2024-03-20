import Debug from 'debug';
import pkg from 'pg';
import 'dotenv/config';

const { Pool } = pkg;

const debug = Debug('app:client');
const pool = new Pool({ connectionString: process.env.PGURL });
const client = await pool.connect();
debug('connected to database');
export default client;

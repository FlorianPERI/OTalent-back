import Debug from 'debug';
import pkg from 'pg';

const { Pool } = pkg;

const debug = Debug('app:client');
const pool = new Pool();
const client = await pool.connect();
debug('connected to database');
export default client;

import postgres from 'postgres'

const sql = postgres('postgres://username:password@host:port/database', {
  host                 : PGHOST,            // Postgres ip address[es] or domain name[s]
  port                 : 5432,              // Postgres server port[s]
  database             : PGDATABASE,        // Name of database to connect to
  username             : PGUSER,            // Username of database user
  password             : PGPASSWORD,        // Password of database user
  ssl                  : PGSSLMODE          // true, prefer, require, tls.connect options
})

export default sql;
import mariadb from 'mariadb'

// Create a connection pool to the MariaDB database using environment variables.
const pool = mariadb.createPool({
  host: process.env.MARIADB_HOST || 'localhost',
  user: process.env.MARIADB_USER || 'root',
  password: process.env.MARIADB_PASSWORD || '',
  database: process.env.MARIADB_DATABASE || 'BlockLearn',
  connectionLimit: 10
})

export default pool

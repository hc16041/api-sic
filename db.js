const { Pool } = require('pg');

//se crea la configuracion de la conexion
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sic',
  password: 'sunamiboy3007',
  port: 5432,
});

module.exports = { pool };

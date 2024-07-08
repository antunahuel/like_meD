import pg from 'pg'
const { Pool } = pg
 
const pool = new Pool({
  user: 'postgres',
  password: '123456',
  host: 'localhost',
  port: 5432,
  database: 'likeme',
})

// let fecha = await pool.query("SELECT NOW()");
// console.log(fecha.rows);//ruta prueba conexión database node .\dataBase\db.js
export default pool;
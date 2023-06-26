const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'tienda',
});

conn.connect((error) => {
  if (error) throw error;
  console.log('Conexión exitosa a la base de datos.');
});

module.exports = conn;


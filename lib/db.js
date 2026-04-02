import mysql from "mysql2/promise";

let pool = null;

function getPool() {
  if (pool) return pool;

  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("Missing DATABASE_URL environment variable");
  }

  pool = mysql.createPool({
    uri: url,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
  });

  return pool;
}

export async function query(sql, params) {
  const [rows] = await getPool().query(sql, params);
  return rows;
}

export async function execute(sql, params) {
  const [result] = await getPool().execute(sql, params);
  return result;
}

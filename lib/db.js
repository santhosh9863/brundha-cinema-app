import mysql from "mysql2/promise";

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(process.env.DATABASE_URL);
  }
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
import pool from '../config/postgres-db.js';

export const getAllEntries = async tableName => {
  const query = `SELECT * FROM ${tableName}`;
  const result = await pool.query(query);
  return result.rows;
};

export const getEntriesByQuery = async (tableName, idColumn, idValue) => {
  const query = `SELECT * FROM ${tableName} WHERE ${idColumn} = $1`;
  const result = await pool.query(query, [idValue]);
  return result.rows;
};

export const insertEntry = async (tableName, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const columns = keys.join(', ');
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

  const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateEntryById = async (
  tableName,
  idColumn,
  idValue,
  updateData,
) => {
  const keys = Object.keys(updateData);
  const values = Object.values(updateData);

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const query = `UPDATE ${tableName} SET ${setClause} WHERE ${idColumn} = $${
    keys.length + 1
  } RETURNING *`;

  const result = await pool.query(query, [...values, idValue]);
  return result.rows[0];
};

export const deleteEntryById = async (tableName, idColumn, idValue) => {
  const query = `DELETE FROM ${tableName} WHERE ${idColumn} = $1 RETURNING *`;
  const result = await pool.query(query, [idValue]);
  return result.rows[0];
};

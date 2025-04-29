import pool from '../config/postgres-db.js';
import createTableQueries from './data.js';

const createTables = async () => {
  if (!createTableQueries || Object.keys(createTableQueries).length === 0) {
    return console.log('No tables to create.');
  }

  try {
    for (const table in createTableQueries) {
      const query = createTableQueries[table];
      await pool.query(query);
      console.log(`Table ${table} created successfully.`);
    }
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

export default createTables;

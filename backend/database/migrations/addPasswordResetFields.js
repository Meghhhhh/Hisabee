import pool from '../../config/postgres-db.js';

const addPasswordResetFields = async () => {
  try {
    // Check if columns already exist
    const checkColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('password_reset_token', 'password_reset_expires_at')
    `);

    const existingColumns = checkColumns.rows.map(row => row.column_name);

    // Add password_reset_token if it doesn't exist
    if (!existingColumns.includes('password_reset_token')) {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN password_reset_token VARCHAR(6)
      `);
      console.log('Added password_reset_token column');
    }

    // Add password_reset_expires_at if it doesn't exist
    if (!existingColumns.includes('password_reset_expires_at')) {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN password_reset_expires_at TIMESTAMP
      `);
      console.log('Added password_reset_expires_at column');
    }

    console.log('Password reset fields migration completed successfully');
  } catch (error) {
    console.error('Error adding password reset fields:', error);
    throw error;
  }
};

export default addPasswordResetFields;


import {
  getAllEntries,
  getEntriesByQuery,
  insertEntry,
  updateEntryById,
  deleteEntryById,
} from '../utils/queryHelper.js';
import Joi from 'joi';
import pool from '../config/postgres-db.js';

export const getAllUsers = async () => {
  const users = await getAllEntries('users');
  return users;
};

export const getUserById = async id => {
  const user = await getEntriesByQuery('users', 'user_id', id);
  if (!user[0]) return null;

  const friendsQuery = `
    SELECT u.user_id, u.name, u.email, f.status
    FROM friends f
    JOIN users u ON u.user_id = CASE
      WHEN f.user_id = $1 THEN f.friend_id
      WHEN f.friend_id = $1 THEN f.user_id
      ELSE NULL
    END
    WHERE (f.user_id = $1 OR f.friend_id = $1)
      AND f.status = 'accepted';
  `;
  const friendsResult = await pool.query(friendsQuery, [id]);

  const hisabsQuery = `
    SELECT * FROM hisabs
    WHERE created_by = $1
    ORDER BY created_at DESC;
  `;
  const hisabsResult = await pool.query(hisabsQuery, [id]);

  return {
    ...user[0],
    friends: friendsResult.rows,
    hisabs: hisabsResult.rows,
  };
};

export const getOneUserByQuery = async (column, value) => {
  const user = await getEntriesByQuery('users', column, value);
  return user[0] ? user[0] : null;
};

export const createUser = async payload => {
  const user = await insertEntry('users', payload);
  return user;
};

export const updateUser = async (id, payload) => {
  const user = await updateEntryById('users', 'user_id', id, payload);
  return user;
};

export const deleteUser = async id => {
  const user = await deleteEntryById('users', 'user_id', id);
  return user;
};

export const sendFriendRequest = async (user_id, friend_id) => {
  // Prevent duplicate requests or self-request
  if (user_id === friend_id) throw new Error('Cannot add yourself as a friend');
  // Check if already exists
  const check = await pool.query(
    'SELECT * FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)',
    [user_id, friend_id],
  );
  if (check.rows.length > 0)
    throw new Error('Friend request already exists or already friends');
  // Insert friend request
  const res = await pool.query(
    'INSERT INTO friends (user_id, friend_id, status) VALUES ($1, $2, $3) RETURNING *',
    [user_id, friend_id, 'pending'],
  );
  return res.rows[0];
};

export const getUserIdByEmail = async email => {
  const user = await pool.query('SELECT user_id FROM users WHERE email = $1', [
    email,
  ]);
  return user.rows[0]?.user_id || null;
};

export const getOutgoingFriendRequests = async user_id => {
  const res = await pool.query(
    `SELECT u.user_id, u.email, u.name, f.status
     FROM friends f
     JOIN users u ON u.user_id = f.friend_id
     WHERE f.user_id = $1 AND f.status = 'pending'`,
    [user_id],
  );
  return res.rows;
};

export const getIncomingFriendRequests = async user_id => {
  const res = await pool.query(
    `SELECT u.user_id, u.email, u.name, f.status
     FROM friends f
     JOIN users u ON u.user_id = f.user_id
     WHERE f.friend_id = $1 AND f.status = 'pending'`,
    [user_id],
  );
  return res.rows;
};

export const acceptFriendRequest = async (user_id, friend_id) => {
  // user_id is the recipient, friend_id is the sender
  const res = await pool.query(
    `UPDATE friends SET status = 'accepted' WHERE user_id = $1 AND friend_id = $2 AND status = 'pending' RETURNING *`,
    [friend_id, user_id],
  );
  return res.rows[0];
};

export const rejectFriendRequest = async (user_id, friend_id) => {
  // user_id is the recipient, friend_id is the sender
  const res = await pool.query(
    `DELETE FROM friends WHERE user_id = $1 AND friend_id = $2 AND status = 'pending' RETURNING *`,
    [friend_id, user_id],
  );
  return res.rows[0];
};

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base':
        'Password must contain at least one letter and one number',
      'any.required': 'Password is required',
    }),
  firstName: Joi.string().allow('', null), // Optional
  lastName: Joi.string().allow('', null), // Optional
});

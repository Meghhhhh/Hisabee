import {
  getAllEntries,
  getEntriesByQuery,
  insertEntry,
  updateEntryById,
  deleteEntryById,
} from '../utils/queryHelper.js';
import pool from '../config/postgres-db.js';

export const getAllTransactions = async () => getAllEntries('transactions');

export const getTransactionById = async id => {
  const transaction = await getEntriesByQuery(
    'transactions',
    'transaction_id',
    id,
  );
  if (!transaction[0]) return null;
  const contributors = await pool.query(
    'SELECT u.user_id, u.name, tc.contributed_amount, tc.mode_of_payment FROM transaction_contributors tc JOIN users u ON tc.user_id = u.user_id WHERE tc.transaction_id = $1',
    [id],
  );
  return { ...transaction[0], contributors: contributors.rows };
};

export const createTransaction = async payload =>
  insertEntry('transactions', payload);

export const updateTransaction = async (id, payload) =>
  updateEntryById('transactions', 'transaction_id', id, payload);

export const deleteTransaction = async id =>
  deleteEntryById('transactions', 'transaction_id', id);

export const addContributor = async (
  transaction_id,
  user_id,
  contributed_amount,
  mode_of_payment,
) => {
  const res = await insertEntry('transaction_contributors', {
    transaction_id,
    user_id,
    contributed_amount,
    mode_of_payment,
  });
  return res;
};

export const removeContributor = async (transaction_id, user_id) => {
  const res = await pool.query(
    'DELETE FROM transaction_contributors WHERE transaction_id = $1 AND user_id = $2 RETURNING *',
    [transaction_id, user_id],
  );
  return res.rows[0];
};

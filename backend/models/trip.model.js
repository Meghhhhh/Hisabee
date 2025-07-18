import {
  getAllEntries,
  getEntriesByQuery,
  insertEntry,
  updateEntryById,
  deleteEntryById,
} from '../utils/queryHelper.js';
import pool from '../config/postgres-db.js';

export const getAllTrips = async () => getAllEntries('hisabs');

export const getTripById = async id => {
  const trip = await getEntriesByQuery('hisabs', 'hisab_id', id);
  if (!trip[0]) return null;
  const participants = await pool.query(
    'SELECT u.user_id, u.name, hc.budget_contribution FROM hisab_contributors hc JOIN users u ON hc.user_id = u.user_id WHERE hc.hisab_id = $1',
    [id],
  );
  return { ...trip[0], participants: participants.rows };
};

export const createTrip = async payload => insertEntry('hisabs', payload);

export const updateTrip = async (id, payload) =>
  updateEntryById('hisabs', 'hisab_id', id, payload);

export const deleteTrip = async id => deleteEntryById('hisabs', 'hisab_id', id);

export const addParticipant = async (
  hisab_id,
  user_id,
  budget_contribution,
) => {
  const res = await insertEntry('hisab_contributors', {
    hisab_id,
    user_id,
    budget_contribution,
  });
  return res;
};

export const removeParticipant = async (hisab_id, user_id) => {
  const res = await pool.query(
    'DELETE FROM hisab_contributors WHERE hisab_id = $1 AND user_id = $2 RETURNING *',
    [hisab_id, user_id],
  );
  return res.rows[0];
};

import {
  getAllEntries,
  getEntriesByQuery,
  insertEntry,
  updateEntryById,
  deleteEntryById,
} from '../utils/queryHelper.js';

export const getAllUsers = async () => {
  const users = await getAllEntries('users');
  return users;
};

export const getUserById = async id => {
  const user = await getEntriesByQuery('users', 'user_id', id);
  return user;
};

export const getUserByQuery = async (column, value) => {
  const user = await getEntriesByQuery('users', column, value);
  return user;
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

import {
  getAllEntries,
  getEntriesByQuery,
  insertEntry,
  updateEntryById,
  deleteEntryById,
} from '../utils/queryHelper.js';
import Joi from 'joi';

export const getAllUsers = async () => {
  const users = await getAllEntries('users');
  return users;
};

export const getUserById = async id => {
  const user = await getEntriesByQuery('users', 'user_id', id);
  return user;
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

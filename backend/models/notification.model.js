import {
  getEntriesByQuery,
  insertEntry,
  updateEntryById,
  deleteEntryById,
} from '../utils/queryHelper.js';

export const getNotificationsForUser = async userId => {
  const notifications = await getEntriesByQuery(
    'notifications',
    'receive_user_id',
    userId,
  );
  return notifications;
};

export const createNotification = async payload => {
  const notification = await insertEntry('notifications', payload);
  return notification;
};

export const updateNotification = async notification_id => {
  const updatedNotification = await updateEntryById(
    'notifications',
    'notification_id',
    notification_id,
    {
      is_read: true,
    },
  );

  return updatedNotification;
};

export const deleteNotification = async notification_id => {
  const deletedNotification = await deleteEntryById(
    'notifications',
    'notification_id',
    notification_id,
  );

  return deletedNotification;
};

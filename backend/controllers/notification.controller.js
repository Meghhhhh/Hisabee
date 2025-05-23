import {
  createNotification as cn,
  updateNotification as un,
  deleteNotification as dn,
  getNotificationsForUser,
} from '../models/notification.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import handleResponse from '../utils/responsehandler.js';

export const getAllNotificationsByUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const notis = await getNotificationsForUser(user_id);
  if (!notis) return handleResponse(res, 404, 'No notifications found');

  return handleResponse(
    res,
    200,
    'Notifications extracted successfully',
    notis,
  );
});

export const createNotification = asyncHandler(async (req, res) => {
  const { title = null, message = null, type = 'other', sendTo } = req.body;
  if (!sendTo || !title || !message)
    return handleResponse(res, 400, 'Missing required fields');
  const { user_id } = req.user;

  const notification = await cn({
    title,
    message,
    type,
    send_user_id: user_id,
    receive_user_id: sendTo,
  });

  return handleResponse(
    res,
    201,
    'Notification sent successfully',
    notification,
  );
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const { notification_id } = req.body;

  await dn(notification_id);
  return handleResponse(res, 201, 'Noti deleted successfully');
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { notification_id } = req.body;

  await un(notification_id);
  return handleResponse(res, 201, 'Marked as read');
});

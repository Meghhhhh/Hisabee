import express from 'express';
import {
  getAllNotificationsByUserId,
  createNotification,
  deleteNotification,
  markAsRead,
} from '../controllers/notification.controller.js';
import auth from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/bodyValidator.js';

const router = express.Router();

router.get('/getAll', auth, getAllNotificationsByUserId);
router.post('/create', validateBody(['sendTo', 'title', 'message']), createNotification);
router.delete('/delete', validateBody(['notification_id']), deleteNotification);
router.patch('/markAsRead', validateBody(['notification_id']), markAsRead);

export default router;

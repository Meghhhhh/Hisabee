import express from 'express';
import {
  deleteUserById,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendOtp,
  updateProfile,
  verifyOtp,
} from '../controllers/user.controller.js';
import { validateBody } from '../middleware/bodyValidator.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/current-user', auth, getCurrentUser);
router.post('/register', validateBody([`email`, `password`]), registerUser);
router.post('/login', validateBody([`email`, `password`]), loginUser);
router.post('/logout', logoutUser);
router.delete('/delete', auth, deleteUserById);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/refresh-access-token', refreshAccessToken);
router.patch('/update-profile', updateProfile);

export default router;

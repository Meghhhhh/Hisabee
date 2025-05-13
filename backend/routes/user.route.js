import express from 'express';
import {
  deleteUserById,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendOtp,
  verifyOtp,
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/current-user', getCurrentUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.delete('/delete', deleteUserById);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/refresh-access-token', refreshAccessToken);

export default router;

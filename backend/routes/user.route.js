import express from 'express';
import {
  deleteUserById,
  getCurrentUser,
  isUserLoggedIn,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendOtp,
  updateProfile,
  verifyOtp,
  addFriend,
  getOutgoingRequests,
  getIncomingRequests,
  acceptRequest,
  rejectRequest,
  requestPasswordReset,
  resetPassword,
} from '../controllers/user.controller.js';
import { validateBody } from '../middleware/bodyValidator.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/current-user', auth, getCurrentUser);
router.post('/register', validateBody([`email`, `password`]), registerUser);
router.post('/login', validateBody([`email`, `password`]), loginUser);
router.post('/logout', auth, logoutUser);
router.delete('/delete', auth, deleteUserById);
router.get('/is-user-loggedin', isUserLoggedIn);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/refresh-access-token', refreshAccessToken);
router.patch('/update-profile', auth, updateProfile);
router.post('/add-friend', auth, addFriend);
router.get('/outgoing-requests', auth, getOutgoingRequests);
router.get('/incoming-requests', auth, getIncomingRequests);
router.post('/accept-request', auth, acceptRequest);
router.post('/reject-request', auth, rejectRequest);
router.post('/request-password-reset', validateBody(['email']), requestPasswordReset);
router.post('/reset-password', validateBody(['email', 'resetToken', 'newPassword']), resetPassword);

export default router;

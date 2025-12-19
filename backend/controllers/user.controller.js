import 'dotenv/config';
import handleResponse from '../utils/responsehandler.js';
import {
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getOneUserByQuery,
  sendFriendRequest,
  getUserIdByEmail,
  getOutgoingFriendRequests,
  getIncomingFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendMessage, { otpHtml, passwordResetHtml } from '../utils/mailHandler.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000,
};

const filterUserProps = user => ({
  user_id: user.user_id,
  email: user.email,
  name: user.name,
  phone_number: user.phone_number,
  payment_reference: user.payment_reference,
  friends: user.friends,
  hisabs: user.hisabs,
});

const generateAccessToken = user => {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      phone_number: user.phone_number,
      refresh_token: user.refresh_token,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

const generateRefreshToken = user => {
  return jwt.sign(
    {
      user_id: user.user_id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

const generateAccessAndRefreshTokens = async userId => {
  const user = await getUserById(userId);
  const refreshToken = generateRefreshToken(user);  
  const newUser = await updateUser(user.user_id, {
    refresh_token: refreshToken,
  });

  const accessToken = generateAccessToken(newUser);

  return { accessToken, refreshToken };
};

export const registerUser = asyncHandler(async (req, res) => {
  // const { error } = registerSchema.validate(req.body);
  // if (error) return handleResponse(res, 400, error.details[0].message);

  const { email, password, firstName = null, lastName = null } = req.body;
  const user = await getOneUserByQuery('email', email);
  if (user) {
    if (user.is_verified)
      return handleResponse(res, 400, 'User already registered!');
    else {
      // case to handle where no otp is verified after regsitrying
      const newOTP = Math.floor(100000 + Math.random() * 900000);
      const expiry = new Date(Date.now() + 5 * 60 * 1000);

      await updateUser(user.user_id, {
        otp_code: newOTP,
        otp_expires_at: expiry,
      });

      await sendMessage(email, 'OTP for Hisabee', otpHtml(newOTP));
      return handleResponse(res, 200, 'OTP resent please verify');
    }
  }

  // if new user then
  const hashedPass = await bcrypt.hash(password, 10);

  // 6 digit otp plus expire in 2min
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  const newUser = await createUser({
    email,
    password: hashedPass,
    name: [firstName, lastName].filter(Boolean).join(' '),
    otp_code: otp,
    otp_expires_at: otpExpiry,
  });

  // send otp
  await sendMessage(email, 'OTP for Hisabee', otpHtml(otp));

  return handleResponse(
    res,
    201,
    'User registered successfully. Please verify the OTP',
    filterUserProps(newUser),
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  // const { error } = registerSchema.validate(req.body);
  // if (error) return handleResponse(res, 400, error.details[0].message);

  const { email, password } = req.body;
  const user = await getOneUserByQuery('email', email);
  if (!user || !user.is_verified)
    return handleResponse(res, 401, 'User not found or unverified.');

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect)
    return handleResponse(res, 400, 'Invalid email or password');

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user.user_id,
  );

  res
    .cookie('refreshToken', refreshToken, cookieOptions)
    .cookie('accessToken', accessToken, cookieOptions)
    .json({
      status: 200,
      success: true,
      message: 'User logged in successfully',
      data: { accessToken, refreshToken },
    });
});

export const logoutUser = asyncHandler(async (req, res) => {
  // console.log('req.user', req.user);
  const token = req.user.refresh_token;
  if (!token) return handleResponse(res, 401, 'No refresh token found');
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  await updateUser(decoded.user_id, { refresh_token: null });

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json({
      status: 200,
      success: true,
      message: 'User logged out successfully',
      data: null,
    });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await getOneUserByQuery('email', email);
  if (!user) return handleResponse(res, 404, 'User not found');

  if (user.is_verified)
    return handleResponse(res, 400, 'User already verified');

  if (
    parseInt(user.otp_code) !== parseInt(otp) ||
    new Date() > new Date(user.otp_expires_at)
  ) {
    return handleResponse(res, 400, 'Invalid or expired OTP');
  }

  const updated = await updateUser(user.user_id, {
    is_verified: true,
    otp_code: null,
    otp_expires_at: null,
  });

  return handleResponse(
    res,
    200,
    'OTP verified successfully',
    filterUserProps(updated),
  );
});

export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await getOneUserByQuery('email', email);

  if (!user) return handleResponse(res, 404, 'User not found');
  if (user.is_verified)
    return handleResponse(res, 400, 'User already verified');

  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await updateUser(user.user_id, {
    otp_code: otp,
    otp_expires_at: otpExpiry,
  });

  await sendMessage(email, 'OTP for Hisabee', otpHtml(otp));

  return handleResponse(res, 200, 'OTP resent successfully');
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return handleResponse(res, 401, 'No refresh token found');

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await getUserById(decoded.user_id);

    if (!user || user.refreshToken !== token) {
      return handleResponse(res, 403, 'Invalid refresh token');
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await updateUser(user.user_id, { refresh_token: newRefreshToken });

    res
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', newRefreshToken, cookieOptions)
      .json({
        status: 200,
        success: true,
        message: 'Token refreshed successfully',
        data: { accessToken },
      });
  } catch (err) {
    return handleResponse(res, 403, 'Refresh token invalid or expired');
  }
});

export const deleteUserById = asyncHandler(async (req, res) => {
  try {
    const { user_id } = req.user;

    const user = await getUserById(user_id);
    if (!user) return handleResponse(res, 404, 'User not found');

    if (user.refreshToken) await updateUser(user_id, { refresh_token: null });
    await deleteUser(user_id);

    res
      .clearCookie('accessToken', cookieOptions)
      .clearCookie('refreshToken', cookieOptions)
      .json({
        status: 200,
        success: true,
        message: 'User Deleted successfully',
        data: null,
      });
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, 'Invalid Inputs');
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const user = await getUserById(user_id);
  if (!user) return handleResponse(res, 404, 'User not found');

  return handleResponse(
    res,
    200,
    'User fetched successfully',
    filterUserProps(user),
  );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const {
    firstName = null,
    lastName = null,
    phone_number,
    payment_reference,
  } = req.body;

  const { user_id } = req.user;

  const user = await getUserById(user_id);
  if (!user) return handleResponse(res, 404, 'User not found');

  const updatedUser = await updateUser(user.user_id, {
    name: [firstName, lastName].filter(Boolean).join(' '),
    phone_number,
    payment_reference,
  });

  return handleResponse(
    res,
    200,
    'User updated successfully',
    filterUserProps(updatedUser),
  );
});

export const isUserLoggedIn = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return handleResponse(res, 401, 'Access token not found');
  }

  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    return handleResponse(res, 200, 'User is logged In');
  } catch (err) {
    return handleResponse(res, 401, 'Unauthorised user');
  }
});

export const addFriend = asyncHandler(async (req, res) => {
  let { friend_id, email } = req.body;
  const { user_id } = req.user;
  if (!friend_id && !email)
    return handleResponse(res, 400, 'Missing friend_id or email');
  if (!friend_id && email) {
    friend_id = await getUserIdByEmail(email);
    if (!friend_id)
      return handleResponse(res, 404, 'No user found with that email');
  }
  try {
    const result = await sendFriendRequest(user_id, friend_id);
    return handleResponse(res, 201, 'Friend request sent', result);
  } catch (err) {
    return handleResponse(res, 400, err.message);
  }
});

export const getOutgoingRequests = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const requests = await getOutgoingFriendRequests(user_id);
  return handleResponse(res, 200, 'Outgoing friend requests fetched', requests);
});

export const getIncomingRequests = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const requests = await getIncomingFriendRequests(user_id);
  return handleResponse(res, 200, 'Incoming friend requests fetched', requests);
});

export const acceptRequest = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const { friend_id } = req.body;
  if (!friend_id) return handleResponse(res, 400, 'Missing friend_id');
  const result = await acceptFriendRequest(user_id, friend_id);
  if (!result)
    return handleResponse(res, 404, 'Request not found or already handled');
  return handleResponse(res, 200, 'Friend request accepted', result);
});

export const rejectRequest = asyncHandler(async (req, res) => {
  const { user_id } = req.user;
  const { friend_id } = req.body;
  if (!friend_id) return handleResponse(res, 400, 'Missing friend_id');
  const result = await rejectFriendRequest(user_id, friend_id);
  if (!result)
    return handleResponse(res, 404, 'Request not found or already handled');
  return handleResponse(res, 200, 'Friend request rejected', result);
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return handleResponse(res, 400, 'Email is required');

  const user = await getOneUserByQuery('email', email);
  if (!user) {
    // Don't reveal if user exists or not for security
    return handleResponse(
      res,
      200,
      'If an account with that email exists, a password reset code has been sent.',
    );
  }

  if (!user.is_verified) {
    return handleResponse(
      res,
      400,
      'Please verify your account first before resetting password.',
    );
  }

  // Generate 6-digit reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000);
  const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Store reset code in otp_code field (we'll use this for password reset)
  await updateUser(user.user_id, {
    otp_code: resetCode.toString(),
    otp_expires_at: resetExpiry,
  });

  // Create reset URL - ensure no double slashes
  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
  const resetUrl = `${frontendUrl}/reset-password?token=${resetCode}&email=${encodeURIComponent(email)}`;

  // Send password reset email
  await sendMessage(
    email,
    'Password Reset Request - Hisabee',
    passwordResetHtml(resetCode, resetUrl),
  );

  return handleResponse(
    res,
    200,
    'If an account with that email exists, a password reset code has been sent.',
  );
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  if (!email || !resetToken || !newPassword) {
    return handleResponse(
      res,
      400,
      'Email, reset token, and new password are required',
    );
  }

  // Validate password strength
  if (newPassword.length < 6) {
    return handleResponse(
      res,
      400,
      'Password must be at least 6 characters long',
    );
  }

  const user = await getOneUserByQuery('email', email);
  if (!user) {
    return handleResponse(res, 404, 'User not found');
  }

  if (!user.is_verified) {
    return handleResponse(
      res,
      400,
      'Please verify your account first before resetting password.',
    );
  }

  // Verify reset token
  if (
    !user.otp_code ||
    user.otp_code !== resetToken.toString() ||
    !user.otp_expires_at ||
    new Date() > new Date(user.otp_expires_at)
  ) {
    return handleResponse(res, 400, 'Invalid or expired reset token');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and clear reset token
  await updateUser(user.user_id, {
    password: hashedPassword,
    otp_code: null,
    otp_expires_at: null,
  });

  return handleResponse(res, 200, 'Password reset successfully');
});

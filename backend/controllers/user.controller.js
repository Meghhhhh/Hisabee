import 'dotenv/config';
import handleResponse from '../utils/responsehandler.js';
import {
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getOneUserByQuery,
  registerSchema,
} from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendMessage, { otpHtml } from '../utils/mailHandler.js';

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
});

const generateAccessToken = user => {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      phone_number: user.phone_number,
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
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await updateUser(user.user_id, {
    refreshToken,
  });

  return { accessToken, refreshToken };
};

export const registerUser = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return handleResponse(res, 400, error.details[0].message);

  const { email, password, firstName, lastName } = req.body;
  const user = await getOneUserByQuery('email', email);
  if (user) {
    if (user.is_verified)
      return handleResponse(res, 400, 'User already registered!');
    else {
      // case to handle where no otp is verified after regsitrying
      const newOTP = Math.floor(100000 + Math.random() * 900000);
      const expiry = new Date(Date.now() + 2 * 60 * 1000);

      await updateUser(user.user_id, {
        otp_code: newOTP,
        otp_expires_at: expiry,
      });

      sendMessage(email, 'OTP for Hisabee', otpHtml(newOTP));
      return handleResponse(res, 200, 'OTP resent please verify');
    }
  }

  // if new user then
  const hashedPass = await bcrypt.hash(password, 10);

  // 6 digit otp plus expire in 2min
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
  const newUser = await createUser({
    email,
    password: hashedPass,
    name: `${firstName} ${lastName}`,
    otp_code: otp,
    otp_expires_at: otpExpiry,
  });

  // send otp
  sendMessage(email, 'OTP for Hisabee', otpHtml(otp));

  return handleResponse(
    res,
    201,
    'User registered successfully. Please verify the OTP',
    filterUserProps(newUser),
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return handleResponse(res, 400, error.details[0].message);
  
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
  const token = req.cookies.refreshToken;
  if (!token) return handleResponse(res, 401, 'No refresh token found');
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  await updateUser(decoded.user_id, { refreshToken: null });

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
  const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);

  await updateUser(user.user_id, {
    otp_code: otp,
    otp_expires_at: otpExpiry,
  });

  sendMessage(email, 'OTP for Hisabee', otpHtml(otp));

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

    await updateUser(user.user_id, { refreshToken: newRefreshToken });

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
  const { user_id } = req.body;

  const user = await getUserById(user_id);
  if (!user) return handleResponse(res, 404, 'User not found');

  await updateUser(user_id, { refreshToken: null });
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
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const { user_id } = req.body;
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
  const { user_id, firstName, lastName, phone_number, payment_reference } =
    req.body;

  const user = await getUserById(user_id);
  if (!user) return handleResponse(res, 404, 'User not found');

  const updatedUser = await updateUser(user.user_id, {
    name: `${firstName} ${lastName}`,
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

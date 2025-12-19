import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../store/slice/loading.js';

export const usePasswordReset = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading.loading);

  const requestPasswordReset = async (email) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post('/api/v1/user/request-password-reset', {
        email,
      }, {
        withCredentials: true,
      });

      if (response.status < 300) {
        toast.success(
          response.data?.message ||
            'If an account with that email exists, a password reset code has been sent.',
          {
            autoClose: 5000,
          }
        );
        return { success: true };
      } else {
        toast.error(response.data?.message || 'Failed to send reset code');
        return { success: false };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Failed to send password reset code. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const resetPassword = async (email, resetToken, newPassword) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post('/api/v1/user/reset-password', {
        email,
        resetToken,
        newPassword,
      });

      if (response.status < 300) {
        toast.success(
          response.data?.message || 'Password reset successfully',
          {
            autoClose: 3000,
          }
        );
        return { success: true };
      } else {
        toast.error(response.data?.message || 'Failed to reset password');
        return { success: false };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Failed to reset password. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { requestPasswordReset, resetPassword, loading };
};

export default usePasswordReset;


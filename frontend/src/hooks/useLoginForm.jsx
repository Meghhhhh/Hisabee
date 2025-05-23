import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '../../store/slice/loading.js';
import { setIsLoggedIn } from '../../store/slice/isLoggedIn.js';

export const useLoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const loading = useSelector(state => state.loading.loading);

  const validate = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    dispatch(setLoading(true));
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/login`,
        { email, password },
        { withCredentials: true },
      );

      if (res.status < 300) {
        toast.success(res.data?.message || 'Login successful', {
          autoClose: 3000,
        });
        dispatch(setIsLoggedIn(true));
        setTimeout(() => navigate('/home'), 3000);
      } else {
        dispatch(setIsLoggedIn(false));
        toast.error('Failed to login');
      }
    } catch (err) {
      dispatch(setIsLoggedIn(false));
      toast.error(err.response?.data?.data?.message || 'Login failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    email,
    password,
    showPassword,
    loading,
    error,
    setEmail,
    setPassword,
    setShowPassword,
    handleSubmit,
  };
};

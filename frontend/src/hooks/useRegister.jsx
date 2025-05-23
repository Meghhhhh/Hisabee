import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '../../store/slice/loading.js';

const useRegisterUser = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading.loading);
  const navigate = useNavigate();

  const register = async formData => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/register`,
        {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
      );

      if (response.status < 300) {
        toast.success('Otp sent to the given email, redirecting...', {
          autoClose: 3000,
        });
        localStorage.setItem('email', response.data?.data?.email);
        setTimeout(() => navigate('/otp'), 3000);
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { register, loading };
};

export default useRegisterUser;

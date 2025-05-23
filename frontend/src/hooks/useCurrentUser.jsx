import { useEffect } from 'react';
import { setLoading } from '../../store/slice/loading.js';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../../store/slice/userSlice.js';

export const useCurrentUser = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading.loading);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    dispatch(setLoading(true));
    const getCurrUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/user/current-user`,
          {
            withCredentials: true,
          },
        );

        if (response.status < 300) {
          dispatch(setUserData(response?.data?.data));
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    getCurrUser();
  }, [dispatch]);

  return { loading, isLoggedIn };
};

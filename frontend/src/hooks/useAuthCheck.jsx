import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setIsLoggedIn } from '../../store/slice/isLoggedIn.js';

const useAuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`/api/v1/user/is-user-loggedin`, {
          withCredentials: true,
        });

        dispatch(setIsLoggedIn(res.status === 200));
      } catch (error) {
        console.log(error);
        dispatch(setIsLoggedIn(false));
      }
    };

    checkAuth();
  }, [dispatch]);
};

export default useAuthCheck;

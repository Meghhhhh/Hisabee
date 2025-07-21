import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const user = useSelector(state => state.user);
  // console.log(user);

  if (isLoggedIn === null) {
    return `Loading...`;
  }

  if (!user.user_id) {
    return <Navigate to="/home" replace />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/signup" replace />;
};

export default ProtectedRoute;

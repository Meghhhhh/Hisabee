import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  if (isLoggedIn === null) {
    return `Loading...`;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/signup" replace />;
};

export default ProtectedRoute;

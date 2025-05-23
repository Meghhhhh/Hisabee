import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
  //todo:
  const isAuthenticated = useSelector(state => state.auth.isLoggedIn)

  return isAuthenticated ? <Outlet /> : <Navigate to="/signup" replace />;
};

export default ProtectedRoute;

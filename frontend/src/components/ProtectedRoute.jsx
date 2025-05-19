import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  //todo:
  const isAuthenticated = !!localStorage.getItem('access_token');

  return isAuthenticated ? <Outlet /> : <Navigate to="/signup" replace />;
};

export default ProtectedRoute;

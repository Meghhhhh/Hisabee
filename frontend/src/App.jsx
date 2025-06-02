
import React from 'react';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import Register from './pages/Register';
import Notifications from './pages/Notifications';
import OTP from './pages/OTP';
import useAuthCheck from './hooks/useAuthCheck';

import { RouterProvider, createBrowserRouter } from 'react-router';
import { Route, createRoutesFromElements } from 'react-router';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from '../src/components/ProtectedRoute';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  useAuthCheck();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </>,
    ),
  );

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer theme="dark" />
    </>
  );
};

export default App;

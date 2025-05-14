import React from 'react';

import Home from './pages/Home';
import { RouterProvider, createBrowserRouter } from 'react-router';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import Register from './pages/Register';
import Notifications from './pages/Notifications';
import OTP from './pages/OTP';


const App = () => {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/home",
      element: <Home />
    },
    {
      path: "/profile",
      element: <Profile />
    },
    {
      path: "/SignUp",
      element: <SignUp />
    },
    {
      path: "/Register",
      element: <Register />
    },
    {
      path: "/Notifications",
      element: <Notifications />
    },
    {
      path: "/OTP",
      element: <OTP />
    }
    
  ]);
  

  return <RouterProvider router={router} />;
};

export default App;

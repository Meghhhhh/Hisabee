import React from 'react';

import Home from './pages/Home';
import { RouterProvider, createBrowserRouter } from 'react-router';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';


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
    }
    
  ]);
  

  return <RouterProvider router={router} />;
};

export default App;

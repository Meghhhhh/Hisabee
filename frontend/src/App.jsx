import React from 'react';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import { RouterProvider, createBrowserRouter } from 'react-router';
import Profile from './pages/Profile';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />,
    },
    {
      path: "/home",
      element: <Home />
    },
    {
      path: "/profile",
      element: <Profile />
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;

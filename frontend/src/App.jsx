import React from 'react';
import LandingPage from './pages/LandingPage';
import { RouterProvider, createBrowserRouter } from 'react-router';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;

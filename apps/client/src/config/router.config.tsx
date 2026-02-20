import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage/LandingPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import ProtectedRoute from '../components/auth/ProtectedRoute/ProtectedRoute';
import LoginPage from '../pages/LoginPage/LoginPage';
import HomePage from '../pages/HomePage/HomePage';

export const router = createBrowserRouter([
  {
    path: '/landing-page',
    element: <LandingPage></LandingPage>,
  },
  {
    path: '/register',
    element: <RegisterPage></RegisterPage>,
  },
  {
    path: '/login',
    element: <LoginPage></LoginPage>,
  },
  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <HomePage></HomePage>,
      },
    ],
  },
  {
    path: '*',
    element: '',
  },
]);

import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage/LandingPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import ProtectedRoute from '../components/auth/ProtectedRoute/ProtectedRoute';
import LoginPage from '../pages/LoginPage/LoginPage';
import HomePage from '../pages/HomePage/HomePage';
import HabitPage from '../pages/HabitPage/HabitPage';
import GoalPage from '../pages/GoalPage/GoalPage';
import GlobalErrorFallback from '../components/layouts/GlobalFallbackError/GlobalFallbackError';

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <GlobalErrorFallback />,
    children: [
      {
        path: '/landing-page',
        element: <LandingPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  // Protected routes
  {
    element: <ProtectedRoute />,
    errorElement: <GlobalErrorFallback />,
    children: [
      {
        path: '/app',
        element: <HomePage />,
      },
      {
        path: '/app/habits/:habitId',
        element: <HabitPage />,
      },
      {
        path: '/app/goals/:goalId',
        element: <GoalPage />,
      },
    ],
  },
  {
    path: '*',
    element: '',
  },
]);

import { createBrowserRouter, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute/ProtectedRoute';
import GlobalErrorFallback from '../components/layouts/GlobalFallbackError/GlobalFallbackError';

const LandingPage = lazy(() => import('../pages/LandingPage/LandingPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage/RegisterPage'));
const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const HomePage = lazy(() => import('../pages/HomePage/HomePage'));
const HabitPage = lazy(() => import('../pages/HabitPage/HabitPage'));
const GoalPage = lazy(() => import('../pages/GoalPage/GoalPage'));
const ProgressLogsPage = lazy(
  () => import('../pages/ProgressLogsPage/ProgressLogsPage'),
);
const CategoriesPage = lazy(
  () => import('../pages/CategoriesPage/CategoriesPage'),
);

export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<div></div>}>
        <Outlet />
      </Suspense>
    ),
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
    element: (
      <Suspense>
        <ProtectedRoute />
      </Suspense>
    ),
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
      {
        path: '/app/goals/:goalId/logs',
        element: <ProgressLogsPage />,
      },
      {
        path: '/app/categories',
        element: <CategoriesPage />,
      },
    ],
  },
  // Not Found Page
  {
    path: '*',
    element: '',
  },
]);

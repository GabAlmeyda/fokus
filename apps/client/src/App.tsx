import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute/ProtectedRoute';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import { useUserStore } from './config/zustand.config';
import { useEffect } from 'react';

const router = createBrowserRouter([
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
        path: '/',
        element: <HomePage></HomePage>,
      },
    ],
  },
  {
    path: '*',
    element: '',  
  },
]);

function App() {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    document.body.classList.toggle('dark', user?.themeMode === 'dark');
  }, [user]);

  return <RouterProvider router={router} />;
}

export default App;

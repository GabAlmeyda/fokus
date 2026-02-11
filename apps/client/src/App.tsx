import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute/ProtectedRoute';
import LoginPage from './pages/LoginPage/LoginPage';

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
    element: <ProtectedRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage></LoginPage>
      }
    ]
  },
  {
    path: '*',
    element: '',
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

import { useEffect, type JSX } from 'react';
import api from '../../../config/api.config';
import { useUserStore } from '../../../config/zustand.config';
import { APP_URLS } from '../../../helpers/app.helpers';
import { Outlet, useNavigate } from 'react-router-dom';

export default function ProtectedRoute(): JSX.Element {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  // Updates the user info storaged in the 'UserStore'
  useEffect(() => {
    async function revalidate() {
      try {
        const response = await api.get('/users/me');
        setUser(response.data);
      } catch (err) {
        clearUser();
        navigate(APP_URLS.login);
      }
    }
    revalidate();
  }, []);

  return <Outlet />
}

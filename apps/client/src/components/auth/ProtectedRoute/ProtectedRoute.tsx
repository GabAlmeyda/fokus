import { useEffect, type JSX } from 'react';
import api from '../../../config/api.config';
import { useUserStore } from '../../../config/zustand.config';
import { APP_URLS } from '../../../helpers/app.helpers';
import { Outlet, useNavigate } from 'react-router-dom';
import type { UserResponseDTO } from '@fokus/shared';

export default function ProtectedRoute(): JSX.Element {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  // Updates the user info storaged in the 'UserStore'

  useEffect(() => {
    async function revalidate() {
      try {
        const response = await api.get<UserResponseDTO>('/users/me');
        setUser({
          name: response.data.name,
          email: response.data.email,
          themeMode: response.data.themeMode,
        });
      } catch (err) {
        clearUser();
        navigate(APP_URLS.login);
      }
    }
    revalidate();
  }, []);

  return <Outlet />;
}

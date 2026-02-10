import { API_URL, HTTPStatusCode } from '@fokus/shared';
import axios from 'axios';
import { useUserStore } from './zustand.config';
import { APP_URLS } from '../helpers/app.helpers';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (success) => success,
  async (err) => {
    const clearUser = useUserStore((state) => state.clearUser);
    const originalRequest = err.config;

    if (
      err.response?.status === HTTPStatusCode.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${API_URL}/users/auth/refresh/me`,
          {},
          { withCredentials: true },
        );

        return api.post(originalRequest);
      } catch (refreshErr) {
        clearUser();
        window.location.href = APP_URLS.login;
      }
    }

    return Promise.reject(err);
  },
);

export default api;

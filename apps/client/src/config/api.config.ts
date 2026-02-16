import { API_URL, HTTPStatusCode } from '@fokus/shared';
import axios from 'axios';
import { APP_URLS } from '../helpers/app.helpers';
import { queryClient } from '../providers/ReactQueryProvider';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

api.interceptors.response.use(
  (success) => success,
  async (err) => {
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

        return api(originalRequest);
      } catch (refreshErr) {
        queryClient.invalidateQueries({ queryKey: ['user'] });
        if (window.location.href !== APP_URLS.login) {
          window.location.href = APP_URLS.login;
        }
      }
    }

    const errResponse = err.response?.data
      ? {
          statusCode: err.response?.status,
          body: err.response?.data,
        }
      : err;
    return Promise.reject(errResponse);
  },
);

api.interceptors.request.use((config) => {
  const cookies = document.cookie.split(';');
  for (const c of cookies) {
    const [name, value] = c.trim().split('=');
    if (name === 'XSRF-TOKEN') {
      config.headers['X-XSRF-Token'] = value;
      break;
    }
  }

  return config;
});

export default api;

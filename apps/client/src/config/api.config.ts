import { HTTPStatusCode } from '@fokus/shared';
import axios from 'axios';
import { APP_URLS } from '../helpers/app.helpers';
import { queryClient } from '../providers/ReactQueryProvider';
import { env } from './env.config';

const api = axios.create({
  baseURL: env.BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  xsrfHeaderName: 'X-XSRF-Token',
  xsrfCookieName: 'xsrf_token',
});

api.interceptors.request.use((config) => {
  const xsrfToken = sessionStorage.getItem('xsrf-token');
  if (xsrfToken) {
    config.headers['X-XSRF-Token'] = xsrfToken;
  }

  return config;
});

api.interceptors.response.use(
  (success) => success,
  async (err) => {
    const originalRequest = err.config;
    if (originalRequest.url === `${env.BACKEND_URL}/users/auth/refresh/me`) {
      return Promise.reject(err);
    }

    if (
      err.response?.status === HTTPStatusCode.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await api.post(
          `${env.BACKEND_URL}/users/auth/refresh/me`,
          {},
          { withCredentials: true },
        );

        return api(originalRequest);
      } catch (authErr: any) {
        queryClient.clear();
        const refreshErr = authErr.response?.data
          ? {
              statusCode: authErr.response?.status,
              body: authErr.response?.data,
            }
          : authErr;

        if (window.location.href.includes(`/app`)) {
          window.location.href = APP_URLS.login;
        }
        return Promise.reject(refreshErr);
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

export default api;

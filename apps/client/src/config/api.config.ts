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
  xsrfCookieName: 'xsrf_token',
  xsrfHeaderName: 'X-XSRF-Token',
});

api.interceptors.request.use((config) => {
  const matches = document.cookie.match(/xsrf_token=([^;]+)/);
  console.log(document.cookie);
  console.log(matches);
  if (matches && matches[1]) {
    config.headers['X-XSRF-Token'] = decodeURIComponent(matches[1]);
  }

  return config;
});

api.interceptors.response.use(
  (success) => success,
  async (err) => {
    const originalRequest = err.config;
    if (originalRequest.url === `${API_URL}/users/auth/refresh/me`) {
      return Promise.reject(err);
    }

    if (
      err.response?.status === HTTPStatusCode.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await api.post(
          `${API_URL}/users/auth/refresh/me`,
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

api.interceptors.request.use((config) => {
  const cookies = document.cookie.split(';');
  console.log('COOKIES: ', cookies);
  for (const c of cookies) {
    const [name, value] = c.trim().split('=');
    if (name === 'xsrf_token') {
      config.headers['X-XSRF-Token'] = value;
      break;
    }
  }

  return config;
});

export default api;
